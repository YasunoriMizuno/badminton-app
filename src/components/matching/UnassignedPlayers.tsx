// src/components/matching/UnassignedPlayers.tsx
// コートに割り当てられなかった参加者を表示

import type { Player } from '@/types'

type Props = {
  players: Player[]
}

export function UnassignedPlayers({ players }: Props) {
  if (players.length === 0) return null

  return (
    <div className="rounded-[1rem] border-2 border-brand-yellow/45 bg-brand-yellow-soft p-4">
      <p className="mb-2 text-sm font-semibold text-gray-900">
        ⚠️ 以下の参加者はコートに割り当てられませんでした
      </p>
      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <span
            key={player.id}
            className="rounded-full bg-white px-3 py-1 text-sm font-medium text-brand-orange ring-1 ring-brand-orange/35"
          >
            {player.name}
          </span>
        ))}
      </div>
    </div>
  )
}