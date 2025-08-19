import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Clock, DollarSign, Users, Phone, Navigation } from 'lucide-react';

const JobOfferModal = ({ job, onAccept, onDecline, open, onOpenChange }) => {
  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="job-offer-modal">
        <DialogHeader>
          <DialogTitle className="job-offer-title">
            New Job Request
          </DialogTitle>
        </DialogHeader>
        
        <div className="job-offer-content">
          {/* Job Details */}
          <div className="job-details">
            <div className="job-route">
              <div className="route-item pickup">
                <div className="route-icon">
                  <MapPin className="w-5 h-5 text-green-500" />
                </div>
                <div className="route-info">
                  <span className="route-label">Pickup</span>
                  <span className="route-address">{job.pickup_location}</span>
                </div>
              </div>
              
              <div className="route-line"></div>
              
              <div className="route-item destination">
                <div className="route-icon">
                  <Navigation className="w-5 h-5 text-red-500" />
                </div>
                <div className="route-info">
                  <span className="route-label">Destination</span>
                  <span className="route-address">{job.destination}</span>
                </div>
              </div>
            </div>

            {/* Mini Map Placeholder */}
            <div className="job-map-preview">
              <div className="map-placeholder">
                <div className="map-route">
                  <div className="pickup-marker">P</div>
                  <div className="route-path"></div>
                  <div className="drop-marker">D</div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Stats */}
          <div className="job-stats">
            <div className="stat-item">
              <Clock className="w-4 h-4" />
              <span className="stat-label">ETA</span>
              <span className="stat-value">{job.eta_minutes} min</span>
            </div>
            
            <div className="stat-item">
              <DollarSign className="w-4 h-4" />
              <span className="stat-label">Fare</span>
              <span className="stat-value">${job.estimated_cost?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="stat-item">
              <Navigation className="w-4 h-4" />
              <span className="stat-label">Distance</span>
              <span className="stat-value">{job.distance_km} km</span>
            </div>
            
            <div className="stat-item">
              <Users className="w-4 h-4" />
              <span className="stat-label">Passengers</span>
              <span className="stat-value">{job.passengers}</span>
            </div>
          </div>

          {/* Passenger Info */}
          <div className="passenger-info">
            <div className="passenger-name">{job.passenger_name}</div>
            <div className="passenger-phone">
              <Phone className="w-4 h-4" />
              {job.passenger_phone}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="job-actions">
            <Button 
              variant="outline" 
              className="decline-btn"
              onClick={() => onDecline(job)}
            >
              Decline
            </Button>
            <Button 
              className="accept-btn"
              onClick={() => onAccept(job)}
            >
              Accept Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobOfferModal;