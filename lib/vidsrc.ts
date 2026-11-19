export interface VidSrcServer {
  name: string
  getMovieUrl: (tmdbId: number) => string
  getTVUrl: (tmdbId: number, season: number, episode: number) => string
}

export const VOSTFR_SERVERS: VidSrcServer[] = [
  {
    name: 'Source 1',
    getMovieUrl: (id) => `https://vidsrc.me/embed/movie/${id}`,
    getTVUrl: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Source 2',
    getMovieUrl: (id) => `https://vidsrc.icu/embed/movie?tmdb=${id}`,
    getTVUrl: (id, s, e) => `https://vidsrc.icu/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'Source 3',
    getMovieUrl: (id) => `https://2embed.org/embed/movie/${id}`,
    getTVUrl: (id, s, e) => `https://2embed.org/embed/tv/${id}/${s}/${e}`,
  },
]

export const VF_SERVERS: VidSrcServer[] = [
  {
    name: 'Source 1',
    getMovieUrl: (id) => `https://vidzy.org/movie/${id}`,
    getTVUrl: (id, s, e) => `https://vidzy.org/serie/${id}/${s}/${e}`,
  },
  {
    name: 'Source 2',
    getMovieUrl: (id) => `https://frembed.shop/embed/movie/${id}`,
    getTVUrl: (id, s, e) => `https://frembed.shop/embed/serie/${id}?sa=${s}&epi=${e}`,
  },
  {
    name: 'Source 3',
    getMovieUrl: (id) => `https://embed.su/embed/movie/${id}`,
    getTVUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
]

// Legacy export — kept for backward compat
export const VIDSRC_SERVERS = VOSTFR_SERVERS

export function getMovieEmbedUrl(tmdbId: number, serverIndex = 0): string {
  return VOSTFR_SERVERS[serverIndex].getMovieUrl(tmdbId)
}

export function getTVEmbedUrl(tmdbId: number, season: number, episode: number, serverIndex = 0): string {
  return VOSTFR_SERVERS[serverIndex].getTVUrl(tmdbId, season, episode)
}
