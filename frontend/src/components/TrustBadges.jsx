export default function TrustBadges() {
  const items = [
    { icon: '✅', title: 'Genuine Products', desc: 'Warranty & brand-authorized' },
    { icon: '🔐', title: 'Secure Checkout', desc: 'SSL encryption' },
    { icon: '🚀', title: 'Fast Delivery', desc: 'Priority shipping' },
    { icon: '💬', title: '24/7 Support', desc: 'We are here to help' },
  ]
  return (
    <section className="trust-badges">
      <div className="container badges-row">
        {items.map((b, i) => (
          <div className="badge-card" key={i}>
            <div className="badge-icon">{b.icon}</div>
            <div>
              <div className="badge-title">{b.title}</div>
              <div className="badge-desc">{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
