export interface TMDBMovie {
  id: number
  title: string
  original_title: string
  original_language: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  release_date: string
  genre_ids?: number[]
  genres?: TMDBGenre[]
  runtime?: number
  status?: string
  tagline?: string
  credits?: { cast: TMDBCast[]; crew: TMDBCrew[] }
  videos?: { results: TMDBVideo[] }
  similar?: { results: TMDBMovie[] }
}

export interface TMDBTVShow {
  id: number
  name: string
  original_name: string
  original_language: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  first_air_date: string
  last_air_date?: string
  number_of_seasons?: number
  number_of_episodes?: number
  status?: string
  genre_ids?: number[]
  genres?: TMDBGenre[]
  credits?: { cast: TMDBCast[]; crew: TMDBCrew[] }
  videos?: { results: TMDBVideo[] }
  similar?: { results: TMDBTVShow[] }
  seasons?: TMDBSeason[]
}

export interface TMDBSeason {
  id: number
  season_number: number
  name: string
  episode_count: number
  poster_path: string | null
  air_date: string
  episodes?: TMDBEpisode[]
}

export interface TMDBEpisode {
  id: number
  episode_number: number
  season_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
  vote_average: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBCast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBCrew {
  id: number
  name: string
  job: string
  profile_path: string | null
}

export interface TMDBVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  iso_639_1?: string
  official?: boolean
}

export interface TMDBPaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export const TMDB_TV_GENRES: TMDBGenre[] = [
  { id: 10759, name: 'Action & Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Familial' },
  { id: 10762, name: 'Enfants' },
  { id: 9648, name: 'Mystère' },
  { id: 10764, name: 'Téléréalité' },
  { id: 10765, name: 'Science-Fiction & Fantastique' },
  { id: 10766, name: 'Feuilleton' },
  { id: 10768, name: 'Guerre & Politique' },
  { id: 37, name: 'Western' },
]

export const TMDB_GENRES: TMDBGenre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' },
]
