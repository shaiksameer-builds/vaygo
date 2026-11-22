import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, CheckCircle2, Calendar } from 'lucide-react';
import { useApp, useAuth } from '../../context/AppContext';

function pad(n: number) { return String(n).padStart(2, '0'); }
function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HostEarningsPage() {
  const { currentUser } = useAuth();
  const { getBookingsForHost, vehicles } = useApp();

  const allBookings = currentUser ? getBookingsForHost(currentUser.id) : [];
  const completedBookings = allBookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const earningsByVehicle = vehicles
    .filter(v => v.hostId === currentUser?.id)
    .map(v => {
      const vBookings = completedBookings.filter(b => b.vehicleId === v.id);
      const earned = vBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      return { vehicle: v, count: vBookings.length, earned };
    });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#A1A1AA] text-xs font-semibold uppercase tracking-widest mb-1">Financial Overview</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Host Earnings & Payouts</h1>
          <p className="text-[#A1A1AA] text-sm mt-0.5">Earnings are credited from successfully completed trips.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 border border-white/15">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Total Net Earnings</span>
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">₹{totalEarnings.toLocaleString('en-IN')}</div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">From {completedBookings.length} completed booking{completedBookings.length !== 1 ? 's' : ''}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="glass-card rounded-2xl p-6 border border-white/15">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Completed Trips</span>
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">{completedBookings.length}</div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">100% verified settlement</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 border border-white/15">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">Average / Trip</span>
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center">
                <DollarSign size={18} className="text-white" />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              ₹{completedBookings.length > 0 ? Math.round(totalEarnings / completedBookings.length).toLocaleString('en-IN') : 0}
            </div>
            <p className="text-[11px] text-[#A1A1AA] mt-1">Based on hourly rates</p>
          </motion.div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-white/15">
          <h2 className="text-base font-black text-white mb-4">Earnings by Vehicle</h2>
          <div className="space-y-3">
            {earningsByVehicle.map(({ vehicle, count, earned }) => (
              <div key={vehicle.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 border border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={vehicle.images[0]} alt={vehicle.model} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-white text-sm truncate">{vehicle.brand} {vehicle.model}</div>
                    <div className="text-xs text-[#A1A1AA]">{vehicle.registrationNumber} · {vehicle.area}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-black text-base">₹{earned.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-[#A1A1AA]">{count} completed trip{count !== 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-black text-white mb-4">Completed Bookings History</h2>
          {completedBookings.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center border border-white/10">
              <Calendar size={32} className="text-white/30 mx-auto mb-3" />
              <p className="text-[#A1A1AA] text-sm">No completed bookings yet.</p>
              <p className="text-[#A1A1AA] text-xs mt-1">When accepted bookings are marked as completed, their earnings will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedBookings.map(b => {
                const v = vehicles.find(x => x.id === b.vehicleId);
                return (
                  <div key={b.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-4 border border-white/10">
                    <div>
                      <div className="font-bold text-white text-sm">{v?.brand} {v?.model}</div>
                      <div className="text-xs text-[#A1A1AA] mt-0.5">Ref: {b.referenceNumber} · {fmt(b.startDateTime)} to {fmt(b.endDateTime)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-black text-base">₹{b.totalAmount.toLocaleString('en-IN')}</div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/5 text-[#A1A1AA] border-white/10">
                        Settled
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
