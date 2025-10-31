import { useEffect, useState } from 'react'

export function useAuth() {
  const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  const updateUserFromToken = () => {
    const token = localStorage.getItem('token')
    setAuthenticated(!!token)
    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ email: payload.sub, role: payload.role || 'ROLE_USER', name: payload.name || '' })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    updateUserFromToken()
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userObj = { email: payload.sub, role: payload.role || 'ROLE_USER', name: payload.name || '' }
    setUser(userObj)
    setAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthenticated(false)
    setUser(null)
  }

  return { isAuthenticated, user, login, logout }
}





