import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// List of public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register'];

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // For public routes, always allow access
  if (isPublicRoute) {
    return children;
  }

  // For dashboard routes, check authentication
  if (location.pathname.startsWith('/dashboard')) {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      );
    }
    
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Allow access to all other routes
  return children;
}