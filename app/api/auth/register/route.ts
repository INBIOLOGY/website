import { NextResponse } from 'next/server'
import { authCredentialsSchema } from '@/features/auth/contracts'
import { DatabaseUnavailableError } from '@/server/db/client'
import { EmailAlreadyExistsError, registerStudent } from '@/server/auth/service'
import { setSessionCookie } from '@/server/auth/session'

export async function POST(request: Request) {
  const parsed = authCredentialsSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success || !parsed.data.name) {
    return NextResponse.json({ error: 'ข้อมูลสมัครสมาชิกไม่ครบถ้วน' }, { status: 400 })
  }

  try {
    const { user, session } = await registerStudent({
      email: parsed.data.email,
      password: parsed.data.password,
      name: parsed.data.name,
    })
    const response = NextResponse.json({ user }, { status: 201 })
    setSessionCookie(response, session.token, session.expiresAt)
    return response
  } catch (error) {
    if (error instanceof EmailAlreadyExistsError) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' }, { status: 409 })
    }
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: 'ระบบสมัครสมาชิกยังไม่พร้อมใช้งาน' }, { status: 503 })
    }
    console.error('Registration failed', error)
    return NextResponse.json({ error: 'ไม่สามารถสมัครสมาชิกได้ในขณะนี้' }, { status: 500 })
  }
}
