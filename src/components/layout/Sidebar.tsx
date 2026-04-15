'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

type Props = { isAdmin?: boolean }

export function Sidebar({ isAdmin = false }: Props) {
  const pathname = usePathname()
  const visibleItems = isAdmin ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.href !== '/admin')

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-brand-teal shadow-sm overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/racket.png" alt="ラケット" width={30} height={30} className="object-contain" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-gray-900">Badminton</p>
          <p className="text-sm font-bold leading-tight text-brand-teal">Manager</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150',
                isActive
                  ? 'bg-brand-yellow/15 text-gray-900 border-l-[3px] border-brand-yellow'
                  : 'text-gray-600 hover:bg-brand-mint/50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  isActive ? 'text-brand-yellow-dark' : 'text-gray-400 group-hover:text-brand-teal'
                )}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <p className="text-xs text-gray-400 truncate">{item.description}</p>
              </div>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-xs text-gray-500">ポートフォリオ作品 v1.0.0</p>
      </div>
    </aside>
  )
}