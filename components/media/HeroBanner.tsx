import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { slugify, isVF } from '@/lib/utils'
import WatchlistButton from '@/components/ui/WatchlistButton'
import type { TMDBMovie } from '@/types/tmdb'

export default function HeroBanner({ movie }: { movie: TMDBMovie }) {
  const href = `/films/${movie.id}/${slugify(movie.title ?? '')}`

  return (
    <section className="relative -mx-4 -mt-6 overflow-hidden sm:mx-0 sm:mt-0 sm:rounded-2xl">
      <div className="relative aspect-[4/5] w-full sm:aspect-[21/9]">
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-bg/90 via-bg/30 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 max-w-2xl space-y-4 p-5 sm:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-md bg-gold px-2 py-0.5 font-bold text-black">
            {isVF(movie.original_language) ? 'VF' : 'VOSTFR'}
          </span>
          <span className="rounded-md border border-white/20 px-2 py-0.5 text-ink">HD</span>
          {movie.vote_average > 0 && (
            <span className="text-ink">
              <span className="text-gold">★</span> {movie.vote_average.toFixed(1)}
            </span>
          )}
          {movie.release_date && <span className="text-muted">{movie.release_date.slice(0, 4)}</span>}
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {movie.title}
        </h1>
        {movie.overview && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink/80 sm:line-clamp-3 sm:text-base">
            {movie.overview}
          </p>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link href={href} className="btn-gold">
            <Play size={16} fill="currentColor" /> Regarder
          </Link>
          <WatchlistButton
            item={{
              id: movie.id,
              type: 'movie',
              title: movie.title,
              poster: movie.poster_path,
              year: movie.release_date?.slice(0, 4) ?? '',
            }}
          />
        </div>
      </div>
    </section>
  )
}
