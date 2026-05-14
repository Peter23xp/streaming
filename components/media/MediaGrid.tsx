import MediaCard from './MediaCard'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import type { PlatformKey } from '@/lib/platforms'

interface MediaGridProps {
  items: ((TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' })[]
  type: 'movie' | 'tv'
  platform?: PlatformKey
}

export default function MediaGrid({ items, type, platform }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} type={type} platform={platform} />
      ))}
    </div>
  )
}
