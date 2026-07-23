"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export function CheckoutView() {
  const { items } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return <main className="checkout-page"><div className="checkout-shell"><div className="checkout-payment"><div className="checkout-heading"><span className="eyebrow">INBIOLOGY ACADEMY</span><h1>ชำระเงิน</h1><p>ตรวจสอบรายการและเลือกวิธีชำระเงิน</p></div><div className="payment-box"><h2>ชำระเงินผ่าน Mobile Banking</h2><p>สแกน QR Code เพื่อชำระเงิน จากนั้นแนบสลิปในระบบจริงภายหลัง</p><div className="fake-qr"><span>PromptPay</span><strong>INBIOLOGY</strong><small>QR PAYMENT</small></div><button className="upload-slip" type="button">＋ แนบสลิปการโอนเงิน</button></div></div><aside className="order-summary"><h2>สรุปรายการสั่งซื้อ</h2>{items.length === 0 ? <div className="empty-checkout"><p>ยังไม่มีคอร์สในตะกร้า</p><Link href="/courses" className="primary-button">เลือกคอร์สเรียน</Link></div> : <>{items.map((item) => <div className="order-item" key={item.id}><span>{item.title}</span><strong>฿{item.price.toLocaleString("th-TH")}</strong></div>)}<label className="coupon-field">คูปองส่วนลด<input placeholder="กรอกโค้ด NEWBIO200" /></label><div className="summary-line"><span>ส่วนลด</span><strong className="discount">- ฿0</strong></div><div className="summary-total"><span>ยอดรวมทั้งหมด</span><strong>฿{subtotal.toLocaleString("th-TH")}</strong></div><button type="button" className="confirm-payment">ยืนยันการชำระเงิน</button></>}</aside></div></main>;
}
