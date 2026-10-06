<template>
  <div
    class="map-page-wrapper"
    :dir="isRtl ? 'rtl' : 'ltr'"
    :data-theme="currentTheme"
  >
    <!-- ==================== HERO / TITLE SECTION ==================== -->
    <section class="map-hero-section">
      <div class="map-hero-container">
        <div class="map-title-area">
          <div class="map-tag">
            <i class="fa-solid fa-satellite-dish"></i>
            <span>{{ t("mapHeroBadge") }}</span>
          </div>
          <h1 class="map-title">
            {{ t("mapTitlePart1") }}
            <span class="highlight">{{ t("mapTitlePart2") }}</span>
          </h1>
          <p class="map-subtitle">
            {{ t("mapSubtitle") }}
          </p>
        </div>
        <div class="map-quick-stats">
          <div class="stat-item">
            <span class="stat-num cyan">12</span
            ><span class="stat-lbl">{{ t("primeLandmarks") }}</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-item">
            <span class="stat-num emerald">98%</span
            ><span class="stat-lbl">{{ t("aiPrecision") }}</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat-item">
            <span class="stat-num">0.4 km</span
            ><span class="stat-lbl">{{ t("nearestProperty") }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FILTER CONTROLS BAR ==================== -->
    <section class="map-filter-section">
      <div class="filter-bar-card">
        <div class="filter-groups">
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-location-dot filter-icon"></i>
            <select
              id="filter-area"
              class="filter-select"
              aria-label="Select District"
            >
              <option value="all">{{ t("allDubaiDistricts") }}</option>
              <option value="Downtown Dubai">
                {{ isRtl ? "وسط مدينة دبي" : "Downtown Dubai" }}
              </option>
              <option value="Palm Jumeirah">
                {{ isRtl ? "نخلة جميرا" : "Palm Jumeirah" }}
              </option>
              <option value="Dubai Marina">
                {{ isRtl ? "مرسى دبي" : "Dubai Marina" }}
              </option>
              <option value="Business Bay">
                {{ isRtl ? "الخليج التجاري" : "Business Bay" }}
              </option>
              <option value="Dubai Hills Estate">
                {{ isRtl ? "دبي هيلز استيت" : "Dubai Hills Estate" }}
              </option>
              <option value="Arabian Ranches">
                {{ isRtl ? "المرابع العربية" : "Arabian Ranches" }}
              </option>
              <option value="DIFC">
                {{ isRtl ? "مركز دبي المالي العالمي" : "DIFC" }}
              </option>
              <option value="Dubai Creek Harbour">
                {{ isRtl ? "خور دبي" : "Dubai Creek Harbour" }}
              </option>
              <option value="Bluewaters Island">
                {{ isRtl ? "جزيرة بلوواترز" : "Bluewaters Island" }}
              </option>
              <option value="Dubai Silicon Oasis">
                {{ isRtl ? "واحة دبي للسيليكون" : "Dubai Silicon Oasis" }}
              </option>
              <option value="Jumeirah Village Circle">
                {{ isRtl ? "قرية جميرا الدائرية" : "Jumeirah Village Circle" }}
              </option>
              <option value="Jumeirah Beach Residence">
                {{ isRtl ? "جميرا بيتش ريزيدنس" : "Jumeirah Beach Residence" }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-building filter-icon"></i>
            <select
              id="filter-type"
              class="filter-select"
              aria-label="Property Type"
            >
              <option value="all">{{ t("allTypes") }}</option>
              <option value="Penthouse">
                {{ isRtl ? "بنتهاوس فاخر" : "Luxury Penthouse" }}
              </option>
              <option value="Villa">
                {{ isRtl ? "فيلا ساحلية" : "Seafront Villa" }}
              </option>
              <option value="Apartment">
                {{ isRtl ? "شقة عصرية" : "Modern Apartment" }}
              </option>
              <option value="Townhouse">
                {{ isRtl ? "تاون هاوس ذكي" : "Smart Townhouse" }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-coins filter-icon"></i>
            <select
              id="filter-price"
              class="filter-select"
              aria-label="Price Range"
            >
              <option value="all">{{ t("anyBudget") }}</option>
              <option value="under-5m">
                {{ isRtl ? "أقل من 5 مليون درهم" : "Under AED 5M" }}
              </option>
              <option value="5m-10m">
                {{ isRtl ? "5 - 10 مليون درهم" : "AED 5M - 10M" }}
              </option>
              <option value="above-10m">
                {{ isRtl ? "أكثر من 10 مليون درهم" : "Above AED 10M" }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
          <div class="filter-dropdown-wrap">
            <i class="fa-solid fa-wand-magic-sparkles filter-icon"></i>
            <select
              id="filter-vibe"
              class="filter-select"
              aria-label="Lifestyle Vibe"
            >
              <option value="all">
                {{ isRtl ? "جميع أنماط الحياة" : "All Lifestyle Vibes" }}
              </option>
              <option value="Waterfront / Sea View">
                {{
                  isRtl
                    ? "واجهة مائية وإطلالة بحرية"
                    : "Waterfront &amp; Sea View"
                }}
              </option>
              <option value="Sky High Luxury">
                {{ isRtl ? "بنتهاوس فاخر عالي" : "Sky-High Penthouse" }}
              </option>
              <option value="High ROI Investment">
                {{ isRtl ? "عائد استثماري مرتفع" : "High ROI Investment" }}
              </option>
              <option value="Green Family Oasis">
                {{ isRtl ? "مجتمع عائلي أخضر" : "Green Family Community" }}
              </option>
            </select>
            <i class="fa-solid fa-chevron-down chevron-icon"></i>
          </div>
        </div>
        <div class="filter-actions">
          <button id="btn-scan-map" class="btn-scan-map" type="button">
            <i class="fa-solid fa-radar"></i>
            <span>{{
              isRtl ? "مسح الخريطة بالذكاء الاصطناعي" : "Scan Map with AI"
            }}</span>
          </button>
          <button
            id="btn-reset-filters"
            class="btn-reset-filters"
            type="button"
            title="Reset All Filters"
          >
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ==================== MAIN MAP & SIDEBAR ==================== -->
    <main class="map-content-layout">
      <aside class="map-sidebar-panel">
        <div class="sidebar-header">
          <div class="sidebar-title-row">
            <div class="sidebar-title-info">
              <h2 class="sidebar-heading">
                {{ isRtl ? "عقارات قريبة" : "Properties in Range" }}
              </h2>
              <span id="nearby-count-badge" class="nearby-count-badge">{{
                isRtl ? "12 متاح" : "12 Available"
              }}</span>
            </div>
            <select
              id="sort-select"
              class="sort-select"
              aria-label="Sort properties"
            >
              <option value="ai-match">
                {{ isRtl ? "❆ أعلى تطابق ذكائي" : "❆ Highest AI Match" }}
              </option>
              <option value="distance">
                {{ isRtl ? "📍 الأقرب مسافةً" : "📍 Nearest Distance" }}
              </option>
              <option value="price-asc">{{ t("sortByPriceAsc") }}</option>
              <option value="price-desc">{{ t("sortByPriceDesc") }}</option>
            </select>
          </div>
          <div class="sidebar-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              id="sidebar-search-input"
              class="sidebar-search-input"
              type="text"
              :placeholder="
                isRtl
                  ? 'ابحث بالحي، المبنى، أو نمط الحياة...'
                  : 'Search by district, building, or lifestyle...'
              "
            />
          </div>
        </div>
        <div id="sidebar-properties-list" class="properties-scroll-list"></div>
      </aside>

      <section class="map-view-panel">
        <div id="leaflet-map"></div>

        <!-- POI Floating Controls Toolbar -->
        <div class="map-poi-dock" :dir="isRtl ? 'rtl' : 'ltr'">
          <div class="poi-dock-inner">
            <button
              type="button"
              class="poi-main-toggle"
              :class="{ active: showPois }"
              @click="togglePoiLayer"
              :title="
                isRtl
                  ? 'إظهار / إخفاء معالم ومرافق دبي'
                  : 'Toggle Dubai Points of Interest'
              "
            >
              <i class="fa-solid fa-map-pin"></i>
              <span>{{ isRtl ? "معالم دبي" : "Dubai POIs" }}</span>
              <span class="poi-count-badge" v-if="renderedPoisCount > 0">{{
                renderedPoisCount.toLocaleString()
              }}</span>
              <i
                v-if="loadingPois"
                class="fa-solid fa-spinner fa-spin poi-spin"
              ></i>
            </button>

            <div v-show="showPois" class="poi-chips-scroll">
              <button
                v-for="grp in poiFilterGroups"
                :key="grp.id"
                type="button"
                class="poi-chip-btn"
                :class="{ active: selectedPoiGroup === grp.id }"
                @click="changePoiGroup(grp.id)"
              >
                <span class="chip-emoji" v-if="grp.emoji">{{ grp.emoji }}</span>
                <i v-else-if="grp.icon" :class="grp.icon"></i>
                <span>{{ isRtl ? grp.labelAr : grp.labelEn }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="map-layer-selector">
          <button class="layer-btn active" data-layer="day" type="button">
            <i class="fa-solid fa-sun"></i><span>Day Luxury</span>
          </button>
          <button class="layer-btn" data-layer="satellite" type="button">
            <i class="fa-solid fa-earth-americas"></i><span>Satellite</span>
          </button>
          <button class="layer-btn" data-layer="dark" type="button">
            <i class="fa-solid fa-moon"></i><span>Night Mode</span>
          </button>
        </div>
        <div class="map-floating-controls">
          <button
            id="btn-my-location"
            class="map-control-btn btn-my-location"
            type="button"
            title="تحديد موقعي الحالي والمسافات (My Location)"
          >
            <i class="fa-solid fa-location-crosshairs"></i>
          </button>
          <button
            id="btn-locate"
            class="map-control-btn"
            type="button"
            title="Locate Center Area"
          >
            <i class="fa-solid fa-crosshairs"></i>
          </button>
          <button
            id="btn-reset-view"
            class="map-control-btn"
            type="button"
            title="Reset Map View"
          >
            <i class="fa-solid fa-compress"></i>
          </button>
        </div>

        <!-- Floating Directions & Route Panel -->
        <div id="map-route-card" class="map-route-card" style="display: none">
          <div class="route-card-header">
            <div class="route-header-title">
              <i class="fa-solid fa-diamond-turn-right route-icon"></i>
              <span>تخطيط الاتجاهات والمسار</span>
            </div>
            <button
              id="btn-close-route"
              class="btn-close-route"
              type="button"
              title="إلغاء المسار"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="route-card-content">
            <div class="route-prop-name" id="route-prop-title">--</div>
            <div class="route-stats-grid">
              <div class="route-stat-box">
                <div class="stat-icon-wrap">
                  <i class="fa-solid fa-route"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-val" id="route-distance-val"
                    >-- {{ isRtl ? "كم" : "km" }}</span
                  >
                  <span class="stat-lbl">{{ t("distanceFromYou") }}</span>
                </div>
              </div>
              <div class="route-stat-box">
                <div class="stat-icon-wrap time">
                  <i class="fa-solid fa-car-side"></i>
                </div>
                <div class="stat-info">
                  <span class="stat-val" id="route-duration-val"
                    >-- {{ isRtl ? "دقيقة" : "min" }}</span
                  >
                  <span class="stat-lbl">{{ t("drivingTime") }}</span>
                </div>
              </div>
            </div>
            <div class="route-actions-wrap">
              <a
                id="btn-gmaps-navigate"
                href="#"
                target="_blank"
                class="btn-open-gmaps"
              >
                <i class="fa-solid fa-map-location-dot"></i>
                <span>{{ t("navigateGoogleMaps") }}</span>
                <i
                  class="fa-solid fa-arrow-up-right-from-square external-icon"
                ></i>
              </a>
            </div>
          </div>
        </div>

        <div id="radar-sweep-overlay" class="radar-sweep-overlay">
          <div class="radar-beam"></div>
        </div>
      </section>
    </main>

    <!-- ==================== PROPERTY DETAILS MODAL ==================== -->
    <div
      id="property-details-modal"
      class="map-modal-backdrop"
      style="display: none"
    >
      <div class="map-modal-container">
        <button
          id="modal-close-btn"
          class="modal-close-btn"
          type="button"
          aria-label="Close modal"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="modal-hero-gallery">
          <img
            id="modal-main-img"
            class="modal-main-img"
            src=""
            alt="Property Gallery"
          />
        </div>
        <div class="modal-body-content">
          <div class="modal-price-row">
            <div>
              <div id="modal-prop-price" class="modal-price-val">AED 0</div>
              <div
                id="modal-prop-location"
                style="font-size: 0.85rem; color: #64748b; margin-top: 4px"
              ></div>
            </div>
            <div
              id="modal-ai-score-badge"
              class="prop-ai-pill"
              style="font-size: 0.85rem; padding: 6px 14px"
            >
              ❆ 98% AI Match
            </div>
          </div>
          <h2
            id="modal-prop-title"
            style="
              font-family: var(--font-heading);
              font-size: 1.4rem;
              color: #0f172a;
            "
          >
            Property Title
          </h2>
          <div class="modal-specs-grid">
            <div class="modal-spec-card">
              <i class="fa-solid fa-bed"></i
              ><span id="modal-spec-beds" class="val">0</span
              ><span class="lbl">Bedrooms</span>
            </div>
            <div class="modal-spec-card">
              <i class="fa-solid fa-bath"></i
              ><span id="modal-spec-baths" class="val">0</span
              ><span class="lbl">Bathrooms</span>
            </div>
            <div class="modal-spec-card">
              <i class="fa-solid fa-ruler-combined"></i
              ><span id="modal-spec-sqft" class="val">0</span
              ><span class="lbl">Sqft Area</span>
            </div>
            <div class="modal-spec-card">
              <i class="fa-solid fa-compass"></i
              ><span id="modal-spec-vibe" class="val" style="font-size: 0.75rem"
                >Lifestyle</span
              ><span class="lbl">Vibe Match</span>
            </div>
          </div>
          <div class="modal-ai-box">
            <i class="fa-solid fa-brain"></i>
            <div>
              <strong
                style="
                  color: #0284c7;
                  display: block;
                  font-size: 0.9rem;
                  margin-bottom: 4px;
                "
                >VibeLocate AI Smart Valuation &amp; Lifestyle Insight:</strong
              >
              <p id="modal-ai-summary-text"></p>
            </div>
          </div>
          <div class="modal-actions-row">
            <button
              class="modal-btn-contact"
              type="button"
              @click="contactVerifiedAgent"
            >
              <i class="fa-solid fa-phone"></i>
              <span>{{ isRtl ? 'تواصل مع الوكيل المعتمد' : 'Contact Verified Agent' }}</span>
            </button>
            <button
              id="modal-btn-directions"
              class="modal-btn-directions"
              type="button"
            >
              <i class="fa-solid fa-diamond-turn-right"></i>
              <span>{{ isRtl ? 'تخطيط الاتجاهات والمسار' : 'Get Route & Directions' }}</span>
            </button>
            <button
              class="modal-btn-share"
              type="button"
              :title="isRtl ? 'مشاركة رابط العقار' : 'Share property link'"
              @click="sharePropertyLink"
            >
              <i class="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- TOAST -->
    <div id="map-toast" class="map-toast">
      <i class="fa-solid fa-circle-check"></i
      ><span id="toast-message">Ready</span>
    </div>

    <!-- Saved Properties Modal -->
    <SavedPropertiesModal
      :is-open="isSavedModalOpen"
      @close="isSavedModalOpen = false"
      @open-property="handleOpenSavedProp"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { authService } from "../services/authService";
import { propertyService } from "../services/propertyService";
import { favoritesService } from "../services/favoritesService";
import { poiService, POI_FILTER_GROUPS } from "../services/poiService";
import SavedPropertiesModal from "./SavedPropertiesModal.vue";
import NavbarControls from "./NavbarControls.vue";
import { useThemeAndLanguage } from "../composables/useThemeAndLanguage";

const { t, isRtl, isDark, theme: currentTheme } = useThemeAndLanguage();

const router = useRouter();
const route = useRoute();

// POI layer state
const showPois = ref(true);
const selectedPoiGroup = ref("all");
const poiFilterGroups = POI_FILTER_GROUPS;
const totalPoisCount = ref(0);
const renderedPoisCount = ref(0);
const loadingPois = ref(false);
let rawPoisList = [];
let poiClusterLayer = null;

// Navbar states
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);
const profileMenuOpen = ref(false);
const profileDropdownRef = ref(null);
const isSavedModalOpen = ref(false);
const favorites = computed(() => favoritesService.savedKeys.value);

const handleOpenSavedProp = (prop) => {
  if (prop && prop.id && typeof openPropertyModal === "function") {
    openPropertyModal(prop.id);
  } else {
    router.push("/home#featured");
  }
};

const contactVerifiedAgent = () => {
  const activeId = window.__vibeMap?._activeModalPropId;
  const prop = currentProperties.find((p) => p.id === activeId);
  closePropertyModal();
  if (prop) {
    try {
      sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(prop));
    } catch {}
    router.push({ path: '/agent-contact', query: { propertyId: prop.id, agent: prop.title } });
  } else {
    router.push('/agent-contact');
  }
};

const sharePropertyLink = async () => {
  const activeId = window.__vibeMap?._activeModalPropId;
  const url = activeId ? `${window.location.origin}/property/${activeId}` : window.location.href;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    }
    showToast(isRtl.value ? '✅ تم نسخ رابط العقار إلى الحافظة بنجاح!' : '✅ Property link copied to clipboard!');
  } catch {
    showToast(url);
  }
};

// User state
const user = ref({
  name: "",
  email: "",
  avatar: "",
});

const isLoggedIn = computed(() => {
  return (
    authService.isAuthenticated() || !!(user.value.email || user.value.name)
  );
});

const displayName = computed(() => {
  return (
    user.value.name ||
    (user.value.email ? user.value.email.split("@")[0] : "Guest User")
  );
});

const displayEmail = computed(() => {
  return user.value.email || "guest@vibelocate.ai";
});

const userAvatarUrl = computed(() => {
  if (user.value.avatar && user.value.avatar.trim() !== "") {
    return user.value.avatar;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`;
});

const onAvatarError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`;
};

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value;
};

const handleLogout = async () => {
  profileMenuOpen.value = false;
  await authService.logout();
  localStorage.removeItem("auth_user");
  sessionStorage.removeItem("auth_user");
  localStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_token");
  user.value = { name: "", email: "", avatar: "" };
  showToast("Logged out successfully.");
  setTimeout(() => {
    router.push("/");
  }, 500);
};

const parseUserData = (raw) => {
  if (!raw) return null;
  const profile = raw?.data?.user || raw?.data || raw?.user || raw;
  const name =
    profile.name ||
    profile.full_name ||
    [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
    profile.username ||
    "";
  const email = profile.email || "";
  const avatar =
    profile.avatar ||
    profile.profile_photo_url ||
    profile.picture ||
    profile.photo ||
    profile.image ||
    "";
  if (name || email || avatar) {
    return { name, email, avatar };
  }
  return null;
};

const loadUserFromStorage = () => {
  const rawLocal =
    localStorage.getItem("auth_user") || localStorage.getItem("user");
  const rawSession =
    sessionStorage.getItem("auth_user") || sessionStorage.getItem("user");
  if (rawLocal) {
    try {
      const parsed = parseUserData(JSON.parse(rawLocal));
      if (parsed) user.value = { ...user.value, ...parsed };
    } catch {}
  } else if (rawSession) {
    try {
      const parsed = parseUserData(JSON.parse(rawSession));
      if (parsed) user.value = { ...user.value, ...parsed };
    } catch {}
  }
};

const handleDocumentClick = (e) => {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(e.target)
  ) {
    profileMenuOpen.value = false;
  }
};

const showAlert = (msg) => showToast(msg);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const STATIC_FALLBACK_PROPERTIES = [
  {
    id: 1,
    title: "The Royal Atlantis Sky Villa",
    area: "Palm Jumeirah",
    type: "Penthouse",
    priceAed: 18500000,
    priceFormatted: "AED 18,500,000",
    priceShort: "18.5M",
    period: "Sale",
    distanceKm: 0.4,
    distanceFormatted: "0.4 km away",
    aiScore: 99,
    rating: 4.9,
    beds: 4,
    baths: 5,
    sqft: 5420,
    vibe: "Waterfront / Sea View",
    lat: 25.1378,
    lng: 55.1272,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Ultra-rare panoramic sea view with private infinity pool and Michelin-star hotel amenities on the Palm crescent.",
    verified: true,
  },
  {
    id: 2,
    title: "Burj Crown Panorama Penthouse",
    area: "Downtown Dubai",
    type: "Penthouse",
    priceAed: 8450000,
    priceFormatted: "AED 8,450,000",
    priceShort: "8.45M",
    period: "Yearly",
    distanceKm: 0.8,
    distanceFormatted: "0.8 km away",
    aiScore: 98,
    rating: 4.9,
    beds: 3,
    baths: 4,
    sqft: 2850,
    vibe: "Sky High Luxury",
    lat: 25.1972,
    lng: 55.2744,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Unobstructed direct views of the Burj Khalifa and Dubai Fountain with direct air-conditioned mall link.",
    verified: true,
  },
  {
    id: 3,
    title: "Marina Gate Waterfront Haven",
    area: "Dubai Marina",
    type: "Apartment",
    priceAed: 4450000,
    priceFormatted: "AED 4,450,000",
    priceShort: "4.45M",
    period: "Yearly",
    distanceKm: 1.2,
    distanceFormatted: "1.2 km away",
    aiScore: 97,
    rating: 4.8,
    beds: 2,
    baths: 3,
    sqft: 1750,
    vibe: "Waterfront / Sea View",
    lat: 25.0847,
    lng: 55.1458,
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Frontline marina promenade residence with 50-meter lap pool, squash courts, and yacht club berths.",
    verified: true,
  },
  {
    id: 4,
    title: "One Palm Seaside Palace Villa",
    area: "Palm Jumeirah",
    type: "Villa",
    priceAed: 24000000,
    priceFormatted: "AED 24,000,000",
    priceShort: "24.0M",
    period: "Sale",
    distanceKm: 1.5,
    distanceFormatted: "1.5 km away",
    aiScore: 99,
    rating: 5.0,
    beds: 5,
    baths: 6,
    sqft: 7100,
    vibe: "Waterfront / Sea View",
    lat: 25.112,
    lng: 55.1389,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Iconic private beachfront mansion managed by Dorchester Collection with private jetty and beach cinema.",
    verified: true,
  },
  {
    id: 5,
    title: "The Opus Architectural Suite by Zaha Hadid",
    area: "Business Bay",
    type: "Apartment",
    priceAed: 6200000,
    priceFormatted: "AED 6,200,000",
    priceShort: "6.2M",
    period: "Sale",
    distanceKm: 1.9,
    distanceFormatted: "1.9 km away",
    aiScore: 96,
    rating: 4.8,
    beds: 2,
    baths: 3,
    sqft: 2100,
    vibe: "High ROI Investment",
    lat: 25.1889,
    lng: 55.2662,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Sculptural architectural masterpiece in the financial district offering 9.2% expected rental yield.",
    verified: true,
  },
  {
    id: 6,
    title: "Dubai Hills Golf Place Signature Villa",
    area: "Dubai Hills Estate",
    type: "Villa",
    priceAed: 12800000,
    priceFormatted: "AED 12,800,000",
    priceShort: "12.8M",
    period: "Sale",
    distanceKm: 2.7,
    distanceFormatted: "2.7 km away",
    aiScore: 96,
    rating: 4.9,
    beds: 6,
    baths: 7,
    sqft: 8200,
    vibe: "Green Family Oasis",
    lat: 25.1235,
    lng: 55.2481,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Championship 18-hole golf course frontage with expansive private landscaped park and smart home integration.",
    verified: true,
  },
  {
    id: 7,
    title: "Address Residences Sky View Suite",
    area: "Downtown Dubai",
    type: "Apartment",
    priceAed: 7900000,
    priceFormatted: "AED 7,900,000",
    priceShort: "7.9M",
    period: "Yearly",
    distanceKm: 3.1,
    distanceFormatted: "3.1 km away",
    aiScore: 98,
    rating: 4.9,
    beds: 3,
    baths: 4,
    sqft: 2600,
    vibe: "Sky High Luxury",
    lat: 25.2014,
    lng: 55.2703,
    image:
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Connected directly to metro and Dubai Mall with world-famous sky bridge infinity pool overlooking Burj Khalifa.",
    verified: true,
  },
  {
    id: 8,
    title: "Creek Horizon Twin Towers",
    area: "Dubai Creek Harbour",
    type: "Apartment",
    priceAed: 3850000,
    priceFormatted: "AED 3,850,000",
    priceShort: "3.85M",
    period: "Yearly",
    distanceKm: 3.8,
    distanceFormatted: "3.8 km away",
    aiScore: 94,
    rating: 4.7,
    beds: 2,
    baths: 2,
    sqft: 1580,
    vibe: "High ROI Investment",
    lat: 25.195,
    lng: 55.348,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Prime waterfront promenade overlooking Ras Al Khor flamingo sanctuary and the future landmark skyline.",
    verified: true,
  },
  {
    id: 9,
    title: "Arabian Ranches III Smart Garden Townhouse",
    area: "Arabian Ranches",
    type: "Townhouse",
    priceAed: 3200000,
    priceFormatted: "AED 3,200,000",
    priceShort: "3.2M",
    period: "Sale",
    distanceKm: 4.2,
    distanceFormatted: "4.2 km away",
    aiScore: 93,
    rating: 4.8,
    beds: 4,
    baths: 4,
    sqft: 2950,
    vibe: "Green Family Oasis",
    lat: 25.056,
    lng: 55.281,
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Serene gated family community featuring lazy river, bicycle tracks, tennis courts, and premier international schools.",
    verified: true,
  },
  {
    id: 10,
    title: "DIFC Gate Precinct Sky Residence",
    area: "DIFC",
    type: "Apartment",
    priceAed: 5900000,
    priceFormatted: "AED 5,900,000",
    priceShort: "5.9M",
    period: "Yearly",
    distanceKm: 4.5,
    distanceFormatted: "4.5 km away",
    aiScore: 96,
    rating: 4.8,
    beds: 2,
    baths: 3,
    sqft: 1950,
    vibe: "High ROI Investment",
    lat: 25.212,
    lng: 55.2815,
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Steps from international art galleries and award-winning fine dining inside Dubai International Financial Centre.",
    verified: true,
  },
  {
    id: 11,
    title: "Bluewaters Island Luxury Sea Residence",
    area: "Bluewaters Island",
    type: "Apartment",
    priceAed: 6750000,
    priceFormatted: "AED 6,750,000",
    priceShort: "6.75M",
    period: "Yearly",
    distanceKm: 5.0,
    distanceFormatted: "5.0 km away",
    aiScore: 95,
    rating: 4.9,
    beds: 3,
    baths: 3,
    sqft: 2300,
    vibe: "Waterfront / Sea View",
    lat: 25.0795,
    lng: 55.122,
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Exclusive island living at Ain Dubai with private footbridge connecting directly to Jumeirah Beach Residence.",
    verified: true,
  },
  {
    id: 12,
    title: "Il Primo Opera District Grand Penthouse",
    area: "Downtown Dubai",
    type: "Penthouse",
    priceAed: 14200000,
    priceFormatted: "AED 14,200,000",
    priceShort: "14.2M",
    period: "Sale",
    distanceKm: 5.4,
    distanceFormatted: "5.4 km away",
    aiScore: 98,
    rating: 5.0,
    beds: 4,
    baths: 5,
    sqft: 4900,
    vibe: "Sky High Luxury",
    lat: 25.1945,
    lng: 55.271,
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80",
    aiSummary:
      "Full-floor residence adjacent to Dubai Opera with private elevator, cigar lounge, and private wellness spa.",
    verified: true,
  },
];

const NEIGHBORHOOD_COORDS = {
  "palm jumeirah": [25.1124, 55.139],
  "dubai marina": [25.0805, 55.1403],
  "downtown dubai": [25.1972, 55.2744],
  downtown: [25.1972, 55.2744],
  "business bay": [25.185, 55.2644],
  "jumeirah lake towers": [25.075, 55.148],
  jlt: [25.075, 55.148],
  "dubai hills": [25.1235, 55.2481],
  "dubai hills estate": [25.1235, 55.2481],
  "al barari": [25.098, 55.312],
  "arabian ranches": [25.056, 55.281],
  "arabian ranches 3": [25.051, 55.291],
  "arabian ranches 2": [25.048, 55.275],
  "dubai creek": [25.195, 55.348],
  "dubai creek harbour": [25.195, 55.348],
  "jumeirah village circle": [25.06, 55.205],
  jvc: [25.06, 55.205],
  "jumeirah village triangle": [25.045, 55.195],
  jvt: [25.045, 55.195],
  "jumeirah beach residence": [25.08, 55.134],
  jbr: [25.08, 55.134],
  bluewaters: [25.0795, 55.122],
  "bluewaters island": [25.0795, 55.122],
  difc: [25.212, 55.2815],
  "dubai silicon oasis": [25.125, 55.38],
  meydan: [25.161, 55.295],
  "dubai harbour": [25.093, 55.139],
  "city walk": [25.208, 55.263],
  "damac hills": [25.025, 55.25],
  "damac hills 2": [24.975, 55.32],
  "damac lagoons": [25.015, 55.23],
  "al furjan": [25.022, 55.145],
  "discovery gardens": [25.039, 55.138],
  "motor city": [25.048, 55.239],
  mudon: [25.029, 55.268],
  "town square": [25.011, 55.291],
  deira: [25.2697, 55.3168],
  "bur dubai": [25.2532, 55.2972],
  mirdif: [25.2185, 55.4215],
  "dubai sports city": [25.038, 55.218],
  "sports city": [25.038, 55.218],
  "dubai south": [24.896, 55.161],
  "the valley": [24.995, 55.485],
  "tilal al ghaf": [25.021, 55.228],
  "al jaddaf": [25.218, 55.332],
  "culture village": [25.225, 55.338],
  greens: [25.093, 55.172],
  "the springs": [25.071, 55.176],
  "the lakes": [25.082, 55.171],
  "the views": [25.098, 55.175],
  "jumeirah islands": [25.068, 55.158],
  "jumeirah park": [25.052, 55.155],
  "jumeirah golf estates": [25.019, 55.195],
  "dubai production city": [25.028, 55.185],
  "dubai science park": [25.068, 55.251],
  "dubai studio city": [25.042, 55.248],
  "dubai internet city": [25.097, 55.162],
  "al sufouh": [25.109, 55.175],
  "umm suqeim": [25.148, 55.205],
  jumeirah: [25.185, 55.225],
  "al wasl": [25.201, 55.248],
  zaabeel: [25.218, 55.298],
  zabeel: [25.218, 55.298],
  "al safa": [25.182, 55.241],
};

let currentProperties = [...STATIC_FALLBACK_PROPERTIES];
let mapInstance = null,
  activeTileLayer = null,
  markersMap = new Map(),
  activePropertyId = null;
let propClusterLayer = null;
let filteredProperties = [...STATIC_FALLBACK_PROPERTIES],
  toastTimeout = null;

function formatMapProperty(raw) {
  const priceNum = Number(raw.price) || 0;
  let rawLat = parseFloat(
    raw.latitude ?? raw.lat ?? raw.location?.latitude ?? raw.location?.lat,
  );
  let rawLng = parseFloat(
    raw.longitude ?? raw.lng ?? raw.location?.longitude ?? raw.location?.lng,
  );
  const areaName =
    raw.neighborhood ||
    raw.neighborhood_name ||
    raw.location?.neighborhood_name ||
    raw.location?.address_line_1 ||
    (raw.address ? raw.address.split(",")[0].trim() : "Dubai");
  const type =
    raw.property_type ||
    (raw.type_id === 2
      ? "Villa"
      : raw.type_id === 3
        ? "Penthouse"
        : raw.type_id === 4
          ? "Townhouse"
          : "Apartment");
  const beds = Number(raw.bedrooms || 0);
  const baths = Number(raw.bathrooms || 0);
  const sqft = Math.round(Number(raw.area_sqft || 0));
  const img =
    raw.primary_image?.image_url ||
    raw.images?.find((image) => image.is_primary)?.image_url ||
    raw.images?.[0]?.image_url ||
    raw.image ||
    "/images/logo_transparent.png";

  let lat = rawLat;
  let lng = rawLng;

  // Check if coordinate is missing, invalid, or stuck at generic fallback 25.14 / 55.22
  const isGeneric =
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    (Math.abs(lat - 25.14) < 0.001 && Math.abs(lng - 55.22) < 0.001);
  if (isGeneric) {
    const locLower =
      `${areaName} ${raw.address || ""} ${raw.title || ""}`.toLowerCase();
    const match = Object.entries(NEIGHBORHOOD_COORDS).find(([name]) =>
      locLower.includes(name),
    );
    if (match) {
      const base = match[1];
      const jitterLat = (((Number(raw.id || 1) * 17) % 21) - 10) * 0.00045;
      const jitterLng = (((Number(raw.id || 1) * 23) % 21) - 10) * 0.00045;
      lat = base[0] + jitterLat;
      lng = base[1] + jitterLng;
    } else {
      const jitterLat = (((Number(raw.id || 1) * 13) % 19) - 9) * 0.0007;
      const jitterLng = (((Number(raw.id || 1) * 29) % 19) - 9) * 0.0007;
      lat = 25.1972 + jitterLat;
      lng = 55.2744 + jitterLng;
    }
  }

  // Distance relative to Downtown Dubai [25.1972, 55.2744]
  const dLat = (lat - 25.1972) * 111;
  const dLng = (lng - 55.2744) * 100;
  const dist = Math.max(
    0.2,
    Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10,
  );

  // Price formatting
  const priceFormatted = `AED ${priceNum.toLocaleString()}`;
  const priceShort =
    priceNum >= 1000000
      ? `${(priceNum / 1000000).toFixed(2).replace(/\.00$/, "")}M`
      : `${Math.round(priceNum / 1000)}K`;

  // Vibe classification
  let vibe = "High ROI Investment";
  const lowerTitle = (raw.title || "").toLowerCase();
  const lowerArea = areaName.toLowerCase();
  if (
    lowerArea.includes("palm") ||
    lowerArea.includes("marina") ||
    lowerArea.includes("beach") ||
    lowerArea.includes("creek")
  ) {
    vibe = "Waterfront / Sea View";
  } else if (
    type === "Penthouse" ||
    lowerTitle.includes("sky") ||
    lowerTitle.includes("luxury")
  ) {
    vibe = "Sky High Luxury";
  } else if (
    type === "Villa" ||
    lowerArea.includes("ranches") ||
    lowerArea.includes("hills") ||
    lowerArea.includes("oasis")
  ) {
    vibe = "Green Family Oasis";
  }

  const aiScore = 90 + ((raw.id * 7) % 10);

  return {
    id: raw.id,
    title: raw.title || `${type} in ${areaName}`,
    slug: raw.slug || "",
    area: areaName,
    type,
    priceAed: priceNum,
    priceFormatted,
    priceShort,
    period: "Sale",
    distanceKm: dist,
    distanceFormatted: `${dist} km away`,
    aiScore,
    rating: (4.5 + (raw.id % 5) * 0.1).toFixed(1),
    beds,
    baths,
    sqft: sqft || 2200,
    vibe,
    lat,
    lng,
    image: img,
    aiSummary: `Prime ${type.toLowerCase()} in ${areaName} featuring ${beds} bedrooms and high-spec interiors with excellent community amenities.`,
    verified: true,
  };
}

async function fetchLiveMapProperties() {
  try {
    let rawList = [];
    const res = await propertyService.getMapProperties();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      rawList = res.data;
    } else {
      const catalogRes = await propertyService.getProperties({ per_page: 100 });
      if (
        catalogRes?.success &&
        Array.isArray(catalogRes.data) &&
        catalogRes.data.length > 0
      ) {
        rawList = catalogRes.data;
      }
    }

    if (rawList.length > 0) {
      currentProperties = rawList.map(formatMapProperty);
      filteredProperties = [...currentProperties];
      if (mapInstance) {
        renderMarkers(filteredProperties);
        renderSidebarList(filteredProperties);
        if (route.query.id || (route.query.lat && route.query.lng)) {
          checkRouteQueryFocus();
        } else if (propClusterLayer) {
          try {
            const bounds = propClusterLayer.getBounds();
            if (bounds && bounds.isValid()) {
              mapInstance.fitBounds(bounds.pad(0.12), { maxZoom: 13 });
            }
          } catch (e) {
            console.warn("Map fitBounds error:", e);
          }
        }
      }
      showToast(
        isRtl.value
          ? `تم تحميل ${currentProperties.length} عقاراً في خريطة دبي الذكية`
          : `Loaded ${currentProperties.length} live properties on Dubai interactive map`,
      );
    }
  } catch (err) {
    console.warn("Map API load failed, keeping active properties:", err);
  }
}

const TILE_LAYERS = {
  day: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxZoom: 19,
    },
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      attribution: "&copy; Esri, Maxar, Earthstar Geographics",
      maxZoom: 18,
    },
  },
  dark: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    options: {
      attribution:
        '&copy; Esri, HERE, Garmin, OpenStreetMap contributors',
      maxNativeZoom: 16,
      maxZoom: 19,
    },
    referenceUrl:
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
  },
};

function loadLeaflet() {
  return new Promise((resolve) => {
    const loadCluster = () => {
      if (window.L && window.L.markerClusterGroup) {
        resolve();
        return;
      }
      if (!document.querySelector("link[data-cluster-css]")) {
        const c1 = document.createElement("link");
        c1.rel = "stylesheet";
        c1.href =
          "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
        c1.setAttribute("data-cluster-css", "true");
        document.head.appendChild(c1);

        const c2 = document.createElement("link");
        c2.rel = "stylesheet";
        c2.href =
          "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
        document.head.appendChild(c2);
      }
      const clusterScript = document.createElement("script");
      clusterScript.src =
        "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
      clusterScript.onload = () => resolve();
      clusterScript.onerror = () => resolve();
      document.head.appendChild(clusterScript);
    };

    if (window.L) {
      loadCluster();
      return;
    }

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = loadCluster;
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function checkRouteQueryFocus() {
  const q = route.query;
  if (!q) return;
  const id = q.id ? Number(q.id) : null;
  const lat = q.lat ? parseFloat(q.lat) : null;
  const lng = q.lng ? parseFloat(q.lng) : null;

  if (id && markersMap.has(id)) {
    selectProperty(id);
    return;
  }

  if (lat && lng && Number.isFinite(lat) && Number.isFinite(lng) && mapInstance) {
    mapInstance.flyTo([lat, lng], 15, { duration: 1.2 });
    if (id) {
      setTimeout(() => {
        if (markersMap.has(id)) {
          selectProperty(id);
        }
      }, 500);
    }
  }
}

function initMap() {
  const el = document.getElementById("leaflet-map");
  if (!el || !window.L) return;
  const L = window.L;
  mapInstance = L.map("leaflet-map", {
    center: [25.14, 55.22],
    zoom: 11,
    zoomControl: false,
  });
  L.control.zoom({ position: "bottomright" }).addTo(mapInstance);
  setTileLayer(isDark.value ? "dark" : "day");
  renderMarkers(filteredProperties);
  renderSidebarList(filteredProperties);
  checkRouteQueryFocus();
  mapInstance.on("click", (e) => {
    if (e.originalEvent.target.id === "leaflet-map") clearActiveStates();
  });
}

async function fetchAndRenderPois() {
  if (rawPoisList.length === 0) {
    loadingPois.value = true;
    try {
      rawPoisList = await poiService.loadPois();
      totalPoisCount.value = rawPoisList.length;
    } catch (e) {
      console.warn("Failed to load POIs in MapPage:", e);
    } finally {
      loadingPois.value = false;
    }
  }
  renderPoiMarkers();
}

function renderPoiMarkers() {
  if (!mapInstance || !window.L) return;

  if (poiClusterLayer) {
    mapInstance.removeLayer(poiClusterLayer);
    poiClusterLayer = null;
  }

  if (!showPois.value) {
    renderedPoisCount.value = 0;
    return;
  }

  const filtered = poiService.filterByGroup(
    rawPoisList,
    selectedPoiGroup.value,
  );
  renderedPoisCount.value = filtered.length;

  const L = window.L;

  if (typeof L.markerClusterGroup === "function") {
    poiClusterLayer = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 42,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        const cClass = count < 25 ? "sm" : count < 100 ? "md" : "lg";
        return L.divIcon({
          html: `<div class="poi-cluster-pill ${cClass}"><span>${count}</span></div>`,
          className: "poi-cluster-wrap",
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });
      },
    });
  } else {
    poiClusterLayer = L.layerGroup();
  }

  filtered.forEach((poi) => {
    const meta = poiService.getCategoryMeta(poi.subcategory);
    const poiIcon = L.divIcon({
      className: "poi-marker-container",
      html: `<div class="poi-pin-bubble" style="--poi-color:${meta.color};" title="${poi.name}">
              <span class="poi-pin-emoji">${poi.icon || meta.icon}</span>
             </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const marker = L.marker([poi.latitude, poi.longitude], { icon: poiIcon });
    const catLabel = isRtl.value ? meta.labelAr : meta.labelEn;
    const safeName = (poi.name || "").replace(/'/g, "\\'");

    const popupHtml = `
      <div class="poi-popup-card">
        <div class="poi-pop-header">
          <div class="poi-pop-icon" style="background:${meta.color}20; color:${meta.color}; border: 1px solid ${meta.color}45;">
            ${poi.icon || meta.icon}
          </div>
          <div class="poi-pop-info">
            <h4 class="poi-pop-name">${poi.name}</h4>
            <span class="poi-pop-badge" style="background:${meta.color}15; color:${meta.color};">${catLabel}</span>
          </div>
        </div>
        <div class="poi-pop-btn-row">
          <button class="poi-pop-nav-btn" onclick="window.__vibeMap.routeToPoi(${poi.latitude}, ${poi.longitude}, '${safeName}')">
            <i class="fa-solid fa-diamond-turn-right"></i>
            <span>${isRtl.value ? "رسم المسار والاتجاهات" : "Route Directions"}</span>
          </button>
          <a class="poi-pop-gmaps-btn" href="https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}" target="_blank" title="Google Maps">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>
    `;

    marker.bindPopup(
      L.popup({
        offset: [0, -10],
        closeButton: true,
        className: "custom-glass-popup poi-glass-popup",
      }).setContent(popupHtml),
    );

    poiClusterLayer.addLayer(marker);
  });

  mapInstance.addLayer(poiClusterLayer);
}

function togglePoiLayer() {
  showPois.value = !showPois.value;
  renderPoiMarkers();
  showToast(
    showPois.value
      ? isRtl.value
        ? `📍 تم إظهار معالم ومرافق دبي (${renderedPoisCount.value.toLocaleString()} موقع)`
        : `📍 Dubai POIs enabled (${renderedPoisCount.value.toLocaleString()} locations)`
      : isRtl.value
        ? "تم إخفاء معالم ومرافق دبي"
        : "Dubai POIs hidden",
  );
}

function changePoiGroup(groupId) {
  selectedPoiGroup.value = groupId;
  renderPoiMarkers();
  const grp = POI_FILTER_GROUPS.find((g) => g.id === groupId);
  const lbl = grp ? (isRtl.value ? grp.labelAr : grp.labelEn) : groupId;
  showToast(
    isRtl.value
      ? `فلترة المرافق: ${lbl} (${renderedPoisCount.value.toLocaleString()})`
      : `POI filter: ${lbl} (${renderedPoisCount.value.toLocaleString()})`,
  );
}

let activeTileLayerType = isDark.value ? "dark" : "day";

function setTileLayer(type) {
  const L = window.L,
    mapEl = document.getElementById("leaflet-map");
  if (!mapInstance || !L) return;
  activeTileLayerType = type;
  if (activeTileLayer) {
    mapInstance.removeLayer(activeTileLayer);
    activeTileLayer = null;
  }
  const cfg = TILE_LAYERS[type] || TILE_LAYERS.day;
  if (cfg.referenceUrl) {
    const base = L.tileLayer(cfg.url, cfg.options);
    const ref = L.tileLayer(cfg.referenceUrl, cfg.options);
    activeTileLayer = L.layerGroup([base, ref]).addTo(mapInstance);
  } else {
    activeTileLayer = L.tileLayer(cfg.url, cfg.options).addTo(mapInstance);
  }
  if (mapEl) mapEl.classList.toggle("dark-map-tiles", type === "dark");
  document
    .querySelectorAll(".layer-btn")
    .forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.layer === type),
    );
}

watch(isDark, (darkVal) => {
  if (activeTileLayerType !== "satellite") {
    setTileLayer(darkVal ? "dark" : "day");
  }
});

function markerHtml(property, isActive) {
  const cls = isActive ? "active-pin" : "";
  return `<div class="custom-radar-marker ${cls}" data-id="${property.id}" title="${property.title} - ${property.priceFormatted}"><div class="marker-radar-ring"></div><div class="marker-pin-bubble"><i class="fa-solid fa-location-dot"></i></div></div>`;
}

function createIcon(prop, isActive = false) {
  return window.L.divIcon({
    className: "radar-marker-container",
    html: markerHtml(prop, isActive),
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function popupHtml(p) {
  return `<div class="popup-prop-card"><div class="popup-img-wrap"><img src="${p.image}" alt="${p.title}"><div class="popup-ai-badge">❆ ${p.aiScore}% Match</div></div><div class="popup-body"><div class="popup-price">${p.priceFormatted}</div><div class="popup-title">${p.title}</div><div class="popup-location"><i class="fa-solid fa-location-dot" style="color:#0284c7"></i> ${p.area}, Dubai</div><div class="popup-specs"><span><i class="fa-solid fa-bed"></i> ${p.beds} Beds</span><span><i class="fa-solid fa-bath"></i> ${p.baths} Baths</span><span><i class="fa-solid fa-ruler-combined"></i> ${p.sqft.toLocaleString()} sqft</span></div><div class="popup-btn-row"><button class="popup-btn-detail" onclick="window.__vibeMap.openPropertyModal(${p.id})"><span>Explore</span><i class="fa-solid fa-arrow-right"></i></button><button class="popup-btn-route" onclick="window.__vibeMap.showRouteCard(${p.id})"><i class="fa-solid fa-diamond-turn-right"></i><span>اتجاهات</span></button></div></div></div>`;
}

function renderMarkers(props) {
  if (!mapInstance || !window.L) return;
  const L = window.L;

  markersMap.clear();

  if (propClusterLayer) {
    mapInstance.removeLayer(propClusterLayer);
    propClusterLayer = null;
  }

  if (typeof L.markerClusterGroup === "function") {
    propClusterLayer = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: true,
      disableClusteringAtZoom: 16,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        const cClass = count < 15 ? "sm" : count < 50 ? "md" : "lg";
        return L.divIcon({
          html: `<div class="prop-cluster-bubble ${cClass}" title="${count} ${isRtl.value ? "عقارات في هذه المنطقة" : "properties in this cluster"}">
                  <div class="prop-cluster-icon"><i class="fa-solid fa-building"></i></div>
                  <span class="prop-cluster-num">${count}</span>
                 </div>`,
          className: "prop-cluster-wrap",
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });
      },
    });
  } else {
    propClusterLayer = L.layerGroup();
  }

  const markersToAdd = [];
  props.forEach((p) => {
    const marker = L.marker([p.lat, p.lng], {
      icon: createIcon(p, p.id === activePropertyId),
    });
    marker.bindPopup(
      L.popup({
        offset: [0, -18],
        closeButton: true,
        autoPan: true,
        autoPanPadding: [30, 30],
        className: "custom-glass-popup",
      }).setContent(popupHtml(p)),
    );

    marker.on("click", () => selectProperty(p.id, true));
    markersMap.set(p.id, marker);
    markersToAdd.push(marker);
  });

  if (typeof propClusterLayer.addLayers === "function") {
    propClusterLayer.addLayers(markersToAdd);
  } else {
    markersToAdd.forEach((m) => propClusterLayer.addLayer(m));
  }

  mapInstance.addLayer(propClusterLayer);
}

function cardHtml(p) {
  const isActive = p.id === activePropertyId ? "active" : "";
  return `<div class="map-prop-card ${isActive}" id="prop-card-${p.id}" onclick="window.__vibeMap.selectProperty(${p.id})"><div class="prop-thumb-wrap"><img class="prop-thumb-img" src="${p.image}" alt="${p.title}"><div class="prop-distance-chip"><i class="fa-solid fa-location-arrow"></i> ${p.distanceFormatted}</div></div><div class="prop-card-details"><div class="prop-card-top"><span class="prop-ai-pill">❆ ${p.aiScore}% Match</span><span class="prop-rating"><i class="fa-solid fa-star"></i> ${p.rating}</span></div><div class="prop-card-title">${p.title}</div><div class="prop-card-location"><i class="fa-solid fa-location-dot" style="color:#0284c7"></i> ${p.area}</div><div class="prop-card-price">${p.priceFormatted} <span>/${p.period.toLowerCase()}</span></div><div class="prop-card-specs"><span><i class="fa-solid fa-bed"></i> ${p.beds} Beds</span><span><i class="fa-solid fa-bath"></i> ${p.baths} Baths</span><span><i class="fa-solid fa-ruler-combined"></i> ${p.sqft.toLocaleString()} sqft</span></div></div></div>`;
}

function renderSidebarList(props) {
  const container = document.getElementById("sidebar-properties-list");
  const countBadge = document.getElementById("nearby-count-badge");
  if (!container) return;
  if (countBadge)
    countBadge.textContent = isRtl.value
      ? `${props.length} متاح`
      : `${props.length} Available`;
  container.innerHTML =
    props.length === 0
      ? `<div class="sidebar-empty-state"><i class="fa-solid fa-map-location-dot"></i><p style="font-weight:600;color:#0f172a;">${isRtl.value ? "لا توجد عقارات تطابق هذا البحث" : "No properties match your filters"}</p><p style="font-size:0.78rem;color:#64748b;">${isRtl.value ? "جرب تعديل خيارات الفلترة أو إعادة التعيين." : "Try adjusting filters."}</p><button class="btn-scan-map" style="height:36px;font-size:0.8rem;margin-top:6px;" onclick="window.__vibeMap.resetAllFilters()">${isRtl.value ? "إعادة ضبط الفلاتر" : "Reset All Filters"}</button></div>`
      : props.map(cardHtml).join("");
}

function selectProperty(id, triggeredByMarker = false) {
  const prop = currentProperties.find((p) => p.id === id);
  if (!prop) return;
  activePropertyId = id;
  document
    .querySelectorAll(".map-prop-card")
    .forEach((c) => c.classList.toggle("active", c.id === `prop-card-${id}`));
  const activeCard = document.getElementById(`prop-card-${id}`);
  if (activeCard && !triggeredByMarker)
    activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  markersMap.forEach((marker, mId) => {
    const p = currentProperties.find((x) => x.id === mId);
    if (p) marker.setIcon(createIcon(p, mId === id));
  });
  const marker = markersMap.get(id);
  if (marker && mapInstance) {
    if (
      propClusterLayer &&
      typeof propClusterLayer.zoomToShowLayer === "function"
    ) {
      propClusterLayer.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
    } else {
      mapInstance.flyTo([prop.lat, prop.lng], 15, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
      setTimeout(() => marker.openPopup(), 400);
    }
  }
}

function clearActiveStates() {
  activePropertyId = null;
  document
    .querySelectorAll(".map-prop-card")
    .forEach((c) => c.classList.remove("active"));
  markersMap.forEach((marker, mId) => {
    const p = currentProperties.find((x) => x.id === mId);
    if (p) marker.setIcon(createIcon(p, false));
  });
}

function sortProperties() {
  const sortVal = document.getElementById("sort-select")?.value || "ai-match";
  filteredProperties.sort((a, b) => {
    if (sortVal === "ai-match") return b.aiScore - a.aiScore;
    if (sortVal === "price-asc") return a.priceAed - b.priceAed;
    if (sortVal === "price-desc") return b.priceAed - a.priceAed;
    if (sortVal === "distance") return a.distanceKm - b.distanceKm;
    return 0;
  });
}

function applyFilters() {
  const g = (id) => document.getElementById(id)?.value || "all";
  const areaVal = g("filter-area"),
    typeVal = g("filter-type"),
    priceVal = g("filter-price"),
    vibeVal = g("filter-vibe");
  const searchVal = (
    document.getElementById("sidebar-search-input")?.value || ""
  )
    .toLowerCase()
    .trim();
  filteredProperties = currentProperties.filter((item) => {
    if (areaVal !== "all") {
      const matchArea =
        item.area.toLowerCase().includes(areaVal.toLowerCase()) ||
        areaVal.toLowerCase().includes(item.area.toLowerCase()) ||
        (item.title &&
          item.title.toLowerCase().includes(areaVal.toLowerCase()));
      if (!matchArea) return false;
    }
    if (typeVal !== "all" && item.type.toLowerCase() !== typeVal.toLowerCase())
      return false;
    if (vibeVal !== "all" && item.vibe !== vibeVal) return false;
    if (priceVal === "under-5m" && item.priceAed >= 5000000) return false;
    if (
      priceVal === "5m-10m" &&
      (item.priceAed < 5000000 || item.priceAed > 10000000)
    )
      return false;
    if (priceVal === "above-10m" && item.priceAed <= 10000000) return false;
    if (
      searchVal &&
      !`${item.title} ${item.area} ${item.type} ${item.vibe} ${item.aiSummary}`
        .toLowerCase()
        .includes(searchVal)
    )
      return false;
    return true;
  });
  sortProperties();
  renderMarkers(filteredProperties);
  renderSidebarList(filteredProperties);
  if (filteredProperties.length > 0 && mapInstance && propClusterLayer) {
    try {
      const bounds = propClusterLayer.getBounds();
      if (bounds && bounds.isValid()) {
        mapInstance.flyToBounds(bounds.pad(0.15), {
          duration: 1.0,
          maxZoom: 14,
        });
      }
    } catch (e) {
      console.warn("flyToBounds error:", e);
    }
  }
}

function triggerAiRadarScan() {
  const btn = document.getElementById("btn-scan-map"),
    overlay = document.getElementById("radar-sweep-overlay");
  if (btn) btn.classList.add("scanning");
  if (overlay) overlay.classList.add("active");
  showToast(
    isRtl.value
      ? "❆ رادار الذكاء الاصطناعي: جاري مسح أحياء دبي لاكتشاف العقارات..."
      : "❆ AI Radar: Actively scanning Dubai districts for premium properties...",
  );
  setTimeout(() => {
    if (btn) btn.classList.remove("scanning");
    if (overlay) overlay.classList.remove("active");
    
    // Sort by AI match score
    const sortEl = document.getElementById("sort-select");
    if (sortEl) sortEl.value = "ai-match";
    sortProperties();
    renderMarkers(filteredProperties);
    renderSidebarList(filteredProperties);

    const topProp = filteredProperties[0] || currentProperties[0];
    if (topProp && mapInstance) {
      selectProperty(topProp.id);
      mapInstance.flyTo([topProp.lat, topProp.lng], 14, { duration: 1.5 });
      showToast(
        isRtl.value
          ? `❆ أفضل تطابق ذكي: ${topProp.title} بنسبة ${topProp.aiScore}%!`
          : `❆ Top AI Match Detected: ${topProp.title} (${topProp.aiScore}% Match)!`,
      );
    } else {
      showToast(
        isRtl.value
          ? `❆ اكتمل المسح: تم العثور على ${filteredProperties.length} عقاراً!`
          : `❆ Radar Scan Complete: ${filteredProperties.length} properties detected!`,
      );
    }
  }, 1200);
}

function resetAllFilters() {
  ["filter-area", "filter-type", "filter-price", "filter-vibe"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.value = "all";
    },
  );
  const search = document.getElementById("sidebar-search-input");
  if (search) search.value = "";
  applyFilters();
  if (mapInstance) {
    mapInstance.flyTo([25.14, 55.22], 11, { duration: 1.2 });
  }
  showToast(
    isRtl.value
      ? "تمت إعادة ضبط جميع الفلاتر واستعادة عرض دبي الشامل."
      : "All map filters have been reset.",
  );
}

function openPropertyModal(id) {
  const prop = currentProperties.find((p) => p.id === id),
    modal = document.getElementById("property-details-modal");
  if (!prop || !modal) return;
  window.__vibeMap._activeModalPropId = id;
  document.getElementById("modal-main-img").src = prop.image;
  document.getElementById("modal-prop-title").textContent = prop.title;
  document.getElementById("modal-prop-location").innerHTML =
    `<i class="fa-solid fa-location-dot" style="color:#0284c7"></i> ${prop.area}, Dubai`;
  document.getElementById("modal-prop-price").textContent = prop.priceFormatted;
  document.getElementById("modal-ai-score-badge").textContent =
    `❆ ${prop.aiScore}% AI Match`;
  document.getElementById("modal-spec-beds").textContent = prop.beds;
  document.getElementById("modal-spec-baths").textContent = prop.baths;
  document.getElementById("modal-spec-sqft").textContent =
    prop.sqft.toLocaleString();
  document.getElementById("modal-spec-vibe").textContent = prop.vibe;
  document.getElementById("modal-ai-summary-text").textContent = prop.aiSummary;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closePropertyModal() {
  const modal = document.getElementById("property-details-modal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

function showToast(msg) {
  const toast = document.getElementById("map-toast"),
    toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;
  toastMsg.textContent = msg;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("visible"), 3000);
}

const handleKeyDown = (e) => {
  if (e.key === "Escape") closePropertyModal();
};

function setupEvents() {
  ["filter-area", "filter-type", "filter-price", "filter-vibe"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", applyFilters);
    },
  );
  const sortEl = document.getElementById("sort-select");
  if (sortEl)
    sortEl.addEventListener("change", () => {
      sortProperties();
      renderSidebarList(filteredProperties);
    });
  const searchInput = document.getElementById("sidebar-search-input");
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  const scanBtn = document.getElementById("btn-scan-map");
  if (scanBtn) scanBtn.addEventListener("click", triggerAiRadarScan);
  const resetBtn = document.getElementById("btn-reset-filters");
  if (resetBtn) resetBtn.addEventListener("click", resetAllFilters);
  document.querySelectorAll(".layer-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      setTileLayer(btn.dataset.layer);
      showToast(`Map style switched to: ${btn.dataset.layer.toUpperCase()}`);
    }),
  );
  const btnLocate = document.getElementById("btn-locate");
  if (btnLocate)
    btnLocate.addEventListener("click", () => {
      if (mapInstance) {
        mapInstance.flyTo([25.1972, 55.2744], 13, { duration: 1.5 });
        showToast("Centered on Downtown Dubai & Burj Khalifa area");
      }
    });
  const btnReset = document.getElementById("btn-reset-view");
  if (btnReset)
    btnReset.addEventListener("click", () => {
      if (mapInstance) {
        mapInstance.flyTo([25.14, 55.22], 11, { duration: 1.2 });
        clearActiveStates();
        showToast("Map view reset to full Dubai overview");
      }
    });
  const modalCloseBtn = document.getElementById("modal-close-btn");
  if (modalCloseBtn)
    modalCloseBtn.addEventListener("click", closePropertyModal);
  const modalBackdrop = document.getElementById("property-details-modal");
  if (modalBackdrop)
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closePropertyModal();
    });

  // ─── My Location Button ────────────────────────────────────────────────────
  const btnMyLocation = document.getElementById("btn-my-location");
  if (btnMyLocation) {
    btnMyLocation.addEventListener("click", () => {
      if (!navigator.geolocation) {
        showToast("⚠️ متصفحك لا يدعم تحديد الموقع الجغرافي");
        return;
      }
      btnMyLocation.classList.add("locating");
      showToast("📍 جاري تحديد موقعك الحالي...");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          btnMyLocation.classList.remove("locating");
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          window.__vibeMap._userLat = userLat;
          window.__vibeMap._userLng = userLng;

          // Remove old user marker if exists
          if (window.__vibeMap._userMarker) {
            window.__vibeMap._userMarker.remove();
          }

          // Add pulsing user location marker
          const userIcon = window.L.divIcon({
            className: "",
            html: `<div class="user-location-marker"><div class="user-pulse-ring"></div><div class="user-dot"></div></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          });
          const userMarker = window.L.marker([userLat, userLng], {
            icon: userIcon,
            zIndexOffset: 2000,
          }).addTo(mapInstance);
          userMarker.bindPopup(
            `<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:8px 4px;font-size:0.85rem;font-weight:700;color:#0f172a;display:flex;align-items:center;gap:6px;"><i class="fa-solid fa-circle-user" style="color:#0284c7"></i>موقعك الحالي</div>`,
          );
          window.__vibeMap._userMarker = userMarker;

          // Re-calculate live distance for all properties and re-render
          currentProperties = currentProperties.map((p) => {
            const dLat = (p.lat - userLat) * 111;
            const dLng = (p.lng - userLng) * 100;
            const realDist = Math.max(
              0.1,
              Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10,
            );
            return {
              ...p,
              distanceKm: realDist,
              distanceFormatted: `${realDist} كم منك`,
            };
          });
          filteredProperties = [...currentProperties];
          sortProperties();
          renderMarkers(filteredProperties);
          renderSidebarList(filteredProperties);

          mapInstance.flyTo([userLat, userLng], 13, { duration: 1.5 });
          showToast(
            `✅ تم تحديد موقعك! أقرب عقار يبعد ${currentProperties.reduce((a, b) => (a.distanceKm < b.distanceKm ? a : b)).distanceFormatted}`,
          );
        },
        (err) => {
          btnMyLocation.classList.remove("locating");
          showToast("⚠️ لم نتمكن من تحديد موقعك. تأكد من منح الإذن.");
          console.warn("Geolocation error:", err);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    });
  }

  // ─── Route Card Close Button ───────────────────────────────────────────────
  const btnCloseRoute = document.getElementById("btn-close-route");
  if (btnCloseRoute) {
    btnCloseRoute.addEventListener("click", () => {
      const card = document.getElementById("map-route-card");
      if (card) {
        card.style.display = "none";
      }
      if (window.__vibeMap._routeLine) {
        window.__vibeMap._routeLine.remove();
        window.__vibeMap._routeLine = null;
      }
    });
  }

  // ─── Modal Directions Button ───────────────────────────────────────────────
  const btnModalDir = document.getElementById("modal-btn-directions");
  if (btnModalDir) {
    btnModalDir.addEventListener("click", () => {
      const activeId = window.__vibeMap._activeModalPropId;
      if (!activeId) return;
      const prop = currentProperties.find((p) => p.id === activeId);
      if (!prop) return;
      closePropertyModal();
      showRouteCard(prop);
    });
  }
}

// ─── Show Route Card ─────────────────────────────────────────────────────────
function showRouteCard(prop) {
  const card = document.getElementById("map-route-card");
  if (!card) return;

  const userLat = window.__vibeMap?._userLat;
  const userLng = window.__vibeMap?._userLng;

  // Update prop title
  const titleEl = document.getElementById("route-prop-title");
  if (titleEl) titleEl.textContent = prop.title;

  // Calculate real distance if user location known
  let distKm = prop.distanceKm || 0;
  if (userLat && userLng) {
    const dLat = (prop.lat - userLat) * 111;
    const dLng = (prop.lng - userLng) * 100;
    distKm = Math.max(
      0.1,
      Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10,
    );
  } else if (!distKm) {
    const dLat = (prop.lat - 25.1972) * 111;
    const dLng = (prop.lng - 55.2744) * 100;
    distKm = Math.max(
      0.1,
      Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10,
    );
  }

  const durationMin = Math.round(distKm / 0.5); // ~30 km/h avg Dubai traffic

  const distEl = document.getElementById("route-distance-val");
  const durEl = document.getElementById("route-duration-val");
  if (distEl) distEl.textContent = `${distKm} كم`;
  if (durEl) durEl.textContent = `~${durationMin} دقيقة`;

  // Google Maps navigation link
  const gmapsBtn = document.getElementById("btn-gmaps-navigate");
  if (gmapsBtn) {
    const origin = userLat && userLng ? `${userLat},${userLng}` : "My+Location";
    gmapsBtn.href = `https://www.google.com/maps/dir/${origin}/${prop.lat},${prop.lng}`;
  }

  // Draw dashed route line on map
  if (window.__vibeMap._routeLine) window.__vibeMap._routeLine.remove();
  if (userLat && userLng && mapInstance) {
    window.__vibeMap._routeLine = window.L.polyline(
      [
        [userLat, userLng],
        [prop.lat, prop.lng],
      ],
      { color: "#0284c7", weight: 3, dashArray: "8 8", opacity: 0.85 },
    ).addTo(mapInstance);
    mapInstance.fitBounds(
      [
        [userLat, userLng],
        [prop.lat, prop.lng],
      ],
      { padding: [60, 60] },
    );
  } else if (mapInstance) {
    mapInstance.flyTo([prop.lat, prop.lng], 14, { duration: 1.2 });
  }

  card.style.display = "block";
  showToast(`🗺️ تخطيط المسار إلى: ${prop.title}`);
}

onMounted(async () => {
  loadUserFromStorage();
  if (authService.isAuthenticated()) {
    try {
      const res = await authService.getProfile();
      const parsed = parseUserData(res);
      if (parsed) {
        user.value = { ...user.value, ...parsed };
        localStorage.setItem("auth_user", JSON.stringify(user.value));
      }
    } catch (err) {
      console.warn("Profile fetch failed in MapPage:", err);
    }
  }
  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  window.addEventListener("keydown", handleKeyDown);
  window.__vibeMap = {
    openPropertyModal,
    selectProperty,
    resetAllFilters,
    showRouteCard: (id) => {
      const prop = currentProperties.find((p) => p.id === id);
      if (prop) showRouteCard(prop);
    },
    routeToPoi: (lat, lng, name) => {
      showRouteCard({
        title: name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        distanceKm: 0,
      });
    },
  };
  await loadLeaflet();
  initMap();
  setupEvents();
  fetchLiveMapProperties();
  fetchAndRenderPois();
});

watch(
  () => route.query,
  () => {
    checkRouteQueryFocus();
  },
  { deep: true }
);

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
  if (poiClusterLayer && mapInstance) {
    mapInstance.removeLayer(poiClusterLayer);
    poiClusterLayer = null;
  }
  if (propClusterLayer && mapInstance) {
    mapInstance.removeLayer(propClusterLayer);
    propClusterLayer = null;
  }
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  delete window.__vibeMap;
});
</script>

<style scoped>
.map-page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  color: #0f172a;
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(2, 132, 199, 0.08) 0%,
      transparent 60%
    ),
    radial-gradient(
      circle at 90% 80%,
      rgba(5, 150, 105, 0.05) 0%,
      transparent 50%
    ),
    #f4f6fa;
}
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 68px;
  z-index: 1200;
  background-color: rgba(6, 16, 30, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.site-header.scrolled {
  background-color: rgba(6, 16, 30, 0.98);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
  border-bottom-color: rgba(0, 210, 255, 0.25);
}
.header-inner {
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
}
.brand-text {
  display: flex;
  align-items: center;
  gap: 6px;
}
.brand-title {
  font-family: "Outfit", sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
  line-height: 1;
}
.brand-accent {
  color: #00d2ff;
  text-shadow: 0 0 16px rgba(0, 210, 255, 0.35);
}
.brand-badge {
  background: linear-gradient(135deg, #2563eb, #00d2ff);
  color: #ffffff;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 2px 7px;
  border-radius: 5px;
  box-shadow: 0 2px 6px rgba(0, 210, 255, 0.3);
}
.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: center;
}
.nav-item {
  position: relative;
  font-size: 0.88rem;
  font-weight: 500;
  color: #cbd5e1;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 8px;
  transition:
    color 0.2s,
    background 0.2s;
  white-space: nowrap;
}
.nav-item::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: #00d2ff;
  transition: width 0.25s ease;
}
.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.06);
}
.nav-item:hover::after {
  width: 60%;
}
.nav-item.active {
  color: #00d2ff;
  font-weight: 700;
}
.nav-item.active::after {
  width: 60%;
  background: #00d2ff;
  box-shadow: 0 -2px 8px rgba(0, 210, 255, 0.35);
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.btn-list-property {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  transition:
    background 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  white-space: nowrap;
}
.btn-list-property:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
}
.btn-list-property .plus-sign {
  font-weight: 700;
  font-size: 0.95rem;
  margin-left: 2px;
}
.icon-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}
.icon-action-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 210, 255, 0.3);
}

/* User Profile & Dropdown */
.user-profile-menu-container {
  position: relative;
}
.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px;
  border-radius: 9999px;
  transition: all 0.2s ease;
  user-select: none;
}
.user-profile-menu:hover {
  background: rgba(255, 255, 255, 0.08);
}
.header-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(0, 210, 255, 0.45);
  transition:
    border-color 0.2s,
    transform 0.2s;
  cursor: pointer;
}
.header-avatar:hover {
  border-color: #00d2ff;
  transform: scale(1.06);
}
.profile-arrow {
  color: #94a3b8;
  font-size: 10px;
  transition: transform 0.25s ease;
}
.profile-arrow.rotate-180 {
  transform: rotate(180deg);
  color: #00d2ff;
}
.profile-dropdown-box {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 280px;
  background: rgba(10, 22, 40, 0.97);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(24px);
  border-radius: 16px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.55);
  padding: 16px;
  z-index: 1500;
  animation: dropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.dropdown-user-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dropdown-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #00d2ff;
  box-shadow: 0 2px 8px rgba(0, 210, 255, 0.35);
  flex-shrink: 0;
}
.dropdown-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dropdown-user-name {
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dropdown-user-email {
  color: #94a3b8;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}
.dropdown-user-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 9.5px;
  font-weight: 700;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.12);
  padding: 2px 7px;
  border-radius: 6px;
  margin-top: 5px;
  width: fit-content;
}
.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 0;
}
.dropdown-menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  color: #cbd5e1;
  font-size: 12.5px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}
.dropdown-menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}
.dropdown-menu-item i {
  font-size: 14px;
  color: #94a3b8;
}
.dropdown-menu-item:hover i {
  color: #00d2ff;
}
.dropdown-footer-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dropdown-logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  color: #f87171;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 100%;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  cursor: pointer;
}
.dropdown-logout-btn:hover {
  background: rgba(239, 68, 68, 0.18);
  color: #fca5a5;
}
.dropdown-guest-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.dropdown-login-btn {
  flex: 1;
  padding: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border: none;
}
.dropdown-signup-btn {
  flex: 1;
  padding: 8px;
  background: #2563eb;
  color: #ffffff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  border: none;
}

.map-hero-section {
  padding-top: 78px;
  padding-bottom: 8px;
  flex-shrink: 0;
}
.map-hero-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.map-title-area {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.map-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0284c7;
}
.map-title {
  font-family: "Outfit", sans-serif;
  font-size: 1.45rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}
.map-title .highlight {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.map-subtitle {
  font-size: 0.84rem;
  color: #64748b;
  max-width: 620px;
}
.map-quick-stats {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(12px);
  padding: 6px 16px;
  border-radius: 12px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.stat-num {
  font-family: "Outfit", sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
}
.stat-num.cyan {
  color: #0284c7;
}
.stat-num.emerald {
  color: #059669;
}
.stat-lbl {
  font-size: 0.68rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.stat-sep {
  width: 1px;
  height: 22px;
  background: rgba(15, 23, 42, 0.1);
}
.map-filter-section {
  padding: 0 24px 10px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  flex-shrink: 0;
}
.filter-bar-card {
  background: #ffffff;
  border: 1px solid rgba(2, 132, 199, 0.22);
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
  border-radius: 14px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-groups {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}
.filter-dropdown-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 10px;
  padding: 0 12px;
  height: 38px;
  transition: all 0.25s ease;
  min-width: 155px;
  flex: 1;
}
.filter-dropdown-wrap:hover,
.filter-dropdown-wrap:focus-within {
  border-color: #0284c7;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.15);
}
.filter-icon {
  color: #0284c7;
  font-size: 0.82rem;
  margin-right: 8px;
  pointer-events: none;
}
.filter-select {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: none;
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 500;
  width: 100%;
  height: 100%;
  outline: none;
  cursor: pointer;
  padding-right: 18px;
}
.filter-select option {
  background: #ffffff;
  color: #0f172a;
}
.chevron-icon {
  position: absolute;
  right: 10px;
  color: #94a3b8;
  font-size: 0.7rem;
  pointer-events: none;
  transition: transform 0.2s ease;
}
.filter-dropdown-wrap:focus-within .chevron-icon {
  transform: rotate(180deg);
  color: #0284c7;
}
.filter-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-scan-map {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  font-family: "Outfit", sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
  padding: 0 18px;
  height: 38px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.35);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-scan-map:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.5);
}
.btn-scan-map.scanning i {
  animation: spin-radar 1s linear infinite;
}
@keyframes spin-radar {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.btn-reset-filters {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 10px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}
.btn-reset-filters:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transform: rotate(-45deg);
}
.map-content-layout {
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 28px;
  display: grid;
  grid-template-columns: 410px 1fr;
  gap: 16px;
  height: calc(100vh - 180px);
  min-height: 640px;
}
.map-sidebar-panel {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sidebar-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sidebar-title-info {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sidebar-heading {
  font-family: "Outfit", sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.nearby-count-badge {
  background: rgba(2, 132, 199, 0.1);
  border: 1px solid rgba(2, 132, 199, 0.25);
  color: #0284c7;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.sort-select {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: #475569;
  font-size: 0.74rem;
  padding: 4px 8px;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
}
.sidebar-search-box {
  position: relative;
  display: flex;
  align-items: center;
}
.sidebar-search-box i {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 0.8rem;
}
.sidebar-search-input {
  width: 100%;
  height: 34px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 8px;
  padding: 0 12px 0 34px;
  color: #0f172a;
  font-size: 0.8rem;
  outline: none;
  transition: all 0.2s ease;
}
.sidebar-search-input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 10px rgba(2, 132, 199, 0.15);
}
.properties-scroll-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
}
.properties-scroll-list::-webkit-scrollbar {
  width: 5px;
}
.properties-scroll-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.03);
}
.properties-scroll-list::-webkit-scrollbar-thumb {
  background: rgba(2, 132, 199, 0.25);
  border-radius: 10px;
}
.properties-scroll-list::-webkit-scrollbar-thumb:hover {
  background: #0284c7;
}
.sidebar-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 240px;
  text-align: center;
  color: #64748b;
  gap: 8px;
  padding: 20px;
}
.sidebar-empty-state i {
  font-size: 2rem;
  color: rgba(15, 23, 42, 0.2);
}
.map-view-panel {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.09);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  height: 100%;
}
#leaflet-map {
  width: 100%;
  height: 100%;
  background-color: #f1f5f9;
  z-index: 1;
}
.map-floating-controls {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.map-control-btn {
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: #0f172a;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
  transition: all 0.2s ease;
  font-size: 0.9rem;
}
.map-control-btn:hover {
  background: #f8fafc;
  border-color: #0284c7;
  color: #0284c7;
  transform: scale(1.05);
}
.btn-my-location {
  color: #0284c7;
}
.btn-my-location:hover {
  background: #f0f9ff;
  border-color: #0284c7;
}
.btn-my-location.locating i {
  animation: spin-pulse 1s linear infinite;
  color: #0284c7;
}
@keyframes spin-pulse {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
.map-layer-selector {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1000;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 3px;
  gap: 3px;
}
.layer-btn {
  padding: 5px 10px;
  font-size: 0.74rem;
  font-weight: 600;
  border-radius: 7px;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}
.layer-btn.active {
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
  border: 1px solid rgba(2, 132, 199, 0.3);
}
.radar-sweep-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  overflow: hidden;
}
.radar-sweep-overlay.active {
  opacity: 1;
}
.radar-beam {
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(2, 132, 199, 0.8) 50%,
    transparent 100%
  );
  box-shadow: 0 0 25px rgba(2, 132, 199, 0.9);
  animation: scan-vertical 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes scan-vertical {
  0% {
    top: 0%;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
}
/* Leaflet overrides */
:deep(.leaflet-control-attribution) {
  background: rgba(255, 255, 255, 0.85) !important;
  color: #64748b !important;
  font-size: 0.65rem !important;
  border-radius: 6px 0 0 0;
}
:deep(.leaflet-control-attribution a) {
  color: #0284c7 !important;
}
:deep(.leaflet-popup-content-wrapper) {
  background: #ffffff !important;
  border: 1px solid rgba(2, 132, 199, 0.3) !important;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.15) !important;
  border-radius: 14px !important;
  padding: 0 !important;
  overflow: hidden !important;
}
:deep(.leaflet-popup-content) {
  margin: 0 !important;
  line-height: 1.4 !important;
  width: 270px !important;
}
:deep(.leaflet-popup-tip-container) {
  display: none !important;
}
:deep(.leaflet-container a.leaflet-popup-close-button) {
  top: 8px !important;
  right: 8px !important;
  background: rgba(15, 23, 42, 0.6) !important;
  border-radius: 50% !important;
  color: #ffffff !important;
  width: 22px !important;
  height: 22px !important;
  font-size: 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}
:deep(.leaflet-container a.leaflet-popup-close-button:hover) {
  background: rgba(239, 68, 68, 0.9) !important;
}
/* Dynamic popup/card/marker HTML */
:deep(.popup-prop-card) {
  display: flex;
  flex-direction: column;
  color: #0f172a;
}
:deep(.popup-img-wrap) {
  position: relative;
  width: 100%;
  height: 135px;
  overflow: hidden;
}
:deep(.popup-img-wrap img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
:deep(.popup-ai-badge) {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(2, 132, 199, 0.4);
  color: #0284c7;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}
:deep(.popup-body) {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
:deep(.popup-price) {
  font-family: "Outfit", sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
}
:deep(.popup-title) {
  font-family: "Outfit", sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:deep(.popup-location) {
  font-size: 0.72rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}
:deep(.popup-specs) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.05);
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  color: #475569;
}
:deep(.popup-btn-row) {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}
:deep(.popup-btn-detail) {
  flex: 1;
  height: 32px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.76rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}
:deep(.popup-btn-detail:hover) {
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  transform: translateY(-1px);
}
:deep(.popup-btn-route) {
  padding: 0 10px;
  height: 32px;
  background: #f0f9ff;
  border: 1px solid #0284c7;
  color: #0284c7;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.74rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}
:deep(.popup-btn-route:hover) {
  background: #0284c7;
  color: #ffffff;
}
:deep(.map-prop-card) {
  flex-shrink: 0;
  min-height: 106px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 10px;
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
}
:deep(.map-prop-card::before) {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: transparent;
  transition: background-color 0.2s ease;
}
:deep(.map-prop-card:hover) {
  border-color: rgba(2, 132, 199, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.12);
}
:deep(.map-prop-card.active) {
  background: #f0f9ff;
  border-color: #0284c7;
  box-shadow: 0 0 16px rgba(2, 132, 199, 0.2);
}
:deep(.map-prop-card.active::before) {
  background: #0284c7;
}
:deep(.prop-thumb-wrap) {
  position: relative;
  width: 100px;
  height: 86px;
  border-radius: 8px;
  overflow: hidden;
}
:deep(.prop-thumb-img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
:deep(.map-prop-card:hover .prop-thumb-img) {
  transform: scale(1.08);
}
:deep(.prop-distance-chip) {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: #38bdf8;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 3px;
}
:deep(.prop-card-details) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}
:deep(.prop-card-top) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
:deep(.prop-ai-pill) {
  background: rgba(2, 132, 199, 0.1);
  color: #0284c7;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 20px;
  border: 1px solid rgba(2, 132, 199, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
:deep(.prop-rating) {
  font-size: 0.7rem;
  font-weight: 700;
  color: #d97706;
  display: flex;
  align-items: center;
  gap: 3px;
}
:deep(.prop-card-title) {
  font-family: "Outfit", sans-serif;
  font-size: 0.86rem;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
}
:deep(.prop-card-location) {
  font-size: 0.72rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
:deep(.prop-card-price) {
  font-family: "Outfit", sans-serif;
  font-size: 0.92rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 2px;
}
:deep(.prop-card-price span) {
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 500;
}
:deep(.prop-card-specs) {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.68rem;
  color: #64748b;
  padding-top: 2px;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
}
:deep(.prop-card-specs span) {
  display: flex;
  align-items: center;
  gap: 3px;
}
:deep(.prop-card-specs i) {
  color: #0284c7;
  font-size: 0.68rem;
}
:deep(.radar-marker-container) {
  background: transparent !important;
  border: none !important;
}
:deep(.custom-radar-marker) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 30px;
  height: 30px;
}
:deep(.marker-pin-bubble) {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0284c7;
  font-size: 0.82rem;
  box-shadow:
    0 4px 14px rgba(15, 23, 42, 0.2),
    0 0 8px rgba(2, 132, 199, 0.25);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
:deep(.custom-radar-marker:hover .marker-pin-bubble) {
  transform: scale(1.22) translateY(-2px);
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
  z-index: 1000 !important;
}
:deep(.marker-radar-ring) {
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid rgba(2, 132, 199, 0.55);
  pointer-events: none;
  opacity: 0;
}
:deep(.custom-radar-marker.active-pin .marker-radar-ring) {
  opacity: 1;
  animation: radar-expand 2.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}
@keyframes radar-expand {
  0% {
    transform: scale(0.4);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
:deep(.custom-radar-marker.active-pin .marker-pin-bubble) {
  background: #0284c7;
  color: #ffffff;
  border-color: #ffffff;
  transform: scale(1.25) translateY(-3px);
  box-shadow: 0 0 20px rgba(2, 132, 199, 0.65);
}
[data-theme="dark"] :deep(.marker-pin-bubble) {
  background: #1e293b;
  border-color: #00d2ff;
  color: #00d2ff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 210, 255, 0.3);
}
[data-theme="dark"] :deep(.custom-radar-marker:hover .marker-pin-bubble) {
  background: #00d2ff;
  color: #090d16;
  border-color: #ffffff;
}
[data-theme="dark"] :deep(.custom-radar-marker.active-pin .marker-pin-bubble) {
  background: #00d2ff;
  color: #090d16;
  border-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.75);
}
:deep(.user-location-marker) {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.user-pulse-ring) {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(2, 132, 199, 0.25);
  border: 2px solid #0284c7;
  animation: userPulse 2s ease-out infinite;
}
:deep(.user-dot) {
  position: relative;
  width: 14px;
  height: 14px;
  background: #0284c7;
  border: 2.5px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(2, 132, 199, 0.8);
}
@keyframes userPulse {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
/* Modal */
.map-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.map-modal-container {
  background: #ffffff;
  border: 1px solid rgba(2, 132, 199, 0.3);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.2);
  border-radius: 18px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalPop {
  from {
    transform: scale(0.94) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.1);
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;
}
.modal-close-btn:hover {
  background: #ef4444;
  color: #ffffff;
  transform: rotate(90deg);
}
.modal-hero-gallery {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}
.modal-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.modal-body-content {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.modal-price-val {
  font-family: "Outfit", sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
}
.modal-specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.modal-spec-card {
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 3px;
}
.modal-spec-card i {
  color: #0284c7;
  font-size: 1rem;
}
.modal-spec-card .val {
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
}
.modal-spec-card .lbl {
  font-size: 0.68rem;
  color: #64748b;
}
.modal-ai-box {
  background: rgba(2, 132, 199, 0.06);
  border: 1px solid rgba(2, 132, 199, 0.2);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  gap: 12px;
}
.modal-ai-box i {
  color: #0284c7;
  font-size: 1.3rem;
}
.modal-ai-box p {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #334155;
}
.modal-actions-row {
  display: flex;
  gap: 12px;
}
.modal-btn-contact {
  flex: 1;
  height: 44px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.modal-btn-contact:hover {
  box-shadow: 0 4px 18px rgba(2, 132, 199, 0.35);
  transform: translateY(-1px);
}
.modal-btn-directions {
  height: 44px;
  padding: 0 16px;
  background: #f0f9ff;
  border: 1.5px solid #0284c7;
  color: #0284c7;
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.modal-btn-directions:hover {
  background: #0284c7;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
  transform: translateY(-1px);
}
.modal-btn-share {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 10px;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.modal-btn-share:hover {
  background: #e2e8f0;
  color: #0284c7;
}
.map-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.25);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 3000;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.map-toast.visible {
  transform: translateX(-50%) translateY(0);
}
.map-toast i {
  color: #38bdf8;
}
/* ==================== FOOTER ==================== */
.footer {
  background-color: #06101e;
  color: rgba(255, 255, 255, 0.75);
  padding-top: 4.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}
.footer .container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}
.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 3rem;
  padding-bottom: 3.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.footer-brand .brand-desc {
  margin-top: 1.2rem;
  font-size: 0.92rem;
  line-height: 1.7;
  color: #94a3b8;
}
.footer-logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}
.footer-logo-img {
  height: 34px;
  width: auto;
  object-fit: contain;
}
.footer-brand-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
}
.social-links {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}
.social-links a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  color: #ffffff;
  transition: all 0.2s ease;
  text-decoration: none;
}
.social-links a:hover {
  background: #2563eb;
  transform: translateY(-3px);
  color: #ffffff;
}
.footer-heading {
  color: #ffffff;
  font-family: "Outfit", sans-serif;
  font-size: 1.15rem;
  margin-bottom: 1.5rem;
}
.footer-links-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer-links-col ul li {
  margin-bottom: 0.75rem;
}
.footer-links-col ul li a {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.92rem;
  text-decoration: none;
  transition: all 0.2s ease;
}
.footer-links-col ul li a:hover {
  color: #00d2ff;
  padding-left: 5px;
}
.contact-info-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.92rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}
.contact-info-list li i {
  color: #00d2ff;
  margin-top: 0.3rem;
}
.footer-bottom {
  width: 100%;
  padding: 1.5rem 0;
  font-size: 0.85rem;
}
.bottom-container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}

/* Route & Directions Floating Card */
.map-route-card {
  position: absolute;
  bottom: 24px;
  left: 20px;
  width: 320px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(2, 132, 199, 0.35);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
  z-index: 1001;
  padding: 14px 16px;
  animation: slideUpCard 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
}
@keyframes slideUpCard {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.route-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}
.route-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}
.route-header-title .route-icon {
  color: #0284c7;
  font-size: 0.95rem;
}
.btn-close-route {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-close-route:hover {
  background: #fee2e2;
  color: #ef4444;
}
.route-card-content {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.route-prop-name {
  font-family: "Outfit", sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.route-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.route-stat-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 10px;
  padding: 8px 10px;
}
.stat-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.stat-icon-wrap.time {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}
.stat-info {
  display: flex;
  flex-direction: column;
}
.stat-info .stat-val {
  font-family: "Outfit", sans-serif;
  font-weight: 800;
  font-size: 0.88rem;
  color: #0f172a;
}
.stat-info .stat-lbl {
  font-size: 0.65rem;
  color: #64748b;
}
.route-actions-wrap {
  margin-top: 2px;
}
.btn-open-gmaps {
  width: 100%;
  height: 36px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.78rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}
.btn-open-gmaps:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.4);
}
.external-icon {
  font-size: 0.7rem;
  opacity: 0.8;
}

@media (max-width: 1024px) {
  .map-content-layout {
    grid-template-columns: 350px 1fr;
  }
}
@media (max-width: 991px) {
  .menu-toggle {
    display: block;
  }
  .nav-links {
    position: fixed;
    top: 68px;
    left: 0;
    width: 100%;
    background: rgba(6, 16, 30, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 24px;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s ease;
    z-index: 1100;
  }
  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}
@media (max-width: 768px) {
  .map-content-layout {
    display: flex;
    flex-direction: column-reverse;
    height: auto;
    padding: 0 16px 20px;
  }
  .map-view-panel {
    height: 380px;
  }
  .map-sidebar-panel {
    height: 480px;
  }
  .map-hero-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .filter-bar-card {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-groups {
    flex-direction: column;
  }
  .filter-dropdown-wrap {
    width: 100%;
  }
  .btn-scan-map {
    width: 100%;
    justify-content: center;
  }
  .map-route-card {
    left: 12px;
    right: 12px;
    width: auto;
    bottom: 12px;
  }
  .map-poi-dock {
    bottom: 12px;
    max-width: calc(100% - 16px);
  }
  .poi-chips-scroll {
    max-width: 200px;
  }
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

/* ==================== POI FLOATING CONTROLS & MARKERS ==================== */
.map-poi-dock {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: calc(100% - 32px);
  pointer-events: none;
}
.poi-dock-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(2, 132, 199, 0.25);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
  border-radius: 40px;
  padding: 6px 10px;
  pointer-events: auto;
  max-width: 100%;
}
.poi-main-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 30px;
  border: none;
  font-family: "Outfit", sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.22s ease;
  flex-shrink: 0;
}
.poi-main-toggle.active {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
}
.poi-spin {
  font-size: 0.75rem;
  margin-inline-start: 4px;
}
.poi-count-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.28);
  color: inherit;
}
.poi-chips-scroll {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 4px;
  max-width: 580px;
  scrollbar-width: none;
}
.poi-chips-scroll::-webkit-scrollbar {
  display: none;
}
.poi-chip-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  color: #475569;
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.poi-chip-btn:hover {
  border-color: #0284c7;
  color: #0284c7;
  background: #f0f9ff;
}
.poi-chip-btn.active {
  background: #0284c7;
  border-color: #0284c7;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
}

/* Cluster & Pins */
:deep(.poi-marker-container) {
  background: transparent;
  border: none;
}
:deep(.poi-pin-bubble) {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--poi-color, #0284c7);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
:deep(.poi-pin-bubble:hover) {
  transform: scale(1.25);
  z-index: 1000 !important;
}
:deep(.poi-cluster-wrap) {
  background: transparent;
  border: none;
}
:deep(.poi-cluster-pill) {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Outfit", sans-serif;
  font-size: 0.78rem;
  font-weight: 800;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}
:deep(.poi-cluster-pill.sm) {
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  border: 2px solid #ffffff;
}
:deep(.poi-cluster-pill.md) {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: 2px solid #ffffff;
}
:deep(.poi-cluster-pill.lg) {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  border: 2px solid #ffffff;
}

/* POI Glass Popup */
:deep(.poi-glass-popup .leaflet-popup-content-wrapper) {
  border-radius: 12px !important;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.2) !important;
}
:deep(.poi-glass-popup .leaflet-popup-content) {
  width: 240px !important;
  margin: 0 !important;
}
:deep(.poi-popup-card) {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
:deep(.poi-pop-header) {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
:deep(.poi-pop-icon) {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
:deep(.poi-pop-info) {
  flex: 1;
  min-width: 0;
}
:deep(.poi-pop-name) {
  font-family: "Outfit", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px;
  line-height: 1.25;
}
:deep(.poi-pop-badge) {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}
:deep(.poi-pop-btn-row) {
  display: flex;
  align-items: center;
  gap: 6px;
}
:deep(.poi-pop-nav-btn) {
  flex: 1;
  height: 30px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
:deep(.poi-pop-nav-btn:hover) {
  opacity: 0.9;
}
:deep(.poi-pop-gmaps-btn) {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #f8fafc;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.76rem;
  text-decoration: none;
  transition: all 0.2s ease;
}
:deep(.poi-pop-gmaps-btn:hover) {
  background: #0284c7;
  color: #ffffff;
}

/* Dark Theme Support for POIs */
[data-theme="dark"] .poi-dock-inner {
  background: rgba(30, 41, 59, 0.92);
  border-color: rgba(0, 210, 255, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
[data-theme="dark"] .poi-main-toggle {
  background: #1e293b;
  color: #cbd5e1;
}
[data-theme="dark"] .poi-chip-btn {
  background: #1e293b;
  border-color: #334155;
  color: #cbd5e1;
}
[data-theme="dark"] .poi-chip-btn:hover {
  border-color: #00d2ff;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.15);
}
[data-theme="dark"] .poi-chip-btn.active {
  background: #0284c7;
  color: #ffffff;
}
[data-theme="dark"] :deep(.poi-pin-bubble) {
  background: #1e293b;
}
[data-theme="dark"] :deep(.poi-glass-popup .leaflet-popup-content-wrapper) {
  background: #1e293b !important;
  border-color: rgba(0, 210, 255, 0.3) !important;
}
[data-theme="dark"] :deep(.poi-pop-name) {
  color: #ffffff;
}
[data-theme="dark"] :deep(.poi-pop-gmaps-btn) {
  background: #24344d;
  border-color: #334155;
  color: #00d2ff;
}

/* ==================== LUXURY PROPERTY MARKER CLUSTERS ==================== */
:deep(.prop-cluster-wrap) {
  background: transparent !important;
  border: none !important;
}
:deep(.prop-cluster-bubble) {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.28),
    0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
  position: relative;
}
:deep(.prop-cluster-bubble:hover) {
  transform: scale(1.15) translateY(-3px);
  box-shadow: 0 12px 30px rgba(2, 132, 199, 0.45);
  z-index: 1000 !important;
}
:deep(.prop-cluster-icon) {
  font-size: 0.65rem;
  line-height: 1;
  opacity: 0.92;
  margin-bottom: 2px;
}
:deep(.prop-cluster-num) {
  font-size: 0.8rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
}

/* Tier 1: Small (< 15 properties) */
:deep(.prop-cluster-bubble.sm) {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  border: 2.5px solid #ffffff;
}

/* Tier 2: Medium (15 - 50 properties) */
:deep(.prop-cluster-bubble.md) {
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border: 2.5px solid #ffffff;
  box-shadow: 0 8px 26px rgba(37, 99, 235, 0.4);
}

/* Tier 3: Large (> 50 properties) */
:deep(.prop-cluster-bubble.lg) {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 2.5px solid #00d2ff;
  box-shadow: 0 10px 30px rgba(0, 210, 255, 0.35);
}
:deep(.prop-cluster-bubble.lg .prop-cluster-icon) {
  color: #00d2ff;
}

/* Dark Theme Support for Property Clusters */
[data-theme="dark"] :deep(.prop-cluster-bubble.sm) {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  border-color: #38bdf8;
}
[data-theme="dark"] :deep(.prop-cluster-bubble.md) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
  border-color: #60a5fa;
}
[data-theme="dark"] :deep(.prop-cluster-bubble.lg) {
  background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
  border-color: #00d2ff;
  box-shadow: 0 0 24px rgba(0, 210, 255, 0.45);
}

/* ==================== COMPREHENSIVE DARK MODE SUPPORT ==================== */
[data-theme="dark"] .map-page-wrapper,
.map-page-wrapper[data-theme="dark"] {
  background: #070d19 !important;
  color: #e2e8f0;
}

/* Filter Bar */
[data-theme="dark"] .filter-bar-card {
  background: #0b1322 !important;
  border-color: rgba(0, 210, 255, 0.22) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45) !important;
}
[data-theme="dark"] .filter-dropdown-wrap {
  background: #111c2e !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}
[data-theme="dark"] .filter-dropdown-wrap:hover,
[data-theme="dark"] .filter-dropdown-wrap:focus-within {
  background: #15243b !important;
  border-color: #00d2ff !important;
  box-shadow: 0 0 14px rgba(0, 210, 255, 0.22) !important;
}
[data-theme="dark"] .filter-icon {
  color: #00d2ff !important;
}
[data-theme="dark"] .filter-select {
  color: #ffffff !important;
  background: transparent !important;
}
[data-theme="dark"] .filter-select option {
  background: #0b1322 !important;
  color: #ffffff !important;
}
[data-theme="dark"] .chevron-icon {
  color: #94a3b8 !important;
}
[data-theme="dark"] .filter-dropdown-wrap:focus-within .chevron-icon {
  color: #00d2ff !important;
}
[data-theme="dark"] .btn-reset-filters {
  background: #111c2e !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #94a3b8 !important;
}
[data-theme="dark"] .btn-reset-filters:hover {
  background: rgba(239, 68, 68, 0.18) !important;
  border-color: rgba(239, 68, 68, 0.4) !important;
  color: #ef4444 !important;
}

/* Sidebar Panel */
[data-theme="dark"] .map-sidebar-panel {
  background: #0b1322 !important;
  border-color: rgba(0, 210, 255, 0.18) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
}
[data-theme="dark"] .sidebar-header {
  background: #0e192d !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
[data-theme="dark"] .sidebar-heading {
  color: #ffffff !important;
}
[data-theme="dark"] .nearby-count-badge {
  background: rgba(0, 210, 255, 0.12) !important;
  border-color: rgba(0, 210, 255, 0.35) !important;
  color: #00d2ff !important;
}
[data-theme="dark"] .sort-select {
  background: #142038 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #cbd5e1 !important;
}
[data-theme="dark"] .sort-select option {
  background: #0b1322 !important;
  color: #ffffff !important;
}
[data-theme="dark"] .sidebar-search-box i {
  color: #64748b !important;
}
[data-theme="dark"] .sidebar-search-input {
  background: #142038 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}
[data-theme="dark"] .sidebar-search-input::placeholder {
  color: #64748b !important;
}
[data-theme="dark"] .sidebar-search-input:focus {
  border-color: #00d2ff !important;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.25) !important;
}
[data-theme="dark"] .properties-scroll-list {
  background: #070d19 !important;
}
[data-theme="dark"] .properties-scroll-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02) !important;
}
[data-theme="dark"] .properties-scroll-list::-webkit-scrollbar-thumb {
  background: rgba(0, 210, 255, 0.25) !important;
}
[data-theme="dark"] .properties-scroll-list::-webkit-scrollbar-thumb:hover {
  background: #00d2ff !important;
}
[data-theme="dark"] .sidebar-empty-state {
  color: #94a3b8 !important;
}
[data-theme="dark"] .sidebar-empty-state i {
  color: rgba(255, 255, 255, 0.15) !important;
}

/* Sidebar Property Cards */
[data-theme="dark"] :deep(.map-prop-card) {
  background: #0e192e !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
}
[data-theme="dark"] :deep(.map-prop-card:hover) {
  background: #142340 !important;
  border-color: rgba(0, 210, 255, 0.45) !important;
  box-shadow: 0 8px 24px rgba(0, 210, 255, 0.18) !important;
  transform: translateY(-1px);
}
[data-theme="dark"] :deep(.map-prop-card.active) {
  background: #132747 !important;
  border-color: #00d2ff !important;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.35) !important;
}
[data-theme="dark"] :deep(.map-prop-card.active::before) {
  background: #00d2ff !important;
}
[data-theme="dark"] :deep(.prop-card-title) {
  color: #ffffff !important;
}
[data-theme="dark"] :deep(.prop-card-location) {
  color: #94a3b8 !important;
}
[data-theme="dark"] :deep(.prop-card-location i) {
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.prop-card-price) {
  color: #38bdf8 !important;
}
[data-theme="dark"] :deep(.prop-card-price span) {
  color: #94a3b8 !important;
}
[data-theme="dark"] :deep(.prop-card-specs) {
  border-top-color: rgba(255, 255, 255, 0.08) !important;
  color: #cbd5e1 !important;
}
[data-theme="dark"] :deep(.prop-card-specs i) {
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.prop-ai-pill) {
  background: rgba(0, 210, 255, 0.12) !important;
  border-color: rgba(0, 210, 255, 0.35) !important;
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.prop-rating) {
  color: #fbbf24 !important;
}

/* Map View Panel, Controls, & Tile Styling */
[data-theme="dark"] .map-view-panel {
  background: #070d19 !important;
  border-color: rgba(0, 210, 255, 0.18) !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
}
[data-theme="dark"] #leaflet-map {
  background-color: #070d19 !important;
}
[data-theme="dark"] .map-layer-selector {
  background: #0b1322 !important;
  border-color: rgba(0, 210, 255, 0.25) !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45) !important;
}
[data-theme="dark"] .layer-btn {
  color: #94a3b8 !important;
}
[data-theme="dark"] .layer-btn:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
}
[data-theme="dark"] .layer-btn.active {
  background: rgba(0, 210, 255, 0.18) !important;
  color: #00d2ff !important;
  border: 1px solid rgba(0, 210, 255, 0.4) !important;
}
[data-theme="dark"] .map-control-btn {
  background: #0b1322 !important;
  border-color: rgba(0, 210, 255, 0.25) !important;
  color: #cbd5e1 !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
}
[data-theme="dark"] .map-control-btn:hover {
  background: #142038 !important;
  border-color: #00d2ff !important;
  color: #00d2ff !important;
}
[data-theme="dark"] .btn-my-location {
  color: #00d2ff !important;
}
[data-theme="dark"] .btn-my-location:hover {
  background: rgba(0, 210, 255, 0.15) !important;
}
[data-theme="dark"] :deep(.leaflet-control-zoom-in),
[data-theme="dark"] :deep(.leaflet-control-zoom-out) {
  background-color: #0b1322 !important;
  color: #00d2ff !important;
  border-color: rgba(0, 210, 255, 0.25) !important;
}
[data-theme="dark"] :deep(.leaflet-control-zoom-in:hover),
[data-theme="dark"] :deep(.leaflet-control-zoom-out:hover) {
  background-color: #142038 !important;
  color: #ffffff !important;
}
[data-theme="dark"] :deep(.leaflet-control-attribution) {
  background: rgba(11, 19, 34, 0.88) !important;
  color: #64748b !important;
}
[data-theme="dark"] :deep(.leaflet-control-attribution a) {
  color: #00d2ff !important;
}

/* Leaflet Property Popup */
[data-theme="dark"] :deep(.leaflet-popup-content-wrapper) {
  background: rgba(11, 19, 34, 0.96) !important;
  border: 1px solid rgba(0, 210, 255, 0.35) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), 0 0 25px rgba(0, 210, 255, 0.15) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
}
[data-theme="dark"] :deep(.popup-title) {
  color: #ffffff !important;
}
[data-theme="dark"] :deep(.popup-price) {
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.popup-location) {
  color: #94a3b8 !important;
}
[data-theme="dark"] :deep(.popup-location i) {
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.popup-specs) {
  background: #142038 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  color: #cbd5e1 !important;
}
[data-theme="dark"] :deep(.popup-ai-badge) {
  background: rgba(11, 19, 34, 0.9) !important;
  border-color: rgba(0, 210, 255, 0.45) !important;
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.popup-btn-detail) {
  background: linear-gradient(135deg, #0284c7 0%, #00d2ff 100%) !important;
  color: #070d19 !important;
  font-weight: 800 !important;
}
[data-theme="dark"] :deep(.popup-btn-route) {
  background: #142038 !important;
  border: 1px solid rgba(0, 210, 255, 0.35) !important;
  color: #00d2ff !important;
}
[data-theme="dark"] :deep(.popup-btn-route:hover) {
  background: #00d2ff !important;
  color: #070d19 !important;
}

/* Route & Directions Floating Card */
[data-theme="dark"] .map-route-card {
  background: rgba(11, 19, 34, 0.96) !important;
  border-color: rgba(0, 210, 255, 0.35) !important;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65) !important;
}
[data-theme="dark"] .route-card-header {
  border-bottom-color: rgba(255, 255, 255, 0.08) !important;
}
[data-theme="dark"] .route-header-title {
  color: #ffffff !important;
}
[data-theme="dark"] .route-header-title .route-icon {
  color: #00d2ff !important;
}
[data-theme="dark"] .btn-close-route {
  background: #142038 !important;
  color: #94a3b8 !important;
}
[data-theme="dark"] .btn-close-route:hover {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #ef4444 !important;
}
[data-theme="dark"] .route-prop-name {
  color: #ffffff !important;
}
[data-theme="dark"] .route-stat-box {
  background: #142038 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}
[data-theme="dark"] .route-stat-box .val {
  color: #00d2ff !important;
}
[data-theme="dark"] .route-stat-box .lbl {
  color: #94a3b8 !important;
}
[data-theme="dark"] .stat-icon-wrap {
  background: rgba(0, 210, 255, 0.12) !important;
  color: #00d2ff !important;
}

/* Property Details Modal */
[data-theme="dark"] .map-modal-container {
  background: #0b1322 !important;
  border-color: rgba(0, 210, 255, 0.35) !important;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.75) !important;
}
[data-theme="dark"] .modal-close-btn {
  background: #142038 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}
[data-theme="dark"] .modal-close-btn:hover {
  background: #ef4444 !important;
  color: #ffffff !important;
}
[data-theme="dark"] .modal-price-val {
  color: #00d2ff !important;
}
[data-theme="dark"] .modal-spec-card {
  background: #142038 !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}
[data-theme="dark"] .modal-spec-card .val {
  color: #ffffff !important;
}
[data-theme="dark"] .modal-spec-card .lbl {
  color: #94a3b8 !important;
}
[data-theme="dark"] .modal-spec-card i {
  color: #00d2ff !important;
}
[data-theme="dark"] .modal-ai-box {
  background: rgba(0, 210, 255, 0.08) !important;
  border-color: rgba(0, 210, 255, 0.25) !important;
}
[data-theme="dark"] .modal-ai-box i {
  color: #00d2ff !important;
}
[data-theme="dark"] .modal-ai-box p {
  color: #cbd5e1 !important;
}
[data-theme="dark"] .modal-btn-directions {
  background: #142038 !important;
  border-color: rgba(0, 210, 255, 0.4) !important;
  color: #00d2ff !important;
}
[data-theme="dark"] .modal-btn-directions:hover {
  background: #00d2ff !important;
  color: #070d19 !important;
}
[data-theme="dark"] .modal-btn-share {
  background: #142038 !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  color: #cbd5e1 !important;
}
[data-theme="dark"] .modal-btn-share:hover {
  background: #1e293b !important;
  color: #00d2ff !important;
}
</style>
