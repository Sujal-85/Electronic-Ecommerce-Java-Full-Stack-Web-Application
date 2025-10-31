import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProductList from './pages/ProductList'
import Home from './pages/Home'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders'
import OrderTracking from './pages/OrderTracking'
import OrderConfirmation from './pages/OrderConfirmation'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<div className="container"><ProductList /></div>} />
          <Route path="/product/:id" element={<div className="container"><ProductDetails /></div>} />
          <Route path="/cart" element={<div className="container"><ProtectedRoute><Cart /></ProtectedRoute></div>} />
          <Route path="/checkout" element={<div className="container"><ProtectedRoute><Checkout /></ProtectedRoute></div>} />
          <Route path="/orders" element={<div className="container"><ProtectedRoute><Orders /></ProtectedRoute></div>} />
          <Route path="/orders/:id" element={<div className="container"><ProtectedRoute><OrderTracking /></ProtectedRoute></div>} />
          <Route path="/order-confirmation/:id" element={<div className="container"><ProtectedRoute><OrderConfirmation /></ProtectedRoute></div>} />
          <Route path="/profile" element={<div className="container"><ProtectedRoute><Profile /></ProtectedRoute></div>} />
          <Route path="/wishlist" element={<div className="container"><Wishlist /></div>} />
          <Route path="/admin" element={<div className="container"><ProtectedRoute roles={["ROLE_ADMIN"]}><Admin /></ProtectedRoute></div>} />
          <Route path="/login" element={<div className="container"><Login /></div>} />
          <Route path="/signup" element={<div className="container"><Signup /></div>} />
          <Route path="*" element={<div className="container"><NotFound /></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}


