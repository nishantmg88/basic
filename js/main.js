// Enhanced Main JavaScript with advanced features and animations
class SchoolWebsite {
  constructor() {
    this.isLoading = true
    this.currentTheme = this.loadTheme()
    this.animations = new Map()
    this.intersectionObserver = null
    this.searchIndex = new Map()
    this.notifications = []
    this.filters = {
      gallery: "all",
      notices: "all",
    }

    this.init()
  }

  // Initialize the website
  async init() {
    try {
      await this.showLoadingScreen()
      this.setupTheme()
      this.setupNavigation()
      this.setupScrollAnimations()
      this.setupTimeDisplay()
      this.setupCounters()
      this.setupGallery()
      this.setupNotices()
      this.setupResults()
      this.setupAdmissionForm()
      this.setupSearch()
      this.setupNotifications()
      this.setupKeyboardNavigation()
      this.setupPerformanceOptimizations()
      this.loadDynamicContent()
      await this.hideLoadingScreen()
    } catch (error) {
      console.error("Failed to initialize website:", error)
      this.showErrorMessage("Failed to load website. Please refresh the page.")
    }
  }

  // Loading screen with enhanced animations
 // Loading screen with enhanced animations and zoom effect
  async showLoadingScreen() {
    return new Promise((resolve) => {
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        // Add zoom-in animation class
        loadingScreen.classList.add("zoom-in");
        // Simulate loading time with progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(resolve, 500);
          }
        }, 100);
      } else {
        resolve();
      }
    });
  }

  // Hide loading screen with smooth transition and zoom-out effect
  async hideLoadingScreen() {
    return new Promise((resolve) => {
      const loadingScreen = document.getElementById("loading-screen");
      if (loadingScreen) {
        // Add zoom-out animation class
        loadingScreen.classList.remove("zoom-in");
        loadingScreen.classList.add("zoom-out");
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
          loadingScreen.style.display = "none";
          loadingScreen.classList.remove("zoom-out");
          this.isLoading = false;
          this.triggerEntranceAnimations();
          // Fix for mobile: reset scroll and body style
          document.body.style.overflow = "";
          window.scrollTo(0, 0);
          resolve();
        }, 500);
      } else {
        this.isLoading = false;
        resolve();
      }
    });
  }

  // Trigger entrance animations for visible elements
  triggerEntranceAnimations() {
    const elements = document.querySelectorAll(".animate-text, .stagger-animation > *")
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, index * 100)
    })
  }

  // Enhanced theme management
  setupTheme() {
    const themeToggle = document.getElementById("theme-toggle")
    const themeIcon = document.getElementById("theme-icon")

    this.applyTheme()

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        this.toggleTheme()
      })
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (this.currentTheme === "auto") {
          this.applyTheme()
        }
      })
    }
  }

  // Load theme from localStorage
  loadTheme() {
    try {
      return localStorage.getItem("theme") || "dark"
    } catch (error) {
      return "dark"
    }
  }

  // Save theme to localStorage
  saveTheme() {
    try {
      localStorage.setItem("theme", this.currentTheme)
    } catch (error) {
      console.warn("Failed to save theme preference")
    }
  }

  // Toggle theme with animation
  toggleTheme() {
    const themes = ["light", "dark", "auto"]
    const currentIndex = themes.indexOf(this.currentTheme)
    this.currentTheme = themes[(currentIndex + 1) % themes.length]

    this.saveTheme()
    this.applyTheme()

    // Animate theme change
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)
  }

  // Apply theme
  applyTheme() {
    const themeIcon = document.getElementById("theme-icon")
    let actualTheme = this.currentTheme

    if (this.currentTheme === "auto") {
      actualTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    document.documentElement.setAttribute("data-theme", actualTheme)

    if (themeIcon) {
      const icons = {
        light: "fa-sun",
        dark: "fa-moon",
        auto: "fa-adjust",
      }

      themeIcon.className = `fas ${icons[this.currentTheme]}`
    }
  }

  // Enhanced navigation with smooth scrolling and active states
  setupNavigation() {
    const navbar = document.getElementById("navbar")
    const navToggle = document.getElementById("nav-toggle")
    const navMenu = document.getElementById("nav-menu")
    const navLinks = document.querySelectorAll(".nav-link")

    // Navbar scroll effect
    let lastScrollY = window.scrollY
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY

      if (navbar) {
        if (currentScrollY > 100) {
          navbar.classList.add("scrolled")
        } else {
          navbar.classList.remove("scrolled")
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          navbar.style.transform = "translateY(-100%)"
        } else {
          navbar.style.transform = "translateY(0)"
        }
      }

      lastScrollY = currentScrollY
      this.updateActiveNavLink()
    })

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active")
        navMenu.classList.toggle("active")
        document.body.classList.toggle("nav-open")
      })
    }

    // Smooth scrolling for navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }

        // Close mobile menu
        if (navMenu) {
          navMenu.classList.remove("active")
          navToggle.classList.remove("active")
          document.body.classList.remove("nav-open")
        }
      })
    })
  }

  // Update active navigation link based on scroll position
  updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll(".nav-link")

    let currentSection = ""
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  // Enhanced scroll animations with Intersection Observer
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")

          // Trigger stagger animations
          if (entry.target.classList.contains("stagger-animation")) {
            this.triggerStaggerAnimation(entry.target)
          }

          // Trigger counter animations
          if (entry.target.classList.contains("counter")) {
            this.animateCounter(entry.target)
          }
        }
      })
    }, observerOptions)

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .stagger-animation, .counter",
    )
    animatedElements.forEach((element) => {
      this.intersectionObserver.observe(element)
    })
  }

  // Trigger stagger animation for child elements
  triggerStaggerAnimation(container) {
    const children = container.children
    Array.from(children).forEach((child, index) => {
      setTimeout(() => {
        child.style.opacity = "1"
        child.style.transform = "translateY(0)"
      }, index * 100)
    })
  }

  // Animate counter with easing
  animateCounter(element) {
    const target = Number.parseInt(element.dataset.target) || 0
    const duration = 2000
    const start = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut)

      element.textContent = window.languageManager ? window.languageManager.formatNumber(currentValue) : currentValue

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // Enhanced time display with multiple formats
  setupTimeDisplay() {
    const timeElement = document.getElementById("current-time")
    const dateElement = document.getElementById("current-date")

    if (timeElement || dateElement) {
      const updateTime = () => {
        const now = new Date()

        if (timeElement) {
          const timeString = now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
          timeElement.textContent = window.languageManager
            ? window.languageManager.formatNumber(timeString)
            : timeString
        }

        if (dateElement) {
          const dateString = window.languageManager
            ? window.languageManager.formatDate(now)
            : now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
          dateElement.textContent = dateString
        }
      }

      updateTime()
      setInterval(updateTime, 1000)
    }
  }

  // Setup counters for statistics
  setupCounters() {
    const counters = document.querySelectorAll(".counter")
    counters.forEach((counter) => {
      counter.textContent = "0"
    })
  }

  // Enhanced gallery with filtering, search, and lightbox
  setupGallery() {
    this.loadGalleryItems()
    this.setupGalleryFilters()
    this.setupLightbox()
  }

  // Load gallery items from data
  loadGalleryItems() {
    const galleryGrid = document.getElementById("gallery-grid")
    if (!galleryGrid || !window.galleryData) return

    const createGalleryItem = (item) => {
      const div = document.createElement("div")
      div.className = "gallery-item"
      div.dataset.category = item.category
      div.dataset.id = item.id

      const title = window.languageManager ? window.languageManager.getLocalizedContent(item.title) : item.title.en

      const description = window.languageManager
        ? window.languageManager.getLocalizedContent(item.description)
        : item.description.en

      div.innerHTML = `
        <img src="${item.image}" alt="${title}" loading="lazy">
        <div class="gallery-overlay">
          <h4>${title}</h4>
          <p>${description}</p>
        </div>
        <div class="gallery-category">${item.category}</div>
      `

      div.addEventListener("click", () => {
        this.openLightbox(item)
      })

      return div
    }

    galleryGrid.innerHTML = ""
    window.galleryData.forEach((item) => {
      const element = createGalleryItem(item)
      galleryGrid.appendChild(element)
    })

    // Update search index
    this.updateSearchIndex()
  }

  // Setup gallery filters
  setupGalleryFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn")

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter
        this.filterGallery(filter)

        // Update active button
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")
      })
    })
  }

  // Filter gallery items with animation
  filterGallery(category) {
    const galleryItems = document.querySelectorAll(".gallery-item")

    galleryItems.forEach((item, index) => {
      const itemCategory = item.dataset.category
      const shouldShow = category === "all" || itemCategory === category

      if (shouldShow) {
        setTimeout(() => {
          item.style.display = "block"
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"

          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 50)
        }, index * 50)
      } else {
        item.style.opacity = "0"
        item.style.transform = "scale(0.8)"
        setTimeout(() => {
          item.style.display = "none"
        }, 300)
      }
    })
  }

  // Setup lightbox for gallery
  setupLightbox() {
    const lightbox = document.getElementById("lightbox")
    if (!lightbox) return

    const closeBtn = lightbox.querySelector(".lightbox-close")
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.closeLightbox()
      })
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        this.closeLightbox()
      }
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightbox.classList.contains("active")) {
        if (e.key === "Escape") {
          this.closeLightbox()
        }
      }
    })
  }

  // Open lightbox with image
  openLightbox(item) {
    const lightbox = document.getElementById("lightbox")
    if (!lightbox) return

    const img = lightbox.querySelector("img")
    const title = lightbox.querySelector("h3")
    const description = lightbox.querySelector("p")

    if (img && title && description) {
      const itemTitle = window.languageManager ? window.languageManager.getLocalizedContent(item.title) : item.title.en

      const itemDescription = window.languageManager
        ? window.languageManager.getLocalizedContent(item.description)
        : item.description.en

      img.src = item.image
      img.alt = itemTitle
      title.textContent = itemTitle
      description.textContent = itemDescription
    }

    lightbox.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Close lightbox
  closeLightbox() {
    const lightbox = document.getElementById("lightbox")
    if (lightbox) {
      lightbox.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  // Enhanced notices with filtering and search
  setupNotices() {
    this.loadNotices()
  }

  // Load notices from data
  loadNotices() {
    const noticesGrid = document.getElementById("notices-grid")
    if (!noticesGrid || !window.noticesData) return

    const createNoticeCard = (notice) => {
      const div = document.createElement("div")
      div.className = "notice-card"
      div.dataset.type = notice.type.toLowerCase()
      div.dataset.priority = notice.priority || "medium"

      const title = window.languageManager ? window.languageManager.getLocalizedContent(notice.title) : notice.title.en

      const content = window.languageManager
        ? window.languageManager.getLocalizedContent(notice.content)
        : notice.content.en

      const date = new Date(notice.date)
      const formattedDate = window.languageManager ? window.languageManager.formatDate(date) : date.toLocaleDateString()

      div.innerHTML = `
        <div class="notice-header">
          <span class="notice-type">${notice.type}</span>
          <span class="notice-date">${formattedDate}</span>
        </div>
        <h3 class="notice-title">${title}</h3>
        <p class="notice-content">${content}</p>
      `

      return div
    }

    noticesGrid.innerHTML = ""
    window.noticesData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((notice) => {
        const element = createNoticeCard(notice)
        noticesGrid.appendChild(element)
      })
  }

  // Enhanced results search with validation
  setupResults() {
    const searchButton = document.querySelector("#results .btn")
    const studentIdInput = document.getElementById("student-id")

    if (searchButton) {
      searchButton.addEventListener("click", () => {
        this.searchResults()
      })
    }

    if (studentIdInput) {
      studentIdInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.searchResults()
        }
      })

      // Input validation
      studentIdInput.addEventListener("input", (e) => {
        const value = e.target.value.toUpperCase()
        e.target.value = value

        // Real-time validation
        const isValid = /^STU\d{0,3}$/.test(value)
        e.target.style.borderColor = value === "" ? "" : isValid ? "green" : "red"
      })
    }
  }

  // Search and display results
  async searchResults() {
    const studentIdInput = document.getElementById("student-id")
    const resultsDisplay = document.getElementById("results-display")

    if (!studentIdInput || !resultsDisplay) return

    const studentId = studentIdInput.value.trim().toUpperCase()

    // Validate input
    const validation = window.securityManager
      ? window.securityManager.validateInput(studentId, "studentId")
      : { valid: true, sanitized: studentId }

    if (!validation.valid) {
      this.showNotification(validation.error, "error")
      return
    }

    // Check rate limiting
    if (window.securityManager && !window.securityManager.checkRateLimit("results_search", 5, 60000)) {
      this.showNotification("Too many search attempts. Please wait a moment.", "error")
      return
    }

    if (!studentId) {
      this.showNotification("Please enter a student ID", "error")
      return
    }

    // Show loading state
    resultsDisplay.style.display = "block"
    resultsDisplay.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>${window.languageManager ? window.languageManager.t("common.loading") : "Loading..."}</p>
      </div>
    `

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const result = window.resultsData[studentId]

    if (result) {
      this.displayResult(result)
    } else {
      this.displayNoResults(studentId)
    }
  }

  // Display student result
  displayResult(result) {
    const resultsDisplay = document.getElementById("results-display")
    if (!resultsDisplay) return

    const examTitle = window.languageManager ? window.languageManager.getLocalizedContent(result.exam) : result.exam.en

    const subjectsHtml = result.subjects
      .map((subject) => {
        const subjectName = window.languageManager
          ? window.languageManager.getLocalizedContent(subject.name)
          : subject.name.en

        return `
        <div class="subject-item">
          <span class="subject-name">${subjectName}</span>
          <span class="subject-marks">${subject.marks}/${subject.maxMarks}</span>
        </div>
      `
      })
      .join("")

    resultsDisplay.innerHTML = `
      <div class="result-card">
        <div class="result-header">
          <h3>${result.name}</h3>
          <p>${result.class} • Roll No: ${result.rollNumber}</p>
        </div>
        
        <div class="result-info">
          <div class="info-item">
            <div class="info-label">${window.languageManager ? window.languageManager.t("results.exam") : "Examination"}</div>
            <div class="info-value">${examTitle}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${window.languageManager ? window.languageManager.t("results.total") : "Total Marks"}</div>
            <div class="info-value">${result.totalMarks}/${result.maxTotalMarks}</div>
          </div>
          <div class="info-item">
            <div class="info-label">${window.languageManager ? window.languageManager.t("results.percentage") : "Percentage"}</div>
            <div class="info-value">${result.percentage}%</div>
          </div>
          <div class="info-item">
            <div class="info-label">${window.languageManager ? window.languageManager.t("results.grade") : "Grade"}</div>
            <div class="info-value">${result.overallGrade}</div>
          </div>
        </div>

        <h4>Subject-wise Marks</h4>
        <div class="subjects-grid">
          ${subjectsHtml}
        </div>
      </div>
    `

    // Animate result display
    resultsDisplay.style.opacity = "0"
    setTimeout(() => {
      resultsDisplay.style.opacity = "1"
    }, 100)
  }

  // Display no results found
  displayNoResults(studentId) {
    const resultsDisplay = document.getElementById("results-display")
    if (!resultsDisplay) return

    resultsDisplay.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-search"></i>
        </div>
        <h3>${window.languageManager ? window.languageManager.t("results.notfound") : "No Results Found"}</h3>
        <p>No results found for Student ID: ${studentId}</p>
        <p>${window.languageManager ? window.languageManager.t("results.check") : "Please check the ID and try again."}</p>
      </div>
    `
  }

  // Enhanced admission form with validation and security
  setupAdmissionForm() {
    const form = document.getElementById("admission-form")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleAdmissionSubmission(form)
    })

    // Real-time validation
    const inputs = form.querySelectorAll("input, select, textarea")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      input.addEventListener("input", () => {
        this.clearFieldError(input)
      })
    })
  }

  // Validate individual form field
  validateField(field) {
    const value = field.value.trim()
    const fieldName = field.name
    let isValid = true
    let errorMessage = ""

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false
      errorMessage = "This field is required"
    }

    // Type-specific validation using security manager
    if (value && window.securityManager) {
      let validationType = "text"

      if (fieldName.includes("Name")) validationType = "name"
      else if (fieldName === "email") validationType = "email"
      else if (fieldName === "phone") validationType = "phone"

      const validation = window.securityManager.validateInput(value, validationType)
      if (!validation.valid) {
        isValid = false
        errorMessage = validation.error
      }
    }

    // Update field appearance
    if (isValid) {
      field.classList.remove("error")
      field.classList.add("valid")
    } else {
      field.classList.remove("valid")
      field.classList.add("error")
      this.showFieldError(field, errorMessage)
    }

    return isValid
  }

  // Show field error
  showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector(".field-error")
    if (!errorElement) {
      errorElement = document.createElement("div")
      errorElement.className = "field-error"
      field.parentNode.appendChild(errorElement)
    }
    errorElement.textContent = message
  }

  // Clear field error
  clearFieldError(field) {
    const errorElement = field.parentNode.querySelector(".field-error")
    if (errorElement) {
      errorElement.remove()
    }
    field.classList.remove("error")
  }

  // Handle admission form submission
  async handleAdmissionSubmission(form) {
    // Validate all fields
    const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")
    let isFormValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false
      }
    })

    if (!isFormValid) {
      this.showNotification(
        window.languageManager
          ? window.languageManager.t("admission.error")
          : "Please fill all required fields correctly.",
        "error",
      )
      return
    }

    // Check rate limiting
    if (window.securityManager && !window.securityManager.checkRateLimit("admission_submit", 3, 300000)) {
      this.showNotification("Too many submission attempts. Please wait 5 minutes.", "error")
      return
    }

    // Show confirmation modal
    this.showConfirmationModal(() => {
      this.submitAdmissionForm(form)
    })
  }

  // Submit admission form
  async submitAdmissionForm(form) {
    const submitButton = form.querySelector('button[type="submit"]')
    const originalText = submitButton.textContent

    // Show loading state
    submitButton.disabled = true
    submitButton.innerHTML = `
      <div class="loading-spinner"></div>
      <span>Submitting...</span>
    `

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Collect form data
      const formData = new FormData(form)
      const data = Object.fromEntries(formData.entries())

      // Log submission (in real app, send to server)
      console.log("Admission form submitted:", data)

      // Show success
      this.showSuccessModal()
      form.reset()

      // Clear validation classes
      form.querySelectorAll(".valid, .error").forEach((field) => {
        field.classList.remove("valid", "error")
      })
    } catch (error) {
      console.error("Submission error:", error)
      this.showNotification("Submission failed. Please try again.", "error")
    } finally {
      // Reset button
      submitButton.disabled = false
      submitButton.textContent = originalText
    }
  }

  // Setup search functionality
  setupSearch() {
    this.updateSearchIndex()

    // Global search (if implemented)
    const searchInput = document.querySelector(".global-search")
    if (searchInput) {
      let searchTimeout
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          this.performSearch(e.target.value)
        }, 300)
      })
    }
  }

  // Update search index for quick searching
  updateSearchIndex() {
    this.searchIndex.clear()

    // Index gallery items
    if (window.galleryData) {
      window.galleryData.forEach((item) => {
        const searchText =
          `${item.title.en} ${item.title.np} ${item.description.en} ${item.description.np} ${item.category}`.toLowerCase()
        this.searchIndex.set(item.id, {
          type: "gallery",
          data: item,
          searchText,
        })
      })
    }

    // Index notices
    if (window.noticesData) {
      window.noticesData.forEach((notice) => {
        const searchText =
          `${notice.title.en} ${notice.title.np} ${notice.content.en} ${notice.content.np} ${notice.type}`.toLowerCase()
        this.searchIndex.set(`notice_${notice.id}`, {
          type: "notice",
          data: notice,
          searchText,
        })
      })
    }
  }

  // Perform search across indexed content
  performSearch(query) {
    if (!query || query.length < 2) return []

    const results = []
    const searchTerm = query.toLowerCase()

    this.searchIndex.forEach((item, id) => {
      if (item.searchText.includes(searchTerm)) {
        results.push({
          id,
          ...item,
          relevance: this.calculateRelevance(item.searchText, searchTerm),
        })
      }
    })

    return results.sort((a, b) => b.relevance - a.relevance)
  }

  // Calculate search relevance score
  calculateRelevance(text, term) {
    const termCount = (text.match(new RegExp(term, "g")) || []).length
    const termLength = term.length
    const textLength = text.length

    return (termCount * termLength) / textLength
  }

  // Setup notification system
  setupNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector(".notification-container")) {
      const container = document.createElement("div")
      container.className = "notification-container"
      document.body.appendChild(container)
    }
  }

  // Show notification
  showNotification(message, type = "info", duration = 5000) {
    const container = document.querySelector(".notification-container")
    if (!container) return

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`

    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    }

    notification.innerHTML = `
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `

    // Add close functionality
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
      this.removeNotification(notification)
    })

    // Add to container
    container.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification)
      }, duration)
    }

    return notification
  }

  // Remove notification
  removeNotification(notification) {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }

  // Show confirmation modal
  showConfirmationModal(onConfirm) {
    const modal = document.getElementById("confirmation-modal")
    if (!modal) return

    modal.classList.add("active")

    const confirmBtn = modal.querySelector(".btn-primary")
    const cancelBtn = modal.querySelector(".btn-secondary")

    const handleConfirm = () => {
      modal.classList.remove("active")
      onConfirm()
      cleanup()
    }

    const handleCancel = () => {
      modal.classList.remove("active")
      cleanup()
    }

    const cleanup = () => {
      confirmBtn.removeEventListener("click", handleConfirm)
      cancelBtn.removeEventListener("click", handleCancel)
    }

    confirmBtn.addEventListener("click", handleConfirm)
    cancelBtn.addEventListener("click", handleCancel)
  }

  // Show success modal
  showSuccessModal() {
    const modal = document.getElementById("success-modal")
    if (!modal) return

    modal.classList.add("active")

    const closeBtn = modal.querySelector(".btn")
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active")
    })
  }

  // Close modal
  closeModal() {
    const modals = document.querySelectorAll(".modal.active")
    modals.forEach((modal) => {
      modal.classList.remove("active")
    })
  }

  // Setup keyboard navigation
  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // ESC key closes modals
      if (e.key === "Escape") {
        this.closeModal()
        this.closeLightbox()
      }

      // Tab navigation enhancement
      if (e.key === "Tab") {
        this.handleTabNavigation(e)
      }
    })
  }

  // Handle tab navigation
  handleTabNavigation(e) {
    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }

  // Setup performance optimizations
  setupPerformanceOptimizations() {
    // Lazy load images
    this.setupLazyLoading()

    // Debounce scroll events
    this.debounceScrollEvents()

    // Preload critical resources
    this.preloadCriticalResources()
  }

  // Setup lazy loading for images
  setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]')

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            img.src = img.dataset.src || img.src
            img.classList.remove("lazy")
            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => {
        imageObserver.observe(img)
      })
    }
  }

  // Debounce scroll events for better performance
  debounceScrollEvents() {
    let scrollTimeout
    const originalScrollHandler = window.onscroll

    window.onscroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (originalScrollHandler) {
          originalScrollHandler()
        }
      }, 16) // ~60fps
    }
  }

  // Preload critical resources
  preloadCriticalResources() {
    // Preload fonts
    const fontUrls = ["https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"]

    fontUrls.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "style"
      link.href = url
      document.head.appendChild(link)
    })
  }

  // Load dynamic content
  async loadDynamicContent() {
    // Load principal's message based on language
    this.loadPrincipalMessage()

    // Load contact information
    this.loadContactInfo()

    // Update statistics
    this.updateStatistics()
  }

  // Load principal's message
  loadPrincipalMessage() {
    const messageElement = document.getElementById("principal-message-text")
    if (messageElement && window.principalMessage) {
      const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : "en"

      messageElement.textContent = window.principalMessage[currentLang]
    }
  }

  // Load contact information
  loadContactInfo() {
    if (!window.contactInfo) return

    const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : "en"

    // Update address
    const addressElements = document.querySelectorAll('[data-contact="address"]')
    addressElements.forEach((element) => {
      element.textContent = window.languageManager
        ? window.languageManager.getLocalizedContent(window.contactInfo.address)
        : window.contactInfo.address.en
    })

    // Update hours
    const hoursElements = document.querySelectorAll('[data-contact="hours"]')
    hoursElements.forEach((element) => {
      element.textContent = window.languageManager
        ? window.languageManager.getLocalizedContent(window.contactInfo.hours)
        : window.contactInfo.hours.en
    })
  }

  // Update statistics
  updateStatistics() {
    if (!window.schoolStats) return

    const stats = {
      "total-students": window.schoolStats.totalStudents,
      "total-teachers": window.schoolStats.totalTeachers,
      "years-excellence": window.schoolStats.yearsOfExcellence,
      "pass-rate": window.schoolStats.passRate,
    }

    Object.entries(stats).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) {
        element.dataset.target = value
      }
    })
  }

  // Show error message
  showErrorMessage(message) {
    this.showNotification(message, "error", 0)
  }

  // Get website statistics
  getWebsiteStats() {
    return {
      loadTime: Date.now() - (window.performance?.timing?.navigationStart || 0),
      isLoading: this.isLoading,
      currentTheme: this.currentTheme,
      currentLanguage: window.languageManager?.getCurrentLanguage() || "en",
      notificationsCount: this.notifications.length,
      searchIndexSize: this.searchIndex.size,
    }
  }
}

// Global search function for results
window.searchResults = () => {
  if (window.schoolWebsite) {
    window.schoolWebsite.searchResults()
  }
}

// Global modal functions
window.closeModal = () => {
  if (window.schoolWebsite) {
    window.schoolWebsite.closeModal()
  }
}

window.confirmSubmission = () => {
  // This will be handled by the confirmation modal
}

// Initialize website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.schoolWebsite = new SchoolWebsite()
})

// Handle language changes
window.addEventListener("languageChanged", (e) => {
  if (window.schoolWebsite) {
    window.schoolWebsite.loadDynamicContent()
    window.schoolWebsite.loadNotices()
    window.schoolWebsite.loadGalleryItems()
  }
})

// Service Worker registration for offline support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
const dateElement = document.getElementById('currentDate');
const today = new Date();
const options = { year: 'numeric'};
const formattedDate = today.toLocaleDateString('en-US', options);
dateElement.textContent = formattedDate;
