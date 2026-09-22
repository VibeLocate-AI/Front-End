<template>
  <div class="buy-page-wrapper" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">
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
          <router-link class="nav-item" to="/home">{{ t('home') }}</router-link>
          <router-link class="nav-item active" to="/buy">{{ t('buy') }}</router-link>
          <router-link class="nav-item" to="/rent">{{ t('rent') }}</router-link>
          <router-link class="nav-item" to="/home#featured">{{ t('newProjects') }}</router-link>
          <router-link class="nav-item" to="/map">
            {{ t('interactiveMap') }}
            <i class="fa-solid fa-map-location-dot" style="font-size:0.75rem; color:var(--accent-cyan, #00d2ff); margin-left:3px;"></i>
          </router-link>
          <router-link class="nav-item" to="/home#areas">{{ t('areas') }}</router-link>
          <router-link class="nav-item" to="/home#about">{{ t('aboutUs') }}</router-link>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <!-- Interactive Language Switcher & Theme Toggle Buttons -->
          <NavbarControls />

          <button class="btn-list-property" type="button" @click="router.push('/add-property')">
            {{ t('listProperty') }}
          </button>

          <button
            class="icon-action-btn"
            :class="{ 'has-saved': favoritesService.savedItems.value.length > 0 }"
            type="button"
            aria-label="Favorites"
            :title="t('savedProperties')"
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
                  <span class="dropdown-user-badge">
                    <i class="fa-solid fa-circle-check"></i> {{ isLoggedIn ? t('verifiedMember') : t('guestAccount') }}
                  </span>
                </div>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-menu-list">
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="router.push('/profile'); profileMenuOpen = false">
                  <i class="fa-regular fa-user"></i> <span>{{ t('myProfile') }}</span>
                </button>
                <button class="dropdown-menu-item" @click="isSavedModalOpen = true; profileMenuOpen = false">
                  <i class="fa-solid fa-heart text-danger"></i> <span>{{ t('savedProperties') }} ({{ favoritesService.savedItems.value.length }})</span>
                </button>
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="handleLogout">
                  <i class="fa-solid fa-arrow-right-from-bracket text-danger"></i> <span>{{ t('logout') }}</span>
                </button>
                <button v-else class="dropdown-menu-item" @click="router.push('/login'); profileMenuOpen = false">
                  <i class="fa-solid fa-arrow-right-to-bracket"></i> <span>{{ t('login') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ==================== HERO SECTION ==================== -->
    <section class="buy-hero-section">
      <!-- Watermark quote top right on window -->
      <div class="hero-watermark-quote">
        <span>More Than</span>
        <span>A Property</span>
        <span class="quote-accent">A Brighter Tomorrow</span>
      </div>

      <div class="buy-hero-content-wrap">
        <div class="buy-hero-top-row">
          <!-- Left: Badge, Title & Subtitle -->
          <div class="hero-title-col">
            <div class="buy-sale-badge">
              <i class="fa-solid fa-house-chimney"></i>
              <span>{{ t('propertiesForSaleBadge') }}</span>
            </div>

            <h1 class="buy-hero-headline">
              <span>{{ t('buyHeroTitlePart1') }}</span>
              <span class="headline-gradient"> {{ t('buyHeroTitlePart2') }}</span>
            </h1>

            <p class="buy-hero-subtitle">
              {{ t('buyHeroSubtitle') }}
            </p>
          </div>

          <!-- Right: 3 Stat Badges -->
          <div class="hero-stats-col">
            <div class="highlight-item">
              <div class="highlight-icon-box">
                <i class="fa-solid fa-percent"></i>
              </div>
              <div class="highlight-text-box">
                <strong>{{ t('heroStat1Title') }}</strong>
                <span>{{ t('heroStat1Desc') }}</span>
              </div>
            </div>

            <div class="highlight-item">
              <div class="highlight-icon-box">
                <i class="fa-solid fa-chart-line"></i>
              </div>
              <div class="highlight-text-box">
                <strong>{{ t('heroStat2Title') }}</strong>
                <span>{{ t('heroStat2Desc') }}</span>
              </div>
            </div>

            <div class="highlight-item">
              <div class="highlight-icon-box">
                <i class="fa-solid fa-earth-americas"></i>
              </div>
              <div class="highlight-text-box">
                <strong>{{ t('heroStat3Title') }}</strong>
                <span>{{ t('heroStat3Desc') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== FLOATING SEARCH BAR ==================== -->
        <div class="buy-search-bar-wrap">
          <form class="buy-search-bar" @submit.prevent="applyFilters">
            <!-- Location -->
            <div class="search-field-col">
              <label class="search-field-label">
                <i class="fa-solid fa-location-dot"></i> {{ t('location') }}
              </label>
              <div class="search-input-inner">
                <select v-model="filterState.location" class="search-select">
                  <option value="All">{{ t('searchAreasPlaceholder') }}</option>
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Palm Jumeirah">Palm Jumeirah</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Arabian Ranches 3">Arabian Ranches 3</option>
                  <option value="Dubai Harbour">Dubai Harbour</option>
                </select>
                <i class="fa-solid fa-chevron-down select-chevron"></i>
              </div>
            </div>

            <!-- Property Type -->
            <div class="search-field-col">
              <label class="search-field-label">
                <i class="fa-solid fa-building"></i> {{ t('propertyType') }}
              </label>
              <div class="search-input-inner">
                <select v-model="filterState.propertyType" class="search-select">
                  <option value="All">{{ t('allTypes') }}</option>
                  <option value="Apartment">{{ t('apartment') }}</option>
                  <option value="Villa">{{ t('villa') }}</option>
                  <option value="Penthouse">{{ t('penthouse') }}</option>
                </select>
                <i class="fa-solid fa-chevron-down select-chevron"></i>
              </div>
            </div>

            <!-- Budget -->
            <div class="search-field-col">
              <label class="search-field-label">
                <i class="fa-solid fa-wallet"></i> {{ t('budgetAED') }}
              </label>
              <div class="search-input-inner">
                <select v-model="filterState.priceRange" class="search-select">
                  <option value="Any">{{ t('anyBudget') }}</option>
                  <option value="under-5m">{{ isRtl ? 'أقل من 5 مليون' : 'Under AED 5M' }}</option>
                  <option value="5m-10m">{{ isRtl ? '5 - 10 مليون' : 'AED 5M - 10M' }}</option>
                  <option value="10m-plus">{{ isRtl ? 'أكثر من 10 مليون' : 'AED 10M+' }}</option>
                </select>
                <i class="fa-solid fa-chevron-down select-chevron"></i>
              </div>
            </div>

            <!-- Bedrooms -->
            <div class="search-field-col">
              <label class="search-field-label">
                <i class="fa-solid fa-bed"></i> {{ t('bedrooms') }}
              </label>
              <div class="search-input-inner">
                <select v-model="filterState.bedrooms" class="search-select">
                  <option value="Any">{{ t('anyBedroomCount') }}</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
                <i class="fa-solid fa-chevron-down select-chevron"></i>
              </div>
            </div>

            <!-- Lifestyle -->
            <div class="search-field-col">
              <label class="search-field-label">
                <i class="fa-solid fa-sliders"></i> {{ t('lifestyle') }}
              </label>
              <div class="search-input-inner">
                <select v-model="filterState.lifestyle" class="search-select">
                  <option value="Any">{{ t('anyLifestyle') }}</option>
                  <option value="Waterfront">{{ t('waterfront') }}</option>
                  <option value="Private Pool">{{ isRtl ? 'مسبح خاص' : 'Private Pool' }}</option>
                  <option value="Ready to Move">{{ t('readyToMove') }}</option>
                </select>
                <i class="fa-solid fa-chevron-down select-chevron"></i>
              </div>
            </div>

            <!-- Search Button -->
            <div class="search-btn-col">
              <button type="submit" class="btn-search-properties">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>{{ t('searchProperties') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- ==================== MAIN CATALOG BODY ==================== -->
    <main class="buy-main-catalog">
      <!-- Category Tabs Row -->
      <div class="category-tabs-bar">
        <button
          v-for="cat in categoryTabs"
          :key="cat.key"
          type="button"
          class="cat-tab-btn"
          :class="{ active: selectedCategory === cat.key }"
          @click="selectCategory(cat.key)"
        >
          <i :class="cat.icon"></i>
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- Content Header Bar (Count, View Mode, Sort) -->
      <div class="catalog-header-bar">
        <div class="properties-count-text">
          <strong>1,248</strong> {{ t('propertiesForSaleInDubai') }}
        </div>

        <div class="header-tools-group">
          <!-- View Switcher -->
          <div class="view-mode-pill">
            <button
              type="button"
              class="btn-view-toggle active"
            >
              <i class="fa-solid fa-border-all"></i>
              <span>{{ t('grid') }}</span>
            </button>
            <button
              type="button"
              class="btn-view-toggle"
              @click="router.push('/map')"
            >
              <i class="fa-solid fa-map-location-dot"></i>
              <span>{{ t('map') }}</span>
            </button>
          </div>

          <!-- Sort Dropdown -->
          <div class="sort-dropdown-wrap">
            <select v-model="sortBy" class="sort-select">
              <option value="recommended">{{ t('sortByRecommended') }}</option>
              <option value="ai-match">{{ t('sortByAIMatch') }}</option>
              <option value="price-asc">{{ t('sortByPriceAsc') }}</option>
              <option value="price-desc">{{ t('sortByPriceDesc') }}</option>
            </select>
            <i class="fa-solid fa-chevron-down sort-chevron"></i>
          </div>
        </div>
      </div>

      <!-- Two-Column Main Layout: Exactly 4 Cards on Left, 2 Widgets on Right -->
      <div class="buy-content-layout">
        
        <!-- LEFT: THE 4 MOCKUP PROPERTY CARDS -->
        <section class="properties-grid-container">
          <div class="buy-cards-grid">
            <article
              v-for="prop in displayProperties"
              :key="prop.id"
              class="buy-prop-card"
              @click="openDetails(prop)"
            >
              <!-- Thumbnail & Badges -->
              <div class="card-thumb-wrap">
                <img :src="prop.image" :alt="prop.title" loading="lazy" @error="onImgError">
                
                <!-- AI Match (Top-Left) -->
                <div class="badge-ai-match">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                  <span>{{ t('aiMatch') }} {{ prop.matchScore }}%</span>
                </div>

                <!-- Favorite Heart (Top-Right) -->
                <button
                  type="button"
                  class="btn-card-fav"
                  :class="{ saved: favoritesService.isSaved(prop.title || prop.id) }"
                  @click.stop="toggleFavorite(prop)"
                >
                  <i :class="favoritesService.isSaved(prop.title || prop.id) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
                </button>

                <!-- Status Badge (Bottom-Left) -->
                <div class="badge-status-chip">
                  <i :class="prop.isOffPlan ? 'fa-solid fa-chart-column' : 'fa-solid fa-key'"></i>
                  <span>{{ prop.isOffPlan ? t('offPlan') : t('readyToMove') }}</span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <h3 class="card-title">{{ prop.title }}</h3>
                
                <p class="card-location">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>{{ prop.location }}</span>
                </p>

                <div class="card-price">
                  {{ formatPrice(prop.price) }}
                </div>

                <div class="card-specs-row">
                  <span class="spec-item">
                    <i class="fa-solid fa-bed"></i> {{ prop.beds }} {{ t('beds') }}
                  </span>
                  <span class="spec-item">
                    <i class="fa-solid fa-bath"></i> {{ prop.baths }} {{ t('baths') }}
                  </span>
                  <span class="spec-item">
                    <i class="fa-solid fa-vector-square"></i> {{ prop.sqft }} {{ t('sqft') }}
                  </span>
                </div>

                <button type="button" class="btn-view-details" @click.stop="openDetails(prop)">
                  <span>{{ t('viewDetails') }}</span>
                  <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>
              </div>
            </article>
          </div>
        </section>

        <!-- RIGHT: SIDEBAR WIDGETS -->
        <aside class="buy-sidebar-widgets">
          
          <!-- Widget 1: AI Recommendations -->
          <div class="sidebar-widget-card">
            <div class="widget-header">
              <div class="widget-title">
                <i class="fa-solid fa-wand-magic-sparkles text-cyan"></i>
                <span>{{ t('aiRecommendations') }}</span>
              </div>
              <router-link to="/map" class="widget-link">
                {{ t('seeMore') }} <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
              </router-link>
            </div>

            <div class="widget-items-list">
              <div class="widget-item-card" @click="filterByLocation('Dubai Marina')">
                <img src="/images/photo-1545324418-cc1a3fa10c00.avif" alt="Dubai Marina" class="item-thumb">
                <div class="item-content">
                  <h4 class="item-title">{{ t('rec1Title') }}</h4>
                  <p class="item-desc">{{ t('rec1Desc') }}</p>
                </div>
                <i class="fa-solid item-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </div>

              <div class="widget-item-card" @click="filterByLocation('Arabian Ranches 3')">
                <img src="/images/photo-1600585154340-be6161a56a0c.avif" alt="Arabian Ranches" class="item-thumb">
                <div class="item-content">
                  <h4 class="item-title">{{ t('rec2Title') }}</h4>
                  <p class="item-desc">{{ t('rec2Desc') }}</p>
                </div>
                <i class="fa-solid item-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </div>

              <div class="widget-item-card" @click="filterByLocation('Palm Jumeirah')">
                <img src="/images/photo-1512917774080-9991f1c4c750.jfif" alt="Palm Jumeirah" class="item-thumb">
                <div class="item-content">
                  <h4 class="item-title">{{ t('rec3Title') }}</h4>
                  <p class="item-desc">{{ t('rec3Desc') }}</p>
                </div>
                <i class="fa-solid item-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </div>
            </div>
          </div>

          <!-- Widget 2: Best Areas to Buy -->
          <div class="sidebar-widget-card">
            <div class="widget-header">
              <div class="widget-title">
                <i class="fa-solid fa-location-dot text-cyan"></i>
                <span>{{ t('bestAreasToBuy') }}</span>
              </div>
              <router-link to="/home#areas" class="widget-link">
                {{ t('seeAllAreas') }} <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
              </router-link>
            </div>

            <div class="widget-items-list">
              <div class="widget-item-card" @click="filterByLocation('Downtown Dubai')">
                <img src="/images/photo-1512917774080-9991f1c4c750 (1).jfif" alt="Downtown Dubai" class="item-thumb">
                <div class="item-content">
                  <h4 class="item-title">{{ t('area1Title') }}</h4>
                  <p class="item-desc">{{ t('area1Desc') }}</p>
                </div>
                <i class="fa-solid item-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </div>

              <div class="widget-item-card" @click="filterByLocation('Dubai Marina')">
                <img src="/images/photo-1582719478250-c89cae4dc85b.avif" alt="Dubai Marina" class="item-thumb">
                <div class="item-content">
                  <h4 class="item-title">{{ t('area2Title') }}</h4>
                  <p class="item-desc">{{ t('area2Desc') }}</p>
                </div>
                <i class="fa-solid item-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </div>

              <div class="widget-item-card" @click="filterByLocation('Palm Jumeirah')">
                <img src="/images/photo-1600210492486-724fe5c67fb0.jfif" alt="Palm Jumeirah" class="item-thumb">
                <div class="item-content">
                  <h4 class="item-title">{{ t('area3Title') }}</h4>
                  <p class="item-desc">{{ t('area3Desc') }}</p>
                </div>
                <i class="fa-solid item-arrow" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </div>
            </div>
          </div>

        </aside>

      </div>

      <!-- ==================== WHY BUY BANNER ==================== -->
      <section class="why-buy-banner">
        <div class="why-buy-left">
          <h2 class="why-buy-title">{{ t('whyBuyWithVibeLocate') }}</h2>
          <div class="why-buy-features">
            <div class="why-feat-item">
              <div class="feat-icon-box">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div class="feat-text-box">
                <strong>{{ t('whyBuy1Title') }}</strong>
                <span>{{ t('whyBuy1Desc') }}</span>
              </div>
            </div>

            <div class="why-feat-item">
              <div class="feat-icon-box">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div class="feat-text-box">
                <strong>{{ t('whyBuy2Title') }}</strong>
                <span>{{ t('whyBuy2Desc') }}</span>
              </div>
            </div>

            <div class="why-feat-item">
              <div class="feat-icon-box">
                <i class="fa-solid fa-chart-column"></i>
              </div>
              <div class="feat-text-box">
                <strong>{{ t('whyBuy3Title') }}</strong>
                <span>{{ t('whyBuy3Desc') }}</span>
              </div>
            </div>

            <div class="why-feat-item">
              <div class="feat-icon-box">
                <i class="fa-solid fa-headset"></i>
              </div>
              <div class="feat-text-box">
                <strong>{{ t('whyBuy4Title') }}</strong>
                <span>{{ t('whyBuy4Desc') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="why-buy-cta">
          <button type="button" class="btn-start-buying">
            <span>{{ t('startBuyingJourney') }}</span>
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
          <p class="cta-subtext">{{ t('smarterDecisions') }}</p>
        </div>
      </section>
    </main>

    <!-- Modals -->
    <PropertyDetailsModal
      :property="selectedPropForModal"
      :is-open="isDetailsModalOpen"
      @close="isDetailsModalOpen = false"
      @toast="showToast"
    />

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
import { authService } from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import SavedPropertiesModal from './SavedPropertiesModal.vue'
import PropertyDetailsModal from './PropertyDetailsModal.vue'
import NavbarControls from './NavbarControls.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { t, isRtl, isDark, theme: currentTheme } = useThemeAndLanguage()
const router = useRouter()

// UI State
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)

const isSavedModalOpen = ref(false)
const selectedPropForModal = ref(null)
const isDetailsModalOpen = ref(false)

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

// User state
const user = ref({ name: '', email: '', avatar: '' })

const isLoggedIn = computed(() => {
  return authService.isAuthenticated() || !!(user.value.email || user.value.name)
})

const displayName = computed(() => {
  return user.value.name || (user.value.email ? user.value.email.split('@')[0] : (isRtl.value ? 'زائر' : 'Guest User'))
})

const displayEmail = computed(() => {
  return user.value.email || 'guest@vibelocate.ai'
})

const userAvatarUrl = computed(() => {
  if (user.value.avatar && user.value.avatar.trim() !== '') {
    return user.value.avatar
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`
})

const onAvatarError = (e) => {
  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`
}

const handleLogout = async () => {
  profileMenuOpen.value = false
  await authService.logout()
  user.value = { name: '', email: '', avatar: '' }
  showToast(isRtl.value ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')
}

// Category Tabs
const categoryTabs = computed(() => [
  { key: 'All Properties', name: t('allProperties'), icon: 'fa-solid fa-border-all' },
  { key: 'Apartments', name: t('apartments'), icon: 'fa-solid fa-building' },
  { key: 'Villas', name: t('villas'), icon: 'fa-solid fa-house-chimney-window' },
  { key: 'Penthouses', name: t('penthouses'), icon: 'fa-solid fa-crown' },
  { key: 'Waterfront', name: t('waterfront'), icon: 'fa-solid fa-water' },
  { key: 'Off-Plan', name: t('offPlan'), icon: 'fa-solid fa-chart-column' },
  { key: 'Ready to Move', name: t('readyToMove'), icon: 'fa-solid fa-key' }
])

const selectedCategory = ref('All Properties')

// Filter State
const filterState = ref({
  location: 'All',
  propertyType: 'All',
  priceRange: 'Any',
  bedrooms: 'Any',
  lifestyle: 'Any'
})

const sortBy = ref('recommended')

// The 4 Exact Properties from the Mockup Image
const buyProperties = ref([
  {
    id: 1,
    title: 'Luxury 2BR Apartment',
    location: 'Downtown Dubai',
    price: 3200000,
    type: 'Apartment',
    beds: 2,
    baths: 2,
    sqft: '1,245',
    matchScore: 98,
    isOffPlan: false,
    image: '/images/photo-1600210492486-724fe5c67fb0.jfif',
    description: 'Ultra-luxury high-floor apartment with panoramic views of Burj Khalifa and the Dubai Fountain.'
  },
  {
    id: 2,
    title: 'Modern Villa with Private Pool',
    location: 'Arabian Ranches 3',
    price: 5800000,
    type: 'Villa',
    beds: 4,
    baths: 5,
    sqft: '3,412',
    matchScore: 96,
    isOffPlan: false,
    image: '/images/photo-1600585154340-be6161a56a0c.avif',
    description: 'Immaculate family villa with private illuminated pool, landscaped gardens, and smart home automation.'
  },
  {
    id: 3,
    title: 'Waterfront Apartment',
    location: 'Dubai Harbour',
    price: 4150000,
    type: 'Apartment',
    beds: 2,
    baths: 3,
    sqft: '1,892',
    matchScore: 94,
    isOffPlan: true,
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    description: 'Exclusive waterfront residence offering direct marina views, private beach access, and yacht berths.'
  },
  {
    id: 4,
    title: 'Exclusive Penthouse',
    location: 'Palm Jumeirah',
    price: 12500000,
    type: 'Penthouse',
    beds: 5,
    baths: 6,
    sqft: '5,200',
    matchScore: 92,
    isOffPlan: false,
    image: '/images/photo-1512917774080-9991f1c4c750.jfif',
    description: 'Signature rooftop penthouse commanding 360-degree ocean views and private sky deck on Palm Jumeirah.'
  }
])

const formatPrice = (price) => {
  const num = Number(price) || 0
  return isRtl.value ? `${num.toLocaleString()} درهم` : `AED ${num.toLocaleString()}`
}

const onImgError = (e) => {
  e.target.src = '/images/photo-1512917774080-9991f1c4c750.jfif'
}

const selectCategory = (catKey) => {
  selectedCategory.value = catKey
}

const filterByLocation = (loc) => {
  filterState.value.location = loc
  const el = document.querySelector('.buy-main-catalog')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const applyFilters = () => {
  showToast(isRtl.value ? 'تم تطبيق نتائج البحث' : 'Filters applied!')
}

const displayProperties = computed(() => {
  let list = [...buyProperties.value]

  if (selectedCategory.value !== 'All Properties') {
    const cat = selectedCategory.value.toLowerCase()
    if (cat.includes('apartment')) list = list.filter(p => p.type === 'Apartment')
    else if (cat.includes('villa')) list = list.filter(p => p.type === 'Villa')
    else if (cat.includes('penthouse')) list = list.filter(p => p.type === 'Penthouse')
    else if (cat.includes('off-plan')) list = list.filter(p => p.isOffPlan === true)
    else if (cat.includes('ready')) list = list.filter(p => p.isOffPlan === false)
  }

  if (filterState.value.location && filterState.value.location !== 'All') {
    const loc = filterState.value.location.toLowerCase()
    list = list.filter(p => p.location.toLowerCase().includes(loc))
  }

  if (sortBy.value === 'price-asc') {
    list.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    list.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'ai-match') {
    list.sort((a, b) => b.matchScore - a.matchScore)
  }

  return list.length ? list : buyProperties.value
})

const openDetails = (prop) => {
  selectedPropForModal.value = prop
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

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

const handleClickOutside = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    profileMenuOpen.value = false
  }
}

const loadUserProfile = async () => {
  try {
    const current = authService.getCurrentUser()
    if (current) {
      user.value = {
        name: current.name || '',
        email: current.email || '',
        avatar: current.avatar || ''
      }
    }
  } catch (err) {
    console.warn('Error fetching user profile:', err)
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  loadUserProfile()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ============================================================
   BUY PAGE - EXACT HIGH-FIDELITY DESIGN SYSTEM
   ============================================================ */

.buy-page-wrapper {
  min-height: 100vh;
  background-color: #070d19;
  color: #f1f5f9;
  position: relative;
  overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

[dir="rtl"] .buy-page-wrapper {
  font-family: 'Cairo', 'Tajawal', 'Plus Jakarta Sans', sans-serif;
}

/* ==================== HERO SECTION ==================== */
.buy-hero-section {
  position: relative;
  min-height: 480px;
  padding: 110px 48px 36px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(180deg, rgba(7, 13, 25, 0.155) 0%, rgba(7, 13, 25, 0.85) 75%, #070d19 100%),
              url('/images/buy-hero-bg.jpg') center top / cover no-repeat;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.hero-watermark-quote {
  position: absolute;
  top: 95px;
  right: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 1.1rem;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
}

[dir="rtl"] .hero-watermark-quote {
  right: auto;
  left: 48px;
  align-items: flex-start;
}

.quote-accent {
  color: rgba(0, 210, 255, 0.7);
  font-weight: 600;
}

.buy-hero-content-wrap {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: relative;
  z-index: 2;
}

.buy-hero-top-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.hero-title-col {
  flex: 1;
  min-width: 320px;
  max-width: 650px;
}

.buy-sale-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(13, 22, 44, 0.85);
  border: 1px solid rgba(0, 210, 255, 0.35);
  padding: 5px 14px;
  border-radius: 30px;
  color: #00d2ff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
  backdrop-filter: blur(8px);
}

.buy-hero-headline {
  font-size: clamp(2.2rem, 3.8vw, 3.2rem);
  font-weight: 800;
  line-height: 1.15;
  color: #ffffff;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.headline-gradient {
  background: linear-gradient(135deg, #00d2ff 0%, #38bdf8 60%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.buy-hero-subtitle {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.55;
  margin: 0;
}

/* 3 Highlight Badges (Right Column) */
.hero-stats-col {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(13, 22, 44, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.highlight-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  flex-shrink: 0;
}

.highlight-text-box {
  display: flex;
  flex-direction: column;
}

.highlight-text-box strong {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.highlight-text-box span {
  font-size: 0.68rem;
  color: #94a3b8;
}

/* ==================== SEARCH BAR ==================== */
.buy-search-bar-wrap {
  width: 100%;
}

.buy-search-bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr) auto;
  gap: 12px;
  align-items: center;
  background: rgba(13, 22, 44, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-radius: 16px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
}

.search-field-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.search-field-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 5px;
}

.search-field-label i {
  color: #00d2ff;
  font-size: 0.72rem;
}

.search-input-inner {
  position: relative;
  display: flex;
  align-items: center;
}

.search-select {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 7px 28px 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[dir="rtl"] .search-select {
  padding: 7px 10px 7px 28px;
}

.search-select option {
  background: #0d172e;
  color: #ffffff;
}

.select-chevron {
  position: absolute;
  right: 10px;
  color: #64748b;
  font-size: 0.65rem;
  pointer-events: none;
}

[dir="rtl"] .select-chevron {
  right: auto;
  left: 10px;
}

.btn-search-properties {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #0072ff 0%, #00d2ff 100%);
  color: #ffffff;
  border: none;
  padding: 11px 22px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 114, 255, 0.4);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-search-properties:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 210, 255, 0.5);
}

/* ==================== MAIN CATALOG ==================== */
.buy-main-catalog {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px 48px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Category Pills Bar */
.category-tabs-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-tabs-bar::-webkit-scrollbar {
  display: none;
}

.cat-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(13, 22, 44, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 7px 16px;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.cat-tab-btn i {
  font-size: 0.75rem;
}

.cat-tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.cat-tab-btn.active {
  background: #0072ff;
  border-color: #0072ff;
  color: #ffffff;
}

/* Catalog Header Bar */
.catalog-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}

.properties-count-text {
  font-size: 0.9rem;
  color: #94a3b8;
}

.properties-count-text strong {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
}

.header-tools-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-mode-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(13, 22, 44, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 3px;
}

.btn-view-toggle {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-toggle.active {
  background: #0072ff;
  color: #ffffff;
}

.sort-dropdown-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  background: rgba(13, 22, 44, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f1f5f9;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 28px 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  outline: none;
}

[dir="rtl"] .sort-select {
  padding: 6px 12px 6px 28px;
}

.sort-chevron {
  position: absolute;
  right: 10px;
  color: #64748b;
  font-size: 0.65rem;
  pointer-events: none;
}

[dir="rtl"] .sort-chevron {
  right: auto;
  left: 10px;
}

/* ==================== CONTENT LAYOUT ==================== */
.buy-content-layout {
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: 20px;
  align-items: start;
}

/* Exactly 4 Cards Grid Side-by-Side */
.buy-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

@media (max-width: 1280px) {
  .buy-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .buy-cards-grid {
    grid-template-columns: 1fr;
  }
}

/* Property Card */
.buy-prop-card {
  background: rgba(13, 22, 44, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.buy-prop-card:hover {
  transform: translateY(-3px);
  border-color: rgba(0, 210, 255, 0.35);
  box-shadow: 0 10px 25px rgba(0, 210, 255, 0.12), 0 4px 14px rgba(0, 0, 0, 0.4);
}

.card-thumb-wrap {
  position: relative;
  height: 155px;
  overflow: hidden;
}

.card-thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.buy-prop-card:hover .card-thumb-wrap img {
  transform: scale(1.06);
}

.badge-ai-match {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 114, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
}

[dir="rtl"] .badge-ai-match {
  left: auto;
  right: 8px;
}

.btn-card-fav {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(13, 22, 44, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

[dir="rtl"] .btn-card-fav {
  right: auto;
  left: 8px;
}

.btn-card-fav:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.btn-card-fav.saved {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
  color: #ef4444;
}

.badge-status-chip {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(13, 22, 44, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  font-size: 0.62rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
}

[dir="rtl"] .badge-status-chip {
  left: auto;
  right: 8px;
}

.badge-status-chip i {
  color: #00d2ff;
  font-size: 0.6rem;
}

.card-body {
  padding: 13px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-location {
  font-size: 0.72rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.card-location i {
  color: #00d2ff;
  font-size: 0.68rem;
}

.card-price {
  font-size: 1.05rem;
  font-weight: 800;
  color: #00d2ff;
  margin-top: 2px;
}

.card-specs-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 2px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.68rem;
  color: #94a3b8;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.spec-item i {
  color: #38bdf8;
  font-size: 0.68rem;
}

.btn-view-details {
  margin-top: 5px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 7px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-details:hover {
  background: rgba(0, 210, 255, 0.15);
  border-color: rgba(0, 210, 255, 0.4);
  color: #00d2ff;
}

.btn-view-details i {
  font-size: 0.65rem;
}

/* ==================== SIDEBAR WIDGETS ==================== */
.buy-sidebar-widgets {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-widget-card {
  background: rgba(13, 22, 44, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
}

.text-cyan {
  color: #00d2ff;
}

.widget-link {
  font-size: 0.72rem;
  font-weight: 600;
  color: #00d2ff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.widget-items-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.widget-item-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.widget-item-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(0, 210, 255, 0.3);
}

.item-thumb {
  width: 48px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc {
  font-size: 0.65rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-arrow {
  color: #64748b;
  font-size: 0.68rem;
  margin-right: 4px;
}

[dir="rtl"] .item-arrow {
  margin-right: 0;
  margin-left: 4px;
}

/* ==================== WHY BUY BANNER ==================== */
.why-buy-banner {
  background: linear-gradient(135deg, rgba(13, 22, 46, 0.95) 0%, rgba(9, 16, 34, 0.98) 100%);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 16px;
  padding: 22px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 22px;
}

.why-buy-left {
  flex: 1;
  min-width: 300px;
}

.why-buy-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 16px;
}

.why-buy-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 900px) {
  .why-buy-features {
    grid-template-columns: repeat(2, 1fr);
  }
}

.why-feat-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.feat-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.feat-text-box strong {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  display: block;
}

.feat-text-box span {
  font-size: 0.68rem;
  color: #94a3b8;
  line-height: 1.3;
  margin-top: 2px;
  display: block;
}

.why-buy-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.btn-start-buying {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0072ff 0%, #00d2ff 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 18px rgba(0, 114, 255, 0.4);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-start-buying:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 210, 255, 0.5);
}

.cta-subtext {
  font-size: 0.68rem;
  color: #64748b;
  margin: 0;
}

/* ==================== TOAST ==================== */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(13, 22, 44, 0.95);
  border: 1px solid rgba(0, 210, 255, 0.4);
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

[dir="rtl"] .toast-notification {
  right: auto;
  left: 24px;
}

.toast-notification.visible {
  transform: translateY(0);
  opacity: 1;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1100px) {
  .buy-content-layout {
    grid-template-columns: 1fr;
  }

  .buy-sidebar-widgets {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .buy-search-bar {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .buy-hero-section {
    padding: 100px 20px 30px;
  }

  .buy-main-catalog {
    padding: 20px 20px 50px;
  }

  .buy-sidebar-widgets {
    grid-template-columns: 1fr;
  }

  .why-buy-features {
    grid-template-columns: 1fr;
  }
}

/* ==================== LIGHT MODE ==================== */
[data-theme="light"] .buy-page-wrapper {
  background-color: #f8fafc;
  color: #0f172a;
}

[data-theme="light"] .buy-hero-section {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0) 0%, rgb(248, 250, 252) 100%),
              url('/images/buy-hero-bg.jpg') center top / cover no-repeat;
  border-bottom-color: #e2e8f0;
}

[data-theme="light"] .buy-hero-headline {
  color: #0f172a;
}

[data-theme="light"] .buy-hero-subtitle {
  color: #475569;
}

[data-theme="light"] .hero-watermark-quote {
  color: rgba(15, 23, 42, 0.35);
}

[data-theme="light"] .buy-sale-badge {
  background: #ffffff;
  border-color: rgba(2, 132, 199, 0.3);
  color: #0284c7;
}

[data-theme="light"] .highlight-item {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

[data-theme="light"] .highlight-text-box strong {
  color: #0f172a;
}

[data-theme="light"] .highlight-text-box span {
  color: #64748b;
}

[data-theme="light"] .buy-search-bar {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

[data-theme="light"] .search-field-label {
  color: #475569;
}

[data-theme="light"] .search-select {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #0f172a;
}

[data-theme="light"] .search-select option {
  background: #ffffff;
  color: #0f172a;
}

[data-theme="light"] .cat-tab-btn {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #475569;
}

[data-theme="light"] .cat-tab-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

[data-theme="light"] .cat-tab-btn.active {
  background: #0072ff;
  border-color: #0072ff;
  color: #ffffff;
}

[data-theme="light"] .properties-count-text strong {
  color: #0f172a;
}

[data-theme="light"] .view-mode-pill,
[data-theme="light"] .sort-select {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #0f172a;
}

[data-theme="light"] .buy-prop-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

[data-theme="light"] .card-title {
  color: #0f172a;
}

[data-theme="light"] .card-price {
  color: #0284c7;
}

[data-theme="light"] .card-specs-row {
  border-top-color: #f1f5f9;
  color: #64748b;
}

[data-theme="light"] .btn-view-details {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #0f172a;
}

[data-theme="light"] .btn-view-details:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0284c7;
}

[data-theme="light"] .sidebar-widget-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

[data-theme="light"] .widget-title {
  color: #0f172a;
}

[data-theme="light"] .widget-item-card {
  background: #f8fafc;
  border-color: #e2e8f0;
}

[data-theme="light"] .item-title {
  color: #0f172a;
}

[data-theme="light"] .why-buy-banner {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
}

[data-theme="light"] .why-buy-title {
  color: #0f172a;
}

[data-theme="light"] .feat-text-box strong {
  color: #0f172a;
}
</style>
