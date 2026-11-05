import api from './axios';

export const branchApi = {
  // Public branches (active only)
  getBranches: async () => {
    const response = await api.get('/branches');
    return response.data;
  },

  // Admin: all branches including inactive
  getAllBranches: async () => {
    const response = await api.get('/branches/all');
    return response.data;
  },

  // Admin: create branch
  createBranch: async (payload) => {
    const response = await api.post('/branches', payload);
    return response.data;
  },

  // Admin: update branch
  updateBranch: async (id, payload) => {
    const response = await api.put(`/branches/${id}`, payload);
    return response.data;
  },
};

