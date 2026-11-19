import {
  getTrending,
  getPopular,
  getNowPlaying,
  getTopRated,
  discover,
} from '@/lib/tmdb'
import MediaCarousel from '@/components/media/MediaCarousel'
import HeroBanner from '@/components/media/HeroBanner'
import SectionTitle from '@/components/ui/SectionTitle'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import { genreHref } from '@/lib/utils'
import Link from 'next/link'
import { TMDB_GENRES } from '@/types/tmdb'

interface Props {
  searchParams: Promise<{ platform?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const hasApiKey = process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'REPLACE_ME'
  if (!hasApiKey) {
    return (
      <p className="py-24 text-center text-sm text-muted">
        Configurez votre clé TMDB dans .env.local pour démarrer.
      </p>
    )
  }

  const params = await searchParams
  const platformKey = params.platform && params.platform in PLATFORMS ? (params.platform as PlatformKey) : null

  if (platformKey) {
    const platform = PLATFORMS[platformKey]
    const [movies, shows] = await Promise.all([
      discover('movie', { provider: platform.tmdbId }),
      discover('tv', { provider: platform.tmdbId }),
    ])
    return (
      <div className="space-y-12">
        <MediaCarousel
          title={`Films ${platform.label}`}
          items={movies.results}
          type="movie"
          viewAllHref={`/films?platform=${platformKey}`}
          platform={platformKey}
        />
        <MediaCarousel
          title={`Séries ${platform.label}`}
          items={shows.results}
          type="tv"
          viewAllHref={`/series?platform=${platformKey}`}
          platform={platformKey}
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

  const hero = trending.results?.find((m) => m.backdrop_path && m.overview)

  return (
    <div className="space-y-12">
      {hero && <HeroBanner movie={hero} />}
      <MediaCarousel title="Tendances de la semaine" items={trending.results} type="movie" viewAllHref="/films" />
      <MediaCarousel title="Nouveautés au cinéma" items={nowPlaying.results} type="movie" viewAllHref="/films" />
      <MediaCarousel title="Séries populaires" items={popularTV.results} type="tv" viewAllHref="/series" />
      <MediaCarousel title="Les mieux notés" items={topRated.results} type="movie" viewAllHref="/films" />

      <section className="space-y-4">
        <SectionTitle title="Parcourir par genre" />
        <div className="flex flex-wrap gap-2">
          {TMDB_GENRES.map((g) => (
            <Link key={g.id} href={genreHref(g)} className="chip">
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
