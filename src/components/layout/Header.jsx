import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { NAV_LINKS, EVENT_CONFIG } from '../../data/constants';
import { cn } from '../../utils/cn';
import Avatar from '../ui/Avatar';

// rect1an-style header:
//   left  — small logo + 3-line gold small-caps wordmark
//   mid   — ALL-CAPS letter-spaced nav
//   right — bell (auth only) + gold LOGIN / SIGN UP
//
// Dark shells (portal/admin) get the original dark treatment via `dark:`.
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    cn(
      'nav-caps px-3 py-2 rounded-md transition-colors whitespace-nowrap',
      isActive(path)
        ? 'text-forest-700 bg-forest-600/8 dark:text-gold-400 dark:bg-gold-400/10'
        : 'text-ink-soft hover:text-forest-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
    );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-cream-50/90 backdrop-blur-xl border-b border-forest-500/10 dark:bg-slate-950/80 dark:border-white/5">
        <div className="w-full px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Wordmark */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0 min-h-[44px]">
              <img src={EVENT_CONFIG.logoUrl} alt="REConverge 2001" className="w-9 h-9 rounded-full object-contain ring-1 ring-gold-500/40" />
              <div className="block leading-[1.05]">
                <p className="text-[10px] font-semibold uppercase tracking-caps text-gold-600 dark:text-gold-400">Batch of 2001</p>
                <p className="text-[10px] font-semibold uppercase tracking-caps text-gold-600 dark:text-gold-400">REC Calicut ·</p>
                <p className="text-[10px] font-semibold uppercase tracking-caps text-gold-600 dark:text-gold-400">Reunion 2026</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAuthenticated && (
                <Link to="/cart" className="relative p-2 text-ink-soft hover:text-forest-700 dark:text-slate-300 dark:hover:text-white transition-colors" aria-label="Cart">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-ink text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                <div className="relative flex items-center gap-2">
                  {/* Bell — decorative for now; wired to announcements later */}
                  <Link to="/news" className="p-2 text-ink-soft hover:text-forest-700 dark:text-slate-300 dark:hover:text-white" aria-label="Notifications">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </Link>
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="hidden md:block text-sm text-ink-soft dark:text-slate-300">{user?.name?.split(' ')[0]}</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900/95 backdrop-blur-xl rounded-xl border border-forest-500/15 dark:border-white/10 shadow-xl py-2 overflow-hidden"
                      >
                        <Link to="/profile" className="block px-4 py-2 text-sm text-ink-soft hover:bg-forest-600/8 hover:text-ink dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" onClick={() => setProfileOpen(false)}>My Profile</Link>
                        <Link to="/agenda" className="block px-4 py-2 text-sm text-ink-soft hover:bg-forest-600/8 hover:text-ink dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white" onClick={() => setProfileOpen(false)}>My Portal</Link>
                        {isAdmin && (
                          <>
                            <hr className="my-1 border-forest-500/10 dark:border-white/10" />
                            <Link to="/admin" className="block px-4 py-2 text-sm text-gold-700 hover:bg-gold-500/10 dark:text-gold-400 dark:hover:bg-gold-400/10" onClick={() => setProfileOpen(false)}>
                              ⚙️ Admin Panel
                            </Link>
                          </>
                        )}
                        <hr className="my-1 border-forest-500/10 dark:border-white/10" />
                        <button
                          onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-400/10"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="nav-caps px-4 py-2 rounded-md bg-gold-500 hover:bg-gold-600 text-ink shadow-sm"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="nav-caps px-3 py-2 rounded-md border border-forest-600/40 text-forest-700 hover:bg-forest-600/8 dark:border-white/20 dark:text-slate-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile-only gold Sign In next to the hamburger (rect1an shows LOGIN here) */}
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="sm:hidden nav-caps px-3 py-2 rounded-md bg-gold-500 hover:bg-gold-600 text-ink shadow-sm"
                >
                  Sign In
                </button>
              )}
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-ink-soft hover:text-forest-700 dark:text-slate-300 dark:hover:text-white"
                aria-label="Toggle navigation"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-cream-50/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-forest-500/10 dark:border-white/5 overflow-hidden"
          >
            <nav className="w-full px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'nav-caps px-4 py-3 rounded-xl transition-colors',
                    isActive(link.path)
                      ? 'text-forest-700 bg-forest-600/8 dark:text-gold-400 dark:bg-gold-400/10'
                      : 'text-ink-soft hover:text-forest-700 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-forest-500/10 dark:border-white/10">
                  <button
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="nav-caps flex-1 px-3 py-2.5 rounded-md bg-gold-500 text-ink"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setMobileOpen(false); }}
                    className="nav-caps flex-1 px-3 py-2.5 rounded-md border border-forest-600/40 text-forest-700 dark:border-white/20 dark:text-slate-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
