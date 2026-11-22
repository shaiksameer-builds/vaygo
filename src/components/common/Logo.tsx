import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const VaygoLogoIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center justify-center rounded-xl bg-black border border-white/20 overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] group-hover:border-white/50 transition-all ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.png"
        alt="Vaygo Logo"
        className="w-full h-full object-contain p-1 transform group-hover:scale-105 transition-transform"
      />
    </div>
  );
};

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 28,
    md: 38,
    lg: 48,
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <VaygoLogoIcon size={iconSizes[size]} />
      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-black tracking-tight text-white ${textSizes[size]} leading-none flex items-center`}
          >
            VAYGO
          </span>
          <span className="text-[9px] uppercase tracking-widest text-white/50 font-semibold leading-tight">
            Peer-to-Peer Rentals
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
