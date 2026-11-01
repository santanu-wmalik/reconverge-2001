import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import PolicyConsentModal from '../shared/PolicyConsent';
import Footer from './Footer';
import BackToTop from '../shared/BackToTop';
import AnnouncementsBanner from '../shared/AnnouncementsBanner';
import ImpersonationBanner from './ImpersonationBanner';
import WidgetRail from '../shared/WidgetRail';
import ShareRail from '../shared/ShareRail';
import ActivityPing from '../shared/ActivityPing';

// Public shell — cream paper theme (rect1an style). The old full-page
// BackgroundSlideshow + bottom PhotoRoll are gone: the hero carries its own
// campus photo, and photos now live inside the Then & Now / Alumni Vault
// sections. The floating right-hand WidgetRail (countdown + quick links)
// and left ShareRail replace them.
export default function PublicLayout() {
  // On the landing page the countdown strip is embedded in the hero's
  // stats band (HeroSection renders <WidgetRail inline />), so the floating
  // copy would be a duplicate there.
  const isLanding = useLocation().pathname === '/';
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-ink">
      <ActivityPing />
      <div className="flex flex-col min-h-screen">
        <ImpersonationBanner />
        <Header />
        <PolicyConsentModal />
        <AnnouncementsBanner />
        <main className="flex-1 relative z-[1]">
          <Outlet />
        </main>
        <Footer />
      </div>
      {!isLanding && <WidgetRail />}
      <ShareRail />
      <BackToTop />
    </div>
  );
}
