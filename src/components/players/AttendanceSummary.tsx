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
    <div className="card border-brand-teal-dark bg-brand-teal text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/25 bg-white/10">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/85">本日の出席者</p>
            <p className="text-3xl font-bold tracking-tight">
              {present}
              <span className="ml-1 text-lg font-medium text-white/75">/ {total}人</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          type="button"
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/25 sm:w-auto sm:justify-start"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">リセット</span>
        </button>
      </div>
    </div>
  )
}