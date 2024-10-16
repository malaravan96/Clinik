import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const userId = 'aaa'; // Replace with actual userId
  const azureRegion = 'eastus'; // Replace with your Azure region
  const language = 'en-US'; // Set the desired language

  // Function to get token
  async function getToken(userId: string): Promise<string | null> {
    try {
      const response = await fetch(
        `https://careappsstg.azurewebsites.net/api/voice/GetUserToken?userId=${userId}`
      );
      const json = await response.json();
      return json.Token;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }

  // Function to start recording
async function startRecording() {
    try {
      console.log('Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const newRecording = new Audio.Recording();
  
        // Option 1: Use the corrected preset reference
        await newRecording.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
  
        // Option 2: Use custom recording options
        /*
        const recordingOptions: Audio.RecordingOptions = {
          android: {
            extension: '.wav',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.wav',
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
            sampleRate: 16000,
            numberOfChannels: 1,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
          },
        };
  
        await newRecording.prepareToRecordAsync(recordingOptions);
        */
  
        await newRecording.startAsync();
        setRecording(newRecording);
        setIsRecording(true);
        console.log('Recording started');
      } else {
        console.log('Permission to access microphone denied');
      }
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }
  

  // Function to stop recording
  async function stopRecording() {
    try {
      console.log('Stopping recording...');
      setIsRecording(false);
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        console.log('Recording stopped and stored at', uri);

        if (uri) {
          // Get the audio blob
          const audioBlob = await getAudioBlob(uri);

          // Get the token
          const token = await getToken(userId);

          if (token) {
            // Send audio to speech service
            const result = await sendAudioToSpeechService(audioBlob, token);

            // Update transcription state
            if (result && result.DisplayText) {
              setTranscription(result.DisplayText);
            } else {
              setTranscription('Transcription failed or no speech detected.');
            }
          } else {
            console.error('Failed to obtain token');
          }
        } else {
          console.error('Recording URI is null');
        }
      } else {
        console.error('Recording is null');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  }

  // Function to get audio data as a blob
  async function getAudioBlob(uri: string): Promise<Blob> {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }

  // Function to send audio to Azure Speech Service
  async function sendAudioToSpeechService(
    audioBlob: Blob,
    token: string
  ): Promise<any> {
    const endpoint = `https://${azureRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Ocp-Apim-Subscription-Key': token,
          'Accept': 'application/json',
        },
        body: audioBlob,
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending audio data:', error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Voice Transcription</Text>
      <TouchableOpacity
        style={isRecording ? styles.buttonStop : styles.buttonRecord}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionTitle}>Transcription:</Text>
        <Text style={styles.transcriptionText}>{transcription}</Text>
      </View>
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
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonRecord: {
    backgroundColor: '#1e90ff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonStop: {
    backgroundColor: '#ff4c4c',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  transcriptionContainer: {
    marginTop: 40,
  },
  transcriptionTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#333',
  },
});
