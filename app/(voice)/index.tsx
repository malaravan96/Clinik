import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AudioRecorderPlayer, {
  AudioSet,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';

const BASE_API_URL = 'https://pyskedev.azurewebsites.net/api'; // Replace with your actual base API URL

const getAssemblyAIToken = async () => {
  try {
    const API_ENDPOINT = `${BASE_API_URL}/voice`;
    const response = await axios.get(`${API_ENDPOINT}/GetUserToken?userId=test`);
    return response.data['Token'];
  } catch (error) {
    console.error('Error fetching AssemblyAI token:', error);
    return null;
  }
};

function VoiceTranscriber() {
  const [token, setToken] = useState<string | null>(null);
  const socket = useRef<WebSocket | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  useEffect(() => {
    const fetchToken = async () => {
      const assemblyToken = await getAssemblyAIToken();
      if (assemblyToken) {
        setToken(assemblyToken);
      }
    };
    fetchToken();
  }, []);

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      // Request permissions on Android
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        if (
          granted['android.permission.RECORD_AUDIO'] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    if (!token) {
      console.error('No token found');
      return;
    }

    // Create a new WebSocket connection for real-time transcription
    socket.current = new WebSocket(
      `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
    );

    const texts: { [key: number]: string } = {};

    socket.current.onmessage = (voicePrompt: WebSocketMessageEvent) => {
      let msg = '';
      const res = JSON.parse(voicePrompt.data);
      texts[res.audio_start] = res.text;
      const keys = Object.keys(texts).map(Number);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`;
        }
      }
      setTranscript(msg);
    };

    socket.current.onerror = (event: Event) => {
      console.error('WebSocket error occurred:', event);
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };

    socket.current.onclose = (event: WebSocketCloseEvent) => {
      console.log('WebSocket closed:', event);
      socket.current = null;
    };

    socket.current.onopen = async () => {
      console.log('WebSocket opened');
      setIsRecording(true);

      const audioSet: AudioSet = {
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSamplingRateAndroid: 16000,
        AudioEncodingBitRateAndroid: 128000,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      };

      // Start recording
      await audioRecorderPlayer.startRecorder(
        undefined,
        audioSet,
        // { includeBase64: true } // RecorderOptions
      );

      audioRecorderPlayer.addRecordBackListener((e: any) => {
        // e.currentPosition holds the current position
        // e.base64 holds the base64 encoded audio data chunk

        if (socket.current && e && e.currentPosition > 0 && e.base64) {
          socket.current.send(JSON.stringify({ audio_data: e.base64 }));
        }
      });
    };
  };

  const onStopRecord = async () => {
    setIsRecording(false);

    if (socket.current) {
      socket.current.send(JSON.stringify({ terminate_session: true }));
      socket.current.close();
      socket.current = null;
    }

    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Medical Transcription</Text>
      <Text style={styles.subtitle}>Try Clinik's new real-time transcription endpoint!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={isRecording ? onStopRecord : onStartRecord}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={clearTranscript}>
        <Text style={styles.buttonText}>Clear Transcript</Text>
      </TouchableOpacity>

      <ScrollView style={styles.transcriptContainer}>
        <Text style={styles.transcriptText}>{transcript || 'Your transcript will appear here.'}</Text>
      </ScrollView>
    </View>
  );
}

export default VoiceTranscriber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  transcriptContainer: {
    flex: 1,
    width: '100%',
    marginTop: 16,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
  },
});
