// theme.ts
import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7cbedf',  // Example primary color (purple)
    secondary: '#03dac6',
    error: '#f44336',
    success: '#4caf50',
    warnig: '#ff9800',
    info: '#2196f3',
  },
};
