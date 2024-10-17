import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // For social media icons

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your authentication logic here
    router.push('/home'); // Replace '/home' with the path to your target page
  };

  // const handleSignUp = () => {
  //   // Navigate to SignUp page
  //   router.push('/signup'); // Replace '/signup' with your signup route
  // };

  return (
    <View style={styles.container}>
      {/* Hello Screen */}
      <View style={styles.welcomeContainer}>
        <Image source={require('../../assets/images/profile/21.png')} style={styles.illustration} />
        <Text style={styles.welcomeText}>Hello</Text>
        <Text style={styles.subText}>Welcome To Clinik</Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Social Media Icons */}
        <View style={styles.socialMediaContainer}>
          <FontAwesome name="facebook" size={30} color="#3b5998" />
          <FontAwesome name="google" size={30} color="#db4437" />
          <FontAwesome name="linkedin" size={30} color="#0077b5" />
        </View>
      </View>

      {/* Login Screen */}
      {/* <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Background color for the whole screen
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderColor: '#6c63ff',
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginTop: 15,
  },
  signUpButtonText: {
    color: '#6c63ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '60%',
  },
  loginContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#6c63ff',
    fontSize: 14,
  },
});
