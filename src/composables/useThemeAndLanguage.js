import { ref, computed } from 'vue'

// Global shared reactive state across all instances - Default to English ('en')
const rawLang = localStorage.getItem('vibe_lang')
const savedLang = (rawLang === 'ar' || !rawLang) ? 'en' : rawLang
localStorage.setItem('vibe_lang', savedLang)
const savedTheme = localStorage.getItem('vibe_theme') || 'dark'

const currentLang = ref(savedLang)
const currentTheme = ref(savedTheme)

// Comprehensive translation dictionary for Navbar & Global UI
export const translations = {
  // Navigation items
  home: { ar: 'الرئيسية', en: 'Home' },
  buy: { ar: 'شراء', en: 'Buy' },
  rent: { ar: 'إيجار', en: 'Rent' },
  newProjects: { ar: 'مشاريع جديدة', en: 'New Projects' },
  interactiveMap: { ar: 'الخريطة التفاعلية', en: 'Interactive Map' },
  areas: { ar: 'المناطق', en: 'Areas' },
  aboutUs: { ar: 'من نحن', en: 'About Us' },
  featured: { ar: 'عقارات مميزة', en: 'Featured' },
  districts: { ar: 'الأحياء والمناطق', en: 'Districts' },

  // Actions
  listProperty: { ar: 'أضف عقارك +', en: 'List Your Property +' },
  savedProperties: { ar: 'العقارات المحفوظة', en: 'Saved Properties' },
  myProfile: { ar: 'الملف الشخصي', en: 'My Profile' },
  preferences: { ar: 'التفضيلات', en: 'Preferences' },
  logout: { ar: 'تسجيل الخروج', en: 'Log Out' },
  login: { ar: 'تسجيل الدخول', en: 'Log In' },
  signup: { ar: 'إنشاء حساب', en: 'Sign Up' },
  backToHome: { ar: 'العودة للرئيسية', en: 'Back to Home' },
  verifiedMember: { ar: 'عضو موثق', en: 'Verified Member' },
  guestAccount: { ar: 'حساب زائر', en: 'Guest Account' },

  // Theme & Language Tooltips
  themeLight: { ar: 'الوضع الفاتح', en: 'Light Mode' },
  themeDark: { ar: 'الوضع الداكن', en: 'Dark Mode' },
  switchToLight: { ar: 'التحويل للوضع الفاتح', en: 'Switch to Light Mode' },
  switchToDark: { ar: 'التحويل للوضع الداكن', en: 'Switch to Dark Mode' },
  switchToEn: { ar: 'English', en: 'English' },
  switchToAr: { ar: 'العربية', en: 'العربية' }
}

/**
 * Applies language and dir attribute to DOM
 */
export const applyLanguageToDom = (lang) => {
  const isRtl = lang === 'ar'
  document.documentElement.setAttribute('lang', lang)
  document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr')
  
  if (isRtl) {
    document.documentElement.classList.add('rtl')
    document.documentElement.classList.remove('ltr')
    document.body?.classList.add('rtl')
    document.body?.classList.remove('ltr')
  } else {
    document.documentElement.classList.add('ltr')
    document.documentElement.classList.remove('rtl')
    document.body?.classList.add('ltr')
    document.body?.classList.remove('rtl')
  }
}

/**
 * Applies theme (dark / light) to DOM
 */
export const applyThemeToDom = (theme) => {
  const isDark = theme === 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  
  if (isDark) {
    document.documentElement.classList.add('dark', 'dark-theme')
    document.documentElement.classList.remove('light', 'light-theme')
    document.body?.classList.add('dark-theme')
    document.body?.classList.remove('light-theme')
  } else {
    document.documentElement.classList.add('light', 'light-theme')
    document.documentElement.classList.remove('dark', 'dark-theme')
    document.body?.classList.add('light-theme')
    document.body?.classList.remove('dark-theme')
  }
}

/**
 * Initializes language and theme on boot
 */
export const initThemeAndLanguage = () => {
  applyLanguageToDom(currentLang.value)
  applyThemeToDom(currentTheme.value)
}

/**
 * Vue Composable for Components
 */
export function useThemeAndLanguage() {
  const isRtl = computed(() => currentLang.value === 'ar')
  const isDark = computed(() => currentTheme.value === 'dark')

  const setLanguage = (lang) => {
    currentLang.value = lang
    localStorage.setItem('vibe_lang', lang)
    applyLanguageToDom(lang)
    window.dispatchEvent(new CustomEvent('vibe-lang-changed', { detail: { lang } }))
  }

  const toggleLanguage = () => {
    const next = currentLang.value === 'ar' ? 'en' : 'ar'
    setLanguage(next)
  }

  const setTheme = (theme) => {
    currentTheme.value = theme
    localStorage.setItem('vibe_theme', theme)
    applyThemeToDom(theme)
    window.dispatchEvent(new CustomEvent('vibe-theme-changed', { detail: { theme } }))
  }

  const toggleTheme = () => {
    const next = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  const t = (key) => {
    const entry = translations[key]
    if (!entry) return key
    return entry[currentLang.value] || entry.en || key
  }

  return {
    lang: currentLang,
    theme: currentTheme,
    isRtl,
    isDark,
    setLanguage,
    toggleLanguage,
    setTheme,
    toggleTheme,
    t
  }
}

export default useThemeAndLanguage
