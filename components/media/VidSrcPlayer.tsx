'use client'
import { useState } from 'react'
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

export default function VidSrcPlayer({
  type,
  tmdbId,
  season = 1,
  episode = 1,
  backdrop,
  title,
}: Props) {
  const [active, setActive] = useState(false)
  const [lang, setLang] = useState<Lang>('vf')
  const [serverIndex, setServerIndex] = useState(0)

  const servers = lang === 'vf' ? VF_SERVERS : VOSTFR_SERVERS

  const src =
    type === 'movie'
      ? servers[serverIndex].getMovieUrl(tmdbId)
      : servers[serverIndex].getTVUrl(tmdbId, season, episode)

  const switchLang = (l: Lang) => {
    setLang(l)
    setServerIndex(0)
    setActive(false) // reset player so new lang loads on click
  }

  const switchServer = (i: number) => {
    setServerIndex(i)
    setActive(true)
  }

  return (
    <div className="w-full">
      {/* ── Lang toggle bar ── */}
      <div
        style={{
          backgroundColor: '#080808',
          borderBottom: '1px solid rgba(212,175,55,0.1)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            color: '#444',
            fontSize: '9px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginRight: '6px',
            flexShrink: 0,
          }}
        >
          LANGUE
        </span>

        {(['vf', 'vostfr'] as Lang[]).map((l) => {
          const isActive = lang === l
          return (
            <button
              key={l}
              onClick={() => switchLang(l)}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '5px 16px',
                borderRadius: '2px',
                border: isActive ? 'none' : '1px solid rgba(212,175,55,0.2)',
                backgroundColor: isActive ? '#d4af37' : 'transparent',
                color: isActive ? '#000' : '#555',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#d4af37'
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#555'
                  e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
                }
              }}
            >
              {l === 'vf' ? 'VF' : 'VOSTFR'}
            </button>
          )
        })}

        {lang === 'vf' && (
          <span
            style={{
              color: '#d4af37',
              fontSize: '9px',
              letterSpacing: '0.08em',
              marginLeft: '4px',
              opacity: 0.7,
            }}
          >
            Doublé en français
          </span>
        )}
        {lang === 'vostfr' && (
          <span
            style={{
              color: '#555',
              fontSize: '9px',
              letterSpacing: '0.08em',
              marginLeft: '4px',
            }}
          >
            Version originale sous-titrée
          </span>
        )}
      </div>

      {/* ── Player 16:9 ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '16/9', backgroundColor: '#000' }}
      >
        {active ? (
          <>
            <iframe
              key={`${lang}-${serverIndex}-${season}-${episode}`}
              src={src}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="origin"
            />
            <button
              onClick={() => setActive(false)}
              className="absolute top-3 right-3 z-10 flex items-center justify-center transition"
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '2px',
                color: '#d4af37',
                fontSize: '14px',
                lineHeight: 1,
                cursor: 'pointer',
              }}
              title="Fermer"
            >
              ✕
            </button>
          </>
        ) : (
          <button
            onClick={() => setActive(true)}
            className="absolute inset-0 w-full h-full group"
            style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {backdrop && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={backdrop}
                alt={title ?? ''}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)',
              }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(0,0,0,0.15)' }}
            />

            {/* Lang badge on thumbnail */}
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '14px',
                backgroundColor: lang === 'vf' ? '#d4af37' : 'rgba(0,0,0,0.75)',
                border: lang === 'vf' ? 'none' : '1px solid rgba(212,175,55,0.3)',
                color: lang === 'vf' ? '#000' : '#d4af37',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.12em',
                padding: '4px 10px',
                borderRadius: '2px',
              }}
            >
              {lang === 'vf' ? 'VF' : 'VOSTFR'}
            </div>

            {/* Play button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div
                className="flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{
                  width: '72px',
                  height: '72px',
                  backgroundColor: 'rgba(212,175,55,0.95)',
                  borderRadius: '50%',
                  boxShadow: '0 0 40px rgba(212,175,55,0.4)',
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: '14px solid transparent',
                    borderBottom: '14px solid transparent',
                    borderLeft: '22px solid #000',
                    marginLeft: '4px',
                  }}
                />
              </div>
              <span
                style={{
                  color: '#d4af37',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                }}
              >
                REGARDER EN {lang === 'vf' ? 'VF' : 'VOSTFR'}
              </span>
            </div>

            {title && (
              <div
                className="absolute bottom-0 left-0 right-0 px-6 pb-5"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}
              >
                <p
                  style={{
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 6px rgba(0,0,0,0.9)',
                  }}
                >
                  {title}
                </p>
              </div>
            )}
          </button>
        )}
      </div>

      {/* ── Server tabs ── */}
      <div
        style={{
          backgroundColor: '#080808',
          borderBottom: '1px solid rgba(212,175,55,0.06)',
          padding: '7px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            color: '#333',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginRight: '4px',
            flexShrink: 0,
          }}
        >
          SOURCE
        </span>
        {servers.map((s, i) => {
          const isActive = serverIndex === i && active
          return (
            <button
              key={i}
              onClick={() => switchServer(i)}
              style={{
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.06em',
                padding: '3px 10px',
                borderRadius: '2px',
                border: isActive ? 'none' : '1px solid rgba(212,175,55,0.12)',
                backgroundColor: isActive ? '#d4af37' : 'transparent',
                color: isActive ? '#000' : '#444',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#888'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#444'
              }}
            >
              {s.name}
            </button>
          )
        })}

        {active && (
          <span
            style={{
              marginLeft: 'auto',
              color: '#333',
              fontSize: '9px',
              letterSpacing: '0.08em',
            }}
          >
            Si la source ne fonctionne pas, essaie la suivante →
          </span>
        )}
      </div>
    </div>
  )
}
