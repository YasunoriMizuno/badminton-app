// src/components/players/PlayerAddForm.tsx
// 参加者追加フォーム

'use client'

import { useState } from 'react'
import { UserPlus, Loader2 } from 'lucide-react'
import type { Player } from '@/types'
import { Button, FormError, SectionHeading, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'

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
      <SectionHeading icon={<UserPlus className="h-5 w-5" />}>
        参加者を追加
      </SectionHeading>

      <FormError message={error} className="mb-3" />

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* 名前 */}
        <div className="flex-1">
          <label htmlFor="playerName" className="label">
            名前 <span className="text-red-500">*</span>
          </label>
          <Input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：田中 太郎"
            required
          />
        </div>

        {/* レベル */}
        <div className="w-full sm:w-36">
          <label className="label">レベル（任意）</label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue placeholder="未設定" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1（初心者）</SelectItem>
              <SelectItem value="2">2（初級）</SelectItem>
              <SelectItem value="3">3（中級）</SelectItem>
              <SelectItem value="4">4（上級）</SelectItem>
              <SelectItem value="5">5（エキスパート）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 性別 */}
        <div className="w-full sm:w-36">
          <label className="label">性別（任意）</label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="未設定" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 追加ボタン */}
        <div className="flex items-end">
          <Button type="submit" disabled={loading || !name.trim()} className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            追加
          </Button>
        </div>
      </form>
    </div>
  )
}