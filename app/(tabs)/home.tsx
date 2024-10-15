import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router'; // Use useRouter instead of useNavigation

const HomePage = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter(); // Get the router object

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
            onPress={
              item.title === 'Doctors'
                ? () => router.push('/doctor') // Use router.push to navigate
                : undefined
            }
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
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    paddingLeft: 20,
    marginBottom: 15,
    fontSize: 16,
    color: '#4ebaff',
  },
  emergencyCard: {
    backgroundColor: '#4ebaff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});

export default HomePage;
