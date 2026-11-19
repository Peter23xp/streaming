import Link from 'next/link'
import YearSelect from './YearSelect'
import { TMDB_GENRES, TMDB_TV_GENRES } from '@/types/tmdb'
import { SORT_OPTIONS, type ListParams } from '@/lib/utils'

interface Props {
  basePath: string
  params: ListParams
  type: 'movie' | 'tv'
  showGenres?: boolean
  showYear?: boolean
}

function hrefWith(basePath: string, params: ListParams, patch: Partial<ListParams>) {
  const merged: ListParams = { ...params, ...patch }
  const sp = new URLSearchParams()
  for (const key of ['platform', 'genre', 'year', 'sort'] as const) {
    const v = merged[key]
    if (v && !(key === 'sort' && v === 'popular')) sp.set(key, v)
  }
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export default function FiltersBar({ basePath, params, type, showGenres = true, showYear = true }: Props) {
  const genres = type === 'movie' ? TMDB_GENRES : TMDB_TV_GENRES
  const activeSort = params.sort ?? 'popular'
  const queryWithoutYear = hrefWith('', params, { year: undefined }).replace(/^\?/, '')

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="scrollbar-hide flex max-w-full overflow-x-auto rounded-full border border-line bg-surface p-1">
          {SORT_OPTIONS.map((s) => (
            <Link
              key={s.key}
              href={hrefWith(basePath, params, { sort: s.key })}
              aria-current={activeSort === s.key ? 'true' : undefined}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
                activeSort === s.key ? 'bg-gold text-black' : 'text-muted hover:text-ink'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
        {showYear && <YearSelect value={params.year} basePath={basePath} query={queryWithoutYear} />}
      </div>

      {showGenres && (
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
          <Link
            href={hrefWith(basePath, params, { genre: undefined })}
            className={!params.genre ? 'chip chip-active' : 'chip'}
          >
            Tous les genres
          </Link>
          {genres.map((g) => (
            <Link
              key={g.id}
              href={hrefWith(basePath, params, { genre: String(g.id) })}
              className={params.genre === String(g.id) ? 'chip chip-active' : 'chip'}
            >
              {g.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
