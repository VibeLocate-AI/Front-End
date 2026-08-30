<template>
  <div class="page-container">
    <main class="login-wrapper">
    <div class="login-card">
      
      <!-- Left Panel (Navy Blue Theme) -->
      <section class="left-panel">
        <div class="left-content">
          
          <!-- Brand Logo Header -->
          <div class="brand-header">
            <div class="transparent-logo-wrapper">
              <img src="/images/logo_transparent.png" alt="VibeLocate AI Logo" class="transparent-logo-img">
            </div>
          </div>

          <!-- Feature Bullet Points (Dynamic Loop) -->
          <ul class="feature-list">
            <li 
              v-for="(feature, index) in features" 
              :key="index" 
              class="feature-item"
            >
              <div class="check-box" aria-hidden="true">
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span class="feature-text">{{ feature }}</span>
            </li>
          </ul>

        </div>
      </section>

      <!-- Right Panel (White Theme) -->
      <section class="right-panel">
        <div class="right-content">
          
          <header class="form-header">
            <h2 class="welcome-heading">Welcome back , Log in to account</h2>
          </header>

          <form @submit.prevent="handleLogin" class="login-form" novalidate>
            
            <!-- Email Input Group -->
            <div class="form-group" :class="{ error: errors.email }">
              <label for="email" class="field-label">Email</label>
              <div class="input-container">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </span>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  @input="clearError('email')"
                  class="form-input" 
                  placeholder="Type Your Email" 
                  required 
                  autocomplete="email"
                >
              </div>
              <span v-if="errors.email" class="error-msg">Please enter a valid email address.</span>
            </div>

            <!-- Password Input Group -->
            <div class="form-group" :class="{ error: errors.password }">
              <label for="password" class="field-label">password</label>
              <div class="input-container">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  :type="isPasswordVisible ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  @input="clearError('password')"
                  class="form-input" 
                  placeholder="••••••••••••" 
                  required 
                  autocomplete="current-password"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="togglePasswordVisibility" 
                  :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="!isPasswordVisible" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="error-msg">Password must be at least 6 characters.</span>
            </div>

            <!-- Options Row (Remember Me & Forget Password) -->
            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" id="rememberMe" v-model="rememberMe">
                <span class="custom-checkbox" aria-hidden="true">
                  <svg class="checkbox-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="checkbox-label">Remember Me</span>
              </label>
              <a href="#forgot-password" @click.prevent="$emit('switch-view', 'resetPassword')" class="forgot-link">Forget Password?</a>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="submit-btn" id="submitBtn">
              <span>LOG IN</span>
            </button>

          </form>

          <!-- Divider -->
          <div class="divider">
            <span class="divider-line"></span>
            <span class="divider-text">OR</span>
            <span class="divider-line"></span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <button type="button" @click="handleGoogleLogin" class="social-btn google-btn" aria-label="Log in with Google" title="Log in with Google">
              <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.15C3.25 21.37 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.23C.44 8.16 0 9.99 0 12s.44 3.84 1.23 5.42l4.05-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.25 2.63 1.23 6.58l4.05 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </button>
          </div>

          <!-- Footer Text -->
          <footer class="form-footer">
            <p class="footer-text">If you didn't have an account! <a href="#signup" @click.prevent="$emit('switch-view', 'signup')" class="signup-link">Sign Up</a></p>
          </footer>

        </div>
      </section>

    </div>
  </main>

  <!-- Vue Reactive Toast Notification -->
  <div 
    class="toast" 
    :class="[toast.type, { show: toast.visible, hidden: !toast.visible }]" 
    role="status" 
    aria-live="polite"
  >
    {{ toast.message }}
  </div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['switch-view'])

// Reactive Form State
const email = ref('')
const password = ref('')
const rememberMe = ref(true)
const isPasswordVisible = ref(false)

// Features Bullet Points
const features = ref([
  'Real-Time Context-Aware Recommendations.',
  'Cross-Platform Mobile Application (Flutter).',
  'Secure User Authentication and Role Management.'
])

// Error State
const errors = reactive({
  email: false,
  password: false
})

// Toast Notification State
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout = null

// Functions
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const clearError = (field) => {
  errors[field] = false
}

const isValidEmail = (val) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(val.trim())
}

const handleLogin = () => {
  errors.email = !isValidEmail(email.value)
  errors.password = password.value.trim().length < 6

  if (!errors.email && !errors.password) {
    showToast('Login successful! Welcome to VibeLocate AI.', 'success')
  } else {
    showToast('Please fix the highlighted errors in the form.', 'error')
  }
}

const handleGoogleLogin = () => {
  showToast('Connecting to Google Authentication...', 'success')
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.visible = true

  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toast.visible = false
  }, 3200)
}
</script>
