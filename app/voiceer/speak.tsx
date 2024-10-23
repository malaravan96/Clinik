import React, { useState } from 'react';
import { View, StyleSheet, Button, TextInput } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [text, setText] = useState('');

  const speak = () => {
    if (text.trim()) {
      Speech.speak(text);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type or paste text here"
        value={text}
        onChangeText={setText}
        multiline
      />
      <Button title="Press to hear the text" onPress={speak} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});
