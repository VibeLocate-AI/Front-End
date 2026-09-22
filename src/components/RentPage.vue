<template>
  <div class="rent-page-wrapper">
    <!-- ==================== HEADER / NAVBAR ==================== -->
    <header class="site-header" :class="{ scrolled: isScrolled }">
      <div class="header-inner">
        <!-- Logo -->
        <router-link class="brand" to="/home">
          <div class="brand-logo-wrap">
            <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img">
            <div class="brand-text">
              <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
              <span class="brand-badge">AI</span>
            </div>
          </div>
        </router-link>

        <!-- Mobile Menu Toggle -->
        <button class="menu-toggle" type="button" aria-label="Toggle navigation" @click="mobileMenuOpen = !mobileMenuOpen">
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Navigation Links -->
        <nav class="nav-links" :class="{ open: mobileMenuOpen }">
          <router-link class="nav-item" to="/home">Home</router-link>
          <router-link class="nav-item" to="/home#featured">Buy</router-link>
          <router-link class="nav-item active" to="/rent">Rent</router-link>
          <router-link class="nav-item" to="/new-projects">New Projects</router-link>
          <router-link class="nav-item" to="/map">Interactive Map <i class="fa-solid fa-map-location-dot" style="font-size:0.75rem; color:var(--accent-cyan, #00d2ff); margin-left:3px;"></i></router-link>
          <router-link class="nav-item" to="/home#areas">Areas</router-link>
          <router-link class="nav-item" to="/about">About Us</router-link>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <button class="btn-list-property" type="button" @click="showToast('Property listing portal opening soon.')">
            List Your Property <span class="plus-sign">+</span>
          </button>

          <button
            class="icon-action-btn"
            :class="{ 'has-saved': favoritesService.savedItems.value.length > 0 }"
            type="button"
            aria-label="Favorites"
            title="Saved Properties"
            @click="isSavedModalOpen = true"
          >
            <i :class="favoritesService.savedItems.value.length > 0 ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
            <span v-if="favoritesService.savedItems.value.length > 0" class="header-fav-badge">{{ favoritesService.savedItems.value.length }}</span>
          </button>

          <div class="user-profile-menu-container" ref="profileDropdownRef">
            <div class="user-profile-menu" @click="profileMenuOpen = !profileMenuOpen">
              <img
                class="header-avatar"
                :src="userAvatarUrl"
                :alt="displayName || 'User'"
                @error="onAvatarError"
              >
              <i class="fa-solid fa-chevron-down profile-arrow" :class="{ 'rotate-180': profileMenuOpen }"></i>
            </div>

            <!-- Profile Dropdown -->
            <div v-if="profileMenuOpen" class="profile-dropdown-box">
              <div class="dropdown-user-header">
                <img class="dropdown-avatar" :src="userAvatarUrl" :alt="displayName || 'User'" @error="onAvatarError">
                <div class="dropdown-user-info">
                  <strong class="dropdown-user-name">{{ displayName }}</strong>
                  <span class="dropdown-user-email">{{ displayEmail }}</span>
                  <span class="dropdown-user-badge"><i class="fa-solid fa-circle-check"></i> Verified Member</span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-menu-list">
                <button class="dropdown-menu-item" @click="router.push('/profile'); profileMenuOpen = false">
                  <i class="fa-regular fa-user"></i> <span>My Profile</span>
                </button>
                <button class="dropdown-menu-item" @click="router.push('/my-properties'); profileMenuOpen = false">
                  <i class="fa-regular fa-building"></i> <span>My Properties</span>
                </button>
                <button class="dropdown-menu-item" @click="isSavedModalOpen = true; profileMenuOpen = false">
                  <i class="fa-solid fa-heart text-danger"></i> <span>Saved Properties ({{ favoritesService.savedItems.value.length }})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ==================== DASHBOARD CATALOG CONTENT ==================== -->
    <main class="explore-dashboard-section">
      
      <!-- 1. HERO BANNER HEADER -->
      <div class="explore-hero-banner">
        <div class="explore-header-titles">
          <h1 class="explore-main-headline">Dubai Properties for Rent</h1>
          <p class="explore-sub-headline">Discover rental homes tailored to your lifestyle with AI-powered discovery.</p>
        </div>

        <!-- Top Right AI Curated Badge -->
        <div class="explore-ai-curated-badge">
          <div class="ai-badge-icon-box">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div class="ai-badge-text-box">
              <strong>Dubai's Best Rentals Curated with AI</strong>
            <span>Smarter search. Better living.</span>
          </div>
        </div>
      </div>

      <!-- 2. CATEGORY FILTER PILLS BAR -->
      <div class="explore-filter-pills-bar">
        <button
          v-for="cat in categoryPills"
          :key="cat.name"
          type="button"
          class="explore-filter-pill"
          :class="{ active: selectedCategory === cat.name }"
          @click="selectCategory(cat.name)"
        >
          <span>{{ cat.name }}</span>
          <span class="pill-count-tag">{{ cat.count }}</span>
        </button>
      </div>

      <!-- 3. MAIN TWO-COLUMN GRID LAYOUT -->
      <div class="explore-grid-layout">
        
        <!-- LEFT SIDEBAR: SEARCH & FILTER CARD -->
        <aside class="explore-sidebar-card">
          <div class="sidebar-card-header">
            <h3 class="sidebar-title">Search &amp; Filter</h3>
            <button type="button" class="btn-reset-filters" @click="resetFilters">
              <i class="fa-solid fa-rotate-left"></i> Reset All
            </button>
          </div>

          <form @submit.prevent="applyFilters">
            <!-- Keyword Search Input -->
            <div class="filter-group-item">
              <input
                v-model="filterState.keyword"
                type="text"
                class="filter-input-search"
                placeholder="Search properties, areas, or keywords..."
              >
            </div>

            <!-- Location Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-location-dot"></i> Location</label>
              <select v-model="filterState.location" class="filter-select-dropdown">
                <option value="All">All Areas</option>
                <option value="Downtown Dubai">Downtown Dubai</option>
                <option value="Palm Jumeirah">Palm Jumeirah</option>
                <option value="Dubai Marina">Dubai Marina</option>
                <option value="Bluewaters Island">Bluewaters Island</option>
                <option value="Za'abeel">Za'abeel, Dubai</option>
                <option value="JBR">JBR (Jumeirah Beach Residence)</option>
                <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                <option value="Emirates Hills">Emirates Hills</option>
              </select>
            </div>

            <!-- Property Type Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-building"></i> Property Type</label>
              <select v-model="filterState.propertyType" class="filter-select-dropdown">
                <option value="All">All Property Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>

            <!-- Price Range (AED) Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-dollar-sign"></i> Price Range (AED)</label>
              <select v-model="filterState.priceRange" class="filter-select-dropdown">
                <option value="Any">Any Price</option>
                <option value="under-5m">Under AED 5,000,000</option>
                <option value="5m-10m">AED 5,000,000 - 10,000,000</option>
                <option value="10m-25m">AED 10,000,000 - 25,000,000</option>
                <option value="25m-plus">AED 25,000,000+</option>
              </select>
            </div>

            <!-- Bedrooms Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-bed"></i> Bedrooms</label>
              <select v-model="filterState.bedrooms" class="filter-select-dropdown">
                <option value="Any">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5+">5+ Bedrooms</option>
              </select>
            </div>

            <!-- Lifestyle / Features Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-sliders"></i> Lifestyle / Features</label>
              <select v-model="filterState.lifestyle" class="filter-select-dropdown">
                <option value="Any">Any Lifestyle</option>
                <option value="Waterfront">Waterfront Living</option>
                <option value="Private Pool">Private Pool</option>
                <option value="Sea View">Sea View</option>
                <option value="Near Metro">Near Metro</option>
                <option value="Off-Plan">Off-Plan</option>
              </select>
            </div>

            <!-- Checkboxes List with Counts -->
            <div class="filter-group-item">
              <div class="filter-checkboxes-list">
                <label
                  v-for="feature in featureCheckboxes"
                  :key="feature.name"
                  class="custom-checkbox-row"
                >
                  <div class="checkbox-left">
                    <input
                      type="checkbox"
                      :value="feature.name"
                      v-model="filterState.selectedFeatures"
                    >
                    <span>{{ feature.name }}</span>
                  </div>
                  <span class="chk-count-badge">{{ feature.count }}</span>
                </label>
              </div>
            </div>

            <!-- Apply Filters Button -->
            <button type="submit" class="btn-apply-filters">
              <i class="fa-solid fa-sliders"></i> Apply Filters
            </button>
          </form>

          <!-- Bottom AI Switch Widget -->
          <div class="sidebar-ai-switch-box">
            <div class="ai-switch-info">
              <strong>
                <i class="fa-solid fa-wand-magic-sparkles" style="color:#00d2ff"></i> AI-Powered Search
              </strong>
              <p>Get smarter, more relevant results with VibeLocate AI</p>
            </div>
            <div
              class="toggle-switch-btn"
              :class="{ active: aiSearchActive }"
              @click="aiSearchActive = !aiSearchActive"
            >
              <span class="switch-circle"></span>
            </div>
          </div>
        </aside>

        <!-- RIGHT SIDE: PROPERTIES CATALOG & CONTROLS -->
        <main class="explore-catalog-main">
          
          <!-- Controls Top Bar -->
          <div class="catalog-top-controls-bar">
            <div class="results-count-text">
              <strong>{{ filteredList.length.toLocaleString() }}</strong> rental properties found in Dubai
            </div>

            <div class="controls-right-group">
              <!-- View Mode Switch -->
              <div class="view-mode-toggle">
                <button
                  type="button"
                  class="btn-view-mode"
                  :class="{ active: viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <i class="fa-solid fa-border-all"></i> Grid
                </button>
                <button
                  type="button"
                  class="btn-view-mode"
                  :class="{ active: viewMode === 'map' }"
                  @click="router.push('/map')"
                >
                  <i class="fa-solid fa-map-location-dot"></i> Map
                </button>
              </div>

              <!-- Sort Select Dropdown -->
              <select v-model="sortBy" class="select-sort-dropdown">
                <option value="ai-match">Sort by: AI Match</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Listed</option>
              </select>
            </div>
          </div>

          <!-- Properties List - MapPage Style Dark Cards -->
          <div class="rent-props-list">
            <article
              v-for="prop in paginatedList"
              :key="prop.id || prop.title"
              class="rent-prop-card"
              @click="openDetails(prop)"
            >
              <!-- Thumbnail Image -->
              <div class="rent-card-thumb">
                <img :src="prop.image" :alt="prop.title" loading="lazy">
                <div class="rent-card-score-chip">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> {{ prop.matchScore }}% Match
                </div>
              </div>

              <!-- Card Details -->
              <div class="rent-card-details">
                <div class="rent-card-top-row">
                  <span class="rent-type-badge">{{ prop.type }}</span>
                  <button
                    type="button"
                    class="rent-fav-btn"
                    :class="{ saved: favoritesService.isSaved(prop.title || prop.id) }"
                    :title="favoritesService.isSaved(prop.title || prop.id) ? 'Remove from favorites' : 'Add to favorites'"
                    @click.stop="toggleFavorite(prop)"
                  >
                    <i :class="favoritesService.isSaved(prop.title || prop.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                  </button>
                </div>

                <h3 class="rent-card-title">{{ prop.title }}</h3>
                <p class="rent-card-location">
                  <i class="fa-solid fa-location-dot"></i> {{ prop.location }}
                </p>

                <div class="rent-card-price">{{ formatRentPrice(prop) }} <small>{{ formatRentPeriod(prop) }}</small></div>

                <div class="rent-card-specs">
                  <span><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                  <span><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                  <span><i class="fa-solid fa-ruler-combined"></i> {{ prop.sqft }} sqft</span>
                </div>

                <div class="rent-card-footer">
                  <button type="button" class="rent-btn-view" @click.stop="openDetails(prop)">
                    <span>View Details</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination Footer Bar -->
          <div class="explore-pagination-bar">
            <div class="pagination-info-text">
              Showing {{ filteredList.length ? ((currentPage - 1) * perPage) + 1 : 0 }}-{{ Math.min(currentPage * perPage, filteredList.length) }} of {{ filteredList.length.toLocaleString() }} rentals
            </div>

            <div class="pagination-controls-group">
              <button type="button" class="btn-page-num" :disabled="currentPage === 1" @click="currentPage--">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button
                v-for="p in [1, 2, 3, 4, 5]"
                :key="p"
                type="button"
                class="btn-page-num"
                :class="{ active: currentPage === p }"
                @click="currentPage = p"
              >
                {{ p }}
              </button>
              <span class="page-dots">...</span>
              <button type="button" class="btn-page-num" @click="currentPage = 356">356</button>
              <button type="button" class="btn-page-num" @click="currentPage++">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <select v-model="perPage" class="per-page-select">
              <option :value="8">Show 8 per page</option>
              <option :value="16">Show 16 per page</option>
              <option :value="24">Show 24 per page</option>
            </select>
          </div>

        </main>

      </div>
    </main>

    <!-- Saved Properties Drawer Modal -->
    <SavedPropertiesModal
      :is-open="isSavedModalOpen"
      @close="isSavedModalOpen = false"
      @open-property="openDetails"
    />

    <!-- Toast Notification -->
    <div class="toast-notification" :class="{ visible: toastVisible }">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { favoritesService } from '../services/favoritesService'
import SavedPropertiesModal from './SavedPropertiesModal.vue'
import propertyService from '../services/propertyService'

const router = useRouter()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)

const isSavedModalOpen = ref(false)
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer = null

const showToast = (msg) => {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

const userAvatarUrl = ref('/images/user_avatar.jpg')
const displayName = ref('Anas User')
const displayEmail = ref('anas.user@example.com')

const onAvatarError = (e) => {
  e.target.src = 'https://ui-avatars.com/api/?name=Anas+User&background=0284c7&color=fff'
}

const categoryPills = [
  { name: 'All Properties', count: '2,847' },
  { name: 'Apartments', count: '1,562' },
  { name: 'Villas', count: '486' },
  { name: 'Penthouses', count: '312' },
  { name: 'Townhouses', count: '298' },
  { name: 'Waterfront', count: '620' },
  { name: 'Off-Plan', count: '421' }
]

const selectedCategory = ref('All Properties')

const featureCheckboxes = [
  { name: 'Waterfront', count: '1,248' },
  { name: 'With Private Pool', count: '892' },
  { name: 'Sea View', count: '1,430' },
  { name: 'Near Metro', count: '756' },
  { name: 'Off-Plan', count: '512' },
  { name: 'Ready to Move', count: '2,341' },
  { name: 'Furnished', count: '1,102' }
]

const filterState = ref({
  keyword: '',
  location: 'All',
  propertyType: 'All',
  priceRange: 'Any',
  bedrooms: 'Any',
  lifestyle: 'Any',
  selectedFeatures: []
})

const aiSearchActive = ref(true)
const viewMode = ref('grid')
const sortBy = ref('ai-match')
const currentPage = ref(1)
const perPage = ref(8)
const isLoading = ref(false)

// 8 Exact Luxury Property Mock Data Items matching screenshot
const catalogProperties = ref([
  {
    id: 101,
    title: 'St. Regis Residences',
    location: 'Downtown Dubai',
    area: 'Downtown Dubai',
    price: 'AED 8,500,000',
    beds: 2,
    baths: 3,
    sqft: '1,850',
    type: 'Apartment',
    matchScore: 95,
    image: '/images/photo-1512917774080-9991f1c4c750.jfif',
    description: 'Ultra-luxury high-rise residences with panoramic views of Burj Khalifa and Dubai Opera.'
  },
  {
    id: 102,
    title: 'Palm Jumeirah Villa',
    location: 'Palm Jumeirah',
    area: 'Palm Jumeirah',
    price: 'AED 25,000,000',
    beds: 5,
    baths: 6,
    sqft: '7,200',
    type: 'Villa',
    matchScore: 92,
    image: '/images/photo-1600596542815-ffad4c1539a9.jfif',
    description: 'Signature beachfront villa with private pool, private beach access, and lush landscaping.'
  },
  {
    id: 103,
    title: 'Bluewaters Residences',
    location: 'Bluewaters Island',
    area: 'Bluewaters Island',
    price: 'AED 6,200,000',
    beds: 3,
    baths: 4,
    sqft: '2,100',
    type: 'Apartment',
    matchScore: 88,
    image: '/images/photo-1582719478250-c89cae4dc85b.avif',
    description: 'Modern island waterfront living directly adjacent to Ain Dubai wheel with resort amenities.'
  },
  {
    id: 104,
    title: "One Za'abeel Penthouse",
    location: "Za'abeel, Dubai",
    area: "Za'abeel",
    price: 'AED 45,000,000',
    beds: 4,
    baths: 5,
    sqft: '5,800',
    type: 'Penthouse',
    matchScore: 93,
    image: '/images/photo-1618221195710-dd6b41faaea6.jfif',
    description: 'Iconic cantilever penthouse featuring 360-degree skyline views and cantilever pool access.'
  },
  {
    id: 105,
    title: 'Marina Shores',
    location: 'Dubai Marina',
    area: 'Dubai Marina',
    price: 'AED 4,800,000',
    beds: 2,
    baths: 3,
    sqft: '1,650',
    type: 'Apartment',
    matchScore: 87,
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    description: 'Prime waterfront residential tower situated in the heart of Dubai Marina promenade.'
  },
  {
    id: 106,
    title: 'Address Beach Resort',
    location: 'JBR (Jumeirah Beach Residence)',
    area: 'JBR',
    price: 'AED 7,950,000',
    beds: 3,
    baths: 4,
    sqft: '2,300',
    type: 'Apartment',
    matchScore: 93,
    image: '/images/photo-1600210492486-724fe5c67fb0.jfif',
    description: 'Five-star hotel apartment with direct beach access and record-breaking rooftop infinity pool.'
  },
  {
    id: 107,
    title: 'Vida Residences',
    location: 'Dubai Creek Harbour',
    area: 'Dubai Creek Harbour',
    price: 'AED 3,200,000',
    beds: 2,
    baths: 2,
    sqft: '1,200',
    type: 'Apartment',
    matchScore: 85,
    image: '/images/photo-1613977257363-707ba9348227.jfif',
    description: 'Contemporary sanctuary overlooking the Dubai Creek Tower and Ras Al Khor Wildlife Sanctuary.'
  },
  {
    id: 108,
    title: 'Emirates Hills Villa',
    location: 'Emirates Hills',
    area: 'Emirates Hills',
    price: 'AED 28,000,000',
    beds: 6,
    baths: 7,
    sqft: '8,500',
    type: 'Villa',
    matchScore: 91,
    image: '/images/photo-1600585154340-be6161a56a0c.avif',
    description: 'Palatial estate mansion surrounded by golf course greens in Dubai’s most exclusive enclave.'
  }
])

// Rental-only fallback shown when the API is unavailable.
const fallbackYearlyPrices = [480000, 1200000, 390000, 1800000, 260000, 420000, 210000, 1500000]
catalogProperties.value = catalogProperties.value.map((property, index) => ({
  ...property,
  price: fallbackYearlyPrices[index],
  rent_frequency: 'yearly',
  listingPurpose: 'rent',
  isForRent: true
}))

const isRental = (property) => {
  const purpose = String(property.listingPurpose || property.purpose || property.listing_type || '').toLowerCase()
  return property.isForRent === true || purpose.includes('rent') || Boolean(property.rent_frequency)
}

const toCatalogProperty = (property) => ({
  ...property,
  location: property.location || property.area || 'Dubai, UAE',
  price: Number(property.price) || 0,
  sqft: property.area_sqft ? Number(property.area_sqft).toLocaleString() : (property.size || 'N/A'),
  matchScore: property.matchScore || property.aiMatch || 88
})

const formatRentPrice = (property) => {
  if (typeof property.price === 'string' && property.price.toUpperCase().includes('AED')) return property.price
  return `AED ${(Number(property.price) || 0).toLocaleString()}`
}

const formatRentPeriod = (property) => {
  const period = property.rent_frequency || property.period || 'yearly'
  return String(period).startsWith('/') ? period : `/${period}`
}

const loadRentalProperties = async () => {
  isLoading.value = true
  try {
    const response = await propertyService.getProperties({ purpose: 'rent', listing_type: 'rent', per_page: 100 })
    const rentals = (response.data || []).filter(isRental).map(toCatalogProperty)
    if (rentals.length) catalogProperties.value = rentals
  } catch (error) {
    console.warn('Unable to load rental properties; showing rental fallback listings.', error)
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (catName) => {
  selectedCategory.value = catName
}

const resetFilters = () => {
  filterState.value = {
    keyword: '',
    location: 'All',
    propertyType: 'All',
    priceRange: 'Any',
    bedrooms: 'Any',
    lifestyle: 'Any',
    selectedFeatures: []
  }
  selectedCategory.value = 'All Properties'
  sortBy.value = 'ai-match'
}

const applyFilters = () => {
  showToast('Filters applied to catalog!')
}

const filteredList = computed(() => {
  let list = [...catalogProperties.value]

  if (selectedCategory.value !== 'All Properties') {
    const cat = selectedCategory.value.toLowerCase()
    if (cat.includes('apartment')) list = list.filter(p => p.type === 'Apartment')
    else if (cat.includes('villa')) list = list.filter(p => p.type === 'Villa')
    else if (cat.includes('penthouse')) list = list.filter(p => p.type === 'Penthouse')
    else if (cat.includes('townhouse')) list = list.filter(p => p.type === 'Townhouse')
  }

  if (filterState.value.location !== 'All') {
    list = list.filter(p => p.location.includes(filterState.value.location))
  }

  if (filterState.value.keyword.trim()) {
    const kw = filterState.value.keyword.toLowerCase().trim()
    list = list.filter(p => `${p.title} ${p.location} ${p.type}`.toLowerCase().includes(kw))
  }

  return list
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredList.value.slice(start, start + perPage.value)
})

const toggleFavorite = (prop) => {
  const isSaved = favoritesService.toggleSave(prop)
  if (isSaved) {
    showToast(`Added "${prop.title}" to favorites ❤️`)
  } else {
    showToast(`Removed "${prop.title}" from favorites`)
  }
}

const openDetails = (prop) => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(prop))
  router.push({ name: 'PropertyDetails', params: { id: prop.id || encodeURIComponent(prop.slug || prop.title) } })
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadRentalProperties()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ============================================================
   RENT PAGE - MAP-STYLE DARK PROPERTY CARDS
   ============================================================ */

/* Properties List Container */
.rent-props-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Individual Card */
.rent-prop-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0;
  background: rgba(15, 25, 50, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.rent-prop-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: transparent;
  transition: background-color 0.25s ease;
  border-radius: 14px 0 0 14px;
}

.rent-prop-card:hover {
  border-color: rgba(0, 210, 255, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 210, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.4);
  background: rgba(15, 25, 55, 0.9);
}

.rent-prop-card:hover::before {
  background: linear-gradient(180deg, #00d2ff, #2563eb);
}

/* Thumbnail */
.rent-card-thumb {
  position: relative;
  width: 160px;
  height: 130px;
  overflow: hidden;
  flex-shrink: 0;
}

.rent-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.45s ease;
}

.rent-prop-card:hover .rent-card-thumb img {
  transform: scale(1.08);
}

/* AI Score Chip */
.rent-card-score-chip {
  position: absolute;
  bottom: 6px;
  left: 6px;
  background: rgba(0, 210, 255, 0.15);
  border: 1px solid rgba(0, 210, 255, 0.4);
  color: #00d2ff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 3px;
  backdrop-filter: blur(8px);
}

/* Card Details */
.rent-card-details {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  gap: 4px;
}

/* Top Row: Badge + Fav Button */
.rent-card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.rent-type-badge {
  background: rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(37, 99, 235, 0.3);
  color: #60a5fa;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.rent-fav-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.rent-fav-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
  transform: scale(1.1);
}

.rent-fav-btn.saved {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
}

/* Title */
.rent-card-title {
  font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  line-height: 1.3;
}

/* Location */
.rent-card-location {
  font-size: 0.72rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rent-card-location i {
  color: #00d2ff;
  font-size: 0.7rem;
}

/* Price */
.rent-card-price {
  font-family: 'Outfit', sans-serif;
  font-size: 1.0rem;
  font-weight: 800;
  color: #00d2ff;
  text-shadow: 0 0 12px rgba(0, 210, 255, 0.25);
}

/* Specs Row */
.rent-card-specs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.68rem;
  color: #94a3b8;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.rent-card-specs span {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rent-card-specs i {
  color: #38bdf8;
  font-size: 0.68rem;
}

/* Footer */
.rent-card-footer {
  display: flex;
  align-items: center;
}

.rent-btn-view {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.15), rgba(37, 99, 235, 0.15));
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #00d2ff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rent-btn-view:hover {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.25), rgba(37, 99, 235, 0.25));
  border-color: #00d2ff;
  box-shadow: 0 4px 12px rgba(0, 210, 255, 0.2);
}

.rent-btn-view i {
  font-size: 0.65rem;
  transition: transform 0.2s ease;
}

.rent-btn-view:hover i {
  transform: translateX(3px);
}
</style>
