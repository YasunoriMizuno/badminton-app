// src/app/(main)/matching/page.tsx
// コート振り分けページ（サーバーコンポーネント）

import { prisma } from '@/lib/prisma'
import { MatchingClient } from '@/components/matching/MatchingClient'
import type { Court } from '@/types'

export default async function MatchingPage() {
  const [presentPlayers, courts] = await Promise.all([
    prisma.player.findMany({
      where: { is_present: true },
      orderBy: { created_at: 'asc' },
    }),
    prisma.court.findMany({ orderBy: { created_at: 'asc' } }) as Promise<Court[]>,
  ])

  return (
    <MatchingClient
      initialPresentPlayers={presentPlayers}
      initialCourts={courts}
    />
  )
}
