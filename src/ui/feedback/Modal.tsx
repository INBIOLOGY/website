'use client'

import { useRef, useEffect, useId, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { C } from '@/src/app-data'



// ─────────────────────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────────────────────
type ModalProps = { isOpen: boolean; onClose: () => void; title: ReactNode; children: ReactNode; wide?: boolean };
export function Modal({ isOpen, onClose, title, children, wide = false }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} className="animate-fade-in-up" onClick={e => e.stopPropagation()} style={{
        position: 'relative', background: 'white', borderRadius: '20px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        width: '100%', maxWidth: wide ? '760px' : '480px', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>
          <h3 id={titleId} style={{ fontWeight: 800, color: C.navy, fontSize: '14px', margin: 0 }}>{title}</h3>
          <button type="button" aria-label="ปิดหน้าต่าง" onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'none', border: 'none' }} onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'} onMouseOut={e => e.currentTarget.style.background = 'none'}>
            <X size={16} color="#6B7280" />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}
