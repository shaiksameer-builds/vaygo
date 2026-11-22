import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, BookOpen, User as UserIcon, LogOut,
  ChevronDown, Menu, X, Home,
} from 'lucide-react';
import { useAuth } from '../context/AppContext';
import Logo from '../components/common/Logo';

const navItems = [
  { label: 'Dashboard', path: '/renter/dashboard', icon: Home },
  { label: 'Find Vehicles', path: '/renter/search', icon: Search },
  { label: 'My Bookings', path: '/renter/bookings', icon: BookOpen },
];

export default function RenterLayout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-2xl border-b border-white/10 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-white text-black'
                        : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <item.icon size={14} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-white/15 hover:border-white/30 transition-all cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                  alt="avatar"
                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                />
                <span className="text-xs font-bold text-white max-w-[80px] truncate hidden sm:block">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} className="text-[#A1A1AA]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl p-1.5 shadow-2xl z-50 border border-white/15 text-white">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <div className="font-bold text-xs">{currentUser?.name}</div>
                    <div className="text-[11px] text-[#A1A1AA] truncate">{currentUser?.email}</div>
                    <div className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">Renter</div>
                  </div>
                  {[
                    { label: 'My Profile', path: '/renter/profile', icon: UserIcon },
                    { label: 'My Bookings', path: '/renter/bookings', icon: BookOpen },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition-colors"
                    >
                      <item.icon size={14} className="text-[#A1A1AA]" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-xl glass-card border border-white/15 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-2xl border-t border-white/10 px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer text-left"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
