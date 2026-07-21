INSERT INTO courses (slug, title, description, price, original_price, level, image_url, status)
VALUES
  ('biology-foundation-m4', 'ชีววิทยาพื้นฐาน ม.4', 'ปูพื้นฐานชีววิทยาให้เข้าใจเป็นระบบ', 1490, 1990, 'ม.4', '/course-biology.jpg', 'published'),
  ('biology-intensive-m5', 'ตะลุยโจทย์ชีววิทยา ม.5', 'ฝึกวิเคราะห์โจทย์และสรุปเนื้อหาสำคัญ', 1790, 2290, 'ม.5', '/course-biology.jpg', 'published')
ON CONFLICT (slug) DO NOTHING;
