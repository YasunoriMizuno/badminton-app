import type { ReactNode } from 'react'

type Props = {
  icon?: ReactNode
  children: ReactNode
}

export function SectionHeading({ icon, children }: Props) {
  return (
    <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
      {icon && (
        <span className="text-brand-teal flex items-center">{icon}</span>
      )}
      {children}
    </h2>
  )
}
