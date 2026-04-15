import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Variant = 'green' | 'yellow' | 'gray'

type Props = {
  variant?: Variant
  children: ReactNode
  className?: string
}

const variantClass: Record<Variant, string> = {
  green: 'badge-green',
  yellow: 'badge-yellow',
  gray: 'badge-gray',
}

export function Badge({ variant = 'gray', children, className }: Props) {
  return (
    <span className={cn(variantClass[variant], className)}>
      {children}
    </span>
  )
}
