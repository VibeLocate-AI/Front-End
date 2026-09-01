<template>
  <div class="page-container">
    <main class="login-wrapper signup-wrapper">
    <div class="login-card signup-card">
      
      <!-- Left Panel (Navy Blue Theme) -->
      <section class="left-panel">
        <div class="left-content">
          
          <!-- Brand Logo Header -->
          <div class="brand-header">
            <div class="transparent-logo-wrapper">
              <img src="/images/logo_transparent.png" alt="VibeLocate AI Logo" class="transparent-logo-img">
            </div>
          </div>

          <!-- Feature Bullet Points (3 items from image mockup) -->
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

          <!-- Bottom Legal Notice (from mockup image) -->
          <div class="left-legal-notice">
            <p>
              By clicking "sign up", I agree to 
              <a href="#terms" @click.prevent="showToast('Viewing Terms & Conditions', 'success')" class="left-legal-link">Terms &amp; Conditions</a> &amp; 
              <a href="#privacy" @click.prevent="showToast('Viewing Privacy Policy', 'success')" class="left-legal-link">Privacy Policy</a>
            </p>
          </div>

        </div>
      </section>

      <!-- Right Panel (White Theme - Create New Account Form) -->
      <section class="right-panel">
        <div class="right-content signup-right-content">
          
          <header class="form-header">
            <h2 class="welcome-heading">Create NewAccount</h2>
          </header>

          <form @submit.prevent="handleSignUp" class="login-form signup-form" novalidate>
            
            <!-- Row 1: First Name & Last Name -->
            <div class="form-row">
              <div class="form-group" :class="{ error: errors.firstName }">
                <label for="firstName" class="field-label">First Name</label>
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    id="firstName" 
                    v-model="firstName" 
                    @input="clearError('firstName')"
                    class="form-input" 
                    placeholder="Type Your Name" 
                    required 
                    autocomplete="given-name"
                  >
                </div>
                <span v-if="errors.firstName" class="error-msg">First name is required.</span>
              </div>

              <div class="form-group" :class="{ error: errors.lastName }">
                <label for="lastName" class="field-label">Last Name</label>
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  <input 
                    type="text" 
                    id="lastName" 
                    v-model="lastName" 
                    @input="clearError('lastName')"
                    class="form-input" 
                    placeholder="Type Your Name" 
                    required 
                    autocomplete="family-name"
                  >
                </div>
                <span v-if="errors.lastName" class="error-msg">Last name is required.</span>
              </div>
            </div>

            <!-- Row 2: Country & City -->
            <div class="form-row">
              <div class="form-group" :class="{ error: errors.country }">
                <label for="country" class="field-label">Country</label>
                <div class="input-container">
                  <input 
                    type="text" 
                    id="country" 
                    v-model="country" 
                    @input="clearError('country')"
                    class="form-input no-left-icon" 
                    placeholder="Type Your Country" 
                    required 
                    autocomplete="country-name"
                  >
                </div>
                <span v-if="errors.country" class="error-msg">Country is required.</span>
              </div>

              <div class="form-group" :class="{ error: errors.city }">
                <label for="city" class="field-label">City</label>
                <div class="input-container">
                  <input 
                    type="text" 
                    id="city" 
                    v-model="city" 
                    @input="clearError('city')"
                    class="form-input no-left-icon" 
                    placeholder="Type Your City" 
                    required 
                    autocomplete="address-level2"
                  >
                </div>
                <span v-if="errors.city" class="error-msg">City is required.</span>
              </div>
            </div>

            <!-- Row 3: Email Input Group -->
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

            <!-- Row 4: Password Input Group -->
            <div class="form-group" :class="{ error: errors.password }">
              <label for="password" class="field-label">Password</label>
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
                  autocomplete="new-password"
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

            <!-- Row 5: Confirm Password Input Group -->
            <div class="form-group" :class="{ error: errors.confirmPassword }">
              <label for="confirmPassword" class="field-label">Confirm Password</label>
              <div class="input-container">
                <span class="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </span>
                <input 
                  :type="isConfirmPasswordVisible ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  @input="clearError('confirmPassword')"
                  class="form-input" 
                  placeholder="••••••••••••" 
                  required 
                  autocomplete="new-password"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="toggleConfirmPasswordVisibility" 
                  :aria-label="isConfirmPasswordVisible ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="!isConfirmPasswordVisible" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                  </svg>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error-msg">Passwords do not match.</span>
            </div>

            <!-- Row 6: Phone Number with Country Code Dropdown -->
            <div class="form-group" :class="{ error: errors.phoneNumber }">
              <label for="phoneNumber" class="field-label">Phone Number</label>
              <div class="phone-input-wrapper">
                <select v-model="phoneCode" class="phone-code-select" aria-label="Country dial code">
                  <option value="+971">971 🇦🇪</option>
                  <option value="+966">966 🇸🇦</option>
                  <option value="+1">1 🇺🇸</option>
                  <option value="+44">44 🇬🇧</option>
                  <option value="+20">20 🇪🇬</option>
                  <option value="+962">962 🇯🇴</option>
                </select>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  v-model="phoneNumber" 
                  @input="clearError('phoneNumber')"
                  class="form-input phone-input" 
                  placeholder="50 123 4567" 
                  required 
                  autocomplete="tel-national"
                >
              </div>
              <span v-if="errors.phoneNumber" class="error-msg">Please enter a valid phone number.</span>
            </div>

            <!-- Row 7: Checkbox: Agree to Terms of Use -->
            <div class="form-options terms-option">
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  v-model="agreeTerms"
                  @change="clearError('agreeTerms')"
                >
                <span class="custom-checkbox" aria-hidden="true">
                  <svg class="checkbox-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="checkbox-label">
                  I agree to the <a href="#terms" @click.prevent="showToast('Opening Terms of Use', 'success')" class="terms-link">Terms of Use</a>
                </span>
              </label>
            </div>
            <span v-if="errors.agreeTerms" class="error-msg terms-error">You must agree to the Terms of Use to proceed.</span>

            <!-- Submit Button (Navy Pill) -->
            <button type="submit" class="submit-btn signup-btn" id="signUpBtn" :disabled="isLoading">
              <span>{{ isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP' }}</span>
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
            <button type="button" @click="handleGoogleSignUp" class="social-btn google-btn" aria-label="Sign up with Google" title="Sign up with Google">
              <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.15C3.25 21.37 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.23C.44 8.16 0 9.99 0 12s.44 3.84 1.23 5.42l4.05-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.25 2.63 1.23 6.58l4.05 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </button>
          </div>

          <!-- Footer Text to switch back to Login -->
          <footer class="form-footer">
            <p class="footer-text">Already have an account? <a href="/login" @click.prevent="router.push('/login')" class="signup-link">Log In</a></p>
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
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { triggerGoogleSignIn } from '../services/googleAuth'

const emit = defineEmits(['switch-view'])
const router = useRouter()

// Form State
const firstName = ref('')
const lastName = ref('')
const country = ref('')
const city = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const phoneCode = ref('+971')
const phoneNumber = ref('')
const agreeTerms = ref(false)

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isLoading = ref(false)

// Features Bullet Points matching image mockup exactly
const features = ref([
  'AI-Powered Vibe & Mood Search.',
  'Personalized Recommendations Just for You.',
  'Real-Time Neighborhood Vibe Insights.'
])

// Error State
const errors = reactive({
  firstName: false,
  lastName: false,
  country: false,
  city: false,
  email: false,
  password: false,
  confirmPassword: false,
  phoneNumber: false,
  agreeTerms: false
})

// Toast Notification State
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout = null

// Toggle password visibility
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
}

const clearError = (field) => {
  errors[field] = false
}

const isValidEmail = (val) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(val.trim())
}

const handleSignUp = async () => {
  errors.firstName = !firstName.value.trim()
  errors.lastName = !lastName.value.trim()
  errors.country = !country.value.trim()
  errors.city = !city.value.trim()
  errors.email = !isValidEmail(email.value)
  errors.password = password.value.trim().length < 6
  errors.confirmPassword = confirmPassword.value !== password.value || !confirmPassword.value
  errors.phoneNumber = !phoneNumber.value.trim() || phoneNumber.value.trim().length < 5
  errors.agreeTerms = !agreeTerms.value

  const hasErrors = Object.values(errors).some(val => val)

  if (!hasErrors) {
    try {
      isLoading.value = true
      const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`
      const response = await authService.signup({
        first_name: firstName.value.trim(), last_name: lastName.value.trim(),
        name: fullName,
        country: country.value.trim(), city: city.value.trim(), email: email.value.trim(),
        password: password.value, password_confirmation: confirmPassword.value,
        phone: `${phoneCode.value}${phoneNumber.value.trim()}`
      })
      sessionStorage.setItem('pending_email', email.value.trim())
      const userPayload = JSON.stringify({ name: fullName, email: email.value.trim(), avatar: '' })
      localStorage.setItem('auth_user', userPayload)
      sessionStorage.setItem('auth_user', userPayload)
      showToast(response?.message || 'Account created. Verify your email to continue.', 'success')
      setTimeout(() => router.push({ path: '/verify', query: { email: email.value.trim() } }), 900)
    } catch (err) {
      showToast(err.message || 'Unable to create your account. Please try again.', 'error')
    } finally {
      isLoading.value = false
    }
  } else {
    showToast('Please fix the highlighted errors before submitting.', 'error')
  }
}

const handleGoogleSignUp = async () => {
  try {
    isLoading.value = true
    showToast('Connecting to Google Registration...', 'success')
    const googleUser = await triggerGoogleSignIn()
    const response = await authService.loginWithGoogle(googleUser.token, true)
    const profile = response?.user || response?.data?.user || (response?.data && typeof response.data === 'object' && response.data.email ? response.data : {})
    const name = profile.name || profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || googleUser.name || ''
    const emailVal = profile.email || googleUser.email || ''
    const avatar = profile.avatar || profile.profile_photo_url || profile.picture || profile.photo || profile.image || googleUser.picture || ''

    if (name || emailVal) {
      const userPayload = JSON.stringify({ name, email: emailVal, avatar })
      localStorage.setItem('auth_user', userPayload)
      sessionStorage.setItem('auth_user', userPayload)
    }

    showToast(response?.message || 'Google registration successful!', 'success')
    setTimeout(() => router.push('/home'), 700)
  } catch (err) {
    showToast(err.message || 'Google registration was cancelled or failed.', 'error')
  } finally {
    isLoading.value = false
  }
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
