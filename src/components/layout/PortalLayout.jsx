import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../shared/BackToTop';
import BackgroundSlideshow from '../shared/BackgroundSlideshow';

export default function PortalLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlideshow />
      <Header />
      <main className="flex-1 relative z-[1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
