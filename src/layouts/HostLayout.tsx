import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Car, Plus, Inbox, BookOpen, TrendingUp, User as UserIcon,
  LogOut, Menu, Search,
} from 'lucide-react';
import { useAuth, useApp } from '../context/AppContext';
import Logo from '../components/common/Logo';

const navItems = [
  { label: 'Dashboard', path: '/host/dashboard', icon: Home },
  { label: 'My Vehicles', path: '/host/vehicles', icon: Car },
  { label: 'Add Vehicle', path: '/host/vehicles/add', icon: Plus },
  { label: 'Renter Dashboard', path: '/renter/dashboard', icon: Search },
  { label: 'Requests', path: '/host/requests', icon: Inbox },
  { label: 'Bookings', path: '/host/bookings', icon: BookOpen },
  { label: 'Earnings', path: '/host/earnings', icon: TrendingUp },
  { label: 'Profile', path: '/host/profile', icon: UserIcon },
];

export default function HostLayout() {
  const { currentUser, logout } = useAuth();
  const { getRequestsForHost } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingCount = currentUser ? getRequestsForHost(currentUser.id).length : 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path || (item.path !== '/host/dashboard' && location.pathname.startsWith(item.path));
          const badge = item.path === '/host/requests' && pendingCount > 0 ? pendingCount : null;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-white text-black shadow-lg'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <item.icon size={16} />
              <span className="flex-1">{item.label}</span>
              {badge && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${active ? 'bg-black text-white' : 'bg-white text-black'}`}>
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80'}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-xs text-white truncate">{currentUser?.name}</div>
            <div className="text-[10px] text-[#A1A1AA] truncate">{currentUser?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#0A0A0A] border-r border-white/10 fixed top-0 left-0 h-full z-40">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-[#0A0A0A] border-r border-white/10 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/10 h-14 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl glass-card border border-white/15 cursor-pointer"
          >
            <Menu size={18} />
          </button>
          <Logo size="sm" />
          <div className="w-10" />
        </div>

        <main className="flex-1 pt-14 lg:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
