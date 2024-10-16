import React, { useState } from 'react';
import { Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Dialog, Portal, Button, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReviewList from './review';

interface Doctor {
  providerId: string;
  name: string;
  qualification: string;
  experienceYears: number;
  averageRating: number;
  contactPhone: string;
  ratingCount: number;
}

interface DoctorDetailsDialogProps {
  visible: boolean;
  hideDialog: () => void;
  doctor: Doctor | null;
  imageSource: any;
}

const DoctorDetailsDialog: React.FC<DoctorDetailsDialogProps> = ({
  visible,
  hideDialog,
  doctor,
  imageSource,
}) => {
  const [ratingDialogVisible, setRatingDialogVisible] = useState(false);

  const openRatingDialog = () => setRatingDialogVisible(true);
  const closeRatingDialog = () => setRatingDialogVisible(false);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Doctor Details</Dialog.Title>
        <Dialog.Content>
          {doctor ? (
            <>
              <View style={styles.centeredContent}>
                <Image source={imageSource} style={styles.avatar} />
                <Text style={styles.doctorName}>{doctor.name}</Text>
              </View>

              <View style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                  <IconButton icon="message" size={25} onPress={() => {}} />
                </View>
                <View style={styles.iconBackground}>
                  <IconButton icon="phone" size={25} onPress={() => {}} />
                </View>
                <View style={styles.iconBackground}>
                  <IconButton icon="share" size={25} onPress={() => {}} />
                </View>
                <View style={styles.iconBackground}>
                  <IconButton icon="menu" size={25} onPress={() => {}} />
                </View>
              </View>

              <View style={styles.infoBoxContainer}>
                <TouchableOpacity style={styles.infoBox} onPress={openRatingDialog}>
                  <Icon name="pen" size={20} color="#000" />
                  <Text style={styles.infoText}>{doctor.ratingCount}</Text>
                </TouchableOpacity>
                <View style={styles.infoBox}>
                  <Icon name="briefcase" size={20} color="#000" />
                  <Text style={styles.infoText}>{doctor.experienceYears} years</Text>
                </View>
                <View style={styles.infoBox}>
                  <Icon name="star" size={20} color="#000" />
                  <Text style={styles.infoText}>{doctor.averageRating} rating</Text>
                </View>
              </View>

              <Text style={styles.dialogText}>Contact: {doctor.contactPhone}</Text>
            </>
          ) : (
            <Text>No doctor selected</Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Close</Button>
        </Dialog.Actions>
      </Dialog>

      {/* Rating dialog with reviews */}
      <Dialog visible={ratingDialogVisible} onDismiss={closeRatingDialog}>
        <Dialog.Title>Doctor Reviews</Dialog.Title>
        <Dialog.Content>
          {doctor ? <ReviewList providerId={doctor.providerId} /> : <Text>No doctor selected.</Text>}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={closeRatingDialog}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialogText: {
    marginBottom: 5,
    textAlign: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  iconBackground: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  infoBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  infoBox: {
    width: 90,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 5,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default DoctorDetailsDialog;
