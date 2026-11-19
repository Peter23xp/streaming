export const PLATFORMS = {
  netflix: { label: 'Netflix', color: '#e50914', fg: '#ffffff', tmdbId: 8 },
  prime: { label: 'Prime Video', color: '#00a8e1', fg: '#04131c', tmdbId: 119 },
  disney: { label: 'Disney+', color: '#1f6fe5', fg: '#ffffff', tmdbId: 337 },
  apple: { label: 'Apple TV+', color: '#c7ccd1', fg: '#0b0b0d', tmdbId: 350 },
  max: { label: 'Max', color: '#2a4bff', fg: '#ffffff', tmdbId: 1899 },
  canal: { label: 'Canal+', color: '#f2f2f2', fg: '#0b0b0d', tmdbId: 190 },
} as const

export type PlatformKey = keyof typeof PLATFORMS
