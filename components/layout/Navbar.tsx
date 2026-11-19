'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Bookmark, User } from 'lucide-react'
import { useWatchlistStore } from '@/store/watchlistStore'

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/films', label: 'Films' },
  { href: '/series', label: 'Séries' },
  { href: '/watchlist', label: 'Ma liste' },
]

const iconBtn =
  'relative flex size-10 items-center justify-center rounded-full text-muted transition hover:bg-white/[0.06] hover:text-ink'

export default function Navbar() {
  const pathname = usePathname()
  const watchlistCount = useWatchlistStore((s) => s.items.length)
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8">
      <Link href="/" aria-label="StreamVF — accueil" className="flex shrink-0 items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-gold-light to-gold text-[15px] font-black text-black shadow-[0_6px_18px_-6px_rgba(212,175,55,0.7)]">
          S
        </span>
        <span className="hidden text-[17px] font-bold tracking-tight text-ink sm:block">
          Stream<span className="text-gold">VF</span>
        </span>
      </Link>

      <nav className="scrollbar-hide flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:gap-2">
        {NAV_LINKS.map((l) => {
          const active = isActive(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? 'page' : undefined}
              className={`relative shrink-0 px-2.5 py-2 text-sm font-medium transition ${
                l.href === '/' || l.href === '/watchlist' ? 'hidden md:block' : ''
              } ${active ? 'text-ink' : 'text-muted hover:text-ink'}`}
            >
              {l.label}
              <span
                className={`absolute inset-x-2.5 -bottom-[13px] h-0.5 rounded-full bg-gold transition-opacity ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </Link>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          href="/recherche"
          className="hidden h-10 w-56 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-faint transition hover:border-gold/40 hover:text-muted lg:flex"
        >
          <Search size={16} />
          Rechercher un titre…
        </Link>
        <Link href="/recherche" aria-label="Rechercher" className={`${iconBtn} lg:hidden`}>
          <Search size={19} />
        </Link>
        <Link href="/watchlist" aria-label="Ma liste" className={iconBtn}>
          <Bookmark size={19} />
          {watchlistCount > 0 && (
            <span
              suppressHydrationWarning
              className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-black"
            >
              {watchlistCount > 9 ? '9+' : watchlistCount}
            </span>
          )}
        </Link>
        <Link
          href="/auth/signin"
          aria-label="Compte"
          className="ml-1 flex size-9 items-center justify-center rounded-full border border-white/10 bg-surface-2 text-muted transition hover:border-gold/50 hover:text-gold"
        >
          <User size={17} />
        </Link>
      </div>
    </div>
  )
}
