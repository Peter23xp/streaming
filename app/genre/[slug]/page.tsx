import { discover } from '@/lib/tmdb'
import { TMDB_GENRES } from '@/types/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import SectionTitle from '@/components/ui/SectionTitle'
import Pagination from '@/components/ui/Pagination'
import { listHref, parseSort, type ListParams } from '@/lib/utils'
import { COUNTRIES } from '@/lib/countries'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; sort?: string; year?: string; country?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const genre = TMDB_GENRES.find((g) => g.id === parseInt(slug.split('-')[0]))
  if (!genre) return {}
  return { title: `Films ${genre.name} en streaming` }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const genre = TMDB_GENRES.find((g) => g.id === parseInt(slug.split('-')[0]))
  if (!genre) notFound()

  const basePath = `/genre/${slug}`
  const page = Math.max(1, parseInt(sp.page ?? '1') || 1)
  const listParams: ListParams = {
    sort: parseSort(sp.sort),
    year: sp.year && /^\d{4}$/.test(sp.year) ? sp.year : undefined,
    country: COUNTRIES.find((c) => c.code === sp.country)?.code,
  }
  const data = await discover('movie', {
    page,
    genre: genre.id,
    sort: listParams.sort,
    year: listParams.year,
    country: listParams.country,
  })

  return (
    <div className="space-y-6">
      <SectionTitle as="h1" title={`Films ${genre.name}`} />
      <FiltersBar basePath={basePath} params={listParams} type="movie" showGenres={false} />
      <MediaGrid items={data.results ?? []} type="movie" />
      <Pagination
        page={page}
        totalPages={Math.min(data.total_pages ?? 1, 500)}
        hrefFor={(p) => listHref(basePath, listParams, p)}
      />
    </div>
  )
}
