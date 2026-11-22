// ─── Core Enums & Union Types ──────────────────────────────────────────────────
export type VehicleCategory = 'bike' | 'car' | 'auto';
export type RentalMode = 'self-drive' | 'with-driver';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
export type UserRole = 'renter' | 'host' | 'owner';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';
export type TransmissionType = 'Manual' | 'Automatic' | 'CVT' | 'Semi-Automatic';

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  city?: string;
  drivingLicense?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────
export interface VehicleSpec {
  engineCC?: number;
  transmission?: TransmissionType | string;
  fuelType: FuelType | string;
  seats: number;
  hasAC?: boolean;
}

export interface VehicleAvailability {
  days: number[];
  startTime: string;
  endTime: string;
}

export interface Vehicle {
  id: string;
  hostId?: string;
  ownerId?: string;
  name?: string;
  category: VehicleCategory;
  brand: string;
  model: string;
  year: number;
  registrationNumber?: string;
  colour?: string;
  description: string;
  specs?: VehicleSpec;
  pickupAddress?: string;
  area?: string;
  city: string;
  state?: string;
  pinCode?: string;
  location?: string;
  pricePerHour: number;
  pricePerDay?: number;
  minRentalHours?: number;
  securityDeposit?: number;
  rentalModes: RentalMode[];
  availability?: VehicleAvailability;
  available?: boolean;
  images: string[];
  isActive?: boolean;
  rating: number;
  reviewCount: number;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  seats?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export interface Booking {
  id: string;
  referenceNumber: string;
  vehicleId: string;
  hostId: string;
  renterId: string;
  rentalMode: RentalMode;
  startDateTime: string;
  endDateTime: string;
  durationHours: number;
  totalAmount: number;
  status: BookingStatus;
  pickupLocation: string;
  notes?: string;
  hostNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────
export interface SearchFilters {
  location?: string;
  category?: VehicleCategory | 'all';
  rentalMode?: RentalMode | 'any';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc';
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  vehicleId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
