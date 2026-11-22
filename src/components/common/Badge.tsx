import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'white' | 'dark' | 'glass' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = 'glass', size = 'sm', className = '' }) => {
  const variants = {
    white: 'bg-white text-black font-extrabold shadow-sm',
    dark: 'bg-[#111111] text-white border border-white/15',
    glass: 'bg-white/[0.08] text-white backdrop-blur-md border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]',
    outline: 'border border-white/25 text-neutral-300 bg-transparent',
    subtle: 'bg-white/[0.04] text-neutral-400 border border-white/10',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-1 tracking-wider uppercase',
    md: 'text-xs px-3 py-1.5 tracking-wider uppercase',
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full ${variants[variant] || variants.glass} ${sizes[size]} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
