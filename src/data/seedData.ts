/**
 * VAYGO — Seed Data
 * Pre-seeded vehicles for host accounts (including ravi@gmail.com).
 * Any vehicles added by hosts via the Add Vehicle form will also be preserved.
 */
import type { Vehicle } from '../types';

export const SEED_VEHICLES: Vehicle[] = [
  {
    id: 'v_ravi_bullet',
    hostId: 'u_host_ravi',
    ownerId: 'u_host_ravi',
    name: 'Royal Enfield Classic 350',
    category: 'bike',
    brand: 'Royal Enfield',
    model: 'Classic 350 Stealth Black',
    year: 2023,
    registrationNumber: 'KA 03 EN 4521',
    colour: 'Stealth Black',
    description: 'Crisp Royal Enfield Classic 350 in mint condition with dual-channel ABS, touring seat and crash guard. Perfect for city rides and highway touring.',
    specs: {
      engineCC: 349,
      transmission: 'Manual',
      fuelType: 'Petrol',
      seats: 2,
    },
    pickupAddress: '100ft Road, Indiranagar',
    area: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560038',
    location: 'Indiranagar, Bangalore',
    pricePerHour: 120,
    pricePerDay: 1200,
    minRentalHours: 2,
    securityDeposit: 0,
    rentalModes: ['self-drive'],
    availability: {
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: '06:00',
      endTime: '22:00',
    },
    images: [
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80',
      'https://images.unsplash.com/photo-1558981359-219d6364c9c8?w=800&q=80',
    ],
    isActive: true,
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-10T10:00:00.000Z',
  },
  {
    id: 'v_ravi_creta',
    hostId: 'u_host_ravi',
    ownerId: 'u_host_ravi',
    name: 'Hyundai Creta 1.5 SX',
    category: 'car',
    brand: 'Hyundai',
    model: 'Creta 1.5 SX Executive',
    year: 2023,
    registrationNumber: 'KA 01 MG 8842',
    colour: 'Polar White',
    description: 'Spacious and comfortable SUV with panoramic sunroof, touchscreen infotainment with Apple CarPlay/Android Auto, and excellent mileage.',
    specs: {
      transmission: 'Automatic',
      fuelType: 'Petrol',
      seats: 5,
      hasAC: true,
    },
    pickupAddress: '80 Feet Road, 4th Block, Koramangala',
    area: 'Koramangala',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560034',
    location: 'Koramangala, Bangalore',
    pricePerHour: 350,
    pricePerDay: 3200,
    minRentalHours: 3,
    securityDeposit: 0,
    rentalModes: ['self-drive', 'with-driver'],
    availability: {
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: '07:00',
      endTime: '23:00',
    },
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    ],
    isActive: true,
    rating: 4.8,
    reviewCount: 29,
    createdAt: '2024-01-12T12:00:00.000Z',
    updatedAt: '2024-01-12T12:00:00.000Z',
  },
  {
    id: 'v_ravi_thar',
    hostId: 'u_host_ravi',
    ownerId: 'u_host_ravi',
    name: 'Mahindra Thar 4x4',
    category: 'car',
    brand: 'Mahindra',
    model: 'Thar LX Hard Top 4x4',
    year: 2024,
    registrationNumber: 'KA 04 TH 9900',
    colour: 'Napoli Black',
    description: 'Iconic 4x4 off-roader with powerful diesel engine, convertible hardtop, high ground clearance, and all-terrain capabilities.',
    specs: {
      transmission: 'Automatic',
      fuelType: 'Diesel',
      seats: 4,
      hasAC: true,
    },
    pickupAddress: 'ITPL Main Road, Whitefield',
    area: 'Whitefield',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560066',
    location: 'Whitefield, Bangalore',
    pricePerHour: 550,
    pricePerDay: 4900,
    minRentalHours: 4,
    securityDeposit: 0,
    rentalModes: ['self-drive'],
    availability: {
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: '06:00',
      endTime: '23:30',
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    ],
    isActive: true,
    rating: 5.0,
    reviewCount: 42,
    createdAt: '2024-01-14T08:00:00.000Z',
    updatedAt: '2024-01-14T08:00:00.000Z',
  },
  {
    id: 'v_ravi_ather',
    hostId: 'u_host_ravi',
    ownerId: 'u_host_ravi',
    name: 'Ather 450X Gen 3',
    category: 'bike',
    brand: 'Ather',
    model: '450X Gen 3 Warp Edition',
    year: 2023,
    registrationNumber: 'KA 05 EV 1234',
    colour: 'Space Grey',
    description: 'Quick, zero-emission smart electric scooter with warp mode acceleration, touchscreen navigation, and 100+ km true range.',
    specs: {
      engineCC: 0,
      transmission: 'Automatic',
      fuelType: 'Electric',
      seats: 2,
    },
    pickupAddress: '27th Main Road, HSR Layout Sector 1',
    area: 'HSR Layout',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560102',
    location: 'HSR Layout, Bangalore',
    pricePerHour: 75,
    pricePerDay: 650,
    minRentalHours: 1,
    securityDeposit: 0,
    rentalModes: ['self-drive'],
    availability: {
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: '07:00',
      endTime: '22:00',
    },
    images: [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
    ],
    isActive: true,
    rating: 4.9,
    reviewCount: 19,
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'v_ravi_auto',
    hostId: 'u_host_ravi',
    ownerId: 'u_host_ravi',
    name: 'Bajaj RE Compact 4S',
    category: 'auto',
    brand: 'Bajaj',
    model: 'RE Compact 4-Stroke',
    year: 2022,
    registrationNumber: 'KA 02 AU 7712',
    colour: 'Yellow-Black',
    description: 'Reliable and economical 3-wheeler auto-rickshaw with driver included. Ideal for city tours, wedding guest transfers, and local commutes.',
    specs: {
      transmission: 'Manual',
      fuelType: 'CNG',
      seats: 3,
    },
    pickupAddress: 'MG Road Metro Station',
    area: 'MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pinCode: '560001',
    location: 'MG Road, Bangalore',
    pricePerHour: 85,
    pricePerDay: 750,
    minRentalHours: 2,
    securityDeposit: 0,
    rentalModes: ['with-driver'],
    availability: {
      days: [0, 1, 2, 3, 4, 5, 6],
      startTime: '06:00',
      endTime: '22:00',
    },
    images: [
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80',
    ],
    isActive: true,
    rating: 4.7,
    reviewCount: 15,
    createdAt: '2024-01-16T11:00:00.000Z',
    updatedAt: '2024-01-16T11:00:00.000Z',
  },
];

/**
 * Seed vehicles if empty, or ensure Ravi's vehicles are always present and active.
 * Never removes any vehicles added by hosts.
 */
export function seedVehiclesIfEmpty(existingVehicles: Vehicle[], raviId = 'u_host_ravi'): Vehicle[] {
  const result: Vehicle[] = [...(existingVehicles || [])];

  // Adjust hostId/ownerId for seed vehicles to match Ravi's actual ID
  const seededForRavi = SEED_VEHICLES.map((v) => ({
    ...v,
    hostId: raviId,
    ownerId: raviId,
    isActive: true,
  }));

  // If no vehicles at all, start with Ravi's seeded vehicles
  if (result.length === 0) {
    return seededForRavi;
  }

  // Ensure Ravi's vehicles are included
  for (const seedV of seededForRavi) {
    const existingIndex = result.findIndex((v) => v.id === seedV.id);
    if (existingIndex >= 0) {
      // Ensure it is active and has correct hostId
      result[existingIndex] = {
        ...result[existingIndex],
        hostId: raviId,
        ownerId: raviId,
        isActive: true,
      };
    } else {
      result.push(seedV);
    }
  }

  // Also ensure all vehicles belonging to Ravi (by hostId or ownerId or email match) have isActive !== false
  return result.map((v) => {
    if (v.hostId === raviId || v.ownerId === raviId) {
      return { ...v, isActive: v.isActive !== false };
    }
    return v;
  });
}
