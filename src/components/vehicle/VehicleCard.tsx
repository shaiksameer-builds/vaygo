import React from 'react';
import { Star, MapPin, Fuel, Users, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Vehicle } from '../../types';
import Badge from '../common/Badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, index = 0 }) => {
  const categoryLabel: Record<string, string> = {
    bike: 'Bike',
    car: 'Car',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={`/vehicles`}
        className="group block glass-card rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image (VIVID NATURAL COLOURS - NO GRAYSCALE) */}
        <div className="relative overflow-hidden h-48 bg-[#0A0A0A]">
          <img
            src={vehicle.images[0]}
            alt={vehicle.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge label={categoryLabel[vehicle.category]} variant="glass" />
          </div>
          {!vehicle.available && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-[#111111] text-white font-bold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-white/20">
                Booked
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-white/15">
            <Star size={12} className="fill-white stroke-white" />
            <span className="text-xs font-bold text-white">{vehicle.rating}</span>
            <span className="text-[10px] text-[#A1A1AA]">({vehicle.reviewCount})</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-neutral-200 transition-colors mb-1 truncate">
            {vehicle.name}
          </h3>

          <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs mb-4">
            <MapPin size={12} className="text-white/70 shrink-0" />
            <span className="truncate">{vehicle.location}</span>
          </div>

          {/* Features row */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/10">
              <Fuel size={12} className="text-white/80" />
              <span>{vehicle.fuelType}</span>
            </div>
            {vehicle.seats && (
              <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/10">
                <Users size={12} className="text-white/80" />
                <span>{vehicle.seats} Seats</span>
              </div>
            )}
            {vehicle.transmission && (
              <div className="flex items-center gap-1.5 text-[#A1A1AA] text-xs bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/10">
                <Zap size={12} className="text-white/80" />
                <span>{vehicle.transmission}</span>
              </div>
            )}
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-white font-black text-xl">₹{vehicle.pricePerDay}</span>
                <span className="text-[#A1A1AA] text-xs font-medium">/day</span>
              </div>
              <span className="text-[#A1A1AA] text-[10px]">₹{vehicle.pricePerHour}/hr</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white group-hover:text-black text-white flex items-center justify-center transition-all border border-white/15">
              <ArrowUpRight size={16} className="stroke-[2.2]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VehicleCard;
