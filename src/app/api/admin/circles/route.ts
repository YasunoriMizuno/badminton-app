import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'
import { isAdmin, getAdminCircleIds } from '@/lib/rbac'

async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return err('未認証です', 401)
    if (!await isAdmin(user.id)) return err('権限がありません', 403)

    const adminCircleIds = await getAdminCircleIds(user.id)
    const circles = await prisma.circle.findMany({
      where: { id: { in: adminCircleIds } },
      orderBy: { created_at: 'asc' },
      include: { groups: true, _count: { select: { circle_members: true, players: true } } },
    })
    return ok(circles)
  } catch (error) {
    console.error('[GET /api/admin/circles]', error)
    return err('取得に失敗しました')
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUser()
    if (!user) return err('未認証です', 401)
    if (!await isAdmin(user.id)) return err('権限がありません', 403)

    const { name } = await request.json()
    if (!name?.trim()) return err('名前は必須です', 400)

    const circle = await prisma.$transaction(async (tx) => {
      const c = await tx.circle.create({ data: { name: name.trim() } })
      await tx.circleMember.create({
        data: { circle_id: c.id, user_id: user.id, role: 'admin' },
      })
      return c
    })

    return ok(circle, 201)
  } catch (error) {
    console.error('[POST /api/admin/circles]', error)
    return err('作成に失敗しました')
  }
}
