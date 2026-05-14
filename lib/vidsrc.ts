export interface VidSrcServer {
  name: string
  getMovieUrl: (tmdbId: number) => string
  getTVUrl: (tmdbId: number, season: number, episode: number) => string
}

export const VIDSRC_SERVERS: VidSrcServer[] = [
  {
    name: 'Serveur 1',
    getMovieUrl: (id) => `https://vidsrc.me/embed/movie/${id}`,
    getTVUrl: (id, s, e) => `https://vidsrc.me/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: 'Serveur 2',
    getMovieUrl: (id) => `https://vidsrc.icu/embed/movie?tmdb=${id}`,
    getTVUrl: (id, s, e) => `https://vidsrc.icu/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: 'Serveur 3',
    getMovieUrl: (id) => `https://2embed.org/embed/movie/${id}`,
    getTVUrl: (id, s, e) => `https://2embed.org/embed/tv/${id}/${s}/${e}`,
  },
]

export function getMovieEmbedUrl(tmdbId: number, serverIndex = 0): string {
  return VIDSRC_SERVERS[serverIndex].getMovieUrl(tmdbId)
}

export function getTVEmbedUrl(tmdbId: number, season: number, episode: number, serverIndex = 0): string {
  return VIDSRC_SERVERS[serverIndex].getTVUrl(tmdbId, season, episode)
}
