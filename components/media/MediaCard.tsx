import Link from 'next/link'
import Image from 'next/image'
import { slugify, formatYear, isVF } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'

type MediaCardProps = {
  item: (TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' }
  type: 'movie' | 'tv'
}

export default function MediaCard({ item, type }: MediaCardProps) {
  const isMovie = type === 'movie'
  const movie = item as TMDBMovie
  const show = item as TMDBTVShow
  const title = isMovie ? (movie.title ?? '') : (show.name ?? '')
  const date = isMovie ? movie.release_date : show.first_air_date
  const slug = slugify(title)
  const href = isMovie ? `/films/${item.id}/${slug}` : `/series/${item.id}/${slug}`
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : null

  return (
    <Link href={href} className="group block">
      <div
        className="relative overflow-hidden rounded-lg aspect-[2/3]"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant={isVF(item.original_language) ? 'vf' : 'vostfr'} />
          <Badge variant="hd" />
        </div>
        <div className="absolute top-2 right-2">
          <StarRating value={item.vote_average} />
        </div>
      </div>
      <p className="mt-1.5 text-sm font-medium text-white truncate">{title}</p>
      <p className="text-xs text-zinc-400">{formatYear(date)}</p>
    </Link>
  )
}
