import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/auth/signup', { name, email, password })
      login(res.data.token)
      navigate('/')
    } catch (err) {
      setError('Signup failed')
    }
  }
  return (
    <form className="auth-form" onSubmit={submit}>
      <h3>Signup</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="btn" type="submit">Create Account</button>
    </form>
  )
}





