'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { CircleCard } from './CircleCard'
import { IconBox } from '@/components/ui'

type Member = {
  id: number
  role: string
  user: { id: string; email: string }
}

type CircleData = {
  id: number
  name: string
  circle_members: Member[]
  _count: { circle_members: number; players: number }
}

type Props = {
  initialCircles: CircleData[]
}

export function AdminClient({ initialCircles }: Props) {
  const [circles, setCircles] = useState<CircleData[]>(initialCircles)

  function handleNameUpdated(id: number, name: string) {
    setCircles((prev) => prev.map((c) => c.id === id ? { ...c, name } : c))
  }

  function handleMemberAdded(circleId: number, member: Member) {
    setCircles((prev) =>
      prev.map((c) => c.id === circleId
        ? {
            ...c,
            circle_members: [...c.circle_members, member],
            _count: { ...c._count, circle_members: c._count.circle_members + 1 },
          }
        : c
      )
    )
  }

  function handleMemberUpdated(circleId: number, memberId: number, role: string) {
    setCircles((prev) =>
      prev.map((c) => c.id === circleId
        ? { ...c, circle_members: c.circle_members.map((m) => m.id === memberId ? { ...m, role } : m) }
        : c
      )
    )
  }

  function handleMemberRemoved(circleId: number, memberId: number) {
    setCircles((prev) =>
      prev.map((c) => c.id === circleId
        ? {
            ...c,
            circle_members: c.circle_members.filter((m) => m.id !== memberId),
            _count: { ...c._count, circle_members: c._count.circle_members - 1 },
          }
        : c
      )
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* ヘッダー */}
      <div className="card flex items-center gap-3">
        <IconBox size="md">
          <ShieldCheck className="h-6 w-6" />
        </IconBox>
        <div>
          <p className="font-bold text-gray-900">管理者パネル</p>
          <p className="text-xs text-gray-500">サークル設定・メンバー管理</p>
        </div>
      </div>

      {circles.map((circle) => (
        <CircleCard
          key={circle.id}
          circle={circle}
          onNameUpdated={(name) => handleNameUpdated(circle.id, name)}
          onMemberAdded={(member) => handleMemberAdded(circle.id, member)}
          onMemberUpdated={(memberId, role) => handleMemberUpdated(circle.id, memberId, role)}
          onMemberRemoved={(memberId) => handleMemberRemoved(circle.id, memberId)}
        />
      ))}
    </div>
  )
}
