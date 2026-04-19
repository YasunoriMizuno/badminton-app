import type { PlayerStats } from '@/types'
import { formatWinRate, formatLevel, cn } from '@/lib/utils'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui'

type Props = {
  playerStats: PlayerStats[]
}

export function RankingTable({ playerStats }: Props) {
  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4">全員の成績</h2>
      <div className="overflow-x-auto">
        <Table className="min-w-[320px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">順位</TableHead>
              <TableHead>名前</TableHead>
              <TableHead className="text-center">勝</TableHead>
              <TableHead className="text-center">敗</TableHead>
              <TableHead className="hidden text-center sm:table-cell">試合数</TableHead>
              <TableHead className="text-center">勝率</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playerStats.map((stats, index) => {
              const rank = index + 1
              const isTop3 = stats.total > 0 && rank <= 3
              return (
                <TableRow key={stats.player.id} className={cn(isTop3 && 'font-semibold')}>
                  <TableCell className="text-center">
                    {stats.total === 0 ? (
                      <span className="text-gray-300">-</span>
                    ) : rank === 1 ? <span className="text-xl">🥇</span>
                      : rank === 2 ? <span className="text-xl">🥈</span>
                      : rank === 3 ? <span className="text-xl">🥉</span>
                      : <span className="text-gray-400">{rank}</span>
                    }
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-900">{stats.player.name}</span>
                    {stats.player.level && (
                      <span className="ml-2 hidden text-xs text-amber-500 sm:inline">
                        {formatLevel(stats.player.level)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center text-brand-sky">{stats.wins}</TableCell>
                  <TableCell className="text-center text-red-400">{stats.losses}</TableCell>
                  <TableCell className="hidden text-center text-gray-500 sm:table-cell">{stats.total}</TableCell>
                  <TableCell className="text-center">
                    {stats.total === 0 ? (
                      <span className="text-gray-300">-</span>
                    ) : (
                      <span className={cn('font-bold', stats.win_rate >= 0.5 ? 'text-brand-teal' : 'text-gray-500')}>
                        {formatWinRate(stats.win_rate)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}