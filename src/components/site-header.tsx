"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";

const links = [["หน้าแรก", "/"], ["คอร์สเรียน", "/courses"], ["คอร์สเรียนของฉัน", "/classroom"], ["คลังข้อสอบ", "/exam"], ["Dashboard", "/dashboard"]] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, openCart, isOpen, closeCart, removeItem } = useCart();

  return <>
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo-btn" aria-label="กลับหน้าแรก"><Image src="/logo.png" alt="INBIOLOGY" width={44} height={44} className="logo-img" priority /><span className="logo-copy"><strong>INBIOLOGY</strong><small>by พี่ต้น</small></span></Link>
        <nav className="desktop-nav" aria-label="เมนูหลัก">{links.map(([label, href]) => <Link key={href} href={href} className={`nav-link ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}`}>{label}</Link>)}</nav>
        <div className="header-actions"><button className="cart-icon-btn" onClick={openCart} aria-label={`เปิดตะกร้า${items.length ? ` (${items.length} รายการ)` : ""}`}>🛒{items.length > 0 && <span className="cart-badge">{items.length}</span>}</button><Link href="/login" className="btn-login">เข้าสู่ระบบ</Link><button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={menuOpen}>☰</button></div>
      </div>
      {menuOpen && <nav className="mobile-nav" aria-label="เมนูมือถือ">{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}>{label}</Link>)}</nav>}
    </header>
    {isOpen && <div className="drawer-overlay" onClick={closeCart}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><h2>🛒 ตะกร้าชำระเงิน</h2><button onClick={closeCart} aria-label="ปิดตะกร้า">✕</button></div>{items.length === 0 ? <p className="empty-copy">ไม่มีสินค้าในตะกร้า</p> : <>{items.map((item) => <div className="cart-item" key={item.id}><Image src={item.imageUrl} alt="" width={52} height={52} /><div><strong>{item.title}</strong><span>฿{item.price.toLocaleString("th-TH")}</span></div><button onClick={() => removeItem(item.id)} aria-label={`ลบ ${item.title}`}>✕</button></div>)}<Link className="drawer-checkout" href="/checkout" onClick={closeCart}>ดำเนินการชำระเงิน</Link></>}</aside></div>}
  </>;
}
