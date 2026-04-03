// src/components/ranking/RankingClient.tsx
// ランキング画面のクライアントコンポーネント

'use client'

import type { PlayerStats } from '@/types'
import { RankingTopCard } from './RankingTopCard'
import { RankingTable } from './RankingTable'

type Props = {
  playerStats: PlayerStats[]
  unrankedStats: PlayerStats[]
  minGames: number
}

export function RankingClient({ playerStats, unrankedStats, minGames }: Props) {
  const top3 = playerStats.slice(0, 3)

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

      {/* ランキングテーブル */}
      {playerStats.length > 0 ? (
        <RankingTable playerStats={playerStats} />
      ) : (
        <div className="card text-center py-10 text-gray-400">
          <p className="text-lg">まだランキングがありません</p>
          <p className="text-sm mt-1">
            {minGames}試合以上プレイするとランキングに表示されます
          </p>
        </div>
      )}

      {/* ランキング外の参加者 */}
      {unrankedStats.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-gray-800 mb-3">
            ランキング外
            <span className="ml-2 text-sm font-normal text-gray-400">
              （{minGames}試合未満）
            </span>
          </h2>
          <div className="space-y-2">
            {unrankedStats.map((stats) => (
              <div
                key={stats.player.id}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-600">{stats.player.name}</span>
                <span className="text-xs text-gray-400">
                  {stats.total}試合（あと{minGames - stats.total}試合）
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}