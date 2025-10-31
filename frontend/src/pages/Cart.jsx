import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { formatCurrency } from '../lib/currency'

export default function Cart() {
  const [items, setItems] = useState([])
  const load = () => api.get('/api/cart').then(r => setItems(r.data))
  useEffect(() => { load() }, [])
  const removeItem = async (id) => { await api.delete(`/api/cart/remove/${id}`); load() }
  const subtotal = items.reduce((s, it) => s + Number(it.product.price) * it.quantity, 0)
  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>Review your items and proceed to secure checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some products to get started.</p>
            <Link className="btn btn-primary" to="/shop">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map(ci => (
                <div key={ci.id} className="cart-item-card">
                  <div className="cart-item-info">
                    <div className="cart-item-thumb" aria-hidden="true">📦</div>
                    <div className="cart-item-text">
                      <div className="cart-item-title">{ci.product.name}</div>
                      <div className="cart-item-meta">Qty: {ci.quantity}</div>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-price">{formatCurrency(Number(ci.product.price) * ci.quantity, 'INR')}</div>
                    <button className="btn btn-icon" onClick={() => removeItem(ci.product.id)} title="Remove item" aria-label="Remove item">✕</button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal, 'INR')}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax (18%)</span>
                  <span>{formatCurrency(subtotal * 0.18, 'INR')}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal * 1.18, 'INR')}</span>
                </div>
                <div className="summary-actions">
                  <Link className="btn btn-secondary" to="/shop">Continue Shopping</Link>
                  <Link className="btn btn-primary btn-large" to="/checkout">Proceed to Checkout</Link>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}





