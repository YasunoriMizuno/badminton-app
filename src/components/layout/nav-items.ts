import type { LucideIcon } from 'lucide-react'
import { Users, Shuffle, Trophy, BarChart3 } from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  /** モバイル下部ナビ用の短いラベル */
  shortLabel: string
  icon: LucideIcon
  description: string
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/players', label: '参加者管理', shortLabel: '参加者', icon: Users, description: '出席者の選択・登録' },
  { href: '/matching', label: 'コート振り分け', shortLabel: '振り分け', icon: Shuffle, description: '自動でペアを振り分け' },
  { href: '/result', label: '試合結果入力', shortLabel: '結果', icon: Trophy, description: '勝敗・スコアを記録' },
  { href: '/ranking', label: 'ランキング', shortLabel: '順位', icon: BarChart3, description: '勝率・成績を確認' },
]
