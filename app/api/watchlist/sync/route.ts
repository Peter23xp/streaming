import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items: { id: number; type: string; title: string; poster: string | null }[] = await req.json()
  await Promise.all(
    items.map((item) =>
      prisma.watchlist.upsert({
        where: {
          userId_mediaId_mediaType: {
            userId: session.user!.id!,
            mediaId: item.id,
            mediaType: item.type,
          },
        },
        update: {},
        create: {
          userId: session.user!.id!,
          mediaId: item.id,
          mediaType: item.type,
          title: item.title,
          poster: item.poster,
        },
      })
    )
  )
  return NextResponse.json({ synced: items.length })
}
