// src/app/(main)/layout.tsx
// ログイン後の共通レイアウト

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
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

  if (!user) {
    redirect('/auth/login')
  }

  // admin ロールを1件でも持っているか確認
  const adminCount = await prisma.circleMember.count({
    where: { user_id: user.id, role: 'admin' },
  })
  const isAdmin = adminCount > 0

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