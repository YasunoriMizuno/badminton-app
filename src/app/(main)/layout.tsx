// src/app/(main)/layout.tsx
// ログイン後の共通レイアウト

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getActiveCircleId } from '@/lib/circle'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // アクティブなサークルIDをCookieから取得
  const circleId = await getActiveCircleId()
  if (!circleId) redirect('/select-circle')

  // ユーザーがそのサークルに所属しているか確認
  const membership = await prisma.circleMember.findUnique({
    where: { circle_id_user_id: { circle_id: circleId, user_id: user.id } },
  })
  if (!membership) redirect('/select-circle')

  const isAdmin = membership.role === 'admin'

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar isAdmin={isAdmin} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userEmail={user.email ?? ''} />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
        <MobileNav isAdmin={isAdmin} />
      </div>
    </div>
  )
}