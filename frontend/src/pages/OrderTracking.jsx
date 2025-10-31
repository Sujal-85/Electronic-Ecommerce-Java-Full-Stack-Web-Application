import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import api from '../lib/api'

export default function OrderTracking() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const success = searchParams.get('success') === 'true'

  useEffect(() => {
    loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get(`/api/orders/track/${id}`)
      setOrder(res.data)
    } catch (error) {
      console.error('Failed to load order:', error)
      setError('Order not found or access denied')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'PLACED', label: 'Order Placed', icon: '📦' },
      { key: 'PAID', label: 'Payment Confirmed', icon: '💰' },
      { key: 'SHIPPED', label: 'Shipped', icon: '🚚' },
      { key: 'DELIVERED', label: 'Delivered', icon: '✅' }
    ]
    
    const statusIndex = steps.findIndex(s => s.key === status)
    return steps.map((step, index) => ({
      ...step,
      completed: index <= statusIndex,
      current: index === statusIndex
    }))
  }

  if (loading) {
    return (
      <div className="order-tracking-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-tracking-page">
        <div className="error-state">
          <h2>Order Not Found</h2>
          <p>{error || 'The order you are looking for does not exist.'}</p>
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
        </div>
      </div>
    )
  }

  const statusSteps = getStatusSteps(order.status || 'PLACED')

  return (
    <div className="order-tracking-page">
      {success && (
        <div className="alert alert-success">
          <strong>Order Placed Successfully!</strong> Your order has been confirmed.
        </div>
      )}

      <div className="tracking-header">
        <h1>Order Tracking</h1>
        <p className="order-id">Order #<strong>{order.id}</strong></p>
      </div>

      <div className="tracking-container">
        {/* Status Timeline */}
        <div className="tracking-section">
          <h2>Order Status</h2>
          <div className="status-timeline">
            {statusSteps.map((step, index) => (
              <div key={step.key} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
                <div className="timeline-icon">{step.icon}</div>
                <div className="timeline-content">
                  <h3>{step.label}</h3>
                  {step.current && <p className="current-status">Current Status</p>}
                </div>
                {index < statusSteps.length - 1 && <div className="timeline-connector"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="tracking-section">
          <h2>Order Details</h2>
          <div className="order-details-grid">
            <div className="detail-item">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{formatDate(order.createdAt)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`detail-value order-status-badge order-status-badge-${(order.status || 'PLACED').toLowerCase()}`}>
                {order.status || 'PLACED'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{order.paymentMethod || 'COD'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Status:</span>
              <span className={`detail-value payment-status payment-status-${(order.paymentStatus || 'PENDING').toLowerCase()}`}>
                {order.paymentStatus || 'PENDING'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value price">₹{parseFloat(order.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="tracking-section">
          <h2>Order Items</h2>
          <div className="order-items-table">
            <div className="order-items-header">
              <span>Product</span>
              <span>Quantity</span>
              <span>Price</span>
            </div>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="order-item-row">
                  <span>{item.product?.name || 'Product'}</span>
                  <span>×{item.quantity || 1}</span>
                  <span>₹{parseFloat(item.priceAtPurchase || 0).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">No items in this order</div>
            )}
          </div>
        </div>

        {/* Payment Info (if Razorpay) */}
        {order.paymentMethod === 'RAZORPAY' && order.razorpayOrderId && (
          <div className="tracking-section">
            <h2>Payment Information</h2>
            <div className="payment-info">
              <div className="detail-item">
                <span className="detail-label">Razorpay Order ID:</span>
                <span className="detail-value">{order.razorpayOrderId}</span>
              </div>
              {order.razorpayPaymentId && (
                <div className="detail-item">
                  <span className="detail-label">Payment ID:</span>
                  <span className="detail-value">{order.razorpayPaymentId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="tracking-actions">
          <Link to="/orders" className="btn btn-outline">View All Orders</Link>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

