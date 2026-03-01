import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load all pages
const LandingPage = lazy(() => import('./pages/landing/LandingPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/not-found/NotFoundPage'));
const RegistrationPage = lazy(() => import('./pages/registration/RegistrationPage'));
const RegistrationSuccess = lazy(() => import('./pages/registration/RegistrationSuccess'));
const ProfileDashboard = lazy(() => import('./pages/profile/ProfileDashboard'));
const EditProfile = lazy(() => import('./pages/profile/EditProfile'));
const DigitalPass = lazy(() => import('./pages/profile/DigitalPass'));
const EventSchedulePage = lazy(() => import('./pages/itinerary/EventSchedulePage'));
const MyItineraryPage = lazy(() => import('./pages/itinerary/MyItineraryPage'));
const GroupsListPage = lazy(() => import('./pages/groups/GroupsListPage'));
const GroupDetailPage = lazy(() => import('./pages/groups/GroupDetailPage'));
const TravelPlannerPage = lazy(() => import('./pages/travel/TravelPlannerPage'));
const GiveBackPage = lazy(() => import('./pages/giveback/GiveBackPage'));
const NostalgiaPage = lazy(() => import('./pages/nostalgia/NostalgiaPage'));
const PhotoGalleryPage = lazy(() => import('./pages/nostalgia/PhotoGalleryPage'));
const VideoGalleryPage = lazy(() => import('./pages/nostalgia/VideoGalleryPage'));
const StorePage = lazy(() => import('./pages/merchandise/StorePage'));
const ProductDetailPage = lazy(() => import('./pages/merchandise/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/merchandise/CartPage'));
const NewsPage = lazy(() => import('./pages/news/NewsPage'));

// New pages from real event
const WhenWherePage = lazy(() => import('./pages/whenwhere/WhenWherePage'));
const FAQPage = lazy(() => import('./pages/faq/FAQPage'));
const CommitteesPage = lazy(() => import('./pages/committees/CommitteesPage'));
const RSVPPage = lazy(() => import('./pages/rsvp/RSVPPage'));
const OurJourneyPage = lazy(() => import('./pages/journey/OurJourneyPage'));

// Admin pages
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const PlanningLogPage = lazy(() => import('./pages/admin/PlanningLogPage'));
const CommitteeManagementPage = lazy(() => import('./pages/admin/CommitteeManagementPage'));
const BudgetPage = lazy(() => import('./pages/admin/BudgetPage'));
const OutreachPage = lazy(() => import('./pages/admin/OutreachPage'));
const EventDashboardPage = lazy(() => import('./pages/admin/EventDashboardPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function SuspenseWrapper({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><LandingPage /></SuspenseWrapper> },
      { path: 'login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: 'register', element: <SuspenseWrapper><RegistrationPage /></SuspenseWrapper> },
      { path: 'register/success', element: <SuspenseWrapper><RegistrationSuccess /></SuspenseWrapper> },
      // New public pages from real event site
      { path: 'when-where', element: <SuspenseWrapper><WhenWherePage /></SuspenseWrapper> },
      { path: 'faq', element: <SuspenseWrapper><FAQPage /></SuspenseWrapper> },
      { path: 'committees', element: <SuspenseWrapper><CommitteesPage /></SuspenseWrapper> },
      { path: 'rsvp', element: <SuspenseWrapper><RSVPPage /></SuspenseWrapper> },
      { path: 'our-journey', element: <SuspenseWrapper><OurJourneyPage /></SuspenseWrapper> },
    ],
  },

  // Protected portal routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PortalLayout />,
        children: [
          { path: 'profile', element: <SuspenseWrapper><ProfileDashboard /></SuspenseWrapper> },
          { path: 'profile/edit', element: <SuspenseWrapper><EditProfile /></SuspenseWrapper> },
          { path: 'profile/pass', element: <SuspenseWrapper><DigitalPass /></SuspenseWrapper> },
          { path: 'agenda', element: <SuspenseWrapper><EventSchedulePage /></SuspenseWrapper> },
          { path: 'events', element: <SuspenseWrapper><EventSchedulePage /></SuspenseWrapper> },
          { path: 'events/my-plan', element: <SuspenseWrapper><MyItineraryPage /></SuspenseWrapper> },
          { path: 'groups', element: <SuspenseWrapper><GroupsListPage /></SuspenseWrapper> },
          { path: 'groups/:groupId', element: <SuspenseWrapper><GroupDetailPage /></SuspenseWrapper> },
          { path: 'travel', element: <SuspenseWrapper><TravelPlannerPage /></SuspenseWrapper> },
          { path: 'give-back', element: <SuspenseWrapper><GiveBackPage /></SuspenseWrapper> },
          { path: 'yearbook', element: <SuspenseWrapper><NostalgiaPage /></SuspenseWrapper> },
          { path: 'nostalgia', element: <SuspenseWrapper><NostalgiaPage /></SuspenseWrapper> },
          { path: 'nostalgia/photos', element: <SuspenseWrapper><PhotoGalleryPage /></SuspenseWrapper> },
          { path: 'nostalgia/videos', element: <SuspenseWrapper><VideoGalleryPage /></SuspenseWrapper> },
          { path: 'store', element: <SuspenseWrapper><StorePage /></SuspenseWrapper> },
          { path: 'store/:productId', element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper> },
          { path: 'cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
          { path: 'news', element: <SuspenseWrapper><NewsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // Admin routes (requires admin role)
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin', element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper> },
          { path: 'admin/planning', element: <SuspenseWrapper><PlanningLogPage /></SuspenseWrapper> },
          { path: 'admin/committees', element: <SuspenseWrapper><CommitteeManagementPage /></SuspenseWrapper> },
          { path: 'admin/budget', element: <SuspenseWrapper><BudgetPage /></SuspenseWrapper> },
          { path: 'admin/outreach', element: <SuspenseWrapper><OutreachPage /></SuspenseWrapper> },
          { path: 'admin/event-dashboard', element: <SuspenseWrapper><EventDashboardPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <PublicLayout />,
    children: [
      { path: '*', element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
    ],
  },
]);
