import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Vehicle, Booking, BookingStatus } from '../types';
import {
  getSession,
  setSession,
  getUsers,
  getVehicles,
  saveVehicles,
  upsertVehicle,
  deleteVehicle as storeDeleteVehicle,
  getBookings,
  upsertBooking,
  updateBookingStatus as storeUpdateBookingStatus,
  generateId,
  generateRef,
  updateUser,
  deleteAccount,
  EVENTS,
} from '../services/store';
import { migrateAndSeedAuth } from '../services/authService';
import { seedVehiclesIfEmpty } from '../data/seedData';
import { initCloudSync } from '../services/cloudSync';

interface AppContextValue {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateProfile: (data: Partial<User>) => User | null;
  deleteUserAccount: () => void;
  logout: () => void;
  vehicles: Vehicle[];
  refreshVehicles: () => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (vehicleId: string) => void;
  bookings: Booking[];
  refreshBookings: () => void;
  createBooking: (payload: CreateBookingPayload) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, hostNote?: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
  getBookingsForRenter: (renterId: string) => Booking[];
  getBookingsForHost: (hostId: string) => Booking[];
  getRequestsForHost: (hostId: string) => Booking[];
}

export interface CreateBookingPayload {
  vehicleId: string;
  hostId: string;
  renterId: string;
  rentalMode: 'self-drive' | 'with-driver';
  startDateTime: string;
  endDateTime: string;
  durationHours: number;
  totalAmount: number;
  pickupLocation: string;
  notes?: string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getSession());
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const rawStored = getVehicles();
      const users = getUsers();
      const raviUser = users.find((u) => u.email && u.email.trim().toLowerCase() === 'ravi@gmail.com');
      const raviId = raviUser ? raviUser.id : 'u_host_ravi';
      return seedVehiclesIfEmpty(rawStored, raviId);
    } catch {
      return [];
    }
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      return getBookings();
    } catch {
      return [];
    }
  });

  useEffect(() => {
    migrateAndSeedAuth();

    const rawStored = getVehicles();
    const users = getUsers();
    const raviUser = users.find((u) => u.email && u.email.trim().toLowerCase() === 'ravi@gmail.com');
    const raviId = raviUser ? raviUser.id : 'u_host_ravi';
    const initializedVehicles = seedVehiclesIfEmpty(rawStored, raviId);

    if (initializedVehicles.length !== rawStored.length || JSON.stringify(initializedVehicles) !== JSON.stringify(rawStored)) {
      saveVehicles(initializedVehicles);
    }
    setVehicles(initializedVehicles);

    setBookings(getBookings());

    const handleSession = () => setCurrentUserState(getSession());
    const handleVehicles = () => {
      const currentStored = getVehicles();
      const u = getUsers();
      const r = u.find((x) => x.email && x.email.trim().toLowerCase() === 'ravi@gmail.com');
      const rId = r ? r.id : 'u_host_ravi';
      setVehicles(seedVehiclesIfEmpty(currentStored, rId));
    };
    const handleBookings = () => setBookings(getBookings());

    window.addEventListener(EVENTS.SESSION, handleSession);
    window.addEventListener(EVENTS.VEHICLES, handleVehicles);
    window.addEventListener(EVENTS.BOOKINGS, handleBookings);
    window.addEventListener('storage', (e) => {
      if (e.key === 'vaygo_session') handleSession();
      if (e.key === 'vaygo_vehicles') handleVehicles();
      if (e.key === 'vaygo_bookings') handleBookings();
    });

    const stopSync = initCloudSync();

    return () => {
      stopSync();
      window.removeEventListener(EVENTS.SESSION, handleSession);
      window.removeEventListener(EVENTS.VEHICLES, handleVehicles);
      window.removeEventListener(EVENTS.BOOKINGS, handleBookings);
    };
  }, []);

  const setCurrentUser = useCallback((user: User | null) => {
    setSession(user);
    setCurrentUserState(user);
    const raw = getVehicles();
    const u = getUsers();
    const r = u.find((x) => x.email && x.email.trim().toLowerCase() === 'ravi@gmail.com');
    const rId = r ? r.id : 'u_host_ravi';
    setVehicles(seedVehiclesIfEmpty(raw, rId));
    setBookings(getBookings());
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    setCurrentUserState(null);
    const raw = getVehicles();
    const u = getUsers();
    const r = u.find((x) => x.email && x.email.trim().toLowerCase() === 'ravi@gmail.com');
    const rId = r ? r.id : 'u_host_ravi';
    setVehicles(seedVehiclesIfEmpty(raw, rId));
    setBookings(getBookings());
  }, []);

  const updateProfile = useCallback(
    (data: Partial<User>): User | null => {
      if (!currentUser) return null;
      const updated = updateUser({ ...data, id: currentUser.id });
      if (updated) {
        setCurrentUserState(updated);
      }
      return updated;
    },
    [currentUser]
  );

  const deleteUserAccount = useCallback(() => {
    if (!currentUser) return;
    deleteAccount(currentUser.id);
    setCurrentUserState(null);
  }, [currentUser]);

  const refreshVehicles = useCallback(() => {
    const raw = getVehicles();
    const u = getUsers();
    const r = u.find((x) => x.email && x.email.trim().toLowerCase() === 'ravi@gmail.com');
    const rId = r ? r.id : 'u_host_ravi';
    const seeded = seedVehiclesIfEmpty(raw, rId);
    setVehicles(seeded);
  }, []);

  const addVehicle = useCallback(
    (payload: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>): Vehicle => {
      const vehicle: Vehicle = {
        ...payload,
        id: 'v_' + generateId(),
        isActive: payload.isActive !== false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      upsertVehicle(vehicle);
      const raw = getVehicles();
      const u = getUsers();
      const r = u.find((x) => x.email && x.email.trim().toLowerCase() === 'ravi@gmail.com');
      const rId = r ? r.id : 'u_host_ravi';
      setVehicles(seedVehiclesIfEmpty(raw, rId));
      return vehicle;
    },
    []
  );

  const updateVehicle = useCallback((vehicle: Vehicle) => {
    upsertVehicle({ ...vehicle, updatedAt: new Date().toISOString() });
    setVehicles(getVehicles());
  }, []);

  const removeVehicle = useCallback((vehicleId: string) => {
    storeDeleteVehicle(vehicleId);
    setVehicles(getVehicles());
  }, []);

  const refreshBookings = useCallback(() => setBookings(getBookings()), []);

  const createBooking = useCallback((payload: CreateBookingPayload): Booking => {
    const booking: Booking = {
      id: 'b_' + generateId(),
      referenceNumber: generateRef(),
      vehicleId: payload.vehicleId,
      hostId: payload.hostId,
      renterId: payload.renterId,
      rentalMode: payload.rentalMode,
      startDateTime: payload.startDateTime,
      endDateTime: payload.endDateTime,
      durationHours: payload.durationHours,
      totalAmount: payload.totalAmount,
      status: 'pending',
      pickupLocation: payload.pickupLocation,
      notes: payload.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    upsertBooking(booking);
    setBookings(getBookings());
    return booking;
  }, []);

  const updateBookingStatus = useCallback(
    (bookingId: string, status: BookingStatus, hostNote?: string) => {
      storeUpdateBookingStatus(bookingId, status, hostNote);
      setBookings(getBookings());
    },
    []
  );

  const getVehicleById = useCallback(
    (id: string) => vehicles.find((v) => v.id === id),
    [vehicles]
  );

  const getBookingsForRenter = useCallback(
    (renterId: string) =>
      bookings.filter((b) => b.renterId === renterId).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [bookings]
  );

  const getBookingsForHost = useCallback(
    (hostId: string) => {
      const userEmail = currentUser?.email?.toLowerCase();
      return bookings
        .filter((b) => {
          if (b.hostId === hostId || b.hostId === currentUser?.id) return true;
          if (userEmail === 'ravi@gmail.com' && (b.hostId === 'u_host_ravi' || b.hostId === hostId)) return true;
          if (userEmail === 'host@vaygo.in' && (b.hostId === 'u_seed_host' || b.hostId === hostId)) return true;
          const v = vehicles.find((x) => x.id === b.vehicleId);
          if (v) {
            if (v.hostId === hostId || v.ownerId === hostId || v.hostId === currentUser?.id || v.ownerId === currentUser?.id) return true;
            if (userEmail === 'ravi@gmail.com' && (v.hostId === 'u_host_ravi' || v.ownerId === 'u_host_ravi' || v.id.startsWith('v_ravi_'))) return true;
          }
          return false;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [bookings, vehicles, currentUser]
  );

  const getRequestsForHost = useCallback(
    (hostId: string) => {
      const userEmail = currentUser?.email?.toLowerCase();
      return bookings
        .filter((b) => {
          if (b.status !== 'pending') return false;
          if (b.hostId === hostId || b.hostId === currentUser?.id) return true;
          if (userEmail === 'ravi@gmail.com' && (b.hostId === 'u_host_ravi' || b.hostId === hostId)) return true;
          if (userEmail === 'host@vaygo.in' && (b.hostId === 'u_seed_host' || b.hostId === hostId)) return true;
          const v = vehicles.find((x) => x.id === b.vehicleId);
          if (v) {
            if (v.hostId === hostId || v.ownerId === hostId || v.hostId === currentUser?.id || v.ownerId === currentUser?.id) return true;
            if (userEmail === 'ravi@gmail.com' && (v.hostId === 'u_host_ravi' || v.ownerId === 'u_host_ravi' || v.id.startsWith('v_ravi_'))) return true;
          }
          return false;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [bookings, vehicles, currentUser]
  );

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateProfile,
        deleteUserAccount,
        logout,
        vehicles,
        refreshVehicles,
        addVehicle,
        updateVehicle,
        removeVehicle,
        bookings,
        refreshBookings,
        createBooking,
        updateBookingStatus,
        getVehicleById,
        getBookingsForRenter,
        getBookingsForHost,
        getRequestsForHost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}

export const useAuth = () => {
  const { currentUser, setCurrentUser, logout } = useApp();
  return { currentUser, setCurrentUser, logout };
};
