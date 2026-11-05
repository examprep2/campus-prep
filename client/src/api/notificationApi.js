import api from './axios';

export const notificationApi = {
  getMyNotifications: async ({ unread, page = 1, limit = 20 } = {}) => {
    const params = { page, limit };
    if (unread !== undefined) params.unread = unread ? 'true' : 'false';

    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },
};

