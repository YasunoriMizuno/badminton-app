import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Params) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return err('未認証です', 401)

    const { id } = await params
    const circleId = parseId(id)
    if (circleId === null) return err('不正なIDです', 400)

    const { name } = await request.json()
    if (!name?.trim()) return err('名前は必須です', 400)

    const group = await prisma.group.create({
      data: { circle_id: circleId, name: name.trim() },
    })
    return ok(group, 201)
  } catch (error) {
    console.error('[POST /api/admin/circles/:id/groups]', error)
    return err('作成に失敗しました')
  }
}
