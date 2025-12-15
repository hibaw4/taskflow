import api from './api';

// To create tasks
export const createTask = async (projectId, taskData) => {
    const response = await api.post(`/tasks/project/${projectId}`, taskData);
    return response.data;
};

// To toggle task (completed/not completed)
export const toggleTask = async (taskId) => {
    const response = await api.put(`/tasks/${taskId}/toggle`);
    return response.data;
};

// To delete a task
export const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
};