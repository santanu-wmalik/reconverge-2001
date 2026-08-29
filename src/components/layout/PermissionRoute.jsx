import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Guards a subtree behind a named permission (e.g. 'finance', 'marketing').
// Super-admins pass implicitly. Everyone else must have the permission set
// in users.permissions — either directly or via impersonation of a user who
// does. Falls back to /admin when denied so the person lands somewhere
// useful instead of a 404.
export default function PermissionRoute({ permission }) {
  const { isAuthenticated, hasPermission } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission(permission)) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
