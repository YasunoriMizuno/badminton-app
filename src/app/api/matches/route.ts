import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'
import { getActiveCircleId } from '@/lib/circle'

export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { played_at: 'desc' },
      include: { court: true },
    })
    return ok(matches)
  } catch (error) {
    console.error('[GET /api/matches]', error)
    return err('取得に失敗しました')
  }
}

export async function POST(request: Request) {
  try {
    const circleId = await getActiveCircleId()
    if (!circleId) return err('サークルが選択されていません', 400)

    const body = await request.json()
    const { court_id, match_type, team1_player_ids, team2_player_ids, winner_team, score, played_at } = body

    if (!court_id || !match_type || !team1_player_ids || !team2_player_ids) {
      return err('必須項目が不足しています', 400)
    }

    const match = await prisma.match.create({
      data: {
        circle_id: circleId,
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

    return ok(match, 201)
  } catch (error) {
    console.error('[POST /api/matches]', error)
    return err('作成に失敗しました')
  }
}
