import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Car, Calendar, Star, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';

const stats = [
  { label: 'Monthly Earnings', value: '₹24,800', delta: '+31%', icon: TrendingUp },
  { label: 'Listed Vehicles', value: '3', delta: 'All Active', icon: Car },
  { label: 'Upcoming Bookings', value: '5', delta: 'Next 7 days', icon: Calendar },
  { label: 'Avg Rating', value: '4.9★', delta: '89 reviews', icon: Star },
];

const OwnerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white textured-surface">
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-[#0A0A0A] py-14 px-4 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
                <ShieldCheck size={14} className="text-white" />
                <span>Partner Portal · Host Management</span>
              </div>
              <h1 className="text-white font-black text-3xl sm:text-4xl tracking-tight">Manage Your Fleet</h1>
              <p className="text-[#A1A1AA] mt-2 text-sm">Monitor daily earnings, incoming rental requests and live bookings.</p>
            </div>
            <button className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-xl shadow-white/10 hover:scale-[1.02] cursor-pointer">
              <Plus size={18} />
              <span>List New Vehicle</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#A1A1AA] text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                    <stat.icon size={18} />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold mt-1.5 text-[#A1A1AA]">{stat.delta}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <div className="glass-panel rounded-3xl p-7 border border-white/10 mb-10 shadow-lg">
            <h2 className="text-lg font-black text-white mb-5">Host Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'List a Vehicle', desc: 'Add bike, scooter or car in 5 mins', href: '#' },
                { label: 'Booking Requests', desc: 'Accept or reschedule pending requests', href: '#' },
                { label: 'Payout Reports', desc: 'Direct bank transfer statements & KYC', href: '#' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="group flex items-center justify-between p-4.5 rounded-2xl glass-card hover:bg-white/[0.08] transition-all"
                >
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-neutral-200 transition-colors">{action.label}</div>
                    <div className="text-[#A1A1AA] text-xs mt-1">{action.desc}</div>
                  </div>
                  <ArrowRight size={16} className="text-[#A1A1AA] group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>

          {/* Live Listings Preview (Clean Vector Icon, No Emoji) */}
          <div className="text-center py-16 glass-card rounded-3xl border border-white/10 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center mx-auto mb-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Key size={30} className="stroke-[2]" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">3 Active Vehicles Earning</h3>
            <p className="text-[#A1A1AA] text-xs sm:text-sm mb-6 max-w-sm mx-auto">
              Your vehicles are generating passive income in Koramangala and Indiranagar.
            </p>
            <button className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg cursor-pointer">
              <Plus size={16} />
              <span>Add Another Vehicle</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
