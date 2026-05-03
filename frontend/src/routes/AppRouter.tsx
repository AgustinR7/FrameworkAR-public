import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { AdminRoute } from './AdminRoute';

import LoginPage from '../pages/LoginPage';
import LandingPage from '../pages/LandingPage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';

export const AppRouter = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? <LoginPage /> : <Navigate to="/" />
      } />

      <Route path="/" element={
        isAuthenticated ? (
          <DashboardLayout onLogout={logout}>
             <LandingPage /> 
          </DashboardLayout>
        ) : <Navigate to="/login" />
      } />

      <Route path="/profile" element={
        isAuthenticated ? (
          <DashboardLayout onLogout={logout}>
             <ProfilePage />
          </DashboardLayout>
        ) : <Navigate to="/login" />
      } />

      <Route path="/settings" element={
        isAuthenticated ? (
          <DashboardLayout onLogout={logout}>
             <SettingsPage />
          </DashboardLayout>
        ) : <Navigate to="/login" />
      } />

      {/* Route protected for administrators */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={
          <DashboardLayout onLogout={logout}>
            <div style={{ padding: '2rem', color: 'white' }}>
              <h2>Panel de Administración</h2>
              <p>Solo los usuarios con rol 'admin' pueden ver esto.</p>
            </div>
          </DashboardLayout>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
