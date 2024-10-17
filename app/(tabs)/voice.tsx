import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';

export default function App() {
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);

  useEffect(() => {
    // Set up voice recognition event handlers
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;

    // Clean up the event listeners when the component unmounts
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: SpeechStartEvent) => {
    console.log('Speech recognition started:', e);
  };

  const onSpeechEnd = (e: SpeechEndEvent) => {
    console.log('Speech recognition ended:', e);
    setIsListening(false);
  };

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('Speech recognition results:', e);
    const text = e.value && e.value[0] ? e.value[0] : '';
    setRecognizedText(text);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US'); // You can change the language code as needed
      setIsListening(true);
    } catch (e) {
      console.error('Error starting speech recognition:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping speech recognition:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />
      <Text style={styles.text}>Recognized Text: {recognizedText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center horizontally
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});
