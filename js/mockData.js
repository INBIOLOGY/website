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
    title: 'Bio Intensive I: Introbiology & Biochemistry (Updated)',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1190, originalPrice: 2500,
    badge: 'Bio Intensive I', badgeBg: BRAND_COLORS.navy,
    tag: 'ม.4 & ติวสอบ', tagBg: '#FEF2F2', tagColor: '#991B1B',
    description: "ปูพื้นฐานบทนำชีววิทยา เคมีที่เป็นพื้นฐานของสิ่งมีชีวิต (Biochemistry) โครงสร้างและหน้าที่ของเซลล์ ออร์แกเนลล์ เยื่อหุ้มเซลล์ การลำเลียงสาร และการแบ่งเซลล์อย่างลึกซึ้ง",
    hours: 15, validity: 365, ebook: true,
    categorySlug: 'bio-intensive',
    termBadge: 'ม.4 เทอม 1',
    topicHighlights: [
      "บทนำชีววิทยา & ทักษะการสืบเสาะ",
      "เคมีพื้นฐานของสิ่งมีชีวิต (สารชีวโมเลกุล)",
      "โครงสร้างและหน้าที่ของเซลล์ & ออร์แกเนลล์",
      "กลไกการลำเลียงสารผ่านเยื่อหุ้มเซลล์",
      "เอนไซม์และปฏิกิริยาเคมีในสิ่งมีชีวิต",
      "วัฏจักรเซลล์และการแบ่งเซลล์ Mitosis / Meiosis"
],
    ebookInfo: {
      "title": "e-Book สรุปเข้ม Bio Intensive I (ฉบับพิมพ์ 4 สี 140 หน้า)",
      "pages": 140,
      "fileSize": "24.5 MB",
      "filename": "INBIOLOGY_Bio_Intensive_I_Handout.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1789999758952",
            "title": "ลักษณะของสิ่งมีชีวิต 1",
            "duration": 45,
            "videoUrl": "https://youtu.be/lFmH7mWF08g?si=QsYQ_B29pe-LSy2z"
      },
      {
            "ep": "EP.2",
            "id": "l-1789999777311",
            "title": "ลักษณะของสิ่งมีชีวิต 2",
            "duration": 48,
            "videoUrl": "https://youtu.be/ZeU-6tx5ZGE?si=cp8JXwgzafkNmIiP"
      },
      {
            "ep": "EP.3",
            "id": "l-1789999801664",
            "title": "ชีวเคมี 1",
            "duration": 50,
            "videoUrl": "https://youtu.be/wA71Q6oNgow?si=4zHWxlayBJA0Ti28"
      },
      {
            "ep": "EP.4",
            "id": "l-1789999817808",
            "title": "ชีวเคมี 2",
            "duration": 50,
            "videoUrl": "https://youtu.be/eRCPOZ0F1jE?si=aTUoSqx1HtQ6NJmd"
      },
      {
            "ep": "EP.5",
            "id": "l-1789999835186",
            "title": "หมู่ฟังชันก์",
            "duration": 65,
            "videoUrl": "https://youtu.be/AoKaB0q88wc?si=5s1dJqUCFAt8MTqn"
      },
      {
            "ep": "EP.6",
            "id": "l-1789999860617",
            "title": "คาร์โบไฮเดรต 1",
            "duration": 49,
            "videoUrl": "https://youtu.be/I1yOLqEQ56Q?si=4Da6UDtefTUMRfRr"
      },
      {
            "ep": "EP.7",
            "id": "l-1789999884825",
            "title": "คาร์โบไฮเดรต 2",
            "duration": 49,
            "videoUrl": "https://youtu.be/lRDkQN1Pgh8?si=tgyHM2KoCqlSchD-"
      },
      {
            "ep": "EP.8",
            "id": "l-1789999900272",
            "title": "ไขมัน",
            "duration": 63,
            "videoUrl": "https://youtu.be/sFmrDKYvVLQ?si=qaLMnW2ii85j1iMm"
      },
      {
            "ep": "EP.9",
            "id": "l-1789999917561",
            "title": "โปรตีน",
            "duration": 52,
            "videoUrl": "https://youtu.be/9jMK3zt9dDM?si=WSQjndqFlascmt9w"
      },
      {
            "ep": "EP.10",
            "id": "l-1789999931786",
            "title": "กรดนิวคลิอิก",
            "duration": 41,
            "videoUrl": "https://youtu.be/j2JDYdX1yvU?si=Fz9FXI9rUSlVYkm0"
      },
      {
            "ep": "EP.11",
            "id": "l-1789999943314",
            "title": "ปฏิกิริยาเคมีในสิ่งมีชีวิต",
            "duration": 41,
            "videoUrl": "https://youtu.be/WsQhOwB4614?si=Ue_sOIstCugM_VuK"
      },
      {
            "ep": "EP.12",
            "id": "l-1789999976034",
            "title": "เอนไซม์",
            "duration": 68,
            "videoUrl": "https://youtu.be/4DP3OkBwQxM?si=ryIHrSll60J_C5vX"
      },
      {
            "ep": "EP.13",
            "id": "l-1789999989867",
            "title": "ทบทวนแบบฝึกหัด",
            "duration": 37,
            "videoUrl": "https://youtu.be/85gEBaPFzo0?si=1WqfdcXBStbYO1zW"
      },
      {
            "ep": "EP.14",
            "id": "l-1790000008258",
            "title": "กล้องจุลทรรศน์",
            "duration": 66,
            "videoUrl": "https://youtu.be/z1a1Bh05eqY?si=ir4hRqau_kBLAjPj"
      },
      {
            "ep": "EP.15",
            "id": "l-1790000024866",
            "title": "กล้องจุลทรรศน์ 2",
            "duration": 39,
            "videoUrl": "https://youtu.be/VtJ5gWJIUdc?si=SO5sNZkibktiFU5h"
      },
      {
            "ep": "EP.16",
            "id": "l-1790000043402",
            "title": "โครงสร้างของเซลล์ 1",
            "duration": 39,
            "videoUrl": "https://youtu.be/k7o-l4F3sZ4?si=Eeckfu7ZKlOaybxf"
      },
      {
            "ep": "EP.17",
            "id": "l-1790000068498",
            "title": "โครงสร้างของเซลล์ 2",
            "duration": 38,
            "videoUrl": "https://youtu.be/HWDnE-RZsiM?si=J3J4whonpe4k-xxB"
      },
      {
            "ep": "EP.18",
            "id": "l-1790000092866",
            "title": "การลำเลียงสารผ่านเซลล์",
            "duration": 58,
            "videoUrl": "https://youtu.be/sCjXCj05880?si=GH3my80eXG4wLylg"
      },
      {
            "ep": "EP.19",
            "id": "l-1790000132987",
            "title": "การลำเลียงสารผ่านเซลล์ 2",
            "duration": 26,
            "videoUrl": "https://youtu.be/azjIbjfKvI8?si=7AVRZtzbc6G8JNUp"
      }
],
    materials: [
      {
            "id": "mat-1790171068729",
            "url": "https://drive.google.com/file/d/11oGi9bapTGg80dUZCnT8nY024dwaqhBG/view?usp=sharing",
            "pages": "",
            "title": "Class 1",
            "category": "e-Book PDF",
            "fileSize": "202 หน้า",
            "filename": "Class_1.pdf",
            "isPrimary": true,
            "description": "เอกสารประกอบการเรียน จัดเตรียมโดยพี่ต้น INBIOLOGY"
      }
],
    imageUrl: './course-cover-bio-intensive-1.jpg',
    rating: 4.9, reviewCount: 450, Level: 'ม.4', Category: 'Bio Intensive'
  },
  {
    id: 'c-1790179918330',
    title: 'Bio Intensive II: Genetic & Evolution',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1990, originalPrice: 2500,
    badge: 'Bio Intensive II', badgeBg: '#1E3A8A',
    tag: 'ม.4 & ติวสอบ', tagBg: '#EDE9FE', tagColor: '#5B21B6',
    description: "ม.4 เทอม 2 เนื้อหา พันธุศาสตร์และวิวัฒนาการ (genetic and evolution) 🎬 ประกาศสำคัญ! อัปเดตตารางใหม่ครับ 🎥  ✨ เริ่มอัดเทปใหม่: 31 ตุลาคมนี้!  📌 ปักหมุดรอเลย: พบกับคลิปใหม่ทุก วันเสาร์ เวลา 20.00 น. ⏰💥",
    hours: 35, validity: 365, ebook: true,
    categorySlug: 'bio-intensive',
    termBadge: 'ม.4 เทอม 2',
    topicHighlights: [
      "พันธุศาสตร์ของเมนเดล & กฎแห่งการแยกตัว",
      "ส่วนขยายพันธุศาสตร์เมนเดล (Incomplete/Codominance)",
      "โครงสร้าง DNA & RNA และการจำลองตัวของ DNA",
      "กระบวนการถอดรหัสและการแปลรหัสพันธุกรรม",
      "เทคโนโลยีทางดีเอ็นเอ (Recombinant, PCR, Gel)",
      "หลักฐานและกลไกการเกิดวิวัฒนาการ"
    ],
    ebookInfo: {
      "title": "e-Book เจาะลึกพันธุศาสตร์ & DNA Technology (135 หน้า)",
      "pages": 135,
      "fileSize": "22.8 MB",
      "filename": "INBIOLOGY_Bio_Intensive_II_Handout.pdf"
    },
    lessons: [],
    materials: [],
    imageUrl: './course-cover-c-1790176559102.jpg',
    rating: 5, reviewCount: 380, Level: 'ม.4', Category: 'Bio Intensive'
  },
  {
    id: 'bio-intensive-3',
    title: 'Bio Intensive III: Plant Biology',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1290, originalPrice: 2400,
    badge: 'Bio Intensive III', badgeBg: '#10B981',
    tag: 'ม.5 & ติวสอบ', tagBg: '#D1FAE5', tagColor: '#065F46',
    description: "เจาะลึกชีววิทยาของพืช โครงสร้างและเนื้อเยื่อพืช กระบวนการสังเคราะห์ด้วยแสง (Photosynthesis) การลำเลียงของพืช และฮอร์โมนพืช",
    hours: 20, validity: 365, ebook: true,
    categorySlug: 'bio-intensive',
    termBadge: 'ม.5 เทอม 1',
    topicHighlights: [
      "โครงสร้างและเนื้อเยื่อพืชไร้ท่อ/มีท่อลำเลียง",
      "กระบวนการสังเคราะห์ด้วยแสง (Light Reaction & Calvin)",
      "การลำเลียงน้ำและแร่ธาตุในพืช (Xylem & Phloem)",
      "ฮอร์โมนพืช & การตอบสนองต่อสิ่งแวดล้อม"
],
    ebookInfo: {
      "title": "e-Book สรุปพฤกษศาสตร์ & การสังเคราะห์ด้วยแสง (120 หน้า)",
      "pages": 120,
      "fileSize": "19.4 MB",
      "filename": "INBIOLOGY_Bio_Intensive_III_Handout.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1789906872892",
            "title": "ทบทวนเรื่องพืช",
            "duration": 45,
            "videoUrl": "https://youtu.be/TuA3HH4B_Ag?si=ZnR1Pbp1XosEurTe"
      },
      {
            "ep": "EP.2",
            "id": "l-1789906938766",
            "title": "โครงสร้างดอก",
            "duration": 59,
            "videoUrl": "https://youtu.be/t1HZNr3yTmg?si=eS4T-0PIpvXQzjYZ"
      },
      {
            "ep": "EP.3",
            "id": "l-1789906965305",
            "title": "การจำแนกโครงสร้างดอก",
            "duration": 74,
            "videoUrl": "https://youtu.be/OPAaiDaR9ec?si=j6MFdCy9M77U6fDR"
      },
      {
            "ep": "EP.4",
            "id": "l-1789907008915",
            "title": "การสร้างเซลล์สืบพันธุ์เพศผู้",
            "duration": 74,
            "videoUrl": "https://youtu.be/NPcTkgaxP-M?si=C1VLfnAGPyPzAXDb"
      },
      {
            "ep": "EP.5",
            "id": "l-1789907037787",
            "title": "การสร้างเซลล์สืบพันธุ์เพศเมียและการปฏิสนธิ",
            "duration": 61,
            "videoUrl": "https://youtu.be/rkaTsKdkYbs?si=vVaGtXIQpQxGUbES"
      },
      {
            "ep": "EP.6",
            "id": "l-1789907057844",
            "title": "ผล 1",
            "duration": 49,
            "videoUrl": "https://youtu.be/S8sgeyeaIE4?si=U9brRrEAfAcl2UmU"
      },
      {
            "ep": "EP.7",
            "id": "l-1789907137264",
            "title": "เมล็ด",
            "duration": 73,
            "videoUrl": "https://youtu.be/bxWNmujT-ow?si=5oNg-ouXB_1F6eqS"
      },
      {
            "ep": "EP.8",
            "id": "l-1789907174704",
            "title": "แบบฝึกหัด",
            "duration": 30,
            "videoUrl": "https://youtu.be/CajA_jLqMnc?si=l8jS9bUS2VPi75uN"
      },
      {
            "ep": "EP.9",
            "id": "l-1789907195555",
            "title": "เนื้อเยื่อพืช 1",
            "duration": 44,
            "videoUrl": "https://youtu.be/QZ6lhQvqZRE?si=VxTrlLVxsUsAg3zA"
      },
      {
            "ep": "EP.10",
            "id": "l-1789907222403",
            "title": "เนื้อเยื่อพืช 2",
            "duration": 54,
            "videoUrl": "https://youtu.be/Fw-2ezcbmeo?si=X-DSawqid4lB-Tkk"
      },
      {
            "ep": "EP.11",
            "id": "l-1789907253510",
            "title": "เนื้อเยื่อพืช 3",
            "duration": 27,
            "videoUrl": "https://youtu.be/UmIyGYGgG6c?si=lnr3FhNjvYW2IjQm"
      },
      {
            "ep": "EP.12",
            "id": "l-1789907279317",
            "title": "ราก",
            "duration": 80,
            "videoUrl": "https://youtu.be/Itkhvs4qkFI?si=9wPm_rZfvmhwilBq"
      },
      {
            "ep": "EP.13",
            "id": "l-1789907294741",
            "title": "ลำต้น 1",
            "duration": 26,
            "videoUrl": "https://youtu.be/O1ja-6aNjMQ?si=D9eO5XkeqNcbtSq0"
      },
      {
            "ep": "EP.14",
            "id": "l-1789907306473",
            "title": "ลำต้น 2",
            "duration": 55,
            "videoUrl": "https://youtu.be/DBxqJYyLCq8?si=tED02rBDBtDdUFzH"
      },
      {
            "ep": "EP.15",
            "id": "l-1789907327417",
            "title": "ใบ",
            "duration": 36,
            "videoUrl": "https://youtu.be/9nVYBRevkNA?si=KQioP9RmITyToe58"
      },
      {
            "ep": "EP.16",
            "id": "l-1789907344008",
            "title": "การลำเลียง 1",
            "duration": 52,
            "videoUrl": "https://youtu.be/-Fjjx6PpZZM?si=7RkgB4clnARYIdwl"
      },
      {
            "ep": "EP.17",
            "id": "l-1789907363099",
            "title": "การลำเลียง 2",
            "duration": 40,
            "videoUrl": "https://youtu.be/At7NLyiQggs?si=fF9Vk52uTZ8A-7Xb"
      },
      {
            "ep": "EP.18",
            "id": "l-1789907379644",
            "title": "ปฏิกิริยาแสง",
            "duration": 41,
            "videoUrl": "https://youtu.be/rqL_5clUHAg?si=5Gbf3_wZBvQZkLvJ"
      },
      {
            "ep": "EP.19",
            "id": "l-1789907549017",
            "title": "C4 CAM , ปัจจัยในการสังเคราะห์ด้วยแสง",
            "duration": 34,
            "videoUrl": "https://youtu.be/a5ayZuyUMPQ?si=IyDQrVTVpFtJsJzB"
      },
      {
            "ep": "EP.20",
            "id": "l-1789907567801",
            "title": "สังเคราะห์ด้วยแสง 2",
            "duration": 45,
            "videoUrl": "https://youtu.be/tduEMumx_3o?si=hHayP3QqTRp38HlN"
      },
      {
            "ep": "EP.21",
            "id": "l-1789907586603",
            "title": "สังเคราะห์ด้วยแสง 3",
            "duration": 45,
            "videoUrl": "https://youtu.be/YCxHhot6TdI?si=hTN3nfQmONjkXGbl"
      },
      {
            "ep": "EP.22",
            "id": "l-1789907604323",
            "title": "สังเ��ราะห์ด้วยแสง 4",
            "duration": 20,
            "videoUrl": "https://youtu.be/B48kxVLr9Qw?si=T5Rd2517dt26Z8R_"
      },
      {
            "ep": "EP.23",
            "id": "l-1789907624155",
            "title": "สังเคราะห์ด้วยแสง 5",
            "duration": 62,
            "videoUrl": "https://youtu.be/gaJECoJ7-9o?si=M952cYTXte_wFGCG"
      },
      {
            "ep": "EP.24",
            "id": "l-1789907652005",
            "title": "ฮอร์โมนพืช",
            "duration": 70,
            "videoUrl": "https://youtu.be/mKVTk2YH3mc?si=RA3FYJnWJp6b3Bp6"
      }
],
    materials: [
      {
            "id": "mat-1789907790593",
            "url": "https://drive.google.com/file/d/1LJbqUM-qepjl8B0PmIZ8ZIQI6N98K6uM/view?usp=sharing",
            "pages": "",
            "title": "Class 3 ( World of Plant )",
            "category": "e-Book PDF",
            "fileSize": "190 หน้า",
            "filename": "Class_3___World_of_Plant__.pdf",
            "isPrimary": true,
            "description": "เอกสารประกอบการเรียน จัดเตรียมโดยพี่ต้น INBIOLOGY"
      }
],
    imageUrl: './course-cover-3.jpg',
    rating: 4.9, reviewCount: 310, Level: 'ม.5', Category: 'Bio Intensive'
  },
  {
    id: 'bio-intensive-4',
    title: 'Bio Intensive IV: Animal Biology I',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1490, originalPrice: 2800,
    badge: 'Bio Intensive IV', badgeBg: '#F59E0B',
    tag: 'ม.5-ม.6 & ติวสอบ', tagBg: '#FEF3C7', tagColor: '#92400E',
    description: "กายวิภาคศาสตร์และสรีรวิทยาของสัตว์และมนุษย์ พาร์ต 1: ระบบย่อยอาหาร การหมุนเวียนเลือด ระบบหายใจ และระบบขับถ่าย",
    hours: 12, validity: 365, ebook: true,
    categorySlug: 'bio-intensive',
    termBadge: 'ม.5 เทอม 2',
    topicHighlights: [
      "ระบบย่อยอาหารและการดูดซึมสารอาหารในมนุษย์",
      "โครงสร้างหัวใจ การหมุนเวียนเลือด และระบบน้ำเหลือง",
      "ระบบการแลกเปลี่ยนแก๊สและการหายใจ",
      "โครงสร้างไตและการรักษาสมดุลน้ำในร่างกาย (Nephron)"
],
    ebookInfo: {
      "title": "e-Book สรีรวิทยาสัตว์ พาร์ต 1 ระบบร่างกายมนุษย์ (150 หน้า)",
      "pages": 150,
      "fileSize": "26.1 MB",
      "filename": "INBIOLOGY_Bio_Intensive_IV_Handout.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1790168970567",
            "title": "ระบบย่อยอาหารของสัตว์",
            "duration": 76,
            "videoUrl": "https://youtu.be/sSjsePeYESo?si=_fm6HTWGuAYpLgpp"
      },
      {
            "ep": "EP.2",
            "id": "l-1790168989496",
            "title": "ระบบย่อยอาหารของสัตว์ 2",
            "duration": 25,
            "videoUrl": "https://youtu.be/-7oFfAtWyCk?si=kcczZqjOnDy2EgSY"
      },
      {
            "ep": "EP.3",
            "id": "l-1790169015223",
            "title": "ระบบย่อยอาหารของสัตว์ 3",
            "duration": 68,
            "videoUrl": "https://youtu.be/FBk12MmhOqg?si=lUHZ-_BtcRCoX2gk"
      },
      {
            "ep": "EP.4",
            "id": "l-1790169161767",
            "title": "ระบบย่อยอาหารของสัตว์ 4",
            "duration": 31,
            "videoUrl": "https://youtu.be/xOlnJXr308Y?si=9ShhO31lfS7hBqIU"
      },
      {
            "ep": "EP.5",
            "id": "l-1790169052671",
            "title": "ระบบหมุนเ���ียนเลือด",
            "duration": 88,
            "videoUrl": "https://youtu.be/acni9LJV3Tc?si=8apcAtpfcJkZirUX"
      },
      {
            "ep": "EP.6",
            "id": "l-1790169139375",
            "title": "ระบบหมุนเวียนเลือด 2",
            "duration": 61,
            "videoUrl": "https://youtu.be/rCZ5aZoV-hQ?si=4Jyec14HTNxghMSX"
      },
      {
            "ep": "EP.7",
            "id": "l-1790169245175",
            "title": "ระบบหมุนเวียนเลือด 3",
            "duration": 25,
            "videoUrl": "https://youtu.be/NGigbqzSu_c?si=IZbxp-gw9fGi-yzB"
      },
      {
            "ep": "EP.8",
            "id": "l-1790169270367",
            "title": "ระบบหมุนน้ำเหลือง",
            "duration": 37,
            "videoUrl": "https://youtu.be/-0X66gZqnk4?si=XVXpAkRpIXBBgOf_"
      },
      {
            "ep": "EP.9",
            "id": "l-1790169303775",
            "title": "ระบบหมุนเเลกเปลี่ยนเเก๊ส",
            "duration": 58,
            "videoUrl": "https://youtu.be/4vbE3hd5uYA?si=SzZuFU2kMnp45T2l"
      },
      {
            "ep": "EP.10",
            "id": "l-1790169323375",
            "title": "ระบบขับถ่าย 1",
            "duration": 55,
            "videoUrl": "https://youtu.be/pU5VM0HrQ_Y?si=VF1KoKsXg2x1Zpju"
      },
      {
            "ep": "EP.11",
            "id": "l-1790169339406",
            "title": "ระบบขับถ่าย 2",
            "duration": 38,
            "videoUrl": "https://youtu.be/0c0FqxRda4o?si=qvFarZhv3kEhgOxR"
      },
      {
            "ep": "EP.12",
            "id": "l-1790169352919",
            "title": "ระบบขับถ่าย 3",
            "duration": 73,
            "videoUrl": "https://youtu.be/v37tsP9fr3I?si=tVi4M0OROpTMVMmD"
      },
      {
            "ep": "EP.13",
            "id": "l-1790169377023",
            "title": "ระบบภูมิคุ้มกัน",
            "duration": 29,
            "videoUrl": "https://youtu.be/gpUWjVIjhOA?si=hPBdTfPXayZDdwnZ"
      },
      {
            "ep": "EP.14",
            "id": "l-1790169389710",
            "title": "ระบบภูมิคุ้มกัน 2",
            "duration": 77,
            "videoUrl": "https://youtu.be/HbqGfLBGOMw?si=6ZPFCSvNyWFt1sWj"
      }
],
    materials: [
      {
            "id": "mat-1790170849890",
            "url": "https://drive.google.com/file/d/1KXlROwpkQ3rPDRGtijpWagQo7FGre4mJ/view?usp=sharing",
            "pages": "",
            "title": "Class IV",
            "category": "e-Book PDF",
            "fileSize": "192  หน้า",
            "filename": "Class_IV.pdf",
            "isPrimary": true,
            "description": "เอกสารประกอบการเรียน จัดเตรียมโดยพี่ต้น INBIOLOGY"
      }
],
    imageUrl: './course-cover-4.jpg',
    rating: 4.8, reviewCount: 415, Level: 'ม.5', Category: 'Bio Intensive'
  },
  {
    id: 'bio-intensive-5',
    title: 'Bio Intensive V: Animal Biology II (Control & Coordination)',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1490, originalPrice: 2800,
    badge: 'Bio Intensive V', badgeBg: '#8B5CF6',
    tag: 'ม.6 & ติวสอบ', tagBg: '#F3E8FF', tagColor: '#6B21A8',
    description: "กายวิภาคศาสตร์และสรีรวิทยาของสัตว์และมนุษย์ พาร์ต 2: ระบบประสาทและอวัยวะรับความรู้สึก ระบบต่อมไร้ท่อและฮอร์โมน ระบบภูมิคุ้มกัน ระบบสืบพันธุ์ และการเจริญเติบโต",
    hours: 17, validity: 365, ebook: true,
    categorySlug: 'bio-intensive',
    termBadge: 'ม.6 เทอม 1',
    topicHighlights: [
      "การทำงานของเซลล์ประสาทและไซแนปส์ (Action Potential)",
      "ระบบสมอง ไขสันหลัง และระบบประสาทอัตโนมัติ",
      "ระบบต่อมไร้ท่อและการควบคุมสมดุลฮอร์โมน",
      "ระบบภูมิคุ้มกันร่างกายและการตอบสนองต่อเชื้อโรค",
      "ระบบสืบพันธุ์และการเจริญเติบโตของเอ็มบริโอ"
],
    ebookInfo: {
      "title": "e-Book สรีรวิทยาสัตว์ พาร์ต 2 ระบบประสาทและฮอร์โมน (160 หน้า)",
      "pages": 160,
      "fileSize": "31.2 MB",
      "filename": "INBIOLOGY_Bio_Intensive_V_Handout.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1790169644269",
            "title": "Nervous system 1",
            "duration": 44,
            "videoUrl": "https://youtu.be/AC2xjA0Y4Jg?si=XeZg-NUAbUsxGykR"
      },
      {
            "ep": "EP.2",
            "id": "l-1790169659277",
            "title": "Nervous system 2",
            "duration": 49,
            "videoUrl": "https://youtu.be/h0EwN0nA-G4?si=ez4nq56eULZEjPkl"
      },
      {
            "ep": "EP.3",
            "id": "l-1790169675813",
            "title": "Nervous system 3",
            "duration": 102,
            "videoUrl": "https://youtu.be/4ypYY7ikAh8?si=yUmwTkXze2ZsiXon"
      },
      {
            "ep": "EP.4",
            "id": "l-1790169690701",
            "title": "Nervous system 4",
            "duration": 42,
            "videoUrl": "https://youtu.be/MFGvwtJ6C-M?si=oXJtlBqBSShrtiZw"
      },
      {
            "ep": "EP.5",
            "id": "l-1790169703165",
            "title": "Nervous system 5",
            "duration": 62,
            "videoUrl": "https://youtu.be/Zy_AljzLONU?si=IEc_6mOvw20XcC2-"
      },
      {
            "ep": "EP.6",
            "id": "l-1790169728750",
            "title": "Nervous system 6",
            "duration": 53,
            "videoUrl": "https://youtu.be/umzS6MomjJw?si=Okqe1vhXpd9l4YUv"
      },
      {
            "ep": "EP.7",
            "id": "l-1790169919249",
            "title": "Musculosskeleton system 1",
            "duration": 48,
            "videoUrl": "https://youtu.be/SI-WUUk6W9Y?si=Q7TFgtYfnCPS0wQj"
      },
      {
            "ep": "EP.8",
            "id": "l-1790169927860",
            "title": "Musculosskeleton system 2",
            "duration": 36,
            "videoUrl": "https://youtu.be/4_MGfFfDc9w?si=jvVJ84yG9zC_3EJj"
      },
      {
            "ep": "EP.9",
            "id": "l-1790170046300",
            "title": "Musculosskeleton system 3",
            "duration": 45,
            "videoUrl": "https://youtu.be/AI8NghcKq1A?si=Jo8PqRTLGSEXWWt4"
      },
      {
            "ep": "EP.10",
            "id": "l-1790170062564",
            "title": "Musculosskeleton system 4",
            "duration": 36,
            "videoUrl": "https://youtu.be/uE0l5w7p-IU?si=lj6r-oJ_zZxJDrvc"
      },
      {
            "ep": "EP.11",
            "id": "l-1790169947277",
            "title": "Endocrine system ระบบต่อมไร้ท่อ 1",
            "duration": 36,
            "videoUrl": "https://youtu.be/LjxNfKgECzk?si=p7SJLDX72Upx53WR"
      },
      {
            "ep": "EP.12",
            "id": "l-1790169961548",
            "title": "Endocrine system ระบบต่อมไร้ท่อ 2",
            "duration": 75,
            "videoUrl": "https://youtu.be/IN41IrbhswA?si=8HV6zfa_3PyZlwax"
      },
      {
            "ep": "EP.13",
            "id": "l-1790169980597",
            "title": "Endocrine system ระบบต่อมไร้ท่อ 3",
            "duration": 52,
            "videoUrl": "https://youtu.be/y1rnlaEjkB0?si=j4uzE7gloBjJzu7Q"
      },
      {
            "ep": "EP.14",
            "id": "l-1790169993196",
            "title": "Endocrine system ระบบต่อมไร้ท่อ 4",
            "duration": 36,
            "videoUrl": "https://youtu.be/SRQ-zQEBMmY?si=qjhdjOKCMEATtcE7"
      },
      {
            "ep": "EP.15",
            "id": "l-1790170152621",
            "title": "Reproductive system 1",
            "duration": 36,
            "videoUrl": "https://youtu.be/KIqQV1jXhhI?si=nQT4SZyAXlqbEb40"
      },
      {
            "ep": "EP.16",
            "id": "l-1790170167580",
            "title": "Reproductive system 2",
            "duration": 49,
            "videoUrl": "https://youtu.be/KUWdBsK8nkk?si=j9zbNVV10fWX9uip"
      },
      {
            "ep": "EP.17",
            "id": "l-1790170183900",
            "title": "Reproductive system 3",
            "duration": 68,
            "videoUrl": "https://youtu.be/YxmyUcyb1xg?si=b3gyBwUlEK79fXDy"
      },
      {
            "ep": "EP.18",
            "id": "l-1790170198582",
            "title": "Reproductive system 4",
            "duration": 33,
            "videoUrl": "https://youtu.be/2x1PGS2toRo?si=09AtY6vE5mjhySEF"
      },
      {
            "ep": "EP.19",
            "id": "l-1790170215518",
            "title": "Reproductive system",
            "duration": 48,
            "videoUrl": "https://youtu.be/UaMvKN3LCVQ?si=qfE_l-NDSxm1yFBJ"
      },
      {
            "ep": "EP.20",
            "id": "l-1790170242172",
            "title": "Reproductive system 6",
            "duration": 43,
            "videoUrl": "https://youtu.be/_ZnPj4y9cVU?si=0TZeLSiOji2Dizrj"
      }
],
    materials: [
      {
            "id": "mat-1790170796499",
            "url": "https://drive.google.com/file/d/1ywR5B_o1BsDyFBe4lJV_u3wYgvh23fli/view?usp=sharing",
            "pages": "",
            "title": "Class V",
            "category": "e-Book PDF",
            "fileSize": "202 หน้า",
            "filename": "Class_V.pdf",
            "isPrimary": true,
            "description": "เอกสารประกอบการเรียน จัดเตรียมโดยพี่ต้น INBIOLOGY"
      }
],
    imageUrl: './course-cover-bio-intensive-5.jpg',
    rating: 4.95, reviewCount: 390, Level: 'ม.6', Category: 'Bio Intensive'
  },
  {
    id: 'bio-intensive-6',
    title: 'Bio Intensive VI: Ecology, Diversity & Animal Behavior',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1390, originalPrice: 2600,
    badge: 'Bio Intensive VI', badgeBg: '#059669',
    tag: 'ม.6 & ติวสอบ', tagBg: '#ECFDF5', tagColor: '#047857',
    description: "นิเวศวิทยา ระบบนิเวศ การถ่ายทอดพลังงาน ประชากรศาสตร์ พฤติกรรมของสัตว์ ความหลากหลายทางชีวภาพ (Biodiversity) อาณาจักรสิ่งมีชีวิต และปัญหาสิ่งแวดล้อมโลก",
    hours: 20, validity: 365, ebook: true,
    categorySlug: 'bio-intensive',
    termBadge: 'ม.6 เทอม 2',
    topicHighlights: [
      "พฤติกรรมของสัตว์ (Innate & Learned Behavior)",
      "ระบบนิเวศ การหมุนเวียนสาร และวัฏจักรชีวิต",
      "ความหลากหลายทางชีวภาพและ 5 อาณาจักรสิ่งมีชีวิต",
      "ประชากรศาสตร์และวิกฤตสิ่งแวดล้อมโลก"
],
    ebookInfo: {
      "title": "e-Book นิเวศวิทยา & ความหลากหลายทางชีวภาพ (130 หน้า)",
      "pages": 130,
      "fileSize": "21.0 MB",
      "filename": "INBIOLOGY_Bio_Intensive_VI_Handout.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1789908029929",
            "title": "ความหลากหลายทางชีวภาพ",
            "duration": 84,
            "videoUrl": "https://youtu.be/wAmXNtGVjxY?si=_bc1Y7vPxeUPJIpS"
      },
      {
            "ep": "EP.2",
            "id": "l-1789908053064",
            "title": "ความหลากหลายทางชีวภาพ",
            "duration": 48,
            "videoUrl": "https://youtu.be/Dn8p0z16h80?si=locx-GVX6summzHY"
      },
      {
            "ep": "EP.3",
            "id": "l-1789908072680",
            "title": "ไวรัส และ แบคทีเรีย",
            "duration": 40,
            "videoUrl": "https://youtu.be/OxDcKaF9Mtg?si=-0bGVQ4m2HDxRHMU"
      },
      {
            "ep": "EP.4",
            "id": "l-1789908113115",
            "title": "แบคทีเรีย",
            "duration": 92,
            "videoUrl": "https://youtu.be/EzoelRbrrZ0?si=txootbWADaI-BNyE"
      },
      {
            "ep": "EP.5",
            "id": "l-1789908125746",
            "title": "แบคทีเรีย",
            "duration": 19,
            "videoUrl": "https://youtu.be/5Y3Hu9bJR28?si=9lcJlAkCDgVjAisT"
      },
      {
            "ep": "EP.6",
            "id": "l-1789908159413",
            "title": "โพรทิสตา",
            "duration": 37,
            "videoUrl": "https://youtu.be/upCa8AtoOGY?si=rluRH8WmzQBAKBVE"
      },
      {
            "ep": "EP.7",
            "id": "l-1789908176060",
            "title": "โพรทิสตา",
            "duration": 87,
            "videoUrl": "https://youtu.be/hsgzR-5PXhE?si=yP-Nlvox-l8c9poJ"
      },
      {
            "ep": "EP.8",
            "id": "l-1789908185204",
            "title": "ฟังไจ",
            "duration": 69,
            "videoUrl": "https://youtu.be/uSs4ZIO21Uw?si=BGlhUv7EJwy_aTvu"
      },
      {
            "ep": "EP.9",
            "id": "l-1789908226006",
            "title": "Plantae",
            "duration": 55,
            "videoUrl": "https://youtu.be/XsNKaAIb8cI?si=Q0h0UD8Db5Q8yScU"
      },
      {
            "ep": "EP.10",
            "id": "l-1789908235430",
            "title": "Plantae",
            "duration": 25,
            "videoUrl": "https://youtu.be/JNU2CUsrJrk?si=pDgVWD2cm2H4ewg0"
      },
      {
            "ep": "EP.11",
            "id": "l-1789908247918",
            "title": "Plantae",
            "duration": 60,
            "videoUrl": "https://youtu.be/S4tmgrYGkk8?si=-dPL7P_aBZqftKu0"
      },
      {
            "ep": "EP.12",
            "id": "l-1789908260414",
            "title": "Plantae",
            "duration": 45,
            "videoUrl": "https://youtu.be/tUItWscI3gk?si=c2DeN0eqE1R6t0ie"
      },
      {
            "ep": "EP.13",
            "id": "l-1789908293704",
            "title": "Plantae & Animal",
            "duration": 47,
            "videoUrl": "https://youtu.be/Z554JPH3AxQ?si=Wviji1Cm5ul_wg18"
      },
      {
            "ep": "EP.14",
            "id": "l-1789908358586",
            "title": "Animal",
            "duration": 20,
            "videoUrl": "https://youtu.be/g70SaS2Es4o?si=CUOc37P4srm087gU"
      },
      {
            "ep": "EP.15",
            "id": "l-1789908391666",
            "title": "Animal Cnidaria",
            "duration": 42,
            "videoUrl": "https://youtu.be/8I_7Am7Qpco?si=AAErX4RZ53XlWvml"
      },
      {
            "ep": "EP.16",
            "id": "l-1789908407946",
            "title": "Animal Platyhelminthes to Mollusca",
            "duration": 55,
            "videoUrl": "https://youtu.be/MO-gMtZ1_t0?si=EYcvDz8j0hL8jHOk"
      },
      {
            "ep": "EP.17",
            "id": "l-1789908438148",
            "title": "Animal Arthropoda and Echinodermata",
            "duration": 51,
            "videoUrl": "https://youtu.be/5v4TElRnYok?si=nk7IGD8AgJ_aed0O"
      },
      {
            "ep": "EP.18",
            "id": "l-1789908460340",
            "title": "Chordata",
            "duration": 62,
            "videoUrl": "https://youtu.be/k4RszNSFJaM?si=LQ7z1laK34IlBpK9"
      },
      {
            "ep": "EP.19",
            "id": "l-1789908473238",
            "title": "Ecosystem",
            "duration": 58,
            "videoUrl": "https://youtu.be/evVxEp6G2a8?si=LNrIyi-1032doxNs"
      },
      {
            "ep": "EP.20",
            "id": "l-1789908495486",
            "title": "Biome",
            "duration": 39,
            "videoUrl": "https://youtu.be/aZz53Qa_z9M?si=wDhu3dWJjlyFOXaB"
      },
      {
            "ep": "EP.21",
            "id": "l-1789908512382",
            "title": "Energy flow",
            "duration": 39,
            "videoUrl": "https://youtu.be/kdXyaoTQJvE?si=XY5z9x_uA7njQwHH"
      },
      {
            "ep": "EP.22",
            "id": "l-1789908533127",
            "title": "nutrient cycle",
            "duration": 66,
            "videoUrl": "https://youtu.be/SRmP-62qEBE?si=-0sPlr0gA0phd0SB"
      },
      {
            "ep": "EP.23",
            "id": "l-1789908554031",
            "title": "Population",
            "duration": 66,
            "videoUrl": "https://youtu.be/87PcBmA4mZQ?si=18DwTYS7cOuI1kOY"
      }
],
    materials: [
      {
            "id": "mat-1789908742906",
            "url": "https://drive.google.com/file/d/15BHaBl416O8SgTwP2vExwrftXueUUhn7/view?usp=sharing",
            "pages": "",
            "title": "Class 6",
            "category": "e-Book PDF",
            "fileSize": "182 หน้า",
            "filename": "Class_6.pdf",
            "isPrimary": true,
            "description": "เอกสารประกอบการเรียน จัดเตรียมโดยพี่ต้น INBIOLOGY"
      }
],
    imageUrl: './course-cover-bio-intensive-6.jpg',
    rating: 4.9, reviewCount: 360, Level: 'ม.6', Category: 'Bio Intensive'
  },
  {
    id: 'bio-alevel-mastery',
    title: '🏆 คอร์ส ติวเข้ม A-Level ชีววิทยา เจาะลึกโจทย์เสมือนจริง',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1890, originalPrice: 3500,
    badge: 'A-Level ชีวะ 🏆', badgeBg: '#1E3A8A',
    tag: 'ม.6 & ติวสอบ กสพท', tagBg: '#EFF6FF', tagColor: '#1E3A8A',
    description: "คอร์สเตรียมสอบเข้ามหาวิทยาลัย กสพท / โควตา / Admission ครบทุกบทเรียน เจาะลึกแนวข้อสอบเสมือนจริง 500 ข้อตาม Test Blueprint ล่าสุด พร้อมเทคนิคตัดช้อยส์และจับเวลาสอบเสมือนจริง",
    hours: 27, validity: 365, ebook: true,
    categorySlug: 'alevel',
    termBadge: 'TCAS & กสพท',
    topicHighlights: [
      "วิเคราะห์ Blueprint A-Level ชีววิทยา สสวท. ล่าสุด",
      "ตะลุยโจทย์เสมือนจริง 500 ข้อครบทุกระบบชีววิทยา",
      "เทคนิควิเคราะห์โจทย์ประยุกต์และตัดช้อยส์ลวง",
      "จับเวลาทำ Mock Exam ข้อสอบเก็งปีล่าสุด + เฉลยละเอียด"
],
    ebookInfo: {
      "title": "e-Book คลังข้อสอบ A-Level ชีววิทยาเสมือนจริง 500 ข้อ (220 หน้า)",
      "pages": 220,
      "fileSize": "45.0 MB",
      "filename": "INBIOLOGY_A_Level_500_Mastery.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1789977756185",
            "title": "เซลล์",
            "duration": 106,
            "videoUrl": "https://youtu.be/gjotbuZfKOU?si=HqhmBfxhMnQSO1Fa"
      },
      {
            "ep": "EP.2",
            "id": "l-1789977770954",
            "title": "การแบ่งเซลล์",
            "duration": 50,
            "videoUrl": "https://youtu.be/ERxP7MpYIoc?si=8mr7RtcJY_88OGYq"
      },
      {
            "ep": "EP.3",
            "id": "l-1789977838320",
            "title": "การสลายอาหารระดับเซลล์",
            "duration": 46,
            "videoUrl": "https://youtu.be/d6isd8JVJ4w?si=OBC_SIKrjhnZHy03"
      },
      {
            "ep": "EP.4",
            "id": "l-1789977855761",
            "title": "ยีนและโครโมโซม",
            "duration": 32,
            "videoUrl": "https://youtu.be/_6OzNl7wjAM?si=9oT4u3xqckFA3Pou"
      },
      {
            "ep": "EP.5",
            "id": "l-1789977902145",
            "title": "การกลาย (mutation)",
            "duration": 65,
            "videoUrl": "https://youtu.be/RtJoqM1Ds9c?si=eQDra1zdUBCqaOH7"
      },
      {
            "ep": "EP.6",
            "id": "l-1789977927560",
            "title": "การถ่ายทอดลักษณะทางพันธุกรรม",
            "duration": 88,
            "videoUrl": "https://youtu.be/MzgUX29lyms?si=CRJfMSjuCy88e4Qo"
      },
      {
            "ep": "EP.7",
            "id": "l-1789977944664",
            "title": "โจทย์การถ่ายทอดลักษณะทางพันธุกรรม",
            "duration": 36,
            "videoUrl": "https://youtu.be/JGsDh1EZSoM?si=3J9oPFgW2IDz1MZL"
      },
      {
            "ep": "EP.8",
            "id": "l-1789977969344",
            "title": "เทคโนโลยี DNA",
            "duration": 76,
            "videoUrl": "https://youtu.be/m7Zp4Ke4bQ0?si=8nByV0ms1QnunnUr"
      },
      {
            "ep": "EP.9",
            "id": "l-1789978010481",
            "title": "ระบบย่อยอาหาร",
            "duration": 77,
            "videoUrl": "https://youtu.be/YpjIAocNL4A?si=mKl081kttwsD_sq6"
      },
      {
            "ep": "EP.10",
            "id": "l-1789978031097",
            "title": "ระบบเเลกเปลี่ยนแก๊ส",
            "duration": 56,
            "videoUrl": "https://youtu.be/T8Pg1lczz9s?si=iRnTdVy1fYjYHpnU"
      },
      {
            "ep": "EP.11",
            "id": "l-1789978068416",
            "title": "ระบบน้ำเหลืองและภูมิคุ้มกัน",
            "duration": 36,
            "videoUrl": "https://youtu.be/Ujiv2sOnd8I?si=nLJC_08UHWeYuwF_"
      },
      {
            "ep": "EP.12",
            "id": "l-1789978089416",
            "title": "ระบบไหลเวียนเลือด",
            "duration": 76,
            "videoUrl": "https://youtu.be/sGmbNgwXoEo?si=m2Q58XVGcldqelJF"
      },
      {
            "ep": "EP.13",
            "id": "l-1789978140720",
            "title": "เฉลยระบบไหลเวียนเลือด",
            "duration": 22,
            "videoUrl": "https://youtu.be/Jig_RIKiCuo?si=gxx9UV5yF0YHMUbe"
      },
      {
            "ep": "EP.14",
            "id": "l-1789978180730",
            "title": "ระบบต่อมไร้ท่อ",
            "duration": 72,
            "videoUrl": "https://youtu.be/Y1u6KW_X4z4?si=CBFQsJZ6FALGFAfE"
      },
      {
            "ep": "EP.15",
            "id": "l-1789978200127",
            "title": "เฉลย ระบบต่อมไร้ท่อ",
            "duration": 17,
            "videoUrl": "https://youtu.be/ZDTPEuPRHKc?si=cKqgNHRak5S90OKa"
      },
      {
            "ep": "EP.16",
            "id": "l-1789978239655",
            "title": "เฉลยสืบพันธุ์และการเจริญ",
            "duration": 21,
            "videoUrl": "https://youtu.be/vhmusG77CvE?si=ATxYhh09yFv2Af7d"
      },
      {
            "ep": "EP.17",
            "id": "l-1789978254624",
            "title": "ระบบขับถ่าย",
            "duration": 50,
            "videoUrl": "https://youtu.be/Zac9qabhWmU?si=YF35w-F5qspl7vZu"
      },
      {
            "ep": "EP.18",
            "id": "l-1789978430423",
            "title": "ระบบสืบพันธุ์และการเจริญ",
            "duration": 98,
            "videoUrl": "https://youtu.be/m1qhTMa_9k0?si=Je35f_MQEQ7SjhM0"
      },
      {
            "ep": "EP.19",
            "id": "l-1789978599519",
            "title": "เฉลยแบบฝึกหัด สืบพันธุ์",
            "duration": 23,
            "videoUrl": "https://youtu.be/hSlZ03f4HsY?si=7duEDkHKdOeS2Mwn"
      },
      {
            "ep": "EP.20",
            "id": "l-1789978676654",
            "title": "ระบบประสาท 1",
            "duration": 58,
            "videoUrl": "https://youtu.be/0nOliJtYZ7A?si=3UXyv7VpP0B-6kif"
      },
      {
            "ep": "EP.21",
            "id": "l-1789978710414",
            "title": "อวัยวะรับสัมผัส",
            "duration": 20,
            "videoUrl": "https://youtu.be/QAEsUqIkOng?si=_JYbgJmF4ykkMQlg"
      },
      {
            "ep": "EP.22",
            "id": "l-1789978755311",
            "title": "เฉลยแบบฝึกหัด ระบบประสาท",
            "duration": 32,
            "videoUrl": "https://youtu.be/g94-huGEF9Q?si=u6iqX4-8RvSGff3g"
      },
      {
            "ep": "EP.23",
            "id": "l-1789978776278",
            "title": "เฉลย MOCK TEST ระบบร่างกาย",
            "duration": 66,
            "videoUrl": "https://youtu.be/7gLWKCMY3wk?si=CStWFTMcvpjXQXlt"
      },
      {
            "ep": "EP.24",
            "id": "l-1789978798454",
            "title": "การสืบพันธุ์พืชดอก",
            "duration": 65,
            "videoUrl": "https://youtu.be/zlZAQQ80J1Y?si=gUOaDP4YV3rjn_5V"
      },
      {
            "ep": "EP.25",
            "id": "l-1789978809143",
            "title": "เนื้อเยื่อพืช",
            "duration": 52,
            "videoUrl": "https://youtu.be/Ms-KfWP1NOY?si=hsiuAH1jWguiqYRA"
      },
      {
            "ep": "EP.26",
            "id": "l-1789978822573",
            "title": "การลำเลียงสารของพืช",
            "duration": 20,
            "videoUrl": "https://youtu.be/hh5q0xIAGUM?si=m2TOE82s7bg2Qspi"
      },
      {
            "ep": "EP.27",
            "id": "l-1789978834078",
            "title": "แบบฝึกหัด",
            "duration": 27,
            "videoUrl": "https://youtu.be/Z8Ma7IHf4wE?si=0qGyQDsLUra6hsCw"
      },
      {
            "ep": "EP.28",
            "id": "l-1789978849006",
            "title": "ระบบนิเวศ",
            "duration": 105,
            "videoUrl": "https://youtu.be/-BOHtYGdmYA?si=CuvZAcKt3DcWyAx6"
      },
      {
            "ep": "EP.29",
            "id": "l-1789978878199",
            "title": "การตอบสนองของพืช",
            "duration": 60,
            "videoUrl": "https://youtu.be/vEakEllTY8w?si=Ant3TkWw_IAcdkUb"
      },
      {
            "ep": "EP.30",
            "id": "l-1789978894573",
            "title": "พฤติกรรมสัตว์",
            "duration": 40,
            "videoUrl": "https://youtu.be/wZYU2WzS2xQ?si=UCbfoFHAkxEalHsL"
      }
],
    materials: [],
    imageUrl: './course-cover-1.png',
    rating: 4.98, reviewCount: 840, Level: 'A-Level', Category: 'คอร์ส A-Level'
  },
  {
    id: 'posn-camp1-mastery',
    title: 'คอร์ส สอวน. ชีววิทยา',
    instructor: 'พี่ต้น (เกียรตินิยมอันดับ 1)',
    price: 1990, originalPrice: 3900,
    badge: 'สอวน. ค่าย 1', badgeBg: '#B91C1C',
    tag: 'ม.3-ม.5 & โอลิมปิกวิชาการ', tagBg: '#FEF2F2', tagColor: '#B91C1C',
    description: "หลักสูตรเข้มข้นเจาะลึกเนื้อหาชีววิทยาเชิงลึกระดับมหาวิทยาลัย (Campbell Biology) ครอบคลุมทั้งภาคทฤษฎีและข้อสอบแล็บกริ๊ง สำหรับน้องๆ ม.ต้น-ม.ปลาย ที่มุ่งมั่นสอบติดค่าย 1 และค่าย 2",
    hours: 3, validity: 365, ebook: true,
    categorySlug: 'posn',
    termBadge: 'โอลิมปิกวิชาการ ค่าย 1',
    topicHighlights: [
      "ชีววิทยาเชิงลึกระดับมหาวิทยาลัย (Campbell Biology)",
      "เจาะลึกทฤษฎีเข้มข้น + ข้อสอบแข่งขันโอลิมปิกจริง",
      "ข้อสอบแล็บกริ๊ง & การวิเคราะห์ผลการทดลองทางชีวะ",
      "เทคนิคพิชิตคะแนนค่าย 1 เพื่อเข้าค่าย 2"
],
    ebookInfo: {
      "title": "e-Book ตำราและโจทย์เตรียมสอบ สอวน. ค่าย 1 (Campbell Edition 250 หน้า)",
      "pages": 250,
      "fileSize": "52.3 MB",
      "filename": "INBIOLOGY_POSN_Camp1_Campbell.pdf"
},
    lessons: [
      {
            "ep": "EP.1",
            "id": "l-1790168245827",
            "title": "ระบบประสาท 1",
            "duration": 47,
            "videoUrl": "https://youtu.be/Of6dbErEC9E?si=R4ZX1uFE-KOHqSSO"
      },
      {
            "ep": "EP.2",
            "id": "l-1790168262041",
            "title": "ระบบประสาท 2",
            "duration": 60,
            "videoUrl": "https://youtu.be/RmGJ2WZjW38?si=_KsOfa9q5H5PG4YD"
      },
      {
            "ep": "EP.3",
            "id": "l-1790168293338",
            "title": "ระบบประสาท 3",
            "duration": 53,
            "videoUrl": "https://youtu.be/QxAPBR-jTdk?si=TvqKstCkUkdL9cUM"
      },
      {
            "ep": "EP.4",
            "id": "l-1790168351033",
            "title": "พฤติกรรมสัตว์",
            "duration": 29,
            "videoUrl": "https://youtu.be/-LyarlD9ON8?si=6LpSipraYCPfzBTO"
      }
],
    materials: [],
    imageUrl: './course-cover-posn-camp1-mastery.jpg',
    rating: 4.95, reviewCount: 620, Level: 'ติวสอบ', Category: 'คอร์ส สอวน.'
  }
];

const FREE_TRIALS = [
  {
    id: 'ft1',
    title: 'คลิปทดลองเรียน Bio Intensive I: โครงสร้างเซลล์และกลไกการลำเลียงสาร',
    duration: '45 นาที',
    course: 'Bio Intensive I',
    imageUrl: './course-cover-1.png',
    videoUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
    sheetUrl: 'https://drive.google.com/file/d/1_Sample_Cell_Biology_Sheet/view?usp=sharing',
    sheetTitle: 'ชีทสรุปโครงสร้างเซลล์และการลำเลียงสาร.pdf'
  },
  {
    id: 'ft2',
    title: 'คลิปทดลองเรียน Bio Intensive II: เทคนิคคำนวณโจทย์พันธุศาสตร์เมนเดล',
    duration: '35 นาที',
    course: 'Bio Intensive II',
    imageUrl: './course-cover-c-1790176559102.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=8m6hHRlKwxY',
    sheetUrl: 'https://drive.google.com/file/d/1_Sample_Mendel_Genetics_Sheet/view?usp=sharing',
    sheetTitle: 'ชีทสรุปพันธุศาสตร์และการคำนวณสัดส่วนยีน.pdf'
  },
  {
    id: 'ft3',
    title: 'คลิปทดลองเรียน คอร์สพิเศษ สอวน.: เจาะลึกข้อสอบคัดเลือกค่าย 1',
    duration: '40 นาที',
    course: 'คอร์ส ติวเข้ม สอวน.',
    imageUrl: './course-cover-5.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=fR3NxCR9z2U',
    sheetUrl: 'https://drive.google.com/file/d/1_Sample_POSN_Biology_Exam/view?usp=sharing',
    sheetTitle: 'แนวข้อสอบคัดเลือก_สอวน_ชีววิทยา_ค่าย1.pdf'
  },
  {
    id: 'ft4',
    title: 'คลิปทดลองเรียน ติวเข้ม A-Level ชีววิทยา: เจาะลึกแนวข้อสอบเสมือนจริง',
    duration: '45 นาที',
    course: 'A-Level ชีวะ',
    imageUrl: './course-cover-1.png',
    videoUrl: 'https://www.youtube.com/watch?v=00jbG_cfGuQ',
    sheetUrl: 'https://drive.google.com/file/d/1_Sample_ALevel_Exam/view?usp=sharing',
    sheetTitle: 'แนวข้อสอบ_ALevel_ชีววิทยา.pdf'
  }
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
    title: 'Bio Intensive I: เซลล์และกลไกชีวิต',
    description: 'ทดสอบความรู้เรื่องโครงสร้างเซลล์ ออร์แกเนลล์ การสลายสารอาหารระดับเซลล์ และการลำเลียงสาร',
    badge: 'Bio Intensive I',
    badgeBg: '#1E3A8A',
    isFree: false
  },
  {
    id: 'bio-2',
    courseId: 'c-1790176559102',
    category: 'genetics',
    title: 'Bio Intensive II: พันธุศาสตร์และ DNA',
    description: 'เจาะลึกโจทย์เมนเดล มิวเทชัน เทคโนโลยีทางดีเอ็นเอ และวิวัฒนาการสิ่งมีชีวิต',
    badge: 'Bio Intensive II',
    badgeBg: '#5B21B6',
    isFree: false
  },
  {
    id: 'bio-3',
    courseId: 'bio-intensive-3',
    category: 'plant',
    title: 'Bio Intensive III: ชีววิทยาของพืช',
    description: 'โครงสร้างเนื้อเยื่อพืช การสังเคราะห์ด้วยแสง ฮอร์โมนและการเจริญเติบโตของพืช',
    badge: 'Bio Intensive III',
    badgeBg: '#065F46',
    isFree: false
  },
  {
    id: 'bio-4',
    courseId: 'bio-intensive-4',
    category: 'animal',
    title: 'Bio Intensive IV: สรีรวิทยาสัตว์และระบบร่างกาย',
    description: 'ระบบย่อยอาหาร ระบบหมุนเวียนเลือด ระบบประสาท และระบบขับถ่ายในมนุษย์',
    badge: 'Bio Intensive IV',
    badgeBg: '#92400E',
    isFree: false
  },
  {
    id: 'posn-exam',
    courseId: 'posn-intensive',
    category: 'posn',
    title: 'คอร์ส ติวเข้ม สอวน. ชีววิทยา',
    description: 'แนวข้อสอบคัดเลือกค่าย 1 สอวน. เน้นโจทย์วิเคราะห์ขั้นสูงและแล็บปฏิบัติการ',
    badge: 'สอวน. ค่าย 1',
    badgeBg: '#B91C1C',
    isFree: false
  },
  {
    id: 'free-all',
    courseId: null,
    category: 'all',
    title: 'ชุดสอบจำลอง A-Level (ทดลองสอบฟรี)',
    description: 'ชุดข้อสอบจำลอง A-Level คละเนื้อหาทุกบทเรียน สำหรับทดสอบวัดระดับพื้นฐานชีววิทยาฟรี',
    badge: 'เปิดสอบฟรี',
    badgeBg: '#10B981',
    isFree: true
  }
];

const EXAM_CATEGORIES = [
  { id: 'all', name: 'รวมทุกบท A-Level', badgeBg: 'var(--c-navy)' },
  { id: 'cell', name: 'เซลล์และชีวโมเลกุล', badgeBg: '#1E3A8A' },
  { id: 'genetics', name: 'พันธุศาสตร์ & วิวัฒนาการ', badgeBg: '#5B21B6' },
  { id: 'plant', name: 'ชีววิทยาพืช', badgeBg: '#065F46' },
  { id: 'animal', name: 'สรีรวิทยาและร่างกายมนุษย์', badgeBg: '#92400E' },
  { id: 'posn', name: 'ตะลุยโจทย์ สอวน.', badgeBg: '#B91C1C' }
];

const EXAM_QUESTIONS = [
  // Cell & Biochemistry
  {
    id: 1, category: 'cell', categoryName: 'เซลล์และชีวโมเลกุล',
    question: 'ออร์แกเนลล์ใดทำหน้าที่สังเคราะห์ลิพิดและทำลายสารพิษในเซลล์ตับ?',
    options: ['A. Smooth Endoplasmic Reticulum (SER)', 'B. Rough Endoplasmic Reticulum (RER)', 'C. Golgi Body', 'D. Lysosome'],
    correct: 0,
    explanation: 'SER (Smooth Endoplasmic Reticulum) เป็นออร์แกเนลล์หลักที่ทำหน้าที่สังเคราะห์สารลิพิด และมีเอนไซม์ขจัดสารพิษในเซลล์ตับ'
  },
  {
    id: 2, category: 'cell', categoryName: 'เซลล์และชีวโมเลกุล',
    question: 'กระบวนการใดยังคงเกิดขึ้นในสภาวะที่ไม่มีแก๊สออกซิเจน (Anaerobic Condition)?',
    options: ['A. Krebs Cycle', 'B. Electron Transport Chain', 'C. Glycolysis', 'D. Pyruvate Oxidation'],
    correct: 2,
    explanation: 'Glycolysis เป็นกระบวนการสลายกลูโคสขั้นแรกที่เกิดขึ้นในไซโทพลาซึม โดยไม่ต้องใช้ออกซิเจน'
  },
  {
    id: 3, category: 'cell', categoryName: 'เซลล์และชีวโมเลกุล',
    question: 'พันธะเคมีใดทำหน้าที่เชื่อมต่อกรดอะมิโนแต่ละโมเลกุลให้สายโพลีเพปไทด์ของโปรตีนมีความสมบูรณ์?',
    options: ['A. Glycosidic Linkage', 'B. Peptide Bond', 'C. Phosphodiester Bond', 'D. Ester Bond'],
    correct: 1,
    explanation: 'Peptide Bond (พันธะเพปไทด์) เป็นพันธะโคเวเลนต์ที่เกิดขึ้นระหว่างหมู่คาร์บอกซิลของกรดอะมิโนตัวหนึ่งกับหมู่อะมิโนของกรดอะมิโนอีกตัวหนึ่ง'
  },

  // Genetics & Evolution
  {
    id: 4, category: 'genetics', categoryName: 'พันธุศาสตร์ & วิวัฒนาการ',
    question: 'หมู่เลือดระบบ ABO ถูกควบคุมโดยแอลลีล IA, IB และ i ข้อใดระบุลักษณะพันธุศาสตร์ได้ถูกต้อง?',
    options: ['A. Single Gene with 2 alleles', 'B. Multiple Alleles with Codominance', 'C. Polygenic Inheritance', 'D. Incomplete Dominance'],
    correct: 1,
    explanation: 'หมู่เลือด ABO เป็นตัวอย่างของ Multiple Alleles (3 แอลลีล) และแสดงข่มร่วมกัน (Codominance ระหว่าง IA และ IB)'
  },
  {
    id: 5, category: 'genetics', categoryName: 'พันธุศาสตร์ & วิวัฒนาการ',
    question: 'เอนไซม์ใดทำหน้าที่เชื่อมต่อสาย DNA ในกระบวนการตัดต่อยีน (Recombinant DNA Technology)?',
    options: ['A. DNA Polymerase', 'B. DNA Ligase', 'C. Restriction Enzyme', 'D. Helicase'],
    correct: 1,
    explanation: 'DNA Ligase ทำหน้าที่เชื่อมพันธะฟอสโฟไดเอสเทอร์ระหว่างชิ้นส่วนสาย DNA สองสายเข้าด้วยกัน'
  },
  {
    id: 6, category: 'genetics', categoryName: 'พันธุศาสตร์ & วิวัฒนาการ',
    question: 'ข้อใดจัดเป็นหลักฐานสายสัมพันธ์ทางวิวัฒนาการที่มีกำเนิดกำเนิดมาจากโครงสร้างเดียวกัน (Homologous Structures)?',
    options: ['A. ปีกนก กับ ปีกผีเสื้อ', 'B. แขนมนุษย์ กับ ครีบปลาวาฬ', 'C. ตาของหมึก กับ ตาของมนุษย์', 'D. ปีกค้างคาว กับ ปีกแมลงวัน'],
    correct: 1,
    explanation: 'แขนมนุษย์และครีบปลาวาฬมีโครงสร้างกระดูกต้นกำเนิดเดียวกัน (Homologous Structure) แต่อาจพัฒนาไปทำหน้าที่ต่างกัน'
  },

  // Plant Biology
  {
    id: 7, category: 'plant', categoryName: 'ชีววิทยาพืช',
    question: 'เนื้อเยื่อเจริญส่วนใดของพืชทำหน้าที่เพิ่มขนาดความกว้าง/ความหนาของลำต้น (Secondary Growth)?',
    options: ['A. Apical Meristem', 'B. Vascular Cambium', 'C. Intercalary Meristem', 'D. Protoderm'],
    correct: 1,
    explanation: 'Vascular Cambium เป็นเนื้อเยื่อเจริญด้านข้าง (Lateral Meristem) ที่สร้างไซเลมและโฟลเอ็มขั้นที่สอง ทำให้ลำต้นพืชขยายออกด้านข้าง'
  },
  {
    id: 8, category: 'plant', categoryName: 'ชีววิทยาพืช',
    question: 'ฮอร์โมนพืชชนิดใดมีบทบาทหลักในการเร่งการสุกของผลไม้และการหลุดร่วงของใบ?',
    options: ['A. Auxin', 'B. Gibberellin', 'C. Ethylene', 'D. Cytokinin'],
    correct: 2,
    explanation: 'Ethylene (เอทิลีน) เป็นฮอร์โมนพืชในรูปแก๊สที่มีหน้าที่กระตุ้นการสุกของผลไม้และการหลุดร่วงของใบพืช'
  },

  // Animal Physiology
  {
    id: 9, category: 'animal', categoryName: 'สรีรวิทยาและร่างกายมนุษย์',
    question: 'อวัยวะใดในระบบย่อยอาหารของมนุษย์ที่มีการย่อยสารอาหารประเภทโปรตีนเป็นแห่งแรก?',
    options: ['A. ปาก (Mouth)', 'B. กระเพาะอาหาร (Stomach)', 'C. ลำไส้เล็ก (Small Intestine)', 'D. ตับอ่อน (Pancreas)'],
    correct: 1,
    explanation: 'กระเพาะอาหารหลั่งเอนไซม์ Pepsin ออกมาย่อยโปรตีนให้เป็นเพปไทด์สายสั้นลงเป็นจุดแรก'
  },
  {
    id: 10, category: 'animal', categoryName: 'สรีรวิทยาและร่างกายมนุษย์',
    question: 'หน่วยไต (Nephron) ส่วนใดที่มีกระบวนการดูดกลับกลูโคสและกรดอะมิโนกลับเข้าสู่กระแสเลือดได้เกือบ 100%?',
    options: ['A. Bowman’s Capsule', 'B. Proximal Convoluted Tubule (PCT)', 'C. Loop of Henle', 'D. Distal Convoluted Tubule (DCT)'],
    correct: 1,
    explanation: 'PCT (ท่อขดส่วนต้น) ทำหน้าที่ดูดกลับสารที่มีประโยชน์ เช่น กลูโคส กรดอะมิโน และไอออนต่างๆ กลับเข้าสู่กระแสเลือดแบบ Active Transport'
  },

  // POSN Exam
  {
    id: 11, category: 'posn', categoryName: 'ตะลุยโจทย์ สอวน.',
    question: 'หากนำเซลล์เม็ดเลือดแดงไปแช่ในสารละลายไฮเปอร์โทนิก (Hypertonic Solution) ผลลัพธ์จะเป็นอย่างไร?',
    options: ['A. เซลล์เต่งและแตก (Lysis)', 'B. เซลล์เหี่ยว (Crenation)', 'C. เซลล์ไม่เปลี่ยนแปลงขนาด', 'D. เซลล์ขยายขนาดเท่าเดิม'],
    correct: 1,
    explanation: 'ในสภาวะ Hypertonic Solution โมเลกุลของน้ำภายในเซลล์จะออสโมซิสออกนอกเซลล์ ทำให้เซลล์เม็ดเลือดแดงเหี่ยว (Crenation)'
  }
];

const FAQS = [
  {
    category: 'course',
    categoryName: 'การเรียนและคอร์ส',
    q: 'เข้าเรียนอย่างไร และสามารถดูย้อนหลังได้นานแค่ไหน?',
    a: 'สามารถเข้าเรียนผ่านคอมพิวเตอร์ แท็บเล็ต หรือสมาร์ตโฟนได้ทุกระบบตลอด 24 ชั่วโมง โดยดูซ้ำทบทวนได้ไม่จำกัดรอบตลอดระยะเวลาคอร์ส สำหรับคอร์สที่ระบุสิทธิ์ตลอดชีพ (Lifetime Access) สามารถเข้าชมเนื้อหาและวิดีโอที่อัปเดตใหม่ได้ตลอดตราบเท่าที่แพลตฟอร์มเปิดให้บริการ'
  },
  {
    category: 'course',
    categoryName: 'การเรียนและคอร์ส',
    q: 'สิทธิ์การเข้าถึง "ตลอดชีพ (Lifetime Access)" มีเงื่อนไขอย่างไร?',
    a: 'คอร์สเรียนสิทธิ์ตลอดชีพ ผู้เรียนสามารถเข้าสู่ระบบเพื่อทบทวนบทเรียน ทำแบบฝึกหัด และเข้าถึงคลิปอัปเดตแนวข้อสอบใหม่ๆ ได้ตลอดเวลาโดยไม่มีค่าใช้จ่ายรายเดือนหรือรายปีเพิ่มเติม โดยบัญชีผู้ใช้งานจะต้องเป็นของบุคคลคนเดียวตามข้อกำหนดการใช้งาน และไม่โอนหรือแชร์สิทธิ์ให้บุคคลอื่น'
  },
  {
    category: 'course',
    categoryName: 'การเรียนและคอร์ส',
    q: 'ไม่มีพื้นฐานชีววิทยา หรืออยู่ ม.4 สามารถเริ่มเรียนคอร์ส Intensive ได้หรือไม่?',
    a: 'เรียนได้แน่นอนครับ คอร์ส Bio Intensive ของพี่ต้นเริ่มสอนปูพื้นฐานตั้งแต่ระดับเซลล์และโมเลกุล อธิบายที่มาที่ไปอย่างเป็นระบบ ไม่ต้องท่องจำแบบฝืนใจ มีภาพประกอบ 3D และทริกจำที่เข้าใจง่าย เหมาะสำหรับนักเรียน ม.4-ม.6 ทุกคน'
  },
  {
    category: 'material',
    categoryName: 'เอกสารและชีทเรียน',
    q: 'มีหนังสือเรียนและเอกสารประกอบการเรียนให้ดาวน์โหลดหรือไม่?',
    a: 'ทุกคอร์สมีไฟล์ e-Book PDF ความละเอียดสูง สีสันสวยงาม แผนภาพสรุปชัดเจน ให้ดาวน์โหลดฟรีในห้องเรียนทันทีหลังสมัครเรียน และสำหรับคอร์สชุด Intensive Complete Set จะมีบริการจัดส่งเอกสารรูปเล่มถึงบ้านฟรี'
  },
  {
    category: 'material',
    categoryName: 'เอกสารและชีทเรียน',
    q: 'สามารถพิมพ์ (Print) ไฟล์ชีทประกอบการเรียนได้ไหม?',
    a: 'สามารถพิมพ์ชีทเรียนออกมาจดโน้ต หรือนำเข้าแอปพลิเคชันจดบันทึก เช่น GoodNotes, Notability บน iPad/Tablet ได้อย่างอิสระเพื่อการศึกษาเฉพาะตัวของผู้สมัคร'
  },
  {
    category: 'payment',
    categoryName: 'การชำระเงินและความปลอดภัย',
    q: 'ชำระเงินผ่านช่องทางใดได้บ้าง และมีความปลอดภัยอย่างไร?',
    a: 'สามารถชำระผ่าน PromptPay QR Code ได้ทุกแอปพลิเคชันธนาคารในประเทศไทย โดยเงินจะเข้าสู่บัญชีทางการของสถาบัน INBIOLOGY โดยตรง เมื่อโอนเสร็จระบบจะตรวจสอบสลิปและเปิดคอร์สให้อัตโนมัติ หรือส่งสลิปยืนยันทาง LINE Official @inbiology เพื่อออกใบเสร็จรับเงินอิเล็กทรอนิกส์'
  },
  {
    category: 'payment',
    categoryName: 'การชำระเงินและความปลอดภัย',
    q: 'มีนโยบายการขอเปลี่ยนคอร์สหรือขอเงินคืนอย่างไร?',
    a: 'ผู้เรียนสามารถแจ้งความประสงค์ขอเปลี่ยนคอร์สได้ภายใน 7 วัน นับจากวันที่ชำระเงิน โดยยังไม่มีประวัติการเข้าดูบทเรียนเกิน 10% ของคอร์สนั้นๆ ผ่านทางเจ้าหน้าที่ LINE Official @inbiology ทั้งนี้หากคอร์สใหม่มีราคาสูงกว่า ผู้เรียนสามารถชำระส่วนต่างเพิ่มเติมได้'
  },
  {
    category: 'support',
    categoryName: 'การดูแลและสอบถาม',
    q: 'หากเรียนแล้วมีข้อสงสัยหรือไม่เข้าใจเนื้อหา ถามพี่ต้นได้ทางไหน?',
    a: 'ในหน้าระบบห้องเรียน (Classroom) มีแถบ "ถามผู้สอน (พี่ต้น)" ที่ผู้เรียนสามารถพิมพ์คำถามแนบรูปภาพหรือระบุนาทีของคลิปได้โดยตรง นอกจากนี้ยังสามารถทักทายปรึกษาแนวทางสอบได้ที่ LINE Official @inbiology พี่ต้นและทีมวิชาการตอบกลับอย่างใกล้ชิดครับ'
  }
];

const MOCK_STUDENTS = [
  { id: 'sa-01', name: 'อาจารย์ วิทศรุต', email: 'witsarut.cha@pccpl.ac.th', school: 'PCCPL', level: 'ผู้ก่อตั้ง / Super Admin', role: 'admin', enrolledCount: 6 },
  { id: 1, name: 'นาย ภูมิพัฒน์ รัตนชัย', email: 'phumiphat.r@gmail.com', school: 'สวนกุหลาบวิทยาลัย', level: 'ม.5', role: 'student', enrolledCount: 2 },
  { id: 2, name: 'นางสาว ณัฐนิชา สุขใจ', email: 'natnicha.s@hotmail.com', school: 'เตรียมอุดมศึกษา', level: 'ม.6', role: 'student', enrolledCount: 3 },
  { id: 3, name: 'นาย ปกรณ์ ดีเลิศ', email: 'pakorn.d@yahoo.com', school: 'สามเสนวิทยาลัย', level: 'ม.4', role: 'student', enrolledCount: 1 }
];

const CATEGORIES = [
  {
    id: 'cat-bio-intensive-all',
    slug: 'bio-intensive',
    name: 'Bio Intensive I - VI',
    subtext: 'ตะลุยเนื้อหา ม.ปลาย เข้มข้น',
    icon: 'dna',
    badge: 'ม.4 - ม.6 (ครบทุกเทอม)',
    actionType: 'modal'
  },
  {
    id: 'cat-posn',
    slug: 'posn',
    name: 'คอร์ส สอวน.',
    subtext: 'พิชิตเหรียญโอลิมปิก',
    icon: 'award',
    badge: 'โอลิมปิกวิชาการ',
    actionType: 'link',
    targetUrl: 'courses.html?category=posn'
  },
  {
    id: 'cat-alevel',
    slug: 'alevel',
    name: 'คอร์ส A-Level',
    subtext: 'เก็งข้อสอบ สสวท. สอบเข้า ม.',
    icon: 'book',
    badge: 'TCAS & A-Level',
    actionType: 'link',
    targetUrl: 'courses.html?category=alevel'
  },
  {
    id: 'cat-starter',
    slug: 'starter',
    name: 'คอร์ส 99 บาท',
    subtext: 'สรุปเข้ม 10 บทสำคัญ',
    icon: 'bolt',
    badge: 'ทดลองเรียนสุดคุ้ม',
    actionType: 'link',
    targetUrl: 'courses.html?category=starter'
  }
];

const REVIEWS = [
  {
    id: 'rev-1',
    name: 'น้องน้ำ',
    text: 'เรียนกับพี่ต้นคือสนุกมาก ทำให้การเรียนชีวะไม่ใช่แค่การนั่งท่องจำ แต่ได้เข้าใจเนื้อหาจริงๆ พี่เรียนมาตั้งแต่ม.4 เทอม 2 ทุกอย่างที่พี่ต้นสอนพี่ได้นำมาใช้จริงจนถึงขึ้นมหาลัยเลย ❤️❤️',
    score: 'คณะทันตแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่',
    avatar: './student_nam_cmu.png',
    imagePosition: '40% 18%',
    school: '',
    course: 'Bio Intensive Complete Set (ม.4 - ม.6)'
  },
  {
    id: 'rev-2',
    name: 'น้องปุน',
    text: 'สอนเนื้อหาครอบคลุมไม่น่าเบื่อสนุกเป็นกันเองให้คำแนะนำในการเตรียมตัวดี รักๆ🤟🏻',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยขอนแก่น',
    avatar: './student_poon.jpg',
    imagePosition: '45% 28%',
    school: '',
    course: 'Bio Intensive & A-Level ชีววิทยา'
  },
  {
    id: 'rev-3',
    name: 'น้องน้ำ',
    text: 'เรียนกับพี่ต้นมาตั้งแต่ ม.4 จนจบคอร์ส A-Level รู้สึกว่าตัดสินใจไม่ผิดจริง ๆ พี่ต้นสอนสนุก เข้าใจง่าย เนื้อหาที่ดูยากก็อธิบายให้เห็นภาพได้ ทำให้เรียนแล้วไม่รู้สึกท่องจำอย่างเดียว สรุปเนื้อหาครบ อ่านทบทวนก่อนสอบได้ดีมาก อีกอย่างที่ชอบคือมี Quiz ให้ทบทวนตลอด ช่วยกระตุ้นให้อยากอ่านหนังสือ นอกจากนี้ยังมีทริค หรือ เพลง ที่ทำให้เรื่องยากดูง่ายขึ้นมา มีเกร็ดความรู้เพิ่มเติมที่น่าสนใจมาฝากตลอด ขอบคุณพี่ต้นมาก ๆ ที่ทำให้ชีวะเป็นวิชาที่เข้าใจ และสนุกขึ้น ถ้าใครกำลังมองหาที่เรียนชีวะที่สอนละเอียด เข้าใจง่าย และช่วยปูพื้นฐานจนพร้อมสอบ A-Level มาจัดเลยค่ะ Inbio🤍🌱',
    score: 'คณะเทคโนโลยีวิทยาศาสตร์สุขภาพ สาขารังสีเทคนิค ราชวิทยาลัยจุฬาภรณ์',
    avatar: './student_nam_cra.jpg',
    imagePosition: '60% 22%',
    school: '',
    course: 'Bio Intensive & A-Level ชีววิทยา'
  },
  {
    id: 'rev-4',
    name: 'น้องพรีม',
    text: 'ตั้งแต่รู้จัก Inbio ก็ไม่ say no ชีวะอีกเลย',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยขอนแก่น',
    avatar: './student_nam.jpg',
    imagePosition: '45% 15%',
    school: '',
    course: 'Bio Intensive & A-Level ชีววิทยา'
  },
  {
    id: 'rev-5',
    name: 'พี่อลีน',
    text: 'พี่ต้นสอนแบบจำได้จริง จำได้ยาวๆ แล้วก็สอนสนุกมากกก เป็นกันเองสุดๆ ทำให้กล้าถามทุกเรื่อง และทำให้การเรียนชีวะไม่น่าเบื่อเลย จากวิชาที่เคยคิดว่ายาก กลายเป็นวิชาที่ชอบไปเลยย พี่ต้นอธิบายละเอียด เข้าใจง่าย เชื่อมโยงเนื้อหาให้เห็นภาพ ไม่ต้องท่องแบบฝืนๆ แล้วก็มีเพลงช่วยจำที่ใช้ได้จริงด้วยย ทำให้ไม่ลืมคอนเซ็ปต์และเข้าใจเนื้อหาแบบเอาไปใช้ได้จริง แนะนำมากก',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยนเรศวร',
    avatar: './student_aleen.jpg',
    imagePosition: 'center 33%',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'Bio Intensive Complete Set'
  },
  {
    id: 'rev-6',
    name: 'พี่โบ๊ท',
    text: 'เรียนกับพี่ต้นสนุกกก มีเพลงปั่นๆ มาใช้ช่วยจำ เนื้อหาครบถ้วน มีข้อสอบให้ลองทำเยอะมาก จากคนที่เคยจำสับสนเรื่องระบบร่างกาย พอเรียนชุด Intensive จบ ทำข้อสอบ A-Level ได้มั่นใจขึ้นเยอะเลย จอยอะ ของดี๊จริงๆ ครับ',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยเชียงใหม่',
    avatar: './student_boat.jpg',
    imagePosition: 'center top',
    school: 'โรงเรียนอุดมดรุณี',
    course: 'Bio Intensive II & A-Level'
  },
  {
    id: 'rev-7',
    name: 'พี่ก๊อต (จิตธนา พูลอ้น)',
    text: 'เรียนกับพี่ต้นเข้าใจง่ายมากๆ คับ มีวิธีสอนที่ทำให้เรื่องยากกลายเป็นเรื่องง่าย แผนผัง Mind Map แต่ละบทเชื่อมโยงชัดเจน ข้อสอบยากๆ ในสนามแข่งขันก็มีเทคนิควิเคราะห์ตัดช้อยส์ได้แม่นยำมากครับ',
    score: 'คณะสัตวแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์',
    avatar: './student_got.jpg',
    imagePosition: 'center top',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'Bio Intensive Series'
  },
  {
    id: 'rev-8',
    name: 'พี่แตมป์ (จิรัฏฐ์ เดชพงษ์)',
    text: 'เรียนกับพี่ต้นสนุกมากคับบ สอนแบบเข้าใจง่าย เป็นกันเองคับบ เวลาเรียนก็มีมุกแทรกแก้เครียดด้วย มีทริคมีเพลงประกอบเนื้อหาให้จำได้คับบ ข้อสอบพันธุศาสตร์กับนิเวศวิทยาที่เคยคิดว่าซับซ้อน กลายเป็นพาร์ทเก็บคะแนนเลย',
    score: 'คณะแพทยศาสตร์ มหาวิทยาลัยเกษตรศาสตร์',
    avatar: './student_stamp.jpg',
    imagePosition: 'center top',
    school: 'โรงเรียนสาธิตมหาวิทยาลัยนเรศวร',
    course: 'ตะลุยโจทย์ A-Level'
  }
];

const ARTICLES = [
  {
    id: 1,
    title: 'สรุป 10 จุดสำคัญเรื่องการสังเคราะห์ด้วยแสง (Photosynthesis)',
    date: '10 มี.ค. 2026',
    views: 1250,
    readTime: '5 นาที',
    category: 'สรุปเนื้อหา',
    author: 'พี่ต้น INBIOLOGY',
    summary: 'รวมจุดออกสอบบ่อยกระบวนการสังเคราะห์ด้วยแสง Light Reaction และ Calvin Cycle พร้อมสมการและตำแหน่งที่เกิดในคลอโรพลาสต์อย่างละเอียด',
    content: 'การสังเคราะห์ด้วยแสงแบ่งออกเป็น 2 ขั้นตอนหลัก ได้แก่ ปฏิกิริยาแสง (Light Reaction) ที่เกิดขึ้นบริเวณ Thylakoid Membrane เพื่อผลิต ATP และ NADPH สำหรับนำไปใช้ในปฏิกิริยาตรึงคาร์บอน (Calvin Cycle) ที่เกิดใน Stroma ของคลอโรพลาสต์\n\nจุดที่มักสับสนในข้อสอบ A-Level คือตำแหน่งการสะสมโปรตอน (H+) ภายใน Thylakoid Lumen และกลไก Photophosphorylation ทั้งแบบเป็นวัฏจักรและไม่เป็นวัฏจักร',
    documentUrl: 'https://drive.google.com/file/d/1_Sample_Biology_Photosynthesis_Summary/view?usp=sharing',
    documentName: 'ชีทสรุปจุดออกสอบ_Photosynthesis_INBIOLOGY.pdf',
    articleUrl: 'https://inbiology-official.vercel.app/courses.html',
    imageUrl: './course-cover-3.jpg'
  },
  {
    id: 2,
    title: 'สกัด DNA ด้วยตนเองที่บ้าน! ขั้นตอนแล็บเสมือนง่ายๆ',
    date: '05 มี.ค. 2026',
    views: 890,
    readTime: '8 นาที',
    category: 'แล็บชีววิทยา',
    author: 'พี่ต้น INBIOLOGY',
    summary: 'ขั้นตอนการแยกสกัด DNA จากพืชผลไม้ เช่น กล้วยหรือสตรอว์เบอร์รี ด้วยน้ำยาล้างจาน เกลือแกง และเอทานอลเย็นจัด',
    content: 'การสกัด DNA เบื้องต้นใช้หลักการทำลายเยื่อหุ้มเซลล์และเยื่อหุ้มนิวเคลียสด้วยสารซักฟอก (Detergent) เกลือแกงทำหน้าที่ปรับประจุของ DNA ให้เสถียร และแอลกอฮอล์เย็นจัด (Cold Ethanol) ช่วยตกตะกอนสาย DNA สีขาวขุ่นออกมาให้เห็นด้วยตาเปล่าเพื่อการศึกษาโครงสร้างพันธุกรรม',
    documentUrl: 'https://drive.google.com/file/d/1_Sample_DNA_Extraction_Lab_Protocol/view?usp=sharing',
    documentName: 'คู่มือการทดลอง_DNA_Extraction_Lab.pdf',
    articleUrl: 'https://inbiology-official.vercel.app/courses.html',
    imageUrl: './course-cover-c-1790176559102.jpg'
  },
  {
    id: 3,
    title: 'โครงสร้างหัวใจและการสูบฉีดเลือด: เข้าใจด้วยเทคนิค Mind Map',
    date: '28 ก.พ. 2026',
    views: 1650,
    readTime: '4 นาที',
    category: 'เทคนิค Mind Map',
    author: 'พี่ต้น INBIOLOGY',
    summary: 'แผนภาพเชื่อมโยงระบบหมุนเวียนเลือด หัวใจ 4 ห้อง ลิ้นหัวใจ และทิศทางการไหลของเลือดดำและเลือดแดง จำง่ายไม่สับสน',
    content: 'เทคนิคจำระบบไหลเวียนเลือด: เลือดดำจากส่วนบนและล่างของร่างกายเข้าสู่หัวใจห้องบนขวา (Right Atrium) ผ่านลิ้น Tricuspid สู่ล่างขวา (Right Ventricle) ส่งไปฟอกที่ปอดผ่าน Pulmonary Artery จากนั้นเลือดแดงจากปอดกลับเข้าบนซ้าย (Left Atrium) ผ่านลิ้น Bicuspid (Mitral) สู่ล่างซ้าย (Left Ventricle) ซึ่งมีผนังกล้ามเนื้อหนาที่สุดเพื่อบีบเลือดออกทาง Aorta ไปเลี้ยงทั่วร่างกาย',
    documentUrl: 'https://drive.google.com/file/d/1_Sample_Heart_Circulation_Mindmap/view?usp=sharing',
    documentName: 'MindMap_ระบบหมุนเวียนโลหิตและหัวใจ_INBIOLOGY.pdf',
    articleUrl: 'https://inbiology-official.vercel.app/courses.html',
    imageUrl: './course-cover-4.png'
  }
];

const DEFAULT_SLIDES = [
  { id: 'slide-1', bg1: '#EFF6FF', bg2: '#DBEAFE', label: 'โปรต้อนรับเปิดเทอม', title: 'Bio Intensive I - VI Complete Set', desc: 'ลงทะเบียนเรียนคอร์สแพ็กคู่รับส่วนลดพิเศษทันที 30% พร้อมรับไฟล์ e-Book สรุปเนื้อหาฟรีตลอดชีพ', badgeText: 'ลดสูงสุด 30%', imageUrl: '', actionText: 'ดูคอร์สทั้งหมด', actionType: 'bundle', targetCourseId: '' },
  { id: 'slide-2', bg1: '#FEF2F2', bg2: '#FEE2E2', label: 'ติวเข้ม A-Level ชีวะ', title: 'คอร์ส ติวเข้ม A-Level ชีววิทยา เจาะลึกโจทย์เสมือนจริง', desc: 'เตรียมสอบเข้ามหาวิทยาลัย กสพท / โควตา / Admission เจาะลึกแนวข้อสอบตาม Blueprint สสวท. ล่าสุด', badgeText: 'ลดพิเศษ ฿1,890', imageUrl: '', actionText: 'สมัครเรียน ฿1,890', actionType: 'course', targetCourseId: 'bio-alevel-mastery' }
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
