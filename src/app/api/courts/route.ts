import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'

export async function GET() {
  try {
    const courts = await prisma.court.findMany({
      orderBy: { created_at: 'asc' },
    })
    return ok(courts)
  } catch (error) {
    console.error('[GET /api/courts]', error)
    return err('取得に失敗しました')
  }
}

export async function POST(request: Request) {
  try {
    const { name, match_type } = await request.json()

    if (!name || !match_type) return err('名前と種別は必須です', 400)

    const court = await prisma.court.create({
      data: { name: name.trim(), match_type },
    })

    return ok(court, 201)
  } catch (error) {
    console.error('[POST /api/courts]', error)
    return err('作成に失敗しました')
  }
}
