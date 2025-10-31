import { useEffect, useState } from 'react'
import api from '../lib/api'
import { formatCurrency } from '../lib/currency'

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [loading, setLoading] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  
  const [productForm, setProductForm] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    imageUrl: '', 
    stock: '' 
  })
  
  const [editingProduct, setEditingProduct] = useState(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [analyticsRes, usersRes, productsRes, ordersRes] = await Promise.all([
        api.get('/api/admin/analytics'),
        api.get('/api/admin/users'),
        api.get('/api/admin/products'),
        api.get('/api/admin/orders')
      ])
      
      setAnalytics(analyticsRes.data)
      setUsers(usersRes.data)
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleSaveProduct = async () => {
    try {
      const payload = { 
        ...productForm, 
        price: Number(productForm.price), 
        stock: Number(productForm.stock) 
      }
      
      if (editingProduct) {
        await api.put(`/api/admin/products/${editingProduct.id}`, payload)
      } else {
        await api.post('/api/admin/products', payload)
      }
      
      setProductForm({ name: '', description: '', price: '', imageUrl: '', stock: '' })
      setEditingProduct(null)
      setShowProductModal(false)
      loadDashboardData()
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock
    })
    setEditingProduct(product)
    setShowProductModal(true)
  }

  const handleAddNewProduct = () => {
    setProductForm({ name: '', description: '', price: '', imageUrl: '', stock: '' })
    setEditingProduct(null)
    setShowProductModal(true)
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/admin/products/${id}`)
        loadDashboardData()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await api.post(`/api/admin/users/${userId}/role`, { role })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status })
      loadDashboardData()
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const renderDashboard = () => (
    <div className="modern-admin-dashboard">
      <div className="dashboard-header">
        <h2 className="section-title">Dashboard Overview</h2>
        <p className="section-subtitle">Welcome back! Here's what's happening with your store today.</p>
      </div>
      
      <div className="stats-grid-modern">
        <div className="stat-card-modern revenue">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">{formatCurrency(analytics.totalRevenue || 0, 'INR')}</h3>
            <span className="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12l5-5 4 4 6-6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              +12.5% from last month
            </span>
          </div>
        </div>
        
        <div className="stat-card-modern orders">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{analytics.totalOrders || 0}</h3>
            <span className="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12l5-5 4 4 6-6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              +8.2% from last month
            </span>
          </div>
        </div>
        
        <div className="stat-card-modern products">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM2 7l10-5 10 5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{analytics.totalProducts || 0}</h3>
            <span className="stat-trend neutral">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              No change
            </span>
          </div>
        </div>
        
        <div className="stat-card-modern users">
          <div className="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">{analytics.totalUsers || 0}</h3>
            <span className="stat-trend positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12l5-5 4 4 6-6" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              +23 new users
            </span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Recent Orders</h3>
            <span className="view-all-link">View All →</span>
          </div>
          <div className="recent-orders-list">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <div className="order-avatar">
                    {order.user?.name?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div>
                    <p className="order-id">Order #{order.id}</p>
                    <p className="order-user">{order.user?.name || 'Guest'}</p>
                  </div>
                </div>
                <div className="order-details">
                  <span className="order-amount">{formatCurrency(order.totalAmount, 'INR')}</span>
                  <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quick-stats-card">
          <h3>Quick Stats</h3>
          <div className="quick-stats-list">
            <div className="quick-stat-item">
              <div className="quick-stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="quick-stat-label">Completed</p>
                <p className="quick-stat-value">{analytics.completedOrders || 0}</p>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="quick-stat-label">Pending</p>
                <p className="quick-stat-value">{analytics.pendingOrders || 0}</p>
              </div>
            </div>
            <div className="quick-stat-item">
              <div className="quick-stat-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="quick-stat-label">Processing</p>
                <p className="quick-stat-value">{Math.max(0, (analytics.totalOrders || 0) - (analytics.completedOrders || 0) - (analytics.pendingOrders || 0))}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <div className="modern-users-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">User Management</h2>
          <p className="section-subtitle">Manage user accounts and permissions</p>
        </div>
      </div>
      
      <div className="users-grid-modern">
        {users.map(user => (
          <div key={user.id} className="user-card-modern">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p className="user-email">{user.email}</p>
              <p className="user-date">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="user-actions">
              <select 
                className="role-select"
                value={user.role} 
                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="modern-products-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Product Management</h2>
          <p className="section-subtitle">Manage your product inventory</p>
        </div>
        <button className="btn-add-new" onClick={handleAddNewProduct}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add New Product
        </button>
      </div>
      
      <div className="products-grid-modern">
        {products.map(product => (
          <div key={product.id} className="product-card-admin">
            <div className="product-image">
              <img src={product.imageUrl} alt={product.name} />
              <div className="product-stock-badge">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description?.slice(0, 80)}...</p>
              <div className="product-meta">
                <span className="product-price">{formatCurrency(product.price, 'INR')}</span>
                <span className="product-id">ID: {product.id}</span>
              </div>
            </div>
            <div className="product-actions">
              <button className="btn-edit" onClick={() => handleEditProduct(product)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={() => setShowProductModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Product Name</label>
                <input 
                  type="text"
                  placeholder="Enter product name" 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})} 
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input 
                    type="number"
                    placeholder="0.00" 
                    value={productForm.price} 
                    onChange={e => setProductForm({...productForm, price: e.target.value})} 
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input 
                    type="number"
                    placeholder="0" 
                    value={productForm.stock} 
                    onChange={e => setProductForm({...productForm, stock: e.target.value})} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input 
                  type="text"
                  placeholder="https://..." 
                  value={productForm.imageUrl} 
                  onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows="4"
                  placeholder="Enter product description" 
                  value={productForm.description} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})} 
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowProductModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSaveProduct}>
                {editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderOrders = () => (
    <div className="modern-orders-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Order Management</h2>
          <p className="section-subtitle">Track and manage customer orders</p>
        </div>
      </div>
      
      <div className="orders-list-modern">
        {orders.map(order => (
          <div key={order.id} className="order-card-modern">
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p className="order-user">{order.user?.name || 'Guest'} • {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-total">
                <span className="label">Total</span>
                <span className="amount">{formatCurrency(order.totalAmount, 'INR')}</span>
              </div>
            </div>
            <div className="order-body">
              <div className="order-info-grid">
                <div className="info-item">
                  <span className="label">Payment Method</span>
                  <span className="value">{order.paymentMethod}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Status</span>
                  <span className={`badge badge-${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Status</span>
                  <select 
                    className="status-select"
                    value={order.status} 
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="PLACED">Placed</option>
                    <option value="PAID">Paid</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELED">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="modern-analytics-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Analytics & Reports</h2>
          <p className="section-subtitle">Insights and performance metrics</p>
        </div>
      </div>
      
      <div className="analytics-grid">
        <div className="analytics-card gradient-purple">
          <div className="analytics-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11l3 3L22 4" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Pending Orders</h3>
          <p className="analytics-value">{analytics.pendingOrders || 0}</p>
          <span className="analytics-label">Awaiting Processing</span>
        </div>
        <div className="analytics-card gradient-green">
          <div className="analytics-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 4L12 14.01l-3-3" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Completed Orders</h3>
          <p className="analytics-value">{analytics.completedOrders || 0}</p>
          <span className="analytics-label">Successfully Delivered</span>
        </div>
        <div className="analytics-card gradient-blue">
          <div className="analytics-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Revenue Today</h3>
          <p className="analytics-value">{formatCurrency((analytics.totalRevenue || 0) / 30, 'INR')}</p>
          <span className="analytics-label">Average Daily Revenue</span>
        </div>
        <div className="analytics-card gradient-orange">
          <div className="analytics-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" strokeWidth="2" strokeLinecap="round"/>
              <path d="M2 7l10-5 10 5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Top Products</h3>
          <p className="analytics-value">{analytics.topSellingProducts?.length || 0}</p>
          <span className="analytics-label">Best Sellers</span>
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-card-large">
          <h3>Sales Overview (Last 7 Days)</h3>
          <div className="bar-chart">
            {[12, 19, 15, 25, 22, 30, 28].map((value, index) => (
              <div key={index} className="bar-item">
                <div className="bar-fill" style={{ height: `${(value / 30) * 100}%` }}>
                  <span className="bar-value">{value}</span>
                </div>
                <span className="bar-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-card-medium">
          <h3>Order Status Distribution</h3>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" strokeWidth="40" strokeDasharray="150 350" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="40" strokeDasharray="100 350" strokeDashoffset="-150" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="40" strokeDasharray="50 350" strokeDashoffset="-250" transform="rotate(-90 100 100)" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#ef4444" strokeWidth="40" strokeDasharray="50 350" strokeDashoffset="-300" transform="rotate(-90 100 100)" />
              </svg>
              <div className="pie-center">
                <p className="pie-total">{analytics.totalOrders || 0}</p>
                <span>Total</span>
              </div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#10b981' }}></span>
                <span>Delivered ({Math.round((analytics.totalOrders || 0) * 0.4)})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#3b82f6' }}></span>
                <span>Shipped ({Math.round((analytics.totalOrders || 0) * 0.3)})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#f59e0b' }}></span>
                <span>Processing ({Math.round((analytics.totalOrders || 0) * 0.2)})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#ef4444' }}></span>
                <span>Cancelled ({Math.round((analytics.totalOrders || 0) * 0.1)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="revenue-chart-card">
        <h3>Revenue Trend (Last 30 Days)</h3>
        <div className="line-chart">
          <svg viewBox="0 0 800 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path d="M 0 250 L 50 200 L 100 220 L 150 180 L 200 160 L 250 140 L 300 120 L 350 100 L 400 90 L 450 80 L 500 70 L 550 60 L 600 50 L 650 55 L 700 45 L 750 40 L 800 35 L 800 300 L 0 300 Z" fill="url(#gradient)" />
            <path d="M 0 250 L 50 200 L 100 220 L 150 180 L 200 160 L 250 140 L 300 120 L 350 100 L 400 90 L 450 80 L 500 70 L 550 60 L 600 50 L 650 55 L 700 45 L 750 40 L 800 35" fill="none" stroke="#3b82f6" strokeWidth="3" />
            {[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800].map((x, i) => (
              <circle key={i} cx={x} cy={[250, 200, 220, 180, 160, 140, 120, 100, 90, 80, 70, 60, 50, 55, 45, 40, 35][i]} r="4" fill="#3b82f6" />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )

  return (
    <div className="modern-admin-panel">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 22V12h6v10" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM2 7l10-5 10 5" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Products
          </button>
          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 11V7a4 4 0 0 0-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Orders
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Users
          </button>
          <button 
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 20V10M12 20V4M6 20v-6" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Analytics
          </button>
        </nav>
      </div>
      
      <div className="admin-main-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'analytics' && renderAnalytics()}
          </>
        )}
      </div>
    </div>
  )
}