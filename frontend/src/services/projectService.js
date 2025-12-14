import api from './api';

export const getAllProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

// 👇 THIS PART IS OFTEN MISSING. DO YOU HAVE IT?
export const getProjectById = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};
// ------------------------------------------------

export const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

export const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
};