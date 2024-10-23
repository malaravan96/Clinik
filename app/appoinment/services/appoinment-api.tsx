import axios from 'axios';
import { Appointment, AppoinmentApiResponse } from '../components/types';
import Toast from 'react-native-toast-message';
import { SearchRequestBody } from '@/app/types/search';

const API_ENDPOINT = `https://pyskedev.azurewebsites.net/api/ProvidersAppointment`;

export const searchAppoinment = async (searchData: SearchRequestBody): Promise<AppoinmentApiResponse> => {
  const response = await axios.post(`${API_ENDPOINT}/SearchAppoinment`, searchData, {
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const createAppoinment = async (createData: Appointment): Promise<any> => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/CreateProvidersAppointment`, createData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });

    if (response.status === 200) {
      Toast.show({ type: 'success', text1: 'Created Appointment Successfully!' });
    } else {
      const responseData = await response.data;
      Toast.show({ type: 'error', text1: 'Error submitting data', text2: responseData.message });
    }
  } catch (err: any) { // Explicitly typing 'err' as 'any'
    Toast.show({ type: 'error', text1: 'There was a problem submitting the data', text2: err.message });
  }
};

export const updateAppointment = async (updateData: Appointment) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/UpdateAppointment`, updateData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    });

    if (response.status === 200) {
      Toast.show({ type: 'success', text1: 'Updated Appointment Successfully!' });
    } else {
      const responseData = await response.data;
      Toast.show({ type: 'error', text1: 'Error submitting data', text2: responseData.message });
    }
  } catch (err: any) { // Explicitly typing 'err' as 'any'
    Toast.show({ type: 'error', text1: 'There was a problem submitting the data', text2: err.message });
  }
};

export const deleteAppointment = async (deleteData: Appointment) => {
  try {
    const response = await axios.delete(`${API_ENDPOINT}/DeleteAppointment?appointmentId=${deleteData.appointmentId}`);

    if (response.status === 200) {
      Toast.show({ type: 'success', text1: 'Deleted Appointment Successfully!' });
    } else {
      const responseData = await response.data;
      Toast.show({ type: 'error', text1: 'Error deleting data', text2: responseData.message });
    }
  } catch (err: any) { // Explicitly typing 'err' as 'any'
    Toast.show({ type: 'error', text1: 'There was a problem deleting the data', text2: err.message });
  }
};

// Optional: Refactor duplicate function
export const CreateAppoinment = async (Appoinment: Appointment): Promise<any> => {
  try {
    const response = await fetch(`https://careapps.azurewebsites.net/api/Appoinment/CreateAppoinment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
      body: JSON.stringify(Appoinment),
    });

    if (response.ok) {
      Toast.show({ type: 'success', text1: 'Created Appointment Successfully!' });
    } else {
      const responseData = await response.json();
      Toast.show({ type: 'error', text1: 'Error submitting data', text2: responseData.message });
    }
  } catch (err: any) { // Explicitly typing 'err' as 'any'
    Toast.show({ type: 'error', text1: 'There was a problem submitting the data', text2: err.message });
  }
};

export default searchAppoinment;
