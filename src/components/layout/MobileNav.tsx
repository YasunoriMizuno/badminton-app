'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

type Props = { isAdmin?: boolean }

export function MobileNav({ isAdmin = false }: Props) {
  const pathname = usePathname()
  const visibleItems = isAdmin ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.href !== '/admin')

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-gray-200 bg-white pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 md:hidden"
      aria-label="メインナビゲーション"
    >
      <div className="flex h-14 items-stretch justify-around gap-1 px-1">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mx-0.5 flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1 transition-all duration-200 active:scale-95',
                isActive
                  ? 'bg-brand-yellow/20 text-gray-900 border-b-2 border-brand-yellow'
                  : 'text-gray-500 active:bg-brand-mint/60'
              )}
            >
              <Icon
                className={cn('h-5 w-5 shrink-0', isActive ? 'text-brand-yellow-dark' : 'text-gray-400')}
                aria-hidden
              />
              <span
                className={cn(
                  'max-w-full truncate px-0.5 text-[10px] font-semibold leading-tight',
                  isActive && 'text-gray-900'
                )}
              >
                {item.shortLabel}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
