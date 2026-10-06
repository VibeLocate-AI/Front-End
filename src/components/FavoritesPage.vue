<template>
  <div class="favorites-page" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme" :class="{ 'light-theme': !isDark }">
    <AppNavbar />

    <!-- HERO HEADER -->
    <section class="fav-hero">
      <div class="fav-hero-content">
        <div class="fav-hero-title-group">
          <div class="fav-heart-icon-box">
            <i class="fa-solid fa-heart"></i>
          </div>
          <div>
            <span class="fav-badge-subtitle">{{ isRtl ? 'المفضلة وقائمة الرغبات' : 'MY FAVORITES' }}</span>
            <h1 class="fav-main-title">
              <span>{{ isRtl ? 'عقاراتك ' : 'Your ' }}</span>
              <strong class="text-cyan">{{ isRtl ? 'المفضلة' : 'Favorite' }}</strong>
              <span>{{ isRtl ? ' المحفوظة' : ' Properties' }}</span>
            </h1>
            <p class="fav-subtitle">
              {{ isRtl ? 'العقارات التي قمت بحفظها في حسابك، يمكنك الرجوع إليها ومقارنتها في أي وقت.' : 'Properties saved to your account. Come back to compare and inspect anytime.' }}
            </p>
          </div>
        </div>

        <div class="fav-stats-row">
          <div class="stat-pill">
            <i class="fa-solid fa-heart text-red"></i>
            <div class="stat-meta">
              <b>{{ savedList.length }}</b>
              <span>{{ isRtl ? 'عقار محفوظ' : 'Saved Properties' }}</span>
            </div>
          </div>
          <div class="stat-pill">
            <i class="fa-solid fa-building text-cyan"></i>
            <div class="stat-meta">
              <b>{{ countCategory('Apartments') }}</b>
              <span>{{ isRtl ? 'شقق' : 'Apartments' }}</span>
            </div>
          </div>
          <div class="stat-pill">
            <i class="fa-solid fa-house-chimney text-green"></i>
            <div class="stat-meta">
              <b>{{ countCategory('Villas') }}</b>
              <span>{{ isRtl ? 'فلل' : 'Villas' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <main class="fav-content-wrap">
      <!-- Toolbar: Category filter pills + Sort dropdown -->
      <div class="fav-toolbar" v-if="savedList.length > 0">
        <div class="fav-tabs">
          <button 
            v-for="tab in filterTabs" 
            :key="tab.value" 
            class="fav-tab-btn"
            :class="{ active: activeCategory === tab.value }"
            @click="activeCategory = tab.value"
          >
            {{ isRtl ? tab.labelAr : tab.labelEn }} ({{ countCategory(tab.value) }})
          </button>
        </div>

        <div class="fav-sort-wrap">
          <label class="sort-label">{{ isRtl ? 'الترتيب:' : 'Sort by:' }}</label>
          <select v-model="sortOrder" class="fav-sort-select">
            <option value="newest">{{ isRtl ? 'الأحدث أولاً' : 'Newest First' }}</option>
            <option value="price-asc">{{ isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High' }}</option>
            <option value="price-desc">{{ isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low' }}</option>
          </select>
        </div>
      </div>

      <!-- Cards Grid -->
      <div v-if="filteredCards.length > 0" class="fav-cards-grid">
        <article 
          v-for="prop in filteredCards" 
          :key="prop.id || prop.title" 
          class="fav-prop-card"
        >
          <div class="card-thumb-wrap" @click="viewDetails(prop)">
            <img 
              :src="prop.image || '/images/photo-1545324418-cc1a3fa10c00.avif'" 
              :alt="prop.title" 
              class="card-img" 
              loading="lazy"
              @error="onImgError"
            />
            <span class="prop-type-badge">{{ prop.type || 'Apartment' }}</span>
            <button 
              type="button" 
              class="btn-remove-fav" 
              @click.stop="removeFromFavorites(prop)" 
              :title="isRtl ? 'إزالة من المفضلة' : 'Remove from Favorites'"
            >
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>

          <div class="card-details">
            <h3 class="card-title" @click="viewDetails(prop)">{{ prop.title }}</h3>
            <p class="card-location">
              <i class="fa-solid fa-location-dot"></i> {{ prop.location || 'Dubai, UAE' }}
            </p>
            <div class="card-price">
              <span class="price-amount">{{ formatPrice(prop.price) }}</span>
              <span v-if="prop.period || prop.rent_frequency" class="price-period">{{ prop.period || (prop.rent_frequency ? `/${prop.rent_frequency}` : '') }}</span>
            </div>

            <div class="card-specs">
              <span><i class="fa-solid fa-bed"></i> {{ prop.beds || 2 }} {{ isRtl ? 'غرف' : 'Beds' }}</span>
              <span><i class="fa-solid fa-bath"></i> {{ prop.baths || 2 }} {{ isRtl ? 'حمام' : 'Baths' }}</span>
              <span><i class="fa-solid fa-vector-square"></i> {{ prop.sqft || '1,400' }} {{ isRtl ? 'قدم²' : 'sqft' }}</span>
            </div>

            <div class="card-footer">
              <button type="button" class="btn-view-details" @click="viewDetails(prop)">
                <span>{{ isRtl ? 'عرض التفاصيل' : 'View Details' }}</span>
                <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- EMPTY STATE (Shown when account has no favorites) -->
      <div v-else class="fav-empty-card">
        <div class="empty-icon-wrap">
          <i class="fa-regular fa-heart"></i>
        </div>
        <h2>{{ isRtl ? 'لا توجد عقارات مفضلة محفوظة حالياً' : 'No Saved Properties Yet' }}</h2>
        <p>
          {{ isRtl ? 'لم تقم بحفظ أي عقارات في هذا الحساب بعد. تصفح عقاراتنا الفاخرة في دبي واضغط على أيقونة القلب لحفظ مفضلاتك هنا.' : 'You have not saved any properties to this account yet. Explore luxury residences in Dubai and click the heart icon to save your favorites here.' }}
        </p>
        <div class="empty-actions">
          <RouterLink to="/search?purpose=sale" class="btn-browse-primary">
            <i class="fa-solid fa-compass"></i>
            <span>{{ isRtl ? 'استكشف العقارات المتاحة' : 'Explore Properties' }}</span>
          </RouterLink>
          <RouterLink to="/home" class="btn-browse-secondary">
            <span>{{ isRtl ? 'العودة للرئيسية' : 'Back to Home' }}</span>
          </RouterLink>
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toastMessage" class="fav-toast">
        <i class="fa-solid fa-circle-check"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from './AppNavbar.vue'
import favoritesService from '../services/favoritesService'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const router = useRouter()
const { isRtl, isDark, theme } = useThemeAndLanguage()

const activeCategory = ref('all')
const sortOrder = ref('newest')
const toastMessage = ref('')
let toastTimer = null

// Real reactive list of saved properties for this user account
const savedList = computed(() => favoritesService.savedItems.value || [])

const filterTabs = [
  { value: 'all', labelEn: 'All', labelAr: 'الكل' },
  { value: 'Apartments', labelEn: 'Apartments', labelAr: 'شقق' },
  { value: 'Villas', labelEn: 'Villas', labelAr: 'فلل' },
  { value: 'Penthouses', labelEn: 'Penthouses', labelAr: 'بنتهاوس' },
  { value: 'Studios', labelEn: 'Studios', labelAr: 'استوديو' }
]

const countCategory = (val) => {
  if (val === 'all') return savedList.value.length
  return savedList.value.filter(p => {
    const t = (p.type || '').toLowerCase()
    const target = val.toLowerCase().replace(/s$/, '')
    return t.includes(target)
  }).length
}

const parseNumericPrice = (p) => {
  if (typeof p === 'number') return p
  if (!p) return 0
  const clean = String(p).replace(/[^0-9.]/g, '')
  return Number(clean) || 0
}

const filteredCards = computed(() => {
  let list = [...savedList.value]
  if (activeCategory.value !== 'all') {
    const target = activeCategory.value.toLowerCase().replace(/s$/, '')
    list = list.filter(p => (p.type || '').toLowerCase().includes(target))
  }

  if (sortOrder.value === 'price-asc') {
    list.sort((a, b) => parseNumericPrice(a.price) - parseNumericPrice(b.price))
  } else if (sortOrder.value === 'price-desc') {
    list.sort((a, b) => parseNumericPrice(b.price) - parseNumericPrice(a.price))
  }
  return list
})

const showToast = (msg) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 2500)
}

const removeFromFavorites = (prop) => {
  favoritesService.remove(prop.title || prop.id)
  showToast(isRtl.value ? 'تمت إزالة العقار من المفضلة' : 'Property removed from favorites')
}

const viewDetails = (prop) => {
  if (prop.id) {
    sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(prop))
    router.push(`/property/${prop.id}`)
  }
}

const onImgError = (e) => {
  e.target.src = '/images/photo-1545324418-cc1a3fa10c00.avif'
}

const formatPrice = (price) => {
  const num = Number(price) || 0
  if (num >= 1000000) {
    const m = (num / 1000000).toFixed(1)
    return isRtl.value ? `${m} مليون درهم` : `AED ${m}M`
  }
  if (num >= 1000) {
    return isRtl.value ? `${num.toLocaleString()} درهم` : `AED ${num.toLocaleString()}`
  }
  if (num > 0) return isRtl.value ? `${num.toLocaleString()} درهم` : `AED ${num.toLocaleString()}`
  // Maybe it's already a formatted string
  if (typeof price === 'string' && price.trim()) return price
  return isRtl.value ? 'غير محدد' : 'Price on Request'
}

onMounted(async () => {
  await favoritesService.syncWithBackend()
})
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;
  background-color: var(--bg-base, #070d19);
  color: var(--text-primary, #f0f6ff);
  font-family: 'Plus Jakarta Sans', 'Cairo', sans-serif;
  padding-bottom: 80px;
}

/* HERO */
.fav-hero {
  position: relative;
  background: linear-gradient(135deg, rgba(7, 13, 25, 0.95) 0%, rgba(10, 22, 40, 0.88) 100%), url('/images/about-hero.png') center/cover no-repeat;
  padding: 60px 5% 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.fav-hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 30px;
}

.fav-hero-title-group {
  display: flex;
  align-items: center;
  gap: 24px;
}

.fav-heart-icon-box {
  width: 72px;
  height: 72px;
  background: rgba(0, 210, 255, 0.1);
  border: 1.5px solid rgba(0, 210, 255, 0.3);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #ef4444;
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.25);
  flex-shrink: 0;
}

.fav-badge-subtitle {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #00d2ff;
  text-transform: uppercase;
}

.fav-main-title {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  margin: 4px 0 8px;
  color: #ffffff;
}

.text-cyan {
  color: #00d2ff;
}

.fav-subtitle {
  font-size: 14px;
  color: rgba(240, 246, 255, 0.7);
  margin: 0;
  max-width: 580px;
}

/* STATS */
.fav-stats-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 18px;
  border-radius: 14px;
  backdrop-filter: blur(12px);
}

.stat-pill i {
  font-size: 20px;
}

.text-red { color: #ef4444; }
.text-green { color: #10b981; }

.stat-meta {
  display: flex;
  flex-direction: column;
}

.stat-meta b {
  font-size: 18px;
  color: #ffffff;
  line-height: 1.1;
}

.stat-meta span {
  font-size: 11px;
  color: rgba(240, 246, 255, 0.6);
}

/* CONTENT WRAP */
.fav-content-wrap {
  max-width: 1400px;
  margin: 32px auto 0;
  padding: 0 5%;
}

/* TOOLBAR */
.fav-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.fav-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.fav-tab-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.fav-tab-btn:hover {
  background: rgba(0, 210, 255, 0.1);
  border-color: rgba(0, 210, 255, 0.3);
  color: #00d2ff;
}

.fav-tab-btn.active {
  background: #00d2ff;
  border-color: #00d2ff;
  color: #051322;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(0, 210, 255, 0.4);
}

.fav-sort-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-label {
  font-size: 13px;
  color: rgba(240, 246, 255, 0.6);
}

.fav-sort-select {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  cursor: pointer;
}

/* CARDS GRID */
.fav-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.fav-prop-card {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  display: flex;
  flex-direction: column;
}

.fav-prop-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 210, 255, 0.35);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
}

.card-thumb-wrap {
  position: relative;
  height: 200px;
  cursor: pointer;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.fav-prop-card:hover .card-img {
  transform: scale(1.05);
}

.prop-type-badge {
  position: absolute;
  top: 12px;
  inset-inline-start: 12px;
  background: rgba(11, 19, 34, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  backdrop-filter: blur(8px);
}

.btn-remove-fav {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffffff;
  color: #ef4444;
  border: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}

.btn-remove-fav:hover {
  transform: scale(1.15);
}

.card-details {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px;
  cursor: pointer;
  transition: color 0.2s;
}

.card-title:hover {
  color: #00d2ff;
}

.card-location {
  font-size: 12.5px;
  color: rgba(240, 246, 255, 0.6);
  margin: 0 0 12px;
}

.card-location i {
  color: #00d2ff;
  margin-inline-end: 4px;
}

.card-price {
  font-size: 18px;
  font-weight: 800;
  color: #00d2ff;
  margin-bottom: 14px;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price-amount {
  font-size: 18px;
  font-weight: 800;
  color: #00d2ff;
}

.price-period {
  font-size: 12px;
  font-weight: 500;
  color: rgba(240, 246, 255, 0.5);
}

.card-specs {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: rgba(240, 246, 255, 0.7);
  padding: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 16px;
}

.card-specs i {
  color: #00d2ff;
  margin-inline-end: 4px;
}

.card-footer {
  margin-top: auto;
}

.btn-view-details {
  width: 100%;
  height: 38px;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #00d2ff;
  border-radius: 10px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-view-details:hover {
  background: #00d2ff;
  color: #051322;
}

/* EMPTY STATE */
.fav-empty-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px dashed rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 80px 24px;
  text-align: center;
  max-width: 680px;
  margin: 40px auto;
}

.empty-icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(0, 210, 255, 0.08);
  border: 1.5px solid rgba(0, 210, 255, 0.25);
  color: #00d2ff;
  font-size: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.fav-empty-card h2 {
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 10px;
}

.fav-empty-card p {
  font-size: 14px;
  color: rgba(240, 246, 255, 0.7);
  max-width: 480px;
  margin: 0 auto 26px;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.btn-browse-primary {
  background: #00d2ff;
  color: #051322;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-browse-primary:hover {
  background: #38bdf8;
  transform: translateY(-2px);
}

.btn-browse-secondary {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 22px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-browse-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* TOAST */
.fav-toast {
  position: fixed;
  bottom: 28px;
  inset-inline-start: 50%;
  transform: translateX(-50%);
  background: rgba(11, 19, 34, 0.95);
  border: 1px solid rgba(0, 210, 255, 0.4);
  color: #ffffff;
  padding: 12px 22px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 99999;
}

.fav-toast i {
  color: #10b981;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 15px);
}

/* LIGHT THEME */
[data-theme="light"] .favorites-page {
  background-color: #f8fafc;
  color: #0f172a;
}

[data-theme="light"] .fav-hero {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 249, 255, 0.9) 100%), url('/images/about-hero.png') center/cover no-repeat;
  border-bottom-color: #e2e8f0;
}

[data-theme="light"] .fav-main-title {
  color: #0f172a;
}

[data-theme="light"] .fav-subtitle {
  color: #475569;
}

[data-theme="light"] .stat-pill {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
}

[data-theme="light"] .stat-meta b {
  color: #0f172a;
}

[data-theme="light"] .stat-meta span {
  color: #64748b;
}

[data-theme="light"] .fav-tab-btn {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #334155;
}

[data-theme="light"] .fav-sort-select {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #0f172a;
}

[data-theme="light"] .fav-prop-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

[data-theme="light"] .card-title {
  color: #0f172a;
}

[data-theme="light"] .card-location {
  color: #64748b;
}

[data-theme="light"] .card-specs {
  color: #475569;
  border-color: #e2e8f0;
}

[data-theme="light"] .fav-empty-card {
  background: #ffffff;
  border-color: #cbd5e1;
}

[data-theme="light"] .fav-empty-card h2 {
  color: #0f172a;
}

[data-theme="light"] .fav-empty-card p {
  color: #64748b;
}
</style>
