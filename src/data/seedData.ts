/**
 * VAYGO — Seed Data
 * Empty seed list: Only vehicles added by hosts will be displayed.
 */
import type { Vehicle } from '../types';

export const SEED_VEHICLES: Vehicle[] = [];

/** Keep existing vehicles or empty array; never inject seed vehicles */
export function seedVehiclesIfEmpty(existingVehicles: Vehicle[]): Vehicle[] {
  return existingVehicles.filter(
    (v) => !v.id.startsWith('v_seed_') && !['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].includes(v.id)
  );
}
