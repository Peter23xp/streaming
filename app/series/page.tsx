import BrowsePage from '@/components/media/BrowsePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Séries en streaming VF et VOSTFR',
  description: 'Découvrez des milliers de séries en VF et VOSTFR.',
}

export default async function SeriesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  return <BrowsePage type="tv" searchParams={await searchParams} />
}
