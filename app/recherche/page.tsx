'use client'
import { useState, useEffect, useCallback } from 'react'
import { Search } from 'lucide-react'
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

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(
        (data.results ?? []).filter(
          (r: SearchResult) => r.media_type === 'movie' || r.media_type === 'tv'
        )
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 400)
    return () => clearTimeout(timer)
  }, [query, search])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recherche</h1>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          size={20}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un film ou une série…"
          className="w-full border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition"
          style={{ backgroundColor: '#1a1a1a' }}
          autoFocus
        />
      </div>
      {loading && <p className="text-zinc-500 text-sm">Recherche en cours…</p>}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((r) => (
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
      {!loading && query && results.length === 0 && (
        <p className="text-zinc-500 text-center py-12">
          Aucun résultat pour &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  )
}
