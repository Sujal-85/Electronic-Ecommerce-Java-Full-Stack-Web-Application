import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    navigate(`/shop?q=${encodeURIComponent(term)}`)
  }
  return (
    <form onSubmit={submit} className="searchbar" role="search" aria-label="Sitewide">
      <span className="search-icon" aria-hidden>🔍</span>
      <input
        className="search-input"
        placeholder="Search electronics"
        value={q}
        onChange={e => setQ(e.target.value)}
        aria-label="Search"
      />
      {q && (
        <button type="button" className="search-clear" onClick={() => setQ('')} aria-label="Clear search">✕</button>
      )}
      <button className="search-btn" type="submit">Search</button>
    </form>
  )
}





