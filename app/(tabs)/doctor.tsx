import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card, IconButton, Provider } from 'react-native-paper';
import DoctorDetailsDialog from '../doctor/componets/page';

// Define the type for a doctor
interface Doctor {
  providerId: string;
  name: string;
  qualification: string;
  experienceYears: number;
  averageRating: number;
  ratingCount: number;
  contactPhone: string;
  gender: string;
  isActive: boolean;
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null); // State for image source

  const MaleImg = require('../../assets/images/profile/1.png');
  const FemaleImg = require('../../assets/images/profile/5.png');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          'https://pyskedev.azurewebsites.net/api/HealthcareProviders/GetAllHealthcareProviders'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const showDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    // Set the image based on gender
    setSelectedImage(doctor.gender === 'Male' ? MaleImg : FemaleImg);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedDoctor(null);
    setSelectedImage(null); // Reset image
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) {
    Alert.alert('Error', error);
    return null; // Return null or a placeholder if there's an error
  }

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Image source={item.gender === 'Male' ? MaleImg : FemaleImg} style={styles.avatar} />
        <Text style={styles.name}>{item.name}</Text>
        
        {/* Doctor Information */}
        <Text>Gender: {item.gender}</Text>
        <Text>Qualification: {item.qualification}</Text>
        <Text>Experience: {item.experienceYears} years</Text>
        <Text>Contact: {item.contactPhone}</Text>
        <IconButton icon="eye" size={16} onPress={() => showDialog(item)} /> {/* Show dialog */}
      </Card.Content>
    </Card>
  );

  return (
    <Provider> {/* Wrap your component in Provider */}
      <View>
        <FlatList
          data={doctors.slice(0, 5)} // Display only the first 5 doctors
          renderItem={renderDoctor}
          keyExtractor={(item) => item.providerId}
          contentContainerStyle={styles.container}
        />

        {/* Pass selected doctor data and image source to the dialog */}
        <DoctorDetailsDialog
          visible={visible}
          hideDialog={hideDialog}
          doctor={selectedDoctor} // Pass the selected doctor
          imageSource={selectedImage} // Pass the selected image
        />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 22.5,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DoctorList;
