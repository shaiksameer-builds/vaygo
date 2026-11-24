/**
 * VAYGO — Shared Application Store
 * Pure LocalStorage-based persistence layer with reactive event dispatch.
 * All reads/writes go through these helpers so the data layer is consistent.
 *
 * NOTE: This is a demo-only frontend store. Never use in production.
 */

import type { User, Vehicle, Booking, BookingStatus } from '../types';

// ─── Storage Keys ──────────────────────────────────────────────────────────────
export const KEYS = {
  USERS: 'vaygo_users',
  SESSION: 'vaygo_session',
  VEHICLES: 'vaygo_vehicles',
  BOOKINGS: 'vaygo_bookings',
} as const;

// ─── Custom Events ─────────────────────────────────────────────────────────────
export const EVENTS = {
  SESSION: 'vaygo:session',
  VEHICLES: 'vaygo:vehicles',
  BOOKINGS: 'vaygo:bookings',
} as const;

function emit(event: string) {
  window.dispatchEvent(new CustomEvent(event));
}

// ─── Generic Helpers ───────────────────────────────────────────────────────────
function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T, event?: string): void {
  localStorage.setItem(key, JSON.stringify(value));
  if (event) emit(event);
}

// ─── Users ─────────────────────────────────────────────────────────────────────
export interface StoredUser extends User {
  passwordHash: string;
}

/** SHA-256 hash using Web Crypto (demo-only salted hash — NOT production-safe). */
export async function hashPassword(password: string): Promise<string> {
  const salt = 'vaygo_salt_v1_demo';
  const data = new TextEncoder().encode(password + salt);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getUsers(): StoredUser[] {
  return readJSON<StoredUser[]>(KEYS.USERS, []);
}

export function saveUsers(users: StoredUser[]): void {
  writeJSON(KEYS.USERS, users);
}

export function updateUser(updated: Partial<User> & { id: string }): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx === -1) return null;

  const current = users[idx];
  const merged: StoredUser = {
    ...current,
    ...updated,
    id: current.id,
    role: current.role, // role cannot be modified via profile
    updatedAt: new Date().toISOString(),
  };
  users[idx] = merged;
  saveUsers(users);

  // If current session is this user, sync session
  const session = getSession();
  if (session && session.id === updated.id) {
    const sessionUser: User = {
      id: merged.id,
      name: merged.name,
      email: merged.email,
      phone: merged.phone,
      role: merged.role,
      avatar: merged.avatar,
      bio: merged.bio,
      city: merged.city,
      drivingLicense: merged.drivingLicense,
      createdAt: merged.createdAt,
      updatedAt: merged.updatedAt,
    };
    setSession(sessionUser);
    return sessionUser;
  }
  return merged;
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) return false;

  const passwordHash = await hashPassword(newPassword);
  users[idx].passwordHash = passwordHash;
  users[idx].updatedAt = new Date().toISOString();
  saveUsers(users);
  return true;
}

export function deleteAccount(userId: string): void {
  // 1. Remove user from users list
  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);

  // 2. Remove all vehicles listed by this user
  const vehicles = getVehicles().filter((v) => v.hostId !== userId && v.ownerId !== userId);
  saveVehicles(vehicles);

  // 3. Clear session if it belongs to this user
  const session = getSession();
  if (session && session.id === userId) {
    setSession(null);
  }
}

// ─── Session ───────────────────────────────────────────────────────────────────
export function getSession(): User | null {
  return readJSON<User | null>(KEYS.SESSION, null);
}

export function setSession(user: User | null): void {
  if (user) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.SESSION);
  }
  emit(EVENTS.SESSION);
}

// ─── Vehicles ──────────────────────────────────────────────────────────────────
export function getVehicles(): Vehicle[] {
  return readJSON<Vehicle[]>(KEYS.VEHICLES, []);
}

export function saveVehicles(vehicles: Vehicle[]): void {
  writeJSON(KEYS.VEHICLES, vehicles, EVENTS.VEHICLES);
}

export function upsertVehicle(vehicle: Vehicle): void {
  const list = getVehicles();
  const idx = list.findIndex((v) => v.id === vehicle.id);
  if (idx >= 0) {
    list[idx] = vehicle;
  } else {
    list.unshift(vehicle);
  }
  saveVehicles(list);
}

export function deleteVehicle(vehicleId: string): void {
  saveVehicles(getVehicles().filter((v) => v.id !== vehicleId));
}

// ─── Bookings ──────────────────────────────────────────────────────────────────
export function getBookings(): Booking[] {
  return readJSON<Booking[]>(KEYS.BOOKINGS, []);
}

export function saveBookings(bookings: Booking[]): void {
  writeJSON(KEYS.BOOKINGS, bookings, EVENTS.BOOKINGS);
}

export function upsertBooking(booking: Booking): void {
  const list = getBookings();
  const idx = list.findIndex((b) => b.id === booking.id);
  if (idx >= 0) {
    list[idx] = booking;
  } else {
    list.push(booking);
  }
  saveBookings(list);
}

export function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  hostNote?: string
): void {
  const list = getBookings();
  const booking = list.find((b) => b.id === bookingId);
  if (!booking) return;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  if (hostNote !== undefined) booking.hostNote = hostNote;
  saveBookings(list);
}

// ─── Reference number generator ────────────────────────────────────────────────
export function generateRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VGO-${year}-${rand}`;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}
