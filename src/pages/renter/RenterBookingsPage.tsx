import { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, Calendar } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-white/10 text-white border-white/20',
  accepted: 'bg-white/20 text-white border-white/30',
  rejected: 'bg-white/5 text-[#A1A1AA] border-white/10',
  cancelled: 'bg-white/5 text-[#A1A1AA] border-white/10',
  completed: 'bg-white/5 text-[#A1A1AA] border-white/10',
};

export default function RenterBookingsPage() {
  const { currentUser } = useAuth();
  const { getBookingsForRenter, updateBookingStatus, vehicles } = useApp();
  const [tab, setTab] = useState<'active' | 'history'>('active');
  const [cancelling, setCancelling] = useState<string | null>(null);

  const myBookings = currentUser ? getBookingsForRenter(currentUser.id) : [];
  const active = myBookings.filter(b => b.status === 'pending' || b.status === 'accepted');
  const history = myBookings.filter(b => !['pending', 'accepted'].includes(b.status));

  const displayList = tab === 'active' ? active : history;

  const handleCancel = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    setCancelling(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">My Bookings</h1>
          <p className="text-[#A1A1AA] text-sm">{myBookings.length} total booking{myBookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {(['active', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${tab === t ? 'bg-white text-black border-white' : 'border-white/20 text-[#A1A1AA] hover:text-white hover:border-white/40'}`}>
              {t === 'active' ? `Active & Pending (${active.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {displayList.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
            <Calendar size={36} className="text-white/30 mx-auto mb-3" />
            <p className="text-[#A1A1AA] text-sm">
              {tab === 'active' ? 'No active or pending bookings.' : 'No booking history yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayList.map((b, i) => {
              const vehicle = vehicles.find(v => v.id === b.vehicleId);
              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {vehicle && (
                      <img src={vehicle.images[0]} alt={vehicle.model}
                        className="w-full sm:w-40 h-40 sm:h-auto object-cover shrink-0" />
                    )}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="font-black text-white text-base">{vehicle?.brand} {vehicle?.model}</div>
                          <div className="text-[#A1A1AA] text-xs mt-0.5">{vehicle?.area}, {vehicle?.city}</div>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[b.status] || ''}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-4">
                        <div><span className="text-[#A1A1AA]">Reference: </span><span className="text-white font-bold">{b.referenceNumber}</span></div>
                        <div><span className="text-[#A1A1AA]">Mode: </span><span className="text-white capitalize">{b.rentalMode.replace('-', ' ')}</span></div>
                        <div><span className="text-[#A1A1AA]">Start: </span><span className="text-white">{fmt(b.startDateTime)}</span></div>
                        <div><span className="text-[#A1A1AA]">End: </span><span className="text-white">{fmt(b.endDateTime)}</span></div>
                        <div><span className="text-[#A1A1AA]">Duration: </span><span className="text-white">{b.durationHours} hrs</span></div>
                        <div><span className="text-[#A1A1AA]">Total: </span><span className="text-white font-black">₹{b.totalAmount.toLocaleString('en-IN')}</span></div>
                      </div>

                      {b.hostNote && (
                        <div className="text-xs text-[#A1A1AA] glass-pill px-3 py-1.5 rounded-xl mb-3 border border-white/10">
                          <span className="text-white font-semibold">Host note:</span> {b.hostNote}
                        </div>
                      )}

                      {b.status === 'pending' && (
                        <>
                          {cancelling === b.id ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleCancel(b.id)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200">
                                <XCircle size={13} />Confirm Cancel
                              </button>
                              <button onClick={() => setCancelling(null)}
                                className="px-4 py-2 rounded-xl glass-card border border-white/20 text-white font-semibold text-xs cursor-pointer hover:bg-white/10">
                                Keep Booking
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setCancelling(b.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-card border border-white/20 text-[#A1A1AA] font-semibold text-xs cursor-pointer hover:text-white hover:border-white/40">
                              <XCircle size={13} />Cancel Request
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
