export const PAGE_ROUTES = {
  landing: '/',
  courses: '/courses',
  login: '/login',
  dashboard: '/dashboard',
  classroom: '/classroom',
  quiz: '/exams',
  exams: '/exams',
  checkout: '/checkout',
  admin: '/admin',
  guide: '/guide',
  settings: '/settings',
  blog: '/blog',
  support: '/support',
} as const

export type LegacyPage = keyof typeof PAGE_ROUTES

const PATH_PAGES: Record<string, LegacyPage> = Object.fromEntries(
  Object.entries(PAGE_ROUTES).map(([page, path]) => [path, page]),
) as Record<string, LegacyPage>

PATH_PAGES['/exams'] = 'exams'

export const PUBLIC_PAGES = new Set<LegacyPage>([
  'landing',
  'courses',
  'login',
  'guide',
  'blog',
  'support',
])

export function pageToPath(page: string): string {
  return PAGE_ROUTES[page as LegacyPage] ?? '/'
}

export function pathToPage(pathname: string): LegacyPage {
  const normalized = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname
  return PATH_PAGES[normalized] ?? 'landing'
}
