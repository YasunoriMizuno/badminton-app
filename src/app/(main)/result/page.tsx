import { prisma } from '@/lib/prisma'
import { getActiveCircleId } from '@/lib/circle'
import { ResultClient } from '@/components/result/ResultClient'

export default async function ResultPage() {
  const circleId = (await getActiveCircleId())!

  const [matches, courts, players] = await Promise.all([
    prisma.match.findMany({
      where: { circle_id: circleId },
      orderBy: { played_at: 'desc' },
      take: 30,
      include: { court: true },
    }),
    prisma.court.findMany({
      where: { circle_id: circleId },
      orderBy: { created_at: 'asc' },
    }),
    prisma.player.findMany({
      where: { circle_id: circleId },
      orderBy: { name: 'asc' },
    }),
  ])

  const serializedMatches = matches.map((m) => ({
    id: m.id,
    circle_id: m.circle_id,
    court_id: m.court_id,
    match_type: m.match_type as import('@/types').MatchType,
    team1_player_ids: m.team1_player_ids as number[],
    team2_player_ids: m.team2_player_ids as number[],
    winner_team: m.winner_team,
    score: m.score,
    played_at: m.played_at.toISOString(),
    created_at: m.created_at.toISOString(),
    court: { ...m.court, match_type: m.court.match_type as import('@/types').MatchType },
  }))

  const typedCourts = courts.map((c) => ({
    ...c,
    match_type: c.match_type as import('@/types').MatchType,
  }))

  return (
    <ResultClient
      initialMatches={serializedMatches}
      courts={typedCourts}
      players={players}
    />
  )
}
