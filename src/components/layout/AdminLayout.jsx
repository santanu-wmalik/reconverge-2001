import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../shared/BackToTop';
import BackgroundSlideshow from '../shared/BackgroundSlideshow';

const adminNavLinks = [
  { label: 'Dashboard', path: '/admin', icon: '📊' },
  { label: 'Planning Log', path: '/admin/planning', icon: '📋' },
  { label: 'Committees', path: '/admin/committees', icon: '👥' },
  { label: 'Budget', path: '/admin/budget', icon: '💰' },
  { label: 'Outreach', path: '/admin/outreach', icon: '📡' },
  { label: 'Event Dashboard', path: '/admin/event-dashboard', icon: '📈' },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlideshow />
      <Header />
      <main className="flex-1 relative z-[1]">
        {/* Admin Nav Bar */}
        <div className="bg-gold-500/5 border-b border-gold-500/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              <span className="text-gold-400 text-xs font-semibold uppercase tracking-wider mr-3 flex-shrink-0">
                Admin
              </span>
              {adminNavLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
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
      <BackToTop />
    </div>
  );
}
