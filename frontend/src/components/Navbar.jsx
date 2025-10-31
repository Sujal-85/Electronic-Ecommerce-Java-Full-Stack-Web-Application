import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import SearchBar from './SearchBar'
import ProfileDropdown from './ProfileDropdown'

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="navbar">
      <Link className="brand" to="/">ElectroShop</Link>
      <div style={{flex:1, display:'flex', justifyContent:'center'}}>
        <SearchBar />
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        {isAuthenticated && <Link to="/wishlist">Wishlist</Link>}
        {isAuthenticated && <Link to="/orders">Orders</Link>}
        {isAuthenticated && <Link to="/cart">Cart</Link>}
        {isAuthenticated ? (
          <ProfileDropdown />
        ) : (
          <>
            <Link to="/login" className="btn-nav">Login</Link>
            <Link to="/signup" className="btn-nav btn-nav-primary">Signup</Link>
          </>
        )}
      </div>
    </div>
  )
}


