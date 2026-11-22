import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Inbox, TrendingUp, BookOpen, Plus, ArrowUpRight, Clock } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';

export default function HostDashboardPage() {
  const { currentUser } = useAuth();
  const { vehicles, getBookingsForHost, getRequestsForHost } = useApp();

  const myVehicles = vehicles.filter(v => v.hostId === currentUser?.id);
  const myBookings = currentUser ? getBookingsForHost(currentUser.id) : [];
  const pendingRequests = currentUser ? getRequestsForHost(currentUser.id) : [];

  const activeVehicles = myVehicles.filter(v => v.isActive);
  const earnings = myBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.totalAmount, 0);
  const accepted = myBookings.filter(b => b.status === 'accepted');

  const stats = [
    { label: 'Listed Vehicles', value: myVehicles.length, sub: `${activeVehicles.length} active`, icon: Car, href: '/host/vehicles' },
    { label: 'Pending Requests', value: pendingRequests.length, sub: 'Awaiting decision', icon: Inbox, href: '/host/requests' },
    { label: 'Accepted Bookings', value: accepted.length, sub: 'All time', icon: BookOpen, href: '/host/bookings' },
    { label: 'Total Earnings', value: `₹${earnings.toLocaleString('en-IN')}`, sub: 'From completed bookings', icon: TrendingUp, href: '/host/earnings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-1">Host Dashboard</p>
            <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight">Hello, {currentUser?.name?.split(' ')[0]}.</h1>
            <p className="text-[#A1A1AA] text-sm mt-1">Manage your fleet and handle rental requests.</p>
          </div>
          <Link to="/host/vehicles/add"
            className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-5 py-3 rounded-xl transition-all shadow-lg hover:scale-[1.02] shrink-0">
            <Plus size={16} />Add Vehicle
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={s.href} className="block glass-card rounded-2xl p-5 hover:-translate-y-1 transition-all border border-white/10 hover:border-white/25">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">{s.label}</span>
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center">
                    <s.icon size={16} className="text-white" />
                  </div>
                </div>
                <div className="text-white font-black text-2xl sm:text-3xl">{s.value}</div>
                <div className="text-[#A1A1AA] text-xs mt-1">{s.sub}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {pendingRequests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">Pending Requests</h2>
              <Link to="/host/requests" className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1 transition-colors">
                View all <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map(b => {
                const v = vehicles.find(x => x.id === b.vehicleId);
                return (
                  <div key={b.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                    {v && <img src={v.images[0]} alt={v.model} className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-sm truncate">{v?.brand} {v?.model}</div>
                      <div className="text-[#A1A1AA] text-xs mt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(b.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {' — '}
                        {new Date(b.endDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </div>
                      <div className="text-xs font-bold text-white mt-1">₹{b.totalAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border bg-white/10 text-white border-white/20 shrink-0">
                      pending
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="glass-panel rounded-2xl p-6 border border-white/15">
          <h2 className="text-base font-black text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Add a Vehicle', desc: 'List a new bike, car or auto', href: '/host/vehicles/add' },
              { label: 'View Requests', desc: `${pendingRequests.length} pending decisions`, href: '/host/requests' },
              { label: 'View Earnings', desc: 'Your payout summary', href: '/host/earnings' },
            ].map(a => (
              <Link key={a.label} to={a.href}
                className="group flex items-center justify-between p-4 rounded-xl glass-card hover:bg-white/[0.08] transition-all border border-white/10">
                <div>
                  <div className="font-bold text-white text-sm">{a.label}</div>
                  <div className="text-[#A1A1AA] text-xs mt-0.5">{a.desc}</div>
                </div>
                <ArrowUpRight size={15} className="text-[#A1A1AA] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
