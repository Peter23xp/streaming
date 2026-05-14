import { MetadataRoute } from 'next'
import { getPopular } from '@/lib/tmdb'
import { slugify } from '@/lib/utils'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? 'https://streamvf.vercel.app'

  const [movies, shows] = await Promise.all([
    getPopular('movie', 1),
    getPopular('tv', 1),
  ])

  const movieUrls = movies.results.map((m) => ({
    url: `${base}/films/${m.id}/${slugify((m as unknown as TMDBMovie).title ?? '')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const tvUrls = shows.results.map((s) => ({
    url: `${base}/series/${s.id}/${slugify((s as unknown as TMDBTVShow).name ?? '')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/films`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...movieUrls,
    ...tvUrls,
  ]
}
