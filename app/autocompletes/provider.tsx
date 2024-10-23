import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Define the type for a healthcare provider object
interface HealthcareProvider {
  providerId: string; // Adjust to 'number' if needed
  name: string;
}

interface HealthcareProviderAutocompleteProps {
  onSelectProvider: (providerId: string) => void; // Adjust type if providerId is a number
}

const HealthcareProviderAutocomplete: React.FC<HealthcareProviderAutocompleteProps> = ({ onSelectProvider }) => {
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [query, setQuery] = useState<string>(''); 
  const [filteredProviders, setFilteredProviders] = useState<HealthcareProvider[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  // Fetch healthcare providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('https://pyskedev.azurewebsites.net/api/HealthcareProviders/GetAllHealthcareProviders');
        const data: HealthcareProvider[] = await response.json();
        setProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);

  // Filter providers based on user input
  useEffect(() => {
    if (query.trim() !== '') {
      const filtered = providers.filter(provider =>
        provider.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProviders(filtered);
    } else {
      setFilteredProviders(providers); // Show all providers if query is empty
    }
  }, [query, providers]);

  // Function to handle input focus
  const handleInputFocus = () => {
    setDropdownVisible(true); // Show dropdown when input is focused
    setFilteredProviders(providers); // Show all providers in the dropdown
  };

  const handleSelectProvider = (provider: HealthcareProvider) => {
    setQuery(provider.name);
    setDropdownVisible(false);
    onSelectProvider(provider.providerId); 
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        onFocus={handleInputFocus} // Show dropdown on focus
        placeholder="Search provider by name"
        style={styles.input}
      />
      {dropdownVisible && filteredProviders.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredProviders}
            keyExtractor={(item) => item.providerId}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectProvider(item)}
                style={styles.dropdownItem}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 45, // Adjust based on input height
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    maxHeight: 150, // Set a max height for the dropdown
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default HealthcareProviderAutocomplete;
