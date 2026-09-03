<template>
  <!-- ==================== HEADER / NAVBAR ==================== -->
  <div class="landing-page-wrapper">
    <header class="navbar-wrapper" :class="{ scrolled: isScrolled }" id="navbar">
      <div class="container nav-container">
        <a href="#hero" class="logo" @click.prevent="scrollTo('hero')">
          <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img">
          <div class="brand-text">
            <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
            <span class="brand-badge">AI</span>
          </div>
        </a>

        <nav class="nav-menu" :class="{ open: mobileMenuOpen }" id="navMenu">
          <ul class="nav-links">
            <li><a href="#hero" class="nav-link" :class="{ active: activeSection === 'hero' }" @click.prevent="scrollTo('hero'); closeMobileMenu()">Home</a></li>
            <li><a href="#about" class="nav-link" :class="{ active: activeSection === 'about' }" @click.prevent="scrollTo('about'); closeMobileMenu()">Services</a></li>
            <li><a href="#about" class="nav-link" @click.prevent="scrollTo('about'); closeMobileMenu()">About</a></li>
            <li><a href="#testimonials" class="nav-link" :class="{ active: activeSection === 'testimonials' }" @click.prevent="scrollTo('testimonials'); closeMobileMenu()">Testimonial</a></li>
            <li><a href="#contact" class="nav-link" :class="{ active: activeSection === 'contact' }" @click.prevent="scrollTo('contact'); closeMobileMenu()">Contact</a></li>
          </ul>
        </nav>

        <div class="nav-actions">
          <button class="icon-btn search-trigger" id="searchTrigger" title="Quick Search" @click="scrollToSearch">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <template v-if="isLoggedIn">
            <button class="btn btn-accent btn-glow btn-sm" @click="router.push('/home')">
              <i class="fa-solid fa-house" style="margin-right: 4px;"></i> Home
            </button>
          </template>
          <template v-else>
            <button class="btn btn-outline btn-sm" @click="goToLogin">Log In</button>
            <button class="btn btn-accent btn-glow btn-sm" @click="goToSignup">Sign Up</button>
          </template>
          <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu" @click="mobileMenuOpen = !mobileMenuOpen">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>

    <!-- ==================== HERO SECTION ==================== -->
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
          Invest Today in <br>
          Your <span class="text-cyan-bright">Dream Home</span>
        </h1>

        <p class="hero-desc fade-in">
          Discover new AI-powered real estate dimensions tailored to your lifestyle, comfort, and aspirations.
        </p>

        <div class="hero-cta fade-in">
          <a href="#rentals" class="btn btn-accent btn-lg" @click.prevent="scrollTo('rentals')">
            <i class="fa-solid fa-house"></i> Explore Rentals
          </a>
          <a href="#about" class="btn btn-outline btn-lg" @click.prevent="scrollTo('about')">
            <i class="fa-solid fa-play"></i> Watch Tour
          </a>
        </div>

        <!-- Floating Glass Search Widget -->
        <div class="search-widget-card glassmorphism fade-in" ref="searchWidget">
          <form class="search-form" @submit.prevent="handleAISearch">
            <div class="form-group" style="width: 100%;">
              <label class="search-label">
                <i class="fa-solid fa-wand-magic-sparkles"></i> AI CONTEXTUAL SEARCH
              </label>
              <div class="search-input-wrapper">
                <input
                  type="text"
                  id="aiSearchInput"
                  v-model="aiSearchQuery"
                  class="hero-search-input"
                  placeholder="e.g., Two-bedroom house in Dubai"
                >
                <button type="submit" class="btn btn-primary search-submit-btn">
                  <i class="fa-solid fa-robot"></i>
                  <span>AI Search</span>
                </button>
              </div>

              <!-- Quick Demo Prompt Chips for Direct Navigation to AI Screens -->
              <div class="ai-prompt-chips" style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">Try Prompts:</span>
                <button type="button" class="ai-chip-pill" @click="runQuickSearch('Two-bedroom house in Dubai')">
                  ✦ Two-bedroom house in Dubai
                </button>
                <button type="button" class="ai-chip-pill" @click="runQuickSearch('Luxury Marina Studio $2,500')">
                  ✦ Marina Studio ($2,500)
                </button>
                <button type="button" class="ai-chip-pill chip-err" @click="runQuickSearch('error')">
                  ⚠️ Service Busy (Image 1)
                </button>
                <button type="button" class="ai-chip-pill chip-none" @click="runQuickSearch('no match')">
                  🔍 No Match (Image 2)
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Quick Highlights Ticker / Bar -->
      <div class="hero-strip">
        <div class="container strip-content">
          <div class="strip-item">
            <i class="fa-solid fa-city"></i>
            <span>City Homes</span>
          </div>
          <div class="strip-separator"></div>
          <div class="strip-item">
            <i class="fa-solid fa-tree-city"></i>
            <span>Urban Spaces</span>
          </div>
          <div class="strip-separator"></div>
          <div class="strip-item">
            <i class="fa-solid fa-gem"></i>
            <span>Prime Rental</span>
          </div>
          <div class="strip-separator"></div>
          <div class="strip-item">
            <i class="fa-solid fa-credit-card"></i>
            <span>Easy Pay</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== ABOUT / VALUE PROPOSITION ==================== -->
    <section class="about-section" id="about">
      <div class="container about-grid">
        <!-- Left Content -->
        <div class="about-text-col">
          <h2 class="section-title">
            Streamlined Property <br>
            <span class="text-highlight">Leasing Made Easy</span>
          </h2>
          <p class="section-desc">
            Discover your next home with our extensive verified listings and seamless leasing process. Find the perfect fit with our custom search tools and virtual tours.
          </p>

          <div class="features-list-grid">
            <div class="feature-bullet" v-for="feat in features" :key="feat">
              <span class="bullet-dot"></span>
              <span>{{ feat }}</span>
            </div>
          </div>

          <div class="about-cta-row">
            <a href="#rentals" class="btn btn-navy" @click.prevent="scrollTo('rentals')">
              <span>Browse Properties</span>
              <i class="fa-solid fa-chevron-down"></i>
            </a>
          </div>
        </div>

        <!-- Right Visual with Floating Stats -->
        <div class="about-visual-col">
          <div class="visual-card-wrapper">
            <div class="main-image-box">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80" alt="Happy couple in luxury property" class="main-img" loading="lazy">
              <div class="image-overlay-gradient"></div>
            </div>

            <!-- Floating Badge 1: Leased -->
            <div class="stat-badge stat-badge-top-right glass-card floating-anim">
              <div class="badge-icon-circle accent-orange">
                <i class="fa-solid fa-building-circle-check"></i>
              </div>
              <div class="badge-details">
                <span class="counter-num">+{{ counters.leased.toLocaleString() }}</span>
                <span class="badge-label">Properties Leased</span>
              </div>
            </div>

            <!-- Floating Badge 2: Major Cities -->
            <div class="stat-badge stat-badge-bottom-left glass-card floating-anim-delayed">
              <div class="badge-icon-circle accent-blue">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div class="badge-details">
                <span class="counter-num">{{ counters.cities }}+</span>
                <span class="badge-label">Major Cities</span>
              </div>
            </div>

            <!-- Floating Badge 3: Happy Tenants -->
            <div class="stat-badge stat-badge-bottom-right glass-card floating-anim">
              <div class="badge-icon-circle accent-cyan">
                <i class="fa-solid fa-face-smile"></i>
              </div>
              <div class="badge-details">
                <span class="counter-num">+{{ counters.tenants.toLocaleString() }}</span>
                <span class="badge-label">Happy Tenants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Golden Wave Section Divider -->
      <div class="curved-divider-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,40 C320,120 420,-30 720,45 C1020,120 1140,-10 1440,30 L1440,120 L0,120 Z" fill="var(--gray-bg)"></path>
          <path d="M0,38 C320,118 420,-32 720,43 C1020,118 1140,-12 1440,28" stroke="#F59E0B" stroke-width="4" fill="none"></path>
        </svg>
      </div>
    </section>

    <!-- ==================== EXPLORE AVAILABLE RENTALS ==================== -->
    <section class="rentals-section" id="rentals">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Explore Available Rentals</h2>
          <p class="section-subtitle">
            Discover handpicked luxury spaces with curated interiors, prime locations, and modern architecture.
          </p>

          <!-- Rental Categories Filter Tabs -->
          <div class="filter-tabs">
            <button
              v-for="tab in filterTabsList"
              :key="tab.value"
              class="filter-tab"
              :class="{ active: activeFilter === tab.value }"
              @click="activeFilter = tab.value"
            >{{ tab.label }}</button>
          </div>
        </div>

        <!-- Properties Grid -->
        <div class="properties-grid" id="propertiesGrid">
          <article
            v-for="property in filteredProperties"
            :key="property.id"
            class="property-card"
          >
            <div class="property-media">
              <img :src="property.image" :alt="property.title" loading="lazy">
              <span class="property-badge" :style="property.badgeStyle">
                <i class="fa-solid fa-robot"></i> {{ property.aiMatch }}% AI Match
              </span>
              <button
                class="favorite-btn"
                :class="{ liked: property.liked }"
                aria-label="Add to favorites"
                @click="toggleFavorite(property)"
              >
                <i :class="property.liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
              </button>
              <div class="property-price-tag">
                <span class="price">${{ property.price.toLocaleString() }}</span><span class="period">/mo</span>
              </div>
            </div>
            <div class="property-body">
              <div class="property-location">
                <i class="fa-solid fa-location-dot"></i> {{ property.location }}
              </div>
              <h3 class="property-title">{{ property.title }}</h3>
              <p class="property-summary">{{ property.summary }}</p>

              <div class="property-specs">
                <span><i class="fa-solid fa-bed"></i> {{ property.beds }} Beds</span>
                <span><i class="fa-solid fa-bath"></i> {{ property.baths }} Baths</span>
                <span><i class="fa-solid fa-vector-square"></i> {{ property.area }}</span>
              </div>

              <div class="property-footer">
                <button class="btn btn-view-more btn-sm" @click="openModal(property)">
                  <span>View More</span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Divider Line -->
    <div class="container section-divider-line"></div>

    <!-- ==================== TESTIMONIALS SECTION ==================== -->
    <section class="testimonials-section" id="testimonials">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="section-title">Customer Testimonial</h2>
          <p class="section-subtitle">Hear genuine feedback from our distinguished residents across prime locations.</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card glass-card" v-for="t in testimonials" :key="t.name">
            <div class="testimonial-header">
              <img :src="t.avatar" :alt="t.name" class="client-avatar">
              <div class="client-info">
                <h4 class="client-name">{{ t.name }}</h4>
                <div class="rating-stars">
                  <i class="fa-solid fa-star" v-for="n in 5" :key="n"></i>
                </div>
              </div>
            </div>
            <p class="testimonial-quote">"{{ t.quote }}"</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== BOOKING & CONSULTATION CTA ==================== -->
    <section class="booking-section" id="booking">
      <div class="container">
        <div class="booking-banner">
          <div class="booking-content">
            <div class="section-tag light-tag">
              <i class="fa-solid fa-calendar-check"></i> VIP Tour Booking
            </div>
            <h2 class="banner-title">Ready to Find Your Next Home?</h2>
            <p class="banner-desc">
              Book an exclusive private tour or speak directly with our luxury AI property advisors today.
            </p>

            <form class="quick-book-form" @submit.prevent="submitBooking">
              <div class="input-wrap">
                <i class="fa-regular fa-user"></i>
                <input type="text" v-model="bookingForm.name" placeholder="Your Full Name" required>
              </div>
              <div class="input-wrap">
                <i class="fa-regular fa-envelope"></i>
                <input type="email" v-model="bookingForm.email" placeholder="Your Email Address" required>
              </div>
              <div class="input-wrap">
                <i class="fa-solid fa-phone"></i>
                <input type="tel" v-model="bookingForm.phone" placeholder="Phone Number" required>
              </div>
              <button type="submit" class="btn btn-accent btn-banner">
                <span>Request VIP Consultation</span>
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

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
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Safety &amp; Security</a></li>
            <li><a href="#">Terms &amp; Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
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
    <div class="modal-backdrop" :class="{ active: modalOpen }" @click.self="closeModal">
      <div class="modal-card">
        <button class="modal-close-btn" aria-label="Close modal" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="modal-content-grid" v-if="selectedProperty">
          <div class="modal-media">
            <img :src="selectedProperty.image" :alt="selectedProperty.title" class="modal-gallery-img">
          </div>
          <div class="modal-details">
            <div>
              <div class="property-location">
                <i class="fa-solid fa-location-dot"></i> {{ selectedProperty.location }}
              </div>
              <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--navy-dark);">{{ selectedProperty.title }}</h2>
              <div class="modal-price">${{ selectedProperty.price.toLocaleString() }} / month</div>
              <p style="color: var(--text-muted); font-size: 0.92rem; margin: 1rem 0 1.5rem; line-height: 1.6;">
                {{ selectedProperty.description }}
              </p>

              <div style="background: var(--gray-bg); padding: 1.2rem; border-radius: var(--radius-md, 12px); margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.95rem; margin-bottom: 0.8rem; color: var(--navy-dark);">Property Specifications:</h4>
                <ul style="font-size: 0.85rem; color: var(--gray-text-sub); display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                  <li><strong>Beds:</strong> {{ selectedProperty.specs.beds }}</li>
                  <li><strong>Baths:</strong> {{ selectedProperty.specs.baths }}</li>
                  <li><strong>Area:</strong> {{ selectedProperty.specs.area }}</li>
                  <li><strong>Parking:</strong> {{ selectedProperty.specs.parking }}</li>
                </ul>
              </div>

              <div>
                <h4 style="font-size: 0.95rem; margin-bottom: 0.6rem; color: var(--navy-dark);">Key Amenities:</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                  <span
                    v-for="amenity in selectedProperty.specs.amenities"
                    :key="amenity"
                    style="background: rgba(245,158,11,0.15); color: #D97706; padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.78rem; font-weight: 600;"
                  >✓ {{ amenity }}</span>
                </div>
              </div>
            </div>

            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
              <a href="#booking" class="btn btn-primary" style="flex: 1;" @click.prevent="scrollTo('booking'); closeModal()">
                Schedule Viewing
              </a>
              <button class="btn btn-outline-dark" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== TOAST NOTIFICATION ==================== -->
    <div class="lp-toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="lp-toast"
      >
        <i class="fa-solid fa-circle-check" style="color: var(--cyan-accent);"></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'

const emit = defineEmits(['switch-view'])
const router = useRouter()

const isLoggedIn = computed(() => {
  return authService.isAuthenticated() || !!localStorage.getItem('auth_user')
})

const goToLogin = () => {
  emit('switch-view', 'login')
  router.push('/login')
}

const goToSignup = () => {
  emit('switch-view', 'signup')
  router.push('/register')
}

// ========== NAVBAR ==========
const isScrolled = ref(false)
const activeSection = ref('hero')
const mobileMenuOpen = ref(false)

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50

  const sections = ['hero', 'about', 'rentals', 'testimonials', 'booking', 'contact']
  let current = 'hero'
  sections.forEach(id => {
    const el = document.getElementById(id)
    if (el && window.scrollY >= el.offsetTop - 120) {
      current = id
    }
  })
  activeSection.value = current
}

// ========== SEARCH ==========
const searchWidget = ref(null)
const aiSearchQuery = ref('')

const scrollToSearch = () => {
  if (searchWidget.value) {
    searchWidget.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    searchWidget.value.style.transform = 'scale(1.03)'
    setTimeout(() => { searchWidget.value.style.transform = 'scale(1)' }, 400)
  }
}

const handleAISearch = () => {
  const queryToPass = aiSearchQuery.value.trim()
  router.push({ path: '/home', query: { q: queryToPass, search: 'true' } })
}

const runQuickSearch = (prompt) => {
  aiSearchQuery.value = prompt
  handleAISearch()
}

// ========== FEATURES ==========
const features = [
  'Curated Luxury Housing Listings',
  'Secure Online Applications',
  'Transparent Leasing Terms',
  'Detailed Floor Plans & Virtual Tours',
  'Smart Filter Search (Location, Price)',
  'Dedicated 24/7 Concierge Support',
]

// ========== ANIMATED COUNTERS ==========
const counters = ref({ leased: 0, cities: 0, tenants: 0 })
let counterStarted = false

const runCounters = () => {
  if (counterStarted) return
  counterStarted = true

  const animate = (key, target, duration = 2000) => {
    const steps = duration / 20
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        counters.value[key] = target
        clearInterval(timer)
      } else {
        counters.value[key] = Math.floor(current)
      }
    }, 20)
  }

  animate('leased', 5000)
  animate('cities', 5)
  animate('tenants', 15000)
}

// ========== FILTER TABS ==========
const filterTabsList = [
  { value: 'all', label: 'All Properties' },
  { value: 'apartment', label: 'Luxury Apartments' },
  { value: 'estate', label: 'Private Estates' },
  { value: 'interior', label: 'Premium Interiors' },
  { value: 'villa', label: 'Modern Villas' },
]
const activeFilter = ref('all')

// ========== PROPERTIES DATA ==========
const properties = ref([
  {
    id: 1,
    category: 'apartment',
    title: 'Luxury Apartments',
    location: 'Marina Bay, Dubai',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    summary: 'Panoramic ocean views with floor-to-ceiling windows and Italian marble finishes.',
    aiMatch: 98,
    badgeStyle: 'background: var(--cyan-accent);',
    beds: 3, baths: 3, area: '2,850 sqft',
    liked: false,
    description: 'Experience the pinnacle of high-rise luxury. This penthouse offers uninterrupted panoramic views of Dubai Marina, bespoke Italian marble flooring, state-of-the-art smart home integration, private elevator access, and a wrap-around balcony.',
    specs: { beds: '3 Bedrooms (Master en-suite)', baths: '3.5 Luxury Bathrooms', area: '2,850 sq.ft (265 m²)', parking: '2 Covered VIP Slots', amenities: ['Private Jacuzzi', 'Infinity Pool Access', '24/7 Concierge', 'Smart Automation'] }
  },
  {
    id: 2,
    category: 'estate',
    title: 'Private Estates',
    location: 'Beverly Hills, CA',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    summary: 'Gated sanctuary featuring infinity pool, private cinema, and lush gardens.',
    aiMatch: 92,
    badgeStyle: 'background: var(--gold-accent); color: var(--navy-dark);',
    beds: 5, baths: 6, area: '5,600 sqft',
    liked: false,
    description: 'A private hilltop oasis nestled in prestigious Beverly Hills. Features an Olympic-sized heated infinity pool, private movie screening cinema, wine cellar, landscaped botanical gardens, and total seclusion.',
    specs: { beds: '5 Master Suites', baths: '6 Bathrooms', area: '5,600 sq.ft (520 m²)', parking: '4 Car Garage', amenities: ['Private Cinema', 'Infinity Pool', 'Gated Security', 'Wine Cellar'] }
  },
  {
    id: 3,
    category: 'interior',
    title: 'Premium Interiors',
    location: 'Kensington, London',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    summary: 'Bespoke Scandinavian interior design with smart climate controls and sun terrace.',
    aiMatch: 89,
    badgeStyle: 'background: var(--cyan-accent);',
    beds: 2, baths: 2, area: '1,950 sqft',
    liked: false,
    description: 'Curated with warm Scandinavian aesthetics and custom acoustic insulation. High exposed wooden ceilings, floor-to-ceiling double-glazed windows, private heated sun terrace, and premium designer furnishings.',
    specs: { beds: '2 Bedrooms', baths: '2 Baths', area: '1,950 sq.ft (181 m²)', parking: '1 Allocated Underground Bay', amenities: ['Sun Terrace', 'Underfloor Heating', 'Custom Interior', 'EV Charging'] }
  },
  {
    id: 4,
    category: 'villa',
    title: 'Palma Vista Waterfront Villa',
    location: 'Miami Beach, FL',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    summary: 'Tropical modern masterpiece located right on the Miami waterfront.',
    aiMatch: 95,
    badgeStyle: 'background: var(--cyan-accent);',
    beds: 4, baths: 4, area: '4,100 sqft',
    liked: false,
    description: 'Tropical modern masterpiece located right on the Miami waterfront. Direct deep-water dock access for private yachts, expansive outdoor entertaining deck with summer kitchen, and rooftop stargazing lounge.',
    specs: { beds: '4 Bedrooms', baths: '4 Baths', area: '4,100 sq.ft (380 m²)', parking: '3 Vehicle Driveway', amenities: ['Private Boat Dock', 'Saltwater Pool', 'Rooftop Lounge', 'Chef Kitchen'] }
  },
  {
    id: 5,
    category: 'apartment',
    title: 'Glasshouse High-Rise Flat',
    location: 'Canary Wharf, London',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    summary: 'Modern urban excellence situated in the financial district.',
    aiMatch: 87,
    badgeStyle: 'background: var(--cyan-accent);',
    beds: 2, baths: 2, area: '1,600 sqft',
    liked: false,
    description: 'Modern urban excellence situated in the financial district. Full access to residential wellness club, steam sauna, skyline gym, and 24-hour executive concierge support.',
    specs: { beds: '2 Bedrooms', baths: '2 Baths', area: '1,600 sq.ft (148 m²)', parking: '1 Underground Slot', amenities: ['Skyline Gym', 'Sauna & Spa', '24/7 Security', 'Private Lounge'] }
  },
  {
    id: 6,
    category: 'estate',
    title: 'Royal Palm Designer Suite',
    location: 'Palm Jumeirah, Dubai',
    price: 8200,
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    summary: 'Ultra-prestigious residence on Palm Jumeirah with private white sand beach access.',
    aiMatch: 93,
    badgeStyle: 'background: var(--gold-accent); color: var(--navy-dark);',
    beds: 3, baths: 3, area: '3,200 sqft',
    liked: false,
    description: 'Ultra-prestigious residence on Palm Jumeirah with private white sand beach access. Designed with handcrafted Italian lighting, gold-finished fittings, and direct sunset views over the Arabian Gulf.',
    specs: { beds: '3 Bedrooms', baths: '3.5 Baths', area: '3,200 sq.ft (297 m²)', parking: '2 VIP Spaces', amenities: ['Private Beach Access', 'Jacuzzi', 'Private Butler Service', 'Valet'] }
  },
])

const filteredProperties = computed(() => {
  if (activeFilter.value === 'all') return properties.value
  return properties.value.filter(p => p.category === activeFilter.value)
})

const toggleFavorite = (property) => {
  property.liked = !property.liked
  showToast(property.liked ? 'Added to saved favorites ❤️' : 'Removed from favorites')
}

// ========== TESTIMONIALS ==========
const testimonials = [
  {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote: 'First-rate service from start to finish! Finding my luxury apartment was effortless and quick. Highly recommended!'
  },
  {
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote: 'Professionalism at its best. The leasing terms were straightforward, digital, and crystal clear from the start.'
  },
  {
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    quote: 'I was looking for a furnished designer home on short notice. VibeLocate AI delivered perfection with incredible ease.'
  },
]

// ========== BOOKING FORM ==========
const bookingForm = ref({ name: '', email: '', phone: '' })
const submitBooking = () => {
  showToast('🎉 Thank you! Your VIP private tour request has been received. Our concierge will contact you shortly.')
  bookingForm.value = { name: '', email: '', phone: '' }
}

// ========== MODAL ==========
const modalOpen = ref(false)
const selectedProperty = ref(null)

const openModal = (property) => {
  selectedProperty.value = property
  modalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  modalOpen.value = false
  document.body.style.overflow = ''
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && modalOpen.value) closeModal()
}

// ========== TOAST ==========
const toasts = ref([])
let toastIdCounter = 0

const showToast = (message) => {
  const id = ++toastIdCounter
  toasts.value.push({ id, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}

// ========== INTERSECTION OBSERVER for counters ==========
let counterObserver = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('keydown', handleKeydown)

  const aboutSection = document.getElementById('about')
  if (aboutSection) {
    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) runCounters()
      })
    }, { threshold: 0.3 })
    counterObserver.observe(aboutSection)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleKeydown)
  if (counterObserver) counterObserver.disconnect()
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Landing page wrapper reset — ensure it doesn't inherit the login background */
.landing-page-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: var(--white);
  /* override any parent flex centering */
  display: block;
  z-index: 0;
}

/* btn-outline-dark used inside modal */
.btn-outline-dark {
  background: transparent;
  color: var(--navy-primary);
  border: 1.5px solid var(--gray-border);
  border-radius: var(--radius-btn);
  padding: 0.75rem 1.8rem;
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.btn-outline-dark:hover {
  background: var(--navy-primary);
  color: var(--white);
}

/* ========== TOAST ========== */
.lp-toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.lp-toast {
  background: var(--navy-dark);
  color: var(--white);
  padding: 1rem 1.5rem;
  border-radius: var(--radius-input);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  border-left: 4px solid var(--cyan-accent);
  animation: lpSlideInToast 0.35s ease forwards;
}

@keyframes lpSlideInToast {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* section-tag used in booking section */
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.light-tag {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--white);
}

/* fade-in class (static, runs once on load) */
.fade-in {
  animation: lpFadeIn 0.8s ease forwards;
}

@keyframes lpFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* about-cta-row */
.about-cta-row {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>
