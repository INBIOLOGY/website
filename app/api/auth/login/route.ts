import { NextResponse } from 'next/server'
import { authCredentialsSchema } from '@/features/auth/contracts'
import { DatabaseUnavailableError } from '@/server/db/client'
import { InvalidCredentialsError, loginWithPassword } from '@/server/auth/service'
import { setSessionCookie } from '@/server/auth/session'

export async function POST(request: Request) {
  const parsed = authCredentialsSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง' }, { status: 400 })
  }

  try {
    const { user, session } = await loginWithPassword(parsed.data.email, parsed.data.password)
    const response = NextResponse.json({ user })
    setSessionCookie(response, session.token, session.expiresAt)
    return response
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: 'ระบบบัญชียังไม่พร้อมใช้งาน' }, { status: 503 })
    }
    console.error('Login failed', error)
    return NextResponse.json({ error: 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้' }, { status: 500 })
  }
}
