// src/lib/matching.ts
// コート振り分けロジック

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

// プレイヤーをコートに振り分ける
export function assignPlayersToCourts(
  presentPlayers: Player[],
  courts: Court[]
): MatchingResult {
  const shuffled = shuffle(presentPlayers)
  const assignments: CourtAssignment[] = []
  let playerIndex = 0

  for (const court of courts) {
    const required = getRequiredPlayers(court.match_type as MatchType)

    // 必要人数が足りない場合はスキップ
    if (playerIndex + required > shuffled.length) break

    const courtPlayers = shuffled.slice(playerIndex, playerIndex + required)
    const half = Math.floor(required / 2)

    assignments.push({
      court,
      team1: courtPlayers.slice(0, half),
      team2: courtPlayers.slice(half),
    })
    playerIndex += required
  }

  // 余ったプレイヤー
  const unassigned = shuffled.slice(playerIndex)

  return { assignments, unassigned }
}