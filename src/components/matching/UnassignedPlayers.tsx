// src/components/matching/UnassignedPlayers.tsx
// コートに割り当てられなかった参加者を表示

import type { Player } from '@/types'

type Props = {
  players: Player[]
}

export function UnassignedPlayers({ players }: Props) {
  if (players.length === 0) return null

  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <p className="text-sm font-medium text-amber-700 mb-2">
        ⚠️ 以下の参加者はコートに割り当てられませんでした
      </p>
      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <span
            key={player.id}
            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
          >
            {player.name}
          </span>
        ))}
      </div>
    </div>
  )
}