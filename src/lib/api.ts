import { NextResponse } from 'next/server'

/** 成功レスポンス */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status })
}

/** エラーレスポンス */
export function err(message: string, status = 500) {
  return NextResponse.json({ data: null, error: message }, { status })
}

/** URLパラメータの ID を数値にパース。不正な場合は null を返す */
export function parseId(param: string): number | null {
  const id = Number(param)
  return isNaN(id) ? null : id
}
