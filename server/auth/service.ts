import { database } from '@/server/db/client'
import { createSession } from './session'
import { hashPassword, verifyPassword } from './password'

export class InvalidCredentialsError extends Error {}
export class EmailAlreadyExistsError extends Error {}

type UserRecord = {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  password_hash: string
}

function publicUser(user: UserRecord) {
  return { id: user.id, email: user.email, name: user.name, role: user.role }
}

export async function loginWithPassword(email: string, password: string) {
  const sql = database()
  const [user] = await sql<UserRecord[]>`
    SELECT id, email, name, role, password_hash
    FROM users
    WHERE lower(email) = lower(${email.trim()})
    LIMIT 1
  `

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw new InvalidCredentialsError('Invalid credentials')
  }

  const session = await createSession(user.id)
  return { user: publicUser(user), session }
}

export async function registerStudent(input: { email: string; password: string; name: string }) {
  const sql = database()
  const passwordHash = await hashPassword(input.password)

  try {
    const [user] = await sql<UserRecord[]>`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${input.email.trim().toLowerCase()}, ${passwordHash}, ${input.name.trim()}, 'student')
      RETURNING id, email, name, role, password_hash
    `
    const session = await createSession(user.id)
    return { user: publicUser(user), session }
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === '23505') {
      throw new EmailAlreadyExistsError('Email already exists')
    }
    throw error
  }
}
