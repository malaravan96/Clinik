// ** React Native Imports
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

// import Dashboard from '../dashboards/patient/analytics/index';
import { Card, Button } from "react-native-paper"; // If you're using react-native-paper for styling
import SignInButton from "../access/signinbutton";
import msalInstance from "../access/msalxonfig";

const HomePage = () => {
  return (
    <View style={styles.container}>
      <AuthenticatedTemplate>{/* <Dashboard /> */}</AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <View style={styles.cardContainer}>
          <Card style={styles.card}>
            <Card.Title title="Sign in to access your data" />
            <Card.Content>
              <Text style={styles.welcomeText}>Welcome to Nightingale</Text>
              <Text style={styles.instructionsText}>
                If you are new to Nightingale, Signup to continue
              </Text>
              <MsalProvider instance={msalInstance}>
                <SignInButton />
              </MsalProvider>
            </Card.Content>
          </Card>
        </View>
      </UnauthenticatedTemplate>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  card: {
    width: "100%",
    padding: 16,
  },
  welcomeText: {
    marginBottom: 8,
    fontSize: 16,
  },
  instructionsText: {
    marginBottom: 16,
    fontSize: 14,
  },
});

export default HomePage;
