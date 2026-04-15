'use client'

import { useState } from 'react'
import { Pencil, Check, X, UserPlus, Users, Trash2 } from 'lucide-react'
import { Button, FormError, Badge } from '@/components/ui'

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
  circle: CircleData
  onNameUpdated: (name: string) => void
  onMemberAdded: (member: Member) => void
  onMemberUpdated: (memberId: number, role: string) => void
  onMemberRemoved: (memberId: number) => void
}

export function CircleCard({ circle, onNameUpdated, onMemberAdded, onMemberUpdated, onMemberRemoved }: Props) {
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(circle.name)
  const [nameLoading, setNameLoading] = useState(false)

  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('member')
  const [memberLoading, setMemberLoading] = useState(false)
  const [memberError, setMemberError] = useState<string | null>(null)
  const [memberSuccess, setMemberSuccess] = useState(false)

  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleSaveName() {
    if (!editName.trim() || editName === circle.name) { setEditing(false); return }
    setNameLoading(true)
    try {
      const res = await fetch('/api/admin/circles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (!res.ok) throw new Error()
      onNameUpdated(editName.trim())
      setEditing(false)
    } catch {
      alert('更新に失敗しました')
    } finally {
      setNameLoading(false)
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
      onMemberAdded(json.data)
    } catch {
      setMemberError('追加に失敗しました')
    } finally {
      setMemberLoading(false)
    }
  }

  async function handleRoleChange(memberId: number, newRole: string) {
    setUpdatingId(memberId)
    try {
      const res = await fetch(`/api/admin/circles/${circle.id}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const json = await res.json()
      if (!res.ok) { alert(json.error); return }
      onMemberUpdated(memberId, newRole)
    } catch {
      alert('更新に失敗しました')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleRemoveMember(memberId: number) {
    if (!confirm('このメンバーを削除しますか？')) return
    setDeletingId(memberId)
    try {
      const res = await fetch(`/api/admin/circles/${circle.id}/members/${memberId}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!res.ok) { alert(json.error); return }
      onMemberRemoved(memberId)
    } catch {
      alert('削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="card space-y-6">
      {/* サークル名 */}
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600">サークル名</p>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveName()
                if (e.key === 'Escape') { setEditing(false); setEditName(circle.name) }
              }}
            />
            <Button onClick={handleSaveName} loading={nameLoading} className="px-3 py-2">
              <Check className="h-4 w-4" />
            </Button>
            <button
              onClick={() => { setEditing(false); setEditName(circle.name) }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{circle.name}</span>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-gray-400 hover:text-brand-teal"
              title="名前を変更"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-400">
          メンバー {circle._count.circle_members}人 ・ 参加者 {circle._count.players}人
        </p>
      </div>

      {/* メンバー一覧 */}
      <div>
        <p className="mb-3 text-sm font-semibold text-gray-600 flex items-center gap-1.5">
          <Users className="h-4 w-4" /> メンバー一覧
        </p>
        <div className="space-y-2">
          {circle.circle_members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
              <span className="flex-1 truncate text-sm text-gray-700">{m.user.email}</span>
              <select
                value={m.role}
                onChange={(e) => handleRoleChange(m.id, e.target.value)}
                disabled={updatingId === m.id}
                className="input w-24 py-1 text-xs"
              >
                <option value="admin">admin</option>
                <option value="member">member</option>
              </select>
              <button
                onClick={() => handleRemoveMember(m.id)}
                disabled={deletingId === m.id}
                className="p-1.5 text-gray-300 hover:text-red-500 disabled:opacity-40 transition-colors"
                title="削除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* メンバー招待 */}
      <div>
        <p className="mb-2 text-sm font-semibold text-gray-600 flex items-center gap-1.5">
          <UserPlus className="h-4 w-4" /> メンバーを招待
        </p>
        <FormError message={memberError} className="mb-2 text-xs" />
        {memberSuccess && (
          <p className="mb-2 text-xs text-brand-teal font-medium">✓ メンバーを追加しました</p>
        )}
        <form onSubmit={handleAddMember} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            className="input flex-1 text-sm"
            placeholder="メールアドレス"
            required
          />
          <select
            value={memberRole}
            onChange={(e) => setMemberRole(e.target.value)}
            className="input text-sm sm:w-28"
          >
            <option value="admin">admin</option>
            <option value="member">member</option>
          </select>
          <Button
            type="submit"
            loading={memberLoading}
            disabled={!memberEmail.trim()}
            className="px-4 text-sm gap-1.5 shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5" />招待
          </Button>
        </form>
        <p className="mt-2 text-xs text-gray-400">
          ※ 招待するユーザーは先にアカウント登録が必要です
        </p>
      </div>
    </div>
  )
}
