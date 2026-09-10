<template>
  <div class="map-page-wrapper">
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
          <router-link class="nav-item" to="/home#featured">Rent</router-link>
          <router-link class="nav-item" to="/home#featured">New Projects</router-link>
          <router-link class="nav-item active" to="/map">Interactive Map <i class="fa-solid fa-map-location-dot" style="font-size:0.75rem; color:var(--accent-cyan, #00d2ff); margin-left:3px;"></i></router-link>
          <router-link class="nav-item" to="/home#areas">Areas</router-link>
          <router-link class="nav-item" to="/home#about">About Us</router-link>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <button class="btn-list-property" type="button" @click="showToast('Property listing portal opening soon.')">
            List Your Property <span class="plus-sign">+</span>
          </button>
          
          <button class="icon-action-btn" type="button" aria-label="Favorites" @click="showToast('You have ' + (favorites?.size || 0) + ' saved properties.')">
            <i class="fa-regular fa-heart"></i>
          </button>

          <div class="user-profile-menu-container" ref="profileDropdownRef">
            <div class="user-profile-menu" @click="toggleProfileMenu">
              <img
                class="header-avatar"
                :src="userAvatarUrl"
                :alt="user.name || 'User'"
                @error="onAvatarError"
              >
              <i class="fa-solid fa-chevron-down profile-arrow" :class="{ 'rotate-180': profileMenuOpen }"></i>
            </div>

            <!-- Interactive User Profile Dropdown -->
            <div v-if="profileMenuOpen" class="profile-dropdown-box">
              <div class="dropdown-user-header">
                <img
                  class="dropdown-avatar"
                  :src="userAvatarUrl"
                  :alt="user.name || 'User'"
                  @error="onAvatarError"
                >
                <div class="dropdown-user-info">
                  <strong class="dropdown-user-name">{{ displayName }}</strong>
                  <span class="dropdown-user-email">{{ displayEmail }}</span>
                  <span class="dropdown-user-badge">
                    <i class="fa-solid fa-circle-check"></i> {{ isLoggedIn ? 'Verified Member' : 'Guest Account' }}
                  </span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-menu-list">
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="showToast('Profile management portal opening soon.')">
                  <i class="fa-regular fa-user"></i>
                  <span>My Profile</span>
                </button>
                <router-link to="/home#featured" class="dropdown-menu-item" style="text-decoration:none;">
                  <i class="fa-regular fa-heart"></i>
                  <span>Saved Properties ({{ favorites?.size || 0 }})</span>
                </router-link>
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="showToast('Your active search filters are saved.')">
                  <i class="fa-solid fa-sliders"></i>
                  <span>Preferences</span>
                </button>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-footer-actions">
                <button v-if="isLoggedIn" class="dropdown-logout-btn" @click="handleLogout">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Log Out</span>
                </button>
                <div v-else class="dropdown-guest-actions">
                  <button class="dropdown-login-btn" @click="router.push('/login')">Log In</button>
                  <button class="dropdown-signup-btn" @click="router.push('/register')">Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ==================== HERO / TITLE SECTION ==================== -->
    <section class="map-hero-section">
      <div class="map-hero-container">
        <div class="map-title-area">
          <div class="map-tag">
            <i class="fa-solid fa-satellite-dish"></i>
            <span>AI-Powered Geospatial Radar</span>
          </div>
          <h1 class="map-title">
            Smart Interactive <span class="highlight">Dubai Real Estate Map</span>
          </h1>
          <p class="map-subtitle">
            Explore Dubai's most prestigious villas, penthouses, and waterfront residences on the interactive map with real-time AI compatibility scoring.
          </p>
        </div>
        <div class="map-quick-stats">
          <div class="stat-item"><span class="stat-num cyan">12</span><span class="stat-lbl">Prime Landmarks</span></div>
          <div class="stat-sep"></div>
          <div class="stat-item"><span class="stat-num emerald">98%</span><span class="stat-lbl">AI Precision</span></div>
          <div class="stat-sep"></div>
          <div class="stat-item"><span class="stat-num">0.4 km</span><span class="stat-lbl">Nearest Property</span></div>
        </div>
      </div>
    </section>

    <!-- ==================== FILTER CONTROLS BAR ==================== -->
    <section class="map-filter-section">
      <div class="filter-bar-card">
        <div class="filter-groups">
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-location-dot filter-icon"></i>
            <select id="filter-area" class="filter-select" aria-label="Select District">
              <option value="all">All Dubai Districts</option>
              <option value="Downtown Dubai">Downtown Dubai</option>
              <option value="Palm Jumeirah">Palm Jumeirah</option>
              <option value="Dubai Marina">Dubai Marina</option>
              <option value="Business Bay">Business Bay</option>
              <option value="Dubai Hills Estate">Dubai Hills Estate</option>
              <option value="Arabian Ranches">Arabian Ranches</option>
              <option value="DIFC">DIFC</option>
              <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
              <option value="Bluewaters Island">Bluewaters Island</option>
              <option value="Dubai Silicon Oasis">Dubai Silicon Oasis</option>
              <option value="Jumeirah Village Circle">Jumeirah Village Circle</option>
              <option value="Jumeirah Beach Residence">Jumeirah Beach Residence</option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-building filter-icon"></i>
            <select id="filter-type" class="filter-select" aria-label="Property Type">
              <option value="all">All Property Types</option>
              <option value="Penthouse">Luxury Penthouse</option>
              <option value="Villa">Seafront Villa</option>
              <option value="Apartment">Modern Apartment</option>
              <option value="Townhouse">Smart Townhouse</option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-coins filter-icon"></i>
            <select id="filter-price" class="filter-select" aria-label="Price Range">
              <option value="all">All Price Ranges</option>
              <option value="under-5m">Under AED 5M</option>
              <option value="5m-10m">AED 5M - 10M</option>
              <option value="above-10m">Above AED 10M</option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-wand-magic-sparkles filter-icon"></i>
            <select id="filter-vibe" class="filter-select" aria-label="Lifestyle Vibe">
              <option value="all">All Lifestyle Vibes</option>
              <option value="Waterfront / Sea View">Waterfront &amp; Sea View</option>
              <option value="Sky High Luxury">Sky-High Penthouse</option>
              <option value="High ROI Investment">High ROI Investment</option>
              <option value="Green Family Oasis">Green Family Community</option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
        </div>
        <div class="filter-actions">
          <button id="btn-scan-map" class="btn-scan-map" type="button">
            <i class="fa-solid fa-radar"></i>
            <span>Scan Map with AI</span>
          </button>
          <button id="btn-reset-filters" class="btn-reset-filters" type="button" title="Reset All Filters">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ==================== MAIN MAP & SIDEBAR ==================== -->
    <main class="map-content-layout">
      <aside class="map-sidebar-panel">
        <div class="sidebar-header">
          <div class="sidebar-title-row">
            <div class="sidebar-title-info">
              <h2 class="sidebar-heading">Properties in Range</h2>
              <span id="nearby-count-badge" class="nearby-count-badge">12 Available</span>
            </div>
            <select id="sort-select" class="sort-select" aria-label="Sort properties">
              <option value="ai-match">❆ Highest AI Match</option>
              <option value="distance">📍 Nearest Distance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <div class="sidebar-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input id="sidebar-search-input" class="sidebar-search-input" type="text" placeholder="Search by district, building, or lifestyle...">
          </div>
        </div>
        <div id="sidebar-properties-list" class="properties-scroll-list"></div>
      </aside>

      <section class="map-view-panel">
        <div id="leaflet-map"></div>
        <div class="map-layer-selector">
          <button class="layer-btn active" data-layer="day" type="button"><i class="fa-solid fa-sun"></i><span>Day Luxury</span></button>
          <button class="layer-btn" data-layer="satellite" type="button"><i class="fa-solid fa-earth-americas"></i><span>Satellite</span></button>
          <button class="layer-btn" data-layer="dark" type="button"><i class="fa-solid fa-moon"></i><span>Night Mode</span></button>
        </div>
        <div class="map-floating-controls">
          <button id="btn-my-location" class="map-control-btn btn-my-location" type="button" title="تحديد موقعي الحالي والمسافات (My Location)">
            <i class="fa-solid fa-location-crosshairs"></i>
          </button>
          <button id="btn-locate" class="map-control-btn" type="button" title="Locate Center Area"><i class="fa-solid fa-crosshairs"></i></button>
          <button id="btn-reset-view" class="map-control-btn" type="button" title="Reset Map View"><i class="fa-solid fa-compress"></i></button>
        </div>

        <!-- Floating Directions & Route Panel -->
        <div id="map-route-card" class="map-route-card" style="display: none;">
          <div class="route-card-header">
            <div class="route-header-title">
              <i class="fa-solid fa-diamond-turn-right route-icon"></i>
              <span>تخطيط الاتجاهات والمسار</span>
            </div>
            <button id="btn-close-route" class="btn-close-route" type="button" title="إلغاء المسار">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="route-card-content">
            <div class="route-prop-name" id="route-prop-title">--</div>
            <div class="route-stats-grid">
              <div class="route-stat-box">
                <div class="stat-icon-wrap"><i class="fa-solid fa-route"></i></div>
                <div class="stat-info">
                  <span class="stat-val" id="route-distance-val">-- كم</span>
                  <span class="stat-lbl">المسافة منك</span>
                </div>
              </div>
              <div class="route-stat-box">
                <div class="stat-icon-wrap time"><i class="fa-solid fa-car-side"></i></div>
                <div class="stat-info">
                  <span class="stat-val" id="route-duration-val">-- دقيقة</span>
                  <span class="stat-lbl">وقت القيادة</span>
                </div>
              </div>
            </div>
            <div class="route-actions-wrap">
              <a id="btn-gmaps-navigate" href="#" target="_blank" class="btn-open-gmaps">
                <i class="fa-solid fa-map-location-dot"></i>
                <span>ملاحة عبر خرائط Google</span>
                <i class="fa-solid fa-arrow-up-right-from-square external-icon"></i>
              </a>
            </div>
          </div>
        </div>

        <div id="radar-sweep-overlay" class="radar-sweep-overlay"><div class="radar-beam"></div></div>
      </section>
    </main>

    <!-- ==================== FOOTER ==================== -->
    <footer class="footer" id="contact">
      <div class="container footer-top">
        <div class="footer-brand">
          <router-link to="/home" class="logo footer-logo">
            <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img footer-logo-img">
            <div class="brand-text footer-brand-text">
              <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
              <span class="brand-badge">AI</span>
            </div>
          </router-link>
          <p class="brand-desc">
            Empowering modern real estate with artificial intelligence, verified luxury listings, and tailored leasing experiences worldwide.
          </p>
          <div class="social-links">
            <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" aria-label="Twitter / X"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>

        <div class="footer-links-col">
          <h4 class="footer-heading">Quick Links</h4>
          <ul>
            <li><router-link to="/home">Home</router-link></li>
            <li><router-link to="/home#about">Services</router-link></li>
            <li><router-link to="/home#about">About Us</router-link></li>
            <li><router-link to="/home#testimonials">Testimonials</router-link></li>
            <li><router-link to="/home#contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-links-col">
          <h4 class="footer-heading">Support</h4>
          <ul>
            <li><a href="#" @click.prevent="showToast('Help Center is coming soon')">Help Center</a></li>
            <li><a href="#" @click.prevent="showToast('Safety & Security information')">Safety &amp; Security</a></li>
            <li><a href="#" @click.prevent="showToast('Terms & Conditions')">Terms &amp; Conditions</a></li>
            <li><a href="#" @click.prevent="showToast('Privacy Policy')">Privacy Policy</a></li>
          </ul>
        </div>

        <div class="footer-links-col">
          <h4 class="footer-heading">Contact</h4>
          <ul class="contact-info-list">
            <li>
              <i class="fa-solid fa-location-dot"></i>
              <span>742 Evergreen Blvd, Beverly Hills, CA</span>
            </li>
            <li>
              <i class="fa-solid fa-envelope"></i>
              <span>contact@vibelocate.ai</span>
            </li>
            <li>
              <i class="fa-solid fa-phone"></i>
              <span>+1 (800) 456-7890</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-container">
          <p>&copy; 2026 VibeLocate AI. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- ==================== PROPERTY DETAILS MODAL ==================== -->
    <div id="property-details-modal" class="map-modal-backdrop" style="display: none;">
      <div class="map-modal-container">
        <button id="modal-close-btn" class="modal-close-btn" type="button" aria-label="Close modal"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-hero-gallery"><img id="modal-main-img" class="modal-main-img" src="" alt="Property Gallery"></div>
        <div class="modal-body-content">
          <div class="modal-price-row">
            <div>
              <div id="modal-prop-price" class="modal-price-val">AED 0</div>
              <div id="modal-prop-location" style="font-size:0.85rem;color:#64748b;margin-top:4px;"></div>
            </div>
            <div id="modal-ai-score-badge" class="prop-ai-pill" style="font-size:0.85rem;padding:6px 14px;">❆ 98% AI Match</div>
          </div>
          <h2 id="modal-prop-title" style="font-family:var(--font-heading);font-size:1.4rem;color:#0f172a;">Property Title</h2>
          <div class="modal-specs-grid">
            <div class="modal-spec-card"><i class="fa-solid fa-bed"></i><span id="modal-spec-beds" class="val">0</span><span class="lbl">Bedrooms</span></div>
            <div class="modal-spec-card"><i class="fa-solid fa-bath"></i><span id="modal-spec-baths" class="val">0</span><span class="lbl">Bathrooms</span></div>
            <div class="modal-spec-card"><i class="fa-solid fa-ruler-combined"></i><span id="modal-spec-sqft" class="val">0</span><span class="lbl">Sqft Area</span></div>
            <div class="modal-spec-card"><i class="fa-solid fa-compass"></i><span id="modal-spec-vibe" class="val" style="font-size:0.75rem;">Lifestyle</span><span class="lbl">Vibe Match</span></div>
          </div>
          <div class="modal-ai-box">
            <i class="fa-solid fa-brain"></i>
            <div>
              <strong style="color:#0284c7;display:block;font-size:0.9rem;margin-bottom:4px;">VibeLocate AI Smart Valuation &amp; Lifestyle Insight:</strong>
              <p id="modal-ai-summary-text"></p>
            </div>
          </div>
          <div class="modal-actions-row">
            <button class="modal-btn-contact" type="button" @click="showAlert('Connecting you with the verified luxury consultant in Dubai...')"><i class="fa-solid fa-phone"></i><span>Contact Verified Agent</span></button>
            <button id="modal-btn-directions" class="modal-btn-directions" type="button"><i class="fa-solid fa-diamond-turn-right"></i><span>تخطيط الاتجاهات والمسار</span></button>
            <button class="modal-btn-share" type="button" @click="showAlert('Property link copied to clipboard!')"><i class="fa-solid fa-share-nodes"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div id="map-toast" class="map-toast"><i class="fa-solid fa-circle-check"></i><span id="toast-message">Ready</span></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { propertyService } from '../services/propertyService'

const router = useRouter()

// Navbar states
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)
const favorites = ref(new Set())

// User state
const user = ref({
  name: '',
  email: '',
  avatar: ''
})

const isLoggedIn = computed(() => {
  return authService.isAuthenticated() || !!(user.value.email || user.value.name)
})

const displayName = computed(() => {
  return user.value.name || (user.value.email ? user.value.email.split('@')[0] : 'Guest User')
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

const onAvatarError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const handleLogout = async () => {
  profileMenuOpen.value = false
  await authService.logout()
  localStorage.removeItem('auth_user')
  sessionStorage.removeItem('auth_user')
  localStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_token')
  user.value = { name: '', email: '', avatar: '' }
  showToast('Logged out successfully.')
  setTimeout(() => {
    router.push('/')
  }, 500)
}

const parseUserData = (raw) => {
  if (!raw) return null
  const profile = raw?.data?.user || raw?.data || raw?.user || raw
  const name = profile.name || profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username || ''
  const email = profile.email || ''
  const avatar = profile.avatar || profile.profile_photo_url || profile.picture || profile.photo || profile.image || ''
  if (name || email || avatar) {
    return { name, email, avatar }
  }
  return null
}

const loadUserFromStorage = () => {
  const rawLocal = localStorage.getItem('auth_user') || localStorage.getItem('user')
  const rawSession = sessionStorage.getItem('auth_user') || sessionStorage.getItem('user')
  if (rawLocal) {
    try {
      const parsed = parseUserData(JSON.parse(rawLocal))
      if (parsed) user.value = { ...user.value, ...parsed }
    } catch {}
  } else if (rawSession) {
    try {
      const parsed = parseUserData(JSON.parse(rawSession))
      if (parsed) user.value = { ...user.value, ...parsed }
    } catch {}
  }
}

const handleDocumentClick = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    profileMenuOpen.value = false
  }
}

const showAlert = (msg) => alert(msg)
const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

const STATIC_FALLBACK_PROPERTIES = [
  { id: 1, title: 'The Royal Atlantis Sky Villa', area: 'Palm Jumeirah', type: 'Penthouse', priceAed: 18500000, priceFormatted: 'AED 18,500,000', priceShort: '18.5M', period: 'Sale', distanceKm: 0.4, distanceFormatted: '0.4 km away', aiScore: 99, rating: 4.9, beds: 4, baths: 5, sqft: 5420, vibe: 'Waterfront / Sea View', lat: 25.1378, lng: 55.1272, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80', aiSummary: 'Ultra-rare panoramic sea view with private infinity pool and Michelin-star hotel amenities on the Palm crescent.', verified: true },
  { id: 2, title: 'Burj Crown Panorama Penthouse', area: 'Downtown Dubai', type: 'Penthouse', priceAed: 8450000, priceFormatted: 'AED 8,450,000', priceShort: '8.45M', period: 'Yearly', distanceKm: 0.8, distanceFormatted: '0.8 km away', aiScore: 98, rating: 4.9, beds: 3, baths: 4, sqft: 2850, vibe: 'Sky High Luxury', lat: 25.1972, lng: 55.2744, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80', aiSummary: 'Unobstructed direct views of the Burj Khalifa and Dubai Fountain with direct air-conditioned mall link.', verified: true },
  { id: 3, title: 'Marina Gate Waterfront Haven', area: 'Dubai Marina', type: 'Apartment', priceAed: 4450000, priceFormatted: 'AED 4,450,000', priceShort: '4.45M', period: 'Yearly', distanceKm: 1.2, distanceFormatted: '1.2 km away', aiScore: 97, rating: 4.8, beds: 2, baths: 3, sqft: 1750, vibe: 'Waterfront / Sea View', lat: 25.0847, lng: 55.1458, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80', aiSummary: 'Frontline marina promenade residence with 50-meter lap pool, squash courts, and yacht club berths.', verified: true },
  { id: 4, title: 'One Palm Seaside Palace Villa', area: 'Palm Jumeirah', type: 'Villa', priceAed: 24000000, priceFormatted: 'AED 24,000,000', priceShort: '24.0M', period: 'Sale', distanceKm: 1.5, distanceFormatted: '1.5 km away', aiScore: 99, rating: 5.0, beds: 5, baths: 6, sqft: 7100, vibe: 'Waterfront / Sea View', lat: 25.1120, lng: 55.1389, image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80', aiSummary: 'Iconic private beachfront mansion managed by Dorchester Collection with private jetty and beach cinema.', verified: true },
  { id: 5, title: 'The Opus Architectural Suite by Zaha Hadid', area: 'Business Bay', type: 'Apartment', priceAed: 6200000, priceFormatted: 'AED 6,200,000', priceShort: '6.2M', period: 'Sale', distanceKm: 1.9, distanceFormatted: '1.9 km away', aiScore: 96, rating: 4.8, beds: 2, baths: 3, sqft: 2100, vibe: 'High ROI Investment', lat: 25.1889, lng: 55.2662, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', aiSummary: 'Sculptural architectural masterpiece in the financial district offering 9.2% expected rental yield.', verified: true },
  { id: 6, title: 'Dubai Hills Golf Place Signature Villa', area: 'Dubai Hills Estate', type: 'Villa', priceAed: 12800000, priceFormatted: 'AED 12,800,000', priceShort: '12.8M', period: 'Sale', distanceKm: 2.7, distanceFormatted: '2.7 km away', aiScore: 96, rating: 4.9, beds: 6, baths: 7, sqft: 8200, vibe: 'Green Family Oasis', lat: 25.1235, lng: 55.2481, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80', aiSummary: 'Championship 18-hole golf course frontage with expansive private landscaped park and smart home integration.', verified: true },
  { id: 7, title: 'Address Residences Sky View Suite', area: 'Downtown Dubai', type: 'Apartment', priceAed: 7900000, priceFormatted: 'AED 7,900,000', priceShort: '7.9M', period: 'Yearly', distanceKm: 3.1, distanceFormatted: '3.1 km away', aiScore: 98, rating: 4.9, beds: 3, baths: 4, sqft: 2600, vibe: 'Sky High Luxury', lat: 25.2014, lng: 55.2703, image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=900&q=80', aiSummary: 'Connected directly to metro and Dubai Mall with world-famous sky bridge infinity pool overlooking Burj Khalifa.', verified: true },
  { id: 8, title: 'Creek Horizon Twin Towers', area: 'Dubai Creek Harbour', type: 'Apartment', priceAed: 3850000, priceFormatted: 'AED 3,850,000', priceShort: '3.85M', period: 'Yearly', distanceKm: 3.8, distanceFormatted: '3.8 km away', aiScore: 94, rating: 4.7, beds: 2, baths: 2, sqft: 1580, vibe: 'High ROI Investment', lat: 25.1950, lng: 55.3480, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80', aiSummary: 'Prime waterfront promenade overlooking Ras Al Khor flamingo sanctuary and the future landmark skyline.', verified: true },
  { id: 9, title: 'Arabian Ranches III Smart Garden Townhouse', area: 'Arabian Ranches', type: 'Townhouse', priceAed: 3200000, priceFormatted: 'AED 3,200,000', priceShort: '3.2M', period: 'Sale', distanceKm: 4.2, distanceFormatted: '4.2 km away', aiScore: 93, rating: 4.8, beds: 4, baths: 4, sqft: 2950, vibe: 'Green Family Oasis', lat: 25.0560, lng: 55.2810, image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80', aiSummary: 'Serene gated family community featuring lazy river, bicycle tracks, tennis courts, and premier international schools.', verified: true },
  { id: 10, title: 'DIFC Gate Precinct Sky Residence', area: 'DIFC', type: 'Apartment', priceAed: 5900000, priceFormatted: 'AED 5,900,000', priceShort: '5.9M', period: 'Yearly', distanceKm: 4.5, distanceFormatted: '4.5 km away', aiScore: 96, rating: 4.8, beds: 2, baths: 3, sqft: 1950, vibe: 'High ROI Investment', lat: 25.2120, lng: 55.2815, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80', aiSummary: 'Steps from international art galleries and award-winning fine dining inside Dubai International Financial Centre.', verified: true },
  { id: 11, title: 'Bluewaters Island Luxury Sea Residence', area: 'Bluewaters Island', type: 'Apartment', priceAed: 6750000, priceFormatted: 'AED 6,750,000', priceShort: '6.75M', period: 'Yearly', distanceKm: 5.0, distanceFormatted: '5.0 km away', aiScore: 95, rating: 4.9, beds: 3, baths: 3, sqft: 2300, vibe: 'Waterfront / Sea View', lat: 25.0795, lng: 55.1220, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80', aiSummary: 'Exclusive island living at Ain Dubai with private footbridge connecting directly to Jumeirah Beach Residence.', verified: true },
  { id: 12, title: 'Il Primo Opera District Grand Penthouse', area: 'Downtown Dubai', type: 'Penthouse', priceAed: 14200000, priceFormatted: 'AED 14,200,000', priceShort: '14.2M', period: 'Sale', distanceKm: 5.4, distanceFormatted: '5.4 km away', aiScore: 98, rating: 5.0, beds: 4, baths: 5, sqft: 4900, vibe: 'Sky High Luxury', lat: 25.1945, lng: 55.2710, image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80', aiSummary: 'Full-floor residence adjacent to Dubai Opera with private elevator, cigar lounge, and private wellness spa.', verified: true }
]

let currentProperties = [...STATIC_FALLBACK_PROPERTIES]
let mapInstance = null, activeTileLayer = null, markersMap = new Map(), activePropertyId = null
let filteredProperties = [...currentProperties], toastTimeout = null

function formatMapProperty(raw) {
  const priceNum = Number(raw.price) || 0
  const lat = parseFloat(raw.latitude) || 25.14
  const lng = parseFloat(raw.longitude) || 55.22
  const areaName = raw.neighborhood || raw.neighborhood_name || (raw.address ? raw.address.split(',')[0].trim() : 'Dubai')
  const type = raw.property_type || (raw.type_id === 2 ? 'Villa' : raw.type_id === 3 ? 'Penthouse' : raw.type_id === 4 ? 'Townhouse' : 'Apartment')
  const beds = Number(raw.bedrooms || 0)
  const baths = Number(raw.bathrooms || 0)
  const sqft = Math.round(Number(raw.area_sqft || 0))
  const img = raw.primary_image?.image_url || raw.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80'

  // Distance relative to Downtown Dubai [25.1972, 55.2744]
  const dLat = (lat - 25.1972) * 111
  const dLng = (lng - 55.2744) * 100
  const dist = Math.max(0.2, Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10)

  // Price formatting
  const priceFormatted = `AED ${priceNum.toLocaleString()}`
  const priceShort = priceNum >= 1000000 ? `${(priceNum / 1000000).toFixed(2).replace(/\.00$/, '')}M` : `${Math.round(priceNum / 1000)}K`

  // Vibe classification
  let vibe = 'High ROI Investment'
  const lowerTitle = (raw.title || '').toLowerCase()
  const lowerArea = areaName.toLowerCase()
  if (lowerArea.includes('palm') || lowerArea.includes('marina') || lowerArea.includes('beach') || lowerArea.includes('creek')) {
    vibe = 'Waterfront / Sea View'
  } else if (type === 'Penthouse' || lowerTitle.includes('sky') || lowerTitle.includes('luxury')) {
    vibe = 'Sky High Luxury'
  } else if (type === 'Villa' || lowerArea.includes('ranches') || lowerArea.includes('hills') || lowerArea.includes('oasis')) {
    vibe = 'Green Family Oasis'
  }

  const aiScore = 90 + ((raw.id * 7) % 10)

  return {
    id: raw.id,
    title: raw.title || `${type} in ${areaName}`,
    slug: raw.slug || '',
    area: areaName,
    type,
    priceAed: priceNum,
    priceFormatted,
    priceShort,
    period: 'Sale',
    distanceKm: dist,
    distanceFormatted: `${dist} km away`,
    aiScore,
    rating: (4.5 + ((raw.id % 5) * 0.1)).toFixed(1),
    beds,
    baths,
    sqft: sqft || 2200,
    vibe,
    lat,
    lng,
    image: img,
    aiSummary: `Prime ${type.toLowerCase()} in ${areaName} featuring ${beds} bedrooms and high-spec interiors with excellent community amenities.`,
    verified: true
  }
}

async function fetchLiveMapProperties() {
  try {
    const res = await propertyService.getMapProperties()
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      currentProperties = res.data.map(formatMapProperty)
      filteredProperties = [...currentProperties]
      if (mapInstance) {
        renderMarkers(filteredProperties)
        renderSidebarList(filteredProperties)
        const group = window.L.featureGroup(filteredProperties.map(p => markersMap.get(p.id)).filter(Boolean))
        if (group.getLayers().length > 0) {
          mapInstance.fitBounds(group.getBounds().pad(0.15))
        }
      }
      showToast(`Loaded ${currentProperties.length} live properties from VibeLocate API`)
    }
  } catch (err) {
    console.warn('Map API load failed, using fallback properties:', err)
  }
}

const TILE_LAYERS = {
  day: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options: { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', subdomains: 'abc', maxZoom: 19 } },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', options: { attribution: '&copy; Esri, Maxar, Earthstar Geographics', maxZoom: 18 } },
  dark: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options: { attribution: '&copy; OpenStreetMap contributors', subdomains: 'abc', maxZoom: 19 } }
}

function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) { resolve(); return }
    const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(css)
    const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = resolve; document.head.appendChild(script)
  })
}

function initMap() {
  const el = document.getElementById('leaflet-map')
  if (!el || !window.L) return
  const L = window.L
  mapInstance = L.map('leaflet-map', { center: [25.14, 55.22], zoom: 11, zoomControl: false })
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)
  setTileLayer('day')
  renderMarkers(filteredProperties)
  renderSidebarList(filteredProperties)
  mapInstance.on('click', (e) => { if (e.originalEvent.target.id === 'leaflet-map') clearActiveStates() })
}

function setTileLayer(type) {
  const L = window.L, mapEl = document.getElementById('leaflet-map')
  if (!mapInstance || !L) return
  if (activeTileLayer) mapInstance.removeLayer(activeTileLayer)
  const cfg = TILE_LAYERS[type] || TILE_LAYERS.day
  activeTileLayer = L.tileLayer(cfg.url, cfg.options).addTo(mapInstance)
  if (mapEl) mapEl.classList.toggle('dark-map-tiles', type === 'dark')
  document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.layer === type))
}

function markerHtml(property, isActive) {
  const cls = isActive ? 'active-pin' : ''
  return `<div class="custom-radar-marker ${cls}" data-id="${property.id}"><div class="marker-radar-ring"></div><div class="marker-inner-wrap"><div class="marker-pin-icon"><i class="fa-solid fa-location-dot"></i></div><span class="marker-price-tag">${property.priceShort}</span></div></div>`
}

function createIcon(prop, isActive = false) {
  return window.L.divIcon({ className: 'radar-marker-container', html: markerHtml(prop, isActive), iconSize: [80, 42], iconAnchor: [40, 21] })
}

function popupHtml(p) {
  return `<div class="popup-prop-card"><div class="popup-img-wrap"><img src="${p.image}" alt="${p.title}"><div class="popup-ai-badge">❆ ${p.aiScore}% Match</div></div><div class="popup-body"><div class="popup-price">${p.priceFormatted}</div><div class="popup-title">${p.title}</div><div class="popup-location"><i class="fa-solid fa-location-dot" style="color:#0284c7"></i> ${p.area}, Dubai</div><div class="popup-specs"><span><i class="fa-solid fa-bed"></i> ${p.beds} Beds</span><span><i class="fa-solid fa-bath"></i> ${p.baths} Baths</span><span><i class="fa-solid fa-ruler-combined"></i> ${p.sqft.toLocaleString()} sqft</span></div><div class="popup-btn-row"><button class="popup-btn-detail" onclick="window.__vibeMap.openPropertyModal(${p.id})"><span>Explore</span><i class="fa-solid fa-arrow-right"></i></button><button class="popup-btn-route" onclick="window.__vibeMap.showRouteCard(${p.id})"><i class="fa-solid fa-diamond-turn-right"></i><span>اتجاهات</span></button></div></div></div>`
}

function renderMarkers(props) {
  const L = window.L
  markersMap.forEach(m => m.remove()); markersMap.clear()
  props.forEach(p => {
    const marker = L.marker([p.lat, p.lng], { icon: createIcon(p, p.id === activePropertyId) }).addTo(mapInstance)
    marker.bindPopup(L.popup({ offset: [0, -18], closeButton: true, autoPan: true, autoPanPadding: [30, 30], className: 'custom-glass-popup' }).setContent(popupHtml(p)))
    marker.on('click', () => selectProperty(p.id, true))
    markersMap.set(p.id, marker)
  })
}

function cardHtml(p) {
  const isActive = p.id === activePropertyId ? 'active' : ''
  return `<div class="map-prop-card ${isActive}" id="prop-card-${p.id}" onclick="window.__vibeMap.selectProperty(${p.id})"><div class="prop-thumb-wrap"><img class="prop-thumb-img" src="${p.image}" alt="${p.title}"><div class="prop-distance-chip"><i class="fa-solid fa-location-arrow"></i> ${p.distanceFormatted}</div></div><div class="prop-card-details"><div class="prop-card-top"><span class="prop-ai-pill">❆ ${p.aiScore}% Match</span><span class="prop-rating"><i class="fa-solid fa-star"></i> ${p.rating}</span></div><div class="prop-card-title">${p.title}</div><div class="prop-card-location"><i class="fa-solid fa-location-dot" style="color:#0284c7"></i> ${p.area}</div><div class="prop-card-price">${p.priceFormatted} <span>/${p.period.toLowerCase()}</span></div><div class="prop-card-specs"><span><i class="fa-solid fa-bed"></i> ${p.beds} Beds</span><span><i class="fa-solid fa-bath"></i> ${p.baths} Baths</span><span><i class="fa-solid fa-ruler-combined"></i> ${p.sqft.toLocaleString()} sqft</span></div></div></div>`
}

function renderSidebarList(props) {
  const container = document.getElementById('sidebar-properties-list')
  const countBadge = document.getElementById('nearby-count-badge')
  if (!container) return
  if (countBadge) countBadge.textContent = `${props.length} Available`
  container.innerHTML = props.length === 0
    ? `<div class="sidebar-empty-state"><i class="fa-solid fa-map-location-dot"></i><p style="font-weight:600;color:#0f172a;">No properties match your filters</p><p style="font-size:0.78rem;color:#64748b;">Try adjusting filters.</p><button class="btn-scan-map" style="height:36px;font-size:0.8rem;margin-top:6px;" onclick="window.__vibeMap.resetAllFilters()">Reset All Filters</button></div>`
    : props.map(cardHtml).join('')
}

function selectProperty(id, triggeredByMarker = false) {
  const prop = currentProperties.find(p => p.id === id); if (!prop) return
  activePropertyId = id
  document.querySelectorAll('.map-prop-card').forEach(c => c.classList.toggle('active', c.id === `prop-card-${id}`))
  const activeCard = document.getElementById(`prop-card-${id}`)
  if (activeCard && !triggeredByMarker) activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  markersMap.forEach((marker, mId) => { const p = currentProperties.find(x => x.id === mId); if (p) marker.setIcon(createIcon(p, mId === id)) })
  const marker = markersMap.get(id)
  if (marker && mapInstance) { mapInstance.flyTo([prop.lat, prop.lng], 14, { duration: 1.2, easeLinearity: 0.25 }); setTimeout(() => marker.openPopup(), 400) }
}

function clearActiveStates() {
  activePropertyId = null
  document.querySelectorAll('.map-prop-card').forEach(c => c.classList.remove('active'))
  markersMap.forEach((marker, mId) => { const p = currentProperties.find(x => x.id === mId); if (p) marker.setIcon(createIcon(p, false)) })
}

function sortProperties() {
  const sortVal = document.getElementById('sort-select')?.value || 'ai-match'
  filteredProperties.sort((a, b) => {
    if (sortVal === 'ai-match') return b.aiScore - a.aiScore
    if (sortVal === 'price-asc') return a.priceAed - b.priceAed
    if (sortVal === 'price-desc') return b.priceAed - a.priceAed
    if (sortVal === 'distance') return a.distanceKm - b.distanceKm
    return 0
  })
}

function applyFilters() {
  const g = (id) => document.getElementById(id)?.value || 'all'
  const areaVal = g('filter-area'), typeVal = g('filter-type'), priceVal = g('filter-price'), vibeVal = g('filter-vibe')
  const searchVal = (document.getElementById('sidebar-search-input')?.value || '').toLowerCase().trim()
  filteredProperties = currentProperties.filter(item => {
    if (areaVal !== 'all' && item.area !== areaVal) return false
    if (typeVal !== 'all' && item.type !== typeVal) return false
    if (vibeVal !== 'all' && item.vibe !== vibeVal) return false
    if (priceVal === 'under-5m' && item.priceAed >= 5000000) return false
    if (priceVal === '5m-10m' && (item.priceAed < 5000000 || item.priceAed > 10000000)) return false
    if (priceVal === 'above-10m' && item.priceAed <= 10000000) return false
    if (searchVal && !`${item.title} ${item.area} ${item.type} ${item.vibe} ${item.aiSummary}`.toLowerCase().includes(searchVal)) return false
    return true
  })
  sortProperties(); renderMarkers(filteredProperties); renderSidebarList(filteredProperties)
  if (filteredProperties.length > 0 && mapInstance) {
    const group = window.L.featureGroup(filteredProperties.map(p => markersMap.get(p.id)).filter(Boolean))
    mapInstance.flyToBounds(group.getBounds().pad(0.2), { duration: 1.0 })
  }
}

function triggerAiRadarScan() {
  const btn = document.getElementById('btn-scan-map'), overlay = document.getElementById('radar-sweep-overlay')
  if (btn) btn.classList.add('scanning'); if (overlay) overlay.classList.add('active')
  showToast('❆ AI Radar: Actively scanning Dubai districts for premium properties...')
  setTimeout(() => {
    if (btn) btn.classList.remove('scanning'); if (overlay) overlay.classList.remove('active')
    applyFilters(); showToast(`❆ Radar Scan Complete: ${filteredProperties.length} high-match properties detected!`)
  }, 1500)
}

function resetAllFilters() {
  ;['filter-area', 'filter-type', 'filter-price', 'filter-vibe'].forEach(id => { const el = document.getElementById(id); if (el) el.value = 'all' })
  const search = document.getElementById('sidebar-search-input'); if (search) search.value = ''
  applyFilters(); showToast('All map filters have been reset.')
}

function openPropertyModal(id) {
  const prop = currentProperties.find(p => p.id === id), modal = document.getElementById('property-details-modal')
  if (!prop || !modal) return
  window.__vibeMap._activeModalPropId = id
  document.getElementById('modal-main-img').src = prop.image
  document.getElementById('modal-prop-title').textContent = prop.title
  document.getElementById('modal-prop-location').innerHTML = `<i class="fa-solid fa-location-dot" style="color:#0284c7"></i> ${prop.area}, Dubai`
  document.getElementById('modal-prop-price').textContent = prop.priceFormatted
  document.getElementById('modal-ai-score-badge').textContent = `❆ ${prop.aiScore}% AI Match`
  document.getElementById('modal-spec-beds').textContent = prop.beds
  document.getElementById('modal-spec-baths').textContent = prop.baths
  document.getElementById('modal-spec-sqft').textContent = prop.sqft.toLocaleString()
  document.getElementById('modal-spec-vibe').textContent = prop.vibe
  document.getElementById('modal-ai-summary-text').textContent = prop.aiSummary
  modal.style.display = 'flex'; document.body.style.overflow = 'hidden'
}

function closePropertyModal() {
  const modal = document.getElementById('property-details-modal')
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = '' }
}

function showToast(msg) {
  const toast = document.getElementById('map-toast'), toastMsg = document.getElementById('toast-message')
  if (!toast || !toastMsg) return
  toastMsg.textContent = msg; toast.classList.add('visible')
  clearTimeout(toastTimeout); toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3000)
}

const handleKeyDown = (e) => { if (e.key === 'Escape') closePropertyModal() }

function setupEvents() {
  ;['filter-area', 'filter-type', 'filter-price', 'filter-vibe'].forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('change', applyFilters) })
  const sortEl = document.getElementById('sort-select'); if (sortEl) sortEl.addEventListener('change', () => { sortProperties(); renderSidebarList(filteredProperties) })
  const searchInput = document.getElementById('sidebar-search-input'); if (searchInput) searchInput.addEventListener('input', applyFilters)
  const scanBtn = document.getElementById('btn-scan-map'); if (scanBtn) scanBtn.addEventListener('click', triggerAiRadarScan)
  const resetBtn = document.getElementById('btn-reset-filters'); if (resetBtn) resetBtn.addEventListener('click', resetAllFilters)
  document.querySelectorAll('.layer-btn').forEach(btn => btn.addEventListener('click', () => { setTileLayer(btn.dataset.layer); showToast(`Map style switched to: ${btn.dataset.layer.toUpperCase()}`) }))
  const btnLocate = document.getElementById('btn-locate'); if (btnLocate) btnLocate.addEventListener('click', () => { if (mapInstance) { mapInstance.flyTo([25.1972, 55.2744], 13, { duration: 1.5 }); showToast('Centered on Downtown Dubai & Burj Khalifa area') } })
  const btnReset = document.getElementById('btn-reset-view'); if (btnReset) btnReset.addEventListener('click', () => { if (mapInstance) { mapInstance.flyTo([25.14, 55.22], 11, { duration: 1.2 }); clearActiveStates(); showToast('Map view reset to full Dubai overview') } })
  const modalCloseBtn = document.getElementById('modal-close-btn'); if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePropertyModal)
  const modalBackdrop = document.getElementById('property-details-modal'); if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closePropertyModal() })

  // ─── My Location Button ────────────────────────────────────────────────────
  const btnMyLocation = document.getElementById('btn-my-location')
  if (btnMyLocation) {
    btnMyLocation.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast('⚠️ متصفحك لا يدعم تحديد الموقع الجغرافي')
        return
      }
      btnMyLocation.classList.add('locating')
      showToast('📍 جاري تحديد موقعك الحالي...')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          btnMyLocation.classList.remove('locating')
          const userLat = pos.coords.latitude
          const userLng = pos.coords.longitude
          window.__vibeMap._userLat = userLat
          window.__vibeMap._userLng = userLng

          // Remove old user marker if exists
          if (window.__vibeMap._userMarker) {
            window.__vibeMap._userMarker.remove()
          }

          // Add pulsing user location marker
          const userIcon = window.L.divIcon({
            className: '',
            html: `<div class="user-location-marker"><div class="user-pulse-ring"></div><div class="user-dot"></div></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          })
          const userMarker = window.L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 2000 }).addTo(mapInstance)
          userMarker.bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:8px 4px;font-size:0.85rem;font-weight:700;color:#0f172a;display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-circle-user" style="color:#0284c7"></i>موقعك الحالي</div>`)
          window.__vibeMap._userMarker = userMarker

          // Re-calculate live distance for all properties and re-render
          currentProperties = currentProperties.map(p => {
            const dLat = (p.lat - userLat) * 111
            const dLng = (p.lng - userLng) * 100
            const realDist = Math.max(0.1, Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10)
            return { ...p, distanceKm: realDist, distanceFormatted: `${realDist} كم منك` }
          })
          filteredProperties = [...currentProperties]
          sortProperties()
          renderMarkers(filteredProperties)
          renderSidebarList(filteredProperties)

          mapInstance.flyTo([userLat, userLng], 13, { duration: 1.5 })
          showToast(`✅ تم تحديد موقعك! أقرب عقار يبعد ${currentProperties.reduce((a, b) => a.distanceKm < b.distanceKm ? a : b).distanceFormatted}`)
        },
        (err) => {
          btnMyLocation.classList.remove('locating')
          showToast('⚠️ لم نتمكن من تحديد موقعك. تأكد من منح الإذن.')
          console.warn('Geolocation error:', err)
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      )
    })
  }

  // ─── Route Card Close Button ───────────────────────────────────────────────
  const btnCloseRoute = document.getElementById('btn-close-route')
  if (btnCloseRoute) {
    btnCloseRoute.addEventListener('click', () => {
      const card = document.getElementById('map-route-card')
      if (card) { card.style.display = 'none' }
      if (window.__vibeMap._routeLine) {
        window.__vibeMap._routeLine.remove()
        window.__vibeMap._routeLine = null
      }
    })
  }

  // ─── Modal Directions Button ───────────────────────────────────────────────
  const btnModalDir = document.getElementById('modal-btn-directions')
  if (btnModalDir) {
    btnModalDir.addEventListener('click', () => {
      const activeId = window.__vibeMap._activeModalPropId
      if (!activeId) return
      const prop = currentProperties.find(p => p.id === activeId)
      if (!prop) return
      closePropertyModal()
      showRouteCard(prop)
    })
  }
}

// ─── Show Route Card ─────────────────────────────────────────────────────────
function showRouteCard(prop) {
  const card = document.getElementById('map-route-card')
  if (!card) return

  const userLat = window.__vibeMap?._userLat
  const userLng = window.__vibeMap?._userLng

  // Update prop title
  const titleEl = document.getElementById('route-prop-title')
  if (titleEl) titleEl.textContent = prop.title

  // Calculate real distance if user location known
  let distKm = prop.distanceKm
  if (userLat && userLng) {
    const dLat = (prop.lat - userLat) * 111
    const dLng = (prop.lng - userLng) * 100
    distKm = Math.max(0.1, Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10)
  }

  const durationMin = Math.round(distKm / 0.5)  // ~30 km/h avg Dubai traffic

  const distEl = document.getElementById('route-distance-val')
  const durEl = document.getElementById('route-duration-val')
  if (distEl) distEl.textContent = `${distKm} كم`
  if (durEl) durEl.textContent = `~${durationMin} دقيقة`

  // Google Maps navigation link
  const gmapsBtn = document.getElementById('btn-gmaps-navigate')
  if (gmapsBtn) {
    const origin = (userLat && userLng)
      ? `${userLat},${userLng}`
      : 'My+Location'
    gmapsBtn.href = `https://www.google.com/maps/dir/${origin}/${prop.lat},${prop.lng}`
  }

  // Draw dashed route line on map
  if (window.__vibeMap._routeLine) window.__vibeMap._routeLine.remove()
  if (userLat && userLng && mapInstance) {
    window.__vibeMap._routeLine = window.L.polyline(
      [[userLat, userLng], [prop.lat, prop.lng]],
      { color: '#0284c7', weight: 3, dashArray: '8 8', opacity: 0.85 }
    ).addTo(mapInstance)
    mapInstance.fitBounds([[userLat, userLng], [prop.lat, prop.lng]], { padding: [60, 60] })
  } else if (mapInstance) {
    mapInstance.flyTo([prop.lat, prop.lng], 14, { duration: 1.2 })
  }

  card.style.display = 'block'
  showToast(`🗺️ تخطيط المسار إلى: ${prop.title}`)
}

onMounted(async () => {
  loadUserFromStorage()
  if (authService.isAuthenticated()) {
    try {
      const res = await authService.getProfile()
      const parsed = parseUserData(res)
      if (parsed) {
        user.value = { ...user.value, ...parsed }
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    } catch (err) {
      console.warn('Profile fetch failed in MapPage:', err)
    }
  }
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  window.addEventListener('keydown', handleKeyDown)
  window.__vibeMap = {
    openPropertyModal,
    selectProperty,
    resetAllFilters,
    showRouteCard: (id) => {
      const prop = currentProperties.find(p => p.id === id)
      if (prop) showRouteCard(prop)
    }
  }
  await loadLeaflet()
  initMap()
  setupEvents()
  fetchLiveMapProperties()
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
  delete window.__vibeMap
})
</script>

<style scoped>
.map-page-wrapper {
  display: flex; flex-direction: column; min-height: 100vh; overflow-x: hidden;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #0f172a;
  background: radial-gradient(circle at 50% 0%, rgba(2,132,199,0.08) 0%, transparent 60%),
              radial-gradient(circle at 90% 80%, rgba(5,150,105,0.05) 0%, transparent 50%), #f4f6fa;
}
.site-header { position: fixed; top: 0; left: 0; right: 0; width: 100%; height: 68px; z-index: 1200; background-color: rgba(6,16,30,0.94); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.25); transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; }
.site-header.scrolled { background-color: rgba(6,16,30,0.98); box-shadow: 0 8px 30px rgba(0,0,0,0.45); border-bottom-color: rgba(0,210,255,0.25); }
.header-inner { max-width: 1440px; height: 100%; margin: 0 auto; padding: 0 28px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.brand { display: flex; align-items: center; text-decoration: none; }
.brand-logo-wrap { display: flex; align-items: center; gap: 10px; }
.brand-logo-img { height: 38px; width: auto; object-fit: contain; }
.brand-text { display: flex; align-items: center; gap: 6px; }
.brand-title { font-family: 'Outfit', sans-serif; font-size: 1.3rem; font-weight: 800; color: #ffffff; letter-spacing: -0.01em; line-height: 1; }
.brand-accent { color: #00d2ff; text-shadow: 0 0 16px rgba(0,210,255,0.35); }
.brand-badge { background: linear-gradient(135deg, #2563eb, #00d2ff); color: #ffffff; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em; padding: 2px 7px; border-radius: 5px; box-shadow: 0 2px 6px rgba(0,210,255,0.3); }
.menu-toggle { display: none; background: none; border: none; color: #ffffff; font-size: 1.25rem; cursor: pointer; padding: 8px; }
.nav-links { display: flex; align-items: center; gap: 4px; flex: 1; justify-content: center; }
.nav-item { position: relative; font-size: 0.88rem; font-weight: 500; color: #cbd5e1; text-decoration: none; padding: 6px 14px; border-radius: 8px; transition: color 0.2s, background 0.2s; white-space: nowrap; }
.nav-item::after { content: ''; position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%); width: 0; height: 2px; border-radius: 2px; background: #00d2ff; transition: width 0.25s ease; }
.nav-item:hover { color: #ffffff; background: rgba(255,255,255,0.06); }
.nav-item:hover::after { width: 60%; }
.nav-item.active { color: #00d2ff; font-weight: 700; }
.nav-item.active::after { width: 60%; background: #00d2ff; box-shadow: 0 -2px 8px rgba(0,210,255,0.35); }
.header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.btn-list-property { display: inline-flex; align-items: center; gap: 6px; background-color: #2563eb; color: #ffffff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 0.82rem; font-weight: 600; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.35); transition: background 0.2s, transform 0.2s, box-shadow 0.2s; white-space: nowrap; }
.btn-list-property:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37,99,235,0.45); }
.btn-list-property .plus-sign { font-weight: 700; font-size: 0.95rem; margin-left: 2px; }
.icon-action-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #cbd5e1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: all 0.2s ease; cursor: pointer; }
.icon-action-btn:hover { color: #ffffff; background: rgba(255,255,255,0.12); border-color: rgba(0,210,255,0.3); }

/* User Profile & Dropdown */
.user-profile-menu-container { position: relative; }
.user-profile-menu { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px; border-radius: 9999px; transition: all 0.2s ease; user-select: none; }
.user-profile-menu:hover { background: rgba(255,255,255,0.08); }
.header-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,210,255,0.45); transition: border-color 0.2s, transform 0.2s; cursor: pointer; }
.header-avatar:hover { border-color: #00d2ff; transform: scale(1.06); }
.profile-arrow { color: #94a3b8; font-size: 10px; transition: transform 0.25s ease; }
.profile-arrow.rotate-180 { transform: rotate(180deg); color: #00d2ff; }
.profile-dropdown-box { position: absolute; top: calc(100% + 12px); right: 0; width: 280px; background: rgba(10,22,40,0.97); border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(24px); border-radius: 16px; box-shadow: 0 20px 45px rgba(0,0,0,0.55); padding: 16px; z-index: 1500; animation: dropdownFade 0.2s cubic-bezier(0.16,1,0.3,1); }
@keyframes dropdownFade { from { opacity: 0; transform: translateY(-8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
.dropdown-user-header { display: flex; align-items: center; gap: 12px; }
.dropdown-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #00d2ff; box-shadow: 0 2px 8px rgba(0,210,255,0.35); flex-shrink: 0; }
.dropdown-user-info { display: flex; flex-direction: column; min-width: 0; }
.dropdown-user-name { color: #ffffff; font-size: 13.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-user-email { color: #94a3b8; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
.dropdown-user-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9.5px; font-weight: 700; color: #00d2ff; background: rgba(0,210,255,0.12); padding: 2px 7px; border-radius: 6px; margin-top: 5px; width: fit-content; }
.dropdown-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 12px 0; }
.dropdown-menu-list { display: flex; flex-direction: column; gap: 4px; }
.dropdown-menu-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; color: #cbd5e1; font-size: 12.5px; font-weight: 500; border-radius: 8px; transition: all 0.2s ease; background: transparent; border: none; cursor: pointer; width: 100%; text-align: left; }
.dropdown-menu-item:hover { background: rgba(255,255,255,0.08); color: #ffffff; }
.dropdown-menu-item i { font-size: 14px; color: #94a3b8; }
.dropdown-menu-item:hover i { color: #00d2ff; }
.dropdown-footer-actions { display: flex; align-items: center; gap: 8px; }
.dropdown-logout-btn { display: flex; align-items: center; gap: 8px; padding: 9px 12px; color: #f87171; font-size: 12.5px; font-weight: 600; border-radius: 8px; transition: all 0.2s ease; width: 100%; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); cursor: pointer; }
.dropdown-logout-btn:hover { background: rgba(239,68,68,0.18); color: #fca5a5; }
.dropdown-guest-actions { display: flex; align-items: center; gap: 8px; width: 100%; }
.dropdown-login-btn { flex: 1; padding: 8px; background: rgba(255,255,255,0.08); color: #ffffff; border-radius: 8px; font-size: 12px; font-weight: 600; text-align: center; cursor: pointer; border: none; }
.dropdown-signup-btn { flex: 1; padding: 8px; background: #2563eb; color: #ffffff; border-radius: 8px; font-size: 12px; font-weight: 600; text-align: center; cursor: pointer; border: none; }

.map-hero-section { padding-top: 78px; padding-bottom: 8px; flex-shrink: 0; }
.map-hero-container { max-width: 1440px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.map-title-area { display: flex; flex-direction: column; gap: 2px; }
.map-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #0284c7; }
.map-title { font-family: 'Outfit', sans-serif; font-size: 1.45rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px; margin: 0; }
.map-title .highlight { background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.map-subtitle { font-size: 0.84rem; color: #64748b; max-width: 620px; }
.map-quick-stats { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.9); border: 1px solid rgba(15,23,42,0.08); box-shadow: 0 4px 16px rgba(0,0,0,0.03); backdrop-filter: blur(12px); padding: 6px 16px; border-radius: 12px; }
.stat-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
.stat-num { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
.stat-num.cyan { color: #0284c7; } .stat-num.emerald { color: #059669; }
.stat-lbl { font-size: 0.68rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600; }
.stat-sep { width: 1px; height: 22px; background: rgba(15,23,42,0.1); }
.map-filter-section { padding: 0 24px 10px; max-width: 1440px; margin: 0 auto; width: 100%; flex-shrink: 0; }
.filter-bar-card { background: #ffffff; border: 1px solid rgba(2,132,199,0.22); box-shadow: 0 8px 24px rgba(15,23,42,0.06), 0 1px 2px rgba(0,0,0,0.04); border-radius: 14px; padding: 8px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.filter-groups { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; flex: 1; }
.filter-dropdown-wrap { position: relative; display: flex; align-items: center; background: #f8fafc; border: 1px solid rgba(15,23,42,0.1); border-radius: 10px; padding: 0 12px; height: 38px; transition: all 0.25s ease; min-width: 155px; flex: 1; }
.filter-dropdown-wrap:hover, .filter-dropdown-wrap:focus-within { border-color: #0284c7; background: #ffffff; box-shadow: 0 0 12px rgba(2,132,199,0.15); }
.filter-icon { color: #0284c7; font-size: 0.82rem; margin-right: 8px; pointer-events: none; }
.filter-select { appearance: none; -webkit-appearance: none; background: transparent; border: none; color: #0f172a; font-size: 0.82rem; font-weight: 500; width: 100%; height: 100%; outline: none; cursor: pointer; padding-right: 18px; }
.filter-select option { background: #ffffff; color: #0f172a; }
.chevron-icon { position: absolute; right: 10px; color: #94a3b8; font-size: 0.7rem; pointer-events: none; transition: transform 0.2s ease; }
.filter-dropdown-wrap:focus-within .chevron-icon { transform: rotate(180deg); color: #0284c7; }
.filter-actions { display: flex; align-items: center; gap: 8px; }
.btn-scan-map { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; font-family: 'Outfit', sans-serif; font-size: 0.86rem; font-weight: 700; padding: 0 18px; height: 38px; border-radius: 10px; border: none; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 16px rgba(2,132,199,0.35); transition: all 0.25s cubic-bezier(0.16,1,0.3,1); }
.btn-scan-map:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.5); }
.btn-scan-map.scanning i { animation: spin-radar 1s linear infinite; }
@keyframes spin-radar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.btn-reset-filters { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #f1f5f9; border: 1px solid rgba(15,23,42,0.1); border-radius: 10px; color: #64748b; cursor: pointer; transition: all 0.2s ease; font-size: 0.85rem; }
.btn-reset-filters:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; transform: rotate(-45deg); }
.map-content-layout { max-width: 1440px; width: 100%; margin: 0 auto; padding: 0 24px 28px; display: grid; grid-template-columns: 410px 1fr; gap: 16px; height: calc(100vh - 180px); min-height: 640px; }
.map-sidebar-panel { background: #ffffff; border: 1px solid rgba(15,23,42,0.08); border-radius: 16px; box-shadow: 0 10px 30px rgba(15,23,42,0.05); display: flex; flex-direction: column; overflow: hidden; height: 100%; }
.sidebar-header { padding: 12px 16px; border-bottom: 1px solid rgba(15,23,42,0.06); background: #f8fafc; display: flex; flex-direction: column; gap: 10px; }
.sidebar-title-row { display: flex; align-items: center; justify-content: space-between; }
.sidebar-title-info { display: flex; align-items: center; gap: 8px; }
.sidebar-heading { font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0; }
.nearby-count-badge { background: rgba(2,132,199,0.1); border: 1px solid rgba(2,132,199,0.25); color: #0284c7; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.sort-select { background: #ffffff; border: 1px solid rgba(15,23,42,0.12); color: #475569; font-size: 0.74rem; padding: 4px 8px; border-radius: 6px; outline: none; cursor: pointer; }
.sidebar-search-box { position: relative; display: flex; align-items: center; }
.sidebar-search-box i { position: absolute; left: 12px; color: #94a3b8; font-size: 0.8rem; }
.sidebar-search-input { width: 100%; height: 34px; background: #ffffff; border: 1px solid rgba(15,23,42,0.12); border-radius: 8px; padding: 0 12px 0 34px; color: #0f172a; font-size: 0.8rem; outline: none; transition: all 0.2s ease; }
.sidebar-search-input:focus { border-color: #0284c7; box-shadow: 0 0 10px rgba(2,132,199,0.15); }
.properties-scroll-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 10px; background: #f8fafc; }
.properties-scroll-list::-webkit-scrollbar { width: 5px; }
.properties-scroll-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); }
.properties-scroll-list::-webkit-scrollbar-thumb { background: rgba(2,132,199,0.25); border-radius: 10px; }
.properties-scroll-list::-webkit-scrollbar-thumb:hover { background: #0284c7; }
.sidebar-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 240px; text-align: center; color: #64748b; gap: 8px; padding: 20px; }
.sidebar-empty-state i { font-size: 2rem; color: rgba(15,23,42,0.2); }
.map-view-panel { background: #ffffff; border: 1px solid rgba(15,23,42,0.09); border-radius: 16px; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(15,23,42,0.06); height: 100%; }
#leaflet-map { width: 100%; height: 100%; background-color: #f1f5f9; z-index: 1; }
.map-floating-controls { position: absolute; top: 14px; right: 14px; z-index: 1000; display: flex; flex-direction: column; gap: 8px; }
.map-control-btn { background: #ffffff; border: 1px solid rgba(15,23,42,0.12); color: #0f172a; width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(15,23,42,0.08); transition: all 0.2s ease; font-size: 0.9rem; }
.map-control-btn:hover { background: #f8fafc; border-color: #0284c7; color: #0284c7; transform: scale(1.05); }
.btn-my-location { color: #0284c7; }
.btn-my-location:hover { background: #f0f9ff; border-color: #0284c7; }
.btn-my-location.locating i { animation: spin-pulse 1s linear infinite; color: #0284c7; }
@keyframes spin-pulse { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.2); } 100% { transform: rotate(360deg) scale(1); } }
.map-layer-selector { position: absolute; top: 14px; left: 14px; z-index: 1000; display: flex; align-items: center; background: #ffffff; border: 1px solid rgba(15,23,42,0.12); box-shadow: 0 6px 20px rgba(15,23,42,0.08); border-radius: 10px; padding: 3px; gap: 3px; }
.layer-btn { padding: 5px 10px; font-size: 0.74rem; font-weight: 600; border-radius: 7px; color: #64748b; background: transparent; border: none; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 5px; }
.layer-btn.active { background: rgba(2,132,199,0.12); color: #0284c7; border: 1px solid rgba(2,132,199,0.3); }
.radar-sweep-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 999; opacity: 0; transition: opacity 0.3s ease; overflow: hidden; }
.radar-sweep-overlay.active { opacity: 1; }
.radar-beam { position: absolute; width: 100%; height: 4px; background: linear-gradient(90deg, transparent 0%, rgba(2,132,199,0.8) 50%, transparent 100%); box-shadow: 0 0 25px rgba(2,132,199,0.9); animation: scan-vertical 2s cubic-bezier(0.4,0,0.2,1) infinite; }
@keyframes scan-vertical { 0% { top: 0%; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
/* Leaflet overrides */
:deep(.leaflet-control-attribution) { background: rgba(255,255,255,0.85) !important; color: #64748b !important; font-size: 0.65rem !important; border-radius: 6px 0 0 0; }
:deep(.leaflet-control-attribution a) { color: #0284c7 !important; }
:deep(.leaflet-popup-content-wrapper) { background: #ffffff !important; border: 1px solid rgba(2,132,199,0.3) !important; box-shadow: 0 16px 40px rgba(15,23,42,0.15) !important; border-radius: 14px !important; padding: 0 !important; overflow: hidden !important; }
:deep(.leaflet-popup-content) { margin: 0 !important; line-height: 1.4 !important; width: 270px !important; }
:deep(.leaflet-popup-tip-container) { display: none !important; }
:deep(.leaflet-container a.leaflet-popup-close-button) { top: 8px !important; right: 8px !important; background: rgba(15,23,42,0.6) !important; border-radius: 50% !important; color: #ffffff !important; width: 22px !important; height: 22px !important; font-size: 14px !important; display: flex !important; align-items: center !important; justify-content: center !important; border: 1px solid rgba(255,255,255,0.2) !important; }
:deep(.leaflet-container a.leaflet-popup-close-button:hover) { background: rgba(239,68,68,0.9) !important; }
/* Dynamic popup/card/marker HTML */
:deep(.popup-prop-card) { display: flex; flex-direction: column; color: #0f172a; }
:deep(.popup-img-wrap) { position: relative; width: 100%; height: 135px; overflow: hidden; }
:deep(.popup-img-wrap img) { width: 100%; height: 100%; object-fit: cover; }
:deep(.popup-ai-badge) { position: absolute; top: 8px; left: 8px; background: rgba(255,255,255,0.95); border: 1px solid rgba(2,132,199,0.4); color: #0284c7; font-size: 0.68rem; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
:deep(.popup-body) { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
:deep(.popup-price) { font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 800; color: #0f172a; }
:deep(.popup-title) { font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
:deep(.popup-location) { font-size: 0.72rem; color: #64748b; display: flex; align-items: center; gap: 4px; }
:deep(.popup-specs) { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; border: 1px solid rgba(15,23,42,0.05); padding: 5px 8px; border-radius: 6px; font-size: 0.7rem; color: #475569; }
:deep(.popup-btn-row) { display: flex; gap: 6px; margin-top: 4px; }
:deep(.popup-btn-detail) { flex: 1; height: 32px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; border-radius: 8px; font-weight: 700; font-size: 0.76rem; display: flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; border: none; transition: all 0.2s ease; }
:deep(.popup-btn-detail:hover) { box-shadow: 0 4px 14px rgba(2,132,199,0.35); transform: translateY(-1px); }
:deep(.popup-btn-route) { padding: 0 10px; height: 32px; background: #f0f9ff; border: 1px solid #0284c7; color: #0284c7; border-radius: 8px; font-weight: 700; font-size: 0.74rem; display: flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; transition: all 0.2s ease; }
:deep(.popup-btn-route:hover) { background: #0284c7; color: #ffffff; }
:deep(.map-prop-card) { flex-shrink: 0; min-height: 106px; background: #ffffff; border: 1px solid rgba(15,23,42,0.08); border-radius: 12px; padding: 10px; display: grid; grid-template-columns: 100px 1fr; gap: 12px; cursor: pointer; transition: all 0.2s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; box-shadow: 0 2px 6px rgba(15,23,42,0.03); }
:deep(.map-prop-card::before) { content: ''; position: absolute; top: 0; left: 0; width: 3px; height: 100%; background: transparent; transition: background-color 0.2s ease; }
:deep(.map-prop-card:hover) { border-color: rgba(2,132,199,0.4); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(2,132,199,0.12); }
:deep(.map-prop-card.active) { background: #f0f9ff; border-color: #0284c7; box-shadow: 0 0 16px rgba(2,132,199,0.2); }
:deep(.map-prop-card.active::before) { background: #0284c7; }
:deep(.prop-thumb-wrap) { position: relative; width: 100px; height: 86px; border-radius: 8px; overflow: hidden; }
:deep(.prop-thumb-img) { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
:deep(.map-prop-card:hover .prop-thumb-img) { transform: scale(1.08); }
:deep(.prop-distance-chip) { position: absolute; bottom: 4px; left: 4px; background: rgba(15,23,42,0.85); backdrop-filter: blur(8px); color: #38bdf8; font-size: 0.65rem; font-weight: 700; padding: 1px 5px; border-radius: 4px; display: flex; align-items: center; gap: 3px; }
:deep(.prop-card-details) { display: flex; flex-direction: column; justify-content: space-between; min-width: 0; }
:deep(.prop-card-top) { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
:deep(.prop-ai-pill) { background: rgba(2,132,199,0.1); color: #0284c7; font-size: 0.65rem; font-weight: 700; padding: 1px 6px; border-radius: 20px; border: 1px solid rgba(2,132,199,0.25); display: inline-flex; align-items: center; gap: 3px; }
:deep(.prop-rating) { font-size: 0.7rem; font-weight: 700; color: #d97706; display: flex; align-items: center; gap: 3px; }
:deep(.prop-card-title) { font-family: 'Outfit', sans-serif; font-size: 0.86rem; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
:deep(.prop-card-location) { font-size: 0.72rem; color: #64748b; display: flex; align-items: center; gap: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
:deep(.prop-card-price) { font-family: 'Outfit', sans-serif; font-size: 0.92rem; font-weight: 800; color: #0f172a; display: flex; align-items: baseline; gap: 4px; margin-top: 2px; }
:deep(.prop-card-price span) { font-size: 0.65rem; color: #94a3b8; font-weight: 500; }
:deep(.prop-card-specs) { display: flex; align-items: center; gap: 8px; font-size: 0.68rem; color: #64748b; padding-top: 2px; border-top: 1px solid rgba(15,23,42,0.06); }
:deep(.prop-card-specs span) { display: flex; align-items: center; gap: 3px; }
:deep(.prop-card-specs i) { color: #0284c7; font-size: 0.68rem; }
:deep(.custom-radar-marker) { position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; }
:deep(.marker-inner-wrap) { display: flex; align-items: center; gap: 5px; background: #ffffff; border: 1.5px solid #0284c7; border-radius: 999px; padding: 3px 8px 3px 5px; box-shadow: 0 4px 14px rgba(15,23,42,0.15), 0 0 8px rgba(2,132,199,0.2); transition: all 0.25s cubic-bezier(0.16,1,0.3,1); white-space: nowrap; }
:deep(.marker-inner-wrap:hover) { transform: scale(1.15) translateY(-3px); box-shadow: 0 8px 24px rgba(2,132,199,0.35); }
:deep(.marker-pin-icon) { width: 20px; height: 20px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 0.65rem; }
:deep(.marker-price-tag) { font-family: 'Outfit', sans-serif; font-size: 0.78rem; font-weight: 800; color: #0f172a; }
:deep(.marker-radar-ring) { position: absolute; width: 44px; height: 44px; border-radius: 50%; border: 2px solid rgba(2,132,199,0.5); pointer-events: none; animation: radar-expand 2.2s cubic-bezier(0.25,0.46,0.45,0.94) infinite; }
@keyframes radar-expand { 0% { transform: scale(0.4); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
:deep(.custom-radar-marker.active-pin .marker-inner-wrap) { background: #0284c7; border-color: #0f172a; transform: scale(1.18) translateY(-4px); box-shadow: 0 0 24px rgba(2,132,199,0.5); }
:deep(.custom-radar-marker.active-pin .marker-price-tag) { color: #ffffff; }
:deep(.custom-radar-marker.active-pin .marker-pin-icon) { background: #ffffff; color: #0284c7; }
:deep(.user-location-marker) { position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
:deep(.user-pulse-ring) { position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(2,132,199,0.25); border: 2px solid #0284c7; animation: userPulse 2s ease-out infinite; }
:deep(.user-dot) { position: relative; width: 14px; height: 14px; background: #0284c7; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(2,132,199,0.8); }
@keyframes userPulse { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
/* Modal */
.map-modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.map-modal-container { background: #ffffff; border: 1px solid rgba(2,132,199,0.3); box-shadow: 0 24px 60px rgba(15,23,42,0.2); border-radius: 18px; width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; position: relative; animation: modalPop 0.3s cubic-bezier(0.16,1,0.3,1); }
@keyframes modalPop { from { transform: scale(0.94) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
.modal-close-btn { position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 50%; background: #f1f5f9; border: 1px solid rgba(15,23,42,0.1); color: #0f172a; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; transition: all 0.2s ease; }
.modal-close-btn:hover { background: #ef4444; color: #ffffff; transform: rotate(90deg); }
.modal-hero-gallery { position: relative; width: 100%; height: 300px; overflow: hidden; }
.modal-main-img { width: 100%; height: 100%; object-fit: cover; }
.modal-body-content { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-price-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
.modal-price-val { font-family: 'Outfit', sans-serif; font-size: 1.6rem; font-weight: 800; color: #0f172a; }
.modal-specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.modal-spec-card { background: #f8fafc; border: 1px solid rgba(15,23,42,0.08); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 3px; }
.modal-spec-card i { color: #0284c7; font-size: 1rem; }
.modal-spec-card .val { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 0.95rem; color: #0f172a; }
.modal-spec-card .lbl { font-size: 0.68rem; color: #64748b; }
.modal-ai-box { background: rgba(2,132,199,0.06); border: 1px solid rgba(2,132,199,0.2); border-radius: 12px; padding: 14px; display: flex; gap: 12px; }
.modal-ai-box i { color: #0284c7; font-size: 1.3rem; }
.modal-ai-box p { font-size: 0.85rem; line-height: 1.5; color: #334155; }
.modal-actions-row { display: flex; gap: 12px; }
.modal-btn-contact { flex: 1; height: 44px; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; font-family: 'Outfit', sans-serif; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border: none; font-size: 0.9rem; transition: all 0.2s ease; }
.modal-btn-contact:hover { box-shadow: 0 4px 18px rgba(2,132,199,0.35); transform: translateY(-1px); }
.modal-btn-directions { height: 44px; padding: 0 16px; background: #f0f9ff; border: 1.5px solid #0284c7; color: #0284c7; font-family: 'Outfit', sans-serif; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s ease; white-space: nowrap; }
.modal-btn-directions:hover { background: #0284c7; color: #ffffff; box-shadow: 0 4px 14px rgba(2,132,199,0.3); transform: translateY(-1px); }
.modal-btn-share { width: 44px; height: 44px; background: #f1f5f9; border: 1px solid rgba(15,23,42,0.12); border-radius: 10px; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; }
.modal-btn-share:hover { background: #e2e8f0; color: #0284c7; }
.map-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(100px); background: #0f172a; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 10px 30px rgba(15,23,42,0.25); color: #ffffff; padding: 10px 20px; border-radius: 999px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 8px; z-index: 3000; transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); pointer-events: none; }
.map-toast.visible { transform: translateX(-50%) translateY(0); }
.map-toast i { color: #38bdf8; }
/* ==================== FOOTER ==================== */
.footer {
  background-color: #06101e;
  color: rgba(255, 255, 255, 0.75);
  padding-top: 4.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}
.footer .container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}
.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-brand .brand-desc {
  margin-top: 1.2rem;
  font-size: 0.92rem;
  line-height: 1.7;
  color: #94a3b8;
}
.footer-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
.footer-logo-img {
  height: 34px;
  width: auto;
  object-fit: contain;
}
.footer-brand-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
}
.social-links {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.social-links a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  color: #ffffff;
  transition: all 0.2s ease;
  text-decoration: none;
}
.social-links a:hover {
  background: #2563eb;
  transform: translateY(-3px);
  color: #ffffff;
}
.footer-heading {
  color: #ffffff;
  font-family: 'Outfit', sans-serif;
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
}
.footer-links-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links-col ul li {
  margin-bottom: 0.75rem;
}
.footer-links-col ul li a {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.92rem;
  text-decoration: none;
  transition: all 0.2s ease;
}
.footer-links-col ul li a:hover {
  color: #00d2ff;
  padding-left: 5px;
}
.contact-info-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.92rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}
.contact-info-list li i {
  color: #00d2ff;
  margin-top: 0.3rem;
}
.footer-bottom {
  width: 100%;
  padding: 1.5rem 0;
  font-size: 0.85rem;
}
.bottom-container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

/* Route & Directions Floating Card */
.map-route-card {
  position: absolute;
  bottom: 24px;
  left: 20px;
  width: 320px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(2, 132, 199, 0.35);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
  z-index: 1001;
  padding: 14px 16px;
  animation: slideUpCard 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}
@keyframes slideUpCard {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.route-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}
.route-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}
.route-header-title .route-icon {
  color: #0284c7;
  font-size: 0.95rem;
}
.btn-close-route {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-close-route:hover {
  background: #fee2e2;
  color: #ef4444;
}
.route-card-content {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.route-prop-name {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.route-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.route-stat-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 10px;
  padding: 8px 10px;
}
.stat-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.stat-icon-wrap.time {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-info .stat-val {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 0.88rem;
  color: #0f172a;
}
.stat-info .stat-lbl {
  font-size: 0.65rem;
  color: #64748b;
}
.route-actions-wrap {
  margin-top: 2px;
}
.btn-open-gmaps {
  width: 100%;
  height: 36px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.78rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}
.btn-open-gmaps:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.4);
}
.external-icon {
  font-size: 0.7rem;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .map-content-layout { grid-template-columns: 350px 1fr; }
}
@media (max-width: 991px) {
  .menu-toggle { display: block; }
  .nav-links {
    position: fixed;
    top: 68px;
    left: 0;
    width: 100%;
    background: rgba(6, 16, 30, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 24px;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 1100;
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}
@media (max-width: 768px) {
  .map-content-layout { display: flex; flex-direction: column-reverse; height: auto; padding: 0 16px 20px; }
  .map-view-panel { height: 380px; }
  .map-sidebar-panel { height: 480px; }
  .map-hero-container { flex-direction: column; align-items: flex-start; }
  .filter-bar-card { flex-direction: column; align-items: stretch; }
  .filter-groups { flex-direction: column; }
  .filter-dropdown-wrap { width: 100%; }
  .btn-scan-map { width: 100%; justify-content: center; }
  .modal-specs-grid { grid-template-columns: repeat(2, 1fr); }
  .map-route-card { left: 12px; right: 12px; width: auto; bottom: 12px; }
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
