// src/components/ranking/RankingTopCard.tsx
// ランキングTOP3カード

import type { PlayerStats } from '@/types'
import { formatWinRate } from '@/lib/utils'
import { cn } from '@/lib/utils'

type Props = {
  stats: PlayerStats
  rank: number
}

const RANK_STYLES: Record<number, { border: string; emoji: string }> = {
  1: { border: 'border-yellow-400 bg-yellow-50', emoji: '🥇' },
  2: { border: 'border-gray-400 bg-gray-50',     emoji: '🥈' },
  3: { border: 'border-amber-600 bg-amber-50',   emoji: '🥉' },
}

export function RankingTopCard({ stats, rank }: Props) {
  const style = RANK_STYLES[rank]

  return (
    <div className={cn('card border-2 text-center', style.border)}>
      <div className="text-3xl mb-2">{style.emoji}</div>
      <p className="font-bold text-gray-900 text-lg">{stats.player.name}</p>
      <p className="text-2xl font-black text-green-600 mt-1">
        {formatWinRate(stats.win_rate)}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {stats.wins}勝 {stats.losses}敗 / {stats.total}試合
      </p>
    </div>
  )
}