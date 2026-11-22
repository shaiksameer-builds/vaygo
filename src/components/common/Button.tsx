import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-white hover:bg-neutral-200 text-black font-extrabold shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.99]',
    secondary:
      'bg-[#111111] hover:bg-[#1A1A1A] text-white border border-white/15 shadow-md hover:border-white/30 hover:scale-[1.02] active:scale-[0.99]',
    outline:
      'border border-white/25 text-white hover:bg-white hover:text-black hover:border-white transition-all',
    ghost:
      'text-neutral-400 hover:text-white hover:bg-white/[0.08]',
    glass:
      'glass-pill text-white hover:bg-white/15 hover:border-white/30',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 rounded-lg',
    md: 'text-sm px-5 py-2.5 rounded-xl',
    lg: 'text-base px-7 py-3.5 rounded-2xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        icon
      )}
      {children}
      {iconRight && !loading && iconRight}
    </motion.button>
  );
};

export default Button;
