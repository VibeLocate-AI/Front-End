/**
 * VibeLocate AI - Full Bilingual (Arabic / English) Localization Service
 * Translates property data, catalog items, filters, and UI content dynamically.
 */

// ==========================================
// 1. DICTIONARIES FOR REAL ESTATE DATA
// ==========================================

export const propertyTypesDict = {
  villa: { ar: 'فيلا', en: 'Villa' },
  apartment: { ar: 'شقة', en: 'Apartment' },
  penthouse: { ar: 'بنتهاوس', en: 'Penthouse' },
  townhouse: { ar: 'تاون هاوس', en: 'Townhouse' },
  duplex: { ar: 'دوبلكس', en: 'Duplex' },
  mansion: { ar: 'قصر فاخر', en: 'Mansion' },
  studio: { ar: 'استوديو', en: 'Studio' },
  chalet: { ar: 'شاليه', en: 'Chalet' }
}

export const locationsDict = {
  'Palm Jumeirah': { ar: 'نخلة جميرا', en: 'Palm Jumeirah' },
  'Dubai Marina': { ar: 'مرسى دبي (مارينا)', en: 'Dubai Marina' },
  'Downtown Dubai': { ar: 'وسط مدينة دبي (داون تاون)', en: 'Downtown Dubai' },
  'Business Bay': { ar: 'الخليج التجاري', en: 'Business Bay' },
  'JVC': { ar: 'قرية جميرا الدائرية (JVC)', en: 'JVC' },
  'Jumeirah Village Circle': { ar: 'قرية جميرا الدائرية', en: 'Jumeirah Village Circle' },
  'Arabian Ranches': { ar: 'المرابع العربية', en: 'Arabian Ranches' },
  'Arabian Ranches 3': { ar: 'المرابع العربية 3', en: 'Arabian Ranches 3' },
  'Dubai Hills Estate': { ar: 'دبي هيلز استيت', en: 'Dubai Hills Estate' },
  'Dubai Hills': { ar: 'دبي هيلز', en: 'Dubai Hills' },
  'Dubai Creek Harbour': { ar: 'خور دبي', en: 'Dubai Creek Harbour' },
  'Creek Harbour': { ar: 'خور دبي', en: 'Creek Harbour' },
  'Bluewaters Island': { ar: 'جزيرة بلوواترز', en: 'Bluewaters Island' },
  'Bluewaters': { ar: 'بلوواترز', en: 'Bluewaters' },
  'Dubai Harbour': { ar: 'دبي هاربر', en: 'Dubai Harbour' },
  'DIFC': { ar: 'مركز دبي المالي العالمي (DIFC)', en: 'DIFC' },
  'Jumeirah Beach Residence': { ar: 'جميرا بيتش ريزيدنس (JBR)', en: 'JBR' },
  'JBR': { ar: 'جميرا بيتش ريزيدنس', en: 'JBR' },
  'Dubai Silicon Oasis': { ar: 'واحة دبي للسيليكون', en: 'Dubai Silicon Oasis' },
  'City Walk': { ar: 'سيتي ووك', en: 'City Walk' },
  'Meydan': { ar: 'ميدان', en: 'Meydan' },
  'Dubai': { ar: 'دبي', en: 'Dubai' },
  'UAE': { ar: 'الإمارات', en: 'UAE' },
  'Nablus': { ar: 'نابلس', en: 'Nablus' }
}

export const amenitiesDict = {
  'Pool': { ar: 'مسبح', en: 'Pool' },
  'Private Pool': { ar: 'مسبح خاص', en: 'Private Pool' },
  'Beach Access': { ar: 'مدخل خاص للشاطئ', en: 'Beach Access' },
  'Gym': { ar: 'صالة رياضية', en: 'Gym' },
  'Balcony': { ar: 'شرفة واسعة', en: 'Balcony' },
  'Concierge': { ar: 'خدمة كونسيرج 24/7', en: 'Concierge' },
  'Private Terrace': { ar: 'شرفة بانورامية خاصة', en: 'Private Terrace' },
  'Spa': { ar: 'سبا وجاكوزي', en: 'Spa' },
  'Valet': { ar: 'خدمة صف السيارات', en: 'Valet' },
  'Garden': { ar: 'حديقة خاصة', en: 'Garden' },
  'Private Garden': { ar: 'حديقة خاصة', en: 'Private Garden' },
  'Playground': { ar: 'منطقة ألعاب أطفال', en: 'Playground' },
  'Courtyard': { ar: 'فناء خارجي', en: 'Courtyard' },
  'Smart Lock': { ar: 'نظام دخول ذكي', en: 'Smart Lock' },
  'Security': { ar: 'أمن وحراسة 24/7', en: 'Security' },
  'Parking': { ar: 'موقف سيارات مغطى', en: 'Parking' },
  'Air Conditioning': { ar: 'تكييف مركزي', en: 'Air Conditioning' },
  'Waterfront': { ar: 'واجهة مائية', en: 'Waterfront' },
  'Marina View': { ar: 'إطلالة على المارينا', en: 'Marina View' },
  'Burj View': { ar: 'إطلالة على برج خليفة', en: 'Burj View' },
  'Sea View': { ar: 'إطلالة بحرية مفتوحة', en: 'Sea View' },
  'Canal View': { ar: 'إطلالة على القناة المائية', en: 'Canal View' },
  'Golf View': { ar: 'إطلالة على ملعب الجولف', en: 'Golf View' },
  'Golf Course': { ar: 'ملعب جولف عالمي', en: 'Golf Course' },
  'Clubhouse': { ar: 'نادي اجتماعي', en: 'Clubhouse' },
  'Infinity Pool': { ar: 'مسبح إنفينيتي بانورامي', en: 'Infinity Pool' },
  'Sauna': { ar: 'ساونا وبخار', en: 'Sauna' }
}

export const titlesDict = {
  'Palm Jumeirah Villa': { ar: 'فيلا شاطئية فاخرة في نخلة جميرا', en: 'Palm Jumeirah Villa' },
  'Luxury Apartment in Dubai Marina': { ar: 'شقة فارهة بإطلالة بحرية في مرسى دبي', en: 'Luxury Apartment in Dubai Marina' },
  'Downtown Penthouse Skyline View': { ar: 'بنتهاوس بانورامي يطل على برج خليفة', en: 'Downtown Penthouse Skyline View' },
  'Modern Townhouse in JVC': { ar: 'تاون هاوس عصري بحديقة في قرية جميرا', en: 'Modern Townhouse in JVC' },
  'Luxury Marina Suite': { ar: 'جناح فندقي فاخر في دبي مارينا', en: 'Luxury Marina Suite' },
  'JVC Modern Townhome': { ar: 'منزل تاون هاوس حديث في قرية جميرا', en: 'JVC Modern Townhome' },
  'Business Bay 2BR Apartment': { ar: 'شقة غرفتين عصرية في الخليج التجاري', en: 'Business Bay 2BR Apartment' },
  'Dubai Hills Family Villa': { ar: 'فيلا عائلية راقية في دبي هيلز استيت', en: 'Dubai Hills Family Villa' },
  'Modern Luxury Villa in Palm Jumeirah': { ar: 'فيلا حديثة فاخرة في نخلة جميرا', en: 'Modern Luxury Villa in Palm Jumeirah' },
  'Penthouse with Burj Khalifa View': { ar: 'بنتهاوس استثنائي بإطلالة على برج خليفة', en: 'Penthouse with Burj Khalifa View' },
  'Modern Waterfront Apartment': { ar: 'شقة عصرية على الواجهة المائية', en: 'Modern Waterfront Apartment' },
  'Family Villa with Private Garden': { ar: 'فيلا عائلية راقية مع حديقة خاصة', en: 'Family Villa with Private Garden' },
  'الفيلا الحديثة في نابلس': { ar: 'الفيلا الحديثة في نابلس', en: 'Modern Villa in Nablus' },
  'Modern Villa in Nablus': { ar: 'الفيلا الحديثة في نابلس', en: 'Modern Villa in Nablus' }
}

export const descriptionsDict = {
  'Signature beachfront villa with private pool, direct beach access, and lush landscaping.': {
    ar: 'فيلا شاطئية استثنائية بمسبح خاص، ومدخل مباشر للشاطئ ومساحات خضراء بديعة.',
    en: 'Signature beachfront villa with private pool, direct beach access, and lush landscaping.'
  },
  'Ultra-luxury high-rise apartment with panoramic views of Dubai Marina and easy metro access.': {
    ar: 'شقة شاهقة فائقة الفخامة بإطلالات بانورامية على مرسى دبي وسهولة الوصول للمترو.',
    en: 'Ultra-luxury high-rise apartment with panoramic views of Dubai Marina and easy metro access.'
  },
  'Iconic cantilever penthouse featuring 360-degree skyline views of Burj Khalifa and Dubai Fountain.': {
    ar: 'بنتهاوس أيقوني فريد بإطلالة 360 درجة على برج خليفة ونافورة دبي الراقصة.',
    en: 'Iconic cantilever penthouse featuring 360-degree skyline views of Burj Khalifa and Dubai Fountain.'
  },
  'Contemporary family townhome situated in a vibrant community with private garden and parks.': {
    ar: 'تاون هاوس عائلي معاصر في مجتمع حيوي هادئ مع حديقة خاصة ومساحات ألعاب.',
    en: 'Contemporary family townhome situated in a vibrant community with private garden and parks.'
  },
  'Chic designer 1-bedroom suite overlooking yachts with immediate promenade access.': {
    ar: 'جناح أنيق بغرفة نوم واحدة يطل على اليخوت الفاخرة مع ممشى مائي مباشر.',
    en: 'Chic designer 1-bedroom suite overlooking yachts with immediate promenade access.'
  },
  'Modern 3-bedroom residence with landscaped courtyard and sleek open-concept kitchen.': {
    ar: 'منزل حديث بثلاث غرف نوم وفناء خارجي منسق ومطبخ عصري مفتوح بالكامل.',
    en: 'Modern 3-bedroom residence with landscaped courtyard and sleek open-concept kitchen.'
  },
  'Prime executive residence along the Dubai Canal offering sunset water views.': {
    ar: 'إقامة تنفيذية متميزة على طول قناة دبي المائية مع إطلالات ساحرة على الغروب.',
    en: 'Prime executive residence along the Dubai Canal offering sunset water views.'
  },
  'Prestigious golf course villa with expansive garden, maid room, and grand double-height ceilings.': {
    ar: 'فيلا مرموقة على ملعب الجولف بحديقة فسيحة، غرفة خادمة، وأسقف مزدوجة الارتفاع.',
    en: 'Prestigious golf course villa with expansive garden, maid room, and grand double-height ceilings.'
  }
}

// ==========================================
// 2. TRANSLATION HELPERS
// ==========================================

export function translateType(type, lang = 'en') {
  if (!type) return ''
  const t = String(type).toLowerCase().trim()
  for (const [k, v] of Object.entries(propertyTypesDict)) {
    if (t.includes(k)) return v[lang] || v.en || type
  }
  return type
}

export function translateLocation(loc, lang = 'en') {
  if (!loc) return lang === 'ar' ? 'دبي، الإمارات' : 'Dubai, UAE'
  if (lang === 'en') return loc

  let res = String(loc)
  for (const [k, v] of Object.entries(locationsDict)) {
    if (res.includes(k)) {
      res = res.replace(k, v.ar)
    }
  }
  return res
}

export function translateTitle(title, lang = 'en', property = null) {
  if (!title) return lang === 'ar' ? 'عقار فاخر في دبي' : 'Luxury Dubai Property'
  if (lang === 'en') {
    return titlesDict[title]?.en || title
  }
  if (titlesDict[title]?.ar) {
    return titlesDict[title].ar
  }

  // Auto-compose Arabic title if exact match not in dictionary
  let res = title
  for (const [k, v] of Object.entries(titlesDict)) {
    if (title.toLowerCase().includes(k.toLowerCase())) return v.ar
  }

  let typeAr = 'عقار فاخر'
  if (property?.type) typeAr = translateType(property.type, 'ar')
  else if (/villa/i.test(title)) typeAr = 'فيلا فاخرة'
  else if (/penthouse/i.test(title)) typeAr = 'بنتهاوس راقٍ'
  else if (/apartment/i.test(title)) typeAr = 'شقة فارهة'
  else if (/townhouse/i.test(title)) typeAr = 'تاون هاوس عصري'

  let locAr = translateLocation(property?.area || property?.location || '', 'ar')
  return `${typeAr} في ${locAr.split('،')[0] || locAr}`
}

export function translateDescription(desc, lang = 'en', property = null) {
  if (!desc) {
    return lang === 'ar'
      ? 'عقار استثنائي يجمع بين الفخامة والراحة في قلب دبي مع إطلالات رائعة وتشطيبات راقية.'
      : 'Exceptional property offering luxury and comfort in Dubai with premium finishing.'
  }
  if (lang === 'en') return descriptionsDict[desc]?.en || desc
  if (descriptionsDict[desc]?.ar) return descriptionsDict[desc].ar

  // Generative Arabic fallback
  const typeAr = translateType(property?.type || 'Apartment', 'ar')
  const locAr = translateLocation(property?.area || property?.location || 'Dubai', 'ar')
  const beds = property?.beds || 2
  const baths = property?.baths || 2
  return `${typeAr} استثنائية في ${locAr}، تضم ${beds} غرف نوم و${baths} حمامات مع تصميم معماري حديث وإطلالات مفتوحة وتسهيلات متكاملة.`
}

export function translateTag(tag, lang = 'en') {
  if (!tag) return ''
  if (lang === 'en') return tag

  // Check tag dictionary
  for (const [k, v] of Object.entries(amenitiesDict)) {
    if (tag.toLowerCase() === k.toLowerCase()) return v.ar
  }
  for (const [k, v] of Object.entries(propertyTypesDict)) {
    if (tag.toLowerCase() === k.toLowerCase()) return v.ar
  }
  for (const [k, v] of Object.entries(locationsDict)) {
    if (tag.toLowerCase() === k.toLowerCase()) return v.ar
  }

  // Regex patterns (e.g. '5 Beds', '3 Baths')
  const bedsMatch = tag.match(/(\d+)\s*(Beds?|Bedrooms?)/i)
  if (bedsMatch) return `${bedsMatch[1]} غرف نوم`

  const bathsMatch = tag.match(/(\d+)\s*(Baths?|Bathrooms?)/i)
  if (bathsMatch) return `${bathsMatch[1]} حمامات`

  return tag
}

export function formatPriceLocalized(price, lang = 'en', isRent = false, frequency = 'yearly') {
  const num = Number(price) || 0
  const formattedNum = num.toLocaleString(lang === 'ar' ? 'ar-AE' : 'en-US')
  const curr = lang === 'ar' ? 'د.إ ' : 'AED '

  let period = ''
  if (isRent) {
    if (frequency === 'yearly' || frequency === 'yr' || frequency === '/yr') {
      period = lang === 'ar' ? ' /سنوياً' : ' /yr'
    } else {
      period = lang === 'ar' ? ' /شهرياً' : ' /mo'
    }
  }
  return `${curr}${formattedNum}${period}`
}

// ==========================================
// 3. FULL PROPERTY LOCALIZATION FUNCTION
// ==========================================

export function localizeProperty(rawProp, lang = 'en') {
  if (!rawProp) return null

  const isAr = lang === 'ar'
  const beds = Number(rawProp.beds ?? rawProp.bedrooms ?? 0)
  const baths = Number(rawProp.baths ?? rawProp.bathrooms ?? 0)
  const rawSize = rawProp.size || rawProp.sqft || rawProp.area_sqft || '1,500'
  const sizeClean = String(rawSize).replace(/,/g, '')

  const loc = rawProp.location || rawProp.area || 'Dubai, UAE'
  const localizedLocation = translateLocation(loc, lang)

  const tagsList = Array.isArray(rawProp.tags) ? rawProp.tags : []
  const localizedTags = tagsList.map(t => translateTag(t, lang))

  const amenitiesList = Array.isArray(rawProp.specs?.amenities)
    ? rawProp.specs.amenities
    : (tagsList.length > 0 ? tagsList : ['Pool', 'Security', 'Gym'])
  const localizedAmenities = amenitiesList.map(a => translateTag(a, lang))

  const isRent = Boolean(
    rawProp.isForRent || rawProp.is_for_rent ||
    (rawProp.listingPurpose && rawProp.listingPurpose.includes('rent')) ||
    rawProp.rent_frequency
  )

  const rentFreq = rawProp.rent_frequency || (isRent ? 'yearly' : '')
  const displayRentFreq = isAr
    ? (rentFreq === 'monthly' ? 'إيجار شهري' : 'إيجار سنوي')
    : (rentFreq === 'monthly' ? 'Monthly Lease' : 'Yearly Lease')

  const furnishedVal = rawProp.is_furnished || 'unfurnished'
  const displayFurnished = isAr
    ? (furnishedVal === 'furnished' ? 'مفروش بالكامل' : 'غير مفروش')
    : (furnishedVal === 'furnished' ? 'Furnished' : 'Unfurnished')

  const parkingVal = isAr ? 'موقف مغطى مشمول' : 'Covered Parking Included'

  return {
    ...rawProp,
    title: translateTitle(rawProp.title, lang, rawProp),
    originalTitle: rawProp.title,
    type: translateType(rawProp.type, lang),
    originalType: rawProp.type,
    location: localizedLocation,
    area: localizedLocation,
    description: translateDescription(rawProp.description, lang, rawProp),
    currencySymbol: isAr ? 'د.إ ' : 'AED ',
    period: isRent ? (isAr ? '/سنوياً' : '/yr') : '',
    formattedPrice: formatPriceLocalized(rawProp.price, lang, isRent, rentFreq),
    tags: localizedTags,
    rent_frequency: displayRentFreq,
    is_furnished: displayFurnished,
    specs: {
      beds: isAr ? `${beds} غرف نوم` : `${beds} Bedrooms`,
      baths: isAr ? `${baths} حمامات` : `${baths} Bathrooms`,
      area: isAr ? `${sizeClean} قدم²` : `${sizeClean} sq.ft`,
      parking: parkingVal,
      furnishing: displayFurnished,
      amenities: localizedAmenities
    }
  }
}

export function localizePropertyList(list, lang = 'en') {
  if (!Array.isArray(list)) return []
  return list.map(p => localizeProperty(p, lang))
}
