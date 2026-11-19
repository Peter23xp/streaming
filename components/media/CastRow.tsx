import Image from 'next/image'
import { User } from 'lucide-react'
import SectionTitle from '@/components/ui/SectionTitle'
import type { TMDBCast } from '@/types/tmdb'

export default function CastRow({ cast }: { cast: TMDBCast[] }) {
  return (
    <section className="space-y-4">
      <SectionTitle title="Casting" />
      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {cast.slice(0, 12).map((person) => (
          <div key={person.id} className="w-24 flex-none text-center">
            <div className="relative mx-auto size-20 overflow-hidden rounded-full bg-surface-2 ring-1 ring-line">
              {person.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <User className="absolute inset-0 m-auto text-faint" size={28} />
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-medium leading-tight text-ink">{person.name}</p>
            <p className="truncate text-[11px] text-faint">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
