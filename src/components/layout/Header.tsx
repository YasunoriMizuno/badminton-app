// src/components/layout/Header.tsx
// ヘッダーコンポーネント

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PAGE_TITLES: Record<string, string> = {
  '/players':  '参加者管理',
  '/matching': 'コート振り分け',
  '/result':   '試合結果入力',
  '/ranking':  'ランキング',
}

type Props = {
  userEmail: string
}

export function Header({ userEmail }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? ''

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="flex min-h-14 shrink-0 items-center justify-between border-b-2 border-brand-yellow/60 bg-white px-4 pt-[env(safe-area-inset-top)] md:px-6">
      {/* ページタイトル */}
      <h1 className="min-w-0 flex-1 truncate pr-2 text-base font-bold text-gray-900 sm:text-lg">{pageTitle}</h1>

      {/* ユーザー情報＋ログアウト */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[200px]">
          {userEmail}
        </span>
        <button
          onClick={handleLogout}
          className="btn-ghost text-gray-500 hover:text-red-600 px-2 py-2"
          title="ログアウト"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}