export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'host' | 'driver' | 'company' | 'admin';
  avatar?: string;
  balance: string;
  phone?: string;
  license_number?: string;
  license_expiry?: string;
  license_country?: string;
  license_image?: string;
  license_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: 'SUV' | 'Sedan' | 'Hatchback' | 'Van';
  price: number;
  seats: number;
  transmission: string;
  fuel: string;
  power?: string;
  speed?: string;
  description?: string;
  features?: string[];
  image?: string;
  images?: string[];
  location?: string;
  year?: string;
  rating: number;
  reviews_count: number;
  is_available: boolean;
  user_id: string;
  user?: AdminUser;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_ref: string;
  car_id: string;
  user_id: string;
  pickup_date: string;
  return_date: string;
  total_days: number;
  total_price: string;
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
  driver_info?: unknown;
  car?: Car;
  user?: AdminUser;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category: string;
  date: string;
  read_time?: string;
  image?: string;
  is_published: boolean;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  sort_order: number;
}

export interface ReviewItem {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  text: string;
  source: 'google' | 'facebook' | 'tripadvisor' | 'apexride';
  date: string;
}

export interface OfferItem {
  id: string;
  title: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
  image?: string;
  active: boolean;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description?: string;
  icon?: string;
  type: 'journey' | 'process';
  sort_order: number;
}

export interface ProcessStepItem {
  id: string;
  step: number;
  title: string;
  description?: string;
  icon?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
