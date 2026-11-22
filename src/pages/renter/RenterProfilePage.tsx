import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AppContext';
import ProfileManager from '../../components/profile/ProfileManager';

export default function RenterProfilePage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-[#0A0A0A] border-b border-white/10 px-4 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Renter Profile</h1>
            <p className="text-[#A1A1AA] text-sm mt-0.5">Manage your personal information, photo, and account security.</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs text-[#A1A1AA]">
            <Shield size={13} className="text-white" />
            <span className="font-semibold text-white">Verified Renter</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ProfileManager>
          {/* Quick Renter Overview */}
          <div className="glass-card rounded-2xl p-5 border border-white/15 flex items-center justify-between">
            <div>
              <div className="text-xs text-[#A1A1AA] font-bold uppercase tracking-wider">Account Role</div>
              <div className="text-white font-extrabold text-base mt-0.5">Verified Renter</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#A1A1AA] font-bold uppercase tracking-wider">Member Since</div>
              <div className="text-white font-semibold text-xs mt-0.5">
                {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </ProfileManager>
      </div>
    </div>
  );
}
