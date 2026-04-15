import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ok, err } from '@/lib/api'
import { getUserRole } from '@/lib/rbac'
import { getActiveCircleId } from '@/lib/circle'

async function getAuthorized() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, circleId: null, authorized: false }
  const circleId = await getActiveCircleId()
  if (!circleId) return { user, circleId: null, authorized: false }
  const role = await getUserRole(user.id, circleId)
  return { user, circleId, authorized: role === 'admin' }
}

export async function PATCH(request: Request) {
  try {
    const { user, circleId, authorized } = await getAuthorized()
    if (!user) return err('未認証です', 401)
    if (!authorized || !circleId) return err('権限がありません', 403)

    const { name } = await request.json()
    if (!name?.trim()) return err('名前は必須です', 400)

    const circle = await prisma.circle.update({
      where: { id: circleId },
      data: { name: name.trim() },
    })
    return ok(circle)
  } catch (error) {
    console.error('[PATCH /api/admin/circles]', error)
    return err('更新に失敗しました')
  }
}
