export default function StarRating({ value }: { value: number }) {
  return (
    <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f5c518', color: '#000' }}>
      ★ {value.toFixed(1)}
    </span>
  )
}
