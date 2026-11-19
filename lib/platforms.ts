// tmdbId = TMDB watch provider id for region FR; logo = TMDB-hosted provider logo path.
export const PLATFORMS = {
  netflix: { label: 'Netflix', color: '#e50914', fg: '#ffffff', tmdbId: 8, logo: '/rK1KljqmbvO9HQa1PBFLILWah72.png' },
  prime: { label: 'Prime Video', color: '#00a8e1', fg: '#04131c', tmdbId: 119, logo: '/gMZdpavHmxFNnLpMHwVxfqeux2g.png' },
  disney: { label: 'Disney+', color: '#1f6fe5', fg: '#ffffff', tmdbId: 337, logo: '/5eZ872CghnHFLB1j8grszbrx0dx.png' },
  apple: { label: 'Apple TV+', color: '#c7ccd1', fg: '#0b0b0d', tmdbId: 350, logo: '/9icYBfYFcwgCbky5VdGUIKJ4C5i.png' },
  max: { label: 'Max', color: '#2a4bff', fg: '#ffffff', tmdbId: 1899, logo: '/skypuy7SXuugIQeYg0IglmzoKaS.png' },
  canal: { label: 'Canal+', color: '#f2f2f2', fg: '#0b0b0d', tmdbId: 381, logo: '/gliWKhLJVdm7QwL1braBCRko5dx.png' },
} as const

export type PlatformKey = keyof typeof PLATFORMS
