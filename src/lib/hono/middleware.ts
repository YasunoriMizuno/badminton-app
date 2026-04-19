import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { createClient } from '@/lib/supabase/server'
import { CIRCLE_COOKIE } from '@/lib/circle'
import type { User } from '@supabase/supabase-js'

// コンテキストの型定義
export type AuthEnv = {
  Variables: {
    user: User
  }
}

export type CircleEnv = {
  Variables: {
    user: User
    circleId: number
  }
}

/**
 * 認証ミドルウェア
 * Supabase でログイン済みユーザーを検証し、c.var.user にセットする
 */
export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new HTTPException(401, { message: '未認証です' })
  }

  c.set('user', user)
  await next()
})

/**
 * アクティブサークルミドルウェア
 * Cookie からサークルIDを取得し、c.var.circleId にセットする
 * authMiddleware の後に使うこと
 */
export const circleMiddleware = createMiddleware<CircleEnv>(async (c, next) => {
  const cookieHeader = c.req.header('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${CIRCLE_COOKIE}=([^;]+)`))
  const value = match?.[1]

  if (!value || isNaN(Number(value))) {
    throw new HTTPException(400, { message: 'サークルが選択されていません' })
  }

  c.set('circleId', Number(value))
  await next()
})
