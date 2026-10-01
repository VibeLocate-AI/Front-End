<template>
  <header class="site-header" :class="{ scrolled: isScrolled }" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">
    <div class="header-inner">
      <!-- Logo -->
      <router-link class="brand" to="/home">
        <div class="brand-logo-wrap">
          <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img">
          <div class="brand-text">
            <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
            <span class="brand-badge">AI</span>
          </div>
        </div>
      </router-link>

      <!-- Desktop Navigation Links -->
      <nav class="nav-links">
        <router-link class="nav-item" to="/home" active-class="active">{{ t('home') }}</router-link>
        <router-link class="nav-item" to="/buy" active-class="active">{{ t('buy') }}</router-link>
        <router-link class="nav-item" to="/rent" active-class="active">{{ t('rent') }}</router-link>
        <router-link class="nav-item" to="/new-projects" active-class="active">{{ t('newProjects') }}</router-link>
        <router-link class="nav-item" to="/map" active-class="active">
          {{ t('interactiveMap') }}
          <i class="fa-solid fa-map-location-dot" style="font-size:0.75rem; color:var(--accent-cyan, #00d2ff); margin-inline-start:3px;"></i>
        </router-link>
        <router-link class="nav-item" to="/about" active-class="active">{{ t('aboutUs') }}</router-link>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <NavbarControls />

        <button class="btn-list-property" type="button" @click="router.push('/add-property')">
          {{ t('listProperty') }}
        </button>

        <button
          class="icon-action-btn header-fav-btn"
          :class="{ 'has-saved': favCount > 0 }"
          type="button"
          aria-label="Saved Properties"
          :title="t('savedProperties')"
          @click="openFavorites"
        >
          <i :class="favCount > 0 ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
          <span v-if="favCount > 0" class="header-fav-badge">{{ favCount }}</span>
        </button>

        <button class="icon-action-btn notification-nav-btn" type="button" :title="isRtl ? 'الإشعارات' : 'Notifications'" @click="router.push('/notifications')">
          <i class="fa-regular fa-bell"></i>
          <span v-if="notificationCount" class="notification-nav-badge">{{ notificationCount > 99 ? '99+' : notificationCount }}</span>
        </button>

        <!-- User Profile Menu (Desktop) -->
        <div class="user-profile-menu-container" ref="profileDropdownRef">
          <div class="user-profile-menu" @click="profileMenuOpen = !profileMenuOpen">
            <img class="header-avatar" :src="userAvatarUrl" :alt="displayName || 'User'" @error="onAvatarError">
            <i class="fa-solid fa-chevron-down profile-arrow" :class="{ 'rotate-180': profileMenuOpen }"></i>
          </div>

          <Transition name="dropdown-fade">
            <div v-if="profileMenuOpen" class="profile-dropdown-box">
              <div class="dropdown-user-header">
                <img class="dropdown-avatar" :src="userAvatarUrl" :alt="displayName || 'User'" @error="onAvatarError">
                <div class="dropdown-user-info">
                  <strong class="dropdown-user-name">{{ displayName }}</strong>
                  <span class="dropdown-user-email">{{ displayEmail }}</span>
                  <span class="dropdown-user-badge" :style="isAdmin ? 'background: rgba(6, 182, 212, 0.15); color: #06b6d4; border-color: rgba(6, 182, 212, 0.3);' : (isAgent ? 'background: rgba(2, 132, 199, 0.15); color: #0284c7; border-color: rgba(2, 132, 199, 0.3);' : '')">
                    <i class="fa-solid" :class="isAdmin ? 'fa-shield-halved' : (isAgent ? 'fa-briefcase' : 'fa-circle-check')"></i>
                    {{ isAdmin ? (isRtl ? 'مدير النظام' : 'System Admin') : (isAgent ? (isRtl ? 'وكيل عقاري معتمد' : 'Certified Agent') : (isLoggedIn ? (isRtl ? 'عضو موثق' : 'Verified Member') : (isRtl ? 'حساب زائر' : 'Guest Account'))) }}
                  </span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-menu-list">
                <!-- Direct Admin Dashboard Shortcut -->
                <button v-if="isLoggedIn && isAdmin" class="dropdown-menu-item" style="background: rgba(6, 182, 212, 0.12); color: #06b6d4;" @click="goto('/admin')">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span><strong>{{ isRtl ? 'لوحة تحكم الإدارة' : 'Admin Dashboard' }}</strong></span>
                </button>
                <!-- Direct Agent Dashboard Shortcut -->
                <button v-if="isLoggedIn && isAgent" class="dropdown-menu-item" style="background: rgba(2, 132, 199, 0.08); color: #0284c7;" @click="goto('/profile/agent-dashboard')">
                  <i class="fa-solid fa-briefcase"></i>
                  <span><strong>{{ isRtl ? 'لوحة تحكم الوكيل' : 'Agent Dashboard' }}</strong></span>
                </button>
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="goto('/profile')">
                  <i class="fa-regular fa-user"></i>
                  <span>{{ isRtl ? 'ملفي الشخصي' : 'My Profile' }}</span>
                </button>
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="goto('/profile/properties')">
                  <i class="fa-regular fa-building"></i>
                  <span>{{ isRtl ? 'عقاراتي' : 'My Properties' }}</span>
                </button>
                <button class="dropdown-menu-item" @click="openFavorites">
                  <i class="fa-solid fa-heart text-danger"></i>
                  <span>{{ isRtl ? 'العقارات المحفوظة' : 'Saved Properties' }} ({{ favCount }})</span>
                </button>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-footer-actions">
                <button v-if="isLoggedIn" class="dropdown-logout-btn" @click="handleLogout">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>{{ isRtl ? 'تسجيل الخروج' : 'Log Out' }}</span>
                </button>
                <div v-else class="dropdown-guest-actions">
                  <button class="dropdown-login-btn" @click="goto('/login')">{{ isRtl ? 'تسجيل الدخول' : 'Log In' }}</button>
                  <button class="dropdown-signup-btn" @click="goto('/register')">{{ isRtl ? 'إنشاء حساب' : 'Sign Up' }}</button>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Mobile Menu Hamburger Button -->
        <button
          class="menu-toggle"
          type="button"
          aria-label="Toggle navigation drawer"
          :class="{ active: mobileMenuOpen }"
          @click="toggleMobileMenu"
        >
          <i class="fa-solid" :class="mobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'"></i>
        </button>
      </div>
    </div>

    <!-- ==================== MOBILE OFF-CANVAS SIDEBAR DRAWER ==================== -->
    <Teleport to="body">
      <!-- Backdrop Overlay -->
      <Transition name="drawer-fade">
        <div
          v-if="mobileMenuOpen"
          class="mobile-drawer-backdrop"
          :data-theme="currentTheme"
          @click="mobileMenuOpen = false"
        ></div>
      </Transition>

      <!-- Sidebar Drawer Panel -->
      <Transition :name="isRtl ? 'drawer-slide-rtl' : 'drawer-slide-ltr'">
        <aside
          v-if="mobileMenuOpen"
          class="mobile-sidebar-drawer"
          :dir="isRtl ? 'rtl' : 'ltr'"
          :data-theme="currentTheme"
        >
          <!-- Drawer Header -->
          <div class="drawer-header">
            <router-link to="/home" class="drawer-brand" @click="mobileMenuOpen = false">
              <img src="/logo_transparent.png" alt="VibeLocate" class="drawer-brand-img">
              <div class="drawer-brand-text">
                <span class="drawer-title">Vibe<span class="drawer-accent">Locate</span></span>
                <span class="drawer-badge">AI</span>
              </div>
            </router-link>
            <button class="drawer-close-btn" type="button" aria-label="Close menu" @click="mobileMenuOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Drawer Body Content (Scrollable) -->
          <div class="drawer-body">
            <!-- User Profile / Guest Welcome Card -->
            <div class="drawer-user-section">
              <div v-if="isLoggedIn" class="drawer-user-card" @click="goto('/profile'); mobileMenuOpen = false">
                <img class="drawer-user-avatar" :src="userAvatarUrl" :alt="displayName" @error="onAvatarError">
                <div class="drawer-user-meta">
                  <span class="drawer-user-name">{{ displayName }}</span>
                  <span class="drawer-user-email">{{ displayEmail }}</span>
                  <span class="drawer-user-status" :style="isAgent ? 'color: #0284c7;' : ''">
                    <i class="fa-solid" :class="isAgent ? 'fa-briefcase' : 'fa-circle-check'"></i>
                    {{ isAgent ? (isRtl ? 'وكيل عقاري معتمد' : 'Certified Agent') : (isRtl ? 'عضو موثق' : 'Verified Member') }}
                  </span>
                </div>
                <i class="fa-solid fa-chevron-left drawer-card-arrow" v-if="isRtl"></i>
                <i class="fa-solid fa-chevron-right drawer-card-arrow" v-else></i>
              </div>

              <div v-else class="drawer-guest-card">
                <div class="drawer-guest-info">
                  <div class="drawer-guest-icon">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                  </div>
                  <div>
                    <strong class="drawer-guest-title">{{ isRtl ? 'مرحباً بك في VibeLocate' : 'Welcome to VibeLocate' }}</strong>
                    <p class="drawer-guest-desc">{{ isRtl ? 'سجّل دخولك للوصول إلى العقارات المفضلة' : 'Sign in to access favorites and AI search' }}</p>
                  </div>
                </div>
                <div class="drawer-guest-btns">
                  <button class="btn-drawer-login" @click="goto('/login'); mobileMenuOpen = false">
                    <i class="fa-solid fa-arrow-right-to-bracket"></i>
                    <span>{{ isRtl ? 'دخول' : 'Log In' }}</span>
                  </button>
                  <button class="btn-drawer-signup" @click="goto('/register'); mobileMenuOpen = false">
                    <i class="fa-solid fa-user-plus"></i>
                    <span>{{ isRtl ? 'حساب جديد' : 'Sign Up' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- List Property CTA Button -->
            <div class="drawer-cta-section">
              <button class="drawer-btn-add-prop" @click="goto('/add-property'); mobileMenuOpen = false">
                <span class="btn-add-icon"><i class="fa-solid fa-plus"></i></span>
                <span class="btn-add-text">{{ t('listProperty') }}</span>
              </button>
            </div>

            <!-- Navigation Links -->
            <div class="drawer-nav-group">
              <span class="drawer-group-label">{{ isRtl ? 'القوائم الرئيسية' : 'Main Navigation' }}</span>
              <nav class="drawer-nav-list">
                <router-link to="/home" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-house"></i></div>
                  <span class="drawer-nav-label">{{ t('home') }}</span>
                </router-link>

                <router-link to="/buy" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-bag-shopping"></i></div>
                  <span class="drawer-nav-label">{{ t('buy') }}</span>
                </router-link>

                <router-link to="/rent" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-key"></i></div>
                  <span class="drawer-nav-label">{{ t('rent') }}</span>
                </router-link>

                <router-link to="/new-projects" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-city"></i></div>
                  <span class="drawer-nav-label">{{ t('newProjects') }}</span>
                </router-link>

                <router-link to="/map" class="drawer-nav-item map-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-map-location-dot"></i></div>
                  <span class="drawer-nav-label">{{ t('interactiveMap') }}</span>
                  <span class="drawer-pill-badge">AI Map</span>
                </router-link>

                <router-link to="/search" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                  <span class="drawer-nav-label">{{ isRtl ? 'البحث الذكي' : 'Smart Search' }}</span>
                </router-link>

                <router-link to="/about" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon"><i class="fa-solid fa-circle-info"></i></div>
                  <span class="drawer-nav-label">{{ t('aboutUs') }}</span>
                </router-link>
              </nav>
            </div>

            <!-- Activity & Hub -->
            <div class="drawer-nav-group">
              <span class="drawer-group-label">{{ isRtl ? 'المفضلة والتنبيهات' : 'Saved & Activity' }}</span>
              <nav class="drawer-nav-list">
                <button class="drawer-nav-item drawer-btn-item" @click="openFavorites(); mobileMenuOpen = false">
                  <div class="drawer-nav-icon heart"><i class="fa-solid fa-heart"></i></div>
                  <span class="drawer-nav-label">{{ isRtl ? 'العقارات المحفوظة' : 'Saved Properties' }}</span>
                  <span v-if="favCount > 0" class="drawer-counter-badge">{{ favCount }}</span>
                </button>

                <router-link to="/notifications" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                  <div class="drawer-nav-icon bell"><i class="fa-solid fa-bell"></i></div>
                  <span class="drawer-nav-label">{{ isRtl ? 'الإشعارات' : 'Notifications' }}</span>
                  <span v-if="notificationCount > 0" class="drawer-counter-badge danger">{{ notificationCount }}</span>
                </router-link>

                <template v-if="isLoggedIn">
                  <router-link v-if="isAdmin" to="/admin" class="drawer-nav-item" style="color: #06b6d4; font-weight: 600;" active-class="active" @click="mobileMenuOpen = false">
                    <div class="drawer-nav-icon" style="color: #06b6d4;"><i class="fa-solid fa-shield-halved"></i></div>
                    <span class="drawer-nav-label">{{ isRtl ? 'لوحة تحكم الإدارة' : 'Admin Dashboard' }}</span>
                  </router-link>
                  <router-link v-if="isAgent" to="/profile/agent-dashboard" class="drawer-nav-item" style="color: #0284c7; font-weight: 600;" active-class="active" @click="mobileMenuOpen = false">
                    <div class="drawer-nav-icon" style="color: #0284c7;"><i class="fa-solid fa-briefcase"></i></div>
                    <span class="drawer-nav-label">{{ isRtl ? 'لوحة تحكم الوكيل' : 'Agent Dashboard' }}</span>
                  </router-link>

                  <router-link to="/profile" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                    <div class="drawer-nav-icon"><i class="fa-regular fa-user"></i></div>
                    <span class="drawer-nav-label">{{ isRtl ? 'الملف الشخصي' : 'Profile Settings' }}</span>
                  </router-link>

                  <router-link to="/profile/properties" class="drawer-nav-item" active-class="active" @click="mobileMenuOpen = false">
                    <div class="drawer-nav-icon"><i class="fa-regular fa-building"></i></div>
                    <span class="drawer-nav-label">{{ isRtl ? 'عقاراتي' : 'My Properties' }}</span>
                  </router-link>
                </template>
              </nav>
            </div>
          </div>

          <!-- Drawer Footer Controls (Language, Theme, Logout) -->
          <div class="drawer-footer">
            <div class="drawer-controls-grid">
              <button class="drawer-control-box" type="button" @click="toggleLanguage">
                <i class="fa-solid fa-globe"></i>
                <span>{{ isRtl ? 'English' : 'العربية' }}</span>
              </button>
              <button class="drawer-control-box" type="button" @click="toggleTheme">
                <i :class="isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
                <span>{{ isDark ? (isRtl ? 'النهاري' : 'Light') : (isRtl ? 'الليلي' : 'Dark') }}</span>
              </button>
            </div>

            <button v-if="isLoggedIn" class="drawer-btn-logout" type="button" @click="handleLogout(); mobileMenuOpen = false">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              <span>{{ isRtl ? 'تسجيل الخروج' : 'Log Out' }}</span>
            </button>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarControls from './NavbarControls.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'
import { authService } from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import { notificationService } from '../services/notificationService'

const { t, isRtl, isDark, theme: currentTheme, toggleLanguage, toggleTheme } = useThemeAndLanguage()
const router = useRouter()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)

const favCount = computed(() => favoritesService.savedItems.value.length)
const notificationCount = computed(() => notificationService.unreadCount.value)

const currentUser = ref(null)
const isLoggedIn = computed(() => !!currentUser.value)

const parseUserData = (raw) => {
  if (!raw) return null
  const profile = raw?.data?.profile || raw?.data?.user || raw?.data || raw?.user || raw
  const name = profile.name || profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username || ''
  const email = profile.email || ''
  let avatar = profile.avatar || profile.avatar_url || profile.profile_photo_url || profile.picture || profile.photo || profile.image || ''
  if (avatar && !avatar.startsWith('http') && !avatar.startsWith('data:') && !avatar.startsWith('/')) {
    avatar = `https://vibelocate-laravel.onrender.com/${avatar}`
  }
  const role = profile.role || (Array.isArray(profile.roles) && profile.roles.includes('agent') ? 'agent' : 'tenant')
  const accountType = profile.account_type || profile.accountType || (role === 'agent' ? 'agent' : 'Free Member')
  const roles = profile.roles || [role]
  if (name || email || avatar || role) return { name, email, avatar, role, accountType, roles }
  return null
}

const isAdmin = computed(() => {
  const role = currentUser.value?.role || ''
  const roles = currentUser.value?.roles || []
  const email = currentUser.value?.email || ''
  return (
    role === 'admin' ||
    role === 'super-admin' ||
    (Array.isArray(roles) && roles.some(r => r === 'admin' || r === 'super-admin' || r?.slug === 'admin')) ||
    localStorage.getItem('vibe_user_role') === 'admin' ||
    email === 'admin@vibelocate.ai'
  )
})

const isAgent = computed(() => {
  const role = currentUser.value?.role || ''
  const accountType = currentUser.value?.accountType || ''
  const roles = currentUser.value?.roles || []
  return (
    !isAdmin.value && (
      role === 'agent' ||
      accountType === 'agent' ||
      (Array.isArray(roles) && roles.some(r => r === 'agent' || r?.slug === 'agent')) ||
      localStorage.getItem('vibe_user_role') === 'agent'
    )
  )
})

const loadUser = () => {
  const stored = localStorage.getItem('auth_user') || localStorage.getItem('user') || sessionStorage.getItem('auth_user') || sessionStorage.getItem('user')
  if (stored) {
    try {
      const parsed = parseUserData(JSON.parse(stored))
      if (parsed) currentUser.value = parsed
    } catch {}
  }
  const direct = authService.getCurrentUser?.()
  if (direct) {
    const parsed = parseUserData(direct)
    if (parsed) currentUser.value = { ...currentUser.value, ...parsed }
  }
}

const displayName = computed(() =>
  currentUser.value?.name || currentUser.value?.username || (isLoggedIn.value ? (isRtl.value ? 'عضو موثق' : 'Verified Member') : (isRtl.value ? 'حساب زائر' : 'Guest Account'))
)
const displayEmail = computed(() => currentUser.value?.email || 'guest@vibelocate.ai')
const userAvatarUrl = computed(() => currentUser.value?.avatar || currentUser.value?.photo_url || '/images/1.png')
const onAvatarError = (e) => { e.target.src = '/images/1.png' }

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Lock background scroll when mobile sidebar drawer is open
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Auto close drawer when route changes
watch(() => router.currentRoute.value.fullPath, () => {
  mobileMenuOpen.value = false
  profileMenuOpen.value = false
})

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    mobileMenuOpen.value = false
    profileMenuOpen.value = false
  }
}

const handleLogout = () => {
  authService.logout()
  currentUser.value = null
  profileMenuOpen.value = false
  mobileMenuOpen.value = false
  router.push('/login')
}

const goto = (path) => {
  profileMenuOpen.value = false
  mobileMenuOpen.value = false
  router.push(path)
}

const openFavorites = () => {
  profileMenuOpen.value = false
  mobileMenuOpen.value = false
  router.push('/favorites')
}

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

const handleDocumentClick = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    profileMenuOpen.value = false
  }
}

onMounted(() => {
  loadUser()
  notificationService.refreshUnreadCount()
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleDocumentClick)
  window.addEventListener('keydown', handleKeyDown)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  height: 76px;
  background-color: rgba(6, 16, 30, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.site-header.scrolled {
  background-color: rgba(6, 16, 30, 0.98);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.45);
  border-bottom-color: rgba(0, 210, 255, 0.25);
}
.header-inner {
  max-width: 1400px; margin: 0 auto; height: 100%;
  display: flex; align-items: center; justify-content: space-between; padding: 0 76px; gap: 42px;
}
.brand { display: flex; align-items: center; text-decoration: none; flex-shrink: 0; }
.brand-logo-wrap { display: flex; align-items: center; gap: 10px; }
.brand-logo-img { height: 36px; max-width: 160px; width: auto; object-fit: contain; filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.18)) contrast(1.06) brightness(1.02); transition: all 0.3s ease; }
.brand:hover .brand-logo-img { transform: scale(1.03); filter: drop-shadow(0 4px 14px rgba(0, 210, 255, 0.4)) contrast(1.08) brightness(1.05); }
.brand-text { display: inline-flex; align-items: center; gap: 0.35rem; user-select: none; }
.brand-title { font-size: 1.15rem; font-weight: 800; letter-spacing: -0.04em; color: #fff; line-height: 1; }
.brand-accent { color: #00d2ff; text-shadow: 0 0 16px rgba(0, 210, 255, 0.35); }
.brand-badge { font-size: 0.68rem; font-weight: 800; letter-spacing: 0.05em; color: #fff; background: linear-gradient(135deg, #2563eb, #00d2ff); padding: 0.18rem 0.46rem; border-radius: 6px; box-shadow: 0 2px 6px rgba(0, 210, 255, 0.3); line-height: 1; }

/* Desktop Navigation */
.nav-links { display: flex; align-items: center; gap: 32px; height: 100%; }
.nav-item { position: relative; display: flex; align-items: center; height: 100%; font-size: 15px; font-weight: 600; color: #cbd5e1; text-decoration: none; transition: color 0.2s; white-space: nowrap; }
.nav-item:hover { color: #fff; background: transparent; }
.nav-item.active, .nav-item.router-link-active { color: #00d2ff; font-weight: 700; background: transparent; }
.nav-item.router-link-active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #00d2ff; border-radius: 3px 3px 0 0; box-shadow: 0 -2px 8px rgba(0, 210, 255, 0.35); }

/* Header Actions */
.header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.btn-list-property { height: 34px; padding: 0 20px; background-color: #008bd0; color: #fff; font-size: 13px; font-weight: 700; border: none; border-radius: 999px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 14px rgba(0, 139, 208, 0.28); transition: 0.2s ease; }
.btn-list-property:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45); }
.icon-action-btn { width: 36px; height: 36px; display: grid; place-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; color: #cbd5e1; cursor: pointer; transition: 0.2s ease; position: relative; }
.icon-action-btn:hover { color: #fff; background: rgba(255,255,255,0.12); border-color: rgba(239,68,68,0.4); }
.icon-action-btn.has-saved { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; }
.header-fav-badge { position: absolute; top: -3px; right: -3px; background: #ef4444; color: #fff; font-size: 0.55rem; font-weight: 700; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.notification-nav-badge { position: absolute; top: -3px; right: -3px; background: #ef4444; color: #fff; font-size: 0.55rem; font-weight: 700; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }

/* Desktop Profile Menu */
.user-profile-menu-container { position: relative; }
.user-profile-menu { display: flex; align-items: center; gap: 6px; cursor: pointer; padding: 3px 8px 3px 4px; border-radius: 999px; transition: background 0.2s; }
.user-profile-menu:hover { background: rgba(255,255,255,0.06); }
.header-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,210,255,0.4); }
.profile-arrow { font-size: 0.65rem; color: #64748b; transition: transform 0.3s ease; }
.profile-arrow.rotate-180 { transform: rotate(180deg); }
.profile-dropdown-box { position: absolute; top: calc(100% + 12px); right: 0; width: 280px; background: #0d1526; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); overflow: hidden; z-index: 2000; }
[dir="rtl"] .profile-dropdown-box { right: auto; left: 0; }
.dropdown-user-header { display: flex; align-items: center; gap: 12px; padding: 16px; background: linear-gradient(135deg, rgba(0,114,255,0.1), rgba(0,210,255,0.05)); }
.dropdown-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,210,255,0.4); flex-shrink: 0; }
.dropdown-user-info { display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
.dropdown-user-name { font-size: 0.9rem; color: #e2e8f0; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-user-email { font-size: 0.75rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dropdown-user-badge { font-size: 0.7rem; color: #00d2ff; display: flex; align-items: center; gap: 4px; }
.dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); }
.dropdown-menu-list { padding: 8px; }
.dropdown-menu-item { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: none; border: none; border-radius: 10px; color: #94a3b8; font-size: 0.85rem; cursor: pointer; text-align: start; transition: all 0.2s; }
.dropdown-menu-item:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; }
.dropdown-menu-item i { width: 18px; text-align: center; font-size: 0.85rem; }
.dropdown-footer-actions { padding: 10px 12px 12px; }
.dropdown-logout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; color: #ef4444; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.dropdown-logout-btn:hover { background: rgba(239,68,68,0.15); }
.dropdown-guest-actions { display: flex; gap: 8px; }
.dropdown-login-btn, .dropdown-signup-btn { flex: 1; padding: 9px; border-radius: 10px; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.dropdown-login-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #e2e8f0; }
.dropdown-signup-btn { background: linear-gradient(135deg, #0072ff, #00d2ff); border: none; color: #fff; }

/* Menu Toggle Button (Mobile) */
.menu-toggle {
  display: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #e2e8f0;
  width: 40px;
  height: 40px;
  font-size: 1.15rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}
.menu-toggle:hover, .menu-toggle.active {
  background: rgba(0, 210, 255, 0.15);
  border-color: #00d2ff;
  color: #00d2ff;
  transform: scale(1.05);
}

/* Dropdown Transitions */
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

/* ==================== MOBILE SIDEBAR DRAWER (OFF-CANVAS) ==================== */
.mobile-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.68);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 9998;
}
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.3s ease; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }

.mobile-sidebar-drawer {
  position: fixed;
  top: 0; bottom: 0;
  width: 320px;
  max-width: 86vw;
  background: #081122;
  border-inline-end: 1px solid rgba(0, 210, 255, 0.18);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}
[dir="rtl"] .mobile-sidebar-drawer { right: 0; left: auto; }
[dir="ltr"] .mobile-sidebar-drawer { left: 0; right: auto; }

/* Slide Transitions */
.drawer-slide-rtl-enter-active, .drawer-slide-rtl-leave-active,
.drawer-slide-ltr-enter-active, .drawer-slide-ltr-leave-active {
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-rtl-enter-from, .drawer-slide-rtl-leave-to { transform: translateX(100%); }
.drawer-slide-ltr-enter-from, .drawer-slide-ltr-leave-to { transform: translateX(-100%); }

/* Drawer Header */
.drawer-header {
  height: 72px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
}
.drawer-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.drawer-brand-img { height: 32px; width: auto; object-fit: contain; }
.drawer-brand-text { display: flex; align-items: center; gap: 4px; }
.drawer-title { font-family: 'Outfit', sans-serif; font-size: 1.15rem; font-weight: 800; color: #ffffff; }
.drawer-accent { color: #00d2ff; }
.drawer-badge {
  font-size: 0.6rem;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #00d2ff);
  padding: 2px 6px;
  border-radius: 5px;
}
.drawer-close-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.drawer-close-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
  transform: rotate(90deg);
}

/* Drawer Scrollable Body */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.drawer-body::-webkit-scrollbar { width: 4px; }
.drawer-body::-webkit-scrollbar-thumb { background: rgba(0, 210, 255, 0.2); border-radius: 4px; }

/* Drawer User / Guest Section */
.drawer-user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.drawer-user-card:hover {
  background: rgba(0, 210, 255, 0.08);
  border-color: #00d2ff;
}
.drawer-user-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #00d2ff; flex-shrink: 0; }
.drawer-user-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.drawer-user-name { font-size: 0.9rem; font-weight: 700; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.drawer-user-email { font-size: 0.74rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.drawer-user-status { font-size: 0.68rem; font-weight: 700; color: #00d2ff; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
.drawer-card-arrow { font-size: 0.8rem; color: #64748b; }

.drawer-guest-card {
  padding: 14px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(0, 210, 255, 0.06));
  border: 1px solid rgba(0, 210, 255, 0.18);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.drawer-guest-info { display: flex; gap: 10px; align-items: flex-start; }
.drawer-guest-icon { width: 34px; height: 34px; border-radius: 10px; background: rgba(0, 210, 255, 0.15); color: #00d2ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem; }
.drawer-guest-title { font-size: 0.86rem; color: #ffffff; display: block; margin-bottom: 2px; }
.drawer-guest-desc { font-size: 0.74rem; color: #94a3b8; line-height: 1.35; margin: 0; }
.drawer-guest-btns { display: flex; gap: 8px; }
.btn-drawer-login, .btn-drawer-signup {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-drawer-login {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f1f5f9;
}
.btn-drawer-signup {
  background: linear-gradient(135deg, #0284c7, #2563eb);
  border: none;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
}

/* List Property Button */
.drawer-cta-section { width: 100%; }
.drawer-btn-add-prop {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
  transition: all 0.22s ease;
}
.drawer-btn-add-prop:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(2, 132, 199, 0.5);
}
.btn-add-icon { font-size: 0.95rem; font-weight: 900; }

/* Navigation Groups */
.drawer-nav-group { display: flex; flex-direction: column; gap: 6px; }
.drawer-group-label {
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  padding: 0 6px 2px;
}
.drawer-nav-list { display: flex; flex-direction: column; gap: 3px; }
.drawer-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
  background: transparent;
  border: none;
  width: 100%;
  text-align: start;
}
.drawer-nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(3px);
}
[dir="rtl"] .drawer-nav-item:hover { transform: translateX(-3px); }
.drawer-nav-item.active {
  color: #00d2ff;
  font-weight: 700;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid rgba(0, 210, 255, 0.25);
}
.drawer-nav-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.04);
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.drawer-nav-item:hover .drawer-nav-icon,
.drawer-nav-item.active .drawer-nav-icon {
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.15);
}
.drawer-nav-icon.heart { color: #ef4444; }
.drawer-nav-icon.bell { color: #0284c7; }
.drawer-nav-label { flex: 1; }
.drawer-pill-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 20px;
  background: linear-gradient(135deg, #0284c7, #00d2ff);
  color: #ffffff;
}
.drawer-counter-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 10px;
  background: rgba(0, 210, 255, 0.2);
  color: #00d2ff;
}
.drawer-counter-badge.danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* Drawer Footer */
.drawer-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}
.drawer-controls-grid { display: flex; gap: 8px; }
.drawer-control-box {
  flex: 1;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.drawer-control-box:hover {
  background: rgba(0, 210, 255, 0.12);
  border-color: #00d2ff;
  color: #00d2ff;
}
.drawer-btn-logout {
  width: 100%;
  height: 36px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.drawer-btn-logout:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: #ef4444;
}

/* ==================== LIGHT THEME OVERRIDES ==================== */
[data-theme="light"] .site-header { background: rgba(255,255,255,0.96); border-bottom-color: #dbe3ed; box-shadow: 0 2px 12px rgba(15,23,42,0.10); }
[data-theme="light"] .site-header.scrolled { background: rgba(255,255,255,0.99); box-shadow: 0 4px 18px rgba(15,23,42,0.12); }
[data-theme="light"] .brand-title { color: #0f172a; }
[data-theme="light"] .nav-item { color: #1e293b; }
[data-theme="light"] .nav-item:hover, [data-theme="light"] .nav-item.router-link-active { color: #008fd4; background: transparent; }
[data-theme="light"] .icon-action-btn { background: #f7f9fc; border-color: #d4dfeb; color: #1e293b; }
[data-theme="light"] .user-profile-menu { background: #f2f6fb; border: 1px solid #d4dfeb; }
[data-theme="light"] .menu-toggle { background: #f1f5f9; border-color: #e2e8f0; color: #0f172a; }
[data-theme="light"] .profile-dropdown-box { background: #ffffff; border-color: #e2e8f0; box-shadow: 0 20px 60px rgba(0,0,0,0.12); }
[data-theme="light"] .dropdown-user-name { color: #0f172a; }
[data-theme="light"] .dropdown-user-email { color: #94a3b8; }
[data-theme="light"] .dropdown-menu-item { color: #475569; }
[data-theme="light"] .dropdown-menu-item:hover { background: #f1f5f9; color: #0f172a; }
[data-theme="light"] .dropdown-divider { background: #f1f5f9; }
[data-theme="light"] .dropdown-login-btn { background: #f1f5f9; border-color: #e2e8f0; color: #0f172a; }
[data-theme="light"] .header-avatar { border-color: #0072ff; }

/* Light Theme for Mobile Drawer */
[data-theme="light"].mobile-sidebar-drawer,
[data-theme="light"] .mobile-sidebar-drawer {
  background: #ffffff;
  border-inline-end: 1px solid #e2e8f0;
  box-shadow: 0 0 50px rgba(15, 23, 42, 0.18);
}
[data-theme="light"] .drawer-header {
  border-bottom-color: #f1f5f9;
  background: #f8fafc;
}
[data-theme="light"] .drawer-title { color: #0f172a; }
[data-theme="light"] .drawer-close-btn {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #475569;
}
[data-theme="light"] .drawer-user-card {
  background: #f8fafc;
  border-color: #e2e8f0;
}
[data-theme="light"] .drawer-user-card:hover {
  background: #f0f9ff;
  border-color: #0284c7;
}
[data-theme="light"] .drawer-user-name { color: #0f172a; }
[data-theme="light"] .drawer-guest-card {
  background: #f8fafc;
  border-color: #e2e8f0;
}
[data-theme="light"] .drawer-guest-title { color: #0f172a; }
[data-theme="light"] .drawer-guest-desc { color: #64748b; }
[data-theme="light"] .btn-drawer-login {
  background: #ffffff;
  border-color: #cbd5e1;
  color: #0f172a;
}
[data-theme="light"] .drawer-nav-item { color: #334155; }
[data-theme="light"] .drawer-nav-item:hover {
  background: #f1f5f9;
  color: #0284c7;
}
[data-theme="light"] .drawer-nav-item.active {
  background: #f0f9ff;
  border-color: #bae6fd;
  color: #0284c7;
}
[data-theme="light"] .drawer-nav-icon {
  background: #f1f5f9;
  color: #64748b;
}
[data-theme="light"] .drawer-footer {
  border-top-color: #f1f5f9;
  background: #f8fafc;
}
[data-theme="light"] .drawer-control-box {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #334155;
}
[data-theme="light"] .drawer-control-box:hover {
  background: #f0f9ff;
  border-color: #0284c7;
  color: #0284c7;
}

/* ==================== RESPONSIVE BREAKPOINTS ==================== */
@media (max-width: 1500px) {
  .header-inner { padding: 0 32px; gap: 24px; }
  .nav-links { gap: 20px; }
  .nav-item { font-size: 14px; }
  .btn-list-property { padding: 0 16px; }
}

@media (max-width: 992px) {
  .header-inner { padding: 0 16px; gap: 10px; }
  .nav-links { display: none !important; }
  .btn-list-property { display: none !important; }
  .menu-toggle { display: flex !important; }
}

@media (max-width: 768px) {
  .header-inner { padding: 0 12px; gap: 8px; }
  .header-actions { gap: 6px; }
  .header-actions :deep(.nav-controls-group),
  .nav-controls-group {
    display: none !important;
  }
  .menu-toggle {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
    flex-shrink: 0 !important;
    order: 99 !important;
    background: rgba(0, 210, 255, 0.14) !important;
    border: 1.5px solid rgba(0, 210, 255, 0.45) !important;
    color: #00d2ff !important;
    border-radius: 10px !important;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 210, 255, 0.2);
    margin-inline-start: 4px;
  }
}

@media (max-width: 520px) {
  .header-fav-btn {
    display: none !important;
  }
  .header-inner { padding: 0 10px; gap: 6px; }
  .brand-title { font-size: 1.05rem; }
  .brand-logo-img { height: 32px; }
  .icon-action-btn { width: 34px; height: 34px; }
  .user-profile-menu { height: 36px; padding: 2px 4px 2px 2px; }
  .header-avatar { width: 28px; height: 28px; }
}
</style>
