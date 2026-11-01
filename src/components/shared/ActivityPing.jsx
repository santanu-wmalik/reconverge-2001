import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { activityApi } from '../../services/api';

// Logs a page view for the signed-in user on every route change (powers the
// admin User Activity dashboard). Renders nothing; failures are swallowed.
export default function ActivityPing() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isAuthenticated) activityApi.pageView(pathname);
  }, [isAuthenticated, pathname]);
  return null;
}
