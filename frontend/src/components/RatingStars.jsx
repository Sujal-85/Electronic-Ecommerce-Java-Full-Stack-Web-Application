export default function RatingStars({ rating = 0 }) {
  const full = Math.floor(rating)
  const stars = Array.from({ length: 5 }, (_, i) => i < full)
  return (
    <div style={{color:'#f5b301', fontSize:14}} aria-label={`Rating ${rating} of 5`}>
      {stars.map((s, i) => <span key={i}>{s ? '★' : '☆'}</span>)}
    </div>
  )}





