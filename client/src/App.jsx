import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import MaintenancePopup from './components/MaintenancePopup';
import AnnouncementBar from './components/AnnouncementBar';
import TelegramPopup from './components/TelegramPopup';
import api from './utils/api';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LayoutProvider } from './context/LayoutContext';

function App() {
  const location = useLocation();

  // Maintenance Mode
  const [isMaintenance, setIsMaintenance] = useState(false);

  const { user } = useAuth(); // Rely directly on AuthContext instead of localStorage

  // Admin check (now reactive to auth context changes!)
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [maintRes] = await Promise.all([
          api.get('/settings/maintenance')
        ]);
        setIsMaintenance(maintRes.data?.value === true);
      } catch (error) {
        console.error("Failed to check settings");
      }
    };

    fetchSettings();

    // Poll every minute
    const interval = setInterval(() => {
      fetchSettings();
    }, 60000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  // Maintenance Check
  if (isMaintenance && !isAdmin) {
    if (location.pathname === '/login' || location.pathname.startsWith('/admin')) {
      // let them pass
    } else {
      return <MaintenancePopup />;
    }
  }

  return (
    <ThemeProvider>
      <LayoutProvider>
        <div className="app">
          <AnnouncementBar />
          <TelegramPopup />
          <Routes>
            {/* Public/Auth Routes (No Sidebar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main App Routes (With Sidebar Layout) */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/courses" element={<MainLayout><Courses /></MainLayout>} />
            <Route path="/courses/:id" element={
              <ProtectedRoute>
                <MainLayout><CourseDetails /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <MainLayout><Profile initialTab="settings" /></MainLayout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout><StudentDashboard /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <MainLayout><AdminDashboard /></MainLayout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster position="bottom-right" />
        </div>
      </LayoutProvider>
    </ThemeProvider >
  );
}

// Wrap App with AuthProvider at the highest level so App can consume useAuth()
// We assume index.js renders <App /> directly. If not, we can wrap here.
const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
