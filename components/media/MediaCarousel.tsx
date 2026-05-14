'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import type { PlatformKey } from '@/lib/platforms'

interface Props {
  title: string
  items: ((TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' })[]
  type: 'movie' | 'tv'
  viewAllHref?: string
  platform?: PlatformKey
}

export default function MediaCarousel({ title, items, type, viewAllHref, platform }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '16px', backgroundColor: '#d4af37', flexShrink: 0 }} />
          <h2
            style={{
              color: '#cccccc',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <a
              href={viewAllHref}
              style={{
                fontSize: '10px',
                color: '#555555',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
            >
              Voir tout
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-1 transition"
            style={{
              color: '#444',
              backgroundColor: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.1)',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 transition"
            style={{
              color: '#444',
              backgroundColor: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.1)',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-none w-32 sm:w-40">
            <MediaCard item={item} type={type} platform={platform} />
          </div>
        ))}
      </div>
    </section>
  )
}
