import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  const submit = (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 2500)
    }, 800)
  }

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-text">
            <h2>Get exclusive offers</h2>
            <p>Sign up and be the first to know about deals and new arrivals</p>
          </div>
          <form className="newsletter-form" onSubmit={submit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              required
            />
            <button className="btn btn-primary" disabled={status==='loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {status === 'success' && (
            <div className="alert alert-success" role="status">You are subscribed!</div>
          )}
        </div>
      </div>
    </section>
  )
}
