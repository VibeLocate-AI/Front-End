<template>
  <div class="dubai-home">
    <!-- ==================== HEADER / NAVBAR ==================== -->
    <header class="site-header">
      <div class="header-inner">
        <!-- Logo -->
        <a class="brand" href="#top" @click.prevent="scrollTo('top')">
          <div class="brand-logo-wrap">
            <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img">
            <div class="brand-text">
              <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
              <span class="brand-badge">AI</span>
            </div>
          </div>
        </a>

        <!-- Mobile Menu Toggle -->
        <button class="menu-toggle" type="button" aria-label="Toggle navigation" @click="mobileMenuOpen = !mobileMenuOpen">
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Navigation Links -->
        <nav class="nav-links" :class="{ open: mobileMenuOpen }">
          <a class="nav-item active" href="#top" @click.prevent="scrollTo('top')">Home</a>
          <a class="nav-item" href="#featured" @click.prevent="scrollTo('featured')">Buy</a>
          <a class="nav-item" href="#featured" @click.prevent="scrollTo('featured')">Rent</a>
          <a class="nav-item" href="#featured" @click.prevent="scrollTo('featured')">New Projects</a>
          <a class="nav-item" href="#featured" @click.prevent="scrollTo('featured')">Commercial</a>
          <a class="nav-item" href="#areas" @click.prevent="scrollTo('areas')">Areas</a>
          <a class="nav-item" href="#about" @click.prevent="scrollTo('about')">About Us</a>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <button class="btn-list-property" type="button" @click="showToast('Property listing portal opening soon.')">
            List Your Property <span class="plus-sign">+</span>
          </button>
          
          <button class="icon-action-btn" type="button" aria-label="Favorites" @click="showToast('You have ' + favorites.size + ' saved properties.')">
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
                <button class="dropdown-menu-item" @click="scrollTo('featured'); profileMenuOpen = false">
                  <i class="fa-regular fa-heart"></i>
                  <span>Saved Properties ({{ favorites.size }})</span>
                </button>
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
                  <button class="dropdown-login-btn" @click="$router.push('/login')">Log In</button>
                  <button class="dropdown-signup-btn" @click="$router.push('/register')">Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ==================== MAIN CONTENT ==================== -->
    <main id="top">
      <!-- HERO SECTION -->
      <section class="hero-section" id="hero">
        <div class="hero-overlay"></div>
        <div class="hero-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>

        <div class="container hero-content">
          <div class="badge-pill fade-in">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: #38bdf8;"></i>
            <span>AI-POWERED REAL ESTATE PLATFORM</span>
          </div>

          <h1 class="hero-title fade-in">
            Find Your Dream<br>
            <span class="text-cyan-bright">Property in Dubai</span>
          </h1>

          <p class="hero-desc fade-in">
            Discover premium Dubai properties tailored to your lifestyle, comfort, and aspirations with next-generation AI recommendations.
          </p>


          <!-- Floating Glass Search Widget -->
          <div class="search-widget-card glassmorphism fade-in" ref="searchWidget">
            <form class="search-form" @submit.prevent="handleSearch">
              <div class="form-group" style="width: 100%;">
                <label class="search-label">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> AI CONTEXTUAL SEARCH
                </label>
                <div class="search-input-wrapper">
                  <input
                    id="keyword"
                    v-model.trim="query"
                    type="text"
                    class="hero-search-input"
                    placeholder="e.g., I need a luxury villa near the beach for $5,000/month"
                  >
                  <button type="submit" class="btn btn-primary search-submit-btn">
                    <i class="fa-solid fa-robot"></i>
                    <span>AI Search</span>
                  </button>
                </div>
              </div>
            </form>
            <p v-if="searchMessage" class="bot-feedback" style="margin-top: 10px;">{{ searchMessage }}</p>
          </div>
        </div>

      </section>

      <!-- TWO-COLUMN CONTENT AREA -->
      <div class="main-container">
        <div class="content-columns-wrapper">
          <!-- LEFT / PRIMARY COLUMN -->
          <div class="primary-column">
            <!-- 1. POPULAR AREAS -->
            <section id="areas" class="content-block">
              <div class="block-header">
                <h2>Popular Areas</h2>
                <a href="#" class="see-all-link" @click.prevent="showToast('Viewing all 18 Dubai areas.')">See all areas <span class="arrow">&gt;</span></a>
              </div>

              <div class="areas-row-grid">
                <div v-for="area in areas" :key="area.name" class="area-item-card" @click="searchByArea(area.name)">
                  <div class="area-img-box">
                    <img :src="area.image" :alt="area.name" loading="lazy">
                  </div>
                  <div class="area-info-box">
                    <h3 class="area-name">{{ area.name }}</h3>
                    <span class="area-properties-count">{{ area.count }} Properties</span>
                  </div>
                </div>
              </div>
            </section>

            <!-- 2. FEATURED PROPERTIES -->
            <section id="featured" class="content-block">
              <div class="block-header">
                <h2>Featured Properties</h2>
                <a href="#" class="see-all-link" @click.prevent="showToast('Viewing all featured listings.')">See all properties <span class="arrow">&gt;</span></a>
              </div>

              <div class="featured-cards-grid">
                <article v-for="prop in filteredProperties.slice(0, 4)" :key="prop.title" class="featured-property-card">
                  <div class="card-media-wrapper" :style="{ backgroundImage: `url('${prop.image}')` }">
                    <button
                      class="card-fav-btn"
                      :class="{ active: favorites.has(prop.title) }"
                      type="button"
                      :aria-label="'Favorite ' + prop.title"
                      @click.stop="toggleFavorite(prop.title)"
                    >
                      <i :class="favorites.has(prop.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </button>
                    <span class="card-property-tag">{{ prop.type }}</span>
                  </div>

                  <div class="card-details-box">
                    <h3 class="property-card-title">{{ prop.title }}</h3>
                    <p class="property-card-location">
                      <i class="fa-solid fa-location-dot"></i> {{ prop.area }}
                    </p>
                    <div class="property-card-pricing">
                      <span class="price-val">${{ prop.price.toLocaleString() }}</span>
                      <span class="price-period">/month</span>
                    </div>

                    <div class="property-card-specs">
                      <span class="spec-item"><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                      <span class="spec-item"><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                      <span class="spec-item"><i class="fa-solid fa-vector-square"></i> {{ prop.size }} Sqft</span>
                    </div>
                  </div>
                </article>

                <div v-if="!filteredProperties.length" class="empty-search-state">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <p>No matching properties found for "{{ query }}".</p>
                  <button class="reset-search-btn" @click="query = ''">Reset Filters</button>
                </div>
              </div>
            </section>

            <!-- 3. NEARBY & RECOMMENDED -->
            <section class="content-block">
              <div class="block-header">
                <h2>Nearby &amp; Recommended</h2>
                <a href="#" class="see-all-link" @click.prevent="showToast('Viewing all recommendations.')">See all <span class="arrow">&gt;</span></a>
              </div>

              <div class="nearby-cards-grid">
                <article v-for="prop in nearbyProperties" :key="prop.title" class="nearby-item-card">
                  <div class="nearby-media" :style="{ backgroundImage: `url('${prop.image}')` }">
                    <button
                      class="nearby-fav-btn"
                      :class="{ active: favorites.has(prop.title) }"
                      type="button"
                      @click.stop="toggleFavorite(prop.title)"
                    >
                      <i :class="favorites.has(prop.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </button>
                  </div>
                  <div class="nearby-info">
                    <h4 class="nearby-title">{{ prop.title }}</h4>
                    <p class="nearby-location"><i class="fa-solid fa-location-dot"></i> {{ prop.area }}</p>
                    <div class="nearby-price">
                      <strong>${{ prop.price.toLocaleString() }}</strong>
                      <small>/month</small>
                    </div>
                    <div class="nearby-specs">
                      <span><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                      <span><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                      <span><i class="fa-solid fa-vector-square"></i> {{ prop.size }} Sqft</span>
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>

          <!-- RIGHT / SIDEBAR COLUMN -->
          <aside class="sidebar-column">
            <!-- AGENT CARD -->
            <article class="agent-profile-card">
              <h3 class="sidebar-card-title">Top Real Estate Agent</h3>
              
              <div class="agent-meta-row">
                <img class="agent-avatar-img" src="https://randomuser.me/api/portraits/men/75.jpg" alt="Mohamed Ahmed">
                <div class="agent-name-rating">
                  <strong class="agent-fullname">Mohamed Ahmed</strong>
                  <span class="agent-designation">Senior Real Estate Consultant</span>
                  <div class="agent-star-rating">
                    <span class="stars">★</span> <b>4.9</b> <span class="review-count">(128 reviews)</span>
                  </div>
                </div>
              </div>

              <div class="agent-contact-rows">
                <a class="agent-contact-pill" href="tel:+971501234567">
                  <i class="fa-solid fa-phone"></i>
                  <span>+971 50 123 4567</span>
                </a>
                <a class="agent-contact-pill" href="mailto:mohamed@dubaiestates.ae">
                  <i class="fa-regular fa-envelope"></i>
                  <span>mohamed@dubaiestates.ae</span>
                </a>
              </div>

              <button class="btn-contact-agent" type="button" @click="showToast('Connecting you with Mohamed Ahmed...')">
                Contact Agent
              </button>
            </article>

            <!-- LIST YOUR PROPERTY PROMO CARD -->
            <article class="list-property-promo-card">
              <div class="promo-content">
                <h3 class="promo-heading">List Your Property<br>With Dubai Estates</h3>
                <p class="promo-description">Reach thousands of potential buyers and renters.</p>
                <button class="btn-promo-action" type="button" @click="showToast('Property listing form opening...')">
                  List Your Property <span class="promo-chevron">&gt;</span>
                </button>
              </div>
              <div class="promo-tower-bg">
                <div class="tower t1"></div>
                <div class="tower t2"></div>
                <div class="tower t3"></div>
              </div>
            </article>
          </aside>
        </div>

        <!-- 4. FULL-WIDTH BENEFITS / TRUST BAR -->
        <section id="about" class="benefits-trust-strip">
          <div class="trust-item">
            <div class="trust-icon-circle">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="trust-text">
              <strong>Verified Listings</strong>
              <p>All properties are verified for your peace of mind.</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-circle">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div class="trust-text">
              <strong>Expert Agents</strong>
              <p>Connect with experienced real estate professionals.</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-circle">
              <i class="fa-solid fa-award"></i>
            </div>
            <div class="trust-text">
              <strong>Best Price Guarantee</strong>
              <p>We help you find the best deals in the market.</p>
            </div>
          </div>

          <div class="trust-item">
            <div class="trust-icon-circle">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div class="trust-text">
              <strong>24/7 Support</strong>
              <p>Our team is here to assist you anytime.</p>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- ==================== FOOTER ==================== -->
    <footer class="footer" id="contact">
      <div class="container footer-top">
        <div class="footer-brand">
          <a href="#hero" class="logo footer-logo" @click.prevent="scrollTo('hero')">
            <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img footer-logo-img">
            <div class="brand-text footer-brand-text">
              <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
              <span class="brand-badge">AI</span>
            </div>
          </a>
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
            <li><a href="#hero" @click.prevent="scrollTo('hero')">Home</a></li>
            <li><a href="#about" @click.prevent="scrollTo('about')">Services</a></li>
            <li><a href="#about" @click.prevent="scrollTo('about')">About Us</a></li>
            <li><a href="#testimonials" @click.prevent="scrollTo('testimonials')">Testimonials</a></li>
            <li><a href="#contact" @click.prevent="scrollTo('contact')">Contact</a></li>
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

    <!-- Toast Feedback Notification -->
    <div class="toast-notification" :class="{ visible: toastVisible }">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const areas = [
  { name: 'Dubai Marina', count: '1,240', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80' },
  { name: 'Palm Jumeirah', count: '856', image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Downtown Dubai', count: '1,080', image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=400&q=80' },
  { name: 'Business Bay', count: '732', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=400&q=80' }
]

const properties = [
  {
    type: 'Villa',
    title: 'Palm Jumeirah Villa',
    area: 'Palm Jumeirah, Dubai',
    price: 4500,
    beds: 5,
    baths: 6,
    size: '6,500',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=85'
  },
  {
    type: 'Apartment',
    title: 'Luxury Apartment in Dubai Marina',
    area: 'Dubai Marina, Dubai',
    price: 2800,
    beds: 2,
    baths: 3,
    size: '1,450',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85'
  },
  {
    type: 'Penthouse',
    title: 'Downtown Penthouse Skyline View',
    area: 'Downtown Dubai, Dubai',
    price: 12000,
    beds: 4,
    baths: 5,
    size: '3,200',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=85'
  },
  {
    type: 'Townhouse',
    title: 'Modern Townhouse in JVC',
    area: 'JVC, Dubai',
    price: 3200,
    beds: 3,
    baths: 4,
    size: '2,100',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85'
  },
  {
    type: 'Apartment',
    title: 'Luxury Marina Suite',
    area: 'Dubai Marina',
    price: 2200,
    beds: 1,
    baths: 2,
    size: '850',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
  },
  {
    type: 'Townhouse',
    title: 'JVC Modern Townhome',
    area: 'Jumeirah Village Circle',
    price: 2900,
    beds: 3,
    baths: 3,
    size: '1,800',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  },
  {
    type: 'Apartment',
    title: 'Business Bay 2BR Apartment',
    area: 'Business Bay, Dubai',
    price: 2600,
    beds: 2,
    baths: 2,
    size: '1,200',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
  },
  {
    type: 'Villa',
    title: 'Dubai Hills Family Villa',
    area: 'Dubai Hills Estate',
    price: 6500,
    beds: 5,
    baths: 6,
    size: '5,200',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80'
  }
]

const nearbyProperties = properties.slice(4)

const query = ref('')
const favorites = ref(new Set())
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)
const searchWidget = ref(null)
const searchMessage = ref('')
const toastMessage = ref('')
const toastVisible = ref(false)

const router = useRouter()

const user = ref({
  name: '',
  email: '',
  avatar: ''
})

let toastTimer = null

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
  user.value = {
    name: '',
    email: '',
    avatar: ''
  }
  showToast('Logged out successfully.')
  setTimeout(() => {
    router.push('/')
  }, 500)
}

const filteredProperties = computed(() => {
  const term = query.value.toLowerCase().trim()
  if (!term) return properties
  return properties.filter(p =>
    `${p.title} ${p.area} ${p.type} ${p.price}`.toLowerCase().includes(term)
  )
})

const toggleFavorite = (title) => {
  const next = new Set(favorites.value)
  if (next.has(title)) {
    next.delete(title)
    showToast(`Removed from favorites`)
  } else {
    next.add(title)
    showToast(`Added to favorites`)
  }
  favorites.value = next
}

const handleSearch = () => {
  const count = filteredProperties.value.length
  if (count > 0) {
    searchMessage.value = `AI found ${count} properties matching your query.`
  } else {
    searchMessage.value = `No exact matches found. Try searching for "Villa", "Marina", or "$3000".`
  }
  document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const searchByArea = (areaName) => {
  query.value = areaName
  handleSearch()
}

const scrollTo = (id) => {
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
  const targetId = id === 'top' || id === 'hero' ? (document.getElementById('hero') ? 'hero' : 'top') : id
  const el = document.getElementById(targetId) || (id === 'testimonials' || id === 'services' ? document.getElementById('about') : null)
  el?.scrollIntoView({ behavior: 'smooth' })
}

const showToast = (msg) => {
  toastMessage.value = msg
  toastVisible.value = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
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

onMounted(async () => {
  // 1. Instantly load cached user data from storage
  loadUserFromStorage()

  // 2. Add document listener for dropdown outside clicks
  document.addEventListener('click', handleDocumentClick)

  // 3. Fetch latest profile from API if token exists
  if (authService.isAuthenticated()) {
    try {
      const res = await authService.getProfile()
      const parsed = parseUserData(res)
      if (parsed) {
        user.value = { ...user.value, ...parsed }
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    } catch (err) {
      console.warn('Profile fetch failed, using cached session:', err)
    }
  }
})
</script>

<style src="../assets/dubai-home.css"></style>
