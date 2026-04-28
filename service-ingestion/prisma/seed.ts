import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("🧹 กำลังล้างข้อมูลเก่า...")
  await prisma.scholarship.deleteMany()

  console.log("📦 กำลังยัดข้อมูลภาษาไทย...")
  const data = [
    { name: "ทุนไอที สจล.", level: "ปริญญาตรี", field: "IT", country: "ไทย", deadline: new Date("2026-12-31"), amount: 50000, currency: "THB", url: "http://kmitl.ac.th", source: "กยศ.", description: "ทุนเรียนดี" },
    { name: "ทุนวิจัย Oxford", level: "ปริญญาโท", field: "วิทยาศาสตร์", country: "UK", deadline: new Date("2026-12-31"), amount: 15000, currency: "GBP", url: "http://oxford.ac.uk", source: "Chevening", description: "ทุนวิจัย" }
  ]

  for (const s of data) {
    await prisma.scholarship.create({ data: s })
  }
  console.log("⭐ สำเร็จแล้วแบงค์! ข้อมูลเข้าชัวร์")
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect())