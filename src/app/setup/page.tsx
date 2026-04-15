import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function setupAction(formData: FormData) {
  'use server'
  const circleName = (formData.get('circle_name') as string)?.trim()
  if (!circleName) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // すでにサークルが存在する場合はスキップ
  const count = await prisma.circle.count()
  if (count > 0) redirect('/select-circle')

  await prisma.$transaction(async (tx) => {
    // public.users に存在しない場合は先に作成（DBリセット後対応）
    await tx.user.upsert({
      where: { id: user.id },
      update: { email: user.email! },
      create: { id: user.id, email: user.email! },
    })
    const circle = await tx.circle.create({
      data: { name: circleName },
    })
    await tx.circleMember.create({
      data: { circle_id: circle.id, user_id: user.id, role: 'admin' },
    })
  })

  redirect('/select-circle')
}

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-brand-mint flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand-teal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/shuttlecock.png" alt="シャトル" width={60} height={60} className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">初期設定</h1>
          <p className="mt-2 text-sm text-gray-500">
            最初のサークルを作成してください。<br />
            あなたがそのサークルの管理者になります。
          </p>
        </div>
        <form action={setupAction} className="card space-y-4">
          <div>
            <label className="label" htmlFor="circle_name">
              サークル名
            </label>
            <input
              id="circle_name"
              name="circle_name"
              type="text"
              className="input"
              placeholder="例：バドミントン同好会"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            サークルを作成して始める
          </button>
        </form>
      </div>
    </div>
  )
}
