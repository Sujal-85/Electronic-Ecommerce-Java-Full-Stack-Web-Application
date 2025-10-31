import { Link } from 'react-router-dom'

const categories = [
  { key: 'laptops', label: 'Laptops', emoji: '💻', color: '#eef2ff' },
  { key: 'mobiles', label: 'Mobiles', emoji: '📱', color: '#fff7ed' },
  { key: 'audio', label: 'Audio', emoji: '🎧', color: '#ecfeff' },
  { key: 'gaming', label: 'Gaming', emoji: '🎮', color: '#f0f9ff' },
  { key: 'wearables', label: 'Wearables', emoji: '⌚', color: '#fefce8' },
  { key: 'accessories', label: 'Accessories', emoji: '🔌', color: '#f5f3ff' },
]

export default function CategoryGrid() {
  return (
    <section className="categories">
      <div className="container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find what you need faster</p>
        </div>
        <div className="categories-grid">
          {categories.map(c => (
            <Link
              key={c.key}
              to={`/shop?category=${c.key}`}
              className="category-card"
              style={{ background: c.color }}
            >
              <div className="category-emoji">{c.emoji}</div>
              <div className="category-label">{c.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
