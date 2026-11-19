import { NextRequest, NextResponse } from 'next/server'
import { searchMulti } from '@/lib/tmdb'
import { isReleased } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ results: [] })
  const data = await searchMulti(q)
  return NextResponse.json({ ...data, results: (data.results ?? []).filter(isReleased) })
}
