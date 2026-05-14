import { getMovieDetail } from '@/lib/tmdb'
import { formatRuntime, isVF, slugify } from '@/lib/utils'
import Image from 'next/image'
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

  const genreNames = movie.genres?.map((g) => g.name).join(' · ') ?? ''
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null
  const vfLabel = isVF(movie.original_language) ? 'VF' : 'VOSTFR'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null

  return (
    <div style={{ marginTop: '-24px' }}>
      {/* Player full width — flush with edges */}
      <div className="-mx-4">
        <VidSrcPlayer
          type="movie"
          tmdbId={movie.id}
          backdrop={backdrop}
          title={movie.title}
        />
      </div>

      {/* Info below player */}
      <div className="px-0 pt-6 space-y-6">

        {/* Top row: poster + metadata */}
        <div className="flex gap-5 items-start">
          {/* Poster */}
          {poster && (
            <div className="flex-none hidden sm:block" style={{ width: '100px' }}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '2/3',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
              >
                <Image src={poster} alt={movie.title} fill className="object-cover" sizes="100px" />
                {/* Platform accent */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', backgroundColor: '#d4af37' }} />
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="flex-1 space-y-3">
            <h1
              style={{
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              {movie.title}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              {rating && (
                <span
                  style={{
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: '#d4af37',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '2px',
                    letterSpacing: '0.05em',
                  }}
                >
                  ★ {rating}
                </span>
              )}
              <span
                style={{
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: '#d4af37',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '2px',
                  letterSpacing: '0.08em',
                }}
              >
                {vfLabel}
              </span>
              <span
                style={{
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: '#888',
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '2px',
                  letterSpacing: '0.05em',
                }}
              >
                HD
              </span>
              {movie.release_date && (
                <span style={{ color: '#555', fontSize: '11px', letterSpacing: '0.05em' }}>
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
              {movie.runtime ? (
                <span style={{ color: '#555', fontSize: '11px', letterSpacing: '0.05em' }}>
                  {formatRuntime(movie.runtime)}
                </span>
              ) : null}
            </div>

            {/* Genres */}
            {genreNames && (
              <p style={{ color: '#555', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {genreNames}
              </p>
            )}

            {/* Synopsis */}
            {movie.overview && (
              <p
                style={{
                  color: '#999',
                  fontSize: '13px',
                  lineHeight: 1.7,
                  maxWidth: '680px',
                }}
              >
                {movie.overview}
              </p>
            )}

            {/* Watchlist */}
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

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(212,175,55,0.08)' }} />

        {/* Cast */}
        {movie.credits?.cast?.length ? <CastRow cast={movie.credits.cast} /> : null}

        {/* Similar films */}
        {movie.similar?.results?.length ? (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div style={{ width: '2px', height: '14px', backgroundColor: '#d4af37' }} />
              <h2
                style={{
                  color: '#cccccc',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                FILMS SIMILAIRES
              </h2>
            </div>
            <MediaGrid items={movie.similar.results.slice(0, 6)} type="movie" />
          </section>
        ) : null}
      </div>
    </div>
  )
}
