import { basicAxios } from './axios';

export const getMountains = async () => {
  try {
    const response = await basicAxios.get('/api/v1/auth/mountains');
    return response.data;
  } catch (error) {
    console.error('Error fetching mountains:', error);
    throw error;
  }
};
