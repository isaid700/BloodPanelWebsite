import axios from 'axios';

export async function updatePatientsData(currentUser) {
  try {
    const response = await axios.get(`/api/patients/${currentUser}`);
    localStorage.setItem('patientsData', JSON.stringify(response.data));
    console.log('Patients data updated successfully');
    return response.data;
  } catch (error) {
    console.error('Error updating patients data:', error);
    throw error;
  }
}