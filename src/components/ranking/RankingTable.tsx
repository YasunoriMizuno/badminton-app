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
        <table className="w-full min-w-[320px] text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="w-10 py-2 px-1 text-left text-gray-500 font-medium sm:py-3 sm:px-2">順位</th>
              <th className="py-2 px-1 text-left text-gray-500 font-medium sm:py-3 sm:px-2">名前</th>
              <th className="py-2 px-1 text-center text-gray-500 font-medium sm:py-3 sm:px-2">勝</th>
              <th className="py-2 px-1 text-center text-gray-500 font-medium sm:py-3 sm:px-2">敗</th>
              <th className="hidden py-2 text-center text-gray-500 font-medium sm:table-cell sm:py-3 sm:px-2">試合数</th>
              <th className="py-2 px-1 text-center text-gray-500 font-medium sm:py-3 sm:px-2">勝率</th>
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
                  <td className="py-2 px-1 text-center sm:py-3 sm:px-2">
                    {stats.total === 0 ? (
                      <span className="text-gray-300">-</span>
                    ) : rank === 1 ? <span className="text-xl">🥇</span>
                      : rank === 2 ? <span className="text-xl">🥈</span>
                      : rank === 3 ? <span className="text-xl">🥉</span>
                      : <span className="text-gray-400">{rank}</span>
                    }
                  </td>
                  <td className="py-2 px-1 sm:py-3 sm:px-2">
                    <span className="text-gray-900">{stats.player.name}</span>
                    {stats.player.level && (
                      <span className="ml-2 hidden text-xs text-amber-500 sm:inline">
                        {formatLevel(stats.player.level)}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-1 text-center text-brand-sky sm:py-3 sm:px-2">{stats.wins}</td>
                  <td className="py-2 px-1 text-center text-red-400 sm:py-3 sm:px-2">{stats.losses}</td>
                  <td className="hidden py-2 px-1 text-center text-gray-500 sm:table-cell sm:py-3 sm:px-2">{stats.total}</td>
                  <td className="py-2 px-1 text-center sm:py-3 sm:px-2">
                    {stats.total === 0 ? (
                      <span className="text-gray-300">-</span>
                    ) : (
                      <span className={`font-bold ${stats.win_rate >= 0.5 ? 'text-brand-teal' : 'text-gray-500'}`}>
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