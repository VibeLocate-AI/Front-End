<template>
  <div class="property-page" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme">

    <main v-if="property" class="page-shell">
      <div class="crumbs">
        <button @click="router.back()"><i class="fa-solid fa-arrow-left"></i> {{ tx('Back to results', 'العودة إلى النتائج') }}</button>
        <span>{{ tx('Home', 'الرئيسية') }}</span><i class="fa-solid fa-chevron-right"></i><span>{{ localizedType }}</span><i class="fa-solid fa-chevron-right"></i><strong>{{ localizedTitle }}</strong>
      </div>

      <section class="hero-grid">
        <div class="gallery-main">
          <img :src="activeImage" :alt="localizedTitle">
          <span class="featured"><i class="fa-solid fa-crown"></i> {{ tx('Featured Property', 'عقار مميز') }}</span>
          <span class="counter"><i class="fa-regular fa-images"></i> {{ activeIndex + 1 }} / {{ gallery.length }}</span>
          <button class="arrow left" @click="previousImage"><i class="fa-solid fa-chevron-left"></i></button>
          <button class="arrow right" @click="nextImage"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="thumbs">
          <button v-for="(image, index) in gallery.slice(0, 4)" :key="image + index" :class="{ selected: activeIndex === index }" @click="activeIndex = index">
            <img :src="image" :alt="`${localizedTitle} ${index + 1}`">
            <span v-if="index === 3 && gallery.length > 4">+{{ gallery.length - 4 }} {{ tx('Photos', 'صور') }}</span>
          </button>
        </div>
        <div class="hero-info">
          <div class="pills"><span>{{ property.isForRent ? tx('For Rent', 'للإيجار') : tx('For Sale', 'للبيع') }}</span><span>{{ tx('Ready to Move', 'جاهز للسكن') }}</span><span>{{ tx('Luxury', 'فاخر') }}</span></div>
          <h1>{{ localizedTitle }}</h1>
          <p class="location"><i class="fa-solid fa-location-dot"></i> {{ localizedLocation }}</p>
          <div class="price">{{ formattedPrice }} <small>{{ property.period || '' }}</small></div>
          <div class="specs">
            <div><i class="fa-solid fa-bed"></i><b>{{ property.beds }}</b><span>{{ tx('Bedrooms', 'غرف نوم') }}</span></div>
            <div><i class="fa-solid fa-bath"></i><b>{{ property.baths }}</b><span>{{ tx('Bathrooms', 'حمامات') }}</span></div>
            <div><i class="fa-solid fa-expand"></i><b>{{ property.size }}</b><span>{{ tx('Built-up Area', 'المساحة') }}</span></div>
            <div><i class="fa-solid fa-square-parking"></i><b>2</b><span>{{ tx('Parking', 'مواقف') }}</span></div>
            <div><i class="fa-solid fa-building"></i><b>{{ localizedType }}</b><span>{{ tx('Property Type', 'نوع العقار') }}</span></div>
          </div>
          <div class="hero-actions">
            <button class="primary" @click="bookViewing"><i class="fa-regular fa-calendar"></i> {{ tx('Book Viewing', 'احجز معاينة') }}</button>
            <button @click="contactAgent"><i class="fa-regular fa-comment-dots"></i> {{ tx('Contact Agent', 'تواصل مع الوكيل') }}</button>
            <button :class="{ saved: isSaved }" @click="toggleFavorite"><i :class="isSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i> {{ isSaved ? tx('Saved', 'محفوظ') : tx('Save Property', 'احفظ العقار') }}</button>
          </div>
        </div>
      </section>

      <section class="content-grid">
        <div class="left-column">
          <article class="panel overview">
            <div class="tabs"><button v-for="tab in detailTabs" :key="tab.id" :class="{ active: activeTab === tab.id }" @click="activeTab = tab.id"><i v-if="tab.id === 'overview'" class="fa-regular fa-clipboard"></i> {{ tab.label }}</button></div>
            <p>{{ tabContent }}</p>
          </article>

          <article class="panel features">
            <div class="panel-head"><h2><i class="fa-regular fa-star"></i> {{ tx('Key Features & Amenities', 'المزايا والخدمات') }}</h2><button class="map-link" @click="showAllAmenities = !showAllAmenities">{{ showAllAmenities ? tx('Show Less', 'عرض أقل') : tx('View All Amenities', 'عرض كل المزايا') }} <i class="fa-solid fa-arrow-right"></i></button></div>
            <div class="feature-grid">
              <div v-for="(feature, index) in visibleAmenities" :key="feature"><i :class="featureIcons[index % featureIcons.length]"></i><span>{{ feature }}</span></div>
            </div>
          </article>

          <div class="split-panels">
            <article class="panel floor-plan">
              <div class="panel-head"><h2><i class="fa-solid fa-vector-square"></i> {{ tx('Floor Plan', 'مخطط الطابق') }}</h2><button class="map-link" @click="floorPlanExpanded = !floorPlanExpanded">{{ floorPlanExpanded ? tx('Hide Floor Plan', 'إخفاء المخطط') : tx('View Full Floor Plan', 'عرض المخطط كاملاً') }}</button></div>
              <div class="floor-body"><div class="floor-art"><i class="fa-solid fa-building"></i><span>{{ localizedType }} {{ tx('floor plan', 'مخطط') }}</span></div><ul><li><b>{{ property.beds }} {{ tx('Bedroom', 'غرف نوم') }} {{ localizedType }}</b></li><li>{{ property.size }} {{ tx('sq.ft', 'قدم²') }}</li><li><i class="fa-solid fa-bed"></i> {{ property.beds }} {{ tx('Bedrooms', 'غرف نوم') }}</li><li><i class="fa-solid fa-bath"></i> {{ property.baths }} {{ tx('Bathrooms', 'حمامات') }}</li><li><i class="fa-solid fa-water-ladder"></i> {{ tx('Private terrace', 'تراس خاص') }}</li></ul></div>
            </article>
            <article class="panel location-panel">
              <div class="panel-head"><h2><i class="fa-regular fa-map"></i> {{ tx('Location', 'الموقع') }}</h2><button class="map-link" @click="openFullMap">{{ tx('View on Interactive Map', 'عرض على الخريطة التفاعلية') }} <i class="fa-solid fa-arrow-right"></i></button></div>
              <div ref="propertyMap" class="property-map" aria-label="Interactive property location map"></div>
            </article>
          </div>

          <article class="panel similar">
            <div class="panel-head"><h2><i class="fa-solid fa-house-chimney"></i> {{ tx('Similar Properties', 'عقارات مشابهة') }}</h2><button class="map-link" @click="router.push('/buy')">{{ tx('See More Properties', 'عرض مزيد من العقارات') }}</button></div>
            <div class="similar-grid">
              <button v-for="item in similarProperties" :key="item.id || item.title" @click="openSimilar(item)"><img :src="item.image" :alt="localized(item, 'title')"><div><b>{{ localized(item, 'title') }}</b><span>{{ formatItemPrice(item) }}</span></div></button>
            </div>
          </article>

          <article class="panel property-rating">
            <div class="panel-head"><h2><i class="fa-solid fa-star"></i> {{ tx('Rate this property', 'قيّم هذا العقار') }}</h2><span>{{ ratingAverage.toFixed(1) }} / 5 ({{ ratingCount }} {{ tx('ratings', 'تقييمات') }})</span></div>
            <div class="rating-body">
              <div class="rating-stars" :aria-label="tx('Choose a rating', 'اختر التقييم')">
                <button v-for="star in 5" :key="star" type="button" :class="{ active: star <= selectedRating }" @click="selectedRating = star" :aria-label="`${star} stars`"><i class="fa-star" :class="star <= selectedRating ? 'fa-solid' : 'fa-regular'"></i></button>
              </div>
              <textarea v-model="ratingComment" :placeholder="tx('Share your experience with this property (optional)', 'شاركنا رأيك في هذا العقار (اختياري)')"></textarea>
              <button class="primary submit-rating" :disabled="!selectedRating || ratingSubmitting" @click="submitRating"><i :class="ratingSubmitting ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-paper-plane'"></i> {{ ratingSubmitting ? tx('Sending…', 'جارٍ الإرسال…') : tx('Submit rating', 'إرسال التقييم') }}</button>
            </div>
          </article>
        </div>

        <aside>
          <article class="panel agent-card">
            <div class="panel-head"><h2><i class="fa-regular fa-id-badge"></i> Listing Agent</h2><span class="online">● Online</span></div>
            <div class="agent"><img src="/images/photo-1507003211169-0a1dd7228f2d.jfif" alt="Agent"><div><b>Daniel Matthews <i class="fa-solid fa-circle-check"></i></b><span>Premium Property Specialist</span><small>VibeLocate Real Estate · ⭐ 4.9</small></div></div>
            <div class="agent-actions"><button class="primary" @click="callAgent"><i class="fa-solid fa-phone"></i> Call Agent</button><button @click="startChat"><i class="fa-regular fa-comment-dots"></i> Chat Now</button></div>
          </article>
          <article class="panel payment"><div class="panel-head"><h2><i class="fa-solid fa-calculator"></i> Monthly Payment Estimate</h2></div><strong>AED {{ monthlyPayment.toLocaleString() }} <small>/ month</small></strong><p>Based on 20% down payment, 4.5% interest (25 years)</p></article>
          <article class="panel insights">
            <div class="panel-head"><h2><i class="fa-solid fa-wand-magic-sparkles"></i> AI Property Insights</h2><span>VibeLocate <b>AI</b></span></div>
            <div class="scores"><div v-for="score in scores" :key="score.label"><div class="ring" :style="{ '--score': score.value, '--color': score.color }">{{ score.value }}%</div><span>{{ score.label }}</span></div></div>
          </article>
          <article class="panel love"><div class="panel-head"><h2><i class="fa-solid fa-heart"></i> Why You'll Love This Property</h2></div><p v-for="reason in loveReasons" :key="reason"><i class="fa-solid fa-heart"></i>{{ reason }}</p></article>
        </aside>
      </section>
    </main>

    <div v-else-if="loading" class="state"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading property details…</p></div>
    <div v-else class="state"><i class="fa-regular fa-face-frown"></i><h2>Property not found</h2><button class="primary" @click="router.push('/home')">Back to properties</button></div>
    <div class="toast" :class="{ show: toast }">{{ toast }}</div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import propertyService from '../services/propertyService'
import { favoritesService } from '../services/favoritesService'
import propertyRatingService from '../services/propertyRatingService'
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
const showAllAmenities = ref(false)
const floorPlanExpanded = ref(false)
const selectedRating = ref(0)
const ratingComment = ref('')
const ratingAverage = ref(4.7)
const ratingCount = ref(18)
const ratingSubmitting = ref(false)
const toast = ref('')
const propertyMap = ref(null)
let mapInstance = null
let leafletLoader = null
const featureIcons = ['fa-solid fa-water-ladder','fa-solid fa-water','fa-solid fa-house-signal','fa-solid fa-dumbbell','fa-solid fa-sun','fa-solid fa-shield-halved','fa-solid fa-bell-concierge','fa-solid fa-elevator','fa-solid fa-square-parking','fa-solid fa-user-tie']
const scores = [{ value: 97, label: 'Overall Match', color: '#00e5ff' },{ value: 92, label: 'Lifestyle', color: '#3988ff' },{ value: 88, label: 'Investment', color: '#8b5cf6' },{ value: 90, label: 'Neighborhood', color: '#40f0aa' }]
const fallbackDescription = 'An extraordinary residence offering privacy, elegant design and panoramic Dubai views, paired with world-class amenities and exceptional hospitality.'
const localizedTitle = computed(() => localized(property.value, 'title'))
const localizedType = computed(() => localized(property.value, 'type'))
const localizedLocation = computed(() => localized(property.value, 'location') || localized(property.value, 'area'))
const loveReasons = computed(() => [`Iconic address in ${shortLocation.value}`, 'Premium finishes and exceptional natural light', 'Strong lifestyle and investment potential'])
const gallery = computed(() => { const images = (property.value?.images || []).filter(Boolean); const fallback = property.value?.image; return images.length ? images : fallback ? [fallback] : ['/images/photo-1600585154340-be6161a56a0c.avif'] })
const activeImage = computed(() => gallery.value[activeIndex.value] || gallery.value[0])
const amenities = computed(() => { const list = property.value?.specs?.amenities || property.value?.tags || []; return [...new Set([...list, 'Private Pool', 'Full Sea View', 'Smart Home', 'Gym Access', 'Spacious Balcony', '24/7 Security', 'Covered Parking', 'Concierge Service'])].slice(0, 10) })
const visibleAmenities = computed(() => showAllAmenities.value ? amenities.value : amenities.value.slice(0, 5))
const detailTabs = computed(() => [{ id: 'overview', label: tx('Overview', 'نظرة عامة') }, { id: 'highlights', label: tx('Highlights', 'المميزات') }, { id: 'details', label: tx('Property Details', 'تفاصيل العقار') }, { id: 'neighborhood', label: tx('Neighborhood', 'المنطقة') }])
const tabContent = computed(() => {
  if (activeTab.value === 'highlights') return amenities.value.slice(0, 5).join(' • ')
  if (activeTab.value === 'details') return isRtl.value ? `${property.value?.beds || 0} غرف نوم، ${property.value?.baths || 0} حمامات، ${property.value?.size || 'غير متاح'} قدم².` : `${property.value?.beds || 0} bedrooms, ${property.value?.baths || 0} bathrooms, ${property.value?.size || 'N/A'} sq.ft.`
  if (activeTab.value === 'neighborhood') return isRtl.value ? `اكتشف الخدمات والمعالم القريبة من ${localizedLocation.value || 'دبي'}.` : `Discover nearby services and attractions around ${localizedLocation.value || 'Dubai'}.`
  return localized(property.value, 'description') || localized(property.value, 'summary') || (isRtl.value ? 'مسكن استثنائي يجمع التصميم الأنيق مع إطلالات دبي الواسعة وخدمات عالمية.' : fallbackDescription)
})
const shortLocation = computed(() => (property.value?.location || property.value?.area || 'Dubai').split(',')[0])
const areaCoordinates = {
  'palm jumeirah': [25.1124, 55.1390], 'dubai marina': [25.0805, 55.1403],
  'downtown dubai': [25.1972, 55.2744], 'business bay': [25.1850, 55.2644],
  'sunrise bay': [25.0985, 55.1408], 'jbr': [25.0800, 55.1340],
  'dubai hills': [25.1235, 55.2481], 'dubai creek': [25.1950, 55.3480],
  'bluewaters': [25.0795, 55.1220], 'difc': [25.2120, 55.2815],
  'jumeirah village circle': [25.0600, 55.2050]
}
const coordinates = computed(() => {
  const lat = Number(property.value?.latitude ?? property.value?.lat)
  const lng = Number(property.value?.longitude ?? property.value?.lng ?? property.value?.lon)
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat && lng) return [lat, lng]
  const location = `${property.value?.location || ''} ${property.value?.area || ''}`.toLowerCase()
  const match = Object.entries(areaCoordinates).find(([name]) => location.includes(name))
  return match?.[1] || [25.2048, 55.2708]
})
const formattedPrice = computed(() => { const val = property.value?.price; if (typeof val === 'number') return `${property.value.currency || 'AED'} ${val.toLocaleString()}`; return String(val || 'Price on request').startsWith('AED') ? val : `AED ${val}` })
const monthlyPayment = computed(() => Math.round((Number(property.value?.price) || 2500000) * .003848 / 100) * 100)
const isSaved = computed(() => favoritesService.isSaved(property.value?.title || property.value?.id))
const previousImage = () => { activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length }
const nextImage = () => { activeIndex.value = (activeIndex.value + 1) % gallery.value.length }
const notify = message => { toast.value = message; setTimeout(() => { toast.value = '' }, 2600) }
const toggleFavorite = () => { favoritesService.toggleSave(property.value); notify(isSaved.value ? 'Property saved' : 'Property removed from saved list') }
const ratingStorageKey = computed(() => `vibelocate:property-rating:${property.value?.id || route.params.id}`)
const applyRating = summary => { if (summary.average) ratingAverage.value = summary.average; if (Number.isFinite(summary.count) && summary.count >= 0) ratingCount.value = summary.count; if (summary.userRating) selectedRating.value = summary.userRating; if (summary.userComment) ratingComment.value = summary.userComment }
const loadRating = async () => { try { const saved = JSON.parse(localStorage.getItem(ratingStorageKey.value) || 'null'); if (saved) applyRating(saved) } catch {} if (!property.value?.id) return; try { applyRating(await propertyRatingService.getSummary(property.value.id)) } catch (error) { console.warn('Could not load property ratings from API.', error?.message) } }
const submitRating = async () => { if (!selectedRating.value || ratingSubmitting.value) return; ratingSubmitting.value = true; try { let summary; if (property.value?.id) summary = await propertyRatingService.submit(property.value.id, { rating: selectedRating.value, comment: ratingComment.value.trim() }); if (summary) applyRating(summary); else throw new Error('Missing property id'); localStorage.setItem(ratingStorageKey.value, JSON.stringify({ rating: selectedRating.value, comment: ratingComment.value, average: ratingAverage.value, count: ratingCount.value })); notify(tx('Thank you for rating this property!', 'شكراً لتقييمك هذا العقار!')) } catch (error) { const average = Number(((ratingAverage.value * ratingCount.value + selectedRating.value) / (ratingCount.value + 1)).toFixed(1)); ratingAverage.value = average; ratingCount.value += 1; localStorage.setItem(ratingStorageKey.value, JSON.stringify({ rating: selectedRating.value, comment: ratingComment.value, average, count: ratingCount.value })); notify(tx('Your rating was saved locally until the server is available.', 'تم حفظ تقييمك محلياً حتى تتوفر الخدمة.')) } finally { ratingSubmitting.value = false } }
const bookViewing = () => { sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value)); router.push(`/property/${property.value?.id || route.params.id}/booking`) }
const contactAgent = () => { sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value)); router.push('/contact-agent') }
const callAgent = () => { sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value)); router.push({ path: '/contact-agent', query: { mode: 'call' } }) }
const startChat = () => { sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(property.value)); router.push('/contact-agent') }
const formatItemPrice = item => `${item.currency || 'AED'} ${Number(item.price || 0).toLocaleString()}`
const openSimilar = item => { sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(item)); router.push(`/property/${item.id || encodeURIComponent(item.title)}`) }
const loadLeaflet = () => {
  if (window.L) return Promise.resolve(window.L)
  if (leafletLoader) return leafletLoader
  leafletLoader = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-vibelocate-leaflet]')) {
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; css.dataset.vibelocateLeaflet = 'true'; document.head.appendChild(css)
    }
    const existing = document.querySelector('script[data-vibelocate-leaflet]')
    if (existing) { existing.addEventListener('load', () => resolve(window.L), { once: true }); existing.addEventListener('error', reject, { once: true }); return }
    const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.dataset.vibelocateLeaflet = 'true'; script.onload = () => resolve(window.L); script.onerror = reject; document.head.appendChild(script)
  })
  return leafletLoader
}
const initializeMap = async () => {
  await nextTick()
  if (!propertyMap.value || mapInstance) return
  try {
    const L = await loadLeaflet()
    const [lat, lng] = coordinates.value
    mapInstance = L.map(propertyMap.value, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 14)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(mapInstance)
    const icon = L.divIcon({ className: 'property-location-marker', html: '<div class="marker-pulse"></div><div class="marker-pin"><i class="fa-solid fa-house"></i></div>', iconSize: [48, 48], iconAnchor: [24, 44] })
    L.marker([lat, lng], { icon }).addTo(mapInstance).bindPopup(`<div class="details-map-popup"><strong>${property.value.title}</strong><span>${property.value.location || property.value.area}</span></div>`).openPopup()
    setTimeout(() => mapInstance?.invalidateSize(), 100)
  } catch (error) { console.warn('Unable to initialize interactive map.', error) }
}
const openFullMap = () => router.push({ path: '/map', query: { lat: coordinates.value[0], lng: coordinates.value[1], property: property.value?.id || property.value?.title } })

onMounted(async () => {
  const cached = sessionStorage.getItem('vibelocate:selected-property')
  if (cached) { try { const parsed = JSON.parse(cached); if (String(parsed.id || parsed.slug || parsed.title) === String(route.params.id) || !parsed.id) property.value = parsed } catch {} }
  try {
    if (/^\d+$/.test(String(route.params.id))) { const response = await propertyService.getPropertyById(route.params.id); if (response?.data) property.value = response.data }
  } catch (error) { console.warn('Using cached property details.', error) }
  try { const response = await propertyService.getProperties(); similarProperties.value = (response.data || []).filter(item => String(item.id) !== String(property.value?.id)).slice(0, 3) } catch {}
  loading.value = false
  if (property.value) { loadRating(); initializeMap() }
})
onBeforeUnmount(() => { mapInstance?.remove(); mapInstance = null })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box}.property-page{min-height:100vh;background:radial-gradient(circle at 75% 8%,#07355a 0,transparent 24%),linear-gradient(145deg,#020d1c,#051b31 55%,#031326);color:#e9f4ff;font-family:'Outfit',sans-serif}.topbar{height:74px;border-bottom:1px solid #173a56;background:rgba(2,13,28,.88);backdrop-filter:blur(16px);display:flex;align-items:center;padding:0 max(24px,calc((100vw - 1480px)/2));gap:50px;position:sticky;top:0;z-index:30}.brand{display:flex;align-items:center;background:none;border:0;color:white;font-size:20px;font-weight:700;cursor:pointer}.brand img{width:42px;height:42px;object-fit:contain}.brand span span{color:#08d5f2}.brand b{font-size:10px;background:#1677ff;border-radius:6px;padding:3px 5px}nav{display:flex;gap:26px;flex:1}nav button,.topbar button{border:0;color:#c9d8e8;background:none;cursor:pointer}nav button{height:74px;position:relative;font-weight:600}nav button.active{color:#00e5ff}nav button.active:after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;background:#00e5ff;box-shadow:0 0 12px #00e5ff}.top-actions{display:flex;gap:12px}.icon-btn{width:38px;height:38px;border:1px solid #26465f!important;border-radius:50%}.list-btn,.primary{background:linear-gradient(135deg,#075bff,#1878ff)!important;color:white!important;border-radius:10px!important;padding:12px 20px!important;box-shadow:0 8px 20px rgba(14,105,255,.26)}.page-shell{max-width:1480px;margin:auto;padding:18px 24px 50px}.crumbs{display:flex;align-items:center;gap:12px;font-size:13px;color:#849ab0;margin-bottom:16px}.crumbs button{margin-right:auto;background:none;border:0;color:#b7cadc;cursor:pointer}.crumbs i{font-size:9px}.crumbs strong{color:white}.hero-grid{display:grid;grid-template-columns:1.25fr 150px 1.22fr;gap:14px;min-height:350px}.gallery-main,.thumbs button{position:relative;overflow:hidden;border-radius:12px;border:1px solid #23445f;background:#0a1e31}.gallery-main>img,.thumbs img{width:100%;height:100%;object-fit:cover}.featured,.counter{position:absolute;background:rgba(4,17,31,.85);border:1px solid #49627a;border-radius:9px;padding:8px 13px;font-size:12px}.featured{top:14px;left:14px}.featured i{color:#ffd93d}.counter{bottom:14px;left:14px}.arrow{position:absolute;top:48%;width:40px;height:40px;border-radius:50%;border:1px solid #668096;background:rgba(1,12,24,.7);color:white;cursor:pointer}.arrow.left{left:14px}.arrow.right{right:14px}.thumbs{display:grid;grid-template-rows:repeat(4,1fr);gap:8px}.thumbs button{padding:0;cursor:pointer}.thumbs button.selected{border:2px solid #00dffc}.thumbs span{position:absolute;inset:0;background:rgba(0,12,25,.58);display:grid;place-items:center;color:white;font-weight:700}.hero-info{padding:4px 0 0 12px}.pills{display:flex;gap:8px}.pills span{padding:7px 12px;border:1px solid #1c6372;border-radius:20px;color:#00f0c6;font-size:12px;background:#05303b}.pills span:nth-child(2){color:#c2e878;border-color:#506c39;background:#26341e}.pills span:last-child{color:#c1cad5;border-color:#3a536d;background:#11263a}.hero-info h1{font-size:33px;margin:10px 0 3px}.location{color:#a3b6c9;margin:0 0 10px}.price{font-size:30px;color:#04dbff;font-weight:800;margin:10px 0}.price small{font-size:13px;color:#a8b8c8;font-weight:500}.specs{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.specs div{border:1px solid #21445e;background:#0a2137;border-radius:9px;padding:12px 8px;text-align:center;min-width:0}.specs i{display:block;color:#33a1ff;font-size:20px;margin-bottom:4px}.specs b{font-size:12px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.specs span{display:block;color:#91a6ba;font-size:10px}.hero-actions{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:9px;margin-top:18px}.hero-actions button,.agent-actions button{height:44px;border:1px solid #315b7a;background:#071b2f;color:white;border-radius:9px;font-weight:700;cursor:pointer}.hero-actions button.saved{color:#ff6680}.content-grid{display:grid;grid-template-columns:minmax(0,2.1fr) minmax(320px,.8fr);gap:14px;margin-top:14px}.left-column{display:grid;grid-template-columns:.9fr 1.1fr;gap:14px}.panel{border:1px solid #1b405d;border-radius:12px;background:linear-gradient(145deg,rgba(8,31,51,.94),rgba(4,21,38,.95));padding:14px;box-shadow:0 10px 26px rgba(0,0,0,.12)}.overview{grid-column:span 1}.features{grid-column:span 1}.overview p{color:#bfd0df;line-height:1.55;font-size:13px;margin:12px 0}.tabs{display:flex;border-bottom:1px solid #1a405c;gap:8px}.tabs button{background:none;border:0;color:#98adbf;padding:0 11px 11px;font-size:12px;white-space:nowrap}.tabs .active{color:white;border-bottom:2px solid #00dcfa}.panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:11px}.panel-head h2{font-size:15px;margin:0}.panel-head h2 i{color:#00e2ff;margin-right:7px}.panel-head>span{font-size:11px;color:#00dffc}.feature-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px}.feature-grid div{height:60px;background:#0c2841;border:1px solid #1c405c;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;font-size:10px}.feature-grid i{color:#2696ff;font-size:18px}.split-panels{grid-column:1/-1;display:grid;grid-template-columns:1fr 1.2fr;gap:14px}.floor-body{display:grid;grid-template-columns:1.2fr 1fr;gap:12px}.floor-art{min-height:180px;border:1px solid #25445a;background:repeating-linear-gradient(90deg,#0b2439 0,#0b2439 30px,#19364a 31px),repeating-linear-gradient(0deg,transparent 0,transparent 30px,#19364a 31px);display:flex;align-items:center;justify-content:center;flex-direction:column;color:#6891af}.floor-art i{font-size:65px}.floor-body ul{list-style:none;margin:10px 0;padding:0;color:#aabfd0;font-size:12px;line-height:2}.floor-body li i{color:#00dffc;width:20px}.map-art{height:190px;border-radius:8px;background:radial-gradient(circle at 45% 54%,#00e5ff 0 5px,transparent 6px),linear-gradient(25deg,transparent 46%,#236d83 47% 50%,transparent 51%),linear-gradient(155deg,transparent 44%,#1b5366 45% 48%,transparent 49%),#0b3042;position:relative;overflow:hidden}.map-art:before{content:"";position:absolute;inset:-50%;border:70px solid rgba(36,114,116,.25);border-radius:45%}.map-pin{position:absolute;top:45%;left:42%;background:#071a2c;border:1px solid #1c6a83;border-radius:8px;padding:9px 12px;display:grid;grid-template-columns:auto 1fr;gap:0 7px}.map-pin i{grid-row:span 2;color:#16a4ff;font-size:22px}.map-pin small{color:#8da7b9}.similar{grid-column:1/-1}.similar-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.similar-grid button{padding:0;border:1px solid #20455f;background:#071d32;color:white;border-radius:9px;overflow:hidden;text-align:left;cursor:pointer}.similar-grid img{height:110px;width:100%;object-fit:cover}.similar-grid div{display:flex;justify-content:space-between;padding:9px;font-size:11px}.similar-grid span{color:#00dffc}aside{display:flex;flex-direction:column;gap:14px}.online{color:#27e4ad!important;background:#063b38;padding:4px 8px;border-radius:8px}.agent{display:flex;gap:12px;align-items:center}.agent img{width:70px;height:70px;object-fit:cover;border-radius:50%}.agent div{display:flex;flex-direction:column;gap:3px}.agent b i{color:#1688ff}.agent span,.agent small,.payment p{color:#92a9bc;font-size:12px}.agent-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px}.payment>strong{font-size:27px;color:#00dcff}.payment>strong small{font-size:13px;color:#b1c1cf}.payment p{margin:4px 0}.scores{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center}.ring{width:62px;height:62px;margin:auto;border-radius:50%;display:grid;place-items:center;font-weight:800;background:radial-gradient(circle,#082139 56%,transparent 58%),conic-gradient(var(--color) calc(var(--score)*1%),#16354d 0);box-shadow:0 0 15px color-mix(in srgb,var(--color),transparent 50%)}.scores span{font-size:10px;display:block;margin-top:5px}.love p{display:flex;gap:10px;border-top:1px solid #193a53;padding:10px;margin:0;color:#b4c6d5;font-size:12px}.love i{color:#00dcff}.state{height:calc(100vh - 74px);display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:30px}.state p{font-size:16px}.toast{position:fixed;right:24px;bottom:24px;background:#0a2740;border:1px solid #00dffc;color:white;padding:14px 20px;border-radius:10px;transform:translateY(100px);opacity:0;transition:.3s;z-index:50}.toast.show{transform:none;opacity:1}
@media(max-width:1100px){.hero-grid{grid-template-columns:1fr 120px}.hero-info{grid-column:1/-1}.content-grid{grid-template-columns:1fr}.left-column{grid-template-columns:1fr}.overview,.features{grid-column:auto}nav{display:none}}
@media(max-width:700px){.topbar{height:62px;padding:0 14px}.top-actions .icon-btn{display:none}.list-btn{padding:9px!important;font-size:11px}.page-shell{padding:12px}.crumbs span,.crumbs>i{display:none}.hero-grid{display:block}.gallery-main{height:280px}.thumbs{display:flex;height:70px;margin-top:8px}.thumbs button{width:90px}.hero-info{padding:15px 0}.hero-info h1{font-size:26px}.specs{grid-template-columns:repeat(3,1fr)}.hero-actions{grid-template-columns:1fr}.content-grid,.left-column,.split-panels{display:block}.panel{margin-bottom:12px}.feature-grid{grid-template-columns:repeat(2,1fr)}.floor-body{grid-template-columns:1fr}.similar-grid{grid-template-columns:1fr}.scores{grid-template-columns:repeat(2,1fr)}.tabs{overflow:auto}}
.property-map{height:190px;border-radius:8px;overflow:hidden;background:#0b3042;z-index:1}.map-link{border:0;background:none;color:#00dffc;font:inherit;font-size:11px;cursor:pointer}.map-link:hover{text-decoration:underline}:deep(.property-map .leaflet-tile-pane){filter:saturate(.7) brightness(.72) contrast(1.15) hue-rotate(155deg)}:deep(.property-map .leaflet-control-zoom a){background:#09243a;color:#e8f6ff;border-color:#244b66}:deep(.property-map .leaflet-control-attribution){background:rgba(3,17,31,.78);color:#94a9bb}:deep(.property-map .leaflet-control-attribution a){color:#00dffc}:deep(.property-location-marker){background:transparent;border:0}:deep(.marker-pulse){position:absolute;inset:5px;border-radius:50%;background:rgba(0,218,255,.28);animation:mapPulse 1.8s infinite}:deep(.marker-pin){position:absolute;left:8px;top:4px;width:32px;height:38px;border-radius:50% 50% 50% 5px;transform:rotate(-45deg);display:grid;place-items:center;background:linear-gradient(135deg,#00dffc,#1676ff);border:3px solid white;box-shadow:0 5px 18px #00101d}:deep(.marker-pin i){transform:rotate(45deg);font-size:13px;color:white}@keyframes mapPulse{0%{transform:scale(.5);opacity:1}100%{transform:scale(1.8);opacity:0}}:deep(.property-map .leaflet-popup-content-wrapper){background:#071b2f;color:white;border:1px solid #1d6682;border-radius:10px}:deep(.property-map .leaflet-popup-tip){background:#071b2f}:deep(.property-map .leaflet-popup-content){margin:10px 13px}:deep(.details-map-popup){display:flex;flex-direction:column;min-width:145px}:deep(.details-map-popup strong){font-family:'Outfit',sans-serif;font-size:12px}:deep(.details-map-popup span){font-size:10px;color:#9eb4c6;margin-top:3px}

/* Shared page design: light theme by default, with a matching dark palette. */
.property-page{--page-bg:#f4f8fc;--surface:#fff;--surface-alt:#f8fbff;--text:#10253f;--muted:#62758b;--border:#d7e4ef;--accent:#087ff5;--cyan:#00bfe5;background:var(--page-bg);color:var(--text)}
.page-shell{max-width:1440px;padding:24px}.crumbs{color:var(--muted)}.crumbs button{color:var(--accent);margin-inline-end:auto;margin-right:0}.crumbs strong{color:var(--text)}.hero-grid{grid-template-columns:minmax(0,1.05fr) 128px minmax(0,1fr)}.gallery-main,.thumbs button{border-color:var(--border);background:var(--surface)}.featured,.counter{border:0;background:rgba(8,35,62,.88);color:#fff}.featured{inset-inline-start:14px;left:auto}.counter{inset-inline-start:14px;left:auto}.arrow{border:0;background:rgba(8,35,62,.82)}.arrow.left{inset-inline-start:14px;left:auto}.arrow.right{inset-inline-end:14px;right:auto}.thumbs{grid-template-rows:repeat(3,1fr)}.thumbs button.selected{border-color:var(--cyan)}.hero-info{padding:4px 0}.pills{flex-wrap:wrap}.pills span{background:#ecfbf8;border-color:#bde7e6;color:#008c80}.pills span:nth-child(2){background:#f5faea;border-color:#dbe9bb;color:#66881a}.pills span:last-child{background:var(--surface-alt);border-color:var(--border);color:var(--muted)}.hero-info h1{font-size:clamp(1.7rem,2.4vw,2.45rem);color:var(--text)}.location,.price small{color:var(--muted)}.price{color:var(--accent)}.specs div,.panel{background:var(--surface);border-color:var(--border);box-shadow:0 8px 22px rgba(20,61,92,.06)}.specs i,.feature-grid i,.panel-head h2 i{color:var(--accent)}.specs span{color:var(--muted)}.hero-actions button,.agent-actions button{background:var(--surface);border-color:#bfd3e4;color:var(--text)}.hero-actions .primary,.agent-actions .primary{background:linear-gradient(135deg,#087ff5,#0868ed)!important;border-color:transparent!important}.content-grid{grid-template-columns:minmax(0,2.1fr) minmax(285px,.8fr)}.overview p,.agent span,.agent small,.payment p,.love p{color:var(--muted)}.tabs{border-color:var(--border)}.tabs button{color:var(--muted)}.tabs .active{color:var(--accent);border-color:var(--accent)}.feature-grid div{background:var(--surface-alt);border-color:var(--border)}.similar-grid button{background:var(--surface);border-color:var(--border);color:var(--text)}.love p{border-color:var(--border)}.property-map{filter:none}.map-link,.panel-head>span{color:var(--accent)}
.property-page[data-theme="dark"]{--page-bg:#061321;--surface:#092238;--surface-alt:#0c2943;--text:#eaf5ff;--muted:#9cb4ca;--border:#1b4968;--accent:#18a8ff;--cyan:#12d8ee;background:radial-gradient(circle at 72% 5%,#0b3558,transparent 27%),#061321}.property-page[data-theme="dark"] .panel,.property-page[data-theme="dark"] .specs div,.property-page[data-theme="dark"] .gallery-main,.property-page[data-theme="dark"] .thumbs button,.property-page[data-theme="dark"] .similar-grid button{background:#092238;border-color:#1b4968}.property-page[data-theme="dark"] .feature-grid div{background:#0c2943;border-color:#1b4968}.property-page[data-theme="dark"] .hero-actions button,.property-page[data-theme="dark"] .agent-actions button{background:#071c30;border-color:#2a5977;color:#eaf5ff}.property-page[data-theme="dark"] .pills span:last-child{background:#102a43;border-color:#315773;color:#c7d7e6}
[dir="rtl"] .crumbs button{margin-inline-end:0;margin-inline-start:auto}[dir="rtl"] .hero-grid{direction:rtl}[dir="rtl"] .hero-info,[dir="rtl"] .panel,[dir="rtl"] .similar-grid button{text-align:right}[dir="rtl"] .featured,[dir="rtl"] .counter{left:auto;right:14px}[dir="rtl"] .arrow.left{left:auto;right:14px}[dir="rtl"] .arrow.right{right:auto;left:14px}[dir="rtl"] .panel-head h2 i{margin-right:0;margin-left:7px}[dir="rtl"] .agent,[dir="rtl"] .love p{direction:rtl}
[dir="rtl"] .feature-grid div,[dir="rtl"] .specs div,[dir="rtl"] .scores{text-align:center}[dir="rtl"] .hero-actions i,[dir="rtl"] .agent-actions i{margin-left:6px;margin-right:0}[dir="rtl"] .property-page{font-family:'Tajawal','Outfit',sans-serif}

/* Light-mode refinements for the floor plan and AI insight cards. */
.property-page[data-theme="light"] .floor-art{background:repeating-linear-gradient(90deg,#edf5fc 0,#edf5fc 30px,#d6e6f2 31px),repeating-linear-gradient(0deg,transparent 0,transparent 30px,#d6e6f2 31px);border-color:#cbddea;color:#5d88a8}.property-page[data-theme="light"] .floor-body ul{color:#7a9ab4}.property-page[data-theme="light"] .floor-body li:first-child{color:#6b90af}.property-page[data-theme="light"] .floor-body li i{color:#00bfe5}.property-page[data-theme="light"] .insights{background:linear-gradient(135deg,#fff 0%,#f5fbff 100%);border-color:#cfe2f0}.property-page[data-theme="light"] .ring{color:#123b5d;background:radial-gradient(circle,#f8fcff 56%,transparent 58%),conic-gradient(var(--color) calc(var(--score)*1%),#dcebf5 0);box-shadow:0 6px 16px color-mix(in srgb,var(--color),transparent 78%)}.property-page[data-theme="light"] .scores span{color:#466983;font-weight:600}.property-page[data-theme="light"] .insights .panel-head h2{color:#0f2d4b}.property-page[data-theme="light"] .property-map{border:1px solid #d3e4ef}.property-page[data-theme="light"] .payment>strong{color:#087ff5}
.property-rating{grid-column:1/-1}.rating-body{display:grid;grid-template-columns:auto minmax(180px,1fr) auto;gap:12px;align-items:center}.rating-stars{display:flex;gap:4px}.rating-stars button{border:0;background:none;padding:3px;color:#b9c8d5;font-size:23px;cursor:pointer}.rating-stars button.active{color:#f9ba22}.rating-body textarea{min-height:48px;padding:10px 12px;resize:vertical;border:1px solid var(--border,#d7e4ef);border-radius:10px;background:var(--surface-alt,#f8fbff);color:var(--text,#10253f);font:inherit;font-size:12px;outline-color:var(--accent,#087ff5)}.submit-rating{height:42px;border:0;white-space:nowrap;padding:0 14px!important}.submit-rating:disabled{opacity:.5;cursor:not-allowed}.property-page[data-theme="dark"] .rating-body textarea{background:#0c2943;border-color:#1b4968;color:#eaf5ff}@media(max-width:700px){.rating-body{grid-template-columns:1fr}.submit-rating{width:100%}}
</style>
