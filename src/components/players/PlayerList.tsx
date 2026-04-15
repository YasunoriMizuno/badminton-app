// src/components/players/PlayerList.tsx
// 参加者一覧コンポーネント

'use client'

import type { Player } from '@/types'
import { PlayerCard } from './PlayerCard'

type Props = {
  players: Player[]
  onDeleted: (id: number) => void
  onPresenceToggled: (id: number, isPresent: boolean) => void
}

export function PlayerList({ players, onDeleted, onPresenceToggled }: Props) {
  if (players.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-400">
        <p className="text-lg">参加者がいません</p>
        <p className="text-sm mt-1">上のフォームから参加者を追加してください</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4">
        参加者一覧
        <span className="ml-2 text-sm font-normal text-gray-400">
          ({players.length}人)
        </span>
      </h2>

      <div className="space-y-2">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onDeleted={onDeleted}
            onPresenceToggled={onPresenceToggled}
          />
        ))}
      </div>
    </div>
  )
}
