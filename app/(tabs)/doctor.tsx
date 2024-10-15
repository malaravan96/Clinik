import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';

// Define the type for a doctor
interface Doctor {
  providerId: string;
  name: string;
  gender: string;
  qualification: string;
  experienceYears: number;
  contactPhone: string;
}

const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) {
    Alert.alert('Error', error);
    return null; // Return null or a placeholder if there's an error
  }

  // Update the renderDoctor function with an explicit type for item
  const renderDoctor = ({ item }: { item: Doctor }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Gender: {item.gender}</Text>
        <Text>Qualification: {item.qualification}</Text>
        <Text>Experience: {item.experienceYears} years</Text>
        <Text>Contact: {item.contactPhone}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={doctors.slice(0, 5)} // Display only the first 5 doctors
      renderItem={renderDoctor}
      keyExtractor={(item) => item.providerId}
      contentContainerStyle={styles.container}
    />
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DoctorList;
