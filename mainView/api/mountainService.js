import api from './api';

export const getMountains = async () => {
  try {
    const response = await api.get('/api/v1/auth/mountains');
    return response.data;
  } catch (error) {
    console.error('Error fetching mountains:', error);
    throw error;
  }
};
