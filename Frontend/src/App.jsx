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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/supervisor/dashboard" element={<PrivateRoute><SupervisorDashboard /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
