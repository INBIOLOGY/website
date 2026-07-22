// ─────────────────────────────────────────────────────────────────────────────
// STANDALONE COMPLETE MOCK DATASET FOR INBIOLOGY ACADEMY
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_COLORS = {
  navy: '#B91C1C',
  navyLight: '#EF4444',
  sky: '#1E3A8A',
  skyLight: '#E0F2FE',
  red: '#EF4444',
  redDark: '#DC2626',
  page: '#F3F4F6',
  white: '#FFFFFF',
  textDark: '#111827',
  textMuted: '#6B7280'
};

const COURSES = [
  {
    id: 'bio-intensive-1',
    title: '🧬 Bio Intensive I: Introbiology & Biochemistry & Cell biology',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1290, originalPrice: 2500,
    badge: 'Bio Intensive I', badgeBg: BRAND_COLORS.navy,
    tag: 'ม.4 & ติวสอบ', tagBg: '#FEF2F2', tagColor: '#991B1B',
    description: 'ปูพื้นฐานบทนำชีววิทยา เคมีที่เป็นพื้นฐานของสิ่งมีชีวิต (Biochemistry) โครงสร้างและหน้าที่ของเซลล์ ออร์แกเนลล์ เยื่อหุ้มเซลล์ การลำเลียงสาร และการแบ่งเซลล์อย่างลึกซึ้ง',
    hours: 30, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: บทนำชีววิทยา ทักษะการสืบเสาะ และเคมีพื้นฐานของสิ่งมีชีวิต', duration: 45, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'EP 2: เจาะลึกชีวโมเลกุล: คาร์โบไฮเดรต โปรตีน ลิพิด และกรดนิวคลีอิก', duration: 50, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l3', title: 'EP 3: โครงสร้างและหน้าที่ของออร์แกเนลล์ในเซลล์พืชและสัตว์', duration: 55, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l4', title: 'EP 4: กลไกการลำเลียงสารผ่านเยื่อหุ้มเซลล์ (Passive & Active Transport)', duration: 40, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l5', title: 'EP 5: เอนไซม์และอัตราการเกิดปฏิกิริยาเคมีในสิ่งมีชีวิต', duration: 45, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l6', title: 'EP 6: วัฏจักรเซลล์ การแบ่งเซลล์แบบ Mitosis และ Meiosis', duration: 60, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    imageUrl: './course-cover-1.png',
    rating: 4.9, reviewCount: 450, Level: 'ม.4', Category: '🧬 Bio Intensive'
  },
  {
    id: 'bio-intensive-2',
    title: '🧫 Bio Intensive II: Genetic and evolution',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1390, originalPrice: 2700,
    badge: 'Bio Intensive II', badgeBg: BRAND_COLORS.sky,
    tag: 'ม.4-ม.5 & ติวสอบ', tagBg: '#EDE9FE', tagColor: '#5B21B6',
    description: 'พันธุศาสตร์ของเมนเดล การถ่ายทอดลักษณะทางพันธุกรรม ดีเอ็นเอ สารพันธุกรรม รหัสพันธุกรรม เทคโนโลยีชีวภาพ และหลักการวิวัฒนาการของสิ่งมีชีวิต',
    hours: 32, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: พันธุศาสตร์ของเมนเดล กฎแห่งการแยกตัวและรวมกลุ่มอย่างอิสระ', duration: 50, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'EP 2: ส่วนขยายพันธุศาสตร์เมนเดล (Incomplete Dominance, Codominance)', duration: 45, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l3', title: 'EP 3: โครงสร้าง DNA & RNA และการจำลองตัวของ DNA', duration: 55, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l4', title: 'EP 4: กระบวนการถอดรหัสและการแปลรหัสพันธุกรรม', duration: 60, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    imageUrl: './course-cover-2.png',
    rating: 5.0, reviewCount: 380, Level: 'ม.5', Category: '🧫 Bio Intensive'
  },
  {
    id: 'bio-intensive-3',
    title: '🌱 Bio Intensive III: Plant Biology',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1290, originalPrice: 2400,
    badge: 'Bio Intensive III', badgeBg: '#10B981',
    tag: 'ม.5 & ติวสอบ', tagBg: '#D1FAE5', tagColor: '#065F46',
    description: 'เจาะลึกชีววิทยาของพืช โครงสร้างและเนื้อเยื่อพืช กระบวนการสังเคราะห์ด้วยแสง (Photosynthesis) การลำเลียงของพืช และฮอร์โมนพืช',
    hours: 28, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: โครงสร้างและเนื้อเยื่อพืชไร้ท่อและพืชมีท่อลำเลียง', duration: 45, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'EP 2: กระบวนการสังเคราะห์ด้วยแสง ปฏิกิริยาแสง และวัฏจักรคัลวิน', duration: 55, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    imageUrl: './course-cover-3.jpg',
    rating: 4.9, reviewCount: 310, Level: 'ม.5', Category: '🌱 Bio Intensive'
  },
  {
    id: 'bio-intensive-4',
    title: '🦴 Bio Intensive IV: Animal Biology I',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1490, originalPrice: 2800,
    badge: 'Bio Intensive IV', badgeBg: '#F59E0B',
    tag: 'ม.5-ม.6 & ติวสอบ', tagBg: '#FEF3C7', tagColor: '#92400E',
    description: 'กายวิภาคศาสตร์และสรีรวิทยาของสัตว์และมนุษย์ พาร์ต 1: ระบบย่อยอาหาร การหมุนเวียนเลือด ระบบหายใจ และระบบขับถ่าย',
    hours: 35, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: ระบบย่อยอาหารและการดูดซึมสารอาหารในมนุษย์', duration: 50, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'EP 2: โครงสร้างหัวใจและการหมุนเวียนเลือด', duration: 55, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    imageUrl: './course-cover-4.jpg',
    rating: 4.8, reviewCount: 415, Level: 'ม.6', Category: '🦴 Bio Intensive'
  },
  {
    id: 'special-posn-100',
    title: '🎯 คอร์ส ตะลุยโจทย์ สอวน . ละเอียด 100 ข้อ',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 390, originalPrice: 1290,
    badge: 'ราคาถูกสุดคุ้ม 🔥', badgeBg: BRAND_COLORS.red,
    tag: 'ราคาโปรโมชั่น 390.-', tagBg: '#FEE2E2', tagColor: '#B91C1C',
    description: 'คอร์สตะลุยโจทย์ สอวน. ชีววิทยา คัดสรรโจทย์เข้มข้น 100 ข้อ พร้อมเฉลยรายละเอียดทุกข้อ ชี้จุดหลอก พิชิตคะแนนค่าย 1 (ราคาถูกพิเศษ)',
    hours: 18, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: ตะลุยโจทย์ สอวน. ข้อ 1-25 + เฉลยรายละเอียด', duration: 50, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'EP 2: ตะลุยโจทย์ สอวน. ข้อ 26-50 + เฉลยรายละเอียด', duration: 50, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    imageUrl: '/course-cover-5.jpg',
    rating: 4.9, reviewCount: 890, Level: 'ติวสอบ', Category: '🏅 คอร์สพิเศษ'
  },
  {
    id: 'special-99-starter',
    title: '⚡ คอร์ส 99 บาท: สรุปชีวะสกัดเข้ม Quick Review (ม.ปลาย)',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 99, originalPrice: 590,
    badge: 'คอร์ส 99 บาท 🔥', badgeBg: BRAND_COLORS.red,
    tag: 'โปรสุดคุ้ม 99.-', tagBg: '#FEE2E2', tagColor: '#991B1B',
    description: 'คอร์สราคาสุดประหยัดเพียง 99 บาท! รวมเทคนิคสกัดเข้มจุดออกสอบบ่อยชีววิทยา ม.ปลาย สรุปสูตรลัดและแผนภาพ Mind Map พร้อมลุยทุกสนามสอบ',
    hours: 10, validity: 365, ebook: true,
    lessons: [
      { id: 'l1', title: 'EP 1: สรุปจุดออกสอบบ่อย Cell & Biochemistry', duration: 40, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
      { id: 'l2', title: 'EP 2: สรุปเทคนิคทำโจทย์ Genetics & DNA', duration: 45, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    imageUrl: '/course-cover-6.png',
    rating: 5.0, reviewCount: 1420, Level: 'ติวสอบ', Category: '⚡ คอร์ส 99 บาท'
  }
];

const FREE_TRIALS = [
  { id: 'ft1', title: 'คลิปทดลองเรียน Bio Intensive I: โครงสร้างเซลล์และกลไกการลำเลียงสาร', duration: '45 นาที', course: 'Bio Intensive I', imageUrl: './course-cover-1.png', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ft2', title: 'คลิปทดลองเรียน Bio Intensive II: เทคนิคคำนวณโจทย์พันธุศาสตร์เมนเดล', duration: '35 นาที', course: 'Bio Intensive II', imageUrl: './course-cover-2.png', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ft3', title: 'คลิปทดลองเรียน คอร์สพิเศษ สอวน.: เจาะลึกข้อสอบคัดเลือกค่าย 1', duration: '40 นาที', course: 'คอร์ส ติวเข้ม สอวน.', imageUrl: './course-cover-5.jpg', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'ft4', title: 'คลิปทดลองเรียน คอร์ส 99 บาท: สรุปสกัดเข้ม Quick Review ม.ปลาย', duration: '30 นาที', course: 'คอร์ส 99 บาท', imageUrl: './course-cover-6.png', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' }
];

const COUPONS = [
  { code: 'INBIOLOGY100', discount: 100, type: 'flat' },
  { code: 'NEWBIO200', discount: 200, type: 'flat' },
  { code: 'PROMO50', discount: 50, type: 'percent' }
];

const ORDERS = [
  { id: 'ORD-9821', studentName: 'นาย ภูมิพัฒน์ รัตนชัย', courseTitle: 'Bio Intensive I', price: 1290, date: '22/07/2026', status: 'approved', paymentMethod: 'PromptPay QR' },
  { id: 'ORD-9822', studentName: 'นางสาว ณัฐนิชา สุขใจ', courseTitle: 'Bio Intensive II', price: 1390, date: '22/07/2026', status: 'pending', paymentMethod: 'PromptPay QR' }
];

const EXAM_TOPICS = [
  {
    id: 'bio-1',
    courseId: 'bio-intensive-1',
    category: 'cell',
    title: '🧬 Bio Intensive I: เซลล์และกลไกชีวิต',
    description: 'ทดสอบความรู้เรื่องโครงสร้างเซลล์ ออร์แกเนลล์ การสลายสารอาหารระดับเซลล์ และการลำเลียงสาร',
    badge: 'Bio Intensive I',
    badgeBg: '#1E3A8A',
    isFree: false
  },
  {
    id: 'bio-2',
    courseId: 'bio-intensive-2',
    category: 'genetics',
    title: '🧫 Bio Intensive II: พันธุศาสตร์และ DNA',
    description: 'เจาะลึกโจทย์เมนเดล มิวเทชัน เทคโนโลยีทางดีเอ็นเอ และวิวัฒนาการสิ่งมีชีวิต',
    badge: 'Bio Intensive II',
    badgeBg: '#5B21B6',
    isFree: false
  },
  {
    id: 'bio-3',
    courseId: 'bio-intensive-3',
    category: 'plant',
    title: '🌱 Bio Intensive III: ชีววิทยาของพืช',
    description: 'โครงสร้างเนื้อเยื่อพืช การสังเคราะห์ด้วยแสง ฮอร์โมนและการเจริญเติบโตของพืช',
    badge: 'Bio Intensive III',
    badgeBg: '#065F46',
    isFree: false
  },
  {
    id: 'bio-4',
    courseId: 'bio-intensive-4',
    category: 'animal',
    title: '🦴 Bio Intensive IV: สรีรวิทยาสัตว์และระบบร่างกาย',
    description: 'ระบบย่อยอาหาร ระบบหมุนเวียนเลือด ระบบประสาท และระบบขับถ่ายในมนุษย์',
    badge: 'Bio Intensive IV',
    badgeBg: '#92400E',
    isFree: false
  },
  {
    id: 'posn-exam',
    courseId: 'posn-intensive',
    category: 'posn',
    title: '🎯 คอร์ส ติวเข้ม สอวน. ชีววิทยา',
    description: 'แนวข้อสอบคัดเลือกค่าย 1 สอวน. เน้นโจทย์วิเคราะห์ขั้นสูงและแล็บปฏิบัติการ',
    badge: 'สอวน. ค่าย 1',
    badgeBg: '#B91C1C',
    isFree: false
  },
  {
    id: 'free-all',
    courseId: null,
    category: 'all',
    title: '🏆 ชุดสอบจำลอง A-Level (ทดลองสอบฟรี)',
    description: 'ชุดข้อสอบจำลอง A-Level คละเนื้อหาทุกบทเรียน สำหรับทดสอบวัดระดับพื้นฐานชีววิทยาฟรี',
    badge: 'เปิดสอบฟรี',
    badgeBg: '#10B981',
    isFree: true
  }
];

const EXAM_CATEGORIES = [
  { id: 'all', name: '🏆 รวมทุกบท A-Level', badgeBg: 'var(--c-navy)' },
  { id: 'cell', name: '🧬 เซลล์และชีวโมเลกุล', badgeBg: '#1E3A8A' },
  { id: 'genetics', name: '🧫 พันธุศาสตร์ & วิวัฒนาการ', badgeBg: '#5B21B6' },
  { id: 'plant', name: '🌱 ชีววิทยาพืช', badgeBg: '#065F46' },
  { id: 'animal', name: '🦴 สรีรวิทยาและร่างกายมนุษย์', badgeBg: '#92400E' },
  { id: 'posn', name: '🎯 ตะลุยโจทย์ สอวน.', badgeBg: '#B91C1C' }
];

const EXAM_QUESTIONS = [
  // Cell & Biochemistry
  {
    id: 1, category: 'cell', categoryName: '🧬 เซลล์และชีวโมเลกุล',
    question: 'ออร์แกเนลล์ใดทำหน้าที่สังเคราะห์ลิพิดและทำลายสารพิษในเซลล์ตับ?',
    options: ['A. Smooth Endoplasmic Reticulum (SER)', 'B. Rough Endoplasmic Reticulum (RER)', 'C. Golgi Body', 'D. Lysosome'],
    correct: 0,
    explanation: 'SER (Smooth Endoplasmic Reticulum) เป็นออร์แกเนลล์หลักที่ทำหน้าที่สังเคราะห์สารลิพิด และมีเอนไซม์ขจัดสารพิษในเซลล์ตับ'
  },
  {
    id: 2, category: 'cell', categoryName: '🧬 เซลล์และชีวโมเลกุล',
    question: 'กระบวนการใดยังคงเกิดขึ้นในสภาวะที่ไม่มีแก๊สออกซิเจน (Anaerobic Condition)?',
    options: ['A. Krebs Cycle', 'B. Electron Transport Chain', 'C. Glycolysis', 'D. Pyruvate Oxidation'],
    correct: 2,
    explanation: 'Glycolysis เป็นกระบวนการสลายกลูโคสขั้นแรกที่เกิดขึ้นในไซโทพลาซึม โดยไม่ต้องใช้ออกซิเจน'
  },
  {
    id: 3, category: 'cell', categoryName: '🧬 เซลล์และชีวโมเลกุล',
    question: 'พันธะเคมีใดทำหน้าที่เชื่อมต่อกรดอะมิโนแต่ละโมเลกุลให้สายโพลีเพปไทด์ของโปรตีนมีความสมบูรณ์?',
    options: ['A. Glycosidic Linkage', 'B. Peptide Bond', 'C. Phosphodiester Bond', 'D. Ester Bond'],
    correct: 1,
    explanation: 'Peptide Bond (พันธะเพปไทด์) เป็นพันธะโคเวเลนต์ที่เกิดขึ้นระหว่างหมู่คาร์บอกซิลของกรดอะมิโนตัวหนึ่งกับหมู่อะมิโนของกรดอะมิโนอีกตัวหนึ่ง'
  },

  // Genetics & Evolution
  {
    id: 4, category: 'genetics', categoryName: '🧫 พันธุศาสตร์ & วิวัฒนาการ',
    question: 'หมู่เลือดระบบ ABO ถูกควบคุมโดยแอลลีล IA, IB และ i ข้อใดระบุลักษณะพันธุศาสตร์ได้ถูกต้อง?',
    options: ['A. Single Gene with 2 alleles', 'B. Multiple Alleles with Codominance', 'C. Polygenic Inheritance', 'D. Incomplete Dominance'],
    correct: 1,
    explanation: 'หมู่เลือด ABO เป็นตัวอย่างของ Multiple Alleles (3 แอลลีล) และแสดงข่มร่วมกัน (Codominance ระหว่าง IA และ IB)'
  },
  {
    id: 5, category: 'genetics', categoryName: '🧫 พันธุศาสตร์ & วิวัฒนาการ',
    question: 'เอนไซม์ใดทำหน้าที่เชื่อมต่อสาย DNA ในกระบวนการตัดต่อยีน (Recombinant DNA Technology)?',
    options: ['A. DNA Polymerase', 'B. DNA Ligase', 'C. Restriction Enzyme', 'D. Helicase'],
    correct: 1,
    explanation: 'DNA Ligase ทำหน้าที่เชื่อมพันธะฟอสโฟไดเอสเทอร์ระหว่างชิ้นส่วนสาย DNA สองสายเข้าด้วยกัน'
  },
  {
    id: 6, category: 'genetics', categoryName: '🧫 พันธุศาสตร์ & วิวัฒนาการ',
    question: 'ข้อใดจัดเป็นหลักฐานสายสัมพันธ์ทางวิวัฒนาการที่มีกำเนิดกำเนิดมาจากโครงสร้างเดียวกัน (Homologous Structures)?',
    options: ['A. ปีกนก กับ ปีกผีเสื้อ', 'B. แขนมนุษย์ กับ ครีบปลาวาฬ', 'C. ตาของหมึก กับ ตาของมนุษย์', 'D. ปีกค้างคาว กับ ปีกแมลงวัน'],
    correct: 1,
    explanation: 'แขนมนุษย์และครีบปลาวาฬมีโครงสร้างกระดูกต้นกำเนิดเดียวกัน (Homologous Structure) แต่อาจพัฒนาไปทำหน้าที่ต่างกัน'
  },

  // Plant Biology
  {
    id: 7, category: 'plant', categoryName: '🌱 ชีววิทยาพืช',
    question: 'เนื้อเยื่อเจริญส่วนใดของพืชทำหน้าที่เพิ่มขนาดความกว้าง/ความหนาของลำต้น (Secondary Growth)?',
    options: ['A. Apical Meristem', 'B. Vascular Cambium', 'C. Intercalary Meristem', 'D. Protoderm'],
    correct: 1,
    explanation: 'Vascular Cambium เป็นเนื้อเยื่อเจริญด้านข้าง (Lateral Meristem) ที่สร้างไซเลมและโฟลเอ็มขั้นที่สอง ทำให้ลำต้นพืชขยายออกด้านข้าง'
  },
  {
    id: 8, category: 'plant', categoryName: '🌱 ชีววิทยาพืช',
    question: 'ฮอร์โมนพืชชนิดใดมีบทบาทหลักในการเร่งการสุกของผลไม้และการหลุดร่วงของใบ?',
    options: ['A. Auxin', 'B. Gibberellin', 'C. Ethylene', 'D. Cytokinin'],
    correct: 2,
    explanation: 'Ethylene (เอทิลีน) เป็นฮอร์โมนพืชในรูปแก๊สที่มีหน้าที่กระตุ้นการสุกของผลไม้และการหลุดร่วงของใบพืช'
  },

  // Animal Physiology
  {
    id: 9, category: 'animal', categoryName: '🦴 สรีรวิทยาและร่างกายมนุษย์',
    question: 'อวัยวะใดในระบบย่อยอาหารของมนุษย์ที่มีการย่อยสารอาหารประเภทโปรตีนเป็นแห่งแรก?',
    options: ['A. ปาก (Mouth)', 'B. กระเพาะอาหาร (Stomach)', 'C. ลำไส้เล็ก (Small Intestine)', 'D. ตับอ่อน (Pancreas)'],
    correct: 1,
    explanation: 'กระเพาะอาหารหลั่งเอนไซม์ Pepsin ออกมาย่อยโปรตีนให้เป็นเพปไทด์สายสั้นลงเป็นจุดแรก'
  },
  {
    id: 10, category: 'animal', categoryName: '🦴 สรีรวิทยาและร่างกายมนุษย์',
    question: 'หน่วยไต (Nephron) ส่วนใดที่มีกระบวนการดูดกลับกลูโคสและกรดอะมิโนกลับเข้าสู่กระแสเลือดได้เกือบ 100%?',
    options: ['A. Bowman’s Capsule', 'B. Proximal Convoluted Tubule (PCT)', 'C. Loop of Henle', 'D. Distal Convoluted Tubule (DCT)'],
    correct: 1,
    explanation: 'PCT (ท่อขดส่วนต้น) ทำหน้าที่ดูดกลับสารที่มีประโยชน์ เช่น กลูโคส กรดอะมิโน และไอออนต่างๆ กลับเข้าสู่กระแสเลือดแบบ Active Transport'
  },

  // POSN Exam
  {
    id: 11, category: 'posn', categoryName: '🎯 ตะลุยโจทย์ สอวน.',
    question: 'หากนำเซลล์เม็ดเลือดแดงไปแช่ในสารละลายไฮเปอร์โทนิก (Hypertonic Solution) ผลลัพธ์จะเป็นอย่างไร?',
    options: ['A. เซลล์เต่งและแตก (Lysis)', 'B. เซลล์เหี่ยว (Crenation)', 'C. เซลล์ไม่เปลี่ยนแปลงขนาด', 'D. เซลล์ขยายขนาดเท่าเดิม'],
    correct: 1,
    explanation: 'ในสภาวะ Hypertonic Solution โมเลกุลของน้ำภายในเซลล์จะออสโมซิสออกนอกเซลล์ ทำให้เซลล์เม็ดเลือดแดงเหี่ยว (Crenation)'
  }
];

const FAQS = [
  { q: 'เรียนคอร์สแล้วดูย้อนหลังได้นานแค่ไหน?', a: 'สามารถเข้าเรียนและดูย้อนหลังกี่รอบก็ได้ตลอดระยะเวลาอายุคอร์ส (365 วันนับจากวันสมัคร)' },
  { q: 'มีหนังสือเรียน e-Book สรุปเนื้อหาให้ไหม?', a: 'มีไฟล์ e-Book PDF คุณภาพสูงให้ดาวน์โหลดฟรีครบทุกบทเรียนในห้องเรียน' },
  { q: 'หากมีคำถามระหว่างเรียน สามารถสอบถามช่องทางใดได้บ้าง?', a: 'สามารถพิมพ์ถามผ่านระบบ AI Biologist ในห้องเรียน หรือส่งคำถามตรงถึงพี่ต้นผ่าน LINE Official @inbiology ได้ตลอด 24 ชั่วโมง' }
];

const MOCK_STUDENTS = [
  { id: 1, name: 'นาย ภูมิพัฒน์ รัตนชัย', email: 'phumiphat.r@gmail.com', school: 'สวนกุหลาบวิทยาลัย', level: 'ม.5', enrolledCount: 2 },
  { id: 2, name: 'นางสาว ณัฐนิชา สุขใจ', email: 'natnicha.s@hotmail.com', school: 'เตรียมอุดมศึกษา', level: 'ม.6', enrolledCount: 3 },
  { id: 3, name: 'นาย ปกรณ์ ดีเลิศ', email: 'pakorn.d@yahoo.com', school: 'สามเสนวิทยาลัย', level: 'ม.4', enrolledCount: 1 }
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
    avatar: './student_aleen.jpg',
    imagePosition: 'center 33%',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'Bio Intensive Complete Set'
  },
  {
    name: 'พี่โบ๊ท',
    text: 'เรียนกับพี่ต้นสนุกกก มีเพลงปั่นๆมาใช้ช่วยจำ เนื้อหาครบถ้วน มีข้อสอบให้ลองทำ จอยอะ ของดี๊',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่',
    avatar: './student_boat.jpg',
    imagePosition: 'center top',
    school: 'โรงเรียนอุดมดรุณี',
    course: 'Bio Intensive II & A-Level'
  },
  {
    name: 'พี่ก๊อต (จิตธนา พูลอ้น)',
    text: 'เรียนกับพี่ต้นเข้าใจง่ายมากๆคับ มีวิธีสอนที่ทำให้เรื่องยากกลายเป็นง่าย',
    score: 'คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์',
    avatar: './student_got.jpg',
    imagePosition: 'center top',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'Bio Intensive Series'
  },
  {
    name: 'พี่แตมป์ (จิรัฏฐ์ เดชพงษ์)',
    text: 'เรียนกับพี่ต้นสนุกมากคับบ สอนแบบเข้าใจง่าย เป็นกันเองคับบ เวลาเรียนก็มีมุกแทรกแก้เครียดด้วย มีทริคมีเพลงประกอบเนื้อหาให้จำได้คับบ',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์',
    avatar: './student_stamp.jpg',
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

// Attach to global window object
window.BRAND_COLORS = BRAND_COLORS;
window.COURSES = COURSES;
window.FREE_TRIALS = FREE_TRIALS;
window.COUPONS = COUPONS;
window.ORDERS = ORDERS;
window.EXAM_QUESTIONS = EXAM_QUESTIONS;
window.FAQS = FAQS;
window.MOCK_STUDENTS = MOCK_STUDENTS;
window.CATEGORIES = CATEGORIES;
window.REVIEWS = REVIEWS;
window.ARTICLES = ARTICLES;
window.DEFAULT_SLIDES = DEFAULT_SLIDES;
