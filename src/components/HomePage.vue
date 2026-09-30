<template>
  <div class="dubai-home" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme">
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
              <span>{{ t('homeAiPlatform') }}</span>
            </div>

            <h1 class="hero-title fade-in">
              {{ t('homeHeroTitlePart1') }}<br>
              <span class="text-cyan-bright">{{ t('homeHeroTitlePart2') }}</span>
            </h1>

            <p class="hero-desc fade-in">
              {{ t('homeHeroSubtitle') }}
            </p>

            <!-- شريط البحث العصري المتكامل -->
<!-- شريط البحث العصري المتكامل -->
<div class="green-hero-search">
  <div class="ghs-ai-pill">
    <i class="fa-solid fa-magnifying-glass ghs-search-icon"></i>
    <input
      type="text"
      class="ghs-ai-input"
      v-model="query"
      :placeholder="isRtl ? 'ابحث عن عقار أحلامك بالذكاء الاصطناعي...' : 'Search for your dream home with AI'"
      @keydown.enter.prevent="handleSearch"
    />
    <button type="button" class="ghs-ai-btn" @click="handleSearch">
      <i class="fa-solid fa-wand-magic-sparkles"></i> {{ isRtl ? 'بحث ذكي' : 'Search AI' }}
    </button>
  </div>

  <div class="ghs-divider">{{ isRtl ? 'أو واصل البحث باستخدام الفلاتر أدناه' : 'or continue using the filters below' }}</div>

  <div class="ghs-row">
    <div class="ghs-toggle-group">
      <button
        type="button"
        class="ghs-toggle"
        :class="{ active: homePurpose === 'sale' }"
        @click="homePurpose = 'sale'"
      >
        {{ t('forSale') }}
      </button>
      <button
        type="button"
        class="ghs-toggle"
        :class="{ active: homePurpose === 'rent' }"
        @click="homePurpose = 'rent'"
      >
        {{ t('forRent') }}
      </button>
    </div>
    
    <div class="ghs-location-wrap">
      <i class="fa-solid fa-location-dot ghs-loc-icon"></i>
      <input
        type="text"
        class="ghs-loc-input"
        v-model="homeLocation"
        :placeholder="t('enterLocation') || (isRtl ? 'أدخل الموقع أو الحي' : 'Enter location')"
        @keydown.enter.prevent="handleSearch"
      />
    </div>

    <button type="button" class="ghs-search-btn" @click="handleSearch">{{ t('search') }}</button>
  </div>

  <div class="ghs-row ghs-row-bottom">
    <div class="ghs-toggle-group">
      <button
        type="button"
        class="ghs-toggle"
        :class="{ active: homeStatus === 'all' }"
        @click="homeStatus = 'all'"
      >
        {{ t('allPurpose') || (isRtl ? 'الكل' : 'All') }}
      </button>
      <button
        type="button"
        class="ghs-toggle"
        :class="{ active: homeStatus === 'ready' }"
        @click="homeStatus = 'ready'"
      >
        {{ t('readyToMove') || (isRtl ? 'جاهز' : 'Ready') }}
      </button>
      <button
        type="button"
        class="ghs-toggle"
        :class="{ active: homeStatus === 'offplan' }"
        @click="homeStatus = 'offplan'"
      >
        {{ t('offPlan') || (isRtl ? 'على المخطط' : 'Off-Plan') }}
      </button>
    </div>
    
    <div class="ghs-select-wrap">
      <select class="ghs-select" v-model="homeType">
        <option value="all">{{ isRtl ? 'جميع العقارات' : 'All Properties' }}</option>
        <option value="Apartment">{{ t('apartment') }}</option>
        <option value="Villa">{{ t('villa') }}</option>
        <option value="Penthouse">{{ t('penthouse') }}</option>
        <option value="Townhouse">{{ t('townhouse') }}</option>
        <option value="Office">{{ isRtl ? 'مكتب' : 'Office' }}</option>
      </select>
      <i class="fa-solid fa-caret-down ghs-caret"></i>
    </div>
    
    <div class="ghs-select-wrap">
      <select class="ghs-select" v-model="homeBedrooms">
        <option value="any">{{ t('bedsAndBaths') }}</option>
        <option value="1">{{ isRtl ? '1 غرفة' : '1 Bed' }}</option>
        <option value="2">{{ isRtl ? '2 غرفة' : '2 Beds' }}</option>
        <option value="3">{{ isRtl ? '3 غرف' : '3 Beds' }}</option>
        <option value="4">{{ isRtl ? '4 غرف' : '4 Beds' }}</option>
        <option value="5+">{{ isRtl ? '5+ غرف' : '5+ Beds' }}</option>
      </select>
      <i class="fa-solid fa-caret-down ghs-caret"></i>
    </div>
    
    <div class="ghs-select-wrap">
      <select class="ghs-select" v-model="homePrice">
        <option value="any">{{ t('priceAed') }}</option>
        <option value="under-2m">{{ isRtl ? 'أقل من 2 مليون' : '< AED 2M' }}</option>
        <option value="2m-5m">{{ isRtl ? '2 - 5 مليون' : 'AED 2M-5M' }}</option>
        <option value="5m-10m">{{ isRtl ? '5 - 10 مليون' : 'AED 5M-10M' }}</option>
        <option value="10m-plus">{{ isRtl ? 'أكثر من 10 مليون' : 'AED 10M+' }}</option>
      </select>
      <i class="fa-solid fa-caret-down ghs-caret"></i>
    </div>
  </div>
</div>
          </div>
        </section>

      <!-- TWO-COLUMN CONTENT AREA -->
      <div class="main-container">
        <div class="content-columns-wrapper">
          <!-- LEFT / PRIMARY COLUMN -->
          <div class="primary-column">
            <!-- 1. POPULAR AREAS -->
            <section id="areas" class="content-block" v-if="areas.length > 0">
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
              <div v-if="isLoadingProperties" class="featured-cards-grid">
                <div v-for="n in 4" :key="'f-skel-' + n" class="featured-property-card luxury-card card-skeleton-item">
                  <div class="skeleton-thumb-box"></div>
                  <div class="card-details-box">
                    <div class="skeleton-line title"></div>
                    <div class="skeleton-line loc"></div>
                    <div class="skeleton-line price"></div>
                    <div class="skeleton-line specs"></div>
                  </div>
                </div>
              </div>

              <div v-else-if="displayedFeaturedProperties.length === 0" class="no-properties-box">
                <i class="fa-solid fa-building-circle-xmark"></i>
                <h3>{{ isRtl ? 'لا توجد عقارات مميزة حالياً' : 'No featured properties found' }}</h3>
                <p>{{ isRtl ? 'جاري تحديث قائمة العقارات من قاعدة البيانات' : 'Updating properties catalog from database' }}</p>
              </div>

              <div v-else class="featured-cards-grid">
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
                      <span class="card-property-tag" :class="{ 'is-luxury-type': prop.type === 'Villa' || prop.type === 'Penthouse' }">
                        {{ prop.type }}
                      </span>
                      <span class="card-verified-tag">
                        <i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'موثق' : 'Verified' }}
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
                      <span>{{ prop.aiMatch || 96 }}% {{ isRtl ? 'تطابق' : 'Match' }}</span>
                    </div>
                  </div>

                  <!-- Details Content Box -->
                  <div class="card-details-box">
                    <!-- Price & Rent Tag -->
                    <div class="property-card-pricing">
                      <div class="price-stack">
                        <span class="price-val">{{ prop.currencySymbol || 'AED ' }}{{ prop.price ? prop.price.toLocaleString() : 'N/A' }}</span>
                        <span class="price-period">{{ prop.period || (isRtl ? '/سنوياً' : '/yr') }}</span>
                      </div>
                      <span class="rent-tag">{{ prop.rent_frequency || (isRtl ? 'سنوي' : 'yearly') }}</span>
                    </div>

                    <!-- Title & Location -->
                    <h3 class="property-card-title" :title="prop.title">{{ prop.title }}</h3>
                    <p class="property-card-location">
                      <i class="fa-solid fa-location-dot"></i>
                      <span>{{ prop.area }}</span>
                    </p>

                    <!-- Specs Row -->
                    <div class="property-card-specs">
                      <div class="spec-item" :title="t('beds')">
                        <i class="fa-solid fa-bed"></i>
                        <span>{{ prop.beds }} {{ t('beds') }}</span>
                      </div>
                      <div class="spec-item" :title="t('baths')">
                        <i class="fa-solid fa-bath"></i>
                        <span>{{ prop.baths }} {{ t('baths') }}</span>
                      </div>
                      <div class="spec-item" :title="t('totalArea')">
                        <i class="fa-solid fa-vector-square"></i>
                        <span>{{ prop.size }} {{ t('sqft') }}</span>
                      </div>
                    </div>

                    <!-- Action Footer Button -->
                    <div class="property-card-footer">
                      <button
                        type="button"
                        class="btn-card-details"
                        @click.stop="openPropertyDetails(prop)"
                      >
                        <span>{{ t('viewDetails') }}</span>
                        <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
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
              <div v-if="isLoadingProperties" class="nearby-cards-grid">
                <div v-for="n in 4" :key="'n-skel-' + n" class="nearby-luxury-showcase-card card-skeleton-item">
                  <div class="nearby-card-media skeleton-thumb-box"></div>
                  <div class="nearby-card-details">
                    <div class="skeleton-line title"></div>
                    <div class="skeleton-line loc"></div>
                    <div class="skeleton-line price"></div>
                  </div>
                </div>
              </div>

              <div v-else-if="displayedNearbyProperties.length === 0" class="no-properties-box">
                <i class="fa-solid fa-building-circle-xmark"></i>
                <h3>{{ isRtl ? 'لا توجد توصيات حالياً' : 'No nearby recommendations found' }}</h3>
                <p>{{ isRtl ? 'جاري استيراد التوصيات العقارية' : 'Fetching latest property recommendations' }}</p>
              </div>

              <div v-else class="nearby-cards-grid">
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
                    <span class="nearby-prop-type" :class="{ 'is-luxury-type': prop.type === 'Villa' || prop.type === 'Penthouse' }">
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
            <article v-if="currentAgent" class="agent-profile-card">
              <div class="agent-card-header-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 class="sidebar-card-title" style="margin: 0;">{{ isRtl ? 'أفضل الوكلاء العقاريين' : 'Top Real Estate Agent' }}</h3>
                <div v-if="topAgents.length > 1" class="agent-nav-arrows" style="display: flex; gap: 6px; align-items: center;">
                  <button type="button" class="agent-nav-btn" @click="prevAgent" :title="isRtl ? 'السابق' : 'Previous'" style="width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                    <i class="fa-solid fa-chevron-left"></i>
                  </button>
                  <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">{{ activeAgentIndex + 1 }}/{{ topAgents.length }}</span>
                  <button type="button" class="agent-nav-btn" @click="nextAgent" :title="isRtl ? 'التالي' : 'Next'" style="width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              
              <div class="agent-meta-row">
                <img class="agent-avatar-img" :src="currentAgent.avatar" :alt="currentAgent.name" @error="(e) => e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentAgent.name) + '&background=0284c7&color=fff'">
                <div class="agent-name-rating">
                  <strong class="agent-fullname">{{ currentAgent.name }}</strong>
                  <span class="agent-designation">
                    {{ currentAgent.is_manager ? (isRtl ? 'مدير وكالة معتمد' : 'Agency Manager') : (isRtl ? 'مستشار عقاري معتمد' : 'Senior Real Estate Consultant') }}
                  </span>
                  <div class="agent-star-rating">
                    <span class="stars">★</span> <b>4.9</b> <span class="review-count">({{ currentAgent.agencyName }})</span>
                  </div>
                </div>
              </div>

              <div class="agent-contact-rows">
                <a class="agent-contact-pill" :href="'tel:' + currentAgent.phone">
                  <i class="fa-solid fa-phone"></i>
                  <span>{{ currentAgent.phone }}</span>
                </a>
                <a class="agent-contact-pill" :href="'mailto:' + currentAgent.email">
                  <i class="fa-regular fa-envelope"></i>
                  <span>{{ currentAgent.email }}</span>
                </a>
              </div>

              <button class="btn-contact-agent" type="button" @click="showToast((isRtl ? 'جاري الاتصال بالوكيل: ' : 'Connecting you with ') + currentAgent.name + '...')">
                {{ isRtl ? 'تواصل مع الوكيل' : 'Contact Agent' }}
              </button>
            </article>

            <!-- LIST YOUR PROPERTY PROMO CARD -->
            <article class="list-property-promo-card">
              <div class="promo-content">
                <h3 class="promo-heading">List Your Property<br>With Dubai Estates</h3>
                <p class="promo-description">Reach thousands of potential buyers and renters.</p>
                <button class="btn-promo-action" type="button" @click="$router.push('/add-property')">
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
                      <i class="fa-solid fa-certificate"></i> {{ t('verifiedLuxuryListing') }}
                    </span>
                    <button
                      type="button"
                      class="modal-fav-toggle"
                      :class="{ active: favorites.has(selectedProperty.title) }"
                      @click="toggleFavorite(selectedProperty.title)"
                    >
                      <i :class="favorites.has(selectedProperty.title) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                      <span>{{ favorites.has(selectedProperty.title) ? t('favorited') : t('save') }}</span>
                    </button>
                  </div>

                  <h2 class="modal-property-title">{{ selectedProperty.title }}</h2>
                  <p class="modal-property-location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ selectedProperty.area }}</span>
                  </p>

                  <div class="modal-pricing-box">
                    <div class="modal-price-group">
                      <span class="modal-currency">{{ selectedProperty.currencySymbol || (isRtl ? 'د.إ ' : 'AED ') }}</span>
                      <span class="modal-price-number">{{ selectedProperty.price ? selectedProperty.price.toLocaleString() : 'N/A' }}</span>
                      <span class="modal-period">{{ selectedProperty.period || (isRtl ? '/سنوياً' : '/yr') }}</span>
                    </div>
                    <span class="modal-rent-frequency">{{ selectedProperty.rent_frequency || (isRtl ? 'إيجار سنوي' : 'Yearly Lease') }}</span>
                  </div>
                </div>

                <!-- Key Specs Grid -->
                <div class="modal-specs-section">
                  <h4 class="modal-section-title">{{ t('propertyHighlights') }}</h4>
                  <div class="modal-specs-grid">
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-bed"></i>
                      <div>
                        <span class="spec-label">{{ t('beds') }}</span>
                        <strong class="spec-value">{{ selectedProperty.specs?.beds || (selectedProperty.beds + ' ' + t('beds')) }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-bath"></i>
                      <div>
                        <span class="spec-label">{{ t('baths') }}</span>
                        <strong class="spec-value">{{ selectedProperty.specs?.baths || (selectedProperty.baths + ' ' + t('baths')) }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-vector-square"></i>
                      <div>
                        <span class="spec-label">{{ t('totalArea') }}</span>
                        <strong class="spec-value">{{ selectedProperty.specs?.area || (selectedProperty.size + ' ' + t('sqft')) }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-couch"></i>
                      <div>
                        <span class="spec-label">{{ t('furnishing') }}</span>
                        <strong class="spec-value">{{ selectedProperty.specs?.furnishing || (selectedProperty.is_furnished || (isRtl ? 'غير مفروش' : 'Unfurnished')) }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-square-parking"></i>
                      <div>
                        <span class="spec-label">{{ t('parking') }}</span>
                        <strong class="spec-value">{{ selectedProperty.specs?.parking || (isRtl ? 'مشمول' : 'Included') }}</strong>
                      </div>
                    </div>
                    <div class="modal-spec-card">
                      <i class="fa-solid fa-building-shield"></i>
                      <div>
                        <span class="spec-label">{{ isRtl ? 'النوع' : 'Property Type' }}</span>
                        <strong class="spec-value">{{ selectedProperty.type }}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Amenities Tags -->
                <div v-if="selectedProperty.tags && selectedProperty.tags.length" class="modal-amenities-section">
                  <h4 class="modal-section-title">{{ t('amenities') }}</h4>
                  <div class="modal-amenities-tags">
                    <span v-for="(tag, idx) in selectedProperty.tags" :key="idx" class="modal-amenity-tag">
                      <i class="fa-solid fa-check"></i> {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div class="modal-description-section">
                  <h4 class="modal-section-title">{{ isRtl ? 'نبذة عن العقار' : 'About this property' }}</h4>
                  <p class="modal-description-text">
                    {{ selectedProperty.description || selectedProperty.summary || (isRtl ? 'فرصة سكنية مميزة تقدم أسلوب حياة استثنائي في دبي مع تصميم عصري وتشطيبات عالية الجودة.' : 'A prestigious residential opportunity offering unmatched comfort, modern architectural finishes, and panoramic views of Dubai.') }}
                  </p>
                </div>

                <!-- Modal Action Buttons -->
                <div class="modal-action-buttons">
                  <button
                    type="button"
                    class="btn-modal-primary"
                    @click="$router.push('/payment')"
                  >
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>{{ t('proceedToBooking') }}</span>
                  </button>
                  <button
                    type="button"
                    class="btn-modal-secondary"
                    @click="showToast(isRtl ? 'جاري تحويلك للمستشار المعتمد...' : 'Connecting you with the verified agent...')"
                  >
                    <i class="fa-solid fa-phone"></i>
                    <span>{{ isRtl ? 'تواصل مع المستشار' : 'Contact Agent' }}</span>
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

    <!-- Saved Properties Modal -->
    <SavedPropertiesModal
      :is-open="isSavedModalOpen"
      @close="isSavedModalOpen = false"
      @open-property="openPropertyDetails"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { propertyService } from '../services/propertyService'
import NavbarControls from './NavbarControls.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'
import { favoritesService } from '../services/favoritesService'
import SavedPropertiesModal from './SavedPropertiesModal.vue'

const { t, isRtl, theme, lang, locProp } = useThemeAndLanguage()

const areas = ref([])
const topAgents = ref([])
const activeAgentIndex = ref(0)

const currentAgent = computed(() => {
  if (topAgents.value && topAgents.value.length > 0) {
    const a = topAgents.value[activeAgentIndex.value] || topAgents.value[0]
    return {
      name: a.name || 'Agent',
      phone: a.phone || '+971501000001',
      avatar: a.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.name || 'Agent')}&background=0284c7&color=fff`,
      is_manager: Boolean(a.is_manager),
      agencyName: a.agency?.name || 'VibeLocate Real Estate',
      email: a.email || `${(a.name || 'agent').toLowerCase().replace(/\s+/g, '.')}@vibelocate.ai`
    }
  }
  return null
})

const nextAgent = () => {
  if (topAgents.value.length > 0) {
    activeAgentIndex.value = (activeAgentIndex.value + 1) % topAgents.value.length
  }
}

const prevAgent = () => {
  if (topAgents.value.length > 0) {
    activeAgentIndex.value = (activeAgentIndex.value - 1 + topAgents.value.length) % topAgents.value.length
  }
}

const properties = ref([])
const isLoadingProperties = ref(true)
const isLiveApi = ref(false)

// Progressive pagination states
const visibleFeaturedCount = ref(4)
const isLoadingMoreFeatured = ref(false)
const visibleNearbyCount = ref(4)

// Details Modal State
const selectedProperty = ref(null)
const isModalOpen = ref(false)
const activeModalImage = ref('')

const openPropertyDetails = (prop) => {
  const localized = locProp(prop)
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(localized))
  router.push({ name: 'PropertyDetails', params: { id: prop.id || encodeURIComponent(prop.slug || prop.title) } })
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

const nearbyProperties = computed(() => properties.value.slice(4).map(p => locProp(p)))
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
const isSavedModalOpen = ref(false)
const favorites = computed(() => favoritesService.savedKeys.value)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)
const searchWidget = ref(null)
const searchMessage = ref('')
const toastMessage = ref('')
const toastVisible = ref(false)

const homePurpose = ref('sale')
const homeLocation = ref('')
const homeStatus = ref('all')
const homeType = ref('all')
const homeBedrooms = ref('any')
const homePrice = ref('any')

const handleSearch = () => {
  const q = (query.value || '').trim()
  const loc = (homeLocation.value || '').trim()
  const queryObj = {}

  if (q) queryObj.q = q
  if (loc) queryObj.location = loc
  if (homePurpose.value && homePurpose.value !== 'all') queryObj.purpose = homePurpose.value
  if (homeType.value && homeType.value !== 'all') queryObj.type = homeType.value
  if (homeStatus.value && homeStatus.value !== 'all') queryObj.status = homeStatus.value
  if (homeBedrooms.value && homeBedrooms.value !== 'any') queryObj.bedrooms = homeBedrooms.value
  if (homePrice.value && homePrice.value !== 'any') queryObj.price = homePrice.value

  router.push({
    path: '/search',
    query: queryObj
  })
}

const searchByArea = (areaName) => {
  if (!areaName) return
  router.push({
    path: '/search',
    query: { location: areaName }
  })
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
  const localized = properties.value.map(p => locProp(p))
  if (!term) return localized
  return localized.filter(p =>
    `${p.title} ${p.area} ${p.type} ${p.price}`.toLowerCase().includes(term)
  )
})

const toggleFavorite = (prop) => {
  const targetProp = typeof prop === 'string'
    ? properties.value.find(p => p.title === prop) || { title: prop }
    : prop

  const isSaved = favoritesService.toggleSave(targetProp)
  if (isSaved) {
    showToast(`Added "${targetProp.title || 'Property'}" to favorites ❤️`)
  } else {
    showToast(`Removed from favorites`)
  }
}

/* removed duplicate handleSearch
  runAiSearch(query.value)
}*/

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
  const langKey = isRtl.value ? 'ar' : 'en'
  try {
    const res = await propertyService.getHomeData(langKey)
    if (res?.properties && res.properties.length > 0) {
      properties.value = res.properties
      isLiveApi.value = true
      if (!aiMatchedList.value.length) {
        aiMatchedList.value = res.properties.slice(0, 2)
      }
    }

    if (Array.isArray(res?.popularAreas) && res.popularAreas.length > 0) {
      areas.value = res.popularAreas.map(a => ({
        name: a.name || a.name_en || 'Dubai',
        count: a.properties_count ? a.properties_count.toLocaleString() : (a.count || '50+'),
        image: a.image_url || a.image || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80'
      }))
    } else {
      const areaRes = await propertyService.getPopularAreas(langKey)
      if (areaRes?.data && areaRes.data.length > 0) {
        areas.value = areaRes.data.map(a => ({
          name: a.name || a.name_en || 'Dubai',
          count: a.properties_count ? a.properties_count.toLocaleString() : (a.count || '50+'),
          image: a.image_url || a.image || 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&q=80'
        }))
      }
    }

    if (Array.isArray(res?.topAgents) && res.topAgents.length > 0) {
      topAgents.value = res.topAgents
    } else {
      const agentRes = await propertyService.getTopAgents(langKey)
      if (agentRes?.data && agentRes.data.length > 0) {
        topAgents.value = agentRes.data
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
    query.value = initialQuery || 'Two-bedroom house in Dubai'
    handleSearch()
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
<style>
.ghs-ai-pill {
  padding: 8px 12px 8px 24px;
}
.ghs-search-icon {
  color: #9ca3af;
  margin-right: 12px;
  font-size: 16px;
}
.ghs-ai-btn {
  background: linear-gradient(135deg, #0072ff 0%, #00d2ff 100%);
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-left: 12px;
}
.ghs-ai-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.4);
}

</style>
<style>
/* Green Hero Search Widget */
.green-hero-search {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  margin: 32px auto 0;
  width: 100%;
}

.ghs-ai-pill {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  padding: 14px 24px;
  background: #ffffff;
  transition: border-color 0.2s;
}

.ghs-ai-pill:focus-within {
  border-color: #00d2ff;
}

.ghs-ai-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  color: #374151;
  background: transparent;
}

.ghs-ai-input::placeholder {
  color: #9ca3af;
}

.ghs-sparkle {
  font-size: 20px;
  background: linear-gradient(135deg, #3b82f6, #10b981, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ghs-divider {
  text-align: center;
  color: #9ca3af;
  font-size: 15px;
  margin: 20px 0;
  font-weight: 500;
}

.ghs-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.ghs-row-bottom {
  margin-bottom: 0;
}

.ghs-toggle-group {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 4px;
  background: #ffffff;
  gap: 4px;
}

.ghs-toggle {
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #4b5563;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.ghs-toggle.active {
  background: #e0f2fe;
  color: #0284c7;
}

.ghs-location-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0 16px;
  background: #ffffff;
}

.ghs-loc-icon {
  color: #0f766e;
  font-size: 18px;
  margin-right: 12px;
}

.ghs-loc-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #374151;
}

.ghs-search-btn {
  background: linear-gradient(135deg, #0072ff 0%, #00d2ff 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0 36px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.ghs-search-btn:hover {
  background: linear-gradient(135deg, #005bb5 0%, #00a8cc 100%);
}

.ghs-select-wrap {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.ghs-select {
  width: 100%;
  appearance: none;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 32px 12px 16px;
  font-size: 15px;
  color: #374151;
  cursor: pointer;
}

.ghs-caret {
  position: absolute;
  right: 16px;
  color: #6b7280;
  pointer-events: none;
}

@media (max-width: 768px) {
  .ghs-row {
    flex-direction: column;
  }
  .ghs-toggle-group {
    justify-content: space-between;
  }
  .ghs-toggle {
    flex: 1;
  }
  .ghs-search-btn {
    padding: 14px;
  }
}
</style>
<style>
/* Skeleton and Empty State Styles */
.card-skeleton-item {
  animation: pulse 1.6s ease-in-out infinite;
  pointer-events: none;
}
.skeleton-thumb-box {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #132238 25%, #1d3354 50%, #132238 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}
.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #132238 25%, #1d3354 50%, #132238 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 8px;
}
.skeleton-line.title { width: 85%; height: 16px; margin-top: 10px; }
.skeleton-line.loc { width: 55%; }
.skeleton-line.price { width: 45%; height: 18px; margin: 12px 0 8px; }
.skeleton-line.specs { width: 75%; height: 14px; }
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
  padding: 50px 24px;
  background: rgba(13, 27, 46, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  min-height: 240px;
}
.no-properties-box i {
  font-size: 2.8rem;
  color: #00d2ff;
  margin-bottom: 14px;
  opacity: 0.8;
}
.no-properties-box h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}
.no-properties-box p {
  color: #94a3b8;
  font-size: 0.85rem;
  max-width: 400px;
}

.modern-search-wrapper {
  max-width: 860px;
  margin: 24px auto 0;
  width: 100%;
}

.search-tabs-header {
  display: flex;
  margin-bottom: 8px;
}

.search-tabs-header .tab-btn {
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.35);
  border-bottom: none;
  color: #00d2ff;
  padding: 8px 18px;
  border-radius: 12px 12px 0 0;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.unified-search-box {
  display: flex;
  align-items: center;
  background: rgba(11, 22, 42, 0.95);
  border: 1px solid rgba(0, 210, 255, 0.3);
  padding: 8px 10px 8px 20px;
  border-radius: 16px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);
  gap: 12px;
}

[data-theme="light"] .unified-search-box {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.search-input-col {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-ico {
  color: #00d2ff;
  font-size: 18px;
}

.modern-input {
  width: 100%;
  border: none;
  background: transparent;
  color: #ffffff;
  font-size: 15px;
  outline: none;
}

[data-theme="light"] .modern-input {
  color: #0f172a;
}

.btn-execute-search {
  background: linear-gradient(135deg, #0072ff 0%, #00d2ff 100%);
  border: none;
  color: #ffffff;
  padding: 13px 28px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.btn-execute-search:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 210, 255, 0.4);
}

.smart-tags-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.tags-label {
  font-size: 12px;
  color: #94a3b8;
}

.tag-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 5px 12px;
  border-radius: 99px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-pill:hover {
  background: rgba(0, 210, 255, 0.15);
  border-color: #00d2ff;
  color: #00d2ff;
}
</style>

