import { getTVDetail, getTVSeason } from '@/lib/tmdb'
import { isVF, slugify } from '@/lib/utils'
import VidSrcPlayer from '@/components/media/VidSrcPlayer'
import MediaHeader from '@/components/media/MediaHeader'
import EpisodeSelector from '@/components/media/EpisodeSelector'
import CastRow from '@/components/media/CastRow'
import MediaGrid from '@/components/media/MediaGrid'
import SectionTitle from '@/components/ui/SectionTitle'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import JsonLd from '@/components/seo/JsonLd'

interface Props {
  params: Promise<{ id: string; slug: string }>
  searchParams: Promise<{ season?: string; episode?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const show = await getTVDetail(parseInt(id))
  if (!show?.id) return {}
  return {
    title: `${show.name} en streaming`,
    description: show.overview?.slice(0, 160),
    openGraph: {
      images: show.backdrop_path ? [`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`] : [],
    },
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export default async function SeriesDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const currentSeason = parseInt(sp.season ?? '1') || 1
  const currentEpisode = parseInt(sp.episode ?? '1') || 1

  const [show, seasonData] = await Promise.all([
    getTVDetail(parseInt(id)),
    getTVSeason(parseInt(id), currentSeason),
  ])
  if (!show?.id) notFound()

  const year = show.first_air_date?.slice(0, 4) ?? ''
  const episodeTitle = seasonData?.episodes?.find((e) => e.episode_number === currentEpisode)?.name ?? ''
  const playerTitle = episodeTitle
    ? `${show.name} — S${pad(currentSeason)}E${pad(currentEpisode)} · ${episodeTitle}`
    : show.name
  const seasons = show.number_of_seasons
    ? `${show.number_of_seasons} saison${show.number_of_seasons > 1 ? 's' : ''}`
    : null

  return (
    <div className="-mt-6 space-y-10">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TVSeries',
          name: show.name,
          description: show.overview?.slice(0, 300),
          image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
          datePublished: show.first_air_date,
          aggregateRating: show.vote_average
            ? {
                '@type': 'AggregateRating',
                ratingValue: show.vote_average.toFixed(1),
                ratingCount: show.vote_count,
                bestRating: 10,
              }
            : undefined,
          genre: show.genres?.map((g: { name: string }) => g.name),
          numberOfSeasons: show.number_of_seasons,
        }}
      />

      <div className="-mx-4 sm:-mx-6">
        <VidSrcPlayer
          type="tv"
          tmdbId={show.id}
          season={currentSeason}
          episode={currentEpisode}
          backdrop={show.backdrop_path ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}` : null}
          title={playerTitle}
        />
      </div>

      <MediaHeader
        title={show.name}
        posterPath={show.poster_path}
        rating={show.vote_average}
        isVF={isVF(show.original_language)}
        meta={[year, seasons]}
        genres={show.genres?.map((g) => g.name)}
        overview={show.overview}
        watchItem={{ id: show.id, type: 'tv', title: show.name, poster: show.poster_path, year }}
      />

      {show.seasons && seasonData?.episodes && (
        <EpisodeSelector
          seasons={show.seasons}
          currentSeason={currentSeason}
          currentEpisode={currentEpisode}
          episodes={seasonData.episodes}
          basePath={`/series/${show.id}/${slugify(show.name)}`}
        />
      )}

      {show.credits?.cast?.length ? <CastRow cast={show.credits.cast} /> : null}

      {show.similar?.results?.length ? (
        <section className="space-y-4">
          <SectionTitle title="Séries similaires" />
          <MediaGrid items={show.similar.results.slice(0, 12)} type="tv" />
        </section>
      ) : null}
    </div>
  )
}
