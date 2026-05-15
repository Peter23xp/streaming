import { MetadataRoute } from 'next'
import { getPopular } from '@/lib/tmdb'
import { slugify } from '@/lib/utils'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import { TMDB_GENRES } from '@/types/tmdb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://streaming.peterakilimali.site'

  const genreRoutes: MetadataRoute.Sitemap = TMDB_GENRES.map((g) => ({
    url: `${base}/genre/${g.id}-${g.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/films`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...genreRoutes,
  ]

  if (!process.env.TMDB_API_KEY || process.env.TMDB_API_KEY === 'REPLACE_ME') {
    return staticRoutes
  }

  try {
    const [movies1, movies2, shows1, shows2] = await Promise.all([
      getPopular('movie', 1),
      getPopular('movie', 2),
      getPopular('tv', 1),
      getPopular('tv', 2),
    ])

    const allMovies = [...(movies1.results ?? []), ...(movies2.results ?? [])]
    const allShows = [...(shows1.results ?? []), ...(shows2.results ?? [])]

    const movieUrls = allMovies.map((m) => ({
      url: `${base}/films/${m.id}/${slugify((m as unknown as TMDBMovie).title ?? '')}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    const tvUrls = allShows.map((s) => ({
      url: `${base}/series/${s.id}/${slugify((s as unknown as TMDBTVShow).name ?? '')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...movieUrls, ...tvUrls]
  } catch {
    return staticRoutes
  }
}
