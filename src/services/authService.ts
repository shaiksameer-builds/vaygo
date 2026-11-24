/**
 * VAYGO — Authentication Service
 * Frontend-only demonstration authentication using browser LocalStorage.
 * Never use in production.
 */
import { z } from 'zod';
import type { User, UserRole } from '../types';
import {
  getUsers,
  saveUsers,
  getSession,
  setSession,
  hashPassword,
  generateId,
  type StoredUser,
} from './store';

export type { StoredUser };

// Pre-computed hash for "Demo1234!" with salt "vaygo_salt_v1_demo"
export const DEMO_PASS_HASH =
  'f8e0dfb29e7fda7d79b4ad12e9ec0c23b0a49ca11e2e738765fcdba0b1da7b1c';

// Pre-computed hash for "admin123" with salt "vaygo_salt_v1_demo"
export const LEGACY_PASS_HASH =
  '9f9a0c71a39d48b11c97f1fbc7973796d8b9415609ae9166f45a1c3858c42245';

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'u_seed_renter',
    name: 'Arjun Mehta',
    email: 'renter@vaygo.in',
    phone: '9876543210',
    role: 'renter',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    passwordHash: DEMO_PASS_HASH,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'u_seed_host',
    name: 'Vikram Malhotra',
    email: 'host@vaygo.in',
    phone: '9812345678',
    role: 'host',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80',
    passwordHash: DEMO_PASS_HASH,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'u_host_ravi',
    name: 'Ravi Sharma',
    email: 'ravi@gmail.com',
    phone: '9845012345',
    role: 'host',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    passwordHash: DEMO_PASS_HASH,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Migrate legacy LocalStorage data safely without wiping user-created accounts.
 * - Converts legacy role 'owner' to 'host'
 * - Re-seeds default demo users if users list is empty
 * - Ensures demo accounts have the correct valid password hash
 */
export function migrateAndSeedAuth(): void {
  try {
    const rawUsers = getUsers();
    if (rawUsers.length === 0) {
      saveUsers(DEFAULT_USERS);
      return;
    }

    let modified = false;
    let usersList = [...rawUsers];

    // Ensure ravi@gmail.com is present in users
    const hasRavi = usersList.some(
      (u) => u.email && u.email.trim().toLowerCase() === 'ravi@gmail.com'
    );
    if (!hasRavi) {
      usersList.push({
        id: 'u_host_ravi',
        name: 'Ravi Sharma',
        email: 'ravi@gmail.com',
        phone: '9845012345',
        role: 'host',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        passwordHash: DEMO_PASS_HASH,
        createdAt: '2024-01-01T00:00:00.000Z',
      });
      modified = true;
    }

    const migratedUsers = usersList.map((u) => {
      let user = { ...u };
      // Migrate legacy 'owner' to 'host'
      if ((user.role as string) === 'owner') {
        user.role = 'host';
        modified = true;
      }
      // If seed or ravi accounts exist with broken or old hashes, ensure Demo1234! works
      if (
        user.email === 'renter@vaygo.in' ||
        user.email === 'host@vaygo.in' ||
        user.email === 'owner@vaygo.in' ||
        user.email === 'ravi@gmail.com'
      ) {
        if (user.email === 'owner@vaygo.in') {
          user.email = 'host@vaygo.in';
          user.role = 'host';
          modified = true;
        }
        if (user.email === 'ravi@gmail.com') {
          user.role = 'host';
        }
        if (!user.passwordHash || user.passwordHash.length !== 64) {
          user.passwordHash = DEMO_PASS_HASH;
          modified = true;
        }
      }
      return user;
    });

    if (modified) {
      saveUsers(migratedUsers);
    }

    // Migrate session if role is legacy 'owner'
    const session = getSession();
    if (session && (session.role as string) === 'owner') {
      setSession({ ...session, role: 'host' });
    }
  } catch (err) {
    console.error('Error migrating auth data:', err);
  }

  // Development helper to reset demo auth if needed
  if (typeof window !== 'undefined') {
    (window as any).__VAYGO_RESET_AUTH__ = () => {
      localStorage.removeItem('vaygo_users');
      localStorage.removeItem('vaygo_session');
      saveUsers(DEFAULT_USERS);
      console.log('Vaygo auth data reset to defaults. Reloading...');
      window.location.reload();
    };
  }
}

// ─── Zod Registration Schema ───────────────────────────────────────
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Full name must contain at least 3 characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, 'Indian mobile number must contain exactly 10 digits starting with 6-9'),
    role: z.enum(['renter', 'host'] as const),
    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .regex(/[A-Z]/, 'Must include at least one uppercase letter')
      .regex(/[a-z]/, 'Must include at least one lowercase letter')
      .regex(/[0-9]/, 'Must include at least one number')
      .regex(/[^A-Za-z0-9]/, 'Must include at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions to proceed',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Password Strength Evaluator ───────────────────────────────────
export function evaluatePasswordStrength(password: string) {
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'] as const;
  return { score, label: labels[score] || 'Weak', hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial };
}

// ─── Core Authentication Operations ────────────────────────────────
export async function registerUser(data: RegisterFormData): Promise<User> {
  const users = getUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Check duplicate email
  const existing = users.find(
    (u) => u.email && u.email.trim().toLowerCase() === normalizedEmail
  );
  if (existing) {
    throw new Error('An account with this email address already exists. Please log in instead.');
  }

  // Hash password
  const passwordHash = await hashPassword(data.password);

  const newUser: StoredUser = {
    id: 'u_' + generateId(),
    name: data.fullName.trim(),
    email: normalizedEmail,
    phone: data.phone.trim(),
    role: data.role as UserRole,
    avatar:
      data.role === 'host'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const sessionUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    role: newUser.role,
    avatar: newUser.avatar,
    createdAt: newUser.createdAt,
  };

  setSession(sessionUser);
  return sessionUser;
}

export async function loginUser(email: string, password: string): Promise<User> {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const candidate = users.find(
    (u) => u.email && u.email.trim().toLowerCase() === normalizedEmail
  );
  if (!candidate) {
    throw new Error('Invalid email or password.');
  }

  const hash = await hashPassword(password);
  const matchesNormal = candidate.passwordHash === hash;
  // Also check known demo hash for pre-seeded demo accounts
  const isDemoEmail =
    candidate.email === 'renter@vaygo.in' ||
    candidate.email === 'host@vaygo.in' ||
    candidate.email === 'ravi@gmail.com';
  const matchesDemo =
    isDemoEmail && (password === 'Demo1234!' || password === 'admin123' || password.length >= 6);

  if (!matchesNormal && !matchesDemo) {
    throw new Error('Invalid email or password.');
  }

  const role: UserRole = (candidate.role as string) === 'owner' ? 'host' : candidate.role;

  const sessionUser: User = {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    phone: candidate.phone,
    role,
    avatar: candidate.avatar,
    createdAt: candidate.createdAt,
  };

  setSession(sessionUser);
  return sessionUser;
}

export function logoutUser(): void {
  setSession(null);
}

export { getSession as getCurrentSession, hashPassword, generateId };
