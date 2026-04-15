import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import LogoutButton from './LogoutButton'

export default async function NoCirclePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // サークルが0件 = まだセットアップが必要
  const circleCount = await prisma.circle.count()
  if (circleCount === 0) redirect('/setup')

  return (
    <div className="min-h-screen bg-brand-mint flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand-teal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/shuttlecock.png" alt="シャトル" width={60} height={60} className="object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">サークルに未所属です</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          まだどのサークルにも所属していません。<br />
          サークルの管理者に招待してもらってください。
        </p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
