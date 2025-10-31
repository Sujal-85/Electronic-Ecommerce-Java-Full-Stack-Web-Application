export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  try {
    const value = Number(amount) || 0
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value)
  } catch {
    return `${currency === 'INR' ? '₹' : ''}${Number(amount || 0).toFixed(2)}`
  }
}

// Optional helper if you need USD->INR conversion. Keep 83 as a placeholder.
export const usdToInr = (usd, rate = 83) => Number(usd) * rate
