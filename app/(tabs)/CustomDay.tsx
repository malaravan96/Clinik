// CustomDay.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { CustomDayProps, Dot } from './types'; // Adjust the path if necessary

const CustomDay: React.FC<CustomDayProps> = ({ date, state, marking, onPress }) => {
  const isSelected = marking?.selected;
  const isToday = date.dateString === new Date().toISOString().split('T')[0];

  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        isSelected && styles.selectedDayContainer,
        isToday && styles.todayContainer,
      ]}
      onPress={() => onPress && onPress(date)}
      accessible={true}
      accessibilityLabel={`${
        isToday ? 'Today, ' : ''
      }${date.day}, ${date.month}/${date.year}`}
    >
      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
        {date.day}
      </Text>
      {marking?.dots && marking.dots.length > 0 && (
        <View style={styles.dotContainer}>
          {marking.dots.map((dot: Dot) => (
            <View key={dot.key} style={[styles.dot, { backgroundColor: dot.color }]} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 10,
  },
  selectedDayContainer: {
    backgroundColor: '#2196F3',
  },
  todayContainer: {
    borderWidth: 1,
    borderColor: '#FF3D00',
    borderRadius: 10,
  },
  dayText: {
    color: '#2d4150',
    fontSize: 16,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});

export default CustomDay;
