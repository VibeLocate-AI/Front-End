<template>
  <div class="app-container" :class="{ 'auth-mode': currentView !== 'landing' }">
    <!-- Background Video (only shown for auth pages) -->
    <template v-if="currentView !== 'landing'">
      <video ref="bgVideo" class="bg-video" autoplay muted playsinline>
        <source src="/images/bg.mp4" type="video/mp4">
      </video>
      <!-- Dark Overlay on top of video -->
      <div class="bg-overlay"></div>
    </template>

    <!-- Smooth Transition between Views -->
    <Transition name="fade-slide" mode="out-in">
      <LandingPage v-if="currentView === 'landing'" key="landing" @switch-view="switchView" />
      <SignUpPage v-else-if="currentView === 'signup'" key="signup" @switch-view="switchView" />
      <ResetPasswordPage v-else-if="currentView === 'resetPassword'" key="resetPassword" @switch-view="switchView" />
      <ResetSuccessPage v-else-if="currentView === 'resetSuccess'" key="resetSuccess" @switch-view="switchView" />
      <LoginPage v-else key="login" @switch-view="switchView" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import LoginPage from './components/LoginPage.vue'
import SignUpPage from './components/SignUpPage.vue'
import ResetPasswordPage from './components/ResetPasswordPage.vue'
import ResetSuccessPage from './components/ResetSuccessPage.vue'
import LandingPage from './components/LandingPage.vue'

const currentView = ref('landing')

const switchView = (view) => {
  currentView.value = view
}

// Background Video Seamless Loop (only for auth pages)
const bgVideo = ref(null)

const initVideo = () => {
  const video = bgVideo.value
  if (!video) return

  const FADE_DURATION = 1200
  const FADE_START = 1.5

  const animateOpacity = (from, to, duration) => {
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress
      video.style.opacity = from + (to - from) * ease
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  let fading = false

  video.addEventListener('timeupdate', () => {
    const remaining = video.duration - video.currentTime
    if (!fading && remaining <= FADE_START && remaining > 0) {
      fading = true
      animateOpacity(1, 0, FADE_DURATION)
    }
  })

  video.addEventListener('ended', () => {
    video.currentTime = 0
    video.play()
    fading = false
    animateOpacity(0, 1, FADE_DURATION)
  })
}

// Re-init video when switching to auth pages
watch(currentView, (newView) => {
  if (newView !== 'landing') {
    // Wait for DOM update then init video
    setTimeout(initVideo, 100)
  }
})

onMounted(() => {
  if (currentView.value !== 'landing') initVideo()
})
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}

/* Auth mode: center content like before */
.app-container.auth-mode {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #070d19;
  position: relative;
  overflow: hidden;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-14px) scale(0.98);
}
</style>
