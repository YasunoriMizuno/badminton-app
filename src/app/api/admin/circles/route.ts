// GET: サークル一覧 / POST: サークル作成

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  try {
    const user = await getAdminUser()
    if (!user) return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })

    const circles = await prisma.circle.findMany({
      orderBy: { created_at: 'asc' },
      include: { groups: true, _count: { select: { circle_members: true, players: true } } },
    })
    return NextResponse.json({ data: circles, error: null })
  } catch (error) {
    console.error('[GET /api/admin/circles]', error)
    return NextResponse.json({ data: null, error: '取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAdminUser()
    if (!user) return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })

    const { name } = await request.json()
    if (!name?.trim()) return NextResponse.json({ data: null, error: '名前は必須です' }, { status: 400 })

    // サークル作成 + 作成者を admin として CircleMember に追加
    const circle = await prisma.$transaction(async (tx) => {
      const c = await tx.circle.create({ data: { name: name.trim() } })
      await tx.circleMember.create({
        data: { circle_id: c.id, user_id: user.id, role: 'admin' },
      })
      return c
    })

    return NextResponse.json({ data: circle, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/circles]', error)
    return NextResponse.json({ data: null, error: '作成に失敗しました' }, { status: 500 })
  }
}
