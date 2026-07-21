import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scryptAsync = promisify(scrypt)
const KEY_LENGTH = 64

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derivedKey = await scryptAsync(password, salt, KEY_LENGTH) as Buffer
  return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const [algorithm, encodedSalt, encodedHash] = encoded.split('$')
  if (algorithm !== 'scrypt' || !encodedSalt || !encodedHash) return false

  try {
    const salt = Buffer.from(encodedSalt, 'base64url')
    const expected = Buffer.from(encodedHash, 'base64url')
    const actual = await scryptAsync(password, salt, expected.length) as Buffer
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}
