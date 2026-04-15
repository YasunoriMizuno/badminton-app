import { NextRequest, NextResponse } from 'next/server'
import { CIRCLE_COOKIE } from '@/lib/circle'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const circleId = searchParams.get('id')
  const redirectTo = searchParams.get('redirect') ?? '/players'

  if (!circleId || isNaN(Number(circleId))) {
    return NextResponse.redirect(new URL('/select-circle', request.url))
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url))
  response.cookies.set(CIRCLE_COOKIE, circleId, { path: '/', httpOnly: true })
  return response
}
