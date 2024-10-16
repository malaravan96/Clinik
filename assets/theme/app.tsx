import React, { useState } from 'react';
import { Provider as PaperProvider, Dialog, Button, IconButton, Portal, Text } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { theme } from '.'; // Adjust the import if necessary

const App = () => {
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(currentTheme.colors.primary || '#6200ee'); // Default primary color if not set

  // Function to handle changing the primary color
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setCurrentTheme({
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        primary: color,
      },
    });
    setDialogVisible(false); // Close dialog after selection
  };

  return (
    <PaperProvider theme={currentTheme}>
      <View style={styles.container}>
        {/* Display current primary color */}
        <View style={[styles.colorDisplay, { backgroundColor: selectedColor }]}>
          <Text style={styles.colorText}>Current Primary Color</Text>
        </View>

        <IconButton icon="palette" size={30} onPress={() => setDialogVisible(true)} />

        {/* Portal for the Dialog */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Select Primary Color</Dialog.Title>
            <Dialog.Content>
              <View style={styles.colorOptions}>
                <Button
                  mode="contained"
                  color="#7cbedf"
                  onPress={() => handleColorChange('#7cbedf')}
                >Blue</Button>
                <Button
                  mode="contained"
                  color="#03dac6"
                  onPress={() => handleColorChange('#03dac6')}
                >Teal</Button>
                <Button
                  mode="contained"
                  color="#4caf50"
                  onPress={() => handleColorChange('#4caf50')}
                >Green</Button>
                <Button
                  mode="contained"
                  color="#ff9800"
                  onPress={() => handleColorChange('#ff9800')}
                >Orange</Button>
                <Button
                  mode="contained"
                  color="#f44336"
                  onPress={() => handleColorChange('#f44336')}
                >Red</Button>
              </View>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorDisplay: {
    width: '80%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
    elevation: 4, // Add shadow effect
  },
  colorText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default App;
