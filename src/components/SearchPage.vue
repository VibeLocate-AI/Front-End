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

        <!-- ===== REDESIGNED MODERN GLASS SEARCH WIDGET CARD ===== -->
        <div class="green-hero-search">
          <!-- Topographic Neon Contour Lines Overlay -->
          <svg class="ghs-contour-svg" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 620 0 C 680 70, 770 110, 930 130 C 990 138, 1030 180, 1050 360" fill="none" stroke="rgba(56, 189, 248, 0.45)" stroke-width="1.5" />
            <path d="M 580 0 C 640 85, 740 135, 900 165 C 970 180, 1020 230, 1045 360" fill="none" stroke="rgba(168, 85, 247, 0.35)" stroke-width="1.2" stroke-dasharray="6 4" />
            <path d="M 540 0 C 610 95, 710 155, 870 195 C 950 215, 1005 270, 1040 360" fill="none" stroke="rgba(45, 212, 191, 0.35)" stroke-width="1.2" />
            <path d="M 680 360 C 760 300, 860 280, 980 320 C 1020 335, 1050 350, 1080 360" fill="none" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1.2" />
          </svg>

          <!-- ROW 1: Toggles (Purpose + Divider + Status) -->
          <div class="ghs-row ghs-row-top">
            <div class="ghs-top-left-group">
              <!-- Purpose Tabs -->
              <div class="ghs-nav-pills-wrap">
                <button
                  type="button"
                  class="ghs-nav-pill"
                  :class="{ active: filters.purpose === 'all' }"
                  @click="filters.purpose = 'all'; runSearch()"
                >
                  {{ isRtl ? 'الكل' : 'All' }}
                </button>
                <button
                  type="button"
                  class="ghs-nav-pill ghs-nav-pill-highlight"
                  :class="{ active: filters.purpose === 'sale' }"
                  @click="filters.purpose = 'sale'; runSearch()"
                >
                  {{ isRtl ? 'للبيع' : 'For Sale' }}
                </button>
                <button
                  type="button"
                  class="ghs-nav-pill"
                  :class="{ active: filters.purpose === 'rent' }"
                  @click="filters.purpose = 'rent'; runSearch()"
                >
                  {{ isRtl ? 'للإيجار' : 'For Rent' }}
                </button>
              </div>

              <!-- Separator -->
              <div class="ghs-v-sep"></div>

              <!-- Status Tabs -->
              <div class="ghs-nav-pills-wrap">
                <button
                  type="button"
                  class="ghs-nav-pill"
                  :class="{ active: filters.status === 'all' }"
                  @click="filters.status = 'all'; runSearch()"
                >
                  {{ isRtl ? 'الكل' : 'All' }}
                </button>
                <button
                  type="button"
                  class="ghs-nav-pill"
                  :class="{ active: filters.status === 'ready' }"
                  @click="filters.status = 'ready'; runSearch()"
                >
                  {{ isRtl ? 'جاهز للسكن' : 'Ready' }}
                </button>
                <button
                  type="button"
                  class="ghs-nav-pill"
                  :class="{ active: filters.status === 'offplan' }"
                  @click="filters.status = 'offplan'; runSearch()"
                >
                  {{ isRtl ? 'قيد الإنشاء' : 'Off-Plan' }}
                </button>
              </div>
            </div>
          </div>

          <!-- ROW 2: Inputs (Keywords/Prompt & Location) -->
          <div class="ghs-row ghs-inputs-row">
            <!-- 1. Search Query -->
            <div class="ghs-input-wrap ghs-query-wrap">
              <div class="ghs-input-main-field">
                <i class="fa-solid fa-magnifying-glass ghs-input-icon ghs-query-icon"></i>
                <input
                  id="search-query-input"
                  type="text"
                  class="ghs-text-input"
                  v-model="searchQuery"
                  :placeholder="isRtl ? 'ابحث عن عقار أحلامك، كلمات مفتاحية، أو طلب AI...' : 'Search property, keywords or AI prompt...'"
                  @input="onQueryInput"
                  @keydown.enter.prevent="runSearch"
                />
                <button 
                  v-if="searchQuery" 
                  type="button" 
                  class="ghs-clear-input"
                  @click="clearSearch"
                  :title="isRtl ? 'مسح' : 'Clear'"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>

            <!-- 2. Location Input with map graphic -->
            <div class="ghs-input-wrap ghs-location-wrap">
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
                  id="search-location-input"
                  type="text"
                  class="ghs-text-input"
                  v-model="locationQuery"
                  :placeholder="isRtl ? 'أدخل الموقع أو المنطقة أو الحي...' : 'Enter location, area or neighborhood...'"
                  @input="onLocationInput"
                  @keydown.enter.prevent="runSearch"
                />
                <button 
                  v-if="locationQuery" 
                  type="button" 
                  class="ghs-clear-input"
                  @click="locationQuery = ''; filters.location = 'all'; runSearch()"
                  :title="isRtl ? 'مسح' : 'Clear'"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- ROW 3: Capsule Filters + Unified AI Search Button -->
          <div class="ghs-row ghs-filters-row">
            <!-- 1. Property Type Capsule -->
            <div class="ghs-custom-dropdown" ref="searchTypeRef">
              <button 
                type="button" 
                class="ghs-capsule-btn" 
                :class="{ active: propertyTypeOpen || (filters.type && filters.type !== 'all') }" 
                @click="propertyTypeOpen = !propertyTypeOpen; bedsBathsOpen = false; priceOpen = false;"
              >
                <div class="ghs-capsule-left">
                  <i class="fa-solid fa-city ghs-btn-icon"></i>
                  <span class="ghs-capsule-text">{{ propertyTypeLabel }}</span>
                </div>
                <i class="fa-solid ghs-chevron" :class="propertyTypeOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </button>

              <Transition name="dropdown-fade">
                <div v-if="propertyTypeOpen" class="ghs-dropdown-panel ghs-type-popup" @click.stop>
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
                  <div class="ghs-radio-grid">
                    <button 
                      type="button" 
                      v-for="item in currentCategoryTypes" 
                      :key="item.id" 
                      class="ghs-radio-pill"
                      :class="{ selected: filters.type === item.id }"
                      @click="selectPropertyType(item.id)"
                    >
                      <span class="ghs-radio-circle">
                        <i v-if="filters.type === item.id" class="fa-solid fa-check"></i>
                      </span>
                      <span class="ghs-radio-text">{{ isRtl ? item.nameAr : item.nameEn }}</span>
                    </button>
                  </div>
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

            <!-- 2. Beds & Baths Capsule -->
            <div class="ghs-custom-dropdown" ref="searchBedsRef">
              <button 
                type="button" 
                class="ghs-capsule-btn" 
                :class="{ active: bedsBathsOpen || (filters.bedrooms && filters.bedrooms !== 'any') || (filters.bathrooms && filters.bathrooms !== 'any') }" 
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
                      :class="{ active: filters.bedrooms === 'Studio' }"
                      @click="setBedrooms('Studio')"
                    >
                      {{ isRtl ? 'استوديو' : 'Studio' }}
                    </button>
                    <button 
                      type="button" 
                      class="ghs-pill-btn ghs-pill-circle" 
                      v-for="b in ['1', '2', '3', '4']" 
                      :key="'bed-' + b"
                      :class="{ active: filters.bedrooms === b }"
                      @click="setBedrooms(b)"
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
                      :class="{ active: filters.bedrooms === b }"
                      @click="setBedrooms(b)"
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
                      :class="{ active: filters.bathrooms === b }"
                      @click="setBathrooms(b)"
                    >
                      {{ b }}
                    </button>
                  </div>

                  <div class="ghs-panel-divider"></div>

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

            <!-- 3. Price Capsule -->
            <div class="ghs-custom-dropdown" ref="searchPriceRef">
              <button 
                type="button" 
                class="ghs-capsule-btn" 
                :class="{ active: priceOpen || filters.minPrice || filters.maxPrice || (filters.priceRange && filters.priceRange !== 'any') }" 
                @click="priceOpen = !priceOpen; propertyTypeOpen = false; bedsBathsOpen = false;"
              >
                <div class="ghs-capsule-left">
                  <i class="fa-solid fa-coins ghs-btn-icon"></i>
                  <span class="ghs-capsule-text">{{ priceDropdownLabel }}</span>
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
                        v-model="filters.minPrice" 
                        placeholder="0" 
                        @keydown.enter.prevent="applyPrice"
                      />
                    </div>
                    <div class="ghs-price-col">
                      <label class="ghs-price-label">{{ isRtl ? 'الحد الأقصى' : 'Maximum' }}</label>
                      <input 
                        type="number" 
                        class="ghs-price-input" 
                        v-model="filters.maxPrice" 
                        :placeholder="isRtl ? 'أي سعر' : 'Any'" 
                        @keydown.enter.prevent="applyPrice"
                      />
                    </div>
                  </div>

                  <div class="ghs-panel-divider"></div>

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

            <!-- 4. Unified AI Search Button -->
            <button type="button" class="ghs-unified-ai-btn" @click="runSearch" :disabled="isLoading" :title="isRtl ? 'بحث ذكي AI' : 'Smart AI Search'">
              <i v-if="isLoading" class="fa-solid fa-circle-notch fa-spin"></i>
              <i v-else class="fa-solid fa-wand-magic-sparkles"></i>
              <span>{{ isRtl ? 'بحث ذكي AI' : 'AI Search' }}</span>
            </button>
          </div>
        </div>
        <!-- END SEARCH WIDGET CARD -->

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

          <!-- AI Search indicator and query confidence -->
          <div v-if="isAiSearch && !isLoading" class="ai-header-group">
            <div class="ai-search-badge">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>{{ t('aiPoweredResults') }}</span>
            </div>
            <div v-if="aiUnderstanding && (aiUnderstanding.confidence !== undefined)" class="ai-confidence-pill" :title="isRtl ? 'ثقة فهم الاستعلام من قبل الذكاء الاصطناعي' : 'AI Query Understanding Confidence'">
              <i class="fa-solid fa-brain"></i>
              <span>{{ isRtl ? 'ثقة فهم الاستعلام:' : 'Query Confidence:' }} {{ Math.round(Number(aiUnderstanding.confidence) * (Number(aiUnderstanding.confidence) <= 1 ? 100 : 1)) }}%</span>
            </div>
          </div>
        </div>

        <!-- AI Semantic Understanding & Criteria Breakdown Banner -->
        <div v-if="isAiSearch && aiUnderstanding && !isLoading" class="ai-criteria-banner">
          <div class="ai-criteria-header">
            <div class="ai-crit-title-wrap">
              <span class="ai-crit-sparkle"><i class="fa-solid fa-wand-magic-sparkles"></i></span>
              <strong>{{ isRtl ? 'تحليل الذكاء الاصطناعي لطلبك ومطابقة العقارات' : 'AI Request Analysis & Real Estate Match' }}</strong>
            </div>
            <div v-if="displayProperties.length > 0 && displayProperties[0].matchScore" class="ai-top-match-badge">
              <i class="fa-solid fa-bullseye"></i>
              <span>{{ isRtl ? 'أعلى نسبة تطابق:' : 'Highest Match:' }} <strong>{{ displayProperties[0].matchScore }}%</strong></span>
            </div>
          </div>
          <div class="ai-criteria-chips">
            <span v-if="aiUnderstanding.property_type" class="ai-chip type">
              <i class="fa-solid fa-building"></i>
              <b>{{ isRtl ? 'النوع:' : 'Type:' }}</b> {{ aiUnderstanding.property_type }}
            </span>
            <span v-if="aiUnderstanding.action_type" class="ai-chip action">
              <i class="fa-solid fa-tag"></i>
              <b>{{ isRtl ? 'الهدف:' : 'Purpose:' }}</b> {{ aiUnderstanding.action_type === 'rent' ? (isRtl ? 'للإيجار' : 'For Rent') : (isRtl ? 'للبيع' : 'For Sale') }}
            </span>
            <span v-if="aiUnderstanding.location_hint" class="ai-chip location">
              <i class="fa-solid fa-location-dot"></i>
              <b>{{ isRtl ? 'الموقع المستهدف:' : 'Target Area:' }}</b> {{ aiUnderstanding.location_hint }}
            </span>
            <span v-if="aiUnderstanding.min_bedrooms || aiUnderstanding.max_bedrooms" class="ai-chip beds">
              <i class="fa-solid fa-bed"></i>
              <b>{{ isRtl ? 'الغرف:' : 'Beds:' }}</b> {{ aiUnderstanding.min_bedrooms || aiUnderstanding.max_bedrooms }}+
            </span>
            <span v-if="aiUnderstanding.max_budget || aiUnderstanding.min_budget" class="ai-chip budget">
              <i class="fa-solid fa-wallet"></i>
              <b>{{ isRtl ? 'الميزانية:' : 'Budget:' }}</b>
              {{ aiUnderstanding.min_budget ? formatPrice(aiUnderstanding.min_budget) : '' }}
              {{ (aiUnderstanding.min_budget && aiUnderstanding.max_budget) ? ' - ' : '' }}
              {{ aiUnderstanding.max_budget ? formatPrice(aiUnderstanding.max_budget) : '' }}
            </span>
            <span v-for="tag in (aiUnderstanding.vibe_tags || [])" :key="tag" class="ai-chip vibe">
              <i class="fa-solid fa-sparkles"></i> {{ tag }}
            </span>
            <span v-for="amenity in (aiUnderstanding.required_amenities || [])" :key="amenity" class="ai-chip amenity">
              <i class="fa-solid fa-circle-check"></i> {{ amenity }}
            </span>
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
            @click="goToPropertyDetails(prop)"
          >
            <!-- Image -->
            <div class="card-img-wrap">
              <img :src="prop.image" :alt="prop.title" loading="lazy" @error="onImgError" />

              <!-- AI Match Badge: Display calculated AI match score -->
              <div v-if="prop.matchScore" class="badge-ai" :class="{ 'high-match': prop.matchScore >= 90 }">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                <span>{{ isRtl ? 'تطابق' : 'AI Match' }} {{ prop.matchScore }}%</span>
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

              <!-- Matched Nearby Amenity from Backend -->
              <div class="card-matched-poi" v-if="prop.nearbyAmenity">
                <i class="fa-solid fa-location-dot"></i>
                <span>{{ prop.nearbyAmenity }}</span>
              </div>

              <!-- Card Dual Actions: View On Map & Property Details -->
              <div class="card-actions-dual">
                <button
                  type="button"
                  class="btn-card-action btn-card-map"
                  @click.stop="viewOnMap(prop)"
                  :title="t('viewOnMap')"
                >
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>{{ t('viewOnMap') }}</span>
                </button>

                <button
                  type="button"
                  class="btn-card-action btn-card-details"
                  @click.stop="goToPropertyDetails(prop)"
                  :title="t('propertyDetails')"
                >
                  <span>{{ t('propertyDetails') }}</span>
                  <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>
              </div>
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
import { propertyService } from '../services/propertyService'
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
const aiUnderstanding = ref(null)
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
  minPrice: '',
  maxPrice: '',
  bedrooms: 'any',
  bathrooms: 'any',
  location: 'all',
  status: 'all'
})

const locationQuery = ref('')

// ======= Dropdowns & Popups state =======
const searchTypeRef = ref(null)
const searchBedsRef = ref(null)
const searchPriceRef = ref(null)

const propertyTypeOpen = ref(false)
const bedsBathsOpen = ref(false)
const priceOpen = ref(false)

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
  filters.value.type = (filters.value.type === typeId) ? 'all' : typeId
  propertyTypeOpen.value = false
  runSearch()
}

const resetPropertyType = () => {
  filters.value.type = 'all'
  propertyTypeOpen.value = false
  runSearch()
}

const applyPropertyType = () => {
  propertyTypeOpen.value = false
  runSearch()
}

const propertyTypeLabel = computed(() => {
  if (!filters.value.type || filters.value.type === 'all') {
    return isRtl.value ? 'النوع: الكل' : 'Property Type'
  }
  const allT = [...residentialTypes, ...commercialTypes]
  const found = allT.find(x => x.id === filters.value.type)
  if (found) return isRtl.value ? found.nameAr : found.nameEn
  return filters.value.type
})

const setBedrooms = (b) => {
  filters.value.bedrooms = (filters.value.bedrooms === b) ? 'any' : b
}

const setBathrooms = (b) => {
  filters.value.bathrooms = (filters.value.bathrooms === b) ? 'any' : b
}

const resetBedsBaths = () => {
  filters.value.bedrooms = 'any'
  filters.value.bathrooms = 'any'
  bedsBathsOpen.value = false
  runSearch()
}

const applyBedsBaths = () => {
  bedsBathsOpen.value = false
  runSearch()
}

const bedsBathsLabel = computed(() => {
  const hasBed = filters.value.bedrooms && filters.value.bedrooms !== 'any'
  const hasBath = filters.value.bathrooms && filters.value.bathrooms !== 'any'
  
  if (hasBed && hasBath) {
    const bedText = filters.value.bedrooms === 'Studio' 
      ? (isRtl.value ? 'استوديو' : 'Studio')
      : (isRtl.value ? `${filters.value.bedrooms} غرف` : `${filters.value.bedrooms} Beds`)
    const bathText = isRtl.value ? `${filters.value.bathrooms} حمام` : `${filters.value.bathrooms} Baths`
    return `${bedText}, ${bathText}`
  }
  if (hasBed) {
    return filters.value.bedrooms === 'Studio'
      ? (isRtl.value ? 'استوديو' : 'Studio')
      : (isRtl.value ? `${filters.value.bedrooms} غرف` : `${filters.value.bedrooms} Beds`)
  }
  if (hasBath) {
    return isRtl.value ? `${filters.value.bathrooms} حمام` : `${filters.value.bathrooms} Baths`
  }
  return isRtl.value ? 'الغرف والحمامات' : 'Beds & Baths'
})

const resetPrice = () => {
  filters.value.minPrice = ''
  filters.value.maxPrice = ''
  filters.value.priceRange = 'any'
  priceOpen.value = false
  runSearch()
}

const applyPrice = () => {
  priceOpen.value = false
  runSearch()
}

const formatCompact = (val) => {
  const num = Number(val)
  if (!num || isNaN(num)) return val
  if (num >= 1000000) {
    const m = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)
    return isRtl.value ? `${m} مليون` : `${m}M`
  }
  if (num >= 1000) {
    const k = (num / 1000).toFixed(0)
    return isRtl.value ? `${k} ألف` : `${k}K`
  }
  return String(num)
}

const priceDropdownLabel = computed(() => {
  const min = filters.value.minPrice
  const max = filters.value.maxPrice
  if (min && max) {
    return `${formatCompact(min)} - ${formatCompact(max)} ${isRtl.value ? 'درهم' : 'AED'}`
  }
  if (min) {
    return `${isRtl.value ? 'من' : '>'} ${formatCompact(min)} ${isRtl.value ? 'درهم' : 'AED'}`
  }
  if (max) {
    return `${isRtl.value ? 'إلى' : '<'} ${formatCompact(max)} ${isRtl.value ? 'درهم' : 'AED'}`
  }
  if (filters.value.priceRange && filters.value.priceRange !== 'any') {
    return priceLabel.value
  }
  return isRtl.value ? 'السعر (درهم)' : 'Price (AED)'
})

const handleDocumentClick = (e) => {
  if (searchTypeRef.value && !searchTypeRef.value.contains(e.target)) {
    propertyTypeOpen.value = false
  }
  if (searchBedsRef.value && !searchBedsRef.value.contains(e.target)) {
    bedsBathsOpen.value = false
  }
  if (searchPriceRef.value && !searchPriceRef.value.contains(e.target)) {
    priceOpen.value = false
  }
}

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
  Boolean(filters.value.minPrice) ||
  Boolean(filters.value.maxPrice) ||
  filters.value.bedrooms !== 'any' ||
  (filters.value.bathrooms && filters.value.bathrooms !== 'any') ||
  filters.value.location !== 'all' ||
  filters.value.status !== 'all' ||
  Boolean(locationQuery.value.trim()) ||
  Boolean(searchQuery.value.trim())
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

  // When isAiSearch is true, properties are ranked by AI match score:
  if (isAiSearch.value) {
    if (filters.value.status === 'ready') list = list.filter(p => !p.isOffPlan)
    else if (filters.value.status === 'offplan') list = list.filter(p => p.isOffPlan)

    if (sortBy.value === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sortBy.value === 'price-desc') list.sort((a, b) => b.price - a.price)
    else list.sort((a, b) => (b.matchScore || b.aiMatch || 0) - (a.matchScore || a.aiMatch || 0))

    return locProps(list)
  }

  // 1. Live text search filtering across title, location, area, type, description, tags, specs
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
      const translatedQ = propertyService.translateSearchTerm ? propertyService.translateSearchTerm(q).toLowerCase() : ''
      const rawWords = q.split(/\s+/).filter(w => w.length > 1)
      const transWords = translatedQ ? translatedQ.split(/\s+/).filter(w => w.length > 1) : []
      const allWords = [...new Set([...rawWords, ...transWords])]

      list = list.filter(p => {
        const pText = [
          p.title || '',
          p.location || '',
          p.area || '',
          p.type || '',
          p.category || '',
          p.description || '',
          p.summary || '',
          ...(p.tags || []),
          p.beds ? `${p.beds} bed` : '',
          p.isForRent ? 'rent للايجار ايجار' : 'sale buy للبيع شراء'
        ].join(' ').toLowerCase()

        return pText.includes(q) || (translatedQ && pText.includes(translatedQ)) || allWords.some(w => pText.includes(w))
      })
    }

  // 2. Purpose filter
  if (filters.value.purpose === 'sale') list = list.filter(p => !p.isForRent)
  else if (filters.value.purpose === 'rent') list = list.filter(p => p.isForRent)

  // 3. Type filter
  if (filters.value.type !== 'all') {
    const t = filters.value.type.toLowerCase()
    list = list.filter(p => (p.type || '').toLowerCase().includes(t) || (p.category || '').toLowerCase().includes(t))
  }

  // 4. Location filter — driven by locationQuery text or filters.location dropdown
  const locVal = locationQuery.value.trim() || (filters.value.location !== 'all' ? filters.value.location : '')
  if (locVal) {
    const loc = locVal.toLowerCase()
    const transLoc = propertyService.translateSearchTerm ? propertyService.translateSearchTerm(loc).toLowerCase() : ''
    list = list.filter(p => {
      const pLoc = `${p.location || ''} ${p.area || ''}`.toLowerCase()
      return pLoc.includes(loc) || (transLoc && pLoc.includes(transLoc))
    })
  }

  // 5. Status filter (All / Ready / Off-Plan)
  if (filters.value.status === 'ready') list = list.filter(p => !p.isOffPlan)
  else if (filters.value.status === 'offplan') list = list.filter(p => p.isOffPlan)

  // 6. Bedrooms filter
  if (filters.value.bedrooms && filters.value.bedrooms !== 'any') {
    const beds = filters.value.bedrooms
    if (beds === 'Studio') {
      list = list.filter(p => Number(p.beds) === 0 || String(p.beds).toLowerCase().includes('studio') || (p.title || '').toLowerCase().includes('studio'))
    } else if (beds === '8+') {
      list = list.filter(p => Number(p.beds) >= 8)
    } else if (beds === '5+') {
      list = list.filter(p => Number(p.beds) >= 5)
    } else {
      list = list.filter(p => Number(p.beds) === Number(beds))
    }
  }

  // 6b. Bathrooms filter
  if (filters.value.bathrooms && filters.value.bathrooms !== 'any') {
    const baths = filters.value.bathrooms
    if (baths === '6+') {
      list = list.filter(p => Number(p.baths) >= 6)
    } else {
      list = list.filter(p => Number(p.baths) === Number(baths))
    }
  }

  // 7. Price filter (minPrice, maxPrice, priceRange)
  if (filters.value.minPrice && Number(filters.value.minPrice) > 0) {
    list = list.filter(p => Number(p.price) >= Number(filters.value.minPrice))
  }
  if (filters.value.maxPrice && Number(filters.value.maxPrice) > 0) {
    list = list.filter(p => Number(p.price) <= Number(filters.value.maxPrice))
  }
  if (filters.value.priceRange && filters.value.priceRange !== 'any') {
    list = list.filter(p => {
      const price = Number(p.price) || 0
      if (filters.value.priceRange === 'under-2m') return price < 2000000
      if (filters.value.priceRange === '2m-5m') return price >= 2000000 && price < 5000000
      if (filters.value.priceRange === '5m-10m') return price >= 5000000 && price < 10000000
      if (filters.value.priceRange === '10m-plus') return price >= 10000000
      return true
    })
  }

  // 8. Sorting
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
  page.value = 1

  try {
    const query = searchQuery.value.trim()
    const loc = locationQuery.value.trim() || (filters.value.location !== 'all' ? filters.value.location : '')

    // Prepare API search query parameters
    const apiParams = {
      per_page: 50,
      page: 1
    }

    if (query) {
      apiParams.search = query
    } else if (loc) {
      apiParams.search = loc
    }

    if (filters.value.purpose === 'rent') {
      apiParams.action_type = 'rent'
    } else if (filters.value.purpose === 'sale') {
      apiParams.action_type = 'buy'
    }

    if (filters.value.type && filters.value.type !== 'all') {
      apiParams.type = filters.value.type
    }

    if (filters.value.bedrooms && filters.value.bedrooms !== 'any') {
      apiParams.bedrooms = filters.value.bedrooms.replace('+', '')
    }

    if (query) {
      const lang = isRtl.value ? 'ar' : 'en'
      const purposeOpt = filters.value.purpose !== 'all' ? filters.value.purpose : (route.query.purpose || undefined)
      const result = await propertyService.searchWithAi(query, lang, { purpose: purposeOpt })
      if (result.success && result.data && result.data.length > 0) {
        isAiSearch.value = true
        aiUnderstanding.value = result.ai_understanding || null
        allResults.value = result.data
        sortBy.value = 'ai-match'
      } else {
        // AI returned empty (e.g. it parsed a single price as min_budget = max_budget,
        // which demands an exact price). Reuse what the AI understood with a relaxed
        // budget range before falling back to a plain catalog search.
        isAiSearch.value = false
        const understanding = result.success ? (result.ai_understanding || null) : null
        aiUnderstanding.value = understanding
        let fallback = understanding ? await fetchRelaxedAiMatches(understanding) : []
        if (fallback.length > 0) {
          isAiSearch.value = true
          sortBy.value = 'ai-match'
          showToast(isRtl.value
            ? `لا يوجد تطابق تام، نعرض ${fallback.length} عقار قريب من طلبك`
            : `No exact match — showing ${fallback.length} close matches`)
        } else {
          aiUnderstanding.value = null
          const res = await propertyService.getProperties(apiParams)
          fallback = res.data || []
        }
        allResults.value = fallback
      }
    } else {
      isAiSearch.value = false
      aiUnderstanding.value = null
      const res = await propertyService.getProperties(apiParams)
      allResults.value = res.data || []
    }

    canLoadMore.value = allResults.value.length >= 50
  } catch (err) {
    console.warn('Search error:', err)
    allResults.value = []
    canLoadMore.value = false
  } finally {
    isLoading.value = false
  }
}

// Relaxed search based on the AI's parsed intent (type + budget ±20%)
const fetchRelaxedAiMatches = async (u) => {
  const minB = Number(u.min_budget) || 0
  const maxB = Number(u.max_budget) || 0
  const hasBudget = minB > 0 || maxB > 0
  if (!u.type_id && !u.property_type && !hasBudget) return []

  const params = { per_page: 100, page: 1 }
  if (u.type_id) params.type_id = u.type_id
  else if (u.property_type) params.type = u.property_type
  if (u.action_type) params.action_type = u.action_type === 'rent' ? 'rent' : 'buy'
  if (u.min_bedrooms) params.bedrooms = u.min_bedrooms

  const res = await propertyService.getProperties(params)
  let list = res.data || []

  // Keep type filter on the client too, in case the backend ignores type_id
  const wantedType = String(u.property_type || '').toLowerCase()
  if (wantedType) {
    const typed = list.filter(p => String(p.type || '').toLowerCase() === wantedType)
    if (typed.length) list = typed
  }

  if (hasBudget) {
    // A single price (min === max) becomes a ±20% window around it
    const low = minB > 0 ? minB * 0.8 : 0
    const high = maxB > 0 ? maxB * 1.2 : Infinity
    const target = minB && maxB ? (minB + maxB) / 2 : (maxB || minB)
    list = list
      .filter(p => {
        const price = Number(p.price) || 0
        return price >= low && price <= high
      })
      .sort((a, b) => Math.abs((Number(a.price) || 0) - target) - Math.abs((Number(b.price) || 0) - target))
  }

  // Calculate real AI Match Score for relaxed matches
  list = list.map(p => {
    const s = propertyService.calculateAiMatchScore(p, u)
    return { ...p, matchScore: s, aiMatch: s, aiCriteria: u }
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))

  return list
}

const loadMore = async () => {
  if (isLoadingMore.value) return
  isLoadingMore.value = true
  page.value++
  try {
    const query = searchQuery.value.trim()
    const loc = locationQuery.value.trim() || (filters.value.location !== 'all' ? filters.value.location : '')
    const apiParams = { per_page: perPage, page: page.value }
    if (query) apiParams.search = query
    else if (loc) apiParams.search = loc
    if (filters.value.purpose === 'rent') apiParams.action_type = 'rent'
    else if (filters.value.purpose === 'sale') apiParams.action_type = 'buy'
    if (filters.value.type && filters.value.type !== 'all') apiParams.type = filters.value.type

    const res = await propertyService.getProperties(apiParams)
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
  runSearch()
}

const clearAllFilters = () => {
  filters.value = {
    purpose: 'all',
    type: 'all',
    priceRange: 'any',
    minPrice: '',
    maxPrice: '',
    bedrooms: 'any',
    bathrooms: 'any',
    location: 'all',
    status: 'all'
  }
  locationQuery.value = ''
  searchQuery.value = ''
  sortBy.value = 'recommended'
  runSearch()
}

let debounceTimer = null
const onQueryInput = () => {
  // auto-search after 450ms of no typing
  if (debounceTimer) clearTimeout(debounceTimer)
  if (searchQuery.value.trim().length >= 2) {
    debounceTimer = setTimeout(() => runSearch(), 450)
  }
}

const onLocationInput = () => {
  // auto-search after 600ms of no typing
  if (debounceTimer) clearTimeout(debounceTimer)
  if (locationQuery.value.trim().length >= 2) {
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

const NEIGHBORHOOD_COORDS = {
  'downtown dubai': [25.1972, 55.2744],
  'downtown': [25.1972, 55.2744],
  'palm jumeirah': [25.1124, 55.1390],
  'dubai marina': [25.0805, 55.1403],
  'business bay': [25.1850, 55.2644],
  'dubai hills': [25.1235, 55.2481],
  'arabian ranches': [25.0560, 55.2620],
  'difc': [25.2120, 55.2815],
  'dubai creek': [25.1950, 55.3480],
  'bluewaters': [25.0795, 55.1220],
  'jumeirah village circle': [25.0600, 55.2050],
  'jvc': [25.0600, 55.2050],
  'jumeirah beach residence': [25.0800, 55.1340],
  'jbr': [25.0800, 55.1340],
}

const getPropertyCoordinates = (prop) => {
  const lat = Number(prop?.latitude ?? prop?.lat)
  const lng = Number(prop?.longitude ?? prop?.lng)
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat && lng) {
    return [lat, lng]
  }
  const locLower = `${prop?.location || ''} ${prop?.area || ''} ${prop?.title || ''}`.toLowerCase()
  for (const [key, coords] of Object.entries(NEIGHBORHOOD_COORDS)) {
    if (locLower.includes(key)) {
      return coords
    }
  }
  return [25.1972, 55.2744]
}

const viewOnMap = (prop) => {
  if (!prop) return
  const [lat, lng] = getPropertyCoordinates(prop)
  router.push({
    path: '/map',
    query: {
      id: prop.id,
      lat: Number(lat).toFixed(6),
      lng: Number(lng).toFixed(6),
      title: prop.title || ''
    }
  })
}

const goToPropertyDetails = (prop) => {
  if (!prop) return
  try {
    sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(prop))
  } catch (err) {
    console.warn('Could not cache property:', err)
  }
  router.push(`/property/${prop.id || encodeURIComponent(prop.title || 'details')}`)
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

// Watch URL query parameter changes
watch(
  () => route.query,
  (newQuery) => {
    const q = newQuery.q || newQuery.query || ''
    const type = newQuery.type || ''
    const purpose = newQuery.purpose || ''
    const location = newQuery.location || ''
    const beds = newQuery.bedrooms || newQuery.beds || ''
    const baths = newQuery.bathrooms || newQuery.baths || ''
    const minP = newQuery.min_price || newQuery.minPrice || ''
    const maxP = newQuery.max_price || newQuery.maxPrice || ''

    if (q !== undefined) searchQuery.value = q
    if (type) filters.value.type = type
    if (purpose) filters.value.purpose = purpose
    if (beds) filters.value.bedrooms = beds.split(',')[0]
    if (baths) filters.value.bathrooms = baths.split(',')[0]
    if (minP) filters.value.minPrice = minP
    if (maxP) filters.value.maxPrice = maxP
    if (location) {
      locationQuery.value = location
      filters.value.location = location
    }

    runSearch()
  },
  { deep: true }
)

// ======= Lifecycle =======
onMounted(async () => {
  // Read query from URL if provided
  const q = route.query.q || route.query.query || ''
  const type = route.query.type || ''
  const purpose = route.query.purpose || ''
  const location = route.query.location || ''
  const status = route.query.status || ''
  const beds = route.query.bedrooms || route.query.beds || ''
  const baths = route.query.bathrooms || route.query.baths || ''
  const minP = route.query.min_price || route.query.minPrice || ''
  const maxP = route.query.max_price || route.query.maxPrice || ''

  if (q) searchQuery.value = q
  if (type) filters.value.type = type
  if (purpose) filters.value.purpose = purpose
  if (status) filters.value.status = status
  if (beds) filters.value.bedrooms = beds.split(',')[0]
  if (baths) filters.value.bathrooms = baths.split(',')[0]
  if (minP) filters.value.minPrice = minP
  if (maxP) filters.value.maxPrice = maxP
  if (location) {
    locationQuery.value = location
    filters.value.location = location
  }

  document.addEventListener('click', handleDocumentClick)
  await runSearch()
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (toastTimer) clearTimeout(toastTimer)
  document.removeEventListener('click', handleDocumentClick)
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

[data-theme="light"] .search-page-root {
  background: #f8fafc;
  color: #0f172a;
}

/* ========== HERO ========== */
.search-hero-section {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible !important;
  z-index: 100;
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
  z-index: 51;
  width: 100%;
  max-width: 960px;
  text-align: center;
  overflow: visible !important;
  margin-inline: auto;
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

/* ==================== REDESIGNED COMPACT HERO SEARCH WIDGET ==================== */
.green-hero-search {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(240, 249, 255, 0.58) 50%, rgba(224, 242, 254, 0.5) 100%);
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
  margin: 18px auto 28px;
  width: 100%;
  overflow: visible;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: initial;
}

[data-theme="dark"] .green-hero-search,
.dark .green-hero-search {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.8) 100%);
  border-color: rgba(56, 189, 248, 0.25);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15);
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
  font-family: inherit;
}

[data-theme="dark"] .ghs-nav-pill,
.dark .ghs-nav-pill {
  color: #cbd5e1;
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

[data-theme="dark"] .ghs-nav-pill.active,
.dark .ghs-nav-pill.active {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

.ghs-nav-pill-highlight.active {
  background: rgba(167, 243, 208, 0.35);
  border: 1.5px solid rgba(45, 212, 191, 0.6);
  color: #065f46;
  box-shadow: 0 0 14px rgba(45, 212, 191, 0.4);
}

[data-theme="dark"] .ghs-nav-pill-highlight.active,
.dark .ghs-nav-pill-highlight.active {
  background: rgba(45, 212, 191, 0.2);
  color: #2dd4bf;
}

.ghs-v-sep {
  width: 1.5px;
  height: 20px;
  background: rgba(148, 163, 184, 0.4);
  margin: 0 6px;
  flex-shrink: 0;
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

[data-theme="dark"] .ghs-query-wrap,
.dark .ghs-query-wrap {
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(255, 255, 255, 0.12);
}

[data-theme="dark"] .ghs-query-wrap:focus-within,
.dark .ghs-query-wrap:focus-within {
  background: rgba(15, 23, 42, 0.85);
  border-color: #38bdf8;
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

[data-theme="dark"] .ghs-loc-icon,
.dark .ghs-loc-icon {
  color: #2dd4bf;
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
  font-family: inherit;
}

[data-theme="dark"] .ghs-text-input,
.dark .ghs-text-input {
  color: #f8fafc;
}

.ghs-text-input::placeholder {
  color: #64748b;
  font-size: 13.5px;
}

[data-theme="dark"] .ghs-text-input::placeholder,
.dark .ghs-text-input::placeholder {
  color: #94a3b8;
}

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

[data-theme="dark"] .ghs-cost-pins-badge,
.dark .ghs-cost-pins-badge {
  background: rgba(30, 41, 59, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
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

[data-theme="dark"] .ghs-cost-pin-pill,
.dark .ghs-cost-pin-pill {
  color: #e2e8f0;
}

.ghs-cost-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #0284c7;
}

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

[data-theme="dark"] .ghs-location-wrap,
.dark .ghs-location-wrap {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 41, 59, 0.75) 100%);
  border-color: rgba(255, 255, 255, 0.12);
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
  font-family: inherit;
}

[data-theme="dark"] .ghs-capsule-btn,
.dark .ghs-capsule-btn {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

.ghs-capsule-btn:hover {
  background: rgba(255, 255, 255, 0.98);
  border-color: #38bdf8;
  box-shadow: 0 4px 14px rgba(56, 189, 248, 0.12);
}

[data-theme="dark"] .ghs-capsule-btn:hover,
.dark .ghs-capsule-btn:hover {
  background: rgba(30, 41, 59, 0.95);
}

.ghs-capsule-btn.active {
  border-color: #0284c7;
  background: #f0f9ff;
  color: #0284c7;
  box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.15);
}

[data-theme="dark"] .ghs-capsule-btn.active,
.dark .ghs-capsule-btn.active {
  background: rgba(14, 165, 233, 0.18);
  color: #38bdf8;
  border-color: #38bdf8;
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

[data-theme="dark"] .ghs-capsule-left .ghs-btn-icon,
.dark .ghs-capsule-left .ghs-btn-icon {
  color: #94a3b8;
}

.ghs-capsule-btn.active .ghs-capsule-left .ghs-btn-icon {
  color: #0284c7;
}

[data-theme="dark"] .ghs-capsule-btn.active .ghs-capsule-left .ghs-btn-icon,
.dark .ghs-capsule-btn.active .ghs-capsule-left .ghs-btn-icon {
  color: #38bdf8;
}

.ghs-capsule-text {
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ghs-chevron {
  font-size: 11px;
  color: #94a3b8;
  transition: transform 0.2s;
  flex-shrink: 0;
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
  font-family: inherit;
}

.ghs-unified-ai-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  box-shadow: 0 8px 26px rgba(2, 132, 199, 0.55), 0 0 20px rgba(56, 189, 248, 0.45);
}

.ghs-unified-ai-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

[data-theme="dark"] .ghs-dropdown-panel,
.dark .ghs-dropdown-panel {
  background: #0f172a;
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6);
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

[data-theme="dark"] .ghs-cat-tabs,
.dark .ghs-cat-tabs {
  border-color: rgba(255, 255, 255, 0.1);
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
  border-bottom: 2.5px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

[data-theme="dark"] .ghs-cat-tab,
.dark .ghs-cat-tab {
  color: #94a3b8;
}

.ghs-cat-tab.active {
  color: #0284c7;
  border-bottom-color: #0284c7;
}

[data-theme="dark"] .ghs-cat-tab.active,
.dark .ghs-cat-tab.active {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
}

.ghs-radio-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
  max-height: 220px;
  overflow-y: auto;
}

.ghs-radio-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.18s;
  text-align: initial;
  font-family: inherit;
}

[data-theme="dark"] .ghs-radio-pill,
.dark .ghs-radio-pill {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(255, 255, 255, 0.08);
}

.ghs-radio-pill:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.ghs-radio-pill.selected {
  background: #e0f2fe;
  border-color: #0284c7;
}

[data-theme="dark"] .ghs-radio-pill.selected,
.dark .ghs-radio-pill.selected {
  background: rgba(14, 165, 233, 0.2);
  border-color: #38bdf8;
}

.ghs-radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1.5px solid #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ghs-radio-pill.selected .ghs-radio-circle {
  border-color: #0284c7;
  background: #0284c7;
  color: #ffffff;
  font-size: 9px;
}

.ghs-radio-text {
  font-size: 12.5px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme="dark"] .ghs-radio-text,
.dark .ghs-radio-text {
  color: #e2e8f0;
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

/* Dropdown Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 860px) {
  .ghs-inputs-row {
    flex-direction: column;
  }
  .ghs-filters-row {
    flex-wrap: wrap;
  }
  .ghs-custom-dropdown {
    min-width: calc(50% - 6px);
  }
  .ghs-unified-ai-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .green-hero-search {
    padding: 12px;
  }
  .ghs-top-left-group {
    flex-wrap: wrap;
  }
  .ghs-custom-dropdown {
    min-width: 100%;
  }
}

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
  z-index: 30;
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
  justify-content: center;
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
  gap: 16px;
  flex-wrap: wrap;
}

.strip-filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.strip-filter-field label {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.strip-select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.strip-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f0f6ff;
  font-size: 14px;
  padding: 10px 36px 10px 16px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}

[dir="rtl"] .strip-select {
  padding: 10px 16px 10px 36px;
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
  inset-inline-end: 14px;
  font-size: 12px;
  color: #64748b;
  pointer-events: none;
}

.view-mode-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  align-self: flex-end;
}

[data-theme="light"] .view-mode-toggle { background: #f8fafc; border-color: #e2e8f0; }

.view-btn {
  background: none;
  border: none;
  color: #64748b;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 16px;
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

.ai-header-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
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

[data-theme="light"] .ai-search-badge {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.1), rgba(124, 58, 237, 0.08));
  border-color: rgba(2, 132, 199, 0.3);
  color: #0284c7;
}

.ai-confidence-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 100px;
  color: #10b981;
  font-size: 12px;
  font-weight: 600;
}

[data-theme="light"] .ai-confidence-pill {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.35);
  color: #059669;
}

/* AI Criteria Banner */
.ai-criteria-banner {
  margin: 0 0 24px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(124, 58, 237, 0.06) 100%);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

[data-theme="light"] .ai-criteria-banner {
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(124, 58, 237, 0.04) 100%);
  border-color: rgba(2, 132, 199, 0.25);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ai-criteria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.ai-crit-title-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #f0f6ff;
}

[data-theme="light"] .ai-crit-title-wrap {
  color: #0f172a;
}

.ai-crit-sparkle {
  color: #00d2ff;
  font-size: 14px;
}

.ai-top-match-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.25));
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 100px;
  color: #10b981;
  font-size: 12px;
  font-weight: 600;
}

.ai-top-match-badge strong {
  font-weight: 800;
  color: #34d399;
}

.ai-criteria-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ai-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 12px;
  color: #cbd5e1;
  transition: all 0.2s;
}

[data-theme="light"] .ai-chip {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #334155;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.ai-chip b {
  color: #94a3b8;
  font-weight: 600;
}

[data-theme="light"] .ai-chip b {
  color: #64748b;
}

.ai-chip.type {
  border-color: rgba(56, 189, 248, 0.4);
  color: #38bdf8;
}

.ai-chip.action {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

.ai-chip.location {
  border-color: rgba(168, 85, 247, 0.4);
  color: #c084fc;
}

.ai-chip.budget {
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.ai-chip.beds {
  border-color: rgba(236, 72, 153, 0.4);
  color: #f472b6;
}

.ai-chip.vibe, .ai-chip.amenity {
  background: rgba(0, 210, 255, 0.08);
  border-color: rgba(0, 210, 255, 0.25);
  color: #00d2ff;
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
  background: rgba(5, 19, 34, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 210, 255, 0.5);
  border-radius: 100px;
  padding: 4px 11px;
  font-size: 11px;
  font-weight: 700;
  color: #00d2ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  transition: all 0.25s;
}

.badge-ai.high-match {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.9) 0%, rgba(13, 148, 136, 0.9) 100%);
  border-color: rgba(52, 211, 153, 0.7);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.45);
}

.badge-ai.high-match i {
  color: #fef08a;
  filter: drop-shadow(0 0 4px rgba(254, 240, 138, 0.8));
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

.card-matched-poi {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-top: 8px;
  padding: 5px 12px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: #34d399;
  letter-spacing: 0.2px;
}

.card-matched-poi i {
  color: #10b981;
  font-size: 12px;
}

[data-theme="light"] .card-matched-poi {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.25);
  color: #059669;
}

[data-theme="light"] .card-matched-poi i {
  color: #059669;
}

/* ========== CARD DUAL ACTIONS ========== */
.card-actions-dual {
  margin-top: auto;
  padding-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 8px;
  align-items: center;
}

.search-prop-card.list-card .card-actions-dual {
  width: fit-content;
  min-width: 270px;
  grid-template-columns: auto auto;
}

.btn-card-action {
  height: 38px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  padding: 0 10px;
  text-decoration: none;
  box-sizing: border-box;
}

/* Map Button */
.btn-card-map {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.32);
  color: #38bdf8;
}

.btn-card-map:hover {
  background: rgba(14, 165, 233, 0.2);
  border-color: #38bdf8;
  color: #ffffff;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.25);
}

.btn-card-map i {
  font-size: 13px;
  color: #00d2ff;
  transition: transform 0.2s ease;
}

.btn-card-map:hover i {
  transform: scale(1.15);
}

[data-theme="light"] .btn-card-map {
  background: #f0f9ff;
  border-color: #bae6fd;
  color: #0284c7;
}

[data-theme="light"] .btn-card-map:hover {
  background: #e0f2fe;
  border-color: #38bdf8;
  color: #0369a1;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15);
}

[data-theme="light"] .btn-card-map i {
  color: #0284c7;
}

/* Details Button */
.btn-card-details {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.16) 0%, rgba(124, 58, 237, 0.2) 100%);
  border: 1px solid rgba(0, 210, 255, 0.38);
  color: #ffffff;
}

.btn-card-details:hover {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.28) 0%, rgba(124, 58, 237, 0.32) 100%);
  border-color: #00d2ff;
  color: #ffffff;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 14px rgba(0, 210, 255, 0.25);
}

.btn-card-details i {
  font-size: 11px;
  color: #00d2ff;
  transition: transform 0.2s ease;
}

[dir="rtl"] .btn-card-details:hover i {
  transform: translateX(-3px);
}

[dir="ltr"] .btn-card-details:hover i {
  transform: translateX(3px);
}

[data-theme="light"] .btn-card-details {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  border-color: transparent;
  color: #ffffff;
}

[data-theme="light"] .btn-card-details:hover {
  background: linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%);
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
}

[data-theme="light"] .btn-card-details i {
  color: #ffffff;
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
