<template>
  <div class="app-container">
    <!-- Background Video (Runs smoothly and continuously across all pages) -->
    <video ref="bgVideo" class="bg-video" autoplay muted playsinline>
      <source src="/images/bg.mp4" type="video/mp4">
    </video>
    <!-- Dark Ambient Overlay -->
    <div class="bg-overlay"></div>

    <!-- Smooth Page Transition between Views with Router -->
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const bgVideo = ref(null)

onMounted(() => {
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
})
</script>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 840px) {
  .app-container {
    min-height: 100vh;
    height: auto;
    align-items: flex-start;
    padding: 16px 0 36px 0;
  }
}

/* Smooth Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.38s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(22px) scale(0.96);
  filter: blur(4px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-22px) scale(0.96);
  filter: blur(4px);
}
</style>
