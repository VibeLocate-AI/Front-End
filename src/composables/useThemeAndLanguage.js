import { ref, computed } from 'vue'
import {
  localizeProperty,
  localizePropertyList,
  formatPriceLocalized,
  translateTitle,
  translateLocation,
  translateType,
  translateDescription,
  translateTag
} from '../services/localizationService'

// Export property localization utilities
export {
  localizeProperty,
  localizePropertyList,
  formatPriceLocalized,
  translateTitle,
  translateLocation,
  translateType,
  translateDescription,
  translateTag
}

// Global shared reactive state across all instances
const savedLang = localStorage.getItem('vibe_lang') || 'en'
const savedTheme = localStorage.getItem('vibe_theme') || 'dark'

const currentLang = ref(savedLang)
const currentTheme = ref(savedTheme)

// Comprehensive translation dictionary for Navbar, Pages, Cards, Modals & Global UI
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
  myProperties: { ar: 'عقاراتي', en: 'My Properties' },
  preferences: { ar: 'التفضيلات', en: 'Preferences' },
  logout: { ar: 'تسجيل الخروج', en: 'Log Out' },
  login: { ar: 'تسجيل الدخول', en: 'Log In' },
  signup: { ar: 'إنشاء حساب', en: 'Sign Up' },
  backToHome: { ar: 'العودة للرئيسية', en: 'Back to Home' },
  verifiedMember: { ar: 'عضو موثق', en: 'Verified Member' },
  guestAccount: { ar: 'حساب زائر', en: 'Guest Account' },
  save: { ar: 'حفظ', en: 'Save' },
  favorited: { ar: 'محفوظ', en: 'Favorited' },

  // Theme & Language Tooltips
  themeLight: { ar: 'الوضع الفاتح', en: 'Light Mode' },
  themeDark: { ar: 'الوضع الداكن', en: 'Dark Mode' },
  switchToLight: { ar: 'التحويل للوضع الفاتح', en: 'Switch to Light Mode' },
  switchToDark: { ar: 'التحويل للوضع الداكن', en: 'Switch to Dark Mode' },
  switchToEn: { ar: 'English', en: 'English' },
  switchToAr: { ar: 'العربية', en: 'العربية' },

  // ==================== Common Property Card & Modal ====================
  beds: { ar: 'غرف', en: 'Beds' },
  baths: { ar: 'حمامات', en: 'Baths' },
  sqft: { ar: 'قدم²', en: 'sqft' },
  viewDetails: { ar: 'عرض التفاصيل', en: 'View Details' },
  aiMatch: { ar: 'تطابق ذكي', en: 'AI Match' },
  readyToMove: { ar: 'جاهز للسكن', en: 'Ready to Move' },
  offPlan: { ar: 'على الخارطة', en: 'Off-Plan' },
  verifiedLuxuryListing: { ar: 'قائمة فاخرة موثقة', en: 'Verified Luxury Listing' },
  propertyHighlights: { ar: 'أبرز مواصفات العقار', en: 'Property Highlights' },
  totalArea: { ar: 'المساحة الإجمالية', en: 'Total Area' },
  furnishing: { ar: 'الفرش والتأثيث', en: 'Furnishing' },
  parking: { ar: 'موقف سيارات', en: 'Parking' },
  amenities: { ar: 'المرافق والخدمات', en: 'Amenities' },
  scheduleTour: { ar: 'حجز جولة معاينة', en: 'Schedule Tour' },
  chatWhatsApp: { ar: 'واتساب', en: 'WhatsApp' },
  callAdvisor: { ar: 'اتصال بالمستشار', en: 'Call Advisor' },
  shareListing: { ar: 'مشاركة العقار', en: 'Share' },
  bookPrivateTour: { ar: 'حجز جولة خاصة الآن', en: 'Book a Private Tour' },
  proceedToBooking: { ar: 'متابعة الحجز والدفع', en: 'Proceed to Booking' },
  modalAiInsightsTitle: { ar: 'تحليلات VibeLocate بالذكاء الاصطناعي', en: 'VibeLocate AI Insights' },
  noPropertiesFound: { ar: 'لم يتم العثور على عقارات مطابقة للبحث.', en: 'No matching properties found.' },
  resetFilters: { ar: 'إعادة تعيين الفلاتر', en: 'Reset Filters' },

  // ==================== HomePage ====================
  homeHeroTitlePart1: { ar: 'ابحث عن مسكن أحلامك الفاخر', en: 'Find Your Dream Luxury Home' },
  homeHeroTitlePart2: { ar: 'في دبي', en: 'in Dubai' },
  homeHeroSubtitle: { ar: 'اكتشف أرقى الفلل والشقق والبنتهاوس بتقنية الذكاء الاصطناعي الأكثر دقة وتطوراً في العالم.', en: 'Discover prime villas, penthouses, and waterfront apartments tailored with next-generation AI precision.' },
  homeAiPlatform: { ar: 'منصة عقارية مدعومة بالذكاء الاصطناعي', en: 'AI-POWERED REAL ESTATE PLATFORM' },
  homeAiSearch: { ar: 'بحث ذكي بالسياق', en: 'AI CONTEXTUAL SEARCH' },
  homeAiSearchPlaceholder: { ar: 'مثال: منزل بغرفتي نوم في دبي', en: 'e.g., Two-bedroom house in Dubai' },
  homeAiSearchButton: { ar: 'بحث ذكي', en: 'AI Search' },
  homeDemoPrompts: { ar: 'اقتراحات تجريبية:', en: 'Demo Prompts:' },
  homeSearchTabBuy: { ar: 'شراء', en: 'Buy' },
  homeSearchTabRent: { ar: 'إيجار', en: 'Rent' },
  homeSearchTabOffPlan: { ar: 'مشاريع جديدة', en: 'Off-Plan' },
  homeSearchPlaceholder: { ar: 'ابحث بالمنطقة، الحي، أو اسم العقار...', en: 'Search by area, district, or property name...' },
  homeStatsListings: { ar: '+1,500 عقار موثق', en: '1,500+ Verified Listings' },
  homeStatsPrecision: { ar: '98% دقة التوصيات الذكية', en: '98% AI Precision' },
  homeStatsTax: { ar: '0% ضريبة دخل وعقارات', en: '0% Property Tax' },
  featuredCollectionTitle: { ar: 'المجموعة الفاخرة المختارة', en: 'Verified Luxury Collection' },
  featuredCollectionSubtitle: { ar: 'عقارات منتقاة بعناية فائقة تلبي أرقى معايير الفخامة ونمط الحياة العصري في دبي.', en: 'Handpicked villas, penthouses & residences meeting the highest standards of luxury living in Dubai.' },
  whyChooseUsTitle: { ar: 'لماذا يختار عملاؤنا VibeLocate AI', en: 'Why Choose VibeLocate AI' },
  whyChooseUsSubtitle: { ar: 'نبتكر معايير جديدة للاستثمار والعيش الفاخر من خلال الجمع بين الذكاء الاصطناعي والخبرة العقارية العميقة.', en: 'Setting new benchmarks in luxury real estate by blending cutting-edge artificial intelligence with deep market expertise.' },

  // ==================== BuyPage ====================
  propertiesForSaleBadge: { ar: 'عقارات للبيع', en: 'PROPERTIES FOR SALE' },
  buyHeroTitlePart1: { ar: 'اشتري عقارك المثالي', en: 'Buy Your Perfect Property' },
  buyHeroTitlePart2: { ar: 'في دبي', en: 'in Dubai' },
  buyHeroSubtitle: { ar: 'اكتشف الفلل الفاخرة والشقق والبنتهاوس وفرص الاستثمار في أكثر أسواق العقارات ديناميكية في العالم.', en: 'Discover premium villas, apartments, penthouses, and investment opportunities in the world\'s most dynamic real estate market.' },
  heroStat1Title: { ar: '0%', en: '0%' },
  heroStat1Desc: { ar: 'ضريبة نقل الملكية لمعظم المشترين', en: 'Property Transfer Tax for Most Buyers' },
  heroStat2Title: { ar: 'عائد مرتفع', en: 'High ROI' },
  heroStat2Desc: { ar: 'يصل إلى 8-12% عوائد إيجارية', en: 'Up to 8-12% Rental Yields' },
  heroStat3Title: { ar: 'مركز عالمي', en: 'A Global Hub' },
  heroStat3Desc: { ar: 'عش، استثمر، انتمِ في دبي', en: 'Live, Invest, Belong in Dubai' },
  location: { ar: 'الموقع', en: 'Location' },
  searchAreasPlaceholder: { ar: 'ابحث عن مناطق، مجتمعات...', en: 'Search areas, communities...' },
  propertyType: { ar: 'نوع العقار', en: 'Property Type' },
  allTypes: { ar: 'كل الأنواع', en: 'All Types' },
  apartment: { ar: 'شقة', en: 'Apartment' },
  villa: { ar: 'فيلا', en: 'Villa' },
  penthouse: { ar: 'بنتهاوس', en: 'Penthouse' },
  townhouse: { ar: 'تاون هاوس', en: 'Townhouse' },
  budgetAED: { ar: 'الميزانية (د.إ)', en: 'Budget (AED)' },
  anyBudget: { ar: 'أي ميزانية', en: 'Any Budget' },
  bedrooms: { ar: 'غرف النوم', en: 'Bedrooms' },
  anyBedroomCount: { ar: 'أي عدد', en: 'Any' },
  lifestyle: { ar: 'نمط الحياة', en: 'Lifestyle' },
  anyLifestyle: { ar: 'أي نمط', en: 'Any Lifestyle' },
  waterfront: { ar: 'واجهة مائية', en: 'Waterfront' },
  searchProperties: { ar: 'بحث عن عقارات', en: 'Search Properties' },
  allProperties: { ar: 'كل العقارات', en: 'All Properties' },
  apartments: { ar: 'شقق', en: 'Apartments' },
  villas: { ar: 'فلل', en: 'Villas' },
  penthouses: { ar: 'بنتهاوس', en: 'Penthouses' },
  propertiesForSaleInDubai: { ar: 'عقار للبيع في دبي', en: 'properties for sale in Dubai' },
  grid: { ar: 'شبكة', en: 'Grid' },
  map: { ar: 'خريطة', en: 'Map' },
  sortByRecommended: { ar: 'الأكثر توصية', en: 'Sort by: Recommended' },
  sortByAIMatch: { ar: 'تطابق الذكاء الاصطناعي', en: 'AI Match' },
  sortByPriceAsc: { ar: 'السعر: الأقل أولاً', en: 'Price: Low to High' },
  sortByPriceDesc: { ar: 'السعر: الأعلى أولاً', en: 'Price: High to Low' },
  aiRecommendations: { ar: 'توصيات الذكاء الاصطناعي', en: 'AI Recommendations' },
  seeMore: { ar: 'المزيد', en: 'See more' },
  rec1Title: { ar: 'فرص عائد مرتفع', en: 'High ROI Opportunities' },
  rec1Desc: { ar: 'عقارات في دبي مارينا توفر عوائد إيجارية تصل إلى 8-12%.', en: 'Properties in Dubai Marina offer up to 8-12% rental yields.' },
  rec2Title: { ar: 'حياة عائلية مريحة', en: 'Family-Friendly Living' },
  rec2Desc: { ar: 'الفلل في أريبيان رانشز 3 مطلوبة جداً للعائلات.', en: 'Villas in Arabian Ranches 3 are highly sought after by families.' },
  rec3Title: { ar: 'نمط حياة الواجهة المائية', en: 'Waterfront Lifestyle' },
  rec3Desc: { ar: 'نخلة جميرا توفر حياة فاخرة بقيمة طويلة الأمد.', en: 'Palm Jumeirah offers premium living with strong long-term value.' },
  bestAreasToBuy: { ar: 'أفضل مناطق الشراء', en: 'Best Areas to Buy' },
  seeAllAreas: { ar: 'كل المناطق', en: 'See all areas' },
  area1Title: { ar: 'وسط مدينة دبي', en: 'Downtown Dubai' },
  area1Desc: { ar: 'أيقونة دبي الحضرية، برج خليفة وأوبرا دبي.', en: 'Dubai\'s urban icon — Burj Khalifa & Dubai Opera.' },
  area2Title: { ar: 'مرسى دبي (مارينا)', en: 'Dubai Marina' },
  area2Desc: { ar: 'أرقى حي ساحلي بعوائد إيجارية استثنائية.', en: 'Premium coastal district with exceptional rental yields.' },
  area3Title: { ar: 'نخلة جميرا', en: 'Palm Jumeirah' },
  area3Desc: { ar: 'الجزيرة الأيقونية بأفخم الفلل الشاطئية.', en: 'Iconic island with the most prestigious beachfront villas.' },
  whyBuyWithVibeLocate: { ar: 'لماذا تشتري مع VibeLocate AI', en: 'Why Buy with VibeLocate AI' },
  startBuyingJourney: { ar: 'ابدأ رحلة الشراء', en: 'Start Your Buying Journey' },
  smarterDecisions: { ar: 'اتخذ قرارات أذكى بمساعدة الذكاء الاصطناعي', en: 'Make smarter decisions with AI-powered insights.' },
  whyBuy1Title: { ar: 'توصيات ذكاء اصطناعي دقيقة', en: 'Precise AI Recommendations' },
  whyBuy1Desc: { ar: 'تقنية متقدمة تحلل آلاف العقارات لتجد الأنسب لك.', en: 'Advanced AI analyzes thousands of properties to find your perfect match.' },
  whyBuy2Title: { ar: 'عقارات موثقة وشفافة', en: 'Verified & Transparent Listings' },
  whyBuy2Desc: { ar: 'كل عقار يمر بعملية تحقق صارمة لضمان أعلى جودة.', en: 'Every listing goes through strict verification for maximum quality.' },
  whyBuy3Title: { ar: 'عائد استثماري مرتفع', en: 'High Investment Returns' },
  whyBuy3Desc: { ar: 'دبي تقدم من أعلى عوائد الإيجار والاستثمار في العالم.', en: 'Dubai offers some of the highest rental yields and ROI globally.' },
  whyBuy4Title: { ar: 'دعم استشاري متخصص 24/7', en: '24/7 Expert Advisory Support' },
  whyBuy4Desc: { ar: 'فريق متخصص يرافقك في كل خطوة من رحلة الشراء.', en: 'Dedicated team guiding you through every step of your buying journey.' },

  // ==================== RentPage ====================
  rentMainHeadline: { ar: 'عقارات للإيجار في دبي', en: 'Dubai Properties for Rent' },
  rentSubHeadline: { ar: 'اكتشف منازل للإيجار مصممة وفق أسلوب حياتك مع التوصيات الذكية.', en: 'Discover rental homes tailored to your lifestyle with AI-powered discovery.' },
  rentCuratedBadge: { ar: 'أفضل إيجارات دبي بالذكاء الاصطناعي', en: "Dubai's Best Rentals Curated with AI" },
  rentCuratedBadgeSub: { ar: 'بحث أذكى. عيش أفضل.', en: 'Smarter search. Better living.' },
  searchAndFilter: { ar: 'البحث والتصفية', en: 'Search & Filter' },
  resetAll: { ar: 'إعادة ضبط الكل', en: 'Reset All' },
  searchRentPlaceholder: { ar: 'ابحث بالمناطق، العقارات، أو الكلمات المفتاحية...', en: 'Search properties, areas, or keywords...' },
  rentalDuration: { ar: 'مدة الإيجار', en: 'Rental Duration' },
  annualRent: { ar: 'إيجار سنوي', en: 'Annual Rent' },
  monthlyRent: { ar: 'إيجار شهري', en: 'Monthly Rent' },
  propertiesAvailable: { ar: 'عقار متاح للإيجار', en: 'properties available for rent' },

  // ==================== MapPage ====================
  mapHeroBadge: { ar: 'رادار التحليل الجغرافي بالذكاء الاصطناعي', en: 'AI-Powered Geospatial Radar' },
  mapTitlePart1: { ar: 'خريطة دبي العقارية', en: 'Smart Interactive' },
  mapTitlePart2: { ar: 'التفاعلية والذكية', en: 'Dubai Real Estate Map' },
  mapSubtitle: { ar: 'استكشف أفخم الفلل والبنتهاوس والإقامات البحرية على الخريطة التفاعلية مع درجات التوافق الفورية.', en: "Explore Dubai's most prestigious villas, penthouses, and waterfront residences on the interactive map." },
  primeLandmarks: { ar: 'معلم رئيسي', en: 'Prime Landmarks' },
  aiPrecision: { ar: 'دقة الذكاء الاصطناعي', en: 'AI Precision' },
  nearestProperty: { ar: 'أقرب عقار', en: 'Nearest Property' },
  allDubaiDistricts: { ar: 'جميع أحياء ومناطق دبي', en: 'All Dubai Districts' },
  distanceFromYou: { ar: 'المسافة منك', en: 'Distance from you' },
  drivingTime: { ar: 'وقت القيادة', en: 'Drive time' },
  navigateGoogleMaps: { ar: 'ملاحة عبر خرائط Google', en: 'Navigate with Google Maps' },

  // ==================== PaymentPage ====================
  securePayment: { ar: 'الدفع الآمن', en: 'Secure Payment' },
  completePaymentDesc: { ar: 'أكمل عملية الدفع لحجز عقارك.', en: 'Complete your payment to reserve your property.' },
  backToProperty: { ar: 'العودة إلى العقار', en: 'Back to property' },
  stepDetails: { ar: 'التفاصيل', en: 'Details' },
  stepPayment: { ar: 'الدفع', en: 'Payment' },
  stepConfirmation: { ar: 'التأكيد', en: 'Confirmation' },
  paymentMethod: { ar: 'طريقة الدفع', en: 'Payment Method' },
  choosePaymentMethod: { ar: 'اختر طريقة الدفع المفضلة لديك', en: 'Choose your preferred payment method' },
  creditDebitCard: { ar: 'بطاقة ائتمان / خصم', en: 'Credit / Debit Card' },
  cardDetails: { ar: 'بيانات البطاقة', en: 'Card Details' },
  cardEncrypted: { ar: 'معلومات الدفع الخاصة بك مشفرة وآمنة.', en: 'Your payment information is encrypted and secure.' },
  cardNumber: { ar: 'رقم البطاقة', en: 'Card Number' },
  expiryDate: { ar: 'تاريخ الانتهاء', en: 'Expiry Date' },
  securityCodeCvc: { ar: 'رمز الأمان (CVC)', en: 'Security Code (CVC)' },
  billingInformation: { ar: 'معلومات الفوترة', en: 'Billing Information' },
  billingInformationDesc: { ar: 'نحتاج هذه المعلومات لإيصال الدفع الخاص بك.', en: 'We need this information for your receipt.' },
  emailAddress: { ar: 'البريد الإلكتروني', en: 'Email Address' },
  fullName: { ar: 'الاسم الكامل', en: 'Full Name' },
  payNow: { ar: 'ادفع الآن', en: 'Pay Now' },
  paymentDisclaimer: { ar: 'عملية الدفع آمنة بنسبة 100%. لا نحفظ بيانات بطاقتك مطلقاً.', en: 'Your payment is 100% secure. We never save your card details.' },
  orderSummary: { ar: 'ملخص الطلب', en: 'Order Summary' },
  reviewOrder: { ar: 'راجع طلبك قبل إتمام الدفع', en: 'Review your order before payment' },
  propertyReservation: { ar: 'حجز العقار', en: 'Property Reservation' },
  serviceFee: { ar: 'رسوم الخدمة', en: 'Service Fee' },
  taxesVAT: { ar: 'الضرائب (ض.ق.م 0%)', en: 'Taxes (VAT 0%)' },
  total: { ar: 'الإجمالي', en: 'Total' },
  safeAndSecure: { ar: 'آمن ومحمي', en: 'Safe & Secure' },
  stayDates: { ar: 'تواريخ الإقامة', en: 'Stay Dates' },
  guestsCount: { ar: 'عدد الضيوف', en: 'Number of Guests' },
  checkIn: { ar: 'تسجيل الوصول', en: 'Check-in' },
  checkOut: { ar: 'تسجيل المغادرة', en: 'Check-out' }
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
  document.body?.setAttribute('data-theme', theme)
  
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

  // Localize a single property with the current reactive language
  const locProp = (prop) => {
    return localizeProperty(prop, currentLang.value)
  }

  // Localize an array of properties with the current reactive language
  const locProps = (list) => {
    return localizePropertyList(list, currentLang.value)
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
    t,
    locProp,
    locProps
  }
}

export default useThemeAndLanguage
