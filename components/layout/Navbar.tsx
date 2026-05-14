'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bookmark, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useWatchlistStore } from '@/store/watchlistStore'

const NAV_LINKS = [
  { href: '/films', label: 'Films' },
  { href: '/series', label: 'Séries' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const watchlistCount = useWatchlistStore((s) => s.items.length)

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur border-b border-zinc-800"
      style={{ backgroundColor: 'rgba(15,15,15,0.9)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold flex-shrink-0" style={{ color: '#e50914' }}>
          🎬 StreamVF
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname.startsWith(l.href) ? 'text-white' : 'text-zinc-400 hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Link href="/recherche" className="p-2 rounded-full hover:bg-zinc-800 transition">
            <Search size={20} />
          </Link>
          <Link href="/watchlist" className="relative p-2 rounded-full hover:bg-zinc-800 transition">
            <Bookmark size={20} />
            {watchlistCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#e50914', fontSize: '10px' }}
              >
                {watchlistCount > 9 ? '9+' : watchlistCount}
              </span>
            )}
          </Link>
          <Link href="/auth/signin" className="p-2 rounded-full hover:bg-zinc-800 transition">
            <User size={20} />
          </Link>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          className="md:hidden border-t border-zinc-800 px-4 py-3 space-y-1"
          style={{ backgroundColor: '#0f0f0f' }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2 text-sm font-medium text-zinc-300 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
