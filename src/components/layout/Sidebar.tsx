// src/components/layout/Sidebar.tsx
// サイドバーナビゲーション

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Shuffle, Trophy, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    href: '/players',
    label: '参加者管理',
    icon: Users,
    description: '出席者の選択・登録',
  },
  {
    href: '/matching',
    label: 'コート振り分け',
    icon: Shuffle,
    description: '自動でペアを振り分け',
  },
  {
    href: '/result',
    label: '試合結果入力',
    icon: Trophy,
    description: '勝敗・スコアを記録',
  },
  {
    href: '/ranking',
    label: 'ランキング',
    icon: BarChart3,
    description: '勝率・成績を確認',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 shrink-0">
      {/* ロゴ */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <span className="text-2xl">🏸</span>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">Badminton</p>
          <p className="font-bold text-green-600 text-sm leading-tight">Manager</p>
        </div>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group',
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0',
                  isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <p className="text-xs text-gray-400 truncate">{item.description}</p>