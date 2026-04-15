import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/rbac'
import { getActiveCircleId } from '@/lib/circle'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileNav } from '@/components/layout/MobileNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const circleId = await getActiveCircleId()
  if (!circleId) redirect('/select-circle')

  const role = await getUserRole(user.id, circleId)
  if (role !== 'admin') redirect('/players')

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar isAdmin={true} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userEmail={user.email ?? ''} />
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          {children}
        </main>
        <MobileNav isAdmin={true} />
      </div>
    </div>
  )
}
