import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ImpersonationBanner from './ImpersonationBanner';
import BackToTop from '../shared/BackToTop';
import BackgroundSlideshow from '../shared/BackgroundSlideshow';
import FloatingPhotos from '../shared/FloatingPhotos';
import AnnouncementsBanner from '../shared/AnnouncementsBanner';
import { NAV_LINKS_PROTECTED } from '../../data/constants';

export default function PortalLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlideshow />
      <FloatingPhotos />
      <div className="flex flex-col min-h-screen lg:px-44">
        <ImpersonationBanner />
        <Header />
        <AnnouncementsBanner />
        <main className="flex-1 relative z-[1]">
          {/* My Portal sub-bar — mirrors the Admin sub-bar pattern. Only
              rendered inside PortalLayout, which is gated by ProtectedRoute,
              so it is effectively hidden for unauthenticated users. */}
          <div className="bg-primary-500/5 border-b border-primary-400/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-x-1 gap-y-1.5 py-2">
                <span className="text-gold-400 text-xs font-semibold uppercase tracking-wider mr-3">
                  My Portal
                </span>
                {NAV_LINKS_PROTECTED.map((link) => {
                  const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
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
                      {link.icon && <span>{link.icon}</span>}
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

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
