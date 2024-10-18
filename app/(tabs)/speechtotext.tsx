import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import Voice, { SpeechResultsEvent } from '@react-native-voice/voice';

const SpeechToText = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const onSpeechStart = () => {
    setIsListening(true);
    console.log('Speech recognition started');
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    console.log('Speech recognition ended');
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    // Check if result.value is defined and has at least one element
    if (event.value && event.value.length > 0) {
      setText(event.value[0]); // Update the TextInput with the recognized text
    }
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error(error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    }
  };

  // Add listeners when component mounts
  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;

    // Cleanup function to remove listeners
    return () => {
      Voice.destroy().then(() => {
        Voice.removeAllListeners();
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Speech to Text</Text>
      <TextInput
        style={styles.textInput}
        value={text}
        placeholder="Your speech will appear here"
        editable={false} // Make the TextInput non-editable
      />
      <View style={styles.buttons}>
        <Button
          title={isListening ? "Listening..." : "Start Listening"}
          onPress={startListening}
          disabled={isListening}
        />
        <Button
          title="Stop Listening"
          onPress={stopListening}
          disabled={!isListening}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9', // Optional: Add a background color for better visibility
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default SpeechToText;
