import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });

  // TODO: เช็ค tier กับ service-auth ว่าเป็น Pro ไหม

  const { level, field, country } = await request.json();

  // TODO: เชื่อม service-core จริง
  // ตอนนี้ใช้ mock data ก่อน
  const mockData = [
    { id: '1', name: 'Chevening Scholarship', level: 'ปริญญาโท', field: 'ทุกสาขา', country: 'UK', amount: 18000, currency: 'GBP', deadline: '2025-11-15', url: 'https://www.chevening.org', source: 'Chevening', description: 'ทุนจากรัฐบาลอังกฤษ', createdAt: '', updatedAt: '' },
    { id: '2', name: 'DAAD Scholarship', level: 'ปริญญาโท', field: 'วิทยาศาสตร์', country: 'เยอรมนี', amount: 1200, currency: 'EUR', deadline: '2025-11-30', url: 'https://www.daad.de', source: 'DAAD', description: 'ทุนจากรัฐบาลเยอรมนี', createdAt: '', updatedAt: '' },
    { id: '3', name: 'Gates Cambridge', level: 'ปริญญาเอก', field: 'ทุกสาขา', country: 'UK', amount: 30000, currency: 'GBP', deadline: '2025-12-01', url: 'https://www.gatescambridge.org', source: 'Gates', description: 'ทุนจาก Gates Foundation', createdAt: '', updatedAt: '' },
  ];

  const filtered = mockData.filter(s =>
    (!level || s.level === level || s.level === 'ทุกระดับ') &&
    (!field || s.field === field || s.field === 'ทุกสาขา') &&
    (!country || s.country === country)
  );

  return NextResponse.json({ data: filtered, meta: { total: filtered.length, page: 1, limit: 20 } });
}