<template>
  <div class="app-container" :class="{ 'auth-mode': route.name !== 'Landing' }">
    <template v-if="route.name !== 'Landing'">
      <video ref="bgVideo" class="bg-video" autoplay muted playsinline>
        <source src="/images/bg.mp4" type="video/mp4">
      </video>
      <div class="bg-overlay"></div>
    </template>

    <RouterView :key="route.fullPath" @switch-view="switchView" />
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const bgVideo = ref(null)
const viewRoutes = { landing: '/', login: '/login', signup: '/register', resetPassword: '/forgot-password', resetSuccess: '/reset-success' }
const switchView = (view) => router.push(viewRoutes[view] || '/login')

watch(() => route.name, async (name) => {
  if (name !== 'Landing') {
    await nextTick()
    bgVideo.value?.play().catch(() => {})
  }
})
</script>

<style>
.app-container { width: 100%; min-height: 100vh; position: relative; }
.app-container.auth-mode { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #070d19; position: relative; overflow: hidden; }
</style>
