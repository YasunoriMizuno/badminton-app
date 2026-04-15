import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Variant = 'solid' | 'soft'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

const sizeClass: Record<Size, string> = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
}

const variantClass: Record<Variant, string> = {
  solid: 'bg-brand-teal text-white',
  soft: 'bg-brand-teal/10 text-brand-teal',
}

export function IconBox({ children, variant = 'solid', size = 'md', className }: Props) {
  return (
    <div className={cn('flex items-center justify-center rounded-xl', sizeClass[size], variantClass[variant], className)}>
      {children}
    </div>
  )
}
