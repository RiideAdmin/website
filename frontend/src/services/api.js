import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('riide_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('riide_token');
      localStorage.removeItem('riide_user');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// API Service Classes

export class AuthService {
  static async register(userData) {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('riide_token', response.data.data.access_token);
      localStorage.setItem('riide_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  static async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('riide_token', response.data.data.access_token);
      localStorage.setItem('riide_user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }

  static async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  static logout() {
    localStorage.removeItem('riide_token');
    localStorage.removeItem('riide_user');
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('riide_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem('riide_token');
  }
}

export class VehicleService {
  static async getAll() {
    const response = await apiClient.get('/vehicles');
    return response.data;
  }

  static async getByCategory(category) {
    const response = await apiClient.get(`/vehicles?category=${category}`);
    return response.data;
  }

  static async getById(vehicleId) {
    const response = await apiClient.get(`/vehicles/${vehicleId}`);
    return response.data;
  }
}

export class LocationService {
  static async getAll() {
    const response = await apiClient.get('/locations');
    return response.data;
  }

  static async search(query) {
    const response = await apiClient.get(`/locations/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export class BookingService {
  static async create(bookingData) {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  }

  static async getUserBookings() {
    const response = await apiClient.get('/bookings');
    return response.data;
  }

  static async getById(bookingId) {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
  }

  static async updateStatus(bookingId, status) {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, { status });
    return response.data;
  }
}

export class PricingService {
  static async calculate(priceRequest) {
    const response = await apiClient.post('/pricing/calculate', priceRequest);
    return response.data;
  }

  static async validatePromo(code, bookingAmount) {
    const response = await apiClient.post('/promo/validate', {
      code,
      booking_amount: bookingAmount
    });
    return response.data;
  }
}

export class ContentService {
  static async getServices() {
    const response = await apiClient.get('/services');
    return response.data;
  }

  static async getTestimonials() {
    const response = await apiClient.get('/testimonials');
    return response.data;
  }

  static async getBlogPosts(limit = 10) {
    const response = await apiClient.get(`/blog/posts?limit=${limit}`);
    return response.data;
  }

  static async getFAQs(category = null) {
    const url = category ? `/faqs?category=${category}` : '/faqs';
    const response = await apiClient.get(url);
    return response.data;
  }
}

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  } else if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

// Export default API client for direct usage if needed
export default apiClient;