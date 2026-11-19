import { discoverByGenre } from '@/lib/tmdb'
import { TMDB_GENRES } from '@/types/tmdb'
import MediaGrid from '@/components/media/MediaGrid'
import SectionTitle from '@/components/ui/SectionTitle'
import Pagination from '@/components/ui/Pagination'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const genre = TMDB_GENRES.find((g) => g.id === parseInt(slug.split('-')[0]))
  if (!genre) return {}
  return { title: `Films ${genre.name} en streaming` }
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const genreId = parseInt(slug.split('-')[0])
  const genre = TMDB_GENRES.find((g) => g.id === genreId)
  if (!genre) notFound()

  const page = parseInt(sp.page ?? '1') || 1
  const data = await discoverByGenre('movie', genreId, { page })

  return (
    <div className="space-y-8">
      <SectionTitle as="h1" title={`Films ${genre.name}`} />
      <MediaGrid items={data.results} type="movie" />
      <Pagination
        page={page}
        totalPages={Math.min(data.total_pages ?? 1, 500)}
        hrefFor={(p) => `/genre/${slug}?page=${p}`}
      />
    </div>
  )
}
