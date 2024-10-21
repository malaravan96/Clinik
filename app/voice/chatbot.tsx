import React, { useState } from 'react';
import { View, TextInput, Alert, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from 'axios';
import * as Speech from 'expo-speech';  // Import expo-speech

// Define the Message type
type Message = {
  timeStamp: string;
  body: string;
  isRequest: boolean;
};

const DiagnosticRequestPage = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    if (inputValue.trim() === '') {
      Alert.alert('Input Required', 'Please enter a value before submitting.');
      return;
    }

    const userMessage: Message = {
      timeStamp: new Date().toISOString(),
      body: inputValue,
      isRequest: true,
    };
    setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);

    setInputValue('');

    try {
      const response = await axios.post(
        'https://careappsstg.azurewebsites.net/api/diagnostics/GetResponse',
        [userMessage],
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseMessage: Message = {
        timeStamp: response.data.timeStamp,
        body: response.data.body,
        isRequest: false,
      };

      // Add the response message to the state
      setMessages((prevMessages: Message[]) => [...prevMessages, responseMessage]);

      // Use expo-speech to read the response aloud
      Speech.speak(responseMessage.body, {
        language: 'en', // You can change this to other languages if needed
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to submit the request.');
      console.error(error);
    }
  };

  const handleClear = () => {
    setInputValue(''); // Clear input field
    setMessages([]);   // Clear all messages
  };

  const chatImg = require('../../assets/images/profile/11.png');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>

      {/* Profile image, name, and clear button in the same row */}
      <View style={styles.profileContainer}>
        <Image source={chatImg} style={styles.chatImg} />
        <Text style={styles.nameText}>Hailey</Text>
        <IconButton
          icon="broom"
          size={24}
          onPress={handleClear}
        />
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.isRequest ? styles.userMessage : styles.responseMessage,
            ]}
          >
            <Text>{message.body}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input field and submit button in the same row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter your message"
          value={inputValue}
          onChangeText={setInputValue}
        />
        <IconButton
          icon="send"
          size={30}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'transparent',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  chatImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10, // Space between the image and name
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Pushes the name to the left
  },
  chatContainer: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: '#bfe5fd',
    borderRadius: 10,
    padding: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#d1f0ff',
    alignSelf: 'flex-end',
  },
  responseMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
});

export default DiagnosticRequestPage;
