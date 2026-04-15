import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id } = await params
    const circleId = parseId(id)
    if (circleId === null) return err('不正なIDです', 400)

    const members = await prisma.circleMember.findMany({
      where: { circle_id: circleId },
      include: { user: true },
      orderBy: { created_at: 'asc' },
    })
    return ok(members)
  } catch (error) {
    console.error('[GET /api/admin/circles/:id/members]', error)
    return err('取得に失敗しました')
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id } = await params
    const circleId = parseId(id)
    if (circleId === null) return err('不正なIDです', 400)

    const { email, role } = await request.json()
    if (!email?.trim()) return err('メールアドレスは必須です', 400)

    const validRoles = ['admin', 'leader', 'member']
    if (!validRoles.includes(role)) return err('不正なロールです', 400)

    const targetUser = await prisma.user.findUnique({ where: { email: email.trim() } })
    if (!targetUser) return err('ユーザーが見つかりません。先にアカウント登録が必要です。', 404)

    const member = await prisma.circleMember.upsert({
      where: { circle_id_user_id: { circle_id: circleId, user_id: targetUser.id } },
      update: { role },
      create: { circle_id: circleId, user_id: targetUser.id, role },
    })
    return ok(member, 201)
  } catch (error) {
    console.error('[POST /api/admin/circles/:id/members]', error)
    return err('追加に失敗しました')
  }
}
