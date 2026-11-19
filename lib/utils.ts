import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { SortKey } from '@/lib/tmdb'

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

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'popular', label: 'Populaires' },
  { key: 'top', label: 'Mieux notés' },
  { key: 'recent', label: 'Nouveautés' },
  { key: 'az', label: 'A → Z' },
]

export interface ListParams {
  genre?: string
  year?: string
  platform?: string
  country?: string
  sort?: SortKey
}

export function parseSort(value: string | undefined): SortKey {
  return SORT_OPTIONS.some((s) => s.key === value) ? (value as SortKey) : 'popular'
}

export function listHref(basePath: string, params: ListParams, page = 1): string {
  const sp = new URLSearchParams()
  if (params.platform) sp.set('platform', params.platform)
  if (params.genre) sp.set('genre', params.genre)
  if (params.country) sp.set('country', params.country)
  if (params.year) sp.set('year', params.year)
  if (params.sort && params.sort !== 'popular') sp.set('sort', params.sort)
  if (page > 1) sp.set('page', String(page))
  const qs = sp.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function genreHref(genre: { id: number; name: string }): string {
  return `/genre/${genre.id}-${genre.name.toLowerCase().replace(/\s+/g, '-')}`
}

export function isVF(originalLanguage: string): boolean {
  return originalLanguage === 'fr'
}
