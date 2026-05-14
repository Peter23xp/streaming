'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { PLATFORMS } from '@/lib/platforms'

const ALL_PILL = { key: 'all', label: 'TOUT' }

export default function PlatformBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // On detail pages, platform filter has no meaning — redirect to list page instead
  const isDetailPage =
    /^\/films\/\d+/.test(pathname) || /^\/series\/\d+/.test(pathname)

  const activePlatform = isDetailPage ? 'all' : (searchParams.get('platform') ?? 'all')

  const getListPath = () => {
    if (/^\/films/.test(pathname)) return '/films'
    if (/^\/series/.test(pathname)) return '/series'
    return pathname
  }

  const setPlatform = (key: string) => {
    const targetPath = isDetailPage ? getListPath() : pathname
    const params = new URLSearchParams(isDetailPage ? '' : searchParams.toString())
    if (key === 'all') {
      params.delete('platform')
    } else {
      params.set('platform', key)
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${targetPath}?${qs}` : targetPath)
  }

  const pills = [
    ALL_PILL,
    ...Object.entries(PLATFORMS).map(([key, val]) => ({ key, label: val.label })),
  ]

  return (
    <div
      style={{
        backgroundColor: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(212,175,55,0.08)',
        position: 'sticky',
        top: '56px',
        zIndex: 40,
      }}
    >
      <div
        className="max-w-7xl mx-auto scrollbar-hide"
        style={{ padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto' }}
      >
        {pills.map(({ key, label }) => {
          const isActive = activePlatform === key
          return (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              style={{
                flexShrink: 0,
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.08em',
                padding: '4px 12px',
                borderRadius: '2px',
                border: isActive ? 'none' : '1px solid rgba(212,175,55,0.2)',
                backgroundColor: isActive ? '#d4af37' : 'transparent',
                color: isActive ? '#000000' : '#666666',
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#999999'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#666666'
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
