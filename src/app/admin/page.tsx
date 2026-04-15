import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getUserRole } from '@/lib/rbac'
import { getActiveCircleId } from '@/lib/circle'
import { AdminClient } from '@/components/admin/AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const circleId = await getActiveCircleId()
  if (!circleId) redirect('/select-circle')

  // アクティブなサークルの admin かチェック
  const role = await getUserRole(user.id, circleId)
  if (role !== 'admin') redirect('/players')

  const circles = await prisma.circle.findMany({
    where: { id: circleId },
    include: {
      circle_members: { include: { user: true }, orderBy: { created_at: 'asc' } },
      _count: { select: { circle_members: true, players: true } },
    },
  })

  return <AdminClient initialCircles={circles} />
}
