import { getMovieDetail } from '@/lib/tmdb'
import { formatRuntime, isVF, slugify } from '@/lib/utils'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import WatchlistButton from '@/components/ui/WatchlistButton'
import VidSrcPlayer from '@/components/media/VidSrcPlayer'
import CastRow from '@/components/media/CastRow'
import MediaGrid from '@/components/media/MediaGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const movie = await getMovieDetail(parseInt(id))
  if (!movie?.id) return {}
  return {
    title: `${movie.title} (${movie.release_date?.slice(0, 4)}) en streaming`,
    description: movie.overview?.slice(0, 160),
    openGraph: {
      images: movie.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
        : [],
    },
  }
}

export default async function FilmDetailPage({ params }: Props) {
  const { id } = await params
  const movie = await getMovieDetail(parseInt(id))
  if (!movie?.id) notFound()

  const genreNames = movie.genres?.map((g) => g.name).join(', ') ?? ''
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null

  return (
    <div className="space-y-8">
      {/* Hero backdrop */}
      <div className="relative -mx-4 -mt-6 overflow-hidden" style={{ height: 280 }}>
        {backdrop && (
          <Image src={backdrop} alt={movie.title} fill className="object-cover" priority sizes="100vw" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.6) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Info section */}
      <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
        {poster && (
          <div className="flex-none w-32 md:w-48">
            <Image
              src={poster}
              alt={movie.title}
              width={192}
              height={288}
              className="rounded-lg shadow-xl"
            />
          </div>
        )}
        <div className="space-y-3 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <StarRating value={movie.vote_average} />
            <span>{movie.release_date?.slice(0, 4)}</span>
            {movie.runtime ? <span>{formatRuntime(movie.runtime)}</span> : null}
            {genreNames ? <span>{genreNames}</span> : null}
          </div>
          <div className="flex gap-2">
            <Badge variant={isVF(movie.original_language) ? 'vf' : 'vostfr'} />
            <Badge variant="hd" />
          </div>
          {movie.overview && (
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">{movie.overview}</p>
          )}
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

      {/* Player */}
      <VidSrcPlayer type="movie" tmdbId={movie.id} />

      {/* Cast */}
      {movie.credits?.cast?.length ? <CastRow cast={movie.credits.cast} /> : null}

      {/* Similar */}
      {movie.similar?.results?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Films similaires</h2>
          <MediaGrid items={movie.similar.results.slice(0, 6)} type="movie" />
        </section>
      ) : null}
    </div>
  )
}
