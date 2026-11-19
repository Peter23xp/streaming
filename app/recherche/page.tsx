'use client'
import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import MediaCard from '@/components/media/MediaCard'

interface SearchResult {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  vote_average: number
  release_date?: string
  first_air_date?: string
  original_language: string
  original_title?: string
  original_name?: string
  media_type: 'movie' | 'tv'
  genre_ids?: number[]
}

export default function RecherchePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        const data = await res.json()
        setResults(
          (data.results ?? []).filter((r: SearchResult) => r.media_type === 'movie' || r.media_type === 'tv')
        )
      } catch {
        // aborted by a newer keystroke
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 350)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const hasQuery = query.trim().length > 0
  const shown = hasQuery ? results : []

  return (
    <div className="space-y-8">
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" size={20} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setLoading(e.target.value.trim().length > 0)
          }}
          placeholder="Rechercher un film ou une série…"
          aria-label="Rechercher"
          className="w-full rounded-full border border-line bg-surface py-3.5 pl-12 pr-12 text-base text-ink placeholder:text-faint outline-none transition focus:border-gold/60"
          autoFocus
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-gold" size={20} />
        )}
      </div>

      {shown.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shown.map((r) => (
            <MediaCard
              key={`${r.media_type}-${r.id}`}
              item={{
                ...r,
                title: r.title ?? r.name ?? '',
                name: r.name ?? r.title ?? '',
                original_title: r.original_title ?? '',
                original_name: r.original_name ?? '',
                overview: '',
                backdrop_path: null,
                vote_count: 0,
                release_date: r.release_date ?? '',
                first_air_date: r.first_air_date ?? '',
                genre_ids: r.genre_ids ?? [],
              }}
              type={r.media_type}
            />
          ))}
        </div>
      )}

      {!loading && hasQuery && shown.length === 0 && (
        <p className="py-12 text-center text-muted">Aucun résultat pour « {query} »</p>
      )}
      {!hasQuery && (
        <p className="py-12 text-center text-sm text-faint">Tape le titre d&apos;un film ou d&apos;une série.</p>
      )}
    </div>
  )
}
