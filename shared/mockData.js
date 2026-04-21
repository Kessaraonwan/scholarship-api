// shared/mockData.js
// Mock data กลาง — ทุกคน import ใช้ได้เลยระหว่าง dev
// ห้ามแก้ไขโดยไม่แจ้งทีม

export const mockScholarships = [
  {
    id: "1",
    name: "ทุน กยศ.",
    level: "ปริญญาตรี",
    field: "ทุกสาขา",
    country: "ไทย",
    deadline: "2025-06-30",
    amount: 30000,
    currency: "THB",
    url: "https://www.studentloan.or.th",
    source: "กยศ.",
    description: "กองทุนเงินให้กู้ยืมเพื่อการศึกษา สำหรับนักศึกษาที่ขาดแคลนทุนทรัพย์",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "ทุน Chevening",
    level: "ปริญญาโท",
    field: "ทุกสาขา",
    country: "UK",
    deadline: "2025-11-05",
    amount: null,
    currency: "GBP",
    url: "https://www.chevening.org",
    source: "Chevening",
    description: "ทุนจากรัฐบาลอังกฤษ สำหรับผู้นำรุ่นใหม่จากทั่วโลก",
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "ทุน DAAD",
    level: "ปริญญาเอก",
    field: "วิทยาศาสตร์",
    country: "Germany",
    deadline: "2025-10-15",
    amount: 1200,
    currency: "EUR",
    url: "https://www.daad.de",
    source: "DAAD",
    description: "ทุนวิจัยระดับปริญญาเอก จากองค์กรแลกเปลี่ยนทางวิชาการเยอรมัน",
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "ทุน ก.พ. ต่างประเทศ",
    level: "ปริญญาโท",
    field: "รัฐศาสตร์",
    country: "US",
    deadline: "2025-03-31",
    amount: null,
    currency: "USD",
    url: "https://www.ocsc.go.th",
    source: "ก.พ.",
    description: "ทุนรัฐบาลไทยสำหรับข้าราชการเพื่อศึกษาต่อต่างประเทศ",
    createdAt: "2025-01-04T00:00:00Z",
    updatedAt: "2025-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "ทุน ADB–JSP",
    level: "ปริญญาโท",
    field: "เศรษฐศาสตร์",
    country: "Japan",
    deadline: "2025-08-20",
    amount: null,
    currency: "USD",
    url: "https://www.adb.org/site/careers/japan-scholarship-program",
    source: "ADB",
    description: "ทุน Asian Development Bank สำหรับนักศึกษาจากประเทศกำลังพัฒนา",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
];

// Mock Users (ใช้สำหรับ service-auth และ service-notification)
// Password hashes are for development only
export const mockUsers = [
  {
    id: "u1",
    email: "test@example.com",
    name: "Test User",
    password: "$2b$10$oJPqLlPxQhcg2V9gWEJpGuJwJ9fO5JKZ7eKsLZJhfM5Hqu7ZxXpNe", // "password123"
    tier: "free",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "u2",
    email: "pro@example.com",
    name: "Pro User",
    password: "$2b$10$oJPqLlPxQhcg2V9gWEJpGuJwJ9fO5JKZ7eKsLZJhfM5Hqu7ZxXpNe", // "password123"
    tier: "pro",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "admin",
    email: "admin@example.com",
    name: "Admin User",
    password: "$2b$10$oJPqLlPxQhcg2V9gWEJpGuJwJ9fO5JKZ7eKsLZJhfM5Hqu7ZxXpNe", // "password123"
    tier: "pro",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// Mock API Keys (ใช้สำหรับ dev)
export const mockApiKeys = [
  {
    id: "key1",
    userId: "u1",
    key: "sk-test1234567890abcdef",
    name: "Test Key 1",
    isActive: true,
    lastUsed: "2025-01-15T10:30:00Z",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "key2",
    userId: "u2",
    key: "sk-pro1234567890abcdef1",
    name: "Pro Key 1",
    isActive: true,
    lastUsed: "2025-01-16T14:20:00Z",
    createdAt: "2025-01-02T00:00:00Z",
  },
];

// Mock Ingestion Logs (ใช้สำหรับ service-ingestion)
export const mockIngestionLogs = [
  {
    id: "log1",
    source: "กยศ.",
    status: "success",
    countNew: 5,
    errorMsg: null,
    startedAt: "2025-01-10T08:00:00Z",
    finishedAt: "2025-01-10T08:15:00Z",
  },
  {
    id: "log2",
    source: "Chevening",
    status: "success",
    countNew: 3,
    errorMsg: null,
    startedAt: "2025-01-10T14:00:00Z",
    finishedAt: "2025-01-10T14:08:00Z",
  },
];

// Mock Notification Rules (ใช้สำหรับ service-notification)
export const mockNotificationRules = [
  {
    id: "r1",
    userId: "u1",
    field: "IT",
    level: "ปริญญาโท",
    country: null,
    isActive: true,
    webhookUrl: null,
    email: "test@example.com",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "r2",
    userId: "u2",
    field: null,
    level: null,
    country: "ไทย",
    isActive: true,
    webhookUrl: "https://webhook.example.com/scholarships",
    email: "pro@example.com",
    createdAt: "2025-01-02T00:00:00Z",
  },
];
