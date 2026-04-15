// src/app/api/auth/profile/route.ts
// POST: Supabase Auth のサインアップ後に public.users にプロフィールを作成
// GET:  ログイン中ユーザーのプロフィールを取得（なければ自動作成）

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })
    }

    // すでに存在すれば返す、なければ作成（upsert）
    const profile = await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
      },
    })

    return NextResponse.json({ data: profile, error: null })
  } catch (error) {
    console.error('[GET /api/auth/profile]', error)
    return NextResponse.json({ data: null, error: 'プロフィール取得に失敗しました' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ data: null, error: '未認証です' }, { status: 401 })
    }

    const profile = await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: {
        id: user.id,
        email: user.email!,
      },
    })

    return NextResponse.json({ data: profile, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/auth/profile]', error)
    return NextResponse.json({ data: null, error: 'プロフィール作成に失敗しました' }, { status: 500 })
  }
}
