import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'
import { getActiveCircleId } from '@/lib/circle'

export async function POST() {
  try {
    const circleId = await getActiveCircleId()
    if (!circleId) return err('サークルが選択されていません', 400)

    await prisma.player.updateMany({
      where: { circle_id: circleId },
      data: { is_present: false },
    })
    return ok({ ok: true })
  } catch (error) {
    console.error('[POST /api/players/reset-presence]', error)
    return err('リセットに失敗しました')
  }
}
