# RIIDE Dapp API Contracts & Integration Plan

## Overview
This document defines the API contracts, data models, and integration strategy for the RIIDE Dapp backend to replace mock data with real functionality.

## Current Mock Data (to be replaced)

### Frontend Mock Files:
- `/frontend/src/data/mock.js` - Contains all mock data that needs backend implementation

### Mock Data Categories:
1. **Vehicles** (`mockVehicles`, `mockMarineVehicles`)
2. **Services** (`mockServices`) 
3. **Testimonials** (`mockTestimonials`)
4. **Pricing Calculator** (`mockPricingCalculator`)
5. **Locations** (`mockLocations`)
6. **Blog Posts** (`mockBlogPosts`)
7. **FAQs** (`mockFAQs`)

## Required API Endpoints

### 1. Authentication & User Management
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/profile
PUT /api/auth/profile
POST /api/auth/wallet-connect
```

**Models:**
- User (id, email, name, phone, wallet_address, created_at, updated_at)
- UserProfile (user_id, preferences, loyalty_points, ride_history)

### 2. Vehicle Management
```
GET /api/vehicles
GET /api/vehicles/:id
GET /api/vehicles/search?category=chauffeur|rental|marine
POST /api/admin/vehicles (Admin only)
PUT /api/admin/vehicles/:id (Admin only)
DELETE /api/admin/vehicles/:id (Admin only)
```

**Models:**
- Vehicle (id, name, type, category, image_url, price_per_hour, price_per_day, features[], passengers, description, availability, location)

### 3. Booking Management
```
POST /api/bookings
GET /api/bookings (User's bookings)
GET /api/bookings/:id
PUT /api/bookings/:id/cancel
PUT /api/bookings/:id/status
POST /api/bookings/estimate-price
GET /api/bookings/driver (Driver's assigned bookings)
```

**Models:**
- Booking (id, user_id, vehicle_id, pickup_location, destination, pickup_date, pickup_time, return_date, return_time, passengers, vehicle_type, extras[], payment_method, promo_code, total_price, status, created_at)
- BookingStatus (pending, confirmed, active, completed, cancelled)

### 4. Pricing & Payment
```
POST /api/pricing/calculate
GET /api/pricing/payment-methods
POST /api/payments/process
GET /api/payments/crypto-rates
POST /api/promo/validate
```

**Models:**
- PricingRule (id, vehicle_type, base_price_hourly, base_price_daily, distance_rate)
- Extra (id, name, price, description)
- PromoCode (id, code, discount_percentage, valid_from, valid_to, usage_limit, used_count)
- Payment (id, booking_id, amount, currency, payment_method, transaction_hash, status)

### 5. Location Management
```
GET /api/locations
GET /api/locations/search?query=term
POST /api/admin/locations (Admin only)
```

**Models:**
- Location (id, name, address, coordinates, type, popular)

### 6. Content Management
```
GET /api/services
GET /api/testimonials
GET /api/blog/posts
GET /api/faqs
POST /api/admin/testimonials (Admin only)
POST /api/admin/blog/posts (Admin only)
```

**Models:**
- Service (id, title, description, icon, features[], starting_price)
- Testimonial (id, name, role, content, rating, avatar_url, approved)
- BlogPost (id, title, excerpt, content, publish_date, category, image_url, author)
- FAQ (id, question, answer, category, order)

### 7. Driver Management
```
POST /api/drivers/register
GET /api/drivers/profile
PUT /api/drivers/profile
GET /api/drivers/bookings
PUT /api/drivers/status (online/offline)
POST /api/drivers/accept-booking
```

**Models:**
- Driver (id, user_id, license_number, vehicle_id, status, rating, total_rides, earnings)

### 8. Web3 & Rewards
```
GET /api/rewards/balance
POST /api/rewards/claim
GET /api/rewards/history
GET /api/web3/wallet-balance
POST /api/web3/stake-tokens
```

**Models:**
- RewardTransaction (id, user_id, booking_id, amount, type, description, created_at)
- StakingPool (id, user_id, staked_amount, reward_rate, staked_at)

## Database Schema Requirements

### Core Tables:
1. `users` - User authentication and basic info
2. `user_profiles` - Extended user data
3. `vehicles` - All vehicle information
4. `bookings` - All booking records
5. `payments` - Payment transactions
6. `promo_codes` - Promotional codes
7. `locations` - Pickup/drop locations
8. `services` - Service offerings
9. `testimonials` - Customer reviews
10. `blog_posts` - Blog content
11. `faqs` - FAQ content
12. `drivers` - Driver information
13. `reward_transactions` - Token rewards history

### Indexes Needed:
- `vehicles.category` for filtering
- `bookings.user_id` for user history
- `bookings.pickup_date` for scheduling
- `locations.name` for search

## Frontend Integration Plan

### 1. Remove Mock Data Imports
Replace in components:
- `LandingPage.jsx` - Replace mock imports with API calls
- `BookingBox.jsx` - Connect to real pricing and booking APIs

### 2. Add API Service Layer
Create `/frontend/src/services/api.js`:
```javascript
const API_BASE = process.env.REACT_APP_BACKEND_URL + '/api';

export const vehicleService = {
  getAll: () => fetch(`${API_BASE}/vehicles`),
  getByCategory: (category) => fetch(`${API_BASE}/vehicles/search?category=${category}`)
};

export const bookingService = {
  create: (bookingData) => fetch(`${API_BASE}/bookings`, {method: 'POST', body: JSON.stringify(bookingData)}),
  estimatePrice: (data) => fetch(`${API_BASE}/pricing/calculate`, {method: 'POST', body: JSON.stringify(data)})
};
// ... other services
```

### 3. State Management
Add React Context for:
- User authentication state
- Booking form state  
- Vehicle data state
- Pricing calculator state

### 4. Error Handling
- Loading states for all API calls
- Error messages for failed requests
- Retry mechanisms for critical operations
- Offline state handling

## Authentication Strategy

### Web3 Wallet Integration:
1. **Plug Wallet** (Internet Computer)
2. **MetaMask** (Ethereum)
3. **Traditional Email/Password** (fallback)

### JWT Token Flow:
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Wallet signature verification

## Real-time Features

### WebSocket Endpoints:
- `/ws/booking-updates` - Real-time booking status
- `/ws/driver-location` - Live driver tracking
- `/ws/price-updates` - Dynamic pricing changes

## Testing Strategy

### API Testing:
- All CRUD operations
- Authentication flows
- Payment processing
- Booking workflow end-to-end

### Integration Testing:
- Frontend → Backend data flow
- Mock data removal verification
- Error handling scenarios

## Deployment Considerations

### Environment Variables:
```bash
# Backend
MONGO_URL=mongodb://localhost:27017/riide_dapp
JWT_SECRET=your_jwt_secret
WEB3_PROVIDER_URL=your_web3_provider
STRIPE_SECRET_KEY=your_stripe_key

# Frontend  
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_WEB3_PROVIDER=your_web3_provider
```

### Security Requirements:
- Input validation on all endpoints
- Rate limiting for public APIs
- CORS configuration for frontend domain
- API key authentication for admin endpoints
- Wallet signature verification for Web3 operations

## Migration Plan

### Phase 1: Core APIs
1. User authentication
2. Vehicle management
3. Basic booking functionality

### Phase 2: Advanced Features  
1. Payment processing
2. Real-time updates
3. Driver management

### Phase 3: Web3 Integration
1. Wallet connectivity
2. Token rewards system
3. Crypto payment processing

This contracts file ensures seamless migration from mock data to real backend implementation while maintaining the current frontend functionality.