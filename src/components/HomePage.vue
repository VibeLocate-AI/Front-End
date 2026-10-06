<template>
  <div class="dubai-home" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme" :class="{ 'dark-theme': isDark, 'light-theme': !isDark, 'dark': isDark, 'light': !isDark }">
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
<!-- شريط البحث العصري المتكامل المطابق للتصميم المرفق 100% -->
<div class="green-hero-search" :class="{ 'dark-theme': isDark, 'light-theme': !isDark, 'dark': isDark, 'light': !isDark }">
  <!-- Topographic Neon Contour Lines Overlay -->
  <svg class="ghs-contour-svg" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
    <path d="M 620 0 C 680 70, 770 110, 930 130 C 990 138, 1030 180, 1050 360" fill="none" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1.5" />
    <path d="M 580 0 C 640 85, 740 135, 900 165 C 970 180, 1020 230, 1045 360" fill="none" stroke="rgba(168, 85, 247, 0.35)" stroke-width="1.2" stroke-dasharray="6 4" />
    <path d="M 540 0 C 610 95, 710 155, 870 195 C 950 215, 1005 270, 1040 360" fill="none" stroke="rgba(45, 212, 191, 0.35)" stroke-width="1.2" />
    <path d="M 680 360 C 760 300, 860 280, 980 320 C 1020 335, 1050 350, 1080 360" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.2" />
  </svg>

  <!-- ROW 1: Toggles (Purpose + Divider + Status) + AI Widget Cluster -->
  <div class="ghs-row ghs-row-top">
    <!-- Left Group: For Sale / For Rent | All / Ready / Off-Plan -->
    <div class="ghs-top-left-group">
      <!-- Purpose Tabs: للبيع / للإيجار -->
      <div class="ghs-nav-pills-wrap">
        <button
          type="button"
          class="ghs-nav-pill ghs-nav-pill-highlight"
          :class="{ active: homePurpose === 'sale' }"
          @click="homePurpose = 'sale'"
        >
          {{ isRtl ? 'للبيع' : 'For Sale' }}
        </button>
        <button
          type="button"
          class="ghs-nav-pill"
          :class="{ active: homePurpose === 'rent' }"
          @click="homePurpose = 'rent'"
        >
          {{ isRtl ? 'للإيجار' : 'For Rent' }}
        </button>
      </div>

      <!-- Vertical Separator Line -->
      <div class="ghs-v-sep"></div>

      <!-- Status Tabs: الكل / جاهز للسكن / قيد الإنشاء -->
      <div class="ghs-nav-pills-wrap">
        <button
          type="button"
          class="ghs-nav-pill"
          :class="{ active: homeStatus === 'all' }"
          @click="homeStatus = 'all'"
        >
          {{ isRtl ? 'الكل' : 'All' }}
        </button>
        <button
          type="button"
          class="ghs-nav-pill"
          :class="{ active: homeStatus === 'ready' }"
          @click="homeStatus = 'ready'"
        >
          {{ isRtl ? 'جاهز للسكن' : 'Ready' }}
        </button>
        <button
          type="button"
          class="ghs-nav-pill"
          :class="{ active: homeStatus === 'offplan' }"
          @click="homeStatus = 'offplan'"
        >
          {{ isRtl ? 'قيد الإنشاء' : 'Off-Plan' }}
        </button>
      </div>
    </div>
  </div>

  <!-- ROW 2: The Two Large Input Boxes (Left: Search Query, Right: Location with map preview) -->
  <div class="ghs-row ghs-inputs-row">
    <!-- 1. Search Query / Keywords / AI Prompt Input -->
    <div class="ghs-input-wrap ghs-query-wrap">
      <div class="ghs-input-main-field">
        <i class="fa-solid fa-magnifying-glass ghs-input-icon ghs-query-icon"></i>
        <input
          type="text"
          class="ghs-text-input"
          v-model="query"
          :placeholder="isRtl ? 'ابحث عن عقار أحلامك، كلمات مفتاحية، أو طلب AI...' : 'Search property, keywords or AI prompt...'"
          @keydown.enter.prevent="handleSearch"
        />
        <button 
          v-if="query" 
          type="button" 
          class="ghs-clear-input"
          @click="query = ''"
          :title="isRtl ? 'مسح' : 'Clear'"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <!-- 2. Location / Area Input (with mini map graphics & zoom controls) -->
    <div class="ghs-input-wrap ghs-location-wrap">
      <!-- Mini Map Vector Background -->
      <div class="ghs-loc-map-bg" aria-hidden="true">
        <svg class="ghs-map-roads-svg" viewBox="0 0 320 80" preserveAspectRatio="none">
          <path d="M 0 35 Q 90 65, 170 30 T 320 50" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2.5" />
          <path d="M 70 80 Q 130 15, 210 60 T 300 15" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.8" />
          <path d="M 0 50 Q 150 45, 240 10" fill="none" stroke="rgba(56,189,248,0.25)" stroke-width="2" />
        </svg>
      </div>

      <div class="ghs-input-main-field">
        <i class="fa-solid fa-location-dot ghs-input-icon ghs-loc-icon"></i>
        <input
          type="text"
          class="ghs-text-input"
          v-model="homeLocation"
          :placeholder="isRtl ? 'أدخل الموقع أو المنطقة أو الحي...' : 'Enter location, area or neighborhood...'"
          @keydown.enter.prevent="handleSearch"
        />
        <button 
          v-if="homeLocation" 
          type="button" 
          class="ghs-clear-input"
          @click="homeLocation = ''"
          :title="isRtl ? 'مسح' : 'Clear'"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

    </div>
  </div>

  <!-- ROW 3: Capsule Filters (Residential + Beds & Baths + Price + Search Action) -->
  <div class="ghs-row ghs-filters-row">

    <!-- 1. Property Type (Capsule) -->
    <div class="ghs-custom-dropdown" ref="searchTypeRef">
      <button 
        type="button" 
        class="ghs-dropdown-btn ghs-capsule-btn" 
        :class="{ active: propertyTypeOpen || homeType !== 'all' }" 
        @click="propertyTypeOpen = !propertyTypeOpen; bedsBathsOpen = false; priceOpen = false; handoverByOpen = false; paymentPlanOpen = false;"
      >
        <div class="ghs-capsule-left">
          <i class="fa-solid fa-city ghs-btn-icon"></i>
          <span class="ghs-capsule-text">{{ propertyTypeLabel }}</span>
        </div>
        <i class="fa-solid ghs-chevron" :class="propertyTypeOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>

      <Transition name="dropdown-fade">
        <div v-if="propertyTypeOpen" class="ghs-dropdown-panel ghs-type-popup" @click.stop>
          <!-- Category Tabs: Residential vs Commercial -->
          <div class="ghs-cat-tabs">
            <button 
              type="button" 
              class="ghs-cat-tab" 
              :class="{ active: propertyCategory === 'residential' }"
              @click="propertyCategory = 'residential'"
            >
              {{ isRtl ? 'سكني' : 'Residential' }}
            </button>
            <button 
              type="button" 
              class="ghs-cat-tab" 
              :class="{ active: propertyCategory === 'commercial' }"
              @click="propertyCategory = 'commercial'"
            >
              {{ isRtl ? 'تجاري' : 'Commercial' }}
            </button>
          </div>

          <!-- Radio Pill Options -->
          <div class="ghs-radio-grid">
            <button 
              type="button" 
              v-for="item in currentCategoryTypes" 
              :key="item.id" 
              class="ghs-radio-pill"
              :class="{ selected: homeType === item.id }"
              @click="selectPropertyType(item.id)"
            >
              <span class="ghs-radio-circle">
                <i v-if="homeType === item.id" class="fa-solid fa-check"></i>
              </span>
              <span class="ghs-radio-text">{{ isRtl ? item.nameAr : item.nameEn }}</span>
            </button>
          </div>

          <!-- Footer Actions -->
          <div class="ghs-panel-footer">
            <button type="button" class="ghs-panel-reset" @click="resetPropertyType">
              {{ isRtl ? 'إعادة تعيين' : 'Reset' }}
            </button>
            <button type="button" class="ghs-panel-done" @click="applyPropertyType">
              {{ isRtl ? 'تم' : 'Done' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- DYNAMIC FILTERS: If Off-Plan -> Handover By & Payment Plan -->
    <template v-if="homeStatus === 'offplan'">
      <!-- Handover By Dropdown -->
      <div class="ghs-custom-dropdown" ref="searchHandoverRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn ghs-capsule-btn" 
          :class="{ active: handoverByOpen || handoverBy !== 'any' }" 
          @click="handoverByOpen = !handoverByOpen; propertyTypeOpen = false; paymentPlanOpen = false;"
        >
          <div class="ghs-capsule-left">
            <i class="fa-solid fa-calendar-days ghs-btn-icon"></i>
            <span class="ghs-capsule-text">{{ handoverLabel }}</span>
          </div>
          <i class="fa-solid ghs-chevron" :class="handoverByOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="handoverByOpen" class="ghs-dropdown-panel ghs-handover-panel" @click.stop>
            <div class="ghs-handover-list">
              <div 
                v-for="opt in handoverOptions" 
                :key="opt.value"
                class="ghs-handover-item"
                :class="{ selected: handoverBy === opt.value }"
                @click="selectHandover(opt.value)"
              >
                <span>{{ isRtl ? opt.labelAr : opt.labelEn }}</span>
                <i v-if="handoverBy === opt.value" class="fa-solid fa-check"></i>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Payment Plan Dropdown -->
      <div class="ghs-custom-dropdown" ref="searchPaymentRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn ghs-capsule-btn" 
          :class="{ active: paymentPlanOpen || Number(preHandoverPayment) < 100 }" 
          @click="paymentPlanOpen = !paymentPlanOpen; propertyTypeOpen = false; handoverByOpen = false;"
        >
          <div class="ghs-capsule-left">
            <i class="fa-solid fa-chart-pie ghs-btn-icon"></i>
            <span class="ghs-capsule-text">{{ paymentPlanLabel }}</span>
          </div>
          <i class="fa-solid ghs-chevron" :class="paymentPlanOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="paymentPlanOpen" class="ghs-dropdown-panel ghs-payment-panel" @click.stop>
            <div class="ghs-panel-title">{{ isRtl ? 'الدفعة قبل الاستلام' : 'Pre-handover Payment' }}</div>
            
            <div class="ghs-slider-range-values">
              <span>0%</span>
              <span class="ghs-slider-curr-val">{{ preHandoverPayment }}%</span>
              <span>100%</span>
            </div>

            <div class="ghs-slider-wrapper">
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5" 
                v-model="preHandoverPayment" 
                class="ghs-payment-slider" 
              />
            </div>

            <!-- Footer Actions -->
            <div class="ghs-panel-footer">
              <button type="button" class="ghs-panel-reset" @click="resetPaymentPlan">
                {{ isRtl ? 'إعادة تعيين' : 'Reset' }}
              </button>
              <button type="button" class="ghs-panel-done" @click="applyPaymentPlan">
                {{ isRtl ? 'تم' : 'Done' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </template>

    <!-- DYNAMIC FILTERS: If NOT Off-Plan -> Beds/Baths & Price -->
    <template v-else>
      <!-- Beds & Baths Capsule -->
      <div class="ghs-custom-dropdown" ref="searchBedsRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn ghs-capsule-btn" 
          :class="{ active: bedsBathsOpen || selectedBeds.length || selectedBaths.length }" 
          @click="bedsBathsOpen = !bedsBathsOpen; propertyTypeOpen = false; priceOpen = false;"
        >
          <div class="ghs-capsule-left">
            <i class="fa-solid fa-bed ghs-btn-icon"></i>
            <span class="ghs-capsule-text">{{ bedsBathsLabel }}</span>
          </div>
          <i class="fa-solid ghs-chevron" :class="bedsBathsOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="bedsBathsOpen" class="ghs-dropdown-panel ghs-beds-panel" @click.stop>
            <!-- Beds Section -->
            <div class="ghs-panel-title">{{ isRtl ? 'غرف النوم' : 'Beds' }}</div>
            <div class="ghs-pill-row">
              <button 
                type="button" 
                class="ghs-pill-btn ghs-pill-studio" 
                :class="{ active: selectedBeds.includes('Studio') }"
                @click="toggleBed('Studio')"
              >
                {{ isRtl ? 'استوديو' : 'Studio' }}
              </button>
              <button 
                type="button" 
                class="ghs-pill-btn ghs-pill-circle" 
                v-for="b in ['1', '2', '3', '4']" 
                :key="'bed-' + b"
                :class="{ active: selectedBeds.includes(b) }"
                @click="toggleBed(b)"
              >
                {{ b }}
              </button>
            </div>
            <div class="ghs-pill-row ghs-pill-row-2">
              <button 
                type="button" 
                class="ghs-pill-btn ghs-pill-circle" 
                v-for="b in ['5', '6', '7', '8+']" 
                :key="'bed-' + b"
                :class="{ active: selectedBeds.includes(b) }"
                @click="toggleBed(b)"
              >
                {{ b }}
              </button>
            </div>

            <!-- Baths Section -->
            <div class="ghs-panel-title ghs-baths-title">{{ isRtl ? 'الحمامات' : 'Baths' }}</div>
            <div class="ghs-pill-row">
              <button 
                type="button" 
                class="ghs-pill-btn ghs-pill-circle" 
                v-for="b in ['1', '2', '3', '4', '5', '6+']" 
                :key="'bath-' + b"
                :class="{ active: selectedBaths.includes(b) }"
                @click="toggleBath(b)"
              >
                {{ b }}
              </button>
            </div>

            <div class="ghs-panel-divider"></div>

            <!-- Actions Footer -->
            <div class="ghs-panel-footer">
              <button type="button" class="ghs-panel-reset" @click="resetBedsBaths">
                {{ isRtl ? 'إعادة تعيين' : 'Reset' }}
              </button>
              <button type="button" class="ghs-panel-done" @click="applyBedsBaths">
                {{ isRtl ? 'تم' : 'Done' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Price (AED) Capsule with Cost Graph Sparkline Widget -->
      <div class="ghs-custom-dropdown" ref="searchPriceRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn ghs-capsule-btn" 
          :class="{ active: priceOpen || minPrice || maxPrice }" 
          @click="priceOpen = !priceOpen; propertyTypeOpen = false; bedsBathsOpen = false;"
        >
          <div class="ghs-capsule-left">
            <i class="fa-solid fa-coins ghs-btn-icon"></i>
            <span class="ghs-capsule-text">{{ priceLabel }}</span>
          </div>

          <i class="fa-solid ghs-chevron" :class="priceOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="priceOpen" class="ghs-dropdown-panel ghs-price-panel" @click.stop>
            <div class="ghs-price-grid">
              <div class="ghs-price-col">
                <label class="ghs-price-label">{{ isRtl ? 'الحد الأدنى' : 'Minimum' }}</label>
                <input 
                  type="number" 
                  class="ghs-price-input" 
                  v-model="minPrice" 
                  placeholder="0" 
                  @keydown.enter.prevent="applyPrice"
                />
              </div>
              <div class="ghs-price-col">
                <label class="ghs-price-label">{{ isRtl ? 'الحد الأقصى' : 'Maximum' }}</label>
                <input 
                  type="number" 
                  class="ghs-price-input" 
                  v-model="maxPrice" 
                  :placeholder="isRtl ? 'أي سعر' : 'Any'" 
                  @keydown.enter.prevent="applyPrice"
                />
              </div>
            </div>

            <div class="ghs-panel-divider"></div>

            <!-- Actions Footer -->
            <div class="ghs-panel-footer">
              <button type="button" class="ghs-panel-reset" @click="resetPrice">
                {{ isRtl ? 'إعادة تعيين' : 'Reset' }}
              </button>
              <button type="button" class="ghs-panel-done" @click="applyPrice">
                {{ isRtl ? 'تم' : 'Done' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </template>

    <!-- Unified AI Search Button (Single button at bottom) -->
    <button type="button" class="ghs-unified-ai-btn" @click="handleSearch" :title="isRtl ? 'بحث ذكي AI' : 'Smart AI Search'">
      <i class="fa-solid fa-wand-magic-sparkles"></i>
      <span>{{ isRtl ? 'بحث ذكي AI' : 'AI Search' }}</span>
    </button>
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
                <h2>{{ isRtl ? 'المناطق الأكثر طلباً' : 'Popular Areas' }}</h2>
                <a href="#" class="see-all-link" @click.prevent="$router.push('/map')">
                  {{ isRtl ? 'عرض كافة المناطق على الخريطة' : 'See all areas on map' }} <span class="arrow">&gt;</span>
                </a>
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

              <button 
                class="btn-contact-agent" 
                type="button" 
                @click="$router.push({ path: '/agent-contact', query: { agent: currentAgent.name, agency: currentAgent.agencyName, phone: currentAgent.phone, email: currentAgent.email } })"
              >
                <i class="fa-solid fa-headset" style="margin-inline-end: 6px;"></i>
                {{ isRtl ? 'تواصل مع الوكيل الآن' : 'Contact Agent Now' }}
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

const { t, isRtl, theme, lang, locProp, isDark } = useThemeAndLanguage()

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

// Custom Dropdowns & Popups state (Matching Reference Images 1, 2, 3, 4, 5)
const searchTypeRef = ref(null)
const searchBedsRef = ref(null)
const searchPriceRef = ref(null)
const searchHandoverRef = ref(null)
const searchPaymentRef = ref(null)

const propertyTypeOpen = ref(false)
const bedsBathsOpen = ref(false)
const priceOpen = ref(false)
const handoverByOpen = ref(false)
const paymentPlanOpen = ref(false)

// Property Type state: Residential vs Commercial (Image 2)
const propertyCategory = ref('residential')
const residentialTypes = [
  { id: 'Apartment', nameEn: 'Apartment', nameAr: 'شقق' },
  { id: 'Villa', nameEn: 'Villa', nameAr: 'فلل' },
  { id: 'Townhouse', nameEn: 'Townhouse', nameAr: 'تاون هاوس' },
  { id: 'Penthouse', nameEn: 'Penthouse', nameAr: 'بنتهاوس' },
  { id: 'Villa Compound', nameEn: 'Villa Compound', nameAr: 'مجمع فلل' },
  { id: 'Hotel Apartment', nameEn: 'Hotel Apartment', nameAr: 'شقق فندقية' },
  { id: 'Land', nameEn: 'Land', nameAr: 'أرض سكنية' },
  { id: 'Floor', nameEn: 'Floor', nameAr: 'طابق كامل' },
  { id: 'Building', nameEn: 'Building', nameAr: 'مبنى سكني' }
]

const commercialTypes = [
  { id: 'Office', nameEn: 'Office', nameAr: 'مكاتب' },
  { id: 'Retail', nameEn: 'Retail', nameAr: 'محلات تجارية' },
  { id: 'Warehouse', nameEn: 'Warehouse', nameAr: 'مستودعات' },
  { id: 'Shop', nameEn: 'Shop', nameAr: 'متاجر' },
  { id: 'Commercial Villa', nameEn: 'Commercial Villa', nameAr: 'فلل تجارية' },
  { id: 'Commercial Land', nameEn: 'Commercial Land', nameAr: 'أراضي تجارية' },
  { id: 'Commercial Building', nameEn: 'Commercial Building', nameAr: 'مباني تجارية' },
  { id: 'Showroom', nameEn: 'Showroom', nameAr: 'صالات عرض' }
]

const currentCategoryTypes = computed(() => {
  return propertyCategory.value === 'residential' ? residentialTypes : commercialTypes
})

const selectPropertyType = (typeId) => {
  homeType.value = (homeType.value === typeId) ? 'all' : typeId
}

const resetPropertyType = () => {
  homeType.value = 'all'
  propertyTypeOpen.value = false
}

const applyPropertyType = () => {
  propertyTypeOpen.value = false
}

const propertyTypeLabel = computed(() => {
  if (homeType.value === 'all') {
    return isRtl.value
      ? (propertyCategory.value === 'residential' ? 'سكني' : 'تجاري')
      : (propertyCategory.value === 'residential' ? 'Residential' : 'Commercial')
  }
  const allTypes = [...residentialTypes, ...commercialTypes]
  const found = allTypes.find(t => t.id === homeType.value)
  if (found) {
    return isRtl.value ? found.nameAr : found.nameEn
  }
  return homeType.value
})

// Beds & Baths state (Images 4 & 5)
const selectedBeds = ref([])
const selectedBaths = ref([])

const bedsBathsLabel = computed(() => {
  const bedsCount = selectedBeds.value.length
  const bathsCount = selectedBaths.value.length
  if (bedsCount === 0 && bathsCount === 0) {
    return isRtl.value ? 'الغرف والحمامات' : 'Beds & Baths'
  }
  const parts = []
  if (bedsCount > 0) {
    parts.push(isRtl.value ? `${selectedBeds.value.join(', ')} غرف` : `${selectedBeds.value.join(', ')} Beds`)
  }
  if (bathsCount > 0) {
    parts.push(isRtl.value ? `${selectedBaths.value.join(', ')} حمامات` : `${selectedBaths.value.join(', ')} Baths`)
  }
  return parts.join(' • ')
})

const toggleBed = (b) => {
  const idx = selectedBeds.value.indexOf(b)
  if (idx > -1) {
    selectedBeds.value.splice(idx, 1)
  } else {
    selectedBeds.value.push(b)
  }
}

const toggleBath = (b) => {
  const idx = selectedBaths.value.indexOf(b)
  if (idx > -1) {
    selectedBaths.value.splice(idx, 1)
  } else {
    selectedBaths.value.push(b)
  }
}

const resetBedsBaths = () => {
  selectedBeds.value = []
  selectedBaths.value = []
  bedsBathsOpen.value = false
}

const applyBedsBaths = () => {
  bedsBathsOpen.value = false
}

// Price state (Images 2 & 3)
const minPrice = ref('')
const maxPrice = ref('')

const priceLabel = computed(() => {
  const min = minPrice.value ? Number(minPrice.value).toLocaleString() : ''
  const max = maxPrice.value ? Number(maxPrice.value).toLocaleString() : ''
  if (!min && !max) {
    return isRtl.value ? 'السعر (درهم)' : 'Price (AED)'
  }
  if (min && max) {
    return `${min} - ${max} ${isRtl.value ? 'درهم' : 'AED'}`
  }
  if (min) {
    return `> ${min} ${isRtl.value ? 'درهم' : 'AED'}`
  }
  return `< ${max} ${isRtl.value ? 'درهم' : 'AED'}`
})

const resetPrice = () => {
  minPrice.value = ''
  maxPrice.value = ''
  priceOpen.value = false
}

const applyPrice = () => {
  priceOpen.value = false
}

// Off-Plan Handover By state (Images 3 & 4)
const handoverBy = ref('any')
const handoverOptions = [
  { value: 'any', labelEn: 'Any', labelAr: 'أي موعد' },
  { value: 'Q4 2026', labelEn: 'Q4 2026', labelAr: 'الربع الرابع 2026' },
  { value: 'Q1 2027', labelEn: 'Q1 2027', labelAr: 'الربع الأول 2027' },
  { value: 'Q2 2027', labelEn: 'Q2 2027', labelAr: 'الربع الثاني 2027' },
  { value: 'Q3 2027', labelEn: 'Q3 2027', labelAr: 'الربع الثالث 2027' },
  { value: 'Q4 2027', labelEn: 'Q4 2027', labelAr: 'الربع الرابع 2027' },
  { value: 'Q1 2028', labelEn: 'Q1 2028', labelAr: 'الربع الأول 2028' },
  { value: 'Q2 2028', labelEn: 'Q2 2028', labelAr: 'الربع الثاني 2028' },
  { value: '2029+', labelEn: '2029+', labelAr: '2029 وما بعد' }
]

const handoverLabel = computed(() => {
  if (handoverBy.value === 'any') {
    return isRtl.value ? 'موعد التسليم' : 'Handover By'
  }
  const found = handoverOptions.find(o => o.value === handoverBy.value)
  return found ? (isRtl.value ? found.labelAr : found.labelEn) : handoverBy.value
})

const selectHandover = (val) => {
  handoverBy.value = val
  handoverByOpen.value = false
}

// Off-Plan Payment Plan state (Image 5)
const preHandoverPayment = ref(100)

const paymentPlanLabel = computed(() => {
  if (Number(preHandoverPayment.value) === 100) {
    return isRtl.value ? 'خطة الدفع' : 'Payment Plan'
  }
  return isRtl.value ? `حتى ${preHandoverPayment.value}% قبل التسليم` : `Up to ${preHandoverPayment.value}% Pre-handover`
})

const resetPaymentPlan = () => {
  preHandoverPayment.value = 100
  paymentPlanOpen.value = false
}

const applyPaymentPlan = () => {
  paymentPlanOpen.value = false
}

const handleSearch = () => {
  const q = (query.value || '').trim()
  const loc = (homeLocation.value || '').trim()
  const queryObj = {}

  if (q) queryObj.q = q
  if (loc) queryObj.location = loc
  if (homePurpose.value && homePurpose.value !== 'all') queryObj.purpose = homePurpose.value
  if (homeType.value && homeType.value !== 'all') queryObj.type = homeType.value
  if (homeStatus.value && homeStatus.value !== 'all') queryObj.status = homeStatus.value

  if (homeStatus.value === 'offplan') {
    if (handoverBy.value && handoverBy.value !== 'any') queryObj.handover = handoverBy.value
    if (Number(preHandoverPayment.value) < 100) queryObj.preHandoverPayment = preHandoverPayment.value
  } else {
    if (selectedBeds.value.length) queryObj.bedrooms = selectedBeds.value.join(',')
    else if (homeBedrooms.value && homeBedrooms.value !== 'any') queryObj.bedrooms = homeBedrooms.value
    if (minPrice.value) queryObj.minPrice = minPrice.value
    if (maxPrice.value) queryObj.maxPrice = maxPrice.value
  }

  router.push({
    path: '/search',
    query: queryObj
  })
}

const triggerAiSearch = () => {
  const inputEl = document.querySelector('.ghs-query-wrap .ghs-text-input')
  if (inputEl) {
    inputEl.focus()
  }
  if (!query.value) {
    query.value = isRtl.value ? 'شقة 2 غرف بإطلالة بحرية في دبي مارينا' : '2 bedroom sea view apartment in Dubai Marina'
  }
  handleSearch()
}

const handleDowntownQuickSearch = () => {
  homeLocation.value = isRtl.value ? 'وسط مدينة دبي' : 'Downtown Dubai'
  handleSearch()
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
  if (searchTypeRef.value && !searchTypeRef.value.contains(e.target)) {
    propertyTypeOpen.value = false
  }
  if (searchBedsRef.value && !searchBedsRef.value.contains(e.target)) {
    bedsBathsOpen.value = false
  }
  if (searchPriceRef.value && !searchPriceRef.value.contains(e.target)) {
    priceOpen.value = false
  }
  if (searchHandoverRef.value && !searchHandoverRef.value.contains(e.target)) {
    handoverByOpen.value = false
  }
  if (searchPaymentRef.value && !searchPaymentRef.value.contains(e.target)) {
    paymentPlanOpen.value = false
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
/* ========================================================
   Redesigned Glassmorphic Futuristic Hero Search (Reference Image Match)
   ======================================================== */
.dubai-home .hero-section {
  padding: 2.5rem 0 5.5rem;
  min-height: auto;
  position: relative;
  z-index: 100 !important;
  overflow: visible !important;
}

.dubai-home .hero-overlay {
  overflow: visible !important;
  pointer-events: none;
}

.dubai-home .hero-content {
  position: relative;
  z-index: 101 !important;
  overflow: visible !important;
}

.dubai-home .main-container {
  position: relative;
  z-index: 1 !important;
}

.dubai-home .hero-title {
  margin-bottom: 0.4rem;
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.dubai-home .hero-desc {
  margin-bottom: 1rem;
}

.green-hero-search {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 249, 255, 0.55) 50%, rgba(224, 242, 254, 0.48) 100%);
  backdrop-filter: blur(28px) saturate(190%);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  border-radius: 22px;
  padding: 13px 18px 15px;
  box-shadow: 
    0 20px 50px -10px rgba(15, 23, 42, 0.12),
    0 0 0 1.5px rgba(255, 255, 255, 0.8) inset,
    0 0 30px rgba(56, 189, 248, 0.2);
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  max-width: 940px;
  margin: 18px auto 0;
  width: 96%;
  overflow: visible;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glowing Topographic Vector Contour Lines */
.ghs-contour-svg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 22px;
  overflow: hidden;
  z-index: 0;
}

/* Rows General */
.ghs-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
}

/* ROW 1: TOP NAVIGATION */
.ghs-row-top {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-bottom: 10px;
  width: 100%;
}

.ghs-top-left-group {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ghs-nav-pills-wrap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ghs-nav-pill {
  padding: 6px 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: #334155;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.22s ease;
  white-space: nowrap;
}

.ghs-nav-pill:hover {
  color: #0284c7;
}

.ghs-nav-pill.active {
  background: rgba(255, 255, 255, 0.9);
  color: #0284c7;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* Specific glowing mint pill for active "For Sale" matching the image */
.ghs-nav-pill-highlight.active {
  background: rgba(167, 243, 208, 0.35);
  border: 1.5px solid rgba(45, 212, 191, 0.6);
  color: #065f46;
  box-shadow: 0 0 14px rgba(45, 212, 191, 0.4);
}

.ghs-v-sep {
  width: 1.5px;
  height: 20px;
  background: rgba(148, 163, 184, 0.4);
  margin: 0 6px;
  flex-shrink: 0;
}

/* TOP RIGHT AI CLUSTER */
.ghs-top-right-cluster {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Mini Property Card (Downtown Dubai) */
.ghs-mini-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 4px 8px 4px 5px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ghs-mini-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(2, 132, 199, 0.15);
}

.ghs-mini-card-thumb {
  width: 44px;
  height: 38px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.ghs-mini-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ghs-mini-fav {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 8px;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.ghs-mini-card-body {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.ghs-mini-title {
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}

.ghs-mini-loc {
  font-size: 8.5px;
  color: #64748b;
  margin-bottom: 2px;
}

.ghs-mini-match {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 8px;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
  padding: 1px 5px;
  white-space: nowrap;
}

/* AI Match Circular Gauge */
.ghs-ai-gauge-badge {
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ghs-gauge-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ghs-gauge-bg {
  fill: none;
  stroke: rgba(56, 189, 248, 0.2);
  stroke-width: 3.5;
}

.ghs-gauge-prog {
  fill: none;
  stroke: #0284c7;
  stroke-width: 3.5;
  stroke-dasharray: 85, 107;
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px rgba(2, 132, 199, 0.5));
}

.ghs-gauge-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 0.95;
}

.ghs-gauge-top {
  font-size: 8.5px;
  font-weight: 800;
  color: #0284c7;
}

.ghs-gauge-bot {
  font-size: 7.5px;
  font-weight: 600;
  color: #64748b;
}

/* AI Search Pill Button */
.ghs-ai-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.72) 0%, rgba(30, 41, 59, 0.85) 100%);
  border: 1.5px solid #22d3ee;
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.4), inset 0 0 8px rgba(34, 211, 238, 0.15);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.ghs-ai-pill-btn i {
  color: #38bdf8;
  font-size: 12px;
}

.ghs-ai-pill-btn:hover {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  box-shadow: 0 0 22px rgba(34, 211, 238, 0.6);
  transform: translateY(-1px);
}

/* ROW 2: SEARCH INPUTS */
.ghs-inputs-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
}

.ghs-input-wrap {
  flex: 1;
  min-width: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 16px;
  padding: 0 14px;
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
  gap: 8px;
}

/* Query Wrap */
.ghs-query-wrap {
  background: rgba(255, 255, 255, 0.78);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02), 0 6px 18px rgba(0, 0, 0, 0.03);
}

.ghs-query-wrap:focus-within {
  background: rgba(255, 255, 255, 0.95);
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2), 0 8px 22px rgba(2, 132, 199, 0.08);
}

.ghs-input-main-field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.ghs-input-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.ghs-query-icon {
  color: #0284c7;
}

.ghs-loc-icon {
  color: #005953;
}

.ghs-text-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  background: transparent;
  min-width: 0;
}

.ghs-text-input::placeholder {
  color: #64748b;
  font-size: 13.5px;
}

/* Cost Pins Badge inside query wrap */
.ghs-cost-pins-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 999px;
  padding: 3px 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.ghs-cost-pin-icon {
  color: #0284c7;
  font-size: 12px;
}

.ghs-cost-pin-pill {
  font-size: 10.5px;
  font-weight: 700;
  color: #1e293b;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ghs-cost-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #0284c7;
}

/* Location Wrap with Map Styling */
.ghs-location-wrap {
  background: linear-gradient(135deg, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.65) 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02), 0 6px 18px rgba(0, 0, 0, 0.03);
}

.ghs-location-wrap:focus-within {
  background: linear-gradient(135deg, rgba(186, 230, 253, 0.6) 0%, rgba(224, 242, 254, 0.85) 100%);
  border-color: #2dd4bf;
  box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.22), 0 8px 22px rgba(2, 132, 199, 0.08);
}

.ghs-loc-map-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.65;
}

.ghs-map-roads-svg {
  width: 100%;
  height: 100%;
}

.ghs-map-interactive-overlay {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.ghs-map-pin-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 10.5px;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.ghs-map-pin-tag i {
  color: #005953;
  font-size: 11px;
}

.ghs-map-pin-mini i {
  color: #0284c7;
  font-size: 13px;
}

.ghs-map-zoom-btns {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ghs-zoom-btn {
  width: 17px;
  height: 15px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 800;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  padding: 0;
  transition: all 0.15s ease;
}

.ghs-zoom-btn:hover {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.ghs-clear-input {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color 0.15s;
}

.ghs-clear-input:hover {
  color: #ef4444;
}

/* ROW 3: CAPSULE FILTERS & SEARCH ACTION */
.ghs-filters-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.ghs-custom-dropdown {
  position: relative;
  flex: 1;
  min-width: 130px;
}

.ghs-capsule-btn {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.22s ease;
  user-select: none;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.ghs-capsule-btn:hover {
  background: rgba(255, 255, 255, 0.98);
  border-color: #38bdf8;
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.12);
}

.ghs-capsule-btn.active {
  border-color: #0284c7;
  background: #f0f9ff;
  color: #0284c7;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
}

.ghs-capsule-left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.ghs-capsule-left .ghs-btn-icon {
  font-size: 15px;
  color: #475569;
  flex-shrink: 0;
}

.ghs-capsule-btn.active .ghs-capsule-left .ghs-btn-icon {
  color: #0284c7;
}

.ghs-capsule-text {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* AI Performance Card inside Residential Capsule */
.ghs-ai-perf-badge {
  display: inline-flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 9px;
  padding: 2px 6px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  line-height: 1;
}

.ghs-perf-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 7.5px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 2px;
}

.ghs-perf-close {
  font-size: 9px;
  color: #94a3b8;
}

.ghs-perf-content {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ghs-perf-ring {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 800;
  color: #0284c7;
}

.ghs-perf-info {
  display: flex;
  flex-direction: column;
  font-size: 7.5px;
  color: #94a3b8;
}

/* Cost Graph Sparkline Widget inside Price Capsule */
.ghs-cost-graph-widget {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 8px;
  padding: 3px 6px;
  flex-shrink: 0;
  min-width: 78px;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.ghs-graph-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 8px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 2px;
}

.ghs-graph-dots {
  font-size: 9px;
  color: #94a3b8;
}

.ghs-graph-body {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ghs-graph-axis {
  display: flex;
  flex-direction: column;
  font-size: 6.5px;
  color: #94a3b8;
  line-height: 1.1;
}

.ghs-sparkline-svg {
  width: 52px;
  height: 18px;
}

/* UNIFIED AI SEARCH BUTTON (Bottom Action) */
.ghs-unified-ai-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 22px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4), 0 0 14px rgba(56, 189, 248, 0.3);
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.ghs-unified-ai-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  box-shadow: 0 8px 26px rgba(2, 132, 199, 0.55), 0 0 20px rgba(56, 189, 248, 0.45);
}

.ghs-unified-ai-btn i {
  font-size: 15px;
  color: #fef08a;
  filter: drop-shadow(0 0 6px rgba(254, 240, 138, 0.7));
}

/* Floating Panels */
.ghs-dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  z-index: 99999 !important;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #cbd5e1;
}

[dir="ltr"] .ghs-dropdown-panel {
  left: 0;
  right: auto;
  text-align: left;
}

[dir="rtl"] .ghs-dropdown-panel {
  right: 0;
  left: auto;
  text-align: right;
}

/* Property Type Popup Panel */
.ghs-type-popup {
  width: 340px;
  max-width: 90vw;
  padding: 14px 16px;
}

.ghs-cat-tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 12px;
}

.ghs-cat-tab {
  flex: 1;
  text-align: center;
  padding: 7px 0;
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
  margin-bottom: -2px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.ghs-cat-tab:hover {
  color: #005953;
}

.ghs-cat-tab.active {
  color: #005953;
  border-bottom-color: #005953;
  font-weight: 700;
}

.ghs-radio-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  margin-bottom: 12px;
}

.ghs-radio-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.18s ease;
  min-height: 34px;
}

.ghs-radio-pill:hover {
  border-color: #005953;
  background: #f0fdfa;
}

.ghs-radio-pill.selected {
  border-color: #005953;
  background: #f0fdfa;
  color: #005953;
}

.ghs-radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 9px;
  color: transparent;
  transition: all 0.15s ease;
}

.ghs-radio-pill.selected .ghs-radio-circle {
  border-color: #005953;
  background: #005953;
  color: #ffffff;
}

.ghs-radio-text {
  font-size: 12.5px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ghs-radio-pill.selected .ghs-radio-text {
  color: #005953;
  font-weight: 700;
}

/* Handover By Panel */
.ghs-handover-panel {
  width: 200px;
  max-height: 260px;
  overflow-y: auto;
  padding: 6px;
}

.ghs-handover-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ghs-handover-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ghs-handover-item:hover {
  background: #f1f5f9;
  color: #005953;
}

.ghs-handover-item.selected {
  background: #e6f4f2;
  color: #005953;
  font-weight: 700;
}

/* Payment Plan Panel */
.ghs-payment-panel {
  width: 300px;
  max-width: 90vw;
  padding: 16px 18px;
}

.ghs-slider-range-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin: 8px 0 12px;
}

.ghs-slider-curr-val {
  background: #e6f4f2;
  color: #005953;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12.5px;
  font-weight: 700;
}

.ghs-slider-wrapper {
  margin-bottom: 12px;
}

.ghs-payment-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  -webkit-appearance: none;
  accent-color: #005953;
  cursor: pointer;
}

/* Beds & Baths Popup Panel */
.ghs-beds-panel {
  width: 320px;
  max-width: 90vw;
  padding: 18px 20px;
  background: #0b1322;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65), 0 4px 15px rgba(0, 210, 255, 0.1);
}

[data-theme="light"] .ghs-beds-panel {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.14), 0 4px 15px rgba(0, 0, 0, 0.05);
}

.ghs-panel-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

[data-theme="light"] .ghs-panel-title {
  color: #0f172a;
}

.ghs-baths-title {
  margin-top: 14px;
}

.ghs-pill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ghs-pill-row-2 {
  margin-bottom: 4px;
}

.ghs-pill-btn {
  background: #1b263b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 13.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
  user-select: none;
}

.ghs-pill-circle {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 50%;
  padding: 0;
}

.ghs-pill-studio {
  height: 38px;
  padding: 0 16px;
  border-radius: 20px;
}

.ghs-pill-btn:hover {
  background: #24344d;
  border-color: #00d2ff;
  color: #00d2ff;
  transform: translateY(-1px);
}

.ghs-pill-btn.active {
  background: #00d2ff !important;
  border-color: #00d2ff !important;
  color: #051322 !important;
  font-weight: 800;
  box-shadow: 0 0 14px rgba(0, 210, 255, 0.5);
}

[data-theme="light"] .ghs-pill-btn {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}

[data-theme="light"] .ghs-pill-btn:hover {
  background: #e2e8f0;
  border-color: #0284c7;
  color: #0284c7;
}

[data-theme="light"] .ghs-pill-btn.active {
  background: #0284c7 !important;
  border-color: #0284c7 !important;
  color: #ffffff !important;
  box-shadow: 0 0 14px rgba(2, 132, 199, 0.4);
}

/* Price Popup Panel */
.ghs-price-panel {
  width: 310px;
  max-width: 90vw;
  padding: 18px 20px;
  background: #0b1322;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65), 0 4px 15px rgba(0, 210, 255, 0.1);
}

[data-theme="light"] .ghs-price-panel {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.14), 0 4px 15px rgba(0, 0, 0, 0.05);
}

.ghs-price-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.ghs-price-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ghs-price-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

[data-theme="light"] .ghs-price-label {
  color: #475569;
}

.ghs-price-input {
  width: 100%;
  height: 42px;
  background: #1b263b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #ffffff;
  font-size: 14.5px;
  font-weight: 600;
  text-align: center;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
}

.ghs-price-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.ghs-price-input:focus {
  border-color: #00d2ff;
  box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.25);
  background: #202e47;
}

[data-theme="light"] .ghs-price-input {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

[data-theme="light"] .ghs-price-input::placeholder {
  color: #94a3b8;
}

[data-theme="light"] .ghs-price-input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
  background: #ffffff;
}

/* Panel Divider */
.ghs-panel-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px 0 14px;
}

[data-theme="light"] .ghs-panel-divider {
  background: #e2e8f0;
}

/* Panel Footer */
.ghs-panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ghs-panel-reset {
  flex: 1;
  height: 42px;
  background: transparent;
  border: 2px solid #00d2ff;
  color: #00d2ff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ghs-panel-reset:hover {
  background: rgba(0, 210, 255, 0.12);
  transform: translateY(-1px);
}

[data-theme="light"] .ghs-panel-reset {
  border-color: #0284c7;
  color: #0284c7;
}

[data-theme="light"] .ghs-panel-reset:hover {
  background: #e0f2fe;
}

.ghs-panel-done {
  flex: 1;
  height: 42px;
  background: #00d2ff;
  border: none;
  border-radius: 10px;
  color: #051322;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 210, 255, 0.35);
}

.ghs-panel-done:hover {
  background: #38bdf8;
  box-shadow: 0 6px 18px rgba(0, 210, 255, 0.45);
  transform: translateY(-1px);
}

[data-theme="light"] .ghs-panel-done {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
}

[data-theme="light"] .ghs-panel-done:hover {
  background: #0369a1;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* ========================================================
   Responsive Search Layout Adjustments
   ======================================================== */
@media (max-width: 990px) {
  .green-hero-search {
    max-width: 96%;
    padding: 14px 16px;
  }
  .ghs-top-right-cluster {
    gap: 8px;
  }
  .ghs-mini-card {
    display: none;
  }
  .ghs-custom-dropdown {
    min-width: 120px;
  }
}

@media (max-width: 820px) {
  .green-hero-search {
    padding: 14px 12px;
    margin-top: 16px;
    border-radius: 20px;
  }
  .ghs-row-top {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
  }
  .ghs-top-left-group {
    flex-wrap: wrap;
    gap: 6px;
  }
  .ghs-inputs-row {
    flex-direction: column;
    gap: 10px;
  }
  .ghs-input-wrap {
    flex: 1 1 100%;
    width: 100%;
  }
  .ghs-filters-row {
    flex-wrap: wrap;
    gap: 8px;
  }
  .ghs-custom-dropdown {
    flex: 1 1 calc(50% - 6px);
    min-width: 120px;
  }
  .ghs-search-btn-combo {
    width: 100%;
    flex: 1 1 100%;
    justify-content: center;
  }
  .ghs-dropdown-panel {
    right: 0 !important;
    left: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }
}

@media (max-width: 540px) {
  .ghs-top-left-group {
    width: 100%;
    justify-content: space-between;
  }
  .ghs-v-sep {
    display: none;
  }
  .ghs-top-right-cluster {
    width: 100%;
    justify-content: space-between;
  }
  .ghs-ai-pill-btn {
    flex: 1;
    justify-content: center;
  }
  .ghs-custom-dropdown {
    flex: 1 1 100%;
    width: 100%;
  }
}

/* ========================================================
   Theme Adaptations (Full Dark & Light Mode Integration)
   ======================================================== */

/* DARK THEME STYLING (Connected with [data-theme="dark"], .dark-theme, .dark) */
[data-theme="dark"] .green-hero-search,
.dark-theme .green-hero-search,
.dark .green-hero-search,
.green-hero-search.dark-theme,
.green-hero-search.dark {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.90) 0%, rgba(10, 18, 36, 0.96) 100%) !important;
  border-color: rgba(56, 189, 248, 0.28) !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(56, 189, 248, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.06) !important;
}

[data-theme="dark"] .ghs-v-sep,
.dark-theme .ghs-v-sep,
.dark .ghs-v-sep,
.green-hero-search.dark-theme .ghs-v-sep,
.green-hero-search.dark .ghs-v-sep {
  background: rgba(255, 255, 255, 0.15) !important;
}

[data-theme="dark"] .ghs-nav-pill,
.dark-theme .ghs-nav-pill,
.dark .ghs-nav-pill,
.green-hero-search.dark-theme .ghs-nav-pill,
.green-hero-search.dark .ghs-nav-pill {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-nav-pill:hover,
.dark-theme .ghs-nav-pill:hover,
.dark .ghs-nav-pill:hover,
.green-hero-search.dark-theme .ghs-nav-pill:hover,
.green-hero-search.dark .ghs-nav-pill:hover {
  color: #38bdf8 !important;
  background: rgba(56, 189, 248, 0.08) !important;
}

[data-theme="dark"] .ghs-nav-pill.active,
.dark-theme .ghs-nav-pill.active,
.dark .ghs-nav-pill.active,
.green-hero-search.dark-theme .ghs-nav-pill.active,
.green-hero-search.dark .ghs-nav-pill.active {
  background: rgba(30, 41, 59, 0.95) !important;
  color: #38bdf8 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(56, 189, 248, 0.35) !important;
}

[data-theme="dark"] .ghs-nav-pill-highlight.active,
.dark-theme .ghs-nav-pill-highlight.active,
.dark .ghs-nav-pill-highlight.active,
.green-hero-search.dark-theme .ghs-nav-pill-highlight.active,
.green-hero-search.dark .ghs-nav-pill-highlight.active {
  background: rgba(16, 185, 129, 0.18) !important;
  border-color: rgba(52, 211, 153, 0.65) !important;
  color: #34d399 !important;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.35) !important;
}

[data-theme="dark"] .ghs-mini-card,
.dark-theme .ghs-mini-card,
.dark .ghs-mini-card,
.green-hero-search.dark-theme .ghs-mini-card,
.green-hero-search.dark .ghs-mini-card {
  background: rgba(30, 41, 59, 0.85) !important;
  border-color: rgba(56, 189, 248, 0.25) !important;
}

[data-theme="dark"] .ghs-mini-title,
.dark-theme .ghs-mini-title,
.dark .ghs-mini-title,
.green-hero-search.dark-theme .ghs-mini-title,
.green-hero-search.dark .ghs-mini-title {
  color: #f8fafc !important;
}

[data-theme="dark"] .ghs-mini-loc,
.dark-theme .ghs-mini-loc,
.dark .ghs-mini-loc,
.green-hero-search.dark-theme .ghs-mini-loc,
.green-hero-search.dark .ghs-mini-loc {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-input-wrap,
.dark-theme .ghs-input-wrap,
.dark .ghs-input-wrap,
.green-hero-search.dark-theme .ghs-input-wrap,
.green-hero-search.dark .ghs-input-wrap {
  border-color: rgba(56, 189, 248, 0.25) !important;
}

[data-theme="dark"] .ghs-query-wrap,
.dark-theme .ghs-query-wrap,
.dark .ghs-query-wrap,
.green-hero-search.dark-theme .ghs-query-wrap,
.green-hero-search.dark .ghs-query-wrap {
  background: rgba(15, 23, 42, 0.85) !important;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4) !important;
}

[data-theme="dark"] .ghs-location-wrap,
.dark-theme .ghs-location-wrap,
.dark .ghs-location-wrap,
.green-hero-search.dark-theme .ghs-location-wrap,
.green-hero-search.dark .ghs-location-wrap {
  background: linear-gradient(135deg, rgba(14, 30, 55, 0.92) 0%, rgba(10, 22, 44, 0.96) 100%) !important;
  border-color: rgba(56, 189, 248, 0.3) !important;
}

[data-theme="dark"] .ghs-text-input,
.dark-theme .ghs-text-input,
.dark .ghs-text-input,
.green-hero-search.dark-theme .ghs-text-input,
.green-hero-search.dark .ghs-text-input {
  color: #f8fafc !important;
}

[data-theme="dark"] .ghs-text-input::placeholder,
.dark-theme .ghs-text-input::placeholder,
.dark .ghs-text-input::placeholder,
.green-hero-search.dark-theme .ghs-text-input::placeholder,
.green-hero-search.dark .ghs-text-input::placeholder {
  color: #64748b !important;
}

[data-theme="dark"] .ghs-query-icon,
.dark-theme .ghs-query-icon,
.dark .ghs-query-icon,
.green-hero-search.dark-theme .ghs-query-icon,
.green-hero-search.dark .ghs-query-icon {
  color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-clear-input,
.dark-theme .ghs-clear-input,
.dark .ghs-clear-input,
.green-hero-search.dark-theme .ghs-clear-input,
.green-hero-search.dark .ghs-clear-input {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-clear-input:hover,
.dark-theme .ghs-clear-input:hover,
.dark .ghs-clear-input:hover,
.green-hero-search.dark-theme .ghs-clear-input:hover,
.green-hero-search.dark .ghs-clear-input:hover {
  color: #f1f5f9 !important;
}

[data-theme="dark"] .ghs-cost-pins-badge,
.dark-theme .ghs-cost-pins-badge,
.dark .ghs-cost-pins-badge,
.green-hero-search.dark-theme .ghs-cost-pins-badge,
.green-hero-search.dark .ghs-cost-pins-badge {
  background: rgba(30, 41, 59, 0.92) !important;
  border-color: rgba(56, 189, 248, 0.3) !important;
}

[data-theme="dark"] .ghs-cost-pin-pill,
.dark-theme .ghs-cost-pin-pill,
.dark .ghs-cost-pin-pill,
.green-hero-search.dark-theme .ghs-cost-pin-pill,
.green-hero-search.dark .ghs-cost-pin-pill {
  color: #e2e8f0 !important;
}

[data-theme="dark"] .ghs-cost-pin-icon,
.dark-theme .ghs-cost-pin-icon,
.dark .ghs-cost-pin-icon,
.green-hero-search.dark-theme .ghs-cost-pin-icon,
.green-hero-search.dark .ghs-cost-pin-icon {
  color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-map-pin-tag,
.dark-theme .ghs-map-pin-tag,
.dark .ghs-map-pin-tag,
.green-hero-search.dark-theme .ghs-map-pin-tag,
.green-hero-search.dark .ghs-map-pin-tag {
  background: rgba(15, 23, 42, 0.92) !important;
  border-color: rgba(56, 189, 248, 0.35) !important;
  color: #f8fafc !important;
}

[data-theme="dark"] .ghs-zoom-btn,
.dark-theme .ghs-zoom-btn,
.dark .ghs-zoom-btn,
.green-hero-search.dark-theme .ghs-zoom-btn,
.green-hero-search.dark .ghs-zoom-btn {
  background: rgba(15, 23, 42, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.14) !important;
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-zoom-btn:hover,
.dark-theme .ghs-zoom-btn:hover,
.dark .ghs-zoom-btn:hover,
.green-hero-search.dark-theme .ghs-zoom-btn:hover,
.green-hero-search.dark .ghs-zoom-btn:hover {
  background: #1e293b !important;
  color: #38bdf8 !important;
  border-color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-capsule-btn,
.dark-theme .ghs-capsule-btn,
.dark .ghs-capsule-btn,
.green-hero-search.dark-theme .ghs-capsule-btn,
.green-hero-search.dark .ghs-capsule-btn {
  background: rgba(15, 23, 42, 0.82) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #cbd5e1 !important;
}

[data-theme="dark"] .ghs-capsule-left .ghs-btn-icon,
.dark-theme .ghs-capsule-left .ghs-btn-icon,
.dark .ghs-capsule-left .ghs-btn-icon,
.green-hero-search.dark-theme .ghs-capsule-left .ghs-btn-icon,
.green-hero-search.dark .ghs-capsule-left .ghs-btn-icon,
[data-theme="dark"] .ghs-chevron,
.dark-theme .ghs-chevron,
.dark .ghs-chevron,
.green-hero-search.dark-theme .ghs-chevron,
.green-hero-search.dark .ghs-chevron {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-capsule-btn:hover,
.dark-theme .ghs-capsule-btn:hover,
.dark .ghs-capsule-btn:hover,
.green-hero-search.dark-theme .ghs-capsule-btn:hover,
.green-hero-search.dark .ghs-capsule-btn:hover {
  background: rgba(30, 41, 59, 0.95) !important;
  border-color: rgba(56, 189, 248, 0.4) !important;
  color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-capsule-btn.active,
.dark-theme .ghs-capsule-btn.active,
.dark .ghs-capsule-btn.active,
.green-hero-search.dark-theme .ghs-capsule-btn.active,
.green-hero-search.dark .ghs-capsule-btn.active {
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
  background: rgba(14, 45, 75, 0.9) !important;
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.25) !important;
}

[data-theme="dark"] .ghs-capsule-btn.active .ghs-chevron,
.dark-theme .ghs-capsule-btn.active .ghs-chevron,
.dark .ghs-capsule-btn.active .ghs-chevron,
.green-hero-search.dark-theme .ghs-capsule-btn.active .ghs-chevron,
.green-hero-search.dark .ghs-capsule-btn.active .ghs-chevron {
  color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-ai-perf-badge,
.dark-theme .ghs-ai-perf-badge,
.dark .ghs-ai-perf-badge,
.green-hero-search.dark-theme .ghs-ai-perf-badge,
.green-hero-search.dark .ghs-ai-perf-badge,
[data-theme="dark"] .ghs-cost-graph-widget,
.dark-theme .ghs-cost-graph-widget,
.dark .ghs-cost-graph-widget,
.green-hero-search.dark-theme .ghs-cost-graph-widget,
.green-hero-search.dark .ghs-cost-graph-widget {
  background: rgba(15, 23, 42, 0.85) !important;
  border-color: rgba(56, 189, 248, 0.28) !important;
  color: #cbd5e1 !important;
}

/* Dark theme dropdowns */
[data-theme="dark"] .ghs-dropdown-panel,
.dark-theme .ghs-dropdown-panel,
.dark .ghs-dropdown-panel,
.green-hero-search.dark-theme .ghs-dropdown-panel,
.green-hero-search.dark .ghs-dropdown-panel {
  background: #0f172a !important;
  border-color: rgba(255, 255, 255, 0.16) !important;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7) !important;
  color: #f1f5f9 !important;
}

[data-theme="dark"] .ghs-cat-tabs,
.dark-theme .ghs-cat-tabs,
.dark .ghs-cat-tabs,
.green-hero-search.dark-theme .ghs-cat-tabs,
.green-hero-search.dark .ghs-cat-tabs {
  border-bottom-color: #334155 !important;
}

[data-theme="dark"] .ghs-cat-tab,
.dark-theme .ghs-cat-tab,
.dark .ghs-cat-tab,
.green-hero-search.dark-theme .ghs-cat-tab,
.green-hero-search.dark .ghs-cat-tab {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-cat-tab:hover,
.dark-theme .ghs-cat-tab:hover,
.dark .ghs-cat-tab:hover,
.green-hero-search.dark-theme .ghs-cat-tab:hover,
.green-hero-search.dark .ghs-cat-tab:hover {
  color: #00d2ff !important;
}

[data-theme="dark"] .ghs-cat-tab.active,
.dark-theme .ghs-cat-tab.active,
.dark .ghs-cat-tab.active,
.green-hero-search.dark-theme .ghs-cat-tab.active,
.green-hero-search.dark .ghs-cat-tab.active {
  color: #00d2ff !important;
  border-bottom-color: #00d2ff !important;
}

[data-theme="dark"] .ghs-radio-pill,
.dark-theme .ghs-radio-pill,
.dark .ghs-radio-pill,
.green-hero-search.dark-theme .ghs-radio-pill,
.green-hero-search.dark .ghs-radio-pill {
  background: #1e293b !important;
  border-color: #334155 !important;
}

[data-theme="dark"] .ghs-radio-pill:hover,
.dark-theme .ghs-radio-pill:hover,
.dark .ghs-radio-pill:hover,
.green-hero-search.dark-theme .ghs-radio-pill:hover,
.green-hero-search.dark .ghs-radio-pill:hover {
  border-color: #00d2ff !important;
  background: rgba(0, 210, 255, 0.08) !important;
}

[data-theme="dark"] .ghs-radio-pill.selected,
.dark-theme .ghs-radio-pill.selected,
.dark .ghs-radio-pill.selected,
.green-hero-search.dark-theme .ghs-radio-pill.selected,
.green-hero-search.dark .ghs-radio-pill.selected {
  border-color: #00d2ff !important;
  background: rgba(0, 210, 255, 0.12) !important;
}

[data-theme="dark"] .ghs-radio-pill.selected .ghs-radio-circle,
.dark-theme .ghs-radio-pill.selected .ghs-radio-circle,
.dark .ghs-radio-pill.selected .ghs-radio-circle,
.green-hero-search.dark-theme .ghs-radio-pill.selected .ghs-radio-circle,
.green-hero-search.dark .ghs-radio-pill.selected .ghs-radio-circle {
  border-color: #00d2ff !important;
  background: #00d2ff !important;
  color: #0f172a !important;
}

[data-theme="dark"] .ghs-radio-text,
.dark-theme .ghs-radio-text,
.dark .ghs-radio-text,
.green-hero-search.dark-theme .ghs-radio-text,
.green-hero-search.dark .ghs-radio-text {
  color: #e2e8f0 !important;
}

[data-theme="dark"] .ghs-radio-pill.selected .ghs-radio-text,
.dark-theme .ghs-radio-pill.selected .ghs-radio-text,
.dark .ghs-radio-pill.selected .ghs-radio-text,
.green-hero-search.dark-theme .ghs-radio-pill.selected .ghs-radio-text,
.green-hero-search.dark .ghs-radio-pill.selected .ghs-radio-text {
  color: #00d2ff !important;
}

[data-theme="dark"] .ghs-handover-item,
.dark-theme .ghs-handover-item,
.dark .ghs-handover-item,
.green-hero-search.dark-theme .ghs-handover-item,
.green-hero-search.dark .ghs-handover-item {
  color: #cbd5e1 !important;
}

[data-theme="dark"] .ghs-handover-item:hover,
.dark-theme .ghs-handover-item:hover,
.dark .ghs-handover-item:hover,
.green-hero-search.dark-theme .ghs-handover-item:hover,
.green-hero-search.dark .ghs-handover-item:hover {
  background: #1e293b !important;
  color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-handover-item.selected,
.dark-theme .ghs-handover-item.selected,
.dark .ghs-handover-item.selected,
.green-hero-search.dark-theme .ghs-handover-item.selected,
.green-hero-search.dark .ghs-handover-item.selected {
  background: rgba(0, 210, 255, 0.15) !important;
  color: #00d2ff !important;
}

[data-theme="dark"] .ghs-panel-title,
.dark-theme .ghs-panel-title,
.dark .ghs-panel-title,
.green-hero-search.dark-theme .ghs-panel-title,
.green-hero-search.dark .ghs-panel-title {
  color: #f1f5f9 !important;
}

[data-theme="dark"] .ghs-panel-divider,
.dark-theme .ghs-panel-divider,
.dark .ghs-panel-divider,
.green-hero-search.dark-theme .ghs-panel-divider,
.green-hero-search.dark .ghs-panel-divider {
  background: rgba(255, 255, 255, 0.1) !important;
}

[data-theme="dark"] .ghs-pill-btn,
.dark-theme .ghs-pill-btn,
.dark .ghs-pill-btn,
.green-hero-search.dark-theme .ghs-pill-btn,
.green-hero-search.dark .ghs-pill-btn {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #cbd5e1 !important;
}

[data-theme="dark"] .ghs-pill-btn:hover,
.dark-theme .ghs-pill-btn:hover,
.dark .ghs-pill-btn:hover,
.green-hero-search.dark-theme .ghs-pill-btn:hover,
.green-hero-search.dark .ghs-pill-btn:hover {
  border-color: #00d2ff !important;
  color: #00d2ff !important;
  background: rgba(0, 210, 255, 0.08) !important;
}

[data-theme="dark"] .ghs-pill-btn.active,
.dark-theme .ghs-pill-btn.active,
.dark .ghs-pill-btn.active,
.green-hero-search.dark-theme .ghs-pill-btn.active,
.green-hero-search.dark .ghs-pill-btn.active {
  background: #005953 !important;
  border-color: #005953 !important;
  color: #ffffff !important;
}

[data-theme="dark"] .ghs-panel-label,
.dark-theme .ghs-panel-label,
.dark .ghs-panel-label,
.green-hero-search.dark-theme .ghs-panel-label,
.green-hero-search.dark .ghs-panel-label {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-panel-input,
.dark-theme .ghs-panel-input,
.dark .ghs-panel-input,
.green-hero-search.dark-theme .ghs-panel-input,
.green-hero-search.dark .ghs-panel-input {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #f1f5f9 !important;
}

[data-theme="dark"] .ghs-panel-footer,
.dark-theme .ghs-panel-footer,
.dark .ghs-panel-footer,
.green-hero-search.dark-theme .ghs-panel-footer,
.green-hero-search.dark .ghs-panel-footer {
  border-top-color: #334155 !important;
}

[data-theme="dark"] .ghs-panel-reset,
.dark-theme .ghs-panel-reset,
.dark .ghs-panel-reset,
.green-hero-search.dark-theme .ghs-panel-reset,
.green-hero-search.dark .ghs-panel-reset {
  background: transparent !important;
  border-color: #00d2ff !important;
  color: #00d2ff !important;
}

[data-theme="dark"] .ghs-panel-reset:hover,
.dark-theme .ghs-panel-reset:hover,
.dark .ghs-panel-reset:hover,
.green-hero-search.dark-theme .ghs-panel-reset:hover,
.green-hero-search.dark .ghs-panel-reset:hover {
  background: rgba(0, 210, 255, 0.1) !important;
}

[data-theme="dark"] .ghs-panel-done,
.dark-theme .ghs-panel-done,
.dark .ghs-panel-done,
.green-hero-search.dark-theme .ghs-panel-done,
.green-hero-search.dark .ghs-panel-done {
  background: #00d2ff !important;
  border-color: #00d2ff !important;
  color: #0f172a !important;
}

[data-theme="dark"] .ghs-panel-done:hover,
.dark-theme .ghs-panel-done:hover,
.dark .ghs-panel-done:hover,
.green-hero-search.dark-theme .ghs-panel-done:hover,
.green-hero-search.dark .ghs-panel-done:hover {
  background: #38bdf8 !important;
  border-color: #38bdf8 !important;
}

[data-theme="dark"] .ghs-slider-range-values,
.dark-theme .ghs-slider-range-values,
.dark .ghs-slider-range-values,
.green-hero-search.dark-theme .ghs-slider-range-values,
.green-hero-search.dark .ghs-slider-range-values {
  color: #94a3b8 !important;
}

[data-theme="dark"] .ghs-slider-curr-val,
.dark-theme .ghs-slider-curr-val,
.dark .ghs-slider-curr-val,
.green-hero-search.dark-theme .ghs-slider-curr-val,
.green-hero-search.dark .ghs-slider-curr-val {
  background: rgba(0, 210, 255, 0.18) !important;
  color: #00d2ff !important;
}

[data-theme="dark"] .ghs-payment-slider,
.dark-theme .ghs-payment-slider,
.dark .ghs-payment-slider,
.green-hero-search.dark-theme .ghs-payment-slider,
.green-hero-search.dark .ghs-payment-slider {
  background: #334155 !important;
  accent-color: #00d2ff !important;
}

/* ========================================================
   LIGHT THEME STYLING (Connected with [data-theme="light"], .light-theme, .light)
   ======================================================== */
[data-theme="light"] .green-hero-search,
.light-theme .green-hero-search,
.light .green-hero-search,
.green-hero-search.light-theme,
.green-hero-search.light {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 249, 255, 0.80) 50%, rgba(224, 242, 254, 0.75) 100%) !important;
  border-color: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 20px 50px -10px rgba(15, 23, 42, 0.12), 0 0 30px rgba(56, 189, 248, 0.18), inset 0 0 0 1.5px rgba(255, 255, 255, 0.95) !important;
}

[data-theme="light"] .ghs-v-sep,
.light-theme .ghs-v-sep,
.light .ghs-v-sep,
.green-hero-search.light-theme .ghs-v-sep,
.green-hero-search.light .ghs-v-sep {
  background: rgba(0, 0, 0, 0.1) !important;
}

[data-theme="light"] .ghs-nav-pill,
.light-theme .ghs-nav-pill,
.light .ghs-nav-pill,
.green-hero-search.light-theme .ghs-nav-pill,
.green-hero-search.light .ghs-nav-pill {
  color: #334155 !important;
}

[data-theme="light"] .ghs-nav-pill:hover,
.light-theme .ghs-nav-pill:hover,
.light .ghs-nav-pill:hover,
.green-hero-search.light-theme .ghs-nav-pill:hover,
.green-hero-search.light .ghs-nav-pill:hover {
  color: #0284c7 !important;
  background: rgba(2, 132, 199, 0.06) !important;
}

[data-theme="light"] .ghs-nav-pill.active,
.light-theme .ghs-nav-pill.active,
.light .ghs-nav-pill.active,
.green-hero-search.light-theme .ghs-nav-pill.active,
.green-hero-search.light .ghs-nav-pill.active {
  background: rgba(255, 255, 255, 0.98) !important;
  color: #0284c7 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(226, 232, 240, 0.9) !important;
}

[data-theme="light"] .ghs-nav-pill-highlight.active,
.light-theme .ghs-nav-pill-highlight.active,
.light .ghs-nav-pill-highlight.active,
.green-hero-search.light-theme .ghs-nav-pill-highlight.active,
.green-hero-search.light .ghs-nav-pill-highlight.active {
  background: rgba(167, 243, 208, 0.45) !important;
  border-color: rgba(45, 212, 191, 0.7) !important;
  color: #065f46 !important;
  box-shadow: 0 0 14px rgba(45, 212, 191, 0.35) !important;
}

[data-theme="light"] .ghs-mini-card,
.light-theme .ghs-mini-card,
.light .ghs-mini-card,
.green-hero-search.light-theme .ghs-mini-card,
.green-hero-search.light .ghs-mini-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
}

[data-theme="light"] .ghs-mini-title,
.light-theme .ghs-mini-title,
.light .ghs-mini-title,
.green-hero-search.light-theme .ghs-mini-title,
.green-hero-search.light .ghs-mini-title {
  color: #0f172a !important;
}

[data-theme="light"] .ghs-mini-loc,
.light-theme .ghs-mini-loc,
.light .ghs-mini-loc,
.green-hero-search.light-theme .ghs-mini-loc,
.green-hero-search.light .ghs-mini-loc {
  color: #64748b !important;
}

[data-theme="light"] .ghs-input-wrap,
.light-theme .ghs-input-wrap,
.light .ghs-input-wrap,
.green-hero-search.light-theme .ghs-input-wrap,
.green-hero-search.light .ghs-input-wrap {
  border-color: rgba(226, 232, 240, 0.95) !important;
}

[data-theme="light"] .ghs-query-wrap,
.light-theme .ghs-query-wrap,
.light .ghs-query-wrap,
.green-hero-search.light-theme .ghs-query-wrap,
.green-hero-search.light .ghs-query-wrap {
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

[data-theme="light"] .ghs-text-input,
.light-theme .ghs-text-input,
.light .ghs-text-input,
.green-hero-search.light-theme .ghs-text-input,
.green-hero-search.light .ghs-text-input {
  color: #0f172a !important;
}

[data-theme="light"] .ghs-text-input::placeholder,
.light-theme .ghs-text-input::placeholder,
.light .ghs-text-input::placeholder,
.green-hero-search.light-theme .ghs-text-input::placeholder,
.green-hero-search.light .ghs-text-input::placeholder {
  color: #64748b !important;
}

[data-theme="light"] .ghs-query-icon,
.light-theme .ghs-query-icon,
.light .ghs-query-icon,
.green-hero-search.light-theme .ghs-query-icon,
.green-hero-search.light .ghs-query-icon {
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-clear-input,
.light-theme .ghs-clear-input,
.light .ghs-clear-input,
.green-hero-search.light-theme .ghs-clear-input,
.green-hero-search.light .ghs-clear-input {
  color: #64748b !important;
}

[data-theme="light"] .ghs-clear-input:hover,
.light-theme .ghs-clear-input:hover,
.light .ghs-clear-input:hover,
.green-hero-search.light-theme .ghs-clear-input:hover,
.green-hero-search.light .ghs-clear-input:hover {
  color: #0f172a !important;
}

[data-theme="light"] .ghs-location-wrap,
.light-theme .ghs-location-wrap,
.light .ghs-location-wrap,
.green-hero-search.light-theme .ghs-location-wrap,
.green-hero-search.light .ghs-location-wrap {
  background: linear-gradient(135deg, rgba(215, 242, 254, 0.75) 0%, rgba(235, 248, 255, 0.9) 100%) !important;
  border-color: rgba(186, 230, 253, 0.95) !important;
}

[data-theme="light"] .ghs-cost-pins-badge,
.light-theme .ghs-cost-pins-badge,
.light .ghs-cost-pins-badge,
.green-hero-search.light-theme .ghs-cost-pins-badge,
.green-hero-search.light .ghs-cost-pins-badge {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
}

[data-theme="light"] .ghs-cost-pin-pill,
.light-theme .ghs-cost-pin-pill,
.light .ghs-cost-pin-pill,
.green-hero-search.light-theme .ghs-cost-pin-pill,
.green-hero-search.light .ghs-cost-pin-pill {
  color: #1e293b !important;
}

[data-theme="light"] .ghs-cost-pin-icon,
.light-theme .ghs-cost-pin-icon,
.light .ghs-cost-pin-icon,
.green-hero-search.light-theme .ghs-cost-pin-icon,
.green-hero-search.light .ghs-cost-pin-icon {
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-map-pin-tag,
.light-theme .ghs-map-pin-tag,
.light .ghs-map-pin-tag,
.green-hero-search.light-theme .ghs-map-pin-tag,
.green-hero-search.light .ghs-map-pin-tag {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
  color: #0f172a !important;
}

[data-theme="light"] .ghs-zoom-btn,
.light-theme .ghs-zoom-btn,
.light .ghs-zoom-btn,
.green-hero-search.light-theme .ghs-zoom-btn,
.green-hero-search.light .ghs-zoom-btn {
  background: rgba(255, 255, 255, 0.92) !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
  color: #64748b !important;
}

[data-theme="light"] .ghs-zoom-btn:hover,
.light-theme .ghs-zoom-btn:hover,
.light .ghs-zoom-btn:hover,
.green-hero-search.light-theme .ghs-zoom-btn:hover,
.green-hero-search.light .ghs-zoom-btn:hover {
  background: #f8fafc !important;
  color: #0284c7 !important;
  border-color: #0284c7 !important;
}

[data-theme="light"] .ghs-capsule-btn,
.light-theme .ghs-capsule-btn,
.light .ghs-capsule-btn,
.green-hero-search.light-theme .ghs-capsule-btn,
.green-hero-search.light .ghs-capsule-btn {
  background: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
  color: #1e293b !important;
}

[data-theme="light"] .ghs-capsule-left .ghs-btn-icon,
.light-theme .ghs-capsule-left .ghs-btn-icon,
.light .ghs-capsule-left .ghs-btn-icon,
.green-hero-search.light-theme .ghs-capsule-left .ghs-btn-icon,
.green-hero-search.light .ghs-capsule-left .ghs-btn-icon,
[data-theme="light"] .ghs-chevron,
.light-theme .ghs-chevron,
.light .ghs-chevron,
.green-hero-search.light-theme .ghs-chevron,
.green-hero-search.light .ghs-chevron {
  color: #64748b !important;
}

[data-theme="light"] .ghs-capsule-btn:hover,
.light-theme .ghs-capsule-btn:hover,
.light .ghs-capsule-btn:hover,
.green-hero-search.light-theme .ghs-capsule-btn:hover,
.green-hero-search.light .ghs-capsule-btn:hover {
  background: #ffffff !important;
  border-color: #38bdf8 !important;
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-capsule-btn.active,
.light-theme .ghs-capsule-btn.active,
.light .ghs-capsule-btn.active,
.green-hero-search.light-theme .ghs-capsule-btn.active,
.green-hero-search.light .ghs-capsule-btn.active {
  border-color: #0284c7 !important;
  color: #0284c7 !important;
  background: #f0f9ff !important;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.2) !important;
}

[data-theme="light"] .ghs-capsule-btn.active .ghs-chevron,
.light-theme .ghs-capsule-btn.active .ghs-chevron,
.light .ghs-capsule-btn.active .ghs-chevron,
.green-hero-search.light-theme .ghs-capsule-btn.active .ghs-chevron,
.green-hero-search.light .ghs-capsule-btn.active .ghs-chevron {
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-ai-perf-badge,
.light-theme .ghs-ai-perf-badge,
.light .ghs-ai-perf-badge,
.green-hero-search.light-theme .ghs-ai-perf-badge,
.green-hero-search.light .ghs-ai-perf-badge,
[data-theme="light"] .ghs-cost-graph-widget,
.light-theme .ghs-cost-graph-widget,
.light .ghs-cost-graph-widget,
.green-hero-search.light-theme .ghs-cost-graph-widget,
.green-hero-search.light .ghs-cost-graph-widget {
  background: rgba(255, 255, 255, 0.92) !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
  color: #334155 !important;
}

/* Light theme dropdowns */
[data-theme="light"] .ghs-dropdown-panel,
.light-theme .ghs-dropdown-panel,
.light .ghs-dropdown-panel,
.green-hero-search.light-theme .ghs-dropdown-panel,
.green-hero-search.light .ghs-dropdown-panel {
  background: #ffffff !important;
  border-color: rgba(226, 232, 240, 0.95) !important;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12) !important;
  color: #0f172a !important;
}

[data-theme="light"] .ghs-cat-tabs,
.light-theme .ghs-cat-tabs,
.light .ghs-cat-tabs,
.green-hero-search.light-theme .ghs-cat-tabs,
.green-hero-search.light .ghs-cat-tabs {
  border-bottom-color: #e2e8f0 !important;
}

[data-theme="light"] .ghs-cat-tab,
.light-theme .ghs-cat-tab,
.light .ghs-cat-tab,
.green-hero-search.light-theme .ghs-cat-tab,
.green-hero-search.light .ghs-cat-tab {
  color: #64748b !important;
}

[data-theme="light"] .ghs-cat-tab:hover,
.light-theme .ghs-cat-tab:hover,
.light .ghs-cat-tab:hover,
.green-hero-search.light-theme .ghs-cat-tab:hover,
.green-hero-search.light .ghs-cat-tab:hover {
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-cat-tab.active,
.light-theme .ghs-cat-tab.active,
.light .ghs-cat-tab.active,
.green-hero-search.light-theme .ghs-cat-tab.active,
.green-hero-search.light .ghs-cat-tab.active {
  color: #0284c7 !important;
  border-bottom-color: #0284c7 !important;
}

[data-theme="light"] .ghs-radio-pill,
.light-theme .ghs-radio-pill,
.light .ghs-radio-pill,
.green-hero-search.light-theme .ghs-radio-pill,
.green-hero-search.light .ghs-radio-pill {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
}

[data-theme="light"] .ghs-radio-pill:hover,
.light-theme .ghs-radio-pill:hover,
.light .ghs-radio-pill:hover,
.green-hero-search.light-theme .ghs-radio-pill:hover,
.green-hero-search.light .ghs-radio-pill:hover {
  border-color: #0284c7 !important;
  background: rgba(2, 132, 199, 0.05) !important;
}

[data-theme="light"] .ghs-radio-pill.selected,
.light-theme .ghs-radio-pill.selected,
.light .ghs-radio-pill.selected,
.green-hero-search.light-theme .ghs-radio-pill.selected,
.green-hero-search.light .ghs-radio-pill.selected {
  border-color: #0284c7 !important;
  background: rgba(2, 132, 199, 0.08) !important;
}

[data-theme="light"] .ghs-radio-pill.selected .ghs-radio-circle,
.light-theme .ghs-radio-pill.selected .ghs-radio-circle,
.light .ghs-radio-pill.selected .ghs-radio-circle,
.green-hero-search.light-theme .ghs-radio-pill.selected .ghs-radio-circle,
.green-hero-search.light .ghs-radio-pill.selected .ghs-radio-circle {
  border-color: #0284c7 !important;
  background: #0284c7 !important;
  color: #ffffff !important;
}

[data-theme="light"] .ghs-radio-text,
.light-theme .ghs-radio-text,
.light .ghs-radio-text,
.green-hero-search.light-theme .ghs-radio-text,
.green-hero-search.light .ghs-radio-text {
  color: #334155 !important;
}

[data-theme="light"] .ghs-radio-pill.selected .ghs-radio-text,
.light-theme .ghs-radio-pill.selected .ghs-radio-text,
.light .ghs-radio-pill.selected .ghs-radio-text,
.green-hero-search.light-theme .ghs-radio-pill.selected .ghs-radio-text,
.green-hero-search.light .ghs-radio-pill.selected .ghs-radio-text {
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-handover-item,
.light-theme .ghs-handover-item,
.light .ghs-handover-item,
.green-hero-search.light-theme .ghs-handover-item,
.green-hero-search.light .ghs-handover-item {
  color: #334155 !important;
}

[data-theme="light"] .ghs-handover-item:hover,
.light-theme .ghs-handover-item:hover,
.light .ghs-handover-item:hover,
.green-hero-search.light-theme .ghs-handover-item:hover,
.green-hero-search.light .ghs-handover-item:hover {
  background: #f1f5f9 !important;
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-handover-item.selected,
.light-theme .ghs-handover-item.selected,
.light .ghs-handover-item.selected,
.green-hero-search.light-theme .ghs-handover-item.selected,
.green-hero-search.light .ghs-handover-item.selected {
  background: rgba(2, 132, 199, 0.1) !important;
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-panel-title,
.light-theme .ghs-panel-title,
.light .ghs-panel-title,
.green-hero-search.light-theme .ghs-panel-title,
.green-hero-search.light .ghs-panel-title {
  color: #0f172a !important;
}

[data-theme="light"] .ghs-panel-divider,
.light-theme .ghs-panel-divider,
.light .ghs-panel-divider,
.green-hero-search.light-theme .ghs-panel-divider,
.green-hero-search.light .ghs-panel-divider {
  background: #e2e8f0 !important;
}

[data-theme="light"] .ghs-pill-btn,
.light-theme .ghs-pill-btn,
.light .ghs-pill-btn,
.green-hero-search.light-theme .ghs-pill-btn,
.green-hero-search.light .ghs-pill-btn {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  color: #334155 !important;
}

[data-theme="light"] .ghs-pill-btn:hover,
.light-theme .ghs-pill-btn:hover,
.light .ghs-pill-btn:hover,
.green-hero-search.light-theme .ghs-pill-btn:hover,
.green-hero-search.light .ghs-pill-btn:hover {
  border-color: #0284c7 !important;
  color: #0284c7 !important;
  background: rgba(2, 132, 199, 0.06) !important;
}

[data-theme="light"] .ghs-pill-btn.active,
.light-theme .ghs-pill-btn.active,
.light .ghs-pill-btn.active,
.green-hero-search.light-theme .ghs-pill-btn.active,
.green-hero-search.light .ghs-pill-btn.active {
  background: #005953 !important;
  border-color: #005953 !important;
  color: #ffffff !important;
}

[data-theme="light"] .ghs-panel-label,
.light-theme .ghs-panel-label,
.light .ghs-panel-label,
.green-hero-search.light-theme .ghs-panel-label,
.green-hero-search.light .ghs-panel-label {
  color: #64748b !important;
}

[data-theme="light"] .ghs-panel-input,
.light-theme .ghs-panel-input,
.light .ghs-panel-input,
.green-hero-search.light-theme .ghs-panel-input,
.green-hero-search.light .ghs-panel-input {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #0f172a !important;
}

[data-theme="light"] .ghs-panel-footer,
.light-theme .ghs-panel-footer,
.light .ghs-panel-footer,
.green-hero-search.light-theme .ghs-panel-footer,
.green-hero-search.light .ghs-panel-footer {
  border-top-color: #e2e8f0 !important;
}

[data-theme="light"] .ghs-panel-reset,
.light-theme .ghs-panel-reset,
.light .ghs-panel-reset,
.green-hero-search.light-theme .ghs-panel-reset,
.green-hero-search.light .ghs-panel-reset {
  background: transparent !important;
  border-color: #0284c7 !important;
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-panel-reset:hover,
.light-theme .ghs-panel-reset:hover,
.light .ghs-panel-reset:hover,
.green-hero-search.light-theme .ghs-panel-reset:hover,
.green-hero-search.light .ghs-panel-reset:hover {
  background: rgba(2, 132, 199, 0.08) !important;
}

[data-theme="light"] .ghs-panel-done,
.light-theme .ghs-panel-done,
.light .ghs-panel-done,
.green-hero-search.light-theme .ghs-panel-done,
.green-hero-search.light .ghs-panel-done {
  background: #0284c7 !important;
  border-color: #0284c7 !important;
  color: #ffffff !important;
}

[data-theme="light"] .ghs-panel-done:hover,
.light-theme .ghs-panel-done:hover,
.light .ghs-panel-done:hover,
.green-hero-search.light-theme .ghs-panel-done:hover,
.green-hero-search.light .ghs-panel-done:hover {
  background: #0369a1 !important;
  border-color: #0369a1 !important;
}

[data-theme="light"] .ghs-slider-range-values,
.light-theme .ghs-slider-range-values,
.light .ghs-slider-range-values,
.green-hero-search.light-theme .ghs-slider-range-values,
.green-hero-search.light .ghs-slider-range-values {
  color: #64748b !important;
}

[data-theme="light"] .ghs-slider-curr-val,
.light-theme .ghs-slider-curr-val,
.light .ghs-slider-curr-val,
.green-hero-search.light-theme .ghs-slider-curr-val,
.green-hero-search.light .ghs-slider-curr-val {
  background: rgba(2, 132, 199, 0.12) !important;
  color: #0284c7 !important;
}

[data-theme="light"] .ghs-payment-slider,
.light-theme .ghs-payment-slider,
.light .ghs-payment-slider,
.green-hero-search.light-theme .ghs-payment-slider,
.green-hero-search.light .ghs-payment-slider {
  background: #e2e8f0 !important;
  accent-color: #0284c7 !important;
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

