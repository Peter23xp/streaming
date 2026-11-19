'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { TMDB_GENRES } from '@/types/tmdb'

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

export default function FiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Genre"
        value={searchParams.get('genre') ?? ''}
        onChange={(e) => update('genre', e.target.value)}
        className="field cursor-pointer"
      >
        <option value="">Tous les genres</option>
        {TMDB_GENRES.map((g) => (
          <option key={g.id} value={String(g.id)}>
            {g.name}
          </option>
        ))}
      </select>
      <select
        aria-label="Année"
        value={searchParams.get('year') ?? ''}
        onChange={(e) => update('year', e.target.value)}
        className="field cursor-pointer"
      >
        <option value="">Toutes les années</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
