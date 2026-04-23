import api from './api';

// GET /api/supervisor/stats/
export const fetchSupervisorStats = () => api.get('/supervisor/stats/');

// GET /api/supervisor/logs/
export const fetchSupervisorLogs = () => api.get('/supervisor/logs/');

// GET /api/supervisor/logs/:id/
export const fetchLogDetail = (id) => api.get(`/supervisor/logs/${id}/`);

// POST /api/supervisor/review/:logId/
export const postReview = (logId, comment) =>
  api.post(`/supervisor/review/${logId}/`, { comment });

// PATCH /api/supervisor/logs/:id/status/
export const updateLogStatus = (id, status) =>
  api.patch(`/supervisor/logs/${id}/status/`, { status });
