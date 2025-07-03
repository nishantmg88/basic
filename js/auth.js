// Enhanced Authentication Manager with advanced security
class AuthManager {
  constructor() {
    this.sessionKey = "adminSession"
    this.sessionTimeout = 2 * 60 * 60 * 1000 // 2 hours
    this.refreshThreshold = 30 * 60 * 1000 // 30 minutes
    this.currentSession = null
    this.refreshTimer = null
    this.activityTimer = null
    this.lastActivity = Date.now()

    this.init()
  }

  // Initialize authentication manager
  init() {
    this.loadSession()
    this.setupActivityTracking()
    this.setupSessionRefresh()
  }

  // Create new session
  createSession(username, additionalData = {}) {
    const sessionData = {
      username,
      loginTime: Date.now(),
      lastActivity: Date.now(),
      expiresAt: Date.now() + this.sessionTimeout,
      sessionId: this.generateSessionId(),
      fingerprint: window.securityManager?.getClientFingerprint() || "unknown",
      permissions: this.getUserPermissions(username),
      ...additionalData,
    }

    this.currentSession = sessionData
    this.saveSession()
    this.startSessionRefresh()
    this.logAuthEvent("SESSION_CREATED", { username })

    return sessionData
  }

  // Generate unique session ID
  generateSessionId() {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2)
    return `${timestamp}-${randomPart}`
  }

  // Get user permissions based on role
  getUserPermissions(username) {
    const rolePermissions = {
      admin: ["read", "write", "delete", "manage_users", "view_reports", "system_settings"],
      principal: ["read", "write", "view_reports", "manage_notices", "manage_results"],
      teacher: ["read", "write", "manage_notices", "view_results"],
    }

    return rolePermissions[username] || ["read"]
  }

  // Check if user has specific permission
  hasPermission(permission) {
    if (!this.currentSession) return false
    return this.currentSession.permissions.includes(permission)
  }

  // Validate session
  isSessionValid() {
    if (!this.currentSession) {
      return false
    }

    const now = Date.now()

    // Check if session has expired
    if (now > this.currentSession.expiresAt) {
      this.logAuthEvent("SESSION_EXPIRED", { username: this.currentSession.username })
      this.logout()
      return false
    }

    // Check for suspicious activity (session hijacking)
    const currentFingerprint = window.securityManager?.getClientFingerprint() || "unknown"
    if (this.currentSession.fingerprint !== currentFingerprint) {
      this.logAuthEvent("SESSION_HIJACK_ATTEMPT", {
        username: this.currentSession.username,
        originalFingerprint: this.currentSession.fingerprint,
        currentFingerprint,
      })
      this.logout()
      return false
    }

    // Check for inactivity timeout
    const inactivityTimeout = 30 * 60 * 1000 // 30 minutes
    if (now - this.currentSession.lastActivity > inactivityTimeout) {
      this.logAuthEvent("SESSION_INACTIVE_TIMEOUT", { username: this.currentSession.username })
      this.logout()
      return false
    }

    return true
  }

  // Update session activity
  updateActivity() {
    if (this.currentSession) {
      this.currentSession.lastActivity = Date.now()
      this.lastActivity = Date.now()
      this.saveSession()
    }
  }

  // Refresh session (extend expiry)
  refreshSession() {
    if (this.currentSession && this.isSessionValid()) {
      const now = Date.now()
      this.currentSession.expiresAt = now + this.sessionTimeout
      this.currentSession.lastActivity = now
      this.saveSession()
      this.logAuthEvent("SESSION_REFRESHED", { username: this.currentSession.username })
      return true
    }
    return false
  }

  // Setup automatic session refresh
  startSessionRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }

    this.refreshTimer = setInterval(() => {
      if (this.currentSession) {
        const timeUntilExpiry = this.currentSession.expiresAt - Date.now()

        // Refresh if within threshold and user is active
        if (timeUntilExpiry < this.refreshThreshold && Date.now() - this.lastActivity < 5 * 60 * 1000) {
          // Active within 5 minutes
          this.refreshSession()
        }
      }
    }, 60000) // Check every minute
  }

  // Setup activity tracking
  setupActivityTracking() {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]

    const updateActivity = () => {
      this.updateActivity()
    }

    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.updateActivity()
      }
    })
  }

  // Save session to localStorage with encryption
  saveSession() {
    if (this.currentSession) {
      try {
        const encrypted = this.encryptData(JSON.stringify(this.currentSession))
        localStorage.setItem(this.sessionKey, encrypted)
      } catch (error) {
        console.warn("Failed to save session:", error)
      }
    }
  }

  // Load session from localStorage with decryption
  loadSession() {
    try {
      const encrypted = localStorage.getItem(this.sessionKey)
      if (encrypted) {
        const decrypted = this.decryptData(encrypted)
        this.currentSession = JSON.parse(decrypted)

        if (this.isSessionValid()) {
          this.startSessionRefresh()
          return this.currentSession
        } else {
          this.logout()
        }
      }
    } catch (error) {
      console.warn("Failed to load session:", error)
      this.logout()
    }
    return null
  }

  // Simple encryption for session data (in production, use proper encryption)
  encryptData(data) {
    // This is a simple XOR cipher for demo purposes
    // In production, use proper encryption libraries
    const key = "schoolSecretKey2024"
    let encrypted = ""

    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
    }

    return btoa(encrypted)
  }

  // Simple decryption for session data
  decryptData(encryptedData) {
    try {
      const data = atob(encryptedData)
      const key = "schoolSecretKey2024"
      let decrypted = ""

      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }

      return decrypted
    } catch (error) {
      throw new Error("Failed to decrypt session data")
    }
  }

  // Get current session
  getCurrentSession() {
    return this.currentSession
  }

  // Get current user
  getCurrentUser() {
    return this.currentSession?.username || null
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.isSessionValid()
  }

  // Logout user
  logout() {
    if (this.currentSession) {
      this.logAuthEvent("SESSION_ENDED", { username: this.currentSession.username })
    }

    this.currentSession = null

    try {
      localStorage.removeItem(this.sessionKey)
    } catch (error) {
      console.warn("Failed to remove session:", error)
    }

    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }

    if (this.activityTimer) {
      clearInterval(this.activityTimer)
      this.activityTimer = null
    }

    // Redirect to login page if on admin pages
    if (window.location.pathname.includes("admin") && !window.location.pathname.includes("admin-login")) {
      window.location.href = "admin-login.html"
    }
  }

  // Force logout all sessions (useful for security)
  forceLogoutAll() {
    this.logout()

    // Clear all related data
    const keysToRemove = ["loginAttempts", "blockedIPs", "securityEvents"]
    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.warn(`Failed to remove ${key}:`, error)
      }
    })

    this.logAuthEvent("FORCE_LOGOUT_ALL")
  }

  // Get session info for display
  getSessionInfo() {
    if (!this.currentSession) return null

    const now = Date.now()
    const timeRemaining = this.currentSession.expiresAt - now
    const sessionDuration = now - this.currentSession.loginTime

    return {
      username: this.currentSession.username,
      loginTime: new Date(this.currentSession.loginTime),
      lastActivity: new Date(this.currentSession.lastActivity),
      timeRemaining: Math.max(0, timeRemaining),
      sessionDuration,
      permissions: this.currentSession.permissions,
      sessionId: this.currentSession.sessionId,
    }
  }

  // Log authentication events
  logAuthEvent(type, details = {}) {
    const event = {
      type,
      timestamp: Date.now(),
      sessionId: this.currentSession?.sessionId || "none",
      fingerprint: window.securityManager?.getClientFingerprint() || "unknown",
      ...details,
    }

    // Store in security manager if available
    if (window.securityManager) {
      window.securityManager.logSecurityEvent(`AUTH_${type}`, event)
    }

    // Log to console in development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.log("Auth Event:", event)
    }
  }

  // Change password (placeholder for future implementation)
  changePassword(oldPassword, newPassword) {
    // This would typically involve server-side validation
    // For now, just log the attempt
    this.logAuthEvent("PASSWORD_CHANGE_ATTEMPT", {
      username: this.currentSession?.username,
    })

    // In a real implementation, this would:
    // 1. Validate old password
    // 2. Hash new password
    // 3. Update in database
    // 4. Force re-login

    return { success: false, message: "Password change not implemented in demo" }
  }

  // Get authentication statistics
  getAuthStats() {
    const sessionInfo = this.getSessionInfo()
    const securityReport = window.securityManager?.getSecurityReport() || {}

    return {
      isLoggedIn: this.isLoggedIn(),
      currentUser: this.getCurrentUser(),
      sessionInfo,
      securityReport,
      lastActivity: new Date(this.lastActivity),
    }
  }
}

// Initialize global auth manager
window.adminAuth = new AuthManager()

// Auto-logout on page unload for security
window.addEventListener("beforeunload", () => {
  if (window.adminAuth && window.adminAuth.isLoggedIn()) {
    window.adminAuth.updateActivity()
  }
})

// Check session validity on page focus
window.addEventListener("focus", () => {
  if (window.adminAuth && !window.adminAuth.isSessionValid()) {
    window.adminAuth.logout()
  }
})
