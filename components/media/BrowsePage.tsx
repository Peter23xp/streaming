import { discover } from '@/lib/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import SectionTitle from '@/components/ui/SectionTitle'
import Pagination from '@/components/ui/Pagination'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import { COUNTRIES } from '@/lib/countries'
import { listHref, parseSort, SORT_OPTIONS, type ListParams } from '@/lib/utils'
import { TMDB_GENRES, TMDB_TV_GENRES } from '@/types/tmdb'

interface Props {
  type: 'movie' | 'tv'
  searchParams: Record<string, string | undefined>
}

export default async function BrowsePage({ type, searchParams }: Props) {
  const basePath = type === 'movie' ? '/films' : '/series'
  const noun = type === 'movie' ? 'Films' : 'Séries'
  const genres = type === 'movie' ? TMDB_GENRES : TMDB_TV_GENRES

  const platformKey =
    searchParams.platform && searchParams.platform in PLATFORMS ? (searchParams.platform as PlatformKey) : undefined
  const genre = genres.find((g) => String(g.id) === searchParams.genre)
  const country = COUNTRIES.find((c) => c.code === searchParams.country)
  const params: ListParams = {
    platform: platformKey,
    genre: genre ? String(genre.id) : undefined,
    country: country?.code,
    year: searchParams.year && /^\d{4}$/.test(searchParams.year) ? searchParams.year : undefined,
    sort: parseSort(searchParams.sort),
  }
  const page = Math.max(1, parseInt(searchParams.page ?? '1') || 1)

  const data = await discover(type, {
    page,
    genre: genre?.id,
    country: country?.code,
    year: params.year,
    provider: platformKey ? PLATFORMS[platformKey].tmdbId : undefined,
    sort: params.sort,
  })

  const title = [noun, genre?.name, country?.name, platformKey && PLATFORMS[platformKey].label]
    .filter(Boolean)
    .join(' · ')
  const sortLabel = SORT_OPTIONS.find((s) => s.key === params.sort)?.label

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <SectionTitle as="h1" title={title} />
        <p className="pl-3.5 text-sm text-faint">
          {sortLabel}
          {params.year ? ` · ${params.year}` : ''}
          {data.total_results ? ` · ${data.total_results.toLocaleString('fr-FR')} titres` : ''}
        </p>
      </div>
      <FiltersBar basePath={basePath} params={params} type={type} />
      <MediaGrid items={data.results ?? []} type={type} platform={platformKey} />
      <Pagination
        page={page}
        totalPages={Math.min(data.total_pages ?? 1, 500)}
        hrefFor={(p) => listHref(basePath, params, p)}
      />
    </div>
  )
}
