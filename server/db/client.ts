import postgres from 'postgres'
import { serverEnvironment } from '@/lib/env'

type DatabaseClient = ReturnType<typeof postgres>

let client: DatabaseClient | undefined

export class DatabaseUnavailableError extends Error {
  constructor() {
    super('Database is not configured')
    this.name = 'DatabaseUnavailableError'
  }
}

export function database(): DatabaseClient {
  if (!serverEnvironment.DATABASE_URL) throw new DatabaseUnavailableError()

  client ??= postgres(serverEnvironment.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  return client
}
