'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { TMDB_GENRES } from '@/types/tmdb'

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

const selectStyle = {
  backgroundColor: '#1a1a1a',
  borderColor: '#3f3f46',
  color: '#ffffff',
} as React.CSSProperties

export default function FiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const currentGenre = searchParams.get('genre') ?? ''
  const currentYear = searchParams.get('year') ?? ''

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={currentGenre}
        onChange={(e) => update('genre', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
        style={selectStyle}
      >
        <option value="">Tous les genres</option>
        {TMDB_GENRES.map((g) => (
          <option key={g.id} value={String(g.id)}>
            {g.name}
          </option>
        ))}
      </select>
      <select
        value={currentYear}
        onChange={(e) => update('year', e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
        style={selectStyle}
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
