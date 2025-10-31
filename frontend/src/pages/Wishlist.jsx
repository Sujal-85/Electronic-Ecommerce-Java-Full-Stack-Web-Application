import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const [items, setItems] = useState([])
  useEffect(() => { setItems(JSON.parse(localStorage.getItem('wishlist') || '[]')) }, [])
  const remove = (id) => {
    const w = items.filter(x => x.id !== id)
    setItems(w)
    localStorage.setItem('wishlist', JSON.stringify(w))
  }
  return (
    <div>
      <h2>Wishlist</h2>
      {items.length === 0 ? <p>No items yet.</p> : (
        <div className="grid">
          {items.map(p => (
            <div key={p.id}>
              <ProductCard product={p} />
              <button className="btn secondary" onClick={() => remove(p.id)} style={{marginTop:8}}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}





