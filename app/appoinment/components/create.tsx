import React, { Fragment, useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Modal, Platform } from 'react-native';
import { UserContext, useUser } from '../../access/userContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createAppoinment } from '../services/appoinment-api';

export const CreateAppointment = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPractitionerId, setSelectedPractitionerId] = useState<string | null>(null);
  const [Appointment, setAppointment] = useState({
    appointmentId: '',
    practitionerId: '',
    patientId: '',
    appointmentDate: new Date(),
    appointmentTime: '',
    status: 'Scheduled',
    reasonForVisit: '',
    createdAt: null,
    updatedAt: null
  });

  const { user } = useUser();

  const handleChange = (name: string, value: string | Date | null) => {
    setAppointment({
      ...Appointment,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const updatedAppointment = {
        ...Appointment,
        practitionerId: selectedPractitionerId || '',
      };

      await createAppoinment(updatedAppointment);

      // Clear form fields after successful submission
      setAppointment({
        appointmentId: '',
        practitionerId: '',
        patientId: '',
        appointmentDate: new Date(),
        appointmentTime: '',
        status: 'Scheduled',
        reasonForVisit: '',
        createdAt: null,
        updatedAt: null
      });

      setOpen(false);
      setCurrentStep(1); // Reset to the first step
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    if (user.selectedpatientId) {
      setAppointment(prevAppointment => ({
        ...prevAppointment,
        patientId: user.selectedpatientId || ''
      }));
    }
  }, [user.selectedpatientId]);

  return (
    <Fragment>
      <Button title="Add Appointment" onPress={() => setOpen(true)} />
      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Appointment</Text>
          
          {/* Stepper */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Step {currentStep} of 3</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ flex: 1, textAlign: 'center' }}>1. Patient & Practitioner</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>2. Appointment Details</Text>
              <Text style={{ flex: 1, textAlign: 'center' }}>3. Review & Submit</Text>
            </View>
          </View>

          {/* Step 1: Select Patient and Practitioner */}
          {currentStep === 1 && (
            <View>
            <Text>Status</Text>
            <Picker
              selectedValue={Appointment.status}
              onValueChange={(itemValue) => handleChange('status', itemValue)}
            >
              <Picker.Item label="Scheduled" value="Scheduled" />
              <Picker.Item label="Completed" value="Completed" />
              <Picker.Item label="Cancelled" value="Cancelled" />
              <Picker.Item label="In Progress" value="In Progress" />
            </Picker>

            <TextInput
              placeholder="Reason For Visit"
              value={Appointment.reasonForVisit}
              onChangeText={(value) => handleChange('reasonForVisit', value)}
              multiline
              numberOfLines={3}
              style={{ marginBottom: 15, borderWidth: 1, padding: 10 }}
            />

            <Text>Appointment Date</Text>
            {Platform.OS === 'ios' || Platform.OS === 'android' ? (
              <DateTimePicker
                value={Appointment.appointmentDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleChange('appointmentDate', selectedDate || new Date())}
              />
            ) : (
              <TextInput
                value={Appointment.appointmentDate.toISOString().split('T')[0]}
                editable={false}
                style={{ marginBottom: 15, borderWidth: 1, padding: 10 }}
              />
            )}

            <Text>Appointment Time</Text>
            <TextInput
              placeholder="Time"
              value={Appointment.appointmentTime}
              onChangeText={(value) => handleChange('appointmentTime', value)}
              style={{ marginBottom: 15, borderWidth: 1, padding: 10 }}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            
              <Button title="Next" onPress={() => setCurrentStep(2)} />
            </View>
          </View>
          )}

          {/* Step 2: Set Appointment Details */}
          {currentStep === 2 && (
            <View>
             

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button title="Back" onPress={() => setCurrentStep(1)} />
                <Button title="Next" onPress={() => setCurrentStep(3)} />
              </View>
            </View>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <View>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button title="Back" onPress={() => setCurrentStep(2)} />
                <Button title="Submit" onPress={handleSubmit} />
              </View>
            </View>
          )}
        </View>
      </Modal>
    </Fragment>
  );
};

export default CreateAppointment;
