import { notFound } from 'next/navigation'
import LegacyApp from '@/src/App'

const SUPPORTED_ROUTES = new Set([
  'courses',
  'login',
  'dashboard',
  'classroom',
  'exams',
  'checkout',
  'admin',
  'guide',
  'settings',
  'blog',
  'support',
])

export function generateStaticParams() {
  return [...SUPPORTED_ROUTES].map(path => ({ path: [path] }))
}

export default async function LegacyRoute({
  params,
}: Readonly<{ params: Promise<{ path: string[] }> }>) {
  const { path } = await params

  if (path.length !== 1 || !SUPPORTED_ROUTES.has(path[0])) {
    notFound()
  }

  return <LegacyApp />
}
