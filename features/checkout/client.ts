import { checkoutRequestSchema, pendingOrderSchema, type CheckoutRequest } from './contracts'

export async function createPendingOrder(input: CheckoutRequest) {
  const body = checkoutRequestSchema.parse(input)
  const response = await fetch('/api/orders', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({})) as { error?: string }
  if (!response.ok) {
    throw new Error(payload.error || 'ไม่สามารถสร้างคำสั่งซื้อได้ในขณะนี้')
  }

  return pendingOrderSchema.parse(payload)
}
