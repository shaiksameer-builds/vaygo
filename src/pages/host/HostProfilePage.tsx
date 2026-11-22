import { ShieldCheck, Car, Key, CreditCard } from 'lucide-react';
import { useAuth, useApp } from '../../context/AppContext';
import ProfileManager from '../../components/profile/ProfileManager';

export default function HostProfilePage() {
  const { currentUser } = useAuth();
  const { vehicles, getBookingsForHost } = useApp();

  const myVehicles = vehicles.filter((v) => v.hostId === currentUser?.id);
  const myBookings = currentUser ? getBookingsForHost(currentUser.id) : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Host Profile</h1>
            <p className="text-[#A1A1AA] text-sm mt-0.5">Manage your personal and hosting account details.</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-[#A1A1AA]">
            <ShieldCheck size={14} className="text-white" />
            <span className="font-semibold text-white">Verified Host</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProfileManager>
          {/* Hosting Summary & Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl glass-card border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center">
                <Car size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{myVehicles.length}</div>
                <div className="text-xs text-[#A1A1AA]">Listed Vehicles</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl glass-card border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center">
                <Key size={18} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{myBookings.length}</div>
                <div className="text-xs text-[#A1A1AA]">Total Bookings</div>
              </div>
            </div>
          </div>

          {/* Payout method card */}
          <div className="glass-card rounded-2xl p-4 border border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-white" />
              <div>
                <div className="text-xs font-bold text-white">Default Payout Method</div>
                <div className="text-[11px] text-[#A1A1AA]">Direct UPI / Bank IMPS Settlement</div>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full border border-white/20 bg-white/5">
              Active
            </span>
          </div>
        </ProfileManager>
      </div>
    </div>
  );
}
