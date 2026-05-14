'use client'
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
