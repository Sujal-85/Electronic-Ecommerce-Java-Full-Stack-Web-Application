import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../lib/api'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'

export default function ProductList() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState({ q:'', min:'', max:'', sort:'relevance' })
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const pageSize = 12
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/api/products')
      .then(r => setProducts(r.data))
      .finally(() => setLoading(false))
  }, [])
  
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setFilter(f => ({ ...f, q }))
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = products.filter(p => p.name.toLowerCase().includes((filter.q||'').toLowerCase()))
    if (filter.min) list = list.filter(p => Number(p.price) >= Number(filter.min))
    if (filter.max) list = list.filter(p => Number(p.price) <= Number(filter.max))
    if (filter.sort === 'price-asc') list = list.slice().sort((a,b) => Number(a.price) - Number(b.price))
    if (filter.sort === 'price-desc') list = list.slice().sort((a,b) => Number(b.price) - Number(a.price))
    if (filter.sort === 'name-asc') list = list.slice().sort((a,b) => a.name.localeCompare(b.name))
    return list
  }, [products, filter])

  const start = (page - 1) * pageSize
  const pageItems = useMemo(() => filtered.slice(start, start + pageSize), [filtered, start])

  const addWishlist = (p) => {
    const w = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (!w.find(x => x.id === p.id)) {
      w.push(p)
      localStorage.setItem('wishlist', JSON.stringify(w))
    }
  }

  return (
    <div className="modern-product-list">
      <div className="container">
        <div className="product-list-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Our Products</h1>
              <p className="page-subtitle">Discover our premium collection of electronics</p>
            </div>
            <div className="results-info">
              <span className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</span>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="search-container">
              <div className="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                className="search-input"
                type="search"
                placeholder="Search products..."
                value={filter.q}
                onChange={(e) => { setFilter({ ...filter, q: e.target.value }); setPage(1) }}
                aria-label="Search products"
              />
            </div>
            
            <div className="toolbar-actions">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              
              <select
                className="sort-select"
                value={filter.sort}
                onChange={(e) => { setFilter({ ...filter, sort: e.target.value }); setPage(1) }}
                aria-label="Sort products"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A → Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="product-list-layout">
          <div className="filters-sidebar">
            <div className="filters-header">
              <h2 className="filters-title">Filters</h2>
              <button className="filters-toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <Filters initial={filter} onChange={(f) => { setFilter(f); setPage(1) }} />
          </div>
          
          <div className="products-main">
            {loading ? (
              <div className={`products-grid-modern ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                {Array.from({ length: pageSize }).map((_, i) => (
                  <div key={i} className="product-card-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filtered.length === 0 ? (
                  <div className="empty-state-modern">
                    <div className="empty-icon-modern">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <>
                    <div className={`products-grid-modern ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
                      {pageItems.map(p => (
                        <ProductCard key={p.id} product={p} onAddToWishlist={addWishlist} />
                      ))}
                    </div>
                    <div className="pagination-container">
                      <Pagination page={page} total={filtered.length} pageSize={pageSize} onChange={setPage} />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


