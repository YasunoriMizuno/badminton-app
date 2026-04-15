import { prisma } from '@/lib/prisma'
import { ok, err, parseId } from '@/lib/api'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = parseId(idParam)
    if (id === null) return err('不正なIDです', 400)

    const body = await request.json()
    const { name, level, is_present, circle_id } = body

    const player = await prisma.player.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(level !== undefined && { level }),
        ...(is_present !== undefined && { is_present }),
        ...('circle_id' in body && { circle_id: circle_id ?? null }),
      },
    })

    return ok(player)
  } catch (error) {
    console.error('[PATCH /api/players/:id]', error)
    return err('更新に失敗しました')
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id: idParam } = await params
    const id = parseId(idParam)
    if (id === null) return err('不正なIDです', 400)

    await prisma.player.delete({ where: { id } })
    return ok({ id })
  } catch (error) {
    console.error('[DELETE /api/players/:id]', error)
    return err('削除に失敗しました')
  }
}
