import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from './password'

describe('password hashing', () => {
  it('verifies the original password and rejects another password', async () => {
    const hash = await hashPassword('correct horse battery staple')

    expect(hash).not.toContain('correct horse battery staple')
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true)
    await expect(verifyPassword('wrong password', hash)).resolves.toBe(false)
  })

  it('rejects malformed hashes', async () => {
    await expect(verifyPassword('password', 'not-a-valid-hash')).resolves.toBe(false)
  })
})
