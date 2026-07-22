// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest'
import React from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const harness = vi.hoisted(() => ({
  initialPage: 'landing',
  navigationCalls: vi.fn(),
  authenticate: vi.fn(),
  getCurrentUser: vi.fn(),
  logoutSession: vi.fn(),
  createPendingOrder: vi.fn(),
  listPublishedCourses: vi.fn(),
}))

vi.mock('@/features/navigation/use-legacy-navigation', async () => {
  const ReactModule = await import('react')

  return {
    useLegacyNavigation: () => {
      const [page, setCurrentPage] = ReactModule.useState(harness.initialPage)
      const setPage = ReactModule.useCallback((nextPage: string) => {
        harness.navigationCalls(nextPage)
        setCurrentPage(nextPage)
      }, [])

      return { page, setPage }
    },
  }
})

vi.mock('@/features/auth/client', () => ({
  authenticate: harness.authenticate,
  getCurrentUser: harness.getCurrentUser,
  logoutSession: harness.logoutSession,
}))

vi.mock('@/features/checkout/client', () => ({
  createPendingOrder: harness.createPendingOrder,
}))

vi.mock('@/features/catalog/client', () => ({
  listPublishedCourses: harness.listPublishedCourses,
}))

import App from './App'

const renderApp = () => render(<App />)

const usePage = (page: string, user: null | { role: 'student' | 'admin' } = null) => {
  harness.initialPage = page
  harness.getCurrentUser.mockResolvedValue(user)
}

beforeEach(() => {
  harness.initialPage = 'landing'
  harness.navigationCalls.mockReset()
  harness.authenticate.mockReset()
  harness.getCurrentUser.mockReset().mockResolvedValue(null)
  harness.logoutSession.mockReset().mockResolvedValue(undefined)
  harness.createPendingOrder.mockReset().mockResolvedValue({
    orderId: 'ORD-CHARACTERIZATION',
    paymentUrl: null,
  })
  harness.listPublishedCourses.mockReset().mockResolvedValue([])
  localStorage.clear()
  document.body.className = ''
  document.body.style.overflow = ''
  vi.useRealTimers()
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('App characterization: routes and auth guards', () => {
  it('renders the public landing page for a guest', async () => {
    renderApp()

    expect(screen.getByText('เรียนชีวะให้เข้าใจ', { exact: false })).toBeInTheDocument()
    await waitFor(() => expect(harness.getCurrentUser).toHaveBeenCalledOnce())
    expect(harness.navigationCalls).not.toHaveBeenCalledWith('login')
  })

  it('redirects a guest from a protected student page to login', async () => {
    usePage('dashboard')

    renderApp()

    expect(await screen.findByRole('heading', { name: 'เข้าสู่ระบบ' })).toBeInTheDocument()
    expect(harness.navigationCalls).toHaveBeenCalledWith('login')
  })

  it('renders the student dashboard for a student session', async () => {
    usePage('dashboard', { role: 'student' })

    renderApp()

    expect(await screen.findByRole('heading', { name: 'คอร์สเรียนของคุณ' })).toBeInTheDocument()
    expect(screen.getByText('ลงทะเบียนเรียนแล้วทั้งหมด 1 คอร์ส')).toBeInTheDocument()
    expect(harness.navigationCalls).not.toHaveBeenCalledWith('login')
  })

  it('redirects a student away from admin but renders admin for an admin session', async () => {
    usePage('admin', { role: 'student' })
    const firstRender = renderApp()

    expect(await screen.findByRole('heading', { name: 'เข้าสู่ระบบ' })).toBeInTheDocument()
    expect(harness.navigationCalls).toHaveBeenCalledWith('login')

    firstRender.unmount()
    harness.navigationCalls.mockClear()
    usePage('admin', { role: 'admin' })
    renderApp()

    expect(await screen.findByRole('heading', { name: 'ภาพรวมระบบวิเคราะห์ข้อมูล' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /จัดการคอร์สเรียน/ })).toBeInTheDocument()
    expect(harness.navigationCalls).not.toHaveBeenCalledWith('login')
  })
})

describe('App characterization: catalog, cart, and checkout', () => {
  it('keeps the cart contents through coupon application and creates the expected order', async () => {
    usePage('courses', { role: 'student' })
    renderApp()

    await screen.findByText(/พบคอร์สเรียนชีววิทยา \d+ คอร์ส/)
    const purchasableCourseButton = screen
      .getAllByRole('button', { name: /ชำระเงิน/ })
      .find(button => !(button as HTMLButtonElement).disabled)
    expect(purchasableCourseButton).toBeDefined()

    fireEvent.click(purchasableCourseButton!)
    expect(screen.getByText(/เพิ่ม ".+" ลงตะกร้าแล้ว/)).toBeInTheDocument()

    fireEvent.click(screen.getByTitle('ตะกร้าสินค้า'))
    const drawerHeading = screen.getByRole('heading', { name: /ตะกร้าชำระเงิน/ })
    expect(drawerHeading).toBeInTheDocument()
    expect(within(drawerHeading).getByText('1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ดำเนินการชำระเงิน' }))
    expect(await screen.findByRole('heading', { name: '💳 เลือกช่องทางชำระเงิน' })).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('กรอกโค้ดส่วนลด (INBIOLOGY100)'), {
      target: { value: 'inbiology100' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'ใช้' }))
    expect(screen.getByText(/ใช้โค้ดสำเร็จ! ลดเพิ่ม ฿100/)).toBeInTheDocument()
    expect(screen.getByText('ส่วนลดพิเศษ')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'ยืนยันการชำระเงิน' }))
    await waitFor(() => expect(harness.createPendingOrder).toHaveBeenCalledOnce())
    expect(harness.createPendingOrder).toHaveBeenCalledWith({
      courseSlugs: [expect.any(String)],
      couponCode: 'inbiology100',
      paymentMethod: 'promptpay',
    })
    expect(await screen.findByText(/สร้างคำสั่งซื้อ ORD-CHARACTERIZATION/)).toBeInTheDocument()
  })

  it('keeps API catalog data when published courses are returned', async () => {
    harness.listPublishedCourses.mockResolvedValue([
      {
        slug: 'api-course',
        title: 'API Biology Course',
        description: 'Course loaded from the catalog boundary',
        price: 550,
        originalPrice: 700,
        level: 'ม.6',
        imageUrl: '/api-course.jpg',
        status: 'published',
      },
    ])
    usePage('courses')

    renderApp()

    expect(await screen.findByText('API Biology Course')).toBeInTheDocument()
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem('inbiology_courses_v9') ?? '[]')
      expect(saved).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'api-course', title: 'API Biology Course' }),
      ]))
    })
  })
})

describe('App characterization: modal and toast behavior', () => {
  it('opens a trial dialog, traps focus, and closes it with Escape', async () => {
    usePage('courses')
    renderApp()

    await screen.findByText(/พบคอร์สเรียนชีววิทยา \d+ คอร์ส/)
    const trialButton = screen.getAllByRole('button', { name: 'ทดลองเรียนฟรี' })[0]
    trialButton.focus()
    fireEvent.click(trialButton)

    const dialog = screen.getByRole('dialog', { name: /ตัวอย่างบทเรียนทดลองเรียน/ })
    expect(dialog).toHaveFocus()
    expect(document.body).toHaveStyle({ overflow: 'hidden' })

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.overflow).toBe('')
    expect(trialButton).toHaveFocus()
  })

  it('automatically removes a cart toast after four seconds', async () => {
    usePage('courses', { role: 'student' })
    renderApp()
    await screen.findByText(/พบคอร์สเรียนชีววิทยา \d+ คอร์ส/)

    vi.useFakeTimers()
    const purchasableCourseButton = screen
      .getAllByRole('button', { name: /ชำระเงิน/ })
      .find(button => !(button as HTMLButtonElement).disabled)
    fireEvent.click(purchasableCourseButton!)

    expect(screen.getByText(/เพิ่ม ".+" ลงตะกร้าแล้ว/)).toBeInTheDocument()
    act(() => vi.advanceTimersByTime(4_001))
    expect(screen.queryByText(/เพิ่ม ".+" ลงตะกร้าแล้ว/)).not.toBeInTheDocument()
  })
})
