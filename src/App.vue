<template>
  <div class="app-container" :class="{ 'auth-mode': isAuthPage }" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme">
    <!-- Background Video (Auth Pages Only) -->
    <template v-if="isAuthPage">
      <video ref="bgVideo" class="bg-video" autoplay muted playsinline>
        <source src="/images/bg.mp4" type="video/mp4">
      </video>
      <div class="bg-overlay"></div>
    </template>

    <!-- Global Navbar (Main Pages Only) -->
    <AppNavbar v-if="isMainPage" @open-saved="savedModalOpen = true" />

    <!-- Page Content -->
    <div :class="{ 'page-content-wrapper': isMainPage }">
      <RouterView :key="route.fullPath" @switch-view="switchView" />
    </div>

    <!-- Global Footer (Main Pages Only) -->
    <AppFooter v-if="showFooter" />

    <!-- Global Saved Properties Modal -->
    <SavedPropertiesModal
      v-if="isMainPage"
      :is-open="savedModalOpen"
      @close="savedModalOpen = false"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeAndLanguage } from './composables/useThemeAndLanguage'
import { usePageTranslations } from './composables/usePageTranslations'
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import SavedPropertiesModal from './components/SavedPropertiesModal.vue'

const { isRtl, theme, lang } = useThemeAndLanguage()

const route = useRoute()
const router = useRouter()
const bgVideo = ref(null)

usePageTranslations(lang, () => route.fullPath)
const savedModalOpen = ref(false)

// Auth page routes (login, register, etc.) - show video BG
const authPageNames = ['Login', 'Register', 'Verify', 'ForgotPassword', 'ResetPassword', 'ResetSuccess']

// Pages with the shared navbar (all main app pages)
const mainPageNames = ['Home', 'HomeAlias', 'Buy', 'Rent', 'Map', 'Profile', 'ProfileTab', 'AddProperty', 'PropertyDetails', 'MyProperties', 'NewProjects', 'About', 'Favorites', 'Notifications', 'Payment', 'PropertyBooking']

const isAuthPage = computed(() => authPageNames.includes(route.name))
const isMainPage = computed(() => mainPageNames.includes(route.name))
const showFooter = computed(() => isMainPage.value)

const viewRoutes = {
  landing: '/',
  login: '/login',
  signup: '/register',
  resetPassword: '/forgot-password',
  resetSuccess: '/reset-success'
}
const switchView = (view) => router.push(viewRoutes[view] || '/login')

watch(() => route.name, async () => {
  if (isAuthPage.value) {
    await nextTick()
    bgVideo.value?.play().catch(() => {})
  }
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.app-container.auth-mode {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #070d19;
  position: relative;
  overflow: hidden;
}

/* Pad page content below fixed navbar on main pages */
.page-content-wrapper {
  padding-top: 76px;
  min-height: calc(100vh - 76px);
}

.bg-video {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.3;
  z-index: 0;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(7,13,25,0.6) 0%, rgba(7,13,25,0.9) 100%);
  z-index: 1;
}
</style>
