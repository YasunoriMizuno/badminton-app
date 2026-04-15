import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'
import { getUserRole } from '@/lib/rbac'

type Params = { params: Promise<{ id: string; memberId: string }> }

async function authorize(userId: string, circleId: number) {
  const role = await getUserRole(userId, circleId)
  return role === 'admin'
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id, memberId } = await params
    const circleId = parseId(id)
    const memberIdNum = parseId(memberId)
    if (circleId === null || memberIdNum === null) return err('不正なIDです', 400)

    if (!await authorize(user.id, circleId)) return err('権限がありません', 403)

    const { role } = await request.json()
    if (!['admin', 'member'].includes(role)) return err('不正なロールです', 400)

    // 自分自身の admin 権限を外せないようにする
    const target = await prisma.circleMember.findUnique({ where: { id: memberIdNum } })
    if (!target) return err('メンバーが見つかりません', 404)
    if (target.user_id === user.id && role !== 'admin') {
      return err('自分自身の管理者権限は外せません', 400)
    }

    const updated = await prisma.circleMember.update({
      where: { id: memberIdNum },
      data: { role },
      include: { user: true },
    })
    return ok(updated)
  } catch (error) {
    console.error('[PATCH /api/admin/circles/:id/members/:memberId]', error)
    return err('更新に失敗しました')
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id, memberId } = await params
    const circleId = parseId(id)
    const memberIdNum = parseId(memberId)
    if (circleId === null || memberIdNum === null) return err('不正なIDです', 400)

    if (!await authorize(user.id, circleId)) return err('権限がありません', 403)

    // 自分自身は削除不可
    const target = await prisma.circleMember.findUnique({ where: { id: memberIdNum } })
    if (!target) return err('メンバーが見つかりません', 404)
    if (target.user_id === user.id) return err('自分自身は削除できません', 400)

    await prisma.circleMember.delete({ where: { id: memberIdNum } })
    return ok({ id: memberIdNum })
  } catch (error) {
    console.error('[DELETE /api/admin/circles/:id/members/:memberId]', error)
    return err('削除に失敗しました')
  }
}
