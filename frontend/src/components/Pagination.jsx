export default function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const prev = () => onChange(Math.max(1, page - 1))
  const next = () => onChange(Math.min(totalPages, page + 1))
  return (
    <div className="pagination">
      <button className="btn secondary" onClick={prev} disabled={page <= 1}>Prev</button>
      <span style={{padding:'0 8px'}}>Page {page} / {totalPages}</span>
      <button className="btn" onClick={next} disabled={page >= totalPages}>Next</button>
    </div>
  )
}





