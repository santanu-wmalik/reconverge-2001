import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ItineraryProvider } from './context/ItineraryContext';
import { router } from './router';

export default function App() {
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
