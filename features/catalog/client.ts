import { courseListSchema, type Course } from './contracts';

export async function listPublishedCourses(): Promise<Course[]> {
  const response = await fetch('/api/courses', { cache: 'no-store' });
  if (!response.ok) throw new Error('ไม่สามารถโหลดรายการคอร์สได้');
  return courseListSchema.parse(await response.json());
}
