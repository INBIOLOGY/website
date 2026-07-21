import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../src/index.css'
import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'INBIOLOGY Academy',
    template: '%s | INBIOLOGY Academy',
  },
  description: 'แพลตฟอร์มเรียนชีววิทยาออนไลน์สำหรับนักเรียนมัธยมและผู้เตรียมสอบ',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  )
}
