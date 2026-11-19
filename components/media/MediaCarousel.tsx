import MediaCard from './MediaCard'
import CarouselTrack from './CarouselTrack'
import SectionTitle from '@/components/ui/SectionTitle'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import type { PlatformKey } from '@/lib/platforms'

interface Props {
  title: string
  items: ((TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' })[]
  type: 'movie' | 'tv'
  viewAllHref?: string
  platform?: PlatformKey
}

export default function MediaCarousel({ title, items, type, viewAllHref, platform }: Props) {
  if (!items?.length) return null
  return (
    <section className="space-y-4">
      <SectionTitle title={title} href={viewAllHref} />
      <CarouselTrack>
        {items.map((item) => (
          <div key={item.id} className="w-36 flex-none snap-start sm:w-44">
            <MediaCard item={item} type={type} platform={platform} sizes="(max-width: 640px) 144px, 176px" />
          </div>
        ))}
      </CarouselTrack>
    </section>
  )
}
