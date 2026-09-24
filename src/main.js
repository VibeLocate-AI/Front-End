import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import './assets/theme.css'
import './assets/dubai-home.css'
import { initThemeAndLanguage } from './composables/useThemeAndLanguage'

// Initialize language (dir="rtl"/"ltr") and theme (data-theme="dark"/"light")
initThemeAndLanguage()

createApp(App).use(router).mount('#app')
