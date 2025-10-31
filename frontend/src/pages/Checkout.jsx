import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { formatCurrency } from '../lib/currency'

export default function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

  useEffect(() => {
    loadCart()
    loadRazorpayScript()
  }, [])

  const loadCart = async () => {
    try {
      const res = await api.get('/api/cart')
      const items = Array.isArray(res.data) ? res.data : []
      setCartItems(items)
      if (items.length === 0) {
        navigate('/cart')
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
  }

  const loadRazorpayScript = async () => {
    // Load Razorpay checkout script regardless of key; key is supplied at open time
    if (!window.Razorpay) {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => setRazorpayLoaded(true)
      script.onerror = () => setRazorpayLoaded(false)
      document.body.appendChild(script)
    } else {
      setRazorpayLoaded(true)
    }
  }

  const subtotal = cartItems.reduce((s, it) => s + Number(it.product?.price || 0) * (it.quantity || 0), 0)
  const tax = subtotal * 0.18 // 18% GST
  const total = subtotal + tax

  const handleCODOrder = async () => {
    try {
      setLoading(true)
      const res = await api.post('/api/orders/place', { paymentMethod: 'COD' })
      navigate(`/order-confirmation/${res.data.id}`)
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true)
      // First create the order in our system
      const orderRes = await api.post('/api/orders/place', { paymentMethod: 'RAZORPAY' })
      const orderId = orderRes.data.id

      // Create Razorpay order: amount in RUPEES
      const amountInRupees = Number(total.toFixed(2))
      const paymentRes = await api.post('/api/payment/create-order', { amount: amountInRupees })
      const razorpayOrderId = paymentRes.data?.orderId

      if (!razorpayOrderId) {
        throw new Error('Invalid payment order response: missing orderId')
      }

      // Initialize Razorpay checkout
      const resolvedKey = paymentRes.data?.keyId || razorpayKey
      if (!resolvedKey) {
        throw new Error('Missing Razorpay key: provide keyId from backend or set VITE_RAZORPAY_KEY_ID')
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded')
      }

      const options = {
        key: resolvedKey,
        amount: paymentRes.data.amount,
        currency: paymentRes.data.currency,
        name: 'ElectroShop',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await api.post('/api/payment/verify', {
              orderId: orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            })

            if (verifyRes.data.status === 'success') {
              navigate(`/order-confirmation/${orderId}`)
            } else {
              alert('Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification error: ' + (error.response?.data?.error || error.message || 'Unknown error occurred'))
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment initiation error:', error)
      setLoading(false)
      const msg = error?.message || ''
      const apiErr = error?.response?.data?.error || ''
      alert('Payment initiation error: ' + (apiErr || msg || 'Failed to initiate payment'))
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <div className="checkout-main">
          {/* Order Summary */}
          <div className="checkout-section">
            <h2>Order Summary</h2>
            <div className="order-items-list">
              {cartItems.map(item => (
                <div key={item.id} className="order-item-summary">
                  <div className="item-info">
                    <strong>{item.product?.name || 'Product'}</strong>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="item-price">
                    {formatCurrency(Number(item.product?.price || 0) * (item.quantity || 0), 'INR')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, 'INR')}</span>
              </div>
              <div className="total-row">
                <span>Tax (18%):</span>
                <span>{formatCurrency(tax, 'INR')}</span>
              </div>
              <div className="total-row total-final">
                <span>Total:</span>
                <span>{formatCurrency(total, 'INR')}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-option-content">
                  <div className="payment-icon">💵</div>
                  <div>
                    <strong>Cash on Delivery (COD)</strong>
                    <p>Pay when you receive your order</p>
                  </div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={!razorpayLoaded}
                />
                <div className="payment-option-content">
                  <div className="payment-icon">💳</div>
                  <div>
                    <strong>Razorpay</strong>
                    <p>Secure online payment</p>
              {!razorpayLoaded && (
                <small style={{color: '#dc3545'}}>Razorpay not loaded</small>
              )}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="checkout-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/cart')}
              disabled={loading}
            >
              Back to Cart
            </button>
            <button
              className="btn btn-primary btn-large"
              onClick={paymentMethod === 'COD' ? handleCODOrder : handleRazorpayPayment}
              disabled={
                loading ||
                (paymentMethod === 'RAZORPAY' && (!razorpayLoaded || total <= 0)) ||
                (paymentMethod === 'COD' && total <= 0)
              }
            >
              {loading ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order (COD)' : 'Pay with Razorpay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
