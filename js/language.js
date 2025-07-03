// Enhanced Language Manager with complete Nepali support
class LanguageManager {
  constructor() {
    this.currentLanguage = this.loadLanguage()
    this.translations = this.initTranslations()
    this.observers = []
    this.init()
  }

  // Initialize translations
  initTranslations() {
    return {
      en: {
        // Navigation
        "nav.home": "Home",
        "nav.about": "About",
        "nav.principal": "Principal",
        "nav.gallery": "Gallery",
        "nav.notices": "Notices",
        "nav.results": "Results",
        "nav.admission": "Admission",
        "nav.contact": "Contact",

        // School Info
        "school.name": "Shree Sharada Basic School",
        "school.tagline": "Excellence in Education",

        // Hero Section
        "hero.title": "Welcome to Shree Sharada Basic School",
        "hero.subtitle": "Nurturing Young Minds for a Brighter Tomorrow",
        "hero.students": "Students",
        "hero.teachers": "Teachers",
        "hero.years": "Years",
        "hero.apply": "Apply Now",
        "hero.learn": "Learn More",
        "hero.time": "Current Time",

        // About Section
        "about.title": "About Our School",
        "about.subtitle": "Building foundations for lifelong learning",
        "about.mission": "Our Mission",
        "about.mission.text":
          "To provide quality education that empowers students with knowledge, skills, and values necessary for their personal growth and contribution to society.",
        "about.vision": "Our Vision",
        "about.vision.text":
          "To be a leading educational institution that nurtures creative, confident, and responsible citizens of tomorrow.",
        "about.quality": "Quality Education",
        "about.faculty": "Experienced Faculty",
        "about.excellence": "Excellence in Results",
        "about.environment": "Caring Environment",
        "about.building": "School Building",

        // Principal Section
        "principal.title": "Principal's Message",
        "principal.subtitle": "Words of wisdom from our leader",
        "principal.achievements": "Achievements Under Leadership",
        "principal.award": "Best School Award 2023",
        "principal.pass": "100% Pass Rate",
        "principal.excellence": "Excellence in Education",
        "principal.mentored": "500+ Students Mentored",

        // Gallery Section
        "gallery.title": "School Gallery",
        "gallery.subtitle": "Glimpses of our vibrant school life",
        "gallery.all": "All",
        "gallery.infrastructure": "Infrastructure",
        "gallery.events": "Events",
        "gallery.activities": "Activities",

        // Notices Section
        "notices.title": "Notice Board",
        "notices.subtitle": "Stay updated with latest announcements",

        // Results Section
        "results.title": "Student Results",
        "results.subtitle": "Check your academic performance",
        "results.search": "Search Results",
        "results.placeholder": "Enter Student ID",
        "results.notfound": "No Results Found",
        "results.check": "Please check the ID and try again.",
        "results.student": "Student",
        "results.class": "Class",
        "results.roll": "Roll Number",
        "results.exam": "Examination",
        "results.status": "Status",
        "results.total": "Total Marks",
        "results.percentage": "Percentage",
        "results.grade": "Grade",

        // Admission Section
        "admission.title": "Online Admission",
        "admission.subtitle": "Join our school family today",
        "admission.student": "Student Name",
        "admission.father": "Father's Name",
        "admission.mother": "Mother's Name",
        "admission.dob": "Date of Birth",
        "admission.class": "Class",
        "admission.gender": "Gender",
        "admission.address": "Address",
        "admission.phone": "Phone Number",
        "admission.email": "Email",
        "admission.previous": "Previous School",
        "admission.submit": "Submit Application",
        "admission.success": "Application submitted successfully!",
        "admission.error": "Please fill all required fields.",

        // Contact Section
        "contact.title": "Contact Us",
        "contact.subtitle": "Get in touch with us",
        "contact.address": "Address",
        "contact.phone": "Phone",
        "contact.email": "Email",
        "contact.hours": "School Hours",
        "contact.location": "School Location Map",

        // Footer
        "footer.description":
          "Committed to providing quality education and nurturing young minds for a better tomorrow.",
        "footer.quick": "Quick Links",
        "footer.academic": "Academic",
        "footer.curriculum": "Curriculum",
        "footer.faculty": "Faculty",
        "footer.facilities": "Facilities",
        "footer.events": "Events",
        "footer.contact": "Contact Info",
        "footer.rights": "All rights reserved.",

        // Common
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.cancel": "Cancel",
        "common.confirm": "Confirm",
        "common.close": "Close",
        "common.save": "Save",
        "common.edit": "Edit",
        "common.delete": "Delete",
        "common.view": "View",
        "common.download": "Download",
        "common.upload": "Upload",
        "common.search": "Search",
        "common.filter": "Filter",
        "common.sort": "Sort",
        "common.date": "Date",
        "common.time": "Time",
        "common.name": "Name",
        "common.description": "Description",
        "common.category": "Category",
        "common.status": "Status",
        "common.actions": "Actions",
      },

      np: {
        // Navigation
        "nav.home": "गृहपृष्ठ",
        "nav.about": "हाम्रो बारे",
        "nav.principal": "प्रधानाध्यापक",
        "nav.gallery": "ग्यालेरी",
        "nav.notices": "सूचनाहरू",
        "nav.results": "नतिजाहरू",
        "nav.admission": "भर्ना",
        "nav.contact": "सम्पर्क",

        // School Info
        "school.name": "श्री शारदा आधारभूत विद्यालय",
        "school.tagline": "शिक्षामा उत्कृष्टता",

        // Hero Section
        "hero.title": "श्री शारदा आधारभूत विद्यालयमा स्वागत छ",
        "hero.subtitle": "उज्ज्वल भविष्यका लागि युवा मनको पालनपोषण",
        "hero.students": "विद्यार्थीहरू",
        "hero.teachers": "शिक्षकहरू",
        "hero.years": "वर्षहरू",
        "hero.apply": "अहिले आवेदन दिनुहोस्",
        "hero.learn": "थप जान्नुहोस्",
        "hero.time": "हालको समय",

        // About Section
        "about.title": "हाम्रो विद्यालयको बारेमा",
        "about.subtitle": "जीवनभर सिकाइका लागि आधार निर्माण",
        "about.mission": "हाम्रो मिशन",
        "about.mission.text":
          "विद्यार्थीहरूलाई उनीहरूको व्यक्तिगत विकास र समाजमा योगदानका लागि आवश्यक ज्ञान, सीप र मूल्यहरूसहित सशक्त बनाउने गुणस्तरीय शिक्षा प्रदान गर्नु।",
        "about.vision": "हाम्रो दृष्टिकोण",
        "about.vision.text": "भोलिका सिर्जनशील, आत्मविश्वासी र जिम्मेवार नागरिकहरूको पालनपोषण गर्ने अग्रणी शैक्षिक संस्था बन्नु।",
        "about.quality": "गुणस्तरीय शिक्षा",
        "about.faculty": "अनुभवी शिक्षकहरू",
        "about.excellence": "नतिजामा उत्कृष्टता",
        "about.environment": "हेरचाह गर्ने वातावरण",
        "about.building": "विद्यालय भवन",

        // Principal Section
        "principal.title": "प्रधानाध्यापकको सन्देश",
        "principal.subtitle": "हाम्रो नेताबाट बुद्धिको वचन",
        "principal.achievements": "नेतृत्वमा उपलब्धिहरू",
        "principal.award": "सर्वोत्तम विद्यालय पुरस्कार २०२३",
        "principal.pass": "१००% उत्तीर्ण दर",
        "principal.excellence": "शिक्षामा उत्कृष्टता",
        "principal.mentored": "५००+ विद्यार्थी मार्गदर्शन",

        // Gallery Section
        "gallery.title": "विद्यालय ग्यालेरी",
        "gallery.subtitle": "हाम्रो जीवन्त विद्यालय जीवनका झलकहरू",
        "gallery.all": "सबै",
        "gallery.infrastructure": "पूर्वाधार",
        "gallery.events": "कार्यक्रमहरू",
        "gallery.activities": "गतिविधिहरू",

        // Notices Section
        "notices.title": "सूचना बोर्ड",
        "notices.subtitle": "नवीनतम घोषणाहरूसँग अद्यावधिक रहनुहोस्",

        // Results Section
        "results.title": "विद्यार्थी नतिजाहरू",
        "results.subtitle": "आफ्नो शैक्षिक प्रदर्शन जाँच गर्नुहोस्",
        "results.search": "नतिजा खोज्नुहोस्",
        "results.placeholder": "विद्यार्थी आईडी प्रविष्ट गर्नुहोस्",
        "results.notfound": "कुनै नतिजा फेला परेन",
        "results.check": "कृपया आईडी जाँच गरेर फेरि प्रयास गर्नुहोस्।",
        "results.student": "विद्यार्थी",
        "results.class": "कक्षा",
        "results.roll": "रोल नम्बर",
        "results.exam": "परीक्षा",
        "results.status": "स्थिति",
        "results.total": "कुल अंक",
        "results.percentage": "प्रतिशत",
        "results.grade": "ग्रेड",

        // Admission Section
        "admission.title": "अनलाइन भर्ना",
        "admission.subtitle": "आज हाम्रो विद्यालय परिवारमा सामेल हुनुहोस्",
        "admission.student": "विद्यार्थीको नाम",
        "admission.father": "बुबाको नाम",
        "admission.mother": "आमाको नाम",
        "admission.dob": "जन्म मिति",
        "admission.class": "कक्षा",
        "admission.gender": "लिङ्ग",
        "admission.address": "ठेगाना",
        "admission.phone": "फोन नम्बर",
        "admission.email": "इमेल",
        "admission.previous": "अघिल्लो विद्यालय",
        "admission.submit": "आवेदन पेश गर्नुहोस्",
        "admission.success": "आवेदन सफलतापूर्वक पेश गरियो!",
        "admission.error": "कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्।",

        // Contact Section
        "contact.title": "हामीलाई सम्पर्क गर्नुहोस्",
        "contact.subtitle": "हामीसँग सम्पर्कमा रहनुहोस्",
        "contact.address": "ठेगाना",
        "contact.phone": "फोन",
        "contact.email": "इमेल",
        "contact.hours": "विद्यालय समय",
        "contact.location": "विद्यालय स्थान नक्सा",

        // Footer
        "footer.description": "राम्रो भोलिका लागि गुणस्तरीय शिक्षा प्रदान गर्न र युवा मनको पालनपोषण गर्न प्रतिबद्ध।",
        "footer.quick": "द्रुत लिङ्कहरू",
        "footer.academic": "शैक्षिक",
        "footer.curriculum": "पाठ्यक्रम",
        "footer.faculty": "शिक्षकहरू",
        "footer.facilities": "सुविधाहरू",
        "footer.events": "कार्यक्रमहरू",
        "footer.contact": "सम्पर्क जानकारी",
        "footer.rights": "सबै अधिकार सुरक्षित।",

        // Common
        "common.loading": "लोड हुँदै...",
        "common.error": "त्रुटि",
        "common.success": "सफल",
        "common.cancel": "रद्द गर्नुहोस्",
        "common.confirm": "पुष्टि गर्नुहोस्",
        "common.close": "बन्द गर्नुहोस्",
        "common.save": "सेभ गर्नुहोस्",
        "common.edit": "सम्पादन गर्नुहोस्",
        "common.delete": "मेटाउनुहोस्",
        "common.view": "हेर्नुहोस्",
        "common.download": "डाउनलोड गर्नुहोस्",
        "common.upload": "अपलोड गर्नुहोस्",
        "common.search": "खोज्नुहोस्",
        "common.filter": "फिल्टर गर्नुहोस्",
        "common.sort": "क्रमबद्ध गर्नुहोस्",
        "common.date": "मिति",
        "common.time": "समय",
        "common.name": "नाम",
        "common.description": "विवरण",
        "common.category": "श्रेणी",
        "common.status": "स्थिति",
        "common.actions": "कार्यहरू",
      },
    }
  }

  // Initialize language manager
  init() {
    this.updateLanguage()
    this.setupLanguageSelector()
    this.observeNewElements()
  }

  // Load saved language from localStorage
  loadLanguage() {
    try {
      return localStorage.getItem("selectedLanguage") || "en"
    } catch (error) {
      console.warn("Failed to load language preference:", error)
      return "en"
    }
  }

  // Save language to localStorage
  saveLanguage() {
    try {
      localStorage.setItem("selectedLanguage", this.currentLanguage)
    } catch (error) {
      console.warn("Failed to save language preference:", error)
    }
  }

  // Get translation for a key
  t(key, fallback = key) {
    const translation = this.translations[this.currentLanguage]?.[key]
    return translation || fallback
  }

  // Set language
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language
      this.saveLanguage()
      this.updateLanguage()
      this.notifyObservers()
    }
  }

  // Update all translatable elements
  updateLanguage() {
    // Update elements with data-en and data-np attributes
    document.querySelectorAll("[data-en][data-np]").forEach((element) => {
      const text = this.currentLanguage === "np" ? element.dataset.np : element.dataset.en
      if (text) {
        element.textContent = text
      }
    })

    // Update elements with data-translate attribute
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.dataset.translate
      const translation = this.t(key)
      if (translation !== key) {
        element.textContent = translation
      }
    })

    // Update placeholders
    document.querySelectorAll("[data-placeholder-en][data-placeholder-np]").forEach((element) => {
      const placeholder = this.currentLanguage === "np" ? element.dataset.placeholderNp : element.dataset.placeholderEn
      if (placeholder) {
        element.placeholder = placeholder
      }
    })

    // Update document language attribute
    document.documentElement.lang = this.currentLanguage

    // Update font family for Nepali
    if (this.currentLanguage === "np") {
      document.body.style.fontFamily = '"Noto Sans Devanagari", "Inter", sans-serif'
    } else {
      document.body.style.fontFamily = '"Inter", sans-serif'
    }

    // Trigger custom event
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: this.currentLanguage },
      }),
    )
  }

  // Setup language selector
  setupLanguageSelector() {
    const selector = document.getElementById("language-selector")
    if (selector) {
      selector.value = this.currentLanguage
      selector.addEventListener("change", (e) => {
        this.setLanguage(e.target.value)
      })
    }
  }

  // Observe new elements for translation
  observeNewElements() {
    if (typeof MutationObserver !== "undefined") {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                // Element node
                this.translateElement(node)
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
  }

  // Translate a specific element and its children
  translateElement(element) {
    // Translate the element itself
    if (element.hasAttribute("data-en") && element.hasAttribute("data-np")) {
      const text = this.currentLanguage === "np" ? element.dataset.np : element.dataset.en
      if (text) {
        element.textContent = text
      }
    }

    if (element.hasAttribute("data-translate")) {
      const key = element.dataset.translate
      const translation = this.t(key)
      if (translation !== key) {
        element.textContent = translation
      }
    }

    // Translate child elements
    element.querySelectorAll("[data-en][data-np], [data-translate]").forEach((child) => {
      this.translateElement(child)
    })
  }

  // Add observer for language changes
  addObserver(callback) {
    this.observers.push(callback)
  }

  // Remove observer
  removeObserver(callback) {
    this.observers = this.observers.filter((obs) => obs !== callback)
  }

  // Notify all observers
  notifyObservers() {
    this.observers.forEach((callback) => {
      try {
        callback(this.currentLanguage)
      } catch (error) {
        console.warn("Error in language observer:", error)
      }
    })
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage
  }

  // Check if current language is RTL
  isRTL() {
    const rtlLanguages = ["ar", "he", "fa", "ur"]
    return rtlLanguages.includes(this.currentLanguage)
  }

  // Format numbers for current language
  formatNumber(number) {
    if (this.currentLanguage === "np") {
      // Convert to Devanagari numerals
      const devanagariNumerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"]
      return number.toString().replace(/\d/g, (digit) => devanagariNumerals[Number.parseInt(digit)])
    }
    return number.toString()
  }

  // Format date for current language
  formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    if (this.currentLanguage === "np") {
      // Use Nepali locale if available
      try {
        return new Intl.DateTimeFormat("ne-NP", options).format(date)
      } catch (error) {
        // Fallback to English with Devanagari numerals
        const englishDate = new Intl.DateTimeFormat("en-US", options).format(date)
        return this.formatNumber(englishDate)
      }
    }

    return new Intl.DateTimeFormat("en-US", options).format(date)
  }

  // Get language-specific content from data
  getLocalizedContent(content) {
    if (typeof content === "object" && content !== null) {
      return content[this.currentLanguage] || content.en || content
    }
    return content
  }
}

// Initialize global language manager
window.languageManager = new LanguageManager()
