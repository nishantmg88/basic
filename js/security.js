// Enhanced Security Manager with advanced features
class SecurityManager {
  constructor() {
    this.maxAttempts = 3
    this.lockoutDuration = 15 * 60 * 1000 // 15 minutes
    this.sessionTimeout = 2 * 60 * 60 * 1000 // 2 hours
    this.attempts = this.loadAttempts()
    this.blockedIPs = this.loadBlockedIPs()
    this.rateLimits = new Map()
    this.csrfTokens = new Map()
    this.suspiciousActivity = []

    // Initialize security monitoring
    this.initSecurityMonitoring()
  }

  // Load login attempts from localStorage
  loadAttempts() {
    try {
      const stored = localStorage.getItem("loginAttempts")
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn("Failed to load login attempts:", error)
      return {}
    }
  }

  // Save login attempts to localStorage
  saveAttempts() {
    try {
      localStorage.setItem("loginAttempts", JSON.stringify(this.attempts))
    } catch (error) {
      console.warn("Failed to save login attempts:", error)
    }
  }

  // Load blocked IPs from localStorage
  loadBlockedIPs() {
    try {
      const stored = localStorage.getItem("blockedIPs")
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.warn("Failed to load blocked IPs:", error)
      return {}
    }
  }

  // Save blocked IPs to localStorage
  saveBlockedIPs() {
    try {
      localStorage.setItem("blockedIPs", JSON.stringify(this.blockedIPs))
    } catch (error) {
      console.warn("Failed to save blocked IPs:", error)
    }
  }

  // Get client fingerprint for tracking
  getClientFingerprint() {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText("Security fingerprint", 2, 2)

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      timestamp: Date.now(),
    }

    return btoa(JSON.stringify(fingerprint)).slice(0, 32)
  }

  // Record login attempt with enhanced tracking
  recordLoginAttempt(username, success, additionalInfo = {}) {
    const fingerprint = this.getClientFingerprint()
    const timestamp = Date.now()
    const key = `${username}_${fingerprint}`

    if (!this.attempts[key]) {
      this.attempts[key] = {
        count: 0,
        firstAttempt: timestamp,
        lastAttempt: timestamp,
        blocked: false,
        blockTime: null,
        fingerprint: fingerprint,
        attempts: [],
      }
    }

    // Record attempt details
    this.attempts[key].attempts.push({
      timestamp,
      success,
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      ...additionalInfo,
    })

    this.attempts[key].lastAttempt = timestamp

    if (!success) {
      this.attempts[key].count++

      // Check for suspicious patterns
      this.detectSuspiciousActivity(key, username)

      if (this.attempts[key].count >= this.maxAttempts) {
        this.attempts[key].blocked = true
        this.attempts[key].blockTime = timestamp
        this.logSecurityEvent("ACCOUNT_LOCKED", { username, fingerprint })
      }
    } else {
      // Reset on successful login
      this.attempts[key].count = 0
      this.attempts[key].blocked = false
      this.attempts[key].blockTime = null
      this.logSecurityEvent("LOGIN_SUCCESS", { username, fingerprint })
    }

    this.saveAttempts()
  }

  // Detect suspicious activity patterns
  detectSuspiciousActivity(key, username) {
    const attempt = this.attempts[key]
    const recentAttempts = attempt.attempts.filter(
      (a) => Date.now() - a.timestamp < 5 * 60 * 1000, // Last 5 minutes
    )

    // Check for rapid-fire attempts
    if (recentAttempts.length >= 5) {
      this.logSecurityEvent("RAPID_FIRE_ATTEMPTS", { username, count: recentAttempts.length })
    }

    // Check for different user agents (potential bot)
    const userAgents = new Set(recentAttempts.map((a) => a.userAgent))
    if (userAgents.size > 2) {
      this.logSecurityEvent("MULTIPLE_USER_AGENTS", { username, userAgents: Array.from(userAgents) })
    }

    // Check for time-based patterns (potential automated attack)
    if (recentAttempts.length >= 3) {
      const intervals = []
      for (let i = 1; i < recentAttempts.length; i++) {
        intervals.push(recentAttempts[i].timestamp - recentAttempts[i - 1].timestamp)
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
      if (avgInterval < 2000) {
        // Less than 2 seconds between attempts
        this.logSecurityEvent("AUTOMATED_ATTACK_SUSPECTED", { username, avgInterval })
      }
    }
  }

  // Check if account is blocked
  isBlocked(username) {
    const fingerprint = this.getClientFingerprint()
    const key = `${username}_${fingerprint}`
    const attempt = this.attempts[key]

    if (!attempt || !attempt.blocked) {
      return false
    }

    // Check if lockout period has expired
    if (Date.now() - attempt.blockTime > this.lockoutDuration) {
      attempt.blocked = false
      attempt.blockTime = null
      attempt.count = 0
      this.saveAttempts()
      return false
    }

    return true
  }

  // Get remaining block time
  getRemainingBlockTime(username) {
    const fingerprint = this.getClientFingerprint()
    const key = `${username}_${fingerprint}`
    const attempt = this.attempts[key]

    if (!attempt || !attempt.blocked) {
      return 0
    }

    const remaining = this.lockoutDuration - (Date.now() - attempt.blockTime)
    return Math.max(0, remaining)
  }

  // Rate limiting for API calls
  checkRateLimit(endpoint, limit = 10, window = 60000) {
    const fingerprint = this.getClientFingerprint()
    const key = `${endpoint}_${fingerprint}`
    const now = Date.now()

    if (!this.rateLimits.has(key)) {
      this.rateLimits.set(key, [])
    }

    const requests = this.rateLimits.get(key)

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < window)

    if (validRequests.length >= limit) {
      this.logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint, fingerprint })
      return false
    }

    validRequests.push(now)
    this.rateLimits.set(key, validRequests)
    return true
  }

  // Generate CSRF token
  generateCSRFToken() {
    const token = this.generateSecureToken(32)
    const fingerprint = this.getClientFingerprint()
    this.csrfTokens.set(fingerprint, {
      token,
      timestamp: Date.now(),
      used: false,
    })
    return token
  }

  // Validate CSRF token
  validateCSRFToken(token) {
    const fingerprint = this.getClientFingerprint()
    const storedToken = this.csrfTokens.get(fingerprint)

    if (!storedToken || storedToken.used) {
      return false
    }

    // Check if token has expired (1 hour)
    if (Date.now() - storedToken.timestamp > 60 * 60 * 1000) {
      this.csrfTokens.delete(fingerprint)
      return false
    }

    if (storedToken.token === token) {
      storedToken.used = true
      return true
    }

    this.logSecurityEvent("CSRF_TOKEN_MISMATCH", { fingerprint })
    return false
  }

  // Input validation and sanitization
  validateInput(input, type = "text", options = {}) {
    if (typeof input !== "string") {
      return { valid: false, error: "Input must be a string" }
    }

    // Check for common injection patterns
    const injectionPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
    ]

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) {
        this.logSecurityEvent("INJECTION_ATTEMPT", { input: input.substring(0, 100) })
        return { valid: false, error: "Potentially malicious input detected" }
      }
    }

    // Type-specific validation
    switch (type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(input)) {
          return { valid: false, error: "Invalid email format" }
        }
        break

      case "phone":
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(input.replace(/[\s\-$$$$]/g, ""))) {
          return { valid: false, error: "Invalid phone number format" }
        }
        break

      case "studentId":
        const studentIdRegex = /^STU\d{3}$/
        if (!studentIdRegex.test(input)) {
          return { valid: false, error: "Invalid student ID format" }
        }
        break

      case "name":
        if (input.length < 2 || input.length > 50) {
          return { valid: false, error: "Name must be between 2 and 50 characters" }
        }
        if (!/^[a-zA-Z\s\u0900-\u097F]+$/.test(input)) {
          return { valid: false, error: "Name can only contain letters and spaces" }
        }
        break
    }

    // Length validation
    const maxLength = options.maxLength || 1000
    if (input.length > maxLength) {
      return { valid: false, error: `Input too long (max ${maxLength} characters)` }
    }

    return { valid: true, sanitized: this.sanitizeInput(input) }
  }

  // Sanitize input
  sanitizeInput(input) {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      .trim()
  }

  // Generate secure random token
  generateSecureToken(length = 32) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const randomArray = new Uint8Array(length)
    crypto.getRandomValues(randomArray)

    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length]
    }

    return result
  }

  // Get client IP (simulated for demo)
  getClientIP() {
    // In a real application, this would be handled server-side
    return "192.168.1." + Math.floor(Math.random() * 255)
  }

  // Log security events
  logSecurityEvent(type, details = {}) {
    const event = {
      type,
      timestamp: Date.now(),
      fingerprint: this.getClientFingerprint(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...details,
    }

    this.suspiciousActivity.push(event)

    // Keep only last 100 events
    if (this.suspiciousActivity.length > 100) {
      this.suspiciousActivity = this.suspiciousActivity.slice(-100)
    }

    // Store in localStorage
    try {
      localStorage.setItem("securityEvents", JSON.stringify(this.suspiciousActivity))
    } catch (error) {
      console.warn("Failed to store security events:", error)
    }

    // Log to console in development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.warn("Security Event:", event)
    }
  }

  // Initialize security monitoring
  initSecurityMonitoring() {
    // Monitor for suspicious DOM manipulation
    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && node.tagName === "SCRIPT") {
                this.logSecurityEvent("DYNAMIC_SCRIPT_INJECTION", {
                  src: node.src,
                  content: node.textContent?.substring(0, 100),
                })
              }
            })
          }
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }

    // Monitor for console access (potential debugging attempts)
    let devtools = false
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        if (!devtools) {
          devtools = true
          this.logSecurityEvent("DEVTOOLS_OPENED")
        }
      } else {
        devtools = false
      }
    }, 1000)

    // Monitor for right-click attempts
    document.addEventListener("contextmenu", (e) => {
      this.logSecurityEvent("RIGHT_CLICK_ATTEMPT", {
        element: e.target.tagName,
        x: e.clientX,
        y: e.clientY,
      })
    })

    // Monitor for key combinations (F12, Ctrl+Shift+I, etc.)
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "U")
      ) {
        this.logSecurityEvent("DEVTOOLS_SHORTCUT", {
          key: e.key,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
        })
      }
    })
  }

  // Get security report
  getSecurityReport() {
    return {
      totalAttempts: Object.keys(this.attempts).length,
      blockedAccounts: Object.values(this.attempts).filter((a) => a.blocked).length,
      suspiciousEvents: this.suspiciousActivity.length,
      recentEvents: this.suspiciousActivity.slice(-10),
      rateLimitHits: Array.from(this.rateLimits.entries()).filter(([key, requests]) => requests.length > 5).length,
    }
  }

  // Clear old data (cleanup)
  cleanup() {
    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000

    // Clean old attempts
    Object.keys(this.attempts).forEach((key) => {
      if (now - this.attempts[key].lastAttempt > oneWeek) {
        delete this.attempts[key]
      }
    })

    // Clean old security events
    this.suspiciousActivity = this.suspiciousActivity.filter((event) => now - event.timestamp < oneWeek)

    this.saveAttempts()
  }
}

// Initialize global security manager
window.securityManager = new SecurityManager()

// Cleanup old data on page load
window.addEventListener("load", () => {
  window.securityManager.cleanup()
})
