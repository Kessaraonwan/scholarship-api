// Test Cross-Service Communication
// Run this from service-notification API routes to test calling other services

/**
 * Example 1: notification → auth
 * Check user tier before allowing webhooks
 */
async function checkUserTier(userId: string) {
  try {
    // This would work once service-auth has /api/users endpoint
    const response = await fetch(`http://localhost:3001/api/users/${userId}`)
    
    if (!response.ok) {
      console.error(`Auth service error: ${response.status}`)
      return null
    }
    
    const user = await response.json()
    return user.data.tier // "free" | "pro"
  } catch (error) {
    console.error("Failed to fetch user from auth service:", error)
    return null
  }
}

/**
 * Example 2: core → notification
 * When new scholarship created, trigger notification rules
 */
async function triggerNotificationOnScholarship(scholarship: any) {
  try {
    const response = await fetch(
      `http://localhost:3005/api/internal/trigger`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarship })
      }
    )
    
    if (!response.ok) {
      console.error(`Notification service error: ${response.status}`)
      return null
    }
    
    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("Failed to trigger notifications:", error)
    return null
  }
}

/**
 * Example 3: notification → core
 * Get scholarship details for notification preview
 */
async function getScholarshipDetails(scholarshipId: string) {
  try {
    // This would work once service-core has /api/scholarships/[id] endpoint
    const response = await fetch(
      `http://localhost:3003/api/scholarships/${scholarshipId}`
    )
    
    if (!response.ok) {
      console.error(`Core service error: ${response.status}`)
      return null
    }
    
    const scholarship = await response.json()
    return scholarship.data
  } catch (error) {
    console.error("Failed to fetch scholarship from core service:", error)
    return null
  }
}

/**
 * Example 4: landing → all services
 * Health check aggregation
 */
async function checkAllServicesHealth() {
  const services = [
    { name: "auth", port: 3001 },
    { name: "core", port: 3003 },
    { name: "notification", port: 3005 },
    { name: "landing", port: 3000 },
  ]
  
  const results = await Promise.all(
    services.map(async (svc) => {
      try {
        const response = await fetch(`http://localhost:${svc.port}/api/health`)
        return {
          service: svc.name,
          status: response.ok ? "healthy" : "unhealthy",
          code: response.status,
        }
      } catch (error) {
        return {
          service: svc.name,
          status: "unreachable",
          code: null,
        }
      }
    })
  )
  
  return results
}

// Export for use in API routes
export { checkUserTier, triggerNotificationOnScholarship, getScholarshipDetails, checkAllServicesHealth }
