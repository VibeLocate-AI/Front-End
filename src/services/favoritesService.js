import { ref, computed } from 'vue'

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

  toggleSave(prop) {
    if (!prop) return false
    const key = prop.title || prop.id
    if (!key) return false

    if (savedKeys.value.has(key)) {
      // Remove
      savedItems.value = savedItems.value.filter(item => (item.title || item.id) !== key)
      const nextKeys = new Set(savedKeys.value)
      nextKeys.delete(key)
      savedKeys.value = nextKeys
      saveToStorage()
      return false
    } else {
      // Add
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
      savedKeys.value = nextKeys
      saveToStorage()
      return true
    }
  },

  remove(titleOrId) {
    savedItems.value = savedItems.value.filter(item => (item.title || item.id) !== titleOrId)
    const nextKeys = new Set(savedKeys.value)
    nextKeys.delete(titleOrId)
    savedKeys.value = nextKeys
    saveToStorage()
  },

  clear() {
    savedItems.value = []
    savedKeys.value = new Set()
    saveToStorage()
  }
}

export default favoritesService
