// POST: グループ作成

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })

    const { id } = await params
    const { name } = await request.json()
    if (!name?.trim()) return NextResponse.json({ data: null, error: '名前は必須です' }, { status: 400 })

    const group = await prisma.group.create({
      data: { circle_id: Number(id), name: name.trim() },
    })
    return NextResponse.json({ data: group, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/circles/:id/groups]', error)
    return NextResponse.json({ data: null, error: '作成に失敗しました' }, { status: 500 })
  }
}
