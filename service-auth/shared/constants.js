// shared/constants.js
// ค่าคงที่กลาง — ทุกคน import ใช้ได้เลย ห้ามแก้โดยไม่แจ้งทีม

// ─── Service Ports ────────────────────────────────────────────────
export const PORTS = {
  LANDING:      3000,
  AUTH:         3001,
  INGESTION:    3002,
  CORE:         3003,
  ANALYTICS:    3004,
  NOTIFICATION: 3005,
};

// ─── Service URLs (ใช้ใน local dev) ──────────────────────────────
export const SERVICE_URLS = {
  LANDING:      `http://localhost:${PORTS.LANDING}`,
  AUTH:         `http://localhost:${PORTS.AUTH}`,
  INGESTION:    `http://localhost:${PORTS.INGESTION}`,
  CORE:         `http://localhost:${PORTS.CORE}`,
  ANALYTICS:    `http://localhost:${PORTS.ANALYTICS}`,
  NOTIFICATION: `http://localhost:${PORTS.NOTIFICATION}`,
};

// ─── Scholarship Levels ───────────────────────────────────────────
export const SCHOLARSHIP_LEVELS = [
  "มัธยม",
  "ปริญญาตรี",
  "ปริญญาโท",
  "ปริญญาเอก",
  "ทุกระดับ",
];

// ─── Scholarship Fields ───────────────────────────────────────────
export const SCHOLARSHIP_FIELDS = [
  "ทุกสาขา",
  "IT",
  "วิทยาศาสตร์",
  "วิศวกรรมศาสตร์",
  "บริหารธุรกิจ",
  "รัฐศาสตร์",
  "เศรษฐศาสตร์",
  "ศึกษาศาสตร์",
  "แพทยศาสตร์",
  "นิติศาสตร์",
  "ศิลปศาสตร์",
];

// ─── Countries ────────────────────────────────────────────────────
export const COUNTRIES = [
  "ทุกประเทศ",
  "ไทย",
  "UK",
  "US",
  "Japan",
  "Germany",
  "Australia",
  "China",
  "Singapore",
  "France",
];
// ─── Currencies ───────────────────────────────────────────────
export const CURRENCIES = [
  "THB",
  "USD",
  "GBP",
  "EUR",
  "JPY",
];
// ─── User Tiers ───────────────────────────────────────────────────
export const USER_TIERS = {
  FREE: "free",
  PRO:  "pro",
};

// ─── Rate Limits ──────────────────────────────────────────────────
export const RATE_LIMITS = {
  FREE: {
    REQUESTS_PER_HOUR: 100,
    REQUESTS_PER_DAY:  1000,
  },
  PRO: {
    REQUESTS_PER_HOUR: 1000,
    REQUESTS_PER_DAY:  10000,
  },
};

// ─── Pagination Defaults ─────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:     100,
};

// ─── Internal Header ─────────────────────────────────────────────
// ส่ง header นี้เมื่อ service เรียกหากันข้างใน
export const INTERNAL_HEADER = "X-Internal-Secret";

// ─── HTTP Status Codes ────────────────────────────────────────────
export const HTTP_STATUS = {
  OK:                    200,
  CREATED:               201,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  TOO_MANY_REQUESTS:     429,
  INTERNAL_SERVER_ERROR: 500,
};

// ─── Notification Types ───────────────────────────────────────────
export const NOTIFICATION_TYPES = {
  EMAIL:   "email",
  WEBHOOK: "webhook",
};

// ─── Webhook Retry ────────────────────────────────────────────────
export const WEBHOOK_RETRY = {
  MAX_ATTEMPTS:      3,
  RETRY_DELAY_MS:    5000,  // 5 วินาที
};

// ─── Cron Schedule ────────────────────────────────────────────────
// ใช้ใน service-ingestion
export const CRON_SCHEDULE = {
  SCRAPE_INTERVAL: "0 */6 * * *",  // ทุก 6 ชั่วโมง
};
