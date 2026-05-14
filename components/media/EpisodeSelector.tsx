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
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div style={{ width: '2px', height: '14px', backgroundColor: '#d4af37' }} />
        <h2
          style={{
            color: '#cccccc',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          ÉPISODES
        </h2>
      </div>

      {/* Season picker */}
      <div className="flex items-center gap-3">
        <span style={{ color: '#555', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Saison
        </span>
        <select
          value={season}
          onChange={(e) => handleSeasonChange(parseInt(e.target.value))}
          style={{
            backgroundColor: '#0f0f0f',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '2px',
            color: '#cccccc',
            fontSize: '11px',
            letterSpacing: '0.05em',
            padding: '5px 10px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {seasons
            .filter((s) => s.season_number > 0)
            .map((s) => (
              <option key={s.id} value={s.season_number}>
                Saison {s.season_number} — {s.episode_count} épisodes
              </option>
            ))}
        </select>
      </div>

      {/* Episode list */}
      <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
        {episodes.map((ep) => {
          const isActive = ep.episode_number === currentEpisode
          return (
            <button
              key={ep.id}
              onClick={() => handleEpisodeClick(ep.episode_number)}
              className="w-full text-left flex items-center gap-4 transition"
              style={{
                padding: '10px 14px',
                borderRadius: '2px',
                border: isActive
                  ? '1px solid rgba(212,175,55,0.4)'
                  : '1px solid transparent',
                backgroundColor: isActive ? 'rgba(212,175,55,0.06)' : 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {/* Active indicator */}
              <div
                style={{
                  width: '3px',
                  height: '32px',
                  flexShrink: 0,
                  borderRadius: '1px',
                  backgroundColor: isActive ? '#d4af37' : 'transparent',
                  transition: 'background-color 150ms',
                }}
              />

              {/* Episode number */}
              <span
                style={{
                  color: isActive ? '#d4af37' : '#444',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                  width: '48px',
                }}
              >
                E{String(ep.episode_number).padStart(2, '0')}
              </span>

              {/* Episode title */}
              <span
                style={{
                  color: isActive ? '#cccccc' : '#666',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  flex: 1,
                  textAlign: 'left',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {ep.name}
              </span>

              {/* Year */}
              <span style={{ color: '#333', fontSize: '10px', letterSpacing: '0.05em', flexShrink: 0 }}>
                {ep.air_date?.slice(0, 4)}
              </span>

              {/* Play icon if active */}
              {isActive && (
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '1.5px solid #d4af37',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderLeft: '6px solid #d4af37',
                      marginLeft: '1px',
                    }}
                  />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
