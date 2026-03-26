// src/components/result/ResultClient.tsx
// 試合結果入力画面の状態管理コンポーネント

'use client'

import { useState } from 'react'
import type { Court, Player } from '@/types'
import { MatchForm } from './MatchForm'
import { MatchHistoryList } from './MatchHistoryList'

// サーバーから渡される試合データの型
export type SerializedMatch = {
  id: number
  court_id: number
  match_type: string
  team1_player_ids: number[]
  team2_player_ids: number[]
  winner_team: number | null
  score: string | null
  played_at: string
  created_at: string
  court: Court
}

type Props = {
  initialMatches: SerializedMatch[]
  courts: Court[]
  players: Player[]
}

export function ResultClient({ initialMatches, courts, players }: Props) {
  const [matches, setMatches] = useState<SerializedMatch[]>(initialMatches)

  // 試合追加後に一覧を更新
  function handleMatchCreated(match: SerializedMatch) {
    setMatches((prev) => [match, ...prev])
  }

  // 試合削除後に一覧を更新
  function handleMatchDeleted(id: number) {
    setMatches((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 試合結果入力フォーム */}
      <MatchForm
        courts={courts}
        players={players}
        onMatchCreated={handleMatchCreated}
      />
      {/* 試合履歴一覧 */}
      <MatchHistoryList
        matches={matches}
        players={players}
        onDeleted={handleMatchDeleted}
      />
    </div>
  )
}