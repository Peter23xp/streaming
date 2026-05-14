'use client'
import { useWatchlistStore } from '@/store/watchlistStore'
import MediaCard from '@/components/media/MediaCard'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'

export default function WatchlistPage() {
  const items = useWatchlistStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
        <Bookmark size={48} />
        <p className="text-lg">Votre liste est vide</p>
        <Link href="/" className="text-sm hover:underline" style={{ color: '#e50914' }}>
          Parcourir les films
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Ma liste ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <MediaCard
            key={`${item.type}-${item.id}`}
            item={{
              id: item.id,
              title: item.title,
              name: item.title,
              original_title: '',
              original_name: '',
              original_language: 'fr',
              overview: '',
              poster_path: item.poster,
              backdrop_path: null,
              vote_average: 0,
              vote_count: 0,
              release_date: item.year,
              first_air_date: item.year,
              genre_ids: [],
            }}
            type={item.type}
          />
        ))}
      </div>
    </div>
  )
}
