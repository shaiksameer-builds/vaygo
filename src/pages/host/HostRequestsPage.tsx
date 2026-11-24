import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Inbox, Clock, User } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';
import { getUsers } from '../../services/store';

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HostRequestsPage() {
  const { currentUser } = useAuth();
  const { getRequestsForHost, vehicles, updateBookingStatus, getBookingsForHost, refreshBookings, refreshVehicles } = useApp();
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

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

  const pending = currentUser ? getRequestsForHost(currentUser.id) : [];
  const allUsers = getUsers();

  const getUser = (renterId: string) => allUsers.find(u => u.id === renterId);

  const hasConflict = (booking: typeof pending[0]): boolean => {
    const accepted = getBookingsForHost(currentUser!.id).filter(
      b => b.status === 'accepted' && b.vehicleId === booking.vehicleId && b.id !== booking.id
    );
    const newStart = new Date(booking.startDateTime).getTime();
    const newEnd = new Date(booking.endDateTime).getTime();
    return accepted.some(b => {
      const s = new Date(b.startDateTime).getTime();
      const e = new Date(b.endDateTime).getTime();
      return !(newEnd <= s || newStart >= e);
    });
  };

  const handleAccept = (bookingId: string) => {
    setProcessing(bookingId);
    updateBookingStatus(bookingId, 'accepted');
    setProcessing(null);
  };

  const handleReject = (bookingId: string) => {
    setProcessing(bookingId);
    updateBookingStatus(bookingId, 'rejected', rejectNote || undefined);
    setShowRejectInput(null);
    setRejectNote('');
    setProcessing(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-white tracking-tight">Booking Requests</h1>
          <p className="text-[#A1A1AA] text-sm mt-0.5">{pending.length} pending request{pending.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {pending.length === 0 ? (
          <div className="glass-card rounded-2xl p-14 text-center border border-white/10">
            <Inbox size={36} className="text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-black text-lg mb-2">No pending requests</h3>
            <p className="text-[#A1A1AA] text-sm">New booking requests will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pending.map((b, i) => {
              const vehicle = vehicles.find(v => v.id === b.vehicleId);
              const renter = getUser(b.renterId);
              const conflict = hasConflict(b);

              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl border border-white/15 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    {vehicle && (
                      <img src={vehicle.images[0]} alt={vehicle.model}
                        className="w-full sm:w-44 h-40 sm:h-auto object-cover shrink-0" />
                    )}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-black text-white text-base">{vehicle?.brand} {vehicle?.model}</h3>
                          <div className="text-[#A1A1AA] text-xs mt-0.5">{vehicle?.area}, {vehicle?.city}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-white font-black text-xl">₹{b.totalAmount.toLocaleString('en-IN')}</div>
                          <div className="text-[#A1A1AA] text-xs">{b.durationHours} hrs · {b.rentalMode.replace('-', ' ')}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-4">
                        <div className="flex items-center gap-1.5"><Clock size={11} className="text-[#A1A1AA]" /><span className="text-[#A1A1AA]">Start:</span><span className="text-white ml-1">{fmt(b.startDateTime)}</span></div>
                        <div className="flex items-center gap-1.5"><Clock size={11} className="text-[#A1A1AA]" /><span className="text-[#A1A1AA]">End:</span><span className="text-white ml-1">{fmt(b.endDateTime)}</span></div>
                        <div><span className="text-[#A1A1AA]">Reference: </span><span className="text-white font-bold">{b.referenceNumber}</span></div>
                        <div><span className="text-[#A1A1AA]">Mode: </span><span className="text-white capitalize">{b.rentalMode.replace('-', ' ')}</span></div>
                      </div>

                      {renter && (
                        <div className="glass-pill rounded-xl px-3 py-2 mb-4 flex items-center gap-3 border border-white/10">
                          <User size={14} className="text-[#A1A1AA] shrink-0" />
                          <div>
                            <div className="text-white text-xs font-bold">{renter.name}</div>
                            <div className="flex items-center gap-2 text-[10px] text-[#A1A1AA] mt-0.5">
                              <span>{renter.email}</span>
                              {renter.phone && <><span>·</span><span>+91 {renter.phone}</span></>}
                            </div>
                          </div>
                        </div>
                      )}

                      {conflict && (
                        <div className="text-xs text-neutral-400 flex items-center gap-1.5 mb-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/10">
                          <X size={13} />
                          This time slot conflicts with another accepted booking. Accepting will override.
                        </div>
                      )}

                      {showRejectInput === b.id ? (
                        <div className="mb-3">
                          <input value={rejectNote} onChange={e => setRejectNote(e.target.value)}
                            placeholder="Optional: reason for rejection"
                            className="w-full h-9 px-3 rounded-xl border border-white/20 bg-white/[0.04] text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-white/40 mb-2" />
                          <div className="flex gap-2">
                            <button onClick={() => handleReject(b.id)} disabled={processing === b.id}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200 disabled:opacity-50">
                              <X size={13} />Confirm Reject
                            </button>
                            <button onClick={() => { setShowRejectInput(null); setRejectNote(''); }}
                              className="px-4 py-2 rounded-xl glass-card border border-white/20 text-white font-semibold text-xs cursor-pointer">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button onClick={() => handleAccept(b.id)} disabled={processing === b.id}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs cursor-pointer hover:bg-neutral-200 transition-all disabled:opacity-50">
                            <Check size={14} />Accept
                          </button>
                          <button onClick={() => setShowRejectInput(b.id)} disabled={processing === b.id}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl glass-card border border-white/25 text-[#A1A1AA] font-semibold text-xs cursor-pointer hover:text-white hover:border-white/50 transition-all disabled:opacity-50">
                            <X size={14} />Reject
                          </button>
                        </div>
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
