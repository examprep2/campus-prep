import api from './axios';

export const subjectApi = {
  getSubjects: async ({ branch, year, semester, includeInactive } = {}) => {
    const params = {};
    if (branch) params.branch = branch;
    if (year) params.year = year;
    if (semester) params.semester = semester;
    if (includeInactive) params.includeInactive = 'true';

    const response = await api.get('/subjects', { params });
    return response.data;
  },

  createSubject: async (payload) => {
    const response = await api.post('/subjects', payload);
    return response.data;
  },

  updateSubject: async (id, payload) => {
    const response = await api.put(`/subjects/${id}`, payload);
    return response.data;
  },
};

