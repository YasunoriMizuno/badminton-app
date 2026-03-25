// src/components/players/PlayerCard.tsx
// 参加者1人分のカード（出席切り替え・削除）

'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import type { Player } from '@/types'
import { formatLevel, cn } from '@/lib/utils'

type Props = {
  player: Player
  onDeleted: (id: number) => void
  onPresenceToggled: (id: number, isPresent: boolean) => void
}

export function PlayerCard({ player, onDeleted, onPresenceToggled }: Props) {
  const [loadingPresence, setLoadingPresence] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  // 出席フラグ切り替え
  async function handleTogglePresence() {
    setLoadingPresence(true)
    try {
      const res = await fetch(`/api/players/${player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_present: !player.is_present }),
      })
      if (!res.ok) throw new Error()
      onPresenceToggled(player.id, !player.is_present)
    } catch {
      alert('更新に失敗しました')
    } finally {
      setLoadingPresence(false)
    }
  }

  // 削除
  async function handleDelete() {
    if (!confirm(`「${player.name}」を削除しますか？`)) return
    setLoadingDelete(true)
    try {
      const res = await fetch(`/api/players/${player.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      onDeleted(player.id)
    } catch {
      alert('削除に失敗しました')
    } finally {
      setLoadingDelete(false)
    }
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 rounded-lg border transition-all duration-150',
        player.is_present
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      {/* 左側：出席チェック・名前・レベル */}
      <div className="flex items-center gap-3">
        {/* 出席チェックボタン */}
        <button
          onClick={handleTogglePresence}
          disabled={loadingPresence}
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
            player.is_present
              ? 'bg-green-600 border-green-600'
              : 'border-gray-300 hover:border-green-400'
          )}
        >
          {loadingPresence ? (
            <Loader2 className="w-3 h-3 animate-spin text-white" />
          ) : player.is_present ? (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </button>

        {/* 名前 */}
        <span
          className={cn(
            'font-medium text-sm',
            player.is_present ? 'text-green-800' : 'text-gray-700'
          )}
        >
          {player.name}
        </span>

        {/* レベル */}
        {player.level && (
          <span className="text-xs text-amber-500 hidden sm:block">
            {formatLevel(player.level)}
          </span>
        )}
      </div>

      {/* 右側：出席バッジ・削除ボタン */}
      <div className="flex items-center gap-2">
        {player.is_present && (
          <span className="badge-green text-xs">出席</span>
        )}
        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          {loadingDelete ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}