import React, { useState } from 'react';
import { useDriver } from '../hooks/useDriver';
import JobOfferModal from './JobOfferModal';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Power, 
  MapPin, 
  Navigation, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  Car,
  Users,
  Phone,
  Settings
} from 'lucide-react';

const DriverDashboard = () => {
  const {
    online,
    currentJob,
    navStage,
    navPref,
    location,
    profile,
    loading,
    jobOffers,
    goOnline,
    goOffline,
    acceptJob,
    declineJob,
    markArrivedPickup,
    startToDropoff,
    completeRide
  } = useDriver();

  const [showJobModal, setShowJobModal] = useState(false);
  const [currentJobOffer, setCurrentJobOffer] = useState(null);

  // Show job offers automatically
  React.useEffect(() => {
    if (jobOffers.length > 0 && !currentJob && !showJobModal) {
      setCurrentJobOffer(jobOffers[0]);
      setShowJobModal(true);
    }
  }, [jobOffers, currentJob, showJobModal]);

  const handleAcceptJob = (job) => {
    acceptJob(job);
    setShowJobModal(false);
    setCurrentJobOffer(null);
  };

  const handleDeclineJob = (job) => {
    declineJob(job);
    setShowJobModal(false);
    setCurrentJobOffer(null);
  };

  const getStatusColor = (stage) => {
    switch (stage) {
      case 'to_pickup': return 'bg-blue-500';
      case 'at_pickup': return 'bg-yellow-500';
      case 'to_dropoff': return 'bg-green-500';
      case 'complete': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (stage) => {
    switch (stage) {
      case 'to_pickup': return 'En Route to Pickup';
      case 'at_pickup': return 'At Pickup Location';
      case 'to_dropoff': return 'En Route to Drop-off';
      case 'complete': return 'Ride Completed';
      default: return 'Idle';
    }
  };

  return (
    <div className="driver-dashboard">
      {/* Header */}
      <div className="driver-header">
        <div className="driver-status">
          <div className="status-indicator">
            <div className={`status-dot ${online ? 'online' : 'offline'}`}></div>
            <span className="status-text">
              {online ? 'Online' : 'Offline'}
            </span>
          </div>
          
          {profile && (
            <div className="driver-earnings">
              <DollarSign className="w-4 h-4" />
              <span>${profile.total_earnings?.toFixed(2) || '0.00'}</span>
            </div>
          )}
        </div>

        <div className="header-actions">
          <Button
            variant="ghost"
            size="sm"
            className="settings-btn"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            className={`power-btn ${online ? 'online' : 'offline'}`}
            onClick={online ? goOffline : goOnline}
            disabled={loading}
          >
            <Power className="w-4 h-4" />
            {loading ? 'Loading...' : (online ? 'Go Offline' : 'Go Online')}
          </Button>
        </div>
      </div>

      {/* Current Job Status */}
      {currentJob && (
        <div className="current-job-status">
          <div className="job-status-header">
            <Badge className={`status-badge ${getStatusColor(navStage)}`}>
              {getStatusText(navStage)}
            </Badge>
            <span className="job-fare">${currentJob.estimated_cost?.toFixed(2)}</span>
          </div>

          <div className="job-route-info">
            <div className="route-point pickup">
              <MapPin className="w-4 h-4 text-green-500" />
              <span>{currentJob.pickup_location}</span>
            </div>
            <div className="route-line"></div>
            <div className="route-point destination">
              <Navigation className="w-4 h-4 text-red-500" />
              <span>{currentJob.destination}</span>
            </div>
          </div>

          {currentJob.passenger_name && (
            <div className="passenger-info">
              <div className="passenger-name">
                <Users className="w-4 h-4" />
                {currentJob.passenger_name}
              </div>
              <div className="passenger-phone">
                <Phone className="w-4 h-4" />
                {currentJob.passenger_phone}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="job-actions">
            {navStage === 'to_pickup' && (
              <Button 
                className="action-btn primary"
                onClick={markArrivedPickup}
              >
                <MapPin className="w-4 h-4" />
                Arrived at Pickup
              </Button>
            )}
            
            {navStage === 'at_pickup' && (
              <Button 
                className="action-btn primary"
                onClick={startToDropoff}
              >
                <Car className="w-4 h-4" />
                Start Trip
              </Button>
            )}
            
            {navStage === 'to_dropoff' && (
              <Button 
                className="action-btn success"
                onClick={completeRide}
                disabled={loading}
              >
                <CheckCircle2 className="w-4 h-4" />
                Complete Ride
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Waiting State */}
      {online && !currentJob && navStage === 'idle' && (
        <div className="waiting-state">
          <div className="waiting-animation">
            <div className="pulse-circle"></div>
            <Car className="w-8 h-8 car-icon" />
          </div>
          <h3 className="waiting-title">Waiting for jobs...</h3>
          <p className="waiting-text">
            You're online and ready to receive ride requests
          </p>
        </div>
      )}

      {/* Offline State */}
      {!online && (
        <div className="offline-state">
          <div className="offline-content">
            <Power className="w-12 h-12 offline-icon" />
            <h3 className="offline-title">You're Offline</h3>
            <p className="offline-text">
              Go online to start receiving ride requests
            </p>
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className="driver-map">
        {navPref === 'in_app' && currentJob ? (
          <InAppMap 
            currentLocation={location}
            job={currentJob}
            navStage={navStage}
          />
        ) : (
          <MapPlaceholder online={online} location={location} />
        )}
      </div>

      {/* Job Offer Modal */}
      <JobOfferModal 
        job={currentJobOffer}
        onAccept={handleAcceptJob}
        onDecline={handleDeclineJob}
        open={showJobModal}
        onOpenChange={setShowJobModal}
      />
    </div>
  );
};

// Simple map components
const InAppMap = ({ currentLocation, job, navStage }) => {
  const targetLocation = navStage === 'to_pickup' 
    ? { lat: job.pickup_lat, lng: job.pickup_lng }
    : { lat: job.drop_lat, lng: job.drop_lng };

  return (
    <div className="in-app-map">
      <div className="map-header">
        <span>In-App Navigation</span>
        <Badge variant="outline">{navStage === 'to_pickup' ? 'To Pickup' : 'To Destination'}</Badge>
      </div>
      
      <div className="map-canvas">
        <div className="map-route">
          <div 
            className="current-position"
            style={{
              left: `${20 + (currentLocation.lng + 122.4194) * 500}px`,
              top: `${150 + (37.7749 - currentLocation.lat) * 500}px`
            }}
          >
            <Car className="w-4 h-4" />
          </div>
          
          <div 
            className="target-position"
            style={{
              left: `${20 + (targetLocation.lng + 122.4194) * 500}px`,
              top: `${150 + (37.7749 - targetLocation.lat) * 500}px`
            }}
          >
            {navStage === 'to_pickup' ? (
              <MapPin className="w-4 h-4 text-green-500" />
            ) : (
              <Navigation className="w-4 h-4 text-red-500" />
            )}
          </div>
          
          <svg className="route-line">
            <line
              x1={20 + (currentLocation.lng + 122.4194) * 500}
              y1={150 + (37.7749 - currentLocation.lat) * 500}
              x2={20 + (targetLocation.lng + 122.4194) * 500}
              y2={150 + (37.7749 - targetLocation.lat) * 500}
              stroke="#22B573"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>
      
      <div className="map-info">
        <div className="eta-info">
          <Clock className="w-4 h-4" />
          <span>ETA: 5 min</span>
        </div>
      </div>
    </div>
  );
};

const MapPlaceholder = ({ online, location }) => {
  return (
    <div className="map-placeholder">
      <div className="map-content">
        <div className="location-marker">
          <MapPin className="w-6 h-6" />
        </div>
        <div className="map-info">
          <p>Current Location</p>
          <span className="coordinates">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        </div>
      </div>
      
      {!online && (
        <div className="map-overlay">
          <p>Go online to start receiving jobs</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;