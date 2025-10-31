import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const token = res.data.token
      
      // Decode token to get role
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userRole = payload.role
      
      // Login first (sets state synchronously)
      login(token)
      
      // Navigate based on role immediately
      if (userRole === 'ROLE_ADMIN') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError('Invalid credentials')
    }
  }
  
  return (
    <form className="auth-form" onSubmit={submit}>
      <h3>Login</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn" type="submit">Login</button>
    </form>
  )
}





