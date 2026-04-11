// src/components/auth/LoginForm.tsx
// ログインフォームコンポーネント

'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>
  error: string | null
  loading: boolean
}

export function LoginForm({ onSubmit, error, loading }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <div className="w-full max-w-md">
      {/* ロゴ */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[1.25rem] border-2 border-brand-teal/30 bg-white text-4xl">
          🏸
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">BadmintonManager</h1>
        <p className="mt-2 text-sm font-semibold text-brand-teal">バドミントンサークル管理システム</p>
      </div>

      {/* フォームカード */}
      <div className="rounded-[1.25rem] border-2 border-gray-200 bg-white p-5 sm:p-8">
        <h2 className="mb-6 text-xl font-bold tracking-tight text-gray-900">管理者ログイン</h2>

        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="label">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@badminton.com"
              required
            />
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="label">
              パスワード
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                ログイン中...
              </>
            ) : (
              'ログイン'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}