import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mediaId = parseInt(searchParams.get('mediaId') ?? '0')
  const mediaType = searchParams.get('mediaType') ?? ''
  const comments = await prisma.comment.findMany({
    where: { mediaId, mediaType, approved: true },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { mediaId, mediaType, content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Empty content' }, { status: 400 })
  const comment = await prisma.comment.create({
    data: { mediaId, mediaType, content: content.trim(), userId: session.user.id },
  })
  return NextResponse.json(comment, { status: 201 })
}
