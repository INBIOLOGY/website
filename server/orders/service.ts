import { database } from '@/server/db/client'
import type { CheckoutRequest } from '@/features/checkout/contracts'

export class OrderValidationError extends Error {}

type CourseRow = {
  id: string
  slug: string
  title: string
  price_satang: number
}

type CouponRow = {
  id: string
  discount_type: 'fixed' | 'percent'
  discount_value: number
  max_redemptions: number | null
  redeemed_count: number
  starts_at: Date | null
  expires_at: Date | null
  active: boolean
}

export async function createOrder(userId: string, input: CheckoutRequest) {
  const sql = database()
  const uniqueSlugs = [...new Set(input.courseSlugs)]

  if (uniqueSlugs.length !== input.courseSlugs.length) {
    throw new OrderValidationError('มีคอร์สซ้ำในตะกร้า')
  }

  return sql.begin(async transaction => {
    const courses = await transaction<CourseRow[]>`
      SELECT id, slug, title, price_satang
      FROM courses
      WHERE slug = ANY(${transaction.array(uniqueSlugs)}::text[])
        AND status = 'published'
      FOR SHARE
    `

    if (courses.length !== uniqueSlugs.length) {
      throw new OrderValidationError('มีคอร์สที่ไม่พร้อมจำหน่าย')
    }

    const enrolled = await transaction<{ course_id: string }[]>`
      SELECT course_id
      FROM enrollments
      WHERE user_id = ${userId}
        AND course_id = ANY(${transaction.array(courses.map(course => course.id))}::uuid[])
        AND revoked_at IS NULL
        AND (expires_at IS NULL OR expires_at > now())
      LIMIT 1
    `

    if (enrolled.length > 0) {
      throw new OrderValidationError('คุณมีสิทธิ์เรียนบางคอร์สในรายการนี้อยู่แล้ว')
    }

    const subtotalSatang = courses.reduce((sum, course) => sum + course.price_satang, 0)
    let discountSatang = 0
    let couponId: string | null = null

    if (input.couponCode) {
      const [coupon] = await transaction<CouponRow[]>`
        SELECT id, discount_type, discount_value, max_redemptions, redeemed_count,
               starts_at, expires_at, active
        FROM coupons
        WHERE upper(code) = upper(${input.couponCode})
        FOR UPDATE
      `

      const now = new Date()
      const unavailable = !coupon
        || !coupon.active
        || (coupon.starts_at && coupon.starts_at > now)
        || (coupon.expires_at && coupon.expires_at <= now)
        || (coupon.max_redemptions !== null && coupon.redeemed_count >= coupon.max_redemptions)

      if (unavailable) throw new OrderValidationError('คูปองไม่พร้อมใช้งาน')

      couponId = coupon.id
      discountSatang = coupon.discount_type === 'percent'
        ? Math.round(subtotalSatang * Math.min(coupon.discount_value, 100) / 100)
        : Math.min(coupon.discount_value, subtotalSatang)
    }

    const totalSatang = Math.max(0, subtotalSatang - discountSatang)
    const [order] = await transaction<{ id: string }[]>`
      INSERT INTO orders (
        user_id, status, subtotal_satang, discount_satang, total_satang, coupon_id
      ) VALUES (
        ${userId}, 'pending', ${subtotalSatang}, ${discountSatang}, ${totalSatang}, ${couponId}
      )
      RETURNING id
    `

    for (const course of courses) {
      await transaction`
        INSERT INTO order_items (order_id, course_id, title_snapshot, unit_price_satang)
        VALUES (${order.id}, ${course.id}, ${course.title}, ${course.price_satang})
      `
    }

    return { orderId: order.id, status: 'pending' as const }
  })
}
