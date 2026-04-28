import { Client } from 'pg';

async function seedData() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/ingestion_db", 
  });

  try {
    console.log("🚀 กำลังเชื่อมต่อ...");
    await client.connect();
    
    console.log("✅ เชื่อมต่อสำเร็จ! กำลังล้างข้อมูลเก่า...");
    await client.query('TRUNCATE TABLE "Scholarship" RESTART IDENTITY CASCADE;');

    // ✅ เพิ่ม lastUpdated และ createdAt เข้าไปใน Query
    const query = `
      INSERT INTO "Scholarship" (id, name, level, field, country, deadline, amount, currency, url, source, description, "lastUpdated", "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const scholarships = [
      ["id-001", "ทุนไอที สจล.", "ปริญญาตรี", "IT", "ไทย", "2026-12-31", 50000, "THB", "http://kmitl.ac.th", "กยศ.", "ทุนเรียนดีด้านคอมพิวเตอร์"],
      ["id-002", "ทุนวิจัย Oxford", "ปริญญาโท", "วิทยาศาสตร์", "UK", "2026-12-31", 15000, "GBP", "http://oxford.ac.uk", "Chevening", "ทุนวิจัยระดับโลก"],
      ["id-003", "ทุนรัฐบาลญี่ปุ่น", "ปริญญาเอก", "เศรษฐศาสตร์", "Japan", "2026-12-31", 200000, "JPY", "http://mext.go.jp", "MEXT", "ทุนเรียนต่อญี่ปุ่น"],
      ["id-004", "ทุนแลกเปลี่ยนมัธยม US", "มัธยม", "ทุกสาขา", "US", "2026-12-31", 5000, "USD", "http://afs.org", "AFS", "ทุนแลกเปลี่ยนวัฒนธรรม"],
      ["id-005", "ทุนเรียนต่อเยอรมนี", "ปริญญาตรี", "IT", "Germany", "2026-12-31", 10000, "EUR", "http://daad.de", "DAAD", "ทุนสาย Dev เยอรมัน"]
    ];

    console.log("📦 กำลังยัดข้อมูลภาษาไทย 5 รายการ...");
    for (const s of scholarships) {
      await client.query(query, s);
      console.log(`+ เพิ่มสำเร็จ: ${s[0]}`);
    }

    console.log("⭐ จบงาน! ข้อมูลเข้าแล้วแบงค์!");
  } catch (err) {
    console.error("❌ ยังพังอยู่เพราะ:", err.message);
  } finally {
    await client.end();
  }
}

seedData();