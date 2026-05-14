'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bookmark, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useWatchlistStore } from '@/store/watchlistStore'

const NAV_LINKS = [
  { href: '/films', label: 'FILMS' },
  { href: '/series', label: 'SÉRIES' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const watchlistCount = useWatchlistStore((s) => s.items.length)

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          style={{
            color: '#d4af37',
            fontWeight: 800,
            fontSize: '15px',
            letterSpacing: '0.2em',
            flexShrink: 0,
          }}
        >
          STREAMVF
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: pathname.startsWith(l.href) ? '#d4af37' : '#666666',
                transition: 'color 150ms',
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/recherche"
            className="p-2 transition"
            style={{ color: '#666666' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            <Search size={18} />
          </Link>
          <Link
            href="/watchlist"
            className="relative p-2 transition"
            style={{ color: '#666666' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            <Bookmark size={18} />
            {watchlistCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 flex items-center justify-center"
                style={{
                  backgroundColor: '#d4af37',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '9px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '2px',
                }}
              >
                {watchlistCount > 9 ? '9+' : watchlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/auth/signin"
            className="p-2 transition"
            style={{ color: '#666666' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
          >
            <User size={18} />
          </Link>
          <button
            className="md:hidden p-2"
            style={{ color: '#666666' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-1"
          style={{
            backgroundColor: '#080808',
            borderTop: '1px solid rgba(212,175,55,0.1)',
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-center"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                color: pathname.startsWith(l.href) ? '#d4af37' : '#666666',
              }}
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
