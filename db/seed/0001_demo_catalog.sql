INSERT INTO courses (slug, title, description, price_satang, original_price_satang, level, cover_image_key, status)
VALUES
  ('biology-foundation-m4', 'ชีววิทยาพื้นฐาน ม.4', 'ปูพื้นฐานชีววิทยาให้เข้าใจเป็นระบบ', 149000, 199000, 'ม.4', 'course-biology.jpg', 'published'),
  ('biology-intensive-m5', 'ตะลุยโจทย์ชีววิทยา ม.5', 'ฝึกวิเคราะห์โจทย์และสรุปเนื้อหาสำคัญ', 179000, 229000, 'ม.5', 'course-biology.jpg', 'published')
ON CONFLICT (slug) DO NOTHING;
