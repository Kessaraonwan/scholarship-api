import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized', code: 401 }, { status: 401 });

  // TODO: เช็ค tier กับ service-auth ว่าเป็น Pro ไหม

  const data = {
    totalScholarships: 89,
    byLevel: {
      มัธยม: 10,
      ปริญญาตรี: 30,
      ปริญญาโท: 25,
      ปริญญาเอก: 15,
      ทุกระดับ: 9,
    },
    byCountry: { ไทย: 40, UK: 20, US: 15, เยอรมนี: 8, อื่นๆ: 6 },
    closingSoon: 12,
  };

  return NextResponse.json({ data });
}