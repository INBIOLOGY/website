import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { deleteSession, SESSION_COOKIE } from '@/server/auth/session'

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value

  try {
    await deleteSession(token)
  } catch (error) {
    console.error('Session deletion failed', error)
  }

  const response = new NextResponse(null, { status: 204 })
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
  return response
}
