// GET: サークルメンバー一覧 / POST: メンバー追加

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })

    const { id } = await params
    const members = await prisma.circleMember.findMany({
      where: { circle_id: Number(id) },
      include: { user: true },
      orderBy: { created_at: 'asc' },
    })
    return NextResponse.json({ data: members, error: null })
  } catch (error) {
    console.error('[GET /api/admin/circles/:id/members]', error)
    return NextResponse.json({ data: null, error: '取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })

    const { id } = await params
    const { email, role } = await request.json()
    if (!email?.trim()) return NextResponse.json({ data: null, error: 'メールアドレスは必須です' }, { status: 400 })

    const validRoles = ['admin', 'leader', 'member']
    if (!validRoles.includes(role)) return NextResponse.json({ data: null, error: '不正なロールです' }, { status: 400 })

    // メールアドレスからユーザーを検索
    const targetUser = await prisma.user.findUnique({ where: { email: email.trim() } })
    if (!targetUser) return NextResponse.json({ data: null, error: 'ユーザーが見つかりません。先にアカウント登録が必要です。' }, { status: 404 })

    const member = await prisma.circleMember.upsert({
      where: { circle_id_user_id: { circle_id: Number(id), user_id: targetUser.id } },
      update: { role },
      create: { circle_id: Number(id), user_id: targetUser.id, role },
    })
    return NextResponse.json({ data: member, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/circles/:id/members]', error)
    return NextResponse.json({ data: null, error: '追加に失敗しました' }, { status: 500 })
  }
}
