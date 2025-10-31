const testimonials = [
  {
    quote: 'Amazing prices and super fast delivery. My go-to store for gadgets!',
    name: 'Aarav K.',
    title: 'Verified Buyer',
  },
  {
    quote: 'Customer support is top-notch. Replaced my item without hassle.',
    name: 'Priya S.',
    title: 'Loyal Customer',
  },
  {
    quote: 'Great selection and quality products. Highly recommend!',
    name: 'Rahul M.',
    title: 'Tech Enthusiast',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Customers Say</h2>
          <p>Real feedback from our shoppers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-quote">“{t.quote}”</div>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-title">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
