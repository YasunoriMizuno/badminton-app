// src/app/(main)/matching/page.tsx
// コート振り分けページ（サーバーコンポーネント）

import { prisma } from '@/lib/prisma'
import { MatchingClient } from '@/components/matching/MatchingClient'

export default async function MatchingPage() {
  // 出席中の参加者とコートを並行取得
  const [presentPlayers, courts] = await Promise.all([
    prisma.player.findMany({
      where: { is_present: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.court.findMany({
      orderBy: { created_at: 'asc' },
    }),
  ])

  return (
    <MatchingClient
      initialPresentPlayers={presentPlayers}
      initialCourts={courts}
    />
  )
}