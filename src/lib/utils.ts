// src/lib/utils.ts
// アプリ全体で使う便利な関数をまとめたファイル

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwindのクラスを安全にまとめる関数
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日付を「2024年1月15日」形式で表示
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 勝率を「66.7%」形式で表示
export function formatWinRate(rate: number): string {
  if (isNaN(rate)) return '-'
  return `${(rate * 100).toFixed(1)}%`
}

// レベルを星で表示（例：3 → ★★★☆☆）
export function formatLevel(level: number | null): string {
  if (!level) return '-'
  return '★'.repeat(level) + '☆'.repeat(5 - level)
}

// singles/doublesを日本語に変換
export function formatMatchType(matchType: string): string {
  return matchType === 'doubles' ? 'ダブルス' : 'シングルス'
}