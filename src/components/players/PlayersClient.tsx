// src/components/players/PlayersClient.tsx
// 参加者管理画面の状態管理をまとめたコンポーネント

'use client'

import { useState } from 'react'
import type { Player } from '@/types'
import { PlayerAddForm } from './PlayerAddForm'
import { PlayerList } from './PlayerList'
import { AttendanceSummary } from './AttendanceSummary'

type Props = {
  initialPlayers: Player[]
}

export function PlayersClient({ initialPlayers }: Props) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers)

  function handlePlayerAdded(newPlayer: Player) {
    setPlayers((prev) => [...prev, newPlayer])
  }

  function handlePlayerDeleted(id: number) {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  function handlePresenceToggled(id: number, isPresent: boolean) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_present: isPresent } : p))
    )
  }

  function handleResetAll() {
    setPlayers((prev) => prev.map((p) => ({ ...p, is_present: false })))
  }

  const presentCount = players.filter((p) => p.is_present).length

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <AttendanceSummary
        total={players.length}
        present={presentCount}
        onResetAll={handleResetAll}
      />
      <PlayerAddForm onPlayerAdded={handlePlayerAdded} />
      <PlayerList
        players={players}
        onDeleted={handlePlayerDeleted}
        onPresenceToggled={handlePresenceToggled}
      />
    </div>
  )
}
