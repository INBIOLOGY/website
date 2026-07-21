import { z } from 'zod'

export const authCredentialsSchema = z.object({
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร').max(128),
  name: z.string().trim().min(2).max(120).optional(),
})

export const authenticatedUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['student', 'instructor', 'admin']),
})

export type AuthCredentials = z.infer<typeof authCredentialsSchema>
export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>
