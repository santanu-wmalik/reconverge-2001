import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// After a deploy, Vite emits new hashed chunk filenames. Visitors holding the
// previously-cached `index.html` still request the old chunks, which 404 —
// surfacing as "Failed to fetch dynamically imported module". The only safe
// recovery is to force a hard reload so the new index.html + chunk map load.
// We gate the reload with a sessionStorage flag so a genuinely broken chunk
// (not a stale-deploy mismatch) doesn't spin the tab in an infinite loop.
function lazyWithReload(importer) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (err) {
      const message = String(err?.message || err);
      const looksStale =
        /Failed to fetch dynamically imported module/i.test(message) ||
        /Importing a module script failed/i.test(message) ||
        /ChunkLoadError/i.test(err?.name || '');
      if (looksStale && !sessionStorage.getItem('__reconverge_chunk_reloaded')) {
        sessionStorage.setItem('__reconverge_chunk_reloaded', '1');
        window.location.reload();
        // Return a placeholder so React doesn't render the error state in the
        // split-second before the reload actually happens.
        return { default: () => null };
      }
      throw err;
    }
  });
}

// Clear the reload sentinel on successful navigation — so a later, genuine
// chunk failure gets a fresh chance to self-heal after the next deploy.
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    sessionStorage.removeItem('__reconverge_chunk_reloaded');
  });
}
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import SuperAdminRoute from './components/layout/SuperAdminRoute';
import AdminLayout from './components/layout/AdminLayout';

// Lazy load all pages
const LandingPage = lazyWithReload(() => import('./pages/landing/LandingPage'));
const LoginPage = lazyWithReload(() => import('./pages/auth/LoginPage'));
const NotFoundPage = lazyWithReload(() => import('./pages/not-found/NotFoundPage'));
const RegistrationPage = lazyWithReload(() => import('./pages/registration/RegistrationPage'));
const RegistrationSuccess = lazyWithReload(() => import('./pages/registration/RegistrationSuccess'));
const ProfileDashboard = lazyWithReload(() => import('./pages/profile/ProfileDashboard'));
const EditProfile = lazyWithReload(() => import('./pages/profile/EditProfile'));
const EventSchedulePage = lazyWithReload(() => import('./pages/itinerary/EventSchedulePage'));
const MyItineraryPage = lazyWithReload(() => import('./pages/itinerary/MyItineraryPage'));
const GroupsListPage = lazyWithReload(() => import('./pages/groups/GroupsListPage'));
const GroupDetailPage = lazyWithReload(() => import('./pages/groups/GroupDetailPage'));
const TravelPlannerPage = lazyWithReload(() => import('./pages/travel/TravelPlannerPage'));
const GiveBackPage = lazyWithReload(() => import('./pages/giveback/GiveBackPage'));
const NostalgiaPage = lazyWithReload(() => import('./pages/nostalgia/NostalgiaPage'));
const PhotoGalleryPage = lazyWithReload(() => import('./pages/nostalgia/PhotoGalleryPage'));
const VideoGalleryPage = lazyWithReload(() => import('./pages/nostalgia/VideoGalleryPage'));
const StorePage = lazyWithReload(() => import('./pages/merchandise/StorePage'));
const ProductDetailPage = lazyWithReload(() => import('./pages/merchandise/ProductDetailPage'));
const CartPage = lazyWithReload(() => import('./pages/merchandise/CartPage'));
const NewsPage = lazyWithReload(() => import('./pages/news/NewsPage'));
const TownhallsPage = lazyWithReload(() => import('./pages/townhalls/TownhallsPage'));

// New pages from real event
const WhenWherePage = lazyWithReload(() => import('./pages/whenwhere/WhenWherePage'));
const FAQPage = lazyWithReload(() => import('./pages/faq/FAQPage'));
const CommitteesPage = lazyWithReload(() => import('./pages/committees/CommitteesPage'));
const RSVPPage = lazyWithReload(() => import('./pages/rsvp/RSVPPage'));
const OurJourneyPage = lazyWithReload(() => import('./pages/journey/OurJourneyPage'));
const StayPage = lazyWithReload(() => import('./pages/stay/StayPage'));

// Admin pages
const AdminDashboardPage = lazyWithReload(() => import('./pages/admin/AdminDashboardPage'));
const PlanningLogPage = lazyWithReload(() => import('./pages/admin/PlanningLogPage'));
const CommitteeManagementPage = lazyWithReload(() => import('./pages/admin/CommitteeManagementPage'));
const BudgetPage = lazyWithReload(() => import('./pages/admin/BudgetPage'));
const OutreachPage = lazyWithReload(() => import('./pages/admin/OutreachPage'));
const EventDashboardPage = lazyWithReload(() => import('./pages/admin/EventDashboardPage'));
const RoomingPage = lazyWithReload(() => import('./pages/admin/RoomingPage'));
const MeetingsPage = lazyWithReload(() => import('./pages/admin/MeetingsPage'));
const UsersPage = lazyWithReload(() => import('./pages/admin/UsersPage'));

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
          { path: 'agenda', element: <SuspenseWrapper><EventSchedulePage /></SuspenseWrapper> },
          { path: 'events', element: <SuspenseWrapper><EventSchedulePage /></SuspenseWrapper> },
          { path: 'events/my-plan', element: <SuspenseWrapper><MyItineraryPage /></SuspenseWrapper> },
          { path: 'groups', element: <SuspenseWrapper><GroupsListPage /></SuspenseWrapper> },
          { path: 'groups/:groupId', element: <SuspenseWrapper><GroupDetailPage /></SuspenseWrapper> },
          { path: 'travel', element: <SuspenseWrapper><TravelPlannerPage /></SuspenseWrapper> },
          { path: 'stay', element: <SuspenseWrapper><StayPage /></SuspenseWrapper> },
          { path: 'give-back', element: <SuspenseWrapper><GiveBackPage /></SuspenseWrapper> },
          { path: 'yearbook', element: <SuspenseWrapper><NostalgiaPage /></SuspenseWrapper> },
          { path: 'nostalgia', element: <SuspenseWrapper><NostalgiaPage /></SuspenseWrapper> },
          { path: 'nostalgia/photos', element: <SuspenseWrapper><PhotoGalleryPage /></SuspenseWrapper> },
          { path: 'nostalgia/videos', element: <SuspenseWrapper><VideoGalleryPage /></SuspenseWrapper> },
          { path: 'store', element: <SuspenseWrapper><StorePage /></SuspenseWrapper> },
          { path: 'store/:productId', element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper> },
          { path: 'cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
          { path: 'news', element: <SuspenseWrapper><NewsPage /></SuspenseWrapper> },
          { path: 'townhalls', element: <SuspenseWrapper><TownhallsPage /></SuspenseWrapper> },
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
          { path: 'admin/rooming', element: <SuspenseWrapper><RoomingPage /></SuspenseWrapper> },
          { path: 'admin/meetings', element: <SuspenseWrapper><MeetingsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },

  // Super-admin-only routes (User Management)
  {
    element: <SuperAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: 'admin/users', element: <SuspenseWrapper><UsersPage /></SuspenseWrapper> },
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
