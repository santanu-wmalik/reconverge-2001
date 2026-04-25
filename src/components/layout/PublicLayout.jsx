import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../shared/BackToTop';
import BackgroundSlideshow from '../shared/BackgroundSlideshow';
import FloatingPhotos from '../shared/FloatingPhotos';
import AnnouncementsBanner from '../shared/AnnouncementsBanner';
import ImpersonationBanner from './ImpersonationBanner';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlideshow />
      <FloatingPhotos />
      <div className="flex flex-col min-h-screen lg:px-44">
        <ImpersonationBanner />
        <Header />
        <AnnouncementsBanner />
        <main className="flex-1 relative z-[1]">
          <Outlet />
        </main>
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
}
