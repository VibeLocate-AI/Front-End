<template>
  <div class="owner-page" :class="{ embedded, 'is-dark': isDark, 'is-rtl': isRtl }" :dir="isRtl ? 'rtl' : 'ltr'">

    <div class="owner-layout">
      <!-- SIDEBAR (Shown only when NOT embedded in ProfilePage) -->
      <aside v-if="!embedded" class="sidebar">
        <div class="owner-profile">
          <div class="avatar">
            <img v-if="currentUser.avatar" :src="currentUser.avatar" :alt="currentUser.name">
            <span v-else>{{ initials }}</span>
          </div>
          <div class="owner-info">
            <b>{{ currentUser.name }}</b>
            <span>{{ currentUser.email }}</span>
            <small><i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'عضو موثق' : 'Verified Member' }}</small>
            <button @click="router.push('/profile/edit')">
              {{ isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile' }}
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>
        </div>

        <div class="side-nav">
          <button @click="router.push('/profile')">
            <i class="fa-solid fa-table-cells-large"></i>
            <span>{{ isRtl ? 'لوحة التحكم' : 'Dashboard' }}</span>
          </button>
          <button class="active">
            <i class="fa-regular fa-building"></i>
            <span>{{ isRtl ? 'عقاراتي' : 'My Properties' }}</span>
          </button>
          <button @click="scrollToInquiries">
            <i class="fa-regular fa-message"></i>
            <span>{{ isRtl ? 'استفساراتي' : 'My Inquiries' }}</span>
            <b class="count">{{ inquiries.length }}</b>
          </button>
          <button @click="router.push('/profile/saved')">
            <i class="fa-regular fa-heart"></i>
            <span>{{ isRtl ? 'العقارات المحفوظة' : 'Saved Properties' }}</span>
          </button>
          <button @click="router.push('/profile/alerts')">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>{{ isRtl ? 'عمليات البحث المحفوظة' : 'My Searches' }}</span>
          </button>
          <button @click="router.push('/profile/settings')">
            <i class="fa-solid fa-gear"></i>
            <span>{{ isRtl ? 'إعدادات الحساب' : 'Account Settings' }}</span>
          </button>
          <button @click="showToast(isRtl ? 'تم فتح خطط الاشتراك' : 'Subscription plans opened')">
            <i class="fa-solid fa-crown"></i>
            <span>{{ isRtl ? 'الاشتراكات' : 'Subscription' }}</span>
          </button>
          <button @click="showToast(isRtl ? 'فريق الدعم جاهز للمساعدة' : 'Support team is ready to help')">
            <i class="fa-regular fa-circle-question"></i>
            <span>{{ isRtl ? 'المساعدة والدعم' : 'Help & Support' }}</span>
          </button>
          <button class="logout-btn" @click="logout">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>{{ isRtl ? 'تسجيل الخروج' : 'Log Out' }}</span>
          </button>
        </div>

        <div class="upgrade-card">
          <i class="fa-solid fa-crown"></i>
          <b>{{ isRtl ? 'ترقية حسابك' : 'Upgrade Your Plan' }}</b>
          <p>{{ isRtl ? 'احصل على ظهور أكبر، ومزيد من العملاء المحتملين وميزات حصرية.' : 'Get more visibility, leads and premium features.' }}</p>
          <button @click="showToast(isRtl ? 'تم فتح خيارات الباقات' : 'Plan options opened')">
            {{ isRtl ? 'عرض الباقات' : 'View Plans' }}
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
        </div>

        <div class="quick-card">
          <h3><i class="fa-solid fa-bolt"></i> {{ isRtl ? 'إجراءات سريعة' : 'Quick Actions' }}</h3>
          <button @click="router.push('/add-property')">
            <i class="fa-solid fa-plus"></i>
            {{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}
          </button>
          <button @click="showToast(isRtl ? 'تم فتح تقرير التحليلات' : 'Analytics report opened')">
            <i class="fa-solid fa-chart-column"></i>
            {{ isRtl ? 'عرض التحليلات' : 'View Analytics' }}
          </button>
          <button @click="showToast(isRtl ? 'فريق الدعم جاهز' : 'Support team is ready')">
            <i class="fa-solid fa-headset"></i>
            {{ isRtl ? 'طلب المساعدة' : 'Get Help' }}
          </button>
        </div>
      </aside>

      <!-- MAIN DASHBOARD CONTENT -->
      <main class="dashboard">
        <!-- STANDALONE HERO BANNER (Only when not embedded in ProfilePage) -->
        <section v-if="!embedded" class="dashboard-hero">
          <div class="hero-text-box">
            <h1>{{ isRtl ? 'عقاراتي' : 'My Properties' }}</h1>
            <p>{{ isRtl ? 'أدر العقارات المدرجة الخاصة بك على منصة VibeLocate AI.' : 'Manage the properties you have listed on VibeLocate AI.' }}</p>
          </div>
          <button class="add-property-btn" @click="router.push('/add-property')">
            <i class="fa-solid fa-plus"></i>
            <span>{{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}</span>
          </button>
        </section>

        <!-- STATS OVERVIEW ROW -->
        <section class="stats-row">
          <div v-for="stat in stats" :key="stat.key" class="stat-card-box">
            <div class="stat-icon-wrap" :style="{ backgroundColor: stat.bgColor, color: stat.color }">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-meta">
              <span class="stat-label">{{ stat.label }}</span>
              <b class="stat-number">{{ stat.value }}</b>
              <small class="stat-note" :style="{ color: stat.color }">
                <i v-if="stat.trendIcon" :class="stat.trendIcon"></i>
                {{ stat.note }}
              </small>
            </div>
          </div>
        </section>

        <!-- MODERN TOOLBAR & FILTERS -->
        <section class="toolbar-box">
          <div class="status-tabs-wrap">
            <button
              v-for="tab in statusTabs"
              :key="tab.value"
              class="status-tab-btn"
              :class="{ active: selectedStatus === tab.value }"
              @click="selectedStatus = tab.value"
            >
              <span class="status-indicator-dot" :style="{ backgroundColor: tab.color }"></span>
              <span class="tab-label">{{ isRtl ? tab.labelAr : tab.label }}</span>
              <span class="tab-count-badge">{{ statusCount(tab.value) }}</span>
            </button>
          </div>

          <div class="search-actions-wrap">
            <div class="search-input-field">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                v-model="search"
                :placeholder="isRtl ? 'ابحث في عقاراتك...' : 'Search your properties...'"
              >
              <button v-if="search" class="clear-search-btn" @click="search = ''">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div class="select-tool-wrap">
              <select v-model="typeFilter" class="filter-select">
                <option value="all">{{ isRtl ? 'كافة الأنواع' : 'All Types' }}</option>
                <option value="Villa">{{ isRtl ? 'فيلا' : 'Villa' }}</option>
                <option value="Apartment">{{ isRtl ? 'شقة' : 'Apartment' }}</option>
                <option value="Penthouse">{{ isRtl ? 'بنتهاوس' : 'Penthouse' }}</option>
                <option value="Townhouse">{{ isRtl ? 'تاون هاوس' : 'Townhouse' }}</option>
              </select>
            </div>

            <div class="select-tool-wrap">
              <select v-model="sortBy" class="filter-select">
                <option value="newest">{{ isRtl ? 'الترتيب: الأحدث' : 'Sort: Newest' }}</option>
                <option value="price-desc">{{ isRtl ? 'السعر: من الأعلى' : 'Price: High to Low' }}</option>
                <option value="price-asc">{{ isRtl ? 'السعر: من الأدنى' : 'Price: Low to High' }}</option>
                <option value="views">{{ isRtl ? 'الأكثر مشاهدة' : 'Most Viewed' }}</option>
              </select>
            </div>

            <button class="primary-add-btn" @click="router.push('/add-property')">
              <i class="fa-solid fa-plus"></i>
              <span>{{ isRtl ? 'إضافة عقار' : 'Add Property' }}</span>
            </button>
          </div>
        </section>

        <!-- DASHBOARD GRID: PROPERTIES LIST + RIGHT SIDEBAR -->
        <div class="dashboard-grid">
          <!-- PROPERTIES CATALOG -->
          <section class="properties-catalog-column">
            <div v-if="filteredProperties.length" class="properties-grid">
              <article
                v-for="item in filteredProperties"
                :key="item.id"
                class="property-card"
              >
                <!-- Card Thumbnail & Badges -->
                <div class="card-photo">
                  <img :src="item.image" :alt="item.title" loading="lazy" @error="handleImgError($event)">
                  <span class="status-pill" :class="item.status">
                    <span class="dot"></span>
                    {{ labelStatus(item.status) }}
                  </span>
                  <span v-if="item.featured" class="featured-badge">
                    <i class="fa-solid fa-crown"></i> {{ isRtl ? 'مميز' : 'Featured' }}
                  </span>
                  <button
                    class="heart-toggle-btn"
                    :class="{ 'is-saved': item.saved }"
                    :title="item.saved ? (isRtl ? 'إزالة من المحفوظات' : 'Remove from saved') : (isRtl ? 'حفظ العقار' : 'Save property')"
                    @click.stop="toggleSaved(item)"
                  >
                    <i :class="item.saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                  </button>
                </div>

                <!-- Card Content -->
                <div class="card-body">
                  <div class="card-header-info">
                    <h2 class="property-title" :title="item.title">{{ item.title }}</h2>
                    <p class="property-location">
                      <i class="fa-solid fa-location-dot"></i>
                      <span>{{ item.location }}</span>
                    </p>
                  </div>

                  <div class="property-price-box">
                    <strong class="price-val">{{ formatPrice(item.price) }}</strong>
                    <span v-if="item.isForRent" class="rent-period">{{ isRtl ? '/سنوياً' : '/year' }}</span>
                  </div>

                  <!-- Property Specs -->
                  <div class="property-specs">
                    <span class="spec-item"><i class="fa-solid fa-bed"></i> {{ item.beds }} {{ isRtl ? 'غرف' : 'Beds' }}</span>
                    <span class="spec-item"><i class="fa-solid fa-bath"></i> {{ item.baths }} {{ isRtl ? 'حمامات' : 'Baths' }}</span>
                    <span class="spec-item"><i class="fa-solid fa-expand"></i> {{ item.size }} {{ isRtl ? 'قدم²' : 'sqft' }}</span>
                  </div>

                  <!-- Engagement Metrics -->
                  <div class="metrics-row">
                    <div class="metric-cell" :title="isRtl ? 'إجمالي المشاهدات' : 'Total Views'">
                      <i class="fa-regular fa-eye"></i>
                      <b>{{ Number(item.views || 0).toLocaleString() }}</b>
                      <small>{{ isRtl ? 'مشاهدة' : 'Views' }}</small>
                    </div>
                    <div class="metric-cell" :title="isRtl ? 'مرات الحفظ في المفضلة' : 'Favorites'">
                      <i class="fa-solid fa-heart"></i>
                      <b>{{ item.saves || 0 }}</b>
                      <small>{{ isRtl ? 'حفظ' : 'Saves' }}</small>
                    </div>
                    <div class="metric-cell" :title="isRtl ? 'استفسارات المشترين' : 'Inquiries'">
                      <i class="fa-regular fa-user"></i>
                      <b>{{ item.leads || 0 }}</b>
                      <small>{{ isRtl ? 'استفسار' : 'Leads' }}</small>
                    </div>
                    <div class="metric-cell ai-match" :title="isRtl ? 'نسبة تطابق الذكاء الاصطناعي' : 'AI Match Score'">
                      <i class="fa-solid fa-wand-magic-sparkles"></i>
                      <b>{{ item.match || 90 }}%</b>
                      <small>{{ isRtl ? 'تطابق' : 'AI Match' }}</small>
                    </div>
                  </div>

                  <!-- Card Action Buttons -->
                  <div class="card-actions">
                    <button class="action-btn view-btn" @click="viewProperty(item)">
                      <span>{{ isRtl ? 'عرض التفاصيل' : 'View Details' }}</span>
                      <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                    </button>
                    <button class="action-btn edit-btn" :title="isRtl ? 'تعديل العقار' : 'Edit Property'" @click="editProperty(item)">
                      <i class="fa-solid fa-pen-to-square"></i>
                      <span>{{ isRtl ? 'تعديل' : 'Edit' }}</span>
                    </button>
                    <button class="action-btn delete-btn" :title="isRtl ? 'حذف العقار' : 'Delete Property'" @click="deleteProperty(item)">
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </article>
            </div>

            <!-- EMPTY STATE -->
            <div v-else class="empty-state-card">
              <div class="empty-icon-wrap">
                <i class="fa-regular fa-building"></i>
              </div>
              <h3>{{ isRtl ? 'لم يتم العثور على عقارات' : 'No properties found' }}</h3>
              <p>{{ isRtl ? 'جرب تغيير كلمة البحث أو الفلتر للعثور على النتائج المطلوبة.' : 'Try changing your search keywords or filter settings.' }}</p>
              <div class="empty-actions">
                <button v-if="search || typeFilter !== 'all' || selectedStatus !== 'all'" class="reset-filter-btn" @click="resetFilters">
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>{{ isRtl ? 'إعادة ضبط الفلاتر' : 'Reset Filters' }}</span>
                </button>
                <button class="empty-add-btn" @click="router.push('/add-property')">
                  <i class="fa-solid fa-plus"></i>
                  <span>{{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}</span>
                </button>
              </div>
            </div>
          </section>

          <!-- RIGHT INTELLIGENCE SIDEBAR -->
          <aside ref="inquiriesSection" class="right-column">
            <!-- RECENT INQUIRIES -->
            <section class="inquiries-panel">
              <div class="panel-header">
                <h3>
                  <i class="fa-regular fa-message"></i>
                  <span>{{ isRtl ? 'أحدث الاستفسارات' : 'Recent Inquiries' }}</span>
                </h3>
                <button class="panel-link-btn" @click="showToast(isRtl ? 'تم فتح جميع الاستفسارات' : 'All inquiries opened')">
                  <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
                  <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>
              </div>

              <div class="leads-list">
                <div v-for="lead in inquiries" :key="lead.name" class="lead-item">
                  <div class="lead-avatar" :style="{ backgroundColor: lead.color }">
                    {{ lead.initials }}
                  </div>
                  <div class="lead-info">
                    <div class="lead-top">
                      <b>{{ lead.name }}</b>
                      <time>{{ isRtl ? lead.timeAr : lead.time }}</time>
                    </div>
                    <small>{{ isRtl ? lead.messageAr : lead.message }}</small>
                  </div>
                </div>
              </div>
            </section>

            <!-- PERFORMANCE ANALYTICS -->
            <section class="performance-panel">
              <div class="panel-header">
                <h3>
                  <i class="fa-solid fa-chart-line"></i>
                  <span>{{ isRtl ? 'تحليلات الأداء' : 'Performance' }}</span>
                </h3>
                <span class="growth-tag">
                  <i class="fa-solid fa-arrow-trend-up"></i> +35%
                </span>
              </div>

              <div class="chart-bars-wrap">
                <div
                  v-for="(height, idx) in chartBars"
                  :key="idx"
                  class="chart-bar-item"
                  :title="`${height}%`"
                >
                  <div class="bar-fill" :style="{ height: `${height}%` }"></div>
                </div>
              </div>

              <div class="performance-summary">
                <p>
                  <b>+35%</b>
                  <span>{{ isRtl ? 'زيادة في المشاهدات مقارنة بالشهر الماضي' : 'views compared with last month' }}</span>
                </p>
              </div>
            </section>

            <!-- QUICK SHORTCUTS CARD -->
            <section class="quick-shortcuts-panel">
              <div class="panel-header">
                <h3>
                  <i class="fa-solid fa-bolt"></i>
                  <span>{{ isRtl ? 'إجراءات سريعة' : 'Quick Actions' }}</span>
                </h3>
              </div>
              <div class="shortcuts-btns">
                <button class="shortcut-btn primary" @click="router.push('/add-property')">
                  <i class="fa-solid fa-plus"></i>
                  <span>{{ isRtl ? 'إدراج عقار جديد' : 'List New Property' }}</span>
                </button>
                <button class="shortcut-btn" @click="showToast(isRtl ? 'جاري تصدير ملف التقرير العقاري...' : 'Exporting portfolio analytics report...')">
                  <i class="fa-solid fa-file-arrow-down"></i>
                  <span>{{ isRtl ? 'تصدير التقرير (PDF)' : 'Export Report (PDF)' }}</span>
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>

    <!-- TOAST NOTIFICATION -->
    <Transition name="toast">
      <div v-if="toastMessage" class="owner-toast">
        <i class="fa-solid fa-circle-check"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import propertyService from '../services/propertyService'
import authService from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

defineProps({
  embedded: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { isRtl, isDark } = useThemeAndLanguage()

// Current logged in user info
const readCurrentUser = () => {
  const stored = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user') || localStorage.getItem('user')
  let profile = {}
  try {
    profile = stored ? JSON.parse(stored) : {}
  } catch {}
  profile = profile?.data?.user || profile?.data || profile?.user || profile || {}

  return {
    name: profile.name || profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || localStorage.getItem('vibe_user_name') || 'Mohammed AL.Hwity',
    email: profile.email || localStorage.getItem('vibe_user_email') || 'malhwaiti@smail.ucas.edu.ps',
    avatar: profile.avatar || profile.profile_photo_url || profile.picture || profile.photo || profile.image || localStorage.getItem('vibe_user_avatar') || ''
  }
}

const currentUser = ref(readCurrentUser())
const initials = computed(() => {
  return currentUser.value.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'MH'
})

// Filters & Controls State
const selectedStatus = ref('all')
const search = ref('')
const sortBy = ref('newest')
const typeFilter = ref('all')
const toastMessage = ref('')
const inquiriesSection = ref(null)

// Fallback luxury Dubai properties
const fallbackProperties = [
  {
    id: 1,
    title: 'The Royal Atlantis Sky Villa',
    location: 'Palm Jumeirah, Dubai',
    price: 25000000,
    beds: 5,
    baths: 6,
    size: '7,200',
    status: 'active',
    featured: true,
    image: '/images/photo-1600596542815-ffad4c1539a9.jfif',
    views: 2450,
    saves: 320,
    leads: 28,
    match: 98,
    saved: true
  },
  {
    id: 2,
    title: 'Marina Shores Residence',
    location: 'Dubai Marina, Dubai',
    price: 4800000,
    beds: 3,
    baths: 4,
    size: '1,650',
    status: 'active',
    featured: false,
    image: '/images/photo-1512917774080-9991f1c4c750.jfif',
    views: 1892,
    saves: 214,
    leads: 18,
    match: 92,
    saved: false
  },
  {
    id: 3,
    title: 'Jumeirah Bay Island Mansion',
    location: 'Jumeirah Bay, Dubai',
    price: 12500000,
    beds: 4,
    baths: 5,
    size: '5,200',
    status: 'pending',
    featured: true,
    image: '/images/photo-1600585154340-be6161a56a0c.avif',
    views: 856,
    saves: 96,
    leads: 12,
    match: 88,
    saved: false
  },
  {
    id: 4,
    title: 'Emaar Beachfront Waterfront Haven',
    location: 'Emaar Beachfront, Dubai',
    price: 3200000,
    beds: 2,
    baths: 3,
    size: '1,400',
    status: 'rented',
    featured: false,
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    views: 1320,
    saves: 165,
    leads: 14,
    match: 91,
    saved: true,
    isForRent: true
  },
  {
    id: 5,
    title: 'Arabian Ranches Family Villa',
    location: 'Arabian Ranches, Dubai',
    price: 6800000,
    beds: 4,
    baths: 5,
    size: '4,100',
    status: 'draft',
    featured: false,
    image: '/images/photo-1613977257363-707ba9348227.jfif',
    views: 420,
    saves: 48,
    leads: 6,
    match: 76,
    saved: false
  },
  {
    id: 6,
    title: 'Downtown Views Luxury Apartment',
    location: 'Downtown Dubai',
    price: 5900000,
    beds: 3,
    baths: 4,
    size: '1,980',
    status: 'active',
    featured: false,
    image: '/images/photo-1600210492486-724fe5c67fb0.jfif',
    views: 3240,
    saves: 412,
    leads: 33,
    match: 94,
    saved: true
  },
  {
    id: 7,
    title: 'Dubai Hills Estate Signature Villa',
    location: 'Dubai Hills Estate, Dubai',
    price: 9750000,
    beds: 5,
    baths: 6,
    size: '4,800',
    status: 'sold',
    featured: true,
    image: '/images/photo-1512917774080-9991f1c4c750 (1).jfif',
    views: 1980,
    saves: 230,
    leads: 21,
    match: 89,
    saved: false
  }
]

const properties = ref([])

// Status Tabs definition with localized labels & badge colors
const statusTabs = [
  { value: 'all', label: 'All Properties', labelAr: 'كافة العقارات', color: '#2563eb' },
  { value: 'active', label: 'Active', labelAr: 'نشط', color: '#10b981' },
  { value: 'draft', label: 'Draft', labelAr: 'مسودة', color: '#64748b' },
  { value: 'pending', label: 'Pending', labelAr: 'قيد المراجعة', color: '#f59e0b' },
  { value: 'sold', label: 'Sold', labelAr: 'مباع', color: '#8b5cf6' },
  { value: 'rented', label: 'Rented', labelAr: 'مؤجر', color: '#0284c7' }
]

// Recent inquiries data
const inquiries = [
  {
    name: 'Sarah Johnson',
    initials: 'SJ',
    message: 'Enquired about Marina Shores Residence',
    messageAr: 'استفسرت بخصوص مارينا شورز ريزيدنس',
    time: '2 min ago',
    timeAr: 'منذ دقيقتين',
    color: '#8b5cf6'
  },
  {
    name: 'Mohammed Al Qassimi',
    initials: 'MQ',
    message: 'Enquired about Downtown Views',
    messageAr: 'استفسر بخصوص شقق داون تاون فيوز',
    time: '1 hour ago',
    timeAr: 'منذ ساعة',
    color: '#0284c7'
  },
  {
    name: 'Emma Wilson',
    initials: 'EW',
    message: 'Enquired about Jumeirah Bay Villa',
    messageAr: 'استفسرت عن فيلا جزيرة جميرا باي',
    time: '3 hours ago',
    timeAr: 'منذ ٣ ساعات',
    color: '#f59e0b'
  },
  {
    name: 'Ravi Kumar',
    initials: 'RK',
    message: 'Enquired about Arabian Ranches Villa',
    messageAr: 'استفسر عن فيلا المرابع العربية',
    time: '5 hours ago',
    timeAr: 'منذ ٥ ساعات',
    color: '#10b981'
  },
  {
    name: 'Lina Hassan',
    initials: 'LH',
    message: 'Enquired about Emaar Beachfront',
    messageAr: 'استفسرت عن إعمار بيتش فرونت',
    time: '1 day ago',
    timeAr: 'منذ يوم',
    color: '#ec4899'
  }
]

const chartBars = [35, 52, 44, 68, 59, 82, 74, 90, 78, 96, 88, 100]

// Counts per status
const statusCount = (status) => {
  if (status === 'all') return properties.value.length
  return properties.value.filter(p => p.status === status).length
}

// Stats overview cards computed
const stats = computed(() => [
  {
    key: 'total',
    label: isRtl.value ? 'إجمالي العقارات' : 'Total Listings',
    value: properties.value.length,
    note: isRtl.value ? '+20% عن الشهر السابق' : '+20% from last month',
    icon: 'fa-solid fa-building',
    color: '#2563eb',
    bgColor: isDark.value ? 'rgba(37, 99, 235, 0.15)' : 'rgba(37, 99, 235, 0.08)',
    trendIcon: 'fa-solid fa-arrow-trend-up'
  },
  {
    key: 'active',
    label: isRtl.value ? 'عقارات نشطة' : 'Active Listings',
    value: statusCount('active'),
    note: isRtl.value ? 'منشورة على المنصة' : 'Live on platform',
    icon: 'fa-solid fa-circle-check',
    color: '#10b981',
    bgColor: isDark.value ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)'
  },
  {
    key: 'pending',
    label: isRtl.value ? 'قيد المراجعة' : 'Pending Review',
    value: statusCount('pending'),
    note: isRtl.value ? 'بانتظار الموافقة' : 'Awaiting approval',
    icon: 'fa-regular fa-clock',
    color: '#f59e0b',
    bgColor: isDark.value ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.08)'
  },
  {
    key: 'closed',
    label: isRtl.value ? 'مباع / مؤجر' : 'Sold & Rented',
    value: statusCount('sold') + statusCount('rented'),
    note: isRtl.value ? 'صفقات مكتملة' : 'Completed deals',
    icon: 'fa-solid fa-handshake',
    color: '#8b5cf6',
    bgColor: isDark.value ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)'
  },
  {
    key: 'views',
    label: isRtl.value ? 'إجمالي المشاهدات' : 'Total Views',
    value: properties.value.reduce((acc, p) => acc + (Number(p.views) || 0), 0).toLocaleString(),
    note: isRtl.value ? '+35% عن الشهر السابق' : '+35% from last month',
    icon: 'fa-regular fa-eye',
    color: '#0284c7',
    bgColor: isDark.value ? 'rgba(2, 132, 199, 0.15)' : 'rgba(2, 132, 199, 0.08)',
    trendIcon: 'fa-solid fa-arrow-trend-up'
  },
  {
    key: 'leads',
    label: isRtl.value ? 'استفسارات جديدة' : 'New Leads',
    value: properties.value.reduce((acc, p) => acc + (Number(p.leads) || 0), 0),
    note: isRtl.value ? '+60% عملاء محتملون' : '+60% growth',
    icon: 'fa-solid fa-user-group',
    color: '#06b6d4',
    bgColor: isDark.value ? 'rgba(6, 182, 212, 0.15)' : 'rgba(6, 182, 212, 0.08)',
    trendIcon: 'fa-solid fa-arrow-trend-up'
  }
])

// Filtered and sorted properties list
const filteredProperties = computed(() => {
  let list = properties.value.filter(p => {
    // Status filter
    const matchesStatus = selectedStatus.value === 'all' || p.status === selectedStatus.value
    // Type filter
    const matchesType = typeFilter.value === 'all' ||
      (p.type && p.type.toLowerCase().includes(typeFilter.value.toLowerCase())) ||
      (p.title && p.title.toLowerCase().includes(typeFilter.value.toLowerCase()))
    // Text search
    const query = search.value.trim().toLowerCase()
    const matchesSearch = !query ||
      `${p.title} ${p.location} ${p.type || ''}`.toLowerCase().includes(query)

    return matchesStatus && matchesType && matchesSearch
  })

  return [...list].sort((a, b) => {
    if (sortBy.value === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0)
    if (sortBy.value === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0)
    if (sortBy.value === 'views') return (Number(b.views) || 0) - (Number(a.views) || 0)
    return b.id - a.id
  })
})

// Localized status labels
const labelStatus = (status) => {
  const mapEn = { active: 'Active', draft: 'Draft', pending: 'Pending', sold: 'Sold', rented: 'Rented' }
  const mapAr = { active: 'نشط', draft: 'مسودة', pending: 'قيد المراجعة', sold: 'مباع', rented: 'مؤجر' }
  return (isRtl.value ? mapAr[status] : mapEn[status]) || status
}

// Localized price formatting
const formatPrice = (price) => {
  const num = Number(price) || 0
  const formatted = num.toLocaleString()
  return isRtl.value ? `${formatted} د.إ` : `AED ${formatted}`
}

// Toast helper
const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    if (toastMessage.value === message) {
      toastMessage.value = ''
    }
  }, 3000)
}

// Actions
const viewProperty = (item) => {
  try {
    sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(item))
  } catch {}
  router.push(`/property/${item.id}`)
}

const editProperty = (item) => {
  try {
    localStorage.setItem('vibelocate:edit-property', JSON.stringify(item))
  } catch {}
  router.push({ path: '/add-property', query: { edit: item.id } })
}

const toggleSaved = (item) => {
  item.saved = !item.saved
  try {
    favoritesService.toggleSave(item)
  } catch {}
  showToast(
    item.saved
      ? (isRtl.value ? `تم حفظ "${item.title}" في المفضلة ❤️` : `Saved "${item.title}" to favorites ❤️`)
      : (isRtl.value ? `تمت إزالة "${item.title}" من المفضلة.` : `Removed "${item.title}" from favorites.`)
  )
}

const deleteProperty = (item) => {
  const confirmMsg = isRtl.value
    ? `هل أنت متأكد من حذف العقار "${item.title}"؟`
    : `Are you sure you want to delete "${item.title}"?`

  if (window.confirm(confirmMsg)) {
    properties.value = properties.value.filter(p => p.id !== item.id)

    // Also remove from user listings in localStorage if present
    try {
      const rawUserListings = localStorage.getItem('vibe_user_listings')
      if (rawUserListings) {
        const userListings = JSON.parse(rawUserListings).filter(p => p.id !== item.id)
        localStorage.setItem('vibe_user_listings', JSON.stringify(userListings))
      }
    } catch {}

    showToast(isRtl.value ? `تم حذف العقار "${item.title}" بنجاح.` : `Property "${item.title}" deleted successfully.`)
  }
}

const resetFilters = () => {
  search.value = ''
  typeFilter.value = 'all'
  selectedStatus.value = 'all'
  sortBy.value = 'newest'
}

const handleImgError = (event) => {
  event.target.src = '/images/photo-1600596542815-ffad4c1539a9.jfif'
}

const scrollToInquiries = () => {
  inquiriesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const logout = async () => {
  await authService.logout()
  router.push('/login')
}

// Data Initialization
onMounted(async () => {
  currentUser.value = readCurrentUser()

  // 1. Start with fallback list
  let loadedList = [...fallbackProperties]

  // 2. Read any user-created listings from localStorage
  try {
    const rawUserListings = localStorage.getItem('vibe_user_listings')
    if (rawUserListings) {
      const userListings = JSON.parse(rawUserListings)
      if (Array.isArray(userListings) && userListings.length) {
        const normalizedUserListings = userListings.map(u => ({
          ...u,
          id: u.id || Date.now(),
          status: u.status || 'active',
          views: u.views || 142,
          saves: u.saves || 12,
          leads: u.leads || 3,
          match: u.match || 95,
          price: typeof u.priceAed !== 'undefined' ? u.priceAed : (Number(String(u.price).replace(/[^0-9]/g, '')) || 2500000)
        }))
        // Prepend user listings so they appear first!
        loadedList = [...normalizedUserListings, ...loadedList]
      }
    }
  } catch (err) {
    console.warn('Could not read user listings from localStorage', err)
  }

  // 3. Sync saved state from favoritesService
  try {
    const savedIds = new Set(favoritesService.savedItems.value.map(s => String(s.id)))
    loadedList.forEach(item => {
      if (savedIds.has(String(item.id))) {
        item.saved = true
      }
    })
  } catch {}

  properties.value = loadedList

  // 4. Try fetching latest from Backend API
  try {
    const response = await propertyService.getProperties({ per_page: 30 })
    if (response?.data?.length) {
      const apiProps = response.data.map(p => ({
        ...p,
        status: p.moderation_status || p.status || 'active',
        featured: Boolean(p.is_featured),
        views: Number(p.views || 120),
        saves: Number(p.saves || 15),
        leads: Number(p.leads || 2),
        match: p.aiMatch || 92,
        size: p.size || p.area_sqft || '1,800',
        saved: favoritesService.isSaved(p.id)
      }))

      // Combine user listings + API properties
      const userCustom = properties.value.filter(p => String(p.id).length > 10)
      properties.value = [...userCustom, ...apiProps]
    }
  } catch (error) {
    console.warn('Backend API note: using cached/fallback properties list.', error)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@400;600;700;800&display=swap');

* {
  box-sizing: border-box;
}

/* ==================== ROOT CONTAINER & THEME VARIABLES ==================== */
.owner-page {
  width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #0f172a;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --surface-subtle: #f8fafc;
  --input-bg: #ffffff;
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
  --shadow-hover: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.owner-page.is-rtl {
  font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif;
  direction: rtl;
  text-align: right;
}

/* Standalone Page (When not embedded in ProfilePage) */
.owner-page:not(.embedded) {
  min-height: 100vh;
  background-color: #f1f5f9;
  padding: 24px;
}

/* Standalone Dark Mode */
.owner-page:not(.embedded).is-dark {
  background-color: #071626;
}

/* Global Dark Theme Variable Overrides */
.owner-page.is-dark,
:global([data-theme="dark"]) .owner-page {
  --card-bg: #0c2035;
  --card-border: #1c3b56;
  --text-main: #f8fafc;
  --text-muted: #94a9bd;
  --primary: #38bdf8;
  --primary-hover: #0ea5e9;
  --surface-subtle: #081a2d;
  --input-bg: #081a2d;
  --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.25);
  --shadow-hover: 0 10px 28px rgba(0, 0, 0, 0.45);
}

/* ==================== LAYOUT ==================== */
.owner-layout {
  display: flex;
  gap: 24px;
  width: 100%;
}

.owner-page.embedded .owner-layout {
  display: block;
  width: 100%;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ==================== STANDALONE HERO BANNER ==================== */
.dashboard-hero {
  border-radius: 16px;
  padding: 28px 32px;
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
}

.hero-text-box h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 6px 0;
}

.hero-text-box p {
  margin: 0;
  color: #cbd5e1;
  font-size: 14px;
}

.add-property-btn {
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
}

.add-property-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5);
}

/* ==================== STATS ROW ==================== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 9px;
  width: 100%;
}

@media (max-width: 1400px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card-box {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 11px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.stat-card-box:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(37, 99, 235, 0.3);
}

.stat-icon-wrap {
  width: 35px;
  height: 35px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.stat-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 10.5px;
  color: var(--text-muted);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-number {
  font-size: 17px;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
}

.stat-note {
  font-size: 9.5px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}

/* ==================== TOOLBAR & CONTROLS ==================== */
.toolbar-box {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 11px;
  padding: 8px 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.status-tabs-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.status-tab-btn {
  background: var(--surface-subtle);
  border: 1px solid var(--card-border);
  color: var(--text-muted);
  padding: 4px 10px;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 600;
  height: 29px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.status-tab-btn:hover {
  background: rgba(37, 99, 235, 0.08);
  color: var(--text-main);
}

.status-tab-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
}

.status-indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-tab-btn.active .status-indicator-dot {
  background-color: #ffffff !important;
}

.tab-count-badge {
  background: rgba(15, 23, 42, 0.08);
  color: inherit;
  padding: 0 5px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.status-tab-btn.active .tab-count-badge {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.search-actions-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.search-input-field {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 13px;
  color: var(--text-muted);
  pointer-events: none;
}

.is-rtl .search-icon {
  left: auto;
  right: 12px;
}

.search-input-field input {
  background: var(--input-bg);
  border: 1px solid var(--card-border);
  color: var(--text-main);
  padding: 5px 26px 5px 30px;
  border-radius: 18px;
  font-size: 11.5px;
  width: 180px;
  height: 29px;
  outline: none;
  transition: border-color 0.2s, width 0.2s, box-shadow 0.2s;
}

.is-rtl .search-input-field input {
  padding: 5px 30px 5px 26px;
}

.search-input-field input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  width: 200px;
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  font-size: 12px;
}

.is-rtl .clear-search-btn {
  right: auto;
  left: 10px;
}

.filter-select {
  background: var(--input-bg);
  border: 1px solid var(--card-border);
  color: var(--text-main);
  padding: 4px 10px;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 600;
  height: 29px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  border-color: #2563eb;
}

.primary-add-btn {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 5px 13px;
  border-radius: 18px;
  font-size: 11px;
  font-weight: 700;
  height: 29px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  white-space: nowrap;
}

.primary-add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
}

/* ==================== DASHBOARD GRID: LIST & SIDEBAR ==================== */
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 14px;
  align-items: flex-start;
  width: 100%;
}

@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .right-column {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 680px) {
  .right-column {
    grid-template-columns: 1fr;
  }
}

/* ==================== PROPERTY CARDS GRID ==================== */
.properties-catalog-column {
  min-width: 0;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 800px) {
  .properties-grid {
    grid-template-columns: 1fr;
  }
}

.property-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 13px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s, border-color 0.25s;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(37, 99, 235, 0.35);
}

.card-photo {
  position: relative;
  height: 130px;
  background-color: var(--surface-subtle);
  overflow: hidden;
}

.card-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.property-card:hover .card-photo img {
  transform: scale(1.05);
}

/* Status Pill */
.status-pill {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  border-radius: 16px;
  font-size: 9.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.is-rtl .status-pill {
  left: auto;
  right: 8px;
}

.status-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-pill.active {
  background: rgba(16, 185, 129, 0.9);
  color: #ffffff;
}
.status-pill.active .dot { background-color: #ffffff; }

.status-pill.pending {
  background: rgba(245, 158, 11, 0.9);
  color: #ffffff;
}
.status-pill.pending .dot { background-color: #ffffff; }

.status-pill.draft {
  background: rgba(100, 116, 139, 0.9);
  color: #ffffff;
}
.status-pill.draft .dot { background-color: #ffffff; }

.status-pill.sold {
  background: rgba(139, 92, 246, 0.9);
  color: #ffffff;
}
.status-pill.sold .dot { background-color: #ffffff; }

.status-pill.rented {
  background: rgba(2, 132, 199, 0.9);
  color: #ffffff;
}
.status-pill.rented .dot { background-color: #ffffff; }

/* Featured Badge */
.featured-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(245, 158, 11, 0.92);
  color: #ffffff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.is-rtl .featured-badge {
  left: auto;
  right: 8px;
}

/* Heart Button */
.heart-toggle-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 27px;
  height: 27px;
  font-size: 11px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  backdrop-filter: blur(4px);
}

.is-rtl .heart-toggle-btn {
  right: auto;
  left: 8px;
}

.heart-toggle-btn:hover {
  transform: scale(1.1);
  background: rgba(15, 23, 42, 0.85);
}

.heart-toggle-btn.is-saved {
  color: #ef4444;
  background: rgba(255, 255, 255, 0.9);
  border-color: #ef4444;
}

/* Card Body */
.card-body {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.card-header-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.property-title {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-location {
  font-size: 11px;
  color: var(--text-muted);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-location i {
  color: #ef4444;
  font-size: 11px;
}

.property-price-box {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.price-val {
  font-size: 15px;
  font-weight: 800;
  color: #2563eb;
  letter-spacing: -0.3px;
}

.is-dark .price-val {
  color: #38bdf8;
}

.rent-period {
  font-size: 11px;
  color: var(--text-muted);
}

/* Specs */
.property-specs {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: var(--text-muted);
  padding: 5px 0;
  border-top: 1px dashed var(--card-border);
  border-bottom: 1px dashed var(--card-border);
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.spec-item i {
  color: var(--text-muted);
  font-size: 11px;
}

/* Metrics Row */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: var(--surface-subtle);
  border-radius: 8px;
  padding: 5px 6px;
  text-align: center;
}

.metric-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.metric-cell i {
  font-size: 10px;
  color: #2563eb;
}

.is-dark .metric-cell i {
  color: #38bdf8;
}

.metric-cell b {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.1;
}

.metric-cell small {
  font-size: 8.5px;
  color: var(--text-muted);
}

.metric-cell.ai-match i {
  color: #8b5cf6;
}

.metric-cell.ai-match b {
  color: #8b5cf6;
}

/* Actions Row */
.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 4px;
}

.action-btn {
  height: 29px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn {
  flex: 1;
  background: #2563eb;
  color: #ffffff;
  border: none;
  gap: 6px;
}

.view-btn:hover {
  background: #1d4ed8;
}

.edit-btn {
  background: var(--surface-subtle);
  border: 1px solid var(--card-border);
  color: var(--text-main);
  padding: 0 12px;
  gap: 5px;
}

.edit-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.delete-btn {
  width: 29px;
  background: var(--surface-subtle);
  border: 1px solid var(--card-border);
  color: #ef4444;
}

.delete-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

/* Empty State */
.empty-state-card {
  background: var(--card-bg);
  border: 1px dashed var(--card-border);
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--surface-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--text-muted);
}

.empty-state-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.empty-state-card p {
  color: var(--text-muted);
  font-size: 13px;
  max-width: 380px;
  margin: 0;
}

.empty-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.reset-filter-btn {
  background: var(--surface-subtle);
  border: 1px solid var(--card-border);
  color: var(--text-main);
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-add-btn {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ==================== RIGHT COLUMN PANELS ==================== */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.inquiries-panel,
.performance-panel,
.quick-shortcuts-panel {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 11px 13px;
  box-shadow: var(--shadow-sm);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.panel-header h3 {
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.panel-header h3 i {
  color: #2563eb;
}

.is-dark .panel-header h3 i {
  color: #38bdf8;
}

.panel-link-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
}

.is-dark .panel-link-btn {
  color: #38bdf8;
}

/* Leads List */
.leads-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.lead-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--surface-subtle);
  transition: background 0.2s;
}

.lead-item:hover {
  background: rgba(37, 99, 235, 0.08);
}

.lead-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #ffffff;
  font-size: 9.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.lead-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.lead-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lead-top b {
  font-size: 12px;
  color: var(--text-main);
}

.lead-top time {
  font-size: 10px;
  color: var(--text-muted);
}

.lead-info small {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Performance Chart */
.growth-tag {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chart-bars-wrap {
  height: 60px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 6px 0 4px 0;
  border-bottom: 1px solid var(--card-border);
}

.chart-bar-item {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #38bdf8 0%, #2563eb 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
}

.chart-bar-item:hover .bar-fill {
  background: linear-gradient(180deg, #60a5fa 0%, #1d4ed8 100%);
}

.performance-summary {
  margin-top: 10px;
}

.performance-summary p {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.performance-summary b {
  color: #10b981;
  font-size: 13px;
}

/* Shortcuts */
.shortcuts-btns {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-btn {
  width: 100%;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--card-border);
  background: var(--surface-subtle);
  color: var(--text-main);
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 10px;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.shortcut-btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.shortcut-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.shortcut-btn.primary:hover {
  background: #1d4ed8;
  color: #ffffff;
}

/* Toast */
.owner-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #0f172a;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.is-rtl .owner-toast {
  right: auto;
  left: 24px;
}

.owner-toast i {
  color: #10b981;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
