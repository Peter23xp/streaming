import { discoverTV, discoverTVByProvider } from '@/lib/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import SectionTitle from '@/components/ui/SectionTitle'
import Pagination from '@/components/ui/Pagination'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import { listHref } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Séries en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de séries en VF et VOSTFR.',
}

interface Props {
  searchParams: Promise<{ genre?: string; year?: string; page?: string; platform?: string }>
}

export default async function SeriesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1') || 1
  const platformKey = params.platform && params.platform in PLATFORMS ? (params.platform as PlatformKey) : undefined
  const platform = platformKey ? PLATFORMS[platformKey] : null

  const data = platform
    ? await discoverTVByProvider(platform.tmdbId, page)
    : await discoverTV({
        page,
        with_genres: params.genre ? parseInt(params.genre) : undefined,
        year: params.year,
      })

  return (
    <div className="space-y-8">
      <SectionTitle as="h1" title={platform ? `Séries ${platform.label}` : 'Séries'}>
        {!platform && (
          <Suspense>
            <FiltersBar />
          </Suspense>
        )}
      </SectionTitle>
      <MediaGrid items={data.results} type="tv" platform={platformKey} />
      <Pagination
        page={page}
        totalPages={Math.min(data.total_pages ?? 1, 500)}
        hrefFor={(p) => listHref('/series', params, p)}
      />
    </div>
  )
}
