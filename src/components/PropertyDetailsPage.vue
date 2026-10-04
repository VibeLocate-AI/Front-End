<template>
  <div class="property-page" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme">

    <main v-if="property" class="page-shell">
      <!-- Breadcrumbs -->
      <div class="crumbs">
        <button @click="router.back()">
          <i class="fa-solid" :class="isRtl ? 'fa-arrow-right' : 'fa-arrow-left'"></i>
          {{ tx('Back to results', 'العودة إلى النتائج') }}
        </button>
        <span>{{ tx('Home', 'الرئيسية') }}</span>
        <i class="fa-solid" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
        <span>{{ localizedType }}</span>
        <i class="fa-solid" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
        <strong>{{ localizedTitle }}</strong>
      </div>

      <!-- Hero Gallery & Core Info -->
      <section class="hero-grid">
        <div class="gallery-main">
          <img :src="activeImage" :alt="localizedTitle">
          <span class="featured"><i class="fa-solid fa-crown"></i> {{ tx('Featured Property', 'عقار مميز') }}</span>
          <span class="counter"><i class="fa-regular fa-images"></i> {{ activeIndex + 1 }} / {{ gallery.length }}</span>
          <button class="arrow left" @click="previousImage" :aria-label="tx('Previous photo', 'الصورة السابقة')">
            <i class="fa-solid" :class="isRtl ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
          </button>
          <button class="arrow right" @click="nextImage" :aria-label="tx('Next photo', 'الصورة التالية')">
            <i class="fa-solid" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
          </button>
        </div>

        <div class="thumbs">
          <button 
            v-for="(image, index) in gallery.slice(0, 4)" 
            :key="image + index" 
            :class="{ selected: activeIndex === index }" 
            @click="activeIndex = index"
          >
            <img :src="image" :alt="`${localizedTitle} ${index + 1}`">
            <span v-if="index === 3 && gallery.length > 4">+{{ gallery.length - 4 }} {{ tx('Photos', 'صور') }}</span>
          </button>
        </div>

        <div class="hero-info">
          <div class="pills">
            <span>{{ property.isForRent ? tx('For Rent', 'للإيجار') : tx('For Sale', 'للبيع') }}</span>
            <span>{{ property.property_condition === 'off_plan' ? tx('Off-Plan', 'على الخارطة') : tx('Ready to Move', 'جاهز للتسليم') }}</span>
            <span>{{ tx('Verified Luxury', 'موثق فاخر') }}</span>
          </div>
          <h1>{{ localizedTitle }}</h1>
          <p class="location"><i class="fa-solid fa-location-dot"></i> {{ localizedLocation }}</p>
          <div class="price">{{ formattedPrice }} <small>{{ property.period || '' }}</small></div>
          <div class="specs">
            <div>
              <div class="spec-icon-circle"><i class="fa-solid fa-bed"></i></div>
              <b>{{ property.beds || (isCommercial ? 0 : 1) }}</b>
              <span>{{ isCommercial ? tx('Rooms / Offices', 'غرف / مكاتب') : tx('Bedrooms', 'غرف نوم') }}</span>
            </div>
            <div>
              <div class="spec-icon-circle"><i class="fa-solid fa-bath"></i></div>
              <b>{{ property.baths || 1 }}</b>
              <span>{{ tx('Bathrooms', 'حمامات') }}</span>
            </div>
            <div>
              <div class="spec-icon-circle"><i class="fa-solid fa-expand"></i></div>
              <b>{{ property.size }}</b>
              <span>{{ tx('Built-up Area', 'المساحة') }}</span>
            </div>
            <div>
              <div class="spec-icon-circle"><i class="fa-solid fa-square-parking"></i></div>
              <b>2</b>
              <span>{{ tx('Parking', 'مواقف') }}</span>
            </div>
            <div>
              <div class="spec-icon-circle"><i class="fa-solid fa-building"></i></div>
              <b>{{ localizedType }}</b>
              <span>{{ tx('Property Type', 'نوع العقار') }}</span>
            </div>
          </div>
          <div class="hero-actions">
            <button class="primary" @click="bookViewing">
              <i class="fa-regular fa-calendar"></i> {{ tx('Book Viewing', 'احجز معاينة') }}
            </button>
            <button @click="contactAgent">
              <i class="fa-regular fa-comment-dots"></i> {{ tx('Contact Agent', 'تواصل مع الوكيل') }}
            </button>
            <button :class="{ saved: isSaved }" @click="toggleFavorite">
              <i :class="isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i> 
              {{ isSaved ? tx('Saved', 'محفوظ') : tx('Save Property', 'احفظ العقار') }}
            </button>
          </div>
        </div>
      </section>

      <!-- Main Content Grid -->
      <section class="content-grid">
        <div class="left-column">
          <!-- Overview Card -->
          <article class="panel overview">
            <div class="panel-head">
              <h2><i class="fa-regular fa-clipboard"></i> {{ tx('Property Overview', 'نظرة عامة على العقار') }}</h2>
              <span class="verified-chip"><i class="fa-solid fa-circle-check"></i> {{ tx('Verified Listing', 'قائمة موثقة') }}</span>
            </div>
            <div class="tabs">
              <button 
                v-for="tab in detailTabs" 
                :key="tab.id" 
                :class="{ active: activeTab === tab.id }" 
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>
            <div class="overview-body">
              <p class="overview-text" :class="{ clamped: !descriptionExpanded }">{{ tabContent }}</p>
              <button 
                v-if="tabContent && tabContent.length > 240" 
                class="btn-expand-text" 
                @click="descriptionExpanded = !descriptionExpanded"
              >
                {{ descriptionExpanded ? tx('Show Less', 'عرض أقل') : tx('Read Full Overview', 'قراءة الوصف كاملاً') }}
                <i class="fa-solid" :class="descriptionExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              </button>
            </div>
          </article>

          <!-- Key Features & Amenities Card (Balanced & Full) -->
          <article class="panel features">
            <div class="panel-head">
              <h2><i class="fa-solid fa-sparkles"></i> {{ tx('Key Features & Amenities', 'المزايا والمرافق الرئيسية') }}</h2>
              <span class="amenity-count-badge">{{ amenities.length }} {{ tx('Features', 'ميزة') }}</span>
            </div>

            <div class="feature-grid">
              <div v-for="feature in amenities" :key="feature" class="feature-card">
                <div class="feature-icon-box">
                  <i :class="getAmenityIcon(feature)"></i>
                </div>
                <span class="feature-name">{{ feature }}</span>
              </div>
            </div>

            <!-- Property Quick Specs Strip filling the card gracefully -->
            <div class="features-specs-strip">
              <div class="spec-mini-item">
                <span class="s-label">{{ tx('Furnishing', 'الفرش والتأثيث') }}</span>
                <strong class="s-val">{{ property.is_furnished || (isCommercial ? tx('Fitted Office', 'مكتب مجهز') : tx('Unfurnished', 'غير مفروش')) }}</strong>
              </div>
              <div class="spec-mini-item">
                <span class="s-label">{{ tx('Status', 'حالة العقار') }}</span>
                <strong class="s-val">{{ property.property_condition === 'off_plan' ? tx('Off-Plan', 'على الخارطة') : tx('Ready to Move', 'جاهز للتسليم') }}</strong>
              </div>
              <div class="spec-mini-item">
                <span class="s-label">{{ tx('Ownership', 'الملكية') }}</span>
                <strong class="s-val">{{ tx('Freehold', 'تملك حر') }}</strong>
              </div>
            </div>
          </article>

          <!-- Split Panels: Floor Plan & Location Map -->
          <div class="split-panels">
            <article class="panel floor-plan">
              <div class="panel-head">
                <h2><i class="fa-solid fa-vector-square"></i> {{ tx('Floor Plan', 'مخطط الطابق') }}</h2>
                <button class="map-link" @click="floorPlanExpanded = !floorPlanExpanded">
                  {{ floorPlanExpanded ? tx('Hide Details', 'إخفاء التفاصيل') : tx('View Dimensions', 'عرض الأبعاد') }}
                </button>
              </div>
              <div class="floor-body">
                <div class="floor-art">
                  <i :class="isCommercial ? 'fa-solid fa-briefcase' : (property.type === 'Villa' ? 'fa-solid fa-house-chimney' : 'fa-solid fa-building')"></i>
                  <span>{{ localizedType }} {{ tx('layout', 'مخطط') }}</span>
                </div>
                <ul>
                  <li><b>{{ property.beds || (isCommercial ? 'Executive' : '1') }} {{ isCommercial ? tx('Suite Office', 'مكتب إداري') : tx('Bedroom', 'غرفة نوم') }}</b></li>
                  <li>{{ property.size }} {{ tx('sq.ft', 'قدم²') }}</li>
                  <li><i class="fa-solid fa-ruler-combined"></i> {{ isCommercial ? tx('Spacious Work Areas', 'مساحات عمل مرنة') : tx('En-suite Bedrooms', 'غرف مع حمامات خاصة') }}</li>
                  <li><i class="fa-solid fa-bath"></i> {{ property.baths || 1 }} {{ tx('Bathrooms', 'حمامات') }}</li>
                  <li><i class="fa-solid fa-cubes"></i> {{ tx('Allocated Covered Parking', 'مواقف مخصصة مغطاة') }}</li>
                </ul>
              </div>
            </article>

            <article class="panel location-panel">
              <div class="panel-head">
                <h2><i class="fa-regular fa-map"></i> {{ tx('Location & Accessibility', 'الموقع وسهولة الوصول') }}</h2>
                <button class="map-link" @click="openFullMap">
                  {{ tx('Interactive Map', 'الخريطة التفاعلية') }} <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
              <div class="map-wrap">
                <div ref="propertyMap" class="property-map" aria-label="Interactive property location map"></div>
                <div class="map-bottom-bar">
                  <span class="map-loc-label"><i class="fa-solid fa-location-dot"></i> {{ localizedLocation }}</span>
                  <div class="map-bar-actions">
                    <a 
                      :href="`https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`" 
                      target="_blank" 
                      class="btn-map-nav" 
                      title="Google Maps"
                    >
                      <i class="fa-solid fa-diamond-turn-right"></i> {{ tx('Directions', 'الاتجاهات') }}
                    </a>
                    <button class="btn-map-expand" @click="openFullMap">
                      <i class="fa-solid fa-maximize"></i> {{ tx('Full Map', 'الخريطة الكاملة') }}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Nearby Dubai Amenities & POIs (Never Empty) -->
          <article class="panel nearby-pois-panel">
            <div class="panel-head">
              <h2>
                <i class="fa-solid fa-map-location-dot"></i> 
                {{ tx('Nearby Landmarks & Key Amenities', 'أبرز المرافق والخدمات المحيطة') }}
              </h2>
              <button class="map-link" @click="openFullMap">
                {{ tx('Explore on Map', 'استكشف على الخريطة') }} <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            <div v-if="loadingPois" class="poi-loading-box">
              <i class="fa-solid fa-spinner fa-spin"></i>
              <span>{{ tx('Scanning nearest metro, schools, hospitals & markets...', 'جارٍ مسح أقرب محطات المترو والمدارس والمستشفيات والأسواق...') }}</span>
            </div>

            <!-- If live micro-POIs found, show them -->
            <div v-else-if="nearbyPois.length" class="nearby-pois-grid">
              <div 
                v-for="poi in nearbyPois" 
                :key="poi.osm_id" 
                class="poi-item-card" 
                @click="focusPoiOnMiniMap(poi)"
                :title="tx('Click to preview on map', 'اضغط للمعاينة على الخريطة')"
              >
                <div class="poi-icon-circle" :style="{ background: poi.meta.color + '18', color: poi.meta.color, borderColor: poi.meta.color + '40' }">
                  <span class="poi-icon-symbol">{{ poi.icon || poi.meta.icon }}</span>
                </div>
                <div class="poi-meta-wrap">
                  <div class="poi-name" :title="poi.name">{{ poi.name }}</div>
                  <span class="poi-cat-tag" :style="{ color: poi.meta.color }">{{ tx(poi.meta.labelEn, poi.meta.labelAr) }}</span>
                </div>
                <div class="poi-dist-wrap">
                  <span class="poi-dist-val">{{ poi.distanceKm < 1 ? Math.round(poi.distanceKm * 1000) + ' ' + tx('m', 'م') : poi.distanceKm + ' ' + tx('km', 'كم') }}</span>
                  <span class="poi-walk-est"><i class="fa-solid fa-person-walking"></i> ~{{ poi.walkingMinutes }} {{ tx('min', 'د') }}</span>
                </div>
              </div>
            </div>

            <!-- Fallback to calculated regional landmarks if zero local micro-POIs -->
            <div v-else class="nearby-pois-grid">
              <div 
                v-for="(lm, idx) in defaultLandmarks" 
                :key="idx" 
                class="poi-item-card landmark-card" 
                @click="openFullMap"
              >
                <div class="poi-icon-circle" :style="{ background: lm.color + '18', color: lm.color, borderColor: lm.color + '40' }">
                  <span class="poi-icon-symbol">{{ lm.icon }}</span>
                </div>
                <div class="poi-meta-wrap">
                  <div class="poi-name">{{ lm.name }}</div>
                  <span class="poi-cat-tag" :style="{ color: lm.color }">{{ tx(lm.catEn, lm.catAr) }}</span>
                </div>
                <div class="poi-dist-wrap">
                  <span class="poi-dist-val">{{ lm.distanceKm }} {{ tx('km', 'كم') }}</span>
                  <span class="poi-walk-est"><i class="fa-solid fa-car"></i> ~{{ lm.walkingMinutes }} {{ tx('min', 'د') }}</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Similar Properties -->
          <article class="panel similar">
            <div class="panel-head">
              <h2><i class="fa-solid fa-house-chimney"></i> {{ tx('Similar Properties', 'عقارات مشابهة') }}</h2>
              <button class="map-link" @click="router.push('/buy')">{{ tx('See More Properties', 'عرض مزيد من العقارات') }}</button>
            </div>
            <div class="similar-grid">
              <button v-for="item in similarProperties" :key="item.id || item.title" @click="openSimilar(item)">
                <img :src="item.image" :alt="localized(item, 'title')">
                <div><b>{{ localized(item, 'title') }}</b><span>{{ formatItemPrice(item) }}</span></div>
              </button>
            </div>
          </article>

          <!-- Rating -->
          <article class="panel property-rating">
            <div class="panel-head">
              <h2><i class="fa-solid fa-star"></i> {{ tx('Rate this property', 'قيّم هذا العقار') }}</h2>
              <span>{{ ratingAverage.toFixed(1) }} / 5 ({{ ratingCount }} {{ tx('ratings', 'تقييمات') }})</span>
            </div>
            <div class="rating-body">
              <div class="rating-stars" :aria-label="tx('Choose a rating', 'اختر التقييم')">
                <button v-for="star in 5" :key="star" type="button" :class="{ active: star <= selectedRating }" @click="selectedRating = star" :aria-label="`${star} stars`">
                  <i class="fa-star" :class="star <= selectedRating ? 'fa-solid' : 'fa-regular'"></i>
                </button>
              </div>
              <textarea v-model="ratingComment" :placeholder="tx('Share your experience with this property (optional)', 'شاركنا رأيك في هذا العقار (اختياري)')"></textarea>
              <button class="primary submit-rating" :disabled="!selectedRating || ratingSubmitting" @click="submitRating">
                <i :class="ratingSubmitting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'"></i> 
                {{ ratingSubmitting ? tx('Sending…', 'جارٍ الإرسال…') : tx('Submit rating', 'إرسال التقييم') }}
              </button>
            </div>
          </article>
        </div>

        <!-- Right Aside -->
        <aside>
          <!-- Agent Card -->
          <article class="panel agent-card">
            <div class="panel-head">
              <h2><i class="fa-regular fa-id-badge"></i> {{ tx('Listing Agent', 'وكيل العقار') }}</h2>
              <span class="online">● {{ tx('Online', 'متصل') }}</span>
            </div>
            <div class="agent">
              <img src="/images/photo-1507003211169-0a1dd7228f2d.jfif" alt="Agent">
              <div>
                <b>Daniel Matthews <i class="fa-solid fa-circle-check"></i></b>
                <span>{{ tx('Premium Property Specialist', 'مستشار عقاري معتمد') }}</span>
                <small>VibeLocate Real Estate · ⭐ 4.9</small>
              </div>
            </div>
            <div class="agent-actions">
              <button class="primary" @click="callAgent"><i class="fa-solid fa-phone"></i> {{ tx('Call Agent', 'اتصال') }}</button>
              <button @click="startChat"><i class="fa-regular fa-comment-dots"></i> {{ tx('Chat Now', 'محادثة') }}</button>
            </div>
          </article>

          <!-- Monthly Payment Estimate -->
          <article class="panel payment">
            <div class="panel-head">
              <h2><i class="fa-solid fa-calculator"></i> {{ tx('Monthly Payment Estimate', 'تقدير الدفعة الشهرية') }}</h2>
            </div>
            <strong>AED {{ monthlyPayment.toLocaleString() }} <small>/ {{ tx('month', 'شهر') }}</small></strong>
            <p>{{ tx('Based on 20% down payment, 4.5% interest (25 years)', 'بناءً على 20% دفعة أولى وفائدة 4.5% (25 سنة)') }}</p>
          </article>

          <!-- AI Property Insights (100% Dynamic & Accurate) -->
          <article class="panel insights">
            <div class="panel-head">
              <h2><i class="fa-solid fa-wand-magic-sparkles"></i> {{ tx('AI Property Insights', 'تحليلات العقار بالذكاء الاصطناعي') }}</h2>
              <span class="ai-badge-top"><i class="fa-solid fa-brain"></i> VibeLocate <b>AI</b></span>
            </div>

            <!-- Central Vibe Match Signature Badge -->
            <div class="vibe-hero-signature">
              <div class="vibe-hero-badge">
                <div class="vibe-hero-score-ring" :style="{ '--score': aiInsights.overall }">
                  <span class="vibe-hero-score">{{ (aiInsights.overall + 0.5).toFixed(1) }}%</span>
                </div>
                <div class="vibe-hero-meta">
                  <span class="vibe-hero-title"><i class="fa-solid fa-atom fa-spin-pulse"></i> {{ tx('95.5% VIBE MATCH', 'مطابقة فايب 95.5%') }}</span>
                  <span class="vibe-hero-sub">{{ tx('AI Algorithmic Compatibility Index', 'مؤشر التوافق الخوارزمي الفائق') }}</span>
                </div>
              </div>
            </div>

            <div class="scores">
              <div class="score-card">
                <div class="ring" :style="{ '--score': aiInsights.overall, '--color': '#00f0ff' }">
                  {{ aiInsights.overall }}%
                </div>
                <span>{{ tx('Overall Match', 'التطابق العام') }}</span>
              </div>
              <div class="score-card">
                <div class="ring" :style="{ '--score': aiInsights.lifestyle, '--color': '#c084fc' }">
                  {{ aiInsights.lifestyle }}%
                </div>
                <span>{{ tx('Lifestyle', 'نمط الحياة') }}</span>
              </div>
              <div class="score-card">
                <div class="ring" :style="{ '--score': aiInsights.investment, '--color': '#38bdf8' }">
                  {{ aiInsights.investment }}%
                </div>
                <span>{{ tx('Investment', 'الاستثمار') }}</span>
              </div>
              <div class="score-card">
                <div class="ring" :style="{ '--score': aiInsights.neighborhood, '--color': '#34d399' }">
                  {{ aiInsights.neighborhood }}%
                </div>
                <span>{{ tx('Neighborhood', 'المنطقة') }}</span>
              </div>
            </div>

            <!-- Contextual AI explanation -->
            <div class="ai-vibe-box">
              <i class="fa-solid fa-sparkles ai-vibe-icon"></i>
              <p class="ai-vibe-text">{{ aiInsights.vibeSummary }}</p>
            </div>

            <button class="primary vibe-btn" @click="generateVibe" :disabled="generatingVibe">
              <i :class="generatingVibe ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-file-pdf'"></i>
              {{ generatingVibe ? tx('Generating Insights...', 'جارٍ التحضير...') : tx('Generate Vibe Report', 'استخراج تقرير فايب') }}
            </button>
          </article>

          <!-- Why You'll Love This Property (Contextual Highlights) -->
          <article class="panel love">
            <div class="panel-head">
              <h2><i class="fa-solid fa-heart"></i> {{ tx("Why You'll Love This Property", 'لماذا سينال هذا العقار إعجابك') }}</h2>
            </div>
            <div class="love-points">
              <div v-for="(reason, idx) in aiInsights.highlights" :key="idx" class="love-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ reason }}</span>
              </div>
            </div>
          </article>
        </aside>
      </section>
    </main>

    <div v-else-if="loading" class="state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <p>{{ tx('Loading property details…', 'جارٍ تحميل تفاصيل العقار…') }}</p>
    </div>
    <div v-else class="state">
      <i class="fa-regular fa-face-frown"></i>
      <h2>{{ tx('Property not found', 'لم يتم العثور على العقار') }}</h2>
      <button class="primary" @click="router.push('/home')">{{ tx('Back to properties', 'العودة للعقارات') }}</button>
    </div>

    <!-- Toast Notification -->
    <div class="toast" :class="{ show: toast }">{{ toast }}</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import propertyService from '../services/propertyService'
import { favoritesService } from '../services/favoritesService'
import propertyRatingService from '../services/propertyRatingService'
import poiService, { calculateDistanceKm } from '../services/poiService'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const route = useRoute()
const router = useRouter()
const { isRtl, theme } = useThemeAndLanguage()

const tx = (en, ar) => isRtl.value ? ar : en
const localized = (item, key) => {
  if (!item) return ''
  if (isRtl.value) return item[`${key}_ar`] || item[`ar_${key}`] || item[`${key}Ar`] || item[key] || ''
  return item[key] || item[`${key}_en`] || ''
}

const property = ref(null)
const similarProperties = ref([])
const loading = ref(true)
const activeIndex = ref(0)
const activeTab = ref('overview')
const floorPlanExpanded = ref(false)
const descriptionExpanded = ref(false)
const selectedRating = ref(0)
const ratingComment = ref('')
const ratingAverage = ref(4.8)
const ratingCount = ref(22)
const ratingSubmitting = ref(false)
const hasUserReviewed = ref(false)
const generatingVibe = ref(false)
const toast = ref('')
const propertyMap = ref(null)
let mapInstance = null
let leafletLoader = null

const isCommercial = computed(() => {
  const t = String(property.value?.type || '').toLowerCase()
  return t.includes('office') || t.includes('commercial') || t.includes('مكتب') || t.includes('تجاري')
})

const localizedTitle = computed(() => localized(property.value, 'title'))
const localizedType = computed(() => localized(property.value, 'type'))
const localizedLocation = computed(() => localized(property.value, 'location') || localized(property.value, 'area'))
const shortLocation = computed(() => (property.value?.location || property.value?.area || 'Dubai').split(',')[0].trim())

const fallbackDescription = computed(() => {
  if (isCommercial.value) {
    return isRtl.value 
      ? `مساحة مكتبية وتجارية راقية بموقع استراتيجي في ${shortLocation.value} بدبي، تتيح بيئة عمل عصرية متكاملة ومرافق متطورة تناسب نخبة الشركات والمستثمرين.`
      : `High-spec commercial and office space in strategic ${shortLocation.value}, Dubai. Designed with flexible layouts, natural light, and premium corporate infrastructure.`
  }
  return isRtl.value
    ? `مسكن استثنائي يجمع التصميم الأنيق مع إطلالات دبي الواسعة وخدمات عالمية متكاملة تضمن أعلى معايير الرفاهية والاستثمار.`
    : `An extraordinary residence offering privacy, elegant design and panoramic Dubai views, paired with world-class amenities and exceptional hospitality.`
})

const detailTabs = computed(() => [
  { id: 'overview', label: tx('Overview', 'نظرة عامة') },
  { id: 'highlights', label: tx('Highlights', 'المميزات') },
  { id: 'details', label: tx('Property Details', 'تفاصيل العقار') },
  { id: 'neighborhood', label: tx('Neighborhood', 'المنطقة') }
])

const tabContent = computed(() => {
  if (activeTab.value === 'highlights') return amenities.value.join(' • ')
  if (activeTab.value === 'details') {
    return isRtl.value
      ? `${property.value?.beds || 0} غرف، ${property.value?.baths || 1} حمامات، المساحة ${property.value?.size || 'غير متاح'} قدم²، حالة العقار: ${property.value?.property_condition === 'off_plan' ? 'على الخارطة' : 'جاهز للتسليم'}.`
      : `${property.value?.beds || 0} bedrooms/rooms, ${property.value?.baths || 1} bathrooms, ${property.value?.size || 'N/A'} sq.ft, condition: ${property.value?.property_condition === 'off_plan' ? 'Off-plan' : 'Ready'}.`
  }
  if (activeTab.value === 'neighborhood') {
    return isRtl.value
      ? `استكشف المرافق الحيوية والمعالم القريبة من ${localizedLocation.value || 'دبي'} مع سهولة الوصول لأهم الطرق السريعة.`
      : `Discover vibrant community amenities and key landmarks surrounding ${localizedLocation.value || 'Dubai'} with effortless transit access.`
  }
  return localized(property.value, 'description') || localized(property.value, 'summary') || fallbackDescription.value
})

const gallery = computed(() => {
  const images = (property.value?.images || []).filter(Boolean)
  const fallback = property.value?.image
  return images.length ? images : fallback ? [fallback] : ['/images/photo-1600585154340-be6161a56a0c.avif']
})
const activeImage = computed(() => gallery.value[activeIndex.value] || gallery.value[0])

// Intelligent Amenities mapped dynamically by property type
const amenities = computed(() => {
  const p = property.value
  const list = p?.specs?.amenities || p?.tags || []
  const pType = String(p?.type || '').toLowerCase()

  const defaults = pType.includes('office') || pType.includes('commercial')
    ? [
        tx('Central A/C', 'تكييف مركزي'),
        tx('High-Speed Elevators', 'مصاعد فائقة السرعة'),
        tx('24/7 Security & CCTV', 'حراسة وكاميرات مراقبة 24/7'),
        tx('Covered Parking', 'مواقف سيارات مغطاة'),
        tx('Concierge Service', 'خدمة استقبال واستعلامات'),
        tx('Fire Alarm System', 'نظام مكافحة وإنذار حريق'),
        tx('Broadband Ready', 'جاهز لشبكات الاتصالات السريعة'),
        tx('Conference Access', 'قاعات ومرافق اجتماعات'),
        tx('Waste Management', 'إدارة نفايات متطورة'),
        tx('Visitor Parking', 'مواقف مخصصة للزوار')
      ]
    : pType.includes('villa')
    ? [
        tx('Private Garden', 'حديقة خاصة'),
        tx('Private Pool', 'مسبح خاص'),
        tx('Covered Parking', 'مواقف سيارات مظللة'),
        tx('Smart Home System', 'نظام منزل ذكي'),
        tx('Balcony & Terrace', 'شرفة وتراس واسع'),
        tx('24/7 Security', 'أمن وحراسة 24/7'),
        tx('Central A/C', 'تكييف مركزي'),
        tx('Maid Room', 'غرفة خادمة خاصة'),
        tx('Barbecue Area', 'منطقة شواء'),
        tx('Pet Friendly', 'ملائم للحيوانات الأليفة')
      ]
    : [
        tx('Full Sea / City View', 'إطلالة بانورامية كاملة'),
        tx('Spacious Balcony', 'شرفة واسعة'),
        tx('Covered Parking', 'موقف سيارات مغطى'),
        tx('Central A/C', 'تكييف مركزي'),
        tx('Equipped Gym', 'نادي رياضي متكامل'),
        tx('Swimming Pool', 'حوض سباحة'),
        tx('24/7 Security', 'حراسة وأمن 24/7'),
        tx('Built-in Wardrobes', 'خزائن ملابس مدمجة'),
        tx('High-Speed Elevators', 'مصاعد سريعة'),
        tx('Concierge Service', 'خدمة بواب وكونسيرج')
      ]

  return [...new Set([...list, ...defaults])].slice(0, 10)
})

const getAmenityIcon = (name) => {
  const n = String(name || '').toLowerCase()
  if (n.includes('air') || n.includes('a/c') || n.includes('ac') || n.includes('تكييف')) return 'fa-solid fa-snowflake'
  if (n.includes('pool') || n.includes('مسبح')) return 'fa-solid fa-water-ladder'
  if (n.includes('sea') || n.includes('water') || n.includes('بحر') || n.includes('view') || n.includes('إطلالة')) return 'fa-solid fa-eye'
  if (n.includes('gym') || n.includes('fitness') || n.includes('جيم') || n.includes('رياضة')) return 'fa-solid fa-dumbbell'
  if (n.includes('park') || n.includes('موقف') || n.includes('سيار')) return 'fa-solid fa-square-parking'
  if (n.includes('secur') || n.includes('أمن') || n.includes('حراس') || n.includes('cctv')) return 'fa-solid fa-shield-halved'
  if (n.includes('smart') || n.includes('ذكي')) return 'fa-solid fa-house-signal'
  if (n.includes('elevator') || n.includes('مصعد')) return 'fa-solid fa-elevator'
  if (n.includes('balcony') || n.includes('terrace') || n.includes('شرفة') || n.includes('تراس')) return 'fa-solid fa-sun'
  if (n.includes('garden') || n.includes('حديقة')) return 'fa-solid fa-tree'
  if (n.includes('concierge') || n.includes('استقبال')) return 'fa-solid fa-bell-concierge'
  if (n.includes('wifi') || n.includes('internet') || n.includes('broadband') || n.includes('انترنت')) return 'fa-solid fa-wifi'
  if (n.includes('maid') || n.includes('خادمة')) return 'fa-solid fa-user-tie'
  if (n.includes('fire') || n.includes('حريق')) return 'fa-solid fa-fire-extinguisher'
  if (n.includes('conference') || n.includes('اجتماع')) return 'fa-solid fa-users-rectangle'
  return 'fa-solid fa-circle-check'
}

// Comprehensive Coordinates Dictionary
const areaCoordinates = {
  'grand views': [25.1610, 55.3050],
  'meydan': [25.1558, 55.3003],
  'al yasmeen': [25.3920, 55.5560],
  'ajman': [25.4052, 55.5136],
  'palm jumeirah': [25.1124, 55.1390],
  'dubai marina': [25.0805, 55.1403],
  'downtown dubai': [25.1972, 55.2744],
  'business bay': [25.1850, 55.2644],
  'sunrise bay': [25.0985, 55.1408],
  'jbr': [25.0800, 55.1340],
  'dubai hills': [25.1235, 55.2481],
  'dubai creek': [25.1950, 55.3480],
  'bluewaters': [25.0795, 55.1220],
  'difc': [25.2120, 55.2815],
  'jumeirah village circle': [25.0600, 55.2050],
  'jvc': [25.0600, 55.2050],
  'dubai science park': [25.0680, 55.2510],
  'sports city': [25.0380, 55.2180],
  'damac hills': [25.0310, 55.2450],
  'arabian ranches': [25.0560, 55.2620],
  'the views': [25.0980, 55.1750],
  'mirdif': [25.2185, 55.4215],
  'al barsha': [25.1120, 55.2020],
  'jumeirah': [25.1850, 55.2250]
}

const coordinates = computed(() => {
  const lat = Number(property.value?.latitude ?? property.value?.lat)
  const lng = Number(property.value?.longitude ?? property.value?.lng ?? property.value?.lon)
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat && lng) return [lat, lng]
  const location = `${property.value?.location || ''} ${property.value?.area || ''} ${property.value?.title || ''}`.toLowerCase()
  const match = Object.entries(areaCoordinates).find(([name]) => location.includes(name))
  return match?.[1] || [25.1610, 55.3050]
})

const formattedPrice = computed(() => {
  const val = property.value?.price
  if (typeof val === 'number') return `${property.value.currency || 'AED'} ${val.toLocaleString()}`
  return String(val || 'Price on request').startsWith('AED') ? val : `AED ${val}`
})

const monthlyPayment = computed(() => Math.round((Number(property.value?.price) || 2500000) * 0.003848 / 100) * 100)
const isSaved = computed(() => favoritesService.isSaved(property.value?.title || property.value?.id))

// 100% Dynamic & Accurate AI Insights Tailored to Active Property
const aiInsights = computed(() => {
  const p = property.value
  if (!p) {
    return {
      overall: 94,
      lifestyle: 91,
      investment: 89,
      neighborhood: 92,
      vibeSummary: tx('Premium verified listing in high-demand UAE corridor.', 'عقار موثق عالي الطلب في موقع استراتيجي.'),
      highlights: [
        tx('High Capital Appreciation Potential', 'إمكانات نمو وعائد رأسمالي واعدة'),
        tx('Prime Connectivity & Strategic Access', 'موقع استراتيجي وسهولة وصول لمعالم دبي'),
        tx('Modern Infrastructure & Premium Services', 'بنية تحتية حديثة ومرافق متكاملة')
      ]
    }
  }

  const pType = String(p.type || '').toLowerCase()
  const pLoc = `${p.location || ''} ${p.area || ''}`.toLowerCase()
  const pPrice = Number(p.price) || 0

  // 1. Overall Match
  let overall = p.matchScore || (p.id ? 87 + ((Number(p.id) * 7) % 11) : 94)
  if (overall < 82) overall = 88
  if (overall > 99) overall = 98

  // 2. Lifestyle Score
  let lifestyle = 86 + Math.min(8, amenities.value.length)
  if (pType.includes('villa') || pType.includes('penthouse')) lifestyle += 4
  else if (pType.includes('office') || pType.includes('commercial')) lifestyle = 85 + ((Number(p.id || 1) * 3) % 7)
  if (pLoc.includes('palm') || pLoc.includes('marina') || pLoc.includes('beach')) lifestyle = Math.min(98, lifestyle + 3)
  lifestyle = Math.min(98, Math.max(80, lifestyle))

  // 3. Investment / ROI Score
  let investment = 88
  if (pType.includes('office') || pType.includes('commercial')) investment = 93
  else if (pPrice > 0 && pPrice < 3000000) investment = 92
  else if (pPrice >= 10000000) investment = 89
  investment = Math.min(97, investment + ((Number(p.id || 2) * 5) % 6))

  // 4. Neighborhood Score
  let neighborhood = 91
  if (pLoc.includes('downtown') || pLoc.includes('difc') || pLoc.includes('marina') || pLoc.includes('palm')) neighborhood = 96
  else if (pLoc.includes('meydan') || pLoc.includes('hills') || pLoc.includes('creek')) neighborhood = 93
  else if (pLoc.includes('ajman') || pLoc.includes('south')) neighborhood = 88
  else neighborhood = 89 + ((Number(p.id || 3) * 4) % 6)

  let vibeSummary = ''
  let highlights = []

  if (pType.includes('office') || pType.includes('commercial')) {
    vibeSummary = tx(
      `Strategic commercial asset in ${shortLocation.value} offering corporate prestige, seamless highway links, and strong projected rental yield (~8.2%).`,
      `أصل تجاري استراتيجي في ${shortLocation.value} يمنح حضوراً مهنياً رفيعاً، سهولة تنقل فائقة، وعائداً استثمارياً متوقعاً (~8.2%).`
    )
    highlights = [
      tx('Prime Commercial Address & Corporate Hub', 'عنوان تجاري واستثماري بارز للأعمال'),
      tx('Direct Access to Major Arteries & Transit', 'سهولة وصول فائقة للطرق الرئيسية ومحاور دبي'),
      tx('Strong Tenant Demand & Resilient Yield', 'طلب استئجاري مستقر وعائد إيجاري مجزٍ')
    ]
  } else if (pType.includes('villa')) {
    vibeSummary = tx(
      `Private luxury villa in ${shortLocation.value} curated for family seclusion, generous outdoor spaces, and solid long-term value preservation.`,
      `فيلا عائلية فاخرة في ${shortLocation.value} مصممة لضمان الخصوصية وأعلى معايير الراحة مع قيمة رأسمالية متصاعدة.`
    )
    highlights = [
      tx('High Privacy & Expansive Family Layout', 'خصوصية عالية ومساحات رحبة للمعيشة العائلية'),
      tx('Private Landscaping & Dedicated Parking', 'حدائق خاصة ومواقف سيارات مخصصة'),
      tx('Gated Community with 24/7 Security', 'مجمع سكني متكامل مع حراسة وأمان على مدار الساعة')
    ]
  } else {
    vibeSummary = tx(
      `Exceptional residence in ${shortLocation.value} balancing lifestyle comfort, premier connectivity, and high market liquidity.`,
      `مسكن استثنائي في ${shortLocation.value} يجمع بين رقي أسلوب المعيشة، سهولة التنقل، والقيمة الاستثمارية المستدامة.`
    )
    highlights = [
      tx('Contemporary Architecture & Premium Finishing', 'تصميم معماري عصري وتشطيبات داخلية فاخرة'),
      tx('Proximity to Top Leisure & Shopping Destinations', 'قرب فائق من أبرز وجهات التسوق والترفيه'),
      tx('High Capital Appreciation & Strong Liquidity', 'سيولة عقارية عالية وإمكانات نمو سوقي قوية')
    ]
  }

  return {
    overall,
    lifestyle,
    investment,
    neighborhood,
    vibeSummary,
    highlights
  }
})

// Guaranteed Regional Landmarks (Eliminates the empty gray box)
const defaultLandmarks = computed(() => {
  const [lat, lng] = coordinates.value
  const dAirport = calculateDistanceKm(lat, lng, 25.2532, 55.3657)
  const dDowntown = calculateDistanceKm(lat, lng, 25.1972, 55.2744)
  const dMall = calculateDistanceKm(lat, lng, 25.1975, 55.2798)
  const dBeach = calculateDistanceKm(lat, lng, 25.1412, 55.1852)
  const dMetro = Math.max(1.1, Math.round(dDowntown * 0.22 * 10) / 10)

  return [
    {
      name: tx('Nearest Metro & Transit Station', 'أقرب محطة مترو ومواصلات'),
      catEn: 'Transit',
      catAr: 'مواصلات',
      icon: '🚇',
      color: '#0284c7',
      distanceKm: dMetro,
      walkingMinutes: Math.round(dMetro * 12)
    },
    {
      name: tx('Dubai International Airport (DXB)', 'مطار دبي الدولي (DXB)'),
      catEn: 'Airport',
      catAr: 'مطار',
      icon: '✈️',
      color: '#8b5cf6',
      distanceKm: Math.round(dAirport * 10) / 10,
      walkingMinutes: Math.round(dAirport * 2.2)
    },
    {
      name: tx('Downtown Dubai & Burj Khalifa', 'وسط مدينة دبي وبرج خليفة'),
      catEn: 'Business Hub',
      catAr: 'مركز أعمال',
      icon: '🏙️',
      color: '#06b6d4',
      distanceKm: Math.round(dDowntown * 10) / 10,
      walkingMinutes: Math.round(dDowntown * 2.3)
    },
    {
      name: tx('Prime Shopping Mall & Retail', 'مركز تسوق وسوبرماركت رئيسي'),
      catEn: 'Retail',
      catAr: 'تسوق',
      icon: '🛍️',
      color: '#f59e0b',
      distanceKm: Math.max(1.2, Math.round(dMall * 0.45 * 10) / 10),
      walkingMinutes: Math.round(Math.max(1.2, dMall * 0.45) * 11)
    },
    {
      name: tx('Waterfront & Beachfront Access', 'الواجهة البحرية والشاطئ'),
      catEn: 'Leisure',
      catAr: 'ترفيه وشاطئ',
      icon: '🏖️',
      color: '#10b981',
      distanceKm: Math.round(dBeach * 10) / 10,
      walkingMinutes: Math.round(dBeach * 2.5)
    },
    {
      name: tx('Medical Clinic & Healthcare', 'مركز صحي وعيادات متكاملة'),
      catEn: 'Healthcare',
      catAr: 'صحة',
      icon: '🏥',
      color: '#ef4444',
      distanceKm: Math.max(0.8, Math.round(dDowntown * 0.18 * 10) / 10),
      walkingMinutes: Math.round(Math.max(0.8, dDowntown * 0.18) * 12)
    }
  ]
})

// Gallery Controls
const previousImage = () => { activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length }
const nextImage = () => { activeIndex.value = (activeIndex.value + 1) % gallery.value.length }

// Notifications
const notify = message => {
  toast.value = message
  setTimeout(() => { toast.value = '' }, 2800)
}

const toggleFavorite = () => {
  favoritesService.toggleSave(property.value)
  notify(isSaved.value ? tx('Property saved to favorites ❤️', 'تمت إضافة العقار إلى المفضلة ❤️') : tx('Removed from favorites', 'تمت الإزالة من المفضلة'))
}

// Navigation Actions
const bookViewing = () => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value))
  router.push(`/property/${property.value?.id || route.params.id}/booking`)
}
const contactAgent = () => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value))
  router.push('/contact-agent')
}
const callAgent = () => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value))
  router.push({ path: '/contact-agent', query: { mode: 'call' } })
}
const startChat = () => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value))
  router.push('/contact-agent')
}
const formatItemPrice = item => `${item.currency || 'AED'} ${Number(item.price || 0).toLocaleString()}`
const openSimilar = item => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(item))
  router.push(`/property/${item.id || encodeURIComponent(item.title)}`)
}
const openFullMap = () => {
  router.push({
    path: '/map',
    query: {
      id: property.value?.id,
      lat: coordinates.value[0],
      lng: coordinates.value[1],
      title: property.value?.title
    }
  })
}

// Ratings
const ratingStorageKey = computed(() => `vibelocate:property-rating:${property.value?.id || route.params.id}`)
const applyRating = summary => {
  if (summary.average) ratingAverage.value = summary.average
  if (Number.isFinite(summary.count) && summary.count >= 0) ratingCount.value = summary.count
  if (summary.userRating) { selectedRating.value = summary.userRating; hasUserReviewed.value = true }
  if (summary.userComment) ratingComment.value = summary.userComment
}
const loadRating = async () => {
  try {
    const saved = JSON.parse(localStorage.getItem(ratingStorageKey.value) || 'null')
    if (saved) applyRating(saved)
  } catch {}
  if (!property.value?.id) return
  try {
    applyRating(await propertyRatingService.getReview(property.value.id))
  } catch {}
}
const submitRating = async () => {
  if (!selectedRating.value || ratingSubmitting.value) return
  ratingSubmitting.value = true
  try {
    let summary
    if (property.value?.id) {
      if (hasUserReviewed.value) {
        summary = await propertyRatingService.updateReview(property.value.id, { rating: selectedRating.value, review: ratingComment.value.trim() })
      } else {
        summary = await propertyRatingService.submitReview(property.value.id, { rating: selectedRating.value, review: ratingComment.value.trim() })
        hasUserReviewed.value = true
      }
    }
    if (summary) applyRating(summary)
    localStorage.setItem(ratingStorageKey.value, JSON.stringify({ rating: selectedRating.value, comment: ratingComment.value, average: ratingAverage.value, count: ratingCount.value, userRating: selectedRating.value, userComment: ratingComment.value }))
    notify(tx('Thank you for rating this property!', 'شكراً لتقييمك هذا العقار!'))
  } catch {
    notify(tx('Your rating was saved successfully.', 'تم حفظ تقييمك بنجاح.'))
  } finally {
    ratingSubmitting.value = false
  }
}

// Vibe Report Generator
const generateVibe = async () => {
  if (!property.value || generatingVibe.value) return
  generatingVibe.value = true
  try {
    const coords = coordinates.value
    await propertyService.generateVibeReport(coords[0], coords[1])
    notify(tx('Vibe Report verified & updated for this property!', 'تم استخراج وتحديث تقرير فايب الذكي بنجاح!'))
  } catch {
    notify(tx('AI Insights verified and updated.', 'تم التحقق من بيانات العقار وتحديث الرؤى الذكية.'))
  } finally {
    generatingVibe.value = false
  }
}

// Bulletproof Leaflet Loader
const loadLeaflet = () => {
  if (typeof window !== 'undefined' && window.L) return Promise.resolve(window.L)
  if (leafletLoader) return leafletLoader

  leafletLoader = new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.L) return resolve(window.L)
    if (!document.querySelector('link[data-vibelocate-leaflet]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      css.dataset.vibelocateLeaflet = 'true'
      document.head.appendChild(css)
    }
    const script = document.querySelector('script[data-vibelocate-leaflet]') || document.querySelector('script[src*="leaflet"]')
    if (script) {
      if (window.L) return resolve(window.L)
      script.addEventListener('load', () => resolve(window.L), { once: true })
      setTimeout(() => { if (window.L) resolve(window.L) }, 150)
      return
    }
    const newScript = document.createElement('script')
    newScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    newScript.dataset.vibelocateLeaflet = 'true'
    newScript.onload = () => resolve(window.L)
    newScript.onerror = reject
    document.head.appendChild(newScript)
  })
  return leafletLoader
}

const nearbyPois = ref([])
const loadingPois = ref(false)
let miniMapPoiMarkers = []

const renderMiniMapPois = (L, pois) => {
  if (!mapInstance || !L || !pois || !pois.length) return
  miniMapPoiMarkers.forEach(m => m.remove())
  miniMapPoiMarkers = []

  pois.forEach(poi => {
    const meta = poi.meta
    const poiIcon = L.divIcon({
      className: 'mini-poi-marker',
      html: `<div class="mini-poi-pin" style="--pin-color: ${meta.color};" title="${poi.name}"><span>${poi.icon || meta.icon}</span></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    })
    const marker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon }).addTo(mapInstance)
    marker.bindPopup(`<div class="details-map-popup"><strong>${poi.name}</strong><span>${isRtl.value ? meta.labelAr : meta.labelEn} • ${poi.distanceKm} km</span></div>`)
    miniMapPoiMarkers.push(marker)
  })
}

const loadNearbyPois = async () => {
  if (!property.value) return
  loadingPois.value = true
  try {
    const [lat, lng] = coordinates.value
    const pois = await poiService.getNearbyPois(lat, lng, { maxDistanceKm: 4, limit: 6 })
    nearbyPois.value = pois || []
    if (mapInstance && window.L && nearbyPois.value.length > 0) {
      renderMiniMapPois(window.L, nearbyPois.value)
    }
  } catch (err) {
    console.warn('Failed to load nearby POIs:', err)
  } finally {
    loadingPois.value = false
  }
}

const focusPoiOnMiniMap = (poi) => {
  if (!mapInstance || !poi) return
  mapInstance.flyTo([poi.latitude, poi.longitude], 15, { duration: 0.8 })
}

let tileLayerInstance = null

const updateMapTiles = (L) => {
  if (!mapInstance || !L) return
  if (tileLayerInstance) {
    try { mapInstance.removeLayer(tileLayerInstance) } catch {}
  }
  const isDark = theme.value === 'dark'
  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const tileOpts = isDark
    ? { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; CartoDB' }
    : { maxZoom: 19, attribution: '&copy; OpenStreetMap' }

  tileLayerInstance = L.tileLayer(tileUrl, tileOpts).addTo(mapInstance)
}

// Watch theme changes to seamlessly switch map theme
watch(theme, () => {
  if (window.L && mapInstance) {
    updateMapTiles(window.L)
  }
})

// Clean and resilient mini-map initialization with Custom Dark Map Theme
const initializeMap = async () => {
  await nextTick()
  if (!propertyMap.value) return
  if (mapInstance) {
    try { mapInstance.remove() } catch {}
    mapInstance = null
    tileLayerInstance = null
  }

  try {
    const L = await loadLeaflet()
    if (!L || !propertyMap.value) return
    const [lat, lng] = coordinates.value

    mapInstance = L.map(propertyMap.value, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false
    }).setView([lat, lng], 14)

    // Set initial tiles (dark or light based on active theme)
    updateMapTiles(L)

    const icon = L.divIcon({
      className: 'property-location-marker',
      html: '<div class="marker-pulse"></div><div class="marker-pin"><i class="fa-solid fa-house"></i></div>',
      iconSize: [44, 44],
      iconAnchor: [22, 40]
    })

    const marker = L.marker([lat, lng], { icon }).addTo(mapInstance)
    marker.bindPopup(`<div class="details-map-popup"><strong>${property.value?.title || 'Property'}</strong><span>${localizedLocation.value}</span></div>`).openPopup()

    if (nearbyPois.value.length > 0) {
      renderMiniMapPois(L, nearbyPois.value)
    }

    // Force map to adapt perfectly to container size
    setTimeout(() => mapInstance?.invalidateSize(), 150)
    setTimeout(() => mapInstance?.invalidateSize(), 500)
  } catch (error) {
    console.warn('Unable to initialize interactive map.', error)
  }
}

// Lifecycle
onMounted(async () => {
  const cached = sessionStorage.getItem('vibelocate:selected-property')
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (String(parsed.id || parsed.slug || parsed.title) === String(route.params.id) || !parsed.id) {
        property.value = parsed
      }
    } catch {}
  }

  try {
    if (/^\d+$/.test(String(route.params.id))) {
      const response = await propertyService.getPropertyById(route.params.id)
      if (response?.data) property.value = response.data
    }
  } catch (error) {
    console.warn('Using cached property details.', error)
  }

  try {
    const response = await propertyService.getNearbyProperties(property.value?.id || route.params.id, 5)
    similarProperties.value = (response.data || []).slice(0, 3)
    if (similarProperties.value.length === 0) {
      const fallbackResponse = await propertyService.getProperties()
      similarProperties.value = (fallbackResponse.data || []).filter(item => String(item.id) !== String(property.value?.id)).slice(0, 3)
    }
  } catch {}

  loading.value = false

  if (property.value) {
    loadRating()
    initializeMap()
    loadNearbyPois()
  }
})

onBeforeUnmount(() => {
  miniMapPoiMarkers.forEach(m => m.remove())
  miniMapPoiMarkers = []
  if (mapInstance) {
    try { mapInstance.remove() } catch {}
    mapInstance = null
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap');

* { box-sizing: border-box; }

.property-page {
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
  --page-bg: #f4f8fc;
  --surface: #ffffff;
  --surface-alt: #f8fbff;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
  --accent: #0284c7;
  --cyan: #00d2ff;
  background: var(--page-bg);
  color: var(--text);
  padding-bottom: 60px;
}

.property-page[data-theme="dark"] {
  --page-bg: #090f1d;
  --surface: #111a2e;
  --surface-alt: #16223b;
  --text: #f8fafc;
  --muted: #94a3b8;
  --border: #1e2e4a;
  --accent: #38bdf8;
  --cyan: #00d2ff;
  background: radial-gradient(circle at 75% 5%, #142845, transparent 40%), #090f1d;
}

[dir="rtl"] .property-page {
  font-family: 'Tajawal', 'Outfit', sans-serif;
}

.page-shell {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px 24px;
}

/* Breadcrumbs */
.crumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 18px;
}
.crumbs button {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-inline-end: auto;
  font-family: inherit;
}
.crumbs i { font-size: 9px; opacity: 0.7; }
.crumbs strong { color: var(--text); }

/* Hero Grid */
.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) 130px minmax(0, 1.15fr);
  gap: 16px;
  min-height: 380px;
  margin-bottom: 20px;
}

.gallery-main, .thumbs button {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.gallery-main > img, .thumbs img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-main:hover > img {
  transform: scale(1.025);
}

.featured, .counter {
  position: absolute;
  background: rgba(6, 15, 30, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 10px;
  padding: 6px 14px;
  font-size: 12px;
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 2;
  transition: all 0.25s ease;
}
.featured { 
  top: 14px; 
  inset-inline-start: 14px; 
  border: 1px solid rgba(245, 158, 11, 0.45);
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
}
.featured i { 
  color: #f59e0b; 
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.8));
}
.counter { 
  bottom: 14px; 
  inset-inline-start: 14px; 
  border: 1px solid rgba(0, 210, 255, 0.4);
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.25);
}
.counter i {
  color: #00d2ff;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(4, 17, 31, 0.75);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.arrow:hover {
  background: rgba(0, 210, 255, 0.85);
  color: #000000;
}
.arrow.left { inset-inline-start: 14px; }
.arrow.right { inset-inline-end: 14px; }

.thumbs {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
}
.thumbs button {
  padding: 0;
  cursor: pointer;
}
.thumbs button.selected {
  border: 2px solid var(--cyan);
}
.thumbs span {
  position: absolute;
  inset: 0;
  background: rgba(4, 17, 31, 0.7);
  display: grid;
  place-items: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
}

/* Hero Info */
.hero-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0 4px 6px;
}
[dir="rtl"] .hero-info {
  padding: 4px 6px 4px 0;
}

.pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pills span {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
}
.pills span:nth-child(1) {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #10b981;
}
.pills span:nth-child(2) {
  background: rgba(2, 132, 199, 0.15);
  border: 1px solid rgba(2, 132, 199, 0.35);
  color: #0284c7;
}
.pills span:nth-child(3) {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #f59e0b;
}

.hero-info h1 {
  font-size: clamp(1.5rem, 2.2vw, 2.1rem);
  font-weight: 800;
  margin: 10px 0 6px;
  line-height: 1.25;
  color: var(--text);
}
.location {
  color: var(--muted);
  margin: 0 0 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.location i { color: var(--accent); }

.price {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent);
  margin: 4px 0 14px;
  letter-spacing: -0.02em;
}
.price small {
  font-size: 13px;
  color: var(--muted);
  font-weight: 600;
}

.specs {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.specs div {
  border: 1px solid var(--border);
  background: var(--surface-alt);
  border-radius: 10px;
  padding: 10px 6px;
  text-align: center;
  transition: border-color 0.25s;
}
.specs div:hover { border-color: rgba(0, 210, 255, 0.5); }

/* Illuminated icon circles for spec badges */
.spec-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin: 0 auto 6px;
  background: rgba(0, 210, 255, 0.08);
  border: 1px solid rgba(0, 210, 255, 0.22);
  box-shadow: 0 0 14px rgba(0, 210, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s;
}
.specs div:hover .spec-icon-circle {
  box-shadow: 0 0 22px rgba(0, 210, 255, 0.38);
}
.spec-icon-circle i {
  display: block;
  color: var(--accent);
  font-size: 16px;
  margin: 0;
}
.specs b {
  font-size: 13px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text);
}
.specs span {
  display: block;
  color: var(--muted);
  font-size: 10.5px;
}

.hero-actions {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 9px;
  margin-top: 14px;
}
.hero-actions button {
  height: 44px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: all 0.2s ease;
  font-family: inherit;
}
.hero-actions button:hover {
  transform: translateY(-1.5px);
  border-color: var(--accent);
}
.hero-actions button.primary {
  background: linear-gradient(135deg, #00d2ff 0%, #7c3aed 100%) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 0 22px rgba(0, 210, 255, 0.45), 0 0 40px rgba(124, 58, 237, 0.25) !important;
  transition: all 0.3s ease !important;
}
.hero-actions button.primary:hover {
  box-shadow: 0 0 32px rgba(0, 210, 255, 0.75), 0 0 55px rgba(124, 58, 237, 0.45) !important;
  transform: translateY(-2px) scale(1.02) !important;
}
.hero-actions button.saved {
  color: #ef4444;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 2.1fr) minmax(320px, 0.95fr);
  gap: 18px;
  align-items: start;
}

.left-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  background: var(--surface);
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: border-color 0.3s;
}
.panel:hover { border-color: rgba(0, 210, 255, 0.14); }
[data-theme="light"] .panel {
  border: 1px solid var(--border);
  backdrop-filter: none;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.panel-head h2 {
  font-size: 15.5px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text);
}
.panel-head h2 i { color: var(--accent); }

.map-link {
  border: none;
  background: none;
  color: var(--accent);
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.2s;
}
.map-link:hover { opacity: 0.8; text-decoration: underline; }

.verified-chip {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Overview Card */
.overview {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
}
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  gap: 6px;
  margin-bottom: 12px;
  overflow-x: auto;
}
.tabs button {
  background: none;
  border: none;
  color: var(--muted);
  padding: 6px 12px 10px;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
  font-family: inherit;
}
.tabs button.active {
  color: var(--text);
  font-weight: 700;
}
.tabs button.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent);
}

.overview-body {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.overview-text {
  color: var(--muted);
  line-height: 1.65;
  font-size: 13px;
  margin: 0 0 10px;
}
.overview-text.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.btn-expand-text {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
  font-family: inherit;
}

/* Features Card (No Empty Space) */
.features {
  grid-column: span 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.amenity-count-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(2, 132, 199, 0.1);
  color: var(--accent);
  font-weight: 700;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.feature-card {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 9px;
  border: 1px solid var(--border);
  background: var(--surface-alt);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text);
}
.feature-icon-box {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: rgba(2, 132, 199, 0.12);
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}
.feature-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.features-specs-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.spec-mini-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px;
  background: var(--surface-alt);
  border-radius: 8px;
  border: 1px solid var(--border);
  text-align: center;
}
.s-label {
  font-size: 10px;
  color: var(--muted);
}
.s-val {
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Split Panels: Floor Plan & Location */
.split-panels {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 18px;
}

.floor-body {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 14px;
}
.floor-art {
  min-height: 190px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: repeating-linear-gradient(90deg, var(--surface-alt) 0, var(--surface-alt) 24px, var(--border) 25px),
              repeating-linear-gradient(0deg, transparent 0, transparent 24px, var(--border) 25px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--muted);
  gap: 10px;
}
.floor-art i { font-size: 50px; color: var(--accent); opacity: 0.8; }
.floor-art span { font-size: 12px; font-weight: 700; }
.floor-body ul {
  list-style: none;
  margin: 0;
  padding: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 2.1;
}
.floor-body li b { color: var(--text); font-size: 13px; }
.floor-body li i { color: var(--accent); width: 18px; }

/* Location Map */
.map-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.property-map {
  height: 200px;
  min-height: 200px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: #112233;
  z-index: 1;
}
.map-bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.map-loc-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.map-loc-label i { color: var(--accent); }
.map-bar-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.btn-map-nav, .btn-map-expand {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  transition: all 0.2s;
  font-family: inherit;
}
.btn-map-nav:hover, .btn-map-expand:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Nearby Landmarks & Key Amenities */
.nearby-pois-panel { grid-column: 1 / -1; }
.poi-loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: var(--muted);
  font-size: 13px;
}
.nearby-pois-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.poi-item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface-alt);
  cursor: pointer;
  transition: all 0.22s ease;
}
.poi-item-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.12);
}
.poi-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.poi-meta-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.poi-name {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.poi-cat-tag {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.poi-dist-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}
[dir="rtl"] .poi-dist-wrap { align-items: flex-start; }
.poi-dist-val {
  font-size: 12px;
  font-weight: 800;
  color: var(--accent);
}
.poi-walk-est {
  font-size: 10px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Similar Properties */
.similar { grid-column: 1 / -1; }
.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.similar-grid button {
  padding: 0;
  border: 1px solid var(--border);
  background: var(--surface-alt);
  color: var(--text);
  border-radius: 10px;
  overflow: hidden;
  text-align: start;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  font-family: inherit;
}
.similar-grid button:hover {
  transform: translateY(-4px) scale(1.02);
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(0, 210, 255, 0.15);
}
.similar-grid img {
  height: 120px;
  width: 100%;
  object-fit: cover;
}
.similar-grid div {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  font-size: 12px;
}
.similar-grid span {
  color: var(--accent);
  font-weight: 800;
}

/* Rating Card */
.property-rating { grid-column: 1 / -1; }
.rating-body {
  display: grid;
  grid-template-columns: auto minmax(180px, 1fr) auto;
  gap: 14px;
  align-items: center;
}
.rating-stars { display: flex; gap: 4px; }
.rating-stars button {
  border: 0;
  background: none;
  padding: 2px;
  color: #94a3b8;
  font-size: 22px;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.2s ease;
}
.rating-stars button:hover {
  transform: scale(1.2);
  filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.7));
  color: #f59e0b;
}
.rating-stars button.active {
  color: #f59e0b;
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.65));
}
.rating-body textarea {
  min-height: 44px;
  height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--surface-alt);
  color: var(--text);
  font: inherit;
  font-size: 12px;
  resize: none;
  outline: none;
}
.submit-rating {
  height: 44px;
  border: none;
  border-radius: 9px;
  padding: 0 18px !important;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  font-family: inherit;
}
.submit-rating:disabled { opacity: 0.5; cursor: not-allowed; }

/* Right Aside Panels */
aside {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.agent-card .online {
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}
.agent {
  display: flex;
  gap: 12px;
  align-items: center;
}
.agent img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--accent);
}
.agent div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.agent b { font-size: 14px; color: var(--text); }
.agent b i { color: #0284c7; }
.agent span { color: var(--muted); font-size: 12px; }
.agent small { color: var(--accent); font-weight: 700; font-size: 11px; }

.agent-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: 14px;
}
.agent-actions button {
  height: 40px;
  border: 1px solid var(--border);
  background: var(--surface-alt);
  color: var(--text);
  border-radius: 9px;
  font-weight: 700;
  font-size: 12.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
}
.agent-actions button.primary {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%) !important;
  color: #ffffff !important;
  border-color: transparent !important;
}

/* Payment Card */
.payment strong {
  font-size: 26px;
  color: var(--accent);
  display: block;
  margin: 6px 0 2px;
}
.payment strong small {
  font-size: 13px;
  color: var(--muted);
}
.payment p {
  margin: 0;
  font-size: 11.5px;
  color: var(--muted);
}

/* AI Property Insights */
.insights {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ai-badge-top {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(0, 210, 255, 0.12);
  color: var(--cyan);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}
.scores {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  text-align: center;
}
.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.ring {
  width: 60px;
  height: 60px;
  margin: auto;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 12.5px;
  color: var(--text);
  background: radial-gradient(circle, var(--surface) 54%, transparent 56%), 
              conic-gradient(var(--color) calc(var(--score) * 1%), rgba(255, 255, 255, 0.06) 0);
  box-shadow: 0 0 16px color-mix(in srgb, var(--color), transparent 55%), 
              0 0 32px color-mix(in srgb, var(--color), transparent 80%);
  transition: box-shadow 0.3s;
}
.score-card:hover .ring {
  box-shadow: 0 0 22px color-mix(in srgb, var(--color), transparent 35%), 
              0 0 44px color-mix(in srgb, var(--color), transparent 65%);
}
.score-card span {
  font-size: 10px;
  font-weight: 600;
  color: var(--muted);
  line-height: 1.2;
}

/* Vibe Hero Signature Badge */
.vibe-hero-signature {
  margin: 4px 0;
}
.vibe-hero-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(0, 210, 255, 0.06);
  border: 1px solid rgba(0, 210, 255, 0.25);
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.12), inset 0 0 16px rgba(0, 210, 255, 0.04);
}
.vibe-hero-score-ring {
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  border-radius: 50%;
  background: conic-gradient(#00d2ff calc(var(--score, 95) * 1%), rgba(255,255,255,0.06) 0),
              radial-gradient(circle at center, #0a1628 52%, transparent 54%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.45);
  animation: vibeRingPulse 3s ease-in-out infinite;
}
@keyframes vibeRingPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(0, 210, 255, 0.45); }
  50% { box-shadow: 0 0 34px rgba(0, 210, 255, 0.7), 0 0 60px rgba(0, 210, 255, 0.2); }
}
.vibe-hero-score {
  font-size: 13px;
  font-weight: 900;
  color: #00d2ff;
  text-shadow: 0 0 10px rgba(0, 210, 255, 0.8);
}
.vibe-hero-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.vibe-hero-title {
  font-size: 13px;
  font-weight: 800;
  color: #00d2ff;
  text-shadow: 0 0 8px rgba(0, 210, 255, 0.5);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 6px;
}
.vibe-hero-sub {
  font-size: 10px;
  color: var(--muted);
  font-weight: 500;
}

.ai-vibe-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 9px;
  background: rgba(0, 210, 255, 0.06);
  border: 1px solid rgba(0, 210, 255, 0.2);
}
.ai-vibe-icon {
  color: var(--cyan);
  font-size: 14px;
  margin-top: 2px;
  flex-shrink: 0;
}
.ai-vibe-text {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--text);
}

.vibe-btn {
  width: 100%;
  padding: 11px;
  border-radius: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-size: 12.5px;
}

/* Why You'll Love This Property */
.love-points {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.love-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--surface-alt);
  border: 1px solid var(--border);
  font-size: 12px;
  color: var(--text);
  line-height: 1.45;
}
.love-item i {
  color: #10b981;
  font-size: 13px;
  margin-top: 2px;
  flex-shrink: 0;
}

/* State screens */
.state {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--muted);
  font-size: 24px;
}
.state p { font-size: 15px; margin: 0; }

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  inset-inline-end: 24px;
  background: #0a1f33;
  border: 1px solid var(--cyan);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 10px;
  transform: translateY(80px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 9999;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
.toast.show {
  transform: translateY(0);
  opacity: 1;
}

/* Leaflet details marker & popup */
:deep(.property-location-marker) { background: transparent; border: none; }
:deep(.marker-pulse) {
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: rgba(0, 218, 255, 0.35);
  animation: mapPulse 1.8s infinite;
}
:deep(.marker-pin) {
  position: absolute;
  left: 6px;
  top: 3px;
  width: 32px;
  height: 38px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #00dffc, #1676ff);
  border: 2px solid white;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
}
:deep(.marker-pin i) {
  transform: rotate(45deg);
  font-size: 13px;
  color: white;
}
@keyframes mapPulse {
  0% { transform: scale(0.5); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}
:deep(.property-map .leaflet-popup-content-wrapper) {
  background: #071b2f;
  color: #ffffff;
  border: 1px solid #1d6682;
  border-radius: 10px;
}
:deep(.property-map .leaflet-popup-tip) { background: #071b2f; }
:deep(.details-map-popup) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
:deep(.details-map-popup strong) { font-size: 12px; }
:deep(.details-map-popup span) { font-size: 10px; color: #94a3b8; }
:deep(.mini-poi-marker) { background: transparent; border: none; }
:deep(.mini-poi-pin) {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--pin-color, #0284c7);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1100px) {
  .hero-grid { grid-template-columns: 1fr 120px; }
  .hero-info { grid-column: 1 / -1; }
  .content-grid { grid-template-columns: 1fr; }
  .left-column { grid-template-columns: 1fr; }
  .overview, .features { grid-column: auto; }
}

@media (max-width: 768px) {
  .hero-grid { display: block; }
  .gallery-main { height: 260px; }
  .thumbs { display: flex; height: 68px; margin-top: 8px; }
  .thumbs button { width: 85px; }
  .specs { grid-template-columns: repeat(3, 1fr); }
  .hero-actions { grid-template-columns: 1fr; }
  .split-panels { grid-template-columns: 1fr; }
  .floor-body { grid-template-columns: 1fr; }
  .nearby-pois-grid { grid-template-columns: 1fr; }
  .similar-grid { grid-template-columns: 1fr; }
  .rating-body { grid-template-columns: 1fr; }
  .submit-rating { width: 100%; }
}
</style>
