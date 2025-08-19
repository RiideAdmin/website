from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, date, time
from enum import Enum
import uuid

# Enums
class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class VehicleCategory(str, Enum):
    CHAUFFEUR = "chauffeur"
    RENTAL = "rental"
    MARINE = "marine"

class PaymentMethod(str, Enum):
    ICP = "icp"
    USDT = "usdt"
    BTC = "btc"
    ETH = "eth"
    CARD = "card"

class DriverStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    BUSY = "busy"

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    phone: Optional[str] = None
    wallet_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    preferences: Dict[str, Any] = {}
    loyalty_points: int = 0
    total_rides: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Vehicle Models
class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    type: str  # Premium, Economy, SUV, Van, Marine
    category: VehicleCategory
    image_url: str
    price_per_hour: float
    price_per_day: float
    features: List[str] = []
    passengers: int
    description: str
    available: bool = True
    location: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VehicleCreate(BaseModel):
    name: str
    type: str
    category: VehicleCategory
    image_url: str
    price_per_hour: float
    price_per_day: float
    features: List[str] = []
    passengers: int
    description: str
    location: str

# Location Models
class Location(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    coordinates: Optional[Dict[str, float]] = None  # {"lat": 0.0, "lng": 0.0}
    type: str = "standard"  # airport, hotel, landmark, etc.
    popular: bool = False

# Booking Models  
class BookingCreate(BaseModel):
    pickup_location: str
    destination: Optional[str] = None  # Only for chauffeur service
    pickup_date: date
    pickup_time: time
    return_date: Optional[date] = None  # Only for rental service
    return_time: Optional[time] = None  # Only for rental service
    passengers: int
    vehicle_type: str
    extras: List[str] = []
    payment_method: PaymentMethod
    promo_code: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    vehicle_id: Optional[str] = None  # Assigned later
    driver_id: Optional[str] = None  # Assigned later
    pickup_location: str
    destination: Optional[str] = None
    pickup_date: date
    pickup_time: time
    return_date: Optional[date] = None
    return_time: Optional[time] = None
    passengers: int
    vehicle_type: str
    extras: List[str] = []
    payment_method: PaymentMethod
    promo_code: Optional[str] = None
    base_price: float
    extras_price: float
    discount_amount: float = 0.0
    total_price: float
    status: BookingStatus = BookingStatus.PENDING
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    vehicle_id: Optional[str] = None
    driver_id: Optional[str] = None

# Pricing Models
class PriceEstimateRequest(BaseModel):
    vehicle_type: str
    service_type: str  # "chauffeur" or "rental"
    duration_hours: Optional[int] = 1
    duration_days: Optional[int] = None
    extras: List[str] = []
    payment_method: PaymentMethod
    promo_code: Optional[str] = None
    pickup_location: Optional[str] = None
    destination: Optional[str] = None

class PriceEstimate(BaseModel):
    base_price: float
    extras_price: float
    discount_amount: float
    total_price: float
    breakdown: Dict[str, Any]

class PricingRule(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_type: str
    base_price_hourly: float
    base_price_daily: float
    distance_rate: float = 2.5  # per mile

class Extra(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    price: float
    description: str

# Promo Code Models
class PromoCode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    code: str
    discount_percentage: float
    description: str
    valid_from: datetime
    valid_to: datetime
    usage_limit: int
    used_count: int = 0
    active: bool = True

class PromoValidation(BaseModel):
    code: str
    booking_amount: float

# Payment Models
class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    amount: float
    currency: str = "USD"
    payment_method: PaymentMethod
    transaction_hash: Optional[str] = None
    status: str = "pending"  # pending, completed, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Content Models
class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    features: List[str] = []
    starting_price: float
    order: int = 0

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    content: str
    rating: int = 5
    avatar_url: str
    approved: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlogPost(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    publish_date: date
    category: str
    image_url: str
    author: str = "RIIDE Team"
    published: bool = True
    read_time: str = "5 min read"

class FAQ(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    category: str = "general"
    order: int = 0

# Driver Models
class Driver(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    license_number: str
    vehicle_id: Optional[str] = None
    status: DriverStatus = DriverStatus.OFFLINE
    rating: float = 5.0
    total_rides: int = 0
    earnings: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DriverCreate(BaseModel):
    license_number: str
    vehicle_id: Optional[str] = None

# Rewards Models
class RewardTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    booking_id: Optional[str] = None
    amount: float
    type: str  # "ride_reward", "referral", "staking", etc.
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class StakingPool(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    staked_amount: float
    reward_rate: float = 0.08  # 8% APY
    staked_at: datetime = Field(default_factory=datetime.utcnow)
    last_reward_at: datetime = Field(default_factory=datetime.utcnow)

# API Response Models
class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    per_page: int
    pages: int