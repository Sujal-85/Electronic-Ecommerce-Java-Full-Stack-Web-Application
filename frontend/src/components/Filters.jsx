import { useEffect, useState } from 'react'

export default function Filters({ onChange, initial }) {
  const [q, setQ] = useState(initial?.q || '')
  const [min, setMin] = useState(initial?.min || '')
  const [max, setMax] = useState(initial?.max || '')
  const [sort, setSort] = useState(initial?.sort || 'relevance')

  useEffect(() => { onChange({ q, min, max, sort }) }, [q, min, max, sort])

  return (
    <div className="filters">
      <input placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
      <div className="row">
        <input placeholder="Min $" value={min} onChange={e => setMin(e.target.value)} />
        <input placeholder="Max $" value={max} onChange={e => setMax(e.target.value)} />
      </div>
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="relevance">Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A-Z</option>
      </select>
    </div>
  )
}





