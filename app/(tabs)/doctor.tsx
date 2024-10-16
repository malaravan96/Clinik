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
import { Card, Provider } from 'react-native-paper';
import DoctorDetailsDialog from '../doctor/componets/page';
import { theme } from '@/assets/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  bio: string;
  workingHours: string;
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
    setSelectedImage(doctor.gender === 'M' ? MaleImg : FemaleImg); // Set image based on gender value 'M' and 'F'
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
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Icon
                key={i}
                name={i <= rating ? 'star' : 'star-o'}
                size={18}
                color="#FFD700" // Gold color for stars
            />
        );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
};
  const renderDoctor = ({ item }: { item: Doctor }) => (
    <Card style={styles.card} onPress={() => showDialog(item)}> {/* Card is now clickable */}
      <Card.Content style={styles.cardContent}> {/* Use a row layout */}
        {/* Square background for image */}
        <View style={styles.avatarContainer}>
          <Image source={item.gender === 'M' ? MaleImg : FemaleImg} style={styles.avatar} />
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.name}>{item.name}</Text>
        
          <Text>{item.experienceYears} Years Experience</Text>
          <Text>Qualification: {item.qualification}</Text>
          <Text>Gender: {item.gender === 'M' ? 'Male' : 'Female'}</Text>
          <Text>Contact: {item.contactPhone}</Text>
          <Text>{renderStars(Math.round(item.averageRating))} ({item.ratingCount} reviews)</Text>
        </View>
       
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
  cardContent: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Align vertically centered
  },
  starsContainer: {
    flexDirection: 'row',
    marginLeft: 5,
},
  avatarContainer: {
    width: 75,
    height: 75,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
},
avatar: {
    width: 65,
    height: 65,
    borderRadius: 22.5,
    marginBottom: 5,
},
  doctorInfo: {
    flex: 1, // Take up remaining space
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default DoctorList;
