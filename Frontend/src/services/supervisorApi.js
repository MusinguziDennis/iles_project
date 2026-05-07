import api from './api';

export const fetchSupervisorStats = () => api.get('/supervisor/stats/');
export const fetchAssignedStudents = () => api.get('/supervisor/students/');
export const fetchSupervisorLogs = () => api.get('/supervisor/logs/');
export const fetchLogDetail = (id) => api.get(`/supervisor/logs/${id}/`);
export const postReview = (logId, comment) => api.post(`/supervisor/review/${logId}/`, { comment });
export const updateLogStatus = (id, status) => api.patch(`/supervisor/logs/${id}/status/`, { status });
export const fetchSupervisorNotifications = () => api.get('/supervisor/notifications/');
export const markSupervisorNotificationRead = (id) => api.patch(`/supervisor/notifications/${id}/read/`);
export const markAllSupervisorNotificationsRead = () => api.post('/supervisor/notifications/mark-all-read/');
