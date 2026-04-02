// src/lib/matching.ts
// コート振り分けロジック（男女均等配置対応）

import type { Court, Player, CourtAssignment, MatchingResult, MatchType } from '@/types'

// 配列をランダムにシャッフル（Fisher-Yatesアルゴリズム）
function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 1コートに必要な人数
function getRequiredPlayers(matchType: MatchType): number {
  return matchType === 'doubles' ? 4 : 2
}

// 男女均等になるようにチームを作る
function makeTeams(players: Player[], matchType: MatchType): {
  team1: Player[]
  team2: Player[]
} | null {
  const required = getRequiredPlayers(matchType)
  if (players.length < required) return null

  const males   = shuffle(players.filter((p) => p.gender === 'male'))
  const females = shuffle(players.filter((p) => p.gender === 'female'))
  const others  = shuffle(players.filter((p) => !p.gender))

  // ダブルスの場合：各チームに男女1人ずつ
  if (matchType === 'doubles') {
    // 男女が十分いる場合
    if (males.length >= 2 && females.length >= 2) {
      return {
        team1: [males[0], females[0]],
        team2: [males[1], females[1]],
      }
    }
    // 男女が足りない場合はランダムで振り分け
    const all = shuffle([...males, ...females, ...others])
    return {
      team1: all.slice(0, 2),
      team2: all.slice(2, 4),
    }
  }

  // シングルスの場合：ランダム
  const all = shuffle([...males, ...females, ...others])
  return {
    team1: [all[0]],
    team2: [all[1]],
  }
}

// プレイヤーをコートに振り分ける
export function assignPlayersToCourts(
  presentPlayers: Player[],
  courts: Court[]
): MatchingResult {
  const assignments: CourtAssignment[] = []
  const remaining = shuffle([...presentPlayers])

  for (const court of courts) {
    const required = getRequiredPlayers(court.match_type as MatchType)
    if (remaining.length < required) break

    const courtPlayers = remaining.splice(0, required)
    const teams = makeTeams(courtPlayers, court.match_type as MatchType)

    if (!teams) break

    assignments.push({
      court,
      team1: teams.team1,
      team2: teams.team2,
    })
  }

  return { assignments, unassigned: remaining }
}