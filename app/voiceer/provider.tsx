import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, ScrollView, StyleSheet } from 'react-native';

const CreateHealthcareProviderForm = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    providerId: '',
    userId: '',
    name: '',
    gender: '',
    dateOfBirth: '',
    qualification: '',
    experienceYears: '',
    bio: '',
    profileImageUrl: '',
    languagesSpoken: '',
    servicesOffered: '',
    workingHours: '',
    insuranceAccepted: '',
    affiliations: '',
    verificationId: '',
    averageRating: '',
    ratingCount: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    isActive: true,
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://pyskedev.azurewebsites.net/api/HealthcareProviders/CreateHealthcareProvider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Healthcare provider created successfully!');
      } else {
        alert('Failed to create healthcare provider.');
      }
    } catch (error) {
      console.error(error);
      alert('Error occurred while creating healthcare provider.');
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button title="Add Healthcare Provider" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.header}>Create Healthcare Provider</Text>

            {/* Form Fields */}
            <TextInput
              style={styles.input}
              placeholder="Provider ID"
              value={formData.providerId}
              onChangeText={(text) => handleInputChange('providerId', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="User ID"
              keyboardType="numeric"
              value={formData.userId}
              onChangeText={(text) => handleInputChange('userId', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={formData.gender}
              onChangeText={(text) => handleInputChange('gender', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD)"
              value={formData.dateOfBirth}
              onChangeText={(text) => handleInputChange('dateOfBirth', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Qualification"
              value={formData.qualification}
              onChangeText={(text) => handleInputChange('qualification', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Experience Years"
              keyboardType="numeric"
              value={formData.experienceYears}
              onChangeText={(text) => handleInputChange('experienceYears', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Bio"
              value={formData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Profile Image URL"
              value={formData.profileImageUrl}
              onChangeText={(text) => handleInputChange('profileImageUrl', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Languages Spoken"
              value={formData.languagesSpoken}
              onChangeText={(text) => handleInputChange('languagesSpoken', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Services Offered"
              value={formData.servicesOffered}
              onChangeText={(text) => handleInputChange('servicesOffered', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Working Hours"
              value={formData.workingHours}
              onChangeText={(text) => handleInputChange('workingHours', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Insurance Accepted"
              value={formData.insuranceAccepted}
              onChangeText={(text) => handleInputChange('insuranceAccepted', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Affiliations"
              value={formData.affiliations}
              onChangeText={(text) => handleInputChange('affiliations', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Verification ID"
              keyboardType="numeric"
              value={formData.verificationId}
              onChangeText={(text) => handleInputChange('verificationId', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Average Rating"
              keyboardType="numeric"
              value={formData.averageRating}
              onChangeText={(text) => handleInputChange('averageRating', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating Count"
              keyboardType="numeric"
              value={formData.ratingCount}
              onChangeText={(text) => handleInputChange('ratingCount', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChangeText={(text) => handleInputChange('contactEmail', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Phone"
              value={formData.contactPhone}
              onChangeText={(text) => handleInputChange('contactPhone', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => handleInputChange('city', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={formData.state}
              onChangeText={(text) => handleInputChange('state', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={formData.postalCode}
              onChangeText={(text) => handleInputChange('postalCode', text)}
            />
            <Text style={styles.label}>Is Active:</Text>
            <Button
              title={formData.isActive ? "Active" : "Inactive"}
              onPress={() => handleInputChange('isActive', !formData.isActive)}
            />

            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Close" color="red" onPress={() => setModalVisible(false)} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default CreateHealthcareProviderForm;
