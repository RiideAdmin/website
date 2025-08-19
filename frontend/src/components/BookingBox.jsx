import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Car, CreditCard, Tag, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { LocationService, PricingService, BookingService, AuthService, handleApiError } from '../services/api';
import { useToast } from '../hooks/use-toast';

const BookingBox = () => {
  const [activeTab, setActiveTab] = useState('chauffeur');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const { toast } = useToast();
  
  const [bookingData, setBookingData] = useState({
    pickupLocation: '',
    destination: '',
    date: '',
    time: '',
    returnDate: '',
    returnTime: '',
    passengers: 1,
    vehicleType: 'Economy',
    extras: [],
    paymentMethod: 'card',
    promoCode: ''
  });

  const [showPromoCode, setShowPromoCode] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await LocationService.getAll();
        if (response.success) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error('Failed to load locations:', error);
        // Fallback to mock locations
        setLocations([
          { id: 'sfo', name: 'San Francisco Airport (SFO)' },
          { id: 'downtown-sf', name: 'Downtown San Francisco' },
          { id: 'silicon-valley', name: 'Silicon Valley' },
          { id: 'oakland-airport', name: 'Oakland Airport (OAK)' },
          { id: 'san-jose-airport', name: 'San Jose Airport (SJC)' },
          { id: 'napa-valley', name: 'Napa Valley' }
        ]);
      }
    };

    loadLocations();
  }, []);

  // Calculate price whenever relevant fields change
  useEffect(() => {
    const calculatePrice = async () => {
      if (!bookingData.vehicleType || !bookingData.pickupLocation) {
        setEstimatedPrice(0);
        setPriceBreakdown(null);
        return;
      }

      setPriceLoading(true);
      try {
        const priceRequest = {
          vehicle_type: bookingData.vehicleType,
          service_type: activeTab,
          duration_hours: 1, // Default for demo
          duration_days: activeTab === 'rental' ? 1 : null,
          extras: bookingData.extras,
          payment_method: bookingData.paymentMethod,
          promo_code: bookingData.promoCode || null
        };

        const response = await PricingService.calculate(priceRequest);
        if (response.success) {
          setEstimatedPrice(response.data.total_price);
          setPriceBreakdown(response.data.breakdown);
        }
      } catch (error) {
        console.error('Price calculation error:', error);
        // Fallback to simple calculation
        const basePrice = {
          Economy: 45,
          Premium: 85,
          SUV: 95,
          Van: 75,
          Marine: 285
        }[bookingData.vehicleType] || 45;
        
        setEstimatedPrice(basePrice);
      } finally {
        setPriceLoading(false);
      }
    };

    const debounceTimer = setTimeout(calculatePrice, 500);
    return () => clearTimeout(debounceTimer);
  }, [bookingData.vehicleType, bookingData.extras, bookingData.paymentMethod, bookingData.promoCode, bookingData.pickupLocation, activeTab]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExtrasChange = (extra, checked) => {
    setBookingData(prev => ({
      ...prev,
      extras: checked 
        ? [...prev.extras, extra]
        : prev.extras.filter(e => e !== extra)
    }));
  };

  const handleBooking = async () => {
    // Validate required fields
    if (!bookingData.pickupLocation || !bookingData.date || !bookingData.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in pickup location, date, and time.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'chauffeur' && !bookingData.destination) {
      toast({
        title: "Missing Destination",
        description: "Please select a destination for chauffeur service.",
        variant: "destructive"
      });
      return;
    }

    if (activeTab === 'rental' && (!bookingData.returnDate || !bookingData.returnTime)) {
      toast({
        title: "Missing Return Information",
        description: "Please select return date and time for rental service.",
        variant: "destructive"
      });
      return;
    }

    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const bookingPayload = {
        pickup_location: bookingData.pickupLocation,
        destination: activeTab === 'chauffeur' ? bookingData.destination : null,
        pickup_date: bookingData.date,
        pickup_time: bookingData.time,
        return_date: activeTab === 'rental' ? bookingData.returnDate : null,
        return_time: activeTab === 'rental' ? bookingData.returnTime : null,
        passengers: bookingData.passengers,
        vehicle_type: bookingData.vehicleType,
        extras: bookingData.extras,
        payment_method: bookingData.paymentMethod,
        promo_code: bookingData.promoCode || null
      };

      const response = await BookingService.create(bookingPayload);
      
      if (response.success) {
        toast({
          title: "Booking Created!",
          description: `Your ${activeTab} booking has been confirmed. Estimated price: $${estimatedPrice}`,
        });
        
        // Reset form
        setBookingData({
          pickupLocation: '',
          destination: '',
          date: '',
          time: '',
          returnDate: '',
          returnTime: '',
          passengers: 1,
          vehicleType: 'Economy',
          extras: [],
          paymentMethod: 'card',
          promoCode: ''
        });
        setShowPromoCode(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: handleApiError(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Available extras
  const availableExtras = [
    { key: 'childSeat', label: 'Child Seat (+$15)', price: 15 },
    { key: 'meetGreet', label: 'Meet & Greet (+$25)', price: 25 },
    { key: 'luggage', label: 'Extra Luggage (+$10)', price: 10 },
    { key: 'wifi', label: 'WiFi Hotspot (+$5)', price: 5 }
  ];

  // Payment methods with discounts
  const paymentMethods = [
    { id: 'icp', name: 'ICP (Internet Computer) (-15%)', discount: 0.15 },
    { id: 'usdt', name: 'USDT (-10%)', discount: 0.10 },
    { id: 'btc', name: 'Bitcoin (-10%)', discount: 0.10 },
    { id: 'eth', name: 'Ethereum (-10%)', discount: 0.10 },
    { id: 'card', name: 'Credit Card', discount: 0 }
  ];

  return (
    <div className="booking-box">
      <div className="booking-header">
        <h3 className="heading-2">Book Your Ride</h3>
        <p className="body-medium">Premium EV transportation at your fingertips</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="booking-tabs">
        <TabsList className="tabs-list">
          <TabsTrigger value="chauffeur" className="tab-trigger">
            <Car className="w-4 h-4" />
            Chauffeur
          </TabsTrigger>
          <TabsTrigger value="rental" className="tab-trigger">
            <Users className="w-4 h-4" />
            Rental
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chauffeur" className="booking-content">
          <div className="booking-form">
            {/* Pickup Location */}
            <div className="form-group">
              <label className="form-label">
                <MapPin className="w-4 h-4" />
                Pickup Location
              </label>
              <Select value={bookingData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                <SelectTrigger className="select-trigger">
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="form-group">
              <label className="form-label">
                <MapPin className="w-4 h-4" />
                Destination
              </label>
              <Select value={bookingData.destination} onValueChange={(value) => handleInputChange('destination', value)}>
                <SelectTrigger className="select-trigger">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <Input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Clock className="w-4 h-4" />
                  Time
                </label>
                <Input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rental" className="booking-content">
          <div className="booking-form">
            {/* Pickup Location */}
            <div className="form-group">
              <label className="form-label">
                <MapPin className="w-4 h-4" />
                Pickup Location
              </label>
              <Select value={bookingData.pickupLocation} onValueChange={(value) => handleInputChange('pickupLocation', value)}>
                <SelectTrigger className="select-trigger">
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pickup Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="w-4 h-4" />
                  Pickup Date
                </label>
                <Input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Clock className="w-4 h-4" />
                  Pickup Time
                </label>
                <Input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* Return Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar className="w-4 h-4" />
                  Return Date
                </label>
                <Input
                  type="date"
                  value={bookingData.returnDate}
                  onChange={(e) => handleInputChange('returnDate', e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Clock className="w-4 h-4" />
                  Return Time
                </label>
                <Input
                  type="time"
                  value={bookingData.returnTime}
                  onChange={(e) => handleInputChange('returnTime', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Common booking options */}
      <div className="booking-options">
        {/* Passengers & Vehicle Type */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <Users className="w-4 h-4" />
              Passengers
            </label>
            <Select value={bookingData.passengers.toString()} onValueChange={(value) => handleInputChange('passengers', parseInt(value))}>
              <SelectTrigger className="select-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="form-group">
            <label className="form-label">
              <Car className="w-4 h-4" />
              Vehicle Type
            </label>
            <Select value={bookingData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
              <SelectTrigger className="select-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Extras */}
        <div className="form-group">
          <label className="form-label">Extras</label>
          <div className="extras-grid">
            {Object.entries(mockPricingCalculator.extras).map(([key, extra]) => (
              <div key={key} className="extra-item">
                <Checkbox
                  id={key}
                  checked={bookingData.extras.includes(key)}
                  onCheckedChange={(checked) => handleExtrasChange(key, checked)}
                />
                <label htmlFor={key} className="extra-label">
                  {extra.label} (+${extra.price})
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label className="form-label">
            <CreditCard className="w-4 h-4" />
            Payment Method
          </label>
          <Select value={bookingData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
            <SelectTrigger className="select-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockPricingCalculator.paymentMethods.map(method => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name} {method.discount > 0 && `(-${Math.round(method.discount * 100)}%)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Promo Code */}
        <div className="form-group">
          {!showPromoCode ? (
            <button
              type="button"
              onClick={() => setShowPromoCode(true)}
              className="promo-toggle"
            >
              <Tag className="w-4 h-4" />
              Have a promo code?
            </button>
          ) : (
            <div className="promo-input-group">
              <label className="form-label">
                <Tag className="w-4 h-4" />
                Promo Code
              </label>
              <Input
                placeholder="Enter promo code"
                value={bookingData.promoCode}
                onChange={(e) => handleInputChange('promoCode', e.target.value)}
                className="form-input"
              />
            </div>
          )}
        </div>

        {/* Price Estimate */}
        <div className="price-estimate">
          <div className="price-row">
            <span className="price-label">Estimated Price:</span>
            <span className="price-value">${calculatePrice}</span>
          </div>
          {bookingData.promoCode && mockPricingCalculator.promoCode[bookingData.promoCode] && (
            <div className="promo-applied">
              ✓ {mockPricingCalculator.promoCode[bookingData.promoCode].description}
            </div>
          )}
        </div>

        {/* Book Button */}
        <Button 
          onClick={handleBooking}
          className="btn-primary book-button"
        >
          Check Availability
        </Button>
      </div>
    </div>
  );
};

export default BookingBox;