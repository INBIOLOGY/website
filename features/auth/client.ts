import {
  authCredentialsSchema,
  authenticatedUserSchema,
  type AuthCredentials,
  type AuthenticatedUser,
} from './contracts'

type AuthMode = 'login' | 'register'

export async function authenticate(
  mode: AuthMode,
  credentials: AuthCredentials,
): Promise<AuthenticatedUser> {
  const body = authCredentialsSchema.parse(credentials)
  const response = await fetch(`/api/auth/${mode}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({})) as { error?: string; user?: unknown }

  if (!response.ok) {
    throw new Error(payload.error || 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้')
  }

  return authenticatedUserSchema.parse(payload.user)
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
    cache: 'no-store',
  })

  if (response.status === 401 || response.status === 503) return null
  if (!response.ok) throw new Error('ไม่สามารถตรวจสอบสถานะบัญชีได้')

  const payload = await response.json() as { user?: unknown }
  return authenticatedUserSchema.parse(payload.user)
}

export async function logoutSession(): Promise<void> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
  if (!response.ok) throw new Error('ไม่สามารถออกจากระบบได้')
}
