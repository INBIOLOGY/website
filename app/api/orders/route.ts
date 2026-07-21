import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkoutRequestSchema } from '@/features/checkout/contracts'
import { authenticatedUser } from '@/server/auth/session'
import { DatabaseUnavailableError } from '@/server/db/client'
import { createOrder, OrderValidationError } from '@/server/orders/service'

export async function POST(request: NextRequest) {
  const parsed = checkoutRequestSchema.safeParse(await request.json().catch(() => null))

  if (!parsed.success) {
    return NextResponse.json({ error: 'ข้อมูลคำสั่งซื้อไม่ถูกต้อง' }, { status: 400 })
  }

  try {
    const user = await authenticatedUser(request)
    if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนสั่งซื้อ' }, { status: 401 })

    const order = await createOrder(user.id, parsed.data)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json({ error: 'ระบบสั่งซื้อยังไม่พร้อมใช้งาน' }, { status: 503 })
    }
    console.error('Order creation failed', error)
    return NextResponse.json({ error: 'ไม่สามารถสร้างคำสั่งซื้อได้ในขณะนี้' }, { status: 500 })
  }
}
