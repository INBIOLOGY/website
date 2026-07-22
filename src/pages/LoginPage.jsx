import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { C } from '../constants/theme.js';

export default function LoginPage({ onLogin, setPage, addToast }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirmPassword) {
      addToast('รหัสผ่านไม่ตรงกัน', 'error'); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (form.email === 'admin@inbiologylogy.com' && form.password === 'admin2026') {
        onLogin('admin'); addToast('🛡 เข้าสู่ระบบแอดมินสำเร็จ', 'success'); setPage('admin');
      } else if (form.email && form.password.length >= 6) {
        onLogin('student'); addToast('🎓 เข้าสู่ระบบสำเร็จ', 'success'); setPage('dashboard');
      } else { addToast('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error'); }
    }, 800);
  };

  const inpStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: `linear-gradient(135deg, ${C.navy} 0%, ${C.sky} 100%)` }}>
      {/* Left panel info */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
        background: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      </div>

      {/* Right Form panel */}
      <div style={{ flex: 1, maxWidth: '440px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px' }}>
        <button onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none', marginBottom: '24px', fontFamily: 'inherit', fontWeight: 700 }}
          onMouseOver={e => e.currentTarget.style.color = '#374151'}
          onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>
          <ChevronLeft size={16} /> กลับหน้าหลัก
        </button>

        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>{mode === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิกใหม่'}</h2>
          <p style={{ color: '#6B7280', fontSize: '12px', margin: 0, fontFamily: C.fontBody }}>{mode === 'login' ? 'เข้าสู่ห้องเรียนจำลองของคุณ' : 'กรอกข้อมูลเพื่อเริ่มต้นการศึกษา'}</p>
        </div>

        {/* Tab selector */}
        <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          {[['login', 'เข้าสู่ระบบ'], ['register', 'สมัครสมาชิก']].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)} style={{ flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: mode === v ? 'white' : 'transparent', color: mode === v ? '#111827' : '#6B7280', boxShadow: mode === v ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {l}
            </button>
          ))}
        </div>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>ชื่อ-นามสกุล</label>
              <input style={inpStyle} type="text" placeholder="ชื่อ นามสกุล" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
          )}
          <div>
            <label style={labelStyle}>อีเมล</label>
            <input style={inpStyle} type="email" placeholder="example@gmail.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>รหัสผ่าน</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inpStyle, paddingRight: '44px' }} type={show ? 'text' : 'password'} placeholder="ระบุรหัสผ่าน 6 ตัวขึ้นไป" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>ยืนยันรหัสผ่าน</label>
              <input style={inpStyle} type="password" placeholder="พิมพ์รหัสผ่านอีกครั้ง" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', background: C.sky, color: 'white', fontWeight: 800, fontSize: '14px', padding: '12px', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer', border: 'none', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'กำลังประมวลผล...' : (mode === 'login' ? 'เข้าสู่ระบบ' : 'ยืนยันสมัครสมาชิก')}
          </button>
        </form>
      </div>
    </div>
  );
}
