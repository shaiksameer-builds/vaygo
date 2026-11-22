import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Star, MapPin, Bell, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
import { vehicles } from '../../data/vehicles';
import VehicleCard from '../../components/vehicle/VehicleCard';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';

const RenterDashboard: React.FC = () => {
  const available = vehicles.filter((v) => v.available);

  return (
    <div className="min-h-screen bg-[#000000] text-white textured-surface">
      <Navbar />
      <div className="pt-20">
        {/* Welcome banner */}
        <div className="bg-[#0A0A0A] py-14 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
                <Compass size={14} className="text-white" />
                <span>Renter Dashboard</span>
              </div>
              <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight">Ready For Your Next Journey?</h1>
              <p className="text-[#A1A1AA] mt-2 text-sm">Browse verified bikes, scooters and cars ready for instant pickup near you.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="relative w-11 h-11 rounded-2xl glass-card flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-white rounded-full ring-2 ring-black" />
              </button>
              <div className="flex items-center gap-2.5 glass-card px-3.5 py-1.5 rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-white/20"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Arjun M.</div>
                  <div className="text-[10px] text-[#A1A1AA] font-semibold flex items-center gap-1">
                    <ShieldCheck size={11} className="text-white" />
                    <span>KYC Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Search, label: 'Search Vehicles', href: '/vehicles' },
              { icon: Heart, label: 'Saved Rides (2)', href: '#' },
              { icon: Star, label: 'Active Bookings (1)', href: '#' },
              { icon: MapPin, label: 'Nearby Hubs', href: '#' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all group shadow-lg text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <action.icon size={22} className="stroke-[2.2]" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Available vehicles */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Available in Bangalore Right Now</h2>
              <p className="text-xs text-[#A1A1AA] mt-0.5">Instant booking with doorstep delivery or hub pickup</p>
            </div>
            <Link to="/vehicles" className="text-white hover:text-neutral-300 font-bold text-xs hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {available.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} index={i} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RenterDashboard;
