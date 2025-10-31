import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data);
        
        // Trigger confetti effect
        triggerConfetti();
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, isAuthenticated, navigate]);

  const triggerConfetti = () => {
    // Simple confetti effect using CSS animations
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.backgroundColor = [
        '#10b981', '#3b82f6', '#f59e0b', '#ec4899'
      ][Math.floor(Math.random() * 4)];
      confettiContainer.appendChild(confetti);
    }
    
    // Remove after animation
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="order-confirmation-page">
      <div className="confetti-wrapper">
        <div className="success-container">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-subtitle">
              Thank you for shopping with us. Your order is confirmed and will be processed soon.
            </p>
          </div>

          {/* Order Details Card */}
          {loading ? (
            <div className="order-details-card loading">
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
            </div>
          ) : order ? (
            <div className="order-details-card">
              <div className="order-info">
                <div className="info-item">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 8a2 2 0 01-2 2H5a2 2 0 01-2-2m18 0a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m18 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Order ID:</span>
                    <span className="info-value order-id">#{order.id}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <div className="status-indicator"></div>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Status:</span>
                    <span className={`info-value status-${(order.status || 'PLACED').toLowerCase()}`}>
                      {order.status || 'PLACED'}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <div className="price-indicator"></div>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Total Paid:</span>
                    <span className="info-value price">
                      ₹{parseFloat(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="info-content">
                    <span className="info-label">Order Date:</span>
                    <span className="info-value">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="confirmation-note">
                <p>A confirmation email has been sent to your inbox.</p>
              </div>
            </div>
          ) : (
            <div className="error-message">
              Failed to load order details. Please try again later.
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <Link
              to="/shop"
              className="btn btn-primary btn-large"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Continue Shopping
            </Link>

            {id && (
              <Link
                to={`/orders/${id}`}
                className="btn btn-outline btn-large"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 8a2 2 0 01-2 2H5a2 2 0 01-2-2m18 0a2 2 0 00-2-2H5a2 2 0 00-2 2m18 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m18 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Track Order
              </Link>
            )}
          </div>

          {/* Footer Note */}
          <p className="footer-note">
            Need help? <Link to="/support" className="support-link">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}