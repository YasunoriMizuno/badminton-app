// src/app/layout.tsx
// アプリ全体の共通レイアウト

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BadmintonManager | バドミントン管理アプリ',
  description: 'バドミントンサークルのコート振り分けと勝敗管理をスマートに',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}