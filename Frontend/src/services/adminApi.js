import api from './api';

// ── Users ──────────────────────────────────────────────────────────────────────
export const fetchUsers = () => api.get('/users/list/');
export const createUser = (data) => api.post('/users/list/', data); // Admin creates user + sends email
export const updateUser = (id, data) => api.patch(`/users/${id}/`, data);
export const deleteUser = (id) => api.delete(`/users/${id}/`);

// ── Placements ─────────────────────────────────────────────────────────────────
export const fetchPlacements = () => api.get('/students/placements/');
export const createPlacement = (data) => api.post('/students/placements/', data);
export const updatePlacement = (id, data) => api.patch(`/students/placements/${id}/`, data);
export const deletePlacement = (id) => api.delete(`/students/placements/${id}/`);
