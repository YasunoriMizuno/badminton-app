// src/components/players/AttendanceSummary.tsx
// 出席状況サマリーカード

'use client'

import { Users, RotateCcw } from 'lucide-react'

type Props = {
  total: number
  present: number
  onResetAll: () => void
}

export function AttendanceSummary({ total, present, onResetAll }: Props) {
  async function handleReset() {
    if (!confirm('全員の出席フラグをリセットしますか？')) return

    try {
      const res = await fetch('/api/players/reset-presence', {
        method: 'POST',
      })
      if (!res.ok) throw new Error()
      onResetAll()
    } catch {
      alert('リセットに失敗しました')
    }
  }

  return (
    <div className="card bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-green-100 text-sm">本日の出席者</p>
            <p className="text-3xl font-bold">
              {present}
              <span className="text-lg font-normal text-green-200 ml-1">
                / {total}人
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">リセット</span>
        </button>
      </div>
    </div>
  )
}