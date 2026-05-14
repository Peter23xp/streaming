export const PLATFORMS = {
  netflix:  { label: 'NETFLIX',   color: '#e50914', tmdbId: 8    },
  prime:    { label: 'PRIME',     color: '#00a8e1', tmdbId: 119  },
  disney:   { label: 'DISNEY+',   color: '#1183cf', tmdbId: 337  },
  apple:    { label: 'APPLE TV+', color: '#555555', tmdbId: 350  },
  max:      { label: 'MAX',       color: '#002be7', tmdbId: 1899 },
  canal:    { label: 'CANAL+',    color: '#004b23', tmdbId: 190  },
} as const

export type PlatformKey = keyof typeof PLATFORMS
