// src/components/matching/MatchingClient.tsx
// コート振り分け画面の状態管理コンポーネント

'use client'

import { useState, useEffect } from 'react'
import { Shuffle, RotateCcw } from 'lucide-react'
import type { Player, Court, MatchingResult } from '@/types'
import { assignPlayersToCourts } from './matching'
import { CourtSetupPanel } from './CourtSetupPanel'
import { MatchingResultCard } from './MatchingResultCard'
import { UnassignedPlayers } from './UnassignedPlayers'

const STORAGE_KEY = 'matching_result'

type Props = {
  initialPresentPlayers: Player[]
  initialCourts: Court[]
}

export function MatchingClient({ initialPresentPlayers, initialCourts }: Props) {
  const [courts, setCourts] = useState<Court[]>(initialCourts)
  const [result, setResult] = useState<MatchingResult | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // 結果をsessionStorageに同期
  useEffect(() => {
    if (result) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [result])

  // 振り分け実行
  function handleShuffle() {
    const matchingResult = assignPlayersToCourts(initialPresentPlayers, courts)
    setResult(matchingResult)
  }

  // リセット
  function handleReset() {
    setResult(null)
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
      <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">出席中の参加者</p>
          <p className="text-2xl font-bold text-gray-900">
            {initialPresentPlayers.length}
            <span className="text-base font-normal text-gray-500 ml-1">人</span>
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {result && (
            <button
              onClick={handleReset}
              className="btn-secondary shrink-0 px-4 py-3 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              リセット
            </button>
          )}
          <button
            onClick={handleShuffle}
            disabled={!canShuffle}
            className="btn-primary flex-1 shrink-0 px-6 py-3 text-base gap-2 sm:flex-none"
          >
            <Shuffle className="w-5 h-5" />
            {result ? '再シャッフル' : '振り分け開始'}
          </button>
        </div>
      </div>

      {/* 人数不足の警告 */}
      {!canShuffle && (
        <div className="rounded-[1rem] border-2 border-brand-yellow/50 bg-brand-yellow-soft p-4 text-sm font-medium text-gray-900">
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
