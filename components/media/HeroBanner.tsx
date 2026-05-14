import Image from 'next/image'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { slugify, isVF } from '@/lib/utils'
import WatchlistButton from '@/components/ui/WatchlistButton'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import type { TMDBMovie } from '@/types/tmdb'

export default function HeroBanner({ movie }: { movie: TMDBMovie }) {
  const slug = slugify(movie.title ?? '')
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ minHeight: 300, maxHeight: 500, aspectRatio: '21/9' }}>
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-10 space-y-3 max-w-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={isVF(movie.original_language) ? 'vf' : 'vostfr'} />
          <Badge variant="hd" />
          <StarRating value={movie.vote_average} />
          <span className="text-zinc-300 text-sm">{movie.release_date?.slice(0, 4)}</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">{movie.title}</h1>
        {movie.overview && (
          <p className="text-zinc-300 text-sm md:text-base line-clamp-2">{movie.overview}</p>
        )}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            href={`/films/${movie.id}/${slug}`}
            className="flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-medium transition hover:opacity-90"
            style={{ backgroundColor: '#e50914' }}
          >
            <Play size={18} fill="white" /> Regarder
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
    </div>
  )
}
