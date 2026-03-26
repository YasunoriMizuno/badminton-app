// src/app/api/matches/[id]/route.ts
// PATCH: 試合更新
// DELETE: 試合削除

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

// 試合更新
export async function PATCH(request: Request, { params }: Params) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { data: null, error: '不正なIDです' },
        { status: 400 }
      )
    }

    const { winner_team, score } = await request.json()

    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(winner_team !== undefined && { winner_team }),
        ...(score !== undefined && { score }),
      },
      include: { court: true },
    })

    return NextResponse.json({ data: match, error: null })
  } catch (error) {
    console.error('[PATCH /api/matches/:id]', error)
    return NextResponse.json(
      { data: null, error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 試合削除
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const id = Number(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { data: null, error: '不正なIDです' },
        { status: 400 }
      )
    }

    await prisma.match.delete({ where: { id } })
    return NextResponse.json({ data: { id }, error: null })
  } catch (error) {
    console.error('[DELETE /api/matches/:id]', error)
    return NextResponse.json(
      { data: null, error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}