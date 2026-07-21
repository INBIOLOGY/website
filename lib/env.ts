import { z } from 'zod'

const serverEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url().optional(),
  SESSION_SECRET: z.string().min(32).optional(),
  PAYMENT_PROVIDER: z.string().min(1).optional(),
  PAYMENT_WEBHOOK_SECRET: z.string().min(16).optional(),
  OBJECT_STORAGE_ENDPOINT: z.url().optional(),
  OBJECT_STORAGE_BUCKET: z.string().min(1).optional(),
  OBJECT_STORAGE_ACCESS_KEY: z.string().min(1).optional(),
  OBJECT_STORAGE_SECRET_KEY: z.string().min(1).optional(),
})

export const serverEnvironment = serverEnvironmentSchema.parse(process.env)
