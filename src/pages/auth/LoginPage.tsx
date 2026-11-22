import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye, EyeOff, AlertCircle, Loader2, LogIn,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import { loginUser } from '../../services/authService';
import { useApp } from '../../context/AppContext';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), mode: 'onTouched' });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const user = await loginUser(data.email, data.password);
      setCurrentUser(user);
      navigate(user.role === 'host' ? '/host/dashboard' : '/renter/dashboard', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex textured-surface">
      <div className="hidden lg:flex lg:w-5/12 glass-panel relative overflow-hidden flex-col items-center justify-center p-12 border-r border-white/10 m-4 rounded-3xl">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="flex justify-center mb-12"><Logo size="lg" /></div>
          <h2 className="text-white font-black text-4xl leading-tight mb-4 tracking-tight">Welcome<br />back, rider.</h2>
          <p className="text-[#A1A1AA] text-base leading-relaxed mb-10">Your next adventure is a login away.</p>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[{ v: '500+', l: 'Vehicles' }, { v: '50k+', l: 'Renters' }, { v: '20+', l: 'Cities' }, { v: '4.9★', l: 'Rating' }].map(s => (
              <div key={s.l} className="glass-card rounded-2xl p-4 text-center">
                <div className="text-white font-black text-xl">{s.v}</div>
                <div className="text-[#A1A1AA] text-xs mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm glass-card rounded-3xl p-8 border border-white/15"
        >
          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Log in to VAYGO</h1>
          <p className="text-[#A1A1AA] text-xs mb-6">
            New to Vaygo?{' '}
            <Link to="/register" className="text-white font-bold hover:underline">Create an account</Link>
          </p>

          <AnimatePresence>
            {serverError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">Email</label>
              <input type="email" {...register('email')} placeholder="you@example.com"
                className={`w-full h-11 px-4 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${errors.email ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'}`} />
              {errors.email && <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1"><AlertCircle size={11} />{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                  className={`w-full h-11 pl-4 pr-11 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${errors.password ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1"><AlertCircle size={11} />{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register('rememberMe')} className="w-4 h-4 rounded accent-white cursor-pointer" />
                <span className="text-xs text-[#A1A1AA]">Remember me</span>
              </label>
              <button type="button" className="text-xs text-white hover:underline cursor-pointer"
                onClick={() => setServerError('If your email is registered, password reset instructions have been sent.')}>
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer mt-1">
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Logging in...</> : <><LogIn size={16} />Log in</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
