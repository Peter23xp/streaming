import { discoverTV, discoverTVByProvider } from '@/lib/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

export const metadata: Metadata = {
  title: 'Séries en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de séries en VF et VOSTFR.',
}

interface Props {
  searchParams: Promise<{ genre?: string; year?: string; page?: string; platform?: string }>
}

export default async function SeriesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const platformKey = (params.platform ?? '') as PlatformKey | ''
  const platformData = platformKey && platformKey in PLATFORMS ? PLATFORMS[platformKey as PlatformKey] : null

  const data = platformData
    ? await discoverTVByProvider(platformData.tmdbId, page)
    : await discoverTV({
        page,
        with_genres: params.genre ? parseInt(params.genre) : undefined,
        year: params.year,
      })

  const totalPages = Math.min(data.total_pages, 500)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '20px', backgroundColor: '#d4af37' }} />
          <h1
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#cccccc',
            }}
          >
            {platformData ? `SÉRIES ${platformData.label}` : 'SÉRIES'}
          </h1>
        </div>
        {!platformData && (
          <Suspense>
            <FiltersBar />
          </Suspense>
        )}
      </div>
      <MediaGrid items={data.results} type="tv" platform={platformKey ? platformKey as PlatformKey : undefined} />
      <div className="flex items-center justify-center gap-3 py-4">
        {page > 1 && (
          <Link
            href={`/series?${buildQuery(params, page - 1)}`}
            style={{
              backgroundColor: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '2px',
              color: '#666',
              letterSpacing: '0.05em',
              fontSize: '11px',
              padding: '6px 14px',
            }}
          >
            ← PRÉCÉDENT
          </Link>
        )}
        <span style={{ color: '#444', fontSize: '11px', letterSpacing: '0.05em' }}>
          {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link
            href={`/series?${buildQuery(params, page + 1)}`}
            style={{
              backgroundColor: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '2px',
              color: '#666',
              letterSpacing: '0.05em',
              fontSize: '11px',
              padding: '6px 14px',
            }}
          >
            SUIVANT →
          </Link>
        )}
      </div>
    </div>
  )
}

function buildQuery(params: Record<string, string | undefined>, page: number) {
  const sp = new URLSearchParams()
  if (params.genre) sp.set('genre', params.genre)
  if (params.year) sp.set('year', params.year)
  if (params.platform) sp.set('platform', params.platform)
  sp.set('page', String(page))
  return sp.toString()
}
