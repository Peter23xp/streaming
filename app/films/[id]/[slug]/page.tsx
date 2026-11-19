import { getMovieDetail } from '@/lib/tmdb'
import { formatRuntime, isReleased, isVF } from '@/lib/utils'
import VidSrcPlayer from '@/components/media/VidSrcPlayer'
import ComingSoon from '@/components/media/ComingSoon'
import MediaHeader from '@/components/media/MediaHeader'
import CastRow from '@/components/media/CastRow'
import MediaGrid from '@/components/media/MediaGrid'
import SectionTitle from '@/components/ui/SectionTitle'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

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
      images: movie.backdrop_path ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`] : [],
    },
  }
}

export default async function FilmDetailPage({ params }: Props) {
  const { id } = await params
  const movie = await getMovieDetail(parseInt(id))
  if (!movie?.id) notFound()

  const year = movie.release_date?.slice(0, 4) ?? ''
  const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null
  const similar = movie.similar?.results?.filter(isReleased) ?? []

  return (
    <div className="-mt-6 space-y-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Movie',
          name: movie.title,
          description: movie.overview?.slice(0, 300),
          image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
          datePublished: movie.release_date,
          aggregateRating: movie.vote_average
            ? {
                '@type': 'AggregateRating',
                ratingValue: movie.vote_average.toFixed(1),
                ratingCount: movie.vote_count,
                bestRating: 10,
              }
            : undefined,
          genre: movie.genres?.map((g: { name: string }) => g.name),
        }}
      />

      <div className="-mx-4 sm:-mx-6">
        {isReleased(movie) ? (
          <VidSrcPlayer type="movie" tmdbId={movie.id} backdrop={backdrop} title={movie.title} />
        ) : (
          <ComingSoon backdrop={backdrop} date={movie.release_date} />
        )}
      </div>

      <MediaHeader
        title={movie.title}
        posterPath={movie.poster_path}
        rating={movie.vote_average}
        isVF={isVF(movie.original_language)}
        meta={[year, formatRuntime(movie.runtime)]}
        genres={movie.genres?.map((g) => g.name)}
        overview={movie.overview}
        watchItem={{ id: movie.id, type: 'movie', title: movie.title, poster: movie.poster_path, year }}
      />

      {movie.credits?.cast?.length ? <CastRow cast={movie.credits.cast} /> : null}

      {similar.length > 0 && (
        <section className="space-y-4">
          <SectionTitle title="Films similaires" />
          <MediaGrid items={similar.slice(0, 12)} type="movie" />
        </section>
      )}
    </div>
  )
}
