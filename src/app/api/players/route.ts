// src/app/api/players/route.ts
// GET: 参加者一覧取得
// POST: 参加者新規作成

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 参加者一覧取得
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { created_at: 'asc' },
    })
    return NextResponse.json({ data: players, error: null })
  } catch (error) {
    console.error('[GET /api/players]', error)
    return NextResponse.json(
      { data: null, error: '取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 参加者新規作成
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, level,gender } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { data: null, error: '名前は必須です' },
        { status: 400 }
      )
    }

    const player = await prisma.player.create({
      data: {
        name: name.trim(),
        level: level ?? null,
        gender: gender ?? null, 
      },
    })

    return NextResponse.json({ data: player, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/players]', error)
    return NextResponse.json(
      { data: null, error: '作成に失敗しました' },
      { status: 500 }
    )
  }
}