import { ref } from 'vue'
import apiClient from './api'
import { authService } from './authService'

const STORAGE_KEY = 'vibe_saved_properties'

// Reactive array of saved properties
const savedItems = ref([])
// Reactive set of saved property identifiers (title or id)
const savedKeys = ref(new Set())

// Default mock saved properties if localStorage is empty
const INITIAL_MOCK_SAVED = [
  {
    id: 1,
    title: 'The Royal Atlantis Sky Villa',
    location: 'Palm Jumeirah, Dubai',
    price: 'AED 18,500,000',
    beds: 4,
    baths: 5,
    sqft: '5,420',
    type: 'Villas',
    image: '/images/photo-1600596542815-ffad4c1539a9.jfif',
    saved: true
  },
  {
    id: 2,
    title: 'Burj Crown Panorama Penthouse',
    location: 'Downtown Dubai, Dubai',
    price: 'AED 8,450,000',
    beds: 3,
    baths: 4,
    sqft: '2,850',
    type: 'Penthouses',
    image: '/images/photo-1512917774080-9991f1c4c750.jfif',
    saved: true
  },
  {
    id: 3,
    title: 'Marina Gate Waterfront Haven',
    location: 'Dubai Marina, Dubai',
    price: 'AED 4,450,000',
    beds: 2,
    baths: 3,
    sqft: '1,750',
    type: 'Apartments',
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    saved: true
  }
]

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        savedItems.value = parsed
        savedKeys.value = new Set(parsed.map(p => p.title || p.id))
        return
      }
    }
  } catch (e) {
    console.error('Failed to load saved properties from localStorage:', e)
  }

  // Fallback initial items
  savedItems.value = INITIAL_MOCK_SAVED
  savedKeys.value = new Set(INITIAL_MOCK_SAVED.map(p => p.title))
  saveToStorage()
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems.value))
  } catch (e) {
    console.error('Failed to write saved properties to localStorage:', e)
  }
}

// Initial load on import
loadFromStorage()

export const favoritesService = {
  savedItems,
  savedKeys,

  get count() {
    return savedItems.value.length
  },

  isSaved(titleOrId) {
    if (!titleOrId) return false
    return savedKeys.value.has(titleOrId)
  },

  /**
   * Sync favorites from Laravel backend: GET /api/favorites
   */
  async syncWithBackend() {
    if (!authService.isAuthenticated()) return
    try {
      const res = await apiClient.get('/favorites')
      const list = Array.isArray(res) ? res : (res?.data || res?.favorites || [])
      if (Array.isArray(list)) {
        const normalized = list.map(item => {
          const prop = item.property || item
          return {
            id: prop.id,
            title: prop.title || 'Dubai Property',
            location: prop.address_line_1 || prop.location || 'Dubai, UAE',
            price: prop.price ? `AED ${Number(prop.price).toLocaleString()}` : 'AED 0',
            beds: prop.bedrooms || 2,
            baths: prop.bathrooms || 2,
            sqft: prop.area_sqft || '1,500',
            type: prop.type?.name || 'Apartments',
            image: prop.cover_image || prop.image || '/images/photo-1545324418-cc1a3fa10c00.avif',
            saved: true
          }
        })
        savedItems.value = normalized
        savedKeys.value = new Set(normalized.map(p => p.title || p.id))
        saveToStorage()
      }
    } catch (err) {
      console.warn('[favoritesService] Could not sync with /api/favorites:', err?.message)
    }
  },

  /**
   * Toggle save/unsave property (optimistic local update + async API call)
   */
  async toggleSave(prop) {
    if (!prop) return false
    const key = prop.title || prop.id
    if (!key) return false

    const wasSaved = savedKeys.value.has(key)
    const propId = prop.id

    if (wasSaved) {
      // Remove locally
      savedItems.value = savedItems.value.filter(item => (item.title || item.id) !== key)
      const nextKeys = new Set(savedKeys.value)
      nextKeys.delete(key)
      if (prop.id) nextKeys.delete(prop.id)
      savedKeys.value = nextKeys
      saveToStorage()

      // Call API if authenticated: DELETE /api/favorites/{id}
      if (authService.isAuthenticated() && propId) {
        apiClient.delete(`/favorites/${propId}`).catch(err => {
          console.warn('[favoritesService] API remove favorite failed:', err?.message)
        })
      }

      return false
    } else {
      // Add locally
      const newItem = {
        id: prop.id || Date.now(),
        title: prop.title || 'Luxury Dubai Property',
        location: prop.location || prop.area || 'Dubai, UAE',
        price: typeof prop.price === 'number' ? `AED ${prop.price.toLocaleString()}` : (prop.price || 'AED 0'),
        beds: prop.beds || prop.bedrooms || 2,
        baths: prop.baths || prop.bathrooms || 2,
        sqft: prop.sqft || prop.size || prop.area_sqft || '1,500',
        type: prop.type || (prop.title?.toLowerCase().includes('villa') ? 'Villas' : prop.title?.toLowerCase().includes('penthouse') ? 'Penthouses' : 'Apartments'),
        image: prop.image || (prop.images && prop.images[0]) || '/images/photo-1545324418-cc1a3fa10c00.avif',
        saved: true
      }
      savedItems.value = [newItem, ...savedItems.value]
      const nextKeys = new Set(savedKeys.value)
      nextKeys.add(key)
      if (prop.id) nextKeys.add(prop.id)
      savedKeys.value = nextKeys
      saveToStorage()

      // Call API if authenticated: POST /api/favorites/{id}
      if (authService.isAuthenticated() && propId) {
        apiClient.post(`/favorites/${propId}`).catch(err => {
          console.warn('[favoritesService] API add favorite failed:', err?.message)
        })
      }

      return true
    }
  },

  async remove(titleOrId) {
    const removedItem = savedItems.value.find(item => item.id === titleOrId || item.title === titleOrId)
    savedItems.value = savedItems.value.filter(item => item.id !== titleOrId && item.title !== titleOrId)
    const nextKeys = new Set(savedKeys.value)
    nextKeys.delete(titleOrId)
    if (removedItem?.id) nextKeys.delete(removedItem.id)
    if (removedItem?.title) nextKeys.delete(removedItem.title)
    savedKeys.value = nextKeys
    saveToStorage()

    const propertyId = removedItem?.id || (typeof titleOrId === 'number' ? titleOrId : null)
    if (authService.isAuthenticated() && propertyId) {
      apiClient.delete(`/favorites/${propertyId}`).catch(() => {})
    }
  },

  clear() {
    savedItems.value = []
    savedKeys.value = new Set()
    saveToStorage()
  }
}

export default favoritesService
