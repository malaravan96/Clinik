import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router'; // Use useRouter instead of useNavigation

const HomePage = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter(); // Get the router object

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  // Get the screen height to calculate 15% of it
  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.15; // 15% of screen height

  return (
    <View style={styles.container}>
      {/* 15% height background with heading and search bar */}
      <View style={[styles.header, { height: headerHeight }]}>
        <Text style={styles.heading}>Home Page</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Doctors, Clinics..."
        />
      </View>
      
      <Card style={styles.emergencyCard}>
        <View style={styles.cardContent}>
          <View style={styles.iconWrapper}>
            <IconButton icon="alert" size={30} />
          </View>
          <View>
            <Text style={styles.title}>Emergency</Text>
            <Text style={styles.description}>Short Description</Text>
          </View>
        </View>
      </Card>
      <View style={styles.gap} />
      {/* Cards displayed in 2 per row */}
      <View style={styles.cardContainer}>
        {/* Doctors Card */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/doctor')} // Navigate to doctors
        >
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <IconButton icon="doctor" size={30} />
              <Text style={styles.title}>Doctors</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Clinics Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <IconButton icon="hospital-building" size={30} />
              <Text style={styles.title}>Clinics</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Specialities Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <IconButton icon="medical-bag" size={30} />
              <Text style={styles.title}>Specialities</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Labs Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <IconButton icon="flask" size={30} />
              <Text style={styles.title}>Labs</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Insurance Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <IconButton icon="shield-check" size={30} />
              <Text style={styles.title}>Insurance</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Related Articles Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <IconButton icon="book-open-page-variant" size={30} />
              <Text style={styles.title}>Related Articles</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Emergency Card at the end */}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 10,
  },
  header: {
    backgroundColor: '#4ebaff', // Color for the 15% background
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10, // Gap between heading and search bar
  },
  searchBar: {
    height: 40,
    width: '100%', // Full width search bar
    borderRadius: 20,
    backgroundColor: '#FFF',
    paddingLeft: 15,
    fontSize: 16,
    color: '#4ebaff',
  },
  gap: {
    height: 20, // Gap between header and cards
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow cards to wrap into rows
    justifyContent: 'space-between', // Spread out cards evenly
  },
  menuItem: {
    width: '48%', // Take up 48% of the width to fit 2 cards in a row
    marginBottom: 15,
  },
  menuCard: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    height: 120, // Square-shaped card
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  emergencyCard: {
    backgroundColor: '#4ebaff', // Background color for emergency card
    borderRadius: 10,
    height: 80, // Same height for consistency
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    marginTop: 20, // Add margin on top for spacing
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0', // Light grey square background
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Rounded corners for the square
  },
});

export default HomePage;
