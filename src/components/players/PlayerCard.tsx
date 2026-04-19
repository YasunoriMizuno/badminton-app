'use client'

import { useState } from 'react'
import { Trash2, Loader2, Pencil, Check, X } from 'lucide-react'
import type { Player } from '@/types'
import { formatLevel, cn } from '@/lib/utils'
import {
  Badge,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui'

type Props = {
  player: Player
  onDeleted: (id: number) => void
  onPresenceToggled: (id: number, isPresent: boolean) => void
  onUpdated: (updated: Player) => void
}

export function PlayerCard({ player, onDeleted, onPresenceToggled, onUpdated }: Props) {
  const [loadingPresence, setLoadingPresence] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(player.name)
  const [editLevel, setEditLevel] = useState(player.level ?? '')
  const [editGender, setEditGender] = useState(player.gender ?? '')
  const [loadingEdit, setLoadingEdit] = useState(false)

  async function handleTogglePresence() {
    setLoadingPresence(true)
    try {
      const res = await fetch(`/api/players/${player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_present: !player.is_present }),
      })
      if (!res.ok) throw new Error()
      onPresenceToggled(player.id, !player.is_present)
    } catch {
      alert('更新に失敗しました')
    } finally {
      setLoadingPresence(false)
    }
  }

  async function handleDelete() {
    setLoadingDelete(true)
    try {
      const res = await fetch(`/api/players/${player.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDeleted(player.id)
    } catch {
      alert('削除に失敗しました')
    } finally {
      setLoadingDelete(false)
    }
  }

  async function handleSaveEdit() {
    if (!editName.trim()) return
    setLoadingEdit(true)
    try {
      const res = await fetch(`/api/players/${player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName.trim(),
          level: editLevel !== '' ? Number(editLevel) : null,
          gender: editGender || null,
        }),
      })
      if (!res.ok) throw new Error()
      const { data } = await res.json()
      onUpdated(data)
      setEditing(false)
    } catch {
      alert('更新に失敗しました')
    } finally {
      setLoadingEdit(false)
    }
  }

  function handleCancelEdit() {
    setEditName(player.name)
    setEditLevel(player.level ?? '')
    setEditGender(player.gender ?? '')
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 px-3 py-3 rounded-lg border border-brand-teal/40 bg-brand-mint/30 sm:px-4">
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="input flex-1 min-w-32 py-1.5 text-sm"
          placeholder="名前"
          autoFocus
          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') handleCancelEdit() }}
        />
        <select
          value={editLevel}
          onChange={(e) => setEditLevel(e.target.value)}
          className="input w-28 py-1.5 text-sm"
        >
          <option value="">レベル未設定</option>
          <option value="1">1 - 初心者</option>
          <option value="2">2 - 初級</option>
          <option value="3">3 - 中級</option>
          <option value="4">4 - 上級</option>
          <option value="5">5 - エキスパート</option>
        </select>
        <select
          value={editGender}
          onChange={(e) => setEditGender(e.target.value)}
          className="input w-24 py-1.5 text-sm"
        >
          <option value="">未設定</option>
          <option value="male">男性</option>
          <option value="female">女性</option>
        </select>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSaveEdit}
            disabled={loadingEdit || !editName.trim()}
            className="p-1.5 text-brand-teal hover:text-brand-teal-dark disabled:opacity-40"
          >
            {loadingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button onClick={handleCancelEdit} className="p-1.5 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 gap-y-2 px-3 py-3 rounded-lg border transition-all duration-150 sm:px-4',
        player.is_present
          ? 'border-brand-teal/30 bg-brand-mint'
          : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      {/* 左側：出席チェック・名前・レベル */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          onClick={handleTogglePresence}
          disabled={loadingPresence}
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
            player.is_present
              ? 'border-brand-teal bg-brand-teal'
              : 'border-gray-300 hover:border-brand-teal/50'
          )}
        >
          {loadingPresence ? (
            <Loader2 className="w-3 h-3 animate-spin text-white" />
          ) : player.is_present ? (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : null}
        </button>

        <span className={cn('min-w-0 truncate font-medium text-sm', player.is_present ? 'text-brand-teal-dark' : 'text-gray-700')}>
          {player.name}
        </span>

        {player.level && (
          <span className="hidden text-xs text-amber-500 sm:block">{formatLevel(player.level)}</span>
        )}
      </div>

      {/* 性別 */}
      {player.gender && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          player.gender === 'male' ? 'bg-brand-sky-soft text-brand-ocean' : 'bg-pink-100 text-pink-600'
        }`}>
          {player.gender === 'male' ? '男性' : '女性'}
        </span>
      )}

      {/* 右側：バッジ・編集・削除 */}
      <div className="flex items-center gap-1.5">
        {player.is_present && <Badge variant="green">出席</Badge>}
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-gray-400 hover:text-brand-teal hover:bg-brand-mint rounded-lg transition-colors"
          title="編集"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={loadingDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              {loadingDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>参加者を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                「{player.name}」を削除します。この操作は元に戻せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
