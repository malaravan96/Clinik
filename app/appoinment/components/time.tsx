import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

interface Schedule {
  scheduleId: string;
  providerId: string;
  fromDate: string;
  toDate: string;
  fromTime: string;
  toTime: string;
  weekDay: string;
  location: string;
  status: string;
  name: string | null;
}

interface DatePickerComponentProps {
  onDateTimeSelected: (date: Date, fromTime: string, toTime: string, duration: string) => void;
  providerId: string;
}

const ProviderDateComponent = ({ onDateTimeSelected, providerId }: DatePickerComponentProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<{ fromTime: string; toTime: string }>({ fromTime: '', toTime: '' });
  const [schedules, setSchedules] = useState<Schedule[]>([]);
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

  const generateTimeSlots = (fromTime: string, toTime: string) => {
    const timeSlotsArray: string[] = [];
    let current = dayjs(fromTime, 'hh:mm A');
    let end = dayjs(toTime, 'hh:mm A');

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

  // Create a markedDates object to show available dates on the calendar
  const markedDates = schedules.reduce((acc, schedule) => {
    const fromDate = dayjs(schedule.fromDate);
    const toDate = dayjs(schedule.toDate);
    for (let date = fromDate; date.isBefore(toDate.add(1, 'day')); date = date.add(1, 'day')) {
      acc[date.format('YYYY-MM-DD')] = { marked: true, dotColor: 'blue' }; // Customize as needed
    }
    return acc;
  }, {} as { [key: string]: { marked: boolean; dotColor?: string } });

  // Mark all dates not within the range of schedules as not selectable
  Object.keys(markedDates).forEach(date => {
    const dayDate = dayjs(date);
    const isAvailable = schedules.some(schedule => {
      const fromDate = dayjs(schedule.fromDate);
      const toDate = dayjs(schedule.toDate);
      return dayDate.isBetween(fromDate, toDate, null, '[]'); // Inclusive range
    });
    
    // If the date is not available, just do not add it to markedDates.
    if (!isAvailable) {
      delete markedDates[date]; // Remove if not available
    }
  });

  const handleTimeSlotSelect = (slot: string) => {
    if (selectedTimeSlot === slot) {
      // Deselect if already selected
      setSelectedTimeSlot(null);
    } else {
      // Set selected time slot
      setSelectedTimeSlot(slot);
      // Call the onDateTimeSelected function with necessary parameters
      if (selectedDate) {
        const appointmentDateTime = dayjs(selectedDate).format('YYYY-MM-DD') + ' ' + slot;
        const duration = '15 mins'; // Adjust this according to your requirement
        onDateTimeSelected(new Date(appointmentDateTime), timeRange.fromTime, timeRange.toTime, duration);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date:</Text>
      <Calendar
        onDayPress={(day: { dateString: string; }) => handleDateSelect(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate?.format('YYYY-MM-DD') || '']: { selected: true, marked: true, dotColor: 'blue' },
        }}
      />
      <Text style={styles.label}>Select Time Slot:</Text>
      <ScrollView horizontal>
        {timeSlots.map(slot => (
          <TouchableOpacity
            key={slot}
            onPress={() => handleTimeSlotSelect(slot)}
            style={[styles.timeSlot, selectedTimeSlot === slot && styles.selectedTimeSlot]}
          >
            <Text>{slot}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  timeSlot: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  selectedTimeSlot: {
    backgroundColor: 'lightblue',
  },
});

export default ProviderDateComponent;
