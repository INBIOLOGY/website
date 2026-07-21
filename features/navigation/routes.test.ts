import { describe, expect, it } from 'vitest'
import { pageToPath, pathToPage } from './routes'

describe('legacy route mapping', () => {
  it('maps legacy pages to stable URLs', () => {
    expect(pageToPath('courses')).toBe('/courses')
    expect(pageToPath('admin')).toBe('/admin')
  })

  it('maps URLs back to the legacy page', () => {
    expect(pathToPage('/dashboard')).toBe('dashboard')
    expect(pathToPage('/settings/')).toBe('settings')
  })

  it('falls back safely for an unknown page', () => {
    expect(pageToPath('unknown')).toBe('/')
    expect(pathToPage('/unknown')).toBe('landing')
  })
})
