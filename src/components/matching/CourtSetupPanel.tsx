// src/components/matching/CourtSetupPanel.tsx
// コート設定パネル（コートの追加・削除・種別変更）

'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { Court, MatchType } from '@/types'

type Props = {
  courts: Court[]
  onCourtsUpdated: (courts: Court[]) => void
}

export function CourtSetupPanel({ courts, onCourtsUpdated }: Props) {
  const [newCourtName, setNewCourtName] = useState('')
  const [newMatchType, setNewMatchType] = useState<MatchType>('doubles')
  const [loading, setLoading] = useState(false)

  // コート追加
  async function handleAddCourt(e: React.FormEvent) {
    e.preventDefault()
    if (!newCourtName.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/courts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCourtName.trim(),
          match_type: newMatchType,
        }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      onCourtsUpdated([...courts, data])
      setNewCourtName('')
    } catch {
      alert('コートの追加に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // コート削除
  async function handleDeleteCourt(id: number) {
    if (!confirm('このコートを削除しますか？')) return
    try {
      const res = await fetch(`/api/courts/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onCourtsUpdated(courts.filter((c) => c.id !== id))
    } catch {
      alert('コートの削除に失敗しました')
    }
  }

  // 種別変更
  async function handleChangeMatchType(id: number, match_type: MatchType) {
    try {
      const res = await fetch(`/api/courts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ match_type }),
      })
      if (!res.ok) throw new Error()
      onCourtsUpdated(
        courts.map((c) => (c.id === id ? { ...c, match_type } : c))
      )
    } catch {
      alert('種別の変更に失敗しました')
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-bold text-gray-800">コート設定</h2>

      {/* コート一覧 */}
      {courts.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          コートが登録されていません
        </p>
      ) : (
        <div className="space-y-2">
          {courts.map((court) => (
            <div
              key={court.id}
              className="flex flex-col gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="min-w-0 font-medium text-sm text-gray-800 truncate">
                {court.name}
              </span>
              <div className="flex shrink-0 items-center justify-end gap-3">
                <select
                  value={court.match_type}
                  onChange={(e) =>
                    handleChangeMatchType(court.id, e.target.value as MatchType)
                  }
                  className="rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/35"
                >
                  <option value="doubles">ダブルス</option>
                  <option value="singles">シングルス</option>
                </select>
                <button
                  onClick={() => handleDeleteCourt(court.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* コート追加フォーム */}
      <form
        onSubmit={handleAddCourt}
        className="flex flex-col gap-2 border-t border-gray-100 pt-2 sm:flex-row sm:items-stretch"
      >
        <input
          type="text"
          value={newCourtName}
          onChange={(e) => setNewCourtName(e.target.value)}
          className="input min-w-0 flex-1"
          placeholder="例：コートA"
          required
        />
        <select
          value={newMatchType}
          onChange={(e) => setNewMatchType(e.target.value as MatchType)}
          className="input w-full sm:w-36"
        >
          <option value="doubles">ダブルス</option>
          <option value="singles">シングルス</option>
        </select>
        <button
          type="submit"
          disabled={loading || !newCourtName.trim()}
          className="btn-primary shrink-0 px-4 sm:self-auto"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  )
}