import Link from 'next/link'
import { TMDB_GENRES } from '@/types/tmdb'
import { genreHref } from '@/lib/utils'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-[1fr_2fr] sm:px-6">
        <div className="space-y-3">
          <Link href="/" className="text-lg font-extrabold tracking-[0.18em] text-gold">
            STREAM<span className="text-ink">VF</span>
          </Link>
          <p className="max-w-xs text-sm text-muted">
            Films et séries en VF et VOSTFR.
          </p>
          <nav className="flex gap-5 text-sm text-muted">
            <Link href="/films" className="hover:text-gold">Films</Link>
            <Link href="/series" className="hover:text-gold">Séries</Link>
            <Link href="/watchlist" className="hover:text-gold">Ma liste</Link>
          </nav>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-faint">Genres</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {TMDB_GENRES.map((g) => (
              <Link key={g.id} href={genreHref(g)} className="hover:text-gold">
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-line px-4 py-4 text-center text-xs text-faint">
        Ce site utilise l&apos;API TMDB mais n&apos;est pas approuvé ou certifié par TMDB.
      </p>
    </footer>
  )
}
