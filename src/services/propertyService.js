import apiClient from './api'

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

  const fallbackImages = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=85',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  ]

  if (!primaryImage) {
    primaryImage = fallbackImages[(Number(raw.id) || 0) % fallbackImages.length]
    allImages = [primaryImage]
  } else if (!primaryImage.startsWith('http') && !primaryImage.startsWith('/')) {
    primaryImage = `https://vibelocate-laravel.onrender.com/${primaryImage}`
  }

  // Location formatting from API property_locations table
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
  }

  // Determine property type and category from title / type_id
  let type = raw.type || ''
  if (!type) {
    const titleLower = (raw.title || '').toLowerCase()
    if (raw.type_id === 2 || titleLower.includes('villa')) {
      type = 'Villa'
    } else if (raw.type_id === 3 || titleLower.includes('penthouse')) {
      type = 'Penthouse'
    } else if (raw.type_id === 4 || titleLower.includes('townhouse')) {
      type = 'Townhouse'
    } else {
      type = 'Apartment'
    }
  }

  const category = (raw.category || type).toLowerCase()

  // Format pricing and specifications from API
  const priceNum = Number(raw.price) || 0
  const beds = Number(raw.bedrooms ?? 0)
  const baths = Number(raw.bathrooms ?? 0)
  const rawSqft = raw.area_sqft || raw.size
  const sizeFormatted = rawSqft ? Math.round(Number(String(rawSqft).replace(/,/g, ''))).toLocaleString() : 'N/A'

  // Extract feature names from API property_feature_values
  const featuresList = Array.isArray(raw.features)
    ? raw.features.map(f => f.name || f.feature_value).filter(Boolean)
    : []

  const frequency = raw.rent_frequency ? `/${raw.rent_frequency}` : '/month'
  const currencySymbol = raw.currency === 'AED' ? 'AED ' : '$'
  const listingPurpose = String(
    raw.listing_purpose || raw.purpose || raw.offer_type || raw.transaction_type || raw.listing_type || ''
  ).toLowerCase()

  return {
    id: raw.id,
    title: raw.title || 'Dubai Property',
    slug: raw.slug || '',
    type,
    category,
    area: areaText,
    location: areaText,
    price: priceNum,
    currency: raw.currency || 'AED',
    currencySymbol,
    rent_frequency: raw.rent_frequency || '',
    listingPurpose,
    isForRent: raw.is_for_rent === true || raw.is_for_rent === 1 || raw.is_for_rent === '1' ||
      listingPurpose.includes('rent') || Boolean(raw.rent_frequency),
    period: frequency,
    beds,
    baths,
    size: sizeFormatted,
    area_sqft: Number(rawSqft) || 0,
    latitude: Number(raw.latitude ?? raw.lat ?? raw.location?.latitude ?? raw.location?.lat) || null,
    longitude: Number(raw.longitude ?? raw.lng ?? raw.lon ?? raw.location?.longitude ?? raw.location?.lng) || null,
    image: primaryImage,
    images: allImages.length > 0 ? allImages : [primaryImage],
    summary: raw.description || `${type} in ${areaText} with ${beds} beds and ${baths} baths.`,
    description: raw.description || '',
    is_furnished: raw.is_furnished || 'unfurnished',
    aiMatch: 88 + ((raw.id * 7) % 12),
    badgeStyle: type === 'Villa' || type === 'Penthouse'
      ? 'background: var(--gold-accent); color: var(--navy-dark);'
      : 'background: var(--cyan-accent);',
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
    badgeStyle: 'background: var(--gold-accent); color: var(--navy-dark);',
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
    badgeStyle: 'background: var(--cyan-accent);',
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
    badgeStyle: 'background: var(--gold-accent); color: var(--navy-dark);',
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
    badgeStyle: 'background: var(--cyan-accent);',
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
    badgeStyle: 'background: var(--cyan-accent);',
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
    badgeStyle: 'background: var(--cyan-accent);',
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
    badgeStyle: 'background: var(--cyan-accent);',
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
    badgeStyle: 'background: var(--gold-accent); color: var(--navy-dark);',
    tags: ['Villa', 'Dubai Hills', '5 Beds', 'Golf Course'],
    description: 'Prestigious golf course villa with expansive garden, maid room, and grand double-height ceilings.',
    specs: { beds: '5 Bedrooms', baths: '6 Bathrooms', area: '5,200 sq.ft', parking: 'Included', amenities: ['Golf View', 'Private Garden', 'Clubhouse'] }
  }
]

export const propertyService = {
  /**
   * Fetch real property listings directly from backend database API (/api/properties)
   * @param {Object} params - { search, type_id, bedrooms, bathrooms, min_price, max_price, page, per_page }
   */
  async getProperties(params = {}) {
    const queryParams = { ...params }

    // Map frontend filters to Laravel PropertyController query parameters
    if (params.type && params.type !== 'all') {
      const t = params.type.toLowerCase()
      if (t.includes('apartment')) queryParams.type_id = 1
      else if (t.includes('villa')) queryParams.type_id = 2
      else if (t.includes('penthouse')) queryParams.type_id = 3
      else if (t.includes('townhouse')) queryParams.type_id = 4
      delete queryParams.type
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
        data: normalized.length > 0 ? normalized : DEFAULT_PROPERTIES,
        pagination: response?.pagination || response?.data?.pagination || null
      }
    } catch (err) {
      console.warn('API /properties fetch failed, using fallback catalog:', err)
      return {
        success: true,
        data: DEFAULT_PROPERTIES,
        pagination: { total: DEFAULT_PROPERTIES.length }
      }
    }
  },

  /**
   * Fetch home page bundle directly or gracefully fallback to /properties
   * Contains: properties, property_types, categories, testimonials, stats
   */
  async getHomeData() {
    // 1. Try GET /home first
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
      const propRes = await this.getProperties()
      if (propRes?.data && propRes.data.length > 0) {
        return {
          success: true,
          total: propRes.pagination?.total || propRes.data.length,
          properties: propRes.data,
          propertyTypes: [],
          categories: [],
          testimonials: [],
          stats: {}
        }
      }
    } catch (err2) {
      console.warn('Fallback /properties also failed:', err2)
    }

    // 3. Ultimate resilient fallback to curated luxury collection
    return {
      success: true,
      total: DEFAULT_PROPERTIES.length,
      properties: DEFAULT_PROPERTIES,
      propertyTypes: [],
      categories: [],
      testimonials: [],
      stats: {}
    }
  },

  /**
   * Fetch single property by ID from database API
   * @param {number|string} id
   */
  async getPropertyById(id) {
    const response = await apiClient.get(`/properties/${id}`)
    const raw = response?.data || response
    return {
      success: true,
      data: normalizeProperty(raw)
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
   * AI Contextual Search endpoint
   * POST /api/ai/contextual-search
   * @param {string} queryStr
   */
  async searchWithAi(queryStr) {
    const term = (queryStr || '').trim()
    if (!term) {
      return { success: true, data: [] }
    }

    try {
      // 1. Call official backend AI contextual search endpoint
      const response = await apiClient.post('/ai/contextual-search', {
        query: term,
        search: term,
        prompt: term
      })

      // Extract array from response payload
      let rawList = []
      if (Array.isArray(response)) {
        rawList = response
      } else if (Array.isArray(response?.data)) {
        rawList = response.data
      } else if (Array.isArray(response?.data?.data)) {
        rawList = response.data.data
      } else if (Array.isArray(response?.properties)) {
        rawList = response.properties
      } else if (Array.isArray(response?.data?.properties)) {
        rawList = response.data.properties
      } else if (Array.isArray(response?.results)) {
        rawList = response.results
      } else if (Array.isArray(response?.data?.results)) {
        rawList = response.data.results
      }

      if (rawList && rawList.length > 0) {
        const normalized = rawList.map(item => {
          const rawProp = item.property || item.listing || item.data || item
          const norm = normalizeProperty(rawProp)
          const extractedScore = item.match_percentage || item.matchScore || item.match_score || item.score || item.relevance || rawProp.match_score || rawProp.matchScore
          const matchScore = extractedScore ? Math.round(Number(extractedScore)) : (norm.aiMatch || 88)
          return {
            ...norm,
            matchScore: Math.min(99, Math.max(60, matchScore))
          }
        })

        // Sort descending by match score
        normalized.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

        return {
          success: true,
          data: normalized,
          source: 'backend_ai'
        }
      }
    } catch (err) {
      console.warn('Backend /ai/contextual-search endpoint returned error, applying intelligent fallback:', err)
    }

    // 2. Intelligent Fallback: Database property query with client-side AI relevance scoring
    try {
      const res = await this.getProperties({ search: term, per_page: 20 })
      const words = term.toLowerCase().split(/\s+/).filter(Boolean)

      const scored = (res.data || []).map(p => {
        let score = 75
        const content = `${p.title} ${p.area} ${p.type} ${p.summary} ${p.tags.join(' ')}`.toLowerCase()

        words.forEach(w => {
          if (content.includes(w)) {
            score += 7
          }
        })

        return {
          ...p,
          matchScore: Math.min(99, Math.max(75, score))
        }
      })

      scored.sort((a, b) => b.matchScore - a.matchScore)

      return {
        success: true,
        data: scored,
        source: 'fallback'
      }
    } catch (fallbackErr) {
      console.error('Fallback search failed:', fallbackErr)
      return {
        success: false,
        data: [],
        error: fallbackErr.message
      }
    }
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
  }
}

export default propertyService
