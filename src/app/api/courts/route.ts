// src/app/api/courts/route.ts
// GET: コート一覧取得
// POST: コート新規作成

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// コート一覧取得
export async function GET() {
  try {
    const courts = await prisma.court.findMany({
      orderBy: { created_at: 'asc' },
    })
    return NextResponse.json({ data: courts, error: null })
  } catch (error) {
    console.error('[GET /api/courts]', error)
    return NextResponse.json(
      { data: null, error: '取得に失敗しました' },
      { status: 500 }
    )
  }
}

// コート新規作成
export async function POST(request: Request) {
  try {
    const { name, match_type } = await request.json()

    if (!name || !match_type) {
      return NextResponse.json(
        { data: null, error: '名前と種別は必須です' },
        { status: 400 }
      )
    }

    const court = await prisma.court.create({
      data: { name: name.trim(), match_type },
    })

    return NextResponse.json({ data: court, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/courts]', error)
    return NextResponse.json(
      { data: null, error: '作成に失敗しました' },
      { status: 500 }
    )
  }
}