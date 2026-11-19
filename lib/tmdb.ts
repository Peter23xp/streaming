import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBPaginatedResponse,
  TMDBSeason,
} from '@/types/tmdb'

const BASE = process.env.TMDB_BASE_URL!
const KEY = process.env.TMDB_API_KEY!
const LANG = 'fr-FR'
const CACHE = { next: { revalidate: 86400 } }

function url(path: string, params: Record<string, string | number> = {}): string {
  const p = new URLSearchParams({
    api_key: KEY,
    language: LANG,
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  })
  return `${BASE}${path}?${p}`
}

export async function getTrending(
  type: 'movie' | 'tv',
  timeWindow: 'day' | 'week' = 'week'
): Promise<TMDBPaginatedResponse<TMDBMovie & TMDBTVShow>> {
  const res = await fetch(url(`/trending/${type}/${timeWindow}`), CACHE)
  return res.json()
}

export async function getPopular(
  type: 'movie' | 'tv',
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovie & TMDBTVShow>> {
  const res = await fetch(url(`/${type}/popular`, { page }), CACHE)
  return res.json()
}

export async function getNowPlaying(page = 1): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const res = await fetch(url('/movie/now_playing', { page }), CACHE)
  return res.json()
}

export async function getTopRated(
  type: 'movie' | 'tv',
  page = 1
): Promise<TMDBPaginatedResponse<TMDBMovie & TMDBTVShow>> {
  const res = await fetch(url(`/${type}/top_rated`, { page }), CACHE)
  return res.json()
}

export async function getMovieDetail(id: number): Promise<TMDBMovie> {
  const res = await fetch(
    url(`/movie/${id}`, { append_to_response: 'credits,videos,similar' }),
    CACHE
  )
  return res.json()
}

export async function getTVDetail(id: number): Promise<TMDBTVShow> {
  const res = await fetch(
    url(`/tv/${id}`, { append_to_response: 'credits,videos,similar' }),
    CACHE
  )
  return res.json()
}

export async function getTVSeason(id: number, seasonNumber: number): Promise<TMDBSeason> {
  const res = await fetch(url(`/tv/${id}/season/${seasonNumber}`), CACHE)
  return res.json()
}

export async function searchMulti(query: string, page = 1) {
  const res = await fetch(url('/search/multi', { query, page }), { next: { revalidate: 60 } })
  return res.json()
}

export type SortKey = 'popular' | 'top' | 'recent' | 'az'

export interface DiscoverOptions {
  page?: number
  genre?: number
  year?: string
  provider?: number
  country?: string
  sort?: SortKey
}

export async function discover<T extends 'movie' | 'tv'>(
  type: T,
  { page = 1, genre, year, provider, country, sort = 'popular' }: DiscoverOptions = {}
): Promise<TMDBPaginatedResponse<T extends 'movie' ? TMDBMovie : TMDBTVShow>> {
  const isMovie = type === 'movie'
  const dateField = isMovie ? 'primary_release_date' : 'first_air_date'
  const params: Record<string, string | number> = {
    page,
    include_adult: 'false',
    sort_by: {
      popular: 'popularity.desc',
      top: 'vote_average.desc',
      recent: `${dateField}.desc`,
      az: isMovie ? 'title.asc' : 'name.asc',
    }[sort],
  }
  // Without a vote floor, rating/date sorts surface obscure titles with 1-2 votes.
  if (sort === 'top') params['vote_count.gte'] = isMovie ? 1000 : 300
  if (sort === 'recent') {
    params[`${dateField}.lte`] = new Date().toISOString().slice(0, 10)
    params['vote_count.gte'] = 10
  }
  if (genre) params['with_genres'] = genre
  if (country) params['with_origin_country'] = country
  if (year) params[isMovie ? 'primary_release_year' : 'first_air_date_year'] = year
  if (provider) {
    params['with_watch_providers'] = provider
    params['watch_region'] = 'FR'
  }
  const res = await fetch(url(`/discover/${type}`, params), CACHE)
  return res.json()
}

export async function getGenres(
  type: 'movie' | 'tv'
): Promise<{ genres: { id: number; name: string }[] }> {
  const res = await fetch(url(`/genre/${type}/list`), CACHE)
  return res.json()
}
