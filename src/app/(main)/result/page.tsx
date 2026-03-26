// src/app/(main)/result/page.tsx
// 試合結果入力ページ（サーバーコンポーネント）

import { prisma } from '@/lib/prisma'
import { ResultClient } from '@/components/result/ResultClient'

export default async function ResultPage() {
  const [matches, courts, players] = await Promise.all([
    prisma.match.findMany({
      orderBy: { played_at: 'desc' },
      take: 30,
      include: { court: true },
    }),
    prisma.court.findMany({ orderBy: { created_at: 'asc' } }),
    prisma.player.findMany({ orderBy: { name: 'asc' } }),
  ])

  // DateをISO文字列に変換してクライアントに渡す
  const serializedMatches = matches.map((m) => ({
    id: m.id,
    court_id: m.court_id,
    match_type: m.match_type,
    team1_player_ids: m.team1_player_ids as number[],
    team2_player_ids: m.team2_player_ids as number[],
    winner_team: m.winner_team,
    score: m.score,
    played_at: m.played_at.toISOString(),
    created_at: m.created_at.toISOString(),
    court: m.court,
  }))

  return (
    <ResultClient
      initialMatches={serializedMatches}
      courts={courts}
      players={players}
    />
  )
}