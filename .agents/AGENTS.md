# INBIOLOGY Academy — Workspace Rules & Core UI Specifications

## 1. Technical Stack & Architecture Rules
- **Pure Vanilla HTML/CSS/JS**: STRICTLY 0 frameworks/libraries. All code must be plain HTML5, Vanilla CSS (`css/style.css`), and Modular Vanilla JavaScript (`js/app.js`, `js/mockData.js`).
- **Clean File Structure**: Keep data in `js/mockData.js`, core app state/logic in `js/app.js`, and styles in `css/style.css`.
- **Easy Hand-off**: High readability, semantic HTML, and zero build tool dependencies.

---

## 2. Standardized Course & Video Card Component Pattern
Whenever building or modifying course cards or video trial cards, use this EXACT approved UI pattern:
- **Thumbnail Container**: Height `190px–200px`, background `#F1F5F9`, `display: flex; align-items: center; justify-content: center; padding: 14px; position: relative; border-radius: 20px 20px 0 0; overflow: hidden;`.
- **Portrait Book/Course Cover Image**: Centered floating portrait cover image `height: 150px–155px; max-width: 85%; object-fit: contain; border-radius: 8px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);`.
- **Top-Left Floating Badge**: Solid pill badge (e.g. `Bio Intensive I/II/III/IV`).
- **Bottom-Left Floating Trial Button**: Blue pill button `▶ ทดลองเรียนฟรี` (`background: #1E3A8A; font-size: 10px; font-weight: 800; border-radius: 8px;`).
- **Bottom-Right Duration Badge**: Dark pill badge `#18181B` displaying duration e.g. `45 นาที` (`position: absolute; bottom: 10px; right: 12px; font-size: 11px; font-weight: 900; padding: 4px 10px; border-radius: 6px;`).
- **Footer Price Row**: Original price strikethrough (`฿2,500`), sale price (`฿1,290`), discount badge (`-48%`), and action buttons (`รายละเอียด` & `🛒 ชำระเงิน` / `✓ เรียนเลย`).

---

## 3. Approved Hero Banner Layout Specs
- **Left Content**:
  - Title Line 1: `เรียนชีวะให้เข้าใจ` (White bold)
  - Title Line 2: `ไม่ใช่แค่จำ` (Yellow `#FACC15` bold)
  - Subtitle: `ติวเข้มออนไลน์แบบครบวงจรกับ พี่ต้น`
  - Action Buttons: Red button `ดูคอร์สทั้งหมด ➔` (`#EF4444`) & Blue glass outline button `▶ เริ่มเรียนฟรี` (`background: rgba(59,130,246,0.35); border: 1.5px solid rgba(255,255,255,0.7)`).
  - Translucent Glass Stats Bar: `50,000+` (เรียนแล้วกว่า), `11+` (คอร์สคุณภาพ), `100%` (ตรงตามเกณฑ์การสอบ) inside `background: rgba(255,255,255,0.14); border: 1.5px solid rgba(255,255,255,0.35); border-radius: 20px; backdrop-filter: blur(12px);`.
- **Right Content (Instructor Glass Card)**:
  - Translucent glass container (`background: rgba(240, 246, 255, 0.85); backdrop-filter: blur(24px); border-radius: 28px; width: 330px;`).
  - Avatar with green active status dot at bottom-right.
  - Subtitle & Badges: `🔬 ชีววิทยา` & `🎓 เกียรตินิยมอันดับ 1`.
  - Qualification Inner White Card: `ป.ตรี คณะศึกษาศาสตร์ มหาวิทยาลัยนเรศวร`, `ป.โท คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น`, `ประสบการณ์สอน 9 ปี`, `วิทยากรพิเศษตามโรงเรียนต่างๆ`.
  - Rating Row: `⭐ ⭐ ⭐ ⭐ ⭐ 4.98 (2,847 รีวิว)`.

---

## 4. Promo Flash Sale Banner Specs
- Container: Soft blue gradient (`linear-gradient(135deg, #E0F2FE 0%, #EFF6FF 100%)`), `border-radius: 28px; padding: 36px 40px;`.
- Badges: `🔥 โปรต้อนรับเปิดเทอม` & `ลดสูงสุด 30%`.
- Title: `Bio Intensive I - VI Complete Set`.
- Buttons: Solid red button `ดูคอร์สทั้งหมด ➔` & White info button `ⓘ ดูรายละเอียด`.
- Right Graphic Card: White card with red lightning icon `⚡ FLASH SALE INBIOLOGY`.

---

## 5. Review Cards Marquee Specs
- Compact circular profile avatar (`border: 3px solid #B91C1C`).
- Student Name (Red `#B91C1C`), School (Blue `#1E3A8A`), Score badge (`#FEE2E2`).
- Quote displayed completely in a light gray box (`#F9FAFB`), WITHOUT any "Read More" button.

---

## 6. Classroom Study Tools Specs
- In `classroom.html`, keep strictly ONLY 2 tabs:
  1. `📝 โน้ตย่อส่วนตัว`
  2. `💬 ถามผู้สอน (พี่ต้น)`

---

## 7. Navbar & User Role Rules
- Hide `แอดมิน` navbar menu item when logged in as a normal student (`userRole === 'student'`).
- Display user badge `🎓 พี่วิทศรุต` AND red `🚪 ออกจากระบบ` button when logged in.
