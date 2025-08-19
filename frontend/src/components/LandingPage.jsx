import React, { useState, useEffect } from 'react';
import { 
  Car, Key, Anchor, ArrowRight, Star, Users, Shield, 
  Zap, Leaf, Coins, ChevronRight, Menu, X, Play,
  MapPin, Clock, Award, TrendingUp, CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import BookingBox from './BookingBox';
import { VehicleService, ContentService, handleApiError } from '../services/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [faqs, setFaqs] = useState([]);

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load all data in parallel
        const [
          vehiclesResponse,
          servicesResponse,
          testimonialsResponse,
          blogResponse,
          faqsResponse
        ] = await Promise.all([
          VehicleService.getAll(),
          ContentService.getServices(),
          ContentService.getTestimonials(),
          ContentService.getBlogPosts(3),
          ContentService.getFAQs()
        ]);

        if (vehiclesResponse.success) setVehicles(vehiclesResponse.data);
        if (servicesResponse.success) setServices(servicesResponse.data);
        if (testimonialsResponse.success) setTestimonials(testimonialsResponse.data);
        if (blogResponse.success) setBlogPosts(blogResponse.data);
        if (faqsResponse.success) setFaqs(faqsResponse.data);
        
      } catch (error) {
        console.error('Failed to load data:', error);
        // Set fallback data if API fails
        setServices([
          {
            id: 1,
            title: "Premium Chauffeur",
            description: "Professional drivers with luxury EVs for business or leisure",
            icon: "Car",
            features: ["Professional Drivers", "Real-time Tracking", "Premium Vehicles", "24/7 Service"],
            starting_price: 85
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Auto-rotate services showcase
    if (services.length > 0) {
      const interval = setInterval(() => {
        setActiveService((prev) => (prev + 1) % services.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [services.length]);

  const scrollToBooking = () => {
    document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="dark-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-text">RIIDE</div>
            <span className="logo-tagline">Web3 Mobility</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="dark-nav desktop-nav">
            <a href="#services" className="dark-nav-link">Services</a>
            <a href="#fleet" className="dark-nav-link">Fleet</a>
            <a href="#how-it-works" className="dark-nav-link">How It Works</a>
            <a href="#pricing" className="dark-nav-link">Pricing</a>
            <a href="#wallet" className="dark-nav-link">Wallet</a>
          </nav>

          <div className="header-actions">
            <Button variant="ghost" className="btn-secondary driver-btn">
              Go Live & Earn
            </Button>
            <Button className="btn-primary">
              Connect Wallet
            </Button>
            
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            <a href="#services" className="mobile-nav-link">Services</a>
            <a href="#fleet" className="mobile-nav-link">Fleet</a>
            <a href="#how-it-works" className="mobile-nav-link">How It Works</a>
            <a href="#pricing" className="mobile-nav-link">Pricing</a>
            <a href="#wallet" className="mobile-nav-link">Wallet</a>
            <div className="mobile-nav-actions">
              <Button variant="ghost" className="btn-secondary w-full">
                Go Live & Earn
              </Button>
              <Button className="btn-primary w-full">
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <Leaf className="w-4 h-4" />
              100% Electric Fleet
            </div>
            <h1 className="display-huge">
              Your Premium EV Rides, Rentals & Marine EV — 
              <span className="text-brand"> Powered by Web3</span>
            </h1>
            <p className="body-large hero-description">
              Experience luxury transportation with zero emissions. Book premium electric vehicles, 
              pay with crypto, and earn $RIIDE tokens while contributing to a sustainable future.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Riders</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Electric Fleet</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">$2M+</div>
                <div className="stat-label">Tokens Earned</div>
              </div>
            </div>

            <div className="hero-actions">
              <Button onClick={scrollToBooking} className="btn-primary hero-cta">
                Book Your Ride Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="ghost" className="btn-secondary">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="trust-badges">
              <div className="trust-badge">
                <Shield className="w-5 h-5" />
                <span>Fully Insured</span>
              </div>
              <div className="trust-badge">
                <Award className="w-5 h-5" />
                <span>5★ Average Rating</span>
              </div>
              <div className="trust-badge">
                <Zap className="w-5 h-5" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop" 
                alt="Premium Tesla Model S - RIIDE's flagship electric vehicle"
                className="hero-image"
              />
              <div className="hero-overlay">
                <div className="overlay-badge">
                  <Coins className="w-4 h-4" />
                  Earn $RIIDE Tokens
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking-section" className="booking-section">
        <div className="container">
          <BookingBox />
        </div>
      </section>

      {/* Services Showcase */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-large">Premium EV Services</h2>
            <p className="body-large">
              Comprehensive electric mobility solutions for every need
            </p>
          </div>

          <div className="services-showcase">
            <div className="services-tabs">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  className={`service-tab ${activeService === index ? 'active' : ''}`}
                  onClick={() => setActiveService(index)}
                >
                  {React.createElement(
                    service.icon === 'Car' ? Car : 
                    service.icon === 'Key' ? Key : Anchor,
                    { className: 'w-6 h-6' }
                  )}
                  <div className="tab-content">
                    <h3 className="heading-3">{service.title}</h3>
                    <p className="body-small">{service.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {services.length > 0 && (
              <div className="service-detail">
                <div className="service-info">
                  <h3 className="heading-1">{services[activeService].title}</h3>
                  <p className="body-medium">{services[activeService].description}</p>
                  
                  <ul className="service-features">
                    {services[activeService].features?.map((feature, index) => (
                      <li key={index} className="feature-item">
                        <CheckCircle2 className="w-5 h-5" />
                        {feature}
                      </li>
                    )) || []}
                  </ul>

                  <div className="service-pricing">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">${services[activeService].starting_price}/hr</span>
                  </div>

                  <Button className="btn-primary">
                    Book {services[activeService].title}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="service-image">
                  <img 
                    src={services[activeService].icon === 'Anchor' 
                      ? "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop"
                      : "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=400&fit=crop"
                    }
                    alt={`${services[activeService].title} service`}
                    className="service-showcase-image"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Fleet Highlights */}
      <section id="fleet" className="fleet-section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-large">Premium Electric Fleet</h2>
            <p className="body-large">
              Choose from our curated selection of luxury electric vehicles
            </p>
          </div>

          <div className="fleet-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="fleet-card">
                <div className="fleet-image">
                  <img src={vehicle.image_url} alt={vehicle.name} />
                  <div className="fleet-badge">{vehicle.type}</div>
                </div>
                
                <div className="fleet-info">
                  <h3 className="heading-3">{vehicle.name}</h3>
                  <p className="body-small">{vehicle.description}</p>
                  
                  <div className="fleet-features">
                    {vehicle.features?.slice(0, 2).map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    )) || []}
                  </div>

                  <div className="fleet-details">
                    <div className="detail-item">
                      <Users className="w-4 h-4" />
                      {vehicle.passengers} passengers
                    </div>
                    <div className="price-info">
                      <span className="price">${vehicle.price_per_hour}/hr</span>
                    </div>
                  </div>

                  <Button className="btn-primary fleet-book-btn">
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-large">How RIIDE Works</h2>
            <p className="body-large">
              Simple, secure, and rewarding transportation in 4 easy steps
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="heading-3">Choose Your Ride</h3>
              <p className="body-medium">
                Select from premium EVs, chauffeur services, or marine vehicles
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-icon">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="heading-3">Confirm & Pay</h3>
              <p className="body-medium">
                Secure booking with Web3 wallets or traditional payment methods
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-icon">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="heading-3">Enjoy Your Journey</h3>
              <p className="body-medium">
                Experience premium electric transportation with professional service
              </p>
            </div>

            <div className="step-item">
              <div className="step-number">04</div>
              <div className="step-icon">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="heading-3">Earn Rewards</h3>
              <p className="body-medium">
                Collect $RIIDE tokens for every trip and unlock exclusive benefits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Web3 & Wallet Section */}
      <section id="wallet" className="wallet-section">
        <div className="container">
          <div className="wallet-content">
            <div className="wallet-left">
              <h2 className="display-large">Web3 Rewards & Payments</h2>
              <p className="body-large">
                Connect your wallet, pay with crypto, and earn $RIIDE tokens with every ride
              </p>

              <div className="wallet-features">
                <div className="wallet-feature">
                  <div className="feature-icon">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="feature-content">
                    <h4 className="heading-3">Secure Payments</h4>
                    <p className="body-small">Multi-chain support with instant transactions</p>
                  </div>
                </div>

                <div className="wallet-feature">
                  <div className="feature-icon">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div className="feature-content">
                    <h4 className="heading-3">Earn $RIIDE Tokens</h4>
                    <p className="body-small">Get rewarded for every sustainable journey</p>
                  </div>
                </div>

                <div className="wallet-feature">
                  <div className="feature-icon">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="feature-content">
                    <h4 className="heading-3">Stake & Earn More</h4>
                    <p className="body-small">Stake tokens for additional rewards and governance</p>
                  </div>
                </div>
              </div>

              <div className="wallet-actions">
                <Button className="btn-primary">
                  Join Pre-Sale
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="ghost" className="btn-secondary">
                  Learn About $RIIDE
                </Button>
              </div>
            </div>

            <div className="wallet-right">
              <div className="wallet-visual">
                <img 
                  src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop" 
                  alt="Web3 wallet and cryptocurrency payments"
                  className="wallet-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Driver CTA */}
      <section className="driver-cta-section">
        <div className="container">
          <div className="driver-cta-content">
            <div className="driver-cta-text">
              <h2 className="display-medium">Ready to Drive & Earn?</h2>
              <p className="body-large">
                Join our premium driver network and start earning with sustainable transportation
              </p>
              <ul className="driver-benefits">
                <li><CheckCircle2 className="w-5 h-5" /> Competitive rates + token bonuses</li>
                <li><CheckCircle2 className="w-5 h-5" /> Flexible schedule</li>
                <li><CheckCircle2 className="w-5 h-5" /> Premium vehicle access</li>
              </ul>
            </div>
            <div className="driver-cta-actions">
              <Button className="btn-primary">
                Go Live & Earn
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-large">What Our Riders Say</h2>
            <p className="body-large">
              Join thousands of satisfied customers who chose sustainable luxury
            </p>
          </div>

          <div className="testimonials-grid">
            {mockTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 filled" />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Insights */}
      <section className="blog-section">
        <div className="container">
          <div className="section-header">
            <h2 className="display-large">Latest Insights</h2>
            <p className="body-large">
              Stay updated on EV innovation, Web3 mobility, and sustainable transport
            </p>
          </div>

          <div className="blog-grid">
            {mockBlogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <img src={post.image} alt={post.title} />
                  <div className="blog-category">{post.category}</div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">{post.publishDate}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <a href="#" className="blog-link">
                    Read More <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & FAQs */}
      <section id="pricing" className="faq-section">
        <div className="container">
          <div className="faq-content">
            <div className="faq-header">
              <h2 className="display-large">Frequently Asked Questions</h2>
              <p className="body-large">
                Everything you need to know about RIIDE's Web3 mobility platform
              </p>
            </div>

            <Accordion type="single" collapsible className="faq-accordion">
              {mockFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id.toString()}>
                  <AccordionTrigger className="accordion-trigger">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="accordion-content">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="logo-text">RIIDE</div>
                  <span className="logo-tagline">Web3 Mobility</span>
                </div>
                <p className="footer-description">
                  Premium electric transportation powered by Web3 technology. 
                  Sustainable, luxury, rewarding.
                </p>
                <div className="social-links">
                  <span>Follow us #RiideWithUs</span>
                  {/* Social media icons would go here */}
                </div>
              </div>

              <div className="footer-links">
                <div className="link-group">
                  <h4 className="link-group-title">Services</h4>
                  <a href="/services/chauffeur" className="footer-link">Chauffeur</a>
                  <a href="/services/rental" className="footer-link">EV Rentals</a>
                  <a href="/services/marine" className="footer-link">Marine EV</a>
                  <a href="/fleet" className="footer-link">Fleet</a>
                </div>

                <div className="link-group">
                  <h4 className="link-group-title">Platform</h4>
                  <a href="/wallet" className="footer-link">Wallet</a>
                  <a href="/pre-sale" className="footer-link">Pre-Sale</a>
                  <a href="/driver" className="footer-link">Driver Portal</a>
                  <a href="/pricing" className="footer-link">Pricing</a>
                </div>

                <div className="link-group">
                  <h4 className="link-group-title">Support</h4>
                  <a href="/help" className="footer-link">Help Center</a>
                  <a href="/contact" className="footer-link">Contact</a>
                  <a href="/terms" className="footer-link">Terms</a>
                  <a href="/privacy" className="footer-link">Privacy</a>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2025 RIIDE. All rights reserved.</p>
              <div className="footer-badges">
                <span className="badge">100% Electric</span>
                <span className="badge">Web3 Powered</span>
                <span className="badge">Carbon Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;