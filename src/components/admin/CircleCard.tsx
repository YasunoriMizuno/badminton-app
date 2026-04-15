'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, UserPlus, Users, Layers } from 'lucide-react'
import { Button, FormError, IconBox } from '@/components/ui'

type Group = { id: number; name: string }
type CircleData = {
  id: number
  name: string
  groups: Group[]
  _count: { circle_members: number; players: number }
}

type Props = {
  circle: CircleData
  onGroupAdded: (circleId: number, group: Group) => void
  onMemberAdded: (circleId: number) => void
}

export function CircleCard({ circle, onGroupAdded, onMemberAdded }: Props) {
  const [open, setOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [groupLoading, setGroupLoading] = useState(false)
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('member')
  const [memberLoading, setMemberLoading] = useState(false)
  const [memberError, setMemberError] = useState<string | null>(null)
  const [memberSuccess, setMemberSuccess] = useState(false)

  async function handleAddGroup(e: React.FormEvent) {
    e.preventDefault()
    if (!newGroupName.trim()) return
    setGroupLoading(true)
    try {
      const res = await fetch(`/api/admin/circles/${circle.id}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName.trim() }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      onGroupAdded(circle.id, data)
      setNewGroupName('')
    } catch {
      alert('グループの作成に失敗しました')
    } finally {
      setGroupLoading(false)
    }
  }

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    setMemberError(null)
    setMemberSuccess(false)
    if (!memberEmail.trim()) return
    setMemberLoading(true)
    try {
      const res = await fetch(`/api/admin/circles/${circle.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: memberEmail.trim(), role: memberRole }),
      })
      const json = await res.json()
      if (!res.ok) { setMemberError(json.error); return }
      setMemberEmail('')
      setMemberRole('member')
      setMemberSuccess(true)
      onMemberAdded(circle.id)
    } catch {
      setMemberError('追加に失敗しました')
    } finally {
      setMemberLoading(false)
    }
  }

  return (
    <div className="card border-2 border-gray-200">
      {/* ヘッダー */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <IconBox variant="soft" size="sm">
            <Layers className="h-5 w-5" />
          </IconBox>
          <div>
            <p className="font-bold text-gray-900">{circle.name}</p>
            <p className="text-xs text-gray-400">
              グループ {circle.groups.length}個 ・ メンバー {circle._count.circle_members}人
            </p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      {open && (
        <div className="mt-4 space-y-5 border-t border-gray-100 pt-4">
          {/* グループ一覧 */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <Layers className="h-4 w-4" /> グループ
            </p>
            {circle.groups.length === 0 ? (
              <p className="text-xs text-gray-400">グループがありません</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-3">
                {circle.groups.map((g) => (
                  <span key={g.id} className="rounded-full border border-brand-teal/30 bg-brand-mint px-3 py-1 text-xs font-medium text-brand-teal-dark">
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <form onSubmit={handleAddGroup} className="flex gap-2">
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="input flex-1 text-sm py-1.5"
                placeholder="例：初級クラス"
              />
              <Button type="submit" loading={groupLoading} disabled={!newGroupName.trim()} className="px-3 py-1.5 text-sm gap-1">
                <Plus className="h-3.5 w-3.5" />追加
              </Button>
            </form>
          </div>

          {/* メンバー追加 */}
          <div>
            <p className="mb-2 text-sm font-semibold text-gray-600 flex items-center gap-1.5">
              <Users className="h-4 w-4" /> メンバーを招待
            </p>
            <FormError message={memberError} className="mb-2 text-xs" />
            {memberSuccess && <p className="mb-2 text-xs text-brand-teal">✓ メンバーを追加しました</p>}
            <form onSubmit={handleAddMember} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="input flex-1 text-sm py-1.5"
                placeholder="メールアドレス"
                required
              />
              <select value={memberRole} onChange={(e) => setMemberRole(e.target.value)} className="input w-full text-sm py-1.5 sm:w-32">
                <option value="admin">admin</option>
                <option value="leader">leader</option>
                <option value="member">member</option>
              </select>
              <Button type="submit" loading={memberLoading} disabled={!memberEmail.trim()} className="px-3 py-1.5 text-sm gap-1 shrink-0">
                <UserPlus className="h-3.5 w-3.5" />招待
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
