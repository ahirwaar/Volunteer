import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If allowedRoles is empty, allow any authenticated user
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect volunteers to their dashboard
    if (user.role === 'volunteer') {
      return <Navigate to="/dashboard" />;
    }
    // Redirect organizations to their dashboard
    if (user.role === 'organization') {
      return <Navigate to="/organization/dashboard" />;
    }
    // Default fallback
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 