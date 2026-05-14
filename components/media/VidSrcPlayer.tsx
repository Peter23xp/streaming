'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'
import { VIDSRC_SERVERS } from '@/lib/vidsrc'
import { cn } from '@/lib/utils'

interface Props {
  type: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
}

export default function VidSrcPlayer({ type, tmdbId, season = 1, episode = 1 }: Props) {
  const [active, setActive] = useState(false)
  const [serverIndex, setServerIndex] = useState(0)

  const src =
    type === 'movie'
      ? VIDSRC_SERVERS[serverIndex].getMovieUrl(tmdbId)
      : VIDSRC_SERVERS[serverIndex].getTVUrl(tmdbId, season, episode)

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        {VIDSRC_SERVERS.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setServerIndex(i)
              setActive(true)
            }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition',
              serverIndex === i && active ? 'text-white' : 'text-zinc-300 hover:bg-zinc-700'
            )}
            style={
              serverIndex === i && active
                ? { backgroundColor: '#e50914' }
                : { backgroundColor: '#1a1a1a' }
            }
          >
            {s.name}
          </button>
        ))}
      </div>
      <div
        className="w-full rounded-xl overflow-hidden relative"
        style={{ backgroundColor: '#111', aspectRatio: '16/9' }}
      >
        {active ? (
          <iframe
            key={`${serverIndex}-${season}-${episode}`}
            src={src}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen"
            referrerPolicy="origin"
          />
        ) : (
          <button
            onClick={() => setActive(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 w-full h-full hover:bg-zinc-800/50 transition"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#e50914' }}
            >
              <Play size={28} fill="white" className="translate-x-0.5" />
            </div>
            <span className="text-zinc-300 text-sm">Cliquer pour lancer</span>
          </button>
        )}
      </div>
    </div>
  )
}
