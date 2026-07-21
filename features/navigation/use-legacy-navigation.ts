'use client'

import { useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { pageToPath, pathToPage } from './routes'

export function useLegacyNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const setPage = useCallback((page: string) => {
    router.push(pageToPath(page))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [router])

  return {
    page: pathToPage(pathname),
    setPage,
  }
}
