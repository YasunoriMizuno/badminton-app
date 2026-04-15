import { cookies } from 'next/headers'

export const CIRCLE_COOKIE = 'active_circle_id'

/** Cookie からアクティブなサークルIDを取得 */
export async function getActiveCircleId(): Promise<number | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get(CIRCLE_COOKIE)?.value
  if (!value) return null
  const id = Number(value)
  return isNaN(id) ? null : id
}
