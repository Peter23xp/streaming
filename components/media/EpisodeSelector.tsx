'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import type { TMDBSeason, TMDBEpisode } from '@/types/tmdb'

interface Props {
  seasons: TMDBSeason[]
  currentSeason: number
  currentEpisode: number
  episodes: TMDBEpisode[]
  basePath: string
}

export default function EpisodeSelector({ seasons, currentSeason, currentEpisode, episodes, basePath }: Props) {
  const router = useRouter()

  return (
    <section className="space-y-4">
      <SectionTitle title="Épisodes">
        <select
          aria-label="Saison"
          value={currentSeason}
          onChange={(e) => router.push(`${basePath}?season=${e.target.value}&episode=1`)}
          className="field cursor-pointer"
        >
          {seasons
            .filter((s) => s.season_number > 0)
            .map((s) => (
              <option key={s.id} value={s.season_number}>
                Saison {s.season_number} · {s.episode_count} épisodes
              </option>
            ))}
        </select>
      </SectionTitle>

      <div className="max-h-[28rem] space-y-1 overflow-y-auto rounded-xl border border-line bg-surface/50 p-1.5">
        {episodes.map((ep) => {
          const isActive = ep.episode_number === currentEpisode
          return (
            <Link
              key={ep.id}
              href={`${basePath}?season=${currentSeason}&episode=${ep.episode_number}`}
              prefetch={false}
              aria-current={isActive ? 'true' : undefined}
              className={`flex items-center gap-4 rounded-lg px-3 py-2.5 transition ${
                isActive ? 'bg-gold/10 ring-1 ring-gold/40' : 'hover:bg-white/5'
              }`}
            >
              <span
                className={`w-10 shrink-0 text-xs font-bold tabular-nums ${isActive ? 'text-gold' : 'text-faint'}`}
              >
                E{String(ep.episode_number).padStart(2, '0')}
              </span>
              <span className={`min-w-0 flex-1 truncate text-sm ${isActive ? 'font-semibold text-ink' : 'text-muted'}`}>
                {ep.name}
              </span>
              <span className="shrink-0 text-xs text-faint">{ep.air_date?.slice(0, 4)}</span>
              {isActive && <Play size={14} fill="currentColor" className="shrink-0 text-gold" />}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
