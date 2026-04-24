import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { NAV_LINKS, EVENT_CONFIG } from '../../data/constants';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

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
      'px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap',
      isActive(path)
        ? 'text-gold-400 bg-gold-400/10'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    );

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <img src={EVENT_CONFIG.logoUrl} alt="REConverge 2001" className="w-9 h-9 rounded-lg object-contain" />
              <div className="hidden sm:block">
                <p className="text-white font-heading font-semibold text-sm leading-tight">REConverge 2001</p>
                <p className="text-gold-400 text-xs">{EVENT_CONFIG.collegeShort} Calicut - Class of 2001</p>
              </div>
            </Link>

            {/* Desktop — Public nav (shown at 2xl+) */}
            <nav className="hidden 2xl:flex items-center gap-1 flex-1 justify-start ml-4 overflow-hidden">
              {NAV_LINKS.map((link) => (
                <Link key={link.path} to={link.path} className={navLinkClass(link.path)}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Cart (auth only) */}
              {isAuthenticated && (
                <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-primary-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth avatar or Sign-in buttons */}
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="hidden md:block text-sm text-slate-300">{user?.name?.split(' ')[0]}</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl py-2 overflow-hidden"
                      >
                        <Link to="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setProfileOpen(false)}>My Profile</Link>
                        <Link to="/agenda" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white" onClick={() => setProfileOpen(false)}>My Portal</Link>
                        {isAdmin && (
                          <>
                            <hr className="my-1 border-white/10" />
                            <Link to="/admin" className="block px-4 py-2 text-sm text-gold-400 hover:bg-gold-400/10 hover:text-gold-300" onClick={() => setProfileOpen(false)}>
                              ⚙️ Admin Panel
                            </Link>
                          </>
                        )}
                        <hr className="my-1 border-white/10" />
                        <button
                          onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign In</Button>
                  <Button size="sm" onClick={() => navigate('/register')}>Register</Button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="2xl:hidden p-2 text-slate-300 hover:text-white"
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

      {/* Mobile Nav Drawer — PUBLIC links only. The My Portal sub-bar (rendered
          inside PortalLayout) carries the auth-required items for mobile too. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="2xl:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 text-sm rounded-xl transition-colors',
                    isActive(link.path)
                      ? 'text-gold-400 bg-gold-400/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                  <Button variant="ghost" size="sm" fullWidth onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign In</Button>
                  <Button size="sm" fullWidth onClick={() => { navigate('/register'); setMobileOpen(false); }}>Register</Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
