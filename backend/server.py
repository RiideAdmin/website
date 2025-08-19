from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

# Import our modules
from models import *
from database import db
from auth import get_current_user, get_current_user_optional, authenticate_user, create_user_account, create_access_token
import seed_data

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="RIIDE Dapp API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Startup event
@app.on_event("startup")
async def startup_db():
    await db.connect()
    
    # Seed database if empty
    vehicle_count = await db.count_documents("vehicles")
    if vehicle_count == 0:
        print("Database appears empty, seeding with initial data...")
        await seed_data.seed_database()

# Shutdown event  
@app.on_event("shutdown")
async def shutdown_db():
    await db.close()

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register", response_model=APIResponse)
async def register(user_create: UserCreate):
    try:
        user = await create_user_account(user_create)
        access_token = create_access_token(data={"sub": user.id})
        
        return APIResponse(
            success=True,
            message="User registered successfully",
            data={
                "user": user.dict(),
                "access_token": access_token,
                "token_type": "bearer"
            }
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login", response_model=APIResponse)
async def login(user_login: UserLogin):
    user = await authenticate_user(user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.id})
    
    return APIResponse(
        success=True,
        message="Login successful",
        data={
            "user": user.dict(),
            "access_token": access_token,
            "token_type": "bearer"
        }
    )

@api_router.get("/auth/profile", response_model=APIResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return APIResponse(
        success=True,
        message="Profile retrieved successfully",
        data=current_user.dict()
    )

# ==================== VEHICLE ENDPOINTS ====================

@api_router.get("/vehicles", response_model=APIResponse)
async def get_vehicles(category: Optional[str] = None):
    try:
        if category:
            vehicles = await db.get_vehicles_by_category(category)
        else:
            vehicles = await db.find_documents("vehicles", {"available": True})
        
        return APIResponse(
            success=True,
            message="Vehicles retrieved successfully",
            data=vehicles
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/vehicles/{vehicle_id}", response_model=APIResponse)
async def get_vehicle(vehicle_id: str):
    vehicle = await db.get_document("vehicles", vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    return APIResponse(
        success=True,
        message="Vehicle retrieved successfully",
        data=vehicle
    )

# ==================== LOCATION ENDPOINTS ====================

@api_router.get("/locations", response_model=APIResponse)
async def get_locations():
    locations = await db.find_documents("locations")
    return APIResponse(
        success=True,
        message="Locations retrieved successfully",
        data=locations
    )

@api_router.get("/locations/search", response_model=APIResponse)
async def search_locations(query: str):
    # Simple text search - in production, use MongoDB text index
    locations = await db.find_documents("locations")
    filtered = [loc for loc in locations if query.lower() in loc['name'].lower()]
    
    return APIResponse(
        success=True,
        message="Locations found",
        data=filtered
    )

# ==================== PRICING ENDPOINTS ====================

@api_router.post("/pricing/calculate", response_model=APIResponse)
async def calculate_price(request: PriceEstimateRequest):
    try:
        # Get pricing rules
        pricing_rules = await db.find_documents("pricing_rules", {"vehicle_type": request.vehicle_type})
        if not pricing_rules:
            raise HTTPException(status_code=404, detail="Pricing not found for vehicle type")
        
        rule = pricing_rules[0]
        
        # Calculate base price
        if request.service_type == "rental" and request.duration_days:
            base_price = rule["base_price_daily"] * request.duration_days
        else:
            hours = request.duration_hours or 1
            base_price = rule["base_price_hourly"] * hours
        
        # Calculate extras price
        extras_price = 0
        if request.extras:
            extras_data = await db.find_documents("extras")
            extras_map = {extra["name"]: extra["price"] for extra in extras_data}
            extras_price = sum(extras_map.get(extra, 0) for extra in request.extras)
        
        subtotal = base_price + extras_price
        
        # Apply payment method discount
        payment_discounts = {
            "icp": 0.15,
            "usdt": 0.10,
            "btc": 0.10,
            "eth": 0.10,
            "card": 0.0
        }
        payment_discount = payment_discounts.get(request.payment_method, 0.0)
        payment_discount_amount = subtotal * payment_discount
        
        # Apply promo code discount
        promo_discount_amount = 0
        if request.promo_code:
            promo = await db.validate_promo_code(request.promo_code)
            if promo:
                promo_discount_amount = subtotal * promo["discount_percentage"]
        
        total_discount = payment_discount_amount + promo_discount_amount
        total_price = max(0, subtotal - total_discount)
        
        breakdown = {
            "base_price": base_price,
            "extras_price": extras_price,
            "subtotal": subtotal,
            "payment_discount": payment_discount_amount,
            "promo_discount": promo_discount_amount,
            "total_discount": total_discount,
            "total_price": total_price
        }
        
        estimate = PriceEstimate(
            base_price=base_price,
            extras_price=extras_price,
            discount_amount=total_discount,
            total_price=total_price,
            breakdown=breakdown
        )
        
        return APIResponse(
            success=True,
            message="Price calculated successfully",
            data=estimate.dict()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/promo/validate", response_model=APIResponse)
async def validate_promo(validation: PromoValidation):
    promo = await db.validate_promo_code(validation.code)
    if not promo:
        raise HTTPException(status_code=404, detail="Invalid or expired promo code")
    
    discount_amount = validation.booking_amount * promo["discount_percentage"]
    
    return APIResponse(
        success=True,
        message="Promo code is valid",
        data={
            "promo": promo,
            "discount_amount": discount_amount,
            "final_amount": validation.booking_amount - discount_amount
        }
    )

# ==================== BOOKING ENDPOINTS ====================

@api_router.post("/bookings", response_model=APIResponse)
async def create_booking(booking_create: BookingCreate, current_user: User = Depends(get_current_user)):
    try:
        # Calculate pricing first
        price_request = PriceEstimateRequest(
            vehicle_type=booking_create.vehicle_type,
            service_type="chauffeur" if booking_create.destination else "rental",
            duration_hours=1,  # Default, should be calculated based on dates
            extras=booking_create.extras,
            payment_method=booking_create.payment_method,
            promo_code=booking_create.promo_code
        )
        
        # Reuse the calculate_price logic
        pricing_rules = await db.find_documents("pricing_rules", {"vehicle_type": booking_create.vehicle_type})
        if not pricing_rules:
            raise HTTPException(status_code=404, detail="Pricing not found for vehicle type")
        
        rule = pricing_rules[0]
        base_price = rule["base_price_hourly"]  # Simplified for demo
        
        # Calculate extras
        extras_price = 0
        if booking_create.extras:
            extras_data = await db.find_documents("extras")
            extras_map = {extra["name"]: extra["price"] for extra in extras_data}
            extras_price = sum(extras_map.get(extra, 0) for extra in booking_create.extras)
        
        subtotal = base_price + extras_price
        
        # Apply discounts (simplified)
        discount_amount = 0
        if booking_create.promo_code:
            promo = await db.validate_promo_code(booking_create.promo_code)
            if promo:
                discount_amount = subtotal * promo["discount_percentage"]
                await db.increment_promo_usage(promo["id"])
        
        total_price = max(0, subtotal - discount_amount)
        
        # Create booking
        booking_data = booking_create.dict()
        booking_data.update({
            "user_id": current_user.id,
            "base_price": base_price,
            "extras_price": extras_price,
            "discount_amount": discount_amount,
            "total_price": total_price,
            "status": BookingStatus.PENDING
        })
        
        booking = Booking(**booking_data)
        booking_id = await db.create_document("bookings", booking.dict())
        
        return APIResponse(
            success=True,
            message="Booking created successfully",
            data=booking.dict()
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/bookings", response_model=APIResponse)
async def get_user_bookings(current_user: User = Depends(get_current_user)):
    bookings = await db.get_user_bookings(current_user.id)
    return APIResponse(
        success=True,
        message="Bookings retrieved successfully",
        data=bookings
    )

@api_router.get("/bookings/{booking_id}", response_model=APIResponse)
async def get_booking(booking_id: str, current_user: User = Depends(get_current_user)):
    booking = await db.get_document("bookings", booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check if user owns this booking (or is admin)
    if booking["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this booking")
    
    return APIResponse(
        success=True,
        message="Booking retrieved successfully",
        data=booking
    )

# ==================== CONTENT ENDPOINTS ====================

@api_router.get("/services", response_model=APIResponse)
async def get_services():
    services = await db.get_services()
    return APIResponse(
        success=True,
        message="Services retrieved successfully",
        data=services
    )

@api_router.get("/testimonials", response_model=APIResponse)
async def get_testimonials():
    testimonials = await db.get_testimonials()
    return APIResponse(
        success=True,
        message="Testimonials retrieved successfully",
        data=testimonials
    )

@api_router.get("/blog/posts", response_model=APIResponse)
async def get_blog_posts(limit: int = 10):
    posts = await db.get_blog_posts(limit=limit)
    return APIResponse(
        success=True,
        message="Blog posts retrieved successfully",
        data=posts
    )

@api_router.get("/faqs", response_model=APIResponse)
async def get_faqs(category: Optional[str] = None):
    faqs = await db.get_faqs(category)
    return APIResponse(
        success=True,
        message="FAQs retrieved successfully",
        data=faqs
    )

# ==================== ROOT ENDPOINT ====================

@api_router.get("/")
async def root():
    return APIResponse(
        success=True,
        message="RIIDE Dapp API v1.0.0 - Premium EV Transportation Platform"
    )

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
