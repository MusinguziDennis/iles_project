import api from './api';

// Placement
export const fetchMyPlacement = () => api.get('/students/placements/');

// Weekly Logs
export const fetchMyLogs = () => api.get('/evaluations/logs/');
export const createLog = (data) => api.post('/evaluations/logs/', data);
export const updateLog = (id, data) => api.patch(`/evaluations/logs/${id}/`, data);
export const deleteLog = (id) => api.delete(`/evaluations/logs/${id}/`);
export const submitLog = (id) => api.patch(`/evaluations/logs/${id}/update_status/`, { status: 'submitted' });

// Notifications
export const fetchMyNotifications = () => api.get('/students/notifications/');
export const markNotificationRead = (id) => api.patch(`/students/notifications/${id}/read/`);
export const markAllNotificationsRead = () => api.post('/students/notifications/mark-all-read/');
