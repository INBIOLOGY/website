import { useState } from 'react';
import { C } from '../constants/theme.js';
import { formatPrice } from '../utils/formatters.js';

export default function CheckoutPage({ cart, coupons, onRemove, onCheckout, setPage, addToast }) {
  const [method, setMethod] = useState('promptpay');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const total = cart.reduce((s, c) => s + c.price, 0);
  const final = Math.max(0, total - discount);

  const applyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === coupon.trim().toUpperCase());
    if (found) {
      if (found.type === 'percent') {
        const amt = Math.round(total * (found.discount / 100));
        setDiscount(amt);
        addToast(`🎫 ใช้โค้ดสำเร็จ! ลดเพิ่ม ${found.discount}% (-฿${formatPrice(amt)})`, 'success');
      } else {
        setDiscount(found.discount);
        addToast(`🎫 ใช้โค้ดสำเร็จ! ลดเพิ่ม ฿${formatPrice(found.discount)}`, 'success');
      }
    } else {
      addToast('ไม่พบโค้ดส่วนลดนี้', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Left: Select Payment Option */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: 0 }}>💳 เลือกช่องทางชำระเงิน</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { id: 'promptpay', label: 'PromptPay (แนะนำ)', icon: '📱' },
              { id: 'credit', label: 'บัตรเครดิต/เดบิต', icon: '💳' },
              { id: 'truemoney', label: 'TrueMoney Wallet', icon: '🔥' },
              { id: 'bank', label: 'โอนผ่านธนาคาร', icon: '🏦' }
            ].map(m => (
              <button key={m.id} onClick={() => setMethod(m.id)} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px',
                border: `2px solid ${method === m.id ? C.sky : '#E5E7EB'}`, background: method === m.id ? '#EFF6FF' : 'white',
                cursor: 'pointer', fontSize: '13px', fontWeight: 700, color: '#374151', textAlign: 'left'
              }}>
                <span style={{ fontSize: '20px' }}>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          {method === 'promptpay' && (
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 800, color: C.navy, margin: 0 }}>สแกน QR Code เพื่อชำระเงินผ่าน Mobile Banking</p>
              {/* QR Mockup */}
              <div style={{ width: '150px', height: '150px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                <div style={{ background: C.navy, color: 'white', fontSize: '10px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', marginBottom: '8px' }}>Prompt Pay</div>
                <img src="/logo.png" style={{ width: '80px', height: '80px', objectFit: 'contain', opacity: 0.8 }} alt="" />
                <div style={{ fontSize: '9px', color: '#9CA3AF', marginTop: '6px' }}>Scan to Pay</div>
              </div>
              <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>ชื่อบัญชี: INBIOLOGY Academy (by พี่ต้น)</p>
            </div>
          )}

          {method === 'credit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="หมายเลขบัตร 16 หลัก" style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="ด/ป หมดอายุ (MM/YY)" style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }} />
                <input type="password" placeholder="CVV 3 หลัก" style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }} />
              </div>
            </div>
          )}
        </div>

        {/* Right: Cart Summary and Promo Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 850, color: C.navy, margin: 0, borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>🛒 สรุปรายการคำสั่งซื้อ</h3>
            {cart.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#374151' }}>
                <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
                <span>฿{formatPrice(c.price)}</span>
              </div>
            ))}

            {/* Coupon field */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <input type="text" placeholder="กรอกโค้ดส่วนลด (INBIOLOGY100)" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={applyCoupon} style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '11px', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}>ใช้</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7280' }}><span>ยอดรวมย่อย</span><span>฿{formatPrice(total)}</span></div>
              {discount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 700 }}><span>ส่วนลดพิเศษ</span><span>-฿{formatPrice(discount)}</span></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '18px', color: C.navy, marginTop: '6px' }}><span>ยอดชำระสุทธิ</span><span>฿{formatPrice(final)}</span></div>
            </div>

            <button onClick={onCheckout} disabled={cart.length === 0} style={{
              width: '100%', background: cart.length === 0 ? '#D1D5DB' : C.red, color: cart.length === 0 ? '#9CA3AF' : 'white',
              fontWeight: 800, fontSize: '14px', padding: '14px', borderRadius: '12px',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer', border: 'none',
              boxShadow: cart.length === 0 ? 'none' : `0 6px 20px rgba(239,68,68,0.3)`
            }}>
              ยืนยันการชำระเงิน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
