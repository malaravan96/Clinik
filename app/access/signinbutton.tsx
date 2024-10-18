// SignInButton.js
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useMsal } from '@azure/msal-react';

export default function SignInButton() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect();
  };

  return (
    <View style={styles.container}>
      <Button title="Sign In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20, // Add some margin or other styling as needed
  },
});
