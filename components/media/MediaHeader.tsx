import Image from 'next/image'
import WatchlistButton from '@/components/ui/WatchlistButton'
import type { WatchlistItem } from '@/store/watchlistStore'

interface Props {
  title: string
  posterPath: string | null
  rating: number
  isVF: boolean
  meta: (string | null | undefined)[]
  genres?: string[]
  overview?: string
  watchItem: WatchlistItem
}

export default function MediaHeader({ title, posterPath, rating, isVF, meta, genres, overview, watchItem }: Props) {
  return (
    <div className="flex items-start gap-6">
      {posterPath && (
        <div className="relative hidden aspect-[2/3] w-36 flex-none overflow-hidden rounded-xl ring-1 ring-line sm:block lg:w-44">
          <Image
            src={`https://image.tmdb.org/t/p/w342${posterPath}`}
            alt={title}
            fill
            sizes="176px"
            className="object-cover"
          />
        </div>
      )}

      <div className="min-w-0 flex-1 space-y-4">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{title}</h1>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-md bg-gold px-2 py-0.5 font-bold text-black">{isVF ? 'VF' : 'VOSTFR'}</span>
          <span className="rounded-md border border-line px-2 py-0.5 text-ink">HD</span>
          {rating > 0 && (
            <span className="text-ink">
              <span className="text-gold">★</span> {rating.toFixed(1)}
            </span>
          )}
          {meta.filter(Boolean).map((m) => (
            <span key={m} className="text-muted before:mr-2 before:text-faint before:content-['·']">
              {m}
            </span>
          ))}
        </div>

        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <span key={g} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
                {g}
              </span>
            ))}
          </div>
        )}

        {overview && <p className="max-w-3xl text-sm leading-relaxed text-ink/75 sm:text-base">{overview}</p>}

        <WatchlistButton item={watchItem} />
      </div>
    </div>
  )
}
