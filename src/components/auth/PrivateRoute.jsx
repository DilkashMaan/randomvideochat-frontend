import { useAuth } from './AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Handle loading state without flashing "Loading..." text
  if (isAuthenticated === null) {
    return null; // or a minimal spinner
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
