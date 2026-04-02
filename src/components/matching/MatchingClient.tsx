// src/components/matching/MatchingClient.tsx
// コート振り分け画面の状態管理コンポーネント

'use client'

import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import type { Player, Court, MatchingResult } from '@/types'
import { assignPlayersToCourts } from './matching'
import { CourtSetupPanel } from './CourtSetupPanel'
import { MatchingResultCard } from './MatchingResultCard'
import { UnassignedPlayers } from './UnassignedPlayers'

type Props = {
  initialPresentPlayers: Player[]
  initialCourts: Court[]
}

export function MatchingClient({ initialPresentPlayers, initialCourts }: Props) {
  const [courts, setCourts] = useState<Court[]>(initialCourts)
  const [result, setResult] = useState<MatchingResult | null>(null)

  // 振り分け実行
  function handleShuffle() {
    const matchingResult = assignPlayersToCourts(initialPresentPlayers, courts)
    setResult(matchingResult)
  }

  // コート更新後に結果をリセット
  function handleCourtsUpdated(updatedCourts: Court[]) {
    setCourts(updatedCourts)
    setResult(null)
  }

  const canShuffle = initialPresentPlayers.length >= 2 && courts.length >= 1

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 出席人数の確認 */}
      <div className="card flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">出席中の参加者</p>
          <p className="text-2xl font-bold text-gray-900">
            {initialPresentPlayers.length}
            <span className="text-base font-normal text-gray-500 ml-1">人</span>
          </p>
        </div>
        <button
          onClick={handleShuffle}
          disabled={!canShuffle}
          className="btn-primary px-6 py-3 text-base gap-2"
        >
          <Shuffle className="w-5 h-5" />
          {result ? '再シャッフル' : '振り分け開始'}
        </button>
      </div>

      {/* 人数不足の警告 */}
      {!canShuffle && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
          ⚠️ 振り分けには最低2人の出席者と1つのコートが必要です。
          「参加者管理」で出席者を選択してください。
        </div>
      )}

      {/* コート設定 */}
      <CourtSetupPanel
        courts={courts}
        onCourtsUpdated={handleCourtsUpdated}
      />

      {/* 振り分け結果 */}
      {result && (
        <div className="space-y-4 animate-slide-up">
          <h2 className="font-bold text-gray-800 text-lg">振り分け結果</h2>
          {result.assignments.map((assignment, i) => (
            <MatchingResultCard key={i} assignment={assignment} />
          ))}
          {result.unassigned.length > 0 && (
            <UnassignedPlayers players={result.unassigned} />
          )}
        </div>
      )}
    </div>
  )
}