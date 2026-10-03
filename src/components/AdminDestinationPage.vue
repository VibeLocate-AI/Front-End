<template>
  <div class="admin-portal-wrapper" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">
    <!-- Topographic Background Contours (SVG) -->
    <div class="topographic-bg" aria-hidden="true">
      <svg class="topo-svg" viewBox="0 0 1600 900" preserveAspectRatio="none">
        <!-- Topographic Contour Curves -->
        <path d="M -100 150 C 300 280, 600 50, 900 120 C 1200 190, 1400 40, 1700 80" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.3" />
        <path d="M -100 240 C 250 360, 550 140, 850 200 C 1150 260, 1350 120, 1700 160" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.25" />
        <path d="M -100 350 C 200 480, 500 240, 800 310 C 1100 380, 1300 220, 1700 260" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.2" />
        <path d="M -100 480 C 150 620, 450 360, 750 440 C 1050 520, 1250 340, 1700 390" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.18" />
        <path d="M -100 640 C 100 780, 400 500, 700 590 C 1000 680, 1200 480, 1700 540" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.15" />
        <path d="M -100 820 C 50 940, 350 660, 650 760 C 950 860, 1150 640, 1700 710" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.12" />

        <!-- Orbit Ellipse with Dashed Pattern -->
        <ellipse cx="480" cy="420" rx="460" ry="320" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 7" opacity="0.35" class="orbital-track" />
      </svg>
    </div>

    <!-- Floating Interactive Orbital Node Badges -->
    <div class="orbital-badge badge-top-left" aria-hidden="true">
      <span class="badge-dot blue"></span>
      <span>Dynamic cost pins</span>
    </div>

    <div class="orbital-badge badge-mid-left" aria-hidden="true">
      <span class="badge-dot red"></span>
      <span>Dynamic Cost Pins</span>
    </div>

    <div class="orbital-badge badge-mid-right" aria-hidden="true">
      <span class="badge-dot green"></span>
      <span>VibeMatch Percentages</span>
    </div>

    <!-- Architectural 3D Wireframe Blueprint at Bottom Right -->
    <div class="blueprint-wireframe" aria-hidden="true">
      <svg viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 40 180 L 160 230 L 300 170 L 180 120 Z" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
        <path d="M 40 140 L 160 190 L 300 130 L 180 80 Z" stroke="currentColor" stroke-width="1.2" opacity="0.5" />
        <path d="M 40 100 L 160 150 L 300 90 L 180 40 Z" stroke="currentColor" stroke-width="1.2" opacity="0.6" />
        <line x1="40" y1="180" x2="40" y2="100" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
        <line x1="160" y1="230" x2="160" y2="150" stroke="currentColor" stroke-width="1.2" opacity="0.5" />
        <line x1="300" y1="170" x2="300" y2="90" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
        <line x1="180" y1="120" x2="180" y2="40" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
        <!-- Inner rooms & balconies -->
        <path d="M 100 125 L 220 75" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.4" />
        <path d="M 100 165 L 220 115" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.4" />
        <path d="M 120 75 L 120 195" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.3" />
        <path d="M 220 55 L 220 175" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity="0.3" />
      </svg>
    </div>

    <!-- Header Section (Clock & Location) -->
    <header class="portal-header">
      <div class="portal-brand-mini" @click="goTo('/home')" role="button" tabindex="0">
        <span class="vibe-logo-text">Vibe<span class="logo-accent">Locate</span> <span class="ai-badge">AI</span></span>
      </div>

      <div class="portal-meta-clock">
        <div class="time-display">{{ currentTime }}</div>
        <div class="location-display">
          <i class="fa-solid fa-location-dot"></i>
          <span>{{ currentLocation }}</span>
        </div>
      </div>
    </header>

    <!-- Main Container -->
    <main class="portal-main-content">
      <!-- Title & Greeting -->
      <section class="portal-hero-text">
        <h1 class="portal-main-title">
          {{ isRtl ? 'مرحباً بك، الأدمن' : 'Welcome, Admin' }} <span class="admin-tag">(Admin)</span>
        </h1>
        <p class="portal-sub-title">
          {{ isRtl ? 'اختر وجهتك' : 'Choose Your Destination' }}
        </p>
      </section>

      <!-- Two Main Destination Cards -->
      <div class="destination-cards-grid">
        <!-- CARD 1: MAIN PLATFORM -->
        <article class="destination-card main-platform-card" @click="goTo('/home')">
          <div class="dest-card-header">
            <div class="dest-icon-container platform-icon">
              <!-- Building + Search Illustration -->
              <svg viewBox="0 0 64 64" fill="none" class="dest-svg-icon" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="16" width="30" height="42" rx="3" stroke="#0284c7" stroke-width="3" fill="#f0f9ff" />
                <line x1="16" y1="24" x2="22" y2="24" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
                <line x1="26" y1="24" x2="32" y2="24" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
                <line x1="16" y1="32" x2="22" y2="32" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
                <line x1="26" y1="32" x2="32" y2="32" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
                <line x1="16" y1="40" x2="22" y2="40" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
                <line x1="26" y1="40" x2="32" y2="40" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" />
                <!-- Magnifier -->
                <circle cx="44" cy="38" r="14" stroke="#0369a1" stroke-width="3.5" fill="#ffffff" />
                <line x1="54" y1="48" x2="60" y2="54" stroke="#0369a1" stroke-width="4" stroke-linecap="round" />
                <line x1="41" y1="34" x2="47" y2="34" stroke="#0284c7" stroke-width="2" stroke-linecap="round" />
                <line x1="41" y1="38" x2="47" y2="38" stroke="#0284c7" stroke-width="2" stroke-linecap="round" />
              </svg>
            </div>
            <h2 class="dest-card-title">{{ isRtl ? 'المنصة الرئيسية' : 'Main Platform' }}</h2>
          </div>

          <!-- UI Interactive Preview Mockup -->
          <div class="dest-preview-mockup platform-mockup">
            <div class="mockup-inner-grid">
              <!-- Left Properties Col -->
              <div class="mockup-properties-col">
                <div class="mock-property-card">
                  <div class="mock-img-placeholder mock-img-1"></div>
                  <div class="mock-info">
                    <span class="mock-title">Downtown Dubai</span>
                    <span class="mock-badge">Vibe Match <strong>95.0</strong></span>
                  </div>
                </div>
                <div class="mock-property-card">
                  <div class="mock-img-placeholder mock-img-2"></div>
                  <div class="mock-info">
                    <span class="mock-title">Dubai Marina</span>
                    <span class="mock-badge">Vibe Match <strong>96.5</strong></span>
                  </div>
                </div>
              </div>

              <!-- Right Map Col -->
              <div class="mockup-map-col">
                <div class="mock-search-bar">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <span>Search</span>
                </div>
                <div class="mock-map-canvas">
                  <!-- Road lines -->
                  <svg class="mini-roads" viewBox="0 0 100 100">
                    <path d="M 0 30 Q 50 60, 100 20" stroke="#cbd5e1" stroke-width="3" fill="none" />
                    <path d="M 30 0 Q 60 50, 40 100" stroke="#cbd5e1" stroke-width="2.5" fill="none" />
                    <path d="M 70 0 Q 80 60, 100 90" stroke="#e2e8f0" stroke-width="2" fill="none" />
                  </svg>
                  <!-- Map Pins -->
                  <div class="mock-pin pin-1" title="Cost Pins">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Cost Pins</span>
                  </div>
                  <div class="mock-pin pin-2">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div class="mock-zoom-controls">
                    <span>+</span>
                    <span>-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="dest-btn-wrap">
            <button type="button" class="btn-dest-action" @click.stop="goTo('/home')">
              <span>{{ isRtl ? 'انتقل إلى المنصة الرئيسية' : 'Go to Main Platform' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>
        </article>

        <!-- CARD 2: ADMIN DASHBOARD -->
        <article class="destination-card admin-dashboard-card" @click="goTo('/admin')">
          <div class="dest-card-header">
            <div class="dest-icon-container admin-icon">
              <!-- Monitor + Chart + Gears Illustration -->
              <svg viewBox="0 0 64 64" fill="none" class="dest-svg-icon" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="10" width="52" height="38" rx="4" stroke="#0f766e" stroke-width="3" fill="#f0fdfa" />
                <line x1="24" y1="48" x2="20" y2="58" stroke="#0f766e" stroke-width="3" stroke-linecap="round" />
                <line x1="40" y1="48" x2="44" y2="58" stroke="#0f766e" stroke-width="3" stroke-linecap="round" />
                <line x1="16" y1="58" x2="48" y2="58" stroke="#0f766e" stroke-width="3" stroke-linecap="round" />
                <!-- Chart line -->
                <path d="M 12 36 Q 22 24, 30 30 T 48 18" stroke="#0d9488" stroke-width="3" stroke-linecap="round" fill="none" />
                <!-- Gear -->
                <circle cx="48" cy="38" r="8" stroke="#0f766e" stroke-width="2.5" fill="#ffffff" />
                <circle cx="48" cy="38" r="3" fill="#0f766e" />
              </svg>
            </div>
            <h2 class="dest-card-title">{{ isRtl ? 'لوحة التحكم بالأدمن' : 'Admin Dashboard' }}</h2>
          </div>

          <!-- UI Interactive Preview Mockup -->
          <div class="dest-preview-mockup admin-mockup">
            <div class="mockup-admin-grid">
              <!-- Top Row: AI Gauge & Wave Chart -->
              <div class="admin-mock-top-row">
                <div class="mock-ai-gauge-box">
                  <span class="gauge-lbl">AI Performance</span>
                  <div class="circular-meter">
                    <svg viewBox="0 0 36 36" class="meter-svg">
                      <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path class="circle-fill" stroke-dasharray="95, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="meter-num">95%</div>
                  </div>
                  <span class="meter-sub">Badge 95%</span>
                </div>

                <div class="mock-chart-box">
                  <div class="chart-header">
                    <span>Dashboard</span>
                    <i class="fa-solid fa-chart-line text-cyan"></i>
                  </div>
                  <svg class="mini-wave-chart" viewBox="0 0 100 40">
                    <path d="M 0 30 Q 25 10, 50 25 T 100 12 L 100 40 L 0 40 Z" fill="rgba(14, 165, 233, 0.15)" />
                    <path d="M 0 30 Q 25 10, 50 25 T 100 12" stroke="#0284c7" stroke-width="2.5" fill="none" />
                  </svg>
                  <div class="chart-ticks">
                    <span>20m</span><span>5m</span><span>Sec</span><span>Live</span>
                  </div>
                </div>
              </div>

              <!-- Bottom Row: Python & System Telemetry -->
              <div class="admin-mock-bottom-row">
                <div class="telemetry-item">
                  <i class="fa-brands fa-python text-emerald"></i>
                  <div>
                    <div class="lbl">Processing Speed</div>
                    <div class="val">45.5ips</div>
                  </div>
                </div>
                <div class="telemetry-item">
                  <i class="fa-solid fa-server text-cyan"></i>
                  <div>
                    <div class="lbl">Cost Efficiency</div>
                    <div class="val">$5.4X.57</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="dest-btn-wrap">
            <button type="button" class="btn-dest-action" @click.stop="goTo('/admin')">
              <span>{{ isRtl ? 'انتقل إلى لوحة التحكم' : 'Go to Admin Dashboard' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const router = useRouter()
const { isRtl, theme: currentTheme } = useThemeAndLanguage()

const currentTime = ref('')
const currentLocation = ref('Nablus, West Bank, Palestine')
let clockInterval = null

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })
}

const goTo = (path) => {
  router.push(path)
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)

  // Try detecting local city / timezone if available
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (tz && tz.includes('Gaza') || tz.includes('Hebron') || tz.includes('Jerusalem')) {
      currentLocation.value = 'Palestine'
    } else if (tz && tz.includes('Dubai')) {
      currentLocation.value = 'Dubai, UAE'
    }
  } catch {}
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})
</script>

<style scoped>
.admin-portal-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* TOPOGRAPHIC CONTOUR BACKGROUND */
.topographic-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  color: #94a3b8;
  overflow: hidden;
}

.topo-svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ORBITAL BADGES */
.orbital-badge {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 999px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
  animation: floatOrbital 6s ease-in-out infinite;
}

.badge-top-left {
  top: 140px;
  left: 120px;
  animation-delay: 0s;
}

.badge-mid-left {
  top: 480px;
  left: 130px;
  animation-delay: 1.5s;
}

.badge-mid-right {
  top: 470px;
  right: 140px;
  animation-delay: 3s;
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.badge-dot.blue { background-color: #0284c7; box-shadow: 0 0 8px #0284c7; }
.badge-dot.red { background-color: #ef4444; box-shadow: 0 0 8px #ef4444; }
.badge-dot.green { background-color: #10b981; box-shadow: 0 0 8px #10b981; }

@keyframes floatOrbital {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

/* 3D BLUEPRINT WIREFRAME */
.blueprint-wireframe {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 380px;
  height: 290px;
  pointer-events: none;
  z-index: 2;
  color: #94a3b8;
  opacity: 0.65;
}

/* PORTAL HEADER */
.portal-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  width: 100%;
}

.portal-brand-mini {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.vibe-logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

.logo-accent {
  color: #0284c7;
}

.ai-badge {
  background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  margin-inline-start: 4px;
}

.portal-meta-clock {
  text-align: end;
  font-size: 13px;
  color: #475569;
}

.time-display {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.location-display {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
}

.location-display i {
  color: #0284c7;
  font-size: 11px;
}

/* MAIN CONTENT */
.portal-main-content {
  position: relative;
  z-index: 10;
  max-width: 1240px;
  margin: 0 auto;
  padding: 10px 24px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

/* HERO TEXT */
.portal-hero-text {
  text-align: center;
  margin-bottom: 36px;
}

.portal-main-title {
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}

.admin-tag {
  color: #0284c7;
  font-size: 28px;
}

.portal-sub-title {
  font-size: 18px;
  font-weight: 600;
  color: #64748b;
  margin: 0;
}

/* DESTINATION CARDS GRID */
.destination-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(360px, 480px));
  gap: 32px;
  justify-content: center;
  width: 100%;
}

.destination-card {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  box-shadow: 0 16px 45px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04);
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.destination-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12), 0 0 25px rgba(2, 132, 199, 0.15);
  border-color: rgba(2, 132, 199, 0.4);
}

.dest-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.dest-icon-container {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #f1f5f9;
}

.dest-svg-icon {
  width: 42px;
  height: 42px;
}

.dest-card-title {
  font-size: 23px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

/* UI MOCKUP PREVIEW AREA */
.dest-preview-mockup {
  background: #f8fafc;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  padding: 16px;
  min-height: 240px;
  margin-bottom: 26px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* MOCKUP 1: MAIN PLATFORM */
.mockup-inner-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
  height: 100%;
}

.mockup-properties-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mock-property-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.mock-img-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
}

.mock-img-1 {
  background-image: url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=150&q=80');
}
.mock-img-2 {
  background-image: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80');
}

.mock-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mock-title {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mock-badge {
  font-size: 9.5px;
  color: #0284c7;
  font-weight: 600;
  margin-top: 2px;
}

.mockup-map-col {
  background: #eef2f6;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mock-search-bar {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 5;
  background: #ffffff;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 10px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.mock-map-canvas {
  width: 100%;
  height: 100%;
  position: relative;
}

.mini-roads {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mock-pin {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 9px;
  font-weight: 700;
  color: #0f172a;
}

.mock-pin.pin-1 {
  bottom: 24px;
  left: 14px;
}
.mock-pin.pin-1 i { color: #0284c7; }

.mock-pin.pin-2 {
  top: 50px;
  right: 20px;
  padding: 4px;
  border-radius: 50%;
}
.mock-pin.pin-2 i { color: #0284c7; }

.mock-zoom-controls {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.mock-zoom-controls span {
  padding: 2px 6px;
}

/* MOCKUP 2: ADMIN DASHBOARD */
.mockup-admin-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-mock-top-row {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 12px;
}

.mock-ai-gauge-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.gauge-lbl {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 6px;
}

.circular-meter {
  position: relative;
  width: 48px;
  height: 48px;
}

.meter-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circle-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 3.5;
}

.circle-fill {
  fill: none;
  stroke: #0284c7;
  stroke-width: 3.5;
  stroke-linecap: round;
}

.meter-num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #0f172a;
}

.meter-sub {
  font-size: 9px;
  color: #94a3b8;
  margin-top: 4px;
}

.mock-chart-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
}

.mini-wave-chart {
  width: 100%;
  height: 38px;
}

.chart-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 8px;
  color: #94a3b8;
}

.admin-mock-bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.telemetry-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
}

.telemetry-item i {
  font-size: 16px;
}

.telemetry-item .lbl {
  font-size: 9px;
  color: #64748b;
}

.telemetry-item .val {
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
}

.text-cyan { color: #0284c7; }
.text-emerald { color: #10b981; }

/* ACTION BUTTON */
.dest-btn-wrap {
  margin-top: auto;
}

.btn-dest-action {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #17435f 0%, #102e42 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 16px rgba(16, 46, 66, 0.35);
}

.btn-dest-action:hover {
  background: linear-gradient(135deg, #1f587d 0%, #153b54 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(16, 46, 66, 0.45);
}

.btn-dest-action:active {
  transform: translateY(0);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .destination-cards-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
  .portal-header {
    padding: 16px 20px;
  }
  .blueprint-wireframe {
    display: none;
  }
  .orbital-badge {
    display: none;
  }
}
</style>
