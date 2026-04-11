// src/app/api/players/[id]/route.ts
// PATCH: 参加者更新
// DELETE: 参加者削除

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

// 参加者更新
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { data: null, error: '不正なIDです' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, level, is_present } = body

    const player = await prisma.player.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(level !== undefined && { level }),
        ...(is_present !== undefined && { is_present }),
      },
    })

    return NextResponse.json({ data: player, error: null })
  } catch (error) {
    console.error('[PATCH /api/players/:id]', error)
    return NextResponse.json(
      { data: null, error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 参加者削除
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = Number(idParam)
    if (isNaN(id)) {
      return NextResponse.json(
        { data: null, error: '不正なIDです' },
        { status: 400 }
      )
    }

    await prisma.player.delete({ where: { id } })
    return NextResponse.json({ data: { id }, error: null })
  } catch (error) {
    console.error('[DELETE /api/players/:id]', error)
    return NextResponse.json(
      { data: null, error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}