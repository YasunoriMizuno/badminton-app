// GET: グループメンバー一覧 / POST: グループにプレイヤーを追加

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
    const members = await prisma.groupMember.findMany({
      where: { group_id: Number(id) },
      include: { player: true },
      orderBy: { created_at: 'asc' },
    })
    return NextResponse.json({ data: members, error: null })
  } catch (error) {
    console.error('[GET /api/admin/groups/:id/members]', error)
    return NextResponse.json({ data: null, error: '取得に失敗しました' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })

    const { id } = await params
    const { player_id, role } = await request.json()
    if (!player_id) return NextResponse.json({ data: null, error: 'player_idは必須です' }, { status: 400 })

    const validRoles = ['leader', 'member']
    const memberRole = validRoles.includes(role) ? role : 'member'

    const member = await prisma.groupMember.upsert({
      where: { group_id_player_id: { group_id: Number(id), player_id: Number(player_id) } },
      update: { role: memberRole },
      create: { group_id: Number(id), player_id: Number(player_id), role: memberRole },
    })
    return NextResponse.json({ data: member, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/groups/:id/members]', error)
    return NextResponse.json({ data: null, error: '追加に失敗しました' }, { status: 500 })
  }
}
