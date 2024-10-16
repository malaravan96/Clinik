// explore.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import axios from 'axios';
import { useWindowDimensions } from 'react-native';
import CustomDay from './CustomDay'; // Adjust the path if necessary
import { DayComponentProps, Dot } from './types';

type Appointment = {
  appointmentId: string;
  providerId: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  weekDay: string;
  status: string;
  reasonForVisit: string;
};

const samsungTheme = {
  backgroundColor: '#FFFFFF',
  calendarBackground: '#FFFFFF',
  textSectionTitleColor: '#B6C1CD',
  textSectionTitleDisabledColor: '#d9e1e8',
  selectedDayBackgroundColor: '#2196F3',
  selectedDayTextColor: '#FFFFFF',
  todayTextColor: '#FF3D00',
  dayTextColor: '#2d4150',
  textDisabledColor: '#d9e1e8',
  dotColor: '#00B0FF',
  selectedDotColor: '#FFFFFF',
  arrowColor: '#00B0FF',
  disabledArrowColor: '#d9e1e8',
  monthTextColor: '#2d4150',
  indicatorColor: '#00B0FF',
  textDayFontFamily: 'Helvetica',
  textMonthFontFamily: 'Helvetica-Bold',
  textDayHeaderFontFamily: 'Helvetica',
  textDayFontWeight: '300',
  textMonthFontWeight: 'bold',
  textDayHeaderFontWeight: '300',
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 14,
};

const Explore: React.FC = () => {
  const [appointments, setAppointments] = useState<
    Record<string, { marked: boolean; dots: Dot[] }>
  >({});
  const [appointmentData, setAppointmentData] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get<Appointment[]>(
          'https://pyskedev.azurewebsites.net/api/ProvidersAppointment/GetAllProvidersAppointments'
        );
        const markedAppointments: Record<string, { marked: boolean; dots: Dot[] }> = {};

        response.data.forEach((appointment: Appointment) => {
          if (!markedAppointments[appointment.appointmentDate]) {
            markedAppointments[appointment.appointmentDate] = { marked: true, dots: [] };
          }
          markedAppointments[appointment.appointmentDate].dots.push({
            key: appointment.appointmentId,
            color: '#00B0FF',
          });
        });

        setAppointments(markedAppointments);
        setAppointmentData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setErrorMessage('Failed to load appointments.');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDayPress = useCallback(
    (day: DateData) => {
      const appointmentDate = day.dateString;
      const selected = appointmentData.find(
        (appointment: Appointment) => appointment.appointmentDate === appointmentDate
      );

      if (selected) {
        setSelectedAppointment(selected);
        setModalVisible(true);
      }
    },
    [appointmentData]
  );

  return (
    <View style={[styles.container, { width: width - 20 }]}>
      {loading ? (
        <ActivityIndicator size="large" color="#00B0FF" />
      ) : errorMessage ? (
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      ) : (
        <Calendar
          markedDates={appointments}
          onDayPress={handleDayPress}
          markingType={'multi-dot'}
          theme={samsungTheme}
          dayComponent={({ date, state, marking, onPress }: DayComponentProps) => (
            <CustomDay date={date} state={state} marking={marking} onPress={onPress} />
          )}
          style={styles.calendar}
        />
      )}

      {selectedAppointment && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Appointment Details</Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Appointment ID: </Text>
                {selectedAppointment.appointmentId}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Provider ID: </Text>
                {selectedAppointment.providerId}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Patient ID: </Text>
                {selectedAppointment.patientId}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Appointment Date: </Text>
                {selectedAppointment.appointmentDate}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Appointment Time: </Text>
                {selectedAppointment.appointmentTime}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Weekday: </Text>
                {selectedAppointment.weekDay}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Status: </Text>
                {selectedAppointment.status}
              </Text>
              <Text style={styles.modalDetail}>
                <Text style={styles.modalLabel}>Reason for Visit: </Text>
                {selectedAppointment.reasonForVisit}
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
                accessibilityLabel="Close Appointment Details"
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    backgroundColor: '#FFFFFF',
  },
  calendar: {
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 35,
    width: '80%',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    color: '#2d4150',
  },
  modalDetail: {
    marginBottom: 5,
    color: '#2d4150',
    fontSize: 14,
  },
  modalLabel: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
    width: '100%',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
