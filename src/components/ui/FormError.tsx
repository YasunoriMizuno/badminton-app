type Props = {
  message: string | null
  className?: string
}

export function FormError({ message, className }: Props) {
  if (!message) return null
  return (
    <div className={`p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 ${className ?? ''}`}>
      {message}
    </div>
  )
}
