import fs from 'node:fs/promises'
import path from 'node:path'
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) throw new Error('DATABASE_URL is required')

const sql = postgres(url)
const seedDir = path.resolve('db/seed')
const files = (await fs.readdir(seedDir)).filter((file) => file.endsWith('.sql')).sort()
for (const file of files) {
  console.log(`Seeding ${file}`)
  await sql.unsafe(await fs.readFile(path.join(seedDir, file), 'utf8'))
}
await sql.end()
console.log(`Seeded ${files.length} file(s)`)
