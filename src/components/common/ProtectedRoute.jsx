import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSkeleton from './LoadingSkeleton';

const ProtectedRoute = ({ children, roles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="p-8"><LoadingSkeleton /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  if ((user.role === 'vendor' || user.role === 'delivery') && profile?.approval_status === 'pending') {
    return <Navigate to="/pending" replace />;
  }

  return children;
};

export default ProtectedRoute;
