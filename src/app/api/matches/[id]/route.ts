import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = parseId(idParam)
    if (id === null) return err('不正なIDです', 400)

    const { winner_team, score } = await request.json()

    const match = await prisma.match.update({
      where: { id },
      data: {
        ...(winner_team !== undefined && { winner_team }),
        ...(score !== undefined && { score }),
      },
      include: { court: true },
    })

    return ok(match)
  } catch (error) {
    console.error('[PATCH /api/matches/:id]', error)
    return err('更新に失敗しました')
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = parseId(idParam)
    if (id === null) return err('不正なIDです', 400)

    await prisma.match.delete({ where: { id } })
    return ok({ id })
  } catch (error) {
    console.error('[DELETE /api/matches/:id]', error)
    return err('削除に失敗しました')
  }
}
