import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = parseId(idParam)
    if (id === null) return err('不正なIDです', 400)

    const { name, match_type } = await request.json()

    const court = await prisma.court.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(match_type !== undefined && { match_type }),
      },
    })

    return ok(court)
  } catch (error) {
    console.error('[PATCH /api/courts/:id]', error)
    return err('更新に失敗しました')
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = parseId(idParam)
    if (id === null) return err('不正なIDです', 400)

    await prisma.match.deleteMany({ where: { court_id: id } })
    await prisma.court.delete({ where: { id } })

    return ok({ id })
  } catch (error) {
    console.error('[DELETE /api/courts/:id]', error)
    return err('削除に失敗しました')
  }
}
