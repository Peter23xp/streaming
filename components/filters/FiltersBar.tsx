'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { TMDB_GENRES } from '@/types/tmdb'

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

const selectStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '2px',
  color: '#666666',
  fontSize: '11px',
  letterSpacing: '0.05em',
  padding: '5px 10px',
  outline: 'none',
  cursor: 'pointer',
}

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
    <div className="flex flex-wrap gap-2 items-center">
      <select
        value={currentGenre}
        onChange={(e) => update('genre', e.target.value)}
        style={selectStyle}
      >
        <option value="">TOUS LES GENRES</option>
        {TMDB_GENRES.map((g) => (
          <option key={g.id} value={String(g.id)}>
            {g.name.toUpperCase()}
          </option>
        ))}
      </select>
      <select
        value={currentYear}
        onChange={(e) => update('year', e.target.value)}
        style={selectStyle}
      >
        <option value="">TOUTES LES ANNÉES</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
