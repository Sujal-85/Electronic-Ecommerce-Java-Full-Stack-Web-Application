import { Link } from 'react-router-dom'
import { useState } from 'react'
import RatingStars from './RatingStars'
import { formatCurrency } from '../lib/currency'

// Helper function to get product image from Unsplash based on product name
const getProductImage = (product) => {
  if (product.imageUrl && product.imageUrl.startsWith('http')) {
    return product.imageUrl
  }
  
  // Use Unsplash with product name as search term
  const searchTerm = encodeURIComponent(product.name.toLowerCase())
  // Using Unsplash Source API which doesn't require API key for basic usage
  return `https://source.unsplash.com/400x300/?${searchTerm},electronic,product`
}

export default function ProductCard({ product, onAddToWishlist }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  
  const imageUrl = getProductImage(product)
  const fallbackUrl = `https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop`

  return (
    <div className="modern-product-card">
      <div className="product-card-image">
        {imageLoading && <div className="image-loader-modern"></div>}
        <img 
          src={imageError ? fallbackUrl : imageUrl} 
          alt={product.name}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true)
            setImageLoading(false)
          }}
          style={{ opacity: imageLoading ? 0 : 1 }}
        />
        <div className="product-card-badge">
          {Number(product.stock) > 0 ? (
            <span className="badge-in-stock">In Stock</span>
          ) : (
            <span className="badge-out-stock">Out of Stock</span>
          )}
        </div>
        <div className="product-card-actions">
          <button 
            className="action-btn wishlist-btn"
            onClick={() => onAddToWishlist && onAddToWishlist(product)}
            title="Add to wishlist"
            aria-label="Add to wishlist"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <Link 
            to={`/product/${product.id}`} 
            className="action-btn quick-view-btn"
            title="Quick view"
            aria-label="Quick view"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>
      </div>
      <div className="product-card-content">
        <div className="product-card-meta">
          <span className="product-category">Electronics</span>
        </div>
        <h3 className="product-card-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-rating">
          <RatingStars rating={product.rating || 4} />
          <span className="rating-count">(127)</span>
        </div>
        <div className="product-price">
          <span className="current-price">{formatCurrency(product.price, 'INR')}</span>
          <span className="original-price">{formatCurrency(product.price * 1.2, 'INR')}</span>
        </div>
        <div className="product-card-buttons">
          <Link className="btn-view-details" to={`/product/${product.id}`}>
            View Details
          </Link>
          <button className="btn-add-to-cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}





