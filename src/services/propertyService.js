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
    rent_frequency: raw.rent_frequency || 'yearly',
    period: frequency,
    beds,
    baths,
    size: sizeFormatted,
    area_sqft: Number(rawSqft) || 0,
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

export const propertyService = {
  /**
   * Fetch home page bundle directly from GET /api/home
   * Contains: properties, property_types, categories, testimonials, stats
   */
  async getHomeData() {
    const response = await apiClient.get('/home')
    const rawData = response?.data || response

    const properties = Array.isArray(rawData?.properties)
      ? rawData.properties.map(normalizeProperty)
      : []

    return {
      success: true,
      total: rawData?.total || properties.length,
      properties,
      propertyTypes: rawData?.property_types || [],
      categories: rawData?.categories || [],
      testimonials: rawData?.testimonials || [],
      stats: rawData?.stats || {}
    }
  },

  /**
   * Fetch real property listings directly from backend database API (/api/properties)
   * @param {Object} params - { search, type_id, bedrooms, bathrooms, min_price, max_price, page, per_page }
   */
  async getProperties(params = {}) {
    // If no search or filters are specified, /home provides the curated collection
    if (!Object.keys(params).length) {
      const homeRes = await this.getHomeData()
      return {
        success: true,
        data: homeRes.properties,
        pagination: { total: homeRes.total }
      }
    }

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

    const response = await apiClient.get('/properties', { params: queryParams })

    let rawList = []
    if (Array.isArray(response)) {
      rawList = response
    } else if (Array.isArray(response?.data)) {
      rawList = response.data
    } else if (Array.isArray(response?.data?.data)) {
      rawList = response.data.data
    }

    return {
      success: true,
      data: rawList.map(normalizeProperty),
      pagination: response.pagination || null
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
   * AI Search directly using backend search endpoint
   * @param {string} queryStr
   */
  async searchWithAi(queryStr) {
    const term = (queryStr || '').trim()
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
      data: scored
    }
  }
}

export default propertyService
