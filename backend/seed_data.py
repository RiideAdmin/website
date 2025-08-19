import asyncio
from database import db
from models import *
from datetime import datetime, date

async def seed_database():
    """Seed the database with initial data"""
    
    print("Seeding database with initial data...")
    
    # Seed Vehicles
    vehicles_data = [
        {
            "id": "tesla-model-s-1",
            "name": "Tesla Model S",
            "type": "Premium",
            "category": "chauffeur",
            "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop",
            "price_per_hour": 85,
            "price_per_day": 650,
            "features": ["Autopilot", "Premium Interior", "Long Range"],
            "passengers": 5,
            "description": "Luxury electric sedan with premium comfort",
            "available": True,
            "location": "San Francisco"
        },
        {
            "id": "bmw-ix-1",
            "name": "BMW iX",
            "type": "SUV",
            "category": "rental",
            "image_url": "https://images.unsplash.com/photo-1617654112328-2665328d8953?w=600&h=400&fit=crop",
            "price_per_hour": 95,
            "price_per_day": 750,
            "features": ["Spacious", "All-Wheel Drive", "Premium Sound"],
            "passengers": 7,
            "description": "Electric SUV perfect for family trips",
            "available": True,
            "location": "San Francisco"
        },
        {
            "id": "mercedes-eqs-1",
            "name": "Mercedes EQS",
            "type": "Premium",
            "category": "chauffeur",
            "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
            "price_per_hour": 120,
            "price_per_day": 950,
            "features": ["Massage Seats", "MBUX System", "Ultra Luxury"],
            "passengers": 4,
            "description": "Ultimate luxury electric experience",
            "available": True,
            "location": "San Francisco"
        },
        {
            "id": "rivian-r1t-1",
            "name": "Rivian R1T",
            "type": "Van",
            "category": "rental",
            "image_url": "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop",
            "price_per_hour": 75,
            "price_per_day": 580,
            "features": ["Electric Truck", "Off-Road", "Tank Turn"],
            "passengers": 5,
            "description": "Electric adventure truck",
            "available": True,
            "location": "San Francisco"
        },
        {
            "id": "electric-yacht-1",
            "name": "Electric Yacht",
            "type": "Marine",
            "category": "marine",
            "image_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
            "price_per_hour": 450,
            "price_per_day": 3500,
            "features": ["Zero Emissions", "Silent Operation", "Premium Deck"],
            "passengers": 12,
            "description": "Sustainable luxury marine experience",
            "available": True,
            "location": "San Francisco Bay"
        },
        {
            "id": "electric-speedboat-1",
            "name": "Electric Speedboat",
            "type": "Marine",
            "category": "marine",
            "image_url": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
            "price_per_hour": 285,
            "price_per_day": 2200,
            "features": ["High Speed", "Eco-Friendly", "Sports Design"],
            "passengers": 6,
            "description": "Thrilling electric water sports",
            "available": True,
            "location": "San Francisco Bay"
        }
    ]
    
    for vehicle_data in vehicles_data:
        await db.create_document("vehicles", vehicle_data)
    
    # Seed Locations
    locations_data = [
        {"id": "sfo", "name": "San Francisco Airport (SFO)", "address": "San Francisco, CA", "type": "airport", "popular": True},
        {"id": "downtown-sf", "name": "Downtown San Francisco", "address": "San Francisco, CA", "type": "city", "popular": True},
        {"id": "silicon-valley", "name": "Silicon Valley", "address": "Silicon Valley, CA", "type": "city", "popular": True},
        {"id": "oakland-airport", "name": "Oakland Airport (OAK)", "address": "Oakland, CA", "type": "airport", "popular": True},
        {"id": "san-jose-airport", "name": "San Jose Airport (SJC)", "address": "San Jose, CA", "type": "airport", "popular": True},
        {"id": "napa-valley", "name": "Napa Valley", "address": "Napa Valley, CA", "type": "landmark", "popular": True},
        {"id": "berkeley", "name": "Berkeley", "address": "Berkeley, CA", "type": "city", "popular": False},
        {"id": "palo-alto", "name": "Palo Alto", "address": "Palo Alto, CA", "type": "city", "popular": False},
        {"id": "stanford", "name": "Stanford University", "address": "Stanford, CA", "type": "landmark", "popular": False},
        {"id": "fishermans-wharf", "name": "Fisherman's Wharf", "address": "San Francisco, CA", "type": "landmark", "popular": False},
        {"id": "union-square", "name": "Union Square", "address": "San Francisco, CA", "type": "landmark", "popular": False},
        {"id": "financial-district", "name": "Financial District", "address": "San Francisco, CA", "type": "business", "popular": False}
    ]
    
    for location_data in locations_data:
        await db.create_document("locations", location_data)
    
    # Seed Services
    services_data = [
        {
            "id": "premium-chauffeur",
            "title": "Premium Chauffeur",
            "description": "Professional drivers with luxury EVs for business or leisure",
            "icon": "Car",
            "features": ["Professional Drivers", "Real-time Tracking", "Premium Vehicles", "24/7 Service"],
            "starting_price": 85,
            "order": 1
        },
        {
            "id": "ev-rentals",
            "title": "EV Rentals",
            "description": "Rent electric vehicles by the hour, day, or week",
            "icon": "Key",
            "features": ["Flexible Duration", "Various Models", "Insurance Included", "Easy Pickup"],
            "starting_price": 45,
            "order": 2
        },
        {
            "id": "marine-ev",
            "title": "Marine EV",
            "description": "Sustainable electric boats and yachts for water adventures",
            "icon": "Anchor",
            "features": ["Zero Emissions", "Silent Operation", "Premium Experience", "Captain Included"],
            "starting_price": 285,
            "order": 3
        }
    ]
    
    for service_data in services_data:
        await db.create_document("services", service_data)
    
    # Seed Pricing Rules
    pricing_rules_data = [
        {"id": "economy-pricing", "vehicle_type": "Economy", "base_price_hourly": 45, "base_price_daily": 320, "distance_rate": 2.5},
        {"id": "premium-pricing", "vehicle_type": "Premium", "base_price_hourly": 85, "base_price_daily": 650, "distance_rate": 2.5},
        {"id": "suv-pricing", "vehicle_type": "SUV", "base_price_hourly": 95, "base_price_daily": 750, "distance_rate": 2.5},
        {"id": "van-pricing", "vehicle_type": "Van", "base_price_hourly": 75, "base_price_daily": 580, "distance_rate": 2.5},
        {"id": "marine-pricing", "vehicle_type": "Marine", "base_price_hourly": 285, "base_price_daily": 2200, "distance_rate": 0}
    ]
    
    for pricing_data in pricing_rules_data:
        await db.create_document("pricing_rules", pricing_data)
    
    # Seed Extras
    extras_data = [
        {"id": "child-seat", "name": "childSeat", "price": 15, "description": "Child safety seat"},
        {"id": "meet-greet", "name": "meetGreet", "price": 25, "description": "Meet & greet service"},
        {"id": "extra-luggage", "name": "luggage", "price": 10, "description": "Extra luggage handling"},
        {"id": "wifi-hotspot", "name": "wifi", "price": 5, "description": "WiFi hotspot service"}
    ]
    
    for extra_data in extras_data:
        await db.create_document("extras", extra_data)
    
    # Seed Promo Codes
    promo_codes_data = [
        {
            "id": "riide20",
            "code": "RIIDE20",
            "discount_percentage": 0.20,
            "description": "20% off first ride",
            "valid_from": "2025-01-01T00:00:00",
            "valid_to": "2025-12-31T23:59:59",
            "usage_limit": 1000,
            "used_count": 0,
            "active": True
        },
        {
            "id": "launch50",
            "code": "LAUNCH50",
            "discount_percentage": 0.50,
            "description": "50% off launch special",
            "valid_from": "2025-01-01T00:00:00",
            "valid_to": "2025-03-31T23:59:59",
            "usage_limit": 500,
            "used_count": 0,
            "active": True
        },
        {
            "id": "student15",
            "code": "STUDENT15",
            "discount_percentage": 0.15,
            "description": "15% student discount",
            "valid_from": "2025-01-01T00:00:00",
            "valid_to": "2025-12-31T23:59:59",
            "usage_limit": 2000,
            "used_count": 0,
            "active": True
        }
    ]
    
    for promo_data in promo_codes_data:
        await db.create_document("promo_codes", promo_data)
    
    # Seed Testimonials
    testimonials_data = [
        {
            "id": "testimonial-1",
            "name": "Sarah Chen",
            "role": "Business Executive",
            "content": "RIIDE transformed my daily commute. The Tesla Model S with a professional chauffeur is perfect for client meetings. Plus, earning $RIIDE tokens is a bonus!",
            "rating": 5,
            "avatar_url": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            "approved": True
        },
        {
            "id": "testimonial-2",
            "name": "Michael Rodriguez",
            "role": "Tech Entrepreneur",
            "content": "Rented the BMW iX for a week-long business trip. Seamless Web3 payment with MetaMask, and the vehicle was immaculate. Highly recommended!",
            "rating": 5,
            "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            "approved": True
        },
        {
            "id": "testimonial-3",
            "name": "Emily Watson",
            "role": "Event Planner",
            "content": "The electric yacht booking for our corporate event was flawless. Sustainable luxury at its finest. The team loves the $RIIDE rewards program.",
            "rating": 5,
            "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            "approved": True
        }
    ]
    
    for testimonial_data in testimonials_data:
        await db.create_document("testimonials", testimonial_data)
    
    # Seed Blog Posts
    blog_posts_data = [
        {
            "id": "blog-1",
            "title": "The Future of Sustainable Transportation: Web3 Meets Electric Mobility",
            "excerpt": "Discover how blockchain technology is revolutionizing the EV industry and creating new opportunities for sustainable travel.",
            "content": "Full blog content here...",
            "publish_date": "2025-01-15",
            "read_time": "5 min read",
            "category": "Innovation",
            "image_url": "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&h=250&fit=crop",
            "author": "RIIDE Team",
            "published": True
        },
        {
            "id": "blog-2",
            "title": "Maximizing Your $RIIDE Token Rewards: A Complete Guide",
            "excerpt": "Learn how to earn, stake, and maximize your rewards in the RIIDE ecosystem while contributing to sustainable transport.",
            "content": "Full blog content here...",
            "publish_date": "2025-01-12",
            "read_time": "7 min read",
            "category": "Rewards",
            "image_url": "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=250&fit=crop",
            "author": "RIIDE Team",
            "published": True
        },
        {
            "id": "blog-3",
            "title": "Electric Marine Vehicles: The Next Frontier in Clean Transportation",
            "excerpt": "Explore how electric boats and yachts are changing the marine industry and offering new sustainable adventure options.",
            "content": "Full blog content here...",
            "publish_date": "2025-01-10",
            "read_time": "4 min read",
            "category": "Marine EV",
            "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
            "author": "RIIDE Team",
            "published": True
        }
    ]
    
    for blog_data in blog_posts_data:
        await db.create_document("blog_posts", blog_data)
    
    # Seed FAQs
    faqs_data = [
        {
            "id": "faq-1",
            "question": "How does Web3 payment work with RIIDE?",
            "answer": "RIIDE supports multiple Web3 wallets including Plug and MetaMask. Connect your wallet, choose your preferred cryptocurrency (ICP, USDT, BTC, ETH), and enjoy discounted rates compared to traditional payment methods. All transactions are secure and transparent on the blockchain.",
            "category": "payments",
            "order": 1
        },
        {
            "id": "faq-2", 
            "question": "What are $RIIDE tokens and how do I earn them?",
            "answer": "$RIIDE tokens are our native utility tokens that you earn with every booking. Use them for discounts on future rides, stake them for additional rewards, or participate in governance decisions. Tokens are automatically credited to your wallet after each completed trip.",
            "category": "rewards",
            "order": 2
        },
        {
            "id": "faq-3",
            "question": "Are all vehicles electric?",
            "answer": "Yes, RIIDE is 100% committed to sustainable transportation. Our entire fleet consists of premium electric vehicles including Tesla, BMW, Mercedes, and Rivian models. We also offer electric marine vehicles for water adventures.",
            "category": "vehicles",
            "order": 3
        },
        {
            "id": "faq-4",
            "question": "How do I become a RIIDE driver?",
            "answer": "Join our driver network by applying through our Driver Portal. You'll need a valid license, clean driving record, and access to an approved electric vehicle. Drivers earn competitive rates plus $RIIDE token bonuses for maintaining high ratings and completing eco-friendly trips.",
            "category": "drivers",
            "order": 4
        },
        {
            "id": "faq-5",
            "question": "What's the difference between Chauffeur and Rental services?",
            "answer": "Chauffeur service includes a professional driver for point-to-point trips or hourly bookings. Rental service lets you drive the vehicle yourself for hourly, daily, or weekly periods. Both options include insurance and 24/7 support.",
            "category": "services",
            "order": 5
        }
    ]
    
    for faq_data in faqs_data:
        await db.create_document("faqs", faq_data)
    
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())