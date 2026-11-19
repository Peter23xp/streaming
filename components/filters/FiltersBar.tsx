import Link from 'next/link'
import { X } from 'lucide-react'
import FilterPanel from './FilterPanel'
import YearSelect from './YearSelect'
import { TMDB_GENRES, TMDB_TV_GENRES } from '@/types/tmdb'
import { COUNTRIES } from '@/lib/countries'
import { SORT_OPTIONS, listHref, type ListParams } from '@/lib/utils'

interface Props {
  basePath: string
  params: ListParams
  type: 'movie' | 'tv'
  showGenres?: boolean
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-faint">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export default function FiltersBar({ basePath, params, type, showGenres = true }: Props) {
  const genres = type === 'movie' ? TMDB_GENRES : TMDB_TV_GENRES
  const href = (patch: Partial<ListParams>) => listHref(basePath, { ...params, ...patch })
  const activeSort = params.sort ?? 'popular'

  const genre = genres.find((g) => String(g.id) === params.genre)
  const country = COUNTRIES.find((c) => c.code === params.country)
  const active = [
    showGenres && genre && { label: genre.name, clear: href({ genre: undefined }) },
    country && { label: `${country.flag} ${country.name}`, clear: href({ country: undefined }) },
    params.year && { label: params.year, clear: href({ year: undefined }) },
  ].filter(Boolean) as { label: string; clear: string }[]

  const sortControl = (
    <div className="scrollbar-hide flex max-w-full overflow-x-auto rounded-full border border-line bg-surface p-1">
      {SORT_OPTIONS.map((s) => (
        <Link
          key={s.key}
          href={href({ sort: s.key })}
          aria-current={activeSort === s.key ? 'true' : undefined}
          className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition ${
            activeSort === s.key ? 'bg-white/10 text-ink' : 'text-muted hover:text-ink'
          }`}
        >
          {s.label}
        </Link>
      ))}
    </div>
  )

  const activeChips = active.map((a) => (
    <Link
      key={a.label}
      href={a.clear}
      aria-label={`Retirer ${a.label}`}
      className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 py-1.5 pl-3 pr-2 text-[13px] text-gold transition hover:bg-gold/20"
    >
      {a.label}
      <X size={14} />
    </Link>
  ))

  return (
    <FilterPanel
      activeCount={active.length}
      toolbar={
        <>
          {sortControl}
          {activeChips}
        </>
      }
    >
      {showGenres && (
        <Section title="Genre">
          <Link href={href({ genre: undefined })} className={!genre ? 'chip chip-active' : 'chip'}>
            Tous
          </Link>
          {genres.map((g) => (
            <Link
              key={g.id}
              href={href({ genre: String(g.id) })}
              className={genre?.id === g.id ? 'chip chip-active' : 'chip'}
            >
              {g.name}
            </Link>
          ))}
        </Section>
      )}

      <Section title="Pays d'origine">
        <Link href={href({ country: undefined })} className={!country ? 'chip chip-active' : 'chip'}>
          Tous
        </Link>
        {COUNTRIES.map((c) => (
          <Link
            key={c.code}
            href={href({ country: c.code })}
            className={country?.code === c.code ? 'chip chip-active gap-1.5' : 'chip gap-1.5'}
          >
            <span aria-hidden>{c.flag}</span>
            {c.name}
          </Link>
        ))}
      </Section>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <Section title="Année">
          <YearSelect
            value={params.year}
            basePath={basePath}
            query={listHref('', { ...params, year: undefined }).replace(/^\?/, '')}
          />
        </Section>
        {active.length > 0 && (
          <Link
            href={listHref(basePath, { platform: params.platform, sort: params.sort })}
            className="text-sm text-muted underline-offset-4 hover:text-gold hover:underline"
          >
            Réinitialiser les filtres
          </Link>
        )}
      </div>
    </FilterPanel>
  )
}
