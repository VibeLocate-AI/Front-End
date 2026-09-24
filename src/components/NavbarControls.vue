<template>
  <div class="nav-controls-group">
    <!-- ==================== LANGUAGE SWITCHER BUTTON ==================== -->
    <button
      type="button"
      class="nav-ctrl-btn lang-switcher-btn"
      :title="isRtl ? 'Switch to English (LTR)' : 'Switch to Arabic (RTL)'"
      :aria-label="isRtl ? 'Switch to English' : 'Switch to Arabic'"
      @click="toggleLanguage"
    >
      <span class="current-language">{{ lang === 'ar' ? 'AR' : 'EN' }}</span>
    </button>

    <!-- ==================== THEME TOGGLE BUTTON ==================== -->
    <button
      type="button"
      class="nav-ctrl-btn theme-toggle-btn"
      :class="isDark ? 'is-dark' : 'is-light'"
      :title="isDark ? (isRtl ? 'التحويل للوضع الفاتح (Light Mode)' : 'Switch to Light Mode') : (isRtl ? 'التحويل للوضع الداكن (Dark Mode)' : 'Switch to Dark Mode')"
      :aria-label="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
      @click="toggleTheme"
    >
      <Transition name="theme-rotate" mode="out-in">
        <!-- Moon Icon (in Dark Mode) -->
        <div v-if="isDark" key="dark" class="theme-icon-wrap moon-glow">
          <i class="fa-solid fa-moon"></i>
        </div>
        <!-- Sun Icon (in Light Mode) -->
        <div v-else key="light" class="theme-icon-wrap sun-glow">
          <i class="fa-solid fa-sun"></i>
        </div>
      </Transition>
    </button>
  </div>
</template>

<script setup>
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { lang, theme, isRtl, isDark, toggleLanguage, toggleTheme } = useThemeAndLanguage()
</script>

<style scoped>
.nav-controls-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Base button style matching luxury navbar */
.nav-ctrl-btn {
  height: 42px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  user-select: none;
}

.nav-ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 210, 255, 0.4);
  color: #ffffff;
  transform: translateY(-1px);
}

/* ==================== LANGUAGE SWITCHER ==================== */
.lang-switcher-btn {
  height: 34px;
  width: 34px;
  min-width: 34px;
  padding: 0;
  border-radius: 50%;
  font-family: inherit;
}

.current-language {
  color: #00d2ff;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

/* ==================== THEME TOGGLE ==================== */
.theme-toggle-btn {
  width: 42px;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.theme-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  width: 100%;
  height: 100%;
}

.moon-glow {
  color: #38bdf8;
  filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.6));
}

.sun-glow {
  color: #f59e0b;
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.6));
}

/* Icon rotation animation */
.theme-rotate-enter-active,
.theme-rotate-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.theme-rotate-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}

.theme-rotate-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}

/* Light theme overrides for buttons */
:global([data-theme="light"]) .nav-ctrl-btn {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

:global([data-theme="light"]) .nav-ctrl-btn:hover {
  background: #e2e8f0;
  border-color: #2563eb;
  color: #1e293b;
}

:global([data-theme="light"]) .current-language {
  color: #2563eb;
}

:global([data-theme="light"]) .lang-sep {
  color: #94a3b8;
}

:global([data-theme="light"]) .theme-toggle-btn.is-light {
  border-color: rgba(245, 158, 11, 0.4);
  background: #fef3c7;
}

:global([data-theme="light"]) .theme-toggle-btn.is-light:hover {
  background: #fde68a;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
}
</style>
