import { z } from 'zod'

export const checkoutRequestSchema = z.object({
  courseSlugs: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1).max(20),
  couponCode: z.string().trim().max(40).optional(),
  paymentMethod: z.enum(['promptpay', 'credit', 'truemoney', 'bank']),
})

export const pendingOrderSchema = z.object({
  orderId: z.string(),
  status: z.literal('pending'),
  paymentUrl: z.url().optional(),
})

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>
