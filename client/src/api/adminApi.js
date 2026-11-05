import api from './axios';

export const adminApi = {
  getUsers: async ({ search, role, branch, blocked, page = 1, limit = 20 } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (role) params.role = role;
    if (branch) params.branch = branch;
    if (blocked !== undefined && blocked !== '') params.blocked = blocked;

    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  blockUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/block`);
    return response.data;
  },

  unblockUser: async (id) => {
    const response = await api.put(`/admin/users/${id}/unblock`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  sendAdminMessage: async (id, { title, message }) => {
    const response = await api.post(`/admin/users/${id}/message`, { title, message });
    return response.data;
  },
};

