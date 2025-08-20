// src/data/demoData.js

export const demoWallet = {
  balances: {
    RIIDE: 1500,
    ZEM3X: 200,
    ICP: 12,
    USDT: 250,
    BTC: 0.05,
    ETH: 1.2,
  },
};

export const demoTokenPrices = {
  RIIDE: 0.10, // USD
  ZEM3X: 0.25,
  ICP: 8.50,
  USDT: 1.00,
  BTC: 95000,
  ETH: 3200,
};

export const demoRideHistory = [
  {
    id: 1,
    pickup: "Dubai Marina Mall",
    dropoff: "Palm Jumeirah",
    fareFiat: 85.5,
    fareToken: 855,
    tokenType: "RIIDE",
    date: "2025-08-18",
    time: "14:30",
    status: "completed",
    driver: "Ahmed Al-Rashid",
    vehicle: "Tesla Model S",
    rating: 5,
    distance: "12.5 km",
    duration: "22 min"
  },
  {
    id: 2,
    pickup: "Heathrow Airport",
    dropoff: "Mayfair, London",
    fareFiat: 120.0,
    fareToken: 1200,
    tokenType: "RIIDE",
    date: "2025-08-10",
    time: "09:15",
    status: "completed",
    driver: "James Wilson",
    vehicle: "BMW iX",
    rating: 5,
    distance: "45.2 km",
    duration: "1h 5min"
  },
  {
    id: 3,
    pickup: "San Francisco Airport",
    dropoff: "Downtown SF",
    fareFiat: 65.0,
    fareToken: 650,
    tokenType: "RIIDE",
    date: "2025-08-05",
    time: "16:45",
    status: "completed",
    driver: "Sarah Chen",
    vehicle: "Mercedes EQS",
    rating: 4,
    distance: "28.1 km",
    duration: "35 min"
  },
  {
    id: 4,
    pickup: "Marina Bay Sands",
    dropoff: "Changi Airport",
    fareFiat: 45.0,
    fareToken: 450,
    tokenType: "RIIDE",
    date: "2025-07-28",
    time: "11:20",
    status: "completed",
    driver: "Li Wei",
    vehicle: "Tesla Model 3",
    rating: 5,
    distance: "32.8 km",
    duration: "28 min"
  }
];

export const demoGreenHubs = [
  { 
    id: 1,
    station: "GreenHub Marina", 
    connector: "Type2", 
    rate: "22 kWh", 
    status: "Available", 
    distance: "2.1 km",
    address: "Dubai Marina Walk, Dubai",
    slots: "3/8 available",
    pricing: "$0.25/kWh"
  },
  { 
    id: 2,
    station: "GreenHub City Center", 
    connector: "CCS", 
    rate: "50 kWh", 
    status: "Busy", 
    distance: "5.4 km",
    address: "Downtown Dubai, UAE",
    slots: "1/6 available",
    pricing: "$0.35/kWh"
  },
  {
    id: 3,
    station: "GreenHub Mall of Emirates",
    connector: "Type2 & CCS",
    rate: "150 kWh",
    status: "Available",
    distance: "8.2 km",
    address: "Sheikh Zayed Road, Dubai",
    slots: "4/10 available",
    pricing: "$0.45/kWh"
  },
  {
    id: 4,
    station: "GreenHub JBR",
    connector: "Tesla Supercharger",
    rate: "250 kWh",
    status: "Available",
    distance: "1.8 km",
    address: "Jumeirah Beach Residence, Dubai",
    slots: "6/12 available",
    pricing: "$0.30/kWh"
  }
];

export const demoMarketplace = {
  land: [
    { 
      id: 1, 
      name: "Tesla Model Y", 
      price: "$45,000", 
      priceRIIDE: "450,000 RIIDE",
      img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=300&fit=crop",
      category: "SUV",
      range: "330 miles",
      topSpeed: "155 mph",
      acceleration: "0-60 in 4.8s",
      features: ["Autopilot", "Premium Interior", "Supercharger Access"],
      availability: "In Stock"
    },
    { 
      id: 2, 
      name: "BMW i7", 
      price: "$90,000", 
      priceRIIDE: "900,000 RIIDE",
      img: "https://images.unsplash.com/photo-1617654112328-2665328d8953?w=400&h=300&fit=crop",
      category: "Luxury Sedan",
      range: "516 miles",
      topSpeed: "149 mph", 
      acceleration: "0-60 in 4.5s",
      features: ["Executive Lounge", "Massage Seats", "Panoramic Roof"],
      availability: "Pre-Order"
    },
    {
      id: 3,
      name: "Mercedes EQS",
      price: "$105,000",
      priceRIIDE: "1,050,000 RIIDE", 
      img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      category: "Luxury Sedan",
      range: "453 miles",
      topSpeed: "155 mph",
      acceleration: "0-60 in 4.1s",
      features: ["MBUX Hyperscreen", "Air Suspension", "Ultra Luxury"],
      availability: "In Stock"
    }
  ],
  marine: [
    { 
      id: 3, 
      name: "EV Jet Ski", 
      price: "$15,000", 
      priceRIIDE: "150,000 RIIDE",
      img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      category: "Personal Watercraft",
      range: "2 hours runtime",
      topSpeed: "65 mph",
      features: ["Silent Operation", "GPS Navigation", "Bluetooth Audio"],
      availability: "In Stock"
    },
    { 
      id: 4, 
      name: "E-Surfboard", 
      price: "$5,000", 
      priceRIIDE: "50,000 RIIDE",
      img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      category: "Water Sports",
      range: "90 minutes",
      topSpeed: "35 mph",
      features: ["Carbon Fiber", "Wireless Remote", "LED Lights"],
      availability: "In Stock"
    },
    {
      id: 5,
      name: "Electric Yacht",
      price: "$250,000",
      priceRIIDE: "2,500,000 RIIDE",
      img: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=400&h=300&fit=crop", 
      category: "Luxury Yacht",
      range: "100 nautical miles",
      topSpeed: "25 knots",
      features: ["Solar Panels", "Premium Interior", "Captain Included"],
      availability: "Custom Order"
    }
  ],
  air: [
    { 
      id: 5, 
      name: "eVTOL Passenger Drone", 
      price: "Coming Soon", 
      priceRIIDE: "TBA",
      img: "https://images.unsplash.com/photo-1473445617648-78e525f6e6b7?w=400&h=300&fit=crop",
      category: "Air Taxi",
      range: "150 miles",
      topSpeed: "200 mph",
      features: ["Autonomous Flight", "4 Passengers", "Vertical Landing"],
      availability: "2026 Launch"
    },
    {
      id: 6,
      name: "Personal Flying Car",
      price: "$300,000", 
      priceRIIDE: "3,000,000 RIIDE",
      img: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop",
      category: "Flying Vehicle",
      range: "400 miles",
      topSpeed: "180 mph",
      features: ["Road & Air Mode", "AI Autopilot", "Emergency Parachute"],
      availability: "Pre-Order 2027"
    }
  ],
};

export const demoRewardsData = {
  totalEarned: 12750,
  monthlyEarning: 2150,
  streakDays: 15,
  nextRewardAt: 2500,
  multiplier: 1.5,
  achievements: [
    {
      id: 1,
      title: "Eco Warrior",
      description: "Complete 50 rides with electric vehicles",
      progress: 47,
      total: 50,
      reward: 500,
      unlocked: false
    },
    {
      id: 2,
      title: "Early Adopter", 
      description: "One of the first 1000 RIIDE users",
      progress: 1,
      total: 1,
      reward: 1000,
      unlocked: true
    },
    {
      id: 3,
      title: "Token Collector",
      description: "Accumulate 10,000 RIIDE tokens",
      progress: 1500,
      total: 10000,
      reward: 2000,
      unlocked: false
    }
  ]
};

export const demoStakingPools = [
  {
    id: 1,
    name: "RIIDE Staking Pool",
    apr: 12.5,
    minStake: 100,
    totalStaked: 5000000,
    userStaked: 1000,
    rewards: 125.50,
    lockPeriod: "30 days",
    status: "active"
  },
  {
    id: 2,
    name: "ZEM3X Liquidity Pool",
    apr: 18.2,
    minStake: 50,
    totalStaked: 1200000,
    userStaked: 200,
    rewards: 36.40,
    lockPeriod: "90 days", 
    status: "active"
  }
];

export const demoTransactionHistory = [
  {
    id: 1,
    type: "ride_reward",
    amount: 85.5,
    token: "RIIDE",
    description: "Ride completed - Dubai Marina to Palm Jumeirah",
    date: "2025-08-18T14:52:00Z",
    status: "completed"
  },
  {
    id: 2,
    type: "staking_reward",
    amount: 12.5,
    token: "RIIDE",
    description: "Weekly staking rewards",
    date: "2025-08-15T00:00:00Z",
    status: "completed"
  },
  {
    id: 3,
    type: "token_purchase",
    amount: -250,
    token: "USDT",
    description: "Purchased 2500 RIIDE tokens",
    date: "2025-08-10T16:30:00Z",
    status: "completed"
  },
  {
    id: 4,
    type: "referral_bonus",
    amount: 100,
    token: "RIIDE", 
    description: "Friend joined RIIDE using your code",
    date: "2025-08-08T09:15:00Z",
    status: "completed"
  }
];