'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WatchlistItem {
  id: number
  type: 'movie' | 'tv'
  title: string
  poster: string | null
  year: string
}

interface WatchlistStore {
  items: WatchlistItem[]
  add: (item: WatchlistItem) => void
  remove: (id: number, type: 'movie' | 'tv') => void
  has: (id: number, type: 'movie' | 'tv') => boolean
  clear: () => void
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => ({
          items: s.items.some((i) => i.id === item.id && i.type === item.type)
            ? s.items
            : [...s.items, item],
        })),
      remove: (id, type) =>
        set((s) => ({
          items: s.items.filter((i) => !(i.id === id && i.type === type)),
        })),
      has: (id, type) => get().items.some((i) => i.id === id && i.type === type),
      clear: () => set({ items: [] }),
    }),
    { name: 'streamvf-watchlist' }
  )
)
