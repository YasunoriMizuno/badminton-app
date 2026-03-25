// src/app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(email: string, password: string) {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
      return
    }

    router.push('/players')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-700 to-green-600 flex items-center justify-center p-4">
      <LoginForm onSubmit={handleLogin} error={error} loading={loading} />
    </div>
  )
}