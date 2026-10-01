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
<!-- شريط البحث العصري المتكامل المطابق للصور 100% وبمساحة واسعة لمربع الإدخال -->
<div class="green-hero-search">
  <!-- ROW 1: Toggles (Purpose + Divider + Status) + AI Search Button -->
  <div class="ghs-row ghs-row-top">
    <div class="ghs-top-left-group">
      <!-- Purpose Tabs: للبيع / للإيجار -->
      <div class="ghs-mini-toggle-group">
        <button
          type="button"
          class="ghs-mini-toggle"
          :class="{ active: homePurpose === 'sale' }"
          @click="homePurpose = 'sale'"
        >
          {{ isRtl ? 'للبيع' : 'For Sale' }}
        </button>
        <button
          type="button"
          class="ghs-mini-toggle"
          :class="{ active: homePurpose === 'rent' }"
          @click="homePurpose = 'rent'"
        >
          {{ isRtl ? 'للإيجار' : 'For Rent' }}
        </button>
      </div>

      <!-- Vertical Separator Line -->
      <div class="ghs-v-sep"></div>

      <!-- Status Tabs: الكل / جاهز للسكن / قيد الإنشاء -->
      <div class="ghs-mini-toggle-group">
        <button
          type="button"
          class="ghs-mini-toggle"
          :class="{ active: homeStatus === 'all' }"
          @click="homeStatus = 'all'"
        >
          {{ isRtl ? 'الكل' : 'All' }}
        </button>
        <button
          type="button"
          class="ghs-mini-toggle"
          :class="{ active: homeStatus === 'ready' }"
          @click="homeStatus = 'ready'"
        >
          {{ isRtl ? 'جاهز للسكن' : 'Ready' }}
        </button>
        <button
          type="button"
          class="ghs-mini-toggle"
          :class="{ active: homeStatus === 'offplan' }"
          @click="homeStatus = 'offplan'"
        >
          {{ isRtl ? 'قيد الإنشاء' : 'Off-Plan' }}
        </button>
      </div>
    </div>

    <!-- AI Search Button (Pill on Top Right) -->
    <button 
      type="button" 
      class="ghs-ai-pill-btn"
      @click="triggerAiSearch"
      :title="isRtl ? 'بحث ذكي بالذكاء الاصطناعي' : 'Smart AI Search'"
    >
      <i class="fa-solid fa-wand-magic-sparkles"></i>
      <span>{{ isRtl ? 'بحث ذكي AI' : 'AI Search' }}</span>
    </button>
  </div>

  <!-- ROW 2: The Two Search Boxes (Search Text & Location) -->
  <div class="ghs-row ghs-inputs-row">
    <!-- 1. Search Query / Keywords / AI Prompt Input -->
    <div class="ghs-input-wrap ghs-query-wrap">
      <i class="fa-solid fa-magnifying-glass ghs-input-icon ghs-query-icon"></i>
      <input
        type="text"
        class="ghs-text-input"
        v-model="query"
        :placeholder="isRtl ? 'ابحث عن عقار أحلامك، كلمات مفتاحية، أو بالذكاء الاصطناعي...' : 'Search property, keywords or AI prompt...'"
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

    <!-- 2. Location / Area Input -->
    <div class="ghs-input-wrap ghs-location-wrap">
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

  <!-- ROW 3: Custom Dropdown Filters + Search Submit Button -->
  <div class="ghs-row ghs-filters-row">

    <!-- 1. Property Type Dropdown (Exact Match to Image 2 with Residential / Commercial Tabs & Radio Pills) -->
    <div class="ghs-custom-dropdown" ref="searchTypeRef">
      <button 
        type="button" 
        class="ghs-dropdown-btn" 
        :class="{ active: propertyTypeOpen || homeType !== 'all' }" 
        @click="propertyTypeOpen = !propertyTypeOpen; bedsBathsOpen = false; priceOpen = false; handoverByOpen = false; paymentPlanOpen = false;"
      >
        <i class="fa-solid fa-city ghs-btn-icon"></i>
        <span>{{ propertyTypeLabel }}</span>
        <i class="fa-solid ghs-chevron" :class="propertyTypeOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
      </button>

      <Transition name="dropdown-fade">
        <div v-if="propertyTypeOpen" class="ghs-dropdown-panel ghs-type-popup" @click.stop>
          <!-- Category Tabs: Residential vs Commercial (Image 2) -->
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

          <!-- Radio Pill Options (2 columns as in Image 2) -->
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

    <!-- DYNAMIC FILTERS: If Off-Plan -> Handover By & Payment Plan (Matching Images 3, 4, 5) -->
    <template v-if="homeStatus === 'offplan'">
      <!-- Handover By Dropdown (Image 4) -->
      <div class="ghs-custom-dropdown" ref="searchHandoverRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn" 
          :class="{ active: handoverByOpen || handoverBy !== 'any' }" 
          @click="handoverByOpen = !handoverByOpen; propertyTypeOpen = false; paymentPlanOpen = false;"
        >
          <i class="fa-solid fa-calendar-days ghs-btn-icon"></i>
          <span>{{ handoverLabel }}</span>
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

      <!-- Payment Plan Dropdown (Image 5) -->
      <div class="ghs-custom-dropdown" ref="searchPaymentRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn" 
          :class="{ active: paymentPlanOpen || Number(preHandoverPayment) < 100 }" 
          @click="paymentPlanOpen = !paymentPlanOpen; propertyTypeOpen = false; handoverByOpen = false;"
        >
          <i class="fa-solid fa-chart-pie ghs-btn-icon"></i>
          <span>{{ paymentPlanLabel }}</span>
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

    <!-- DYNAMIC FILTERS: If NOT Off-Plan ('all' or 'ready') -> Beds/Baths & Price (Images 3 & 5) -->
    <template v-else>
      <!-- Beds & Baths Custom Popup (Image 5) -->
      <div class="ghs-custom-dropdown" ref="searchBedsRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn" 
          :class="{ active: bedsBathsOpen || selectedBeds.length || selectedBaths.length }" 
          @click="bedsBathsOpen = !bedsBathsOpen; propertyTypeOpen = false; priceOpen = false;"
        >
          <i class="fa-solid fa-bed ghs-btn-icon"></i>
          <span>{{ bedsBathsLabel }}</span>
          <i class="fa-solid ghs-chevron" :class="bedsBathsOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="bedsBathsOpen" class="ghs-dropdown-panel ghs-beds-panel" @click.stop>
            <!-- Beds Section -->
            <div class="ghs-panel-title">{{ isRtl ? 'غرف النوم' : 'Beds' }}</div>
            <div class="ghs-pill-grid">
              <button 
                type="button" 
                class="ghs-pill-btn" 
                :class="{ active: selectedBeds.includes('Studio') }"
                @click="toggleBed('Studio')"
              >
                {{ isRtl ? 'استوديو' : 'Studio' }}
              </button>
              <button 
                type="button" 
                class="ghs-pill-btn" 
                v-for="b in ['1', '2', '3', '4', '5', '6', '7', '8+']" 
                :key="'bed-' + b"
                :class="{ active: selectedBeds.includes(b) }"
                @click="toggleBed(b)"
              >
                {{ b }}
              </button>
            </div>

            <!-- Baths Section -->
            <div class="ghs-panel-title mt-3">{{ isRtl ? 'الحمامات' : 'Baths' }}</div>
            <div class="ghs-pill-grid">
              <button 
                type="button" 
                class="ghs-pill-btn" 
                v-for="b in ['1', '2', '3', '4', '5', '6+']" 
                :key="'bath-' + b"
                :class="{ active: selectedBaths.includes(b) }"
                @click="toggleBath(b)"
              >
                {{ b }}
              </button>
            </div>

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
      
      <!-- Price (AED) Custom Popup (Image 3) -->
      <div class="ghs-custom-dropdown" ref="searchPriceRef">
        <button 
          type="button" 
          class="ghs-dropdown-btn" 
          :class="{ active: priceOpen || minPrice || maxPrice }" 
          @click="priceOpen = !priceOpen; propertyTypeOpen = false; bedsBathsOpen = false;"
        >
          <i class="fa-solid fa-coins ghs-btn-icon"></i>
          <span>{{ priceLabel }}</span>
          <i class="fa-solid ghs-chevron" :class="priceOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="priceOpen" class="ghs-dropdown-panel ghs-price-panel" @click.stop>
            <div class="ghs-price-inputs-row">
              <div class="ghs-price-col">
                <label class="ghs-panel-label">{{ isRtl ? 'الحد الأدنى' : 'Minimum' }}</label>
                <input 
                  type="number" 
                  class="ghs-panel-input" 
                  v-model="minPrice" 
                  placeholder="0" 
                />
              </div>
              <div class="ghs-price-col">
                <label class="ghs-panel-label">{{ isRtl ? 'الحد الأقصى' : 'Maximum' }}</label>
                <input 
                  type="number" 
                  class="ghs-panel-input" 
                  v-model="maxPrice" 
                  :placeholder="isRtl ? 'أي سعر' : 'Any'" 
                />
              </div>
            </div>

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

    <!-- Primary Search Submit Button -->
    <button type="button" class="ghs-search-btn" @click="handleSearch">
      <i class="fa-solid fa-magnifying-glass"></i>
      <span>{{ isRtl ? 'بحث' : 'Search' }}</span>
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
   Redesigned Luxury Compact Hero Search (Light & Dark Mode)
   ======================================================== */
.green-hero-search {
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 12px 16px;
  box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.9);
  max-width: 1040px;
  margin: 20px auto 0;
  width: 96%;
  transition: all 0.3s ease;
}

/* Two-Row Structure */
.ghs-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.ghs-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  width: 100%;
}

.ghs-top-left-group {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ghs-v-sep {
  width: 1px;
  height: 24px;
  background: #cbd5e1;
  margin: 0 4px;
  flex-shrink: 0;
}

.ghs-row-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 0;
}

.ghs-mini-toggle-group {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 9px;
  padding: 3px;
  gap: 2px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.ghs-mini-toggle {
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.ghs-mini-toggle:hover {
  color: #0284c7;
}

.ghs-mini-toggle.active {
  background: #ffffff;
  color: #0284c7;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* AI Pill Button on Row 1 (Top-Right) */
.ghs-ai-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  color: #0284c7;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.ghs-ai-pill-btn i {
  font-size: 12px;
}

.ghs-ai-pill-btn:hover {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
}

/* Search Inputs Row (Row 2): The Two Input Boxes (Search Query & Location) */
.ghs-inputs-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
}

.ghs-input-wrap {
  flex: 1;
  min-width: 0;
  height: 42px;
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  padding: 0 12px;
  background: #ffffff;
  transition: all 0.2s ease;
  position: relative;
  gap: 8px;
}

.ghs-input-wrap:focus-within {
  border-color: #0284c7;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
}

.ghs-input-icon {
  font-size: 14px;
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
  font-size: 13.5px;
  color: #1e293b;
  background: transparent;
  min-width: 0;
}

.ghs-text-input::placeholder {
  color: #94a3b8;
  font-size: 13px;
}

.ghs-clear-input {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12px;
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

/* Filters Row (Row 3): Custom Dropdowns & Search Button */
.ghs-filters-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 0;
}

/* Dropdown Buttons */
.ghs-custom-dropdown {
  position: relative;
  flex: 1;
  min-width: 120px;
  max-width: 155px;
}

.ghs-dropdown-btn {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  gap: 6px;
}

.ghs-btn-icon {
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
}

.ghs-dropdown-btn span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: right;
  flex: 1;
  font-size: 13px;
}

.ghs-chevron {
  color: #64748b;
  font-size: 11px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.ghs-dropdown-btn:hover {
  border-color: #005953;
  background: #ffffff;
}

.ghs-dropdown-btn.active {
  border: 2px solid #005953;
  color: #005953;
  background: #f0fdfa;
  font-weight: 700;
}

.ghs-dropdown-btn.active .ghs-btn-icon,
.ghs-dropdown-btn.active .ghs-chevron {
  color: #005953;
}

/* Search Submit Button */
.ghs-search-btn {
  height: 42px;
  padding: 0 22px;
  font-size: 13.5px;
  font-weight: 700;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: linear-gradient(135deg, #0284c7 0%, #00d2ff 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(2, 132, 199, 0.25);
  transition: all 0.2s ease;
}

.ghs-search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(2, 132, 199, 0.35);
  background: linear-gradient(135deg, #0369a1 0%, #00b8e6 100%);
}

.ghs-search-btn i {
  font-size: 13px;
}

/* Floating Panels */
.ghs-dropdown-panel {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: 1000;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
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

/* Beds & Baths Panel */
.ghs-beds-panel {
  width: 310px;
  max-width: 90vw;
  padding: 16px 18px;
}

.ghs-panel-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.ghs-pill-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ghs-pill-btn {
  min-width: 40px;
  height: 33px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
}

.ghs-pill-btn:hover {
  border-color: #005953;
  color: #005953;
  background: #f0fdfa;
}

.ghs-pill-btn.active {
  background: #005953;
  color: #ffffff;
  border-color: #005953;
  font-weight: 700;
}

/* Price Panel */
.ghs-price-panel {
  width: 300px;
  max-width: 90vw;
  padding: 16px 18px;
}

.ghs-price-inputs-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.ghs-price-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ghs-panel-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #64748b;
}

.ghs-panel-input {
  width: 100%;
  height: 38px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 10px;
  text-align: center;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.ghs-panel-input:focus {
  border-color: #005953;
  box-shadow: 0 0 0 3px rgba(0, 89, 83, 0.12);
}

/* Shared Panel Footer */
.ghs-panel-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
  margin-top: 8px;
}

.ghs-panel-reset {
  flex: 1;
  height: 35px;
  background: #ffffff;
  border: 1.5px solid #005953;
  color: #005953;
  border-radius: 7px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ghs-panel-reset:hover {
  background: #f0fdfa;
}

.ghs-panel-done {
  flex: 1;
  height: 35px;
  background: #005953;
  border: 1.5px solid #005953;
  color: #ffffff;
  border-radius: 7px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ghs-panel-done:hover {
  background: #004540;
  border-color: #004540;
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
@media (max-width: 960px) {
  .green-hero-search {
    max-width: 95%;
  }
  .ghs-custom-dropdown {
    min-width: 105px;
    max-width: 135px;
  }
  .ghs-dropdown-btn {
    padding: 0 8px;
  }
}

@media (max-width: 820px) {
  .green-hero-search {
    padding: 12px;
    margin-top: 16px;
    border-radius: 14px;
  }
  .ghs-row-top {
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
  }
  .ghs-top-left-group {
    flex-wrap: wrap;
    gap: 6px;
  }
  .ghs-inputs-row {
    flex-direction: column;
    gap: 8px;
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
    flex: 1 1 calc(33.333% - 6px);
    min-width: 95px;
    max-width: none;
  }
  .ghs-search-btn {
    width: 100%;
    flex: 1 1 100%;
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
  .ghs-ai-pill-btn {
    width: 100%;
    justify-content: center;
  }
  .ghs-custom-dropdown {
    flex: 1 1 100%;
    width: 100%;
  }
}

/* ========================================================
   Dark Theme Support (100% Connected with [data-theme="dark"] and .dark)
   ======================================================== */
[data-theme="dark"] .green-hero-search,
.dark .green-hero-search {
  background: rgba(15, 23, 42, 0.94);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
}

[data-theme="dark"] .ghs-v-sep,
.dark .ghs-v-sep {
  background: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .ghs-mini-toggle-group,
.dark .ghs-mini-toggle-group {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .ghs-mini-toggle,
.dark .ghs-mini-toggle {
  color: #94a3b8;
}

[data-theme="dark"] .ghs-mini-toggle:hover,
.dark .ghs-mini-toggle:hover {
  color: #38bdf8;
}

[data-theme="dark"] .ghs-mini-toggle.active,
.dark .ghs-mini-toggle.active {
  background: #1e293b;
  color: #00d2ff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

[data-theme="dark"] .ghs-ai-pill-btn,
.dark .ghs-ai-pill-btn {
  background: rgba(0, 210, 255, 0.14);
  border-color: rgba(0, 210, 255, 0.3);
  color: #00d2ff;
}

[data-theme="dark"] .ghs-ai-pill-btn:hover,
.dark .ghs-ai-pill-btn:hover {
  background: #00d2ff;
  color: #0f172a;
}

[data-theme="dark"] .ghs-input-wrap,
.dark .ghs-input-wrap {
  background: rgba(30, 41, 59, 0.75);
  border-color: rgba(255, 255, 255, 0.14);
}

[data-theme="dark"] .ghs-input-wrap:focus-within,
.dark .ghs-input-wrap:focus-within {
  background: rgba(30, 41, 59, 0.95);
  border-color: #00d2ff;
  box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.15);
}

[data-theme="dark"] .ghs-query-icon,
.dark .ghs-query-icon {
  color: #38bdf8;
}

[data-theme="dark"] .ghs-loc-icon,
.dark .ghs-loc-icon {
  color: #2dd4bf;
}

[data-theme="dark"] .ghs-text-input,
.dark .ghs-text-input {
  color: #f1f5f9;
}

[data-theme="dark"] .ghs-text-input::placeholder,
.dark .ghs-text-input::placeholder {
  color: #94a3b8;
}

[data-theme="dark"] .ghs-dropdown-btn,
.dark .ghs-dropdown-btn {
  background: rgba(30, 41, 59, 0.75);
  border-color: rgba(255, 255, 255, 0.14);
  color: #e2e8f0;
}

[data-theme="dark"] .ghs-btn-icon,
.dark .ghs-btn-icon,
[data-theme="dark"] .ghs-chevron,
.dark .ghs-chevron {
  color: #94a3b8;
}

[data-theme="dark"] .ghs-dropdown-btn:hover,
.dark .ghs-dropdown-btn:hover {
  border-color: #00d2ff;
  background: rgba(30, 41, 59, 0.9);
}

[data-theme="dark"] .ghs-dropdown-btn.active,
.dark .ghs-dropdown-btn.active {
  border-color: #00d2ff;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.12);
}

[data-theme="dark"] .ghs-dropdown-btn.active .ghs-btn-icon,
.dark .ghs-dropdown-btn.active .ghs-btn-icon,
[data-theme="dark"] .ghs-dropdown-btn.active .ghs-chevron,
.dark .ghs-dropdown-btn.active .ghs-chevron {
  color: #00d2ff;
}

[data-theme="dark"] .ghs-dropdown-panel,
.dark .ghs-dropdown-panel {
  background: #0f172a;
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
  color: #f1f5f9;
}

[data-theme="dark"] .ghs-cat-tabs,
.dark .ghs-cat-tabs {
  border-bottom-color: #334155;
}

[data-theme="dark"] .ghs-cat-tab,
.dark .ghs-cat-tab {
  color: #94a3b8;
}

[data-theme="dark"] .ghs-cat-tab:hover,
.dark .ghs-cat-tab:hover {
  color: #00d2ff;
}

[data-theme="dark"] .ghs-cat-tab.active,
.dark .ghs-cat-tab.active {
  color: #00d2ff;
  border-bottom-color: #00d2ff;
}

[data-theme="dark"] .ghs-radio-pill,
.dark .ghs-radio-pill {
  background: #1e293b;
  border-color: #334155;
}

[data-theme="dark"] .ghs-radio-pill:hover,
.dark .ghs-radio-pill:hover {
  border-color: #00d2ff;
  background: rgba(0, 210, 255, 0.08);
}

[data-theme="dark"] .ghs-radio-pill.selected,
.dark .ghs-radio-pill.selected {
  border-color: #00d2ff;
  background: rgba(0, 210, 255, 0.12);
}

[data-theme="dark"] .ghs-radio-pill.selected .ghs-radio-circle,
.dark .ghs-radio-pill.selected .ghs-radio-circle {
  border-color: #00d2ff;
  background: #00d2ff;
  color: #0f172a;
}

[data-theme="dark"] .ghs-radio-text,
.dark .ghs-radio-text {
  color: #e2e8f0;
}

[data-theme="dark"] .ghs-radio-pill.selected .ghs-radio-text,
.dark .ghs-radio-pill.selected .ghs-radio-text {
  color: #00d2ff;
}

[data-theme="dark"] .ghs-handover-item,
.dark .ghs-handover-item {
  color: #cbd5e1;
}

[data-theme="dark"] .ghs-handover-item:hover,
.dark .ghs-handover-item:hover {
  background: #1e293b;
  color: #38bdf8;
}

[data-theme="dark"] .ghs-handover-item.selected,
.dark .ghs-handover-item.selected {
  background: rgba(0, 210, 255, 0.15);
  color: #00d2ff;
}

[data-theme="dark"] .ghs-panel-title,
.dark .ghs-panel-title {
  color: #f1f5f9;
}

[data-theme="dark"] .ghs-pill-btn,
.dark .ghs-pill-btn {
  background: #1e293b;
  border-color: #334155;
  color: #cbd5e1;
}

[data-theme="dark"] .ghs-pill-btn:hover,
.dark .ghs-pill-btn:hover {
  border-color: #00d2ff;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.08);
}

[data-theme="dark"] .ghs-pill-btn.active,
.dark .ghs-pill-btn.active {
  background: #005953;
  border-color: #005953;
  color: #ffffff;
}

[data-theme="dark"] .ghs-panel-label,
.dark .ghs-panel-label {
  color: #94a3b8;
}

[data-theme="dark"] .ghs-panel-input,
.dark .ghs-panel-input {
  background: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}

[data-theme="dark"] .ghs-panel-footer,
.dark .ghs-panel-footer {
  border-top-color: #334155;
}

[data-theme="dark"] .ghs-panel-reset,
.dark .ghs-panel-reset {
  background: transparent;
  border-color: #00d2ff;
  color: #00d2ff;
}

[data-theme="dark"] .ghs-panel-reset:hover,
.dark .ghs-panel-reset:hover {
  background: rgba(0, 210, 255, 0.1);
}

[data-theme="dark"] .ghs-panel-done,
.dark .ghs-panel-done {
  background: #00d2ff;
  border-color: #00d2ff;
  color: #0f172a;
}

[data-theme="dark"] .ghs-panel-done:hover,
.dark .ghs-panel-done:hover {
  background: #38bdf8;
  border-color: #38bdf8;
}

[data-theme="dark"] .ghs-slider-range-values,
.dark .ghs-slider-range-values {
  color: #94a3b8;
}

[data-theme="dark"] .ghs-slider-curr-val,
.dark .ghs-slider-curr-val {
  background: rgba(0, 210, 255, 0.18);
  color: #00d2ff;
}

[data-theme="dark"] .ghs-payment-slider,
.dark .ghs-payment-slider {
  background: #334155;
  accent-color: #00d2ff;
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

