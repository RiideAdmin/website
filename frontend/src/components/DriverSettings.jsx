import React from 'react';
import { useDriver } from '../hooks/useDriver';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Settings, Navigation, Globe } from 'lucide-react';

const DriverSettings = () => {
  const { navPref, setNavPref } = useDriver();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="settings-btn">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="driver-settings-modal">
        <DialogHeader>
          <DialogTitle>Driver Settings</DialogTitle>
        </DialogHeader>
        
        <div className="settings-content">
          <div className="setting-group">
            <h3 className="setting-title">Navigation Preference</h3>
            <p className="setting-description">
              Choose how you'd like to navigate to pickup and drop-off locations
            </p>
            
            <RadioGroup 
              value={navPref} 
              onValueChange={setNavPref}
              className="navigation-options"
            >
              <div className="nav-option">
                <RadioGroupItem value="google" id="google" />
                <Label htmlFor="google" className="nav-option-label">
                  <Globe className="w-5 h-5" />
                  <div className="nav-option-info">
                    <span className="nav-option-name">Google Maps (Default)</span>
                    <span className="nav-option-desc">Opens in new tab for turn-by-turn navigation</span>
                  </div>
                </Label>
              </div>
              
              <div className="nav-option">
                <RadioGroupItem value="in_app" id="in_app" />
                <Label htmlFor="in_app" className="nav-option-label">
                  <Navigation className="w-5 h-5" />
                  <div className="nav-option-info">
                    <span className="nav-option-name">In-App Navigation</span>
                    <span className="nav-option-desc">Basic map view within the driver app</span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="settings-actions">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DriverSettings;