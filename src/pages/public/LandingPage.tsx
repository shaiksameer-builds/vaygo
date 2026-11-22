import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Star, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroShowcase from '../../components/hero/HeroShowcase';
import VehicleCard from '../../components/vehicle/VehicleCard';
import FaqSection from '../../components/common/FaqSection';
import { vehicles, popularLocations } from '../../data/vehicles';
import { testimonials } from '../../data/testimonials';
import type { VehicleCategory } from '../../types';

/* ── Category Section (Monochrome Glass + Vivid Colour Photos) ── */
const categoryData = [
  {
    label: 'Bikes & Scooters',
    desc: 'Cruisers, sportbikes & urban commuters. Navigate traffic with agility and style.',
    count: 180,
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&q=80',
    value: 'bike' as VehicleCategory,
  },
  {
    label: 'Cars & SUVs',
    desc: 'Hatchbacks, executive sedans & 7-seater family SUVs. Self-drive or with verified chauffeur.',
    count: 220,
    img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&q=80',
    value: 'car' as VehicleCategory,
  },
];

const Categories: React.FC = () => (
  <section className="py-24 px-4 bg-[#000000] textured-surface" id="vehicles">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-white/80 font-bold text-xs uppercase tracking-widest glass-pill px-4 py-1.5 rounded-full">
          Select Fleet Category
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight">
          Every vehicle. One trusted platform.
        </h2>
        <p className="text-[#A1A1AA] mt-3 max-w-xl mx-auto text-sm leading-relaxed">
          Handpicked peer-to-peer fleet with verified documentation and zero security deposits.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoryData.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={`/vehicles?category=${cat.value}`}
              className="group relative overflow-hidden rounded-3xl h-80 flex flex-col justify-end p-8 cursor-pointer block glass-card border border-white/12 hover:border-white/30 shadow-2xl transition-all"
            >
              {/* Natural Colour Photography (NO GRAYSCALE) */}
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/20" />
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-black tracking-widest text-white/70 mb-1 block">
                  Category {i + 1}
                </span>
                <h3 className="text-white font-black text-2xl sm:text-3xl">{cat.label}</h3>
                <p className="text-neutral-200 text-xs sm:text-sm mt-2 leading-relaxed max-w-md">{cat.desc}</p>
                <div className="mt-5 flex items-center gap-2 text-white text-xs font-bold">
                  <span>Explore {cat.count}+ vehicles</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Featured Vehicles Section ──────────────────────────────── */
const FeaturedVehicles: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | VehicleCategory>('all');
  const filtered = vehicles
    .filter((v) => v.available && (activeTab === 'all' || v.category === activeTab))
    .slice(0, 4);

  return (
    <section className="py-24 px-4 bg-[#0A0A0A] border-y border-white/10 textured-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-5"
        >
          <div>
            <span className="text-white/80 font-bold text-xs uppercase tracking-widest glass-pill px-4 py-1.5 rounded-full">
              Verified Rental Fleet
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight">
              Popular Near You
            </h2>
          </div>

          {/* Filter Pills in Black & White */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { label: 'All Vehicles', val: 'all' },
              { label: 'Bikes & Scooters', val: 'bike' },
              { label: 'Cars & SUVs', val: 'car' },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => setActiveTab(t.val as 'all' | VehicleCategory)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === t.val
                    ? 'bg-white text-black shadow-lg shadow-white/10 font-extrabold'
                    : 'glass-card text-[#A1A1AA] hover:text-white border border-white/10'
                }`}
              >
                {t.label}
              </button>
            ))}
            <Link
              to="/vehicles"
              className="text-white hover:text-neutral-300 font-bold text-xs flex items-center gap-1.5 ml-3 whitespace-nowrap"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((vehicle, i) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Popular Locations (Natural Colour Photography) ──────────── */
const PopularLocations: React.FC = () => (
  <section className="py-24 px-4 bg-[#000000] textured-surface">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-white/80 font-bold text-xs uppercase tracking-widest glass-pill px-4 py-1.5 rounded-full">
          Metropolitan Hubs
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight">
          Available Across Major Cities
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {popularLocations.map((loc, i) => (
          <motion.div
            key={loc.city}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              to={`/vehicles?city=${loc.city}`}
              className="group relative overflow-hidden rounded-2xl h-48 flex flex-col justify-end p-5 block glass-card border border-white/12 hover:border-white/35 transition-all shadow-xl"
            >
              {/* Natural Colour Photography (NO GRAYSCALE) */}
              <img
                src={loc.image}
                alt={loc.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-white font-bold text-xl">{loc.city}</h3>
                <p className="text-[#A1A1AA] text-xs font-semibold">{loc.count}+ verified rides</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);


/* ── Partner with us / Become an Owner ──────────────────────── */
const BecomeOwner: React.FC = () => (
  <section className="py-24 px-4 bg-[#000000] textured-surface">
    <div className="max-w-7xl mx-auto">
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-14 lg:col-span-7 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full mb-3 w-fit">
              <Sparkles size={12} className="text-white" />
              <span className="text-white/80 font-bold text-xs uppercase tracking-widest">
                Partner with VAYGO
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Turn your parked vehicle<br />into passive monthly earnings.
            </h2>
            <p className="text-[#A1A1AA] mt-4 text-sm leading-relaxed max-w-lg">
              List your bike, scooter or car on Vaygo. We connect you with KYC-verified renters and provide comprehensive damage cover.
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                'Earn ₹5,000 to ₹40,000+ per month',
                '100% KYC verified renters only',
                'Comprehensive insurance coverage',
                'Real-time GPS security tracking',
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-white/90 text-xs font-medium">
                  <CheckCircle2 size={16} className="text-white shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/owner"
                className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-95"
              >
                <span>List Your Vehicle Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/owner"
                className="inline-flex items-center gap-2 glass-card text-white font-semibold text-sm px-6 py-3.5 rounded-xl hover:bg-white/10 transition-all"
              >
                Earnings Calculator
              </Link>
            </div>
          </motion.div>

          {/* Image side (Natural Colour Photography) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative min-h-[320px] lg:min-h-full"
          >
            <img
              src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&q=80"
              alt="Vehicle host"
              className="w-full h-full object-cover filter brightness-[0.88]"
            />
            {/* Earnings overlay badge in Glass */}
            <div className="absolute bottom-6 right-6 left-6 sm:left-auto glass-panel rounded-2xl p-4 shadow-2xl">
              <div className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">Monthly Host Payout</div>
              <div className="text-2xl font-black text-white mt-0.5">₹24,800</div>
              <div className="text-xs text-white/80 font-semibold mt-1">↑ 31% vs. idle garage parking</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

/* ── Trust & Benefits ───────────────────────────────────────── */
const trustFeatures = [
  {
    icon: Shield,
    title: 'Zero Security Deposit',
    desc: 'Transparent pricing with no hidden lock-in deposits. Ride freely without locking your funds.',
  },
  {
    icon: Star,
    title: '100% Verified Community',
    desc: 'Government ID verification for both vehicle hosts and riders ensures complete peace of mind.',
  },
  {
    icon: Clock,
    title: '24x7 Roadside Assistance',
    desc: 'Round-the-clock emergency assistance, puncture support and replacement vehicles anywhere.',
  },
];

const TrustSection: React.FC = () => (
  <section className="py-24 px-4 bg-[#0A0A0A] border-y border-white/10 textured-surface">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-white/80 font-bold text-xs uppercase tracking-widest glass-pill px-4 py-1.5 rounded-full">
          Why Riders Choose VAYGO
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight">
          Built on Trust and Transparency
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trustFeatures.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-8 rounded-2xl glass-card text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-center mb-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <f.icon size={22} className="text-white" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">{f.title}</h3>
            <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Testimonials (Natural Colour Avatars) ──────────────────── */
const Testimonials: React.FC = () => (
  <section className="py-24 px-4 bg-[#000000] textured-surface">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-white/80 font-bold text-xs uppercase tracking-widest glass-pill px-4 py-1.5 rounded-full">
          Rider Reviews
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-4 tracking-tight">
          Loved by 50,000+ Indian Riders
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card rounded-2xl p-7"
          >
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, rIdx) => (
                <Star key={rIdx} size={14} className="fill-white stroke-white" />
              ))}
            </div>
            <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed mb-6 font-normal">"{t.text}"</p>
            <div className="flex items-center gap-3">
              {/* Natural Colour Avatar */}
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div>
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-[#A1A1AA] text-xs">{t.location} · {t.vehicleRented}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── CTA Banner ─────────────────────────────────────────────── */
const CTABanner: React.FC = () => (
  <section className="py-24 px-4 bg-[#000000] textured-surface">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="glass-panel rounded-3xl p-10 sm:p-16 relative overflow-hidden border border-white/12"
      >
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            Your Ride. Your Rules.
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            Experience peer-to-peer mobility without boundaries. Choose your ride and book in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-3.5">
            <Link
              to="/register"
              className="bg-white hover:bg-neutral-200 text-black font-black text-sm px-8 py-3.5 rounded-xl transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
            >
              Sign Up & Get ₹200 Off
            </Link>
            <Link
              to="/vehicles"
              className="glass-card text-white font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all border border-white/15"
            >
              Browse All Fleet
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ── Assembled Landing Page ─────────────────────────────────── */
const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <HeroShowcase />
      <Categories />
      <FeaturedVehicles />
      <PopularLocations />
      <BecomeOwner />
      <TrustSection />
      <Testimonials />
      <FaqSection />
      <CTABanner />
    </div>
  );
};

export default LandingPage;
