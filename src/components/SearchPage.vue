<template>
  <div class="search-page-root" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">

    <!-- ==================== HERO / SEARCH BAR ==================== -->
    <section class="search-hero-section">
      <div class="search-hero-bg-overlay"></div>

      <!-- Animated particles -->
      <div class="hero-particles">
        <span v-for="i in 8" :key="i" :class="`particle particle-${i}`"></span>
      </div>

      <div class="search-hero-inner">
        <!-- Badge -->
        <div class="search-hero-badge">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>{{ t('searchPageBadge') }}</span>
        </div>

        <!-- Title -->
        <h1 class="search-hero-title">
          <span>{{ t('searchHeroTitle1') }}</span>
          <span class="search-hero-title-gradient"> {{ t('searchHeroTitle2') }}</span>
        </h1>
        <p class="search-hero-subtitle">{{ t('searchHeroSubtitle') }}</p>

        <!-- ===== MAIN SEARCH BAR ===== -->
        <div class="main-search-bar-wrap">
          <form class="main-search-bar" @submit.prevent="runSearch">
            <!-- Text input -->
            <div class="msb-field msb-text-field">
              <i class="fa-solid fa-magnifying-glass msb-icon"></i>
              <input
                id="search-query-input"
                v-model="searchQuery"
                type="text"
                :placeholder="t('searchHeroInputPlaceholder')"
                class="msb-input"
                autocomplete="off"
                @input="onQueryInput"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="msb-clear-btn"
                @click="clearSearch"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <!-- Purpose -->
            <div class="msb-field msb-divider-field">
              <label class="msb-label">
                <i class="fa-solid fa-tag"></i> {{ t('purpose') }}
              </label>
              <div class="msb-select-wrap">
                <select v-model="filters.purpose" class="msb-select">
                  <option value="all">{{ t('allPurpose') }}</option>
                  <option value="sale">{{ t('forSale') }}</option>
                  <option value="rent">{{ t('forRent') }}</option>
                </select>
                <i class="fa-solid fa-chevron-down msb-chevron"></i>
              </div>
            </div>

            <!-- Property Type -->
            <div class="msb-field msb-divider-field">
              <label class="msb-label">
                <i class="fa-solid fa-building"></i> {{ t('propertyType') }}
              </label>
              <div class="msb-select-wrap">
                <select v-model="filters.type" class="msb-select">
                  <option value="all">{{ t('allTypes') }}</option>
                  <option value="Apartment">{{ t('apartment') }}</option>
                  <option value="Villa">{{ t('villa') }}</option>
                  <option value="Penthouse">{{ t('penthouse') }}</option>
                  <option value="Townhouse">{{ t('townhouse') }}</option>
                </select>
                <i class="fa-solid fa-chevron-down msb-chevron"></i>
              </div>
            </div>

            <!-- Budget -->
            <div class="msb-field msb-divider-field">
              <label class="msb-label">
                <i class="fa-solid fa-wallet"></i> {{ t('budgetAED') }}
              </label>
              <div class="msb-select-wrap">
                <select v-model="filters.priceRange" class="msb-select">
                  <option value="any">{{ t('anyBudget') }}</option>
                  <option value="under-2m">{{ isRtl ? 'أقل من 2 مليون' : 'Under AED 2M' }}</option>
                  <option value="2m-5m">{{ isRtl ? '2 - 5 مليون' : 'AED 2M – 5M' }}</option>
                  <option value="5m-10m">{{ isRtl ? '5 - 10 مليون' : 'AED 5M – 10M' }}</option>
                  <option value="10m-plus">{{ isRtl ? 'أكثر من 10 مليون' : 'AED 10M+' }}</option>
                </select>
                <i class="fa-solid fa-chevron-down msb-chevron"></i>
              </div>
            </div>

            <!-- Search Button -->
            <button type="submit" class="msb-search-btn" :disabled="isLoading">
              <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-magnifying-glass"></i>
              <span>{{ t('search') }}</span>
            </button>
          </form>
        </div>

        <!-- Quick Suggestion Tags -->
        <div class="search-quick-tags">
          <span class="quick-tags-label">{{ t('popularSearches') }}:</span>
          <button
            v-for="tag in quickTags"
            :key="tag.query"
            type="button"
            class="quick-tag-btn"
            @click="applyQuickTag(tag)"
          >
            <i :class="tag.icon"></i>
            <span>{{ tag.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ==================== MAIN BODY ==================== -->
    <main class="search-main">

      <!-- ===== ADVANCED FILTERS STRIP ===== -->
      <div class="search-filters-strip">
        <div class="filters-strip-inner">

          <!-- Active filters summary -->
          <div class="active-filter-chips" v-if="hasActiveFilters">
            <span class="chips-label">{{ t('activeFilters') }}:</span>
            <span v-if="filters.purpose !== 'all'" class="filter-chip" @click="filters.purpose = 'all'">
              {{ purposeLabel }} <i class="fa-solid fa-xmark"></i>
            </span>
            <span v-if="filters.type !== 'all'" class="filter-chip" @click="filters.type = 'all'">
              {{ filters.type }} <i class="fa-solid fa-xmark"></i>
            </span>
            <span v-if="filters.priceRange !== 'any'" class="filter-chip" @click="filters.priceRange = 'any'">
              {{ priceLabel }} <i class="fa-solid fa-xmark"></i>
            </span>
            <span v-if="filters.bedrooms !== 'any'" class="filter-chip" @click="filters.bedrooms = 'any'">
              {{ filters.bedrooms }} {{ t('beds') }} <i class="fa-solid fa-xmark"></i>
            </span>
            <button type="button" class="clear-all-btn" @click="clearAllFilters">
              {{ t('resetFilters') }}
            </button>
          </div>

          <div class="filters-right-group">
            <!-- Bedrooms filter -->
            <div class="strip-filter-field">
              <label><i class="fa-solid fa-bed"></i> {{ t('bedrooms') }}</label>
              <div class="strip-select-wrap">
                <select v-model="filters.bedrooms" class="strip-select">
                  <option value="any">{{ t('anyBedroomCount') }}</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Location filter -->
            <div class="strip-filter-field">
              <label><i class="fa-solid fa-location-dot"></i> {{ t('location') }}</label>
              <div class="strip-select-wrap">
                <select v-model="filters.location" class="strip-select">
                  <option value="all">{{ t('searchAreasPlaceholder') }}</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Arabian Ranches">Arabian Ranches</option>
                  <option value="JVC">JVC</option>
                  <option value="Business Bay">Business Bay</option>
                  <option value="Dubai Harbour">Dubai Harbour</option>
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- Sort -->
            <div class="strip-filter-field">
              <label><i class="fa-solid fa-arrow-up-wide-short"></i> {{ t('sortBy') }}</label>
              <div class="strip-select-wrap">
                <select v-model="sortBy" class="strip-select">
                  <option value="recommended">{{ t('sortByRecommended') }}</option>
                  <option value="ai-match">{{ t('sortByAIMatch') }}</option>
                  <option value="price-asc">{{ t('sortByPriceAsc') }}</option>
                  <option value="price-desc">{{ t('sortByPriceDesc') }}</option>
                </select>
                <i class="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <!-- View mode -->
            <div class="view-mode-toggle">
              <button
                type="button"
                class="view-btn"
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
                :title="t('gridView')"
              >
                <i class="fa-solid fa-border-all"></i>
              </button>
              <button
                type="button"
                class="view-btn"
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                :title="t('listView')"
              >
                <i class="fa-solid fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== RESULTS AREA ===== -->
      <div class="search-results-wrapper">

        <!-- Results Header -->
        <div class="results-header">
          <div class="results-count-wrap">
            <template v-if="isLoading">
              <div class="results-skeleton-bar"></div>
            </template>
            <template v-else>
              <span class="results-count-num">{{ displayProperties.length }}</span>
              <span class="results-count-label">{{ t('resultsFound') }}</span>
              <span v-if="searchQuery" class="results-query-label">
                {{ isRtl ? 'لـ' : 'for' }} "<strong>{{ searchQuery }}</strong>"
              </span>
            </template>
          </div>

          <!-- AI Search indicator -->
          <div v-if="isAiSearch && !isLoading" class="ai-search-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>{{ t('aiPoweredResults') }}</span>
          </div>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="isLoading" class="cards-skeleton-grid" :class="viewMode">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="sk-img"></div>
            <div class="sk-body">
              <div class="sk-line sk-title"></div>
              <div class="sk-line sk-loc"></div>
              <div class="sk-line sk-price"></div>
              <div class="sk-specs">
                <div class="sk-spec"></div>
                <div class="sk-spec"></div>
                <div class="sk-spec"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="displayProperties.length === 0 && hasSearched" class="search-empty-state">
          <div class="empty-icon-wrap">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h2>{{ t('noResultsFound') }}</h2>
          <p>{{ t('noResultsDesc') }}</p>
          <button type="button" class="btn-reset-search" @click="clearAllFilters">
            <i class="fa-solid fa-rotate-left"></i>
            {{ t('resetFilters') }}
          </button>
        </div>

        <!-- Initial empty (no search yet) -->
        <div v-else-if="displayProperties.length === 0 && !hasSearched" class="search-initial-state">
          <div class="initial-state-content">
            <div class="initial-icon-ring">
              <i class="fa-solid fa-house-circle-check"></i>
            </div>
            <h2>{{ t('searchInitialTitle') }}</h2>
            <p>{{ t('searchInitialDesc') }}</p>
            <!-- Trending categories -->
            <div class="trending-categories">
              <h3>{{ t('trendingSearches') }}</h3>
              <div class="trending-grid">
                <button
                  v-for="cat in trendingCategories"
                  :key="cat.key"
                  type="button"
                  class="trending-card"
                  @click="applyTrending(cat)"
                >
                  <div class="trending-icon">
                    <i :class="cat.icon"></i>
                  </div>
                  <div class="trending-info">
                    <span class="trending-name">{{ cat.label }}</span>
                    <span class="trending-count">{{ cat.count }} {{ t('propertiesAvailable') }}</span>
                  </div>
                  <i class="fa-solid trending-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Grid / List -->
        <div
          v-else
          class="search-results-grid"
          :class="[viewMode, { 'is-loading': isLoading }]"
        >
          <article
            v-for="prop in displayProperties"
            :key="prop.id"
            class="search-prop-card"
            :class="{ 'list-card': viewMode === 'list' }"
            @click="openDetails(prop)"
          >
            <!-- Image -->
            <div class="card-img-wrap">
              <img :src="prop.image" :alt="prop.title" loading="lazy" @error="onImgError" />

              <!-- AI Match Badge -->
              <div class="badge-ai">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>{{ t('aiMatch') }} {{ prop.matchScore || prop.aiMatch }}%</span>
              </div>

              <!-- Favorite -->
              <button
                type="button"
                class="btn-fav"
                :class="{ saved: favoritesService.isSaved(prop.title || prop.id) }"
                @click.stop="toggleFavorite(prop)"
                :title="t('save')"
              >
                <i :class="favoritesService.isSaved(prop.title || prop.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              </button>

              <!-- Status / Type chip -->
              <div class="badge-purpose" :class="prop.isForRent ? 'rent' : 'sale'">
                <span>{{ prop.isForRent ? t('forRent') : t('forSale') }}</span>
              </div>

              <!-- Type chip -->
              <div class="badge-type">{{ prop.type }}</div>
            </div>

            <!-- Body -->
            <div class="card-body">
              <h3 class="card-title">{{ prop.title }}</h3>

              <p class="card-location">
                <i class="fa-solid fa-location-dot"></i>
                {{ prop.location || prop.area }}
              </p>

              <div class="card-price">
                <span class="price-amount">{{ formatPrice(prop.price) }}</span>
                <span v-if="prop.isForRent" class="price-period">{{ prop.period }}</span>
              </div>

              <div class="card-specs">
                <span class="spec-chip">
                  <i class="fa-solid fa-bed"></i> {{ prop.beds }} {{ t('beds') }}
                </span>
                <span class="spec-chip">
                  <i class="fa-solid fa-bath"></i> {{ prop.baths }} {{ t('baths') }}
                </span>
                <span class="spec-chip">
                  <i class="fa-solid fa-vector-square"></i> {{ prop.size }} {{ t('sqft') }}
                </span>
              </div>

              <!-- Tags -->
              <div class="card-tags" v-if="prop.tags && prop.tags.length">
                <span v-for="tag in prop.tags.slice(0, 3)" :key="tag" class="tag-chip">{{ tag }}</span>
              </div>

              <button type="button" class="btn-view-details" @click.stop="openDetails(prop)">
                <span>{{ t('viewDetails') }}</span>
                <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
              </button>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div v-if="displayProperties.length > 0 && canLoadMore && !isLoading" class="load-more-wrap">
          <button type="button" class="btn-load-more" @click="loadMore" :disabled="isLoadingMore">
            <i v-if="isLoadingMore" class="fa-solid fa-circle-notch fa-spin"></i>
            <i v-else class="fa-solid fa-layer-group"></i>
            {{ isLoadingMore ? t('loading') : t('loadMore') }}
          </button>
        </div>
      </div>

    </main>

    <!-- Property Details Modal -->
    <PropertyDetailsModal
      v-if="isDetailsModalOpen"
      :property="selectedProp"
      :is-open="isDetailsModalOpen"
      @close="isDetailsModalOpen = false"
      @open-property="openDetails"
    />

    <!-- Toast -->
    <div class="sp-toast" :class="{ visible: toastVisible }">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ toastMessage }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'
import { propertyService, DEFAULT_PROPERTIES } from '../services/propertyService'
import { favoritesService } from '../services/favoritesService'
import { authService } from '../services/authService'
import PropertyDetailsModal from './PropertyDetailsModal.vue'

// ======= Composables =======
const { t, isRtl, isDark, theme: currentTheme, locProps } = useThemeAndLanguage()
const router = useRouter()
const route = useRoute()

// ======= State =======
const searchQuery = ref('')
const isLoading = ref(false)
const isLoadingMore = ref(false)
const hasSearched = ref(false)
const isAiSearch = ref(false)
const allResults = ref([])
const page = ref(1)
const perPage = 12
const canLoadMore = ref(false)
const viewMode = ref('grid')
const sortBy = ref('recommended')

const selectedProp = ref(null)
const isDetailsModalOpen = ref(false)

const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer = null

const filters = ref({
  purpose: 'all',
  type: 'all',
  priceRange: 'any',
  bedrooms: 'any',
  location: 'all'
})

// ======= Quick tags =======
const quickTags = computed(() => [
  { label: t('villa'), query: 'villa', icon: 'fa-solid fa-house-chimney-window', type: 'Villa' },
  { label: t('apartment'), query: 'apartment', icon: 'fa-solid fa-building', type: 'Apartment' },
  { label: t('penthouse'), query: 'penthouse', icon: 'fa-solid fa-crown', type: 'Penthouse' },
  { label: isRtl.value ? 'مع مسبح' : 'Private Pool', query: 'private pool', icon: 'fa-solid fa-water', type: 'all' },
  { label: isRtl.value ? 'نخلة جميرا' : 'Palm Jumeirah', query: 'Palm Jumeirah', icon: 'fa-solid fa-umbrella-beach', location: 'Palm Jumeirah' },
  { label: isRtl.value ? 'مارينا' : 'Dubai Marina', query: 'Dubai Marina', icon: 'fa-solid fa-sailboat', location: 'Dubai Marina' }
])

const trendingCategories = computed(() => [
  { key: 'villa', label: t('villas'), icon: 'fa-solid fa-house-chimney-window', count: '320+', type: 'Villa' },
  { key: 'apartment', label: t('apartments'), icon: 'fa-solid fa-building', count: '680+', type: 'Apartment' },
  { key: 'penthouse', label: t('penthouses'), icon: 'fa-solid fa-crown', count: '45+', type: 'Penthouse' },
  { key: 'waterfront', label: t('waterfront'), icon: 'fa-solid fa-water', count: '150+', query: 'waterfront' },
  { key: 'offplan', label: t('offPlan'), icon: 'fa-solid fa-chart-column', count: '200+', query: 'off-plan' },
  { key: 'luxury', label: isRtl.value ? 'فاخر' : 'Luxury', icon: 'fa-solid fa-gem', count: '90+', query: 'luxury' }
])

// ======= Computed =======
const hasActiveFilters = computed(() =>
  filters.value.purpose !== 'all' ||
  filters.value.type !== 'all' ||
  filters.value.priceRange !== 'any' ||
  filters.value.bedrooms !== 'any' ||
  filters.value.location !== 'all'
)

const purposeLabel = computed(() => {
  if (filters.value.purpose === 'sale') return t('forSale')
  if (filters.value.purpose === 'rent') return t('forRent')
  return ''
})

const priceLabel = computed(() => {
  const map = {
    'under-2m': isRtl.value ? 'أقل من 2 مليون' : '< AED 2M',
    '2m-5m': isRtl.value ? '2 - 5 مليون' : 'AED 2M-5M',
    '5m-10m': isRtl.value ? '5 - 10 مليون' : 'AED 5M-10M',
    '10m-plus': isRtl.value ? 'أكثر من 10 مليون' : 'AED 10M+'
  }
  return map[filters.value.priceRange] || ''
})

const displayProperties = computed(() => {
  let list = [...allResults.value]

  // Purpose filter
  if (filters.value.purpose === 'sale') list = list.filter(p => !p.isForRent)
  else if (filters.value.purpose === 'rent') list = list.filter(p => p.isForRent)

  // Type filter
  if (filters.value.type !== 'all') {
    list = list.filter(p => p.type === filters.value.type)
  }

  // Location filter
  if (filters.value.location !== 'all') {
    const loc = filters.value.location.toLowerCase()
    list = list.filter(p => (p.location || p.area || '').toLowerCase().includes(loc))
  }

  // Bedrooms filter
  if (filters.value.bedrooms !== 'any') {
    const beds = filters.value.bedrooms
    if (beds === '5+') {
      list = list.filter(p => Number(p.beds) >= 5)
    } else {
      list = list.filter(p => Number(p.beds) === Number(beds))
    }
  }

  // Price filter
  if (filters.value.priceRange !== 'any') {
    list = list.filter(p => {
      const price = Number(p.price) || 0
      if (filters.value.priceRange === 'under-2m') return price < 2000000
      if (filters.value.priceRange === '2m-5m') return price >= 2000000 && price < 5000000
      if (filters.value.priceRange === '5m-10m') return price >= 5000000 && price < 10000000
      if (filters.value.priceRange === '10m-plus') return price >= 10000000
      return true
    })
  }

  // Sort
  if (sortBy.value === 'price-asc') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'ai-match') list.sort((a, b) => (b.matchScore || b.aiMatch || 0) - (a.matchScore || a.aiMatch || 0))

  return locProps(list)
})

// ======= Methods =======
const showToast = (msg) => {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 3000)
}

const formatPrice = (price) => {
  const num = Number(price) || 0
  if (num >= 1000000) {
    const m = (num / 1000000).toFixed(1)
    return isRtl.value ? `${m} مليون درهم` : `AED ${m}M`
  }
  return isRtl.value ? `${num.toLocaleString()} درهم` : `AED ${num.toLocaleString()}`
}

const onImgError = (e) => {
  e.target.src = '/images/photo-1512917774080-9991f1c4c750.jfif'
}

const runSearch = async () => {
  isLoading.value = true
  hasSearched.value = true
  isAiSearch.value = false
  page.value = 1

  try {
    const query = searchQuery.value.trim()

    if (query) {
      // Use AI contextual search
      isAiSearch.value = true
      const result = await propertyService.searchWithAi(query)
      if (result.success && result.data.length > 0) {
        allResults.value = result.data
      } else {
        // Fall back to all properties
        const res = await propertyService.getProperties({ per_page: 50 })
        allResults.value = res.data || DEFAULT_PROPERTIES
      }
    } else {
      // No text query — load all properties
      const res = await propertyService.getProperties({ per_page: 50 })
      allResults.value = res.data || DEFAULT_PROPERTIES
    }

    canLoadMore.value = allResults.value.length >= 50
  } catch (err) {
    console.warn('Search error:', err)
    allResults.value = DEFAULT_PROPERTIES
    canLoadMore.value = false
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  page.value++
  try {
    const res = await propertyService.getProperties({ per_page: perPage, page: page.value })
    const more = res.data || []
    allResults.value = [...allResults.value, ...more]
    if (more.length < perPage) canLoadMore.value = false
  } catch {
    canLoadMore.value = false
  } finally {
    isLoadingMore.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  allResults.value = []
  hasSearched.value = false
  isAiSearch.value = false
  canLoadMore.value = false
}

const clearAllFilters = () => {
  filters.value = { purpose: 'all', type: 'all', priceRange: 'any', bedrooms: 'any', location: 'all' }
  sortBy.value = 'recommended'
  clearSearch()
}

let debounceTimer = null
const onQueryInput = () => {
  // auto-search after 600ms of no typing
  if (debounceTimer) clearTimeout(debounceTimer)
  if (searchQuery.value.trim().length >= 2) {
    debounceTimer = setTimeout(() => runSearch(), 600)
  }
}

const applyQuickTag = (tag) => {
  searchQuery.value = tag.query
  if (tag.type && tag.type !== 'all') filters.value.type = tag.type
  if (tag.location) filters.value.location = tag.location
  runSearch()
}

const applyTrending = (cat) => {
  if (cat.type) filters.value.type = cat.type
  if (cat.query) searchQuery.value = cat.query
  runSearch()
}

const openDetails = (prop) => {
  selectedProp.value = prop
  isDetailsModalOpen.value = true
}

const toggleFavorite = (prop) => {
  const isSaved = favoritesService.isSaved(prop.title || prop.id)
  if (isSaved) {
    favoritesService.removeProperty(prop.title || prop.id)
    showToast(isRtl.value ? 'تمت الإزالة من المفضلة' : 'Removed from favorites')
  } else {
    favoritesService.saveProperty(prop)
    showToast(isRtl.value ? 'تمت الإضافة إلى المفضلة' : 'Added to favorites')
  }
}

// ======= Lifecycle =======
onMounted(async () => {
  // Read query from URL if provided
  const q = route.query.q || route.query.query || ''
  const type = route.query.type || ''
  const purpose = route.query.purpose || ''
  const location = route.query.location || ''

  if (q) searchQuery.value = q
  if (type) filters.value.type = type
  if (purpose) filters.value.purpose = purpose
  if (location) filters.value.location = location

  if (q || type || purpose || location) {
    await runSearch()
  } else {
    // Load initial set
    try {
      isLoading.value = true
      const res = await propertyService.getProperties({ per_page: perPage })
      allResults.value = res.data || DEFAULT_PROPERTIES
      hasSearched.value = false
      canLoadMore.value = (res.data || []).length >= perPage
    } catch {
      allResults.value = DEFAULT_PROPERTIES
    } finally {
      isLoading.value = false
    }
  }
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
/* ========== ROOT ========== */
.search-page-root {
  min-height: 100vh;
  background: var(--bg-base, #070d19);
  color: var(--text-primary, #f0f6ff);
  font-family: 'Plus Jakarta Sans', 'Cairo', sans-serif;
}

/* ========== HERO ========== */
.search-hero-section {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #070d19 0%, #0a1628 40%, #070d19 100%);
  padding: 80px 24px 60px;
}

[data-theme="light"] .search-hero-section {
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 40%, #f0f7ff 100%);
}

.search-hero-bg-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 20% 50%, rgba(0, 210, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 70% at 80% 30%, rgba(139, 92, 246, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

/* Particles */
.hero-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(0, 210, 255, 0.5);
  animation: particleFloat 6s ease-in-out infinite;
}
.particle-1 { top: 15%; left: 10%; animation-delay: 0s; }
.particle-2 { top: 70%; left: 20%; animation-delay: 1s; width: 4px; height: 4px; }
.particle-3 { top: 30%; left: 80%; animation-delay: 2s; }
.particle-4 { top: 80%; left: 75%; animation-delay: 0.5s; }
.particle-5 { top: 50%; left: 45%; animation-delay: 1.5s; background: rgba(139, 92, 246, 0.5); }
.particle-6 { top: 20%; left: 60%; animation-delay: 3s; }
.particle-7 { top: 60%; left: 5%; animation-delay: 2.5s; }
.particle-8 { top: 40%; left: 90%; animation-delay: 0.8s; background: rgba(245, 158, 11, 0.4); }

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
  50% { transform: translateY(-20px) scale(1.3); opacity: 1; }
}

.search-hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 900px;
  text-align: center;
}

.search-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #00d2ff;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
}

[data-theme="light"] .search-hero-badge {
  background: rgba(2, 132, 199, 0.1);
  border-color: rgba(2, 132, 199, 0.3);
  color: #0284c7;
}

.search-hero-title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 16px;
  color: #f0f6ff;
}

[data-theme="light"] .search-hero-title { color: #0f172a; }

.search-hero-title-gradient {
  background: linear-gradient(135deg, #00d2ff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-hero-subtitle {
  font-size: 1rem;
  color: rgba(176, 196, 222, 0.8);
  margin: 0 0 36px;
  max-width: 600px;
  margin-inline: auto;
}

[data-theme="light"] .search-hero-subtitle { color: #475569; }

/* Main Search Bar */
.main-search-bar-wrap {
  width: 100%;
  max-width: 860px;
  margin-inline: auto;
  margin-bottom: 24px;
}

.main-search-bar {
  display: flex;
  align-items: stretch;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: visible;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 210, 255, 0.05);
  transition: box-shadow 0.3s;
}

.main-search-bar:focus-within {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(0, 210, 255, 0.3);
  border-color: rgba(0, 210, 255, 0.3);
}

[data-theme="light"] .main-search-bar {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.1);
}

[data-theme="light"] .main-search-bar:focus-within {
  border-color: #0284c7;
  box-shadow: 0 4px 24px rgba(15, 23, 42, 0.12), 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.msb-field {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  gap: 4px;
  position: relative;
}

.msb-text-field {
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.msb-divider-field {
  border-inline-start: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 140px;
}

[data-theme="light"] .msb-divider-field { border-color: #e2e8f0; }

.msb-icon { color: #00d2ff; font-size: 15px; flex-shrink: 0; }
[data-theme="light"] .msb-icon { color: #0284c7; }

.msb-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 15px;
  color: #f0f6ff;
  font-family: inherit;
  min-width: 0;
}

[data-theme="light"] .msb-input { color: #0f172a; }
.msb-input::placeholder { color: rgba(176, 196, 222, 0.5); }
[data-theme="light"] .msb-input::placeholder { color: #94a3b8; }

.msb-clear-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.2s;
  flex-shrink: 0;
}

.msb-clear-btn:hover { background: rgba(255, 255, 255, 0.2); color: #f0f6ff; }

.msb-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #00d2ff;
  display: flex;
  align-items: center;
  gap: 5px;
}

[data-theme="light"] .msb-label { color: #0284c7; }

.msb-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.msb-select {
  background: none;
  border: none;
  outline: none;
  color: #f0f6ff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  padding-inline-end: 18px;
  appearance: none;
  -webkit-appearance: none;
}

[data-theme="light"] .msb-select { color: #1e293b; }
.msb-select option { background: #0d1b35; color: #f0f6ff; }
[data-theme="light"] .msb-select option { background: #ffffff; color: #1e293b; }

.msb-chevron {
  position: absolute;
  inset-inline-end: 0;
  font-size: 10px;
  color: #64748b;
  pointer-events: none;
}

.msb-search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 28px;
  background: linear-gradient(135deg, #00b4d8, #7c3aed);
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
  border-radius: 0 14px 14px 0;
  white-space: nowrap;
  flex-shrink: 0;
}

[dir="rtl"] .msb-search-btn { border-radius: 14px 0 0 14px; }

.msb-search-btn:hover {
  background: linear-gradient(135deg, #00d2ff, #8b5cf6);
  transform: translateX(2px);
}

[dir="rtl"] .msb-search-btn:hover { transform: translateX(-2px); }

.msb-search-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

/* Quick Tags */
.search-quick-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.quick-tags-label {
  font-size: 12px;
  color: rgba(176, 196, 222, 0.6);
}

[data-theme="light"] .quick-tags-label { color: #64748b; }

.quick-tag-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  color: rgba(176, 196, 222, 0.85);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.quick-tag-btn:hover {
  background: rgba(0, 210, 255, 0.1);
  border-color: rgba(0, 210, 255, 0.3);
  color: #00d2ff;
}

[data-theme="light"] .quick-tag-btn {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
}

[data-theme="light"] .quick-tag-btn:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0284c7;
}

/* ========== MAIN ========== */
.search-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* ========== FILTERS STRIP ========== */
.search-filters-strip {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  position: sticky;
  top: 70px;
  z-index: 50;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

[data-theme="light"] .search-filters-strip {
  background: rgba(255, 255, 255, 0.95);
  border-bottom-color: #e2e8f0;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
}

.filters-strip-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.active-filter-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chips-label {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 100px;
  font-size: 12px;
  color: #00d2ff;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover { background: rgba(0, 210, 255, 0.18); }

[data-theme="light"] .filter-chip {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0284c7;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.clear-all-btn:hover { background: rgba(239, 68, 68, 0.1); }

.filters-right-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-inline-start: auto;
}

.strip-filter-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.strip-filter-field label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.strip-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.strip-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #f0f6ff;
  font-size: 12px;
  padding: 5px 24px 5px 10px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

.strip-select:focus { border-color: rgba(0, 210, 255, 0.4); }

[data-theme="light"] .strip-select {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
}

.strip-select option { background: #0d1b35; color: #f0f6ff; }
[data-theme="light"] .strip-select option { background: #fff; color: #1e293b; }

.strip-select-wrap i {
  position: absolute;
  inset-inline-end: 8px;
  font-size: 9px;
  color: #64748b;
  pointer-events: none;
}

.view-mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

[data-theme="light"] .view-mode-toggle { background: #f8fafc; border-color: #e2e8f0; }

.view-btn {
  background: none;
  border: none;
  color: #64748b;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.view-btn.active,
.view-btn:hover { background: rgba(0, 210, 255, 0.1); color: #00d2ff; }

[data-theme="light"] .view-btn.active,
[data-theme="light"] .view-btn:hover { background: #e0f2fe; color: #0284c7; }

/* ========== RESULTS WRAPPER ========== */
.search-results-wrapper {
  padding-top: 28px;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}

.results-count-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.results-count-num {
  font-size: 1.5rem;
  font-weight: 800;
  color: #00d2ff;
}

[data-theme="light"] .results-count-num { color: #0284c7; }

.results-count-label {
  font-size: 14px;
  color: #64748b;
}

.results-query-label {
  font-size: 14px;
  color: rgba(176, 196, 222, 0.7);
}

[data-theme="light"] .results-query-label { color: #64748b; }
.results-query-label strong { color: #f0f6ff; }
[data-theme="light"] .results-query-label strong { color: #0f172a; }

.results-skeleton-bar {
  width: 160px;
  height: 24px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  border-radius: 8px;
}

.ai-search-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.12), rgba(124, 58, 237, 0.12));
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 100px;
  color: #00d2ff;
  font-size: 12px;
  font-weight: 700;
}

/* ========== SKELETON CARDS ========== */
.cards-skeleton-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
}

.cards-skeleton-grid.list { grid-template-columns: 1fr; }

@keyframes shimmer {
  0% { background-position: -400% 0; }
  100% { background-position: 400% 0; }
}

.skeleton-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  overflow: hidden;
}

.sk-img {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-body { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.sk-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-title { width: 80%; height: 16px; }
.sk-loc { width: 60%; }
.sk-price { width: 40%; height: 18px; }
.sk-specs { display: flex; gap: 8px; }
.sk-spec { width: 60px; height: 10px; border-radius: 4px; background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.04) 100%); background-size: 400% 100%; animation: shimmer 1.4s ease-in-out infinite; }

/* ========== EMPTY / INITIAL STATES ========== */
.search-empty-state,
.search-initial-state {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(0, 210, 255, 0.08);
  border: 2px dashed rgba(0, 210, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.empty-icon-wrap i { font-size: 2rem; color: #00d2ff; }

.search-empty-state h2,
.search-initial-state h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f0f6ff;
  margin: 0 0 8px;
}

[data-theme="light"] .search-empty-state h2,
[data-theme="light"] .search-initial-state h2 { color: #0f172a; }

.search-empty-state p,
.search-initial-state p {
  color: #64748b;
  margin: 0 0 24px;
}

.btn-reset-search {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.3);
  border-radius: 12px;
  color: #00d2ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-reset-search:hover { background: rgba(0, 210, 255, 0.18); }

/* Initial state */
.initial-state-content { max-width: 800px; margin-inline: auto; }

.initial-icon-ring {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.15), rgba(124, 58, 237, 0.15));
  border: 2px solid rgba(0, 210, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: iconRingPulse 3s ease-in-out infinite;
}

.initial-icon-ring i { font-size: 2.2rem; color: #00d2ff; }

@keyframes iconRingPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 210, 255, 0.2); }
  50% { box-shadow: 0 0 0 12px rgba(0, 210, 255, 0); }
}

.trending-categories { margin-top: 48px; text-align: start; }

.trending-categories h3 {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin: 0 0 16px;
}

.trending-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.trending-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: start;
  font-family: inherit;
}

.trending-card:hover {
  background: rgba(0, 210, 255, 0.06);
  border-color: rgba(0, 210, 255, 0.2);
  transform: translateY(-2px);
}

[data-theme="light"] .trending-card {
  background: #f8fafc;
  border-color: #e2e8f0;
}

[data-theme="light"] .trending-card:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
}

.trending-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.15), rgba(124, 58, 237, 0.1));
  border: 1px solid rgba(0, 210, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trending-icon i { font-size: 16px; color: #00d2ff; }
[data-theme="light"] .trending-icon i { color: #0284c7; }

.trending-info { flex: 1; min-width: 0; }
.trending-name { display: block; font-size: 13px; font-weight: 700; color: #f0f6ff; }
[data-theme="light"] .trending-name { color: #0f172a; }
.trending-count { display: block; font-size: 11px; color: #64748b; margin-top: 2px; }
.trending-arrow { font-size: 11px; color: #64748b; flex-shrink: 0; }

/* ========== RESULTS GRID ========== */
.search-results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  transition: opacity 0.3s;
}

.search-results-grid.is-loading { opacity: 0.6; pointer-events: none; }

.search-results-grid.list {
  grid-template-columns: 1fr;
}

/* Property Card */
.search-prop-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.search-prop-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 210, 255, 0.25);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 210, 255, 0.1);
}

[data-theme="light"] .search-prop-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
}

[data-theme="light"] .search-prop-card:hover {
  border-color: #7dd3fc;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
}

/* List view card */
.search-prop-card.list-card {
  flex-direction: row;
}

.search-prop-card.list-card .card-img-wrap {
  width: 280px;
  flex-shrink: 0;
  height: auto;
}

.search-prop-card.list-card .card-body {
  flex: 1;
}

/* Card Image */
.card-img-wrap {
  position: relative;
  height: 210px;
  overflow: hidden;
}

.card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-prop-card:hover .card-img-wrap img { transform: scale(1.05); }

/* Badges on card image */
.badge-ai {
  position: absolute;
  top: 12px;
  inset-inline-start: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(0, 210, 255, 0.4);
  border-radius: 100px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #00d2ff;
}

.btn-fav {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-fav:hover, .btn-fav.saved {
  background: rgba(239, 68, 68, 0.85);
  color: #ffffff;
  transform: scale(1.1);
}

.badge-purpose {
  position: absolute;
  bottom: 12px;
  inset-inline-start: 12px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.badge-purpose.sale {
  background: rgba(16, 185, 129, 0.85);
  color: #ffffff;
}

.badge-purpose.rent {
  background: rgba(245, 158, 11, 0.85);
  color: #ffffff;
}

.badge-type {
  position: absolute;
  bottom: 12px;
  inset-inline-end: 12px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  color: rgba(255, 255, 255, 0.9);
}

/* Card Body */
.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #f0f6ff;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

[data-theme="light"] .card-title { color: #0f172a; }

.card-location {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
}

.card-location i { color: #00d2ff; font-size: 11px; }
[data-theme="light"] .card-location i { color: #0284c7; }

.card-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  font-size: 18px;
  font-weight: 800;
  color: #00d2ff;
  background: linear-gradient(135deg, #00d2ff, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

[data-theme="light"] .price-amount {
  background: linear-gradient(135deg, #0284c7, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
}

.price-period {
  font-size: 11px;
  color: #64748b;
}

.card-specs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.spec-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  font-size: 11px;
  color: rgba(176, 196, 222, 0.8);
}

.spec-chip i { font-size: 10px; color: #00d2ff; }

[data-theme="light"] .spec-chip {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #475569;
}

[data-theme="light"] .spec-chip i { color: #0284c7; }

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-chip {
  padding: 2px 8px;
  background: rgba(0, 210, 255, 0.08);
  border: 1px solid rgba(0, 210, 255, 0.15);
  border-radius: 6px;
  font-size: 10px;
  color: rgba(0, 210, 255, 0.8);
}

[data-theme="light"] .tag-chip {
  background: #e0f2fe;
  border-color: #bae6fd;
  color: #0284c7;
}

.btn-view-details {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: rgba(0, 210, 255, 0.06);
  border: 1px solid rgba(0, 210, 255, 0.15);
  border-radius: 10px;
  color: #00d2ff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-view-details:hover {
  background: rgba(0, 210, 255, 0.12);
  border-color: rgba(0, 210, 255, 0.3);
}

[data-theme="light"] .btn-view-details {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0284c7;
}

[data-theme="light"] .btn-view-details:hover {
  background: #bae6fd;
}

/* ========== LOAD MORE ========== */
.load-more-wrap {
  text-align: center;
  margin-top: 40px;
}

.btn-load-more {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  color: #f0f6ff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s;
}

.btn-load-more:hover {
  background: rgba(0, 210, 255, 0.08);
  border-color: rgba(0, 210, 255, 0.3);
  color: #00d2ff;
}

[data-theme="light"] .btn-load-more {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
}

.btn-load-more:disabled { opacity: 0.6; cursor: not-allowed; }

/* ========== TOAST ========== */
.sp-toast {
  position: fixed;
  bottom: 32px;
  inset-inline-start: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(10, 20, 40, 0.92);
  border: 1px solid rgba(0, 210, 255, 0.3);
  border-radius: 14px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f0f6ff;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(16px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 9999;
  white-space: nowrap;
}

[data-theme="light"] .sp-toast {
  background: rgba(255, 255, 255, 0.95);
  border-color: #7dd3fc;
  color: #0f172a;
}

.sp-toast i { color: #10b981; }
.sp-toast.visible { opacity: 1; transform: translateX(-50%) translateY(0); pointer-events: auto; }

/* ========== RESPONSIVE ========== */
@media (max-width: 1024px) {
  .search-results-grid { grid-template-columns: repeat(2, 1fr); }
  .cards-skeleton-grid { grid-template-columns: repeat(2, 1fr); }
  .trending-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .search-hero-section { padding: 70px 16px 48px; }
  .main-search-bar { flex-direction: column; border-radius: 16px; }
  .msb-divider-field { border-inline-start: none; border-top: 1px solid rgba(255,255,255,0.08); }
  .msb-search-btn { border-radius: 0 0 14px 14px; padding: 14px; justify-content: center; }
  [dir="rtl"] .msb-search-btn { border-radius: 0 0 14px 14px; }
  .search-results-grid, .cards-skeleton-grid { grid-template-columns: 1fr; }
  .search-results-grid.list .search-prop-card { flex-direction: column; }
  .search-results-grid.list .card-img-wrap { width: 100%; height: 200px; }
  .trending-grid { grid-template-columns: 1fr; }
  .filters-strip-inner { flex-direction: column; align-items: flex-start; }
  .filters-right-group { margin-inline-start: 0; }
}

@media (max-width: 480px) {
  .main-search-bar-wrap { margin-bottom: 16px; }
  .search-hero-title { font-size: 1.6rem; }
}
</style>
