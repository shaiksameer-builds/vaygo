import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { heroVehicles, type FeaturedHeroVehicle } from '../../data/vehicles';

interface HeroShowcaseProps {
  onSearch?: (location: string, date: string, category: string) => void;
}

const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeVehicle: FeaturedHeroVehicle = heroVehicles[currentIndex];

  // Search capsule state
  const [selectedLocation, setSelectedLocation] = useState('Koramangala (Near Forum Mall)');
  const [selectedDate, setSelectedDate] = useState('Today - 3 Days Rental');
  const [selectedCategory] = useState<'all' | 'bike' | 'car'>('all');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const locations = [
    'Koramangala (Near Forum Mall)',
    'Indiranagar (100ft Road)',
    'HSR Layout (Sector 4)',
    'Whitefield (ITPL Main Road)',
    'MG Road / Brigade Road',
    'Jayanagar (4th Block)',
  ];

  const rentalDurations = [
    'Today - 3 Days Rental',
    'Weekend Escape (Fri - Sun)',
    'Weekly Commute (7 Days)',
    'Monthly Subscription (30 Days)',
    'Hourly Ride (4 Hours)',
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroVehicles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === heroVehicles.length - 1 ? 0 : prev + 1));
  };

  const handleExecuteSearch = () => {
    if (onSearch) {
      onSearch(selectedLocation, selectedDate, selectedCategory);
    } else {
      const params = new URLSearchParams();
      params.set('city', 'Bangalore');
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      navigate(`/vehicles?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-24 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      {/* ── Background Vehicle Image (VIVID NATURAL COLOURS - NO GRAYSCALE) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeVehicle.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src={activeVehicle.heroImage}
            alt={activeVehicle.name}
            className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]"
          />
          {/* Subtle multi-layer vignette so text remains crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/80" />
          {/* Subtle ambient lighting */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/[0.04] rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* ── TOP: Smartphone Glass Search Capsule ── */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-2 sm:mt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-pill-light rounded-full p-1.5 sm:p-2 flex items-center justify-between"
        >
          {/* Location Picker */}
          <div className="relative flex-1 min-w-0 px-3.5 sm:px-4 py-1.5 flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-black" />
            </div>
            <div
              className="flex flex-col min-w-0 w-full"
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowDateDropdown(false);
              }}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Location</span>
              <div className="text-xs sm:text-sm font-bold text-black truncate flex items-center justify-between">
                <span className="truncate">{selectedLocation}</span>
                <span className="text-neutral-400 ml-1 text-[10px]">▼</span>
              </div>
            </div>

            {/* Dropdown in Glass */}
            {showLocationDropdown && (
              <div className="absolute top-14 left-0 w-72 glass-panel rounded-2xl p-2 z-50 text-white shadow-2xl">
                <div className="px-4 py-1.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Popular Hubs (Bangalore)</div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <MapPin size={12} className="text-[#A1A1AA]" />
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-neutral-300" />

          {/* Date & Duration Picker */}
          <div className="relative flex-1 min-w-0 px-3.5 sm:px-4 py-1.5 flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-black" />
            </div>
            <div
              className="flex flex-col min-w-0 w-full"
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowLocationDropdown(false);
              }}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Duration</span>
              <div className="text-xs sm:text-sm font-bold text-black truncate flex items-center justify-between">
                <span className="truncate">{selectedDate}</span>
                <span className="text-neutral-400 ml-1 text-[10px]">▼</span>
              </div>
            </div>

            {/* Dropdown in Glass */}
            {showDateDropdown && (
              <div className="absolute top-14 left-0 w-72 glass-panel rounded-2xl p-2 z-50 text-white shadow-2xl">
                <div className="px-4 py-1.5 text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider">Select Rental Plan</div>
                {rentalDurations.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setShowDateDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar size={12} className="text-[#A1A1AA]" />
                    <span>{d}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pure Black & White Action Button with Diagonal Arrow */}
          <button
            onClick={handleExecuteSearch}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black hover:bg-neutral-800 text-white font-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0 ml-2 group cursor-pointer border border-white/20"
            aria-label="Find rides"
            title="Search verified rides"
          >
            <ArrowUpRight
              size={22}
              className="stroke-[2.8] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </motion.div>
      </div>

      {/* ── CENTER: Hero Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto my-auto py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Bold Headline & Description */}
        <motion.div
          key={`headline-${activeVehicle.id}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 text-left"
        >
          {/* Glass Pill Badge */}
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-white/90">
              {activeVehicle.tag} · VERIFIED FLEET
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight">
            {activeVehicle.headline.split(' on Rent')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              on Rent
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#A1A1AA] max-w-xl font-normal leading-relaxed">
            {activeVehicle.subtitle}
          </p>

          {/* Minimalist White Accent Bar */}
          <div className="mt-4 w-20 h-1.5 rounded-full bg-gradient-to-r from-white via-neutral-300 to-neutral-600 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />

          {/* Value Badges in Glass Cards */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-2 glass-card px-3.5 py-2 rounded-xl">
              <ShieldCheck size={14} className="text-white" />
              <span>Zero Security Deposit</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3.5 py-2 rounded-xl">
              <Zap size={14} className="text-white" />
              <span>Doorstep Delivery Available</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-3.5 py-2 rounded-xl">
              <CheckCircle2 size={14} className="text-white" />
              <span>Complimentary Helmets & Cover</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Vehicle Specs Card in Smartphone Glass */}
        <motion.div
          key={`pricing-${activeVehicle.id}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 flex flex-col items-start lg:items-end text-left lg:text-right"
        >
          <div className="glass-panel rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <span className="text-[11px] uppercase font-black tracking-widest text-[#A1A1AA]">
              {activeVehicle.brand}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2">
              {activeVehicle.model}
            </h2>

            <div className="flex items-baseline gap-2 my-3 lg:justify-end">
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {activeVehicle.price}
              </span>
              <span className="text-xs font-semibold text-[#A1A1AA]">/ day</span>
            </div>

            <p className="text-xs text-[#A1A1AA] mb-5 font-medium">
              {activeVehicle.priceNote}
            </p>

            {/* Features pills */}
            <div className="flex flex-wrap gap-1.5 mb-6 lg:justify-end">
              {activeVehicle.features.map((feat) => (
                <span
                  key={feat}
                  className="text-[10px] bg-white/[0.08] text-white/90 font-medium px-2.5 py-1 rounded-lg border border-white/10"
                >
                  {feat}
                </span>
              ))}
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => navigate('/vehicles')}
              className="w-full bg-white hover:bg-neutral-200 text-black font-black text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/10 hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span>Instant Reserve</span>
              <ArrowUpRight size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM: "CUSTOMER FAVOURITES" Slider in Glass ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto mt-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-4 justify-between"
        >
          {/* Slanted "CUSTOMER FAVOURITES" Badge */}
          <div className="shrink-0 flex items-center gap-3">
            <div className="relative px-4 py-2 bg-white/[0.07] border border-white/20 rounded-xl overflow-hidden shadow-inner">
              <span className="relative z-10 text-xs sm:text-sm font-black italic tracking-widest text-white uppercase select-none">
                CUSTOMER FAVOURITES
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
            </div>

            {/* Carousel navigation arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/15"
                aria-label="Previous vehicle"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/15"
                aria-label="Next vehicle"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip (VIVID NATURAL COLOURS - NO GRAYSCALE) */}
          <div className="flex-1 w-full overflow-x-auto no-scrollbar flex items-center gap-3 py-1">
            {heroVehicles.map((vehicle, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`group relative shrink-0 h-16 sm:h-20 w-24 sm:w-32 rounded-xl overflow-hidden transition-all duration-300 border-2 cursor-pointer ${
                    isActive
                      ? 'border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.35)]'
                      : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img
                    src={vehicle.thumbnail}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-1 left-1.5 right-1.5">
                    <p className="text-[10px] font-bold text-white truncate leading-tight">
                      {vehicle.brand}
                    </p>
                    <p className="text-[9px] text-[#A1A1AA] font-semibold truncate leading-tight">
                      {vehicle.price}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroShowcase;
