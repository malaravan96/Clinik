import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';

const HomePage = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const screenHeight = Dimensions.get('window').height;
  const headerHeight = screenHeight * 0.15;

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
      
      {/* Emergency Card with icon and title aligned to the left */}
      <Card style={styles.emergencyCard}>
        <View style={styles.emergencyCardContent}>
          <View style={styles.iconWrapperEmergency}>
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
          onPress={() => router.push('/voice/doctor')}
        >
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: '#e91e63' }]}>
                <IconButton icon="doctor" size={30} />
              </View>
              <Text style={styles.title}>Doctors</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Clinics Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: '#68bc00' }]}>
                <IconButton icon="hospital-building" size={30} />
              </View>
              <Text style={styles.title}>Clinics</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Specialities Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: '#ff9800' }]}>
                <IconButton icon="medical-bag" size={30} />
              </View>
              <Text style={styles.title}>Specialities</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Labs Card */}
        <TouchableOpacity style={styles.menuItem}
          onPress={() => router.push('/voice/chatbot')}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: '#9c27b0' }]}>
                <IconButton icon="flask" size={30} />
              </View>
              <Text style={styles.title}> Ai Assistant </Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Insurance Card */}
        <TouchableOpacity style={styles.menuItem}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: '#f78da7' }]}>
                <IconButton icon="shield-check" size={30} />
              </View>
              <Text style={styles.title}>Insurance</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Related Articles Card */}
        <TouchableOpacity style={styles.menuItem}
         onPress={() => router.push('/voice/explore')}>
          <Card style={styles.menuCard}>
            <View style={styles.cardContent}>
              <View style={[styles.iconWrapper, { backgroundColor: '#607d8b' }]}>
                <IconButton icon="book-open-page-variant" size={30} />
              </View>
              <Text style={styles.title}>Appoinment</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#4ebaff',
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  heading: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBar: {
    height: 40,
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#FFF',
    paddingLeft: 15,
    fontSize: 16,
    color: '#4ebaff',
  },
  gap: {
    height: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    marginBottom: 15,
    
  },
  menuCard: {
    borderRadius: 10,
    backgroundColor: '#4ebaff',
    height: 80,
    justifyContent: 'flex-start',
    padding: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 5,
  },
  emergencyCard: {
    backgroundColor: '#4ebaff',
    borderRadius: 10,
    height: 80,
    justifyContent: 'flex-start', // Align content to the start
    padding: 10,
    marginTop: 20,
  },
  emergencyCardContent: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center items vertically
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  iconWrapperEmergency: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default HomePage;
