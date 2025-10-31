import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProfileDropdown() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <div className="profile-avatar">
          {getInitials(user?.name)}
        </div>
        <span className="profile-name">{user?.name || 'User'}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="profile-avatar-large">
              {getInitials(user?.name)}
            </div>
            <div>
              <div className="profile-dropdown-name">{user?.name || 'User'}</div>
              <div className="profile-dropdown-email">{user?.email}</div>
            </div>
          </div>
          <div className="profile-dropdown-divider"></div>
          <Link to="/profile" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
              <path d="M8 10C5.33 10 0 11.33 0 14V16H16V14C16 11.33 10.67 10 8 10Z" fill="currentColor"/>
            </svg>
            My Profile
          </Link>
          <Link to="/orders" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M0 2C0 0.895431 0.895431 0 2 0H6L8 2H14C15.1046 2 16 2.89543 16 4V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z" fill="currentColor"/>
            </svg>
            My Orders
          </Link>
          <Link to="/cart" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M0 1C0 0.447715 0.447715 0 1 0H2.5C2.96478 0 3.37256 0.30462 3.51136 0.740262L6.98864 12.2597C7.12744 12.6954 7.53522 13 8 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H8.51429L7.48571 8H12C12.5523 8 13 7.55228 13 7C13 6.44772 12.5523 6 12 6H6.51429L5.48571 3H1C0.447715 3 0 2.55228 0 2V1Z" fill="currentColor"/>
            </svg>
            Shopping Cart
          </Link>
          <Link to="/wishlist" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 14L2.5 8.5C1.5 7.5 1 6.2 1 4.8C1 2.6 2.6 1 4.8 1C5.9 1 7 1.5 8 2.5C9 1.5 10.1 1 11.2 1C13.4 1 15 2.6 15 4.8C15 6.2 14.5 7.5 13.5 8.5L8 14Z" fill="currentColor"/>
            </svg>
            Wishlist
          </Link>
          {user?.role === 'ROLE_ADMIN' && (
            <Link to="/admin" className="profile-dropdown-item" onClick={() => setIsOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0L10.1229 5.45492L16 6.21885L12 10.5451L12.9443 16L8 13.0902L3.05573 16L4 10.5451L0 6.21885L5.87713 5.45492L8 0Z" fill="currentColor"/>
              </svg>
              Admin Panel
            </Link>
          )}
          <div className="profile-dropdown-divider"></div>
          <button className="profile-dropdown-item profile-dropdown-logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M10 11L14 7M14 7L10 3M14 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

