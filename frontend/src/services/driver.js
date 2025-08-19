import apiClient from './api';

export class DriverService {
  static async register(driverData) {
    const response = await apiClient.post('/drivers/register', driverData);
    return response.data;
  }

  static async getProfile() {
    const response = await apiClient.get('/drivers/profile');
    return response.data;
  }

  static async updateStatus(statusData) {
    const response = await apiClient.put('/drivers/status', statusData);
    return response.data;
  }

  static async updateLocation(locationData) {
    const response = await apiClient.put('/drivers/location', locationData);
    return response.data;
  }

  static async getAvailableJobs() {
    const response = await apiClient.get('/drivers/available-jobs');
    return response.data;
  }

  static async acceptJob(bookingId) {
    const response = await apiClient.post('/drivers/accept-job', { booking_id: bookingId });
    return response.data;
  }

  static async getCurrentJob() {
    const response = await apiClient.get('/drivers/current-job');
    return response.data;
  }

  static async updateBookingStatus(bookingId, statusData) {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, statusData);
    return response.data;
  }
}

export class BookingService {
  static async assignDriver(bookingId, driverId) {
    const response = await apiClient.put(`/bookings/${bookingId}/status`, {
      driver_id: driverId,
      status: 'driver_assigned'
    });
    return response.data;
  }

  static async setBookingStatus(bookingId, status, patch = {}) {
    const statusUpdate = { status, ...patch };
    const response = await apiClient.put(`/bookings/${bookingId}/status`, statusUpdate);
    return response.data;
  }
}

// Navigation utilities
export class NavigationService {
  static buildGoogleMapsUrl({ originLat, originLng, destLat, destLng }) {
    return `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
  }

  static openGoogleMaps(url) {
    window.open(url, '_blank');
  }

  static calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  static estimateETA(distanceKm, avgSpeedKmh = 40) {
    const hours = distanceKm / avgSpeedKmh;
    const minutes = Math.round(hours * 60);
    return minutes;
  }

  // Simulate movement towards target
  static moveTowards(currentLat, currentLng, targetLat, targetLng, stepSize = 0.001) {
    const latDiff = targetLat - currentLat;
    const lngDiff = targetLng - currentLng;
    
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    
    if (distance < stepSize) {
      return { lat: targetLat, lng: targetLng };
    }
    
    const ratio = stepSize / distance;
    return {
      lat: currentLat + (latDiff * ratio),
      lng: currentLng + (lngDiff * ratio)
    };
  }
}