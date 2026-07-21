'use client';

import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { useLegacyNavigation } from '@/features/navigation/use-legacy-navigation';
import { authenticate, getCurrentUser, logoutSession } from '@/features/auth/client';
import { createPendingOrder } from '@/features/checkout/client';
import { listPublishedCourses } from '@/features/catalog/client';
import { PUBLIC_PAGES } from '@/features/navigation/routes';
import {
  BookOpen, Play, Star, Users, Clock, Download, X, Check,
  LogOut, BarChart2, Video, Search, Edit, Trash2,
  ShoppingCart, PlayCircle, FileText, Shield,
  ChevronLeft, ChevronRight, ArrowRight, Sparkles, Eye, EyeOff, Image,
  Award, Bell, TrendingUp, Zap, Brain,
  HelpCircle, FileSpreadsheet, Settings, Globe, Moon, Sun,
  BookText, Layers, Info, Maximize, Minimize
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// BRAND COLORS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  navy: '#B91C1C', // Brand Red (Dominant Primary Red)
  navyLight: '#EF4444', // Brand Red Light
  sky: '#1E3A8A', // Brand Navy Blue (Secondary Accent)
  skyLight: '#E0F2FE', // Brand Sky Blue Light
  red: '#EF4444', // Vibrant Red (Highlights/Alerts)
  redDark: '#DC2626',
  page: '#F3F4F6', // Light gray background
  white: '#FFFFFF',
  textDark: '#111827',
  textMuted: '#6B7280',
  // Typography
  fontBody: "'Outfit','Prompt',sans-serif",
  fontHeading: "'Outfit','Prompt',sans-serif",
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────
const COURSES = [
  // ─── Class Bio Intensive I - VI (Roman Numerals) ──────────────────────────
  {
    id: 'bio-intensive-1',
    title: '🧬 Bio Intensive I: Introbiology & Biochemistry & Cell biology',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1290, originalPrice: 2500,
    badge: 'Bio Intensive I', badgeBg: C.navy,
    tag: 'ม.4 & ติวสอบ', tagBg: '#FEF2F2', tagColor: '#991B1B',
    description: 'ปูพื้นฐานบทนำชีววิทยา เคมีที่เป็นพื้นฐานของสิ่งมีชีวิต (Biochemistry) โครงสร้างและหน้าที่ของเซลล์ ออร์แกเนลล์ เยื่อหุ้มเซลล์ การลำเลียงสาร และการแบ่งเซลล์อย่างลึกซึ้ง',
    hours: 30, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: บทนำชีววิทยา ทักษะการสืบเสาะ และเคมีพื้นฐานของสิ่งมีชีวิต', duration: 45 },
      { id: 'l2', title: 'EP 2: เจาะลึกชีวโมเลกุล: คาร์โบไฮเดรต โปรตีน ลิพิด และกรดนิวคลีอิก', duration: 50 },
      { id: 'l3', title: 'EP 3: โครงสร้างและหน้าที่ของออร์แกเนลล์ในเซลล์พืชและสัตว์', duration: 55 },
      { id: 'l4', title: 'EP 4: กลไกการลำเลียงสารผ่านเยื่อหุ้มเซลล์ (Passive & Active Transport)', duration: 40 },
      { id: 'l5', title: 'EP 5: เอนไซม์และอัตราการเกิดปฏิกิริยาเคมีในสิ่งมีชีวิต', duration: 45 },
      { id: 'l6', title: 'EP 6: วัฏจักรเซลล์ การแบ่งเซลล์แบบ Mitosis และ Meiosis', duration: 60 },
    ],
    imageUrl: '/1_0.png',
    rating: 4.9, reviewCount: 450, Level: 'ม.4', Category: '🧬 Bio Intensive'
  },
  {
    id: 'bio-intensive-2',
    title: '🧫 Bio Intensive II: Genetic and evolution',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1390, originalPrice: 2700,
    badge: 'Bio Intensive II', badgeBg: C.sky,
    tag: 'ม.4-ม.5 & ติวสอบ', tagBg: '#EDE9FE', tagColor: '#5B21B6',
    description: 'พันธุศาสตร์ของเมนเดล การถ่ายทอดลักษณะทางพันธุกรรม ดีเอ็นเอ สารพันธุกรรม รหัสพันธุกรรม เทคโนโลยีชีวภาพ และหลักการวิวัฒนาการของสิ่งมีชีวิต',
    hours: 32, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: พันธุศาสตร์ของเมนเดล กฎแห่งการแยกตัวและรวมกลุ่มอย่างอิสระ', duration: 50 },
      { id: 'l2', title: 'EP 2: ส่วนขยายพันธุศาสตร์เมนเดล (Incomplete Dominance, Codominance, Multiple Alleles)', duration: 45 },
      { id: 'l3', title: 'EP 3: โครงสร้าง DNA & RNA และการจำลองตัวของ DNA (DNA Replication)', duration: 55 },
      { id: 'l4', title: 'EP 4: กระบวนการถอดรหัสและการแปลรหัสพันธุกรรม (Transcription & Translation)', duration: 60 },
      { id: 'l5', title: 'EP 5: การกลายพันธุ์ (Mutation) และเทคโนโลยีทางดีเอ็นเอ (Recombinant DNA & PCR)', duration: 55 },
      { id: 'l6', title: 'EP 6: หลักการวิวัฒนาการของสิ่งมีชีวิต และพันธุศาสตร์ประชากร', duration: 50 },
    ],
    imageUrl: '/2_0.png',
    rating: 5.0, reviewCount: 380, Level: 'ม.5', Category: '🧫 Bio Intensive'
  },
  {
    id: 'bio-intensive-3',
    title: '🌱 Bio Intensive III: Plant Biology',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1290, originalPrice: 2400,
    badge: 'Bio Intensive III', badgeBg: '#10B981',
    tag: 'ม.5 & ติวสอบ', tagBg: '#D1FAE5', tagColor: '#065F46',
    description: 'เจาะลึกชีววิทยาของพืช โครงสร้างและเนื้อเยื่อพืช กระบวนการสังเคราะห์ด้วยแสง (Photosynthesis) การลำเลียงน้ำและสารอาหาร ฮอร์โมนพืชและการตอบสนอง',
    hours: 28, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: โครงสร้างและชนิดเนื้อเยื่อของพืชดอก (Plant Tissues & Anatomy)', duration: 45 },
      { id: 'l2', title: 'EP 2: โครงสร้างและหน้าที่ของราก ลำต้น และใบ (Root, Stem & Leaf Anatomy)', duration: 50 },
      { id: 'l3', title: 'EP 3: การสังเคราะห์ด้วยแสง ปฏิกิริยาแสงและวัฏจักรแคลวิน (Light Reaction & Calvin Cycle)', duration: 60 },
      { id: 'l4', title: 'EP 4: ระบบการลำเลียงน้ำ ธาตุอาหาร และอาหารในพืช (Xylem & Phloem Transport)', duration: 45 },
      { id: 'l5', title: 'EP 5: การสืบพันธุ์แบบอาศัยเพศและการปฏิสนธิซ้อนของพืชดอก (Double Fertilization)', duration: 50 },
      { id: 'l6', title: 'EP 6: ฮอร์โมนพืชและการตอบสนองต่อสิ่งแวดล้อม (Plant Hormones & Tropism)', duration: 45 },
    ],
    imageUrl: '/3_0.png',
    rating: 4.9, reviewCount: 310, Level: 'ม.5', Category: '🌱 Bio Intensive'
  },
  {
    id: 'bio-intensive-4',
    title: '🦴 Bio Intensive IV: Animal Biology I',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1490, originalPrice: 2800,
    badge: 'Bio Intensive IV', badgeBg: '#F59E0B',
    tag: 'ม.5-ม.6 & ติวสอบ', tagBg: '#FEF3C7', tagColor: '#92400E',
    description: 'กายวิภาคศาสตร์และสรีรวิทยาของสัตว์และมนุษย์ พาร์ต 1: ระบบย่อยอาหาร การหมุนเวียนเลือด ระบบหายใจ ระบบขับถ่าย และการรักษาสมดุลของร่างกาย',
    hours: 35, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: ระบบย่อยอาหารและการดูดซึมสารอาหารในมนุษย์และสัตว์ (Digestive System)', duration: 50 },
      { id: 'l2', title: 'EP 2: ระบบหมุนเวียนเลือด หัวใจ และส่วนประกอบของเลือด (Circulatory System)', duration: 55 },
      { id: 'l3', title: 'EP 3: ระบบภูมิคุ้มกันร่างกาย (Innate & Adaptive Immunity)', duration: 50 },
      { id: 'l4', title: 'EP 4: ระบบแลกเปลี่ยนก๊าซและการหายใจในสิ่งมีชีวิต (Respiratory System)', duration: 45 },
      { id: 'l5', title: 'EP 5: ระบบขับถ่าย โครงสร้างไตและการสร้างปัสสาวะ (Excretory System & Kidney)', duration: 55 },
      { id: 'l6', title: 'EP 6: การรักษาดุลยภาพของน้ำ สารเคมี และอุณหภูมิในร่างกาย (Homeostasis)', duration: 40 },
    ],
    imageUrl: '/4_0.png',
    rating: 4.8, reviewCount: 415, Level: 'ม.6', Category: '🦴 Bio Intensive'
  },
  {
    id: 'bio-intensive-5',
    title: '🧠 Bio Intensive V: Animal Biology II',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1490, originalPrice: 2800,
    badge: 'Bio Intensive V', badgeBg: '#8B5CF6',
    tag: 'ม.6 & ติวสอบ', tagBg: '#F3E8FF', tagColor: '#6B21A8',
    description: 'กายวิภาคศาสตร์และสรีรวิทยาของสัตว์และมนุษย์ พาร์ต 2: ระบบประสาท อวัยวะรับความรู้สึก ระบบต่อมไร้ท่อและฮอร์โมน ระบบสืบพันธุ์ และพฤติกรรมสัตว์',
    hours: 36, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: เซลล์ประสาท การส่งกระแสประสาท และ Action Potential (Neuron & Action Potential)', duration: 60 },
      { id: 'l2', title: 'EP 2: สมอง สมองส่วนหน้า-กลาง-หลัง และระบบประสาทรอบนอก (Brain & Nervous System)', duration: 55 },
      { id: 'l3', title: 'EP 3: อวัยวะรับความรู้สึก (ตา หู ลิ้น จมูก ผิวหนัง) (Sensory Organs)', duration: 50 },
      { id: 'l4', title: 'EP 4: ระบบต่อมไร้ท่อ ฮอร์โมนและกลไกควบคุมแบบป้อนกลับ (Endocrine System)', duration: 55 },
      { id: 'l5', title: 'EP 5: ระบบสืบพันธุ์ การสร้างเซลล์สืบพันธุ์ และการเจริญเติบโตของเอ็มบริโอ (Reproduction & Development)', duration: 60 },
      { id: 'l6', title: 'EP 6: พฤติกรรมของสัตว์ พฤติกรรมที่มีมาแต่กำเนิดและการเรียนรู้ (Animal Behavior)', duration: 45 },
    ],
    imageUrl: '/5_0.png',
    rating: 4.9, reviewCount: 390, Level: 'ม.6', Category: '🧠 Bio Intensive'
  },
  {
    id: 'bio-intensive-6',
    title: '🌿 Bio Intensive VI: Taxonomy & Ecology',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1290, originalPrice: 2500,
    badge: 'Bio Intensive VI', badgeBg: '#059669',
    tag: 'ม.6 & ติวสอบ', tagBg: '#ECFDF5', tagColor: '#047857',
    description: 'อนุกรมวิธาน การจัดจำแนกสิ่งมีชีวิต 5 อาณาจักร สายสัมพันธ์วิวัฒนาการ ระบบนิเวศ การถ่ายทอดพลังงาน ประชากร ไบโอม และวิกฤตสิ่งแวดล้อม',
    hours: 30, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: อนุกรมวิธาน ไดโคโตมัสคีย์ และการจัดจำแนกสิ่งมีชีวิต (Taxonomy & Phylogeny)', duration: 55 },
      { id: 'l2', title: 'EP 2: เจาะลึกอาณาจักรสิ่งมีชีวิต (Monera, Protista, Fungi, Plantae, Animalia)', duration: 65 },
      { id: 'l3', title: 'EP 3: ระบบนิเวศ การถ่ายทอดพลังงาน พีระมิดนิเวศ และวัฏจักรสาร (Ecosystem & Energy Flow)', duration: 50 },
      { id: 'l4', title: 'EP 4: นิเวศวิทยาประชากร การเติบโตแบบ Exponential และ Logistic (Population Ecology)', duration: 45 },
      { id: 'l5', title: 'EP 5: การเปลี่ยนแปลงแทนที่ของชีวบริเวณและไบโอมโลก (Ecological Succession & Biomes)', duration: 45 },
      { id: 'l6', title: 'EP 6: มนุษย์กับความยั่งยืนของทรัพยากรธรรมชาติและสิ่งแวดล้อม (Environmental Issues)', duration: 40 },
    ],
    imageUrl: '/6_0.png',
    rating: 4.9, reviewCount: 290, Level: 'ม.6', Category: '🌿 Bio Intensive'
  },

  // ─── คอร์สพิเศษ (Special Courses) ──────────────────────────────────────────
  {
    id: 'special-posn-theory',
    title: '🏅 คอร์ส ติวเข้ม สรุปเนื้อหา สอวน.',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1990, originalPrice: 3900,
    badge: 'คอร์สพิเศษ สอวน.', badgeBg: C.navy,
    tag: 'สอวน. ชีววิทยา', tagBg: '#FEF2F2', tagColor: '#991B1B',
    description: 'ติวเข้มสรุปเนื้อหาชีววิทยาเชิงลึกระดับโอลิมปิกวิชาการ สำหรับเตรียมสอบ สอวน. ค่าย 1 และ ค่าย 2 ครบถ้วน กระชับ ชี้จุดออกสอบบ่อย',
    hours: 45, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: ติวเข้ม สอวน.: Biochemistry & Cell Biology เชิงลึก', duration: 60 },
      { id: 'l2', title: 'EP 2: ติวเข้ม สอวน.: Genetics, Molecular Biology & Biotechnology', duration: 65 },
      { id: 'l3', title: 'EP 3: ติวเข้ม สอวน.: Plant Anatomy & Plant Physiology เชิงลึก', duration: 60 },
      { id: 'l4', title: 'EP 4: ติวเข้ม สอวน.: Human & Animal Physiology ระบบร่างกายสัตว์เข้มข้น', duration: 70 },
      { id: 'l5', title: 'EP 5: ติวเข้ม สอวน.: Taxonomy, Evolution & Ecology ระดับแข่งขัน', duration: 60 },
      { id: 'l6', title: 'EP 6: ตะลุยโจทย์แนวสอบคัดเลือก สอวน. ค่าย 1 และ ค่าย 2', duration: 65 },
    ],
    imageUrl: '/7_0.png',
    rating: 5.0, reviewCount: 620, Level: 'ติวสอบ', Category: '🏅 คอร์สพิเศษ'
  },
  {
    id: 'special-posn-100',
    title: '🎯 คอร์ส ตะลุยโจทย์ สอวน . ละเอียด 100 ข้อ',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 390, originalPrice: 1290,
    badge: 'ราคาถูกสุดคุ้ม 🔥', badgeBg: C.red,
    tag: 'ราคาโปรโมชั่น 390.-', tagBg: '#FEE2E2', tagColor: '#B91C1C',
    description: 'คอร์สตะลุยโจทย์ สอวน. ชีววิทยา คัดสรรโจทย์เข้มข้น 100 ข้อ พร้อมเฉลยละเอียดทุกข้อ ชี้จุดหลอก พิชิตคะแนนค่าย 1 (ราคาถูกพิเศษ)',
    hours: 18, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: ตะลุยโจทย์ สอวน. ข้อ 1-25 (Cell & Biochemistry) + เฉลยละเอียด', duration: 50 },
      { id: 'l2', title: 'EP 2: ตะลุยโจทย์ สอวน. ข้อ 26-50 (Genetics & Molecular) + เฉลยละเอียด', duration: 50 },
      { id: 'l3', title: 'EP 3: ตะลุยโจทย์ สอวน. ข้อ 51-75 (Plant & Animal Systems) + เฉลยละเอียด', duration: 50 },
      { id: 'l4', title: 'EP 4: ตะลุยโจทย์ สอวน. ข้อ 76-100 (Ecology & Taxonomy) + เฉลยละเอียด', duration: 55 },
    ],
    imageUrl: '/10_0.png',
    rating: 4.9, reviewCount: 890, Level: 'ติวสอบ', Category: '🏅 คอร์สพิเศษ'
  },
  {
    id: 'special-alevel-practice',
    title: '📖 คอร์ส ตะลุยโจทย์ A - level',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1690, originalPrice: 3200,
    badge: 'ตะลุยโจทย์ A-Level', badgeBg: C.sky,
    tag: 'ข้อสอบจริง & Mock Test', tagBg: '#EFF6FF', tagColor: '#1E40AF',
    description: 'ฝึกทำโจทย์แนว A-Level ชีววิทยาล่าสุด ตะลุยข้อสอบย้อนหลัง ฝึกจับเวลาจริง พร้อมเทคนิคการวิเคราะห์โจทย์และตัดช้อยส์อย่างแม่นยำ',
    hours: 40, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: วิเคราะห์แนวข้อสอบ A-Level ชีววิทยา ล่าสุด & เทคนิคการตัดช้อยส์', duration: 55 },
      { id: 'l2', title: 'EP 2: ตะลุยข้อสอบจริง A-Level ชุดที่ 1 (ข้อ 1-25) + เฉลยละเอียดชี้จุดลวง', duration: 65 },
      { id: 'l3', title: 'EP 3: ตะลุยข้อสอบจริง A-Level ชุดที่ 1 (ข้อ 26-50) + เฉลยละเอียดชี้จุดลวง', duration: 65 },
      { id: 'l4', title: 'EP 4: จำลองการทำข้อสอบ Mock Test A-Level ชุดที่ 2 + เฉลยวิเคราะห์รายข้อ', duration: 70 },
    ],
    imageUrl: '/11.png',
    rating: 5.0, reviewCount: 750, Level: 'ติวสอบ', Category: '📖 คอร์สพิเศษ'
  },
  {
    id: 'special-alevel-theory',
    title: '📚 คอร์ส เนื้อหา A - level',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1890, originalPrice: 3500,
    badge: 'เนื้อหา A-Level', badgeBg: '#4F46E5',
    tag: 'สรุปเนื้อหา A-Level', tagBg: '#EEF2FF', tagColor: '#3730A3',
    description: 'สรุปเนื้อหาชีววิทยา ม.4-ม.6 ทั้งหมดที่ออกสอบ A-Level ปูพื้นฐานกระชับ เน้นประเด็นสำคัญ สรุปกระบวนการด้วย Mind Map ช่วยให้จดจำง่าย',
    hours: 50, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: สรุปเข้ม A-Level: Cell Biology & Energy Transformation', duration: 60 },
      { id: 'l2', title: 'EP 2: สรุปเข้ม A-Level: Genetics, Molecular Biology & Evolution', duration: 65 },
      { id: 'l3', title: 'EP 3: สรุปเข้ม A-Level: Plant Biology & Photosynthesis', duration: 60 },
      { id: 'l4', title: 'EP 4: สรุปเข้ม A-Level: Animal Biology & Human Physiology ทุกระบบ', duration: 75 },
      { id: 'l5', title: 'EP 5: สรุปเข้ม A-Level: Ecology, Taxonomy & Biodiversity', duration: 55 },
    ],
    imageUrl: '/12.png',
    rating: 4.9, reviewCount: 680, Level: 'ม.6', Category: '📖 คอร์สพิเศษ'
  },

  // ─── คอร์ส 99 บาท (Starter Quick Review Course) ──────────────────────────
  {
    id: 'special-99-starter',
    title: '⚡ คอร์ส 99 บาท: สรุปชีวะสกัดเข้ม Quick Review (ม.ปลาย)',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 99, originalPrice: 590,
    badge: 'คอร์ส 99 บาท 🔥', badgeBg: C.red,
    tag: 'โปรสุดคุ้ม 99.-', tagBg: '#FEE2E2', tagColor: '#991B1B',
    description: 'คอร์สราคาสุดประหยัดเพียง 99 บาท! รวมเทคนิคสกัดเข้มจุดออกสอบบ่อยชีววิทยา ม.ปลาย สรุปสูตรลัดและแผนภาพ Mind Map พร้อมลุยทุกสนามสอบ',
    hours: 10, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: สรุปจุดออกสอบบ่อย Cell & Biochemistry (คอร์ส 99 บาท)', duration: 40 },
      { id: 'l2', title: 'EP 2: สรุปเทคนิคทำโจทย์ Genetics & DNA (คอร์ส 99 บาท)', duration: 45 },
      { id: 'l3', title: 'EP 3: สรุปสูตรลัด Plant & Human Biology (คอร์ส 99 บาท)', duration: 45 },
      { id: 'l4', title: 'EP 4: สรุปประเด็นเน้น Ecology & Taxonomy (คอร์ส 99 บาท)', duration: 35 },
    ],
    imageUrl: '/11.png',
    rating: 5.0, reviewCount: 1420, Level: 'ติวสอบ', Category: '⚡ คอร์ส 99 บาท'
  }
];

const FREE_TRIALS = [
  { id: 'ft1', title: 'คลิปทดลองเรียน Bio Intensive I: โครงสร้างเซลล์และกลไกการลำเลียงสาร', duration: '45 นาที', course: 'Bio Intensive I', imageUrl: '/1_0.png' },
  { id: 'ft2', title: 'คลิปทดลองเรียน Bio Intensive II: เทคนิคคำนวณโจทย์พันธุศาสตร์เมนเดล', duration: '35 นาที', course: 'Bio Intensive II', imageUrl: '/2_0.png' },
  { id: 'ft3', title: 'คลิปทดลองเรียน คอร์สพิเศษ สอวน.: เจาะลึกข้อสอบคัดเลือกค่าย 1', duration: '40 นาที', course: 'คอร์ส ติวเข้ม สอวน.', imageUrl: '/7_0.png' },
  { id: 'ft4', title: 'คลิปทดลองเรียน คอร์ส 99 บาท: สรุปสกัดเข้ม Quick Review ม.ปลาย', duration: '30 นาที', course: 'คอร์ส 99 บาท', imageUrl: '/11.png' }
];

const CATEGORIES = [
  { emoji: '🧬', name: 'Bio Intensive I' },
  { emoji: '🧫', name: 'Bio Intensive II' },
  { emoji: '🌱', name: 'Bio Intensive III' },
  { emoji: '🦴', name: 'Bio Intensive IV' },
  { emoji: '🧠', name: 'Bio Intensive V' },
  { emoji: '🌿', name: 'Bio Intensive VI' },
  { emoji: '🏅', name: 'คอร์ส สอวน.' },
  { emoji: '📖', name: 'คอร์ส A-Level' },
  { emoji: '⚡', name: 'คอร์ส 99 บาท' }
];

const REVIEWS = [
  {
    name: 'พี่อลีน',
    text: 'พี่ต้นสอนแบบจำได้จริง จำได้ยาวๆ แล้วก็สอนสนุกมากกก เป็นกันเองสุดๆ ทำให้กล้าถามทุกเรื่อง และทำให้การเรียนชีวะไม่น่าเบื่อเลย จากวิชาที่เคยคิดว่ายาก กลายเป็นวิชาที่ชอบไปเลยย พี่ต้นอธิบายละเอียด เข้าใจง่าย เชื่อมโยงเนื้อหาให้เห็นภาพ ไม่ต้องท่องแบบฝืนๆ แล้วก็มีเพลงช่วยจำที่ใช้ได้จริงด้วยย ทำให้ไม่ลืมคอนเซ็ปต์และเข้าใจเนื้อหาแบบเอาไปใช้ได้จริง แนะนำมากก',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยนเรศวร',
    avatar: '/student_aleen.png',
    imagePosition: 'center 33%',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'Bio Intensive Complete Set'
  },
  {
    name: 'พี่โบ๊ท',
    text: 'เรียนกับพี่ต้นสนุกกก มีเพลงปั่นๆมาใช้ช่วยจำ เนื้อหาครบถ้วน มีข้อสอบให้ลองทำ จอยอะ ของดี๊',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่',
    avatar: '/student_boat.png?v=1784605471372',
    imagePosition: 'center top',
    school: 'โรงเรียนอุดมดรุณี',
    course: 'Bio Intensive II & A-Level'
  },
  {
    name: 'พี่ก๊อต (จิตธนา พูลอ้น)',
    text: 'เรียนกับพี่ต้นเข้าใจง่ายมากๆคับ มีวิธีสอนที่ทำให้เรื่องยากกลายเป็นง่าย',
    score: 'คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์',
    avatar: '/student_got.png?v=1784605471372',
    imagePosition: 'center top',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'Bio Intensive Series'
  },
  {
    name: 'พี่แตมป์ (จิรัฏฐ์ เดชพงษ์)',
    text: 'เรียนกับพี่ต้นสนุกมากคับบ สอนแบบเข้าใจง่าย เป็นกันเองคับบ เวลาเรียนก็มีมุกแทรกแก้เครียดด้วย มีทริคมีเพลงประกอบเนื้อหาให้จำได้คับบ',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์',
    avatar: '/student_stamp.png?v=1784605471372',
    imagePosition: 'center top',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'ตะลุยโจทย์ A-Level'
  }
];

const ARTICLES = [
  { id: 1, title: 'สรุป 10 จุดสำคัญเรื่องการสังเคราะห์ด้วยแสง (Photosynthesis)', date: '10 มี.ค. 2026', views: 1250, readTime: '5 นาที' },
  { id: 2, title: 'สกัด DNA ด้วยตนเองที่บ้าน! ขั้นตอนแล็บเสมือนง่ายๆ', date: '05 มี.ค. 2026', views: 890, readTime: '8 นาที' },
  { id: 3, title: 'โครงสร้างหัวใจและการสูบฉีดเลือด: เข้าใจด้วยเทคนิค Mind Map', date: '28 ก.พ. 2026', views: 1650, readTime: '4 นาที' }
];

const DEFAULT_SLIDES = [
  { id: 'slide-1', bg1: '#EFF6FF', bg2: '#DBEAFE', label: '🔥 โปรต้อนรับเปิดเทอม', title: 'Bio Intensive I - VI Complete Set', desc: 'ลงทะเบียนเรียนคอร์สแพ็กคู่รับส่วนลดพิเศษทันที 30% พร้อมรับไฟล์ e-Book สรุปเนื้อหาฟรีตลอดชีพ', badgeText: 'ลดสูงสุด 30%', imageUrl: '', actionText: 'ดูคอร์สทั้งหมด', actionType: 'bundle', targetCourseId: '' },
  { id: 'slide-2', bg1: '#FEF2F2', bg2: '#FEE2E2', label: '⚡ คอร์สสุดประหยัด 99.-', title: 'คอร์ส 99 บาท: สรุปชีวะสกัดเข้ม Quick Review', desc: 'รวมเทคนิคสกัดเข้มจุดออกสอบบ่อยชีววิทยา ม.ปลาย สรุปสูตรลัดและแผนภาพ Mind Map พร้อมลุยทุกสนามสอบ', badgeText: 'ราคาพิเศษ 99.-', imageUrl: '', actionText: 'สมัครเรียน 99.-', actionType: 'course', targetCourseId: 'special-99-starter' }
];

function formatPrice(n) { return Number(n).toLocaleString('th-TH'); }
function pct(orig, cur) { return Math.round((1 - cur / orig) * 100); }

// ─────────────────────────────────────────────────────────────────────────────
// TOASTS
// ─────────────────────────────────────────────────────────────────────────────
let _tid = 0;
function ToastContainer({ toasts, remove }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// MODALS
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children, wide }) {
  const titleId = useId();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const previouslyFocused = document.activeElement;
    const handleKeyDown = (event) => {
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

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar({ setPage, userRole, onLogout, cartCount, openCart, addToast, darkMode, setDarkMode, lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { label: 'หน้าแรก', page: 'landing' },
    { label: 'คอร์สเรียน', page: 'courses' },
    { label: 'คลังข้อสอบ', page: 'exams' },
  ];

  const moreLinks = [
    { label: 'บทความ', page: 'blog', icon: <BookText size={16} /> },
    { label: 'ช่วยเหลือ & FAQ', page: 'support', icon: <HelpCircle size={16} /> },
  ];

  const dividerStyle = {
    height: '1px', background: 'rgba(0,0,0,0.07)', margin: '4px 0'
  };

  const menuBtnStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    fontSize: '13px', fontWeight: 700, cursor: 'pointer',
    border: 'none', textAlign: 'left', fontFamily: 'inherit',
    background: active ? '#F0F4FF' : 'transparent',
    color: active ? C.sky : '#374151',
    transition: 'background 0.15s',
  });

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.96)',
      boxShadow: scrolled ? '0 8px 32px rgba(30,58,138,0.08)' : 'none',
      borderBottom: '1px solid rgba(229,231,235,0.6)',
      backdropFilter: 'blur(24px)',
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>

          {/* ── Logo ── */}
          <button onClick={() => setPage('landing')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'none', border: 'none', flexShrink: 0 }}>
            <img src="/logo.png" alt="INBIOLOGY Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(185,28,28,0.15))' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontWeight: 900, fontSize: '20px', color: C.navy, display: 'block', lineHeight: 1 }}>INBIOLOGY</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: C.sky, display: 'block', marginTop: '2px' }}>by พี่ต้น</span>
            </div>
          </button>

          {/* ── Main Nav Links (ใช้บ่อย) ── */}
          <nav className="desktop-nav" style={{ gap: '2px' }}>
            {navLinks.map(l => (
              <button key={l.page} onClick={() => setPage(l.page)}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, color: '#4B5563', cursor: 'pointer', background: 'none', border: 'none', borderRadius: '8px', transition: 'all 0.15s' }}
                onMouseOver={e => { e.currentTarget.style.color = C.sky; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseOut={e => { e.currentTarget.style.color = '#4B5563'; e.currentTarget.style.background = 'none'; }}>
                {l.label}
              </button>
            ))}
            {userRole === 'student' && (
              <button onClick={() => setPage('dashboard')}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, color: C.navy, cursor: 'pointer', background: 'none', border: 'none', borderRadius: '8px' }}
                onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                ห้องเรียนของฉัน
              </button>
            )}
            {userRole === 'admin' && (
              <button onClick={() => setPage('admin')}
                style={{ padding: '8px 14px', fontSize: '13px', fontWeight: 700, color: C.red, cursor: 'pointer', background: 'none', border: 'none', borderRadius: '8px' }}
                onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}>
                แดชบอร์ดแอดมิน
              </button>
            )}
          </nav>

          {/* ── Right Action Zone ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

            {/* Cart */}
            <button onClick={openCart}
              style={{ position: 'relative', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
              onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
              title="ตะกร้าสินค้า">
              <ShoppingCart size={20} color="#4B5563" />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px',
                  background: C.red, color: 'white', fontSize: '9px', fontWeight: 900, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Profile */}
            {userRole === 'guest'
              ? <button onClick={() => setPage('login')}
                style={{ background: C.sky, color: 'white', fontWeight: 700, fontSize: '13px', padding: '9px 18px', borderRadius: '10px', cursor: 'pointer', border: 'none', boxShadow: `0 4px 12px rgba(30,58,138,0.2)`, whiteSpace: 'nowrap' }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.88'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                เข้าสู่ระบบ
              </button>
              : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '12px', fontWeight: 800, color: '#111827', margin: 0 }}>{userRole === 'admin' ? '🛡 Admin' : '🎓 พี่วิทศรุต'}</p>
                  <p style={{ fontSize: '9px', color: '#9CA3AF', margin: 0 }}>ออนไลน์</p>
                </div>
                <button onClick={onLogout}
                  style={{ padding: '7px', borderRadius: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
                  onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                  title="ออกจากระบบ">
                  <LogOut size={17} color="#6B7280" />
                </button>
              </div>
            }

            {/* ── Hamburger 3-Line Button ── */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                title="เมนูเพิ่มเติม & ตั้งค่า"
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '4.5px', padding: '9px 10px', borderRadius: '10px', cursor: 'pointer',
                  background: menuOpen ? '#EFF6FF' : 'none',
                  border: menuOpen ? `1.5px solid ${C.sky}` : '1.5px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { if (!menuOpen) { e.currentTarget.style.background = '#F3F4F6'; } }}
                onMouseOut={e => { if (!menuOpen) { e.currentTarget.style.background = 'none'; } }}>
                {/* Animated hamburger lines */}
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: 'block',
                    width: i === 1 ? (menuOpen ? '14px' : '18px') : '18px',
                    height: '2px',
                    borderRadius: '2px',
                    background: menuOpen ? C.sky : '#4B5563',
                    transition: 'all 0.25s',
                    opacity: i === 1 ? (menuOpen ? 0.5 : 1) : 1,
                  }} />
                ))}
              </button>

              {/* ── Dropdown Panel ── */}
              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '290px',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '18px',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
                  padding: '8px',
                  zIndex: 99,
                  animation: 'fadeIn 0.18s ease',
                  maxHeight: '85vh',
                  overflowY: 'auto',
                }}>

                  {/* ── Profile Card (when logged in) ── */}
                  {userRole !== 'guest' && (
                    <>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 14px', borderRadius: '12px',
                        background: `linear-gradient(135deg,${C.navy}15,${C.sky}10)`,
                        border: `1px solid ${C.navy}20`, marginBottom: '4px'
                      }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: `linear-gradient(135deg,${C.navy},${C.sky})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', flexShrink: 0
                        }}>
                          {userRole === 'admin' ? '🛡' : '🎓'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 850, fontSize: '13px', color: C.navy, margin: 0, lineHeight: 1.2 }}>{userRole === 'admin' ? 'Admin Panel' : 'พี่วิทศรุต'}</p>
                          <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>{userRole === 'admin' ? 'แอดมินระบบ INBIOLOGY' : 'นักเรียน • โรงเรียนสตรีวิทยา ม.5'}</p>
                        </div>
                        <span style={{
                          fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '20px',
                          background: userRole === 'admin' ? '#FEF2F2' : '#EFF6FF',
                          color: userRole === 'admin' ? C.red : C.sky, flexShrink: 0
                        }}>{userRole === 'admin' ? 'Admin' : 'Student'}</span>
                      </div>
                      <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '4px 0' }} />
                    </>
                  )}

                  {/* ── Section: เมนูหลัก (Visible on mobile/tablet) ── */}
                  <div className="mobile-only">
                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>เมนูหลัก</p>
                    {navLinks.map(l => (
                      <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }} style={menuBtnStyle(false)}
                        onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: C.sky, fontSize: '10px' }}>👉</span>
                        {l.label}
                      </button>
                    ))}
                    {userRole === 'student' && (
                      <button onClick={() => { setPage('dashboard'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                        onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: C.sky, fontSize: '10px' }}>🎓</span>
                        ห้องเรียนของฉัน
                      </button>
                    )}
                    {userRole === 'admin' && (
                      <button onClick={() => { setPage('admin'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                        onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <span style={{ color: C.red, fontSize: '10px' }}>🛡</span>
                        แดชบอร์ดแอดมิน
                      </button>
                    )}
                    <div style={dividerStyle} />
                  </div>

                  {/* ── Section: นำทาง ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>นำทาง</p>
                  {moreLinks.map(l => (
                    <button key={l.page} onClick={() => { setPage(l.page); setMenuOpen(false); }} style={menuBtnStyle(false)}
                      onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ color: C.sky }}>{l.icon}</span>
                      {l.label}
                    </button>
                  ))}

                  <div style={dividerStyle} />

                  {/* ── Section: การแสดงผล ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>การแสดงผล</p>

                  {/* Dark Mode */}
                  <button onClick={() => {
                    const next = !darkMode; setDarkMode(next);
                    addToast(next ? '🌙 เปิดโหมดมืดแล้ว' : '☀️ เปิดโหมดสว่างแล้ว', 'info');
                  }} style={menuBtnStyle(darkMode)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = darkMode ? '#F0F4FF' : 'transparent'}>
                    <span style={{ color: darkMode ? '#7C3AED' : '#F59E0B' }}>{darkMode ? <Moon size={16} /> : <Sun size={16} />}</span>
                    {darkMode ? 'โหมดมืด (เปิดอยู่)' : 'โหมดสว่าง'}
                    <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', background: darkMode ? C.sky : '#E5E7EB', borderRadius: '999px', width: '32px', height: '18px', padding: '2px', transition: 'background 0.2s', flexShrink: 0 }}>
                      <span style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', transform: darkMode ? 'translateX(14px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </span>
                  </button>

                  {/* Language */}
                  <button onClick={() => {
                    const next = lang === 'TH' ? 'EN' : 'TH'; setLang(next);
                    addToast(next === 'EN' ? '🌐 Switched to English' : '🌐 เปลี่ยนเป็นภาษาไทย', 'info');
                  }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#059669' }}><Globe size={16} /></span>
                    ภาษา / Language
                    <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 800, background: C.skyLight, color: C.sky, padding: '2px 8px', borderRadius: '999px', flexShrink: 0 }}>{lang}</span>
                  </button>

                  <div style={dividerStyle} />

                  {/* ── Section: ห้องเรียน ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>ห้องเรียน</p>

                  {/* Sidebar toggle */}
                  <button onClick={() => {
                    addToast('📐 ตั้งค่าแถบซ้าย-ขวา → เปิดได้ในหน้า การตั้งค่า', 'info');
                    setPage('settings'); setMenuOpen(false);
                  }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#8B5CF6' }}><Layers size={16} /></span>
                    แถบซ้าย-ขวา (Sidebar)
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  {/* Video speed */}
                  <button onClick={() => { setPage('settings'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#EF4444' }}><Play size={16} /></span>
                    ความเร็วเล่นวิดีโอ
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  <div style={dividerStyle} />

                  {/* ── Section: การแจ้งเตือน ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>การแจ้งเตือน</p>

                  <button onClick={() => { setPage('settings'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#F59E0B' }}><Bell size={16} /></span>
                    ตั้งค่าการแจ้งเตือน
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  <div style={dividerStyle} />

                  {/* ── Section: ช่วยเหลือ & ตั้งค่า ── */}
                  <p style={{ fontSize: '10px', fontWeight: 800, color: '#9CA3AF', padding: '6px 14px 4px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>ช่วยเหลือ & ตั้งค่า</p>

                  <button onClick={() => { setPage('guide'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#D97706' }}><BookText size={16} /></span>
                    คู่มือการใช้งาน
                  </button>

                  <button onClick={() => {
                    if (userRole === 'guest') addToast('กรุณาเข้าสู่ระบบก่อน', 'error');
                    else setPage('settings');
                    setMenuOpen(false);
                  }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#374151' }}><Settings size={16} /></span>
                    ตั้งค่าบัญชี
                  </button>

                  <button onClick={() => { setPage('settings'); setMenuOpen(false); }} style={menuBtnStyle(false)}
                    onMouseOver={e => e.currentTarget.style.background = '#F9FAFB'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ color: '#06B6D4' }}><Eye size={16} /></span>
                    การเข้าถึง (Accessibility)
                    <ChevronRight size={13} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
                  </button>

                  {userRole !== 'guest' && (
                    <>
                      <div style={dividerStyle} />
                      <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ ...menuBtnStyle(false), color: '#EF4444' }}
                        onMouseOver={e => e.currentTarget.style.background = '#FEF2F2'}
                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                        <LogOut size={16} />
                        ออกจากระบบ
                      </button>
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
// ───────────────────────────────────────────────────────────
function HeroSection({ onStart, onView, courses }) {
  const stats = [
    { value: '50,000+', label: 'เรียนแล้วกว่า (คน)' },
    { value: `${courses.length || 4}+`, label: 'คอร์สคุณภาพ' },
    { value: '30+', label: 'ครูผู้สอน' },
    { value: 'Certificate', label: 'รับใบรับรองฟรี' },
  ];

  return (
    <section style={{
      paddingTop: '140px',
      paddingBottom: '80px',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.05) 50%, rgba(15, 23, 42, 0.3) 100%), url(/hero-bg.jpg) center center / cover no-repeat',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center'
    }}>
      {/* Wave decoration on top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, width: '100%', height: '10px', background: 'rgba(0,0,0,0.01)', pointerEvents: 'none' }} />

      {/* Floating Science/Learning Background Decorations */}
      <Brain size={48} style={{ position: 'absolute', top: '12%', left: '4%', color: 'rgba(255,255,255,0.2)', animation: 'float 6s ease-in-out infinite', pointerEvents: 'none' }} />
      <Sparkles size={32} style={{ position: 'absolute', bottom: '22%', left: '42%', color: 'rgba(255,255,255,0.25)', animation: 'float 8s ease-in-out infinite 1s', pointerEvents: 'none' }} />
      <Award size={40} style={{ position: 'absolute', top: '16%', right: '8%', color: 'rgba(255,255,255,0.2)', animation: 'float 7s ease-in-out infinite 0.5s', pointerEvents: 'none' }} />
      <BookOpen size={36} style={{ position: 'absolute', bottom: '12%', right: '48%', color: 'rgba(255,255,255,0.2)', animation: 'float 9s ease-in-out infinite 2s', pointerEvents: 'none' }} />

      <div className="hero-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', gap: '48px', alignItems: 'center', width: '100%', position: 'relative', zIndex: 2 }}>
        {/* Left Info */}
        <div className="hero-left animate-fade-in-up" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '36px'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(40px,5.2vw,64px)',
              fontWeight: 950,
              color: '#FFFFFF',
              textShadow: '0 4px 16px rgba(15, 23, 42, 0.75), 0 2px 4px rgba(15, 23, 42, 0.5)',
              lineHeight: 1.15,
              margin: 0
            }}>
              เรียนชีวะให้เข้าใจ
              <span style={{
                display: 'block',
                color: '#FDE047', // Beautiful golden yellow accent
                fontSize: 'clamp(36px,4.6vw,56px)',
                fontWeight: 950,
                marginTop: '8px',
                textShadow: '0 4px 16px rgba(15, 23, 42, 0.8), 0 2px 4px rgba(15, 23, 42, 0.6)'
              }}>ไม่ใช่แค่จำ</span>
              <span style={{
                display: 'block',
                color: '#F3F4F6',
                fontSize: 'clamp(18px,2.5vw,26px)',
                fontWeight: 700,
                marginTop: '12px',
                textShadow: '0 2px 8px rgba(15, 23, 42, 0.6)'
              }}>ติวเข้มออนไลน์แบบครบวงจรกับ พี่ต้น</span>
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={onStart} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: C.red, color: 'white', fontWeight: 800, fontSize: '15px', padding: '14px 28px', borderRadius: '12px', cursor: 'pointer', border: 'none', boxShadow: `0 8px 24px rgba(239,68,68,0.35)` }}
                onMouseOver={e => e.currentTarget.style.background = C.redDark}
                onMouseOut={e => e.currentTarget.style.background = C.red}>
                <Play size={18} fill="white" /> เริ่มเรียนฟรี
              </button>
              <button onClick={onView} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '15px',
                padding: '14px 28px',
                borderRadius: '12px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'; e.currentTarget.style.borderColor = '#FFFFFF'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'; }}>
                ดูคอร์สทั้งหมด <ChevronRight size={18} />
              </button>
            </div>

            {/* Stats list - Transparent glassmorphic style */}
            <div className="stats-grid" style={{
              gap: '12px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '20px',
              padding: '18px 16px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              marginTop: '12px'
            }}>
              {stats.map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 950, color: '#FFFFFF', fontSize: '22px', lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>{s.value}</div>
                  <div style={{ color: '#F3F4F6', fontSize: '10px', fontWeight: 700, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Instructor Card */}
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="animate-float" style={{ position: 'relative' }}>

            {/* Main Glass Card */}
            <div style={{
              width: '320px',
              borderRadius: '28px',
              position: 'relative',
              background: 'rgba(255,255,255,0.88)',
              border: '1px solid rgba(0,0,0,0.08)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.06), inset 0 1px 2px rgba(255,255,255,0.8), 0 0 50px rgba(185,28,28,0.05)',
              overflow: 'hidden',
              padding: '28px 24px 24px',
            }}>
              {/* Ambient glow behind photo */}
              <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '220px', height: '220px', background: 'radial-gradient(circle,rgba(185,28,28,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

              {/* Photo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '120px', height: '120px', borderRadius: '50%',
                    border: '3px solid rgba(185,28,28,0.15)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    overflow: 'hidden', background: '#1E3A8A', flexShrink: 0,
                  }}>
                    <img src="/instructor.jpg" alt="พี่ต้น — ผู้สอน INBIOLOGY" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                  {/* Online status indicator */}
                  <span style={{
                    position: 'absolute', bottom: '6px', right: '6px',
                    width: '18px', height: '18px', background: '#10B981',
                    borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 0 8px rgba(16,185,129,0.4)'
                  }} />
                </div>

                {/* Name & Title */}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: C.textDark, fontWeight: 900, fontSize: '18px', letterSpacing: '-0.01em', margin: '0 0 4px' }}>พี่ต้น</p>
                  <p style={{ color: C.textMuted, fontSize: '11px', fontWeight: 600, margin: '0 0 8px' }}>นายพิสิษฐ์ สายตา</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#FEE2E2', color: C.red, fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(185,28,28,0.1)' }}>🔬 ชีววิทยา</span>
                    <span style={{ background: '#EFF6FF', color: C.sky, fontSize: '9px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(30,58,138,0.1)' }}>🎓 เกียรตินิยมอันดับ 1</span>
                  </div>
                </div>

                {/* Credentials */}
                <div style={{ width: '100%', background: '#F9FAFB', borderRadius: '14px', padding: '12px 14px', border: '1px solid #E5E7EB' }}>
                  {[
                    { icon: '🎓', text: 'ป.ตรี คณะศึกษาศาสตร์ มหาวิทยาลัยนเรศวร' },
                    { icon: '🎓', text: 'ป.โท คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น' },
                    { icon: '📚', text: 'ประสบการณ์สอน 9 ปี' },
                    { icon: '🏫', text: 'วิทยากรพิเศษตามโรงเรียนต่างๆ' },
                  ].map((item, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', borderBottom: i < arr.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.icon}</span>
                      <p style={{ color: '#4B5563', fontSize: '10px', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: '13px' }}>⭐</span>)}
                  </div>
                  <span style={{ color: C.textDark, fontWeight: 900, fontSize: '14px' }}>4.98</span>
                  <span style={{ color: C.textMuted, fontSize: '10px' }}>(2,847 รีวิว)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Wave transition aligned securely to bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', lineHeight: 0, zIndex: 10 }}>
        <svg viewBox="0 0 1440 60" style={{ width: '100%', display: 'block' }}>
          <path fill={C.page} d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROMO CAROUSEL
// ─────────────────────────────────────────────────────────────────────────────
function PromoCarousel({ slides, courses, onAddToCart, enrolledIds, addToast, onViewDetails, setPage }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!slides?.length) return;
    const t = setInterval(() => setActive(p => (p + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [slides?.length]);
  if (!slides?.length) return null;
  const s = slides[active];

  const handleAction = () => {
    if (s.actionType === 'bundle') {
      const toAdd = courses.filter(c => !enrolledIds.includes(c.id));
      if (!toAdd.length) { addToast('คุณลงทะเบียนครบทุกคอร์สแล้ว', 'info'); return; }
      toAdd.forEach(c => onAddToCart(c));
      addToast(`🛒 เพิ่ม ${toAdd.length} คอร์สลงตะกร้าพร้อมส่วนลดเซ็ตคู่แล้ว`, 'success');
    } else if (s.actionType === 'course') {
      const c = courses.find(x => x.id === s.targetCourseId);
      if (!c) { addToast('ไม่พบคอร์สเรียนนี้', 'error'); return; }
      onAddToCart(c);
    } else {
      document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetails = () => {
    if (s.targetCourseId) {
      const c = courses.find(x => x.id === s.targetCourseId);
      if (c) {
        onViewDetails(c);
      } else {
        setPage('courses');
      }
    } else {
      setPage('courses');
    }
  };

  return (
    <section style={{ padding: '40px 24px', background: C.page }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(135deg, ${s.bg1} 0%, ${s.bg2} 100%)`,
          borderRadius: '24px', padding: '32px 40px', display: 'flex', alignItems: 'center',
          gap: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.02)',
          position: 'relative', overflow: 'hidden', flexWrap: 'wrap'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', filter: 'blur(40px)' }} />
          <div style={{ flex: 1, minWidth: '300px', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '15px', fontWeight: 850, color: '#374151', background: 'rgba(255,255,255,0.92)', padding: '7px 18px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{s.label}</span>
              <span style={{ fontSize: '15px', fontWeight: 850, color: C.red, background: 'rgba(255,255,255,0.92)', padding: '7px 18px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>{s.badgeText}</span>
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 950, color: '#111827', margin: '0 0 12px', lineHeight: 1.2 }}>{s.title}</h3>
            <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, margin: '0 0 24px', fontFamily: C.fontBody }}>{s.desc}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={handleAction} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: C.navy, color: 'white', fontWeight: 800, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', border: 'none', boxShadow: `0 4px 12px rgba(185,28,28,0.25)` }}
                onMouseOver={e => e.currentTarget.style.background = C.sky}
                onMouseOut={e => e.currentTarget.style.background = C.navy}>
                {s.actionText} <ArrowRight size={16} />
              </button>
              <button onClick={handleViewDetails} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.85)', border: '1.5px solid #D1D5DB', color: '#374151', fontWeight: 800, fontSize: '14px', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}>
                <Info size={16} /> ดูรายละเอียด
              </button>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
            <div style={{ width: '220px', height: '140px', borderRadius: '16px', background: 'rgba(255,255,255,0.8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: C.navy, border: '1px solid #E5E7EB' }}>
              <Zap size={32} color={C.red} />
              <span style={{ fontSize: '12px', fontWeight: 800, marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>FLASH SALE INBIOLOGY</span>
            </div>
          </div>
        </div>
        {/* Carousel indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '18px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ height: '8px', borderRadius: '999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', background: i === active ? C.sky : '#D1D5DB', width: i === active ? '36px' : '8px' }} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────────────────────
function CourseCard({ course, onAddToCart, enrolled, onViewDetails, onTrial }) {
  const [hover, setHover] = useState(false);
  const disc = pct(course.originalPrice, course.price);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: 'white', borderRadius: '20px', border: '1px solid', borderColor: hover ? C.navy : '#E5E7EB', overflow: 'hidden',
      boxShadow: hover ? '0 20px 40px rgba(185,28,28,0.12), 0 4px 12px rgba(30,58,138,0.04)' : '0 4px 12px rgba(0,0,0,0.02)',
      transform: hover ? 'translateY(-6px)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: '240px', background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px' }}>
        <img src={course.imageUrl} alt={course.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '6px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)', transition: 'transform 0.5s', transform: hover ? 'scale(1.04)' : 'scale(1)' }} />
        <span style={{ position: 'absolute', top: '12px', left: '12px', background: course.badgeBg, color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', zIndex: 2 }}>
          {course.badge}
        </span>
        <button onClick={() => onTrial(course)} style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30,58,138,0.82)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 2 }}>
          <PlayCircle size={12} /> ทดลองเรียนฟรี
        </button>
      </div>

      {/* Body details */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: course.tagBg, color: course.tagColor }}>
            {course.tag}
          </span>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF' }}>{course.Level}</span>
        </div>
        <h3 onClick={() => onViewDetails(course)} style={{ cursor: 'pointer', fontWeight: 850, color: C.navy, fontSize: '15px', lineHeight: 1.3, margin: 0, minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} onMouseOver={e => e.currentTarget.style.color = C.sky} onMouseOut={e => e.currentTarget.style.color = C.navy}>
          {course.title}
        </h3>
        <p style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600, margin: 0 }}>ผู้สอน: {course.instructor}</p>

        {/* Rating and hours info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={12} fill="#FBBF24" color="#FBBF24" />
            <span style={{ fontWeight: 800, color: '#D97706' }}>{course.rating}</span>
            <span style={{ color: '#9CA3AF' }}>({course.reviewCount})</span>
          </div>
          <span style={{ color: C.sky, fontWeight: 700 }}>{course.hours} ชั่วโมงเรียน</span>
        </div>

        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.5, fontFamily: C.fontBody, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description}
        </p>

        {/* Bottom price and actions */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F3F4F6', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through', display: 'block' }}>฿{formatPrice(course.originalPrice)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, color: C.navy }}>฿{formatPrice(course.price)}</span>
              <span style={{ fontSize: '9px', fontWeight: 800, color: 'white', background: C.red, padding: '2px 5px', borderRadius: '4px' }}>-{disc}%</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => onViewDetails(course)} style={{ padding: '8px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: '#EFF6FF', color: C.sky, border: 'none', cursor: 'pointer' }}>
              รายละเอียด
            </button>
            <button onClick={() => onAddToCart(course)} disabled={enrolled} style={{
              display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: enrolled ? 'not-allowed' : 'pointer', border: 'none',
              background: enrolled ? '#D1FAE5' : C.red, color: enrolled ? '#065F46' : 'white'
            }}>
              {enrolled ? <><Check size={11} /> เรียนเลย</> : <><ShoppingCart size={11} /> ชำระเงิน</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE DETAIL VIEW / MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CourseDetailView({ course, onAddToCart, enrolled, onClose, onStartTrial }) {
  if (!course) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="course-detail-grid" style={{ gap: '24px', alignItems: 'start' }}>
        {/* Left Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '320px', background: '#0F172A', borderRadius: '16px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <img src={course.imageUrl} loading="lazy" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', opacity: 0.9 }} alt="" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.25)' }}>
              <button onClick={() => onStartTrial(course)} style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.35)', zIndex: 2 }}>
                <Play size={24} fill={C.sky} color={C.sky} style={{ marginLeft: '4px' }} />
              </button>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 800, background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '999px', zIndex: 2 }}>▶ ดูตัวอย่างคอร์สเรียน</span>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: C.navy, margin: '0 0 8px' }}>{course.title}</h2>
            <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.6, fontFamily: C.fontBody }}>{course.description}</p>
          </div>
          {/* Syllabus */}
          <div>
            <h4 style={{ fontWeight: 800, fontSize: '13px', color: C.navy, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>📚 เนื้อหาและหลักสูตรการสอน</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#F9FAFB', padding: '16px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
              {course.lessons?.map((l, idx) => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: idx === course.lessons.length - 1 ? 'none' : '1px solid #F3F4F6' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>บทที่ {idx + 1}: {l.title}</span>
                  <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{l.duration} นาที</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right purchase card */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through' }}>ราคาปกติ ฿{formatPrice(course.originalPrice)}</span>
            <span style={{ background: C.red, color: 'white', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>-{pct(course.originalPrice, course.price)}% OFF</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 950, color: C.navy, lineHeight: 1 }}>฿{formatPrice(course.price)}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#4B5563', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color={C.sky} /> <span>เรียนจุใจ {course.hours} ชั่วโมงเต็ม</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={14} color={C.sky} /> <span>เข้าเรียนออนไลน์ได้นาน {course.validity} วัน</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={14} color={C.sky} /> <span>รับไฟล์เอกสาร e-Book PDF ฟรี</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Award size={14} color={C.sky} /> <span>ได้รับใบรับรอง (Certificate) หลังจบคอร์ส</span></div>
          </div>

          <button onClick={() => { onAddToCart(course); onClose(); }} disabled={enrolled} style={{
            width: '100%', background: enrolled ? '#D1FAE5' : C.sky, color: enrolled ? '#065F46' : 'white',
            fontWeight: 800, fontSize: '14px', padding: '14px', borderRadius: '12px', cursor: enrolled ? 'not-allowed' : 'pointer', border: 'none'
          }}>
            {enrolled ? '✓ คุณเป็นเจ้าของคอร์สนี้แล้ว' : '🛒 ซื้อคอร์สเรียนนี้เลย'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CATALOG / SEARCH / FILTERS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function CatalogPage({ courses, onAddToCart, enrolledIds, onViewDetails, onTrial }) {
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

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT & PAYMENT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function CheckoutPage({ cart, coupons, onCheckout, addToast }) {
  const [method, setMethod] = useState('promptpay');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const total = cart.reduce((s, c) => s + c.price, 0);
  const final = Math.max(0, total - discount);

  const handleCheckout = () => onCheckout({
    couponCode: coupon.trim() || undefined,
    paymentMethod: method,
  });

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

            <button onClick={handleCheckout} disabled={cart.length === 0} style={{
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

// ─────────────────────────────────────────────────────────────────────────────
// CLASSROOM PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ClassroomPage({ courses, enrolledCourses, activeCourseId, addToast, setPage, notes, setNotes }) {
  const enrolled = courses.filter(c => enrolledCourses.includes(c.id));
  const initialCourse = courses.find(c => c.id === activeCourseId) || enrolled[0] || courses[0];
  const [activeCourse, setActiveCourse] = useState(initialCourse);
  const [activeLesson, setActiveLesson] = useState(initialCourse?.lessons?.[0]);

  useEffect(() => {
    const target = courses.find(c => c.id === activeCourseId);
    if (target) {
      setActiveCourse(target);
      setActiveLesson(target.lessons?.[0]);
    }
  }, [activeCourseId, courses]);

  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tab, setTab] = useState('notes'); // notes, ask-instructor
  const [noteText, setNoteText] = useState('');
  const [chatLog, setChatLog] = useState([
    { role: 'system', text: 'ส่งคำถามที่คุณสงสัยเกี่ยวกับบทเรียนนี้หา พี่ต้น (ผู้สอน) ได้โดยตรงที่นี่ พี่ต้นจะรีบตอบกลับคุณโดยเร็วที่สุดผ่านช่องทางแจ้งเตือนครับ ✉️' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes(p => [...p, {
      id: Date.now(),
      courseId: activeCourse?.id,
      courseTitle: activeCourse?.title || 'บทเรียน',
      time: activeLesson?.title || 'บทเรียน',
      text: noteText
    }]);
    setNoteText('');
    addToast('📝 บันทึกโน้ตย่อส่วนตัวเรียบร้อยแล้ว', 'success');
  };

  const handleAskInstructor = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatLog(p => [...p, { role: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatLog(p => [...p, { role: 'system', text: '📨 ส่งคำถามถึงพี่ต้น (ผู้สอน) สำเร็จ! กำลังรอผู้สอนเข้ามาตอบคำถาม...' }]);
    }, 400);

    setTimeout(() => {
      let resp = 'ได้รับคำถามเรียบร้อยครับน้อง! ข้อนี้สามารถวิเคราะห์ตามทฤษฎีในคลิปที่แนะนำได้เลย หรือหากต้องการการอธิบายเพิ่มเติมแบบวิดีโอ ทักไลน์พี่ได้เลยครับ!';
      const txt = userMsg.toLowerCase();
      if (txt.includes('เซลล์') || txt.includes('cell')) {
        resp = 'สำหรับข้อนี้: เซลล์คือหน่วยย่อยโครงสร้างพื้นฐานที่เล็กที่สุดของสิ่งมีชีวิต โดยเซลล์ยูคาริโอตจะมีออร์แกเนลล์เด่นชัดที่มีเยื่อหุ้มครับ เช่น นิวเคลียส, ไมโทคอนเดรีย!';
      } else if (txt.includes('dna') || txt.includes('พันธุศาสตร์')) {
        resp = 'สำหรับคำถาม DNA: DNA เป็นโครงสร้างสายคู่บิดเกลียว (Double Helix) ประกอบด้วยน้ำตาลดีออกซีไรโบส หมู่ฟอสเฟต และเบส 4 ชนิด (A-T, C-G) ซึ่งทำหน้าที่ในการเก็บสารพันธุกรรมครับ';
      } else if (txt.includes('พลังงาน') || txt.includes('atp') || txt.includes('ไมโท')) {
        resp = 'สำหรับคำถามเรื่องพลังงานเซลล์: ATP จะถูกผลิตมากที่สุดที่ชั้นเยื่อหุ้มชั้นในของไมโทคอนเดรีย ผ่านกระบวนการถ่ายทอดอิเล็กตรอน (Electron Transport Chain) ครับ!';
      }
      setChatLog(p => [...p, { role: 'instructor', text: `พี่ต้น: ${resp}` }]);
    }, 2000);
  };

  if (enrolled.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: C.page, paddingTop: '100px', textAlign: 'center' }}>
        <h2 style={{ color: C.navy, fontWeight: 900 }}>คุณยังไม่ได้ซื้อคอร์สเรียนใดๆ</h2>
        <button onClick={() => setPage('courses')} style={{ background: C.sky, color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', marginTop: '10px', cursor: 'pointer' }}>เลือกซื้อคอร์สเรียน</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: '80px' }}>
      <div className="classroom-grid" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px', gap: '24px', alignItems: 'start' }}>
        {/* Left Sidebar Chapter List */}
        <aside style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ padding: '16px', background: C.navy, color: 'white' }}>
            <h3 style={{ fontWeight: 900, fontSize: '14px', margin: 0 }}>📚 บทเรียนทั้งหมด</h3>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>{activeCourse?.title}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeCourse?.lessons.map((l, idx) => (
              <button key={l.id} onClick={() => setActiveLesson(l)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', cursor: 'pointer', border: 'none',
                borderBottom: '1px solid #F3F4F6', background: l.id === activeLesson?.id ? '#EFF6FF' : 'white', textAlign: 'left', fontFamily: 'inherit'
              }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: l.id === activeLesson?.id ? C.sky : '#F3F4F6', color: l.id === activeLesson?.id ? 'white' : '#4B5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                  {idx + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#374151', margin: 0 }}>{l.title}</p>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{l.duration} นาที {idx < 2 ? '✅' : '⏳'}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Right Classroom Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Video Screen Component */}
          <div style={isFullscreen ? { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'black', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } : { background: 'black', borderRadius: '24px', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(2px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: isFullscreen ? '80px' : '60px', height: isFullscreen ? '80px' : '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Play size={isFullscreen ? 36 : 24} color="white" fill="white" style={{ marginLeft: '4px', opacity: 0.9 }} />
              </div>
              <p style={{ color: 'white', fontSize: isFullscreen ? '22px' : '14px', fontWeight: 900, marginTop: '20px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{activeLesson?.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: isFullscreen ? '14px' : '11px', marginTop: '4px' }}>ติวเข้มเนื้อหาชีววิทยาแบบครบวงจรกับพี่ต้น</p>
            </div>

            {/* Control bar */}
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.7)', padding: '8px 16px', borderRadius: '12px', zIndex: 10, flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><Play size={16} fill="white" /></button>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 600 }}>0:00 / {activeLesson?.duration}:00</span>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Speed selector */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px', borderRadius: '6px' }}>
                  {[0.5, 1, 1.5, 2].map(sp => (
                    <button key={sp} onClick={() => setSpeed(sp)} style={{ background: speed === sp ? C.sky : 'transparent', color: 'white', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer' }}>
                      {sp}x
                    </button>
                  ))}
                </div>
                {/* Fullscreen Button */}
                <button onClick={() => setIsFullscreen(!isFullscreen)} style={{ background: C.navy, border: 'none', borderRadius: '6px', padding: '5px 10px', color: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 800 }}>
                  {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />} {isFullscreen ? 'ย่อหน้าจอ' : 'ขยายเต็มจอ'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick study attachments sheet */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '14px', color: C.navy, margin: '0 0 4px' }}>{activeLesson?.title}</h4>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>ติวทบทวนบทเรียนพร้อมเอกสารดาวน์โหลดฉบับย่อ</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF', color: C.sky, fontSize: '12px', fontWeight: 800, padding: '10px 16px', borderRadius: '10px', textDecoration: 'none', border: '1px solid #DBEAFE' }}>
                <Download size={14} /> ดาวน์โหลด PDF สรุป
              </a>
              <button onClick={() => setPage('quiz')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.red, color: 'white', fontSize: '12px', fontWeight: 800, padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                📝 ทำควิซประเมินผล
              </button>
            </div>
          </div>

          {/* Interactive study toolbox tab system */}
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {[
                { id: 'notes', label: '📝 สมุดบันทึกโน้ตย่อ' },
                { id: 'ask-instructor', label: '🙋 ถามคำถามผู้สอน' },
              ].map(tb => (
                <button key={tb.id} onClick={() => setTab(tb.id)} style={{
                  flex: 1, padding: '14px', border: 'none', background: tab === tb.id ? 'white' : 'transparent',
                  color: tab === tb.id ? C.navy : '#4B5563', fontWeight: 800, fontSize: '12px', cursor: 'pointer',
                  borderBottom: tab === tb.id ? `3px solid ${C.sky}` : 'none', fontFamily: 'inherit'
                }}>
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div style={{ padding: '20px' }}>
              {tab === 'notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="จดบันทึกประเด็นสำคัญระหว่างเรียนที่นี่..." rows={3} style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px', fontSize: '12px', outline: 'none', fontFamily: 'inherit', resize: 'none', boxSizing: 'border-box' }} />
                  <button onClick={addNote} style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', alignSelf: 'flex-end' }}>
                    บันทึกโน้ตย่อ
                  </button>
                  {notes.filter(nt => nt.courseId === activeCourse?.id).length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      {notes.filter(nt => nt.courseId === activeCourse?.id).map(nt => (
                        <div key={nt.id} style={{ background: '#F9FAFB', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '12px' }}>
                          <span style={{ fontWeight: 800, color: C.sky, display: 'block', marginBottom: '2px' }}>{nt.time}</span>
                          <p style={{ margin: 0, color: '#374151' }}>{nt.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {tab === 'ask-instructor' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', background: '#F9FAFB', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    {chatLog.map((c, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: c.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <span style={{
                          background: c.role === 'user' ? C.sky : c.role === 'system' ? '#FEF3C7' : '#E5E7EB',
                          color: c.role === 'user' ? 'white' : c.role === 'system' ? '#92400E' : '#111827',
                          padding: '8px 12px', borderRadius: '12px', fontSize: '12px', maxWidth: '75%', lineHeight: 1.4,
                          border: c.role === 'system' ? '1px solid #FCD34D' : 'none'
                        }}>
                          {c.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleAskInstructor} style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" placeholder="พิมพ์คำถามที่ต้องการถามพี่ต้นตรงนี้..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }} />
                    <button type="submit" style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                      ส่งคำถามหาผู้สอน
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAM CENTER & TIMER SIMULATOR
// ─────────────────────────────────────────────────────────────────────────────
const EXAM_QUESTIONS = [
  { id: 1, q: '1. ออร์แกเนลล์ใดทำหน้าที่เป็นโรงไฟฟ้าหลักในการผลิต ATP ให้แก่เซลล์?', a: 'ไมโทคอนเดรีย', opts: ['คลอโรพลาสต์', 'ไมโทคอนเดรีย', 'กอลจิบอดี', 'ไลโซโซม'] },
  { id: 2, q: '2. กระบวนการใดพบการแบ่งนิวเคลียสแบบลดจำนวนโครโมโซมลงครึ่งหนึ่ง?', a: 'Meiosis', opts: ['Mitosis', 'Meiosis', 'Binary Fission', 'Budding'] },
  { id: 3, q: '3. ข้อใดคือคู่เบสที่ถูกต้องในโครงสร้างเกลียวคู่ของ DNA?', a: 'A คู่กับ T, G คู่กับ C', opts: ['A คู่กับ U, G คู่กับ C', 'A คู่กับ G, T คู่กับ C', 'A คู่กับ T, G คู่กับ C', 'A คู่กับ C, T คู่กับ G'] },
];

function ExamCenterPage({ addToast, setPage }) {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [seconds, setSeconds] = useState(120);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const questions = EXAM_QUESTIONS;

  const submitExam = useCallback(() => {
    let pts = 0;
    EXAM_QUESTIONS.forEach(q => {
      if (answersRef.current[q.id] === q.a) pts++;
    });
    setScore(pts);
    addToast('🎉 ทำข้อสอบเสร็จเรียบร้อย! ประกาศผลคะแนนแล้ว', 'success');
  }, [addToast]);

  useEffect(() => {
    if (!started || score !== null) return;
    const t = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(t);
          submitExam();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, score, submitExam]);

  const minutes = Math.floor(seconds / 60);
  const remSecs = seconds % 60;

  return (
    <div style={{ minHeight: '100vh', background: C.page, paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
        {!started ? (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
            <Award size={48} color={C.sky} style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontWeight: 900, color: C.navy, fontSize: '22px', margin: '0 0 8px' }}>Mock Exam: คลังข้อสอบจำลองชีววิทยา</h2>
            <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px', fontFamily: C.fontBody }}>
              ข้อสอบจำลองมีจำนวน 3 ข้อ เวลาในการทำสอบ 2:00 นาที <br />หลังทำสอบระบบจะประเมินคะแนนและจุดอ่อนให้ทันที
            </p>
            <button onClick={() => setStarted(true)} style={{ background: C.red, color: 'white', fontWeight: 800, fontSize: '14px', padding: '14px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: `0 6px 20px rgba(239,68,68,0.3)` }}>
              เริ่มทำข้อสอบเลย
            </button>
          </div>
        ) : score !== null ? (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Award size={48} color="#10B981" style={{ margin: '0 auto' }} />
            <h2 style={{ fontWeight: 900, color: C.navy, fontSize: '24px', margin: 0 }}>ประเมินผลคะแนนสอบ</h2>
            <div style={{ fontSize: '48px', fontWeight: 950, color: C.sky }}>{score} / 3 คะแนน</div>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.6, fontFamily: C.fontBody }}>
              {score === 3 ? 'เยี่ยมยอดมาก! คุณมีจุดแข็งในเรื่องโครงสร้างเซลล์และพันธุศาสตร์' : 'ควรทบทวนเรื่องการแบ่งเซลล์และการจับคู่เบสเพิ่มเติมนะครับ'}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => { setStarted(false); setScore(null); setAnswers({}); setSeconds(120); }} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px', fontSize: '12px', fontWeight: 800, background: 'none', cursor: 'pointer' }}>
                ทำสอบใหม่อีกครั้ง
              </button>
              <button onClick={() => setPage('dashboard')} style={{ flex: 1, background: C.navy, color: 'white', borderRadius: '10px', padding: '12px', fontSize: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                กลับไปยัง Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '12px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px', color: C.navy }}>แบบทดสอบชีววิทยาหลัก</span>
              <span style={{ background: '#FEF2F2', color: C.red, fontSize: '13px', fontWeight: 800, padding: '6px 12px', borderRadius: '8px' }}>
                ⏱️ เวลาคงเหลือ {minutes}:{remSecs < 10 ? '0' + remSecs : remSecs}
              </span>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {questions.map(q => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontWeight: 800, fontSize: '13px', color: '#374151', margin: 0 }}>{q.q}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {q.opts.map(o => (
                      <button key={o} onClick={() => setAnswers(p => ({ ...p, [q.id]: o }))} style={{
                        padding: '10px', borderRadius: '8px', border: `1.5px solid ${answers[q.id] === o ? C.sky : '#E5E7EB'}`,
                        background: answers[q.id] === o ? '#EFF6FF' : 'white', fontSize: '12px', fontWeight: 700,
                        color: '#374151', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit'
                      }}>
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={submitExam} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginTop: '12px' }}>
              ส่งกระดาษคำตอบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function StudentDashboard({ courses, enrolledCourses, setPage, addToast, setActiveCourseId, notes }) {
  const [activeTab, setActiveTab] = useState('courses'); // courses, notes, support
  const enrolled = courses.filter(c => enrolledCourses.includes(c.id));

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', background: C.page, paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="student-dashboard-layout" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', gap: '24px' }}>
        {/* Left dashboard profile sidebar */}
        <aside style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: C.skyLight, color: C.sky, fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              👨‍🎓
            </div>
            <h3 style={{ fontWeight: 850, fontSize: '15px', color: C.navy, margin: '0 0 2px' }}>พี่วิทศรุต</h3>
            <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>โรงเรียนสตรีวิทยา • ม.5</p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'courses', label: '📚 คอร์สเรียนของฉัน' },
              { id: 'notes', label: '📝 สมุดบันทึกโน้ตย่อ' },
              { id: 'support', label: '📞 ศูนย์ช่วยเหลือ FAQ' }
            ].map(tb => (
              <button key={tb.id} onClick={() => setActiveTab(tb.id)} style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: '12px', fontWeight: 800, fontFamily: 'inherit',
                background: activeTab === tb.id ? '#EFF6FF' : 'transparent', color: activeTab === tb.id ? C.sky : '#4B5563'
              }}>
                {tb.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Dashboard panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: '0 0 4px' }}>คอร์สเรียนของคุณ</h2>
                <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>ลงทะเบียนเรียนแล้วทั้งหมด {enrolled.length} คอร์ส</p>
              </div>

              {enrolled.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #E5E7EB', padding: '48px', textAlign: 'center' }}>
                  <BookOpen size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontWeight: 800, color: C.navy, fontSize: '15px', margin: '0 0 6px' }}>ยังไม่มีคอร์สเรียนสะสม</h3>
                  <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '18px' }}>ไปดูคอร์สชีววิทยาที่น่าสนใจและเริ่มต้นเรียนรู้วันนี้</p>
                  <button onClick={() => setPage('courses')} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    เลือกซื้อคอร์สเรียนเลย
                  </button>
                </div>
              ) : (
                <div className="enrolled-courses-grid" style={{ gap: '16px' }}>
                  {enrolled.map(c => (
                    <div key={c.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ height: '120px', background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                        <img src={c.imageUrl} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} alt="" />
                      </div>
                      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <h4 style={{ fontWeight: 800, color: C.navy, fontSize: '13px', margin: 0, lineHeight: 1.3 }}>{c.title}</h4>
                        {/* Progress Bar */}
                        <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#6B7280', marginBottom: '4px' }}>
                            <span>ความก้าวหน้าการเรียน</span>
                            <span>60%</span>
                          </div>
                          <div style={{ width: '100%', background: '#F3F4F6', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                            <div style={{ width: '60%', background: '#10B981', height: '100%' }} />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                          <button onClick={() => { setActiveCourseId(c.id); setPage('classroom'); }} style={{ flex: 1, background: C.sky, color: 'white', fontWeight: 800, fontSize: '11px', padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                            ▶ เริ่มบทเรียนต่อ
                          </button>
                          <button onClick={() => addToast('🏆 ดาวน์โหลดเกียรติบัตร (Certificate) สำเร็จ!', 'success')} style={{ flex: 1, background: '#EFF6FF', color: C.sky, fontWeight: 800, fontSize: '11px', padding: '8px', borderRadius: '8px', border: '1px solid #DBEAFE', cursor: 'pointer' }}>
                            🏆 รับ Certificate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: 0 }}>📝 สมุดบันทึกโน้ตย่อส่วนตัว</h2>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>บันทึกโน้ตสำคัญจากทุกคอร์สที่คุณจดไว้จะแสดงในส่วนนี้เพื่อให้เข้าถึงทบทวนได้ง่าย</p>
              {notes.length === 0 ? (
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                  ยังไม่มีบันทึกโน้ตย่อในขณะนี้
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notes.map(nt => (
                    <div key={nt.id} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', fontSize: '12px', color: '#4B5563', lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 850, color: C.navy, display: 'block', fontSize: '12px' }}>{nt.courseTitle}</span>
                      <span style={{ fontWeight: 800, color: C.sky, display: 'block', fontSize: '11px', marginBottom: '4px' }}>{nt.time}</span>
                      "{nt.text}"
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'support' && (
            <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: C.navy, margin: 0 }}>📞 FAQ และศูนย์ช่วยเหลือ</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { q: 'จะติดต่อแอดมินหรือพี่ต้นได้อย่างไร?', a: 'สามารถสอบถามผ่านช่องทาง Line Official: @inbiologylogy หรือ Inbox เพจ Facebook: inbiologylogy ได้โดยตรง' },
                  { q: 'ดาวน์โหลดใบรับรอง Certificate อย่างไร?', a: 'เมื่อดูบทเรียนในคอร์สนั้นๆ ครบถ้วน 100% ระบบจะขึ้นปุ่มให้กดดาวน์โหลด PDF เกียรติบัตรทันทีบน Dashboard' }
                ].map((f, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #F3F4F6', paddingBottom: '10px' }}>
                    <p style={{ fontWeight: 800, fontSize: '12px', color: '#374151', margin: '0 0 4px' }}>Q: {f.q}</p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: C.fontBody }}>A: {f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, setPage, addToast }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (mode === 'register' && form.password !== form.confirmPassword) {
      addToast('รหัสผ่านไม่ตรงกัน', 'error'); return;
    }
    setLoading(true);
    try {
      const user = await authenticate(mode, {
        email: form.email,
        password: form.password,
        ...(mode === 'register' ? { name: form.name } : {}),
      });
      onLogin(user.role);
      addToast('เข้าสู่ระบบสำเร็จ', 'success');
      setPage(user.role === 'admin' ? 'admin' : 'dashboard');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'ไม่สามารถเข้าสู่ระบบได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' };

  return (
    <div className="login-layout" style={{ minHeight: '100vh', display: 'flex', background: `linear-gradient(135deg, ${C.navy} 0%, ${C.sky} 100%)` }}>
      {/* Left panel info */}
      <div className="login-art" style={{
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
      <div className="login-panel" style={{ flex: 1, maxWidth: '440px', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px' }}>
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
              <input style={inpStyle} type="text" autoComplete="name" required minLength={2} placeholder="ชื่อ นามสกุล" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
          )}
          <div>
            <label style={labelStyle}>อีเมล</label>
            <input style={inpStyle} type="email" autoComplete="email" required placeholder="example@gmail.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>รหัสผ่าน</label>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inpStyle, paddingRight: '44px' }} type={show ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={8} maxLength={128} placeholder="ระบุรหัสผ่านอย่างน้อย 8 ตัว" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {mode === 'register' && (
            <div>
              <label style={labelStyle}>ยืนยันรหัสผ่าน</label>
              <input style={inpStyle} type="password" autoComplete="new-password" required minLength={8} maxLength={128} placeholder="พิมพ์รหัสผ่านอีกครั้ง" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} />
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

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
function AdminDashboard({ courses, setCourses, slides, setSlides, coupons, setCoupons, orders, setOrders, addToast }) {
  const [tab, setTab] = useState('overview');
  const [courseModal, setCourseModal] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [courseForm, setCF] = useState({ title: '', price: '', originalPrice: '', imageUrl: '', tag: '', tagBg: '#EDE9FE', tagColor: '#5B21B6', badge: '', badgeBg: C.red, hours: '', validity: '', ebook: false, description: '', Level: 'ม.4' });

  const [slideModal, setSlideModal] = useState(false);
  const [editSlide, setEditSlide] = useState(null);
  const [slideForm, setSF] = useState({ title: '', desc: '', label: '', badgeText: '', bg1: '#EFF6FF', bg2: '#DBEAFE', imageUrl: '', actionText: '', actionType: 'bundle', targetCourseId: '' });

  const [selCourse, setSelCourse] = useState(courses[0]?.id || '');
  const [lessonForm, setLF] = useState({ title: '', duration: '', videoUrl: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  // Coupon inputs
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', type: 'flat' });
  // Manual enrollment inputs
  const [manualStudent, setManualStudent] = useState({ name: '', courseId: courses[0]?.id || '' });

  const selC = courses.find(c => c.id === selCourse);

  const confirmDeleteCourse = (c) => {
    if (window.confirm(`คุณต้องการลบคอร์ส "${c.title}" ใช่หรือไม่?`)) {
      setCourses(p => p.filter(item => item.id !== c.id));
      addToast('🗑 ลบคอร์สเรียบร้อยแล้ว', 'info');
    }
  };

  const confirmDeleteSlide = (s) => {
    if (window.confirm(`คุณต้องการลบ Banner "${s.title}" ใช่หรือไม่?`)) {
      setSlides(p => p.filter(item => item.id !== s.id));
      addToast('🗑 ลบ Banner เรียบร้อยแล้ว', 'info');
    }
  };

  const confirmDeleteLesson = (l) => {
    if (window.confirm(`คุณต้องการลบบทเรียน "${l.title}" ใช่หรือไม่?`)) {
      setCourses(prev => prev.map(c => c.id === selCourse ? { ...c, lessons: c.lessons.filter(item => item.id !== l.id) } : c));
      addToast('🗑 ลบบทเรียนเรียบร้อยแล้ว', 'info');
    }
  };

  const tabs = [
    { id: 'overview', label: 'ภาพรวมระบบ', icon: <BarChart2 size={14} /> },
    { id: 'courses', label: 'จัดการคอร์สเรียน', icon: <BookOpen size={14} /> },
    { id: 'lessons', label: 'จัดการบทเรียน', icon: <Video size={14} /> },
    { id: 'orders', label: 'ออเดอร์ & การเงิน', icon: <FileSpreadsheet size={14} /> },
    { id: 'coupons', label: 'คูปอง & โปรโมชัน', icon: <Award size={14} /> },
    { id: 'banners', label: 'จัดการ Banner', icon: <Image size={14} /> },
    { id: 'students', label: 'นักเรียน', icon: <Users size={14} /> },
  ];

  const openAddCourse = () => { setCF({ title: '', price: '', originalPrice: '', imageUrl: '', tag: '', tagBg: '#EDE9FE', tagColor: '#5B21B6', badge: '', badgeBg: C.red, hours: '', validity: '', ebook: false, description: '', Level: 'ม.4' }); setEditCourse(null); setCourseModal(true); };
  const openEditCourse = (c) => { setCF({ title: c.title || '', price: String(c.price || ''), originalPrice: String(c.originalPrice || ''), imageUrl: c.imageUrl || '', tag: c.tag || '', tagBg: c.tagBg || '#EDE9FE', tagColor: c.tagColor || '#5B21B6', badge: c.badge || '', badgeBg: c.badgeBg || C.red, hours: String(c.hours || ''), validity: String(c.validity || ''), ebook: !!c.ebook, description: c.description || '', Level: c.Level || 'ม.4' }); setEditCourse(c); setCourseModal(true); };

  const saveCourse = () => {
    if (!courseForm.title || !courseForm.price) { addToast('กรุณากรอกชื่อและราคา', 'error'); return; }
    const d = { ...courseForm, price: +courseForm.price, originalPrice: +courseForm.originalPrice || +courseForm.price, hours: +courseForm.hours || 0, validity: +courseForm.validity || 180 };
    if (editCourse) { setCourses(p => p.map(c => c.id === editCourse.id ? { ...c, ...d } : c)); addToast('✅ อัปเดตคอร์สเรียบร้อย', 'success'); }
    else { setCourses(p => [...p, { id: 'c-' + Date.now(), ...d, lessons: [], rating: 5.0, reviewCount: 0 }]); addToast('✅ เพิ่มคอร์สใหม่เรียบร้อย', 'success'); }
    setCourseModal(false);
  };

  const openAddSlide = () => { setSF({ title: '', desc: '', label: '', badgeText: '', bg1: '#EFF6FF', bg2: '#DBEAFE', imageUrl: '', actionText: '', actionType: 'bundle', targetCourseId: courses[0]?.id || '' }); setEditSlide(null); setSlideModal(true); };
  const openEditSlide = (s) => { setSF({ title: s.title || '', desc: s.desc || '', label: s.label || '', badgeText: s.badgeText || '', bg1: s.bg1 || '#EFF6FF', bg2: s.bg2 || '#DBEAFE', imageUrl: s.imageUrl || '', actionText: s.actionText || '', actionType: s.actionType || 'bundle', targetCourseId: s.targetCourseId || courses[0]?.id || '' }); setEditSlide(s); setSlideModal(true); };

  const saveSlide = () => {
    if (!slideForm.title || !slideForm.actionText) { addToast('กรุณากรอกหัวข้อและปุ่ม', 'error'); return; }
    if (editSlide) { setSlides(p => p.map(s => s.id === editSlide.id ? { ...s, ...slideForm } : s)); addToast('✅ อัปเดต Banner สำเร็จ', 'success'); }
    else { setSlides(p => [...p, { id: 's-' + Date.now(), ...slideForm }]); addToast('✅ เพิ่ม Banner ใหม่สำเร็จ', 'success'); }
    setSlideModal(false);
  };

  const startUpload = () => {
    if (!lessonForm.title || !lessonForm.duration) { addToast('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }
    setUploading(true); setUploadPct(0);
    const iv = setInterval(() => {
      setUploadPct(p => {
        if (p >= 100) {
          clearInterval(iv);
          setUploading(false);
          setCourses(prev => prev.map(c => c.id === selCourse ? { ...c, lessons: [...c.lessons, { id: 'nl-' + Date.now(), title: lessonForm.title, duration: +lessonForm.duration, videoUrl: lessonForm.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4' }] } : c));
          setLF({ title: '', duration: '', videoUrl: '' });
          addToast('✅ เพิ่มบทเรียนเรียบร้อย', 'success');
          return 0;
        }
        return Math.min(p + Math.floor(Math.random() * 20 + 15), 100);
      });
    }, 250);
  };

  const approveOrder = (orderId) => {
    setOrders(p => p.map(o => o.id === orderId ? { ...o, status: 'approved' } : o));
    addToast('✅ อนุมัติสลิปชำระเงินและสิทธิ์เข้าเรียนแล้ว', 'success');
  };

  const handleManualEnroll = (e) => {
    e.preventDefault();
    if (!manualStudent.name.trim()) { addToast('กรุณากรอกชื่อนักเรียน', 'error'); return; }
    const cSelected = courses.find(c => c.id === manualStudent.courseId);
    // Add fake order for history
    const mockOrder = {
      id: `ORD-${Date.now()}`,
      studentName: manualStudent.name,
      courseTitle: cSelected?.title || 'ชีววิทยา',
      price: cSelected?.price || 0,
      date: new Date().toLocaleDateString('th-TH'),
      status: 'approved',
      paymentMethod: 'Manual Enrollment'
    };
    setOrders(p => [mockOrder, ...p]);
    addToast(`🎓 ลงทะเบียนเรียน "${cSelected?.title}" ให้คุณ ${manualStudent.name} แล้ว`, 'success');
    setManualStudent(p => ({ ...p, name: '' }));
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) { addToast('กรุณากรอกข้อมูลโค้ดและส่วนลด', 'error'); return; }
    const codeUpper = newCoupon.code.trim().toUpperCase();
    if (coupons.find(c => c.code.toUpperCase() === codeUpper)) { addToast('โค้ดนี้มีอยู่ในระบบแล้ว', 'error'); return; }
    setCoupons(p => [...p, { code: codeUpper, discount: +newCoupon.discount, type: newCoupon.type }]);
    addToast(`🎫 เพิ่มคูปองโค้ด "${codeUpper}" เรียบร้อยแล้ว`, 'success');
    setNewCoupon({ code: '', discount: '', type: 'flat' });
  };

  const deleteCoupon = (code) => {
    setCoupons(p => p.filter(c => c.code !== code));
    addToast('🗑 ลบคูปองส่วนลดเรียบร้อยแล้ว', 'info');
  };

  const inpStyle = { width: '100%', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '8px 12px', fontSize: '12px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px' };

  return (
    <div className="admin-container" style={{ background: C.page, paddingTop: '70px' }}>
      {/* Admin Sidebar */}
      <aside className="admin-sidebar" style={{ width: '220px', background: C.navy, position: 'fixed', top: '70px', left: 0, bottom: 0, display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        <nav style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px',
              fontSize: '12px', fontWeight: 800, cursor: 'pointer', border: 'none', textAlign: 'left', transition: 'all 0.15s',
              background: tab === t.id ? C.sky : 'transparent', color: 'white'
            }}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Admin main content panel */}
      <main className="admin-main" style={{ flex: 1, marginLeft: '220px', padding: '24px', maxWidth: 'calc(100% - 220px)' }}>
        <div style={{ maxWidth: '950px' }}>
          {tab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: C.navy, margin: 0 }}>ภาพรวมระบบวิเคราะห์ข้อมูล</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
                {[
                  { label: 'คอร์สทั้งหมด', value: courses.length, unit: 'คอร์ส', bg: '#EFF6FF', color: C.sky },
                  { label: 'นักเรียนสะสม', value: '12,500 คน', unit: 'ลงทะเบียน', bg: '#FEF2F2', color: C.red },
                  { label: 'ยอดขายสะสม', value: `฿${formatPrice(orders.reduce((s, o) => s + o.price, 0) + 49500)}`, unit: 'บาท', bg: '#F0FDF4', color: '#10B981' },
                  { label: 'คูปองใช้งานอยู่', value: coupons.length, unit: 'โค้ดส่วนลด', bg: '#FFFBEB', color: '#D97706' }
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: '16px', padding: '16px', border: '1px solid #E5E7EB' }}>
                    <p style={{ fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', margin: '0 0 6px' }}>{s.label}</p>
                    <p style={{ fontSize: '20px', fontWeight: 950, color: s.color, margin: '0 0 2px' }}>{s.value}</p>
                    <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>{s.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'courses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการคอร์สเรียนชีวะ</h2>
                <button onClick={openAddCourse} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + เพิ่มคอร์สใหม่
                </button>
              </div>
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>{['วิชา', 'ระดับชั้น', 'ราคาพิเศษ', 'จัดการ'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: '#6B7280' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.navy }}>{c.title}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.Level}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: C.red }}>฿{formatPrice(c.price)}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" aria-label={`แก้ไขคอร์ส ${c.title}`} onClick={() => openEditCourse(c)} style={{ background: '#EFF6FF', border: 'none', padding: '6px', borderRadius: '6px', color: C.sky, cursor: 'pointer' }}><Edit size={12} /></button>
                            <button type="button" aria-label={`ลบคอร์ส ${c.title}`} onClick={() => confirmDeleteCourse(c)} style={{ background: '#FEF2F2', border: 'none', padding: '6px', borderRadius: '6px', color: C.red, cursor: 'pointer' }}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'lessons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการรายละเอียดบทเรียน</h2>
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>เลือกคอร์สเพื่อจัดระเบียบ</label>
                  <select value={selCourse} onChange={e => setSelCourse(e.target.value)} style={{ ...inpStyle, background: 'white' }}>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                {selC?.lessons.map((l, idx) => (
                  <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB', padding: '10px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>บทที่ {idx + 1}: {l.title}</span>
                    <button onClick={() => confirmDeleteLesson(l)} style={{ color: C.red, background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                  </div>
                ))}
                <div style={{ borderTop: '1.5px solid #F3F4F6', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h4 style={{ fontWeight: 800, fontSize: '12px', color: C.navy, margin: 0 }}>+ เพิ่มคลิปบทเรียนใหม่</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                      <input type="text" placeholder="ชื่อบทเรียน" value={lessonForm.title} onChange={e => setLF(p => ({ ...p, title: e.target.value }))} style={inpStyle} />
                      <input type="number" placeholder="ความยาว (นาที)" value={lessonForm.duration} onChange={e => setLF(p => ({ ...p, duration: e.target.value }))} style={inpStyle} />
                    </div>
                    <input type="text" placeholder="URL ลิงก์วิดีโอ (เช่น https://example.com/video.mp4 หรือ YouTube)" value={lessonForm.videoUrl || ''} onChange={e => setLF(p => ({ ...p, videoUrl: e.target.value }))} style={inpStyle} />
                  </div>
                  <button onClick={startUpload} disabled={uploading} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                    {uploading ? `กำลังอัปโหลดวิดีโอ (${uploadPct}%)` : 'ยืนยันอัปโหลดวิดีโอเข้าบทเรียน'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>ตรวจสอบสลิปและยืนยันคำสั่งซื้อ</h2>
              </div>

              {/* Table of Orders */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>
                      {['ออเดอร์', 'ชื่อนักเรียน', 'วิชา', 'ยอดเงิน', 'ช่องทาง', 'สถานะ', 'อนุมัติ'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: '#6B7280' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700 }}>{o.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{o.studentName}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: C.navy }}>{o.courseTitle}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: C.red }}>฿{formatPrice(o.price)}</td>
                        <td style={{ padding: '12px 16px', color: '#6B7280' }}>{o.paymentMethod}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            background: o.status === 'approved' ? '#D1FAE5' : '#FEF2F2',
                            color: o.status === 'approved' ? '#065F46' : '#991B1B',
                            padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 850
                          }}>
                            {o.status === 'approved' ? 'ชำระเงินสำเร็จ' : 'รอตรวจสอบสลิป'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {o.status === 'pending' ? (
                            <button onClick={() => approveOrder(o.id)} style={{ background: C.sky, color: 'white', fontSize: '10px', fontWeight: 800, padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                              อนุมัติ
                            </button>
                          ) : (
                            <span style={{ color: '#9CA3AF', fontSize: '11px' }}>อนุมัติแล้ว</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Manual enrollment form */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 900, color: C.navy, margin: '0 0 14px' }}>ลงทะเบียนเรียนให้นักเรียนแบบแมนนวล (Manual Roll)</h3>
                <form onSubmit={handleManualEnroll} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>ชื่อ-นามสกุล นักเรียน</label>
                    <input type="text" placeholder="ชื่อ นามสกุล นักเรียน" value={manualStudent.name} onChange={e => setManualStudent(p => ({ ...p, name: e.target.value }))} style={inpStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>เลือกคอร์สเรียน</label>
                    <select value={manualStudent.courseId} onChange={e => setManualStudent(p => ({ ...p, courseId: e.target.value }))} style={{ ...inpStyle, background: 'white' }}>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <button type="submit" style={{ background: C.navy, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    เพิ่มสิทธิ์เข้าเรียนทันที
                  </button>
                </form>
              </div>
            </div>
          )}

          {tab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการคูปองและโปรโมชันส่วนลด</h2>

              {/* Create new coupon */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 900, color: C.navy, margin: '0 0 14px' }}>+ สร้างโค้ดคูปองส่วนลดใหม่</h3>
                <form onSubmit={handleAddCoupon} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={labelStyle}>โค้ดส่วนลด (เช่น NEWBIO200)</label>
                    <input type="text" placeholder="เช่น SUMMERSALE" value={newCoupon.code} onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value }))} style={inpStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>ประเภทส่วนลด</label>
                    <select value={newCoupon.type} onChange={e => setNewCoupon(p => ({ ...p, type: e.target.value }))} style={{ ...inpStyle, background: 'white' }}>
                      <option value="flat">ลดระบุจำนวนบาท (฿)</option>
                      <option value="percent">ลดระบุเปอร์เซ็นต์ (%)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>มูลค่าส่วนลด</label>
                    <input type="number" placeholder="เช่น 200" value={newCoupon.discount} onChange={e => setNewCoupon(p => ({ ...p, discount: e.target.value }))} style={inpStyle} />
                  </div>
                  <button type="submit" style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                    + บันทึกเพิ่มคูปอง
                  </button>
                </form>
              </div>

              {/* Coupons List */}
              <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <tr>
                      {['โค้ดส่วนลด', 'ประเภท', 'มูลค่า', 'การจัดการ'].map(h => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 800, color: '#6B7280' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.code} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 850, color: C.navy }}>{c.code}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.type === 'percent' ? 'ลดเป็นเปอร์เซ็นต์ (%)' : 'ลดมูลค่าคงที่ (฿)'}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 900, color: '#10B981' }}>
                          {c.type === 'percent' ? `${c.discount}%` : `฿${formatPrice(c.discount)}`}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button onClick={() => deleteCoupon(c.code)} style={{ background: '#FEF2F2', border: 'none', padding: '6px 10px', borderRadius: '6px', color: C.red, cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                            ลบโค้ด
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 950, color: C.navy, margin: 0 }}>จัดการ Banner และ Flash Sale</h2>
                <button onClick={openAddSlide} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  + เพิ่ม Banner ใหม่
                </button>
              </div>
              {slides.map(s => (
                <div key={s.id} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ background: C.skyLight, color: C.sky, fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>{s.label}</span>
                    <h4 style={{ fontWeight: 800, color: C.navy, fontSize: '13px', margin: '6px 0 2px' }}>{s.title}</h4>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{s.desc}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEditSlide(s)} style={{ background: '#EFF6FF', color: C.sky, border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                      แก้ไข
                    </button>
                    <button onClick={() => confirmDeleteSlide(s)} style={{ background: '#FEF2F2', color: C.red, border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal isOpen={courseModal} onClose={() => setCourseModal(false)} title={editCourse ? 'แก้ไขคอร์สเรียน' : 'เพิ่มคอร์สใหม่'} wide>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle} htmlFor="course-title">ชื่อคอร์ส</label>
                <input id="course-title" type="text" value={courseForm.title} onChange={e => setCF(p => ({ ...p, title: e.target.value }))} style={inpStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px' }}>
                <div>
                  <label style={labelStyle} htmlFor="course-price">ราคาขาย</label>
                  <input id="course-price" type="number" min="0" value={courseForm.price} onChange={e => setCF(p => ({ ...p, price: e.target.value }))} style={inpStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="course-original-price">ราคาเต็ม</label>
                  <input id="course-original-price" type="number" min="0" value={courseForm.originalPrice} onChange={e => setCF(p => ({ ...p, originalPrice: e.target.value }))} style={inpStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="course-level">ระดับชั้น</label>
                  <input id="course-level" type="text" value={courseForm.Level} onChange={e => setCF(p => ({ ...p, Level: e.target.value }))} style={inpStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle} htmlFor="course-image">URL รูปปก</label>
                <input id="course-image" type="url" value={courseForm.imageUrl} onChange={e => setCF(p => ({ ...p, imageUrl: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="course-description">รายละเอียด</label>
                <textarea id="course-description" rows={4} value={courseForm.description} onChange={e => setCF(p => ({ ...p, description: e.target.value }))} style={{ ...inpStyle, resize: 'vertical' }} />
              </div>
              <button type="button" onClick={saveCourse} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                บันทึกข้อมูลคอร์ส
              </button>
            </div>
          </Modal>

          {/* Modal Slide / Banner Edit */}
          <Modal isOpen={slideModal} onClose={() => setSlideModal(false)} title={editSlide ? 'แก้ไข Banner' : 'เพิ่ม Banner ใหม่'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>หัวข้อ Banner (Title)</label>
                <input type="text" placeholder="เช่น Flash Sale ลดพิเศษ 50%" value={slideForm.title} onChange={e => setSF(p => ({ ...p, title: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>รายละเอียด (Description)</label>
                <input type="text" placeholder="เช่น เฉพาะ 100 ท่านแรกเท่านั้น" value={slideForm.desc} onChange={e => setSF(p => ({ ...p, desc: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>ป้ายกำกับ (Label)</label>
                <input type="text" placeholder="เช่น 🔥 FLASH SALE" value={slideForm.label} onChange={e => setSF(p => ({ ...p, label: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>ข้อความปุ่ม Action</label>
                <input type="text" placeholder="เช่น สมัครเลย" value={slideForm.actionText} onChange={e => setSF(p => ({ ...p, actionText: e.target.value }))} style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>คอร์สที่เชื่อมโยง</label>
                <select value={slideForm.targetCourseId} onChange={e => setSF(p => ({ ...p, targetCourseId: e.target.value }))} style={{ ...inpStyle, background: 'white' }}>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <button onClick={saveSlide} style={{ marginTop: '10px', width: '100%', background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
                บันทึกข้อมูล Banner
              </button>
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LandingPage({ courses, slides, addToast, setPage, enrolledIds, onAddToCart, onViewDetails, onTrial }) {
  const [selectedReview, setSelectedReview] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, username: '@blvckharrt', hasBadge: true, text: 'ลง IG เรียบร้อย', time: '2 เดือนที่แล้ว', likes: 510, avatar: 'B', color: '#ff5722' },
    { id: 2, username: '@chertamp_st', hasBadge: false, text: 'เพลงช่วยจำของพี่ต้นปั่นจริงครับ แต่ช่วยชีวิตตอนเข้าห้องสอบสุดๆ 😂', time: '1 สัปดาห์ที่แล้ว', likes: 42, avatar: 'C', color: '#e91e63' },
    { id: 3, username: '@pp_patty', hasBadge: false, text: 'ชีวะที่เคยคิดว่ายาก พอลงเรียนกับพี่ต้นแล้วเข้าใจขึ้นเยอะเลยค่ะ ไม่ต้องท่องฝืนๆ อีกต่อไป', time: '3 วันที่แล้ว', likes: 19, avatar: 'P', color: '#9c27b0' },
    { id: 4, username: '@keng_vet', hasBadge: true, text: 'สอวน. ค่าย 1 เจอกันครับ! คอร์ส 100 ข้อ ละเอียดและเฉลยตรงประเด็นดีมาก', time: '5 ชั่วโมงที่แล้ว', likes: 8, avatar: 'K', color: '#3f51b5' }
  ]);

  // Simulated live comment updates
  useEffect(() => {
    const mockFeed = [
      { username: '@nong_ploy', text: 'คอร์ส 99 บาท ราคาดีแต่เนื้อหาจัดเต็มสุดๆ คุ้มเกินราคาไปไกลมากกก 💖', avatar: 'P', color: '#009688' },
      { username: '@nutcha_st', text: 'เรียนสนุกมากกกก ไม่เคยเรียนชีวะแล้วหัวเราะหนักขนาดนี้มาก่อนเลย 5555', avatar: 'N', color: '#4caf50' },
      { username: '@boss_biology', text: 'เนื้อหา A-Level ชีวะปีนี้เน้นวิเคราะห์เยอะมาก ใครยังไม่แม่นแนะนำคอร์สพี่ต้นเลยครับ 👍', avatar: 'B', color: '#ff9800' },
      { username: '@mint_study', text: 'แอดมินตอบคำถามและช่วยเหลือดีมากค่ะ แนะนำช่องทางการจ่ายเงินละเอียดดีมาก', avatar: 'M', color: '#795548' },
      { username: '@ton_fanclub', text: 'อยากได้คอร์สสรุปพันธุศาสตร์เพิ่มจังเลยครับพี่ต้น ยิ่งเรียนยิ่งมันส์!', avatar: 'T', color: '#607d8b' }
    ];

    let feedIndex = 0;
    const interval = setInterval(() => {
      if (feedIndex < mockFeed.length) {
        const comment = mockFeed[feedIndex];
        setComments(prev => [
          {
            id: Date.now(),
            username: comment.username,
            hasBadge: Math.random() > 0.6,
            text: comment.text,
            time: 'เมื่อครู่',
            likes: Math.floor(Math.random() * 5),
            avatar: comment.avatar,
            color: comment.color
          },
          ...prev
        ]);
        feedIndex++;
      } else {
        clearInterval(interval);
      }
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setComments(prev => [
      {
        id: Date.now(),
        username: '@witsarut.st',
        hasBadge: false,
        text: commentInput,
        time: 'เมื่อครู่',
        likes: 0,
        avatar: 'W',
        color: '#b91c1c'
      },
      ...prev
    ]);
    setCommentInput('');
    addToast('💬 แสดงความคิดเห็นเรียบร้อยแล้ว', 'success');
  };

  return (
    <div style={{ background: C.page, minHeight: '100vh' }}>
      <HeroSection courses={courses} onStart={() => {
        const el = document.getElementById('trial');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else setPage('courses');
      }} onView={() => setPage('courses')} />
      <PromoCarousel slides={slides} courses={courses} onAddToCart={onAddToCart} enrolledIds={enrolledIds} addToast={addToast} onViewDetails={onViewDetails} setPage={setPage} />

      {/* Biology Categories Section */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>🧬 หมวดหมู่เนื้อหาและบทเรียนชีวะ</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', fontFamily: C.fontBody }}>เจาะลึกบทเรียนครอบคลุมทุกระบบชีววิทยาตามเกณฑ์สอบใหม่ล่าสุด</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <div key={i} onClick={() => setPage('courses')} style={{
                background: 'white', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px',
                textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
                transition: 'all 0.25s'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(185,28,28,0.08)'; e.currentTarget.style.borderColor = C.navy; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.01)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>{cat.emoji}</span>
                <span style={{ fontSize: '12px', fontWeight: 850, color: C.navy }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Courses Grid */}
      <section style={{ padding: '40px 24px', background: 'white', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <p style={{ color: C.sky, fontSize: '16px', fontWeight: 850, margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} color={C.red} /> คอร์สเรียนแนะนำสูงสุด</p>
              <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>คอร์สเรียนชีววิทยาพรีเมียมโดย พี่ต้น</h2>
            </div>
            <button onClick={() => setPage('courses')} style={{
              display: 'flex', alignItems: 'center', gap: '6px', color: C.red, fontSize: '15px', fontWeight: 850,
              cursor: 'pointer', background: 'white', border: `2px solid ${C.red}`, padding: '8px 18px', borderRadius: '999px',
              transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(239,68,68,0.1)'
            }}
              onMouseOver={e => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = C.red; }}>
              ดูคอร์สทั้งหมด <ChevronRight size={18} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
            {courses.slice(0, 4).map(c => (
              <CourseCard key={c.id} course={c} enrolled={enrolledIds.includes(c.id)} onAddToCart={onAddToCart} onViewDetails={onViewDetails} onTrial={onTrial} />
            ))}
          </div>
        </div>
      </section>

      {/* Trial free lessons */}
      <section id="trial" style={{ padding: '50px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ color: C.red, fontSize: '12px', fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase' }}>▶ Free Video Preview</p>
            <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>คลังวิดีโอและบทเรียนทดลองเรียนฟรี</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {FREE_TRIALS.map(ft => (
              <div key={ft.id} onClick={() => onTrial(ft)} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', transition: 'all 0.25s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.02)'; }}>
                <div style={{ position: 'relative', overflow: 'hidden', height: '180px', background: 'linear-gradient(to bottom, #F8FAFC, #E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                  <img src={ft.imageUrl} alt={ft.title} loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', boxShadow: '0 4px 10px rgba(15,23,42,0.08)' }} />
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: '10px', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', backdropFilter: 'blur(4px)', zIndex: 2 }}>{ft.duration}</div>
                </div>
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: C.sky, display: 'block', marginBottom: '4px' }}>{ft.course}</span>
                  <h4 style={{ fontWeight: 850, color: C.navy, fontSize: '13px', margin: 0, lineHeight: 1.4 }}>{ft.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog & Articles */}
      <section style={{ padding: '50px 24px', background: 'white', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: 0 }}>📖 คลังความรู้และสรุปบทความชีวะ</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', fontFamily: C.fontBody }}>สรุปทริคจำชีววิทยา บทวิเคราะห์แล็บ และข่าวสารวิชาการชีววิทยาที่ห้ามพลาด</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {ARTICLES.map(art => (
              <div key={art.id} onClick={() => setPage('blog')} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', cursor: 'pointer' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: C.sky, display: 'block', marginBottom: '6px' }}>{art.date}</span>
                <h4 style={{ fontSize: '14px', fontWeight: 850, color: C.navy, margin: '0 0 10px', lineHeight: 1.4 }}>{art.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF', fontWeight: 700 }}>
                  <span>🔍 {art.views} ยอดอ่าน</span>
                  <span>⏳ ใช้เวลาอ่าน {art.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews from students */}
      <section style={{ padding: '60px 24px', background: C.page, borderTop: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', marginBottom: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 950, color: C.navy, margin: 0 }}>
              ⭐ รีวิวและความประทับใจของน้องๆ รุ่นพี่
            </h2>
            <p style={{ fontSize: '14px', color: C.textMuted, marginTop: '6px', fontFamily: C.fontBody }}>ความรู้สึกจากน้องๆ ที่ร่วมเรียนและประสบความสำเร็จกับพี่ต้น</p>
          </div>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {REVIEWS.concat(REVIEWS).concat(REVIEWS).map((r, i) => (
              <div
                key={i}
                className="review-card-container review-card-container-wide"
                onClick={() => setSelectedReview(r)}
                style={{ cursor: 'pointer' }}
              >
                {/* Tan Image Backdrop like Image 1 */}
                <div className="student-image-box">
                  <img src={r.avatar} alt={r.name} loading="lazy" style={{ objectPosition: r.imagePosition || "center top" }} />
                </div>

                {/* Name, School and got into details */}
                <div style={{ textAlign: 'center', marginTop: '14px', width: '100%' }}>
                  <h3 className="review-student-name">
                    {r.name}
                  </h3>
                  <p className="review-school">
                    {r.school}
                  </p>
                  <p className="review-score">
                    {r.score}
                  </p>
                </div>

                {/* Quote review */}
                <p className="review-text-quote" style={{ fontFamily: C.fontBody }}>
                  "{r.text}"
                </p>

                {/* Click pill button */}
                <button
                  className="review-click-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReview(r);
                  }}
                >
                  อ่านต่อ
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Review details modal popup */}
        {selectedReview && (
          <Modal isOpen={!!selectedReview} onClose={() => setSelectedReview(null)} title={`รีวิวจาก ${selectedReview.name}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px', padding: '10px 0' }}>
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#DEC8B3',
                border: '3px solid #B91C1C',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                <img src={selectedReview.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: selectedReview.imagePosition || 'center top' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#B91C1C', margin: '0 0 4px', fontSize: '18px', fontWeight: 900 }}>{selectedReview.name}</h3>
                <p style={{ color: '#1E3A8A', fontWeight: 800, fontSize: '13px', margin: '4px 0' }}>{selectedReview.school}</p>
                <span style={{ background: '#FEE2E2', color: '#B91C1C', fontSize: '11px', fontWeight: 850, padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(185,28,28,0.1)', display: 'inline-block', marginTop: '6px' }}>
                  {selectedReview.score}
                </span>
              </div>
              <div style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                padding: '20px',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <p style={{ color: '#374151', fontSize: '13.5px', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line', fontFamily: C.fontBody }}>
                  "{selectedReview.text}"
                </p>
              </div>
              <div style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#6B7280', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📚 คอร์สเรียน:</span>
                <span style={{ color: '#1E3A8A' }}>{selectedReview.course}</span>
              </div>
            </div>
          </Modal>
        )}
      </section>

      {/* YouTube Style Comments Section */}
      <section style={{ padding: '60px 24px', background: '#0F0F0F', borderTop: '1px solid #1F1F1F', borderBottom: '1px solid #1F1F1F' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #272727', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              💬 การพูดคุยเรียลไทม์ ({comments.length} ความคิดเห็น)
            </h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }}></span> Live Chatting
            </span>
          </div>

          {/* Comment Input Form */}
          <form onSubmit={handlePostComment} className="youtube-input-area" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <div className="youtube-avatar" style={{ background: '#b91c1c' }}>W</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="เพิ่มความคิดเห็นสาธารณะ..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="youtube-input"
              />
              {commentInput.trim() && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" onClick={() => setCommentInput('')} style={{ background: 'none', border: 'none', color: '#aaaaaa', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', padding: '8px 16px', borderRadius: '18px' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'none'}>ยกเลิก</button>
                  <button type="submit" className="youtube-comment-btn">แสดงความคิดเห็น</button>
                </div>
              )}
            </div>
          </form>

          {/* Comments Feed List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(commentsExpanded ? comments : comments.slice(0, 3)).map((comment) => (
              <div key={comment.id} className="youtube-comment-item">
                <div className="youtube-avatar" style={{ background: comment.color || '#303030' }}>
                  {comment.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="youtube-username">
                    {comment.username}
                    {comment.hasBadge && (
                      <span className="youtube-username-badge" title="ผู้ใช้ที่ยืนยันแล้ว">✓</span>
                    )}
                    <span className="youtube-time">{comment.time}</span>
                  </div>
                  <p className="youtube-text">{comment.text}</p>
                  <div className="youtube-actions">
                    <button className="youtube-action-btn">
                      <span>👍</span> {comment.likes}
                    </button>
                    <button className="youtube-action-btn">
                      <span>👎</span>
                    </button>
                    <button className="youtube-action-btn" style={{ fontWeight: 'bold' }}>ตอบกลับ</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length > 3 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setCommentsExpanded(!commentsExpanded)}
                style={{
                  background: 'none',
                  border: '1px solid #303030',
                  color: '#FFFFFF',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1F1F1F'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {commentsExpanded ? 'ย่อความคิดเห็น' : `ดูความคิดเห็นทั้งหมด (${comments.length} รายการ)`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section like Image 3 but only IG, TikTok, Line */}
      <section style={{ padding: '70px 24px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#111827', margin: 0, fontFamily: C.fontHeading }}>
              ช่องทาง<span style={{ color: '#EC4899', background: 'linear-gradient(to right, #EC4899, #F43F5E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>การติดตาม</span>
            </h2>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#1E3A8A', marginTop: '8px', letterSpacing: '0.1em' }}>CONNECT WITH US</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Instagram Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Instagram Gradient Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 32 32" style={{ width: '64px', height: '64px' }}>
                  <defs>
                    <radialGradient id="ig-grad-32" cx="30%" cy="107%" r="130%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="32" height="32" rx="7" fill="url(#ig-grad-32)" />
                  <g transform="translate(4, 4)">
                    <rect x="1" y="1" width="22" height="22" rx="6" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2" />
                    <circle cx="18" cy="6" r="1.5" fill="white" />
                  </g>
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#374151' }}>ติดตามข่าวสาร</span>
              <a href="https://www.instagram.com/inbiology_/" target="_blank" rel="noopener noreferrer" style={{ width: '100%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', textDecoration: 'none', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(220,39,67,0.25)', textAlign: 'center' }}>
                @INBIOLOGY_
              </a>
            </div>

            {/* Line Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* Line Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src="/social_line.png" alt="LINE Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 850, color: '#374151' }}>ติดตามข่าวสาร</span>
              <a href="https://line.me/ti/p/@inbiology" target="_blank" rel="noopener noreferrer" style={{ width: '100%', background: '#06C755', color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', textDecoration: 'none', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(6,199,85,0.25)', textAlign: 'center' }}>
                @INBIOLOGY
              </a>
            </div>

            {/* TikTok Card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #F3F4F6', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.03)'; }}>
              {/* TikTok Logo */}
              <div style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#010101' }}>
                  <img src="/social_tiktok.png" alt="TikTok Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.57)' }} />
                </div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 850, color: '#374151' }}>ติดตามข่าวสาร</span>
              <a href="https://www.tiktok.com/@tonnarabbit?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ width: '100%', background: '#010101', color: 'white', fontWeight: 800, fontSize: '13px', padding: '12px', borderRadius: '12px', border: 'none', textDecoration: 'none', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(1,1,1,0.25)', textAlign: 'center' }}>
                @ครูต้นInbiology
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0B1329', padding: '48px 24px 24px', color: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <img src="/logo.png" alt="INBIOLOGY Logo" style={{ height: '44px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.2))' }} />
                <span style={{ fontWeight: 900, fontSize: '22px' }}>INBIOLOGY</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: 1.6, margin: 0, fontFamily: C.fontBody }}>
                แพลตฟอร์มติวชีววิทยาออนไลน์อันดับ 1 สำหรับน้องๆ ม.ปลาย และเตรียมตัวสอบเข้ามหาวิทยาลัย สอนโดยพี่ต้น เกียรตินิยมอันดับ 1
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>ช่องทางติดต่อเรา</h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 6px' }}>✉️ inbiology.academy@gmail.com</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 6px' }}> Line ID: @inbiology</p>
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '13px', marginBottom: '12px' }}>นโยบายและสิทธิ์</h4>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '0 0 6px' }}>เงื่อนไขการใช้งานระบบ</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>นโยบายความเป็นส่วนตัว</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: 0 }}>© 2026 INBIOLOGY Academy (by พี่ต้น). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GUIDE PAGE
// ─────────────────────────────────────────────────────────────────────────────
function GuidePage({ setPage }) {
  const sections = [
    {
      icon: '🏠', title: 'หน้าแรก (Landing Page)',
      desc: 'หน้าแรกของ INBIOLOGY แสดงคอร์สแนะนำ, ตัวอย่างบทเรียนฟรี, บทความ, และรีวิวจากนักเรียน กดปุ่ม "เริ่มเรียนฟรี" เพื่อเลื่อนไปยังส่วนวิดีโอทดลองเรียนได้เลย',
      steps: ['กดปุ่ม "เริ่มเรียนฟรี" → เลื่อนดูวิดีโอตัวอย่างบทเรียนฟรี', 'กดปุ่ม "ดูคอร์สทั้งหมด" → ไปยังหน้าคอร์สเรียน', 'คลิกที่บัตรคอร์สเพื่อดูรายละเอียดคอร์สนั้น']
    },
    {
      icon: '📚', title: 'คอร์สเรียน',
      desc: 'คลังคอร์สชีววิทยาทั้งหมด มีตัวกรอง ค้นหาคอร์สได้ตามระดับ/หัวข้อ',
      steps: ['กดที่บัตรคอร์ส → ดูรายละเอียดเนื้อหาบทเรียน', 'กดปุ่ม "เพิ่มลงตะกร้า" → ไปกดชำระเงินในไอคอนตะกร้า (มุมขวาบน)', 'กดปุ่ม "ทดลองเรียนฟรี" → ดูวิดีโอตัวอย่างของคอร์สนั้น']
    },
    {
      icon: '🎓', title: 'ห้องเรียนจำลอง (Classroom)',
      desc: 'เรียนบทเรียนพร้อมวิดีโอ, จดบันทึกโน้ตย่อ, ถาม AI Biologist, และดูสรุป 3D Model',
      steps: ['เลือกบทเรียนจากแถบซ้าย → วิดีโอจะเปลี่ยนอัตโนมัติ', 'กดแท็บ "📝 โน้ตย่อ" → พิมพ์จดโน้ตแล้วกด บันทึกโน้ตย่อ', 'กดแท็บ "AI Biologist" → ถามคำถามชีวะได้เลย', 'โน้ตที่จดจะซิงค์ไปยัง Dashboard → แท็บ "สมุดบันทึก"']
    },
    {
      icon: '🏆', title: 'คลังข้อสอบ (Exam Center)',
      desc: 'ทำข้อสอบจำลองชีววิทยา A-Level พร้อมระบบนับเวลา 2 นาที',
      steps: ['กดปุ่ม "เริ่มทำข้อสอบ" → ระบบนับถอยหลัง 120 วินาที', 'เลือกคำตอบจากตัวเลือก ABCD → กดส่งเมื่อครบ', 'ระบบจะแสดงคะแนนและเฉลยคำตอบที่ถูกต้อง']
    },
    {
      icon: '👤', title: 'แดชบอร์ดนักเรียน',
      desc: 'ดูความก้าวหน้า, โน้ตย่อสะสม, และศูนย์ช่วยเหลือส่วนตัว',
      steps: ['แท็บ "คอร์สเรียนของฉัน" → ดูคอร์สที่ซื้อและความก้าวหน้า', 'แท็บ "สมุดบันทึกโน้ตย่อ" → ดูโน้ตที่จดจากห้องเรียน', 'แท็บ "ศูนย์ช่วยเหลือ FAQ" → คำถามที่พบบ่อยและช่องทางติดต่อ']
    },
    {
      icon: '🛒', title: 'ตะกร้าและชำระเงิน',
      desc: 'เพิ่มคอร์สลงตะกร้าและชำระผ่านระบบ PromptPay',
      steps: ['กดไอคอน 🛒 บนแถบบน → เปิด Drawer ตะกร้า', 'พิมพ์โค้ดคูปองแล้วกด ใช้คูปอง (ตัวอย่าง: INBIOLOGY100)', 'กดปุ่ม ดำเนินการชำระเงิน → กดยืนยันการชำระ']
    },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '100px', paddingBottom: '60px', background: C.page }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button onClick={() => setPage('landing')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
            onMouseOver={e => e.currentTarget.style.color = '#374151'}
            onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>
            <ChevronLeft size={15} /> กลับหน้าหลัก
          </button>
          <h1 style={{ fontSize: '30px', fontWeight: 950, color: C.navy, margin: '0 0 8px', lineHeight: 1.1 }}>📖 คู่มือการใช้งาน INBIOLOGY</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0, fontFamily: C.fontBody }}>เรียนรู้วิธีใช้ระบบ INBIOLOGY Academy อย่างมืออาชีพตั้งแต่ต้น</p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((s, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{s.icon}</span>
                <h2 style={{ fontSize: '16px', fontWeight: 900, color: C.navy, margin: 0 }}>{s.title}</h2>
              </div>
              <p style={{ fontSize: '13px', color: '#4B5563', margin: '0 0 12px', fontFamily: C.fontBody, lineHeight: 1.7 }}>{s.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {s.steps.map((step, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ background: C.navy, color: 'white', fontSize: '10px', fontWeight: 900, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{j + 1}</span>
                    <p style={{ fontSize: '12px', color: '#374151', margin: 0, lineHeight: 1.6, fontFamily: C.fontBody }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ background: `linear-gradient(135deg,${C.navy},${C.sky})`, borderRadius: '20px', padding: '28px', textAlign: 'center', color: 'white', marginTop: '24px' }}>
          <h3 style={{ fontWeight: 900, fontSize: '16px', margin: '0 0 8px' }}>🤝 ยังมีข้อสงสัยเพิ่มเติม?</h3>
          <p style={{ fontSize: '13px', margin: '0 0 16px', opacity: 0.8, fontFamily: C.fontBody }}>ติดต่อพี่ต้นได้โดยตรงผ่านช่องทางด้านล่าง</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ l: 'LINE: @inbiologylogy', c: '#10B981' }, { l: 'Facebook: /inbiologylogy', c: '#3B82F6' }].map(b => (
              <span key={b.l} style={{ background: 'rgba(255,255,255,0.15)', padding: '8px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 800 }}>{b.l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function SettingsPage({ setPage, darkMode, setDarkMode, lang, setLang, addToast, userRole }) {
  const [fontSize, setFontSize] = useState('medium');
  const [toastNotif, setToastNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [courseReminder, setCourseReminder] = useState(true);
  const [examAlert, setExamAlert] = useState(true);
  const [videoSpeed, setVideoSpeed] = useState('1');
  const [autoPlay, setAutoPlay] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  useEffect(() => {
    setFontSize(localStorage.getItem('inbiology_fontsize') || 'medium');
    setVideoSpeed(localStorage.getItem('inbiology_videospeed') || '1');
    setSettingsHydrated(true);
  }, []);

  // Apply font size to root
  useEffect(() => {
    const sizes = { small: '13px', medium: '15px', large: '17px' };
    document.documentElement.style.setProperty('--app-font-size', sizes[fontSize] || '15px');
    if (settingsHydrated) localStorage.setItem('inbiology_fontsize', fontSize);
  }, [fontSize, settingsHydrated]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) document.documentElement.classList.add('high-contrast');
    else document.documentElement.classList.remove('high-contrast');
  }, [highContrast]);

  const sectionStyle = { background: 'white', border: '1px solid #E5E7EB', borderRadius: '20px', padding: '24px', marginBottom: '16px' };
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #F3F4F6' };
  const lastRowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0' };
  const labelStyle = { fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 };
  const subStyle = { fontSize: '11px', color: '#9CA3AF', marginTop: '3px', fontFamily: C.fontBody, margin: 0 };

  const Toggle = ({ on, onToggle, color }) => (
    <button onClick={onToggle} style={{
      display: 'inline-flex', alignItems: 'center', background: on ? (color || C.navy) : '#D1D5DB',
      borderRadius: '999px', width: '44px', height: '24px', padding: '3px',
      border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
    }}>
      <span style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
    </button>
  );

  const SectionHeader = ({ title, sub }) => (
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 900, color: C.navy, margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '3px 0 0', fontFamily: C.fontBody }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', paddingTop: '100px', paddingBottom: '60px', background: C.page }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => setPage('landing')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontSize: '12px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', marginBottom: '16px' }}
            onMouseOver={e => e.currentTarget.style.color = '#374151'}
            onMouseOut={e => e.currentTarget.style.color = '#9CA3AF'}>
            <ChevronLeft size={15} /> กลับหน้าหลัก
          </button>
          <h1 style={{ fontSize: '26px', fontWeight: 950, color: C.navy, margin: '0 0 4px' }}>⚙️ การตั้งค่า</h1>
          <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, fontFamily: C.fontBody }}>ปรับแต่งประสบการณ์การเรียนรู้ของคุณ</p>
        </div>

        {/* ── 1. การแสดงผล ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🎨 การแสดงผลหน้าจอ" sub="ปรับธีม, ขนาดตัวอักษร และความสบายของสายตา" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>🌙 โหมดมืด (Dark Mode)</p><p style={subStyle}>เปลี่ยนพื้นหลังเป็นสีเข้มเพื่อถนอมสายตาในที่มืด</p></div>
            <Toggle on={darkMode} onToggle={() => { const n = !darkMode; setDarkMode(n); addToast(n ? '🌙 เปิดโหมดมืดแล้ว' : '☀️ เปิดโหมดสว่างแล้ว', 'info'); }} color={C.sky} />
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>📏 ขนาดตัวอักษร</p><p style={subStyle}>ปรับขนาดตัวอักษรทั่วทั้งระบบ (ปัจจุบัน: {fontSize === 'small' ? 'เล็ก' : fontSize === 'medium' ? 'กลาง' : 'ใหญ่'})</p></div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[['small', 'S', 'เล็ก'], ['medium', 'M', 'กลาง'], ['large', 'L', 'ใหญ่']].map(([s, lbl, th]) => (
                <button key={s} onClick={() => { setFontSize(s); addToast(`📝 เปลี่ยนขนาดตัวอักษรเป็น "${th}" แล้ว`, 'info'); }}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: `1.5px solid ${fontSize === s ? C.navy : '#E5E7EB'}`, background: fontSize === s ? C.navy : 'white', color: fontSize === s ? 'white' : '#374151', fontSize: '11px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>🔔 Toast การแจ้งเตือนในแอป</p><p style={subStyle}>แสดงข้อความ popup เมื่อมีการดำเนินการ</p></div>
            <Toggle on={toastNotif} onToggle={() => setToastNotif(n => !n)} color={C.navy} />
          </div>
        </div>

        {/* ── 2. ห้องเรียนและวิดีโอ ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🎬 ห้องเรียนและการเล่นวิดีโอ" sub="ตั้งค่าประสบการณ์เรียนออนไลน์" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>▶ ความเร็วเล่นวิดีโอ (ค่าเริ่มต้น)</p><p style={subStyle}>กำหนดความเร็วเริ่มต้นสำหรับทุกวิดีโอ</p></div>
            <select value={videoSpeed} onChange={e => { setVideoSpeed(e.target.value); if (settingsHydrated) localStorage.setItem('inbiology_videospeed', e.target.value); addToast(`▶ ตั้งความเร็ววิดีโอเป็น ${e.target.value}x แล้ว`, 'info'); }} style={{ fontSize: '12px', fontWeight: 800, border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontFamily: 'inherit', background: 'white', color: '#374151' }}>
              {['0.5', '0.75', '1', '1.25', '1.5', '1.75', '2'].map(s => (
                <option key={s} value={s}>{s}x</option>
              ))}
            </select>
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>⏭ เล่นบทเรียนถัดไปอัตโนมัติ</p><p style={subStyle}>เล่นบทเรียนถัดไปหลังวิดีโอจบโดยอัตโนมัติ</p></div>
            <Toggle on={autoPlay} onToggle={() => { setAutoPlay(n => !n); addToast(autoPlay ? '⏸ ปิดการเล่นต่อเนื่องแล้ว' : '⏭ เปิดการเล่นต่อเนื่องแล้ว', 'info'); }} color={C.navy} />
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>📐 แถบซ้าย-ขวา (Sidebar)</p><p style={subStyle}>แสดงแถบรายการบทเรียนด้านซ้ายในห้องเรียน</p></div>
            <Toggle on={showSidebar} onToggle={() => { setShowSidebar(n => !n); addToast(showSidebar ? '📐 ซ่อนแถบรายการบทเรียนแล้ว' : '📐 แสดงแถบรายการบทเรียนแล้ว', 'info'); }} color={C.navy} />
          </div>
        </div>

        {/* ── 3. การแจ้งเตือน ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🔔 การแจ้งเตือน" sub="เลือกประเภทการแจ้งเตือนที่คุณต้องการรับ" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>📧 แจ้งเตือนทางอีเมล</p><p style={subStyle}>รับข่าวสาร คอร์สใหม่ และโปรโมชั่นทางอีเมล</p></div>
            <Toggle on={emailNotif} onToggle={() => { setEmailNotif(n => !n); addToast(emailNotif ? '📧 ปิดการแจ้งเตือนอีเมล' : '📧 เปิดการแจ้งเตือนอีเมลแล้ว', 'info'); }} color="#10B981" />
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>📱 Push Notification</p><p style={subStyle}>รับการแจ้งเตือนแบบ push บนอุปกรณ์</p></div>
            <Toggle on={pushNotif} onToggle={() => { setPushNotif(n => !n); addToast(pushNotif ? '📱 ปิด Push Notification' : '📱 เปิด Push Notification แล้ว', 'info'); }} color="#8B5CF6" />
          </div>

          <div style={rowStyle}>
            <div><p style={labelStyle}>⏰ เตือนความจำการเรียน</p><p style={subStyle}>แจ้งเตือนให้กลับมาเรียนเมื่อไม่ได้เรียนนาน</p></div>
            <Toggle on={courseReminder} onToggle={() => { setCourseReminder(n => !n); addToast(courseReminder ? '⏰ ปิดการเตือนความจำการเรียน' : '⏰ เปิดการเตือนความจำการเรียนแล้ว', 'info'); }} color={C.navy} />
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>🏆 แจ้งเตือนก่อนวันสอบ</p><p style={subStyle}>ส่งข้อความเตือนก่อนวันสอบจริง 7 วัน</p></div>
            <Toggle on={examAlert} onToggle={() => { setExamAlert(n => !n); addToast(examAlert ? '🏆 ปิดการแจ้งเตือนวันสอบ' : '🏆 เปิดการแจ้งเตือนวันสอบแล้ว', 'info'); }} color={C.red} />
          </div>
        </div>

        {/* ── 4. ภาษา ── */}
        <div style={sectionStyle}>
          <SectionHeader title="🌐 ภาษา (Language)" sub="เลือกภาษาที่ใช้แสดงผลในระบบ" />
          <div style={{ display: 'flex', gap: '10px' }}>
            {[['TH', '🇹🇭', 'ภาษาไทย'], ['EN', '🇺🇸', 'English']].map(([code, flag, label]) => (
              <button key={code} onClick={() => { setLang(code); addToast(code === 'EN' ? '🌐 Switched to English' : '🌐 เปลี่ยนเป็นภาษาไทย', 'info'); }} style={{
                flex: 1, padding: '14px 12px', borderRadius: '14px', border: `2px solid ${lang === code ? C.navy : '#E5E7EB'}`,
                background: lang === code ? C.navy : 'white', color: lang === code ? 'white' : '#374151',
                fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                <span style={{ fontSize: '18px' }}>{flag}</span> {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. การเข้าถึง ── */}
        <div style={sectionStyle}>
          <SectionHeader title="♿ การเข้าถึง (Accessibility)" sub="ตัวเลือกสำหรับการเข้าถึงที่ดียิ่งขึ้น" />

          <div style={rowStyle}>
            <div><p style={labelStyle}>🎭 ลด Animation (Reduced Motion)</p><p style={subStyle}>ปิดหรือลดการเคลื่อนไหวของ UI เพื่อลดอาการเวียนหัว</p></div>
            <Toggle on={reducedMotion} onToggle={() => { setReducedMotion(n => !n); addToast(reducedMotion ? '🎭 เปิดอนิเมชันกลับแล้ว' : '🎭 ปิดอนิเมชัน Reduced Motion แล้ว', 'info'); }} color="#6B7280" />
          </div>

          <div style={lastRowStyle}>
            <div><p style={labelStyle}>🔆 ความเปรียบต่างสูง (High Contrast)</p><p style={subStyle}>เพิ่มความเปรียบต่างสีตัวอักษรให้อ่านง่ายยิ่งขึ้น</p></div>
            <Toggle on={highContrast} onToggle={() => { setHighContrast(n => !n); addToast(highContrast ? '🔆 ปิด High Contrast แล้ว' : '🔆 เปิด High Contrast แล้ว', 'info'); }} color="#374151" />
          </div>
        </div>

        {/* ── 6. บัญชี ── */}
        {userRole !== 'guest' ? (
          <div style={sectionStyle}>
            <SectionHeader title="👤 บัญชีและความปลอดภัย" sub="จัดการข้อมูลส่วนตัว รหัสผ่าน และความเป็นส่วนตัว" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'แก้ไขข้อมูลโปรไฟล์', icon: '✏️', sub: 'ชื่อ, โรงเรียน, รูปโปรไฟล์' },
                { label: 'เปลี่ยนรหัสผ่าน', icon: '🔑', sub: 'อัปเดตรหัสผ่านเพื่อความปลอดภัย' },
                { label: 'ดาวน์โหลดโน้ตทั้งหมด', icon: '📥', sub: 'บันทึกโน้ตเรียนทุกวิชาเป็นไฟล์ PDF' },
                { label: 'นโยบายความเป็นส่วนตัว', icon: '🔒', sub: 'ข้อมูลที่เราเก็บรวบรวมและวิธีการใช้งาน' },
                { label: 'แจ้งปัญหาการใช้งาน', icon: '🐛', sub: 'ส่งรายงานบั๊กหรือข้อเสนอแนะ' },
              ].map(b => (
                <button key={b.label} onClick={() => addToast(`${b.icon} ${b.label} — กำลังพัฒนา`, 'info')} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                  border: '1px solid #E5E7EB', borderRadius: '12px', background: '#FAFAFA', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s'
                }}
                  onMouseOver={e => e.currentTarget.style.background = '#EFF6FF'}
                  onMouseOut={e => e.currentTarget.style.background = '#FAFAFA'}>
                  <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{b.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: 0 }}>{b.label}</p>
                    <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0, fontFamily: C.fontBody }}>{b.sub}</p>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ ...sectionStyle, textAlign: 'center', padding: '32px' }}>
            <p style={{ fontSize: '14px', fontWeight: 800, color: C.navy, margin: '0 0 8px' }}>👤 ยังไม่ได้เข้าสู่ระบบ</p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: '0 0 16px', fontFamily: C.fontBody }}>เข้าสู่ระบบเพื่อเข้าถึงการตั้งค่าบัญชีและข้อมูลส่วนตัว</p>
            <button onClick={() => setPage('login')} style={{ background: C.sky, color: 'white', fontWeight: 800, fontSize: '13px', padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
              เข้าสู่ระบบ / สมัครสมาชิก
            </button>
          </div>
        )}

        {/* ── About ── */}
        <div style={{ ...sectionStyle, marginBottom: 0 }}>
          <SectionHeader title="ℹ️ เกี่ยวกับ INBIOLOGY Academy" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4B5563' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontWeight: 700 }}>เวอร์ชัน</span><span style={{ color: '#9CA3AF' }}>INBIOLOGY Academy v2.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontWeight: 700 }}>พัฒนาโดย</span><span style={{ color: '#9CA3AF' }}>พี่ต้น (INBIOLOGY Team)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
              <span style={{ fontWeight: 700 }}>อัปเดตล่าสุด</span><span style={{ color: '#9CA3AF' }}>กรกฎาคม 2026</span>
            </div>
            {[
              { label: 'เงื่อนไขการใช้งาน', icon: '📋' },
              { label: 'นโยบายความเป็นส่วนตัว', icon: '🔒' },
              { label: 'Open Source Licenses', icon: '⚖️' },
            ].map(b => (
              <button key={b.label} onClick={() => addToast(`${b.icon} ${b.label} — กำลังพัฒนา`, 'info')} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '13px', fontWeight: 700, color: '#374151', textAlign: 'left',
                borderBottom: '1px solid #F3F4F6'
              }}
                onMouseOver={e => e.currentTarget.style.color = C.sky}
                onMouseOut={e => e.currentTarget.style.color = '#374151'}>
                <span>{b.icon}</span>{b.label}
                <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#9CA3AF' }} />
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#D1D5DB', marginTop: '20px' }}>INBIOLOGY Academy v2.0 • © 2026 by พี่ต้น • All rights reserved.</p>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const { page, setPage } = useLegacyNavigation();
  const [userRole, setUserRole] = useState('guest');
  const [authReady, setAuthReady] = useState(false);
  const [enrolledCourses] = useState(['bio-intensive-1']);
  const [activeCourseId, setActiveCourseId] = useState('bio-intensive-1');
  const [toasts, setToasts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('TH');

  useEffect(() => {
    let cancelled = false;
    getCurrentUser()
      .then(user => {
        if (!cancelled && user) setUserRole(user.role);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (page === 'admin' && userRole !== 'admin') {
      setPage('login');
      return;
    }
    if (!PUBLIC_PAGES.has(page) && userRole === 'guest') setPage('login');
  }, [authReady, page, setPage, userRole]);

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch {
      addToast('ออกจากระบบเฉพาะอุปกรณ์นี้แล้ว', 'info');
    } finally {
      setUserRole('guest');
      setPage('landing');
    }
  };

  // Apply dark mode CSS class on body
  useEffect(() => {
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [trialModal, setTrialModal] = useState(null);

  const [coupons, setCoupons] = useState([
    { code: 'INBIOLOGY100', discount: 100, type: 'flat' },
    { code: 'FREEBIO', discount: 100, type: 'percent' }
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-101', studentName: 'นาย ภูมิพัฒน์ รัตนชัย', courseTitle: 'Bio Intensive I: Introbiology & Biochemistry & Cell biology', price: 1290, date: '18/07/2026', status: 'approved', paymentMethod: 'PromptPay' },
    { id: 'ORD-102', studentName: 'นางสาว ณัฐนิชา สุขใจ', courseTitle: 'คอร์ส ตะลุยโจทย์ สอวน . ละเอียด 100 ข้อ', price: 390, date: '18/07/2026', status: 'pending', paymentMethod: 'PromptPay' }
  ]);

  const [notes, setNotes] = useState([
    { id: 1, courseId: 'bio-intensive-1', courseTitle: '🧬 Bio Intensive I: Introbiology & Biochemistry & Cell biology', time: 'โครงสร้างและหน้าที่ของออร์แกเนลล์', text: 'ออร์แกเนลล์เดี่ยวที่มีเยื่อหุ้ม 1 ชั้น เช่น Lysosome ทำหน้าที่ย่อยสารและสิ่งแปลกปลอมในเซลล์, Vacuole เก็บสะสมน้ำและของเสีย' }
  ]);

  const [courses, setCourses] = useState(COURSES);
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [catalogHydrated, setCatalogHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    try {
      const storedCourses = localStorage.getItem('inbiology_courses_v9');
      const storedSlides = localStorage.getItem('inbiology_slides_v9');
      if (storedCourses) setCourses(JSON.parse(storedCourses));
      if (storedSlides) setSlides(JSON.parse(storedSlides));
    } catch {
      // Ignore malformed prototype data and keep the server-rendered defaults.
    }
    listPublishedCourses()
      .then((publishedCourses) => {
        if (cancelled || publishedCourses.length === 0) return;
        setCourses(publishedCourses.map((course) => ({
          id: course.slug,
          slug: course.slug,
          title: course.title,
          description: course.description || '',
          price: course.price,
          originalPrice: course.originalPrice || course.price,
          Level: course.level || 'ทุกระดับ',
          imageUrl: course.imageUrl?.startsWith('/') ? course.imageUrl : '/course-biology.jpg',
          lessons: [],
          rating: 5,
          reviewCount: 0,
          status: course.status,
        })));
      })
      .catch(() => {
        // Keep local prototype data when the API/database is unavailable.
      })
      .finally(() => {
        if (!cancelled) setCatalogHydrated(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (catalogHydrated) localStorage.setItem('inbiology_courses_v9', JSON.stringify(courses));
  }, [courses, catalogHydrated]);

  useEffect(() => {
    if (catalogHydrated) localStorage.setItem('inbiology_slides_v9', JSON.stringify(slides));
  }, [slides, catalogHydrated]);

  const addToast = (msg, type = 'info') => { const id = ++_tid; setToasts(p => [...p, { id, message: msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000); };

  const addToCart = (course) => {
    if (enrolledCourses.includes(course.id)) { addToast('คุณได้ลงทะเบียนในห้องเรียนของคอร์สนี้แล้ว', 'info'); return; }
    if (cart.find(c => c.id === course.id)) { addToast('คอร์สนี้ถูกเพิ่มลงในตะกร้าชำระเงินเรียบร้อยแล้ว', 'info'); return; }
    setCart(p => [...p, course]);
    addToast(`🛒 เพิ่ม "${course.title}" ลงตะกร้าแล้ว`, 'success');
  };

  const checkout = async ({ couponCode, paymentMethod }) => {
    try {
      const order = await createPendingOrder({
        courseSlugs: cart.map(course => course.id),
        couponCode: couponCode || undefined,
        paymentMethod,
      });
      addToast(`สร้างคำสั่งซื้อ ${order.orderId} แล้ว กรุณาดำเนินการชำระเงิน`, 'success');
      if (order.paymentUrl) window.location.assign(order.paymentUrl);
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'ไม่สามารถสร้างคำสั่งซื้อได้', 'error');
    }
  };
  return (
    <div id="app-root" style={{ fontFamily: "'Outfit','Prompt',sans-serif", WebkitFontSmoothing: 'antialiased', background: C.page, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      {/* Ambient background glows */}
      <div style={{
        position: 'fixed',
        top: '15%',
        left: '5%',
        width: '450px',
        height: '450px',
        background: 'rgba(185, 28, 28, 0.04)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '5%',
        width: '500px',
        height: '500px',
        background: 'rgba(30, 58, 138, 0.05)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'float 12s ease-in-out infinite'
      }} />
      {page !== 'login' && (
        <Navbar setPage={setPage} userRole={userRole}
          onLogout={handleLogout}
          cartCount={cart.length} openCart={() => setCartOpen(true)}
          addToast={addToast}
          darkMode={darkMode} setDarkMode={setDarkMode}
          lang={lang} setLang={setLang}
        />
      )}
      {page === 'landing' && <LandingPage courses={courses} slides={slides} addToast={addToast} setPage={setPage} enrolledIds={enrolledCourses} onAddToCart={addToCart} onViewDetails={setSelectedCourseDetails} onTrial={setTrialModal} />}
      {page === 'courses' && <CatalogPage courses={courses} onAddToCart={addToCart} enrolledIds={enrolledCourses} onViewDetails={setSelectedCourseDetails} onTrial={setTrialModal} />}
      {page === 'login' && <LoginPage onLogin={setUserRole} setPage={setPage} addToast={addToast} />}
      {page === 'dashboard' && <StudentDashboard courses={courses} enrolledCourses={enrolledCourses} setPage={setPage} addToast={addToast} setActiveCourseId={setActiveCourseId} notes={notes} />}
      {page === 'classroom' && <ClassroomPage courses={courses} enrolledCourses={enrolledCourses} activeCourseId={activeCourseId} addToast={addToast} setPage={setPage} notes={notes} setNotes={setNotes} />}
      {page === 'quiz' && <ExamCenterPage addToast={addToast} setPage={setPage} />}
      {page === 'checkout' && <CheckoutPage cart={cart} coupons={coupons} onCheckout={checkout} addToast={addToast} />}
      {page === 'admin' && <AdminDashboard courses={courses} setCourses={setCourses} slides={slides} setSlides={setSlides} coupons={coupons} setCoupons={setCoupons} orders={orders} setOrders={setOrders} addToast={addToast} />}

      {/* Fallback mockup pages to align other options in the navbar */}
      {['exams', 'blog', 'support'].includes(page) && (
        <div style={{ paddingTop: '120px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: C.navy, fontWeight: 900 }}>ห้องบริการความรู้ชีววิทยาจำลอง</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: C.fontBody }}>
            ส่วนระบบนี้อยู่ระหว่างอัปเกรดเนื้อหาเพิ่มเติมเพื่อรอบรับการสอบ A-Level / สอวน. ในเทอมหน้า <br />
            คุณสามารถทดสอบบทเรียนจำลองและควิซประเมินผลได้จากหน้า **คอร์สเรียน** และ **Dashboard นักเรียน**
          </p>
          <button onClick={() => setPage('landing')} style={{ background: C.sky, color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', marginTop: '12px', cursor: 'pointer' }}>
            กลับหน้าหลัก
          </button>
        </div>
      )}

      {/* Guide Page */}
      {page === 'guide' && <GuidePage setPage={setPage} />}

      {/* Settings Page */}
      {page === 'settings' && <SettingsPage setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} lang={lang} setLang={setLang} addToast={addToast} userRole={userRole} />}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="animate-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }} onClick={() => setCartOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div className="animate-slide-down" onClick={e => e.stopPropagation()} style={{ position: 'relative', background: 'white', width: '100%', maxWidth: '360px', height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 850, color: C.navy, margin: 0, fontSize: '15px' }}>
                <ShoppingCart size={20} /> ตะกร้าชำระเงิน
                <span style={{ background: C.red, color: 'white', fontSize: '10px', fontWeight: 900, width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>
              </h3>
              <button onClick={() => setCartOpen(false)} style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'none', border: 'none' }}><X size={16} /></button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.length === 0
                ? <div style={{ textAlign: 'center', padding: '48px 0', color: '#9CA3AF' }}>
                  <ShoppingCart size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <p style={{ fontSize: '13px', fontWeight: 500 }}>ไม่มีสินค้าในตะกร้า</p>
                </div>
                : cart.map(c => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <img src={c.imageUrl} alt="" style={{ width: '52px', height: '36px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 800, color: C.navy, fontSize: '12px', margin: '0 0-2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                      <p style={{ color: C.red, fontWeight: 900, fontSize: '13px', margin: 0 }}>฿{formatPrice(c.price)}</p>
                    </div>
                    <button onClick={() => setCart(p => p.filter(x => x.id !== c.id))} style={{ padding: '4px', color: '#9CA3AF', cursor: 'pointer', background: 'none', border: 'none' }}>
                      <X size={14} />
                    </button>
                  </div>
                ))
              }
            </div>
            {cart.length > 0 && (
              <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#374151', fontSize: '14px' }}>ยอดรวม</span>
                  <span style={{ fontWeight: 900, fontSize: '22px', color: C.navy }}>฿{formatPrice(cart.reduce((s, c) => s + c.price, 0))}</span>
                </div>
                <button onClick={() => { setPage('checkout'); setCartOpen(false); }} style={{ width: '100%', background: C.red, color: 'white', fontWeight: 850, fontSize: '14px', padding: '14px', borderRadius: '12px', cursor: 'pointer', border: 'none' }}>
                  ดำเนินการชำระเงิน
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} remove={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* Global Trial modal */}
      <Modal isOpen={!!trialModal} onClose={() => setTrialModal(null)} title={`ตัวอย่างบทเรียนทดลองเรียน — ${trialModal?.title}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ aspectRatio: '16/9', background: 'black', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {trialModal?.imageUrl && <img src={trialModal.imageUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />}
            <button style={{ position: 'relative', zIndex: 1, width: '60px', height: '60px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>
              <Play size={24} fill={C.sky} color={C.sky} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontFamily: C.fontBody }}>ชมคลิปวิดีโอจำลองการเรียนจริงฟรี โดย INBIOLOGY Academy</p>
        </div>
      </Modal>

      {/* Global Course Detail Modal */}
      <Modal isOpen={!!selectedCourseDetails} onClose={() => setSelectedCourseDetails(null)} title="หน้ารายละเอียดหลักสูตรคอร์สเรียนชีวะ" wide>
        <CourseDetailView course={selectedCourseDetails} onAddToCart={addToCart} enrolled={enrolledCourses.includes(selectedCourseDetails?.id)} onClose={() => setSelectedCourseDetails(null)} onStartTrial={setTrialModal} />
      </Modal>
    </div>
  );
}
