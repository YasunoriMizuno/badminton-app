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
  const [winnerTeam, setWinnerTeam] = useState<string>('1')
  const [score1, setScore1] = useState('')
  const [score2, setScore2] = useState('')
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
          score: score1 && score2 ? `${score1}-${score2}` : null,
          played_at: new Date(playedAt).toISOString(),
        }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      onMatchCreated(data)
      setCourtId('')
      setTeam1Ids([])
      setTeam2Ids([])
      setWinnerTeam('1')
      setScore1('')
      setScore2('')
    } catch {
      setError('登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-brand-teal" />
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
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${selected ? 'bg-brand-sky-soft font-medium text-brand-ocean' : 'text-gray-700 hover:bg-gray-50'} ${inTeam2 ? 'cursor-not-allowed opacity-30' : ''}`}>
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
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all ${selected ? 'bg-brand-orange-soft font-medium text-brand-orange' : 'text-gray-700 hover:bg-gray-50'} ${inTeam1 ? 'cursor-not-allowed opacity-30' : ''}`}>
                    {selected ? '✓ ' : ''}{p.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">勝利チーム</label>
            <select value={winnerTeam} onChange={(e) => setWinnerTeam(e.target.value)} className="input">
              <option value="1">チーム1の勝利</option>
              <option value="2">チーム2の勝利</option>
            </select>
          </div>
          <div>
            <label className="label">スコア（任意）</label>
            <div className="flex items-center gap-2">
              <select value={score1} onChange={(e) => setScore1(e.target.value)} className="input flex-1">
                <option value="">-</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              <span className="text-lg font-bold text-gray-400 shrink-0">−</span>
              <select value={score2} onChange={(e) => setScore2(e.target.value)} className="input flex-1">
                <option value="">-</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
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