export default function Badge({ children, tone = 'brand', className = '' }) {
  const tones = {
    brand: 'bg-brand-100 text-brand-700',
    neutral: 'bg-stone-100 text-stone-700',
    gold: 'bg-amber-100 text-amber-800',
    success: 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span
      className={`inline-block text-xs px-2 py-1 rounded-full ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
