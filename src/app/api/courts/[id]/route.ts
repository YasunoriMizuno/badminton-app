// src/app/api/courts/[id]/route.ts
// PATCH: コート更新
// DELETE: コート削除

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type RouteContext = { params: Promise<{ id: string }> }

// コート更新
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

    const { name, match_type } = await request.json()

    const court = await prisma.court.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(match_type !== undefined && { match_type }),
      },
    })

    return NextResponse.json({ data: court, error: null })
  } catch (error) {
    console.error('[PATCH /api/courts/:id]', error)
    return NextResponse.json(
      { data: null, error: '更新に失敗しました' },
      { status: 500 }
    )
  }
}

// コート削除
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

    // 紐づいた試合データを先に削除
    await prisma.match.deleteMany({
      where: { court_id: id },
    })

    // コートを削除
    await prisma.court.delete({ where: { id } })

    return NextResponse.json({ data: { id }, error: null })
  } catch (error) {
    console.error('[DELETE /api/courts/:id]', error)
    return NextResponse.json(
      { data: null, error: '削除に失敗しました' },
      { status: 500 }
    )
  }
}