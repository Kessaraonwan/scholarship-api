import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { verifyJWT } from '@/lib/auth' // ดึงเครื่องมือถอดรหัสของแบงค์มาใช้

const prisma = new PrismaClient()

const generateApiKey = () => {
  const buffer = crypto.randomBytes(24)
  return `sk_live_${buffer.toString('hex')}`
}

export async function POST(req: NextRequest) {
  try {
    // 1. ดึงบัตรผ่านจาก Cookie เหมือนที่ Middleware ทำ
    const token = req.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'ไม่พบ Cookie บัตรผ่าน' }, { status: 401 })
    }

    // 2. ถอดรหัสบัตรผ่านเพื่อเอาข้อมูล User
    const decodedPayload = await verifyJWT(token)
    
    // เช็คว่าถอดรหัสสำเร็จไหม และมี userId อยู่ข้างในหรือเปล่า
    if (!decodedPayload || !decodedPayload.userId) { 
      return NextResponse.json({ error: 'บัตรผ่านปลอมหรือหมดอายุ' }, { status: 401 })
    }

    const currentUserId = decodedPayload.userId // ได้ ID ของแท้มาแล้ว!

    // 3. รับชื่อคีย์จากหน้าเว็บ
    const body = await req.json().catch(() => ({}))
    const { name } = body

    // 4. สร้างคีย์ผูกกับผู้ใช้คนนี้ลง Database
    const rawKey = generateApiKey()
    const newApiKey = await prisma.apiKey.create({
      data: {
        key: rawKey,
        name: name || 'API Key ของฉัน',
        userId: currentUserId, 
        isActive: true,
      }
    })

    return NextResponse.json({
      message: 'สร้าง API Key สำเร็จ!',
      data: { id: newApiKey.id, key: rawKey, name: newApiKey.name, createdAt: newApiKey.createdAt, isActive: newApiKey.isActive }
    }, { status: 201 })

  } catch (error: any) {
    console.error('สร้างคีย์พัง:', error)
    return NextResponse.json({ error: 'ระบบขัดข้อง' }, { status: 500 })
  }
}

// --- เพิ่มโค้ดส่วนนี้ต่อท้ายไฟล์เดิม ---

export async function GET(req: NextRequest) {
  try {
    // 1. ตรวจบัตรผ่าน (เหมือนตอน POST เป๊ะ)
    const token = req.cookies.get('accessToken')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decodedPayload = await verifyJWT(token)
    
    if (!decodedPayload || !decodedPayload.userId) { 
      return NextResponse.json({ error: 'บัตรผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    // 2. ไปดึง API Keys จาก Database เฉพาะของ User คนนี้ (userId ตรงกัน)
    const keys = await prisma.apiKey.findMany({
      where: {
        userId: decodedPayload.userId
      },
      orderBy: {
        createdAt: 'desc' // เอาอันใหม่ขึ้นก่อน
      }
    })

    // 3. ส่งกลับไปให้หน้าบ้าน (ใช้ชื่อ apiKeys ให้ตรงกับหน้าบ้านที่เขียนไว้)
    return NextResponse.json({ apiKeys: keys })

  } catch (error) {
    console.error('ดึงข้อมูลคีย์พัง:', error)
    return NextResponse.json({ error: 'ไม่สามารถดึงข้อมูลได้' }, { status: 500 })
  }
}
export async function DELETE(request: Request) {
  try {
    // ดึง ID จาก URL (?id=...)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "ต้องระบุ ID ที่จะลบ" }, { status: 400 });
    }

    await prisma.apiKey.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "ลบข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}