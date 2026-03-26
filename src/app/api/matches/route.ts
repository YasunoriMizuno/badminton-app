// src/app/api/matches/route.ts
// GET: 試合一覧取得
// POST: 試合新規作成

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 試合一覧取得
export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { played_at: 'desc' },
      include: { court: true },
    })
    return NextResponse.json({ data: matches, error: null })
  } catch (error) {
    console.error('[GET /api/matches]', error)
    return NextResponse.json(
      { data: null, error: '取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 試合新規作成
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      court_id,
      match_type,
      team1_player_ids,
      team2_player_ids,
      winner_team,
      score,
      played_at,
    } = body

    if (!court_id || !match_type || !team1_player_ids || !team2_player_ids) {
      return NextResponse.json(
        { data: null, error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    const match = await prisma.match.create({
      data: {
        court_id,
        match_type,
        team1_player_ids,
        team2_player_ids,
        winner_team: winner_team ?? null,
        score: score ?? null,
        played_at: played_at ? new Date(played_at) : new Date(),
      },
      include: { court: true },
    })

    return NextResponse.json({ data: match, error: null }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/matches]', error)
    return NextResponse.json(
      { data: null, error: '作成に失敗しました' },
      { status: 500 }
    )
  }
}