import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authenticatedUser } from '@/server/auth/session'
import { DatabaseUnavailableError } from '@/server/db/client'

export async function GET(request: NextRequest) {
  try {
    const user = await authenticatedUser(request)
    if (!user) return NextResponse.json({ error: 'ไม่ได้เข้าสู่ระบบ' }, { status: 401 })
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: 'ระบบบัญชียังไม่พร้อมใช้งาน' }, { status: 503 })
    }
    console.error('Session lookup failed', error)
    return NextResponse.json({ error: 'ไม่สามารถตรวจสอบสถานะบัญชีได้' }, { status: 500 })
  }
}
