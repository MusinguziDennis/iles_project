import api from './api';

// Placement
export const fetchMyPlacement = () => api.get('/students/placements/');

// Weekly Logs
export const fetchMyLogs = () => api.get('/evaluations/logs/');
export const fetchLogStats = () => api.get('/evaluations/stats/');
export const createLog = (data) => api.post('/evaluations/logs/', data);
export const updateLog = (id, data) => api.patch(`/evaluations/logs/${id}/`, data);
export const deleteLog = (id) => api.delete(`/evaluations/logs/${id}/`);
export const submitLog = (id) => api.patch(`/evaluations/logs/${id}/`, { status: 'submitted' });
