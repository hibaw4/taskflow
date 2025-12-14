import api from './api';

// 1. Link to: @PostMapping("/project/{projectId}")
export const createTask = async (projectId, taskData) => {
    // URL becomes: /tasks/project/1
    const response = await api.post(`/tasks/project/${projectId}`, taskData);
    return response.data;
};

// 2. Link to: @PutMapping("/{taskId}/toggle")
export const toggleTask = async (taskId) => {
    // URL becomes: /tasks/5/toggle
    const response = await api.put(`/tasks/${taskId}/toggle`);
    return response.data;
};

// 3. Link to: @DeleteMapping("/{taskId}")
export const deleteTask = async (taskId) => {
    // URL becomes: /tasks/5
    await api.delete(`/tasks/${taskId}`);
};