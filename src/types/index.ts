// src/types/index.ts
// アプリ全体で使うTypeScriptの型定義

export type MatchType = 'singles' | 'doubles'

export type Player = {
  id: number
  name: string
  level: number | null
  gender: string | null
  is_present: boolean
  created_at: Date
  updated_at: Date
}

export type Court = {
  id: number
  circle_id: number
  name: string
  match_type: MatchType
  created_at: Date
  updated_at: Date
}

export type Match = {
  id: number
  circle_id: number
  court_id: number
  match_type: MatchType
  team1_player_ids: number[]
  team2_player_ids: number[]
  winner_team: number | null
  score: string | null
  played_at: Date
  created_at: Date
  court?: Court
}

export type PlayerStats = {
  player: Player
  wins: number
  losses: number
  total: number
  win_rate: number
}

export type CourtAssignment = {
  court: Court
  team1: Player[]
  team2: Player[]
}

export type MatchingResult = {
  assignments: CourtAssignment[]
  unassigned: Player[]
}