// src/components/players/PlayerAddForm.tsx
// 参加者追加フォーム

'use client'

import { useState } from 'react'
import { UserPlus, Loader2 } from 'lucide-react'
import type { Player } from '@/types'

type Props = {
  onPlayerAdded: (player: Player) => void
}

export function PlayerAddForm({ onPlayerAdded }: Props) {
  const [name, setName] = useState('')
  const [level, setLevel] = useState<string>('')
  const [gender, setGender] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          level: level ? Number(level) : null,
          gender: gender || null, 
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '追加に失敗しました')
      }

      const { data } = await res.json()
      onPlayerAdded(data)
      setName('')
      setLevel('')
      setGender('') 
    } catch (err) {
      setError(err instanceof Error ? err.message : '追加に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-green-600" />
        参加者を追加
      </h2>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* 名前 */}
        <div className="flex-1">
          <label htmlFor="playerName" className="label">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="例：田中 太郎"
            required
          />
        </div>

        {/* レベル */}
        <div className="w-full sm:w-36">
          <label htmlFor="playerLevel" className="label">
            レベル（任意）
          </label>
          <select
            id="playerLevel"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="input"
          >
            <option value="">未設定</option>
            <option value="1">1（初心者）</option>
            <option value="2">2（初級）</option>
            <option value="3">3（中級）</option>
            <option value="4">4（上級）</option>
            <option value="5">5（エキスパート）</option>
          </select>
        </div>
        {/* 性別 */}
<div className="w-full sm:w-36">
  <label htmlFor="playerGender" className="label">
    性別（任意）
  </label>
  <select
    id="playerGender"
    value={gender}
    onChange={(e) => setGender(e.target.value)}
    className="input"
  >
    <option value="">未設定</option>
    <option value="male">男性</option>
    <option value="female">女性</option>
  </select>
</div>

        {/* 追加ボタン */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="btn-primary w-full sm:w-auto px-6 py-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              '追加'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}