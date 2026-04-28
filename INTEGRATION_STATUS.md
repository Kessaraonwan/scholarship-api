# Cross-Service Integration Status Report
**Date:** April 28, 2026 | **Tested by:** ปิ่น (service-notification)

---

## 🏃 Running Services

| Service | Port | Status | Process |
|---------|------|--------|---------|
| landing | 3000 | ✅ Running | `pnpm dev -p 3000` |
| auth | 3001 | ✅ Running | `pnpm dev -p 3001` |
| **core** | 3003 | ✅ Running | `pnpm dev -p 3003` |
| **notification** | 3005 | ✅ Running | `pnpm dev -p 3005` |

---

## 🔌 API Endpoint Availability

| Service | Health Check | Status | Notes |
|---------|--------------|--------|-------|
| **notification** (3005) | GET /api/health | ✅ 200 | Using Next.js App Router |
| landing (3000) | GET /api/health | ❌ 404 | Using pages/ router (old) |
| auth (3001) | GET /api/health | ❌ 404 | Using pages/ router (old) |
| core (3003) | GET /api/health | ❌ 404 | Using pages/ router (old) |

---

## 📡 Current Routing Architecture

### ✅ Modern (App Router) - Only Notification
```
service-notification/
  app/
    api/
      health/
      notifications/
      webhooks/
      internal/trigger/
```

### ❌ Legacy (Pages Router) - Landing, Auth, Core
```
service-landing/
  pages/
    index.js
    docs/
    status/
    
service-auth/
  app/  (partial - has pages too)
    ...
  pages/
    login.js
    register.js
    
service-core/
  pages/
    index.js
    scholarships/
```

---

## 🚫 Cross-Service Communication Issues

**Problem:** Services using pages/ router CANNOT communicate easily because:
1. ❌ No `/api/health` endpoints
2. ❌ No `/api/*` REST endpoints (only server-side rendering)
3. ❌ Cannot be called by other services programmatically

**Example of what should work but doesn't:**
```typescript
// ❌ notification tries to call auth
const response = await fetch('http://localhost:3001/api/users/user-123');
// Result: 404 (endpoint doesn't exist in pages/ router)
```

---

## ✅ What Works Right Now

### From service-notification (Port 3005)

**Test 1: Health Check**
```bash
curl http://localhost:3005/api/health
# Response: { "service": "notification", "status": "ok" }
```

**Test 2: List Notifications**
```bash
curl "http://localhost:3005/api/notifications?userId=user-123"
# Response: [{ id: "rule-1", name: "IT Scholarships", ... }]
```

**Test 3: List Webhooks**
```bash
curl "http://localhost:3005/api/webhooks?userId=user-123"
# Response: [{ id: "webhook-1", url: "...", events: [...] }]
```

---

## 🔗 What Needs to Be Done (Week 3)

### Phase 1: Migrate All Services to App Router (Priority: Critical)
1. **service-auth** (แบงค์)
   - Create: `app/api/health`
   - Create: `app/api/users/[id]` (for tier checking)
   - Create: `app/api/keys/` (API key management)

2. **service-core** (อีฟ)
   - Create: `app/api/health`
   - Create: `app/api/scholarships` (GET, POST)
   - Create: `app/api/scholarships/[id]` (GET single)
   - Create: `app/api/internal/created` (internal webhook from ingestion)

3. **service-landing** (ซี)
   - Create: `app/api/health`
   - Create: `app/api/status` (aggregate health from other services)

### Phase 2: Cross-Service Webhooks (Week 3)
1. **service-core** → **service-notification**
   - When new scholarship created
   - POST `http://localhost:3005/api/internal/trigger` with scholarship data

2. **service-notification** → **service-auth**
   - Check user tier before allowing webhooks
   - GET `http://localhost:3001/api/users/[id]`

3. **service-ingestion** → **service-core**
   - When data synced
   - POST `http://localhost:3003/api/scholarships/batch` (bulk create)

---

## 📊 Integration Test Matrix

```
┌─────────────┬──────────┬──────────┬────────┬──────────────┐
│ From → To   │ Landing  │ Auth     │ Core   │ Notification │
├─────────────┼──────────┼──────────┼────────┼──────────────┤
│ Landing     │ -        │ ❌ 404   │ ❌ 404 │ ❌ 404       │
│ Auth        │ ❌ 404   │ -        │ ❌ 404 │ ❌ 404       │
│ Core        │ ❌ 404   │ ❌ 404   │ -      │ ✅ Ready     │
│ Notification│ ❌ 404   │ ❌ 404   │ ❌ 404 │ -            │
└─────────────┴──────────┴──────────┴────────┴──────────────┘
```

---

## 🎯 ปิ่น's Next Actions (Recommended Order)

### Option A: Wait for Other Teams (Safe) 🕐
- Other teams finish FE sync + migrate to app router
- Then implement cross-service webhooks together

### Option B: Build Infrastructure (Aggressive) 🚀
1. Create simple API gateway/proxy layer
2. Implement cross-service health monitoring
3. Build webhook dispatcher in notification service
4. Document integration patterns for others to follow

### Option C: Focus on Notification (Current) ✅
- Enhance notification service features
- Implement webhook actual delivery
- Add Pro tier checking via cross-service calls

---

## 💡 Recommended Fix (Quick Win)

**Create basic API stubs in all services** (30 min each):

**service-auth:**
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ service: "auth", status: "ok" })
}
```

**service-core:**
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ service: "core", status: "ok" })
}
```

**service-landing:**
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ service: "landing", status: "ok" })
}
```

This would allow:
- ✅ Health check pings between services
- ✅ Service discovery
- ✅ Basic readiness checks

---

## 📝 Summary

| Aspect | Current State | Next Step |
|--------|---------------|-----------|
| Service Ports | ✅ All running | - |
| FE Components | ✅ Notification only | Migrate others |
| API Endpoints | ❌ Notification only | Add stubs to others |
| Cross-Service Calls | ❌ Not possible | Implement app router |
| Webhooks | 🚀 Ready in notification | Deploy + test |

**Status:** Services can see each other on localhost but cannot communicate via HTTP API yet.
