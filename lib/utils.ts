import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function formatYear(dateStr: string | undefined): string {
  if (!dateStr) return ''
  return dateStr.slice(0, 4)
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}min` : `${m}min`
}

export function getImageUrl(path: string | null, size: string): string {
  if (!path) return '/placeholder-poster.svg'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function listHref(
  basePath: string,
  params: { genre?: string; year?: string; platform?: string },
  page: number
): string {
  const sp = new URLSearchParams()
  if (params.genre) sp.set('genre', params.genre)
  if (params.year) sp.set('year', params.year)
  if (params.platform) sp.set('platform', params.platform)
  sp.set('page', String(page))
  return `${basePath}?${sp}`
}

export function genreHref(genre: { id: number; name: string }): string {
  return `/genre/${genre.id}-${genre.name.toLowerCase().replace(/\s+/g, '-')}`
}

export function isVF(originalLanguage: string): boolean {
  return originalLanguage === 'fr'
}
