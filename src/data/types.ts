export interface Review {
  id: string;
  name: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  fuel: 'Electric' | 'Petrol' | 'Hybrid' | 'Diesel';
  transmission: 'Automatic' | 'Manual';
  seats: number;
  power: string;
  speed: string;
  description: string;
  features: string[];
  hostName: string;
  hostAvatar: string;
  hostRating: number;
  isAvailable: boolean;
  location: string;
  year?: string;
  latitude?: number;
  longitude?: number;
  ratingBreakdown: {
    cleanliness: number;
    communication: number;
    listingAccuracy: number;
  };
  reviews: Review[];
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  pickupDate: string;
  returnDate: string;
  totalDays: number;
  totalPrice: number;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
  driverInfo: {
    fullName: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseExpiry: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'host' | 'company' | 'driver';
  drivingLicense?: {
    licenseNumber: string;
    expiryDate: string;
    country: string;
    verified: boolean;
  };
  balance?: number;
}
