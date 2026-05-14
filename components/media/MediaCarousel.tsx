'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'

interface Props {
  title: string
  items: ((TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' })[]
  type: 'movie' | 'tv'
  viewAllHref?: string
}

export default function MediaCarousel({ title, items, type, viewAllHref }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <a href={viewAllHref} className="text-sm text-zinc-400 hover:text-white transition">
              Voir tout
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-full hover:bg-zinc-700 transition"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-full hover:bg-zinc-700 transition"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-none w-36 sm:w-44">
            <MediaCard item={item} type={type} />
          </div>
        ))}
      </div>
    </section>
  )
}
