import type { AdminUser, Car, Booking, BlogPost, FaqItem, ReviewItem, OfferItem, TimelineItem, ProcessStepItem } from './types';

export type { AdminUser, Car, Booking, BlogPost, FaqItem, ReviewItem, OfferItem, TimelineItem, ProcessStepItem };

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('admin_token');
    }
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json();

    if (!response.ok) {
      const message = data.message || data.error || 'Request failed';
      throw new Error(message);
    }

    return data as T;
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let url = path;
    if (params) {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) search.append(k, String(v));
      });
      const qs = search.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>(url);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: AdminUser; token: string }>('/admin/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<AdminUser>('/auth/me'),
};

// Users
export const usersApi = {
  list: (page = 1) => api.get<{ data: AdminUser[]; last_page: number }>(`/admin/users?page=${page}`),
  get: (id: string) => api.get<AdminUser>(`/admin/users/${id}`),
  update: (id: string, data: Partial<AdminUser>) => api.put(`/admin/users/${id}`, data),
  delete: (id: string) => api.delete(`/admin/users/${id}`),
};

// Cars
export const carsApi = {
  list: (params?: Record<string, string | number | boolean>) =>
    api.get<{ data: Car[]; current_page: number; last_page: number }>('/cars', params),
  get: (id: string) => api.get<Car>(`/cars/${id}`),
  create: (data: Partial<Car>) => api.post<{ data: Car }>('/cars', data),
  update: (id: string, data: Partial<Car>) => api.put<{ data: Car }>(`/cars/${id}`, data),
  delete: (id: string) => api.delete(`/cars/${id}`),
};

// Bookings
export const bookingsApi = {
  list: (page = 1) => api.get<{ data: Booking[]; last_page: number }>(`/admin/bookings?page=${page}`),
  get: (id: string) => api.get<Booking>(`/bookings/${id}`),
  updateStatus: (id: string, status: string) =>
    api.put(`/admin/bookings/${id}/status`, { status }),
};

// Blog
export const blogApi = {
  list: (page = 1) => api.get<{ data: BlogPost[]; last_page: number }>(`/admin/blog?page=${page}`),
  get: (slug: string) => api.get<BlogPost>(`/blog/${slug}`),
  create: (data: Partial<BlogPost>) => api.post<{ data: BlogPost }>('/admin/blog', data),
  update: (id: string, data: Partial<BlogPost>) => api.put<{ data: BlogPost }>(`/admin/blog/${id}`, data),
  delete: (id: string) => api.delete(`/admin/blog/${id}`),
};

// CMS
export const cmsApi = {
  getGroup: (group: string) => api.get<{ key: string; value: unknown }[]>(`/cms?group=${group}`),
  upsert: (key: string, value: unknown, group?: string) =>
    api.post('/admin/cms', { key, value, group }),
};

// FAQs
export const faqsApi = {
  list: () => api.get<FaqItem[]>('/admin/faq'),
  create: (data: Partial<FaqItem>) => api.post('/admin/faq', data),
  update: (id: string, data: Partial<FaqItem>) => api.put(`/admin/faq/${id}`, data),
  delete: (id: string) => api.delete(`/admin/faq/${id}`),
};

// Reviews
export const reviewsApi = {
  list: () => api.get<ReviewItem[]>('/admin/reviews'),
  create: (data: Partial<ReviewItem>) => api.post('/admin/reviews', data),
  update: (id: string, data: Partial<ReviewItem>) => api.put(`/admin/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/admin/reviews/${id}`),
};

// Offers
export const offersApi = {
  list: () => api.get<OfferItem[]>('/admin/offers'),
  create: (data: Partial<OfferItem>) => api.post('/admin/offers', data),
  update: (id: string, data: Partial<OfferItem>) => api.put(`/admin/offers/${id}`, data),
  delete: (id: string) => api.delete(`/admin/offers/${id}`),
};

// Timelines
export const timelinesApi = {
  list: () => api.get<TimelineItem[]>('/admin/timelines'),
  create: (data: Partial<TimelineItem>) => api.post('/admin/timelines', data),
  update: (id: string, data: Partial<TimelineItem>) => api.put(`/admin/timelines/${id}`, data),
  delete: (id: string) => api.delete(`/admin/timelines/${id}`),
};

// Process Steps
export const stepsApi = {
  list: () => api.get<ProcessStepItem[]>('/admin/steps'),
  create: (data: Partial<ProcessStepItem>) => api.post('/admin/steps', data),
  update: (id: string, data: Partial<ProcessStepItem>) => api.put(`/admin/steps/${id}`, data),
  delete: (id: string) => api.delete(`/admin/steps/${id}`),
};

// File Upload
export interface UploadResult {
  url: string;
  path: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
}

// Chat
export interface AdminChat {
  id: number;
  guest_id: string;
  user_id?: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  guest_country?: string;
  guest_address?: string;
  status: 'open' | 'closed';
  last_message_at?: string;
  created_at: string;
  messages?: AdminChatMessage[];
}

export interface AdminChatMessage {
  id: number;
  chat_id: number;
  sender_type: 'guest' | 'user' | 'admin' | 'system';
  sender_id?: string;
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const chatApi = {
  list: (page = 1) => api.get<{ data: AdminChat[]; last_page: number }>(`/admin/chats?page=${page}`),
  messages: (chatId: number) => api.get<AdminChatMessage[]>(`/chats/${chatId}/messages`),
  reply: (chatId: number, message: string) => api.post<AdminChatMessage>(`/admin/chats/${chatId}/reply`, { message }),
  close: (chatId: number) => api.post(`/admin/chats/${chatId}/close`),
  unread: () => api.get<{ unread: number }>('/admin/chats/unread'),
};

export const uploadApi = {
  single: async (file: File, folder?: string): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const token = api.getToken();
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Upload failed');
    }

    return response.json();
  },

  multiple: async (files: File[], folder?: string): Promise<{ files: UploadResult[] }> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files[]', file));
    if (folder) formData.append('folder', folder);

    const token = api.getToken();
    const response = await fetch(`${API_BASE}/upload/multiple`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Upload failed');
    }

    return response.json();
  },

  delete: async (filePath: string): Promise<void> => {
    const token = api.getToken();
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ path: filePath }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Delete failed');
    }
  },
};

// Review Links
export const reviewLinksApi = {
  list: () => api.get<{ data: any[]; current_page: number; last_page: number }>('/admin/review-links'),
  generate: (bookingId: number) => api.post<{ token: string; url: string; expires_at: string }>('/admin/review-links', { booking_id: bookingId }),
};
