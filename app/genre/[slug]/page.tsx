import { discoverByGenre } from '@/lib/tmdb'
import { TMDB_GENRES } from '@/types/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const genreId = parseInt(slug.split('-')[0])
  const genre = TMDB_GENRES.find((g) => g.id === genreId)
  if (!genre) return {}
  return { title: `Films ${genre.name} en streaming` }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const genreId = parseInt(slug.split('-')[0])
  const genre = TMDB_GENRES.find((g) => g.id === genreId)
  if (!genre) notFound()

  const page = parseInt(sp.page ?? '1')
  const data = await discoverByGenre('movie', genreId, { page })
  const totalPages = Math.min(data.total_pages, 500)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Films {genre.name}</h1>
      <MediaGrid items={data.results} type="movie" />
      <div className="flex items-center justify-center gap-2 py-4">
        {page > 1 && (
          <Link
            href={`/genre/${slug}?page=${page - 1}`}
            className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition text-sm"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            ← Précédent
          </Link>
        )}
        <span className="text-zinc-400 text-sm">
          Page {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link
            href={`/genre/${slug}?page=${page + 1}`}
            className="px-4 py-2 rounded-lg hover:bg-zinc-700 transition text-sm"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            Suivant →
          </Link>
        )}
      </div>
    </div>
  )
}
