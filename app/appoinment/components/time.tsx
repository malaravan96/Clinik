import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface DatePickerComponentProps {
  onDateTimeSelected: (date: Date, fromTime: string, toTime: string, duration: string) => void;
  providerId: string;
}

const ProviderDateComponent = ({ onDateTimeSelected, providerId }: DatePickerComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<{ fromTime: string; toTime: string }>({ fromTime: '', toTime: '' });
  const [schedules, setSchedules] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);

  const convertToHHMM = (time: string) => {
    const parts = time.split(':');
    let hours = parseInt(parts[0]);
    let minutes = parseInt(parts[1]);

    if (isNaN(hours)) hours = 0;
    if (isNaN(minutes)) minutes = 0;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const isWeekdaySelectable = (date: Dayjs) => {
    const day = date.day();
    return weekDays.includes(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]);
  };

  const generateTimeSlots = (fromTime: string, toTime: string) => {
    const timeSlotsArray: string[] = [];
    let current = dayjs(fromTime, 'HH:mm A');
    let end = dayjs(toTime, 'HH:mm A');

    if (end.isBefore(current)) {
      end = end.add(12, 'hours');
    }

    while (current.isBefore(end)) {
      timeSlotsArray.push(current.format('hh:mm A'));
      current = current.add(15, 'minute');
    }

    setTimeSlots(timeSlotsArray);
  };

  const handleDateSelect = (dateString: string) => {
    const date = dayjs(dateString);
    setSelectedDate(date);

    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.day()];
    const schedule = schedules.find(item => item.weekDay === day);

    if (schedule) {
      setTimeRange({ fromTime: schedule.fromTime, toTime: schedule.toTime });
      generateTimeSlots(schedule.fromTime, schedule.toTime);
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    if (
      appointments.some(
        appointment =>
          appointment.appointmentTime === timeSlot && dayjs(appointment.appointmentDate).isSame(selectedDate, 'day')
      )
    ) {
      return;
    }

    setSelectedTimeSlot(timeSlot);

    const [time, modifier] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    const selectedDateTime = selectedDate
      ?.hour(modifier === 'PM' ? (parseInt(hours) % 12) + 12 : parseInt(hours))
      .minute(parseInt(minutes));

    if (selectedDateTime) {
      const dateTimeFormatted = selectedDateTime.format('YYYY-MM-DD HH:mm');
      console.log(`Selected Date and Time: ${dateTimeFormatted}`);

      onDateTimeSelected(selectedDateTime.toDate(), timeRange.fromTime, timeRange.toTime, timeSlot);
    }
  };

  useEffect(() => {
    if (providerId) {
      fetch(`https://pyskedev.azurewebsites.net/api/ProvidersWorkSchedule/GetWorkScheduleByProviderId/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            const weekDays = data.map(item => item.weekDay);
            setWeekDays(weekDays);
            setSchedules(data);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

      fetch(`https://pyskedev.azurewebsites.net/api/ProvidersWorkSchedule/GetWorkScheduleByProviderId/${providerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setAppointments(data);
          }
        })
        .catch(error => {
          console.error('Error fetching appointments:', error);
        });
    }
  }, [providerId]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date:</Text>
      <Calendar
        onDayPress={(day: { dateString: string; }) => handleDateSelect(day.dateString)}
        markedDates={{
          [selectedDate?.format('YYYY-MM-DD') || '']: { selected: true, marked: true, selectedColor: '#4caf50' },
        }}
        theme={{
          selectedDayBackgroundColor: '#4caf50',
          todayTextColor: '#4caf50',
        }}
      />
      {timeRange.fromTime && timeRange.toTime && (
        <Text style={styles.timeRange}>
          Selected Time Range: {timeRange.fromTime} - {timeRange.toTime}
        </Text>
      )}
      {timeSlots.length > 0 && (
        <ScrollView horizontal style={styles.timeSlotContainer}>
          {timeSlots.map((slot, index) => {
            const isBooked = appointments.some(
              appointment =>
                appointment.appointmentTime === slot && dayjs(appointment.appointmentDate).isSame(selectedDate, 'day')
            );

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlotButton,
                  selectedTimeSlot === slot ? styles.selected : isBooked ? styles.booked : styles.available,
                ]}
                onPress={() => handleTimeSlotSelect(slot)}
                disabled={isBooked}
              >
                <Text style={styles.timeSlotText}>{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  timeRange: {
    fontSize: 16,
    marginVertical: 10,
  },
  timeSlotContainer: {
    marginTop: 20,
  },
  timeSlotButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  available: {
    backgroundColor: '#f0f0f0',
  },
  selected: {
    backgroundColor: '#4caf50',
  },
  booked: {
    backgroundColor: '#f44336',
  },
  timeSlotText: {
    color: '#fff',
  },
});

export default ProviderDateComponent;
