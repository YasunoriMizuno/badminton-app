// src/components/result/MatchForm.tsx
'use client'

import { useState } from 'react'
import { Trophy, Loader2, Plus } from 'lucide-react'
import type { Court, Player, MatchType } from '@/types'
import type { SerializedMatch } from './ResultClient'

type Props = {
  courts: Court[]
  players: Player[]
  onMatchCreated: (match: SerializedMatch) => void
}

export function MatchForm({ courts, players, onMatchCreated }: Props) {
  const [courtId, setCourtId] = useState<string>('')
  const [matchType, setMatchType] = useState<MatchType>('doubles')
  const [team1Ids, setTeam1Ids] = useState<number[]>([])
  const [team2Ids, setTeam2Ids] = useState<number[]>([])
  const [winnerTeam, setWinnerTeam] = useState<string>('')
  const [score, setScore] = useState('')
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const required = matchType === 'doubles' ? 2 : 1

  function togglePlayer(
    teamSetter: React.Dispatch<React.SetStateAction<number[]>>,
    otherIds: number[],
    id: number
  ) {
    teamSetter((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= required) return prev
      return [...prev, id]
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (team1Ids.length !== required || team2Ids.length !== required) {
      setError(`各チームに${required}人選んでください`)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          court_id: Number(courtId),
          match_type: matchType,
          team1_player_ids: team1Ids,
          team2_player_ids: team2Ids,
          winner_team: winnerTeam ? Number(winnerTeam) : null,
          score: score || null,
          played_at: new Date(playedAt).toISOString(),
        }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      onMatchCreated(data)
      setCourtId('')
      setTeam1Ids([])
      setTeam2Ids([])
      setWinnerTeam('')
      setScore('')
    } catch {
      setError('登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-green-600" />
        試合結果を入力
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">コート</label>
            <select value={courtId} onChange={(e) => setCourtId(e.target.value)} className="input" required>
              <option value="">選択してください</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">種別</label>
            <select value={matchType} onChange={(e) => { setMatchType(e.target.value as MatchType); setTeam1Ids([]); setTeam2Ids([]) }} className="input">
              <option value="doubles">ダブルス</option>
              <option value="singles">シングルス</option>
            </select>
          </div>
          <div>
            <label className="label">試合日</label>
            <input type="date" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} className="input" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">チーム1 <span className="text-gray-400 font-normal">({team1Ids.length}/{required}人)</span></label>
            <div className="space-y-1 max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {players.map((p) => {
                const inTeam2 = team2Ids.includes(p.id)
                const selected = team1Ids.includes(p.id)
                return (
                  <button key={p.id} type="button" disabled={inTeam2}
                    onClick={() => togglePlayer(setTeam1Ids, team2Ids, p.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selected ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-50 text-gray-700'} ${inTeam2 ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    {selected ? '✓ ' : ''}{p.name}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="label">チーム2 <span className="text-gray-400 font-normal">({team2Ids.length}/{required}人)</span></label>
            <div className="space-y-1 max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {players.map((p) => {
                const inTeam1 = team1Ids.includes(p.id)
                const selected = team2Ids.includes(p.id)
                return (
                  <button key={p.id} type="button" disabled={inTeam1}
                    onClick={() => togglePlayer(setTeam2Ids, team1Ids, p.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${selected ? 'bg-orange-100 text-orange-800 font-medium' : 'hover:bg-gray-50 text-gray-700'} ${inTeam1 ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    {selected ? '✓ ' : ''}{p.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">勝利チーム（任意）</label>
            <select value={winnerTeam} onChange={(e) => setWinnerTeam(e.target.value)} className="input">
              <option value="">未確定</option>
              <option value="1">チーム1の勝利</option>
              <option value="2">チーム2の勝利</option>
            </select>
          </div>
          <div>
            <label className="label">スコア（任意）</label>
            <input type="text" value={score} onChange={(e) => setScore(e.target.value)} className="input" placeholder="例：21-15" />
          </div>
        </div>

        <button type="submit"
          disabled={loading || !courtId || team1Ids.length !== required || team2Ids.length !== required}
          className="btn-primary w-full py-3">
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <><Plus className="w-4 h-4" />結果を登録</>
          }
        </button>
      </form>
    </div>
  )
}