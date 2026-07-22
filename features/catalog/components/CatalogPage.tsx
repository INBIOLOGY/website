'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { C } from '@/src/app-data'
import { CourseCard } from '@/features/catalog/components/CourseCard'



// ─────────────────────────────────────────────────────────────────────────────
// CATALOG / SEARCH / FILTERS PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function CatalogPage({ courses, onAddToCart, enrolledIds, onViewDetails, onTrial }) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || c.Level === levelFilter;
    const matchPrice = priceFilter === 'all' || (priceFilter === 'free' ? c.price === 0 : c.price > 0);
    return matchSearch && matchLevel && matchPrice;
  }).sort((a, b) => {
    if (sortOrder === 'low-price') return a.price - b.price;
    if (sortOrder === 'popular') return b.reviewCount - a.reviewCount;
    return b.price - a.price; // default latest / high price
  });

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Sidebar Filter Box */}
        <aside style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <div>
            <h3 style={{ fontWeight: 850, fontSize: '14px', color: C.navy, margin: '0 0 12px' }}>🔍 ค้นหาบทเรียน</h3>
            <input type="text" placeholder="พิมพ์ชื่อคอร์สหรือคีย์เวิร์ด..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          </div>

          <div>
            <h3 style={{ fontWeight: 850, fontSize: '14px', color: C.navy, margin: '0 0 12px' }}>ระดับชั้นเรียน</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['all', 'ม.4', 'ม.5', 'ม.6', 'ติวสอบ'].map(lv => (
                <label key={lv} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                  <input type="radio" checked={levelFilter === lv} onChange={() => setLevelFilter(lv)} style={{ accentColor: C.sky }} />
                  <span>{lv === 'all' ? 'ทุกระดับชั้น' : lv}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontWeight: 850, fontSize: '14px', color: C.navy, margin: '0 0 12px' }}>ราคาและประเภท</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'all', label: 'ทุกประเภท' },
                { id: 'paid', label: 'คอร์สพรีเมียม (เสียเงิน)' },
                { id: 'free', label: 'คอร์สติวฟรี' }
              ].map(pr => (
                <label key={pr.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: '#374151' }}>
                  <input type="radio" checked={priceFilter === pr.id} onChange={() => setPriceFilter(pr.id)} style={{ accentColor: C.sky }} />
                  <span>{pr.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Course Grid and Sorting header */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: 'white', padding: '12px 20px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '13px', fontWeight: 800, color: '#374151', margin: 0 }}>พบคอร์สเรียนชีววิทยา {filtered.length} คอร์ส</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 700 }}>เรียงลำดับ:</span>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', outline: 'none', background: 'white', fontFamily: 'inherit', fontWeight: 700 }}>
                <option value="latest">ราคา: สูง-ต่ำ</option>
                <option value="low-price">ราคา: ต่ำ-สูง</option>
                <option value="popular">ยอดนิยมสูงสุด</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '64px', textAlign: 'center' }}>
              <Search size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontWeight: 800, color: C.navy, fontSize: '16px', margin: '0 0 6px' }}>ไม่พบผลการค้นหา</h3>
              <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>ลองเปลี่ยนคีย์เวิร์ดหรือเงื่อนไขการตัวกรองข้างต้น</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
              {filtered.map(c => (
                <CourseCard key={c.id} course={c} enrolled={enrolledIds.includes(c.id)} onAddToCart={onAddToCart} onViewDetails={onViewDetails} onTrial={onTrial} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
