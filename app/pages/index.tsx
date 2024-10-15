import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card, IconButton, Dialog, Portal } from 'react-native-paper';

const HomePage = () => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search Doctors, Clinics..."
      />

      {/* Emergency Section */}
      <Card style={styles.emergencyCard}>
        <View style={styles.cardContent}>
          <IconButton icon="alert" size={30} />
          <View>
            <Text style={styles.title}>Emergency</Text>
            <Text style={styles.description}>Short Description</Text>
          </View>
        </View>
      </Card>

      {/* Menu Options */}
      <ScrollView contentContainerStyle={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.menuItem}
            onPress={item.title === 'Doctors' ? showDialog : undefined}
          >
            <Card style={styles.cardContent}>
              <IconButton icon={item.icon} size={30} />
              <View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>Short Description</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dialog */}
    
    </View>
  );
};

// Menu items data
const menuItems = [
  { title: 'Doctors', icon: 'doctor' },
  { title: 'Clinics', icon: 'hospital-building' },
  { title: 'Specialities', icon: 'medical-bag' },
  { title: 'Labs', icon: 'flask' },
  { title: 'Insurance', icon: 'shield-check' },
  { title: 'Related Articles', icon: 'book-open-page-variant' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 10,
  },
  dialog: {
    height: 'auto',
    maxHeight: 500,
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogTitle: {
    flex: 1,
  },
  scrollContent: {
    maxHeight: 400,
    
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    paddingLeft: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#4ebaff'
  },
  emergencyCard: {
    backgroundColor: '#4ebaff', // Add the background color for the emergency card
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ebaff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    // Add the background color for the menu items
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});


export default HomePage;
