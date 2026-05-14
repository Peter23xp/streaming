'use client'
import { useWatchlistStore, type WatchlistItem } from '@/store/watchlistStore'
import { Plus, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  item: WatchlistItem
  className?: string
}

export default function WatchlistButton({ item, className }: Props) {
  const { has, add, remove } = useWatchlistStore()
  const inList = has(item.id, item.type)

  const toggle = () => {
    if (inList) remove(item.id, item.type)
    else add(item)
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200',
        inList
          ? 'bg-zinc-600 hover:bg-zinc-500 text-white'
          : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600',
        className
      )}
    >
      {inList ? <Check size={16} /> : <Plus size={16} />}
      {inList ? 'Dans ma liste' : 'Ma liste'}
    </button>
  )
}
