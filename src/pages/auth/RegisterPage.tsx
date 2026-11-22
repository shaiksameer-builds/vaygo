import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft, Eye, EyeOff, AlertCircle, Loader2, UserPlus, CheckCircle2, Check, X as XIcon,
} from 'lucide-react';
import Logo from '../../components/common/Logo';
import {
  registerSchema,
  type RegisterFormData,
  registerUser,
  evaluatePasswordStrength,
} from '../../services/authService';
import { useApp } from '../../context/AppContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: 'renter',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  });

  const selectedRole = watch('role');
  const watchedPassword = watch('password') || '';
  const strength = evaluatePasswordStrength(watchedPassword);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const user = await registerUser(data);
      setCurrentUser(user);
      setSuccess(true);
      const targetRoute = user.role === 'host' ? '/host/dashboard' : '/renter/dashboard';
      setTimeout(() => {
        navigate(targetRoute, { replace: true });
      }, 600);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  const onInvalid = (formErrors: FieldErrors<RegisterFormData>) => {
    const firstErrorMessage = Object.values(formErrors)[0]?.message;
    if (firstErrorMessage) {
      setServerError(String(firstErrorMessage));
    }
  };

  const strengthBarWidth = [
    'w-0',
    'w-1/4 bg-neutral-600',
    'w-2/4 bg-neutral-400',
    'w-3/4 bg-neutral-200',
    'w-full bg-white',
    'w-full bg-white',
  ][strength.score];

  return (
    <div className="min-h-screen bg-black text-white flex textured-surface">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-5/12 glass-panel relative overflow-hidden flex-col items-center justify-center p-12 border-r border-white/10 m-4 rounded-3xl">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 text-center max-w-sm">
          <div className="flex justify-center mb-12">
            <Logo size="lg" />
          </div>
          <h2 className="text-white font-black text-4xl leading-tight mb-4 tracking-tight">
            Start your<br />journey today.
          </h2>
          <p className="text-[#A1A1AA] text-base leading-relaxed mb-10">
            Join 50,000+ riders on India's premier P2P vehicle rental marketplace.
          </p>
          <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
            {[
              'Zero security deposit on all rentals',
              'KYC-verified hosts & riders',
              'Self-drive or driver-assisted',
              'Earn ₹40k+/month as a host',
            ].map((point) => (
              <div key={point} className="flex items-center gap-2.5 text-neutral-300 text-xs font-medium">
                <CheckCircle2 size={15} className="text-white shrink-0" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right registration form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 overflow-y-auto bg-black">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 border border-white/15 my-8"
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-white text-xs font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>

          <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Create your account</h1>
          <p className="text-[#A1A1AA] text-xs mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:underline">
              Log in
            </Link>
          </p>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-4 rounded-xl bg-white/10 border border-white/20 flex items-start gap-3 text-xs text-white"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-0.5">Please check your details</div>
                  <div className="text-[#A1A1AA]">{serverError}</div>
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-4 rounded-xl bg-white/10 border border-white/30 flex items-center gap-3 text-xs text-white"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="font-semibold">Account created! Redirecting to your dashboard...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-4" noValidate>
            {/* Hidden role input registered directly */}
            <input type="hidden" {...register('role')} />

            {/* Role selector tabs */}
            <div>
              <label className="text-[11px] font-bold text-neutral-300 block mb-2 uppercase tracking-wider">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'renter', { shouldValidate: true })}
                  className={`border rounded-xl p-3 text-xs font-extrabold transition-all cursor-pointer ${
                    selectedRole === 'renter'
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 bg-white/[0.04] text-[#A1A1AA] hover:border-white/30 hover:text-white'
                  }`}
                >
                  Rent a Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'host', { shouldValidate: true })}
                  className={`border rounded-xl p-3 text-xs font-extrabold transition-all cursor-pointer ${
                    selectedRole === 'host'
                      ? 'border-white bg-white text-black'
                      : 'border-white/15 bg-white/[0.04] text-[#A1A1AA] hover:border-white/30 hover:text-white'
                  }`}
                >
                  List a Vehicle (Host)
                </button>
              </div>
            </div>

            {/* Full Name direct input */}
            <div>
              <label htmlFor="fullName" className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Full Name <span className="text-white">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Arjun Mehta"
                {...register('fullName')}
                className={`w-full h-11 px-4 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${
                  errors.fullName ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email direct input */}
            <div>
              <label htmlFor="email" className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Email Address <span className="text-white">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={`w-full h-11 px-4 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${
                  errors.email ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile Number direct input */}
            <div>
              <label htmlFor="phone" className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Mobile Number <span className="text-white">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#A1A1AA] pointer-events-none">
                  +91
                </span>
                <input
                  id="phone"
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  {...register('phone')}
                  className={`w-full h-11 pl-14 pr-4 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${
                    errors.phone ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password direct input with strength meter */}
            <div>
              <label htmlFor="password" className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Password <span className="text-white">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  {...register('password')}
                  className={`w-full h-11 pl-4 pr-11 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${
                    errors.password ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {watchedPassword.length > 0 && (
                <div className="mt-2 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#A1A1AA]">Strength:</span>
                    <span className="font-bold text-white">{strength.label}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${strengthBarWidth}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                    {[
                      { ok: strength.hasMinLength, label: '8+ characters' },
                      { ok: strength.hasUpper, label: 'Uppercase letter' },
                      { ok: strength.hasLower, label: 'Lowercase letter' },
                      { ok: strength.hasNumber && strength.hasSpecial, label: 'Number & symbol' },
                    ].map(({ ok, label }) => (
                      <span key={label} className={`flex items-center gap-1 ${ok ? 'text-white' : 'text-neutral-500'}`}>
                        {ok ? <Check size={11} /> : <XIcon size={11} />}
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password direct input */}
            <div>
              <label htmlFor="confirmPassword" className="text-[11px] font-bold text-neutral-300 block mb-1 uppercase tracking-wider">
                Confirm Password <span className="text-white">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  {...register('confirmPassword')}
                  className={`w-full h-11 pl-4 pr-11 rounded-xl border bg-white/[0.04] text-white text-sm placeholder-neutral-500 focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-white/60' : 'border-white/15 focus:border-white/50 focus:ring-1 focus:ring-white/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white cursor-pointer"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="mt-0.5 w-4 h-4 rounded border border-white/20 accent-white cursor-pointer"
                />
                <span className="text-xs text-[#A1A1AA] leading-snug">
                  I agree to Vaygo's <span className="text-white font-medium">Terms of Service</span> and{' '}
                  <span className="text-white font-medium">Privacy Policy</span>.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1">
                  <AlertCircle size={11} />
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Create Account submit button */}
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full h-12 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
