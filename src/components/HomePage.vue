<template>
  <div class="dubai-home">
    <!-- ==================== HEADER / NAVBAR ==================== -->
    <header class="site-header" :class="{ scrolled: isScrolled }">
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
          <router-link class="nav-item" to="/map">Interactive Map <i class="fa-solid fa-map-location-dot" style="font-size:0.75rem; color:var(--accent-cyan); margin-left:3px;"></i></router-link>
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
      <!-- 1. AI PROCESSING / LOADING SCREEN (IMAGE 1) -->
      <section v-if="aiSearchState === 'loading'" class="ai-processing-screen">
        <!-- Floating Top Search Bar -->
        <div class="ai-top-bar-container">
          <div class="ai-top-bar-header">
            <span class="ai-sparkle">✦</span> AI Contextual Search
          </div>
          <form class="ai-top-bar-form" @submit.prevent="runAiSearch(query)">
            <div class="ai-top-bar-input-wrap">
              <input
                v-model.trim="query"
                type="text"
                class="ai-top-bar-input"
                placeholder="Two-bedroom house in Dubai"
              >
            </div>
            <button type="submit" class="btn-ai-top-search">
              AI Search
            </button>
          </form>
        </div>

        <div class="ai-processing-body">
          <h2 class="ai-processing-title">We arrange the results..........</h2>
          <p class="ai-processing-subtitle">It takes approximately two seconds.</p>

          <div class="ai-checklist-container">
            <div class="ai-checklist-item" :class="{ active: activeStep >= 1 }">
              <div class="ai-check-circle">
                <i class="fa-solid fa-check"></i>
              </div>
              <span class="ai-checklist-text">Natural Language Request Analysis.</span>
            </div>

            <div class="ai-checklist-item" :class="{ active: activeStep >= 2 }">
              <div class="ai-check-circle">
                <i class="fa-solid fa-check"></i>
              </div>
              <span class="ai-checklist-text">Matching Suitable Properties.</span>
            </div>

            <div class="ai-checklist-item" :class="{ active: activeStep >= 3 }">
              <div class="ai-check-circle">
                <i class="fa-solid fa-check"></i>
              </div>
              <span class="ai-checklist-text">Sort results by relevance.</span>
            </div>
          </div>

          <div class="ai-progress-track-wrapper">
            <div class="ai-progress-track">
              <div class="ai-progress-bar-fill" :style="{ width: aiProgress + '%' }"></div>
            </div>
          </div>
        </div>

      </section>

      <!-- 2. AI SEARCH RESULTS SCREEN (IMAGE 2) -->
      <section v-else-if="aiSearchState === 'results'" class="ai-results-screen">
        <div class="ai-results-wrapper">
          <!-- Floating Top Search Bar -->
          <div class="ai-top-bar-container">
            <div class="ai-top-bar-header">
              <span class="ai-sparkle">✦</span> AI Contextual Search
            </div>
            <form class="ai-top-bar-form" @submit.prevent="runAiSearch(query)">
              <div class="ai-top-bar-input-wrap">
                <input
                  v-model.trim="query"
                  type="text"
                  class="ai-top-bar-input"
                  placeholder="Two-bedroom house in Dubai"
                >
              </div>
              <button type="submit" class="btn-ai-top-search">
                AI Search
              </button>
            </form>
          </div>

          <!-- Sorted Header -->
          <h3 class="ai-results-heading">Sorted by match percentage</h3>

          <!-- AI Matched Cards List -->
          <div class="ai-results-cards-list">
            <article
              v-for="prop in aiMatchedList"
              :key="prop.id || prop.title"
              class="ai-property-match-card"
            >
              <div class="ai-match-card-media">
                <img :src="prop.image" :alt="prop.title" loading="lazy">
                <button
                  class="card-fav-btn"
                  :class="{ active: favorites.has(prop.title) }"
                  type="button"
                  :aria-label="'Favorite ' + prop.title"
                  @click.stop="toggleFavorite(prop.title)"
                >
                  <i :class="favorites.has(prop.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                </button>
                <span class="card-property-type-tag">{{ prop.type }}</span>
              </div>
              <div class="ai-match-card-content">
                <div class="ai-match-card-header-row">
                  <div class="ai-match-title-group">
                    <h4 class="ai-match-title">{{ prop.title }}</h4>
                    <span class="ai-match-location">
                      <i class="fa-solid fa-location-dot"></i> {{ prop.area }}
                    </span>
                  </div>
                  <span class="ai-match-percentage-badge">match {{ prop.matchScore }}%</span>
                </div>

                <div class="ai-match-subtitle-row">
                  <span class="ai-match-price">{{ prop.currencySymbol || 'AED ' }}{{ prop.price ? prop.price.toLocaleString() : '' }} <small>{{ prop.period || '/yr' }}</small></span>
                  <span class="ai-match-rental-period">• {{ prop.rent_frequency || 'yearly' }}</span>
                </div>

                <!-- Clear Specs Bar (Beds, Baths, Sqft) -->
                <div class="ai-match-specs-row">
                  <span class="ai-spec-item"><i class="fa-solid fa-bed"></i> {{ prop.beds || 2 }} Beds</span>
                  <span class="ai-spec-item"><i class="fa-solid fa-bath"></i> {{ prop.baths || 2 }} Baths</span>
                  <span class="ai-spec-item"><i class="fa-solid fa-vector-square"></i> {{ prop.size || '1,450' }} Sqft</span>
                </div>

                <!-- Tag Pills -->
                <div class="ai-match-tags-row">
                  <span v-for="tag in prop.tags" :key="tag" class="ai-tag-pill">{{ tag }}</span>
                </div>

                <div class="ai-match-card-footer">
                  <button class="btn-view-ai-prop" @click="showToast('Opening details for ' + prop.title)">
                    <span>View Property Details</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Golden / Amber Details Required Notice Card (Image 2 Bottom) -->
          <div class="ai-refinement-callout-card">
            <h4 class="ai-refinement-title">
              Your request requires more details.
              <span class="ai-refinement-info-icon">i</span>
            </h4>
            <p class="ai-refinement-text">
              Try specifying the budget, area, or type of venue to find better results.
            </p>
          </div>

          <!-- Return to standard home page view -->
          <div class="text-center" style="margin-top: 36px; text-align: center;">
            <button class="ai-back-home-btn" @click="resetToHome">
              <i class="fa-solid fa-arrow-left"></i>
              <span>Back to Home Overview</span>
            </button>
          </div>
        </div>
      </section>

      <!-- 3. AI SERVICE UNAVAILABLE / ERROR SCREEN (IMAGE 1) -->
      <section v-else-if="aiSearchState === 'error'" class="ai-error-screen">
        <!-- Floating Top Search Bar -->
        <div class="ai-top-bar-container">
          <div class="ai-top-bar-header">
            <span class="ai-sparkle">✦</span> AI Contextual Search
          </div>
          <form class="ai-top-bar-form" @submit.prevent="runAiSearch(query)">
            <div class="ai-top-bar-input-wrap">
              <input
                ref="aiInputRef"
                v-model.trim="query"
                type="text"
                class="ai-top-bar-input"
                placeholder="Two-bedroom house in Dubai"
              >
            </div>
            <button type="submit" class="btn-ai-top-search">
              AI Search
            </button>
          </form>
        </div>

        <div class="ai-error-body">
          <h2 class="ai-error-headline">Smart search could not be completed.</h2>
          <p class="ai-error-subtitle">
            The service is currently busy,<br>
            please try again later or use the standard search and filters for now.
          </p>

          <div class="ai-error-buttons-group">
            <button class="btn-ai-retry" @click="runAiSearch(query)">
              Retry
            </button>
            <button class="btn-ai-switch-filters" @click="resetToHome">
              Switch to search using filters
            </button>
          </div>

          <div class="ai-error-divider"></div>

          <div class="ai-error-code-row">
            <span class="ai-error-warning-icon">!</span>
            <span><strong>Error code</strong> AI_ Service_Unavailable</span>
          </div>
        </div>
      </section>

      <!-- 4. AI NO MATCHING PROPERTIES SCREEN (IMAGE 2) -->
      <section v-else-if="aiSearchState === 'no_results'" class="ai-no-results-screen">
        <!-- Floating Top Search Bar -->
        <div class="ai-top-bar-container">
          <div class="ai-top-bar-header">
            <span class="ai-sparkle">✦</span> AI Contextual Search
          </div>
          <form class="ai-top-bar-form" @submit.prevent="runAiSearch(query)">
            <div class="ai-top-bar-input-wrap">
              <input
                ref="aiInputRef"
                v-model.trim="query"
                type="text"
                class="ai-top-bar-input"
                placeholder="Two-bedroom house in Dubai"
              >
            </div>
            <button type="submit" class="btn-ai-top-search">
              AI Search
            </button>
          </form>
        </div>

        <div class="ai-no-results-body">
          <h2 class="ai-no-results-headline">We did not find any matching properties.</h2>
          <p class="ai-no-results-subtitle">
            No results found for your request,<br>
            try adjusting some details.
          </p>

          <h3 class="ai-closest-results-label">Closest available results</h3>

          <div class="ai-closest-card">
            <div class="ai-closest-info">
              <span class="ai-closest-title">Marina Studio</span>
              <span class="ai-closest-sub">Monthly - Dubai Marina $2,500</span>
            </div>
            <span class="ai-match-percentage-badge">match 75%</span>
          </div>

          <button class="btn-ai-modify-request" @click="focusAiSearchInput">
            Modify the request
          </button>
        </div>
      </section>

      <!-- 5. STANDARD HOME PAGE OVERVIEW -->
      <template v-else>
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
                      placeholder="e.g., Two-bedroom house in Dubai"
                    >
                    <button type="submit" class="btn btn-primary search-submit-btn">
                      <i class="fa-solid fa-robot"></i>
                      <span>AI Search</span>
                    </button>
                  </div>

                  <!-- Interactive Quick Prompt Chips for Testing All AI Screens -->
                  <div class="ai-prompt-chips">
                    <span class="chips-label">Demo Prompts:</span>
                    <button type="button" class="ai-chip-pill" @click="runAiSearch('Two-bedroom house in Dubai')">
                      ✦ Two-bedroom house in Dubai
                    </button>
                    <button type="button" class="ai-chip-pill" @click="runAiSearch('Luxury Marina Studio $2,500')">
                      ✦ Marina Studio ($2,500)
                    </button>
                    <button type="button" class="ai-chip-pill chip-err" @click="runAiSearch('error')">
                      ⚠️ Service Busy (Image 1)
                    </button>
                    <button type="button" class="ai-chip-pill chip-none" @click="runAiSearch('no match')">
                      🔍 No Match (Image 2)
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
                <div>
                  <h2 class="section-heading-gradient">Featured Properties</h2>
                  <p class="section-subtext">Hand-picked luxury villas, penthouses, and residences curated by AI</p>
                </div>
                <a href="#featured" class="see-all-link" @click.prevent="visibleFeaturedCount = filteredProperties.length">
                  View All ({{ filteredProperties.length }}) <span class="arrow">&gt;</span>
                </a>
              </div>

              <!-- Modern Luxury Cards Grid -->
              <div class="featured-cards-grid">
                <article
                  v-for="(prop, index) in displayedFeaturedProperties"
                  :key="prop.id || prop.title + index"
                  class="featured-property-card luxury-card"
                  :style="{ animationDelay: `${(index % 4) * 80}ms` }"
                  @click="openPropertyDetails(prop)"
                >
                  <!-- Media Cover Container -->
                  <div class="card-media-wrapper">
                    <img
                      :src="prop.image"
                      :alt="prop.title"
                      class="card-img-cover"
                      loading="lazy"
                      @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'"
                    >
                    
                    <!-- Media Overlay On Hover -->
                    <div class="card-media-overlay">
                      <button
                        type="button"
                        class="btn-quick-view"
                        @click.stop="openPropertyDetails(prop)"
                      >
                        <i class="fa-solid fa-eye"></i> Quick Details
                      </button>
                    </div>

                    <!-- Top Badges -->
                    <div class="card-top-badges">
                      <span class="card-property-tag" :style="prop.badgeStyle">
                        {{ prop.type }}
                      </span>
                      <span class="card-verified-tag">
                        <i class="fa-solid fa-circle-check"></i> Verified
                      </span>
                    </div>

                    <!-- Favorite Heart Button -->
                    <button
                      class="card-fav-btn"
                      :class="{ active: favorites.has(prop.title) }"
                      type="button"
                      :aria-label="'Favorite ' + prop.title"
                      @click.stop="toggleFavorite(prop.title)"
                    >
                      <i :class="favorites.has(prop.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </button>

                    <!-- Bottom AI Match Badge -->
                    <div class="card-match-chip">
                      <i class="fa-solid fa-wand-magic-sparkles"></i>
                      <span>{{ prop.aiMatch || 96 }}% Match</span>
                    </div>
                  </div>

                  <!-- Details Content Box -->
                  <div class="card-details-box">
                    <!-- Price & Rent Tag -->
                    <div class="property-card-pricing">
                      <div class="price-stack">
                        <span class="price-val">{{ prop.currencySymbol || 'AED ' }}{{ prop.price ? prop.price.toLocaleString() : 'N/A' }}</span>
                        <span class="price-period">{{ prop.period || '/yr' }}</span>
                      </div>
                      <span class="rent-tag">{{ prop.rent_frequency || 'yearly' }}</span>
                    </div>

                    <!-- Title & Location -->
                    <h3 class="property-card-title" :title="prop.title">{{ prop.title }}</h3>
                    <p class="property-card-location">
                      <i class="fa-solid fa-location-dot"></i>
                      <span>{{ prop.area }}</span>
                    </p>

                    <!-- Specs Row -->
                    <div class="property-card-specs">
                      <div class="spec-item" title="Bedrooms">
                        <i class="fa-solid fa-bed"></i>
                        <span>{{ prop.beds }} Beds</span>
                      </div>
                      <div class="spec-item" title="Bathrooms">
                        <i class="fa-solid fa-bath"></i>
                        <span>{{ prop.baths }} Baths</span>
                      </div>
                      <div class="spec-item" title="Built-up Area">
                        <i class="fa-solid fa-vector-square"></i>
                        <span>{{ prop.size }} Sqft</span>
                      </div>
                    </div>

                    <!-- Action Footer Button -->
                    <div class="property-card-footer">
                      <button
                        type="button"
                        class="btn-card-details"
                        @click.stop="openPropertyDetails(prop)"
                      >
                        <span>View Details</span>
                        <i class="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </article>

                <!-- Empty State -->
                <div v-if="!filteredProperties.length" class="empty-search-state">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <p>No matching properties found for "{{ query }}".</p>
                  <button class="reset-search-btn" @click="query = ''">Reset Filters</button>
                </div>
              </div>

              <!-- Progressive Load More Section (ماتعرض كل البطاقات مرة واحدة) -->
              <div v-if="filteredProperties.length > 4" class="luxury-load-more-container">
                <div class="load-more-counter-wrap">
                  <span class="counter-text">
                    Showing <strong>{{ Math.min(visibleFeaturedCount, filteredProperties.length) }}</strong> of <strong>{{ filteredProperties.length }}</strong> Properties
                  </span>
                  <div class="counter-progress-bar">
                    <div
                      class="counter-progress-fill"
                      :style="{ width: `${(Math.min(visibleFeaturedCount, filteredProperties.length) / filteredProperties.length) * 100}%` }"
                    ></div>
                  </div>
                </div>

                <div class="load-more-actions">
                  <button
                    v-if="visibleFeaturedCount < filteredProperties.length"
                    type="button"
                    class="btn-luxury-load-more"
                    :class="{ loading: isLoadingMoreFeatured }"
                    :disabled="isLoadingMoreFeatured"
                    @click="loadMoreFeatured"
                  >
                    <i v-if="isLoadingMoreFeatured" class="fa-solid fa-circle-notch fa-spin"></i>
                    <i v-else class="fa-solid fa-circle-plus"></i>
                    <span>{{ isLoadingMoreFeatured ? 'Loading Properties...' : 'Load More Properties' }}</span>
                  </button>

                  <button
                    v-else
                    type="button"
                    class="btn-luxury-show-less"
                    @click="showLessFeatured"
                  >
                    <i class="fa-solid fa-angles-up"></i>
                    <span>Show Less</span>
                  </button>
                </div>
              </div>
            </section>

            <!-- 3. NEARBY & RECOMMENDED -->
            <section id="nearby-section" class="content-block">
              <div class="block-header">
                <div>
                  <h2 class="section-heading-gradient">Nearby &amp; Recommended</h2>
                  <p class="section-subtext">Trending residences in top Dubai prime districts with high resident satisfaction</p>
                </div>
                <a href="#nearby-section" class="see-all-link" @click.prevent="visibleNearbyCount = nearbyProperties.length">
                  View All ({{ nearbyProperties.length }}) <span class="arrow">&gt;</span>
                </a>
              </div>

              <!-- 2-Column Luxury Landscape Showcase Grid -->
              <div class="nearby-cards-grid">
                <article
                  v-for="(prop, nIdx) in displayedNearbyProperties"
                  :key="prop.id || prop.title + nIdx"
                  class="nearby-luxury-showcase-card"
                  :style="{ animationDelay: `${(nIdx % 4) * 90}ms` }"
                  @click="openPropertyDetails(prop)"
                >
                  <!-- Media Container on Left -->
                  <div class="nearby-card-media">
                    <img
                      :src="prop.image"
                      :alt="prop.title"
                      class="nearby-card-img"
                      loading="lazy"
                      @error="(e) => e.target.src = 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=600&q=80'"
                    >
                    <div class="nearby-media-overlay">
                      <span class="nearby-quick-txt"><i class="fa-solid fa-eye"></i> Quick Details</span>
                    </div>

                    <!-- Top Media Badges -->
                    <div class="nearby-top-badges">
                      <span class="nearby-distance-chip">
                        <i class="fa-solid fa-location-crosshairs"></i> {{ (1.2 + (nIdx * 0.7)).toFixed(1) }} km
                      </span>
                      <span class="nearby-rating-chip">
                        <i class="fa-solid fa-star"></i> 4.9
                      </span>
                    </div>

                    <!-- Favorite Button -->
                    <button
                      class="nearby-fav-circle"
                      :class="{ active: favorites.has(prop.title) }"
                      type="button"
                      :aria-label="'Favorite ' + prop.title"
                      @click.stop="toggleFavorite(prop.title)"
                    >
                      <i :class="favorites.has(prop.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </button>

                    <!-- Type Tag -->
                    <span class="nearby-prop-type" :style="prop.badgeStyle">
                      {{ prop.type }}
                    </span>
                  </div>

                  <!-- Details Container on Right -->
                  <div class="nearby-card-content">
                    <div class="nearby-header-row">
                      <span class="nearby-match-tag">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> {{ prop.aiMatch || 94 }}% Match
                      </span>
                      <span class="nearby-verified-pill">
                        <i class="fa-solid fa-circle-check"></i> Verified
                      </span>
                    </div>

                    <h4 class="nearby-card-title" :title="prop.title">{{ prop.title }}</h4>
                    <p class="nearby-card-location">
                      <i class="fa-solid fa-location-dot"></i>
                      <span>{{ prop.area }}</span>
                    </p>

                    <div class="nearby-price-row">
                      <div class="price-stack">
                        <span class="nearby-price-amount">{{ prop.currencySymbol || 'AED ' }}{{ prop.price ? prop.price.toLocaleString() : 'N/A' }}</span>
                        <span class="nearby-price-period">{{ prop.period || '/yr' }}</span>
                      </div>
                      <span class="nearby-rent-pill">{{ prop.rent_frequency || 'yearly' }}</span>
                    </div>

                    <div class="nearby-specs-row">
                      <span class="nearby-spec-item"><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                      <span class="nearby-spec-item"><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                      <span class="nearby-spec-item"><i class="fa-solid fa-vector-square"></i> {{ prop.size }} Sqft</span>
                    </div>

                    <div class="nearby-action-footer">
                      <button
                        type="button"
                        class="btn-nearby-explore"
                        @click.stop="openPropertyDetails(prop)"
                      >
                        <span>Explore Property</span>
                        <i class="fa-solid fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              <!-- Nearby Progressive Load More (ماتعرض كل البطاقات مرة واحدة) -->
              <div v-if="nearbyProperties.length > 4" class="luxury-load-more-container" style="margin-top: 28px;">
                <div class="load-more-counter-wrap">
                  <span class="counter-text">
                    Showing <strong>{{ Math.min(visibleNearbyCount, nearbyProperties.length) }}</strong> of <strong>{{ nearbyProperties.length }}</strong> Recommendations
                  </span>
                  <div class="counter-progress-bar">
                    <div
                      class="counter-progress-fill"
                      :style="{ width: `${(Math.min(visibleNearbyCount, nearbyProperties.length) / nearbyProperties.length) * 100}%` }"
                    ></div>
                  </div>
                </div>

                <div class="load-more-actions">
                  <button
                    v-if="visibleNearbyCount < nearbyProperties.length"
                    type="button"
                    class="btn-luxury-load-more"
                    :class="{ loading: isLoadingMoreNearby }"
                    :disabled="isLoadingMoreNearby"
                    @click="loadMoreNearby"
                  >
                    <i v-if="isLoadingMoreNearby" class="fa-solid fa-circle-notch fa-spin"></i>
                    <i v-else class="fa-solid fa-circle-plus"></i>
                    <span>{{ isLoadingMoreNearby ? 'Loading Recommendations...' : 'Load More Recommendations' }}</span>
                  </button>

                  <button
                    v-else
                    type="button"
                    class="btn-luxury-show-less"
                    @click="showLessNearby"
                  >
                    <i class="fa-solid fa-angles-up"></i>
                    <span>Show Less</span>
                  </button>
                </div>
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
      </template>
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

    <!-- LUXURY PROPERTY DETAILS MODAL -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="isModalOpen && selectedProperty"
          class="property-modal-overlay"
          @click.self="closePropertyDetails"
        >
          <div class="property-modal-container" role="dialog" aria-modal="true">
            <!-- Close Button -->
            <button
              type="button"
              class="modal-close-btn"
              aria-label="Close modal"
              @click="closePropertyDetails"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="modal-grid-layout">
              <!-- Left: Media Showcase -->
              <div class="modal-media-col">
                <div class="modal-hero-image-wrap">
                  <img
                    :src="activeModalImage || selectedProperty.image"
                    :alt="selectedProperty.title"
                    class="modal-hero-img"
                  >
                  <div class="modal-media-badges">
                    <span class="modal-badge-type">{{ selectedProperty.type }}</span>
                    <span class="modal-badge-ai">
                      <i class="fa-solid fa-wand-magic-sparkles"></i> {{ selectedProperty.aiMatch || 96 }}% Match
                    </span>
                  </div>
                </div>

                <!-- Image Thumbnails Strip -->
                <div
                  v-if="selectedProperty.images && selectedProperty.images.length > 1"
                  class="modal-thumbnails-strip"
                >
                  <button
                    v-for="(img, idx) in selectedProperty.images"
                    :key="idx"
                    type="button"
                    class="modal-thumb-btn"
                    :class="{ active: activeModalImage === img }"
                    @click="activeModalImage = img"
                  >
                    <img :src="img" :alt="selectedProperty.title + ' view ' + (idx + 1)">
                  </button>
                </div>

                <!-- AI Insight Note -->
                <div class="modal-ai-recommendation-box">
                  <div class="ai-box-header">
                    <i class="fa-solid fa-robot"></i>
                    <strong>VibeLocate AI Insights</strong>
                  </div>
                  <p>
                    This property matches high lifestyle demand in {{ selectedProperty.area }}, featuring premium finishing, optimal transit accessibility, and strong rental yields.
                  </p>
                </div>
              </div>

              <!-- Right: Details & Specifications -->
              <div class="modal-info-col">
                <div class="modal-info-header">
                  <div class="modal-header-top-row">
                    <span class="modal-verified-pill">
                      <i class="fa-solid fa-certificate"></i> Verified Luxury Listing
                    </span>
                    <button
                      type="button"
                      class="modal-fav-toggle"
                      :class="{ active: favorites.has(selectedProperty.title) }"
                      @click="toggleFavorite(selectedProperty.title)"
                    >
                      <i :class="favorites.has(selectedProperty.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                      <span>{{ favorites.has(selectedProperty.title) ? 'Favorited' : 'Save' }}</span>
                    </button>
                  </div>

                  <h2 class="modal-property-title">{{ selectedProperty.title }}</h2>
                  <p class="modal-property-location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ selectedProperty.area }}</span>
                  </p>

                  <div class="modal-pricing-box">
                    <div class="modal-price-group">
                      <span class="modal-currency">{{ selectedProperty.currencySymbol || 'AED ' }}</span>
                      <span class="modal-price-number">{{ selectedProperty.price ? selectedProperty.price.toLocaleString() : 'N/A' }}</span>
                      <span class="modal-period">{{ selectedProperty.period || '/yr' }}</span>
                    </div>
                    <span class="modal-rent-frequency">{{ selectedProperty.rent_frequency || 'Yearly Lease' }}</span>
                  </div>
                </div>

                <!-- Key Specs Grid -->
                <div class="modal-specs-section">
                  <h4 class="modal-section-title">Property Highlights</h4>
                  <div class="modal-specs-grid">
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-bed"></i>
                      <div>
                        <span class="spec-label">Bedrooms</span>
                        <strong class="spec-value">{{ selectedProperty.beds }} Bedrooms</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-bath"></i>
                      <div>
                        <span class="spec-label">Bathrooms</span>
                        <strong class="spec-value">{{ selectedProperty.baths }} Bathrooms</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-vector-square"></i>
                      <div>
                        <span class="spec-label">Total Area</span>
                        <strong class="spec-value">{{ selectedProperty.size }} Sqft</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-couch"></i>
                      <div>
                        <span class="spec-label">Furnishing</span>
                        <strong class="spec-value" style="text-transform: capitalize;">{{ selectedProperty.is_furnished || 'Unfurnished' }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-square-parking"></i>
                      <div>
                        <span class="spec-label">Parking</span>
                        <strong class="spec-value">{{ selectedProperty.specs?.parking || 'Available' }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-building"></i>
                      <div>
                        <span class="spec-label">Property Type</span>
                        <strong class="spec-value">{{ selectedProperty.type }}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Amenities & Features Tags -->
                <div class="modal-amenities-section">
                  <h4 class="modal-section-title">Amenities &amp; Features</h4>
                  <div class="modal-amenities-tags">
                    <span
                      v-for="(tag, tIdx) in (selectedProperty.tags && selectedProperty.tags.length ? selectedProperty.tags : ['Balcony', 'Central A/C', 'Security', 'Built-in Wardrobes', 'Shared Gym', 'Covered Parking'])"
                      :key="tIdx"
                      class="modal-amenity-chip"
                    >
                      <i class="fa-solid fa-circle-check"></i> {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div class="modal-description-section">
                  <h4 class="modal-section-title">About this property</h4>
                  <p class="modal-description-text">
                    {{ selectedProperty.description || selectedProperty.summary || 'A prestigious residential opportunity offering unmatched comfort, modern architectural finishes, and panoramic views of Dubai.' }}
                  </p>
                </div>

                <!-- Modal Action Buttons -->
                <div class="modal-action-buttons">
                  <button
                    type="button"
                    class="btn-modal-primary"
                    @click="showToast('Scheduling private viewing for ' + selectedProperty.title)"
                  >
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>Schedule a Private Viewing</span>
                  </button>
                  <button
                    type="button"
                    class="btn-modal-secondary"
                    @click="showToast('Connecting you with the verified agent...')"
                  >
                    <i class="fa-solid fa-phone"></i>
                    <span>Contact Agent</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast Feedback Notification -->
    <div class="toast-notification" :class="{ visible: toastVisible }">
      <i class="fa-solid fa-circle-check"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { propertyService } from '../services/propertyService'

const areas = [
  { name: 'Dubai Marina', count: '1,240', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80' },
  { name: 'Palm Jumeirah', count: '856', image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=400&q=80' },
  { name: 'Downtown Dubai', count: '1,080', image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=400&q=80' },
  { name: 'Business Bay', count: '732', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=400&q=80' }
]

const properties = ref([])
const isLoadingProperties = ref(false)
const isLiveApi = ref(false)

// Progressive pagination states (ماتعرض كل البطاقات مرة واحدة)
const visibleFeaturedCount = ref(4)
const isLoadingMoreFeatured = ref(false)
const visibleNearbyCount = ref(4)

// Details Modal State
const selectedProperty = ref(null)
const isModalOpen = ref(false)
const activeModalImage = ref('')

const openPropertyDetails = (prop) => {
  selectedProperty.value = prop
  activeModalImage.value = prop.image || (prop.images && prop.images[0]) || ''
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePropertyDetails = () => {
  isModalOpen.value = false
  setTimeout(() => {
    selectedProperty.value = null
    document.body.style.overflow = ''
  }, 250)
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isModalOpen.value) {
    closePropertyDetails()
  }
}

const nearbyProperties = computed(() => properties.value.slice(4))
const displayedFeaturedProperties = computed(() => filteredProperties.value.slice(0, visibleFeaturedCount.value))
const displayedNearbyProperties = computed(() => nearbyProperties.value.slice(0, visibleNearbyCount.value))

const loadMoreFeatured = () => {
  isLoadingMoreFeatured.value = true
  setTimeout(() => {
    visibleFeaturedCount.value += 4
    isLoadingMoreFeatured.value = false
    showToast(`Loaded more properties (${Math.min(visibleFeaturedCount.value, filteredProperties.value.length)} of ${filteredProperties.value.length})`)
  }, 350)
}

const showLessFeatured = () => {
  visibleFeaturedCount.value = 4
  const section = document.getElementById('featured')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

const isLoadingMoreNearby = ref(false)

const loadMoreNearby = () => {
  isLoadingMoreNearby.value = true
  setTimeout(() => {
    visibleNearbyCount.value += 4
    isLoadingMoreNearby.value = false
    showToast(`Loaded more recommendations (${Math.min(visibleNearbyCount.value, nearbyProperties.value.length)} of ${nearbyProperties.value.length})`)
  }, 350)
}

const showLessNearby = () => {
  visibleNearbyCount.value = 4
  const section = document.getElementById('nearby-section')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const query = ref('')
const favorites = ref(new Set())
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)
const searchWidget = ref(null)
const searchMessage = ref('')
const toastMessage = ref('')
const toastVisible = ref(false)

/* AI Contextual Search Interactive States */
const aiSearchState = ref('idle') // 'idle' | 'loading' | 'results' | 'error' | 'no_results'
const aiProgress = ref(0)
const activeStep = ref(1)
const aiInputRef = ref(null)
let progressInterval = null

const aiMatchedList = ref([])

const focusAiSearchInput = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  setTimeout(() => {
    if (aiInputRef.value) {
      aiInputRef.value.focus()
    }
  }, 300)
}

const realEstateDomainKeywords = [
  'house', 'villa', 'studio', 'apartment', 'home', 'dubai', 'bedroom', 'bed', 'bath',
  'rent', 'buy', 'marina', 'palm', 'jumeirah', 'downtown', 'jvc', 'business bay',
  'beach', 'pool', 'luxury', 'calm', 'cafe', 'cafes', 'budget', '$', 'dollar',
  'monthly', 'yearly', 'penthouse', 'townhouse', 'view', 'sea', 'city', 'flat', 'property',
  'room', 'estate', 'hills'
]

const isMeaningfulQuery = (str) => {
  const clean = (str || '').toLowerCase().trim()
  if (!clean) return false // Empty search -> Error screen

  // Check for random gibberish consonants or invalid patterns (e.g. asdfgh, qwerty, 123456)
  if (/^[bcdfghjklmnpqrstvwxyz]{4,}$/i.test(clean) || /^\d+$/.test(clean) || clean.length < 2) {
    return false
  }

  // Check if query contains domain keywords or valid multi-word input
  const hasDomainKeyword = realEstateDomainKeywords.some(kw => clean.includes(kw))
  if (hasDomainKeyword) return true

  const words = clean.split(/\s+/).filter(Boolean)
  if (words.length >= 2) return true

  return false
}

const runAiSearch = (customQuery) => {
  if (customQuery !== undefined) {
    query.value = customQuery
  }

  const qTrim = query.value.trim()
  const qLower = qTrim.toLowerCase()

  // 1. IF SEARCH IS EMPTY OR CONTAINS INCOMPREHENSIBLE / GIBBERISH TEXT -> TRIGGER ERROR SCREEN (IMAGE 1)
  if (!qTrim || !isMeaningfulQuery(qTrim) || qLower.includes('error') || qLower.includes('busy') || qLower.includes('fail') || route.query.state === 'error') {
    if (progressInterval) clearInterval(progressInterval)
    aiSearchState.value = 'error'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // 2. IF SEARCH IS EXPLICITLY UNMATCHED -> TRIGGER NO RESULTS SCREEN (IMAGE 2)
  if (qLower.includes('no match') || qLower.includes('nomatch') || qLower.includes('unmatched') || route.query.state === 'no_results') {
    if (progressInterval) clearInterval(progressInterval)
    aiSearchState.value = 'no_results'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  // 3. VALID QUERY -> RUN 2-SECOND LOADING ANALYSIS ANIMATION -> RESULTS SCREEN
  aiSearchState.value = 'loading'
  aiProgress.value = 0
  activeStep.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })

  let searchCompleted = false
  let searchReturnedResults = false

  // Trigger dynamic AI search against real property database and AI endpoint
  propertyService.searchWithAi(qTrim).then(res => {
    searchCompleted = true
    if (res?.data && res.data.length > 0) {
      searchReturnedResults = true
      aiMatchedList.value = res.data.slice(0, 8)
    } else {
      searchReturnedResults = false
      aiMatchedList.value = []
    }
  }).catch(err => {
    searchCompleted = true
    searchReturnedResults = false
    console.warn('AI search error:', err)
  })

  if (progressInterval) clearInterval(progressInterval)

  const startTime = Date.now()
  const duration = 2000 // 2 seconds animation matching mockup requirement

  progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(100, Math.floor((elapsed / duration) * 100))
    aiProgress.value = progress

    if (progress >= 33 && progress < 66) {
      activeStep.value = 2
    } else if (progress >= 66) {
      activeStep.value = 3
    }

    if (progress >= 100) {
      clearInterval(progressInterval)
      setTimeout(() => {
        if (searchCompleted && !searchReturnedResults && (!aiMatchedList.value || aiMatchedList.value.length === 0)) {
          aiSearchState.value = 'no_results'
        } else {
          aiSearchState.value = 'results'
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 150)
    }
  }, 30)
}

const resetToHome = () => {
  if (progressInterval) clearInterval(progressInterval)
  aiSearchState.value = 'idle'
  query.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const router = useRouter()
const route = useRoute()

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
  if (!term) return properties.value
  return properties.value.filter(p =>
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
  runAiSearch(query.value)
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

const loadProperties = async () => {
  isLoadingProperties.value = true
  try {
    const res = await propertyService.getHomeData()
    if (res?.properties && res.properties.length > 0) {
      properties.value = res.properties
      isLiveApi.value = true
      if (!aiMatchedList.value.length) {
        aiMatchedList.value = res.properties.slice(0, 2)
      }
    }
  } catch (err) {
    console.error('Failed loading properties from /api/home in HomePage:', err)
  } finally {
    isLoadingProperties.value = false
  }
}

onMounted(async () => {
  // 1. Instantly load cached user data from storage
  loadUserFromStorage()

  // 2. Fetch real properties from API / database
  await loadProperties()

  // 3. Add document listener for dropdown outside clicks
  document.addEventListener('click', handleDocumentClick)

  // 4. Trigger AI Search if query parameters exist from landing page search
  if (route.query.q || route.query.search === 'true') {
    const initialQuery = (route.query.q || '').toString()
    runAiSearch(initialQuery || 'Two-bedroom house in Dubai')
  }

  // 5. Fetch latest profile from API if token exists
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

  // 6. Keyboard listener for Escape key to close modal
  window.addEventListener('keydown', handleKeyDown)

  // 7. Window scroll listener for fixed sticky navbar
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  document.body.style.overflow = ''
})
</script>

<style src="../assets/dubai-home.css"></style>
