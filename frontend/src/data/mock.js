// Mock data for RIIDE Dapp Landing Page

export const mockVehicles = [
  {
    id: 1,
    name: "Tesla Model S",
    type: "Premium",
    category: "chauffeur",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop",
    pricePerHour: 85,
    pricePerDay: 650,
    features: ["Autopilot", "Premium Interior", "Long Range"],
    passengers: 5,
    description: "Luxury electric sedan with premium comfort"
  },
  {
    id: 2,
    name: "BMW iX",
    type: "SUV",
    category: "rental",
    image: "https://images.unsplash.com/photo-1617654112328-2665328d8953?w=600&h=400&fit=crop",
    pricePerHour: 95,
    pricePerDay: 750,
    features: ["Spacious", "All-Wheel Drive", "Premium Sound"],
    passengers: 7,
    description: "Electric SUV perfect for family trips"
  },
  {
    id: 3,
    name: "Mercedes EQS",
    type: "Premium",
    category: "chauffeur",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop",
    pricePerHour: 120,
    pricePerDay: 950,
    features: ["Massage Seats", "MBUX System", "Ultra Luxury"],
    passengers: 4,
    description: "Ultimate luxury electric experience"
  },
  {
    id: 4,
    name: "Rivian R1T",
    type: "Van",
    category: "rental",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&h=400&fit=crop",
    pricePerHour: 75,
    pricePerDay: 580,
    features: ["Electric Truck", "Off-Road", "Tank Turn"],
    passengers: 5,
    description: "Electric adventure truck"
  }
];

export const mockMarineVehicles = [
  {
    id: 5,
    name: "Electric Yacht",
    type: "Marine",
    category: "marine",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    pricePerHour: 450,
    pricePerDay: 3500,
    features: ["Zero Emissions", "Silent Operation", "Premium Deck"],
    passengers: 12,
    description: "Sustainable luxury marine experience"
  },
  {
    id: 6,
    name: "Electric Speedboat",
    type: "Marine",
    category: "marine",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    pricePerHour: 285,
    pricePerDay: 2200,
    features: ["High Speed", "Eco-Friendly", "Sports Design"],
    passengers: 6,
    description: "Thrilling electric water sports"
  }
];

export const mockServices = [
  {
    id: 1,
    title: "Premium Chauffeur",
    description: "Professional drivers with luxury EVs for business or leisure",
    icon: "Car",
    features: ["Professional Drivers", "Real-time Tracking", "Premium Vehicles", "24/7 Service"],
    startingPrice: 85
  },
  {
    id: 2,
    title: "EV Rentals",
    description: "Rent electric vehicles by the hour, day, or week",
    icon: "Key",
    features: ["Flexible Duration", "Various Models", "Insurance Included", "Easy Pickup"],
    startingPrice: 45
  },
  {
    id: 3,
    title: "Marine EV",
    description: "Sustainable electric boats and yachts for water adventures",
    icon: "Anchor",
    features: ["Zero Emissions", "Silent Operation", "Premium Experience", "Captain Included"],
    startingPrice: 285
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Business Executive",
    content: "RIIDE transformed my daily commute. The Tesla Model S with a professional chauffeur is perfect for client meetings. Plus, earning $RIIDE tokens is a bonus!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Tech Entrepreneur",
    content: "Rented the BMW iX for a week-long business trip. Seamless Web3 payment with MetaMask, and the vehicle was immaculate. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Event Planner",
    content: "The electric yacht booking for our corporate event was flawless. Sustainable luxury at its finest. The team loves the $RIIDE rewards program.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

export const mockPricingCalculator = {
  basePrices: {
    Economy: { hourly: 45, daily: 320 },
    Premium: { hourly: 85, daily: 650 },
    SUV: { hourly: 95, daily: 750 },
    Van: { hourly: 75, daily: 580 },
    Marine: { hourly: 285, daily: 2200 }
  },
  extras: {
    childSeat: { price: 15, label: "Child Seat" },
    meetGreet: { price: 25, label: "Meet & Greet" },
    luggage: { price: 10, label: "Extra Luggage" },
    wifi: { price: 5, label: "WiFi Hotspot" }
  },
  paymentMethods: [
    { id: 'icp', name: 'ICP (Internet Computer)', discount: 0.15 },
    { id: 'usdt', name: 'USDT', discount: 0.10 },
    { id: 'btc', name: 'Bitcoin', discount: 0.10 },
    { id: 'eth', name: 'Ethereum', discount: 0.10 },
    { id: 'card', name: 'Credit Card', discount: 0 }
  ],
  distanceRate: 2.5, // per mile for chauffeur service
  promoCode: {
    'RIIDE20': { discount: 0.20, description: '20% off first ride' },
    'LAUNCH50': { discount: 0.50, description: '50% off launch special' },
    'STUDENT15': { discount: 0.15, description: '15% student discount' }
  }
};

export const mockLocations = [
  "San Francisco Airport (SFO)",
  "Downtown San Francisco",
  "Silicon Valley",
  "Oakland Airport (OAK)",
  "San Jose Airport (SJC)",
  "Napa Valley",
  "Berkeley",
  "Palo Alto",
  "Stanford University",
  "Fisherman's Wharf",
  "Union Square",
  "Financial District"
];

export const mockBlogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Transportation: Web3 Meets Electric Mobility",
    excerpt: "Discover how blockchain technology is revolutionizing the EV industry and creating new opportunities for sustainable travel.",
    publishDate: "2025-01-15",
    readTime: "5 min read",
    category: "Innovation",
    image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Maximizing Your $RIIDE Token Rewards: A Complete Guide",
    excerpt: "Learn how to earn, stake, and maximize your rewards in the RIIDE ecosystem while contributing to sustainable transport.",
    publishDate: "2025-01-12",
    readTime: "7 min read",
    category: "Rewards",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Electric Marine Vehicles: The Next Frontier in Clean Transportation",
    excerpt: "Explore how electric boats and yachts are changing the marine industry and offering new sustainable adventure options.",
    publishDate: "2025-01-10",
    readTime: "4 min read",
    category: "Marine EV",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop"
  }
];

export const mockFAQs = [
  {
    id: 1,
    question: "How does Web3 payment work with RIIDE?",
    answer: "RIIDE supports multiple Web3 wallets including Plug and MetaMask. Connect your wallet, choose your preferred cryptocurrency (ICP, USDT, BTC, ETH), and enjoy discounted rates compared to traditional payment methods. All transactions are secure and transparent on the blockchain."
  },
  {
    id: 2,
    question: "What are $RIIDE tokens and how do I earn them?",
    answer: "$RIIDE tokens are our native utility tokens that you earn with every booking. Use them for discounts on future rides, stake them for additional rewards, or participate in governance decisions. Tokens are automatically credited to your wallet after each completed trip."
  },
  {
    id: 3,
    question: "Are all vehicles electric?",
    answer: "Yes, RIIDE is 100% committed to sustainable transportation. Our entire fleet consists of premium electric vehicles including Tesla, BMW, Mercedes, and Rivian models. We also offer electric marine vehicles for water adventures."
  },
  {
    id: 4,
    question: "How do I become a RIIDE driver?",
    answer: "Join our driver network by applying through our Driver Portal. You'll need a valid license, clean driving record, and access to an approved electric vehicle. Drivers earn competitive rates plus $RIIDE token bonuses for maintaining high ratings and completing eco-friendly trips."
  },
  {
    id: 5,
    question: "What's the difference between Chauffeur and Rental services?",
    answer: "Chauffeur service includes a professional driver for point-to-point trips or hourly bookings. Rental service lets you drive the vehicle yourself for hourly, daily, or weekly periods. Both options include insurance and 24/7 support."
  }
];