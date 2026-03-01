import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../shared/BackToTop';
import BackgroundSlideshow from '../shared/BackgroundSlideshow';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <BackgroundSlideshow />
      <Header />
      <main className="flex-1 relative z-[1]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
