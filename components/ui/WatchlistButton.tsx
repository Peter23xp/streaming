'use client'
import { Check, Plus } from 'lucide-react'
import { useWatchlistStore, type WatchlistItem } from '@/store/watchlistStore'

export default function WatchlistButton({ item }: { item: WatchlistItem }) {
  const inList = useWatchlistStore((s) => s.items.some((i) => i.id === item.id && i.type === item.type))
  const add = useWatchlistStore((s) => s.add)
  const remove = useWatchlistStore((s) => s.remove)

  return (
    <button
      onClick={() => (inList ? remove(item.id, item.type) : add(item))}
      aria-pressed={inList}
      className={inList ? 'btn-ghost border-gold/50 text-gold' : 'btn-ghost'}
    >
      {inList ? <Check size={16} /> : <Plus size={16} />}
      {inList ? 'Dans ma liste' : 'Ma liste'}
    </button>
  )
}
