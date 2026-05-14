import { getTrending, getPopular, getNowPlaying } from '@/lib/tmdb'
import HeroBanner from '@/components/media/HeroBanner'
import MediaCarousel from '@/components/media/MediaCarousel'
import { TMDB_GENRES } from '@/types/tmdb'
import Link from 'next/link'
import type { TMDBMovie } from '@/types/tmdb'

export default async function HomePage() {
  const hasApiKey =
    process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'REPLACE_ME'

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
        <p className="text-lg">Configurez votre clé TMDB dans .env.local pour démarrer.</p>
        <a
          href="https://www.themoviedb.org/settings/api"
          className="text-sm hover:underline"
          style={{ color: '#e50914' }}
        >
          Obtenir une clé gratuite →
        </a>
      </div>
    )
  }

  const [trending, popularTV, nowPlaying] = await Promise.all([
    getTrending('movie', 'week'),
    getPopular('tv'),
    getNowPlaying(),
  ])

  const hero = trending.results[0] as TMDBMovie

  return (
    <div className="space-y-10">
      {hero && <HeroBanner movie={hero} />}

      <MediaCarousel
        title="🔥 Films du moment"
        items={trending.results.slice(1)}
        type="movie"
        viewAllHref="/films"
      />

      <MediaCarousel
        title="📺 Séries du moment"
        items={popularTV.results}
        type="tv"
        viewAllHref="/series"
      />

      <MediaCarousel
        title="🆕 Dernières sorties"
        items={nowPlaying.results}
        type="movie"
        viewAllHref="/films"
      />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">🎭 Parcourir par genre</h2>
        <div className="flex flex-wrap gap-2">
          {TMDB_GENRES.map((g) => (
            <Link
              key={g.id}
              href={`/genre/${g.id}-${g.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 border border-zinc-700 rounded-full text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
