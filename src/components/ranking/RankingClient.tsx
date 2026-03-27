// src/components/ranking/RankingClient.tsx
// ランキング画面のクライアントコンポーネント

'use client'

import type { PlayerStats } from '@/types'
import { RankingTopCard } from './RankingTopCard'
import { RankingTable } from './RankingTable'

type Props = {
  playerStats: PlayerStats[]
}

export function RankingClient({ playerStats }: Props) {
  // 1試合以上プレイした人だけTOP3に表示
  const activeStats = playerStats.filter((s) => s.total > 0)
  const top3 = activeStats.slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* TOP3表彰台 */}
      {top3.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-800 mb-4">🏆 TOP 3</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {top3.map((stats, i) => (
              <RankingTopCard key={stats.player.id} stats={stats} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* 全員ランキングテーブル */}
      <RankingTable playerStats={playerStats} />
    </div>
  )
}