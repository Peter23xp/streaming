import Image from 'next/image'
import type { TMDBCast } from '@/types/tmdb'

export default function CastRow({ cast }: { cast: TMDBCast[] }) {
  const visible = cast.slice(0, 10)
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Casting</h2>
      <div
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {visible.map((person) => (
          <div key={person.id} className="flex-none w-24 text-center">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden mx-auto"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl">
                  👤
                </div>
              )}
            </div>
            <p className="mt-1.5 text-xs font-medium text-white leading-tight">{person.name}</p>
            <p className="text-xs text-zinc-500 leading-tight truncate">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
