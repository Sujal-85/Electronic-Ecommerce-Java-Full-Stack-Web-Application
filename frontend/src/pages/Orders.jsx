import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Orders() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadOrders()
  }, [isAuthenticated, navigate])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/api/orders')
      console.log('Orders response:', res.data) // Debug log
      setOrders(res.data || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      setError('Failed to load orders. Please try again.')
      if (error.response?.status === 401) {
        navigate('/login')
      }
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

  const getProductImage = (product) => {
    if (product?.imageUrl && product.imageUrl.startsWith('http')) return product.imageUrl
    const seed = encodeURIComponent(String(product?.id || product?.name || 'electronics'))
    return `https://picsum.photos/seed/${seed}/200/150`
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={loadOrders}>Retry</button>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>My Orders</h1>
        <p>View and track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No Orders Yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <Link to="/shop" className="btn btn-primary btn-large">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className={`order-status-badge order-status-badge-${(order.status || 'PLACED').toLowerCase()}`}>
                  {order.status || 'PLACED'}
                </div>
              </div>
              
              {order.items && order.items.length > 0 ? (
                <>
                  <div className="order-items">
                    <div className="order-items-header">
                      <span>Product</span>
                      <span>Quantity</span>
                      <span>Price</span>
                    </div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span className="order-item-name">
                          <span className="order-item-content">
                            <img
                              className="order-item-thumb"
                              src={getProductImage(item.product)}
                              alt={item.product?.name || 'Product image'}
                              onError={(e)=>{
                                if (!e.currentTarget.dataset.fallback) {
                                  e.currentTarget.dataset.fallback = '1'
                                  const seed = encodeURIComponent(String(item.product?.id || item.product?.name || 'electronics'))
                                  e.currentTarget.src = `https://picsum.photos/seed/${seed}/200/150`
                                }
                              }}
                            />
                            <Link to={`/product/${item.product?.id || ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              {item.product?.name || 'Product'}
                            </Link>
                          </span>
                        </span>
                        <span className="order-item-qty">×{item.quantity || 1}</span>
                        <span className="order-item-price">
                          ${parseFloat(item.priceAtPurchase || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      Total: <strong>${parseFloat(order.totalAmount || 0).toFixed(2)}</strong>
                    </div>
                    <Link to={`/orders/${order.id}`} className="btn btn-outline" style={{marginTop: '12px', display: 'inline-block'}}>
                      Track Order
                    </Link>
                  </div>
                </>
              ) : (
                <div className="order-items-empty">
                  <p>No items in this order</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
