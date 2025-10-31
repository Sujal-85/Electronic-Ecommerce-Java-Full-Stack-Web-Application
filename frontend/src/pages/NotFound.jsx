import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="auth-form" style={{textAlign:'center'}}>
      <h2>404 - Page Not Found</h2>
      <p>The page you requested does not exist.</p>
      <Link className="btn" to="/">Go Home</Link>
    </div>
  )
}





