export const C = {
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
export const COURSES = [
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

export const FREE_TRIALS = [
  { id: 'ft1', title: 'คลิปทดลองเรียน Bio Intensive I: โครงสร้างเซลล์และกลไกการลำเลียงสาร', duration: '45 นาที', course: 'Bio Intensive I', imageUrl: '/1_0.png' },
  { id: 'ft2', title: 'คลิปทดลองเรียน Bio Intensive II: เทคนิคคำนวณโจทย์พันธุศาสตร์เมนเดล', duration: '35 นาที', course: 'Bio Intensive II', imageUrl: '/2_0.png' },
  { id: 'ft3', title: 'คลิปทดลองเรียน คอร์สพิเศษ สอวน.: เจาะลึกข้อสอบคัดเลือกค่าย 1', duration: '40 นาที', course: 'คอร์ส ติวเข้ม สอวน.', imageUrl: '/7_0.png' },
  { id: 'ft4', title: 'คลิปทดลองเรียน คอร์ส 99 บาท: สรุปสกัดเข้ม Quick Review ม.ปลาย', duration: '30 นาที', course: 'คอร์ส 99 บาท', imageUrl: '/11.png' }
];

export const CATEGORIES = [
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

export const REVIEWS = [
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

export const ARTICLES = [
  { id: 1, title: 'สรุป 10 จุดสำคัญเรื่องการสังเคราะห์ด้วยแสง (Photosynthesis)', date: '10 มี.ค. 2026', views: 1250, readTime: '5 นาที' },
  { id: 2, title: 'สกัด DNA ด้วยตนเองที่บ้าน! ขั้นตอนแล็บเสมือนง่ายๆ', date: '05 มี.ค. 2026', views: 890, readTime: '8 นาที' },
  { id: 3, title: 'โครงสร้างหัวใจและการสูบฉีดเลือด: เข้าใจด้วยเทคนิค Mind Map', date: '28 ก.พ. 2026', views: 1650, readTime: '4 นาที' }
];

export const DEFAULT_SLIDES = [
  { id: 'slide-1', bg1: '#EFF6FF', bg2: '#DBEAFE', label: '🔥 โปรต้อนรับเปิดเทอม', title: 'Bio Intensive I - VI Complete Set', desc: 'ลงทะเบียนเรียนคอร์สแพ็กคู่รับส่วนลดพิเศษทันที 30% พร้อมรับไฟล์ e-Book สรุปเนื้อหาฟรีตลอดชีพ', badgeText: 'ลดสูงสุด 30%', imageUrl: '', actionText: 'ดูคอร์สทั้งหมด', actionType: 'bundle', targetCourseId: '' },
  { id: 'slide-2', bg1: '#FEF2F2', bg2: '#FEE2E2', label: '⚡ คอร์สสุดประหยัด 99.-', title: 'คอร์ส 99 บาท: สรุปชีวะสกัดเข้ม Quick Review', desc: 'รวมเทคนิคสกัดเข้มจุดออกสอบบ่อยชีววิทยา ม.ปลาย สรุปสูตรลัดและแผนภาพ Mind Map พร้อมลุยทุกสนามสอบ', badgeText: 'ราคาพิเศษ 99.-', imageUrl: '', actionText: 'สมัครเรียน 99.-', actionType: 'course', targetCourseId: 'special-99-starter' }
];

export function formatPrice(n: number) { return Number(n).toLocaleString('th-TH'); }
export function pct(orig: number, cur: number) { return Math.round((1 - cur / orig) * 100); }

// ─────────────────────────────────────────────────────────────────────────────

export const EXAM_QUESTIONS = [
  { id: 1, q: '1. ออร์แกเนลล์ใดทำหน้าที่เป็นโรงไฟฟ้าหลักในการผลิต ATP ให้แก่เซลล์?', a: 'ไมโทคอนเดรีย', opts: ['คลอโรพลาสต์', 'ไมโทคอนเดรีย', 'กอลจิบอดี', 'ไลโซโซม'] },
  { id: 2, q: '2. กระบวนการใดพบการแบ่งนิวเคลียสแบบลดจำนวนโครโมโซมลงครึ่งหนึ่ง?', a: 'Meiosis', opts: ['Mitosis', 'Meiosis', 'Binary Fission', 'Budding'] },
  { id: 3, q: '3. ข้อใดคือคู่เบสที่ถูกต้องในโครงสร้างเกลียวคู่ของ DNA?', a: 'A คู่กับ T, G คู่กับ C', opts: ['A คู่กับ U, G คู่กับ C', 'A คู่กับ G, T คู่กับ C', 'A คู่กับ T, G คู่กับ C', 'A คู่กับ C, T คู่กับ G'] },
];

