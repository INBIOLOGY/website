"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";

export function AuthView() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();
  return <main className="auth-page"><div className="auth-glow auth-glow-red" /><div className="auth-glow auth-glow-blue" /><section className="auth-wrapper"><div className="auth-card"><div className="auth-top-bar" /><div className="auth-card-body"><header className="auth-header"><Link href="/"><Image src="/logo.png" alt="INBIOLOGY" width={180} height={64} className="auth-logo" /></Link><h1>{mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}</h1><p>{mode === "login" ? "ยินดีต้อนรับกลับสู่ INBIOLOGY Academy" : "เริ่มต้นเรียนชีวะให้เข้าใจไปกับเรา"}</p></header><div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>เข้าสู่ระบบ</button><button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>สมัครสมาชิก</button></div><form onSubmit={submit} className="auth-form">{mode === "register" && <><label>ชื่อ-นามสกุล<input placeholder="กรอกชื่อของคุณ" /></label><label>เบอร์โทรศัพท์<input placeholder="081-234-5678" /></label></>}<label>อีเมล<input type="email" placeholder="example@gmail.com" required /></label><label>รหัสผ่าน<div className="password-field"><input type={showPassword ? "text" : "password"} placeholder="อย่างน้อย 6 ตัวอักษร" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "ซ่อน" : "แสดง"}</button></div></label>{mode === "login" ? <div className="auth-meta"><label className="check-row"><input type="checkbox" defaultChecked /> จดจำการเข้าสู่ระบบ</label><button type="button" className="text-button">ลืมรหัสผ่าน?</button></div> : <label className="check-row"><input type="checkbox" defaultChecked /> ยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัว</label>}<button className="auth-submit">{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</button></form></div></div><Link href="/" className="back-home">← กลับหน้าแรก</Link></section></main>;
}
