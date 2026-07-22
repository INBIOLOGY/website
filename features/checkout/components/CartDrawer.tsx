'use client'

import { ShoppingCart, X } from 'lucide-react'
import { C, formatPrice } from '@/src/app-data'

import type { Course, PageSetter } from '@/src/app-types';
type CartDrawerProps = { cart: Course[]; onClose: () => void; onRemove: (id: string) => void; setPage: PageSetter };
export function CartDrawer({ cart, onClose, onRemove, setPage }: CartDrawerProps) {
  return (
    <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
      <div className="animate-slide-down" onClick={e => e.stopPropagation()} style={{ position: 'relative', background: 'white', width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 850, color: C.navy, margin: 0, fontSize: '15px' }}>
            <ShoppingCart size={20} /> ตะกร้าชำระเงิน
            <span style={{ background: C.red, color: 'white', fontSize: '10px', fontWeight: 900, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>
          </h3>
          <button onClick={onClose} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'none', border: 'none' }}><X size={16} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cart.length === 0
            ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
              <ShoppingCart size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '13px', fontWeight: 500 }}>ไม่มีสินค้าในตะกร้า</p>
            </div>
            : cart.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                <img src={c.imageUrl} alt="" style={{ width: '52px', height: '36px', objectFit: 'cover', borderRadius: '8px' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 800, color: C.navy, fontSize: '12px', margin: '0 0-2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                  <p style={{ color: C.red, fontWeight: 900, fontSize: '13px', margin: 0 }}>฿{formatPrice(c.price)}</p>
                </div>
                <button onClick={() => onRemove(c.id)} style={{ padding: '4px', color: '#9CA3AF', cursor: 'pointer', background: 'none', border: 'none' }}>
                  <X size={14} />
                </button>
              </div>
            ))
          }
        </div>
        {cart.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: '#374151', fontSize: '14px' }}>ยอดรวม</span>
              <span style={{ fontWeight: 900, fontSize: '22px', color: C.navy }}>฿{formatPrice(cart.reduce((s, c) => s + c.price, 0))}</span>
            </div>
            <button onClick={() => { setPage('checkout'); onClose(); }} style={{ width: '100%', background: C.red, color: 'white', fontWeight: 850, fontSize: '14px', padding: '14px', borderRadius: '12px', cursor: 'pointer', border: 'none' }}>
              ดำเนินการชำระเงิน
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
