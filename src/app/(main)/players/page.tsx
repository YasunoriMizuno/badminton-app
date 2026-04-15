import { prisma } from '@/lib/prisma'
import { getActiveCircleId } from '@/lib/circle'
import { PlayersClient } from '@/components/players/PlayersClient'

export default async function PlayersPage() {
  const circleId = (await getActiveCircleId())!

  const players = await prisma.player.findMany({
    where: { circle_id: circleId },
    orderBy: { created_at: 'asc' },
  })

  return <PlayersClient initialPlayers={players} />
}
