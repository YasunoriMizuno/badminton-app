import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function selectCircleAction(formData: FormData) {
  'use server'
  const circleId = formData.get('circle_id') as string
  redirect(`/api/circle/select?id=${circleId}`)
}

export default async function SelectCirclePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // サークルが0件 = まだセットアップが必要
  const circleCount = await prisma.circle.count()
  if (circleCount === 0) redirect('/setup')

  const memberships = await prisma.circleMember.findMany({
    where: { user_id: user.id },
    include: { circle: true },
    orderBy: { created_at: 'asc' },
  })

  if (memberships.length === 0) redirect('/no-circle')

  // サークルが1つだけの場合は自動選択（Route Handler 経由で Cookie をセット）
  if (memberships.length === 1) {
    redirect(`/api/circle/select?id=${memberships[0].circle_id}`)
  }

  return (
    <div className="min-h-screen bg-brand-mint flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand-teal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/shuttlecock.png" alt="シャトル" width={60} height={60} className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">サークルを選択</h1>
          <p className="mt-2 text-sm text-gray-500">活動するサークルを選んでください</p>
        </div>
        <div className="space-y-3">
          {memberships.map((m) => (
            <form key={m.circle_id} action={selectCircleAction}>
              <input type="hidden" name="circle_id" value={m.circle_id} />
              <button
                type="submit"
                className="w-full card text-left hover:border-brand-teal hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-brand-teal">
                      {m.circle.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.role}</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-brand-teal">→</span>
                </div>
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
