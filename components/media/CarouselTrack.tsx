'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarouselTrack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: 1 | -1) => {
    const el = ref.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const arrow =
    'absolute top-[38%] z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-black/80 text-ink opacity-0 backdrop-blur transition hover:border-gold hover:text-gold group-hover/track:opacity-100 md:flex'

  return (
    <div className="group/track relative">
      <button aria-label="Précédent" onClick={() => scroll(-1)} className={`${arrow} -left-4`}>
        <ChevronLeft size={20} />
      </button>
      <div
        ref={ref}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {children}
      </div>
      <button aria-label="Suivant" onClick={() => scroll(1)} className={`${arrow} -right-4`}>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
