// src/app/(main)/admin/page.tsx
// 管理者専用ページ

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getAdminCircleIds, isAdmin } from '@/lib/rbac'
import { AdminClient } from '@/components/admin/AdminClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // admin ロールがない場合はトップにリダイレクト
  const admin = await isAdmin(user.id)
  if (!admin) redirect('/')

  const adminCircleIds = await getAdminCircleIds(user.id)

  const circles = await prisma.circle.findMany({
    where: { id: { in: adminCircleIds } },
    orderBy: { created_at: 'asc' },
    include: {
      groups: true,
      _count: { select: { circle_members: true, players: true } },
    },
  })

  return <AdminClient initialCircles={circles} />
}
