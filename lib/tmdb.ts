import type {
  TMDBMovie,
  TMDBTVShow,
  TMDBPaginatedResponse,
  TMDBSeason,
  DiscoverFilters,
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

export async function discoverByGenre(
  type: 'movie' | 'tv',
  genreId: number,
  filters: DiscoverFilters = {}
): Promise<TMDBPaginatedResponse<TMDBMovie & TMDBTVShow>> {
  const params: Record<string, string | number> = {
    with_genres: genreId,
    sort_by: filters.sort_by ?? 'popularity.desc',
    page: filters.page ?? 1,
  }
  if (filters.year) params['primary_release_year'] = filters.year
  if (filters.with_origin_country) params['with_origin_country'] = filters.with_origin_country
  const res = await fetch(url(`/discover/${type}`, params), CACHE)
  return res.json()
}

export async function discoverMovies(
  filters: DiscoverFilters = {}
): Promise<TMDBPaginatedResponse<TMDBMovie>> {
  const params: Record<string, string | number> = {
    sort_by: filters.sort_by ?? 'popularity.desc',
    page: filters.page ?? 1,
  }
  if (filters.with_genres) params['with_genres'] = filters.with_genres
  if (filters.year) params['primary_release_year'] = filters.year
  if (filters.with_origin_country) params['with_origin_country'] = filters.with_origin_country
  const res = await fetch(url('/discover/movie', params), CACHE)
  return res.json()
}

export async function discoverTV(
  filters: DiscoverFilters = {}
): Promise<TMDBPaginatedResponse<TMDBTVShow>> {
  const params: Record<string, string | number> = {
    sort_by: filters.sort_by ?? 'popularity.desc',
    page: filters.page ?? 1,
  }
  if (filters.with_genres) params['with_genres'] = filters.with_genres
  if (filters.year) params['first_air_date_year'] = filters.year
  if (filters.with_origin_country) params['with_origin_country'] = filters.with_origin_country
  if (filters.status) params['with_status'] = filters.status
  const res = await fetch(url('/discover/tv', params), CACHE)
  return res.json()
}

export async function getGenres(
  type: 'movie' | 'tv'
): Promise<{ genres: { id: number; name: string }[] }> {
  const res = await fetch(url(`/genre/${type}/list`), CACHE)
  return res.json()
}
