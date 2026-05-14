import { discoverTV } from '@/lib/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Séries en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de séries en VF et VOSTFR.',
}

interface Props {
  searchParams: Promise<{ genre?: string; year?: string; page?: string }>
}

export default async function SeriesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const data = await discoverTV({
    page,
    with_genres: params.genre ? parseInt(params.genre) : undefined,
    year: params.year,
  })
  const totalPages = Math.min(data.total_pages, 500)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Séries</h1>
        <Suspense>
          <FiltersBar />
        </Suspense>
      </div>
      <MediaGrid items={data.results} type="tv" />
      <div className="flex items-center justify-center gap-2 py-4">
        {page > 1 && (
          <Link
            href={`/series?${buildQuery(params, page - 1)}`}
            className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition text-sm"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            ← Précédent
          </Link>
        )}
        <span className="text-zinc-400 text-sm">
          Page {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link
            href={`/series?${buildQuery(params, page + 1)}`}
            className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition text-sm"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            Suivant →
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
  sp.set('page', String(page))
  return sp.toString()
}
