'use client'

import { useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import { CircleCard } from './CircleCard'
import { Button, EmptyState, IconBox } from '@/components/ui'

type Group = { id: number; name: string }
type CircleData = {
  id: number
  name: string
  groups: Group[]
  _count: { circle_members: number; players: number }
}

type Props = {
  initialCircles: CircleData[]
}

export function AdminClient({ initialCircles }: Props) {
  const [circles, setCircles] = useState<CircleData[]>(initialCircles)
  const [newCircleName, setNewCircleName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAddCircle(e: React.FormEvent) {
    e.preventDefault()
    if (!newCircleName.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/circles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCircleName.trim() }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      setCircles((prev) => [...prev, { ...data, groups: [], _count: { circle_members: 1, players: 0 } }])
      setNewCircleName('')
    } catch {
      alert('サークルの作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  function handleGroupAdded(circleId: number, group: Group) {
    setCircles((prev) =>
      prev.map((c) => c.id === circleId ? { ...c, groups: [...c.groups, group] } : c)
    )
  }

  function handleMemberAdded(circleId: number) {
    setCircles((prev) =>
      prev.map((c) => c.id === circleId
        ? { ...c, _count: { ...c._count, circle_members: c._count.circle_members + 1 } }
        : c
      )
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* ヘッダー */}
      <div className="card flex items-center gap-3">
        <IconBox size="md">
          <ShieldCheck className="h-6 w-6" />
        </IconBox>
        <div>
          <p className="font-bold text-gray-900">管理者パネル</p>
          <p className="text-xs text-gray-500">サークル・グループの作成とメンバー管理</p>
        </div>
      </div>

      {/* サークル作成フォーム */}
      <div className="card">
        <h2 className="mb-4 font-bold text-gray-800">新しいサークルを作成</h2>
        <form onSubmit={handleAddCircle} className="flex gap-2">
          <input
            value={newCircleName}
            onChange={(e) => setNewCircleName(e.target.value)}
            className="input flex-1"
            placeholder="例：○○大学バドミントン部"
          />
          <Button type="submit" loading={loading} disabled={!newCircleName.trim()} className="shrink-0 px-5 gap-1">
            <Plus className="h-4 w-4" />作成
          </Button>
        </form>
      </div>

      {/* サークル一覧 */}
      {circles.length === 0 ? (
        <EmptyState title="サークルがまだありません" description="上のフォームから作成してください" />
      ) : (
        <div className="space-y-4">
          {circles.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              onGroupAdded={handleGroupAdded}
              onMemberAdded={handleMemberAdded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
