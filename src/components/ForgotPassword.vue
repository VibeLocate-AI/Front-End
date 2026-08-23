<template>
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

          <!-- Robot Image -->
          <div class="robot-wrapper">
            <img src="/images/robot.png" alt="Account Recovery Robot" class="robot-img">
          </div>

          <!-- Recovery Info Text -->
          <div class="recovery-info">
            <h3 class="recovery-title">Account Recovery</h3>
            <p class="recovery-subtitle">Follow a few simple steps to safely reset your password</p>
          </div>

        </div>
      </section>

      <!-- Right Panel (White Theme) -->
      <section class="right-panel">
        <div class="right-content">

          <!-- Step Indicator -->
          <div class="step-indicator">
            <div
              v-for="step in 2"
              :key="step"
              class="step-dot"
              :class="{ active: currentStep >= step, completed: currentStep > step }"
            ></div>
          </div>

          <!-- ======================== -->
          <!-- STEP 1: Enter Email      -->
          <!-- ======================== -->
          <div v-if="currentStep === 1" class="step-panel">
            <header class="form-header">
              <h1 class="welcome-heading">Forgot your password?</h1>
              <p class="form-subtitle">Enter your email address to retrieve your password.</p>
            </header>

            <form @submit.prevent="handleSendCode" class="login-form" novalidate>

              <!-- Email Input Group -->
              <div class="form-group" :class="{ error: errors.email }">
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="forgot-email"
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

              <!-- Submit Button -->
              <button type="submit" class="submit-btn" id="sendCodeBtn" :disabled="isLoading">
                <span v-if="!isLoading">send</span>
                <span v-else class="btn-loading">
                  <span class="spinner"></span>
                  Sending...
                </span>
              </button>

            </form>
          </div>

          <!-- ======================== -->
          <!-- STEP 2: Enter OTP Code   -->
          <!-- ======================== -->
          <div v-if="currentStep === 2" class="step-panel">
            <header class="form-header">
              <h1 class="welcome-heading">Check your email</h1>
              <p class="form-subtitle">We sent a 6-digit verification code to <strong>{{ email }}</strong></p>
            </header>

            <form @submit.prevent="handleVerifyCode" class="login-form" novalidate>

              <!-- OTP Code Inputs -->
              <div class="otp-group" :class="{ error: errors.otp }">
                <input
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  :ref="el => { if (el) otpRefs[index] = el }"
                  type="text"
                  maxlength="1"
                  class="otp-input"
                  :class="{ filled: digit !== '' }"
                  v-model="otpDigits[index]"
                  @input="handleOtpInput(index, $event)"
                  @keydown="handleOtpKeydown(index, $event)"
                  @paste="handleOtpPaste"
                  inputmode="numeric"
                  pattern="[0-9]"
                  :id="`otp-${index}`"
                  autocomplete="one-time-code"
                >
              </div>
              <span v-if="errors.otp" class="error-msg otp-error">Please enter the full 6-digit code.</span>

              <!-- Resend Timer -->
              <div class="resend-row">
                <span class="resend-text">Didn't receive the code?</span>
                <button
                  type="button"
                  class="resend-btn"
                  :disabled="resendTimer > 0"
                  @click="handleResend"
                >
                  {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend' }}
                </button>
              </div>

              <button type="submit" class="submit-btn" id="verifyCodeBtn" :disabled="isLoading">
                <span v-if="!isLoading">Verify Code</span>
                <span v-else class="btn-loading">
                  <span class="spinner"></span>
                  Verifying...
                </span>
              </button>

            </form>
          </div>

          <!-- ======================== -->
          <!-- STEP 3: New Password     -->
          <!-- ======================== -->
          <div v-if="currentStep === 3" class="step-panel">
            <header class="form-header">
              <h1 class="welcome-heading">Reset your password</h1>
              <p class="form-subtitle">Create a strong new password for your account.</p>
            </header>

            <form @submit.prevent="handleResetPassword" class="login-form" novalidate>

              <!-- New Password -->
              <div class="form-group" :class="{ error: errors.newPassword }">
                <label for="new-password" class="field-label">New Password</label>
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    id="new-password"
                    v-model="newPassword"
                    @input="clearError('newPassword')"
                    class="form-input"
                    placeholder="Enter new password"
                    required
                  >
                  <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword" :aria-label="showNewPassword ? 'Hide' : 'Show'">
                    <svg v-if="!showNewPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                    </svg>
                  </button>
                </div>
                <!-- Password Strength Bar -->
                <div class="strength-bar-wrapper">
                  <div class="strength-bar">
                    <div class="strength-fill" :class="passwordStrength.level" :style="{ width: passwordStrength.percent + '%' }"></div>
                  </div>
                  <span class="strength-label" :class="passwordStrength.level">{{ passwordStrength.label }}</span>
                </div>
                <span v-if="errors.newPassword" class="error-msg">Password must be at least 8 characters.</span>
              </div>

              <!-- Confirm Password -->
              <div class="form-group" :class="{ error: errors.confirmPassword }">
                <label for="confirm-password" class="field-label">Confirm Password</label>
                <div class="input-container">
                  <span class="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </span>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    v-model="confirmPassword"
                    @input="clearError('confirmPassword')"
                    class="form-input"
                    placeholder="Confirm new password"
                    required
                  >
                  <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="!showConfirmPassword" class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg v-else class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.confirmPassword" class="error-msg">Passwords do not match.</span>
              </div>

              <button type="submit" class="submit-btn" id="resetPasswordBtn" :disabled="isLoading">
                <span v-if="!isLoading">Reset Password</span>
                <span v-else class="btn-loading">
                  <span class="spinner"></span>
                  Resetting...
                </span>
              </button>

            </form>
          </div>

          <!-- Back to Login Link -->
          <footer class="form-footer">
            <p class="footer-text">
              <a href="#" @click.prevent="$emit('go-to-login')" class="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="back-icon">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Login
              </a>
            </p>
          </footer>

        </div>
      </section>

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
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { authService } from '../services/authService'

// Emits
const emit = defineEmits(['go-to-login', 'code-sent', 'switch-view'])

// Steps: 1 = email, 2 = OTP, 3 = new password
const currentStep = ref(1)
const isLoading = ref(false)
const resetToken = ref('')

// Step 1 — Email
const email = ref('')

// Step 2 — OTP
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref([])
const resendTimer = ref(0)
let resendInterval = null

// Step 3 — New Password
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Error State
const errors = reactive({
  email: false,
  otp: false,
  newPassword: false,
  confirmPassword: false
})

// Toast
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimeout = null

// Password Strength
const passwordStrength = computed(() => {
  const val = newPassword.value
  if (!val) return { level: '', label: '', percent: 0 }
  let score = 0
  if (val.length >= 8) score++
  if (val.length >= 12) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  if (score <= 1) return { level: 'weak', label: 'Weak', percent: 25 }
  if (score <= 2) return { level: 'fair', label: 'Fair', percent: 50 }
  if (score <= 3) return { level: 'good', label: 'Good', percent: 75 }
  return { level: 'strong', label: 'Strong', percent: 100 }
})

// Helpers
const clearError = (field) => { errors[field] = false }
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.visible = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => { toast.visible = false }, 3500)
}

// Step 1: Send verification code
const handleSendCode = async () => {
  errors.email = !isValidEmail(email.value)
  if (errors.email) {
    showToast('Please enter a valid email address.', 'error')
    return
  }

  try {
    isLoading.value = true
    const res = await authService.forgotPassword(email.value.trim())
    showToast(res?.message || 'Verification code sent to your email!', 'success')
    emit('code-sent', email.value)
  } catch (err) {
    showToast(err.message || 'Failed to send verification code. Please check your email.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Step 2: OTP Verification
const handleVerifyCode = async () => {
  const code = otpDigits.value.join('')
  errors.otp = code.length < 6
  if (errors.otp) {
    showToast('Please enter the full 6-digit code.', 'error')
    return
  }

  try {
    isLoading.value = true
    const res = await authService.verifyOtp(email.value.trim(), code)
    if (res?.token || res?.reset_token) {
      resetToken.value = res.token || res.reset_token
    }
    showToast(res?.message || 'Code verified! Set your new password.', 'success')
    currentStep.value = 3
  } catch (err) {
    showToast(err.message || 'Invalid or expired verification code.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Step 3: Reset Password
const handleResetPassword = async () => {
  errors.newPassword = newPassword.value.trim().length < 8
  errors.confirmPassword = newPassword.value !== confirmPassword.value
  if (errors.newPassword || errors.confirmPassword) {
    showToast('Please fix the errors before continuing.', 'error')
    return
  }

  try {
    isLoading.value = true
    const res = await authService.resetPassword({
      email: email.value.trim(),
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
      token: resetToken.value
    })
    showToast(res?.message || 'Password reset successfully! Redirecting...', 'success')
    setTimeout(() => emit('go-to-login'), 1800)
  } catch (err) {
    showToast(err.message || 'Failed to reset password. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

const handleResend = async () => {
  if (resendTimer.value > 0) return
  try {
    await authService.resendOtp(email.value.trim())
    showToast('A new code has been sent to your email.', 'success')
    resendTimer.value = 60
    if (resendInterval) clearInterval(resendInterval)
    resendInterval = setInterval(() => {
      if (resendTimer.value > 0) resendTimer.value--
      else clearInterval(resendInterval)
    }, 1000)
  } catch (err) {
    showToast(err.message || 'Failed to resend code.', 'error')
  }
}

// OTP Input Handlers
const handleOtpInput = (index, event) => {
  const val = event.target.value.replace(/[^0-9]/g, '')
  otpDigits.value[index] = val.slice(-1)
  clearError('otp')
  if (val && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
  pasted.split('').forEach((char, i) => {
    if (i < 6) otpDigits.value[i] = char
  })
  const lastIndex = Math.min(pasted.length, 5)
  otpRefs.value[lastIndex]?.focus()
}

// Resend Timer
const startResendTimer = () => {
  resendTimer.value = 60
  if (resendInterval) clearInterval(resendInterval)
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) clearInterval(resendInterval)
  }, 1000)
}
</script>

<style scoped>
/* Step Indicator */
.step-indicator {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 28px;
}

.step-dot {
  width: 32px;
  height: 5px;
  border-radius: 99px;
  background: #e2e8f0;
  transition: background 0.4s ease, transform 0.3s ease;
}

.step-dot.active {
  background: linear-gradient(90deg, #1c2d4d, #3b82f6);
  transform: scaleX(1.08);
}

.step-dot.completed {
  background: #10b981;
}

/* Step Panel Transition */
.step-panel {
  animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Recovery Left Panel Extras */
.robot-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 12px 28px rgba(99, 102, 241, 0.4));
  transition: transform 0.4s ease, filter 0.4s ease;
}

.robot-wrapper:hover {
  transform: translateY(-6px) scale(1.04);
  filter: drop-shadow(0 18px 36px rgba(59, 130, 246, 0.6));
}

.robot-img {
  width: 270px;
  height: auto;
  object-fit: contain;
}

.recovery-info {
  text-align: center;
}

.recovery-title {
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: -0.2px;
}

.recovery-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.55;
  max-width: 220px;
  margin: 0 auto;
}

/* Form Subtitle */
.form-subtitle {
  font-size: 13.5px;
  color: #64748b;
  font-weight: 400;
  margin-top: 8px;
  line-height: 1.55;
  text-align: center;
}

.form-subtitle strong {
  color: #1c2d4d;
  font-weight: 700;
}

/* OTP Inputs */
.otp-group {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 8px 0;
}

.otp-input {
  width: 46px;
  height: 52px;
  text-align: center;
  font-size: 20px;
  font-weight: 800;
  color: #1c2d4d;
  background: #f8fafc;
  border: 1.8px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  caret-color: #3b82f6;
}

.otp-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.otp-input.filled {
  border-color: #1c2d4d;
  background: #ffffff;
  color: #1c2d4d;
}

.otp-group.error .otp-input {
  border-color: #ef4444;
  background: #fef2f2;
}

.otp-error {
  text-align: center;
  display: block !important;
  margin-top: -4px;
}

/* Resend Row */
.resend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
}

.resend-text {
  color: #64748b;
  font-weight: 500;
}

.resend-btn {
  background: none;
  border: none;
  color: #1c2d4d;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.3s ease;
  padding: 0;
  font-family: inherit;
}

.resend-btn:hover:not(:disabled) {
  color: #3b82f6;
}

.resend-btn:disabled {
  color: #94a3b8;
  cursor: not-allowed;
  text-decoration: none;
}

/* Password Strength Bar */
.strength-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease;
}

.strength-fill.weak   { background: #ef4444; }
.strength-fill.fair   { background: #f97316; }
.strength-fill.good   { background: #eab308; }
.strength-fill.strong { background: #10b981; }

.strength-label {
  font-size: 11.5px;
  font-weight: 700;
  min-width: 40px;
}

.strength-label.weak   { color: #ef4444; }
.strength-label.fair   { color: #f97316; }
.strength-label.good   { color: #eab308; }
.strength-label.strong { color: #10b981; }

/* Form Footer */
.form-footer {
  text-align: center;
  margin-top: 36px;
}

/* Back Link */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #64748b;
  font-weight: 600;
  font-size: 13.5px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #1c2d4d;
}

.back-icon {
  width: 16px;
  height: 16px;
}

/* Loading Spinner */
.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Disabled button */
.submit-btn:disabled {
  opacity: 0.75;
  cursor: not-allowed;
  transform: none !important;
}
</style>
