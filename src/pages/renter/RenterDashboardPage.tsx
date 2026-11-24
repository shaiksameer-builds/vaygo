import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, ArrowUpRight, Clock, Star, MapPin } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import type { Booking } from '../../types';

function StatusBadge({ status }: { status: Booking['status'] }) {
  const map: Record<string, string> = {
    pending: 'bg-white/10 text-white border-white/20',
    accepted: 'bg-white/20 text-white border-white/30',
    completed: 'bg-white/5 text-[#A1A1AA] border-white/10',
    cancelled: 'bg-white/5 text-[#A1A1AA] border-white/10',
    rejected: 'bg-white/5 text-[#A1A1AA] border-white/10',
  };
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${map[status] || 'bg-white/5 text-[#A1A1AA] border-white/10'}`}>
      {status}
    </span>
  );
}

export default function RenterDashboardPage() {
  const { currentUser } = useAuth();
  const { vehicles, refreshVehicles, getBookingsForRenter } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    refreshVehicles();
    const handleUpdate = () => refreshVehicles();
    window.addEventListener('vaygo:vehicles', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vaygo:vehicles', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshVehicles]);

  const myBookings = currentUser ? getBookingsForRenter(currentUser.id) : [];
  const activeBookings = myBookings.filter(b => b.status === 'pending' || b.status === 'accepted');
  const availableVehicles = useMemo(() => {
    return [...vehicles]
      .filter(v => v.isActive !== false)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-1">Renter Dashboard</p>
          <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight mb-1">
            Hello, {currentUser?.name?.split(' ')[0]}.
          </h1>
          <p className="text-[#A1A1AA] text-sm">Browse verified vehicles and manage your bookings.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/renter/search"
            className="group glass-card rounded-2xl p-6 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all text-center border border-white/15 hover:border-white/30">
            <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-neutral-100 flex items-center justify-center transition-colors">
              <Search size={22} className="text-black" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">Find Vehicles</div>
              <div className="text-[#A1A1AA] text-xs mt-0.5">Search by location & time</div>
            </div>
          </Link>
          <Link to="/renter/bookings"
            className="group glass-card rounded-2xl p-6 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all text-center border border-white/15 hover:border-white/30">
            <div className="w-12 h-12 rounded-xl bg-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.15] transition-colors">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm">My Bookings</div>
              <div className="text-[#A1A1AA] text-xs mt-0.5">{myBookings.length} total booking{myBookings.length !== 1 ? 's' : ''}</div>
            </div>
          </Link>
        </div>

        {activeBookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">Active Bookings</h2>
              <Link to="/renter/bookings" className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1 transition-colors">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {activeBookings.slice(0, 3).map(booking => {
                const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                return (
                  <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4">
                    {vehicle && (
                      <img src={vehicle.images[0]} alt={vehicle.model}
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm truncate">{vehicle?.brand} {vehicle?.model}</div>
                      <div className="text-[#A1A1AA] text-xs mt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(booking.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(booking.endDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="mt-2 text-xs font-bold text-white">₹{booking.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-white">Available Vehicles</h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Search with location & time for best results</p>
            </div>
            <Link to="/renter/search" className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {availableVehicles.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-white/10">
              <p className="text-[#A1A1AA] text-sm">No vehicles listed yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableVehicles.map((v) => (
                <div key={v.id}
                  onClick={() => navigate(`/renter/search?vehicleId=${v.id}`)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all group border border-white/10 hover:border-white/25">
                  <div className="relative h-44 bg-[#0A0A0A]">
                    <img
                      src={v.images?.[0] || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80'}
                      alt={v.model}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/70 backdrop-blur-md text-white px-2 py-0.5 rounded-full border border-white/15">
                        {v.category}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/15">
                      <Star size={11} className="fill-white stroke-none" />
                      <span className="text-xs font-bold text-white">{(v.rating ?? 0) > 0 ? v.rating : 'New'}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-extrabold text-white text-sm truncate">{v.brand} {v.model}</h3>
                    <div className="flex items-center gap-1 text-[#A1A1AA] text-xs mt-1 mb-3">
                      <MapPin size={11} className="shrink-0" />
                      <span className="truncate">{v.area || v.location}, {v.city}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <span className="text-white font-black text-lg">₹{v.pricePerHour}</span>
                        <span className="text-[#A1A1AA] text-xs">/hr</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-all border border-white/15">
                        <ArrowUpRight size={15} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
