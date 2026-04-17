// src/app/(main)/matching/page.tsx
// コート振り分けページ（サーバーコンポーネント）

export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { getActiveCircleId } from '@/lib/circle'
import { MatchingClient } from '@/components/matching/MatchingClient'
import type { Court } from '@/types'

export default async function MatchingPage() {
  const circleId = (await getActiveCircleId())!

  const [presentPlayers, courts] = await Promise.all([
    prisma.player.findMany({
      where: { circle_id: circleId, is_present: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.court.findMany({
      where: { circle_id: circleId },
      orderBy: { created_at: 'asc' },
    }) as Promise<Court[]>,
  ])

  return (
    <MatchingClient
      initialPresentPlayers={presentPlayers}
      initialCourts={courts}
    />
  )
}
