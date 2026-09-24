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

      <!-- Mobile Menu Toggle -->
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" @click="mobileMenuOpen = !mobileMenuOpen">
        <i class="fa-solid" :class="mobileMenuOpen ? 'fa-xmark' : 'fa-bars'"></i>
      </button>

      <!-- Navigation Links -->
      <nav class="nav-links" :class="{ open: mobileMenuOpen }" @click="mobileMenuOpen = false">
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
          class="icon-action-btn"
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

        <!-- User Profile Menu -->
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
                  <span class="dropdown-user-badge">
                    <i class="fa-solid fa-circle-check"></i>
                    {{ isLoggedIn ? (isRtl ? 'عضو موثق' : 'Verified Member') : (isRtl ? 'حساب زائر' : 'Guest Account') }}
                  </span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-menu-list">
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="goto('/profile')">
                  <i class="fa-regular fa-user"></i>
                  <span>{{ isRtl ? 'ملفي الشخصي' : 'My Profile' }}</span>
                </button>
                <button v-if="isLoggedIn" class="dropdown-menu-item" @click="goto('/my-properties')">
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
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarControls from './NavbarControls.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'
import { authService } from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import { notificationService } from '../services/notificationService'

const { t, isRtl, theme: currentTheme } = useThemeAndLanguage()
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
  const profile = raw?.data?.user || raw?.data || raw?.user || raw
  const name = profile.name || profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username || ''
  const email = profile.email || ''
  const avatar = profile.avatar || profile.profile_photo_url || profile.picture || profile.photo || profile.image || ''
  if (name || email || avatar) return { name, email, avatar }
  return null
}

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

const handleLogout = () => {
  authService.logout()
  currentUser.value = null
  profileMenuOpen.value = false
  router.push('/login')
}

const goto = (path) => {
  profileMenuOpen.value = false
  router.push(path)
}

const openFavorites = () => {
  profileMenuOpen.value = false
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
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
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
.nav-links { display: flex; align-items: center; gap: 32px; height: 100%; }
.nav-item { position: relative; display: flex; align-items: center; height: 100%; font-size: 15px; font-weight: 600; color: #cbd5e1; text-decoration: none; transition: color 0.2s; white-space: nowrap; }
.nav-item:hover { color: #fff; background: transparent; }
.nav-item.active, .nav-item.router-link-active { color: #00d2ff; font-weight: 700; background: transparent; }
.nav-item.router-link-active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #00d2ff; border-radius: 3px 3px 0 0; box-shadow: 0 -2px 8px rgba(0, 210, 255, 0.35); }
.header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.btn-list-property { height: 40px; padding: 0 20px; background-color: #008bd0; color: #fff; font-size: 13px; font-weight: 700; border: none; border-radius: 999px; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 14px rgba(0, 139, 208, 0.28); transition: 0.2s ease; }
.btn-list-property:hover { background-color: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45); }
.icon-action-btn { width: 42px; height: 42px; display: grid; place-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; color: #cbd5e1; cursor: pointer; transition: 0.2s ease; position: relative; }
.icon-action-btn:hover { color: #fff; background: rgba(255,255,255,0.12); border-color: rgba(239,68,68,0.4); }
.icon-action-btn.has-saved { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #ef4444; }
.header-fav-badge { position: absolute; top: -4px; right: -4px; background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 700; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.notification-nav-badge { position: absolute; top: -4px; right: -4px; background: #ef4444; color: #fff; font-size: 0.6rem; font-weight: 700; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
.user-profile-menu-container { position: relative; }
.user-profile-menu { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 10px 4px 5px; border-radius: 999px; transition: background 0.2s; }
.user-profile-menu:hover { background: rgba(255,255,255,0.06); }
.header-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(0,210,255,0.4); }
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
.menu-toggle { display: none; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e2e8f0; width: 38px; height: 38px; font-size: 1rem; cursor: pointer; margin-inline-start: auto; }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s cubic-bezier(0.16,1,0.3,1); }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

/* Light Theme */
[data-theme="light"] .site-header { background: rgba(255,255,255,0.96); border-bottom-color: #dbe3ed; box-shadow: 0 2px 12px rgba(15,23,42,0.10); }
[data-theme="light"] .site-header.scrolled { background: rgba(255,255,255,0.99); box-shadow: 0 4px 18px rgba(15,23,42,0.12); }
[data-theme="light"] .brand-title { color: #0f172a; }
[data-theme="light"] .nav-item { color: #1e293b; }
[data-theme="light"] .nav-item:hover, [data-theme="light"] .nav-item.router-link-active { color: #008fd4; background: transparent; }
[data-theme="light"] .nav-item.router-link-exact-active { color: #008fd4; background: transparent; }
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

/* Responsive */
@media (max-width: 1500px) {
  .header-inner { padding: 0 32px; gap: 24px; }
  .nav-links { gap: 20px; }
  .nav-item { font-size: 14px; }
  .btn-list-property { padding: 0 16px; }
}
@media (max-width: 900px) {
  .menu-toggle { display: flex; align-items: center; justify-content: center; }
  .nav-links { display: none; position: fixed; top: 76px; left: 0; right: 0; background: rgba(7,13,25,0.98); backdrop-filter: blur(20px); flex-direction: column; gap: 4px; padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .nav-links.open { display: flex; }
  .nav-item { width: 100%; padding: 12px 16px; border-radius: 10px; font-size: 0.95rem; }
  [data-theme="light"] .nav-links { background: rgba(255,255,255,0.98); border-bottom-color: #e2e8f0; }
  .btn-list-property { display: none; }
}
@media (max-width: 480px) {
  .header-inner { padding: 0 16px; gap: 10px; }
  .brand-title { font-size: 1rem; }
}
</style>
