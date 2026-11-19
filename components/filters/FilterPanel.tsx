'use client'
import { useState } from 'react'
import { SlidersHorizontal, ChevronDown } from 'lucide-react'

interface Props {
  activeCount: number
  toolbar: React.ReactNode
  children: React.ReactNode
}

// Client only for the open/closed state; the filter links themselves are server-rendered.
// State survives filter navigations because this component stays mounted across them.
export default function FilterPanel({ activeCount, toolbar, children }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
            open || activeCount > 0
              ? 'bg-gold text-black hover:bg-gold-light'
              : 'border border-white/15 bg-white/[0.06] text-ink hover:border-gold/50'
          }`}
        >
          <SlidersHorizontal size={16} />
          Filtres
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-black text-[11px] text-gold">
              {activeCount}
            </span>
          )}
          <ChevronDown size={15} className={`transition ${open ? 'rotate-180' : ''}`} />
        </button>
        {toolbar}
      </div>
      {open && (
        <div className="space-y-5 rounded-2xl border border-line bg-surface/80 p-4 sm:p-5">{children}</div>
      )}
    </div>
  )
}
