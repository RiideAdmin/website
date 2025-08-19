import { createContext, useContext, useReducer, useEffect } from 'react';
import { DriverService, NavigationService } from '../services/driver';
import { useToast } from './use-toast';

// Driver state
const initialState = {
  online: false,
  currentJob: null,
  navStage: 'idle', // 'idle' | 'to_pickup' | 'to_dropoff' | 'complete'
  navPref: 'google', // 'google' | 'in_app'
  location: { lat: 37.7749, lng: -122.4194 }, // Default to SF
  profile: null,
  loading: false,
  jobOffers: []
};

// Action types
const ACTIONS = {
  SET_ONLINE: 'SET_ONLINE',
  SET_CURRENT_JOB: 'SET_CURRENT_JOB',
  SET_NAV_STAGE: 'SET_NAV_STAGE',
  SET_NAV_PREF: 'SET_NAV_PREF',
  SET_LOCATION: 'SET_LOCATION',
  SET_PROFILE: 'SET_PROFILE',
  SET_LOADING: 'SET_LOADING',
  ADD_JOB_OFFER: 'ADD_JOB_OFFER',
  REMOVE_JOB_OFFER: 'REMOVE_JOB_OFFER',
  RESET_DRIVER_STATE: 'RESET_DRIVER_STATE'
};

// Reducer
function driverReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ONLINE:
      return { ...state, online: action.payload };
    case ACTIONS.SET_CURRENT_JOB:
      return { ...state, currentJob: action.payload };
    case ACTIONS.SET_NAV_STAGE:
      return { ...state, navStage: action.payload };
    case ACTIONS.SET_NAV_PREF:
      return { ...state, navPref: action.payload };
    case ACTIONS.SET_LOCATION:
      return { ...state, location: action.payload };
    case ACTIONS.SET_PROFILE:
      return { ...state, profile: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.ADD_JOB_OFFER:
      return { ...state, jobOffers: [...state.jobOffers, action.payload] };
    case ACTIONS.REMOVE_JOB_OFFER:
      return { ...state, jobOffers: state.jobOffers.filter(offer => offer.id !== action.payload) };
    case ACTIONS.RESET_DRIVER_STATE:
      return { ...initialState, navPref: state.navPref, profile: state.profile };
    default:
      return state;
  }
}

// Context
const DriverContext = createContext();

// Provider
export function DriverProvider({ children }) {
  const [state, dispatch] = useReducer(driverReducer, {
    ...initialState,
    navPref: localStorage.getItem('riide:driver:navpref') || 'google'
  });
  
  const { toast } = useToast();

  // Load driver profile on mount
  useEffect(() => {
    loadDriverProfile();
  }, []);

  // Persist nav preference
  useEffect(() => {
    localStorage.setItem('riide:driver:navpref', state.navPref);
  }, [state.navPref]);

  // Simulate job offers when online
  useEffect(() => {
    let interval;
    if (state.online && !state.currentJob) {
      interval = setInterval(() => {
        generateMockJobOffer();
      }, Math.random() * 20000 + 20000); // 20-40 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.online, state.currentJob]);

  // Simulate driver movement
  useEffect(() => {
    let interval;
    if (state.currentJob && (state.navStage === 'to_pickup' || state.navStage === 'to_dropoff')) {
      interval = setInterval(() => {
        const target = state.navStage === 'to_pickup' 
          ? { lat: state.currentJob.pickup_lat, lng: state.currentJob.pickup_lng }
          : { lat: state.currentJob.drop_lat, lng: state.currentJob.drop_lng };
        
        if (target.lat && target.lng) {
          const newLocation = NavigationService.moveTowards(
            state.location.lat,
            state.location.lng,
            target.lat,
            target.lng,
            0.0005 // Smaller steps for more realistic movement
          );
          
          dispatch({ type: ACTIONS.SET_LOCATION, payload: newLocation });
          
          // Update driver location in backend
          DriverService.updateLocation({
            current_lat: newLocation.lat,
            current_lng: newLocation.lng
          }).catch(console.error);
        }
      }, 3000); // Every 3 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.currentJob, state.navStage, state.location]);

  const loadDriverProfile = async () => {
    try {
      const response = await DriverService.getProfile();
      if (response.success) {
        dispatch({ type: ACTIONS.SET_PROFILE, payload: response.data });
        dispatch({ type: ACTIONS.SET_ONLINE, payload: response.data.driver_online || false });
        
        if (response.data.current_lat && response.data.current_lng) {
          dispatch({ 
            type: ACTIONS.SET_LOCATION, 
            payload: { lat: response.data.current_lat, lng: response.data.current_lng }
          });
        }
      }
    } catch (error) {
      // Driver profile doesn't exist yet, set up mock profile for demo
      console.log('Driver profile not found, using mock profile');
      const mockProfile = {
        id: 'mock_driver_123',
        user_id: 'mock_user_123',
        license_number: 'DL123456789',
        rating: 4.9,
        total_rides: 156,
        total_earnings: 2847.50,
        driver_online: false,
        current_lat: 37.7749,
        current_lng: -122.4194
      };
      dispatch({ type: ACTIONS.SET_PROFILE, payload: mockProfile });
    }
  };

  const generateMockJobOffer = () => {
    // Generate random pickup and destination coordinates around SF
    const baseLatPickup = 37.7749 + (Math.random() - 0.5) * 0.1;
    const baseLngPickup = -122.4194 + (Math.random() - 0.5) * 0.1;
    const baseLatDrop = 37.7749 + (Math.random() - 0.5) * 0.1;
    const baseLngDrop = -122.4194 + (Math.random() - 0.5) * 0.1;

    const distance = NavigationService.calculateDistance(
      baseLatPickup, baseLngPickup, baseLatDrop, baseLngDrop
    );
    const eta = NavigationService.estimateETA(distance);
    const fare = Math.round((distance * 3 + 15) * 100) / 100; // Base fare calculation

    const mockJob = {
      id: `job_${Date.now()}`,
      pickup_location: `${Math.floor(Math.random() * 9999)} Street, San Francisco`,
      destination: `${Math.floor(Math.random() * 9999)} Ave, San Francisco`,
      pickup_lat: baseLatPickup,
      pickup_lng: baseLngPickup,
      drop_lat: baseLatDrop,
      drop_lng: baseLngDrop,
      passenger_name: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
      passenger_phone: '+1 (555) 123-4567',
      estimated_cost: fare,
      eta_minutes: eta,
      distance_km: Math.round(distance * 10) / 10,
      passengers: Math.floor(Math.random() * 4) + 1,
      payment_method: 'card',
      created_at: new Date().toISOString()
    };

    dispatch({ type: ACTIONS.ADD_JOB_OFFER, payload: mockJob });
  };

  const goOnline = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // For demo purposes, we'll work without authentication
      // In a real app, this would call DriverService.updateStatus
      try {
        await DriverService.updateStatus({
          driver_online: true,
          status: 'online',
          current_lat: state.location.lat,
          current_lng: state.location.lng
        });
      } catch (error) {
        console.warn('API call failed, continuing with mock driver flow:', error.message);
        // Continue with mock behavior for demo
      }
      
      dispatch({ type: ACTIONS.SET_ONLINE, payload: true });
      toast({
        title: "You're now online",
        description: "Waiting for job requests...",
      });
    } catch (error) {
      toast({
        title: "Failed to go online",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const goOffline = async () => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      await DriverService.updateStatus({
        driver_online: false,
        status: 'offline'
      });
      
      dispatch({ type: ACTIONS.SET_ONLINE, payload: false });
      dispatch({ type: ACTIONS.SET_CURRENT_JOB, payload: null });
      dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'idle' });
      
      toast({
        title: "You're now offline",
        description: "You won't receive new job requests",
      });
    } catch (error) {
      toast({
        title: "Failed to go offline",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setNavPref = (preference) => {
    dispatch({ type: ACTIONS.SET_NAV_PREF, payload: preference });
  };

  const acceptJob = async (job) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      // For mock jobs, create a booking first
      if (job.id.startsWith('job_')) {
        // This would be handled differently in a real app
        const mockBooking = {
          ...job,
          id: `booking_${Date.now()}`,
          status: 'driver_assigned',
          started_at: new Date().toISOString()
        };
        
        dispatch({ type: ACTIONS.SET_CURRENT_JOB, payload: mockBooking });
        dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'to_pickup' });
        
        // Start navigation
        startNavigation(job.pickup_lat, job.pickup_lng);
      } else {
        // Real booking acceptance
        const response = await DriverService.acceptJob(job.id);
        if (response.success) {
          dispatch({ type: ACTIONS.SET_CURRENT_JOB, payload: response.data });
          dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'to_pickup' });
          
          startNavigation(job.pickup_lat, job.pickup_lng);
        }
      }
      
      // Remove from job offers
      dispatch({ type: ACTIONS.REMOVE_JOB_OFFER, payload: job.id });
      
      toast({
        title: "Job accepted!",
        description: "Navigate to pickup location",
      });
    } catch (error) {
      toast({
        title: "Failed to accept job",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const declineJob = (job) => {
    dispatch({ type: ACTIONS.REMOVE_JOB_OFFER, payload: job.id });
  };

  const startNavigation = (destLat, destLng) => {
    if (state.navPref === 'google') {
      const url = NavigationService.buildGoogleMapsUrl({
        originLat: state.location.lat,
        originLng: state.location.lng,
        destLat,
        destLng
      });
      NavigationService.openGoogleMaps(url);
    }
    // For in-app navigation, the map component will handle it
  };

  const markArrivedPickup = async () => {
    if (!state.currentJob) return;
    
    try {
      if (state.currentJob.id.startsWith('booking_')) {
        await DriverService.updateBookingStatus(state.currentJob.id, { 
          status: 'arrived_pickup' 
        });
      }
      
      dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'at_pickup' });
      
      toast({
        title: "Arrived at pickup",
        description: "Waiting for passenger",
      });
    } catch (error) {
      console.error('Failed to mark arrived at pickup:', error);
    }
  };

  const startToDropoff = async () => {
    if (!state.currentJob) return;
    
    try {
      if (state.currentJob.id.startsWith('booking_')) {
        await DriverService.updateBookingStatus(state.currentJob.id, { 
          status: 'en_route_to_dropoff' 
        });
      }
      
      dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'to_dropoff' });
      
      // Start navigation to dropoff
      startNavigation(state.currentJob.drop_lat, state.currentJob.drop_lng);
      
      toast({
        title: "Trip started",
        description: "Navigate to destination",
      });
    } catch (error) {
      console.error('Failed to start trip:', error);
    }
  };

  const completeRide = async () => {
    if (!state.currentJob) return;
    
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      
      const actualCost = state.currentJob.estimated_cost * (0.95 + Math.random() * 0.1); // ±5% variation
      
      if (state.currentJob.id.startsWith('booking_')) {
        await DriverService.updateBookingStatus(state.currentJob.id, { 
          status: 'completed',
          actual_cost: actualCost,
          completed_at: new Date().toISOString()
        });
      }
      
      // Update local profile earnings
      const updatedProfile = {
        ...state.profile,
        total_earnings: (state.profile?.total_earnings || 0) + actualCost,
        total_rides: (state.profile?.total_rides || 0) + 1
      };
      dispatch({ type: ACTIONS.SET_PROFILE, payload: updatedProfile });
      
      dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'complete' });
      
      toast({
        title: "Ride completed!",
        description: `Earnings updated: +$${actualCost.toFixed(2)}`,
      });
      
      // Reset to waiting state after 2 seconds
      setTimeout(() => {
        dispatch({ type: ACTIONS.SET_CURRENT_JOB, payload: null });
        dispatch({ type: ACTIONS.SET_NAV_STAGE, payload: 'idle' });
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Failed to complete ride",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const value = {
    // State
    ...state,
    
    // Actions
    goOnline,
    goOffline,
    setNavPref,
    acceptJob,
    declineJob,
    markArrivedPickup,
    startToDropoff,
    completeRide,
    loadDriverProfile
  };

  return (
    <DriverContext.Provider value={value}>
      {children}
    </DriverContext.Provider>
  );
}

// Hook
export function useDriver() {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
}