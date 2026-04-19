import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { deleteCookie, setCookie } from 'hono/cookie'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { prisma } from '@/lib/prisma'
import { getUserRole } from '@/lib/rbac'
import { CIRCLE_COOKIE } from '@/lib/circle'
import { authMiddleware, circleMiddleware, type AuthEnv, type CircleEnv } from './middleware'

const app = new Hono().basePath('/api')

// グローバルエラーハンドラー
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ data: null, error: err.message }, err.status)
  }
  console.error('[Hono] Unhandled error:', err)
  return c.json({ data: null, error: 'サーバーエラーが発生しました' }, 500)
})

// ---------------------------------------------------------------------------
// /api/auth/profile
// ---------------------------------------------------------------------------
const authRoutes = new Hono()

authRoutes.get('/profile', async (c) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return c.json({ data: null, error: '未認証です' }, 401)

  const profile = await prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email! },
  })
  return c.json({ data: profile, error: null })
})

authRoutes.post('/profile', async (c) => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return c.json({ data: null, error: '未認証です' }, 401)

  const profile = await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email! },
    create: { id: user.id, email: user.email! },
  })
  return c.json({ data: profile, error: null }, 201)
})

app.route('/auth', authRoutes)

// ---------------------------------------------------------------------------
// /api/circle/select
// ---------------------------------------------------------------------------
const circleRoutes = new Hono()

circleRoutes.get('/select', (c) => {
  const circleId = c.req.query('id')
  const redirectTo = c.req.query('redirect') ?? '/players'
  const baseUrl = new URL(c.req.url).origin

  if (!circleId || isNaN(Number(circleId))) {
    return c.redirect(`${baseUrl}/select-circle`)
  }

  setCookie(c, CIRCLE_COOKIE, circleId, { path: '/', httpOnly: true })
  return c.redirect(`${baseUrl}${redirectTo}`)
})

app.route('/circle', circleRoutes)

// ---------------------------------------------------------------------------
// /api/players
// ---------------------------------------------------------------------------
const playerRoutes = new Hono<CircleEnv>()
playerRoutes.use('*', authMiddleware, circleMiddleware)

playerRoutes.get('/', async (c) => {
  const circleId = c.var.circleId
  const players = await prisma.player.findMany({
    where: { circle_id: circleId },
    orderBy: { created_at: 'asc' },
  })
  return c.json({ data: players, error: null })
})

playerRoutes.post('/', async (c) => {
  const circleId = c.var.circleId
  const body = await c.req.json()
  const { name, level, gender } = body

  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new HTTPException(400, { message: '名前は必須です' })
  }

  const player = await prisma.player.create({
    data: { name: name.trim(), level: level ?? null, gender: gender ?? null, circle_id: circleId },
  })
  return c.json({ data: player, error: null }, 201)
})

playerRoutes.post('/reset-presence', async (c) => {
  const circleId = c.var.circleId
  await prisma.player.updateMany({
    where: { circle_id: circleId },
    data: { is_present: false },
  })
  return c.json({ data: { ok: true }, error: null })
})

playerRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) throw new HTTPException(400, { message: '不正なIDです' })

  const body = await c.req.json()
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
  return c.json({ data: player, error: null })
})

playerRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) throw new HTTPException(400, { message: '不正なIDです' })

  await prisma.player.delete({ where: { id } })
  return c.json({ data: { id }, error: null })
})

app.route('/players', playerRoutes)

// ---------------------------------------------------------------------------
// /api/courts
// ---------------------------------------------------------------------------
const courtRoutes = new Hono<CircleEnv>()
courtRoutes.use('*', authMiddleware, circleMiddleware)

courtRoutes.get('/', async (c) => {
  const circleId = c.var.circleId
  const courts = await prisma.court.findMany({
    where: { circle_id: circleId },
    orderBy: { created_at: 'asc' },
  })
  return c.json({ data: courts, error: null })
})

courtRoutes.post('/', async (c) => {
  const circleId = c.var.circleId
  const { name, match_type } = await c.req.json()
  if (!name || !match_type) throw new HTTPException(400, { message: '名前と種別は必須です' })

  const court = await prisma.court.create({
    data: { name: name.trim(), match_type, circle_id: circleId },
  })
  return c.json({ data: court, error: null }, 201)
})

courtRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) throw new HTTPException(400, { message: '不正なIDです' })

  const { name, match_type } = await c.req.json()

  const court = await prisma.court.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(match_type !== undefined && { match_type }),
    },
  })
  return c.json({ data: court, error: null })
})

courtRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) throw new HTTPException(400, { message: '不正なIDです' })

  await prisma.match.deleteMany({ where: { court_id: id } })
  await prisma.court.delete({ where: { id } })
  return c.json({ data: { id }, error: null })
})

app.route('/courts', courtRoutes)

// ---------------------------------------------------------------------------
// /api/matches
// ---------------------------------------------------------------------------
const matchRoutes = new Hono<AuthEnv>()
matchRoutes.use('*', authMiddleware)

matchRoutes.get('/', async (c) => {
  const matches = await prisma.match.findMany({
    orderBy: { played_at: 'desc' },
    include: { court: true },
  })
  return c.json({ data: matches, error: null })
})

matchRoutes.post('/', async (c) => {
  const cookieHeader = c.req.header('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CIRCLE_COOKIE}=([^;]+)`))
  const circleId = match?.[1] ? Number(match[1]) : null
  if (!circleId || isNaN(circleId)) throw new HTTPException(400, { message: 'サークルが選択されていません' })

  const body = await c.req.json()
  const { court_id, match_type, team1_player_ids, team2_player_ids, winner_team, score, played_at } = body

  if (!court_id || !match_type || !team1_player_ids || !team2_player_ids) {
    throw new HTTPException(400, { message: '必須項目が不足しています' })
  }

  const createdMatch = await prisma.match.create({
    data: {
      circle_id: circleId,
      court_id,
      match_type,
      team1_player_ids,
      team2_player_ids,
      winner_team: winner_team ?? null,
      score: score ?? null,
      played_at: played_at ? new Date(played_at) : new Date(),
    },
    include: { court: true },
  })
  return c.json({ data: createdMatch, error: null }, 201)
})

matchRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) throw new HTTPException(400, { message: '不正なIDです' })

  const { winner_team, score } = await c.req.json()

  const updatedMatch = await prisma.match.update({
    where: { id },
    data: {
      ...(winner_team !== undefined && { winner_team }),
      ...(score !== undefined && { score }),
    },
    include: { court: true },
  })
  return c.json({ data: updatedMatch, error: null })
})

matchRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) throw new HTTPException(400, { message: '不正なIDです' })

  await prisma.match.delete({ where: { id } })
  return c.json({ data: { id }, error: null })
})

app.route('/matches', matchRoutes)

// ---------------------------------------------------------------------------
// /api/admin
// ---------------------------------------------------------------------------
const adminRoutes = new Hono<AuthEnv>()
adminRoutes.use('*', authMiddleware)

// PATCH /api/admin/circles — アクティブサークル名の更新
adminRoutes.patch('/circles', async (c) => {
  const user = c.var.user
  const cookieHeader = c.req.header('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CIRCLE_COOKIE}=([^;]+)`))
  const circleId = match?.[1] ? Number(match[1]) : null
  if (!circleId || isNaN(circleId)) throw new HTTPException(400, { message: 'サークルが選択されていません' })

  const role = await getUserRole(user.id, circleId)
  if (role !== 'admin') throw new HTTPException(403, { message: '権限がありません' })

  const { name } = await c.req.json()
  if (!name?.trim()) throw new HTTPException(400, { message: '名前は必須です' })

  const circle = await prisma.circle.update({
    where: { id: circleId },
    data: { name: name.trim() },
  })
  return c.json({ data: circle, error: null })
})

// GET /api/admin/circles/:id/members
adminRoutes.get('/circles/:id/members', async (c) => {
  const user = c.var.user
  const circleId = Number(c.req.param('id'))
  if (isNaN(circleId)) throw new HTTPException(400, { message: '不正なIDです' })

  const role = await getUserRole(user.id, circleId)
  if (role !== 'admin') throw new HTTPException(403, { message: '権限がありません' })

  const members = await prisma.circleMember.findMany({
    where: { circle_id: circleId },
    include: { user: true },
    orderBy: { created_at: 'asc' },
  })
  return c.json({ data: members, error: null })
})

// POST /api/admin/circles/:id/members
adminRoutes.post('/circles/:id/members', async (c) => {
  const user = c.var.user
  const circleId = Number(c.req.param('id'))
  if (isNaN(circleId)) throw new HTTPException(400, { message: '不正なIDです' })

  const userRole = await getUserRole(user.id, circleId)
  if (userRole !== 'admin') throw new HTTPException(403, { message: '権限がありません' })

  const { email, role } = await c.req.json()
  if (!email?.trim()) throw new HTTPException(400, { message: 'メールアドレスは必須です' })

  const validRoles = ['admin', 'leader', 'member']
  if (!validRoles.includes(role)) throw new HTTPException(400, { message: '不正なロールです' })

  const adminClient = createAdminClient()
  const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers()
  if (authError) throw new HTTPException(500, { message: 'ユーザー検索に失敗しました' })

  const authUser = authUsers.users.find((u) => u.email === email.trim())
  if (!authUser) throw new HTTPException(404, { message: 'ユーザーが見つかりません。先にアカウント登録が必要です。' })

  await prisma.user.upsert({
    where: { id: authUser.id },
    update: { email: authUser.email! },
    create: { id: authUser.id, email: authUser.email! },
  })

  const member = await prisma.circleMember.upsert({
    where: { circle_id_user_id: { circle_id: circleId, user_id: authUser.id } },
    update: { role },
    create: { circle_id: circleId, user_id: authUser.id, role },
  })
  return c.json({ data: member, error: null }, 201)
})

// PATCH /api/admin/circles/:id/members/:memberId
adminRoutes.patch('/circles/:id/members/:memberId', async (c) => {
  const user = c.var.user
  const circleId = Number(c.req.param('id'))
  const memberIdNum = Number(c.req.param('memberId'))
  if (isNaN(circleId) || isNaN(memberIdNum)) throw new HTTPException(400, { message: '不正なIDです' })

  const userRole = await getUserRole(user.id, circleId)
  if (userRole !== 'admin') throw new HTTPException(403, { message: '権限がありません' })

  const { role } = await c.req.json()
  if (!['admin', 'member'].includes(role)) throw new HTTPException(400, { message: '不正なロールです' })

  const target = await prisma.circleMember.findUnique({ where: { id: memberIdNum } })
  if (!target) throw new HTTPException(404, { message: 'メンバーが見つかりません' })
  if (target.user_id === user.id && role !== 'admin') {
    throw new HTTPException(400, { message: '自分自身の管理者権限は外せません' })
  }

  const updated = await prisma.circleMember.update({
    where: { id: memberIdNum },
    data: { role },
    include: { user: true },
  })
  return c.json({ data: updated, error: null })
})

// DELETE /api/admin/circles/:id/members/:memberId
adminRoutes.delete('/circles/:id/members/:memberId', async (c) => {
  const user = c.var.user
  const circleId = Number(c.req.param('id'))
  const memberIdNum = Number(c.req.param('memberId'))
  if (isNaN(circleId) || isNaN(memberIdNum)) throw new HTTPException(400, { message: '不正なIDです' })

  const userRole = await getUserRole(user.id, circleId)
  if (userRole !== 'admin') throw new HTTPException(403, { message: '権限がありません' })

  const target = await prisma.circleMember.findUnique({ where: { id: memberIdNum } })
  if (!target) throw new HTTPException(404, { message: 'メンバーが見つかりません' })
  if (target.user_id === user.id) throw new HTTPException(400, { message: '自分自身は削除できません' })

  await prisma.circleMember.delete({ where: { id: memberIdNum } })
  return c.json({ data: { id: memberIdNum }, error: null })
})

app.route('/admin', adminRoutes)

export { app }
