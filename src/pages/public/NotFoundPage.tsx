import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Compass } from 'lucide-react';
import Logo from '../../components/common/Logo';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center px-4 text-center textured-surface">
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-3xl p-10 max-w-md w-full shadow-2xl border border-white/12"
      >
        <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/20 flex items-center justify-center mx-auto mb-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
          <Compass size={32} className="stroke-[2]" />
        </div>
        <h1 className="text-white font-black text-6xl mb-2 tracking-tight">404</h1>
        <h2 className="text-white font-bold text-2xl mb-2">Wrong turn?</h2>
        <p className="text-[#A1A1AA] text-xs sm:text-sm mb-8 leading-relaxed">
          Looks like this route leads nowhere. Let's get you back on the open road.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-white/10"
          >
            <Home size={16} />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all bg-white/[0.05] cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
