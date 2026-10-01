/**
 * Service for loading and querying Dubai Points of Interest (POIs).
 * Contains 6,658 verified locations across Dubai:
 * Metro/Transit, Schools, Hospitals, Supermarkets, Restaurants, Cafes, Parks, Police, etc.
 */

let cachedPois = null
let fetchPromise = null

export const POI_CATEGORIES = {
  transit_station: {
    id: 'transit_station',
    group: 'transit',
    labelEn: 'Metro & Transit',
    labelAr: 'المترو والنقل',
    icon: '🚉',
    faIcon: 'fa-solid fa-train-subway',
    color: '#0284c7',
    badgeClass: 'badge-transit'
  },
  school: {
    id: 'school',
    group: 'education',
    labelEn: 'Schools & Education',
    labelAr: 'المدارس والتعليم',
    icon: '🏫',
    faIcon: 'fa-solid fa-graduation-cap',
    color: '#2563eb',
    badgeClass: 'badge-education'
  },
  hospital: {
    id: 'hospital',
    group: 'healthcare',
    labelEn: 'Hospital',
    labelAr: 'مستشفى',
    icon: '🏥',
    faIcon: 'fa-solid fa-hospital',
    color: '#ef4444',
    badgeClass: 'badge-health'
  },
  clinic: {
    id: 'clinic',
    group: 'healthcare',
    labelEn: 'Medical Clinic',
    labelAr: 'عيادة طبية',
    icon: '🩺',
    faIcon: 'fa-solid fa-stethoscope',
    color: '#f43f5e',
    badgeClass: 'badge-health'
  },
  pharmacy: {
    id: 'pharmacy',
    group: 'healthcare',
    labelEn: 'Pharmacy',
    labelAr: 'صيدلية',
    icon: '💊',
    faIcon: 'fa-solid fa-pills',
    color: '#06b6d4',
    badgeClass: 'badge-health'
  },
  supermarket: {
    id: 'supermarket',
    group: 'shopping',
    labelEn: 'Supermarket & Malls',
    labelAr: 'سوبرماركت وتسوق',
    icon: '🛒',
    faIcon: 'fa-solid fa-cart-shopping',
    color: '#10b981',
    badgeClass: 'badge-shopping'
  },
  restaurant: {
    id: 'restaurant',
    group: 'food',
    labelEn: 'Restaurant',
    labelAr: 'مطعم ومأكولات',
    icon: '🍽️',
    faIcon: 'fa-solid fa-utensils',
    color: '#f59e0b',
    badgeClass: 'badge-food'
  },
  cafe: {
    id: 'cafe',
    group: 'food',
    labelEn: 'Cafe',
    labelAr: 'مقهى وكافيه',
    icon: '☕',
    faIcon: 'fa-solid fa-mug-hot',
    color: '#8b5cf6',
    badgeClass: 'badge-food'
  },
  park: {
    id: 'park',
    group: 'parks',
    labelEn: 'Park & Greenery',
    labelAr: 'حديقة ومنتزه',
    icon: '🌳',
    faIcon: 'fa-solid fa-tree',
    color: '#22c55e',
    badgeClass: 'badge-parks'
  },
  police: {
    id: 'police',
    group: 'safety',
    labelEn: 'Police & Safety',
    labelAr: 'أمن وشرطة',
    icon: '👮',
    faIcon: 'fa-solid fa-shield-halved',
    color: '#6366f1',
    badgeClass: 'badge-safety'
  },
  nightclub: {
    id: 'nightclub',
    group: 'entertainment',
    labelEn: 'Nightclub & Leisure',
    labelAr: 'ترفيه وسهر',
    icon: '💃',
    faIcon: 'fa-solid fa-music',
    color: '#d946ef',
    badgeClass: 'badge-entertainment'
  },
  bar: {
    id: 'bar',
    group: 'entertainment',
    labelEn: 'Lounge / Bar',
    labelAr: 'استراحة وترفيه',
    icon: '🍸',
    faIcon: 'fa-solid fa-martini-glass-citrus',
    color: '#f97316',
    badgeClass: 'badge-entertainment'
  }
}

export const POI_FILTER_GROUPS = [
  { id: 'all', icon: 'fa-solid fa-layer-group', labelEn: 'All POIs', labelAr: 'جميع المرافق' },
  { id: 'transit', subcategories: ['transit_station'], icon: 'fa-solid fa-train-subway', emoji: '🚉', labelEn: 'Metro & Transit', labelAr: 'مترو ونقل' },
  { id: 'education', subcategories: ['school'], icon: 'fa-solid fa-graduation-cap', emoji: '🏫', labelEn: 'Schools', labelAr: 'مدارس' },
  { id: 'healthcare', subcategories: ['hospital', 'clinic', 'pharmacy'], icon: 'fa-solid fa-heart-pulse', emoji: '🏥', labelEn: 'Healthcare', labelAr: 'صحة ورعاية' },
  { id: 'shopping', subcategories: ['supermarket'], icon: 'fa-solid fa-cart-shopping', emoji: '🛒', labelEn: 'Shopping', labelAr: 'سوبرماركت' },
  { id: 'food', subcategories: ['restaurant', 'cafe'], icon: 'fa-solid fa-utensils', emoji: '🍽️', labelEn: 'Dining & Cafes', labelAr: 'مطاعم وكافيهات' },
  { id: 'parks', subcategories: ['park'], icon: 'fa-solid fa-tree', emoji: '🌳', labelEn: 'Parks', labelAr: 'حدائق' },
  { id: 'safety', subcategories: ['police'], icon: 'fa-solid fa-shield-halved', emoji: '👮', labelEn: 'Police & Safety', labelAr: 'أمن وشرطة' }
]

/**
 * Calculates distance between 2 coordinates in kilometers (Haversine formula).
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const poiService = {
  /**
   * Load all POIs from /dubai_pois.json with in-memory caching.
   */
  async loadPois() {
    if (cachedPois) return cachedPois
    if (fetchPromise) return fetchPromise

    fetchPromise = fetch('/dubai_pois.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then(data => {
        cachedPois = Array.isArray(data) ? data : []
        return cachedPois
      })
      .catch(err => {
        console.error('Failed to load dubai_pois.json:', err)
        fetchPromise = null
        return []
      })

    return fetchPromise
  },

  /**
   * Return category metadata.
   */
  getCategoryMeta(subcat) {
    return POI_CATEGORIES[subcat] || {
      id: subcat,
      group: 'amenities',
      labelEn: subcat || 'Amenity',
      labelAr: subcat || 'مرفق عام',
      icon: '📍',
      faIcon: 'fa-solid fa-location-dot',
      color: '#0284c7',
      badgeClass: 'badge-default'
    }
  },

  /**
   * Finds the closest POIs to a given coordinate.
   * Returns a balanced, diverse list of essential amenities (Metro, School, Hospital, Grocery, Park, etc.).
   */
  async getNearbyPois(lat, lng, { maxDistanceKm = 5, limit = 6 } = {}) {
    const all = await this.loadPois()
    if (!all || !all.length) return []

    // Compute distance for all
    const enriched = all.map(poi => {
      const dist = calculateDistanceKm(lat, lng, poi.latitude, poi.longitude)
      return {
        ...poi,
        distanceKm: Math.round(dist * 100) / 100,
        walkingMinutes: Math.round(dist / 0.08), // ~4.8 km/h walking speed
        drivingMinutes: Math.max(1, Math.round(dist / 0.5)), // ~30 km/h driving speed
        meta: this.getCategoryMeta(poi.subcategory)
      }
    })

    // Filter within maxDistance
    const within = enriched.filter(p => p.distanceKm <= maxDistanceKm)
    within.sort((a, b) => a.distanceKm - b.distanceKm)

    // Ensure category diversity: pick best of each group first
    const selected = []
    const usedSubcategories = new Set()

    for (const item of within) {
      if (!usedSubcategories.has(item.subcategory)) {
        selected.push(item)
        usedSubcategories.add(item.subcategory)
        if (selected.length >= limit) break
      }
    }

    // Fill remaining if needed
    if (selected.length < limit) {
      for (const item of within) {
        if (!selected.some(s => s.osm_id === item.osm_id)) {
          selected.push(item)
          if (selected.length >= limit) break
        }
      }
    }

    return selected
  },

  /**
   * Filter POIs by group key (e.g. 'transit', 'education', 'healthcare', etc.)
   */
  filterByGroup(pois, groupId) {
    if (!groupId || groupId === 'all') return pois
    const groupDef = POI_FILTER_GROUPS.find(g => g.id === groupId)
    if (!groupDef || !groupDef.subcategories) return pois
    const subcats = new Set(groupDef.subcategories)
    return pois.filter(p => subcats.has(p.subcategory))
  }
}

export default poiService
