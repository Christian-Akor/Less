import api from './api';

export const getAllTasks = async (filters = {}) => {
  try {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch tasks.';
  }
};

export const getTask = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch task.';
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create task.';
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update task.';
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete task.';
  }
};

export const getTodayStats = async () => {
  try {
    const response = await api.get('/tasks/stats/today');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch today\'s stats.';
  }
};

export const getTasksByStatus = async (status) => {
  try {
    const response = await api.get('/tasks', { params: { status } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch tasks by status.';
  }
};

export const updateTaskProgress = async (taskId, progress) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/progress`, { progress });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update task progress.';
  }
};

export const completeTask = async (taskId) => {
  try {
    const response = await api.patch(`/tasks/${taskId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to complete task.';
  }
};
