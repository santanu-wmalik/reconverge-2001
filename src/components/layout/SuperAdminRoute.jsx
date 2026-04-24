import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Gate for super-admin-only routes (e.g. /admin/users).
// - Unauthenticated users → /login
// - Authenticated but not admin → /profile (same as AdminRoute)
// - Authenticated admin but not super-admin → /admin (bounce to admin dashboard)
export default function SuperAdminRoute() {
  const { isAuthenticated, isAdmin, isSuperAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/profile" replace />;
  if (!isSuperAdmin) return <Navigate to="/admin" replace />;

  return <Outlet />;
}
