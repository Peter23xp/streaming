import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { slugify, formatYear, isVF } from '@/lib/utils'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

type MediaCardProps = {
  item: (TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' }
  type: 'movie' | 'tv'
  platform?: PlatformKey
  sizes?: string
}

export default function MediaCard({
  item,
  type,
  platform,
  sizes = '(max-width: 640px) 45vw, (max-width: 1024px) 23vw, 200px',
}: MediaCardProps) {
  const isMovie = type === 'movie'
  const title = isMovie ? ((item as TMDBMovie).title ?? '') : ((item as TMDBTVShow).name ?? '')
  const date = isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date
  const href = `/${isMovie ? 'films' : 'series'}/${item.id}/${slugify(title)}`
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    // Prefetch disabled: dozens of cards per page would flood the small server with background requests.
    <Link href={href} prefetch={false} className="group block outline-none">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface ring-1 ring-line transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_14px_30px_-12px_rgba(212,175,55,0.45)] group-hover:ring-gold/60 group-focus-visible:ring-2 group-focus-visible:ring-gold">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
            alt={title}
            fill
            sizes={sizes}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center text-xs text-faint">
            {title}
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/40 opacity-70 transition group-hover:opacity-100" />

        {platform && (
          <span
            className="absolute inset-x-0 top-0 h-0.5"
            style={{ backgroundColor: PLATFORMS[platform].color }}
          />
        )}

        <span className="absolute left-2 top-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-gold">
          {isVF(item.original_language) ? 'VF' : 'VOSTFR'}
        </span>

        {rating && (
          <span className="absolute right-2 top-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-semibold text-ink">
            <span className="text-gold">★</span> {rating}
          </span>
        )}

        <span className="absolute inset-0 m-auto flex size-12 scale-75 items-center justify-center rounded-full bg-gold text-black opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          <Play size={20} fill="currentColor" className="ml-0.5" />
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-medium text-ink transition group-hover:text-gold">
        {title}
      </p>
      <p className="text-xs text-faint">{formatYear(date)}</p>
    </Link>
  )
}
