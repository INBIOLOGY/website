import { z } from 'zod'

const optionalText = (schema: z.ZodTypeAny) => z.preprocess((value) => value === '' ? undefined : value, schema.optional())

const serverEnvironmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url().optional(),
  SESSION_SECRET: optionalText(z.string().min(32)),
  PAYMENT_PROVIDER: optionalText(z.string().min(1)),
  PAYMENT_WEBHOOK_SECRET: optionalText(z.string().min(16)),
  OBJECT_STORAGE_ENDPOINT: optionalText(z.url()),
  OBJECT_STORAGE_BUCKET: optionalText(z.string().min(1)),
  OBJECT_STORAGE_ACCESS_KEY: optionalText(z.string().min(1)),
  OBJECT_STORAGE_SECRET_KEY: optionalText(z.string().min(1)),
})

export const serverEnvironment = serverEnvironmentSchema.parse(process.env)
