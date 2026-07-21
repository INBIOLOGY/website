import { database } from '@/server/db/client';
import type { Course } from '@/features/catalog/contracts';

type CourseRow = { id: string; slug: string; title: string; description: string | null; price: number | string; original_price: number | string | null; level: string | null; image_url: string | null; status: Course['status']; };

export async function listPublishedCourses(): Promise<Course[]> {
  const sql = database();
  const rows = await sql<CourseRow[]>`SELECT id, slug, title, description, price, original_price, level, image_url, status FROM courses WHERE status = 'published' ORDER BY created_at DESC`;
  return rows.map((row) => ({ id: row.id, slug: row.slug, title: row.title, description: row.description, price: Number(row.price), originalPrice: row.original_price == null ? null : Number(row.original_price), level: row.level, imageUrl: row.image_url, status: row.status }));
}
