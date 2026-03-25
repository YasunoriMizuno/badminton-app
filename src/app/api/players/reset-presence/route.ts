// src/app/api/players/reset-presence/route.ts
// POST: 全参加者の出席フラグをリセット

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // 全員のis_presentをfalseに更新
    await prisma.player.updateMany({
      data: { is_present: false },
    })

    return NextResponse.json({ data: { ok: true }, error: null })
  } catch (error) {
    console.error('[POST /api/players/reset-presence]', error)
    return NextResponse.json(
      { data: null, error: 'リセットに失敗しました' },
      { status: 500 }
    )
  }
}