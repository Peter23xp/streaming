const TMDB_PREFIX = 'https://image.tmdb.org/t/p/'
const TMDB_WIDTHS = [185, 342, 500, 780, 1280] as const

// Maps next/image's requested width to the nearest TMDB-hosted size so images
// stream straight from TMDB's CDN instead of being resized on our server.
export default function tmdbImageLoader({ src, width }: { src: string; width: number }) {
  if (!src.startsWith(TMDB_PREFIX)) return src
  const path = src.slice(TMDB_PREFIX.length).replace(/^[^/]+/, '')
  const size = TMDB_WIDTHS.find((w) => w >= width)
  return `${TMDB_PREFIX}${size ? `w${size}` : 'original'}${path}`
}
