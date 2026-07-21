import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import postgres from 'postgres'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Copy .env.example to .env.local first.')
}

const migrationsDirectory = path.resolve('db/migrations')
const migrationFiles = (await readdir(migrationsDirectory))
  .filter(file => file.endsWith('.sql'))
  .sort()

const sql = postgres(databaseUrl, { max: 1 })

try {
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `

  for (const file of migrationFiles) {
    const [existing] = await sql`
      SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE name = ${file}) AS exists
    `
    if (existing.exists) continue

    const migration = await readFile(path.join(migrationsDirectory, file), 'utf8')
    await sql.begin(async transaction => {
      await transaction.unsafe(migration)
      await transaction`INSERT INTO schema_migrations (name) VALUES (${file})`
    })
    process.stdout.write(`Applied ${file}\n`)
  }
} finally {
  await sql.end()
}
