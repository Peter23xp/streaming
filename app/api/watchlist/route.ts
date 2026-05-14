import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json([])
  const items = await prisma.watchlist.findMany({ where: { userId: session.user.id } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { mediaId, mediaType, title, poster } = await req.json()
  const item = await prisma.watchlist.upsert({
    where: { userId_mediaId_mediaType: { userId: session.user.id, mediaId, mediaType } },
    update: {},
    create: { userId: session.user.id, mediaId, mediaType, title, poster },
  })
  return NextResponse.json(item, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { mediaId, mediaType } = await req.json()
  await prisma.watchlist.deleteMany({ where: { userId: session.user.id, mediaId, mediaType } })
  return NextResponse.json({ ok: true })
}
