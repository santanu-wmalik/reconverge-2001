import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BinderTabs from './BinderTabs';
import BackToTop from '../shared/BackToTop';
import AnnouncementsBanner from '../shared/AnnouncementsBanner';
import ImpersonationBanner from './ImpersonationBanner';
import { useAuth } from '../../context/AuthContext';

// Base admin nav shared by all admin-portal viewers.
const BASE_ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin', icon: '📊' },
  { label: 'Planning Log', path: '/admin/planning', icon: '📋' },
  { label: 'Committees', path: '/admin/committees', icon: '👥' },
  { label: 'Budget', path: '/admin/budget', icon: '💰' },
  { label: 'Outreach', path: '/admin/outreach', icon: '📡' },
  { label: 'Event Dashboard', path: '/admin/event-dashboard', icon: '📈' },
  { label: 'Rooming', path: '/admin/rooming', icon: '🛏️' },
  { label: 'Meetings', path: '/admin/meetings', icon: '📝' },
];

// Permission-gated tabs. Rendered when the signed-in admin holds the named
// permission (super-admin implicitly holds all).
const PERMISSION_NAV = [
  { label: 'Payments',  path: '/admin/payments',  icon: '🧾', permission: 'finance'   },
  { label: 'Reminders', path: '/admin/reminders', icon: '📣', permission: 'marketing' },
];

// Super-admin-only extras. Rendered only when `isSuperAdmin`.
const SUPER_ADMIN_NAV = [
  { label: 'Users', path: '/admin/users', icon: '🔑' },
];

// Admin shell — same cream / forest / gold look as the public site, with a
// binder-tab strip for the admin sections.
export default function AdminLayout() {
  const location = useLocation();
  const { isSuperAdmin, hasPermission } = useAuth();
  const permissionNav = PERMISSION_NAV.filter((n) => hasPermission(n.permission));
  const adminNavLinks = [
    ...BASE_ADMIN_NAV,
    ...permissionNav,
    ...(isSuperAdmin ? SUPER_ADMIN_NAV : []),
  ];
  const isActive = (link) => location.pathname === link.path;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-ink">
      <div className="flex flex-col min-h-screen">
        <ImpersonationBanner />
        <Header />
        <AnnouncementsBanner />
        <main className="flex-1 relative z-[1]">
          <BinderTabs label="Admin" links={adminNavLinks} isActive={isActive} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
}
