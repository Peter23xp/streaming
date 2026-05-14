'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TMDBSeason, TMDBEpisode } from '@/types/tmdb'

interface Props {
  seasons: TMDBSeason[]
  currentSeason: number
  currentEpisode: number
  episodes: TMDBEpisode[]
  basePath: string
}

const selectStyle = {
  backgroundColor: '#1a1a1a',
  borderColor: '#3f3f46',
  color: '#ffffff',
} as React.CSSProperties

export default function EpisodeSelector({
  seasons,
  currentSeason,
  currentEpisode,
  episodes,
  basePath,
}: Props) {
  const router = useRouter()
  const [season, setSeason] = useState(currentSeason)

  const handleSeasonChange = (s: number) => {
    setSeason(s)
    router.push(`${basePath}?season=${s}&episode=1`)
  }

  const handleEpisodeClick = (e: number) => {
    router.push(`${basePath}?season=${season}&episode=${e}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm text-zinc-400">Saison :</label>
        <select
          value={season}
          onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
          className="border rounded-lg px-3 py-1.5 text-sm"
          style={selectStyle}
        >
          {seasons
            .filter((s) => s.season_number > 0)
            .map((s) => (
              <option key={s.id} value={s.season_number}>
                Saison {s.season_number} ({s.episode_count} épisodes)
              </option>
            ))}
        </select>
      </div>
      <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => handleEpisodeClick(ep.episode_number)}
            className="w-full text-left px-4 py-3 rounded-lg text-sm transition flex items-center justify-between"
            style={
              ep.episode_number === currentEpisode
                ? { backgroundColor: '#e50914', color: '#fff' }
                : { backgroundColor: '#1a1a1a', color: '#d4d4d8' }
            }
          >
            <span>
              S{String(season).padStart(2, '0')}E{String(ep.episode_number).padStart(2, '0')} ·{' '}
              {ep.name}
            </span>
            <span className="text-xs opacity-60">{ep.air_date?.slice(0, 4)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
