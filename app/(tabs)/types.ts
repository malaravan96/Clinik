// types.ts

import { DateData } from 'react-native-calendars';

export interface Dot {
  key: string;
  color: string;
}

export interface MarkingProps {
  selected?: boolean;
  marked?: boolean;
  dots?: Dot[];
  disabled?: boolean;
  disableTouchEvent?: boolean;
}

export interface CustomDayProps {
  date: DateData;
  state: 'disabled' | 'today' | 'selected' | '';
  marking?: MarkingProps;
  onPress?: (date: DateData) => void;
}

export interface DayComponentProps {
  date: DateData;
  state: 'disabled' | 'today' | 'selected' | '';
  marking?: MarkingProps;
  onPress?: (date: DateData) => void;
}
