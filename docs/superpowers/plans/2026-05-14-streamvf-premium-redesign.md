# StreamVF Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the "Luxe Noir & Or" premium visual identity to StreamVF — black background, gold accents, uppercase spaced typography, platform-colored card accents, and a sticky platform filter bar.

**Architecture:** CSS-only redesign — all existing data logic is preserved. New `lib/platforms.ts` constant drives both `PlatformBar` (new component) and `MediaCard` (modified). Platform filtering uses TMDB `with_watch_providers` via two new `lib/tmdb.ts` functions, read as RSC `searchParams` on homepage/films/series pages.

**Tech Stack:** Next.js 16 App Router, Tailwind v4 (`@theme` CSS variables in globals.css), React `useSearchParams`/`useRouter` for client-side pill navigation, TMDB API v3.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `lib/platforms.ts` | Create | PLATFORMS constant + PlatformKey type |
| `app/globals.css` | Modify | New `@theme` tokens, body defaults |
| `components/layout/Navbar.tsx` | Modify | Noir & Or styling |
| `components/layout/PlatformBar.tsx` | Create | Sticky platform filter pills |
| `app/layout.tsx` | Modify | Add PlatformBar below Navbar |
| `components/media/MediaCard.tsx` | Modify | Side accent stripe + gold hover |
| `lib/tmdb.ts` | Modify | Add `discoverMoviesByProvider` + `discoverTVByProvider` |
| `app/page.tsx` | Modify | Remove hero, carousels direct, read `platform` searchParam |
| `app/films/page.tsx` | Modify | Read `platform` searchParam, pass to discover |
| `app/series/page.tsx` | Modify | Read `platform` searchParam, pass to discover |
| `components/filters/FiltersBar.tsx` | Modify | Noir & Or styling, preserve `platform` param |
| `components/media/MediaCarousel.tsx` | Modify | Section label style (gold bar + uppercase) |

---

## Task 1: Create `lib/platforms.ts`

**Files:**
- Create: `lib/platforms.ts`

- [ ] **Step 1: Create the file**

```typescript
// lib/platforms.ts
export const PLATFORMS = {
  netflix:  { label: 'NETFLIX',   color: '#e50914', tmdbId: 8    },
  prime:    { label: 'PRIME',     color: '#00a8e1', tmdbId: 119  },
  disney:   { label: 'DISNEY+',   color: '#1183cf', tmdbId: 337  },
  apple:    { label: 'APPLE TV+', color: '#555555', tmdbId: 350  },
  max:      { label: 'MAX',       color: '#002be7', tmdbId: 1899 },
  canal:    { label: 'CANAL+',    color: '#004b23', tmdbId: 190  },
} as const

export type PlatformKey = keyof typeof PLATFORMS
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors relating to `lib/platforms.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/platforms.ts
git commit -m "feat: add PLATFORMS constant and PlatformKey type"
```

---

## Task 2: Update CSS design tokens

**Files:**
- Modify: `app/globals.css`

Current `@theme` block (lines 4–10):
```css
@theme {
  --color-background: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-accent: #e50914;
  --color-rating: #f5c518;
  --font-sans: 'Inter', sans-serif;
}
```

- [ ] **Step 1: Replace the `@theme` block and body rule**

Replace the entire file content with:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";

@theme {
  --color-bg: #080808;
  --color-surface: #0f0f0f;
  --color-border: rgba(212,175,55,0.12);
  --color-gold: #d4af37;
  --color-gold-dim: rgba(212,175,55,0.4);
  --color-gold-hover: rgba(212,175,55,0.5);
  --color-text: #cccccc;
  --color-muted: #555555;
  --font-sans: 'Inter', sans-serif;
}

body {
  background-color: #080808;
  color: #cccccc;
  font-family: 'Inter', sans-serif;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 2: Run dev server to verify no CSS errors**

Run: `npm run dev`
Expected: server starts without CSS parse errors, page background is very dark (`#080808`)

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: apply Noir & Or CSS design tokens"
```

---

## Task 3: Restyle Navbar

**Files:**
- Modify: `components/layout/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar with Noir & Or styling**

Full replacement of `components/layout/Navbar.tsx`:

```tsx
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
                className="absolute top-0.5 right-0.5 text-xs w-4 h-4 flex items-center justify-center"
                style={{
                  backgroundColor: '#d4af37',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '9px',
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
```

- [ ] **Step 2: Check in browser**

Run: `npm run dev` and open http://localhost:3000
Expected: Navbar shows `STREAMVF` in gold on near-black background, links uppercase grey, no emoji, no red accent.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Navbar.tsx
git commit -m "feat: restyle Navbar with Noir & Or identity"
```

---

## Task 4: Create PlatformBar component

**Files:**
- Create: `components/layout/PlatformBar.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

const ALL_PILL = { key: 'all', label: 'TOUT' }

export default function PlatformBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activePlatform = searchParams.get('platform') ?? 'all'

  const setPlatform = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'all') {
      params.delete('platform')
    } else {
      params.set('platform', key)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
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
        className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto scrollbar-hide"
        style={{ padding: '8px 16px' }}
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
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/PlatformBar.tsx
git commit -m "feat: add PlatformBar sticky platform filter component"
```

---

## Task 5: Add PlatformBar to layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Import PlatformBar and wrap in Suspense**

The Navbar is `h-14` (56px). PlatformBar must be `top: 56px` — already set in the component.

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import PlatformBar from '@/components/layout/PlatformBar'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'StreamVF — Films et Séries en Streaming',
    template: '%s | StreamVF',
  },
  description: 'Regardez des milliers de films et séries en VF et VOSTFR gratuitement.',
  openGraph: {
    siteName: 'StreamVF',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={inter.className}
        style={{ backgroundColor: '#080808', color: '#cccccc', minHeight: '100vh' }}
      >
        <Navbar />
        <Suspense>
          <PlatformBar />
        </Suspense>
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000 — navbar + platform pill bar both visible and sticky. Clicking NETFLIX changes URL to `?platform=netflix`.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add PlatformBar to root layout below Navbar"
```

---

## Task 6: Restyle MediaCard with platform side accent

**Files:**
- Modify: `components/media/MediaCard.tsx`

- [ ] **Step 1: Rewrite MediaCard**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { slugify, formatYear, isVF } from '@/lib/utils'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

type MediaCardProps = {
  item: (TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' }
  type: 'movie' | 'tv'
  platform?: PlatformKey
}

export default function MediaCard({ item, type, platform }: MediaCardProps) {
  const isMovie = type === 'movie'
  const movie = item as TMDBMovie
  const show = item as TMDBTVShow
  const title = isMovie ? (movie.title ?? '') : (show.name ?? '')
  const date = isMovie ? movie.release_date : show.first_air_date
  const slug = slugify(title)
  const href = isMovie ? `/films/${item.id}/${slug}` : `/series/${item.id}/${slug}`
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : null

  const accentColor = platform ? PLATFORMS[platform].color : '#d4af37'
  const vfLabel = isVF(item.original_language) ? 'VF' : 'VOSTFR'
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <Link href={href} className="group block">
      <div
        className="relative overflow-hidden aspect-[2/3]"
        style={{
          backgroundColor: '#0f0f0f',
          border: '1px solid rgba(212,175,55,0.10)',
          borderRadius: '2px',
          transition: 'border-color 200ms, box-shadow 200ms',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(212,175,55,0.12)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,175,55,0.10)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {/* Platform accent stripe */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: accentColor,
            zIndex: 2,
          }}
        />

        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover"
            style={{ transition: 'transform 200ms' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: '#333', fontSize: '11px' }}
          >
            NO IMAGE
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
          style={{
            backgroundColor: 'rgba(0,0,0,0.55)',
            transition: 'opacity 200ms',
            zIndex: 3,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '1.5px solid #d4af37',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37',
              fontSize: '14px',
            }}
          >
            ▶
          </div>
        </div>

        {/* VF / VOSTFR badge */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '8px',
            zIndex: 4,
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: '#d4af37',
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            padding: '2px 5px',
            borderRadius: '1px',
          }}
        >
          {vfLabel}
        </div>

        {/* Rating badge */}
        {rating && (
          <div
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              zIndex: 4,
              backgroundColor: 'rgba(0,0,0,0.75)',
              color: '#d4af37',
              fontSize: '9px',
              fontWeight: 700,
              padding: '2px 5px',
              borderRadius: '1px',
              letterSpacing: '0.03em',
            }}
          >
            ★ {rating}
          </div>
        )}
      </div>

      <p
        className="mt-1.5 truncate"
        style={{
          color: '#cccccc',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </p>
      <p style={{ color: '#555555', fontSize: '10px' }}>{formatYear(date)}</p>
    </Link>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000 — cards show gold side stripe (no platform selected), dark background, VF badge in gold, rating top-right. Hover shows dark overlay + gold circle play button.

- [ ] **Step 3: Commit**

```bash
git add components/media/MediaCard.tsx
git commit -m "feat: restyle MediaCard with platform accent stripe and gold hover"
```

---

## Task 7: Add TMDB provider-filtered discover functions

**Files:**
- Modify: `lib/tmdb.ts`

- [ ] **Step 1: Append two functions to `lib/tmdb.ts`**

Add at the end of the file (after the `getGenres` function):

```typescript
export async function discoverMoviesByProvider(
  providerId: number,
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const res = await fetch(
    url('/discover/movie', {
      with_watch_providers: providerId,
      watch_region: 'FR',
      sort_by: 'popularity.desc',
      page,
    }),
    CACHE
  )
  return res.json()
}

export async function discoverTVByProvider(
  providerId: number,
  page = 1
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  const res = await fetch(
    url('/discover/tv', {
      with_watch_providers: providerId,
      watch_region: 'FR',
      sort_by: 'popularity.desc',
      page,
    }),
    CACHE
  )
  return res.json()
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/tmdb.ts
git commit -m "feat: add discoverMoviesByProvider and discoverTVByProvider to tmdb lib"
```

---

## Task 8: Restyle MediaCarousel section labels

**Files:**
- Modify: `components/media/MediaCarousel.tsx`

- [ ] **Step 1: Update section header style**

Replace `components/media/MediaCarousel.tsx`:

```tsx
'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import type { TMDBMovie, TMDBTVShow } from '@/types/tmdb'
import type { PlatformKey } from '@/lib/platforms'

interface Props {
  title: string
  items: ((TMDBMovie | TMDBTVShow) & { media_type?: 'movie' | 'tv' })[]
  type: 'movie' | 'tv'
  viewAllHref?: string
  platform?: PlatformKey
}

export default function MediaCarousel({ title, items, type, viewAllHref, platform }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '16px', backgroundColor: '#d4af37', flexShrink: 0 }} />
          <h2
            style={{
              color: '#cccccc',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <a
              href={viewAllHref}
              style={{
                fontSize: '10px',
                color: '#555555',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}
            >
              Voir tout
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-1 transition"
            style={{ color: '#444', backgroundColor: '#0f0f0f', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '2px' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 transition"
            style={{ color: '#444', backgroundColor: '#0f0f0f', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '2px' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#d4af37')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-none w-32 sm:w-40">
            <MediaCard item={item} type={type} platform={platform} />
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/media/MediaCarousel.tsx
git commit -m "feat: restyle MediaCarousel section labels with gold bar"
```

---

## Task 9: Redesign homepage — remove hero, add platform filtering

**Files:**
- Modify: `app/page.tsx`

The existing homepage imports `HeroBanner` and uses it. We remove it and add platform-filtered carousels.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import {
  getTrending,
  getPopular,
  getNowPlaying,
  getTopRated,
  discoverMoviesByProvider,
  discoverTVByProvider,
} from '@/lib/tmdb'
import MediaCarousel from '@/components/media/MediaCarousel'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'
import Link from 'next/link'
import { TMDB_GENRES } from '@/types/tmdb'

interface Props {
  searchParams: Promise<{ platform?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const hasApiKey =
    process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'REPLACE_ME'

  if (!hasApiKey) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: '#555' }}>
        <p style={{ fontSize: '14px' }}>Configurez votre clé TMDB dans .env.local pour démarrer.</p>
      </div>
    )
  }

  const params = await searchParams
  const platformKey = (params.platform ?? '') as PlatformKey | ''
  const platformData = platformKey && platformKey in PLATFORMS ? PLATFORMS[platformKey] : null

  if (platformData) {
    const [movies, shows] = await Promise.all([
      discoverMoviesByProvider(platformData.tmdbId),
      discoverTVByProvider(platformData.tmdbId),
    ])

    return (
      <div className="space-y-10">
        <MediaCarousel
          title={`FILMS ${platformData.label}`}
          items={movies.results}
          type="movie"
          viewAllHref={`/films?platform=${platformKey}`}
          platform={platformKey}
        />
        <MediaCarousel
          title={`SÉRIES ${platformData.label}`}
          items={shows.results}
          type="tv"
          viewAllHref={`/series?platform=${platformKey}`}
          platform={platformKey}
        />
      </div>
    )
  }

  const [trending, popularTV, nowPlaying, topRated] = await Promise.all([
    getTrending('movie', 'week'),
    getPopular('tv'),
    getNowPlaying(),
    getTopRated('movie'),
  ])

  return (
    <div className="space-y-10">
      <MediaCarousel
        title="TENDANCES"
        items={trending.results}
        type="movie"
        viewAllHref="/films"
      />
      <MediaCarousel
        title="NOUVEAUTÉS FILMS"
        items={nowPlaying.results}
        type="movie"
        viewAllHref="/films"
      />
      <MediaCarousel
        title="POPULAIRES SÉRIES"
        items={popularTV.results}
        type="tv"
        viewAllHref="/series"
      />
      <MediaCarousel
        title="MIEUX NOTÉS"
        items={topRated.results}
        type="movie"
        viewAllHref="/films"
      />

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '16px', backgroundColor: '#d4af37' }} />
          <h2 style={{ color: '#cccccc', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            PARCOURIR PAR GENRE
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TMDB_GENRES.map((g) => (
            <Link
              key={g.id}
              href={`/genre/${g.id}-${g.name.toLowerCase().replace(/\s+/g, '-')}`}
              style={{
                padding: '4px 12px',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '2px',
                fontSize: '10px',
                color: '#666',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                backgroundColor: 'transparent',
                transition: 'color 150ms, border-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#d4af37'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
              }}
            >
              {g.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000 — 4 carousels visible, no hero. Click NETFLIX in platform bar → page reloads with FILMS NETFLIX + SÉRIES NETFLIX carousels. Cards have red left stripe. Click TOUT → returns to 4 carousels.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: remove hero, add platform-filtered carousels to homepage"
```

---

## Task 10: Update /films page — add platform filtering

**Files:**
- Modify: `app/films/page.tsx`

- [ ] **Step 1: Replace `app/films/page.tsx`**

```tsx
import { discoverMovies, discoverMoviesByProvider } from '@/lib/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

export const metadata: Metadata = {
  title: 'Films en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de films en VF et VOSTFR.',
}

interface Props {
  searchParams: Promise<{ genre?: string; year?: string; page?: string; platform?: string }>
}

export default async function FilmsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const platformKey = (params.platform ?? '') as PlatformKey | ''
  const platformData = platformKey && platformKey in PLATFORMS ? PLATFORMS[platformKey] : null

  const data = platformData
    ? await discoverMoviesByProvider(platformData.tmdbId, page)
    : await discoverMovies({
        page,
        with_genres: params.genre ? parseInt(params.genre) : undefined,
        year: params.year,
      })

  const totalPages = Math.min(data.total_pages, 500)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '20px', backgroundColor: '#d4af37' }} />
          <h1
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#cccccc',
            }}
          >
            {platformData ? `FILMS ${platformData.label}` : 'FILMS'}
          </h1>
        </div>
        {!platformData && (
          <Suspense>
            <FiltersBar />
          </Suspense>
        )}
      </div>
      <MediaGrid items={data.results} type="movie" platform={platformKey || undefined} />
      <Pagination page={page} totalPages={totalPages} params={params} basePath="/films" />
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  params,
  basePath,
}: {
  page: number
  totalPages: number
  params: Record<string, string | undefined>
  basePath: string
}) {
  const buildHref = (p: number) => {
    const sp = new URLSearchParams()
    if (params.genre) sp.set('genre', params.genre)
    if (params.year) sp.set('year', params.year)
    if (params.platform) sp.set('platform', params.platform)
    sp.set('page', String(p))
    return `${basePath}?${sp.toString()}`
  }

  return (
    <div className="flex items-center justify-center gap-3 py-4">
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          className="px-4 py-2 text-sm transition"
          style={{
            backgroundColor: '#0f0f0f',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '2px',
            color: '#666',
            letterSpacing: '0.05em',
            fontSize: '11px',
          }}
        >
          ← PRÉCÉDENT
        </Link>
      )}
      <span style={{ color: '#444', fontSize: '11px', letterSpacing: '0.05em' }}>
        {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          className="px-4 py-2 text-sm transition"
          style={{
            backgroundColor: '#0f0f0f',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '2px',
            color: '#666',
            letterSpacing: '0.05em',
            fontSize: '11px',
          }}
        >
          SUIVANT →
        </Link>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Update MediaGrid to accept and pass `platform` prop**

Read `components/media/MediaGrid.tsx` first, then add `platform?: PlatformKey` prop and pass it to each `<MediaCard>`.

Check what MediaGrid currently looks like:

```bash
cat components/media/MediaGrid.tsx
```

If it renders `<MediaCard item={item} type={type} />`, update the signature and call to:

```tsx
import type { PlatformKey } from '@/lib/platforms'

interface Props {
  items: ...
  type: 'movie' | 'tv'
  platform?: PlatformKey
}

export default function MediaGrid({ items, type, platform }: Props) {
  ...
  <MediaCard item={item} type={type} platform={platform} />
  ...
}
```

- [ ] **Step 3: Commit**

```bash
git add app/films/page.tsx components/media/MediaGrid.tsx
git commit -m "feat: add platform filtering to /films page"
```

---

## Task 11: Update /series page — add platform filtering

**Files:**
- Modify: `app/series/page.tsx`

- [ ] **Step 1: Replace `app/series/page.tsx`**

```tsx
import { discoverTV, discoverTVByProvider } from '@/lib/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import FiltersBar from '@/components/filters/FiltersBar'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PLATFORMS, type PlatformKey } from '@/lib/platforms'

export const metadata: Metadata = {
  title: 'Séries en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de séries en VF et VOSTFR.',
}

interface Props {
  searchParams: Promise<{ genre?: string; year?: string; page?: string; platform?: string }>
}

export default async function SeriesPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const platformKey = (params.platform ?? '') as PlatformKey | ''
  const platformData = platformKey && platformKey in PLATFORMS ? PLATFORMS[platformKey] : null

  const data = platformData
    ? await discoverTVByProvider(platformData.tmdbId, page)
    : await discoverTV({
        page,
        with_genres: params.genre ? parseInt(params.genre) : undefined,
        year: params.year,
      })

  const totalPages = Math.min(data.total_pages, 500)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div style={{ width: '2px', height: '20px', backgroundColor: '#d4af37' }} />
          <h1
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#cccccc',
            }}
          >
            {platformData ? `SÉRIES ${platformData.label}` : 'SÉRIES'}
          </h1>
        </div>
        {!platformData && (
          <Suspense>
            <FiltersBar />
          </Suspense>
        )}
      </div>
      <MediaGrid items={data.results} type="tv" platform={platformKey || undefined} />
      <div className="flex items-center justify-center gap-3 py-4">
        {page > 1 && (
          <Link
            href={`/series?${buildQuery(params, page - 1)}`}
            className="px-4 py-2 text-sm"
            style={{
              backgroundColor: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '2px',
              color: '#666',
              letterSpacing: '0.05em',
              fontSize: '11px',
            }}
          >
            ← PRÉCÉDENT
          </Link>
        )}
        <span style={{ color: '#444', fontSize: '11px', letterSpacing: '0.05em' }}>
          {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link
            href={`/series?${buildQuery(params, page + 1)}`}
            className="px-4 py-2 text-sm"
            style={{
              backgroundColor: '#0f0f0f',
              border: '1px solid rgba(212,175,55,0.2)',
              borderRadius: '2px',
              color: '#666',
              letterSpacing: '0.05em',
              fontSize: '11px',
            }}
          >
            SUIVANT →
          </Link>
        )}
      </div>
    </div>
  )
}

function buildQuery(params: Record<string, string | undefined>, page: number) {
  const sp = new URLSearchParams()
  if (params.genre) sp.set('genre', params.genre)
  if (params.year) sp.set('year', params.year)
  if (params.platform) sp.set('platform', params.platform)
  sp.set('page', String(page))
  return sp.toString()
}
```

- [ ] **Step 2: Commit**

```bash
git add app/series/page.tsx
git commit -m "feat: add platform filtering to /series page"
```

---

## Task 12: Restyle FiltersBar

**Files:**
- Modify: `components/filters/FiltersBar.tsx`

- [ ] **Step 1: Rewrite FiltersBar with Noir & Or styling**

```tsx
'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { TMDB_GENRES } from '@/types/tmdb'

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i))

const selectStyle: React.CSSProperties = {
  backgroundColor: '#0f0f0f',
  border: '1px solid rgba(212,175,55,0.2)',
  borderRadius: '2px',
  color: '#666666',
  fontSize: '11px',
  letterSpacing: '0.05em',
  padding: '5px 10px',
  outline: 'none',
  cursor: 'pointer',
}

export default function FiltersBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('page')
      // preserve platform param
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const currentGenre = searchParams.get('genre') ?? ''
  const currentYear = searchParams.get('year') ?? ''

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select
        value={currentGenre}
        onChange={(e) => update('genre', e.target.value)}
        style={selectStyle}
      >
        <option value="">TOUS LES GENRES</option>
        {TMDB_GENRES.map((g) => (
          <option key={g.id} value={String(g.id)}>
            {g.name.toUpperCase()}
          </option>
        ))}
      </select>
      <select
        value={currentYear}
        onChange={(e) => update('year', e.target.value)}
        style={selectStyle}
      >
        <option value="">TOUTES LES ANNÉES</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/filters/FiltersBar.tsx
git commit -m "feat: restyle FiltersBar with Noir & Or styling"
```

---

## Task 13: Final build verification

**Files:** none modified

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`, all 15+ routes show green checkmarks. No TypeScript errors.

- [ ] **Step 2: Spot-check all checklist items**

- [ ] Homepage shows 4 carousels (TENDANCES / NOUVEAUTÉS FILMS / POPULAIRES SÉRIES / MIEUX NOTÉS)
- [ ] Click NETFLIX pill → page shows `FILMS NETFLIX` + `SÉRIES NETFLIX` with red left stripe on cards
- [ ] Click TOUT → back to 4 carousels, gold stripe on cards
- [ ] Cards show VF/VOSTFR gold badge + rating badge
- [ ] Hover on card → dark overlay + gold circle play button
- [ ] Navbar: `STREAMVF` in gold, links uppercase grey, no emoji
- [ ] Platform bar scrollable on narrow viewport
- [ ] `/films?platform=prime` → blue stripe on all cards
- [ ] `/series` — genre + year filters still work (no platform)
- [ ] Watchlist badge still shows count in gold

- [ ] **Step 3: Commit if any final tweaks were needed**

```bash
git add -p
git commit -m "fix: final tweaks from build verification"
```
