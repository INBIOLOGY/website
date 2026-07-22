import { Check, X } from 'lucide-react';
import { C } from '../constants/theme.js';

export default function ToastContainer({ toasts, remove }) {
  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} className="animate-fade-in-up" style={{
          pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          background: 'white', border: '1px solid #E5E7EB', maxWidth: '320px'
        }}>
          <span style={{
            width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '11px', flexShrink: 0,
            background: t.type === 'success' ? '#10B981' : t.type === 'error' ? '#EF4444' : C.sky
          }}>
            {t.type === 'success' ? <Check size={12} /> : t.type === 'error' ? <X size={12} /> : '!'}
          </span>
          <span style={{ flex: 1, color: '#374151', fontWeight: 600, fontSize: '12px' }}>{t.message}</span>
          <button onClick={() => remove(t.id)} style={{ color: '#9CA3AF', cursor: 'pointer', background: 'none', border: 'none' }}><X size={12} /></button>
        </div>
      ))}
    </div>
  );
}
