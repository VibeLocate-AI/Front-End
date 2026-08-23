<template>
  <div class="page-container">
    <main class="login-wrapper reset-wrapper success-wrapper">
      <div class="login-card reset-card success-card">
        
        <!-- Left Panel (Navy Blue Theme with Workstation Illustration) -->
        <section class="left-panel reset-left-panel success-left-panel">
          <div class="left-content reset-left-content success-left-content">
            
            <!-- Brand Logo Header -->
            <div class="brand-header">
              <div class="transparent-logo-wrapper">
                <img src="/images/logo_transparent.png" alt="VibeLocate AI Logo" class="transparent-logo-img">
              </div>
            </div>

            <!-- 3D Workstation Illustration -->
            <div class="success-illustration-container">
              <div class="success-icon-badge">
                <img src="/images/success_3d_transparent.png" alt="Password Updated Illustration" class="success-3d-img">
              </div>
            </div>

            <!-- Left Panel Headline & Description -->
            <div class="reset-left-text success-left-text">
              <h3 class="reset-left-title">Password Updated</h3>
              <p class="reset-left-desc">
                Your account password has been updated successfully.
              </p>
            </div>

          </div>
        </section>

        <!-- Right Panel (White Theme - Success Message & Login Button) -->
        <section class="right-panel reset-right-panel success-right-panel">
          <div class="right-content reset-right-content success-right-content">
            
            <header class="form-header reset-form-header success-form-header">
              <h2 class="welcome-heading success-heading">Password Reset Successfully!</h2>
              <p class="reset-subheading success-subheading">
                Your password has been updated. You can now log in to your account.
              </p>
            </header>

            <div class="success-action-container">
              <!-- LOG IN Button (Pill Navy) -->
              <button 
                type="button" 
                @click="$emit('switch-view', 'login')" 
                class="submit-btn success-btn" 
                id="successLoginBtn"
              >
                <span>LOG IN</span>
              </button>
            </div>

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
import { reactive, onMounted } from 'vue'

const emit = defineEmits(['switch-view', 'go-to-login'])

// Toast Notification State
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

onMounted(() => {
  showToast('Password updated successfully!', 'success')
})

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.visible = true

  setTimeout(() => {
    toast.visible = false
  }, 3000)
}
</script>
