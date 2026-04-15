import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'
import { canManageGroup } from '@/lib/rbac'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id } = await params
    const groupId = parseId(id)
    if (groupId === null) return err('不正なIDです', 400)

    if (!await canManageGroup(user.id, groupId)) return err('権限がありません', 403)

    const members = await prisma.groupMember.findMany({
      where: { group_id: groupId },
      include: { player: true },
      orderBy: { created_at: 'asc' },
    })
    return ok(members)
  } catch (error) {
    console.error('[GET /api/admin/groups/:id/members]', error)
    return err('取得に失敗しました')
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id } = await params
    const groupId = parseId(id)
    if (groupId === null) return err('不正なIDです', 400)

    if (!await canManageGroup(user.id, groupId)) return err('権限がありません', 403)

    const { player_id, role } = await request.json()
    if (!player_id) return err('player_idは必須です', 400)

    const validRoles = ['leader', 'member']
    const memberRole = validRoles.includes(role) ? role : 'member'

    const member = await prisma.groupMember.upsert({
      where: { group_id_player_id: { group_id: groupId, player_id: Number(player_id) } },
      update: { role: memberRole },
      create: { group_id: groupId, player_id: Number(player_id), role: memberRole },
    })
    return ok(member, 201)
  } catch (error) {
    console.error('[POST /api/admin/groups/:id/members]', error)
    return err('追加に失敗しました')
  }
}
