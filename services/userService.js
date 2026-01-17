import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch profile.';
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update profile.';
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete('/users/account');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete account.';
  }
};
