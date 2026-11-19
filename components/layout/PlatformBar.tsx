'use client'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutGrid } from 'lucide-react'
import { useSearchParams, usePathname } from 'next/navigation'
import { PLATFORMS } from '@/lib/platforms'

const PILLS = [
  { key: 'all', label: 'Tout', color: '#d4af37', fg: '#000000', logo: null as string | null },
  ...Object.entries(PLATFORMS).map(([key, p]) => ({
    key,
    label: p.label,
    color: p.color,
    fg: p.fg,
    logo: p.logo as string | null,
  })),
]

export default function PlatformBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isDetailPage = /^\/(films|series)\/\d+/.test(pathname)
  const isBrowsePage = pathname === '/' || pathname === '/films' || pathname === '/series'
  if (!isBrowsePage && !isDetailPage) return null

  // On a detail page the filter applies to the matching list page instead.
  const targetPath = isDetailPage ? pathname.replace(/^\/(films|series).*/, '/$1') : pathname
  const activePlatform = isDetailPage ? 'all' : (searchParams.get('platform') ?? 'all')

  const hrefFor = (key: string) => {
    const params = new URLSearchParams(isDetailPage ? '' : searchParams.toString())
    if (key === 'all') params.delete('platform')
    else params.set('platform', key)
    params.delete('page')
    const qs = params.toString()
    return qs ? `${targetPath}?${qs}` : targetPath
  }

  return (
    <nav aria-label="Plateformes" className="scrollbar-hide overflow-x-auto px-4 pb-3 pt-1 sm:px-6">
      {/* w-max + mx-auto: centered when it fits, horizontally scrollable when it overflows */}
      <div className="mx-auto flex w-max gap-2">
        {PILLS.map(({ key, label, color, fg, logo }) => {
          const isActive = activePlatform === key
          return (
            <Link
              key={key}
              href={hrefFor(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-3.5 text-[13px] font-medium transition duration-200 ${
                isActive
                  ? 'border-transparent'
                  : 'border-white/10 bg-white/[0.03] text-muted hover:border-white/25 hover:bg-white/[0.07] hover:text-ink'
              }`}
              style={
                isActive
                  ? { backgroundColor: color, color: fg, boxShadow: `0 8px 24px -10px ${color}` }
                  : undefined
              }
            >
              {logo ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w92${logo}`}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                  className="size-6 rounded-full object-cover ring-1 ring-black/30 transition group-hover:scale-110"
                />
              ) : (
                <span
                  className={`flex size-6 items-center justify-center rounded-full ${
                    isActive ? 'bg-black/15' : 'bg-gold/15 text-gold'
                  }`}
                >
                  <LayoutGrid size={13} />
                </span>
              )}
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
