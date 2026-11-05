import api from './axios';

export const materialApi = {
  getMaterials: async ({ subject, type, search, page = 1, limit = 20 } = {}) => {
    const params = { page, limit };
    if (subject) params.subject = subject;
    if (type) params.type = type;
    if (search) params.search = search;

    const response = await api.get('/materials', { params });
    return response.data;
  },

  getMaterialById: async (id) => {
    const response = await api.get(`/materials/${id}`);
    return response.data;
  },

  uploadMaterial: async (formData) => {
    // Let the browser set the Content-Type with boundary for multipart/form-data
    const response = await api.post('/materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyMaterials: async () => {
    const response = await api.get('/materials/mine');
    return response.data;
  },

  // Admin endpoints
  getPendingMaterials: async () => {
    const response = await api.get('/materials/pending');
    return response.data;
  },

  createMaterial: async (payload) => {
    const response = await api.post('/materials', payload);
    return response.data;
  },

  approveMaterial: async (id) => {
    const response = await api.put(`/materials/${id}/approve`);
    return response.data;
  },

  rejectMaterial: async (id, reason) => {
    const response = await api.put(`/materials/${id}/reject`, { reason });
    return response.data;
  },
};

