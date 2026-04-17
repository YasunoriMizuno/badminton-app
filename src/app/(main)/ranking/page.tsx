// src/app/(main)/ranking/page.tsx
// ランキングページ（サーバーコンポーネント）

export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getActiveCircleId } from '@/lib/circle'
import { RankingClient } from '@/components/ranking/RankingClient'
import type { PlayerStats } from '@/types'

export default async function RankingPage() {
  const circleId = (await getActiveCircleId())!

  const [players, matches] = await Promise.all([
    prisma.player.findMany({
      where: { circle_id: circleId },
      orderBy: { name: 'asc' },
    }),
    prisma.match.findMany({
      where: { circle_id: circleId, winner_team: { not: null } },
    }),
  ])

  const statsMap = new Map<number, { wins: number; losses: number }>()
  players.forEach((p) => statsMap.set(p.id, { wins: 0, losses: 0 }))

  for (const match of matches) {
    const team1Ids = match.team1_player_ids as number[]
    const team2Ids = match.team2_player_ids as number[]
    const winners = match.winner_team === 1 ? team1Ids : team2Ids
    const losers  = match.winner_team === 1 ? team2Ids : team1Ids

    winners.forEach((id) => { const s = statsMap.get(id); if (s) s.wins += 1 })
    losers.forEach((id)  => { const s = statsMap.get(id); if (s) s.losses += 1 })
  }

  const playerStats: PlayerStats[] = players.map((player) => {
    const { wins, losses } = statsMap.get(player.id) ?? { wins: 0, losses: 0 }
    const total = wins + losses
    const win_rate = total > 0 ? wins / total : 0
    return { player, wins, losses, total, win_rate }
  })

  playerStats.sort((a, b) => {
    if (b.win_rate !== a.win_rate) return b.win_rate - a.win_rate
    return b.total - a.total
  })

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
