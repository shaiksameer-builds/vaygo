import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import Logo from '../common/Logo';
import { getCurrentSession, logoutUser } from '../../services/authService';
import type { User } from '../../types';

interface NavbarProps {
  onFaqClick?: () => void;
  onContactClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onFaqClick, onContactClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentSession());

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // Listen for scroll & local session changes
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    const updateSession = () => {
      setCurrentUser(getCurrentSession());
    };

    window.addEventListener('vaygo-session-change', updateSession);
    window.addEventListener('storage', updateSession);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('vaygo-session-change', updateSession);
      window.removeEventListener('storage', updateSession);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setShowProfileMenu(false);
    navigate('/');
  };

  const navBg = isHome
    ? scrolled
      ? 'bg-black/80 backdrop-blur-2xl border-b border-white/12 shadow-2xl'
      : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'
    : 'bg-black/90 backdrop-blur-2xl border-b border-white/12 shadow-2xl';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with stylized geometric V */}
          <Logo size="md" />

          {/* Desktop Navigation Links (How It Works completely removed) */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link
              to="/vehicles"
              className="text-[#A1A1AA] hover:text-white font-medium text-sm transition-colors hover:translate-y-[-1px]"
            >
              Vehicles
            </Link>

            <button
              onClick={() => {
                if (onFaqClick) onFaqClick();
                else {
                  const el = document.getElementById('faq-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#A1A1AA] hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              FAQ
            </button>

            <button
              onClick={() => {
                if (onContactClick) onContactClick();
                else {
                  const el = document.getElementById('contact-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-[#A1A1AA] hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Contact Us
            </button>

            <Link
              to="/owner"
              className="text-white font-semibold text-sm transition-colors flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 hover:border-white/35 hover:bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
            >
              <span>Partner with us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            </Link>
          </nav>

          {/* Right Action Icons: Bell + Profile / Auth */}
          <div className="hidden md:flex items-center gap-3.5">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotificationToast(!showNotificationToast);
                  setHasNotification(false);
                }}
                className="w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 backdrop-blur-xl flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={17} className="text-white/90" />
                {hasNotification && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white ring-2 ring-black" />
                )}
              </button>

              <AnimatePresence>
                {showNotificationToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl p-4 shadow-2xl z-50 text-white border border-white/15"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Notifications</span>
                      <span className="text-xs text-[#A1A1AA]">Just now</span>
                    </div>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">
                      Special weekend rate: Royal Enfield Classic 350 available at ₹470/day with 901 km included!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / User menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 backdrop-blur-xl transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={
                        currentUser.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
                      }
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-black"></span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight max-w-[100px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] capitalize">
                      {currentUser.role === 'owner' ? 'Host' : 'Renter'}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-[#A1A1AA]" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl p-2.5 shadow-2xl z-50 border border-white/15 text-white"
                    >
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <div className="font-bold text-xs truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-[#A1A1AA] truncate">{currentUser.email}</div>
                      </div>

                      <Link
                        to={currentUser.role === 'owner' ? '/owner' : '/home'}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition-colors"
                      >
                        <UserIcon size={14} />
                        <span>Go to Dashboard</span>
                      </Link>

                      {currentUser.role === 'renter' && (
                        <Link
                          to="/owner"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition-colors"
                        >
                          <span>Switch to Host View</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={14} />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-white hover:text-white font-semibold text-xs px-3.5 py-2 rounded-xl border border-white/15 hover:border-white/30 transition-all hover:bg-white/[0.06]"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="bg-white hover:bg-neutral-200 text-black font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-white/10 hover:scale-[1.03] active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 rounded-xl bg-white/[0.06] border border-white/15 backdrop-blur-xl hover:bg-white/[0.12] transition-colors cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (How It Works removed) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-white/12"
          >
            <div className="px-5 py-6 flex flex-col gap-3">
              <Link
                to="/vehicles"
                onClick={() => setIsOpen(false)}
                className="text-white font-medium py-2 px-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Browse Vehicles
              </Link>
              <a
                href="#faq-section"
                onClick={() => setIsOpen(false)}
                className="text-[#A1A1AA] font-medium py-2 px-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact-section"
                onClick={() => setIsOpen(false)}
                className="text-[#A1A1AA] font-medium py-2 px-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
              <Link
                to="/owner"
                onClick={() => setIsOpen(false)}
                className="text-white font-semibold py-2 px-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between"
              >
                <span>Partner with us (List Vehicle)</span>
                <span className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full">Earn ₹40k+</span>
              </Link>

              {currentUser ? (
                <div className="border-t border-white/12 mt-2 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <img
                      src={
                        currentUser.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'
                      }
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{currentUser.name}</div>
                      <div className="text-xs text-[#A1A1AA] capitalize">
                        {currentUser.role === 'owner' ? 'Host' : 'Renter'}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={currentUser.role === 'owner' ? '/owner' : '/home'}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-white/12 mt-2 pt-4 flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-neutral-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
