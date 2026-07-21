import { database } from '@/server/db/client';
import type { Course } from '@/features/catalog/contracts';

type CourseRow = { id: string; slug: string; title: string; description: string; price_satang: number; original_price_satang: number | null; level: string; cover_image_key: string | null; status: Course['status']; };

export async function listPublishedCourses(): Promise<Course[]> {
  const sql = database();
  const rows = await sql<CourseRow[]>`SELECT id, slug, title, description, price_satang, original_price_satang, level, cover_image_key, status FROM courses WHERE status = 'published' ORDER BY created_at DESC`;
  return rows.map((row) => ({ id: row.id, slug: row.slug, title: row.title, description: row.description, price: row.price_satang / 100, originalPrice: row.original_price_satang == null ? null : row.original_price_satang / 100, level: row.level, imageUrl: row.cover_image_key, status: row.status }));
}
