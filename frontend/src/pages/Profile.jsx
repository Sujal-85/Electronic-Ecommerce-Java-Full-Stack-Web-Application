import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Profile() {
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, cartItems: 0 })

  useEffect(() => {
    if (!authUser) {
      navigate('/login')
      return
    }
    loadProfile()
    loadOrders()
    loadStats()
  }, [authUser, navigate])

  const loadProfile = async () => {
    try {
      const res = await api.get('/api/profile/me')
      setUser(res.data)
      setFormData({ name: res.data.name || '', email: res.data.email || '' })
    } catch (error) {
      console.error('Failed to load profile:', error)
      showMessage('error', 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      const res = await api.get('/api/orders')
      setOrders(res.data || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
    }
  }

  const loadStats = async () => {
    try {
      const cartRes = await api.get('/api/cart')
      const cartItems = Array.isArray(cartRes.data) ? cartRes.data : []
      const ordersRes = await api.get('/api/orders')
      const ordersList = Array.isArray(ordersRes.data) ? ordersRes.data : []
      
      const totalSpent = ordersList.reduce((sum, order) => {
        return sum + (parseFloat(order.totalAmount) || 0)
      }, 0)

      setStats({
        totalOrders: ordersList.length,
        totalSpent: totalSpent,
        cartItems: cartItems.length
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put('/api/profile/me', formData)
      setUser(res.data)
      setEditMode(false)
      showMessage('success', 'Profile updated successfully!')
      // Refresh auth user info - reload page to get new token if needed
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to update profile')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters')
      return
    }
    try {
      await api.post('/api/profile/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showMessage('success', 'Password changed successfully!')
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to change password')
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar-big">
            {getInitials(user?.name)}
          </div>
          <h1 className="profile-name">{user?.name || 'User'}</h1>
          <p className="profile-email">{user?.email}</p>
          {user?.role === 'ROLE_ADMIN' && (
            <span className="profile-badge">Admin</span>
          )}
        </div>
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalSpent.toFixed(2)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <div className="stat-value">{stats.cartItems}</div>
              <div className="stat-label">Cart Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="profile-overview">
            <div className="profile-info-card">
              <h2>Account Information</h2>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role:</span>
                <span className="info-value">{user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer'}</span>
              </div>
              <button className="btn btn-primary" onClick={() => setActiveTab('settings')}>
                Edit Profile
              </button>
            </div>

            <div className="profile-info-card">
              <h2>Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <p>No orders yet</p>
                  <a href="/shop" className="btn btn-primary">Start Shopping</a>
                </div>
              ) : (
                <div className="orders-preview">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="order-preview-item">
                      <div>
                        <strong>Order #{order.id}</strong>
                        <p className="order-status">{order.status}</p>
                      </div>
                      <div className="order-amount">${parseFloat(order.totalAmount || 0).toFixed(2)}</div>
                    </div>
                  ))}
                  {orders.length > 3 && (
                    <button className="btn btn-outline" onClick={() => setActiveTab('orders')}>
                      View All Orders
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-orders">
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Start shopping to see your orders here</p>
                <a href="/shop" className="btn btn-primary">Browse Products</a>
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
                      <div className={`order-status-badge order-status-badge-${order.status?.toLowerCase() || 'placed'}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-items">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span>{item.product?.name || 'Product'}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>${parseFloat(item.priceAtPurchase || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <div className="order-total">
                        Total: <strong>${parseFloat(order.totalAmount || 0).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-settings">
            <div className="settings-section">
              <h2>Edit Profile</h2>
              {!editMode ? (
                <div className="profile-info-card">
                  <div className="info-row">
                    <span className="info-label">Name:</span>
                    <span className="info-value">{user?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{user?.email}</span>
                  </div>
                  <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form className="profile-form" onSubmit={handleUpdateProfile}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => {
                      setEditMode(false)
                      setFormData({ name: user?.name || '', email: user?.email || '' })
                    }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="settings-section">
              <h2>Change Password</h2>
              <form className="profile-form" onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
