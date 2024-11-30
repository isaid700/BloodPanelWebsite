import axios from 'axios';

export async function fetchPatientsData() {
  try {
    const response = await axios.get('/api/patients'); // Fetch parsed data from backend
    return response.data; // Return the data
  } catch (error) {
    console.error('Error fetching patients data:', error.message);
    throw error;
  }
}