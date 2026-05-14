import { NextRequest, NextResponse } from 'next/server'
import { searchMulti } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ results: [] })
  const data = await searchMulti(q)
  return NextResponse.json(data)
}
