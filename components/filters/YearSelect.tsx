'use client'
import { useRouter } from 'next/navigation'

const YEARS = Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i))

export default function YearSelect({ value, basePath, query }: { value?: string; basePath: string; query: string }) {
  const router = useRouter()
  return (
    <select
      aria-label="Année"
      value={value ?? ''}
      onChange={(e) => {
        const sp = new URLSearchParams(query)
        if (e.target.value) sp.set('year', e.target.value)
        const qs = sp.toString()
        router.push(qs ? `${basePath}?${qs}` : basePath)
      }}
      className="field cursor-pointer rounded-full py-2"
    >
      <option value="">Toutes les années</option>
      {YEARS.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
}
