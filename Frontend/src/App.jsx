import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Auth/login';
import Register from './components/Auth/Register';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/Student/StudentDashboard';
import SupervisorDashboard from './components/Supervisor/SupervisorDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProfilePage from './Profile/ProfilePage';
import PrivateRoute from './components/Common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student only */}
          <Route path="/student/dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />

          {/* Supervisor only */}
          <Route path="/supervisor/dashboard" element={
            <PrivateRoute allowedRoles={['work_supervisor', 'university_supervisor']}>
              <SupervisorDashboard />
            </PrivateRoute>
          } />

          {/* Admin only */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          {/* Any logged-in user */}
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />

          {/* Legacy /dashboard → student dashboard */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['student']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
