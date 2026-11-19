'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Play, X } from 'lucide-react'
import { VF_SERVERS, VOSTFR_SERVERS } from '@/lib/vidsrc'

interface Props {
  type: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
  backdrop?: string | null
  title?: string
}

type Lang = 'vf' | 'vostfr'

const LANGS: { key: Lang; label: string; hint: string }[] = [
  { key: 'vf', label: 'VF', hint: 'Doublé en français' },
  { key: 'vostfr', label: 'VOSTFR', hint: 'Version originale sous-titrée' },
]

export default function VidSrcPlayer({ type, tmdbId, season = 1, episode = 1, backdrop, title }: Props) {
  const [active, setActive] = useState(false)
  const [lang, setLang] = useState<Lang>('vf')
  const [serverIndex, setServerIndex] = useState(0)

  const servers = lang === 'vf' ? VF_SERVERS : VOSTFR_SERVERS
  const server = servers[serverIndex]
  const src = type === 'movie' ? server.getMovieUrl(tmdbId) : server.getTVUrl(tmdbId, season, episode)
  const langLabel = lang === 'vf' ? 'VF' : 'VOSTFR'

  const switchLang = (l: Lang) => {
    setLang(l)
    setServerIndex(0)
    setActive(false)
  }

  return (
    <div className="w-full bg-black">
      <div className="relative aspect-video w-full overflow-hidden">
        {active ? (
          <>
            <iframe
              key={`${lang}-${serverIndex}-${season}-${episode}`}
              src={src}
              title={title ?? 'Lecteur vidéo'}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="origin"
              // Omitting allow-popups / allow-top-navigation blocks ad popups and page redirects
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            />
            <button
              onClick={() => setActive(false)}
              aria-label="Fermer le lecteur"
              className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/70 text-ink backdrop-blur transition hover:text-gold"
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setActive(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Regarder en ${langLabel}`}
          >
            {backdrop && (
              <Image
                src={backdrop}
                alt=""
                fill
                sizes="100vw"
                loading="eager"
                fetchPriority="high"
                className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-black/20" />

            <span className="absolute inset-0 m-auto flex size-20 items-center justify-center rounded-full bg-gold text-black shadow-[0_0_50px_rgba(212,175,55,0.45)] transition duration-300 group-hover:scale-110">
              <Play size={30} fill="currentColor" className="ml-1" />
            </span>

            <span className="absolute inset-x-0 bottom-0 p-5 text-left sm:p-8">
              <span className="mb-2 inline-block rounded-md bg-gold px-2 py-0.5 text-[11px] font-bold text-black">
                {langLabel}
              </span>
              {title && (
                <span className="block text-lg font-semibold text-white drop-shadow sm:text-2xl">{title}</span>
              )}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line bg-surface px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">Langue</span>
          {LANGS.map((l) => (
            <button
              key={l.key}
              onClick={() => switchLang(l.key)}
              title={l.hint}
              className={lang === l.key ? 'chip chip-active' : 'chip'}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">Source</span>
          {servers.map((s, i) => (
            <button
              key={s.name}
              onClick={() => {
                setServerIndex(i)
                setActive(true)
              }}
              className={serverIndex === i && active ? 'chip chip-active' : 'chip'}
            >
              {s.name}
            </button>
          ))}
        </div>

        {active && (
          <p className="text-xs text-faint sm:ml-auto">Si la vidéo ne charge pas, essaie une autre source.</p>
        )}
      </div>
    </div>
  )
}
