import { ref, computed } from 'vue'

// Global shared reactive state across all instances - Default to English ('en') & Dark Theme ('dark')
const rawLang = localStorage.getItem('vibe_lang')
const savedLang = (rawLang === 'ar' || !rawLang) ? 'en' : rawLang
localStorage.setItem('vibe_lang', savedLang)

if (!localStorage.getItem('vibe_theme_fixed_v1')) {
  localStorage.setItem('vibe_theme', 'dark')
  localStorage.setItem('vibe_theme_fixed_v1', 'true')
}
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
  switchToAr: { ar: 'العربية', en: 'العربية' },

  // ==================== BuyPage ====================
  // Hero
  propertiesForSaleBadge: { ar: 'عقارات للبيع', en: 'PROPERTIES FOR SALE' },
  buyHeroTitlePart1: { ar: 'اشتري عقارك المثالي', en: 'Buy Your Perfect Property' },
  buyHeroTitlePart2: { ar: 'في دبي', en: 'in Dubai' },
  buyHeroSubtitle: { ar: 'اكتشف الفلل الفاخرة والشقق والبنتهاوس وفرص الاستثمار في أكثر أسواق العقارات ديناميكية في العالم.', en: 'Discover premium villas, apartments, penthouses, and investment opportunities in the world\'s most dynamic real estate market.' },

  // Hero Stats
  heroStat1Title: { ar: '0%', en: '0%' },
  heroStat1Desc: { ar: 'ضريبة نقل الملكية لمعظم المشترين', en: 'Property Transfer Tax for Most Buyers' },
  heroStat2Title: { ar: 'عائد مرتفع', en: 'High ROI' },
  heroStat2Desc: { ar: 'يصل إلى 8-12% عوائد إيجارية', en: 'Up to 8-12% Rental Yields' },
  heroStat3Title: { ar: 'مركز عالمي', en: 'A Global Hub' },
  heroStat3Desc: { ar: 'عش، استثمر، انتمِ في دبي', en: 'Live, Invest, Belong in Dubai' },

  // Search Bar
  location: { ar: 'الموقع', en: 'Location' },
  searchAreasPlaceholder: { ar: 'ابحث عن مناطق، مجتمعات...', en: 'Search areas, communities...' },
  propertyType: { ar: 'نوع العقار', en: 'Property Type' },
  allTypes: { ar: 'كل الأنواع', en: 'All Types' },
  apartment: { ar: 'شقة', en: 'Apartment' },
  villa: { ar: 'فيلا', en: 'Villa' },
  penthouse: { ar: 'بنتهاوس', en: 'Penthouse' },
  budgetAED: { ar: 'الميزانية (د.إ)', en: 'Budget (AED)' },
  anyBudget: { ar: 'أي ميزانية', en: 'Any Budget' },
  bedrooms: { ar: 'غرف النوم', en: 'Bedrooms' },
  anyBedroomCount: { ar: 'أي عدد', en: 'Any' },
  lifestyle: { ar: 'نمط الحياة', en: 'Lifestyle' },
  anyLifestyle: { ar: 'أي نمط', en: 'Any Lifestyle' },
  waterfront: { ar: 'واجهة مائية', en: 'Waterfront' },
  readyToMove: { ar: 'جاهز للانتقال', en: 'Ready to Move' },
  searchProperties: { ar: 'بحث عن عقارات', en: 'Search Properties' },

  // Category Tabs
  allProperties: { ar: 'كل العقارات', en: 'All Properties' },
  apartments: { ar: 'شقق', en: 'Apartments' },
  villas: { ar: 'فلل', en: 'Villas' },
  penthouses: { ar: 'بنتهاوس', en: 'Penthouses' },

  // Catalog
  propertiesForSaleInDubai: { ar: 'عقار للبيع في دبي', en: 'properties for sale in Dubai' },
  grid: { ar: 'شبكة', en: 'Grid' },
  map: { ar: 'خريطة', en: 'Map' },
  sortByRecommended: { ar: 'الأكثر توصية', en: 'Sort by: Recommended' },
  sortByAIMatch: { ar: 'تطابق الذكاء الاصطناعي', en: 'AI Match' },
  sortByPriceAsc: { ar: 'السعر: الأقل أولاً', en: 'Price: Low to High' },
  sortByPriceDesc: { ar: 'السعر: الأعلى أولاً', en: 'Price: High to Low' },
  offPlan: { ar: 'على الخارطة', en: 'Off-Plan' },
  aiMatch: { ar: 'تطابق ذكي', en: 'AI Match' },
  beds: { ar: 'غرف', en: 'Beds' },
  baths: { ar: 'حمامات', en: 'Baths' },
  sqft: { ar: 'قدم²', en: 'sqft' },
  viewDetails: { ar: 'عرض التفاصيل', en: 'View Details' },

  // AI Recommendations Widget
  aiRecommendations: { ar: 'توصيات الذكاء الاصطناعي', en: 'AI Recommendations' },
  seeMore: { ar: 'المزيد', en: 'See more' },
  rec1Title: { ar: 'فرص عائد مرتفع', en: 'High ROI Opportunities' },
  rec1Desc: { ar: 'عقارات في دبي مارينا توفر عوائد إيجارية تصل إلى 8-12%.', en: 'Properties in Dubai Marina offer up to 8-12% rental yields.' },
  rec2Title: { ar: 'حياة عائلية مريحة', en: 'Family-Friendly Living' },
  rec2Desc: { ar: 'الفلل في أريبيان رانشز 3 مطلوبة جداً للعائلات.', en: 'Villas in Arabian Ranches 3 are highly sought after by families.' },
  rec3Title: { ar: 'نمط حياة الواجهة المائية', en: 'Waterfront Lifestyle' },
  rec3Desc: { ar: 'نخلة جميرا توفر حياة فاخرة بقيمة طويلة الأمد.', en: 'Palm Jumeirah offers premium living with strong long-term value.' },

  // Best Areas Widget
  bestAreasToBuy: { ar: 'أفضل مناطق الشراء', en: 'Best Areas to Buy' },
  seeAllAreas: { ar: 'كل المناطق', en: 'See all areas' },
  area1Title: { ar: 'وسط مدينة دبي', en: 'Downtown Dubai' },
  area1Desc: { ar: 'المعيشة الأيقونية في قلب دبي', en: 'Iconic living in the heart of Dubai' },
  area2Title: { ar: 'دبي مارينا', en: 'Dubai Marina' },
  area2Desc: { ar: 'نمط حياة الواجهة المائية النابض', en: 'Vibrant waterfront lifestyle' },
  area3Title: { ar: 'نخلة جميرا', en: 'Palm Jumeirah' },
  area3Desc: { ar: 'المعيشة الجزيرية الحصرية', en: 'Exclusive island living' },

  // Why Buy Banner
  whyBuyWithVibeLocate: { ar: 'لماذا تشتري مع VibeLocate AI', en: 'Why Buy with VibeLocate AI' },
  whyBuy1Title: { ar: 'رؤى مدعومة بالذكاء الاصطناعي', en: 'AI-Powered Insights' },
  whyBuy1Desc: { ar: 'احصل على توصيات عقارية مخصصة', en: 'Get personalized property recommendations' },
  whyBuy2Title: { ar: 'قوائم موثقة', en: 'Verified Listings' },
  whyBuy2Desc: { ar: '100% عقارات أصيلة من مطورين موثوقين', en: '100% authentic properties from trusted developers' },
  whyBuy3Title: { ar: 'ذكاء السوق', en: 'Market Intelligence' },
  whyBuy3Desc: { ar: 'بيانات وتحليل فرص الاستثمار الفوري', en: 'Real-time data & investment opportunity analysis' },
  whyBuy4Title: { ar: 'دعم الخبراء', en: 'Expert Support' },
  whyBuy4Desc: { ar: 'مستشارون متخصصون طوال رحلتك', en: 'Dedicated advisors throughout your journey' },
  startBuyingJourney: { ar: 'ابدأ رحلة الشراء', en: 'Start Your Buying Journey' },
  smarterDecisions: { ar: 'قرارات أذكى، مستقبل مشرق.', en: 'Smarter Decisions, Brighter Tomorrows.' }
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
