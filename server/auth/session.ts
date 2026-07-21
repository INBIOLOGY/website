import { createHash, randomBytes } from 'node:crypto'
import type { NextRequest, NextResponse } from 'next/server'
import { database } from '@/server/db/client'

export const SESSION_COOKIE = 'inbiology_session'
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString('base64url')
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000)
  const sql = database()

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt})
  `

  return { token, expiresAt }
}

export function setSessionCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })
}

export async function deleteSession(token: string | undefined) {
  if (!token) return
  const sql = database()
  await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`
}

export async function authenticatedUser(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  const sql = database()

  const [user] = await sql<{
    id: string
    email: string
    name: string
    role: 'student' | 'instructor' | 'admin'
  }[]>`
    SELECT u.id, u.email, u.name, u.role
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.expires_at > now()
    LIMIT 1
  `

  return user ?? null
}
