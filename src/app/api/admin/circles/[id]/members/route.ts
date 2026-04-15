import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'
import { getUserRole } from '@/lib/rbac'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id } = await params
    const circleId = parseId(id)
    if (circleId === null) return err('不正なIDです', 400)

    const role = await getUserRole(user.id, circleId)
    if (role !== 'admin') return err('権限がありません', 403)

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

    const userRole = await getUserRole(user.id, circleId)
    if (userRole !== 'admin') return err('権限がありません', 403)

    const { email, role } = await request.json()
    if (!email?.trim()) return err('メールアドレスは必須です', 400)

    const validRoles = ['admin', 'leader', 'member']
    if (!validRoles.includes(role)) return err('不正なロールです', 400)

    // Supabase Auth からメールでユーザーを検索
    const adminClient = createAdminClient()
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers()
    if (authError) return err('ユーザー検索に失敗しました')

    const authUser = authUsers.users.find((u) => u.email === email.trim())
    if (!authUser) return err('ユーザーが見つかりません。先にアカウント登録が必要です。', 404)

    // public.users に存在しない場合は自動作成
    await prisma.user.upsert({
      where: { id: authUser.id },
      update: { email: authUser.email! },
      create: { id: authUser.id, email: authUser.email! },
    })

    const member = await prisma.circleMember.upsert({
      where: { circle_id_user_id: { circle_id: circleId, user_id: authUser.id } },
      update: { role },
      create: { circle_id: circleId, user_id: authUser.id, role },
    })
    return ok(member, 201)
  } catch (error) {
    console.error('[POST /api/admin/circles/:id/members]', error)
    return err('追加に失敗しました')
  }
}
