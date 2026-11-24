import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import type { BookingStatus } from '../../types';

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: 'bg-white/10 text-white border-white/20',
  accepted: 'bg-white/20 text-white border-white/30',
  completed: 'bg-white/5 text-[#A1A1AA] border-white/10',
  rejected: 'bg-white/5 text-[#A1A1AA] border-white/10',
  cancelled: 'bg-white/5 text-[#A1A1AA] border-white/10',
};

const TABS: { label: string; statuses: BookingStatus[] }[] = [
  { label: 'All', statuses: ['pending', 'accepted', 'completed', 'rejected', 'cancelled'] },
  { label: 'Pending', statuses: ['pending'] },
  { label: 'Accepted', statuses: ['accepted'] },
  { label: 'Completed', statuses: ['completed'] },
  { label: 'Rejected / Cancelled', statuses: ['rejected', 'cancelled'] },
];

export default function HostBookingsPage() {
  const { currentUser } = useAuth();
  const { getBookingsForHost, vehicles, updateBookingStatus, refreshBookings, refreshVehicles } = useApp();
  const [tab, setTab] = useState(0);

  useEffect(() => {
    refreshBookings();
    refreshVehicles();
    const handleUpdate = () => {
      refreshBookings();
      refreshVehicles();
    };
    window.addEventListener('vaygo:bookings', handleUpdate);
    window.addEventListener('vaygo:vehicles', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('vaygo:bookings', handleUpdate);
      window.removeEventListener('vaygo:vehicles', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshBookings, refreshVehicles]);

  const all = currentUser ? getBookingsForHost(currentUser.id) : [];
  const filtered = all.filter(b => TABS[tab].statuses.includes(b.status));

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black text-white tracking-tight">Bookings</h1>
          <p className="text-[#A1A1AA] text-sm mt-0.5">{all.length} total bookings</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map((t, i) => (
            <button key={t.label} onClick={() => setTab(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${tab === i ? 'bg-white text-black border-white' : 'border-white/20 text-[#A1A1AA] hover:text-white hover:border-white/40'}`}>
              {t.label} ({all.filter(b => t.statuses.includes(b.status)).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
            <BookOpen size={32} className="text-white/30 mx-auto mb-3" />
            <p className="text-[#A1A1AA] text-sm">No bookings in this category.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b, i) => {
              const v = vehicles.find(x => x.id === b.vehicleId);
              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col sm:flex-row">
                  {v && <img src={v.images[0]} alt={v.model} className="w-full sm:w-40 h-36 sm:h-auto object-cover shrink-0" />}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="font-black text-white">{v?.brand} {v?.model}</div>
                        <div className="text-[#A1A1AA] text-xs mt-0.5">{v?.area}, {v?.city}</div>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div><span className="text-[#A1A1AA]">Ref: </span><span className="text-white font-bold">{b.referenceNumber}</span></div>
                      <div><span className="text-[#A1A1AA]">Total: </span><span className="text-white font-black">₹{b.totalAmount.toLocaleString('en-IN')}</span></div>
                      <div><span className="text-[#A1A1AA]">Start: </span><span className="text-white">{fmt(b.startDateTime)}</span></div>
                      <div><span className="text-[#A1A1AA]">End: </span><span className="text-white">{fmt(b.endDateTime)}</span></div>
                      <div><span className="text-[#A1A1AA]">Duration: </span><span className="text-white">{b.durationHours} hrs</span></div>
                      <div><span className="text-[#A1A1AA]">Mode: </span><span className="text-white capitalize">{b.rentalMode.replace('-', ' ')}</span></div>
                    </div>
                    {b.status === 'accepted' && (
                      <button onClick={() => updateBookingStatus(b.id, 'completed')}
                        className="mt-3 px-4 py-1.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200 transition-all">
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
