// src/components/result/MatchHistoryList.tsx
'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import type { Player } from '@/types'
import type { SerializedMatch } from './ResultClient'
import { formatDate, formatMatchType } from '@/lib/utils'

type Props = {
  matches: SerializedMatch[]
  players: Player[]
  onDeleted: (id: number) => void
}

export function MatchHistoryList({ matches, players, onDeleted }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  function getPlayerNames(ids: number[]): string {
    return ids
      .map((id) => players.find((p) => p.id === id)?.name ?? '不明')
      .join(' / ')
  }

  async function handleDelete(id: number) {
    if (!confirm('この試合記録を削除しますか？')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/matches/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDeleted(id)
    } catch {
      alert('削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  if (matches.length === 0) {
    return (
      <div className="card text-center py-10 text-gray-400">
        <p>試合記録がありません</p>
        <p className="text-sm mt-1">上のフォームから結果を登録してください</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4">
        試合履歴
        <span className="ml-2 text-sm font-normal text-gray-400">
          （直近{matches.length}件）
        </span>
      </h2>
      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-gray-800">{match.court.name}</span>
                <span className="badge-gray">{formatMatchType(match.match_type)}</span>
                <span className="text-xs text-gray-400">{formatDate(match.played_at)}</span>
              </div>
              <button
                onClick={() => handleDelete(match.id)}
                disabled={deletingId === match.id}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
              >
                {deletingId === match.id
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />
                }
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className={`p-2 rounded-lg text-center ${match.winner_team === 1 ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-blue-50'}`}>
                <p className="text-xs text-blue-500 mb-1">チーム1 {match.winner_team === 1 && '🏆'}</p>
                <p className="font-semibold text-blue-800 break-words">{getPlayerNames(match.team1_player_ids)}</p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <span className="font-black text-gray-300 text-xl">VS</span>
                {match.score && <span className="text-xs font-bold text-gray-500 mt-1">{match.score}</span>}
              </div>
              <div className={`p-2 rounded-lg text-center ${match.winner_team === 2 ? 'bg-orange-100 ring-2 ring-orange-400' : 'bg-orange-50'}`}>
                <p className="text-xs text-orange-500 mb-1">チーム2 {match.winner_team === 2 && '🏆'}</p>
                <p className="font-semibold text-orange-800 break-words">{getPlayerNames(match.team2_player_ids)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}