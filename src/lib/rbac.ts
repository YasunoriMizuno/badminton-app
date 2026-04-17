// src/lib/rbac.ts
// ロール取得・権限チェックのヘルパー関数

import { prisma } from '@/lib/prisma'

export type Role = 'admin' | 'leader' | 'member' | null

/**
 * ユーザーが指定サークルで持つロールを返す
 * サークル未所属なら null
 */
export async function getUserRole(userId: string, circleId: number): Promise<Role> {
  const member = await prisma.circleMember.findUnique({
    where: { circle_id_user_id: { circle_id: circleId, user_id: userId } },
    select: { role: true },
  })
  return (member?.role as Role) ?? null
}

/**
 * ユーザーが admin ロールを持つサークルIDの一覧を返す
 */
export async function getAdminCircleIds(userId: string): Promise<number[]> {
  const members = await prisma.circleMember.findMany({
    where: { user_id: userId, role: 'admin' },
    select: { circle_id: true },
  })
  return members.map((m) => m.circle_id)
}

/**
 * ユーザーがいずれかのサークルで admin ロールを持つか確認
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const count = await prisma.circleMember.count({
    where: { user_id: userId, role: 'admin' },
  })
  return count > 0
}

/**
 * ユーザーが所属するすべてのサークルとロールを返す
 */
export async function getUserCircles(userId: string) {
  return prisma.circleMember.findMany({
    where: { user_id: userId },
    include: { circle: true },
    orderBy: { created_at: 'asc' },
  })
}
