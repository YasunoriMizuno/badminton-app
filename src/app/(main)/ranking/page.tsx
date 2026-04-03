// src/app/(main)/ranking/page.tsx
// ランキングページ（サーバーコンポーネント）

import { prisma } from '@/lib/prisma'
import { RankingClient } from '@/components/ranking/RankingClient'
import type { PlayerStats } from '@/types'

export default async function RankingPage() {
  const [players, matches] = await Promise.all([
    prisma.player.findMany({ orderBy: { name: 'asc' } }),
    prisma.match.findMany({
      where: { winner_team: { not: null } },
    }),
  ])

  // 各プレイヤーの勝敗を集計
  const statsMap = new Map<number, { wins: number; losses: number }>()

  // 全プレイヤーを初期化
  players.forEach((p) => statsMap.set(p.id, { wins: 0, losses: 0 }))

  // 試合ごとに勝敗を集計
  for (const match of matches) {
    const team1Ids = match.team1_player_ids as number[]
    const team2Ids = match.team2_player_ids as number[]
    const winners = match.winner_team === 1 ? team1Ids : team2Ids
    const losers  = match.winner_team === 1 ? team2Ids : team1Ids

    winners.forEach((id) => {
      const s = statsMap.get(id)
      if (s) s.wins += 1
    })
    losers.forEach((id) => {
      const s = statsMap.get(id)
      if (s) s.losses += 1
    })
  }

  // PlayerStats配列を生成してソート
  const playerStats: PlayerStats[] = players.map((player) => {
    const { wins, losses } = statsMap.get(player.id) ?? { wins: 0, losses: 0 }
    const total = wins + losses
    const win_rate = total > 0 ? wins / total : 0
    return { player, wins, losses, total, win_rate }
  })

  // 勝率降順 → 試合数降順でソート
  playerStats.sort((a, b) => {
    if (b.win_rate !== a.win_rate) return b.win_rate - a.win_rate
    return b.total - a.total
  })

  // 3試合以上プレイした人だけランキングに表示
const MIN_GAMES = 3
const rankedStats = playerStats.filter((s) => s.total >= MIN_GAMES)
const unrankedStats = playerStats.filter((s) => s.total < MIN_GAMES)

return (
  <RankingClient
    playerStats={rankedStats}
    unrankedStats={unrankedStats}
    minGames={MIN_GAMES}
  />
)
}