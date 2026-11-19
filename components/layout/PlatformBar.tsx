'use client'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { PLATFORMS } from '@/lib/platforms'

const PILLS = [
  { key: 'all', label: 'Tout', color: '#d4af37', fg: '#000000' },
  ...Object.entries(PLATFORMS).map(([key, p]) => ({ key, label: p.label, color: p.color, fg: p.fg })),
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
    <div className="mx-auto max-w-7xl">
      <nav
        aria-label="Plateformes"
        className="scrollbar-hide flex gap-2 overflow-x-auto px-4 pb-3 pt-1 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-24px),transparent)] sm:px-6"
      >
        {PILLS.map(({ key, label, color, fg }) => {
          const isActive = activePlatform === key
          return (
            <Link
              key={key}
              href={hrefFor(key)}
              aria-current={isActive ? 'page' : undefined}
              className={`group flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition duration-200 ${
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
              {!isActive && (
                <span
                  className="size-2 rounded-full ring-2 ring-black/40 transition group-hover:scale-125"
                  style={{ backgroundColor: color }}
                />
              )}
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
