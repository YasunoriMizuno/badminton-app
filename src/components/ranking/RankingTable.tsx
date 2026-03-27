// src/components/ranking/RankingTable.tsx
// ランキング全件テーブル

import type { PlayerStats } from '@/types'
import { formatWinRate, formatLevel } from '@/lib/utils'

type Props = {
  playerStats: PlayerStats[]
}

export function RankingTable({ playerStats }: Props) {
  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4">全員の成績</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-gray-500 font-medium w-10">順位</th>
              <th className="text-left py-3 px-2 text-gray-500 font-medium">名前</th>
              <th className="text-center py-3 px-2 text-gray-500 font-medium">勝</th>
              <th className="text-center py-3 px-2 text-gray-500 font-medium">敗</th>
              <th className="text-center py-3 px-2 text-gray-500 font-medium">試合数</th>
              <th className="text-center py-3 px-2 text-gray-500 font-medium">勝率</th>
            </tr>
          </thead>
          <tbody>
            {playerStats.map((stats, index) => {
              const rank = index + 1
              const isTop3 = stats.total > 0 && rank <= 3
              return (
                <tr
                  key={stats.player.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors
                    ${isTop3 ? 'font-semibold' : ''}`}
                >
                  <td className="py-3 px-2 text-center">
                    {stats.total === 0 ? (
                      <span className="text-gray-300">-</span>
                    ) : rank === 1 ? '🥇'
                      : rank === 2 ? '🥈'
                      : rank === 3 ? '🥉'
                      : <span className="text-gray-400">{rank}</span>
                    }
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-gray-900">{stats.player.name}</span>
                    {stats.player.level && (
                      <span className="ml-2 text-xs text-amber-400 hidden sm:inline">
                        {formatLevel(stats.player.level)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center text-blue-600">{stats.wins}</td>
                  <td className="py-3 px-2 text-center text-red-400">{stats.losses}</td>
                  <td className="py-3 px-2 text-center text-gray-500">{stats.total}</td>
                  <td className="py-3 px-2 text-center">
                    {stats.total === 0 ? (
                      <span className="text-gray-300">-</span>
                    ) : (
                      <span className={`font-bold ${stats.win_rate >= 0.5 ? 'text-green-600' : 'text-gray-500'}`}>
                        {formatWinRate(stats.win_rate)}
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}