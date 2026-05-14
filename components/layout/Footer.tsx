import Link from 'next/link'
import { TMDB_GENRES } from '@/types/tmdb'

export default function Footer() {
  const genres = TMDB_GENRES.slice(0, 8)
  return (
    <footer className="border-t border-zinc-800 mt-16 py-10 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {genres.map((g) => (
            <Link
              key={g.id}
              href={`/genre/${g.id}-${g.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-white transition"
            >
              {g.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/films" className="hover:text-white transition">Films</Link>
          <Link href="/series" className="hover:text-white transition">Séries</Link>
          <Link href="/watchlist" className="hover:text-white transition">Ma liste</Link>
        </div>
        <p className="text-xs text-zinc-600">
          Ce site utilise l&apos;API TMDB mais n&apos;est pas approuvé ou certifié par TMDB.
        </p>
      </div>
    </footer>
  )
}
