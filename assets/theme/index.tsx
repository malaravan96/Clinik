// ThemePage.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Provider, Text, IconButton } from 'react-native-paper';

const colors = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#800080' },
];

const ThemePage = ({  }) => {
  const [visible, setVisible] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<string>('#6200EE'); // Default primary color
  const [secondaryColor, setSecondaryColor] = useState<string>('#03DAC6'); // Default secondary color

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const selectColor = (color: string) => { // Explicitly defining the parameter type
    setPrimaryColor(color);
    hideDialog();
  };

  return (
    <Provider>
      <View style={[styles.container, { backgroundColor: primaryColor }]}>
        <Text style={{ color: secondaryColor }}>Primary Color: {primaryColor}</Text>
        <Text style={{ color: secondaryColor }}>Secondary Color: {secondaryColor}</Text>
        
        <IconButton
          icon="palette"
          size={30}
          onPress={showDialog}
          style={{ backgroundColor: secondaryColor }} // Use style prop for color
        />

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Select a Color</Dialog.Title>
            <Dialog.Content>
              {colors.map((color) => (
                <Button
                  key={color.name}
                  mode="text"
                  onPress={() => selectColor(color.value)}
                >
                  {color.name}
                </Button>
              ))}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemePage;
