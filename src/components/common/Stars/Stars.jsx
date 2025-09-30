import { Star } from 'lucide-react'
export default function Stars({ value = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < value ? 'fill-yellow-400 stroke-yellow-400' : 'stroke-stone-300'
          }
        />
      ))}
    </div>
  )
}
