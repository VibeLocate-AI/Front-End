<template>
  <div class="rent-page-wrapper" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">
    <!-- ==================== DASHBOARD CATALOG CONTENT ==================== -->
    <main class="explore-dashboard-section">
      
      <!-- 1. HERO BANNER HEADER -->
      <div class="explore-hero-banner">
        <div class="explore-header-titles">
          <h1 class="explore-main-headline">{{ t('rentMainHeadline') }}</h1>
          <p class="explore-sub-headline">{{ t('rentSubHeadline') }}</p>
        </div>

        <!-- Top Right AI Curated Badge -->
        <div class="explore-ai-curated-badge">
          <div class="ai-badge-icon-box">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div class="ai-badge-text-box">
              <strong>{{ t('rentCuratedBadge') }}</strong>
            <span>{{ t('rentCuratedBadgeSub') }}</span>
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
            <h3 class="sidebar-title">{{ t('searchAndFilter') }}</h3>
            <button type="button" class="btn-reset-filters" @click="resetFilters">
              <i class="fa-solid fa-rotate-left"></i> {{ t('resetAll') }}
            </button>
          </div>

          <form @submit.prevent="applyFilters">
            <!-- Keyword Search Input -->
            <div class="filter-group-item">
              <input
                v-model="filterState.keyword"
                type="text"
                class="filter-input-search"
                :placeholder="t('searchRentPlaceholder')"
              >
            </div>

            <!-- Location Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-location-dot"></i> {{ t('location') }}</label>
              <select v-model="filterState.location" class="filter-select-dropdown">
                <option value="All">{{ isRtl ? 'كل المناطق' : 'All Areas' }}</option>
                <option v-for="loc in availableLocations" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>

            <!-- Property Type Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-building"></i> {{ t('propertyType') }}</label>
              <select v-model="filterState.propertyType" class="filter-select-dropdown">
                <option value="All">{{ t('allTypes') }}</option>
                <option value="Apartment">{{ t('apartment') }}</option>
                <option value="Villa">{{ t('villa') }}</option>
                <option value="Penthouse">{{ t('penthouse') }}</option>
                <option value="Townhouse">{{ t('townhouse') }}</option>
              </select>
            </div>

            <!-- Price Range (AED) Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-dollar-sign"></i> {{ t('budgetAED') }}</label>
              <select v-model="filterState.priceRange" class="filter-select-dropdown">
                <option value="Any">{{ t('anyBudget') }}</option>
                <option value="under-100k">{{ isRtl ? 'أقل من 100,000 درهم/سنوي' : 'Under AED 100,000/yr' }}</option>
                <option value="100k-250k">{{ isRtl ? '100,000 - 250,000 درهم' : 'AED 100,000 - 250,000' }}</option>
                <option value="250k-500k">{{ isRtl ? '250,000 - 500,000 درهم' : 'AED 250,000 - 500,000' }}</option>
                <option value="500k-plus">{{ isRtl ? 'أكثر من 500,000 درهم' : 'AED 500,000+' }}</option>
              </select>
            </div>

            <!-- Bedrooms Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-bed"></i> {{ t('bedrooms') }}</label>
              <select v-model="filterState.bedrooms" class="filter-select-dropdown">
                <option value="Any">{{ t('anyBedroomCount') }}</option>
                <option value="1">{{ isRtl ? 'غرفة نوم واحدة' : '1 Bedroom' }}</option>
                <option value="2">{{ isRtl ? 'غرفتا نوم' : '2 Bedrooms' }}</option>
                <option value="3">{{ isRtl ? '3 غرف نوم' : '3 Bedrooms' }}</option>
                <option value="4">{{ isRtl ? '4 غرف نوم' : '4 Bedrooms' }}</option>
                <option value="5+">{{ isRtl ? '5+ غرف نوم' : '5+ Bedrooms' }}</option>
              </select>
            </div>

            <!-- Lifestyle / Features Dropdown -->
            <div class="filter-group-item">
              <label class="filter-group-label"><i class="fa-solid fa-sliders"></i> {{ t('lifestyle') }}</label>
              <select v-model="filterState.lifestyle" class="filter-select-dropdown">
                <option value="Any">{{ t('anyLifestyle') }}</option>
                <option value="Waterfront">{{ isRtl ? 'حياة واجهة مائية' : 'Waterfront Living' }}</option>
                <option value="Private Pool">{{ isRtl ? 'مسبح خاص' : 'Private Pool' }}</option>
                <option value="Sea View">{{ isRtl ? 'إطلالة بحرية' : 'Sea View' }}</option>
                <option value="Near Metro">{{ isRtl ? 'قريب من المترو' : 'Near Metro' }}</option>
                <option value="Off-Plan">{{ isRtl ? 'على الخارطة' : 'Off-Plan' }}</option>
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
              <i class="fa-solid fa-sliders"></i> {{ isRtl ? 'تطبيق الفلاتر' : 'Apply Filters' }}
            </button>
          </form>

          <!-- Bottom AI Switch Widget -->
          <div class="sidebar-ai-switch-box">
            <div class="ai-switch-info">
              <strong>
                <i class="fa-solid fa-wand-magic-sparkles" style="color:#00d2ff"></i> {{ isRtl ? 'بحث بالذكاء الاصطناعي' : 'AI-Powered Search' }}
              </strong>
              <p>{{ isRtl ? 'احصل على نتائج أذكى مع VibeLocate AI' : 'Get smarter, more relevant results with VibeLocate AI' }}</p>
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
              <strong>{{ filteredList.length.toLocaleString() }}</strong> {{ isRtl ? 'عقار إيجاري متاح في دبي' : 'rental properties found in Dubai' }}
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
                  <i class="fa-solid fa-border-all"></i> {{ t('grid') }}
                </button>
                <button
                  type="button"
                  class="btn-view-mode"
                  :class="{ active: viewMode === 'map' }"
                  @click="router.push('/map')"
                >
                  <i class="fa-solid fa-map-location-dot"></i> {{ t('map') }}
                </button>
              </div>

              <!-- Sort Select Dropdown -->
              <select v-model="sortBy" class="select-sort-dropdown">
                <option value="ai-match">{{ t('sortByAIMatch') }}</option>
                <option value="price-asc">{{ t('sortByPriceAsc') }}</option>
                <option value="price-desc">{{ t('sortByPriceDesc') }}</option>
                <option value="newest">{{ isRtl ? 'الأحدث' : 'Newest Listed' }}</option>
              </select>
            </div>
          </div>

          <!-- Properties List -->
          <div v-if="isLoading" class="rent-props-list">
            <div v-for="n in 6" :key="'skel-' + n" class="rent-prop-card rent-skeleton-card">
              <div class="rent-skeleton-thumb"></div>
              <div class="rent-card-details">
                <div class="rent-sk-line rent-sk-badge"></div>
                <div class="rent-sk-line rent-sk-title"></div>
                <div class="rent-sk-line rent-sk-loc"></div>
                <div class="rent-sk-line rent-sk-price"></div>
                <div class="rent-sk-line rent-sk-specs"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredList.length === 0" class="no-properties-box">
            <i class="fa-solid fa-building-circle-xmark"></i>
            <h3>{{ isRtl ? 'لا توجد عقارات للإيجار مطابقة حالياً' : 'No rental properties found' }}</h3>
            <p>{{ isRtl ? 'لم نتمكن من العثور على عقارات إيجار مطابقة في قاعدة البيانات' : 'No matching rental properties found in the live database' }}</p>
            <button type="button" class="btn-clear-empty-filter" @click="resetFilters">
              <i class="fa-solid fa-rotate-left"></i> {{ isRtl ? 'إعادة تعيين الفلاتر' : 'Reset All Filters' }}
            </button>
          </div>

          <div v-else class="rent-props-list">
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
                  <i class="fa-solid fa-wand-magic-sparkles"></i> {{ prop.matchScore }}% {{ isRtl ? 'تطابق' : 'Match' }}
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
                  <span><i class="fa-solid fa-bed"></i> {{ prop.beds }} {{ t('beds') }}</span>
                  <span><i class="fa-solid fa-bath"></i> {{ prop.baths }} {{ t('baths') }}</span>
                  <span><i class="fa-solid fa-ruler-combined"></i> {{ prop.sqft }} {{ t('sqft') }}</span>
                </div>

                <div class="rent-card-footer">
                  <button type="button" class="rent-btn-view" @click.stop="openDetails(prop)">
                    <span>{{ t('viewDetails') }}</span>
                    <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination Footer Bar -->
          <div class="explore-pagination-bar">
            <div class="pagination-info-text">
              {{ isRtl
                ? `عرض ${filteredList.length ? ((currentPage - 1) * perPage) + 1 : 0}-${Math.min(currentPage * perPage, filteredList.length)} من ${filteredList.length.toLocaleString()} إيجار`
                : `Showing ${filteredList.length ? ((currentPage - 1) * perPage) + 1 : 0}-${Math.min(currentPage * perPage, filteredList.length)} of ${filteredList.length.toLocaleString()} rentals`
              }}
            </div>

            <div class="pagination-controls-group">
              <button type="button" class="btn-page-num" :disabled="currentPage === 1" @click="currentPage--">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button
                v-for="p in pageNumbers"
                :key="p"
                type="button"
                class="btn-page-num"
                :class="{ active: currentPage === p }"
                @click="currentPage = p"
              >
                {{ p }}
              </button>
              <span v-if="totalPages > 5 && !pageNumbers.includes(totalPages)" class="page-dots">...</span>
              <button v-if="totalPages > 5 && !pageNumbers.includes(totalPages)" type="button" class="btn-page-num" @click="currentPage = totalPages">{{ totalPages }}</button>
              <button type="button" class="btn-page-num" :disabled="currentPage >= totalPages" @click="currentPage++">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            <select v-model="perPage" class="per-page-select">
              <option :value="8">{{ isRtl ? 'عرض 8 في الصفحة' : 'Show 8 per page' }}</option>
              <option :value="16">{{ isRtl ? 'عرض 16 في الصفحة' : 'Show 16 per page' }}</option>
              <option :value="24">{{ isRtl ? 'عرض 24 في الصفحة' : 'Show 24 per page' }}</option>
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
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { t, isRtl, isDark, theme: currentTheme, locProps } = useThemeAndLanguage()
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

const categoryPills = computed(() => {
  const allCount = catalogProperties.value.length
  const pills = [
    { name: 'All Properties', count: allCount.toLocaleString() }
  ]
  const typesMap = {}
  catalogProperties.value.forEach(p => {
    const t = p.type || 'Other'
    typesMap[t] = (typesMap[t] || 0) + 1
  })
  Object.entries(typesMap).forEach(([t, count]) => {
    pills.push({ name: t, count: count.toLocaleString() })
  })
  return pills
})

const selectedCategory = ref('All Properties')

const featureCheckboxes = computed(() => {
  const features = [
    { name: 'Furnished', key: 'furnished' },
    { name: 'Waterfront', key: 'waterfront' },
    { name: 'Sea View', key: 'sea' },
    { name: 'Near Metro', key: 'metro' },
    { name: 'Ready to Move', key: 'ready' }
  ]
  return features.map(f => {
    const count = catalogProperties.value.filter(p => {
      const text = `${p.title} ${p.description || ''} ${p.summary || ''} ${p.is_furnished || ''}`.toLowerCase()
      return text.includes(f.key)
    }).length
    return {
      name: f.name,
      count: count.toLocaleString()
    }
  })
})

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
const isLoading = ref(true)
const popularAreasList = ref([])

const toCatalogProperty = (property) => {
  const norm = property.specs ? property : propertyService.normalizeProperty(property)
  return {
    ...norm,
    location: norm.location || norm.area || 'Dubai, UAE',
    price: Number(norm.price) || 0,
    sqft: norm.area_sqft ? Number(norm.area_sqft).toLocaleString() : (norm.size || 'N/A'),
    matchScore: norm.matchScore || norm.aiMatch || 88,
    image: norm.image || '/images/photo-1512917774080-9991f1c4c750.jfif'
  }
}

const catalogProperties = ref([])

const availableLocations = computed(() => {
  const set = new Set()
  catalogProperties.value.forEach(p => {
    const loc = p.location || p.area
    if (loc && typeof loc === 'string') {
      const clean = loc.split(',')[0].trim()
      if (clean) set.add(clean)
    }
  })
  popularAreasList.value.forEach(a => {
    if (a.name) set.add(a.name)
  })
  return Array.from(set)
})

const isRental = (property) => {
  const purpose = String(property.action_type || property.listingPurpose || property.purpose || property.listing_type || '').toLowerCase()
  return purpose === 'rent' || property.isForRent === true || Boolean(property.rent_frequency)
}

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
    const langKey = isRtl.value ? 'ar' : 'en'
    const [propRes, areasRes] = await Promise.allSettled([
      propertyService.getProperties(),
      propertyService.getPopularAreas(langKey)
    ])

    if (propRes.status === 'fulfilled' && propRes.value?.data) {
      const rentals = propRes.value.data.filter(isRental).map(toCatalogProperty)
      catalogProperties.value = rentals
    } else {
      catalogProperties.value = []
    }

    if (areasRes.status === 'fulfilled' && areasRes.value?.data) {
      popularAreasList.value = areasRes.value.data
    }
  } catch (error) {
    console.warn('Unable to load rental properties from API:', error?.message)
    catalogProperties.value = []
  } finally {
    isLoading.value = false
  }
}

const selectCategory = (catName) => {
  selectedCategory.value = catName
  currentPage.value = 1
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
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
  showToast(isRtl.value ? 'تم تطبيق الفلاتر!' : 'Filters applied to catalog!')
}

const filteredList = computed(() => {
  let list = [...catalogProperties.value]

  if (selectedCategory.value !== 'All Properties') {
    const cat = selectedCategory.value.toLowerCase()
    if (cat.includes('apartment')) list = list.filter(p => p.type === 'Apartment')
    else if (cat.includes('villa')) list = list.filter(p => p.type === 'Villa')
    else if (cat.includes('penthouse')) list = list.filter(p => p.type === 'Penthouse')
    else if (cat.includes('townhouse')) list = list.filter(p => p.type === 'Townhouse')
    else if (cat.includes('waterfront')) list = list.filter(p => (p.location && (p.location.includes('Marina') || p.location.includes('Palm') || p.location.includes('Island') || p.location.includes('Beach') || p.location.includes('Creek'))) || (p.tags && p.tags.some(t => t.toLowerCase().includes('water'))))
    else if (cat.includes('off-plan')) list = list.filter(p => p.isOffPlan || p.property_condition === 'off_plan')
  }

  if (filterState.value.location !== 'All') {
    const loc = filterState.value.location.toLowerCase()
    list = list.filter(p => (p.location || '').toLowerCase().includes(loc) || (p.area || '').toLowerCase().includes(loc))
  }

  if (filterState.value.propertyType !== 'All') {
    list = list.filter(p => (p.type || '').toLowerCase() === filterState.value.propertyType.toLowerCase())
  }

  if (filterState.value.bedrooms !== 'Any') {
    if (filterState.value.bedrooms === '5+') {
      list = list.filter(p => Number(p.beds) >= 5)
    } else {
      list = list.filter(p => Number(p.beds) === Number(filterState.value.bedrooms))
    }
  }

  if (filterState.value.priceRange !== 'Any') {
    if (filterState.value.priceRange === 'under-100k') list = list.filter(p => (Number(p.price) || 0) < 100000)
    else if (filterState.value.priceRange === '100k-250k') list = list.filter(p => (Number(p.price) || 0) >= 100000 && (Number(p.price) || 0) <= 250000)
    else if (filterState.value.priceRange === '250k-500k') list = list.filter(p => (Number(p.price) || 0) >= 250000 && (Number(p.price) || 0) <= 500000)
    else if (filterState.value.priceRange === '500k-plus') list = list.filter(p => (Number(p.price) || 0) > 500000)
  }

  if (filterState.value.lifestyle !== 'Any') {
    const life = filterState.value.lifestyle.toLowerCase()
    list = list.filter(p => (p.tags && p.tags.some(t => t.toLowerCase().includes(life))) || (p.description && p.description.toLowerCase().includes(life)) || (p.summary && p.summary.toLowerCase().includes(life)))
  }

  if (filterState.value.selectedFeatures.length > 0) {
    const selected = filterState.value.selectedFeatures.map(f => f.toLowerCase())
    list = list.filter(p => {
      const allText = `${p.title} ${p.description} ${p.summary} ${(p.tags || []).join(' ')}`.toLowerCase()
      return selected.some(f => allText.includes(f))
    })
  }

  if (filterState.value.keyword.trim()) {
    const kw = filterState.value.keyword.toLowerCase().trim()
    list = list.filter(p => `${p.title} ${p.location} ${p.type} ${p.description || ''}`.toLowerCase().includes(kw))
  }

  if (sortBy.value === 'price-asc') {
    list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
  } else if (sortBy.value === 'newest') {
    list.sort((a, b) => (b.id || 0) - (a.id || 0))
  } else {
    list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / perPage.value)))

const pageNumbers = computed(() => {
  const pages = []
  const maxButtons = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxButtons - 1)
  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const raw = filteredList.value.slice(start, start + perPage.value)
  // Localize property titles, types, and locations reactively
  return locProps(raw)
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

/* Skeleton and Empty State Styles */
.rent-skeleton-card {
  animation: pulse 1.6s ease-in-out infinite;
  pointer-events: none;
}
.rent-skeleton-thumb {
  height: 190px;
  background: linear-gradient(90deg, #132238 25%, #1d3354 50%, #132238 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.rent-sk-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #132238 25%, #1d3354 50%, #132238 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 8px;
}
.rent-sk-badge { width: 35%; height: 16px; margin-bottom: 12px; }
.rent-sk-title { width: 85%; height: 16px; }
.rent-sk-loc { width: 55%; }
.rent-sk-price { width: 45%; height: 18px; margin: 12px 0 8px; }
.rent-sk-specs { width: 75%; height: 14px; }
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.no-properties-box {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 24px;
  background: rgba(13, 27, 46, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  min-height: 280px;
}
.no-properties-box i {
  font-size: 3rem;
  color: #00d2ff;
  margin-bottom: 16px;
  opacity: 0.8;
}
.no-properties-box h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}
.no-properties-box p {
  color: #94a3b8;
  font-size: 0.9rem;
  max-width: 440px;
  margin-bottom: 20px;
}
.btn-clear-empty-filter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #00d2ff, #0066ff);
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-clear-empty-filter:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 210, 255, 0.35);
}
</style>
