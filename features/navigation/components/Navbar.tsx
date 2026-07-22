'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, LogOut, ShoppingCart, ChevronRight, Eye, Bell, HelpCircle, Settings, Globe, Moon, Sun, BookText, Layers } from 'lucide-react'
import { C } from '@/src/app-data'
import type { CSSProperties } from 'react'



// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
export function Navbar({ setPage, userRole, onLogout, cartCount, openCart, addToast, darkMode, setDarkMode, lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'หน้าแรก', page: 'landing' },
    { label: 'คอร์สเรียน', page: 'courses' },
    { label: 'คลังข้อสอบ', page: 'exams' },
  ];

  const moreLinks = [
    { label: 'บทความ', page: 'blog', icon: <BookText size={16} /> },
    { label: 'ช่วยเหลือ & FAQ', page: 'support', icon: <HelpCircle size={16} /> },
  ];

  const dividerStyle = {
    height: '1px', background: 'rgba(0,0,0,0.07)', margin: '4px 0'
  };

  const menuBtnStyle = (active: boolean): CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
    border: 'none', textAlign: 'left', fontFamily: 'inherit',
    background: active ? '#F0F4FF' : 'transparent',
    color: active ? C.sky : '#374151',
    transition: 'background 0.15s',
  });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.96)',
      boxShadow: scrolled ? '0 8px 32px rgba(30,58,138,0.08)' : 'none',
      borderBottom: '1px solid rgba(229,231,235,0.6)',
      backdropFilter: 'blur(24px)',
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

          {/* ── Logo ── */}
          <button onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="INBIOLOGY Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(185,28,28,0.15))' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontWeight: 900, fontSize: '20px', color: C.navy, display: 'block', lineHeight: 1 }}>INBIOLOGY</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: C.sky, display: 'block', marginTop: '2px' }}>by พี่ต้น</span>
            </div>
          </button>

          {/* ── Main Nav Links (ใช้บ่อย) ── */}
          <nav className="desktop-nav" style={{ gap: '2px' }}>
            {navLinks.map(l => (
              <button key={l.page} onClick={() => setPage(l.page)}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, color: '#4B5563', cursor: 'pointer', background: 'none', border: 'none', borderRadius: '8px', transition: 'all 0.15s' }}
                onMouseOver={e => { e.currentTarget.style.color = C.sky; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseOut={e => { e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.background = 'none'; }}>
                {l.label}
              </button>
            ))}
            {userRole === 'student' && (
              <button onClick={() => setPage('dashboard')}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, color: C.navy, cursor: 'pointer', background: 'none', border: 'none', borderRadius: '8px' }}
                onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                ห้องเรียนของฉัน
              </button>
            )}
            {userRole === 'admin' && (
              <button onClick={() => setPage('admin')}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, color: C.red, cursor: 'pointer', background: 'none', border: 'none', borderRadius: '8px' }}
                onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                แดชบอร์ดแอดมิน
              </button>
            )}
          </nav>

          {/* ── Right Action Zone ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

            {/* Cart */}
            <button onClick={openCart}
              style={{ position: 'relative', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
              onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
              title="ตะกร้าสินค้า">
              <ShoppingCart size={20} color="#4B5563" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px',
                  background: C.red, color: 'white', fontSize: '9px', fontWeight: 900, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Profile */}
            {userRole === 'guest'
              ? <button onClick={() => setPage('login')}
                style={{ background: C.sky, color: 'white', fontWeight: 700, fontSize: '13px', padding: '9px 18px', borderRadius: '10px', cursor: 'pointer', border: 'none', boxShadow: `0 4px 12px rgba(30,58,138,0.2)`, whiteSpace: 'nowrap' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                เข้าสู่ระบบ
              </button>
              : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: '#111827', margin: 0 }}>{userRole === 'admin' ? '🛡 Admin' : '🎓 พี่วิทศรุต'}</p>
                  <p style={{ fontSize: '9px', color: '#9CA3AF', margin: 0 }}>ออนไลน์</p>
                </div>
                <button onClick={onLogout}
                  style={{ padding: '7px', borderRadius: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
                  onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                  title="ออกจากระบบ">
                  <LogOut size={17} color="#6B7280" />
                </button>
              </div>
            }

            {/* ── Hamburger 3-Line Button ── */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                title="เมนูเพิ่มเติม & ตั้งค่า"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '4.5px', padding: '9px 10px', borderRadius: '10px', cursor: 'pointer',
                  background: menuOpen ? '#EFF6FF' : 'none',
                  border: menuOpen ? `1.5px solid ${C.sky}` : '1.5px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { if (!menuOpen) { e.currentTarget.style.background = '#F3F4F6'; } }}
                onMouseOut={e => { if (!menuOpen) { e.currentTarget.style.background = 'none'; } }}>
                {/* Animated hamburger lines */}
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'block',
                    width: i === 1 ? (menuOpen ? '14px' : '18px') : '18px',
                    height: '2px',
                    borderRadius: '2px',
                    background: menuOpen ? C.sky : '#4B5563',
                    transition: 'all 0.25s',
                    opacity: i === 1 ? (menuOpen ? 0.5 : 1) : 1,
                  }} />
                ))}
              </button>

              {/* ── Dropdown Panel ── */}
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '290px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '18px',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
                  padding: '8px',
                  zIndex: 99,
                  animation: 'fadeIn 0.18s ease',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                }}>

                  {/* ── Profile Card (when logged in) ── */}
                  {userRole !== 'guest' && (
                    <>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '12px',
                        background: `linear-gradient(135deg,${C.navy}15,${C.sky}10)`,
                        border: `1px solid ${C.navy}20`, marginBottom: '4px'
                      }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: `linear-gradient(135deg,${C.navy},${C.sky})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', flexShrink: 0
                        }}>
                          {userRole === 'admin' ? '🛡' : '🎓'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 850, fontSize: '13px', color: C.navy, margin: 0, lineHeight: 1.2 }}>{userRole === 'admin' ? 'Admin Panel' : 'พี่วิทศรุต'}</p>
                          <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>{userRole === 'admin' ? 'แอดมินระบบ INBIOLOGY' : 'นักเรียน • โรงเรียนสตรีวิทยา ม.5'}</p>
                        </div>
                        <span style={{
                          fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '20px',
                          background: userRole === 'admin' ? '#FEF2F2' : '#EFF6FF',
                          color: userRole === 'admin' ? C.red : C.sky, flexShrink: 0
                        }}>{userRole === 'admin' ? 'Admin' : 'Student'}</span>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                    </>
                  )}

                  {/* ── Section: เมนูหลัก (Visible on mobile/tablet) ── */}
                  <div className="mobile-only">
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>เมนูหลัก</p>
                    {navLinks.map(l => (
                      <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }} style={menuBtnStyle(false)}
                        onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: C.sky, fontSize: '10px' }}>👉</span>
                        {l.label}
                      </button>
                    ))}
                    {userRole === 'student' && (
                      <button onClick={() => { setPage('dashboard'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                        onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: C.sky, fontSize: '10px' }}>🎓</span>
                        ห้องเรียนของฉัน
                      </button>
                    )}
                    {userRole === 'admin' && (
                      <button onClick={() => { setPage('admin'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                        onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: C.red, fontSize: '10px' }}>🛡</span>
                        แดชบอร์ดแอดมิน
                      </button>
                    )}
                    <div style={dividerStyle} />
                  </div>

                  {/* ── Section: นำทาง ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>นำทาง</p>
                  {moreLinks.map(l => (
                    <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }} style={menuBtnStyle(false)}
                      onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ color: C.sky }}>{l.icon}</span>
                      {l.label}
                    </button>
                  ))}

                  <div style={dividerStyle} />

                  {/* ── Section: การแสดงผล ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>การแสดงผล</p>

                  {/* Dark Mode */}
                  <button onClick={() => {
                    const next = !darkMode; setDarkMode(next);
                    addToast(next ? '🌙 เปิดโหมดมืดแล้ว' : '☀️ เปิดโหมดสว่างแล้ว', 'info');
                  }} style={menuBtnStyle(darkMode)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = darkMode ? '#F0F4FF' : 'transparent'}>
                    <span style={{ color: darkMode ? '#7C3AED' : '#F59E0B' }}>{darkMode ? <Moon size={16} /> : <Sun size={16} />}</span>
                    {darkMode ? 'โหมดมืด (เปิดอยู่)' : 'โหมดสว่าง'}
                    <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', background: darkMode ? C.sky : '#E5E7EB', borderRadius: '999px', width: '32px', height: '18px', padding: '2px', transition: 'background 0.2s', flexShrink: 0 }}>
                      <span style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', transform: darkMode ? 'translateX(14px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </span>
                  </button>

                  {/* Language */}
                  <button onClick={() => {
                    const next = lang === 'TH' ? 'EN' : 'TH'; setLang(next);
                    addToast(next === 'EN' ? '🌐 Switched to English' : '🌐 เปลี่ยนเป็นภาษาไทย', 'info');
                  }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#059669' }}><Globe size={16} /></span>
                    ภาษา / Language
                    <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 800, background: C.skyLight, color: C.sky, padding: '2px 8px', borderRadius: '999px', flexShrink: 0 }}>{lang}</span>
                  </button>

                  <div style={dividerStyle} />

                  {/* ── Section: ห้องเรียน ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>ห้องเรียน</p>

                  {/* Sidebar toggle */}
                  <button onClick={() => {
                    addToast('📐 ตั้งค่าแถบซ้าย-ขวา → เปิดได้ในหน้า การตั้งค่า', 'info');
                    setPage('settings'); setMenuOpen(false);
                  }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#8B5CF6' }}><Layers size={16} /></span>
                    แถบซ้าย-ขวา (Sidebar)
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  {/* Video speed */}
                  <button onClick={() => { setPage('settings'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#EF4444' }}><Play size={16} /></span>
                    ความเร็วเล่นวิดีโอ
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  <div style={dividerStyle} />

                  {/* ── Section: การแจ้งเตือน ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>การแจ้งเตือน</p>

                  <button onClick={() => { setPage('settings'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#F59E0B' }}><Bell size={16} /></span>
                    ตั้งค่าการแจ้งเตือน
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  <div style={dividerStyle} />

                  {/* ── Section: ช่วยเหลือ & ตั้งค่า ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>ช่วยเหลือ & ตั้งค่า</p>

                  <button onClick={() => { setPage('guide'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#D97706' }}><BookText size={16} /></span>
                    คู่มือการใช้งาน
                  </button>

                  <button onClick={() => {
                    if (userRole === 'guest') addToast('กรุณาเข้าสู่ระบบก่อน', 'error');
                    else setPage('settings');
                    setMenuOpen(false);
                  }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#374151' }}><Settings size={16} /></span>
                    ตั้งค่าบัญชี
                  </button>

                  <button onClick={() => { setPage('settings'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#06B6D4' }}><Eye size={16} /></span>
                    การเข้าถึง (Accessibility)
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  {userRole !== 'guest' && (
                    <>
                      <div style={dividerStyle} />
                      <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ ...menuBtnStyle(false), color: '#EF4444' }}
                        onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={16} />
                        ออกจากระบบ
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
