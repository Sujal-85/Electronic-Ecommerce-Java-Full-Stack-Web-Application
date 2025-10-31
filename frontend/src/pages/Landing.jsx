import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import ProductCard from '../components/ProductCard'
import CategoryGrid from '../components/CategoryGrid'
import Testimonials from '../components/Testimonials'
import TrustBadges from '../components/TrustBadges'
import NewsletterSignup from '../components/NewsletterSignup'

export default function Landing() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    api.get('/api/products')
      .then(res => {
        setProducts(res.data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const featuredProducts = products.slice(0, 6)
  const addWishlist = (p) => {
    const w = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (!w.find(x => x.id === p.id)) {
      w.push(p)
      localStorage.setItem('wishlist', JSON.stringify(w))
    }
  }

  return (
    <div className="modern-landing-page">
      {/* Hero Section with Gradient & Animation */}
      <section className="modern-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content-modern" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Welcome to the Future of Shopping</span>
            </div>
            <h1 className="hero-title-modern">
              Discover Amazing
              <br />
              <span className="gradient-text">Electronics</span>
              <br />
              at ElectroShop
            </h1>
            <p className="hero-description-modern">
              Experience the latest tech innovations with unbeatable prices,
              <br />fast delivery, and exceptional customer service.
            </p>
            <div className="hero-actions-modern">
              <Link to="/shop" className="btn-modern btn-primary-modern">
                <span>Explore Products</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/shop" className="btn-modern btn-secondary-modern">
                <span>View Deals</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>50K+</h3>
                <p>Happy Customers</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Products</p>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <h3>4.9★</h3>
                <p>Rating</p>
              </div>
            </div>
          </div>
          
          <div className="hero-visual" style={{ transform: `translateY(${scrollY * -0.2}px)` }}>
            <div className="floating-card card-1">
              <div className="card-icon">🎧</div>
              <p>Premium Audio</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">📱</div>
              <p>Latest Smartphones</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">💻</div>
              <p>Powerful Laptops</p>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">⌚</div>
              <p>Smart Watches</p>
            </div>
            <div className="hero-device-mockup">
              <div className="device-screen"></div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <p>Scroll to explore</p>
        </div>
      </section>

      {/* Animated Features Section */}
      <section className="features-modern">
        <div className="container">
          <div className="features-grid-modern">
            <div className="feature-card-modern" style={{ animationDelay: '0s' }}>
              <div className="feature-icon-modern gradient-blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Free Shipping</h3>
              <p>Free delivery on orders over $50</p>
            </div>
            <div className="feature-card-modern" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon-modern gradient-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
            </div>
            <div className="feature-card-modern" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon-modern gradient-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 11l3 3L22 4" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free returns</p>
            </div>
            <div className="feature-card-modern" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon-modern gradient-orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Premium Quality</h3>
              <p>Top-rated products only</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategoryGrid />

      {/* Featured Products with Modern Design */}
      <section className="featured-modern">
        <div className="container">
          <div className="section-header-modern">
            <div className="section-tag">Best Sellers</div>
            <h2 className="section-title-modern">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="section-description">Handpicked collection of our most popular items</p>
          </div>
          {isLoading ? (
            <div className="loading-modern">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="products-grid-modern">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} onAddToWishlist={addWishlist} />
              ))}
            </div>
          ) : (
            <div className="empty-state-modern">No products available</div>
          )}
          <div className="section-action">
            <Link to="/shop" className="btn-view-all">
              View All Products
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <Testimonials />
      <TrustBadges />

      {/* Newsletter */}
      <NewsletterSignup />

      {/* Benefits Section with Animation */}
      <section className="benefits-modern">
        <div className="container">
          <div className="benefits-content-modern">
            <div className="benefits-text-modern">
              <div className="section-tag">Why Choose Us</div>
              <h2>The ElectroShop
                <br /><span className="gradient-text">Advantage</span>
              </h2>
              <p className="benefits-intro">Experience shopping like never before with our premium service and unmatched selection.</p>
              <div className="benefits-list-modern">
                <div className="benefit-item">
                  <div className="benefit-icon">📦</div>
                  <div>
                    <h4>Wide Selection</h4>
                    <p>Thousands of products from top brands worldwide</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">💰</div>
                  <div>
                    <h4>Best Prices</h4>
                    <p>Competitive pricing with exclusive deals and discounts</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div>
                    <h4>Expert Support</h4>
                    <p>24/7 customer service ready to assist you</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <div>
                    <h4>Fast Delivery</h4>
                    <p>Quick and reliable shipping to your doorstep</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual-modern">
              <div className="visual-card card-pulse">
                <div className="pulse-effect"></div>
                <div className="visual-content">
                  <div className="visual-icon">🏆</div>
                  <h3>Trusted by 50K+</h3>
                  <p>Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="cta-modern">
        <div className="cta-background">
          <div className="cta-orb orb-1"></div>
          <div className="cta-orb orb-2"></div>
        </div>
        <div className="container">
          <div className="cta-content-modern">
            <h2>Ready to Transform Your
              <br /><span className="gradient-text">Shopping Experience?</span>
            </h2>
            <p>Join thousands of satisfied customers and discover the best electronics deals today.</p>
            <div className="cta-actions">
              <Link to="/shop" className="btn-cta-primary">
                Start Shopping Now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </Link>
              <Link to="/signup" className="btn-cta-secondary">
                Create Account
              </Link>
            </div>
            <div className="cta-trust">
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>4.9/5 Rating</span>
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="trust-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

