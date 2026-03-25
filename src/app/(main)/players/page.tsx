// src/app/(main)/players/page.tsx
import { prisma } from '@/lib/prisma'
import { PlayersClient } from '@/components/players/PlayersClient'

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { created_at: 'asc' },
  })

  return <PlayersClient initialPlayers={players} />
}
