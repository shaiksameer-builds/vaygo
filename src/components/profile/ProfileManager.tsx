import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Upload, Trash2, CheckCircle2, AlertCircle, Loader2,
  Lock, Eye, EyeOff, ShieldAlert, KeyRound, MapPin, FileText,
  User as UserIcon, Mail, Phone, X, Check
} from 'lucide-react';
import { useAuth, useApp } from '../../context/AppContext';
import { updateUserPassword } from '../../services/store';
import { evaluatePasswordStrength } from '../../services/authService';

const AVATAR_PRESETS = [
  { label: 'Portrait 1', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80' },
  { label: 'Portrait 2', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80' },
  { label: 'Portrait 3', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
  { label: 'Portrait 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
  { label: 'Portrait 5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  { label: 'Portrait 6', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
];

interface ProfileManagerProps {
  children?: React.ReactNode;
}

export default function ProfileManager({ children }: ProfileManagerProps) {
  const { currentUser } = useAuth();
  const { updateProfile, deleteUserAccount } = useApp();
  const navigate = useNavigate();

  // Profile details state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || 'Bangalore');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [drivingLicense, setDrivingLicense] = useState(currentUser?.drivingLicense || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || AVATAR_PRESETS[0].url);

  // Status & Feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom URL input toggle
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  // Password update state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete account confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim().startsWith('http://') || customUrl.trim().startsWith('https://') || customUrl.trim().startsWith('data:image/')) {
      setAvatar(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
      setErrorMsg(null);
    } else {
      setErrorMsg('Please enter a valid URL starting with http:// or https://');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (name.trim().length < 3) {
      setErrorMsg('Full name must be at least 3 characters long.');
      return;
    }

    const phoneClean = phone.trim().replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(phoneClean)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = updateProfile({
        name: name.trim(),
        phone: phoneClean,
        city: city.trim(),
        bio: bio.trim(),
        drivingLicense: drivingLicense.trim(),
        avatar,
      });

      if (updated) {
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    const strength = evaluatePasswordStrength(newPassword);
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must contain at least 8 characters.' });
      return;
    }
    if (!strength.hasUpper || !strength.hasLower || !strength.hasNumber || !strength.hasSpecial) {
      setPasswordMsg({
        type: 'error',
        text: 'Password must include uppercase, lowercase, number, and a special character.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (!currentUser) return;

    setPasswordSaving(true);
    try {
      const ok = await updateUserPassword(currentUser.id, newPassword);
      if (ok) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setPasswordMsg(null);
          setShowPasswordSection(false);
        }, 3000);
      } else {
        setPasswordMsg({ type: 'error', text: 'Could not change password.' });
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Error updating password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirmText !== 'DELETE') return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteUserAccount();
      navigate('/login', { replace: true });
    }, 500);
  };

  const strength = evaluatePasswordStrength(newPassword);

  return (
    <div className="space-y-8">
      {/* Optional host/renter specific summary header */}
      {children}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Photo Management Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/15">
          <h2 className="text-sm font-black text-white uppercase tracking-wider mb-5 pb-3 border-b border-white/10 flex items-center gap-2">
            <Camera size={16} className="text-white" />
            Profile Photo
          </h2>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <img
                src={avatar || AVATAR_PRESETS[0].url}
                alt="Profile Avatar"
                className="w-28 h-28 rounded-2xl object-cover border-2 border-white/20 shadow-xl group-hover:border-white/40 transition-all"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo"
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity cursor-pointer text-white"
              >
                <Upload size={18} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
              </button>
            </div>

            <div className="flex-1 w-full space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleAvatarFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  <Upload size={14} />
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3.5 py-2 rounded-xl glass-card hover:bg-white/10 text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer"
                >
                  {showUrlInput ? 'Hide URL Input' : 'Paste Image URL'}
                </button>
                <button
                  type="button"
                  onClick={() => setAvatar(AVATAR_PRESETS[0].url)}
                  className="px-3 py-2 rounded-xl hover:bg-white/5 text-[#A1A1AA] hover:text-white text-xs transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {showUrlInput && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 h-9 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-xs focus:outline-none focus:border-white/40"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-3 h-9 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Preset Avatars */}
              <div>
                <p className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider mb-2">Or choose a preset avatar:</p>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_PRESETS.map((p, i) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setAvatar(p.url)}
                      className={`relative w-10 h-10 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        avatar === p.url ? 'border-white scale-105 ring-2 ring-white/50' : 'border-white/15 hover:border-white/40'
                      }`}
                    >
                      <img src={p.url} alt={`Preset ${i + 1}`} className="w-full h-full object-cover" />
                      {avatar === p.url && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="glass-card rounded-2xl p-6 border border-white/15">
          <h2 className="text-sm font-black text-white uppercase tracking-wider mb-5 pb-3 border-b border-white/10 flex items-center gap-2">
            <UserIcon size={16} className="text-white" />
            Personal Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full h-11 px-3 pl-10 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40 transition-all"
                />
                <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full h-11 px-3 pl-10 rounded-xl border border-white/10 bg-white/[0.02] text-[#A1A1AA] text-sm cursor-not-allowed"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Sign-in email cannot be changed.</p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Mobile Number *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-semibold text-[#A1A1AA]">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  required
                  maxLength={10}
                  className="w-full h-11 px-3 pl-11 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40 transition-all"
                />
                <Phone size={15} className="absolute right-3.5 text-[#A1A1AA]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Primary City / Hub
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore, Karnataka"
                  className="w-full h-11 px-3 pl-10 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40 transition-all"
                />
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Driving License / ID Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={drivingLicense}
                  onChange={(e) => setDrivingLicense(e.target.value.toUpperCase())}
                  placeholder="e.g. DL-1420110012345"
                  className="w-full h-11 px-3 pl-10 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40 transition-all"
                />
                <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                About / Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder="A few words about you, your rental preferences or hosting background..."
                className="w-full px-3 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40 transition-all resize-none"
              />
            </div>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center gap-2"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-xl bg-white/15 border border-white/30 text-white text-xs flex items-center gap-2"
              >
                <CheckCircle2 size={15} className="shrink-0" />
                <span className="font-semibold">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Security & Password Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/15">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Lock size={16} className="text-white" />
              Security & Password
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1">Keep your account secure with a strong password.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="px-4 py-2 rounded-xl glass-card border border-white/20 text-xs font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            {showPasswordSection ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        <AnimatePresence>
          {showPasswordSection && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleUpdatePassword}
              className="mt-6 pt-5 border-t border-white/10 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      className="w-full h-11 px-3 pr-10 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    required
                    className="w-full h-11 px-3 rounded-xl border border-white/15 bg-white/[0.04] text-white text-sm focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {newPassword && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#A1A1AA]">Password Strength:</span>
                    <span className="font-bold text-white">{strength.label}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strength.score <= 2 ? 'w-1/3 bg-neutral-500' : strength.score <= 3 ? 'w-2/3 bg-neutral-300' : 'w-full bg-white'
                      }`}
                    />
                  </div>
                </div>
              )}

              {passwordMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    passwordMsg.type === 'success' ? 'bg-white/15 border-white/30 text-white' : 'bg-white/10 border-white/20 text-white'
                  }`}
                >
                  {passwordMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {passwordSaving ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
                  Update Password
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="glass-card rounded-2xl p-6 border border-white/20 bg-white/[0.01]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} className="text-white" />
              Delete Account
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1 max-w-md">
              Permanently delete your account, listings, and all personal data. This action is irreversible.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/30 hover:border-white/60 bg-white/[0.05] hover:bg-white/[0.15] text-white font-extrabold text-xs transition-all cursor-pointer shrink-0"
          >
            <Trash2 size={14} />
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md glass-panel rounded-3xl p-6 border border-white/25 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                <Trash2 size={22} />
              </div>

              <h3 className="text-lg font-black text-white mb-2">Delete Your Account?</h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                This will permanently delete your VAYGO profile for{' '}
                <strong className="text-white">{currentUser?.email}</strong>. Any listed vehicles and associated data
                will be permanently erased from this device.
              </p>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-neutral-300 mb-4">
                To confirm, type <span className="font-mono font-bold text-white">DELETE</span> below:
              </div>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full h-11 px-3 rounded-xl border border-white/25 bg-white/[0.05] text-white text-sm font-mono tracking-widest text-center focus:outline-none focus:border-white mb-4"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setConfirmText('');
                  }}
                  className="flex-1 h-11 rounded-xl glass-card border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={confirmText !== 'DELETE' || isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 h-11 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-neutral-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? <Loader2 size={15} className="animate-spin" /> : 'Yes, Delete Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
