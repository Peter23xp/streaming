import { getTVDetail, getTVSeason } from '@/lib/tmdb'
import { isVF, slugify } from '@/lib/utils'
import Image from 'next/image'
import Badge from '@/components/ui/Badge'
import StarRating from '@/components/ui/StarRating'
import WatchlistButton from '@/components/ui/WatchlistButton'
import VidSrcPlayer from '@/components/media/VidSrcPlayer'
import EpisodeSelector from '@/components/media/EpisodeSelector'
import CastRow from '@/components/media/CastRow'
import MediaGrid from '@/components/media/MediaGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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

  return (
    <div className="space-y-8">
      {/* Backdrop */}
      <div className="relative -mx-4 -mt-6 overflow-hidden" style={{ height: 280 }}>
        {backdrop && (
          <Image src={backdrop} alt={show.name} fill className="object-cover" priority sizes="100vw" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.6) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col md:flex-row gap-6 -mt-32 relative z-10">
        {poster && (
          <div className="flex-none w-32 md:w-48">
            <Image
              src={poster}
              alt={show.name}
              width={192}
              height={288}
              className="rounded-lg shadow-xl"
            />
          </div>
        )}
        <div className="space-y-3 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{show.name}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
            <StarRating value={show.vote_average} />
            <span>{show.first_air_date?.slice(0, 4)}</span>
            {show.number_of_seasons && (
              <span>
                {show.number_of_seasons} saison{show.number_of_seasons > 1 ? 's' : ''}
              </span>
            )}
            {show.status && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: '#1a1a1a' }}
              >
                {show.status}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Badge variant={isVF(show.original_language) ? 'vf' : 'vostfr'} />
            <Badge variant="hd" />
          </div>
          {show.overview && (
            <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">{show.overview}</p>
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

      {/* Player */}
      <VidSrcPlayer type="tv" tmdbId={show.id} season={currentSeason} episode={currentEpisode} />

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
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Séries similaires</h2>
          <MediaGrid items={show.similar.results.slice(0, 6)} type="tv" />
        </section>
      ) : null}
    </div>
  )
}
