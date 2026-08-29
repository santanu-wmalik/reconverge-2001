import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../shared/BackToTop';
import BackgroundSlideshow from '../shared/BackgroundSlideshow';
import FloatingPhotos from '../shared/FloatingPhotos';
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

export default function AdminLayout() {
  const location = useLocation();
  const { isSuperAdmin, hasPermission } = useAuth();
  const permissionNav = PERMISSION_NAV.filter((n) => hasPermission(n.permission));
  const adminNavLinks = [
    ...BASE_ADMIN_NAV,
    ...permissionNav,
    ...(isSuperAdmin ? SUPER_ADMIN_NAV : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlideshow />
      <FloatingPhotos />
      <div className="flex flex-col min-h-screen lg:px-44">
        <ImpersonationBanner />
        <Header />
        <AnnouncementsBanner />
        <main className="flex-1 relative z-[1]">
          {/* Admin Nav Bar */}
          <div className="bg-gold-500/5 border-b border-gold-500/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 py-2">
                <span className="text-gold-400 text-xs font-semibold uppercase tracking-wider mr-3">
                  Admin
                </span>
                {adminNavLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gold-500 text-navy-950'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.icon}</span>
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Page Content */}
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
