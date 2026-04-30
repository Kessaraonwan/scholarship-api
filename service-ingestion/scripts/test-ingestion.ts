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
      ["id-005", "ทุนเรียนต่อเยอรมนี", "ปริญญาตรี", "IT", "Germany", "2026-12-31", 10000, "EUR", "http://daad.de", "DAAD", "ทุนสาย Dev เยอรมัน"],
      ["id-006", "ทุน Erasmus Mundus", "ปริญญาโท", "สหวิทยาการ", "EU", "2026-09-30", 25000, "EUR", "https://erasmus-plus.ec.europa.eu", "EU Council", "ทุนเรียนต่อยุโรป 3 ประเทศ"],
      ["id-007", "ทุน Fullbright Thai Graduate", "ปริญญาโท", "ทุกสาขา", "USA", "2026-05-15", 35000, "USD", "https://www.fulbrightthai.org", "Fulbright", "ทุนเรียนต่ออเมริกาชื่อดัง"],
      ["id-008", "ทุนรัฐบาลเกาหลี (GKS)", "ปริญญาตรี", "ภาษาและวัฒนธรรม", "South Korea", "2026-10-20", 1200000, "KRW", "https://www.studyinkorea.go.kr", "NIIED", "ทุนเรียนฟรีรวมค่าครองชีพ"],
      ["id-009", "ทุน Australia Awards", "ปริญญาโท", "การพัฒนาที่ยั่งยืน", "Australia", "2026-04-30", 30000, "AUD", "https://www.dfat.gov.au", "Australian Gov", "ทุนพัฒนาบุคลากรภาครัฐ"],
      ["id-010", "ทุนวิศวกรรม Tsinghua", "ปริญญาเอก", "Engineering", "China", "2026-03-01", 60000, "CNY", "https://www.tsinghua.edu.cn", "Chinese Gov", "ทุนสาย Tech อันดับ 1 ของจีน"],
      ["id-011", "ทุนพยาบาลศิริราช", "ปริญญาตรี", "พยาบาลศาสตร์", "ไทย", "2026-06-30", 20000, "THB", "https://www.si.mahidol.ac.th", "มหาวิทยาลัยมหิดล", "ทุนช่วยเหลือค่าเล่าเรียน"],
      ["id-012", "ทุนดีไซน์เนอร์มิลาน", "อนุปริญญา", "Fashion Design", "Italy", "2026-07-15", 8000, "EUR", "https://www.ied.edu", "IED Milan", "ทุนสายแฟชั่นที่อิตาลี"],
      ["id-013", "ทุนเรียนดีสิงคโปร์ (ASEAN)", "ปริญญาตรี", "ทุกสาขา", "Singapore", "2026-01-15", 10000, "SGD", "https://www.moe.gov.sg", "Singapore Gov", "ทุนสำหรับนักเรียนในอาเซียน"],
      ["id-014", "ทุนสถาบันวิจัย CERN", "ระยะสั้น", "Physics", "Switzerland", "2026-02-28", 4000, "CHF", "https://home.cern", "CERN", "ทุนฝึกงานวิจัยภาคฤดูร้อน"],
      ["id-015", "ทุน Google Generations", "ปริญญาตรี", "Computer Science", "Global", "2026-11-15", 2500, "USD", "https://buildyourfuture.withgoogle.com", "Google", "ทุนสนับสนุนผู้หญิงในสาย Tech"],
      ["id-016", "ทุนรัฐบาลฝรั่งเศส (France Excellence)", "ปริญญาโท", "ความสัมพันธ์ระหว่างประเทศ", "France", "2026-05-31", 12000, "EUR", "https://www.thailande.campusfrance.org", "Campus France", "ทุนเรียนต่อฝรั่งเศสหลักสูตรภาษาอังกฤษ/ฝรั่งเศส"],
      ["id-017", "ทุน Vanier Canada Graduate", "ปริญญาเอก", "วิจัยทางแพทย์", "Canada", "2026-11-01", 50000, "CAD", "https://vanier.gc.ca", "Canadian Gov", "ทุนวิจัยระดับสูงในแคนาดา"],
      ["id-018", "ทุนรัฐบาลไต้หวัน (MOE)", "ปริญญาตรี", "บริหารธุรกิจ", "Taiwan", "2026-03-31", 40000, "TWD", "https://www.moe.gov.tw", "Taiwan MOE", "ทุนเรียนต่อไต้หวันพร้อมเบี้ยเลี้ยงรายเดือน"],
      ["id-019", "ทุนนักกีฬาช้างเผือก", "ปริญญาตรี", "วิทยาศาสตร์การกีฬา", "ไทย", "2026-08-20", 15000, "THB", "https://www.chula.ac.th", "จุฬาลงกรณ์มหาวิทยาลัย", "ทุนสำหรับนักกีฬาทีมชาติหรือระดับเยาวชน"],
      ["id-020", "ทุนวิทยสิริเมธี (VISTEC)", "ปริญญาเอก", "พลังงานใหม่", "ไทย", "2026-04-15", 600000, "THB", "https://www.vistec.ac.th", "PTT", "ทุนวิจัยขั้นสูงด้านพลังงานและวัสดุ"]
    
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