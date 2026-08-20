<template>
  <main class="login-wrapper">
    <div class="login-card">

      <!-- Left Panel -->
      <section class="left-panel">
        <div class="left-content">

          <!-- Logo -->
          <div class="brand-header">
            <div class="transparent-logo-wrapper">
              <img src="/images/logo_transparent.png" alt="VibeLocate AI Logo" class="transparent-logo-img">
            </div>
          </div>

          <!-- Illustration -->
          <div class="verify-illustration-wrapper">
            <img src="/images/verify_illustration.png" alt="Verification Illustration" class="verify-illustration-img">
          </div>

          <!-- Info Text -->
          <div class="verify-info">
            <h3 class="verify-title">Keeping your account safe</h3>
            <p class="verify-subtitle">Verification helps us protect your personal information</p>
          </div>

        </div>
      </section>

      <!-- Right Panel -->
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

          <!-- Header -->
          <header class="form-header">
            <h1 class="welcome-heading">Enter the verification code</h1>
            <p class="verify-desc">Enter the code we sent to your email</p>
            <p class="email-badge" v-if="email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="email-badge-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              {{ email }}
            </p>
          </header>

          <!-- OTP Form -->
          <form @submit.prevent="handleVerify" class="verify-form" novalidate>

            <!-- OTP Boxes -->
            <div class="otp-group" :class="{ 'otp-error': errors.otp, 'otp-success': isVerified }">
              <input
                v-for="(digit, index) in otpDigits"
                :key="index"
                :ref="el => { if (el) otpRefs[index] = el }"
                type="text"
                maxlength="1"
                class="otp-box"
                :class="{ filled: digit !== '', success: isVerified }"
                v-model="otpDigits[index]"
                @input="handleOtpInput(index, $event)"
                @keydown="handleOtpKeydown(index, $event)"
                @paste="handleOtpPaste"
                inputmode="numeric"
                pattern="[0-9]"
                :id="`otp-digit-${index}`"
                autocomplete="one-time-code"
              >
            </div>

            <!-- Error Message -->
            <p v-if="errors.otp" class="otp-err-msg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="err-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Please enter the complete verification code.
            </p>

            <!-- Resend Timer -->
            <div class="resend-row">
              <span class="resend-label">Didn't receive the code?</span>
              <button
                type="button"
                class="resend-btn"
                :disabled="resendTimer > 0 || isLoading"
                @click="handleResend"
              >
                {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
              </button>
            </div>

            <!-- Verify Button -->
            <button type="submit" class="verify-btn" id="verifyBtn" :disabled="isLoading || isVerified">
              <span v-if="!isLoading && !isVerified">verify</span>
              <span v-else-if="isVerified" class="btn-success-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="success-check">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Verified!
              </span>
              <span v-else class="btn-loading">
                <span class="spinner"></span>
                Verifying...
              </span>
            </button>

          </form>

          <!-- Back Link -->
          <footer class="form-footer">
            <a href="#" @click.prevent="$emit('go-back')" class="back-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="back-icon">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </a>
          </footer>

        </div>
      </section>

      <!-- Toast -->
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
import { ref, reactive, onMounted } from 'vue'

// Props & Emits
const props = defineProps({
  email: { type: String, default: '' }
})
const emit = defineEmits(['go-back', 'verified'])

// State
const currentStep = ref(2)
const otpDigits = ref(['', '', '', ''])
const otpRefs = ref([])
const isLoading = ref(false)
const isVerified = ref(false)
const resendTimer = ref(60)
let resendInterval = null

const errors = reactive({ otp: false })
const toast = reactive({ visible: false, message: '', type: 'success' })
let toastTimeout = null

// Background Video
const bgVideo = ref(null)

onMounted(() => {
  // Auto-focus first input
  setTimeout(() => otpRefs.value[0]?.focus(), 300)
  startResendTimer()
})

// OTP Input Handlers
const handleOtpInput = (index, event) => {
  const val = event.target.value.replace(/[^0-9]/g, '')
  otpDigits.value[index] = val.slice(-1)
  errors.otp = false
  if (val && index < otpDigits.value.length - 1) {
    otpRefs.value[index + 1]?.focus()
  }
  // Auto submit when all filled
  if (otpDigits.value.every(d => d !== '')) {
    setTimeout(() => handleVerify(), 200)
  }
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4)
  pasted.split('').forEach((char, i) => {
    if (i < 4) otpDigits.value[i] = char
  })
  const lastIndex = Math.min(pasted.length, 3)
  otpRefs.value[lastIndex]?.focus()
}

// Verify Handler
const handleVerify = async () => {
  if (isVerified.value || isLoading.value) return
  const code = otpDigits.value.join('')
  if (code.length < 4) {
    errors.otp = true
    // Shake animation
    return
  }
  isLoading.value = true
  await new Promise(r => setTimeout(r, 1400))
  isLoading.value = false
  isVerified.value = true
  showToast('Code verified successfully!', 'success')
  setTimeout(() => emit('verified'), 1800)
}

// Resend
const startResendTimer = () => {
  resendTimer.value = 60
  if (resendInterval) clearInterval(resendInterval)
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) clearInterval(resendInterval)
  }, 1000)
}

const handleResend = async () => {
  isLoading.value = true
  otpDigits.value = ['', '', '', '']
  await new Promise(r => setTimeout(r, 800))
  isLoading.value = false
  startResendTimer()
  otpRefs.value[0]?.focus()
  showToast('New code sent to your email!', 'success')
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.visible = true
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => { toast.visible = false }, 3200)
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

/* Verify Illustration */
.verify-illustration-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 12px 30px rgba(99, 102, 241, 0.4));
  transition: transform 0.4s ease, filter 0.4s ease;
}

.verify-illustration-wrapper:hover {
  transform: translateY(-5px) scale(1.03);
  filter: drop-shadow(0 18px 40px rgba(59, 130, 246, 0.55));
}

.verify-illustration-img {
  width: 230px;
  height: auto;
  object-fit: contain;
}

/* Info Text */
.verify-info {
  text-align: center;
}

.verify-title {
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 10px;
  letter-spacing: -0.2px;
}

.verify-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  max-width: 230px;
  margin: 0 auto;
}

/* Right Panel Header */
.verify-desc {
  font-size: 13.5px;
  color: #64748b;
  font-weight: 400;
  margin-top: 8px;
  line-height: 1.5;
  text-align: center;
}

.email-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 6px 14px;
  background: #f1f5f9;
  border-radius: 99px;
  font-size: 13px;
  font-weight: 700;
  color: #1c2d4d;
  border: 1px solid #e2e8f0;
}

.email-badge-icon {
  width: 14px;
  height: 14px;
  color: #3b82f6;
  flex-shrink: 0;
}

/* Form */
.verify-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
}

/* OTP Boxes */
.otp-group {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.otp-box {
  width: 58px;
  height: 62px;
  text-align: center;
  font-size: 24px;
  font-weight: 800;
  color: #1c2d4d;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  outline: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  caret-color: #3b82f6;
  font-family: inherit;
}

.otp-box:focus {
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  transform: translateY(-3px) scale(1.05);
}

.otp-box.filled {
  border-color: #1c2d4d;
  background: #ffffff;
}

.otp-box.success {
  border-color: #10b981;
  background: #f0fdf4;
  color: #059669;
}

.otp-group.otp-error .otp-box {
  border-color: #ef4444;
  background: #fef2f2;
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
}

/* Error Message */
.otp-err-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: #ef4444;
  margin-top: -8px;
}

.err-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* Resend Row */
.resend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.resend-label {
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

.resend-btn:hover:not(:disabled) { color: #3b82f6; }
.resend-btn:disabled { color: #94a3b8; cursor: not-allowed; text-decoration: none; }

/* Verify Button */
.verify-btn {
  position: relative;
  width: 200px;
  height: 46px;
  background: linear-gradient(135deg, #1c2d4d 0%, #111d33 100%);
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1.5px;
  border: none;
  border-radius: 99px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 25px -4px rgba(28, 45, 77, 0.4);
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background 0.3s ease;
}

.verify-btn::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 60%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%) rotate(25deg);
}

.verify-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #243961 0%, #182845 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 28px -4px rgba(28, 45, 77, 0.5);
}

.verify-btn:hover:not(:disabled)::after {
  animation: shimmer 1.2s ease-in-out;
}

.verify-btn:active:not(:disabled) { transform: translateY(0) scale(1); }

.verify-btn:disabled { opacity: 0.75; cursor: not-allowed; transform: none !important; }

/* Success State */
.btn-success-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
}

.success-check {
  width: 18px;
  height: 18px;
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

@keyframes spin { to { transform: rotate(360deg); } }

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

.back-link:hover { color: #1c2d4d; }

.back-icon {
  width: 16px;
  height: 16px;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) rotate(25deg); }
  100% { transform: translateX(200%) rotate(25deg); }
}
</style>
