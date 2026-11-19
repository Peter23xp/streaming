import BrowsePage from '@/components/media/BrowsePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Films en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de films en VF et VOSTFR.',
}

export default async function FilmsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <BrowsePage type="movie" searchParams={await searchParams} />
}
