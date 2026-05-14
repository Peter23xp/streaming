'use client'
import { useWatchlistStore, type WatchlistItem } from '@/store/watchlistStore'

interface Props {
  item: WatchlistItem
}

export default function WatchlistButton({ item }: Props) {
  const { has, add, remove } = useWatchlistStore()
  const inList = has(item.id, item.type)

  const toggle = () => {
    if (inList) remove(item.id, item.type)
    else add(item)
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 16px',
        borderRadius: '2px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 150ms',
        border: inList
          ? '1px solid rgba(212,175,55,0.4)'
          : '1px solid rgba(212,175,55,0.25)',
        backgroundColor: inList ? 'rgba(212,175,55,0.08)' : 'transparent',
        color: inList ? '#d4af37' : '#666',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'
        e.currentTarget.style.color = '#d4af37'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = inList
          ? 'rgba(212,175,55,0.4)'
          : 'rgba(212,175,55,0.25)'
        e.currentTarget.style.color = inList ? '#d4af37' : '#666'
      }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>{inList ? '✓' : '+'}</span>
      {inList ? 'Dans ma liste' : 'Ma liste'}
    </button>
  )
}
