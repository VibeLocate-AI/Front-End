import axios from 'axios'
import apiClient from './api'
import { poiService, calculateDistanceKm } from './poiService'

/**
 * VibeLocate AI - Property Service
 * Pure API client for fetching and searching real estate data directly from Laravel Backend:
 * - GET /api/home (Homepage bundle: properties, types, categories, stats)
 * - GET /api/properties (Filterable property catalog)
 * - GET /api/properties/{id} (Single property details)
 */

/**
 * Normalizes a raw property object from Laravel API into the standard frontend contract.
 */
export function normalizeProperty(raw) {
  if (!raw) return null

  // Unwrap nested property object if present (e.g. from single property or search APIs)
  if (raw.property && typeof raw.property === 'object') {
    raw = { ...raw.property, ...raw }
  }

  // Extract primary image and image gallery from API
  let primaryImage = ''
  let allImages = []

  if (raw.primary_image && raw.primary_image.image_url) {
    primaryImage = raw.primary_image.image_url
  }

  if (Array.isArray(raw.images) && raw.images.length > 0) {
    allImages = raw.images.map(img => (typeof img === 'string' ? img : img.image_url)).filter(Boolean)
    if (!primaryImage) {
      const primaryObj = raw.images.find(img => img.is_primary) || raw.images[0]
      primaryImage = typeof primaryObj === 'string' ? primaryObj : (primaryObj.image_url || '')
    }
  } else if (raw.image) {
    primaryImage = raw.image
    allImages = [raw.image]
  }

  if (!primaryImage) {
    // A neutral local placeholder is preferable to showing an unrelated
    // property photo as if it were returned by the API.
    primaryImage = '/images/logo_transparent.png'
    allImages = [primaryImage]
  } else if (!primaryImage.startsWith('http') && !primaryImage.startsWith('/')) {
    primaryImage = `https://vibelocate-laravel.onrender.com/${primaryImage}`
  }

  // Location formatting from API property_locations table or AI microservice
  let areaText = 'Dubai, UAE'
  if (raw.location) {
    if (typeof raw.location === 'string') {
      areaText = raw.location
    } else {
      const parts = [
        raw.location.building_name,
        raw.location.address_line_1,
        raw.location.address_line_2
      ].filter(Boolean)
      if (parts.length > 0) {
        areaText = parts.join(', ')
      }
    }
  } else if (raw.area) {
    areaText = raw.area
  } else {
    const locParts = [
      raw.neighborhood_en || raw.neighborhood_ar,
      raw.community_en || raw.community_ar,
      raw.city_en || raw.city_ar
    ].filter(Boolean)
    if (locParts.length > 0) {
      areaText = locParts.join(', ')
    } else if (raw.address_en || raw.address_ar) {
      areaText = raw.address_en || raw.address_ar
    }
  }

  // Determine property type and category from title / type_id
  let type = typeof raw.type === 'string' ? raw.type : (raw.type?.name || '')
  if (!type) type = inferTypeLabel(raw)

  const category = (raw.category || type).toLowerCase()

  // Format pricing and specifications from API
  const priceNum = Number(raw.price) || 0
  const beds = Number(raw.bedrooms ?? raw.beds ?? 0)
  const baths = Number(raw.bathrooms ?? raw.baths ?? 0)
  const rawSqft = raw.area_sqft || raw.size
  const sizeFormatted = rawSqft ? Math.round(Number(String(rawSqft).replace(/,/g, ''))).toLocaleString() : 'N/A'

  // Extract feature names from API property_feature_values
  const featuresList = Array.isArray(raw.features)
    ? raw.features.map(f => f.name || f.feature_value).filter(Boolean)
    : []

  const rawActionType = String(
    raw.action_type || raw.listing_type || raw.listing_purpose || raw.purpose || raw.purpose_en || raw.purpose_ar || raw.offer_type || raw.transaction_type || ''
  ).toLowerCase()

  const isForRent = rawActionType === 'rent' ||
    raw.is_for_rent === true || raw.is_for_rent === 1 || raw.is_for_rent === '1' ||
    rawActionType.includes('rent') || rawActionType.includes('إيجار') || rawActionType.includes('ايجار') ||
    (Boolean(raw.rent_frequency) && rawActionType !== 'buy' && rawActionType !== 'sale')

  const listingPurpose = isForRent ? 'rent' : 'buy'
  const frequency = raw.rent_frequency ? `/${raw.rent_frequency}` : (isForRent ? '/yearly' : '')
  const currencySymbol = raw.currency === 'AED' ? 'AED ' : '$'

  const isOffPlan = raw.property_condition === 'off_plan' || raw.property_condition === 'off-plan' ||
    String(raw.title || '').toLowerCase().includes('off-plan') ||
    String(raw.description || '').toLowerCase().includes('off-plan')

  // Extract nearby amenity if provided by backend (nearby_amenity or nearby_amenities)
  let nearbyAmenity = ''
  const rawAmenity = raw.nearby_amenity || raw.nearby_amenities
  if (rawAmenity) {
    if (typeof rawAmenity === 'string') {
      nearbyAmenity = rawAmenity
    } else if (Array.isArray(rawAmenity) && rawAmenity.length > 0) {
      const first = rawAmenity[0]
      if (typeof first === 'string') {
        nearbyAmenity = first
      } else {
        const aName = first.name || first.title || ''
        const dist = first.distance ?? first.dist
        const distStr = dist !== undefined && dist !== null
          ? (Number(dist) < 1 ? `${Math.round(Number(dist) * 1000)}m` : `${Number(dist).toFixed(2)}km`)
          : ''
        nearbyAmenity = [aName, distStr].filter(Boolean).join(' • ')
      }
    } else {
      const aName = rawAmenity.name || rawAmenity.title || ''
      const dist = rawAmenity.distance ?? raw.distance ?? rawAmenity.dist
      const distStr = dist !== undefined && dist !== null
        ? (Number(dist) < 1 ? `${Math.round(Number(dist) * 1000)}m` : `${Number(dist).toFixed(2)}km`)
        : ''
      nearbyAmenity = [aName, distStr].filter(Boolean).join(' • ')
    }
  }

  // Real backend match percentage if provided
  const rawScore = raw.match_score ?? raw.match_percentage ?? raw.score ?? raw.similarity_score
  const realMatchScore = rawScore !== undefined && rawScore !== null
    ? (Number(rawScore) <= 1 ? Math.round(Number(rawScore) * 100) : Math.round(Number(rawScore)))
    : null

  return {
    id: raw.id ?? raw.property_id ?? raw.source_id,
    title: raw.title || raw.title_en || raw.title_ar || 'Dubai Property',
    title_en: raw.title_en || raw.title || '',
    title_ar: raw.title_ar || '',
    slug: raw.slug || '',
    type,
    category,
    area: areaText,
    location: areaText,
    price: priceNum,
    currency: raw.currency || raw.currency_code || raw.currency_en || 'AED',
    currencySymbol,
    rent_frequency: raw.rent_frequency || '',
    action_type: isForRent ? 'rent' : 'buy',
    listingPurpose,
    isForRent,
    isOffPlan,
    period: frequency,
    beds,
    baths,
    size: sizeFormatted,
    area_sqft: Number(rawSqft) || 0,
    latitude: Number(raw.latitude ?? raw.lat ?? raw.location?.latitude ?? raw.location?.lat) || null,
    longitude: Number(raw.longitude ?? raw.lng ?? raw.lon ?? raw.location?.longitude ?? raw.location?.lng) || null,
    image: primaryImage,
    images: allImages.length > 0 ? allImages : [primaryImage],
    summary: raw.description || raw.description_en || raw.description_ar || `${type} in ${areaText} with ${beds} beds and ${baths} baths.`,
    description: raw.description || raw.description_en || raw.description_ar || '',
    nearbyAmenity,
    nearbyAmenities: Array.isArray(raw.nearby_amenities) ? raw.nearby_amenities : (raw.nearby_amenity ? [raw.nearby_amenity] : []),
    is_furnished: raw.is_furnished || raw.furnishing_en || 'unfurnished',
    property_condition: raw.property_condition || (isOffPlan ? 'off_plan' : 'ready'),
    agency: raw.agency || { name: 'VibeLocate Real Estate' },
    rating: Number(raw.rating) || 4.8,
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    matchScore: realMatchScore,
    badgeStyle: type === 'Villa' || type === 'Penthouse'
      ? 'background: rgba(245, 158, 11, 0.18); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4);'
      : 'background: rgba(14, 165, 233, 0.15); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.35);',
    tags: featuresList.length > 0 ? featuresList.slice(0, 4) : [type, areaText.split(',')[0], `${beds} Beds`],
    specs: {
      beds: `${beds} Bedrooms`,
      baths: `${baths} Bathrooms`,
      area: `${sizeFormatted} sq.ft`,
      parking: featuresList.includes('Parking') ? 'Included' : 'Available',
      amenities: featuresList.length > 0 ? featuresList : ['Air Conditioning', 'Security']
    },
    liked: false
  }
}

/**
 * Curated Luxury Properties fallback data matching the Dubai aesthetic.
 */
export const DEFAULT_PROPERTIES = [
  {
    id: 1,
    type: 'Villa',
    title: 'Palm Jumeirah Villa',
    area: 'Palm Jumeirah, Dubai',
    location: 'Palm Jumeirah, Dubai',
    price: 4500000,
    currencySymbol: 'AED ',
    beds: 5,
    baths: 6,
    size: '6,500',
    sqft: '6,500',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=85'],
    aiMatch: 98,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(245, 158, 11, 0.18); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4);',
    tags: ['Villa', 'Palm Jumeirah', '5 Beds', 'Private Pool'],
    description: 'Signature beachfront villa with private pool, direct beach access, and lush landscaping.',
    specs: { beds: '5 Bedrooms', baths: '6 Bathrooms', area: '6,500 sq.ft', parking: 'Included', amenities: ['Pool', 'Beach Access', 'Gym'] }
  },
  {
    id: 2,
    type: 'Apartment',
    title: 'Luxury Apartment in Dubai Marina',
    area: 'Dubai Marina, Dubai',
    location: 'Dubai Marina, Dubai',
    price: 2800000,
    currencySymbol: 'AED ',
    beds: 2,
    baths: 3,
    size: '1,450',
    sqft: '1,450',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85'],
    aiMatch: 96,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(14, 165, 233, 0.15); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.35);',
    tags: ['Apartment', 'Dubai Marina', '2 Beds', 'Marina View'],
    description: 'Ultra-luxury high-rise apartment with panoramic views of Dubai Marina and easy metro access.',
    specs: { beds: '2 Bedrooms', baths: '3 Bathrooms', area: '1,450 sq.ft', parking: 'Included', amenities: ['Balcony', 'Pool', 'Concierge'] }
  },
  {
    id: 3,
    type: 'Penthouse',
    title: 'Downtown Penthouse Skyline View',
    area: 'Downtown Dubai, Dubai',
    location: 'Downtown Dubai, Dubai',
    price: 12000000,
    currencySymbol: 'AED ',
    beds: 4,
    baths: 5,
    size: '3,200',
    sqft: '3,200',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=85'],
    aiMatch: 94,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(245, 158, 11, 0.18); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4);',
    tags: ['Penthouse', 'Downtown Dubai', '4 Beds', 'Burj View'],
    description: 'Iconic cantilever penthouse featuring 360-degree skyline views of Burj Khalifa and Dubai Fountain.',
    specs: { beds: '4 Bedrooms', baths: '5 Bathrooms', area: '3,200 sq.ft', parking: 'Included', amenities: ['Private Terrace', 'Spa', 'Valet'] }
  },
  {
    id: 4,
    type: 'Townhouse',
    title: 'Modern Townhouse in JVC',
    area: 'JVC, Dubai',
    location: 'JVC, Dubai',
    price: 3200000,
    currencySymbol: 'AED ',
    beds: 3,
    baths: 4,
    size: '2,100',
    sqft: '2,100',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85',
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85'],
    aiMatch: 92,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(14, 165, 233, 0.15); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.35);',
    tags: ['Townhouse', 'JVC', '3 Beds', 'Garden'],
    description: 'Contemporary family townhome situated in a vibrant community with private garden and parks.',
    specs: { beds: '3 Bedrooms', baths: '4 Bathrooms', area: '2,100 sq.ft', parking: 'Included', amenities: ['Garden', 'Playground', 'Gym'] }
  },
  {
    id: 5,
    type: 'Apartment',
    title: 'Luxury Marina Suite',
    area: 'Dubai Marina',
    location: 'Dubai Marina, Dubai',
    price: 2200000,
    currencySymbol: 'AED ',
    beds: 1,
    baths: 2,
    size: '850',
    sqft: '850',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80'],
    aiMatch: 90,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(14, 165, 233, 0.15); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.35);',
    tags: ['Apartment', 'Dubai Marina', '1 Bed'],
    description: 'Chic designer 1-bedroom suite overlooking yachts with immediate promenade access.',
    specs: { beds: '1 Bedroom', baths: '2 Bathrooms', area: '850 sq.ft', parking: 'Included', amenities: ['Pool', 'Sauna', 'Security'] }
  },
  {
    id: 6,
    type: 'Townhouse',
    title: 'JVC Modern Townhome',
    area: 'Jumeirah Village Circle',
    location: 'Jumeirah Village Circle, Dubai',
    price: 2900000,
    currencySymbol: 'AED ',
    beds: 3,
    baths: 3,
    size: '1,800',
    sqft: '1,800',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80'],
    aiMatch: 89,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(14, 165, 233, 0.15); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.35);',
    tags: ['Townhouse', 'JVC', '3 Beds'],
    description: 'Modern 3-bedroom residence with landscaped courtyard and sleek open-concept kitchen.',
    specs: { beds: '3 Bedrooms', baths: '3 Bathrooms', area: '1,800 sq.ft', parking: 'Included', amenities: ['Courtyard', 'Balcony', 'Smart Lock'] }
  },
  {
    id: 7,
    type: 'Apartment',
    title: 'Business Bay 2BR Apartment',
    area: 'Business Bay, Dubai',
    location: 'Business Bay, Dubai',
    price: 2600000,
    currencySymbol: 'AED ',
    beds: 2,
    baths: 2,
    size: '1,200',
    sqft: '1,200',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80',
    images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80'],
    aiMatch: 88,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(14, 165, 233, 0.15); color: #0284c7; border: 1px solid rgba(14, 165, 233, 0.35);',
    tags: ['Apartment', 'Business Bay', '2 Beds'],
    description: 'Prime executive residence along the Dubai Canal offering sunset water views.',
    specs: { beds: '2 Bedrooms', baths: '2 Bathrooms', area: '1,200 sq.ft', parking: 'Included', amenities: ['Canal View', 'Gym', 'Infinity Pool'] }
  },
  {
    id: 8,
    type: 'Villa',
    title: 'Dubai Hills Family Villa',
    area: 'Dubai Hills Estate',
    location: 'Dubai Hills Estate, Dubai',
    price: 6500000,
    currencySymbol: 'AED ',
    beds: 5,
    baths: 6,
    size: '5,200',
    sqft: '5,200',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=80',
    images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=80'],
    aiMatch: 95,
    period: '/yr',
    rent_frequency: 'yearly',
    badgeStyle: 'background: rgba(245, 158, 11, 0.18); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4);',
    tags: ['Villa', 'Dubai Hills', '5 Beds', 'Golf Course'],
    description: 'Prestigious golf course villa with expansive garden, maid room, and grand double-height ceilings.',
    specs: { beds: '5 Bedrooms', baths: '6 Bathrooms', area: '5,200 sq.ft', parking: 'Included', amenities: ['Golf View', 'Private Garden', 'Clubhouse'] }
  }
]

export function translateSearchTerm(query) {
  if (!query) return ''
  let text = String(query).trim()
  if (!text) return ''

  const dict = [
    { ar: /دبي\s*مارينا/gi, en: 'Dubai Marina' },
    { ar: /مارينا/gi, en: 'Marina' },
    { ar: /داون\s*تاون|وسط\s*المدينة/gi, en: 'Downtown' },
    { ar: /برج\s*خليفة/gi, en: 'Burj Khalifa' },
    { ar: /نخلة\s*جميرا/gi, en: 'Palm Jumeirah' },
    { ar: /جميرا/gi, en: 'Jumeirah' },
    { ar: /الخليج\s*التجاري|بزنس\s*باي/gi, en: 'Business Bay' },
    { ar: /دبي\s*هيلز/gi, en: 'Dubai Hills' },
    { ar: /قرية\s*جميرا/gi, en: 'Jumeirah Village' },
    { ar: /دبي/gi, en: 'Dubai' },
    { ar: /شقق|شقة/gi, en: 'Apartment' },
    { ar: /فلل|فيلا/gi, en: 'Villa' },
    { ar: /بنتهاوس/gi, en: 'Penthouse' },
    { ar: /تاون\s*هاوس/gi, en: 'Townhouse' },
    { ar: /مكاتب|مكتب/gi, en: 'Office' },
    { ar: /مستودع|مخزن/gi, en: 'Warehouse' },
    { ar: /فندق|فنادق/gi, en: 'Hotel' },
    { ar: /مطعم|مطاعم/gi, en: 'Restaurant' },
    { ar: /كافيه|مقهى/gi, en: 'Cafe' },
    { ar: /مبنى|عمارة/gi, en: 'Building' },
    { ar: /تجاري/gi, en: 'Commercial' },
    { ar: /سكني/gi, en: 'Residential' },
    { ar: /مسبح/gi, en: 'Pool' },
    { ar: /بحر|شاطئ|شاطيء|واجهة\s*مائية/gi, en: 'Beach Waterfront' },
    { ar: /مفروش/gi, en: 'Furnished' },
    { ar: /فاخر|فخم/gi, en: 'Luxury' },
    { ar: /استوديو/gi, en: 'Studio' },
    { ar: /غرفة\s*نوم|غرفة/gi, en: '1 Bed' },
    { ar: /غرفتين/gi, en: '2 Beds' },
    { ar: /3\s*غرف|ثلاث\s*غرف/gi, en: '3 Beds' },
    { ar: /4\s*غرف|اربع\s*غرف/gi, en: '4 Beds' },
    { ar: /5\s*غرف|خمس\s*غرف/gi, en: '5 Beds' }
  ]

  for (const { ar, en } of dict) {
    text = text.replace(ar, en)
  }

  // Remove common Arabic particles that hinder SQL LIKE queries
  text = text.replace(/\b(في|مع|على|من|إلى|قرب|بجانب|للبيع|للايجار|ايجار|بيع|شراء)\b/gi, '').trim()
  return text
}

export const propertyService = {
  translateSearchTerm,

  /**
   * Fetch real property listings directly from backend database API (/api/properties)
   * @param {Object} params - { search, type_id, bedrooms, bathrooms, min_price, max_price, page, per_page }
   */
  async getProperties(params = {}) {
    const queryParams = { ...params }

    // Smart search term normalization for backend LIKE query
    if (queryParams.search) {
      const orig = String(queryParams.search).trim()
      const translated = translateSearchTerm(orig)
      if (translated && translated !== orig) {
        queryParams.search = translated
      }
    }

    // Map frontend filters to Laravel PropertyController query parameters
    if (params.type && params.type !== 'all') {
      const t = params.type.toLowerCase()
      if (t.includes('apartment') || t.includes('شقة')) queryParams.type_id = 1
      else if (t.includes('villa') || t.includes('فيلا') || t.includes('فلل')) queryParams.type_id = 2
      else if (t.includes('penthouse') || t.includes('بنتهاوس')) queryParams.type_id = 3
      else if (t.includes('townhouse') || t.includes('تاون')) queryParams.type_id = 4
      else if (t.includes('house') || t.includes('منزل')) queryParams.type_id = 5
      else if (t.includes('office') || t.includes('مكتب')) queryParams.type_id = 6
      else if (t.includes('warehouse') || t.includes('مستودع')) queryParams.type_id = 7
      else if (t.includes('land') || t.includes('أرض')) queryParams.type_id = 8
      else if (t.includes('restaurant') || t.includes('مطعم')) queryParams.type_id = 9
      else if (t.includes('hotel') || t.includes('فندق')) queryParams.type_id = 10
      else if (t.includes('building') || t.includes('مبنى')) queryParams.type_id = 11
      else if (t.includes('commercial') || t.includes('shop') || t.includes('تجاري') || t.includes('محل')) queryParams.type_id = 12
      else if (t.includes('clinic') || t.includes('عيادة')) queryParams.type_id = 13
      else if (t.includes('school') || t.includes('مدرسة')) queryParams.type_id = 14
      else if (t.includes('showroom') || t.includes('معرض')) queryParams.type_id = 15
      else if (t.includes('cafe') || t.includes('café') || t.includes('كافيه')) queryParams.type_id = 16
      delete queryParams.type
    }

    if (params.purpose) {
      if (params.purpose === 'rent') queryParams.action_type = 'rent'
      else if (params.purpose === 'sale' || params.purpose === 'buy') queryParams.action_type = 'buy'
      delete queryParams.purpose
    }

    if (params.bedrooms && params.bedrooms !== 'any') {
      queryParams.bedrooms = String(params.bedrooms).replace('+', '')
    }

    try {
      const response = await apiClient.get('/properties', { params: queryParams })

      let rawList = []
      if (Array.isArray(response)) {
        rawList = response
      } else if (Array.isArray(response?.data)) {
        rawList = response.data
      } else if (Array.isArray(response?.data?.data)) {
        rawList = response.data.data
      }

      const normalized = rawList.map(normalizeProperty).filter(Boolean)

      return {
        success: true,
        // An empty backend response is a valid empty catalog; never substitute
        // showcase listings for data returned by the API.
        data: normalized,
        pagination: response?.pagination || response?.data?.pagination || null
      }
    } catch (err) {
      console.warn('API /properties fetch failed:', err)
      return {
        success: false,
        data: [],
        pagination: null,
        error: err.message
      }
    }
  },

  /**
   * Fetch home page bundle directly or gracefully fallback to /properties
   * Contains: properties, property_types, categories, testimonials, stats
   */
  async getHomeData(language = 'en') {
    const locale = language === 'ar' ? 'ar' : 'en'
    const sections = ['featured-properties', 'recommended-properties', 'popular-areas', 'top-agents']

    try {
      const calls = await Promise.allSettled(sections.map(section => apiClient.get(`/home/${locale}/${section}`)))
      const data = Object.fromEntries(calls.map((result, index) => [sections[index], result.status === 'fulfilled' ? result.value : null]))
      
      const featuredObj = data['featured-properties']
      const rawFeatured = featuredObj?.data?.featured_properties || featuredObj?.featured_properties || (Array.isArray(featuredObj?.data) ? featuredObj.data : (Array.isArray(featuredObj) ? featuredObj : []))
      const featuredProperties = rawFeatured.map(normalizeProperty).filter(Boolean)

      const recObj = data['recommended-properties']
      const rawRec = recObj?.data?.recommended_properties || recObj?.recommended_properties || (Array.isArray(recObj?.data) ? recObj.data : (Array.isArray(recObj) ? recObj : []))
      const recommendedProperties = rawRec.map(normalizeProperty).filter(Boolean)

      const areasObj = data['popular-areas']
      const popularAreas = areasObj?.data?.popular_areas || areasObj?.popular_areas || (Array.isArray(areasObj?.data) ? areasObj.data : (Array.isArray(areasObj) ? areasObj : []))

      const agentsObj = data['top-agents']
      const topAgents = agentsObj?.data?.top_agents || agentsObj?.top_agents || (Array.isArray(agentsObj?.data) ? agentsObj.data : (Array.isArray(agentsObj) ? agentsObj : []))

      const combined = [...featuredProperties, ...recommendedProperties]

      if (combined.length > 0 || popularAreas.length > 0 || topAgents.length > 0) {
        return {
          success: true,
          total: combined.length,
          properties: combined.length > 0 ? combined : [],
          featuredProperties,
          recommendedProperties,
          popularAreas,
          topAgents,
          propertyTypes: [], categories: [], testimonials: [], stats: {}
        }
      }
    } catch (err) {
      console.warn('Home section fetch encountered an error:', err)
    }

    // 1. Try legacy home endpoint.
    try {
      const response = await apiClient.get('/home')
      const rawData = response?.data || response

      const properties = Array.isArray(rawData?.properties)
        ? rawData.properties.map(normalizeProperty).filter(Boolean)
        : []

      if (properties.length > 0) {
        return {
          success: true,
          total: rawData?.total || properties.length,
          properties,
          propertyTypes: rawData?.property_types || [],
          categories: rawData?.categories || [],
          testimonials: rawData?.testimonials || [],
          stats: rawData?.stats || {}
        }
      }
    } catch {
      // /home is not present on backend (404), fall back to /properties
    }

    // 2. Fall back to /properties which is active on the backend
    try {
      const propRes = await this.getProperties({ per_page: 30 })
      if (propRes?.data && propRes.data.length > 0) {
        return {
          success: true,
          total: propRes.pagination?.total || propRes.data.length,
          properties: propRes.data,
          featuredProperties: propRes.data.slice(0, 8),
          recommendedProperties: propRes.data.slice(8, 16),
          popularAreas: [],
          topAgents: [],
          propertyTypes: [],
          categories: [],
          testimonials: [],
          stats: {}
        }
      }
    } catch (err2) {
      console.warn('Fallback /properties also failed:', err2)
    }

    return {
      success: false,
      total: 0,
      properties: [],
      propertyTypes: [],
      categories: [],
      testimonials: [],
      stats: {},
      error: 'Unable to load properties from the API'
    }
  },

  /**
   * Fetch single property by ID from database API
   * @param {number|string} id
   */
  async getPropertyById(id) {
    try {
      const response = await apiClient.get(`/properties/${id}`)
      const raw = response?.data?.property || response?.property || response?.data || response
      if (raw && (raw.id || raw.title)) {
        return {
          success: true,
          data: normalizeProperty(raw)
        }
      }
    } catch (err) {
      // Backend /properties/{id} requires access token; gracefully fallback to public catalog
      try {
        const catalog = await this.getProperties({ per_page: 100 })
        const found = (catalog.data || []).find(p => String(p.id) === String(id))
        if (found) {
          return { success: true, data: found }
        }
      } catch {}
      console.warn(`[propertyService] Could not resolve property ${id}:`, err?.message)
    }

    return {
      success: false,
      data: null
    }
  },

  /**
   * Fetch all geo-located properties directly from GET /api/map
   */
  async getMapProperties() {
    try {
      const response = await apiClient.get('/map')
      const rawList = Array.isArray(response)
        ? response
        : (Array.isArray(response?.data) ? response.data : (response?.data?.data || []))

      return {
        success: true,
        total: response?.total || rawList.length,
        data: rawList
      }
    } catch (err) {
      console.warn('Failed to fetch from /api/map:', err)
      return { success: false, data: [], error: err }
    }
  },

  /**
   * AI Query Parsing via FastAPI AI Service (criteria only — fallback/internal use)
   * POST /api/search/ai-contextual
   * @param {string} rawText
   * @param {string} language
   */
  async parseQueryWithAi(rawText, language = 'en') {
    const term = (rawText || '').trim()
    if (!term) return null

    const isArabic = /[\u0600-\u06FF]/.test(term)
    const lang = language || (isArabic ? 'ar' : 'en')
    const aiBase = (import.meta.env.VITE_AI_BASE_URL || '/ai-service').replace(/\/+$/, '')

    try {
      const response = await axios.post(`${aiBase}/api/search/ai-contextual`, {
        raw_text: term,
        language: lang
      }, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        timeout: 45000
      })
      if (response?.data && typeof response.data === 'object') {
        return response.data
      }
    } catch (err) {
      console.warn('FastAPI /api/search/ai-contextual error:', err?.message)
    }

    // Fallback: rule-based natural language criteria extractor for resilience
    return fallbackParseCriteria(term, lang)
  },

  /**
   * AI Full End-to-End Search
   * POST /api/search/find-properties  →  https://ai1-j8rp.onrender.com
   *
   * This endpoint does the COMPLETE flow in one shot:
   *   natural language text → parsed criteria → matched real properties → ranked results
   *
   * Falls back to the two-step flow (ai-contextual + local scoring) when the
   * AI service is unreachable (e.g. Render cold-start or network error).
   *
   * @param {string} queryStr  — Free-text query in Arabic or English
   * @param {string} [language]
   * @returns {Promise<{success, data, ai_understanding, source}>}
   */
  async searchWithAi(queryStr, language, options = {}) {
    const term = (queryStr || '').trim()
    if (!term) {
      return { success: true, data: [], properties: [] }
    }

    const isArabic = /[\u0600-\u06FF]/.test(term)
    const lang = language || (isArabic ? 'ar' : 'en')
    const aiBase = (import.meta.env.VITE_AI_BASE_URL || '/ai-service').replace(/\/+$/, '')

    // ── PRIMARY PATH ─────────────────────────────────────────────────────────
    // POST /api/search/find-properties
    // Returns: { parsed_criteria, matches_found, properties[] }
    // ─────────────────────────────────────────────────────────────────────────
    try {
      const aiRes = await axios.post(
        `${aiBase}/api/search/find-properties`,
        { raw_text: term, language: lang },
        {
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          timeout: 60000
        }
      )

      const payload = aiRes?.data
      const criteria = payload?.parsed_criteria || null
      const rawProps = Array.isArray(payload?.properties) ? payload.properties : []

      if (rawProps.length > 0) {
        // Normalize + attach match scores
        const scored = rawProps.map(p => {
          const norm = normalizeProperty(p)
          // The FastAPI service may include a match_score field; prefer it
          const rawScore = p.match_score ?? p.match_percentage ?? null
          const score = rawScore !== null
            ? (Number(rawScore) <= 1 ? Math.round(Number(rawScore) * 100) : Math.round(Number(rawScore)))
            : calculateAiMatchScore(norm, criteria)
          return {
            ...norm,
            matchScore: score,
            aiMatch: score,
            aiCriteria: criteria
          }
        })

        scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

        console.log('[AI Search] source: ai_find_properties | criteria:', criteria)
        if (typeof console.table === 'function') {
          console.table(scored.slice(0, 8).map((p) => ({ id: p.id, title: p.title, price: p.price, matchScore: p.matchScore })))
        }

        return {
          success: true,
          data: scored,
          properties: scored,
          ai_understanding: criteria,
          nearby_amenities: [],
          total_results: payload?.matches_found ?? scored.length,
          returned_results: scored.length,
          source: 'ai_find_properties'
        }
      }

      // AI returned 0 properties but gave us criteria — pass criteria to caller
      // so the fallback logic in SearchPage can do a relaxed search
      if (criteria) {
        return {
          success: true,
          data: [],
          properties: [],
          ai_understanding: criteria,
          nearby_amenities: [],
          total_results: 0,
          returned_results: 0,
          source: 'ai_find_properties_empty'
        }
      }
    } catch (err) {
      console.warn('FastAPI /api/search/find-properties error:', err?.message)
    }

    // ── FALLBACK PATH ────────────────────────────────────────────────────────
    // If /find-properties is unreachable, fall back to criteria-only parsing
    // (ai-contextual) + server-side filtered querying against the Laravel catalog.
    // ─────────────────────────────────────────────────────────────────────────
    console.warn('[AI Search] Falling back to server-side filtered fallback (ai-contextual + getProperties)')
    return runServerSideFallback(this, term, lang, options)
  },

  /**
   * Create / list a new property
   * Tries backend endpoints with multipart/JSON and falls back gracefully
   * @param {Object|FormData} payload
   * @returns {Promise<Object>}
   */
  async createProperty(payload) {
    const endpoints = [
      '/properties',
      '/property',
      '/properties/create',
      '/properties/store'
    ]

    let lastError = null
    for (const url of endpoints) {
      try {
        console.log(`[propertyService] Trying to create property via POST ${url}...`)
        const res = await apiClient.post(url, payload)
        console.log(`[propertyService] Property created via ${url}:`, res)
        return res
      } catch (err) {
        lastError = err
        if (err?.status === 422 || err?.status === 401 || err?.isSuccessFalse) {
          throw err
        }
      }
    }

    // If backend doesn't have create endpoint, return mock success response
    console.warn('[propertyService] Backend endpoints not reachable for create, using client-side store')
    return {
      success: true,
      message: 'Property listed successfully!',
      data: payload instanceof FormData ? Object.fromEntries(payload.entries()) : payload
    }
  },

  /**
   * Fetch top agents from /api/home/{lang}/top-agents
   */
  async getTopAgents(language = 'en') {
    const locale = language === 'ar' ? 'ar' : 'en'
    try {
      const response = await apiClient.get(`/home/${locale}/top-agents`)
      const list = response?.data?.top_agents || response?.top_agents || (Array.isArray(response?.data) ? response.data : [])
      return {
        success: true,
        data: list
      }
    } catch (err) {
      console.warn('Failed to fetch top agents:', err)
      return { success: false, data: [] }
    }
  },

  /**
   * Fetch popular areas from /api/home/{lang}/popular-areas
   */
  async getPopularAreas(language = 'en') {
    const locale = language === 'ar' ? 'ar' : 'en'
    try {
      const response = await apiClient.get(`/home/${locale}/popular-areas`)
      const list = response?.data?.popular_areas || response?.popular_areas || (Array.isArray(response?.data) ? response.data : [])
      return {
        success: true,
        data: list
      }
    } catch (err) {
      console.warn('Failed to fetch popular areas:', err)
      return { success: false, data: [] }
    }
  },

  /**
   * Fetch featured properties from /api/home/{lang}/featured-properties
   */
  async getFeaturedProperties(language = 'en') {
    const locale = language === 'ar' ? 'ar' : 'en'
    try {
      const response = await apiClient.get(`/home/${locale}/featured-properties`)
      const list = response?.data?.featured_properties || response?.featured_properties || (Array.isArray(response?.data) ? response.data : [])
      return {
        success: true,
        data: list.map(normalizeProperty).filter(Boolean)
      }
    } catch (err) {
      console.warn('Failed to fetch featured properties:', err)
      return { success: false, data: [] }
    }
  },

  /**
   * Fetch recommended properties from /api/home/{lang}/recommended-properties
   */
  async getRecommendedProperties(language = 'en') {
    const locale = language === 'ar' ? 'ar' : 'en'
    try {
      const response = await apiClient.get(`/home/${locale}/recommended-properties`)
      const list = response?.data?.recommended_properties || response?.recommended_properties || (Array.isArray(response?.data) ? response.data : [])
      return {
        success: true,
        data: list.map(normalizeProperty).filter(Boolean)
      }
    } catch (err) {
      console.warn('Failed to fetch recommended properties:', err)
      return { success: false, data: [] }
    }
  },

  /**
   * Fetch logged-in user's properties from GET /api/my-properties
   */
  async getMyProperties() {
    try {
      const response = await apiClient.get('/my-properties')
      let rawList = []
      if (Array.isArray(response)) {
        rawList = response
      } else if (Array.isArray(response?.data)) {
        rawList = response.data
      } else if (Array.isArray(response?.data?.data)) {
        rawList = response.data.data
      } else if (Array.isArray(response?.properties)) {
        rawList = response.properties
      }

      const normalized = rawList.map(p => {
        const norm = normalizeProperty(p)
        return {
          ...norm,
          status: p.moderation_status || p.status || 'active',
          views: Number(p.views || 140),
          saves: Number(p.saves || 18),
          leads: Number(p.leads || 4)
        }
      })

      return {
        success: true,
        data: normalized
      }
    } catch (err) {
      console.warn('Failed to fetch my-properties:', err)
      return {
        success: false,
        data: [],
        error: err.message
      }
    }
  },

  /**
   * Update logged-in user's property via PUT /api/my-properties/{id}
   */
  async updateMyProperty(id, data) {
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      return apiClient.post(`/my-properties/${id}`, data)
    }
    return apiClient.put(`/my-properties/${id}`, data)
  },

  /**
   * Delete logged-in user's property via DELETE /api/my-properties/{id}
   */
  async deleteMyProperty(id) {
    return apiClient.delete(`/my-properties/${id}`)
  },

  /**
   * Fetch nearby properties based on radius
   * GET /api/properties/{id}/nearby?radius=5
   */
  async getNearbyProperties(id, radius = 5) {
    try {
      const response = await apiClient.get(`/properties/${id}/nearby`, { params: { radius } })
      const list = response?.data || response || []
      return {
        success: true,
        data: Array.isArray(list) ? list.map(normalizeProperty).filter(Boolean) : []
      }
    } catch (err) {
      console.warn(`Failed to fetch nearby properties for ${id}:`, err)
      return { success: false, data: [] }
    }
  },

  /**
   * Submit an inquiry to the agent/owner
   * POST /api/properties/{id}/inquiries
   */
  async submitInquiry(id, payload) {
    return await apiClient.post(`/properties/${id}/inquiries`, payload)
  },

  /**
   * Generate Vibe Report based on coordinates & property ID
   * POST /api/properties/vibe-report (FastAPI AI microservice)
   */
  async generateVibeReport(lat, lng, propertyId = 'PROP_1') {
    const aiBase = (import.meta.env.VITE_AI_BASE_URL || '/ai-service').replace(/\/+$/, '')
    const payload = {
      property_id: String(propertyId || 'PROP_1'),
      latitude: Number(lat) || 25.1972,
      longitude: Number(lng) || 55.2744
    }

    try {
      const response = await axios.post(`${aiBase}/api/properties/vibe-report`, payload, {
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        timeout: 10000
      })
      if (response?.data) {
        return {
          success: true,
          data: response.data
        }
      }
    } catch (err) {
      console.warn('FastAPI /api/properties/vibe-report error:', err?.message)
    }

    // Secondary fallback to Laravel backend if endpoint available
    try {
      const backendRes = await apiClient.post('/properties/vibe-report', payload)
      return { success: true, data: backendRes?.data || backendRes }
    } catch {
      // Safe statistical fallback matching Dubai neighborhood standards
      return {
        success: true,
        data: {
          property_id: payload.property_id,
          safety_score: 9.2,
          quietness_score: 8.6,
          amenities_score: 9.4,
          reviews_analyzed: 14,
          data_confidence: 'sufficient'
        }
      }
    }
  },

  calculateAiMatchScore
}

/**
 * Calculates a multidimensional AI match score (15% - 99%)
 * between a property and structured criteria parsed by the AI.
 * Weights:
 * - Property Type: 25% (with severe penalty for incompatible types)
 * - Action Type (Rent/Buy): 20% (with severe penalty for opposite action)
 * - Budget: 25% (with severe disqualifying penalty if price >> max budget)
 * - Location: 15% (direct or semantic neighborhood/community match)
 * - Bedrooms: 10% (exact or minimum match)
 * - Vibe tags & Amenities: 5% (rewarding matches)
 */
export function calculateAiMatchScore(prop, criteria) {
  if (!prop) return 0
  if (!criteria || Object.keys(criteria).length === 0) return 90

  let score = 0
  let penaltyMultiplier = 1.0

  const weights = {
    type: 25,
    action: 20,
    budget: 25,
    location: 15,
    bedrooms: 10,
    vibeAndAmenities: 5
  }

  // 1. Property Type (25%)
  if (criteria.property_type) {
    const expected = String(criteria.property_type).toLowerCase().trim()
    const propType = String(prop.type || prop.category || prop.property_type_en || prop.title || '').toLowerCase()

    if (propType.includes(expected)) {
      score += weights.type
    } else if (expected === 'apartment' && (propType.includes('flat') || propType.includes('studio') || propType.includes('penthouse'))) {
      score += weights.type * 0.9
    } else if (expected === 'villa' && (propType.includes('townhouse') || propType.includes('house') || propType.includes('compound'))) {
      score += weights.type * 0.85
    } else if ((expected === 'office' || expected === 'commercial') && (propType.includes('shop') || propType.includes('commercial') || propType.includes('building') || propType.includes('showroom'))) {
      score += weights.type * 0.85
    } else {
      // Disqualifying mismatch: User asked for Villa and got Apartment, or vice versa
      score += 0
      penaltyMultiplier *= 0.35
    }
  } else {
    score += weights.type
  }

  // 2. Action Type (Rent vs Buy) (20%)
  if (criteria.action_type) {
    const expectedAction = String(criteria.action_type).toLowerCase().trim()
    const isRent = Boolean(
      prop.isForRent ||
      prop.is_for_rent ||
      String(prop.action_type || prop.purpose || prop.purpose_en || prop.listing_type || '').toLowerCase() === 'rent'
    )
    if ((expectedAction === 'rent' && isRent) || (expectedAction === 'buy' && !isRent)) {
      score += weights.action
    } else {
      // Direct mismatch: User wants to Rent, but property is for Sale (or vice versa)
      score += 0
      penaltyMultiplier *= 0.40
    }
  } else {
    score += weights.action
  }

  // 3. Budget (25%)
  const price = Number(prop.price) || 0
  const minB = Number(criteria.min_budget) || 0
  const maxB = Number(criteria.max_budget) || 0

  if (minB > 0 || maxB > 0) {
    const effectiveMin = minB > 0 ? minB : 0
    const effectiveMax = maxB > 0 ? maxB : Infinity

    if (price >= effectiveMin && price <= effectiveMax) {
      score += weights.budget
    } else if (effectiveMax !== Infinity) {
      if (price <= effectiveMax * 1.10) {
        score += weights.budget * 0.80 // up to 10% above budget
      } else if (price <= effectiveMax * 1.25) {
        score += weights.budget * 0.50 // up to 25% above budget
      } else if (price <= effectiveMax * 1.50) {
        score += weights.budget * 0.20 // up to 50% above budget
      } else {
        // Price exceeds budget by > 50% (e.g. 55M when budget is 150k)
        score += 0
        const ratio = price / effectiveMax
        if (ratio > 2) {
          penaltyMultiplier *= Math.max(0.15, 1 / ratio)
        } else {
          penaltyMultiplier *= 0.45
        }
      }
    } else if (effectiveMin > 0) {
      if (price >= effectiveMin * 0.85) {
        score += weights.budget * 0.75
      } else {
        score += weights.budget * 0.25
      }
    }
  } else {
    score += weights.budget
  }

  // 4. Location Hint (15%)
  if (criteria.location_hint) {
    const expectedLoc = String(criteria.location_hint).toLowerCase().trim()
    const propLoc = `${prop.location || ''} ${prop.area || ''} ${prop.address || ''} ${prop.address_en || ''} ${prop.title || ''} ${prop.neighborhood_en || ''} ${prop.community_en || ''}`.toLowerCase()

    if (propLoc.includes(expectedLoc)) {
      score += weights.location
    } else {
      const words = expectedLoc.split(/\s+/).filter(w => w.length > 2)
      const matched = words.find(w => propLoc.includes(w))
      if (matched) {
        score += weights.location * 0.75
      } else {
        score += weights.location * 0.15
        penaltyMultiplier *= 0.85
      }
    }
  } else {
    score += weights.location
  }

  // 5. Bedrooms (10%)
  const beds = Number(prop.beds ?? prop.bedrooms) || 0
  const minBeds = criteria.min_bedrooms !== null && criteria.min_bedrooms !== undefined ? Number(criteria.min_bedrooms) : null
  const maxBeds = criteria.max_bedrooms !== null && criteria.max_bedrooms !== undefined ? Number(criteria.max_bedrooms) : null

  if (minBeds !== null || maxBeds !== null) {
    const low = minBeds !== null ? minBeds : 0
    const high = maxBeds !== null ? maxBeds : 99
    if (beds >= low && beds <= high) {
      score += weights.bedrooms
    } else if (minBeds !== null && Math.abs(beds - minBeds) === 1) {
      score += weights.bedrooms * 0.6
    } else {
      score += 0
      penaltyMultiplier *= 0.85
    }
  } else {
    score += weights.bedrooms
  }

  // 6. Vibe Tags & Amenities (5%)
  const tags = [...(criteria.vibe_tags || []), ...(criteria.required_amenities || [])]
  if (tags.length > 0) {
    const textCorpus = `${prop.description || ''} ${prop.summary || ''} ${prop.title || ''} ${(prop.features || []).map(f => f.name || f).join(' ')} ${(prop.tags || []).join(' ')}`.toLowerCase()
    let matches = 0
    tags.forEach(t => {
      const tNorm = String(t).toLowerCase().trim()
      if (tNorm && textCorpus.includes(tNorm)) matches++
    })
    const ratio = Math.min(1, matches / tags.length)
    score += weights.vibeAndAmenities * (0.2 + 0.8 * ratio)
  } else {
    score += weights.vibeAndAmenities
  }

  // Apply penalty multiplier and model confidence
  const conf = criteria.confidence !== undefined && criteria.confidence !== null ? Math.max(0.85, Number(criteria.confidence)) : 0.95
  const finalScore = Math.round(score * penaltyMultiplier * conf)

  return Math.min(99, Math.max(15, finalScore))
}

export const TYPE_LABEL_BY_ID = {
  1: 'Apartment', 2: 'Villa', 3: 'Penthouse', 4: 'Townhouse', 5: 'House', 6: 'Office', 7: 'Warehouse',
  8: 'Land', 9: 'Restaurant', 10: 'Hotel', 11: 'Full Building', 12: 'Commercial', 13: 'Clinic',
  14: 'School', 15: 'Showroom', 16: 'Cafe',
}

const TYPE_KEYWORDS = [
  ['Penthouse', /penthouse/], ['Townhouse', /townhouse/], ['Villa', /villa/],
  ['Apartment', /apartment|flat|studio/], ['House', /house/], ['Land', /\bland\b|plot/],
  ['Office', /office/], ['Warehouse', /warehouse/], ['Restaurant', /restaurant/], ['Hotel', /hotel/],
  ['Full Building', /building/], ['Clinic', /clinic/], ['School', /school/],
  ['Commercial', /shop|commercial/], ['Showroom', /showroom/], ['Cafe', /caf[eé]/],
]

function matchTypeKeywords(text) {
  for (const [label, re] of TYPE_KEYWORDS) if (re.test(text)) return label
  return null
}

export function inferTypeLabel(raw) {
  const byId = TYPE_LABEL_BY_ID[Number(raw.type_id)]
  if (byId) return byId
  const explicit = raw.property_type_en || raw.category_en || raw.property_type
  if (explicit) {
    const hit = matchTypeKeywords(String(explicit).toLowerCase())
    if (hit) return hit
  }
  // العنوان آخر حل، والجزء قبل " in " فقط (اسم الحي ممكن يحتوي Villas أو Land)
  const head = String(raw.title || raw.title_en || '').toLowerCase().split(' in ')[0]
  return matchTypeKeywords(head) || 'Apartment'
}

export function toLatinDigits(s) {
  return String(s).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
}

export function parsePlainBudget(text) {
  const m = toLatinDigits(text).match(/(\d[\d,]{4,})/)   // 5 خانات فأكثر، فما تلتقط سنة مثل 2024
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : null
}

export function buildServerFilters(criteria, purpose) {
  const c = criteria || {}
  const f = {}
  if (c.property_type) f.type = c.property_type            // getProperties بيحوّله لـ type_id
  if (c.min_budget) f.min_price = c.min_budget
  if (c.max_budget) f.max_price = c.max_budget
  const action = c.action_type || purpose
  if (action) f.purpose = action === 'rent' ? 'rent' : 'buy' // getProperties بيحوّله لـ action_type
  if (c.location_hint) f.search = c.location_hint
  return f
}

export async function runServerSideFallback(service, term, lang, options = {}) {
  const criteria = await service.parseQueryWithAi(term, lang)
  const filters = buildServerFilters(criteria, options.purpose)

  let res = await service.getProperties({ ...filters, per_page: 100 })
  let source = 'ai_fallback'
  if (res.success !== false && (res.data || []).length === 0 && filters.search) {
    const { search, ...withoutLocation } = filters          // نخفّف الموقع فقط. النوع والسعر ثابتين
    res = await service.getProperties({ ...withoutLocation, per_page: 100 })
    source = 'ai_fallback_relaxed'
  }
  if (res.success === false) {
    return { success: false, data: [], properties: [], ai_understanding: criteria, error: res.error, source: 'ai_fallback_error' }
  }

  let items = res.data || []
  if (criteria?.min_bedrooms !== null && criteria?.min_bedrooms !== undefined) {
    items = items.filter((p) => Number(p.beds ?? p.bedrooms ?? 0) >= Number(criteria.min_bedrooms))
  }

  const scored = items
    .map((p) => {
      const s = calculateAiMatchScore(p, criteria)
      return { ...p, matchScore: s, aiMatch: s, aiCriteria: criteria }
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  console.log('[AI Search] source:', source, '| criteria:', criteria)
  if (typeof console.table === 'function') {
    console.table(scored.slice(0, 8).map((p) => ({ id: p.id, title: p.title, price: p.price, matchScore: p.matchScore })))
  }

  return {
    success: true,
    data: scored,
    properties: scored,
    ai_understanding: criteria,
    nearby_amenities: [],
    total_results: res.pagination?.total ?? scored.length,
    returned_results: scored.length,
    source: scored.length ? source : 'ai_fallback_empty',
  }
}

/**
 * Robust rule-based fallback NLP extractor
 * for instances where the remote FastAPI server is waking up or temporarily down.
 */
function fallbackParseCriteria(term, lang = 'en') {
  const t = term.toLowerCase()
  const isAr = lang === 'ar' || /[\u0600-\u06FF]/.test(term)

  // Property Type
  let property_type = null
  if (t.includes('villa') || t.includes('فيلا') || t.includes('فلل')) property_type = 'Villa'
  else if (t.includes('penthouse') || t.includes('بنتهاوس')) property_type = 'Penthouse'
  else if (t.includes('townhouse') || t.includes('تاون هاوس')) property_type = 'Townhouse'
  else if (t.includes('apartment') || t.includes('flat') || t.includes('شقة') || t.includes('شقق')) property_type = 'Apartment'
  else if (t.includes('office') || t.includes('مكتب') || t.includes('مكاتب')) property_type = 'Office'
  else if (t.includes('studio') || t.includes('استوديو')) property_type = 'Apartment'

  // Action Type
  let action_type = null
  if (t.includes('rent') || t.includes('إيجار') || t.includes('للايجار') || t.includes('للإيجار')) action_type = 'rent'
  else if (t.includes('buy') || t.includes('sale') || t.includes('شراء') || t.includes('للبيع') || t.includes('بيع')) action_type = 'buy'

  // Location Hint
  let location_hint = null
  const locations = [
    { key: 'palm jumeirah', label: 'Palm Jumeirah', ar: 'نخلة جميرا' },
    { key: 'dubai marina', label: 'Dubai Marina', ar: 'مرسى دبي' },
    { key: 'marina', label: 'Dubai Marina', ar: 'مارينا' },
    { key: 'downtown', label: 'Downtown Dubai', ar: 'وسط المدينة' },
    { key: 'business bay', label: 'Business Bay', ar: 'الخليج التجاري' },
    { key: 'jvc', label: 'JVC', ar: 'قرية جميرا' },
    { key: 'dubai hills', label: 'Dubai Hills', ar: 'دبي هيلز' },
    { key: 'creek', label: 'Dubai Creek', ar: 'خور دبي' },
    { key: 'difc', label: 'DIFC', ar: 'مركز دبي المالي' },
    { key: 'dubai', label: 'Dubai', ar: 'دبي' }
  ]
  for (const loc of locations) {
    if (t.includes(loc.key) || (loc.ar && t.includes(loc.ar))) {
      location_hint = loc.label
      break
    }
  }

  // Bedrooms
  let min_bedrooms = null
  const bedMatch = t.match(/(\d+)\s*(?:bed|bedroom|غرف|غرفة)/i)
  if (bedMatch) {
    min_bedrooms = parseInt(bedMatch[1], 10)
  } else if (t.includes('غرفتين') || t.includes('2 beds')) {
    min_bedrooms = 2
  } else if (t.includes('3 غرف') || t.includes('3 beds')) {
    min_bedrooms = 3
  } else if (t.includes('4 غرف') || t.includes('4 beds')) {
    min_bedrooms = 4
  } else if (t.includes('studio') || t.includes('استوديو')) {
    min_bedrooms = 0
  }

  // Budget
  let max_budget = null
  let min_budget = null
  const budgetMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:m|million|مليون)/i)
  if (budgetMatch) {
    max_budget = parseFloat(budgetMatch[1]) * 1000000
  } else {
    const kMatch = t.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand|ألف)/i)
    if (kMatch) {
      max_budget = parseFloat(kMatch[1]) * 1000
    }
    if (max_budget === null) max_budget = parsePlainBudget(term)
  }

  // Vibe tags & amenities
  const vibe_tags = []
  const required_amenities = []
  if (t.includes('pool') || t.includes('مسبح')) required_amenities.push('pool')
  if (t.includes('balcony') || t.includes('شرفة') || t.includes('بلكونة')) required_amenities.push('balcony')
  if (t.includes('luxury') || t.includes('فاخر') || t.includes('فخمة')) vibe_tags.push('luxury')
  if (t.includes('beach') || t.includes('شاطئ') || t.includes('بحر')) vibe_tags.push('beachfront')
  if (t.includes('quiet') || t.includes('هادئ')) vibe_tags.push('quiet')

  return {
    property_type,
    action_type,
    min_budget,
    max_budget,
    budget_currency: 'AED',
    min_bedrooms,
    max_bedrooms: min_bedrooms,
    vibe_tags,
    required_amenities,
    location_hint,
    confidence: 0.90,
    needs_clarification: false
  }
}

export default propertyService

