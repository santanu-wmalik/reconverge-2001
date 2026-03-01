import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ItineraryProvider } from './context/ItineraryContext';
import { router } from './router';

export default function App() {
  // Global image download protection
  useEffect(() => {
    const handleContextMenu = (e) => {
      // Block right-click on images across the entire site
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e) => {
      // Prevent dragging images to desktop/other apps
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <ItineraryProvider>
            <RouterProvider router={router} />
          </ItineraryProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
