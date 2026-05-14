import {
  getTrending,
  getPopular,
  getNowPlaying,
  getTopRated,
  discoverMoviesByProvider,
  discoverTVByProvider,
} from '@/lib/tmdb'
import MediaCarousel from '@/components/media/MediaCarousel'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import Link from 'next/link'
import { TMDB_GENRES } from '@/types/tmdb'

interface Props {
  searchParams: Promise<{ platform?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const hasApiKey =
    process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'REPLACE_ME'

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: '#555' }}>
        <p style={{ fontSize: '14px' }}>Configurez votre clé TMDB dans .env.local pour démarrer.</p>
      </div>
    )
  }

  const params = await searchParams
  const platformKey = (params.platform ?? '') as PlatformKey | ''
  const platformData = platformKey && platformKey in PLATFORMS ? PLATFORMS[platformKey as PlatformKey] : null

  if (platformData) {
    const [movies, shows] = await Promise.all([
      discoverMoviesByProvider(platformData.tmdbId),
      discoverTVByProvider(platformData.tmdbId),
    ])

    return (
      <div className="space-y-10">
        <MediaCarousel
          title={`FILMS ${platformData.label}`}
          items={movies.results}
          type="movie"
          viewAllHref={`/films?platform=${platformKey}`}
          platform={platformKey as PlatformKey}
        />
        <MediaCarousel
          title={`SÉRIES ${platformData.label}`}
          items={shows.results}
          type="tv"
          viewAllHref={`/series?platform=${platformKey}`}
          platform={platformKey as PlatformKey}
        />
      </div>
    )
  }

  const [trending, popularTV, nowPlaying, topRated] = await Promise.all([
    getTrending('movie', 'week'),
    getPopular('tv'),
    getNowPlaying(),
    getTopRated('movie'),
  ])

  return (
    <div className="space-y-10">
      <MediaCarousel
        title="TENDANCES"
        items={trending.results}
        type="movie"
        viewAllHref="/films"
      />
      <MediaCarousel
        title="NOUVEAUTÉS FILMS"
        items={nowPlaying.results}
        type="movie"
        viewAllHref="/films"
      />
      <MediaCarousel
        title="POPULAIRES SÉRIES"
        items={popularTV.results}
        type="tv"
        viewAllHref="/series"
      />
      <MediaCarousel
        title="MIEUX NOTÉS"
        items={topRated.results}
        type="movie"
        viewAllHref="/films"
      />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '16px', backgroundColor: '#d4af37' }} />
          <h2
            style={{
              color: '#cccccc',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            PARCOURIR PAR GENRE
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TMDB_GENRES.map((g) => (
            <Link
              key={g.id}
              href={`/genre/${g.id}-${g.name.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '4px 12px',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '2px',
                fontSize: '10px',
                color: '#666',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'transparent',
                transition: 'color 150ms, border-color 150ms',
                display: 'inline-block',
              }}
            >
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
