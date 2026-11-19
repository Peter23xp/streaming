'use client'
import { useState } from 'react'
import { Play } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import type { TMDBVideo } from '@/types/tmdb'

// The YouTube iframe (~1 MB of JS) only loads after a click; until then it's a single thumbnail.
export default function Trailer({ video }: { video: TMDBVideo }) {
  const [playing, setPlaying] = useState(false)
  const lang = video.iso_639_1 === 'fr' ? 'VF' : 'VO'

  return (
    <section className="space-y-4">
      <SectionTitle title="Bande-annonce" />
      <div className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black ring-1 ring-line">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1&hl=fr`}
            title={video.name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Lire la bande-annonce : ${video.name}`}
            className="group absolute inset-0 h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail, not a TMDB image */}
            <img
              src={`https://i.ytimg.com/vi/${video.key}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-black/30" />
            <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-gold text-black shadow-[0_0_40px_rgba(212,175,55,0.5)] transition group-hover:scale-110">
              <Play size={26} fill="currentColor" className="ml-1" />
            </span>
            <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-left sm:p-5">
              <span className="rounded-md bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-gold">{lang}</span>
              <span className="truncate text-sm font-medium text-white">{video.name}</span>
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
