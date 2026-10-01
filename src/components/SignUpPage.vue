<template>
  <div class="page-container">
    <!-- Floating Language Switcher -->
    <button 
      type="button" 
      class="auth-lang-switcher" 
      @click="toggleLanguage" 
      :title="isRtl ? 'Switch to English' : 'التحويل إلى العربية'"
      :aria-label="isRtl ? 'Switch to English' : 'Switch to Arabic'"
    >
      <i class="fa-solid fa-globe"></i>
      <span>{{ lang === 'ar' ? 'English' : 'العربية' }}</span>
    </button>

    <main class="login-wrapper signup-wrapper">
      <div class="login-card signup-card">
        
        <!-- ========================================================
             LEFT PANEL (Navy Blue Theme) - 100% Fixed & Balanced
             ======================================================== -->
        <section class="left-panel">
          <div class="left-content">
            
            <!-- Brand Logo Header & Certified Agent Badge -->
            <div class="brand-header">
              <div class="transparent-logo-wrapper" @click="router.push('/')" role="button" title="VibeLocate AI Home">
                <img src="/images/logo_transparent.png" alt="VibeLocate AI Logo" class="transparent-logo-img">
              </div>

              <!-- Certified Agent Program Badge (Only for Agent Flow) -->
              <div v-if="accountType === 'agent'" class="certified-agent-badge active">
                <span class="badge-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <circle cx="12" cy="9" r="6" fill="#F59E0B" opacity="0.3"/>
                    <path fill="#F59E0B" d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1 7.2 16.6l.9-5.3-3.8-3.7 5.3-.8L12 2z"/>
                    <path fill="#F59E0B" d="M8.5 16l-1.5 6 5-3 5 3-1.5-6"/>
                  </svg>
                </span>
                <div class="badge-text-group">
                  <span class="badge-main-text">Certified Agent Program</span>
                  <span class="badge-arabic-text">برنامج الوكلاء المعتمدين</span>
                </div>
              </div>
            </div>

            <!-- Feature Bullet Points -->
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
                <div class="feature-text-group">
                  <span class="feature-text">{{ feature.en }}</span>
                  <span class="feature-arabic-sub">{{ feature.ar }}</span>
                </div>
              </li>
            </ul>

            <!-- Bottom Legal Notice (Formatted & Anchored) -->
            <div class="left-legal-notice">
              <p class="legal-text-en">
                By clicking "Sign Up", you agree to our 
                <a href="#terms" @click.prevent="showToast('Viewing Terms & Conditions', 'success')" class="left-legal-link">Terms &amp; Conditions</a> &amp; 
                <a href="#privacy" @click.prevent="showToast('Viewing Privacy Policy', 'success')" class="left-legal-link">Privacy Policy</a>
              </p>
              <p class="arabic-legal-text">بالتسجيل، أنت توافق على الشروط والأحكام وسياسة الخصوصية</p>
            </div>

          </div>
        </section>

        <!-- ========================================================
             RIGHT PANEL (White Theme - Unified Fixed Header & Scrollable Body)
             ======================================================== -->
        <section class="right-panel">
          <!-- Permanent Top Header (Unified Toggle Switch & Horizontal Stepper) -->
          <header class="right-panel-header">
            <!-- Account Type Toggle Switch (Pill Toggle Design) -->
            <div class="account-type-switcher-container">
              <div class="account-toggle-pill" role="tablist" aria-label="Account Type Selection">
                <button 
                  type="button" 
                  role="tab"
                  :aria-selected="accountType === 'user'"
                  class="toggle-pill-btn" 
                  :class="{ active: accountType === 'user' }"
                  @click="setAccountType('user')"
                >
                  {{ lang === 'ar' ? 'مستخدم عادي' : 'Regular User' }}
                </button>
                <button 
                  type="button" 
                  role="tab"
                  :aria-selected="accountType === 'agent'"
                  class="toggle-pill-btn" 
                  :class="{ active: accountType === 'agent' }"
                  @click="setAccountType('agent')"
                >
                  {{ lang === 'ar' ? 'وكيل عقاري' : 'Real Estate Agent' }}
                </button>
              </div>
            </div>

            <!-- 3-Step Horizontal Progress Tracker (Only for Agent Flow - Never Overlaps) -->
            <div v-if="accountType === 'agent'" class="stepper-horizontal">
              <!-- Step 1 -->
              <div 
                class="step-block" 
                :class="{ active: currentStep === 1, completed: currentStep > 1 }"
                @click="goToStep(1)"
              >
                <div class="step-circle">
                  <svg v-if="currentStep > 1" class="step-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span v-else class="step-num">1</span>
                </div>
                <span class="step-title">{{ lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information' }}</span>
              </div>

              <div class="step-connector" :class="{ active: currentStep > 1 }"></div>

              <!-- Step 2 -->
              <div 
                class="step-block" 
                :class="{ active: currentStep === 2, completed: currentStep > 2 }"
                @click="goToStep(2)"
              >
                <div class="step-circle">
                  <svg v-if="currentStep > 2" class="step-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span v-else class="step-num">2</span>
                </div>
                <span class="step-title">{{ lang === 'ar' ? 'الترخيص والوكالة' : 'License & Agency' }}</span>
              </div>

              <div class="step-connector" :class="{ active: currentStep > 2 }"></div>

              <!-- Step 3 -->
              <div 
                class="step-block" 
                :class="{ active: currentStep === 3 }"
                @click="goToStep(3)"
              >
                <div class="step-circle">
                  <span class="step-num">3</span>
                </div>
                <span class="step-title">{{ lang === 'ar' ? 'الخبرة والخدمات' : 'Expertise & Services' }}</span>
              </div>
            </div>
          </header>

          <!-- Scrollable Body for Forms & Actions -->
          <div class="right-panel-body">
            <!-- ====================================================
                 VIEW A: REAL ESTATE AGENT REGISTRATION FLOW
                 ==================================================== -->
            <div v-if="accountType === 'agent'" class="agent-flow-container">
              
              <!-- ====================================================
                   STEP 1: YOUR PROFILE
                   ==================================================== -->
              <form v-if="currentStep === 1" @submit.prevent="handleAgentNextStep1" class="agent-form-step" novalidate>
                
                <header class="agent-form-header">
                  <h2 class="agent-main-title">Create Agent Account - Step 1: Your Profile</h2>
                  <h3 class="agent-section-title">Account &amp; Basic Info</h3>
                </header>

                <!-- Row 1: First Name & Last Name -->
                <div class="form-row">
                  <div class="form-group" :class="{ error: agentErrors.firstName }">
                    <label for="agentFirstName" class="field-label">First Name</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="agentFirstName" 
                        v-model="agentData.firstName" 
                        @input="clearAgentError('firstName')"
                        class="form-input clean-input" 
                        placeholder="First Name" 
                        required 
                        autocomplete="given-name"
                      >
                    </div>
                    <span v-if="agentErrors.firstName" class="error-msg">First name is required.</span>
                  </div>

                  <div class="form-group" :class="{ error: agentErrors.lastName }">
                    <label for="agentLastName" class="field-label">Last Name</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="agentLastName" 
                        v-model="agentData.lastName" 
                        @input="clearAgentError('lastName')"
                        class="form-input clean-input" 
                        placeholder="Last Name" 
                        required 
                        autocomplete="family-name"
                      >
                    </div>
                    <span v-if="agentErrors.lastName" class="error-msg">Last name is required.</span>
                  </div>
                </div>

                <!-- Row 2: Email & Phone Number -->
                <div class="form-row">
                  <div class="form-group" :class="{ error: agentErrors.email }">
                    <label for="agentEmail" class="field-label">Email</label>
                    <div class="input-container clean-input-container has-right-icon">
                      <input 
                        type="email" 
                        id="agentEmail" 
                        v-model="agentData.email" 
                        @input="clearAgentError('email')"
                        class="form-input clean-input" 
                        placeholder="Type Email" 
                        required 
                        autocomplete="email"
                      >
                      <span class="right-field-icon" aria-hidden="true" title="Secure Email">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </span>
                    </div>
                    <span v-if="agentErrors.email" class="error-msg">Please enter a valid email address.</span>
                  </div>

                  <div class="form-group" :class="{ error: agentErrors.phoneNumber }">
                    <label for="agentPhoneNumber" class="field-label">Phone Number</label>
                    <div class="phone-input-combo">
                      <div class="phone-country-badge">
                        <select v-model="agentData.phoneCountry" class="flag-select" aria-label="Select Country Code">
                          <option value="CA">🇨🇦</option>
                          <option value="AE">🇦🇪</option>
                          <option value="SA">🇸🇦</option>
                          <option value="US">🇺🇸</option>
                          <option value="GB">🇬🇧</option>
                          <option value="EG">🇪🇬</option>
                          <option value="JO">🇯🇴</option>
                        </select>
                        <span class="dial-code-prefix">{{ currentDialCode }}</span>
                      </div>
                      <input 
                        type="tel" 
                        id="agentPhoneNumber" 
                        v-model="agentData.phoneNumber" 
                        @input="clearAgentError('phoneNumber')"
                        class="phone-text-input" 
                        placeholder="50 123 4567" 
                        required 
                        autocomplete="tel-national"
                      >
                    </div>
                    <span v-if="agentErrors.phoneNumber" class="error-msg">Valid phone number required.</span>
                  </div>
                </div>

                <!-- Row 3: Password & Confirm Password -->
                <div class="form-row">
                  <div class="form-group" :class="{ error: agentErrors.password }">
                    <label for="agentPassword" class="field-label">Password</label>
                    <div class="input-container clean-input-container has-right-icon">
                      <input 
                        :type="isPasswordVisible ? 'text' : 'password'" 
                        id="agentPassword" 
                        v-model="agentData.password" 
                        @input="clearAgentError('password')"
                        class="form-input clean-input" 
                        placeholder="Password" 
                        required 
                        autocomplete="new-password"
                      >
                      <button 
                        type="button" 
                        class="toggle-password-inline" 
                        @click="togglePasswordVisibility"
                        :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
                      >
                        <svg v-if="!isPasswordVisible" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                        </svg>
                      </button>
                    </div>
                    <span v-if="agentErrors.password" class="error-msg">Min 6 characters required.</span>
                  </div>

                  <div class="form-group" :class="{ error: agentErrors.confirmPassword }">
                    <label for="agentConfirmPassword" class="field-label">Confirm Password</label>
                    <div class="input-container clean-input-container has-right-icon">
                      <input 
                        :type="isConfirmPasswordVisible ? 'text' : 'password'" 
                        id="agentConfirmPassword" 
                        v-model="agentData.confirmPassword" 
                        @input="clearAgentError('confirmPassword')"
                        class="form-input clean-input" 
                        placeholder="Confirm Password" 
                        required 
                        autocomplete="new-password"
                      >
                      <button 
                        type="button" 
                        class="toggle-password-inline" 
                        @click="toggleConfirmPasswordVisibility"
                        :aria-label="isConfirmPasswordVisible ? 'Hide password' : 'Show password'"
                      >
                        <svg v-if="!isConfirmPasswordVisible" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                        </svg>
                      </button>
                    </div>
                    <span v-if="agentErrors.confirmPassword" class="error-msg">Passwords must match.</span>
                  </div>
                </div>

                <!-- Section 2: Agent Profile Details (Horizontally Aligned Flexbox) -->
                <div class="agent-profile-section">
                  <h3 class="agent-section-title">Agent Profile Details</h3>

                  <!-- Row: Upload Profile Picture & Personal Bio perfectly aligned -->
                  <div class="profile-details-row">
                    <!-- Circular Upload Area -->
                    <div class="avatar-uploader-circle" @click="triggerAvatarUpload" role="button" tabindex="0" title="Click to upload profile photo">
                      <input 
                        type="file" 
                        ref="avatarInputRef" 
                        class="hidden-file-input" 
                        accept="image/png, image/jpeg, image/webp" 
                        @change="handleAvatarFileChange"
                      >
                      <div v-if="agentData.avatarPreview" class="avatar-preview-wrapper">
                        <img :src="agentData.avatarPreview" alt="Profile Preview" class="avatar-preview-img">
                        <span class="avatar-change-overlay">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </span>
                      </div>
                      <div v-else class="avatar-upload-placeholder">
                        <svg class="upload-tray-icon" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span class="upload-label-text">Upload<br>Photo</span>
                      </div>
                    </div>

                    <!-- Personal Bio (Professional Summary - Guaranteed White/Light Theme) -->
                    <div class="bio-textarea-group">
                      <textarea 
                        id="agentBio" 
                        v-model="agentData.bio" 
                        class="form-textarea clean-bio-textarea" 
                        placeholder="Personal Bio (Professional Summary)" 
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  <!-- Languages Field (Multi-tag chips) -->
                  <div class="form-group languages-group">
                    <label class="field-label">Languages</label>
                    <div class="languages-tags-wrapper">
                      <span 
                        v-for="(lang, idx) in agentData.languages" 
                        :key="idx" 
                        class="lang-pill"
                      >
                        {{ lang }}
                        <button type="button" class="remove-lang-btn" @click="removeLanguage(idx)" aria-label="Remove language">&times;</button>
                      </span>

                      <!-- Inline Input to add more languages -->
                      <div class="add-lang-input-wrap">
                        <input 
                          type="text" 
                          v-model="newLangInput" 
                          @keydown.enter.prevent="addLanguage" 
                          placeholder="+ Add language..." 
                          class="lang-inline-input"
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Additional Contact Data Field -->
                  <div class="form-group">
                    <label for="agentAdditionalContact" class="field-label">Additional Contact Data</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="agentAdditionalContact" 
                        v-model="agentData.additionalContact" 
                        class="form-input clean-input" 
                        placeholder="Additional Contact Data (e.g., WhatsApp/Website URL)"
                      >
                    </div>
                  </div>

                </div>

                <!-- Step 1 Action Button: Next > -->
                <div class="step-btn-container">
                  <button type="submit" class="navy-action-pill-btn" id="agentNextBtn">
                    <span>Next &gt;</span>
                  </button>
                </div>

              </form>

              <!-- ====================================================
                   STEP 2: LICENSE & AGENCY
                   ==================================================== -->
              <form v-if="currentStep === 2" @submit.prevent="handleAgentNextStep2" class="agent-form-step" novalidate>
                <header class="agent-form-header">
                  <h2 class="agent-main-title">Create Agent Account - Step 2: License &amp; Agency</h2>
                  <h3 class="agent-section-title">Professional Credentials &amp; Firm</h3>
                </header>

                <div class="form-row">
                  <div class="form-group" :class="{ error: agentErrors.licenseNumber }">
                    <label for="licenseNum" class="field-label">Real Estate License / RERA #</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="licenseNum" 
                        v-model="agentData.licenseNumber" 
                        @input="clearAgentError('licenseNumber')"
                        class="form-input clean-input" 
                        placeholder="e.g. BRN-89421"
                        required
                      >
                    </div>
                    <span v-if="agentErrors.licenseNumber" class="error-msg">License number is required.</span>
                  </div>

                  <div class="form-group" :class="{ error: agentErrors.agencyName }">
                    <label for="agencyName" class="field-label">Agency / Brokerage Firm</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="agencyName" 
                        v-model="agentData.agencyName" 
                        @input="clearAgentError('agencyName')"
                        class="form-input clean-input" 
                        placeholder="e.g. VibeLocate Prime"
                        required
                      >
                    </div>
                    <span v-if="agentErrors.agencyName" class="error-msg">Agency name is required.</span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="experienceYears" class="field-label">Years of Experience</label>
                    <select id="experienceYears" v-model="agentData.yearsExperience" class="form-input clean-input select-input">
                      <option value="1-2">1 - 2 Years</option>
                      <option value="3-5">3 - 5 Years</option>
                      <option value="5-10">5 - 10 Years</option>
                      <option value="10+">10+ Years</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="operatingCity" class="field-label">Primary Operating City</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="operatingCity" 
                        v-model="agentData.operatingCity" 
                        class="form-input clean-input" 
                        placeholder="e.g. Dubai, Toronto"
                      >
                    </div>
                  </div>
                </div>

                <!-- Agency Office Address -->
                <div class="form-group">
                  <label for="officeAddress" class="field-label">Office Address / Headquarters</label>
                  <div class="input-container clean-input-container">
                    <input 
                      type="text" 
                      id="officeAddress" 
                      v-model="agentData.officeAddress" 
                      class="form-input clean-input" 
                      placeholder="e.g. Downtown Office Park"
                    >
                  </div>
                </div>

                <!-- License Verification Document Upload -->
                <div class="form-group">
                  <label class="field-label">License Document Verification (Optional)</label>
                  <div class="doc-upload-box" @click="$refs.docInputRef.click()">
                    <input type="file" ref="docInputRef" class="hidden-file-input" accept=".pdf,image/*" @change="handleDocUpload">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                    <span v-if="agentData.licenseDocName" class="uploaded-doc-name">
                      {{ agentData.licenseDocName }}
                    </span>
                    <span v-else class="upload-doc-hint">
                      Click to upload Broker License or Official ID
                    </span>
                  </div>
                </div>

                <!-- Step 2 Navigation Buttons -->
                <div class="step-nav-dual-btns">
                  <button type="button" class="back-pill-btn" @click="currentStep = 1">
                    &lt; Back
                  </button>
                  <button type="submit" class="navy-action-pill-btn">
                    <span>Next &gt;</span>
                  </button>
                </div>
              </form>

              <!-- ====================================================
                   STEP 3: EXPERTISE & SERVICES
                   ==================================================== -->
              <form v-if="currentStep === 3" @submit.prevent="handleCompleteAgentRegistration" class="agent-form-step" novalidate>
                <header class="agent-form-header">
                  <h2 class="agent-main-title">Create Agent Account - Step 3: Expertise &amp; Services</h2>
                  <h3 class="agent-section-title">Specialization &amp; Coverage</h3>
                </header>

                <!-- Selectable Specialties -->
                <div class="form-group">
                  <label class="field-label">Property Specializations</label>
                  <div class="specialties-chips-grid">
                    <button 
                      type="button" 
                      v-for="spec in availableSpecialties" 
                      :key="spec"
                      class="chip-toggle-btn"
                      :class="{ selected: agentData.specialties.includes(spec) }"
                      @click="toggleSpecialty(spec)"
                    >
                      <svg v-if="agentData.specialties.includes(spec)" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {{ spec }}
                    </button>
                  </div>
                </div>

                <!-- Target Neighborhoods -->
                <div class="form-group">
                  <label for="targetAreas" class="field-label">Target Neighborhoods &amp; Communities</label>
                  <div class="input-container clean-input-container">
                    <input 
                      type="text" 
                      id="targetAreas" 
                      v-model="agentData.targetAreas" 
                      class="form-input clean-input" 
                      placeholder="e.g. Downtown Dubai, Palm Jumeirah"
                    >
                  </div>
                </div>

                <!-- Preferred Contact Method -->
                <div class="form-row">
                  <div class="form-group">
                    <label for="contactMethod" class="field-label">Preferred Client Contact</label>
                    <select id="contactMethod" v-model="agentData.contactMethod" class="form-input clean-input select-input">
                      <option value="WhatsApp & Call">WhatsApp &amp; Phone Call</option>
                      <option value="WhatsApp Only">WhatsApp Only</option>
                      <option value="Email & In-App">Email &amp; In-App</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="agentWebsite" class="field-label">Personal Website / Portfolio</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="url" 
                        id="agentWebsite" 
                        v-model="agentData.website" 
                        class="form-input clean-input" 
                        placeholder="https://yourportfolio.com"
                      >
                    </div>
                  </div>
                </div>

                <!-- Code of Ethics Agreement -->
                <div class="form-options terms-option">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="agentAgreeTerms" 
                      v-model="agentData.agreeEthics"
                      @change="clearAgentError('agreeEthics')"
                    >
                    <span class="custom-checkbox" aria-hidden="true">
                      <svg class="checkbox-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                    <span class="checkbox-label">
                      I agree to the <a href="#ethics" @click.prevent="showToast('Viewing Agent Code of Ethics', 'success')" class="terms-link">Certified Agent Terms &amp; Ethics</a>
                    </span>
                  </label>
                </div>
                <span v-if="agentErrors.agreeEthics" class="error-msg terms-error">You must accept the terms to complete agent registration.</span>

                <!-- Step 3 Navigation Buttons -->
                <div class="step-nav-dual-btns">
                  <button type="button" class="back-pill-btn" @click="currentStep = 2">
                    &lt; Back
                  </button>
                  <button type="submit" class="navy-action-pill-btn" :disabled="isLoading">
                    <i v-if="isLoading" class="fa-solid fa-spinner fa-spin me-2" style="margin-right: 8px;"></i>
                    <span>{{ isLoading ? 'CREATING...' : 'Complete Registration' }}</span>
                  </button>
                </div>
              </form>

            </div>

            <!-- ====================================================
                 VIEW B: REGULAR USER REGISTRATION FLOW
                 ==================================================== -->
            <div v-else class="user-flow-container">
              
              <header class="agent-form-header">
                <h2 class="agent-main-title">Create New Account</h2>
                <h3 class="agent-section-title">Personal Credentials</h3>
              </header>

              <form @submit.prevent="handleRegularUserSignUp" class="agent-form-step" novalidate>
                <!-- Row 1: First Name & Last Name -->
                <div class="form-row">
                  <div class="form-group" :class="{ error: userErrors.firstName }">
                    <label for="userFirstName" class="field-label">First Name</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="userFirstName" 
                        v-model="userData.firstName" 
                        @input="clearUserError('firstName')"
                        class="form-input clean-input" 
                        placeholder="Type Your Name" 
                        required 
                        autocomplete="given-name"
                      >
                    </div>
                    <span v-if="userErrors.firstName" class="error-msg">First name is required.</span>
                  </div>

                  <div class="form-group" :class="{ error: userErrors.lastName }">
                    <label for="userLastName" class="field-label">Last Name</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="userLastName" 
                        v-model="userData.lastName" 
                        @input="clearUserError('lastName')"
                        class="form-input clean-input" 
                        placeholder="Type Your Name" 
                        required 
                        autocomplete="family-name"
                      >
                    </div>
                    <span v-if="userErrors.lastName" class="error-msg">Last name is required.</span>
                  </div>
                </div>

                <!-- Row 2: Country & City -->
                <div class="form-row">
                  <div class="form-group" :class="{ error: userErrors.country }">
                    <label for="userCountry" class="field-label">Country</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="userCountry" 
                        v-model="userData.country" 
                        @input="clearUserError('country')"
                        class="form-input clean-input" 
                        placeholder="Type Your Country" 
                        required 
                        autocomplete="country-name"
                      >
                    </div>
                    <span v-if="userErrors.country" class="error-msg">Country is required.</span>
                  </div>

                  <div class="form-group" :class="{ error: userErrors.city }">
                    <label for="userCity" class="field-label">City</label>
                    <div class="input-container clean-input-container">
                      <input 
                        type="text" 
                        id="userCity" 
                        v-model="userData.city" 
                        @input="clearUserError('city')"
                        class="form-input clean-input" 
                        placeholder="Type Your City" 
                        required 
                        autocomplete="address-level2"
                      >
                    </div>
                    <span v-if="userErrors.city" class="error-msg">City is required.</span>
                  </div>
                </div>

                <!-- Row 3: Email Input Group -->
                <div class="form-group" :class="{ error: userErrors.email }">
                  <label for="userEmail" class="field-label">Email</label>
                  <div class="input-container clean-input-container has-right-icon">
                    <input 
                      type="email" 
                      id="userEmail" 
                      v-model="userData.email" 
                      @input="clearUserError('email')"
                      class="form-input clean-input" 
                      placeholder="Type Your Email" 
                      required 
                      autocomplete="email"
                    >
                    <span class="right-field-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </span>
                  </div>
                  <span v-if="userErrors.email" class="error-msg">Please enter a valid email address.</span>
                </div>

                <!-- Row 4: Password & Confirm Password -->
                <div class="form-row">
                  <div class="form-group" :class="{ error: userErrors.password }">
                    <label for="userPassword" class="field-label">Password</label>
                    <div class="input-container clean-input-container has-right-icon">
                      <input 
                        :type="isUserPasswordVisible ? 'text' : 'password'" 
                        id="userPassword" 
                        v-model="userData.password" 
                        @input="clearUserError('password')"
                        class="form-input clean-input" 
                        placeholder="••••••••••••" 
                        required 
                        autocomplete="new-password"
                      >
                      <button 
                        type="button" 
                        class="toggle-password-inline" 
                        @click="isUserPasswordVisible = !isUserPasswordVisible" 
                        :aria-label="isUserPasswordVisible ? 'Hide password' : 'Show password'"
                      >
                        <svg v-if="!isUserPasswordVisible" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                        </svg>
                      </button>
                    </div>
                    <span v-if="userErrors.password" class="error-msg">Password must be at least 6 characters.</span>
                  </div>

                  <div class="form-group" :class="{ error: userErrors.confirmPassword }">
                    <label for="userConfirmPassword" class="field-label">Confirm Password</label>
                    <div class="input-container clean-input-container has-right-icon">
                      <input 
                        :type="isUserConfirmPasswordVisible ? 'text' : 'password'" 
                        id="userConfirmPassword" 
                        v-model="userData.confirmPassword" 
                        @input="clearUserError('confirmPassword')"
                        class="form-input clean-input" 
                        placeholder="••••••••••••" 
                        required 
                        autocomplete="new-password"
                      >
                      <button 
                        type="button" 
                        class="toggle-password-inline" 
                        @click="isUserConfirmPasswordVisible = !isUserConfirmPasswordVisible" 
                        :aria-label="isUserConfirmPasswordVisible ? 'Hide password' : 'Show password'"
                      >
                        <svg v-if="!isUserConfirmPasswordVisible" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.8"></line>
                        </svg>
                      </button>
                    </div>
                    <span v-if="userErrors.confirmPassword" class="error-msg">Passwords do not match.</span>
                  </div>
                </div>

                <!-- Row 5: Phone Number with Country Code Dropdown (Fully Integrated) -->
                <div class="form-group" :class="{ error: userErrors.phoneNumber }">
                  <label for="userPhoneNumber" class="field-label">Phone Number</label>
                  <div class="phone-input-combo">
                    <div class="phone-country-badge">
                      <select v-model="userData.phoneCode" class="flag-select" aria-label="Country dial code">
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+966">🇸🇦 +966</option>
                        <option value="+1">🇨🇦 / 🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+20">🇪🇬 +20</option>
                        <option value="+962">🇯🇴 +962</option>
                      </select>
                    </div>
                    <input 
                      type="tel" 
                      id="userPhoneNumber" 
                      v-model="userData.phoneNumber" 
                      @input="clearUserError('phoneNumber')"
                      class="phone-text-input" 
                      placeholder="50 123 4567" 
                      required 
                      autocomplete="tel-national"
                    >
                  </div>
                  <span v-if="userErrors.phoneNumber" class="error-msg">Please enter a valid phone number.</span>
                </div>

                <!-- Row 6: Agree to Terms -->
                <div class="form-options terms-option">
                  <label class="checkbox-container">
                    <input 
                      type="checkbox" 
                      id="userAgreeTerms" 
                      v-model="userData.agreeTerms"
                      @change="clearUserError('agreeTerms')"
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
                <span v-if="userErrors.agreeTerms" class="error-msg terms-error">You must agree to the Terms of Use to proceed.</span>

                <!-- Submit Button -->
                <div class="step-btn-container">
                  <button type="submit" class="navy-action-pill-btn" id="userSignUpBtn" :disabled="isLoading">
                    <i v-if="isLoading" class="fa-solid fa-spinner fa-spin me-2" style="margin-right: 8px;"></i>
                    <span>{{ isLoading ? 'CREATING ACCOUNT...' : 'SIGN UP' }}</span>
                  </button>
                </div>
              </form>

            </div>

            <!-- ====================================================
                 SHARED SOCIAL LOGIN & FOOTER
                 ==================================================== -->
            <!-- Divider -->
            <div class="divider">
              <span class="divider-line"></span>
              <span class="divider-text">OR</span>
              <span class="divider-line"></span>
            </div>

            <!-- Social Login (Google Sign-In) -->
            <div class="social-login">
              <button 
                type="button" 
                @click="handleGoogleSignUp" 
                class="social-btn google-btn" 
                :disabled="isLoading" 
                aria-label="Sign up with Google" 
                title="Sign up with Google"
              >
                <i v-if="isLoading" class="fa-solid fa-spinner fa-spin" style="font-size: 18px; color: #4285F4;"></i>
                <svg v-else class="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.15C3.25 21.37 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.23C.44 8.16 0 9.99 0 12s.44 3.84 1.23 5.42l4.05-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.25 2.63 1.23 6.58l4.05 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </button>
            </div>

            <!-- Footer Text: Switch to Login -->
            <footer class="form-footer">
              <p class="footer-text">
                {{ lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?' }}
                <a href="/login" @click.prevent="router.push('/login')" class="signup-link">
                  {{ lang === 'ar' ? 'تسجيل الدخول' : 'Log In' }}
                </a>
              </p>
            </footer>

          </div>
        </section>

      </div>
    </main>

    <!-- Floating Reactive Toast Notification -->
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authService } from '../services/authService'
import { triggerGoogleSignIn } from '../services/googleAuth'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const emit = defineEmits(['switch-view'])
const router = useRouter()
const route = useRoute()
const { lang, isRtl, toggleLanguage } = useThemeAndLanguage()

// Active Mode: 'agent' or 'user'
const accountType = ref('agent')
const currentStep = ref(1)
const isLoading = ref(false)

onMounted(() => {
  if (route.query.type === 'user') {
    accountType.value = 'user'
  } else {
    accountType.value = 'agent'
  }
})

const setAccountType = (type) => {
  accountType.value = type
  if (type === 'agent') {
    currentStep.value = 1
  }
}

// -----------------------------------------------------------------------------
// Features Bullet Points
// -----------------------------------------------------------------------------
const features = ref([
  {
    en: 'AI-Powered Vibe & Mood Search.',
    ar: 'بحث ذكي بالذكاء الاصطناعي حسب الأجواء والحي.'
  },
  {
    en: 'Personalized Recommendations Just for You.',
    ar: 'توصيات عقارية حصرية ومخصصة لاهتماماتك.'
  },
  {
    en: 'Real-Time Neighborhood Vibe Insights.',
    ar: 'رؤى وتحليلات فورية لأحياء ومجتمعات المدينة.'
  }
])

// -----------------------------------------------------------------------------
// AGENT STATE
// -----------------------------------------------------------------------------
const agentData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneCountry: 'CA',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  bio: '',
  avatarFile: null,
  avatarPreview: '',
  languages: ['English', 'Arabic', 'French'],
  additionalContact: '',
  // Step 2
  licenseNumber: '',
  agencyName: '',
  yearsExperience: '3-5',
  operatingCity: 'Dubai',
  officeAddress: '',
  licenseDocName: '',
  licenseDocFile: null,
  // Step 3
  specialties: ['Residential', 'Luxury Villas', 'Off-Plan'],
  targetAreas: 'Downtown Dubai, Palm Jumeirah, Dubai Marina',
  contactMethod: 'WhatsApp & Call',
  website: '',
  agreeEthics: false
})

const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const newLangInput = ref('')
const avatarInputRef = ref(null)
const docInputRef = ref(null)

const countryDialCodes = {
  CA: '+1',
  AE: '+971',
  SA: '+966',
  US: '+1',
  GB: '+44',
  EG: '+20',
  JO: '+962'
}

const currentDialCode = computed(() => countryDialCodes[agentData.phoneCountry] || '+1')

const availableSpecialties = [
  'Residential',
  'Luxury Villas',
  'Off-Plan',
  'Commercial',
  'Waterfront Properties',
  'Penthouses',
  'Short-Term Rentals'
]

const agentErrors = reactive({
  firstName: false,
  lastName: false,
  email: false,
  phoneNumber: false,
  password: false,
  confirmPassword: false,
  licenseNumber: false,
  agencyName: false,
  agreeEthics: false
})

const clearAgentError = (field) => {
  agentErrors[field] = false
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value
}

const triggerAvatarUpload = () => {
  avatarInputRef.value?.click()
}

const handleAvatarFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    agentData.avatarFile = file
    const reader = new FileReader()
    reader.onload = (event) => {
      agentData.avatarPreview = event.target.result
    }
    reader.readAsDataURL(file)
    showToast('Profile photo selected.', 'success')
  }
}

const handleDocUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    agentData.licenseDocFile = file
    agentData.licenseDocName = file.name
    showToast(`Attached: ${file.name}`, 'success')
  }
}

const addLanguage = () => {
  const val = newLangInput.value.trim()
  if (val && !agentData.languages.includes(val)) {
    agentData.languages.push(val)
    newLangInput.value = ''
  }
}

const removeLanguage = (index) => {
  agentData.languages.splice(index, 1)
}

const toggleSpecialty = (spec) => {
  const idx = agentData.specialties.indexOf(spec)
  if (idx > -1) {
    agentData.specialties.splice(idx, 1)
  } else {
    agentData.specialties.push(spec)
  }
}

const isValidEmail = (val) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(val).trim())
}

const goToStep = (stepNumber) => {
  if (stepNumber === 1) {
    currentStep.value = 1
  } else if (stepNumber === 2) {
    if (validateAgentStep1()) {
      currentStep.value = 2
    }
  } else if (stepNumber === 3) {
    if (validateAgentStep1() && validateAgentStep2()) {
      currentStep.value = 3
    }
  }
}

const validateAgentStep1 = () => {
  agentErrors.firstName = !agentData.firstName.trim()
  agentErrors.lastName = !agentData.lastName.trim()
  agentErrors.email = !isValidEmail(agentData.email)
  agentErrors.phoneNumber = !agentData.phoneNumber.trim() || agentData.phoneNumber.trim().length < 4
  agentErrors.password = agentData.password.trim().length < 6
  agentErrors.confirmPassword = agentData.confirmPassword !== agentData.password || !agentData.confirmPassword

  const hasErr = agentErrors.firstName || agentErrors.lastName || agentErrors.email ||
                 agentErrors.phoneNumber || agentErrors.password || agentErrors.confirmPassword

  if (hasErr) {
    showToast('Please complete all required fields correctly.', 'error')
    return false
  }
  return true
}

const handleAgentNextStep1 = () => {
  if (validateAgentStep1()) {
    currentStep.value = 2
    showToast('Step 1 complete: Proceed to License & Agency.', 'success')
  }
}

const validateAgentStep2 = () => {
  agentErrors.licenseNumber = !agentData.licenseNumber.trim()
  agentErrors.agencyName = !agentData.agencyName.trim()

  const hasErr = agentErrors.licenseNumber || agentErrors.agencyName
  if (hasErr) {
    showToast('Please fill in your license & agency details.', 'error')
    return false
  }
  return true
}

const handleAgentNextStep2 = () => {
  if (validateAgentStep2()) {
    currentStep.value = 3
    showToast('Step 2 complete: Provide your Expertise & Services.', 'success')
  }
}

const handleCompleteAgentRegistration = async () => {
  if (!agentData.agreeEthics) {
    agentErrors.agreeEthics = true
    showToast('Please agree to the Certified Agent Terms & Code of Ethics.', 'error')
    return
  }

  try {
    isLoading.value = true
    const fullName = `${agentData.firstName.trim()} ${agentData.lastName.trim()}`
    const fullPhone = `${currentDialCode.value} ${agentData.phoneNumber.trim()}`

    const response = await authService.signup({
      first_name: agentData.firstName.trim(),
      last_name: agentData.lastName.trim(),
      name: fullName,
      email: agentData.email.trim(),
      phone: fullPhone,
      password: agentData.password,
      password_confirmation: agentData.confirmPassword,
      role_slug: 'agent',
      city: agentData.operatingCity || 'Dubai',
      country: agentData.phoneCountry === 'CA' ? 'Canada' : 'United Arab Emirates',
      bio: agentData.bio.trim(),
      languages: agentData.languages,
      license_number: agentData.licenseNumber.trim(),
      agency_name: agentData.agencyName.trim(),
      years_experience: agentData.yearsExperience,
      specialties: agentData.specialties,
      target_areas: agentData.targetAreas,
      additional_contact: agentData.additionalContact.trim()
    })

    sessionStorage.setItem('pending_email', agentData.email.trim())
    const userPayload = JSON.stringify({
      name: fullName,
      email: agentData.email.trim(),
      role: 'agent',
      avatar: agentData.avatarPreview || '',
      agency: agentData.agencyName.trim(),
      license: agentData.licenseNumber.trim()
    })
    localStorage.setItem('auth_user', userPayload)
    sessionStorage.setItem('auth_user', userPayload)

    showToast(response?.message || 'Agent account created successfully!', 'success')
    setTimeout(() => {
      router.push({ path: '/verify', query: { email: agentData.email.trim() } })
    }, 1000)
  } catch (err) {
    showToast(err.message || 'Unable to create agent account. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

// -----------------------------------------------------------------------------
// REGULAR USER STATE & HANDLERS
// -----------------------------------------------------------------------------
const userData = reactive({
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneCode: '+971',
  phoneNumber: '',
  agreeTerms: false
})

const isUserPasswordVisible = ref(false)
const isUserConfirmPasswordVisible = ref(false)

const userErrors = reactive({
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

const clearUserError = (field) => {
  userErrors[field] = false
}

const handleRegularUserSignUp = async () => {
  userErrors.firstName = !userData.firstName.trim()
  userErrors.lastName = !userData.lastName.trim()
  userErrors.country = !userData.country.trim()
  userErrors.city = !userData.city.trim()
  userErrors.email = !isValidEmail(userData.email)
  userErrors.password = userData.password.trim().length < 6
  userErrors.confirmPassword = userData.confirmPassword !== userData.password || !userData.confirmPassword
  userErrors.phoneNumber = !userData.phoneNumber.trim() || userData.phoneNumber.trim().length < 5
  userErrors.agreeTerms = !userData.agreeTerms

  const hasErrors = Object.values(userErrors).some(val => val)

  if (!hasErrors) {
    try {
      isLoading.value = true
      const fullName = `${userData.firstName.trim()} ${userData.lastName.trim()}`
      const response = await authService.signup({
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        name: fullName,
        country: userData.country.trim(),
        city: userData.city.trim(),
        email: userData.email.trim(),
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        phone: `${userData.phoneCode}${userData.phoneNumber.trim()}`,
        role_slug: 'tenant'
      })
      sessionStorage.setItem('pending_email', userData.email.trim())
      const userPayload = JSON.stringify({ name: fullName, email: userData.email.trim(), avatar: '', role: 'tenant' })
      localStorage.setItem('auth_user', userPayload)
      sessionStorage.setItem('auth_user', userPayload)
      showToast(response?.message || 'Account created. Verify your email to continue.', 'success')
      setTimeout(() => router.push({ path: '/verify', query: { email: userData.email.trim() } }), 900)
    } catch (err) {
      showToast(err.message || 'Unable to create your account. Please try again.', 'error')
    } finally {
      isLoading.value = false
    }
  } else {
    showToast('Please fix the highlighted errors before submitting.', 'error')
  }
}

// -----------------------------------------------------------------------------
// GOOGLE SIGN-UP
// -----------------------------------------------------------------------------
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
      const userPayload = JSON.stringify({ name, email: emailVal, avatar, role: accountType.value === 'agent' ? 'agent' : 'tenant' })
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

// -----------------------------------------------------------------------------
// TOAST NOTIFICATION
// -----------------------------------------------------------------------------
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

let toastTimeout = null
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

<style scoped>
/* ==========================================================================
   PERFECTLY COORDINATED FIXED-SIZE CARD WITH STICKY HEADER & BALANCED FIELDS
   ========================================================================== */

.signup-wrapper {
  width: 100%;
  max-width: 750px !important;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.signup-card {
  width: 750px !important;
  max-width: 750px !important;
  min-width: 320px;
  height: 600px !important;
  min-height: 600px !important;
  max-height: 600px !important;
  display: flex !important;
  flex-direction: row !important;
  background: #ffffff !important;
  border-radius: 18px !important;
  overflow: hidden !important;
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-sizing: border-box !important;
}

/* ==========================================================================
   LEFT PANEL - EXACTLY HALF OF THE BOX (50% WIDTH)
   ========================================================================== */
.left-panel {
  flex: 0 0 45% !important;
  width: 45% !important;
  max-width: 45% !important;
  min-width: 45% !important;
  height: 100% !important;
  max-height: 100% !important;
  padding: 22px 20px !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  background: linear-gradient(135deg, #13223f 0%, #1a2d4f 50%, #0f1a30 100%) !important;
  color: #ffffff !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

.left-content {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  gap: 0 !important;
}

.transparent-logo-wrapper {
  width: 100%;
  max-width: 175px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.transparent-logo-img {
  width: 100%;
  max-height: 155px;
  object-fit: contain;
}

/* Certified Agent Program Badge */
.certified-agent-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  margin-top: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.certified-agent-badge.active {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.6);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.22);
}

.badge-text-group {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  text-align: left;
}

.badge-main-text {
  font-size: 10px;
  font-weight: 700;
  color: #fef3c7;
  letter-spacing: 0.15px;
}

.badge-arabic-text {
  font-size: 8.5px;
  color: #cbd5e1;
}

/* Feature bullets */
.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: auto 0 !important;
  padding: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.check-box {
  width: 19px;
  height: 19px;
  min-width: 19px;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 11px;
  height: 11px;
  stroke: #ffffff;
}

.feature-text-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.feature-text {
  font-size: 10px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
}

.feature-arabic-sub {
  font-size: 8.5px;
  color: #94a3b8;
  font-weight: 400;
}

/* Bottom Legal Notice - Clean, Framed & Anchored */
.left-legal-notice {
  width: 100%;
  padding-top: 10px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.legal-text-en {
  font-size: 9.5px;
  color: #cbd5e1;
  line-height: 1.4;
  margin: 0;
  max-width: 95%;
}

.left-legal-link {
  color: #60a5fa;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease;
}

.left-legal-link:hover {
  color: #93c5fd;
}

.arabic-legal-text {
  font-size: 8.5px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
}

/* ==========================================================================
   RIGHT PANEL - EXACTLY HALF OF THE BOX (50% WIDTH)
   ========================================================================== */
.right-panel {
  flex: 0 0 55% !important;
  width: 55% !important;
  max-width: 55% !important;
  min-width: 55% !important;
  height: 100% !important;
  max-height: 100% !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  background: #ffffff !important;
  box-sizing: border-box !important;
  overflow: hidden !important;
}

/* Fixed Header: Switcher and Stepper never overlap and never scroll away */
.right-panel-header {
  flex: 0 0 auto !important;
  width: 100% !important;
  background: #ffffff !important;
  padding: 10px 14px 8px 14px !important;
  border-bottom: 1px solid #f1f5f9 !important;
  box-sizing: border-box !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  z-index: 10 !important;
}

.account-type-switcher-container {
  display: flex !important;
  justify-content: center !important;
  width: 100% !important;
  padding: 0 !important;
  margin-bottom: 8px !important;
  border-bottom: none !important;
  position: static !important;
}

.account-toggle-pill {
  display: inline-flex;
  align-items: center;
  background-color: #f1f5f9;
  padding: 3px;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.toggle-pill-btn {
  padding: 5px 18px;
  font-size: 11.5px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.toggle-pill-btn:hover {
  color: #0f172a;
}

.toggle-pill-btn.active {
  background-color: #10223d;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16, 34, 61, 0.28);
}

/* ==========================================================================
   PROGRESS TRACKER (1 - 2 - 3 Horizontal Stepper) - COMPACT & CLEAR
   ========================================================================== */
.stepper-horizontal {
  display: flex !important;
  align-items: flex-start !important;
  justify-content: space-between !important;
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 auto !important;
  padding: 0 2px !important;
  box-sizing: border-box !important;
}

.step-block {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 4px !important;
  cursor: pointer !important;
  user-select: none !important;
}

.step-circle {
  width: 27px !important;
  height: 27px !important;
  min-width: 27px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background-color: #f8fafc !important;
  color: #64748b !important;
  border: 1.5px solid #cbd5e1 !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
}

.step-num {
  font-size: 11.5px !important;
  font-weight: 800 !important;
  line-height: 1 !important;
}

.step-block.active .step-circle {
  background-color: #10223d !important;
  color: #ffffff !important;
  border-color: #10223d !important;
  box-shadow: 0 3px 8px rgba(16, 34, 61, 0.28) !important;
}

.step-block.completed .step-circle {
  background-color: #2563eb !important;
  color: #ffffff !important;
  border-color: #2563eb !important;
}

.step-check-icon {
  width: 12px;
  height: 12px;
}

.step-title {
  font-size: 10px !important;
  font-weight: 600 !important;
  color: #94a3b8 !important;
  text-align: center !important;
  white-space: nowrap !important;
}

.step-block.active .step-title {
  color: #10223d !important;
  font-weight: 700 !important;
}

.step-block.completed .step-title {
  color: #2563eb !important;
}

.step-connector {
  flex: 1 !important;
  height: 2px !important;
  background-color: #e2e8f0 !important;
  margin: 12px 4px 0 4px !important;
}

.step-connector.active {
  background-color: #2563eb !important;
}

/* ==========================================================================
   SCROLLABLE BODY CONTAINER (Holds Forms & Footer)
   ========================================================================== */
.right-panel-body {
  flex: 1 1 auto !important;
  width: 100% !important;
  height: 100% !important;
  padding: 10px 14px 14px 14px !important;
  display: flex !important;
  flex-direction: column !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
}

.right-panel-body::-webkit-scrollbar {
  width: 4px;
}
.right-panel-body::-webkit-scrollbar-track {
  background: transparent;
}
.right-panel-body::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}
.right-panel-body::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.right-content {
  width: 100% !important;
  max-width: 100% !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
}

/* ==========================================================================
   AGENT FORM HEADERS & TITLES (COMPACT)
   ========================================================================== */
.agent-form-header {
  margin-bottom: 6px;
}

.agent-main-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.2px;
  margin-bottom: 2px;
}

.agent-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

/* ==========================================================================
   PERFECTLY FORMATTED INPUT FIELDS (UNIFIED 34px HEIGHT & COMPACT SPACING)
   ========================================================================== */
.agent-flow-container,
.user-flow-container {
  width: 100%;
}

.agent-form-step {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.form-row .form-group {
  flex: 1;
  min-width: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-size: 10.5px !important;
  font-weight: 600 !important;
  color: #334155 !important;
  margin-bottom: 2px !important;
  display: block !important;
  line-height: 1.2 !important;
}

.clean-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

/* Clean Input Styles with light subtle backdrop & unified 34px height */
.clean-input,
.form-input {
  width: 100% !important;
  height: 34px !important;
  padding: 4px 10px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  color: #0f172a !important;
  background-color: #f8fafc !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 7px !important;
  outline: none !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
}

.clean-input:focus,
.form-input:focus {
  background-color: #ffffff !important;
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
}

.clean-input::placeholder,
.form-input::placeholder {
  color: #94a3b8 !important;
  font-weight: 400 !important;
}

.clean-input-container.has-right-icon .clean-input {
  padding-right: 32px !important;
}

.right-field-icon {
  position: absolute;
  right: 10px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.toggle-password-inline {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.toggle-password-inline:hover {
  color: #2563eb;
}

/* Phone Number Combo - Seamlessly Framed */
.phone-input-combo {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1.5px solid #cbd5e1;
  border-radius: 7px;
  background-color: #f8fafc;
  overflow: hidden;
  height: 34px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.phone-input-combo:focus-within {
  background-color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.phone-country-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #f1f5f9;
  padding: 0 8px;
  height: 100%;
  border-right: 1.5px solid #cbd5e1;
}

.flag-select {
  border: none;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  outline: none;
  color: #0f172a;
}

.dial-code-prefix {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
}

.phone-text-input {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  height: 100% !important;
  padding: 0 10px !important;
  font-size: 12px !important;
  color: #0f172a !important;
  flex: 1 !important;
  outline: none !important;
}

/* ==========================================================================
   AGENT PROFILE DETAILS: PERFECTLY ALIGNED 60px FLEXBOX ROW
   ========================================================================== */
.agent-profile-section {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 2px;
}

.profile-details-row {
  display: flex;
  align-items: stretch;
  gap: 10px;
  width: 100%;
}

.avatar-uploader-circle {
  width: 60px;
  height: 60px;
  min-width: 60px;
  border-radius: 50%;
  border: 1.5px dashed #cbd5e1;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.avatar-uploader-circle:hover {
  border-color: #2563eb;
  background-color: #f0f7ff;
}

.hidden-file-input {
  display: none;
}

.avatar-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1px;
  padding: 2px;
}

.upload-tray-icon {
  color: #64748b;
  width: 16px;
  height: 16px;
}

.upload-label-text {
  font-size: 8.5px;
  font-weight: 600;
  color: #64748b;
  line-height: 1.1;
}

.avatar-preview-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.avatar-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-change-overlay {
  position: absolute;
  inset: 0;
  background: rgba(16, 34, 61, 0.6);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-uploader-circle:hover .avatar-change-overlay {
  opacity: 1;
}

.bio-textarea-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Personal Bio Textarea - White Background with Clean Border */
.clean-bio-textarea,
.form-textarea {
  width: 100% !important;
  height: 60px !important;
  min-height: 60px !important;
  max-height: 60px !important;
  padding: 6px 10px !important;
  font-family: var(--font-primary) !important;
  font-size: 11.5px !important;
  color: #0f172a !important;
  border: 1.5px solid #cbd5e1 !important;
  border-radius: 7px !important;
  background-color: #f8fafc !important;
  resize: none !important;
  outline: none !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
}

.clean-bio-textarea:focus,
.form-textarea:focus {
  background-color: #ffffff !important;
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
}

.clean-bio-textarea::placeholder,
.form-textarea::placeholder {
  color: #94a3b8 !important;
}

/* Languages */
.languages-tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  padding: 3px 6px;
  border: 1.5px solid #cbd5e1;
  border-radius: 7px;
  background-color: #f8fafc;
  min-height: 34px;
  box-sizing: border-box;
}

.lang-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.remove-lang-btn {
  background: none;
  border: none;
  font-size: 12px;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
}

.remove-lang-btn:hover {
  color: #ef4444;
}

.add-lang-input-wrap {
  flex: 1;
  min-width: 80px;
}

.lang-inline-input {
  border: none;
  outline: none;
  font-size: 11px;
  color: #0f172a;
  width: 100%;
  background: transparent;
}

/* ==========================================================================
   STEP ACTION BUTTONS
   ========================================================================== */
.step-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 6px;
  width: 100%;
}

.navy-action-pill-btn {
  height: 35px;
  min-width: 160px;
  max-width: 220px;
  width: 100%;
  background-color: #10223d;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-shadow: 0 2px 10px rgba(16, 34, 61, 0.22);
  transition: all 0.2s ease;
}

.navy-action-pill-btn:hover:not(:disabled) {
  background-color: #1b3860;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 34, 61, 0.32);
}

.step-nav-dual-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
}

.back-pill-btn {
  height: 35px;
  padding: 0 16px;
  background-color: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  border-radius: 9999px;
  cursor: pointer;
}

.back-pill-btn:hover {
  background-color: #e2e8f0;
}

/* ==========================================================================
   STEP 2 & STEP 3 EXTRA STYLES
   ========================================================================== */
.select-input {
  cursor: pointer;
}

.doc-upload-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1.5px dashed #cbd5e1;
  border-radius: 8px;
  background-color: #f8fafc;
  cursor: pointer;
  color: #64748b;
  font-size: 12px;
}

.doc-upload-box:hover {
  border-color: #2563eb;
  background-color: #eff6ff;
  color: #2563eb;
}

.uploaded-doc-name {
  font-weight: 600;
  color: #16a34a;
}

.specialties-chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 3px;
}

.chip-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 11.5px;
  font-weight: 600;
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #475569;
  border-radius: 9999px;
  cursor: pointer;
}

.chip-toggle-btn.selected {
  background-color: #eff6ff;
  border-color: #2563eb;
  color: #1d4ed8;
}

/* Social & Footer */
.divider {
  margin: 6px 0 !important;
}

.social-login {
  margin: 2px 0 4px 0 !important;
}

.social-btn {
  width: 32px !important;
  height: 32px !important;
}

.google-icon {
  width: 17px !important;
  height: 17px !important;
}

.footer-text {
  font-size: 12px !important;
}

/* Responsive adjustments */
@media (max-width: 820px) {
  .signup-card {
    width: 100% !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    flex-direction: column !important;
  }

  .left-panel {
    flex: none !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    height: auto !important;
  }

  .right-panel {
    width: 100% !important;
    height: auto !important;
    overflow-y: visible !important;
  }
}
</style>

<style>
/* High-specificity override to guarantee light background on Personal Bio even in dark mode */
html body .page-container .right-panel textarea,
html body .page-container .right-panel .form-textarea,
html body .page-container .right-panel .clean-bio-textarea,
[data-theme="dark"] .right-panel textarea,
[data-theme="dark"] .right-panel .form-textarea,
[data-theme="dark"] .right-panel .clean-bio-textarea {
  background-color: #f8fafc !important;
  color: #0f172a !important;
  border: 1.5px solid #cbd5e1 !important;
}

html body .page-container .right-panel textarea:focus,
html body .page-container .right-panel .form-textarea:focus,
html body .page-container .right-panel .clean-bio-textarea:focus,
[data-theme="dark"] .right-panel textarea:focus,
[data-theme="dark"] .right-panel .form-textarea:focus,
[data-theme="dark"] .right-panel .clean-bio-textarea:focus {
  background-color: #ffffff !important;
  color: #0f172a !important;
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;
}
</style>
