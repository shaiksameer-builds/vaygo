/**
 * VAYGO — Real-Time Cloud Synchronization Service
 * Enables instant peer-to-peer data synchronization across different browsers,
 * devices, and tabs using lightweight, zero-configuration cloud pub/sub.
 */

import { getBookings, saveBookings, getVehicles, saveVehicles, EVENTS } from './store';
import type { Booking, Vehicle } from '../types';

const SYNC_TOPIC = 'vaygo_p2p_sync_room_2026';
const NTFY_BASE = `https://ntfy.sh/${SYNC_TOPIC}`;

// Unique ID for this browser tab/session to prevent echoing own messages
const CLIENT_ID =
  typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem('vaygo_client_id') ||
      (() => {
        const id = 'c_' + Math.random().toString(36).substring(2, 9);
        sessionStorage.setItem('vaygo_client_id', id);
        return id;
      })()
    : 'c_' + Math.random().toString(36).substring(2, 9);

interface SyncMessage {
  clientId: string;
  type: 'booking' | 'vehicle';
  action: 'upsert' | 'delete';
  payload: any;
  timestamp: number;
}

/** Broadcast a change to other devices & tabs */
export function broadcastCloudSync(
  type: 'booking' | 'vehicle',
  action: 'upsert' | 'delete',
  payload: any
): void {
  if (typeof window === 'undefined') return;

  const msg: SyncMessage = {
    clientId: CLIENT_ID,
    type,
    action,
    payload,
    timestamp: Date.now(),
  };

  fetch(NTFY_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
    keepalive: true,
  }).catch(() => {
    // Non-blocking fallback
  });
}

function processIncoming(rawText: string) {
  try {
    const data = JSON.parse(rawText);
    const msg: SyncMessage = typeof data.message === 'string' ? JSON.parse(data.message) : data;

    if (!msg || msg.clientId === CLIENT_ID) return;

    if (msg.type === 'booking' && msg.payload) {
      const current = getBookings();
      const booking = msg.payload as Booking;
      const idx = current.findIndex((b) => b.id === booking.id);
      if (idx >= 0) {
        current[idx] = booking;
      } else {
        current.unshift(booking);
      }
      saveBookings(current);
      window.dispatchEvent(new CustomEvent(EVENTS.BOOKINGS));
    } else if (msg.type === 'vehicle' && msg.payload) {
      const current = getVehicles();
      const vehicle = msg.payload as Vehicle;
      const idx = current.findIndex((v) => v.id === vehicle.id);
      if (idx >= 0) {
        current[idx] = vehicle;
      } else {
        current.unshift(vehicle);
      }
      saveVehicles(current);
      window.dispatchEvent(new CustomEvent(EVENTS.VEHICLES));
    }
  } catch {
    // Ignore malformed messages
  }
}

/** Initialize background listener for cross-device live updates */
export function initCloudSync(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Fetch recent historical updates from other devices (last 24 hours)
  fetch(`${NTFY_BASE}/json?poll=1&since=24h`)
    .then((res) => res.text())
    .then((text) => {
      const lines = text.trim().split('\n');
      for (const line of lines) {
        if (line) processIncoming(line);
      }
    })
    .catch(() => {});

  // 2. Real-time Server-Sent Events (SSE) stream
  let eventSource: EventSource | null = null;
  try {
    eventSource = new EventSource(`${NTFY_BASE}/sse`);
    eventSource.onmessage = (e) => {
      if (e.data) processIncoming(e.data);
    };
  } catch {
    // SSE not supported or blocked
  }

  // 3. Fallback polling every 5 seconds for robust connectivity
  const interval = setInterval(() => {
    fetch(`${NTFY_BASE}/json?poll=1&since=10s`)
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split('\n');
        for (const line of lines) {
          if (line) processIncoming(line);
        }
      })
      .catch(() => {});
  }, 5000);

  return () => {
    if (eventSource) eventSource.close();
    clearInterval(interval);
  };
}
