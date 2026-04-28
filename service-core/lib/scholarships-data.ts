export interface Scholarship {
  id: string
  name: string
  level: string
  field: string
  country: string
  deadline: string
  amount: number | null
  currency: string | null
  description: string
  source: string
}

export const scholarships: Scholarship[] = [
  {
    id: "sch_001",
    name: "ทุน กยศ.",
    level: "ปริญญาตรี",
    field: "ทุกสาขา",
    country: "ไทย",
    deadline: "2025-06-30",
    amount: 30000,
    currency: "THB",
    description: "ทุนกู้ยืมเพื่อการศึกษาสำหรับนักศึกษาระดับปริญญาตรีที่ขาดแคลนทุนทรัพย์ ครอบคลุมค่าเล่าเรียน ค่าครองชีพ และค่าใช้จ่ายที่เกี่ยวข้องกับการศึกษา",
    source: "https://www.studentloan.or.th",
  },
  {
    id: "sch_002",
    name: "ทุน Chevening",
    level: "ปริญญาโท",
    field: "ทุกสาขา",
    country: "UK",
    deadline: "2025-11-05",
    amount: null,
    currency: null,
    description: "ทุนรัฐบาลสหราชอาณาจักรสำหรับผู้ที่มีศักยภาพเป็นผู้นำในอนาคต ครอบคลุมค่าเล่าเรียน ค่าครองชีพ และค่าเดินทางเต็มจำนวน",
    source: "https://www.chevening.org",
  },
  {
    id: "sch_003",
    name: "ทุน DAAD",
    level: "ปริญญาเอก",
    field: "วิทยาศาสตร์",
    country: "Germany",
    deadline: "2025-10-15",
    amount: 1200,
    currency: "EUR",
    description: "ทุนการศึกษาจากองค์กรแลกเปลี่ยนทางวิชาการเยอรมัน สนับสนุนการศึกษาระดับปริญญาเอกในสาขาวิทยาศาสตร์และเทคโนโลยี",
    source: "https://www.daad.de",
  },
  {
    id: "sch_004",
    name: "ทุน MEXT",
    level: "ปริญญาโท",
    field: "IT",
    country: "Japan",
    deadline: "2025-04-30",
    amount: 145000,
    currency: "JPY",
    description: "ทุนรัฐบาลญี่ปุ่นสำหรับนักศึกษาต่างชาติ ครอบคลุมค่าเล่าเรียน ค่าครองชีพรายเดือน และค่าเดินทาง",
    source: "https://www.mext.go.jp",
  },
  {
    id: "sch_005",
    name: "ทุน Fulbright",
    level: "ปริญญาโท",
    field: "ทุกสาขา",
    country: "US",
    deadline: "2025-05-15",
    amount: 50000,
    currency: "USD",
    description: "ทุนการศึกษาสำหรับการศึกษาต่อในสหรัฐอเมริกา เน้นการแลกเปลี่ยนทางวัฒนธรรมและวิชาการ",
    source: "https://www.fulbrightthai.org",
  },
  {
    id: "sch_006",
    name: "ทุนมูลนิธิยุวพัฒน์",
    level: "มัธยม",
    field: "ทุกสาขา",
    country: "ไทย",
    deadline: "2025-03-31",
    amount: 15000,
    currency: "THB",
    description: "ทุนการศึกษาสำหรับนักเรียนระดับมัธยมศึกษาที่มีผลการเรียนดีแต่ขาดแคลนทุนทรัพย์",
    source: "https://www.yuvabadhanafoundation.org",
  },
  {
    id: "sch_007",
    name: "ทุน Gates Cambridge",
    level: "ปริญญาเอก",
    field: "ทุกสาขา",
    country: "UK",
    deadline: "2025-10-09",
    amount: null,
    currency: null,
    description: "ทุนเต็มจำนวนสำหรับการศึกษาระดับบัณฑิตศึกษาที่มหาวิทยาลัยเคมบริดจ์ สนับสนุนโดยมูลนิธิ Bill & Melinda Gates",
    source: "https://www.gatescambridge.org",
  },
  {
    id: "sch_008",
    name: "ทุน ADB-JSP",
    level: "ปริญญาโท",
    field: "เศรษฐศาสตร์",
    country: "Japan",
    deadline: "2025-08-20",
    amount: 200000,
    currency: "JPY",
    description: "ทุนจากธนาคารพัฒนาเอเชียสำหรับการศึกษาด้านเศรษฐศาสตร์และการพัฒนาในมหาวิทยาลัยพันธมิตรในญี่ปุ่น",
    source: "https://www.adb.org/site/careers/japan-scholarship-program",
  },
]

export function getScholarshipById(id: string): Scholarship | undefined {
  return scholarships.find((s) => s.id === id)
}

export function getRelatedScholarships(scholarship: Scholarship, limit = 3): Scholarship[] {
  return scholarships
    .filter(
      (s) =>
        s.id !== scholarship.id &&
        (s.level === scholarship.level || s.field === scholarship.field)
    )
    .slice(0, limit)
}

export function getUpcomingScholarships(days = 90): Scholarship[] {
  const today = new Date()
  const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)

  return scholarships
    .filter((s) => {
      const deadline = new Date(s.deadline)
      return deadline >= today && deadline <= futureDate
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
}
