import { useEffect } from 'react';
import { X } from 'lucide-react';
import { C } from '../constants/theme.js';

export default function Modal({ isOpen, onClose, title, children, wide }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div className="animate-fade-in-up" onClick={e => e.stopPropagation()} style={{
        position: 'relative', background: 'white', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: wide ? '760px' : '480px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 style={{ fontWeight: 800, color: C.navy, fontSize: '14px', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none' }} onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={16} color="#6B7280" />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}
