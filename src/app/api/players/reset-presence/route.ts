import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'

export async function POST() {
  try {
    await prisma.player.updateMany({
      data: { is_present: false },
    })
    return ok({ ok: true })
  } catch (error) {
    console.error('[POST /api/players/reset-presence]', error)
    return err('リセットに失敗しました')
  }
}
