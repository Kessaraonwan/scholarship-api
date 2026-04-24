// shared/apiHelpers.js
// ฟังก์ชันกลางสำหรับสร้าง API Response — ทุกคน import ใช้ได้เลย
// ทำให้ response หน้าตาเหมือนกันทุก service

import { HTTP_STATUS, PAGINATION } from "./constants.js";

// ─── Success Response ─────────────────────────────────────────────

// ส่งข้อมูล list พร้อม pagination
// ใช้: return successList(res, scholarships, total, page, limit)
export function successList(res, data, total, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT) {
  return res.status(HTTP_STATUS.OK).json({
    data,
    meta: { total, page, limit },
  });
}

// ส่งข้อมูล single item
// ใช้: return successItem(res, scholarship)
export function successItem(res, data) {
  return res.status(HTTP_STATUS.OK).json({ data });
}

// ส่ง created response
// ใช้: return successCreated(res, newUser)
export function successCreated(res, data) {
  return res.status(HTTP_STATUS.CREATED).json({ data });
}

// ─── Error Response ───────────────────────────────────────────────

export function errorBadRequest(res, message = "ข้อมูลไม่ถูกต้อง") {
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    error: message,
    code: HTTP_STATUS.BAD_REQUEST,
  });
}

export function errorUnauthorized(res, message = "ไม่มีสิทธิ์เข้าถึง กรุณา Login หรือใส่ API Key") {
  return res.status(HTTP_STATUS.UNAUTHORIZED).json({
    error: message,
    code: HTTP_STATUS.UNAUTHORIZED,
  });
}

export function errorForbidden(res, message = "ไม่มีสิทธิ์ดำเนินการนี้") {
  return res.status(HTTP_STATUS.FORBIDDEN).json({
    error: message,
    code: HTTP_STATUS.FORBIDDEN,
  });
}

export function errorNotFound(res, message = "ไม่พบข้อมูลที่ต้องการ") {
  return res.status(HTTP_STATUS.NOT_FOUND).json({
    error: message,
    code: HTTP_STATUS.NOT_FOUND,
  });
}

export function errorRateLimit(res, message = "เกิน Rate Limit กรุณารอสักครู่") {
  return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
    error: message,
    code: HTTP_STATUS.TOO_MANY_REQUESTS,
  });
}

export function errorServer(res, message = "เกิดข้อผิดพลาดภายในระบบ") {
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: message,
    code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
  });
}

// ─── Pagination Helper ────────────────────────────────────────────

// แปลง query params เป็นตัวเลข page/limit ที่ถูกต้อง
// ใช้: const { page, limit, offset } = parsePagination(req.query)
export function parsePagination(query) {
  const page  = Math.max(1, parseInt(query.page)  || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

// ─── Health Check Response ────────────────────────────────────────

// ใช้ใน GET /health ของทุก service
// ซีจะเรียก endpoint นี้เพื่อแสดงใน /status
export function healthCheck(res, serviceName) {
  return res.status(HTTP_STATUS.OK).json({
    service: serviceName,
    status:  "ok",
    timestamp: new Date().toISOString(),
  });
}
