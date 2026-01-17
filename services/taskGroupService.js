import api from './api';

export const getAllTaskGroups = async () => {
  try {
    const response = await api.get('/task-groups');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch task groups.';
  }
};

export const getTaskGroup = async (groupId) => {
  try {
    const response = await api.get(`/task-groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch task group.';
  }
};

export const createTaskGroup = async (groupData) => {
  try {
    const response = await api.post('/task-groups', groupData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create task group.';
  }
};

export const updateTaskGroup = async (groupId, groupData) => {
  try {
    const response = await api.put(`/task-groups/${groupId}`, groupData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update task group.';
  }
};

export const deleteTaskGroup = async (groupId) => {
  try {
    const response = await api.delete(`/task-groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete task group.';
  }
};

export const getTaskGroupTasks = async (groupId) => {
  try {
    const response = await api.get(`/task-groups/${groupId}/tasks`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch tasks for this group.';
  }
};
