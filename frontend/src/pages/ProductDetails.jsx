import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import { formatCurrency } from '../lib/currency'

// Helper to compute a robust product image URL
const getProductImage = (product) => {
  if (!product) return 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop'
  const url = product.imageUrl || ''
  if (url.startsWith('http')) return url
  const term = encodeURIComponent((product.name || 'electronics').toLowerCase())
  return `https://source.unsplash.com/800x600/?${term},electronics,product`
}

export default function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const navigate = useNavigate()
  
  useEffect(() => { 
    api.get(`/api/products/${id}`).then(r => setProduct(r.data)) 
  }, [id])
  
  if (!product) return (
    <div className="modern-loading">
      <div className="loading-spinner-modern"></div>
      <p>Loading product...</p>
    </div>
  )
  
  const add = async () => {
    try {
      await api.post('/api/cart/add', { productId: product.id, quantity })
      navigate('/cart')
    } catch {
      navigate('/login')
    }
  }
  
  const addToWishlist = () => {
    const w = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (!w.find(x => x.id === product.id)) {
      w.push(product)
      localStorage.setItem('wishlist', JSON.stringify(w))
      alert('Added to wishlist!')
    }
  }
  
  // Generate multiple image variations for gallery
  const images = [
    getProductImage(product),
    `https://source.unsplash.com/800x600/?${encodeURIComponent(product.name)},tech,angle1`,
    `https://source.unsplash.com/800x600/?${encodeURIComponent(product.name)},gadget,angle2`,
    `https://source.unsplash.com/800x600/?${encodeURIComponent(product.name)},device,angle3`
  ]
  
  return (
    <div className="modern-product-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs-modern">
        <div className="container">
          <Link to="/">Home</Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <Link to="/shop">Shop</Link>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{product.name}</span>
        </div>
      </div>

      <div className="product-container-modern">
        <div className="container">
          <div className="product-grid-modern">
            {/* Image Gallery */}
            <div className="product-gallery-modern">
              <div className="main-image-container">
                {imageLoading && <div className="image-loader-modern"></div>}
                <img
                  src={imageError ? images[0] : images[selectedImage]}
                  alt={product.name}
                  className="main-product-image"
                  onLoad={() => setImageLoading(false)}
                  onError={() => { setImageError(true); setImageLoading(false) }}
                  style={{opacity: imageLoading ? 0 : 1}}
                />
                <div className="image-badge">
                  {Number(product.stock) > 0 ? (
                    <span className="badge-in-stock">In Stock</span>
                  ) : (
                    <span className="badge-out-stock">Out of Stock</span>
                  )}
                </div>
                <button className="wishlist-btn-float" onClick={addToWishlist}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="thumbnail-gallery">
                {images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`View ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-modern">
              <div className="product-header-modern">
                <div className="product-category">Electronics</div>
                <h1 className="product-title-modern">{product.name}</h1>
                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="rating-text">4.9 (127 reviews)</span>
                </div>
              </div>

              <div className="price-section-modern">
                <div className="price-main">
                  <span className="current-price">{formatCurrency(product.price, 'INR')}</span>
                  <span className="original-price">{formatCurrency(product.price * 1.3, 'INR')}</span>
                  <span className="discount-badge">-23% OFF</span>
                </div>
                <p className="tax-info">Inclusive of all taxes</p>
              </div>

              <div className="stock-info-modern">
                <div className="stock-indicator">
                  <div className="stock-icon">
                    {Number(product.stock) > 0 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="stock-status">
                      {Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                    <p className="stock-count">
                      {Number(product.stock) > 0 ? `${product.stock} units available` : 'Notify when available'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="quantity-section-modern">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max={product.stock}
                  />
                  <button 
                    className="qty-btn"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="action-buttons-modern">
                <button 
                  className="btn-add-cart-modern" 
                  onClick={add} 
                  disabled={Number(product.stock) <= 0}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Add to Cart</span>
                </button>
                <button className="btn-buy-now-modern" disabled={Number(product.stock) <= 0}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Buy Now</span>
                </button>
              </div>

              <div className="features-modern">
                <div className="feature-item-modern">
                  <div className="feature-icon-small">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Free Delivery</h4>
                    <p>On orders over ₹500</p>
                  </div>
                </div>
                <div className="feature-item-modern">
                  <div className="feature-icon-small">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Easy Returns</h4>
                    <p>30-day return policy</p>
                  </div>
                </div>
                <div className="feature-item-modern">
                  <div className="feature-icon-small">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>1 Year Warranty</h4>
                    <p>Manufacturer warranty</p>
                  </div>
                </div>
                <div className="feature-item-modern">
                  <div className="feature-icon-small">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h4>Secure Payment</h4>
                    <p>100% secure transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="product-tabs-modern">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews (127)
              </button>
            </div>
            
            <div className="tabs-content">
              {activeTab === 'description' && (
                <div className="tab-panel">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                  <p>Experience premium quality and cutting-edge technology with this exceptional product. Designed with precision and built to last, this item combines functionality with style to deliver an unmatched user experience.</p>
                  <h4>Key Features:</h4>
                  <ul>
                    <li>Premium build quality with attention to detail</li>
                    <li>Latest technology for superior performance</li>
                    <li>Ergonomic design for maximum comfort</li>
                    <li>Energy efficient and environmentally friendly</li>
                    <li>Compatible with multiple devices and platforms</li>
                  </ul>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div className="tab-panel">
                  <h3>Technical Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">Brand</span>
                      <span className="spec-value">Premium Electronics</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Model</span>
                      <span className="spec-value">PE-{product.id}-2024</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Warranty</span>
                      <span className="spec-value">1 Year Manufacturer</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Weight</span>
                      <span className="spec-value">500g</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Dimensions</span>
                      <span className="spec-value">15 x 10 x 5 cm</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Color</span>
                      <span className="spec-value">Black</span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div className="tab-panel">
                  <h3>Customer Reviews</h3>
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <div className="rating-score">4.9</div>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} viewBox="0 0 24 24" fill="#fbbf24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <p>Based on 127 reviews</p>
                    </div>
                  </div>
                  
                  <div className="reviews-list">
                    <div className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">A</div>
                          <div>
                            <h4>Alex Johnson</h4>
                            <p>Verified Purchase</p>
                          </div>
                        </div>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" fill="#fbbf24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">Excellent product! The quality is outstanding and it works perfectly. Highly recommend to anyone looking for a reliable electronics product.</p>
                      <p className="review-date">2 days ago</p>
                    </div>
                    
                    <div className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <div className="reviewer-avatar">S</div>
                          <div>
                            <h4>Sarah Miller</h4>
                            <p>Verified Purchase</p>
                          </div>
                        </div>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" fill="#fbbf24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">Great value for money. The product exceeded my expectations in terms of performance and build quality.</p>
                      <p className="review-date">1 week ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





