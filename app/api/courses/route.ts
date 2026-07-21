import { NextResponse } from 'next/server';
import { DatabaseUnavailableError } from '@/server/db/client';
import { listPublishedCourses } from '@/server/catalog/service';

export async function GET() {
  try { return NextResponse.json(await listPublishedCourses(), { headers: { 'Cache-Control': 'private, no-store' } }); }
  catch (error) {
    if (error instanceof DatabaseUnavailableError) return NextResponse.json({ error: 'บริการฐานข้อมูลยังไม่พร้อมใช้งาน' }, { status: 503 });
    console.error('GET /api/courses failed', error);
    return NextResponse.json({ error: 'ไม่สามารถโหลดรายการคอร์สได้' }, { status: 500 });
  }
}
