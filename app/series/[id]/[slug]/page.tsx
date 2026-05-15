import { getTVDetail, getTVSeason } from '@/lib/tmdb'
import { isVF, slugify } from '@/lib/utils'
import Image from 'next/image'
import WatchlistButton from '@/components/ui/WatchlistButton'
import VidSrcPlayer from '@/components/media/VidSrcPlayer'
import EpisodeSelector from '@/components/media/EpisodeSelector'
import CastRow from '@/components/media/CastRow'
import MediaGrid from '@/components/media/MediaGrid'
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
      images: show.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${show.backdrop_path}`]
        : [],
    },
  }
}

export default async function SeriesDetailPage({ params, searchParams }: Props) {
  const { id } = await params
  const sp = await searchParams
  const currentSeason = parseInt(sp.season ?? '1')
  const currentEpisode = parseInt(sp.episode ?? '1')

  const [show, seasonData] = await Promise.all([
    getTVDetail(parseInt(id)),
    getTVSeason(parseInt(id), currentSeason),
  ])
  if (!show?.id) notFound()

  const backdrop = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : null
  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/w342${show.poster_path}`
    : null
  const slug = slugify(show.name)
  const vfLabel = isVF(show.original_language) ? 'VF' : 'VOSTFR'
  const rating = show.vote_average ? show.vote_average.toFixed(1) : null

  const episodeTitle =
    seasonData?.episodes?.find((e) => e.episode_number === currentEpisode)?.name ?? ''
  const playerTitle = episodeTitle
    ? `${show.name} — S${String(currentSeason).padStart(2, '0')}E${String(currentEpisode).padStart(2, '0')} · ${episodeTitle}`
    : show.name

  return (
    <div style={{ marginTop: '-24px' }}>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'TVSeries',
        name: show.name,
        description: show.overview?.slice(0, 300),
        image: poster ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
        datePublished: show.first_air_date,
        aggregateRating: show.vote_average ? {
          '@type': 'AggregateRating',
          ratingValue: show.vote_average.toFixed(1),
          ratingCount: show.vote_count,
          bestRating: 10,
        } : undefined,
        genre: show.genres?.map((g: { name: string }) => g.name),
        numberOfSeasons: show.number_of_seasons,
      }} />
      {/* Player full width */}
      <div className="-mx-4">
        <VidSrcPlayer
          type="tv"
          tmdbId={show.id}
          season={currentSeason}
          episode={currentEpisode}
          backdrop={backdrop}
          title={playerTitle}
        />
      </div>

      {/* Info below player */}
      <div className="px-0 pt-6 space-y-6">

        {/* Top row: poster + metadata */}
        <div className="flex gap-5 items-start">
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
                <Image src={poster} alt={show.name} fill className="object-cover" sizes="100px" priority />
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', backgroundColor: '#d4af37' }} />
              </div>
            </div>
          )}

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
              {show.name}
            </h1>

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
              {show.first_air_date && (
                <span style={{ color: '#555', fontSize: '11px', letterSpacing: '0.05em' }}>
                  {show.first_air_date.slice(0, 4)}
                </span>
              )}
              {show.number_of_seasons && (
                <span style={{ color: '#555', fontSize: '11px', letterSpacing: '0.05em' }}>
                  {show.number_of_seasons} saison{show.number_of_seasons > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {show.overview && (
              <p style={{ color: '#999', fontSize: '13px', lineHeight: 1.7, maxWidth: '680px' }}>
                {show.overview}
              </p>
            )}

            <WatchlistButton
              item={{
                id: show.id,
                type: 'tv',
                title: show.name,
                poster: show.poster_path,
                year: show.first_air_date?.slice(0, 4) ?? '',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(212,175,55,0.08)' }} />

        {/* Episode selector */}
        {show.seasons && seasonData?.episodes && (
          <EpisodeSelector
            seasons={show.seasons}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            episodes={seasonData.episodes}
            basePath={`/series/${show.id}/${slug}`}
          />
        )}

        {/* Cast */}
        {show.credits?.cast?.length ? <CastRow cast={show.credits.cast} /> : null}

        {/* Similar */}
        {show.similar?.results?.length ? (
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
                SÉRIES SIMILAIRES
              </h2>
            </div>
            <MediaGrid items={show.similar.results.slice(0, 6)} type="tv" />
          </section>
        ) : null}
      </div>
    </div>
  )
}
