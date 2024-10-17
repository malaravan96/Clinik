import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Define Android Constants
const ANDROID_OUTPUT_FORMAT_LINEAR_PCM = 3; // MediaRecorder.OutputFormat.LINEAR_PCM
const ANDROID_AUDIO_ENCODER_PCM_16BIT = 3;  // MediaRecorder.AudioEncoder.PCM_16BIT

// Define iOS Constants
const IOS_AUDIO_QUALITY_HIGH = 2; // AVAudioQuality.high

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Define custom recording options with numerical constants
  const recordingOptions: Audio.RecordingOptions = {
    android: {
      extension: '.wav',
      outputFormat: ANDROID_OUTPUT_FORMAT_LINEAR_PCM,
      audioEncoder: ANDROID_AUDIO_ENCODER_PCM_16BIT,
      sampleRate: 44100,
      numberOfChannels: 1, // Changed to 1 for compatibility
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: IOS_AUDIO_QUALITY_HIGH,
      sampleRate: 44100,
      numberOfChannels: 1, // Changed to 1 for compatibility
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/wav', // Removed 'extension' as it's not supported
    },
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Audio recording permission is required.');
        return;
      }

      console.log('Starting recording...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Use Audio.Recording.createAsync to start recording
      const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);

      setRecording(newRecording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Recording Error', 'An error occurred while starting the recording.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) {
        Alert.alert('No Recording', 'There is no recording to stop.');
        return;
      }

      console.log('Stopping recording...');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped and stored at', uri);
      setRecording(null);

      if (uri) {
        await processRecording(uri);
      } else {
        Alert.alert('Recording Error', 'Recording URI is unavailable.');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      Alert.alert('Recording Error', 'An error occurred while stopping the recording.');
    }
  };

  const processRecording = async (uri: string) => {
    try {
      setIsTranscribing(true);
      // Read the audio file as base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await sendAudioToServer(base64Audio);
    } catch (err) {
      console.error('Error processing recording', err);
      Alert.alert('Processing Error', 'An error occurred while processing the recording.');
      setIsTranscribing(false);
    }
  };

  const sendAudioToServer = async (base64Audio: string) => {
    try {
      const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio: {
            content: base64Audio,
          },
          config: {
            encoding: 'LINEAR16',         // Ensure this matches your recording settings
            sampleRateHertz: 44100,       // Ensure this matches your recording settings
            languageCode: 'en-US',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Transcription:', data);
      if (
        data.results &&
        data.results[0] &&
        data.results[0].alternatives &&
        data.results[0].alternatives[0].transcript
      ) {
        setTranscription(data.results[0].alternatives[0].transcript);
      } else {
        setTranscription('No transcription available.');
      }
    } catch (error) {
      console.error('Error sending audio to server:', error);
      Alert.alert('Transcription Error', 'An error occurred during transcription.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {isTranscribing && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Transcribing...</Text>
        </View>
      )}
      <Text style={styles.transcriptionLabel}>Transcription:</Text>
      <Text style={styles.transcriptionText}>{transcription}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  transcriptionLabel: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  transcriptionText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  loading: {
    marginTop: 20,
    alignItems: 'center',
  },
});
