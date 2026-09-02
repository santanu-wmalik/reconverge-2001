import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ImpersonationBanner from './ImpersonationBanner';
import BinderTabs from './BinderTabs';
import BackToTop from '../shared/BackToTop';
import AnnouncementsBanner from '../shared/AnnouncementsBanner';
import { NAV_LINKS_PROTECTED } from '../../data/constants';

// Authenticated portal shell — same cream / forest / gold look as the public
// site (no `dark` root class), so signed-in pages match the home page.
// Section navigation is a binder-tab strip under the header.
export default function PortalLayout() {
  const location = useLocation();
  const isActive = (link) =>
    location.pathname === link.path || location.pathname.startsWith(link.path + '/');

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-ink">
      <div className="flex flex-col min-h-screen">
        <ImpersonationBanner />
        <Header />
        <AnnouncementsBanner />
        <main className="flex-1 relative z-[1]">
          <BinderTabs label="My Portal" links={NAV_LINKS_PROTECTED} isActive={isActive} />

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
