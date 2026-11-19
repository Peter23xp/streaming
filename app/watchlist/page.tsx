'use client'
import { useWatchlistStore } from '@/store/watchlistStore'
import MediaCard from '@/components/media/MediaCard'
import SectionTitle from '@/components/ui/SectionTitle'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'

export default function WatchlistPage() {
  const items = useWatchlistStore((s) => s.items)

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-surface-2 text-gold">
          <Bookmark size={28} />
        </div>
        <p className="text-lg font-medium text-ink">Ta liste est vide</p>
        <p className="text-sm text-muted">Ajoute des films et séries pour les retrouver ici.</p>
        <Link href="/" className="btn-gold mt-2">
          Parcourir le catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <SectionTitle as="h1" title={`Ma liste (${items.length})`} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
