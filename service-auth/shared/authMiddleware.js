// shared/authMiddleware.js
// Middleware ตรวจสอบ API Key — ทุก service ที่ต้องการ Auth ใช้ได้เลย
// วิธีใช้: import { requireAuth } from '../shared/authMiddleware.js'

import { errorUnauthorized, errorServer } from "./apiHelpers.js";
import { INTERNAL_HEADER } from "./constants.js";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const INTERNAL_SECRET  = process.env.INTERNAL_SECRET  || "internal-secret-key";

// ─── ตรวจ API Key จาก Header ─────────────────────────────────────
// ใช้กับ route ที่ต้องการ Login
// ตัวอย่าง: router.get('/scholarships', requireAuth, handler)
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorUnauthorized(res, "กรุณาใส่ API Key ใน header: Authorization: Bearer <api_key>");
    }

    const apiKey = authHeader.split(" ")[1];

    // ส่งไปให้ service-auth ตรวจสอบ
    const response = await fetch(`${AUTH_SERVICE_URL}/internal/verify-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [INTERNAL_HEADER]: INTERNAL_SECRET,
      },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      return errorUnauthorized(res, "API Key ไม่ถูกต้องหรือหมดอายุ");
    }

    const { user } = await response.json();
    req.user = user; // แนบข้อมูล user ไปกับ request
    next();

  } catch (err) {
    console.error("Auth middleware error:", err);
    return errorServer(res, "ไม่สามารถเชื่อมต่อ Auth Service ได้");
  }
}

// ─── ตรวจ Internal Call ───────────────────────────────────────────
// ใช้กับ route ที่ให้เฉพาะ service อื่น เรียกหากันภายใน
// ตัวอย่าง: router.post('/internal/trigger', requireInternal, handler)
export function requireInternal(req, res, next) {
  const secret = req.headers[INTERNAL_HEADER.toLowerCase()];

  if (!secret || secret !== INTERNAL_SECRET) {
    return errorUnauthorized(res, "Internal call ไม่ได้รับอนุญาต");
  }

  next();
}

// ─── ตรวจ Pro Tier ────────────────────────────────────────────────
// ใช้ต่อจาก requireAuth เมื่อต้องการเฉพาะ Pro User
// ตัวอย่าง: router.get('/analytics', requireAuth, requirePro, handler)
export function requirePro(req, res, next) {
  if (!req.user || req.user.tier !== "pro") {
    return res.status(403).json({
      error: "ฟีเจอร์นี้สำหรับ Pro User เท่านั้น",
      code: 403,
    });
  }
  next();
}
