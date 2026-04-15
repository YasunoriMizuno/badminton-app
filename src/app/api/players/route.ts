import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'
import { getActiveCircleId } from '@/lib/circle'

export async function GET() {
  try {
    const circleId = await getActiveCircleId()
    if (!circleId) return err('サークルが選択されていません', 400)

    const players = await prisma.player.findMany({
      where: { circle_id: circleId },
      orderBy: { created_at: 'asc' },
    })
    return ok(players)
  } catch (error) {
    console.error('[GET /api/players]', error)
    return err('取得に失敗しました')
  }
}

export async function POST(request: Request) {
  try {
    const circleId = await getActiveCircleId()
    if (!circleId) return err('サークルが選択されていません', 400)

    const body = await request.json()
    const { name, level, gender } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return err('名前は必須です', 400)
    }

    const player = await prisma.player.create({
      data: {
        name: name.trim(),
        level: level ?? null,
        gender: gender ?? null,
        circle_id: circleId,
      },
    })

    return ok(player, 201)
  } catch (error) {
    console.error('[POST /api/players]', error)
    return err('作成に失敗しました')
  }
}
