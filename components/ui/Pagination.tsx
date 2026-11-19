import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  hrefFor: (page: number) => string
}

export default function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav className="flex items-center justify-center gap-3 pt-4" aria-label="Pagination">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="btn-ghost">
          <ChevronLeft size={16} /> Précédent
        </Link>
      ) : null}
      <span className="px-2 text-sm tabular-nums text-muted">
        {page} <span className="text-faint">/ {totalPages}</span>
      </span>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="btn-ghost">
          Suivant <ChevronRight size={16} />
        </Link>
      ) : null}
    </nav>
  )
}
