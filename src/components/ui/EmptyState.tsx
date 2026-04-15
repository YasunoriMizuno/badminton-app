type Props = {
  title: string
  description?: string
}

export function EmptyState({ title, description }: Props) {
  return (
    <div className="card text-center py-10 text-gray-400">
      <p>{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  )
}
