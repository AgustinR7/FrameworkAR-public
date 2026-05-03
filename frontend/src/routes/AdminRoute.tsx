import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export const AdminRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; //Maybe a spinner later?
  }

  // If is not authenticated or is not admin, redirect to home
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  //If everything is fine, render the children (nested routes)
  return <Outlet />;
};
