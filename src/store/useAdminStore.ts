import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Car, Booking, User } from '../data/types';
import { api } from '../lib/api';

interface AdminState {
  cars: Car[];
  bookings: Booking[];
  guestBookings: Booking[];
  users: User[];
  stats: any | null;
  addCar: (car: Car) => void;
  deleteCar: (carId: string) => void;
  editCar: (carId: string, fields: Partial<Car>) => void;
  toggleCarAvailability: (carId: string) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      cars: [],
      bookings: [],
      guestBookings: [],
      users: [],
      stats: null,

      addCar: (car) => set((s) => ({ cars: [...s.cars, car] })),

      deleteCar: (carId) => set((s) => ({ cars: s.cars.filter(c => c.id !== carId) })),

      editCar: (carId, fields) => set((s) => ({
        cars: s.cars.map(c => c.id === carId ? { ...c, ...fields } : c),
      })),

      toggleCarAvailability: (carId) => set((s) => ({
        cars: s.cars.map(c => c.id === carId ? { ...c, isAvailable: !c.isAvailable } : c),
      })),

      updateBookingStatus: (bookingId, status) => set((s) => ({
        bookings: s.bookings.map(b => b.id === bookingId ? { ...b, status } : b),
        guestBookings: s.guestBookings.map(b => b.id === bookingId ? { ...b, status } : b),
      })),
    }),
    {
      name: 'admin-storage',
    }
  )
);

// Fetch fresh data from API
export async function refreshAdminData() {
  try {
    const [statsData, carsData, bookingsData, usersData] = await Promise.allSettled([
      api.get<any>('/admin/stats'),
      api.get<{ data: Car[] }>('/cars', { per_page: 100 }),
      api.get<{ data: Booking[] }>('/admin/bookings'),
      api.get<{ data: User[] }>('/admin/users'),
    ]);

    const updates: Partial<any> = {};

    if (statsData.status === 'fulfilled') {
      updates.stats = statsData.value;
    }
    if (carsData.status === 'fulfilled') {
      updates.cars = carsData.value.data || [];
    }
    if (bookingsData.status === 'fulfilled') {
      updates.bookings = bookingsData.value.data || [];
    }
    if (usersData.status === 'fulfilled') {
      updates.users = usersData.value.data || [];
    }

    useAdminStore.setState(updates);
  } catch {
    // silently fail
  }
}
