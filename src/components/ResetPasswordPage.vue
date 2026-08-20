<template>
  <div class="page-container">
    <main class="login-wrapper reset-wrapper">
      <div class="login-card reset-card">
        
        <!-- Left Panel (Navy Blue Theme with Lock Graphic) -->
        <section class="left-panel reset-left-panel">
          <div class="left-content reset-left-content">
            
            <!-- Brand Logo Header -->
            <div class="brand-header">
              <div class="transparent-logo-wrapper">
                <img src="/images/logo_transparent.png" alt="VibeLocate AI Logo" class="transparent-logo-img">
              </div>
            </div>

            <!-- 3D Lock & Key Illustration -->
            <div class="lock-illustration-container">
              <div class="lock-icon-badge">
                <img src="/images/lock_transparent.png" alt="3D Lock and Key" class="lock-3d-img">
              </div>
            </div>

            <!-- Left Panel Headline & Description -->
            <div class="reset-left-text">
              <h3 class="reset-left-title">Create a strong password</h3>
              <p class="reset-left-desc">
                Choose a new password that’s unique and easy for you to remember.
              </p>
            </div>

          </div>
        </section>

        <!-- Right Panel (White Theme - Reset Password Form) -->
        <section class="right-panel reset-right-panel">
          <div class="right-content reset-right-content">
            
            <header class="form-header reset-form-header">
              <h2 class="welcome-heading reset-heading">Reset Password</h2>
              <p class="reset-subheading">Reset your password to recovery &amp; login to your account</p>
            </header>

            <form @submit.prevent="handleResetPassword" class="login-form reset-form" novalidate>
              
              <!-- New Password Input Group -->
              <div class="form-group" :class="{ error: errors.newPassword }">
                <label for="newPassword" class="field-label">New Password</label>
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input 
                    :type="isNewPasswordVisible ? 'text' : 'password'" 
                    id="newPassword" 
                    v-model="newPassword" 
                    @input="clearError('newPassword')"
                    class="form-input" 
                    placeholder="••••••••••••" 
                    required 
                    autocomplete="new-password"
                  >
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="toggleNewPasswordVisibility" 
                    :aria-label="isNewPasswordVisible ? 'Hide password' : 'Show password'"
                  >
                    <svg v-if="!isNewPasswordVisible" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.newPassword" class="error-msg">Password must be at least 6 characters.</span>
              </div>

              <!-- Confirm New Password Input Group -->
              <div class="form-group" :class="{ error: errors.confirmNewPassword }">
                <label for="confirmNewPassword" class="field-label">Confirm New Password</label>
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input 
                    :type="isConfirmPasswordVisible ? 'text' : 'password'" 
                    id="confirmNewPassword" 
                    v-model="confirmNewPassword" 
                    @input="clearError('confirmNewPassword')"
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
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.confirmNewPassword" class="error-msg">Passwords do not match.</span>
              </div>

              <!-- Submit Button (Pill Navy Reset Password) -->
              <button type="submit" class="submit-btn reset-btn" id="resetBtn">
                <span>Reset Password</span>
              </button>

            </form>

            <!-- Footer Text to switch back to Login -->
            <footer class="form-footer reset-footer">
              <p class="footer-text">Remembered your password? <a href="#login" @click.prevent="$emit('switch-view', 'login')" class="signup-link">Log In</a></p>
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

// Form State
const newPassword = ref('')
const confirmNewPassword = ref('')

const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

// Error State
const errors = reactive({
  newPassword: false,
  confirmNewPassword: false
})

// Toast Notification State
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout = null

const toggleNewPasswordVisibility = () => {
  isNewPasswordVisible.value = !isNewPasswordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
}

const clearError = (field) => {
  errors[field] = false
}

const handleResetPassword = () => {
  errors.newPassword = newPassword.value.trim().length < 6
  errors.confirmNewPassword = confirmNewPassword.value !== newPassword.value || !confirmNewPassword.value

  if (!errors.newPassword && !errors.confirmNewPassword) {
    showToast('Password reset successfully!', 'success')
    setTimeout(() => {
      emit('switch-view', 'resetSuccess')
    }, 600)
  } else {
    showToast('Please fix the highlighted errors.', 'error')
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
