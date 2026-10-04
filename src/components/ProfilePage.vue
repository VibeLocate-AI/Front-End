<template>
  <div class="profile-page-root" :class="{ 'is-dark': isDark, 'is-rtl': isRtl }">
    <!-- Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="toastVisible" class="profile-toast" :class="`profile-toast--${toastType}`">
        <i :class="toastType === 'error' ? 'fa-solid fa-circle-exclamation toast-icon' : 'fa-solid fa-circle-check toast-icon'"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Pro Upgrade Modal -->
    <Transition name="modal-fade">
      <div v-if="showUpgradeModal" class="upgrade-modal-backdrop" @click.self="showUpgradeModal = false">
        <div class="upgrade-modal-content">
          <button class="close-modal-btn" @click="showUpgradeModal = false">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-crown-badge">
            <i class="fa-solid fa-crown"></i>
          </div>

          <h2 class="modal-title">Upgrade to VibeLocate AI Pro</h2>
          <p class="modal-subtitle">Unlock unlimited AI power and exclusive real estate insights in Dubai.</p>

          <div class="pricing-card">
            <div class="price-header">
              <span class="price-val">AED 199</span>
              <span class="price-period">/ month</span>
            </div>
            <span class="price-hint">Cancel or change plan anytime</span>
          </div>

          <ul class="pro-features-list">
            <li><i class="fa-solid fa-check"></i> <strong>Save Unlimited Properties</strong> with custom tagging</li>
            <li><i class="fa-solid fa-check"></i> <strong>Real-time AI Price Drop Alerts</strong> &amp; Market Radar</li>
            <li><i class="fa-solid fa-check"></i> <strong>Exclusive Off-Market Listings</strong> &amp; Pre-launches</li>
            <li><i class="fa-solid fa-check"></i> <strong>AI Valuation &amp; ROI Calculator</strong></li>
            <li><i class="fa-solid fa-check"></i> <strong>Priority 24/7 Dedicated Support</strong></li>
          </ul>

          <div class="modal-actions">
            <button class="btn-confirm-upgrade" @click="confirmUpgrade">
              <i class="fa-solid fa-bolt"></i> Start 7-Day Free Trial
            </button>
            <button class="btn-cancel-modal" @click="showUpgradeModal = false">Maybe Later</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Account Confirmation Modal -->
    <Transition name="modal-fade">
      <div v-if="showDeleteModal" class="upgrade-modal-backdrop" @click.self="closeDeleteModal">
        <div class="upgrade-modal-content delete-modal-content">
          <button class="close-modal-btn" :disabled="isDeletingAccount" @click="closeDeleteModal">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-danger-badge">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>

          <h2 class="modal-title text-danger">Delete Account</h2>
          <p class="modal-subtitle">
            Are you sure you want to permanently delete your account? All your saved properties, search alerts, and profile preferences will be permanently removed.
          </p>

          <div class="delete-modal-input-wrap">
            <label class="form-label text-start d-block mb-1">Confirm your password to proceed</label>
            <div class="password-input-wrap">
              <input
                :type="showDeletePass ? 'text' : 'password'"
                v-model="deleteConfirmPassword"
                class="form-control"
                placeholder="Enter your current password"
                :disabled="isDeletingAccount"
                @keyup.enter="handleDeleteAccount"
              >
              <button type="button" class="btn-toggle-eye" @click="showDeletePass = !showDeletePass" tabindex="-1">
                <i :class="showDeletePass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>

          <div v-if="deleteError" class="alert-inline alert-danger mt-3">
            <i class="fa-solid fa-circle-exclamation me-1"></i>
            {{ deleteError }}
          </div>

          <div class="modal-actions mt-4">
            <button
              class="btn-danger-confirm"
              :disabled="isDeletingAccount"
              @click="handleDeleteAccount"
            >
              <i v-if="isDeletingAccount" class="fa-solid fa-spinner fa-spin me-1"></i>
              <i v-else class="fa-solid fa-trash-can me-1"></i>
              {{ isDeletingAccount ? 'Deleting Account...' : 'Yes, Delete My Account' }}
            </button>
            <button class="btn-cancel-modal" :disabled="isDeletingAccount" @click="closeDeleteModal">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Two-Factor Authentication Setup Modal -->
    <Transition name="modal-fade">
      <div v-if="show2faModal" class="upgrade-modal-backdrop" @click.self="close2faModal">
        <div class="upgrade-modal-content two-factor-modal-content">
          <button class="close-modal-btn" :disabled="isVerifying2fa" @click="close2faModal">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-security-badge">
            <i class="fa-solid fa-shield-halved"></i>
          </div>

          <h2 class="modal-title">{{ isRtl ? 'إعداد التحقق بخطوتين (2FA)' : 'Two-Factor Authentication Setup' }}</h2>
          <p class="modal-subtitle">
            {{ isRtl ? 'لحماية حسابك، اربط تطبيق المصادقة (Google Authenticator أو 1Password) عبر مسح رمز QR أو إدخال المفتاح.' : 'Scan the QR code with your authenticator app (Google Authenticator, Microsoft Authenticator) or enter the secret key manually.' }}
          </p>

          <div v-if="isLoading2fa" class="text-center py-4">
            <i class="fa-solid fa-spinner fa-spin fa-2x text-primary mb-2"></i>
            <p class="text-muted small">{{ isRtl ? 'جاري تجهيز مفتاح الأمان...' : 'Generating your security key...' }}</p>
          </div>

          <div v-else class="two-factor-modal-body">
            <!-- QR Code Section -->
            <div class="qr-preview-card text-center mb-3">
              <div v-if="twoFactorQrCodeUrl" class="qr-image-frame mb-3 d-flex justify-content-center">
                <img :src="twoFactorQrCodeUrl" alt="2FA QR Code" class="img-fluid rounded border p-2 bg-white" style="width: 175px; height: 175px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
              </div>
              <div class="secret-key-display d-flex align-items-center justify-content-center gap-2 flex-wrap p-2 rounded" style="background: rgba(2, 132, 199, 0.06); border: 1px dashed #0284c7;">
                <span class="text-muted small">{{ isRtl ? 'المفتاح السري:' : 'Secret Key:' }}</span>
                <code class="user-select-all fw-bold text-dark px-2 py-1 bg-white rounded border">{{ twoFactorSecret }}</code>
                <button type="button" class="btn btn-sm btn-outline-primary" @click="copySecretKey" :title="isRtl ? 'نسخ المفتاح' : 'Copy Key'">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
              <small class="text-muted d-block mt-2">
                {{ isRtl ? 'امسح الرمز أو انسخ المفتاح وألصقه في تطبيق Google Authenticator' : 'Scan code or copy the key into Google Authenticator' }}
              </small>
            </div>

            <!-- Verification Code Input -->
            <div class="two-factor-input-section mt-3 text-center">
              <label class="form-label d-block mb-2 fw-bold">
                {{ isRtl ? 'أدخل رمز التحقق المكون من 6 أرقام من التطبيق:' : 'Enter the 6-digit Code from your app:' }}
              </label>
              <div class="d-flex justify-content-center">
                <input
                  type="text"
                  v-model="twoFactorCode"
                  maxlength="6"
                  class="form-control text-center fw-bold fs-4"
                  placeholder="000000"
                  style="max-width: 220px; letter-spacing: 6px; font-family: monospace; border: 2px solid #0284c7;"
                  :disabled="isVerifying2fa"
                  @keyup.enter="handleVerify2FA"
                  autofocus
                />
              </div>
            </div>

            <!-- Error message if any -->
            <div v-if="twoFactorError" class="alert-inline alert-danger mt-3 text-start">
              <i class="fa-solid fa-circle-exclamation me-1"></i>
              {{ twoFactorError }}
            </div>
          </div>

          <div class="modal-actions mt-4">
            <button
              class="btn-save-primary"
              :disabled="isVerifying2fa || !twoFactorCode || twoFactorCode.trim().length < 6"
              @click="handleVerify2FA"
            >
              <i v-if="isVerifying2fa" class="fa-solid fa-spinner fa-spin me-1"></i>
              <i v-else class="fa-solid fa-circle-check me-1"></i>
              {{ isVerifying2fa ? (isRtl ? 'جاري التحقق...' : 'Verifying...') : (isRtl ? 'تأكيد وتفعيل' : 'Confirm & Enable') }}
            </button>
            <button class="btn-cancel-modal" :disabled="isVerifying2fa" @click="close2faModal">
              {{ isRtl ? 'إلغاء' : 'Cancel' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>


    <!-- ==================== MAIN CONTENT WRAPPER ==================== -->
    <main class="profile-main-container">
      <div class="container-inner">
        
        <!-- Top Sub-Header & Breadcrumb Bar -->
        <div class="profile-page-header">
          <div class="header-titles">
            <div class="breadcrumb-trail">
              <RouterLink to="/home" class="bc-link">{{ isRtl ? 'الرئيسية' : 'Home' }}</RouterLink>
              <i class="fa-solid fa-chevron-right bc-sep"></i>
              <span class="bc-link" @click="switchTab('overview')">{{ isRtl ? 'الملف الشخصي' : 'Profile' }}</span>
              <template v-if="activeTab !== 'overview'">
                <i class="fa-solid fa-chevron-right bc-sep"></i>
                <span class="bc-current">{{ tabTitle }}</span>
              </template>
            </div>

            <div class="title-with-actions">
              <div>
                <h1 class="page-title">{{ tabTitle }}</h1>
                <p class="page-subtitle">{{ tabSubtitle }}</p>
              </div>

              <button v-if="activeTab === 'saved'" class="btn-header-action" @click="$router.push('/home')">
                <i class="fa-solid fa-compass"></i> {{ isRtl ? 'استكشف العقارات' : 'Explore Properties' }}
              </button>
              <button v-else-if="activeTab === 'properties'" class="btn-header-action" @click="$router.push('/add-property')">
                <i class="fa-solid fa-plus"></i> {{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}
              </button>
            </div>
          </div>

          <!-- Decorative Dubai Cityscape Artwork Header -->
          <div class="dubai-skyline-badge">
            <svg class="skyline-svg" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 110 H390 M40 110 V70 H55 V110 M70 110 V50 H85 V110 M100 110 V30 H115 V110 M130 110 V80 H145 V110 M160 110 V90 H175 V110 M200 110 L200 10 L203 110 M220 110 V40 H235 V110 M250 110 V65 H265 V110 M280 110 V20 H295 V110 M310 110 V55 H325 V110 M340 110 V75 H355 V110" stroke="rgba(59, 130, 246, 0.25)" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div class="script-tag font-cursive">
              <span class="dubai-text">Dubai</span>
              <span class="tagline-text">A BETTER PLACE TO LIVE</span>
            </div>
          </div>
        </div>

        <!-- ==================== TWO-COLUMN GRID LAYOUT ==================== -->
        <div class="profile-content-grid">
          
          <!-- LEFT SIDEBAR -->
          <aside class="profile-sidebar-card">
            <!-- User Summary Header -->
            <div class="sidebar-user-info">
              <!-- Loading skeleton -->
              <template v-if="profileLoading">
                <div class="user-avatar-wrap skeleton-avatar"></div>
                <div class="skeleton-line skeleton-name"></div>
                <div class="skeleton-line skeleton-email"></div>
                <div class="skeleton-line skeleton-badge"></div>
              </template>

              <!-- Real data -->
              <template v-else>
                <div class="user-avatar-wrap">
                  <span v-if="!user.avatarUrl" class="avatar-initials-large">{{ user.avatarInitials }}</span>
                  <img v-else :src="user.avatarUrl" :alt="user.name" class="avatar-img-large">
                </div>

                <h3 class="user-name">{{ user.name }}</h3>
                <p class="user-email">{{ user.email }}</p>
                <p class="user-role">{{ user.role }}</p>

                <div class="user-member-badge">
                  {{ isRtl ? `عضو منذ ${user.memberSince || 'أغسطس 2026'}` : `Member since ${user.memberSince || 'Aug 2026'}` }}
                </div>
              </template>
            </div>

            <div class="sidebar-divider"></div>

            <!-- Navigation Links -->
            <nav class="sidebar-nav">
              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'overview' }"
                @click="switchTab('overview')"
              >
                <i class="fa-solid fa-border-all nav-icon"></i>
                <span>{{ isRtl ? 'نظرة عامة' : 'Overview' }}</span>
              </button>

              <!-- ==============================================
                   AGENT TOOLS SECTION (Shown for Agents Only) - EXACT MATCH TO IMAGE 1
                   ============================================== -->
              <div v-if="isAgent" class="agent-sidebar-section">
                <button 
                  type="button"
                  class="agent-accordion-header" 
                  @click="agentSectionOpen = !agentSectionOpen"
                  :title="isRtl ? 'أدوات الوكيل' : 'Agent Tools'"
                >
                  <div class="agent-accordion-title-wrap">
                    <i class="fa-solid fa-screwdriver-wrench agent-section-icon"></i>
                    <span class="agent-section-title-text">{{ isRtl ? 'أدوات الوكيل' : 'Agent Tools' }}</span>
                  </div>
                  <i class="fa-solid fa-chevron-up agent-chevron-icon" :class="{ 'rotate-180': !agentSectionOpen }"></i>
                </button>

                <div v-show="agentSectionOpen" class="agent-sub-nav">
                  <!-- 1. لوحتي (Dashboard) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-dashboard' }"
                    @click="switchTab('agent-dashboard')"
                  >
                    <i class="fa-solid fa-user nav-icon"></i>
                    <span>{{ isRtl ? 'لوحتي' : 'My Dashboard' }}</span>
                  </button>

                  <!-- 2. عقاراتي (My Properties) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-properties' }"
                    @click="switchTab('agent-properties')"
                  >
                    <i class="fa-solid fa-table-cells-large nav-icon"></i>
                    <span>{{ isRtl ? 'إدارة العقارات' : 'Property Management' }}</span>
                  </button>

                  <!-- 3. طلبات المعاينة (Viewing Requests) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-requests' }"
                    @click="switchTab('agent-requests')"
                  >
                    <i class="fa-solid fa-calendar-check nav-icon"></i>
                    <span>{{ isRtl ? 'طلبات المعاينة' : 'Viewing Requests' }}</span>
                  </button>

                  <!-- 4. الرسائل (Messages) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-messages' }"
                    @click="switchTab('agent-messages')"
                  >
                    <i class="fa-regular fa-envelope nav-icon"></i>
                    <span>{{ isRtl ? 'الرسائل' : 'Messages' }}</span>
                  </button>

                  <!-- 5. الإحصائيات (Analytics) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-analytics' }"
                    @click="switchTab('agent-analytics')"
                  >
                    <i class="fa-solid fa-chart-simple nav-icon"></i>
                    <span>{{ isRtl ? 'الإحصائيات' : 'Analytics' }}</span>
                  </button>

                  <!-- 6. الملف الشخصي والتحقق (Profile & Verification) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-verification' }"
                    @click="switchTab('agent-verification')"
                  >
                    <i class="fa-solid fa-user-check nav-icon"></i>
                    <span>{{ isRtl ? 'الملف الشخصي والتحقق' : 'Profile & Verification' }}</span>
                  </button>

                  <!-- 7. نقاط الاهتمام والمرافق (Agency POIs) -->
                  <button
                    class="nav-tab-btn agent-sub-btn"
                    :class="{ active: activeTab === 'agent-pois' }"
                    @click="switchTab('agent-pois')"
                  >
                    <i class="fa-solid fa-map-pin nav-icon"></i>
                    <span>{{ isRtl ? 'نقاط الاهتمام (POIs)' : 'Agency POIs' }}</span>
                  </button>
                </div>
              </div>

              <!-- Regular User "عقاراتي" (Only shown if NOT in agent mode) -->
              <button
                v-if="!isAgent"
                class="nav-tab-btn"
                :class="{ active: activeTab === 'properties' }"
                @click="switchTab('properties')"
              >
                <i class="fa-regular fa-building nav-icon"></i>
                <span>{{ isRtl ? 'عقاراتي' : 'My Properties' }}</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'saved' }"
                @click="switchTab('saved')"
              >
                <i class="fa-regular fa-heart nav-icon"></i>
                <span>{{ isRtl ? 'العقارات المحفوظة' : 'Saved Properties' }}</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'alerts' }"
                @click="switchTab('alerts')"
              >
                <i class="fa-regular fa-bell nav-icon"></i>
                <span>{{ isRtl ? 'تنبيهات البحث' : 'Search Alerts' }}</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'preferences' }"
                @click="switchTab('preferences')"
              >
                <i class="fa-solid fa-sliders nav-icon"></i>
                <span>{{ isRtl ? 'تفضيلاتي' : 'My Preferences' }}</span>
              </button>

              <!-- ==============================================
                   ACCOUNT SETTINGS ACCORDION (3 Sub-Pages)
                   ============================================== -->
              <div class="settings-sidebar-section">
                <button 
                  type="button"
                  class="settings-accordion-header" 
                  :class="{ 
                    'is-open': settingsSectionOpen,
                    'has-active-child': ['edit', 'settings-security', 'settings', 'settings-privacy'].includes(activeTab)
                  }"
                  @click="toggleSettingsSection"
                  :title="isRtl ? 'إعدادات الحساب' : 'Account Settings'"
                >
                  <div class="settings-accordion-title-wrap">
                    <i class="fa-solid fa-gear settings-section-icon"></i>
                    <span class="settings-section-title-text">{{ isRtl ? 'إعدادات الحساب' : 'Account Settings' }}</span>
                  </div>
                  <i class="fa-solid fa-chevron-up settings-chevron-icon" :class="{ 'rotate-180': !settingsSectionOpen }"></i>
                </button>

                <div v-show="settingsSectionOpen" class="settings-sub-nav">
                  <!-- 1. تعديل الملف الشخصي -->
                  <button
                    class="nav-tab-btn settings-sub-btn"
                    :class="{ active: activeTab === 'edit' }"
                    @click="switchTab('edit')"
                  >
                    <i class="fa-solid fa-user-pen nav-icon"></i>
                    <span>{{ isRtl ? 'تعديل الملف الشخصي' : 'Edit Profile' }}</span>
                  </button>

                  <!-- 2. الأمان وكلمة المرور -->
                  <button
                    class="nav-tab-btn settings-sub-btn"
                    :class="{ active: activeTab === 'settings-security' || activeTab === 'settings' }"
                    @click="switchTab('settings-security')"
                  >
                    <i class="fa-solid fa-shield-halved nav-icon"></i>
                    <span>{{ isRtl ? 'الأمان وكلمة المرور' : 'Security & Password' }}</span>
                  </button>

                  <!-- 3. التحكم في الخصوصية -->
                  <button
                    class="nav-tab-btn settings-sub-btn"
                    :class="{ active: activeTab === 'settings-privacy' }"
                    @click="switchTab('settings-privacy')"
                  >
                    <i class="fa-solid fa-user-lock nav-icon"></i>
                    <span>{{ isRtl ? 'التحكم في الخصوصية' : 'Privacy Controls' }}</span>
                  </button>
                </div>
              </div>

              <button
                class="nav-tab-btn logout-tab-btn"
                @click="handleLogout"
              >
                <i class="fa-solid fa-arrow-right-from-bracket nav-icon"></i>
                <span>{{ isRtl ? 'تسجيل الخروج' : 'Log Out' }}</span>
              </button>
            </nav>
          </aside>

          <!-- RIGHT MAIN PANEL -->
          <div class="profile-main-panel">

            <!-- ==================== AGENT TOOLS TABS ==================== -->
            <div v-if="activeTab.startsWith('agent-')" class="tab-view-container fade-in">
              <AgentHubView 
                :activeSubTab="agentSubTab" 
                @update:activeSubTab="handleAgentSubTabUpdate"
                :agentName="user.name"
                :isRtl="isRtl"
                :isDark="isDark"
                @show-toast="showToast"
              />
            </div>

            <!-- ==================== MY PROPERTIES ==================== -->
            <div v-else-if="activeTab === 'properties'" class="tab-view-container properties-embedded-view fade-in">
              <OwnerPropertiesPage embedded />
            </div>

            <!-- ==================== TAB 1: OVERVIEW ==================== -->
            <div v-else-if="activeTab === 'overview'" class="tab-view-container fade-in">
              
              <!-- Agent Direct Shortcut Card (Only for Certified Agents) -->
              <div v-if="isAgent" class="agent-welcome-banner-card" @click="switchTab('agent-dashboard')">
                <div class="awb-left">
                  <div class="awb-icon-wrap">
                    <i class="fa-solid fa-briefcase"></i>
                  </div>
                  <div class="awb-info">
                    <h3 class="awb-title">{{ isRtl ? 'لوحة تحكم الوكيل العقاري المعتمد' : 'Certified Real Estate Agent Workspace' }}</h3>
                    <p class="awb-desc">{{ isRtl ? 'إدارة العقارات المعروضة، مواعيد وطلبات المعاينة، واستفسارات العملاء المباشرة' : 'Manage your listed properties, viewing requests, and direct client leads' }}</p>
                  </div>
                </div>
                <button type="button" class="awb-action-btn" @click.stop="switchTab('agent-dashboard')">
                  <span>{{ isRtl ? 'فتح لوحة الوكيل' : 'Open Agent Hub' }}</span>
                  <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>
              </div>

              <!-- 4 Quick Stat Summary Cards Grid -->
              <div class="stats-grid">
                <div class="stat-card" @click="switchTab('saved')">
                  <div class="stat-icon-box bg-blue">
                    <i class="fa-solid fa-heart"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ stats.savedProperties }}</div>
                    <div class="stat-label">Saved Properties</div>
                    <div class="stat-action-link">View all <i class="fa-solid fa-arrow-right"></i></div>
                  </div>
                </div>

                <div class="stat-card" @click="showToast('Browsing history contains 48 properties viewed recently.')">
                  <div class="stat-icon-box bg-blue">
                    <i class="fa-solid fa-eye"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ stats.propertiesViewed }}</div>
                    <div class="stat-label">Properties Viewed</div>
                    <div class="stat-action-link">See history <i class="fa-solid fa-arrow-right"></i></div>
                  </div>
                </div>

                <div class="stat-card" @click="switchTab('alerts')">
                  <div class="stat-icon-box bg-blue">
                    <i class="fa-solid fa-star"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ stats.searchAlerts }}</div>
                    <div class="stat-label">Search Alerts</div>
                    <div class="stat-action-link">Manage <i class="fa-solid fa-arrow-right"></i></div>
                  </div>
                </div>

                <div class="stat-card" @click="showToast('You have 2 active inquiries with luxury agents.')">
                  <div class="stat-icon-box bg-blue">
                    <i class="fa-solid fa-house"></i>
                  </div>
                  <div class="stat-content">
                    <div class="stat-value">{{ stats.inquiriesSent }}</div>
                    <div class="stat-label">Inquiries Sent</div>
                    <div class="stat-action-link">View messages <i class="fa-solid fa-arrow-right"></i></div>
                  </div>
                </div>
              </div>

              <!-- Two Column Details Cards -->
              <div class="info-dual-grid">
                
                <!-- Profile Information Card -->
                <div class="info-card">
                  <div class="info-card-header">
                    <h3 class="card-title">Profile Information</h3>
                    <button class="btn-card-edit" @click="switchTab('edit')">
                      <i class="fa-solid fa-pen"></i> Edit Profile
                    </button>
                  </div>

                  <div class="info-list">
                    <div class="info-row">
                      <div class="row-label"><i class="fa-regular fa-user"></i> Full Name</div>
                      <div class="row-value">{{ user.name }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-regular fa-envelope"></i> Email Address</div>
                      <div class="row-value">{{ user.email }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-phone"></i> Phone Number</div>
                      <div class="row-value">{{ user.phone }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-location-dot"></i> Location</div>
                      <div class="row-value">{{ user.location }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-compass"></i> Preferred Area</div>
                      <div class="row-value">{{ user.preferredArea }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-id-card"></i> Account Type</div>
                      <div class="row-value val-with-link">
                        <span class="account-badge">{{ user.accountType }}</span>
                        <button class="link-upgrade" @click="showUpgradeModal = true">
                          Upgrade to Pro <i class="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Your Preferences Card -->
                <div class="info-card">
                  <div class="info-card-header">
                    <h3 class="card-title">Your Preferences</h3>
                    <button class="btn-card-edit-outline" @click="switchTab('preferences')">
                      <i class="fa-solid fa-pen"></i> Edit
                    </button>
                  </div>

                  <div class="info-list">
                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-building"></i> Property Types</div>
                      <div class="row-value">{{ preferences.propertyTypes.join(', ') }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-dollar-sign"></i> Price Range</div>
                      <div class="row-value">{{ preferences.priceRangeText }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-bed"></i> Bedrooms</div>
                      <div class="row-value">{{ preferences.bedrooms }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-heart"></i> Lifestyle</div>
                      <div class="row-value">{{ preferences.lifestyle.join(', ') }}</div>
                    </div>

                    <div class="info-row">
                      <div class="row-label"><i class="fa-solid fa-bell"></i> Notifications</div>
                      <div class="row-value">{{ preferences.notifications }}</div>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Recently Viewed Section -->
              <div class="recently-viewed-section">
                <div class="section-header">
                  <h3 class="section-title">Recently Viewed</h3>
                  <button class="link-see-all" @click="showToast('Loading full property history...')">
                    See all <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>

                <div class="properties-trio-grid">
                  <div
                    v-for="prop in recentlyViewed"
                    :key="prop.id"
                    class="property-card"
                  >
                    <div class="card-media">
                      <img :src="prop.image" :alt="prop.title" class="prop-img">
                      <div class="badge-time">{{ prop.viewedTime }}</div>
                      <button
                        class="btn-fav-toggle"
                        :class="{ faved: prop.saved }"
                        @click="toggleSaveProperty(prop)"
                        title="Toggle Favorite"
                      >
                        <i :class="prop.saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                      </button>
                    </div>

                    <div class="card-body">
                      <h4 class="prop-title">{{ prop.title }}</h4>
                      <p class="prop-location">
                        <i class="fa-solid fa-location-dot"></i> {{ prop.location }}
                      </p>
                      <div class="prop-price">{{ prop.price }}</div>
                      <div class="prop-specs">
                        <span><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                        <span><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                        <span><i class="fa-solid fa-ruler-combined"></i> {{ prop.sqft }} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom VibeLocate AI Pro Banner -->
              <div class="pro-promo-banner">
                <div class="banner-left">
                  <h3 class="banner-title">Unlock More with VibeLocate AI Pro</h3>
                  <p class="banner-subtitle">Get advanced search filters, price alerts, and exclusive listings.</p>
                  <button class="btn-banner-upgrade" @click="showUpgradeModal = true">
                    <i class="fa-solid fa-crown"></i> Upgrade Now
                  </button>
                </div>

                <div class="banner-right">
                  <ul class="banner-checklist">
                    <li><i class="fa-solid fa-check-circle"></i> Save unlimited properties</li>
                    <li><i class="fa-solid fa-check-circle"></i> Get instant price alerts</li>
                    <li><i class="fa-solid fa-check-circle"></i> Access exclusive listings</li>
                    <li><i class="fa-solid fa-check-circle"></i> Priority support</li>
                  </ul>
                </div>
              </div>

            </div>

            <!-- ==================== TAB 2: EDIT PROFILE ==================== -->
            <div v-else-if="activeTab === 'edit'" class="tab-view-container fade-in">
              <div class="edit-profile-layout">
                
                <!-- Left Side: Form -->
                <div class="form-card">
                  <h3 class="card-title mb-4">Personal Information</h3>

                  <div v-if="saveErrorMessage" class="profile-error-banner">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <span>{{ saveErrorMessage }}</span>
                  </div>

                  <form @submit.prevent="saveProfileChanges">
                    <div class="form-group mb-3">
                      <label class="form-label">Full Name</label>
                      <input
                        v-model="editForm.name"
                        type="text"
                        class="form-control"
                        placeholder="Enter full name"
                        required
                      >
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label">Email Address</label>
                      <input
                        v-model="editForm.email"
                        type="email"
                        class="form-control"
                        placeholder="Enter email address"
                        required
                      >
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label">Phone Number</label>
                      <div class="input-with-flag">
                        <span class="flag-icon">🇦🇪</span>
                        <input
                          v-model="editForm.phone"
                          type="tel"
                          class="form-control flag-padded"
                          placeholder="+971 50 123 4567"
                        >
                      </div>
                    </div>

                    <div class="form-group mb-3">
                      <label class="form-label">Location</label>
                      <select v-model="editForm.location" class="form-select">
                        <option value="Dubai, UAE">Dubai, UAE</option>
                        <option value="Abu Dhabi, UAE">Abu Dhabi, UAE</option>
                        <option value="Sharjah, UAE">Sharjah, UAE</option>
                        <option value="Ras Al Khaimah, UAE">Ras Al Khaimah, UAE</option>
                      </select>
                    </div>

                    <div class="form-group mb-4">
                      <div class="d-flex justify-content-between">
                        <label class="form-label">Bio (Optional)</label>
                        <span class="char-count">{{ editForm.bio.length }}/300</span>
                      </div>
                      <textarea
                        v-model="editForm.bio"
                        class="form-textarea"
                        rows="3"
                        maxlength="300"
                        placeholder="Share a short bio..."
                      ></textarea>
                    </div>

                    <div class="form-actions">
                      <button type="button" class="btn-cancel" @click="cancelEdit" :disabled="isSaving">Cancel</button>
                      <button type="submit" class="btn-save-primary" :disabled="isSaving">
                        <span v-if="isSaving"><i class="fa-solid fa-spinner fa-spin"></i> Saving...</span>
                        <span v-else>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </div>

                <!-- Right Side: Avatar & Account Cards -->
                <div class="edit-side-cards">
                  
                  <!-- Profile Photo Card -->
                  <div class="side-card photo-card text-center">
                    <h4 class="card-subtitle">Profile Photo</h4>
                    <div class="avatar-large-preview mb-3">
                      <span v-if="!user.avatarUrl" class="avatar-initials-preview">{{ user.avatarInitials }}</span>
                      <img v-else :src="user.avatarUrl" :alt="user.name" class="avatar-img">
                    </div>
                    <button class="btn-change-photo" @click="triggerPhotoUpload" :disabled="isUploadingPhoto">
                      <i v-if="isUploadingPhoto" class="fa-solid fa-spinner fa-spin"></i>
                      <i v-else class="fa-solid fa-camera"></i>
                      <span>{{ isUploadingPhoto ? ' Uploading...' : ' Change Photo' }}</span>
                    </button>
                    <p class="photo-hint">JPG, PNG up to 5MB</p>
                    <input type="file" ref="fileInput" style="display: none;" accept="image/*" @change="handlePhotoUpload">
                  </div>

                  <!-- Account Type Card -->
                  <div class="side-card account-card text-center">
                    <div class="crown-icon-wrap">
                      <i class="fa-solid fa-crown"></i>
                    </div>
                    <h4 class="card-subtitle">Account Type</h4>
                    <div class="member-pill mb-2">
                      <i class="fa-solid fa-star text-warning"></i> Free Member
                    </div>
                    <p class="account-desc">Upgrade to Pro for advanced features and exclusive listings.</p>
                    <button class="btn-upgrade-pro-full" @click="showUpgradeModal = true">
                      <i class="fa-solid fa-crown"></i> Upgrade to Pro
                    </button>
                  </div>

                </div>

              </div>
            </div>

            <!-- ==================== TAB 3: SAVED PROPERTIES ==================== -->
            <div v-else-if="activeTab === 'saved'" class="tab-view-container fade-in">
              
              <!-- Filter Tabs Bar -->
              <div class="saved-filter-tabs mb-4">
                <button
                  v-for="cat in ['All', 'Apartments', 'Villas', 'Penthouses', 'Townhouses']"
                  :key="cat"
                  class="filter-tab-pill"
                  :class="{ active: activeSavedTab === cat }"
                  @click="activeSavedTab = cat"
                >
                  {{ cat }} ({{ savedFilterCounts[cat] }})
                </button>
              </div>

              <!-- Saved Properties Grid -->
              <div v-if="filteredSavedProperties.length > 0" class="saved-properties-grid">
                <div
                  v-for="prop in filteredSavedProperties"
                  :key="prop.id"
                  class="property-card"
                >
                  <div class="card-media">
                    <img :src="prop.image" :alt="prop.title" class="prop-img">
                    <button
                      class="btn-fav-toggle faved"
                      @click.stop="toggleSaveProperty(prop)"
                      title="Remove from saved properties"
                    >
                      <i class="fa-solid fa-heart"></i>
                    </button>
                  </div>

                  <div class="card-body">
                    <h4 class="prop-title">{{ prop.title }}</h4>
                    <p class="prop-location">
                      <i class="fa-solid fa-location-dot"></i> {{ prop.location }}
                    </p>
                    <div class="prop-price">{{ prop.price }}</div>
                    <div class="prop-specs">
                      <span><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                      <span><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                      <span><i class="fa-solid fa-ruler-combined"></i> {{ prop.sqft }} sqft</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="empty-state-card text-center py-5">
                <i class="fa-regular fa-heart empty-icon mb-3"></i>
                <h3>No {{ activeSavedTab === 'All' ? 'properties' : activeSavedTab }} saved yet</h3>
                <p class="text-muted">Explore Dubai properties and click the heart icon to save your favorites.</p>
                <RouterLink to="/home" class="btn-save-primary mt-3 d-inline-block">Browse Properties</RouterLink>
              </div>

            </div>

            <!-- ==================== TAB 4: SEARCH ALERTS ==================== -->
            <div v-else-if="activeTab === 'alerts'" class="tab-view-container fade-in">
              <div class="alerts-card">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h3 class="card-title">Active Search Alerts</h3>
                  <button class="btn-save-primary" @click="showToast('Alert creation modal opening...')">
                    <i class="fa-solid fa-plus"></i> Create New Alert
                  </button>
                </div>

                <div v-if="searchAlertsList.length > 0" class="alerts-list">
                  <div
                    v-for="alert in searchAlertsList"
                    :key="alert.id"
                    class="alert-item-box"
                  >
                    <div class="alert-info">
                      <div class="alert-title-row">
                        <h4 class="alert-name">{{ alert.name }}</h4>
                        <span class="status-badge-active">{{ alert.status }}</span>
                      </div>
                      <p class="alert-details">{{ alert.details }}</p>
                    </div>
                    <div class="alert-actions">
                      <button class="btn-icon-action" title="Settings" @click="showToast('Alert preferences updated.')"><i class="fa-solid fa-sliders"></i></button>
                      <button class="btn-icon-action text-danger" title="Remove Alert" @click="removeAlert(alert)"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>

                <div v-else class="empty-state-card text-center py-5">
                  <i class="fa-regular fa-bell empty-icon mb-3"></i>
                  <h3>No Active Alerts</h3>
                  <p class="text-muted">You have no active property alerts. Create an alert to receive updates.</p>
                </div>
              </div>
            </div>

            <!-- ==================== TAB 5: MY PREFERENCES ==================== -->
            <div v-else-if="activeTab === 'preferences'" class="tab-view-container fade-in">
              <div class="form-card">
                <h3 class="card-title mb-4">{{ isRtl ? 'تفضيلات البحث بالذكاء الاصطناعي' : 'AI Search Preferences' }}</h3>
                <form @submit.prevent="saveUserPreferences">
                  <div class="form-group mb-4">
                    <label class="form-label">{{ isRtl ? 'أنواع العقارات المفضلة' : 'Preferred Property Types' }}</label>
                    <div class="checkbox-group-grid">
                      <label v-for="t in ['Apartments', 'Villas', 'Penthouses', 'Townhouses']" :key="t" class="custom-chk-label">
                        <input type="checkbox" :value="t" v-model="preferences.propertyTypes">
                        <span>{{ t }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group mb-4">
                    <label class="form-label">{{ isRtl ? 'نطاق السعر (درهم إماراتي)' : 'Price Range (AED)' }}</label>
                    <div class="row g-2">
                      <div class="col-6">
                        <input type="number" v-model.number="preferences.priceRangeMin" class="form-control" :placeholder="isRtl ? 'الحد الأدنى' : 'Min Price'">
                      </div>
                      <div class="col-6">
                        <input type="number" v-model.number="preferences.priceRangeMax" class="form-control" :placeholder="isRtl ? 'الحد الأقصى' : 'Max Price'">
                      </div>
                    </div>
                  </div>

                  <div class="form-group mb-4">
                    <label class="form-label">{{ isRtl ? 'عدد غرف النوم' : 'Bedrooms' }}</label>
                    <select v-model="preferences.bedrooms" class="form-select">
                      <option value="Studio">Studio</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 - 4 Bedrooms">2 - 4 Bedrooms</option>
                      <option value="5+ Bedrooms">5+ Bedrooms</option>
                    </select>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="btn-save-primary" :disabled="isSavingPreferences">
                      <i v-if="isSavingPreferences" class="fa-solid fa-spinner fa-spin me-2"></i>
                      <span>{{ isSavingPreferences ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التفضيلات' : 'Save Preferences') }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- ==================== TAB 6: SECURITY & PASSWORD ==================== -->
            <div v-else-if="activeTab === 'settings-security' || activeTab === 'settings'" class="tab-view-container fade-in">
              <div class="form-card mb-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <h3 class="card-title mb-1">{{ isRtl ? 'الأمان وكلمة المرور' : 'Security & Password' }}</h3>
                    <p class="text-muted mb-0">{{ isRtl ? 'تأكد من استخدام كلمة مرور قوية لحماية حسابك من الوصول غير المصرح به' : 'Ensure your account is using a long, random password to stay secure.' }}</p>
                  </div>
                  <div class="badge-security-icon">
                    <i class="fa-solid fa-shield-halved"></i>
                  </div>
                </div>

                <!-- Status Alerts -->
                <div v-if="passwordError" class="alert-inline alert-danger mb-4">
                  <i class="fa-solid fa-circle-exclamation me-2"></i>
                  <span>{{ passwordError }}</span>
                </div>

                <div v-if="passwordSuccess" class="alert-inline alert-success mb-4">
                  <i class="fa-solid fa-circle-check me-2"></i>
                  <span>{{ passwordSuccess }}</span>
                </div>

                <form @submit.prevent="handleChangePassword">
                  <div class="form-group mb-3">
                    <label class="form-label">{{ isRtl ? 'كلمة المرور الحالية' : 'Current Password' }} <span class="required-star">*</span></label>
                    <div class="password-input-wrap">
                      <input
                        :type="showCurrentPass ? 'text' : 'password'"
                        v-model="passwordForm.currentPassword"
                        class="form-control"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        required
                        :disabled="isSavingPassword"
                      >
                      <button type="button" class="btn-toggle-eye" @click="showCurrentPass = !showCurrentPass" tabindex="-1">
                        <i :class="showCurrentPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="form-label">{{ isRtl ? 'كلمة المرور الجديدة' : 'New Password' }} <span class="required-star">*</span></label>
                    <div class="password-input-wrap">
                      <input
                        :type="showNewPass ? 'text' : 'password'"
                        v-model="passwordForm.newPassword"
                        class="form-control"
                        :placeholder="isRtl ? '6 خانات على الأقل' : 'Minimum 6 characters'"
                        autocomplete="new-password"
                        required
                        :disabled="isSavingPassword"
                      >
                      <button type="button" class="btn-toggle-eye" @click="showNewPass = !showNewPass" tabindex="-1">
                        <i :class="showNewPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="form-group mb-4">
                    <label class="form-label">{{ isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password' }} <span class="required-star">*</span></label>
                    <div class="password-input-wrap">
                      <input
                        :type="showConfirmPass ? 'text' : 'password'"
                        v-model="passwordForm.confirmPassword"
                        class="form-control"
                        :placeholder="isRtl ? 'أعد إدخال كلمة المرور' : 'Repeat new password'"
                        autocomplete="new-password"
                        required
                        :disabled="isSavingPassword"
                      >
                      <button type="button" class="btn-toggle-eye" @click="showConfirmPass = !showConfirmPass" tabindex="-1">
                        <i :class="showConfirmPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                      </button>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="btn-save-primary" :disabled="isSavingPassword">
                      <i v-if="isSavingPassword" class="fa-solid fa-spinner fa-spin me-2"></i>
                      <i v-else class="fa-solid fa-key me-2"></i>
                      <span>{{ isSavingPassword ? (isRtl ? 'جاري التحديث...' : 'Updating Password...') : (isRtl ? 'تحديث كلمة المرور' : 'Update Password') }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <!-- Two-Factor Authentication Interactive Card -->
              <div class="form-card mb-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div class="d-flex align-items-center gap-3">
                    <div class="security-feature-icon" :class="{ 'icon-active': is2faEnabled }">
                      <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                      <div class="d-flex align-items-center gap-2">
                        <h4 class="card-subtitle mb-0">{{ isRtl ? 'التحقق بخطوتين (2FA)' : 'Two-Factor Authentication (2FA)' }}</h4>
                        <span :class="is2faEnabled ? 'badge-feature-active' : 'badge-feature-inactive'">
                          <i class="fa-solid" :class="is2faEnabled ? 'fa-circle-check' : 'fa-circle-xmark'"></i>
                          {{ is2faEnabled ? (isRtl ? 'مُفعّل' : 'Enabled') : (isRtl ? 'غير مُفعّل' : 'Disabled') }}
                        </span>
                      </div>
                      <p class="text-muted small mb-0 mt-1">
                        {{ isRtl ? 'حماية إضافية لحسابك باستخدام تطبيق المصادقة (Google Authenticator / Microsoft Authenticator)' : 'Extra login security using Google or Microsoft Authenticator app OTP.' }}
                      </p>
                    </div>
                  </div>

                  <div class="two-factor-actions">
                    <button 
                      v-if="!is2faEnabled"
                      type="button" 
                      class="btn-2fa-action btn-enable" 
                      @click="handleStart2FA"
                      :disabled="isLoading2fa"
                    >
                      <i v-if="isLoading2fa" class="fa-solid fa-spinner fa-spin me-1"></i>
                      <i v-else class="fa-solid fa-lock me-1"></i>
                      <span>{{ isRtl ? 'تفعيل التحقق بخطوتين' : 'Enable 2FA' }}</span>
                    </button>

                    <button 
                      v-else
                      type="button" 
                      class="btn-2fa-action btn-disable" 
                      @click="handleDisable2FA"
                      :disabled="isDisabling2fa"
                    >
                      <i v-if="isDisabling2fa" class="fa-solid fa-spinner fa-spin me-1"></i>
                      <i v-else class="fa-solid fa-shield-xmark me-1"></i>
                      <span>{{ isRtl ? 'تعطيل التحقق' : 'Disable 2FA' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Active Device Sessions Card -->
              <div class="form-card">
                <h4 class="card-subtitle mb-3">{{ isRtl ? 'الجلسات والأجهزة النشطة' : 'Active Sessions' }}</h4>
                <div class="session-card-row">
                  <div class="d-flex align-items-center gap-3">
                    <div class="session-device-icon">
                      <i class="fa-solid fa-desktop"></i>
                    </div>
                    <div>
                      <div class="fw-bold">{{ isRtl ? 'المتصفح الحالي (Web Session)' : 'Current Web Session' }}</div>
                      <small class="text-muted">Dubai, UAE • {{ isRtl ? 'نشط الآن' : 'Active now' }}</small>
                    </div>
                  </div>
                  <span class="badge-this-device">{{ isRtl ? 'هذا الجهاز' : 'This Device' }}</span>
                </div>
              </div>
            </div>

            <!-- ==================== TAB 7: PRIVACY CONTROLS ==================== -->
            <div v-else-if="activeTab === 'settings-privacy'" class="tab-view-container fade-in">
              
              <!-- 1. Profile Visibility Card -->
              <div class="form-card mb-4">
                <h3 class="card-title mb-2">{{ isRtl ? 'إمكانية رؤية الملف الشخصي' : 'Profile Visibility' }}</h3>
                <p class="text-muted mb-4">{{ isRtl ? 'تحكم في كيفية ظهور ملفك الشخصي وبيانات التواصل لوكلاء العقارات والزوار' : 'Control how your profile and contact info are visible to agents and guests.' }}</p>

                <div class="privacy-option-group">
                  <label class="privacy-radio-card" :class="{ selected: privacySettings.profileVisibility === 'agents_only' }">
                    <input type="radio" v-model="privacySettings.profileVisibility" value="agents_only" @change="savePrivacySettings">
                    <div class="radio-card-content">
                      <div class="radio-card-title">
                        <i class="fa-solid fa-user-shield me-2 text-primary"></i> 
                        {{ isRtl ? 'للوكلاء المعتمدين فقط (موصى به)' : 'Verified Agents Only (Recommended)' }}
                      </div>
                      <p class="radio-card-desc">{{ isRtl ? 'يمكن فقط للوكلاء المعتمدين رؤية تفضيلاتك عند تقديم استفسار عن عقار' : 'Only certified agents can see your preferences when you submit an inquiry.' }}</p>
                    </div>
                  </label>

                  <label class="privacy-radio-card" :class="{ selected: privacySettings.profileVisibility === 'public' }">
                    <input type="radio" v-model="privacySettings.profileVisibility" value="public" @change="savePrivacySettings">
                    <div class="radio-card-content">
                      <div class="radio-card-title">
                        <i class="fa-solid fa-globe me-2 text-primary"></i> 
                        {{ isRtl ? 'عام للجميع' : 'Public Profile' }}
                      </div>
                      <p class="radio-card-desc">{{ isRtl ? 'يظهر اسمك ونبذتك في مراجعات وتقييمات العقارات للمجتمع' : 'Your name and public bio can appear on property reviews and discussions.' }}</p>
                    </div>
                  </label>

                  <label class="privacy-radio-card" :class="{ selected: privacySettings.profileVisibility === 'private' }">
                    <input type="radio" v-model="privacySettings.profileVisibility" value="private" @change="savePrivacySettings">
                    <div class="radio-card-content">
                      <div class="radio-card-title">
                        <i class="fa-solid fa-lock me-2 text-primary"></i> 
                        {{ isRtl ? 'حساب خاص بالكامل' : 'Strictly Private' }}
                      </div>
                      <p class="radio-card-desc">{{ isRtl ? 'إخفاء كافة البيانات ولا تظهر إلا عند تأكيد حجز معاينة رسمية' : 'Hide all contact details until a viewing booking is confirmed.' }}</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- 2. Browsing & Activity Tracking Card -->
              <div class="form-card mb-4">
                <h3 class="card-title mb-2">{{ isRtl ? 'سجل التصفح والبحث الذكي' : 'Browsing & Search Activity' }}</h3>
                <p class="text-muted mb-4">{{ isRtl ? 'إدارة حفظ سجل العقارات المشاهدة والبحث بالذكاء الاصطناعي لتحسين التوصيات' : 'Manage your viewing history and AI contextual memory for smarter recommendations.' }}</p>

                <div class="privacy-toggles-list">
                  <div class="privacy-toggle-item">
                    <div>
                      <div class="fw-bold">{{ isRtl ? 'حفظ العقارات المشاهدة مؤخراً' : 'Keep Recently Viewed History' }}</div>
                      <small class="text-muted">{{ isRtl ? 'تسهيل الرجوع للعقارات التي تصفحتها في دبي' : 'Easily return to properties you recently viewed' }}</small>
                    </div>
                    <label class="switch-toggle">
                      <input type="checkbox" v-model="privacySettings.trackBrowsingHistory" @change="savePrivacySettings">
                      <span class="slider-round"></span>
                    </label>
                  </div>

                  <div class="privacy-toggle-item">
                    <div>
                      <div class="fw-bold">{{ isRtl ? 'تخصيص التوصيات بالذكاء الاصطناعي' : 'AI Recommendation Personalization' }}</div>
                      <small class="text-muted">{{ isRtl ? 'استخدام تفضيلاتك لتحسين نتائج محرك البحث السياقي VibeLocate' : 'Use your preferences to improve contextual AI property matches' }}</small>
                    </div>
                    <label class="switch-toggle">
                      <input type="checkbox" v-model="privacySettings.shareAiContext" @change="savePrivacySettings">
                      <span class="slider-round"></span>
                    </label>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-top d-flex gap-3">
                  <button type="button" class="btn-clear-history" @click="clearHistory">
                    <i class="fa-solid fa-clock-rotate-left me-1"></i> {{ isRtl ? 'مسح سجل التصفح الآن' : 'Clear Browsing History' }}
                  </button>
                </div>
              </div>

              <!-- 3. Data Download Card -->
              <div class="form-card mb-4">
                <h3 class="card-title mb-2">{{ isRtl ? 'بياناتك وخصوصية الحساب' : 'Your Data Archive' }}</h3>
                <p class="text-muted mb-3">{{ isRtl ? 'يمكنك في أي وقت تنزيل نسخة كاملة من بياناتك وتفضيلاتك المحفوظة' : 'Download a complete JSON export of your profile, preferences, and activity.' }}</p>

                <button type="button" class="btn-download-data" @click="downloadUserData">
                  <i class="fa-solid fa-download me-2"></i> {{ isRtl ? 'تحميل نسخة من بياناتي (JSON)' : 'Download My Data Archive' }}
                </button>
              </div>

              <!-- 4. Danger Zone: Delete Account -->
              <div class="form-card danger-card">
                <div class="danger-header">
                  <div>
                    <h3 class="card-title text-danger mb-1">{{ isRtl ? 'منطقة الخطر' : 'Danger Zone' }}</h3>
                    <p class="text-muted mb-0">{{ isRtl ? 'حذف الحساب نهائياً مع كافة العقارات المحفوظة والتنبيهات والبيانات المسجلة' : 'Permanently remove your profile, saved properties, preferences, and alerts.' }}</p>
                  </div>
                  <button type="button" class="btn-danger-outline" @click="openDeleteModal">
                    <i class="fa-solid fa-trash-can me-1"></i> {{ isRtl ? 'حذف الحساب' : 'Delete Account' }}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import OwnerPropertiesPage from './OwnerPropertiesPage.vue'
import AgentHubView from './AgentHubView.vue'
import NavbarControls from './NavbarControls.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { t, isRtl, isDark } = useThemeAndLanguage()

const route = useRoute()
const router = useRouter()

// Tabs state
const activeTab = ref('overview')
const showUpgradeModal = ref(false)
const fileInput = ref(null)

// Settings Accordion State (3 Sub-Pages: Edit Profile, Security & Password, Privacy Controls)
const settingsSectionOpen = ref(false)
const toggleSettingsSection = () => {
  settingsSectionOpen.value = !settingsSectionOpen.value
  if (settingsSectionOpen.value && !['edit', 'settings-security', 'settings', 'settings-privacy'].includes(activeTab.value)) {
    switchTab('edit')
  }
}

// Privacy Settings State & Actions
const privacySettings = ref({
  profileVisibility: 'agents_only',
  showPhoneToAgents: true,
  trackBrowsingHistory: true,
  shareAiContext: true
})

const loadPrivacySettings = () => {
  try {
    const raw = localStorage.getItem('vibe_privacy_settings')
    if (raw) {
      privacySettings.value = { ...privacySettings.value, ...JSON.parse(raw) }
    }
  } catch (e) {}
}

const savePrivacySettings = () => {
  try {
    localStorage.setItem('vibe_privacy_settings', JSON.stringify(privacySettings.value))
    showToast(isRtl.value ? 'تم حفظ إعدادات الخصوصية بنجاح' : 'Privacy settings saved successfully')
  } catch (e) {
    showToast(isRtl.value ? 'حدث خطأ أثناء حفظ الإعدادات' : 'Failed to save settings', 'error')
  }
}

const clearHistory = () => {
  try {
    localStorage.removeItem('vibe_recently_viewed')
    recentlyViewed.value = []
    stats.value.propertiesViewed = 0
    showToast(isRtl.value ? 'تم مسح سجل التصفح والمشاهدات بنجاح' : 'Browsing history cleared successfully')
  } catch (e) {}
}

const downloadUserData = () => {
  const data = {
    user: user.value,
    preferences: preferences.value,
    privacy: privacySettings.value,
    savedPropertiesCount: savedPropertiesList.value?.length || 0,
    exportDate: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vibelocate-profile-data-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast(isRtl.value ? 'جاري تحميل ملف بياناتك...' : 'Downloading your data archive...')
}

// Agent State & Capabilities (Only available to Real Estate Agents)
const isAgent = ref(false)
const agentSectionOpen = ref(true)

const agentSubTab = computed(() => {
  if (activeTab.value.startsWith('agent-')) {
    return activeTab.value.replace('agent-', '')
  }
  return 'dashboard'
})

const handleAgentSubTabUpdate = (subTab) => {
  switchTab(`agent-${subTab}`)
}

const checkAgentRole = () => {
  try {
    const raw = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    if (raw) {
      const u = JSON.parse(raw)
      const isAg =
        u.role === 'agent' ||
        u.role_slug === 'agent' ||
        u.accountType === 'agent' ||
        u.account_type === 'agent' ||
        (Array.isArray(u.roles) && (u.roles.includes('agent') || u.roles.some(r => r === 'agent' || r?.slug === 'agent')))
      if (isAg) {
        isAgent.value = true
        user.value.role = isRtl.value ? 'وكيل عقاري معتمد' : 'Certified Real Estate Agent'
        user.value.accountType = 'agent'
        agentSectionOpen.value = true
        return
      }
    }
  } catch {}
  if (
    localStorage.getItem('vibe_user_role') === 'agent' ||
    user.value.role === 'Real Estate Agent' ||
    user.value.role === 'agent' ||
    user.value.accountType === 'agent'
  ) {
    isAgent.value = true
    user.value.role = isRtl.value ? 'وكيل عقاري معتمد' : 'Certified Real Estate Agent'
    user.value.accountType = 'agent'
    agentSectionOpen.value = true
  }
}

const toggleAgentMode = () => {
  isAgent.value = !isAgent.value
  const newRole = isAgent.value ? 'agent' : 'tenant'

  try {
    const raw = localStorage.getItem('auth_user')
    const current = raw ? JSON.parse(raw) : {}
    current.role = newRole
    current.accountType = newRole
    localStorage.setItem('auth_user', JSON.stringify(current))
    sessionStorage.setItem('auth_user', JSON.stringify(current))
  } catch {}

  showToast(
    isRtl.value
      ? (isAgent.value ? 'تم تفعيل وضع الوكيل العقاري وفتح أدوات الوكيل' : 'تم التبديل إلى وضع المستخدم العادي')
      : (isAgent.value ? 'Real Estate Agent mode enabled' : 'Switched to Regular User mode')
  )

  if (isAgent.value) {
    user.value.role = isRtl.value ? 'وكيل عقاري معتمد' : 'Certified Real Estate Agent'
    switchTab('agent-dashboard')
  } else {
    user.value.role = isRtl.value ? 'مستكشف عقارات' : 'Property Explorer'
    switchTab('overview')
  }
}

// Toast state
const toastMessage = ref('')
const toastVisible = ref(false)
const toastType = ref('success')
let toastTimer = null

const showToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastVisible.value = true
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, type === 'error' ? 5000 : 3500)
}

// User state – start empty so no stale placeholder shows before API responds
const user = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  preferredArea: '',
  accountType: 'Free Member',
  role: 'Property Explorer',
  memberSince: '',
  bio: '',
  avatarInitials: 'VU',
  avatarUrl: ''
})

// Form state for editing
const editForm = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: ''
})

// Preferences
const preferences = ref({
  propertyTypes: ['Apartments', 'Villas'],
  priceRangeMin: 500000,
  priceRangeMax: 3000000,
  priceRangeText: 'AED 500,000 - 3,000,000',
  bedrooms: '2 - 4 Bedrooms',
  lifestyle: ['Family Friendly', 'Waterfront'],
  notifications: 'Email & Browser'
})

// Stats
const stats = computed(() => ({
  savedProperties: favoritesService.savedItems.value.length,
  propertiesViewed: 48,
  searchAlerts: 3,
  inquiriesSent: 2
}))

// Recently Viewed
const recentlyViewed = ref([
  {
    id: 1,
    title: 'The Royal Atlantis Sky Villa',
    location: 'Palm Jumeirah',
    price: 'AED 18,500,000',
    beds: 4,
    baths: 5,
    sqft: '5,420',
    viewedTime: 'Viewed 2 hours ago',
    image: '/images/photo-1600596542815-ffad4c1539a9.jfif',
    saved: true
  },
  {
    id: 2,
    title: 'Burj Crown Panorama Penthouse',
    location: 'Downtown Dubai',
    price: 'AED 8,450,000',
    beds: 3,
    baths: 4,
    sqft: '2,850',
    viewedTime: 'Viewed 1 day ago',
    image: '/images/photo-1512917774080-9991f1c4c750.jfif',
    saved: true
  },
  {
    id: 3,
    title: 'Marina Gate Waterfront Haven',
    location: 'Dubai Marina',
    price: 'AED 4,450,000',
    beds: 2,
    baths: 3,
    sqft: '1,750',
    viewedTime: 'Viewed 2 days ago',
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    saved: true
  }
])

// Saved properties list & filtering
const activeSavedTab = ref('All')
const savedPropertiesList = computed(() => favoritesService.savedItems.value)

const savedFilterCounts = computed(() => {
  return {
    All: savedPropertiesList.value.length,
    Apartments: savedPropertiesList.value.filter(p => p.type === 'Apartments').length,
    Villas: savedPropertiesList.value.filter(p => p.type === 'Villas').length,
    Penthouses: savedPropertiesList.value.filter(p => p.type === 'Penthouses').length,
    Townhouses: savedPropertiesList.value.filter(p => p.type === 'Townhouses').length
  }
})

const filteredSavedProperties = computed(() => {
  if (activeSavedTab.value === 'All') return savedPropertiesList.value
  return savedPropertiesList.value.filter(p => p.type === activeSavedTab.value)
})

// Search Alerts State & Management
const defaultAlerts = [
  {
    id: 1,
    name: 'Dubai Marina 2-Bed Apartments',
    status: 'Active',
    details: 'AED 1.5M - 3.5M • Instant Email & Push'
  },
  {
    id: 2,
    name: 'Palm Jumeirah Luxury Villas',
    status: 'Active',
    details: 'AED 15M+ • Daily Summary'
  },
  {
    id: 3,
    name: 'Downtown Dubai Penthouses',
    status: 'Active',
    details: 'AED 8M - 20M • Instant Email'
  }
]

const loadAlerts = () => {
  try {
    const raw = localStorage.getItem('vibe_search_alerts')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (e) { /* ignore */ }
  return defaultAlerts
}

const searchAlertsList = ref(loadAlerts())

const removeAlert = (alert) => {
  searchAlertsList.value = searchAlertsList.value.filter(a => a.id !== alert.id)
  try {
    localStorage.setItem('vibe_search_alerts', JSON.stringify(searchAlertsList.value))
  } catch (e) { /* ignore */ }
  stats.value.searchAlerts = searchAlertsList.value.length
  showToast(`Alert "${alert.name}" removed successfully.`)
}

// Tab titles and descriptions
const tabTitlesEn = {
  overview: 'My Profile',
  properties: 'My Properties',
  edit: 'Edit Profile',
  saved: 'Saved Properties',
  alerts: 'Search Alerts',
  preferences: 'My Preferences',
  settings: 'Security & Password',
  'settings-security': 'Security & Password',
  'settings-privacy': 'Privacy Controls',
  'agent-dashboard': 'Agent Dashboard',
  'agent-properties': 'Agent Properties',
  'agent-requests': 'Viewing Requests',
  'agent-messages': 'Client Inquiries',
  'agent-analytics': 'Agent Analytics',
  'agent-verification': 'Profile & Verification',
  'agent-pois': 'Agency POIs'
}

const tabTitlesAr = {
  overview: 'ملفي الشخصي',
  properties: 'عقاراتي',
  edit: 'تعديل الملف الشخصي',
  saved: 'العقارات المحفوظة',
  alerts: 'تنبيهات البحث',
  preferences: 'تفضيلاتي',
  settings: 'الأمان وكلمة المرور',
  'settings-security': 'الأمان وكلمة المرور',
  'settings-privacy': 'التحكم في الخصوصية',
  'agent-dashboard': 'لوحتي',
  'agent-properties': 'عقاراتي',
  'agent-requests': 'طلبات المعاينة',
  'agent-messages': 'الرسائل',
  'agent-analytics': 'الإحصائيات',
  'agent-verification': 'الملف الشخصي والتحقق',
  'agent-pois': 'نقاط الاهتمام (POIs)'
}

const tabSubtitlesEn = {
  overview: 'Manage your account, preferences, and saved properties',
  properties: 'Manage the properties you have listed on VibeLocate AI',
  edit: 'Keep your information up to date',
  saved: 'Your favorite properties, all in one place',
  alerts: 'Manage your real-time property notifications',
  preferences: 'Customize your property search AI criteria',
  settings: 'Manage password, security and active sessions',
  'settings-security': 'Manage password, two-factor authentication, and active sessions',
  'settings-privacy': 'Control profile visibility, search activity, and privacy preferences',
  'agent-dashboard': "Agent dashboard and daily listings performance summary",
  'agent-properties': 'Manage and edit all properties listed under your account',
  'agent-requests': 'Track and confirm property viewing appointments',
  'agent-messages': 'Direct communication center for client inquiries',
  'agent-analytics': 'Detailed analytics on impressions and lead conversion',
  'agent-verification': 'Government licenses, RERA broker card, and credentials',
  'agent-pois': 'Manage local landmarks, amenities, and agency points of interest'
}

const tabSubtitlesAr = {
  overview: 'أدر حسابك وتفضيلاتك وعقاراتك المحفوظة في مكان واحد',
  properties: 'أدر العقارات المدرجة الخاصة بك على منصة VibeLocate AI',
  edit: 'حافظ على تحديث بياناتك ومعلوماتك الشخصية',
  saved: 'عقاراتك المفضلة والمختارة في مكان واحد',
  alerts: 'إدارة تنبيهات البحث الفورية والإشعارات',
  preferences: 'تخصيص معايير البحث والذكاء الاصطناعي',
  settings: 'إدارة كلمة المرور، التحقق بخطوتين، وحماية الحساب',
  'settings-security': 'إدارة كلمة المرور، التحقق بخطوتين، وحماية الحساب',
  'settings-privacy': 'التحكم في ظهور الحساب وسجل التصفح والخصوصية',
  'agent-dashboard': 'لوحة تحكم الوكيل وملخص أداء العقارات اليوم',
  'agent-properties': 'إدارة وتعديل العقارات المعروضة تحت حساب الوكيل',
  'agent-requests': 'إدارة ومتابعة طلبات المعاينة والزيارات الميدانية',
  'agent-messages': 'مركز المحادثات والتواصل المباشر مع العملاء',
  'agent-analytics': 'إحصائيات تفصيلية لمشاهدات وتفاعل العقارات',
  'agent-verification': 'بيانات التوثيق والترخيص العقاري وبطاقة الوسيط',
  'agent-pois': 'إدارة المعالم المحلية والمرافق ونقاط اهتمام الوكالة'
}

const tabTitle = computed(() => (isRtl.value ? tabTitlesAr[activeTab.value] : tabTitlesEn[activeTab.value]) || (isRtl.value ? 'ملفي الشخصي' : 'My Profile'))
const tabSubtitle = computed(() => (isRtl.value ? tabSubtitlesAr[activeTab.value] : tabSubtitlesEn[activeTab.value]) || '')

// Switch tab method with route sync
// Snapshot of user data taken when entering the Edit tab – used by cancelEdit()
const originalUser = ref({})

const switchTab = (tabName) => {
  activeTab.value = tabName
  if (tabName.startsWith('agent-')) {
    isAgent.value = true
  }
  if (['edit', 'settings-security', 'settings', 'settings-privacy'].includes(tabName)) {
    settingsSectionOpen.value = true
  }
  if (tabName === 'edit') {
    // Always sync editForm with the latest user values
    editForm.value.name     = user.value.name     || ''
    editForm.value.email    = user.value.email    || ''
    editForm.value.phone    = user.value.phone    || ''
    editForm.value.location = user.value.location || ''
    editForm.value.bio      = user.value.bio      || ''
    // Take a snapshot so Cancel can restore it
    originalUser.value = {
      name:     user.value.name     || '',
      email:    user.value.email    || '',
      phone:    user.value.phone    || '',
      location: user.value.location || '',
      bio:      user.value.bio      || '',
      avatarUrl:      user.value.avatarUrl      || '',
      avatarInitials: user.value.avatarInitials  || 'VU'
    }
    selectedPhotoFile.value = null
  }
  if (tabName === 'overview') {
    router.push('/profile')
  } else {
    router.push(`/profile/${tabName}`)
  }
}

// Discard any unsaved edits and return to overview
const cancelEdit = () => {
  if (isSaving.value) return
  // Restore editForm to the snapshot taken when Edit was opened
  editForm.value.name     = originalUser.value.name     || ''
  editForm.value.email    = originalUser.value.email    || ''
  editForm.value.phone    = originalUser.value.phone    || ''
  editForm.value.location = originalUser.value.location || ''
  editForm.value.bio      = originalUser.value.bio      || ''
  // Restore user display values (undo any optimistic updates from this session)
  user.value.name           = originalUser.value.name           || ''
  user.value.email          = originalUser.value.email          || ''
  user.value.phone          = originalUser.value.phone          || ''
  user.value.location       = originalUser.value.location       || ''
  user.value.bio            = originalUser.value.bio            || ''
  user.value.avatarUrl      = originalUser.value.avatarUrl      || ''
  user.value.avatarInitials = originalUser.value.avatarInitials || 'VU'
  // Also restore localStorage to match
  if (originalUser.value.name)  localStorage.setItem('vibe_user_name',  originalUser.value.name)
  if (originalUser.value.email) localStorage.setItem('vibe_user_email', originalUser.value.email)
  selectedPhotoFile.value = null
  saveErrorMessage.value = ''
  switchTab('overview')
}

// Sync route tab parameter
const syncTabFromRoute = () => {
  const path = route.path
  if (path.includes('/edit')) {
    activeTab.value = 'edit'
    if (user.value.name && !editForm.value.name) editForm.value.name = user.value.name
    if (user.value.email && !editForm.value.email) editForm.value.email = user.value.email
    if (user.value.phone && !editForm.value.phone) editForm.value.phone = user.value.phone
    if (user.value.location && !editForm.value.location) editForm.value.location = user.value.location
    if (user.value.bio && !editForm.value.bio) editForm.value.bio = user.value.bio
  } else if (path.includes('/agent-dashboard') || route.query.tab === 'agent-dashboard') {
    isAgent.value = true
    activeTab.value = 'agent-dashboard'
  } else if (path.includes('/agent-properties') || route.query.tab === 'agent-properties') {
    isAgent.value = true
    activeTab.value = 'agent-properties'
  } else if (path.includes('/agent-requests') || route.query.tab === 'agent-requests') {
    isAgent.value = true
    activeTab.value = 'agent-requests'
  } else if (path.includes('/agent-messages') || route.query.tab === 'agent-messages') {
    isAgent.value = true
    activeTab.value = 'agent-messages'
  } else if (path.includes('/agent-analytics') || route.query.tab === 'agent-analytics') {
    isAgent.value = true
    activeTab.value = 'agent-analytics'
  } else if (path.includes('/agent-verification') || route.query.tab === 'agent-verification') {
    isAgent.value = true
    agentSectionOpen.value = true
    activeTab.value = 'agent-verification'
  } else if (path.includes('/agent-pois') || route.query.tab === 'agent-pois') {
    isAgent.value = true
    agentSectionOpen.value = true
    activeTab.value = 'agent-pois'
  } else if (route.params.tab && route.params.tab.startsWith('agent-')) {
    isAgent.value = true
    agentSectionOpen.value = true
    activeTab.value = route.params.tab
  } else if (path.includes('/properties')) {
    activeTab.value = 'properties'
  } else if (path.includes('/saved')) {
    activeTab.value = 'saved'
  } else if (path.includes('/alerts')) {
    activeTab.value = 'alerts'
  } else if (path.includes('/preferences')) {
    activeTab.value = 'preferences'
  } else if (path.includes('/settings-security') || route.query.tab === 'settings-security' || path.includes('/security')) {
    activeTab.value = 'settings-security'
    settingsSectionOpen.value = true
  } else if (path.includes('/settings-privacy') || route.query.tab === 'settings-privacy' || path.includes('/privacy')) {
    activeTab.value = 'settings-privacy'
    settingsSectionOpen.value = true
  } else if (path.includes('/settings')) {
    activeTab.value = 'settings-security'
    settingsSectionOpen.value = true
  } else if (path.includes('/edit')) {
    activeTab.value = 'edit'
    settingsSectionOpen.value = true
  } else if (route.query.tab) {
    activeTab.value = route.query.tab
    if (['edit', 'settings-security', 'settings', 'settings-privacy'].includes(route.query.tab)) {
      settingsSectionOpen.value = true
    }
  } else {
    activeTab.value = 'overview'
  }
}

watch(() => route.path, syncTabFromRoute)
watch(() => route.params.tab, syncTabFromRoute)
watch(() => route.query.tab, syncTabFromRoute)

// Loading state for profile API
const profileLoading = ref(false)

/**
 * Parse and apply the /api/profile API response to the reactive user state.
 * Handles various field names the Laravel backend may return.
 * Tries multiple nesting levels: flat → data.user → data.data → data
 */
const applyProfileData = (rawResponse) => {
  // Log raw response so we can trace the actual shape during development
  console.log('[ProfilePage] /api/profile raw response:', JSON.parse(JSON.stringify(rawResponse || {})))

  // Try every possible nesting the Laravel backend might use
  const p =
    (rawResponse?.data?.profile && typeof rawResponse.data.profile === 'object' ? rawResponse.data.profile : null) ||
    (rawResponse?.profile && typeof rawResponse.profile === 'object' ? rawResponse.profile : null) ||
    (rawResponse?.user && typeof rawResponse.user === 'object' ? rawResponse.user : null) ||
    (rawResponse?.data?.user && typeof rawResponse.data.user === 'object' ? rawResponse.data.user : null) ||
    (rawResponse?.data && typeof rawResponse.data === 'object' && !rawResponse.data.profile ? rawResponse.data : null) ||
    rawResponse ||
    {}

  console.log('[ProfilePage] resolved profile object:', JSON.parse(JSON.stringify(p || {})))

  // Full name – extract from all possible fields (name, full_name, first_name + last_name)
  const serverFullName =
    p.name ||
    p.full_name ||
    p.fullName ||
    [p.first_name, p.last_name].filter(Boolean).join(' ') ||
    p.first_name ||
    p.user_name ||
    p.username ||
    ''

  const cachedName = localStorage.getItem('vibe_user_name') || ''
  const fullName = serverFullName || cachedName

  if (fullName) {
    user.value.name = fullName
    editForm.value.name = fullName
    // Generate initials
    const nameParts = fullName.trim().split(/\s+/)
    user.value.avatarInitials = ((nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '')).toUpperCase() || 'VU'
  }

  // Email
  const email = p.email || localStorage.getItem('vibe_user_email') || ''
  if (email) {
    user.value.email = email
    editForm.value.email = email
  }

  // Phone
  const phone = p.phone || p.phone_number || p.mobile || ''
  if (phone) {
    user.value.phone = phone
    editForm.value.phone = phone
  }

  // Location / city
  const rawLoc = p.location || (p.city ? [p.city, p.country].filter(Boolean).join(', ') : '') || p.city || ''
  if (rawLoc) {
    const knownCities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah']
    const matched = knownCities.find(c => rawLoc.toLowerCase().includes(c.toLowerCase()))
    const loc = matched ? `${matched}, UAE` : rawLoc
    user.value.location = loc
    editForm.value.location = loc
  }

  // Bio / about
  const bio = p.bio || p.about || p.description || ''
  if (bio) {
    user.value.bio = bio
    editForm.value.bio = bio
  }

  // Profile photo / avatar: prioritize user's explicitly selected photo if available
  const localAvatar = localStorage.getItem('vibe_user_avatar') || ''
  let serverAvatar =
    p.profile_photo_url ||
    p.avatar_url ||
    p.avatar ||
    p.photo ||
    p.image ||
    p.picture ||
    ''
  if (serverAvatar && !serverAvatar.startsWith('http') && !serverAvatar.startsWith('data:') && !serverAvatar.startsWith('/')) {
    serverAvatar = `https://vibelocate-laravel.onrender.com/${serverAvatar}`
  }
  const avatar = localAvatar || serverAvatar
  if (avatar) {
    user.value.avatarUrl = avatar
  }

  // Account / role type & Agent detection
  const isAgentUser =
    p.account_type === 'agent' ||
    p.role === 'agent' ||
    p.role_slug === 'agent' ||
    (Array.isArray(p.roles) && p.roles.some(r => r === 'agent' || r?.slug === 'agent' || r?.name?.toLowerCase() === 'agent')) ||
    (Array.isArray(rawResponse?.data?.roles) && rawResponse.data.roles.some(r => r === 'agent' || r?.slug === 'agent')) ||
    (Array.isArray(rawResponse?.user?.roles) && rawResponse.user.roles.includes('agent')) ||
    rawResponse?.user?.role === 'agent' ||
    localStorage.getItem('vibe_user_role') === 'agent'

  if (isAgentUser) {
    isAgent.value = true
    agentSectionOpen.value = true
    user.value.accountType = 'agent'
    user.value.role = isRtl.value ? 'وكيل عقاري معتمد' : 'Certified Real Estate Agent'
    localStorage.setItem('vibe_user_role', 'agent')
  } else {
    const accountType = p.account_type || p.plan || p.subscription || p.role || 'Free Member'
    user.value.accountType = accountType
    user.value.role = isRtl.value ? 'مستكشف عقارات' : 'Property Explorer'
  }

  // Member since (created_at)
  const dateStr = p.created_at || p.registered_at || ''
  if (dateStr) {
    try {
      const d = new Date(dateStr)
      if (!isNaN(d.getTime())) {
        user.value.memberSince = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }
    } catch { /* keep empty */ }
  }

  // Preferred area
  const preferredArea = p.preferred_area || p.preferred_district || p.preference?.area || ''
  if (preferredArea) {
    user.value.preferredArea = preferredArea
  }

  // Stats from profile if returned (respect local storage changes if user modified them)
  if (p.saved_properties_count !== undefined && !localStorage.getItem('vibe_saved_properties')) {
    stats.value.savedProperties = p.saved_properties_count
  } else {
    stats.value.savedProperties = savedPropertiesList.value.length
  }
  if (p.properties_viewed_count !== undefined) stats.value.propertiesViewed = p.properties_viewed_count
  if (p.search_alerts_count !== undefined && !localStorage.getItem('vibe_search_alerts')) {
    stats.value.searchAlerts = p.search_alerts_count
  } else {
    stats.value.searchAlerts = searchAlertsList.value.length
  }
  if (p.inquiries_count !== undefined) stats.value.inquiriesSent = p.inquiries_count

  // Persist to localStorage for current session only (cleared on logout)
  if (fullName) localStorage.setItem('vibe_user_name', fullName)
  if (email) localStorage.setItem('vibe_user_email', email)

  // Keep auth_user synced for Home, Map, Navbar avatars
  try {
    const rawAuth = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    const currentAuth = rawAuth ? JSON.parse(rawAuth) : {}
    const updatedAuth = {
      ...currentAuth,
      name: fullName || currentAuth.name || '',
      email: email || currentAuth.email || '',
      avatar: avatar || currentAuth.avatar || '',
      role: isAgent.value ? 'agent' : (currentAuth.role || 'tenant')
    }
    const serialized = JSON.stringify(updatedAuth)
    localStorage.setItem('auth_user', serialized)
    sessionStorage.setItem('auth_user', serialized)
  } catch { /* ignore parsing errors */ }
}

onMounted(async () => {
  checkAgentRole()
  loadPrivacySettings()
  syncTabFromRoute()

  // Redirect to login if not logged in
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }

  // Fetch real data from GET /api/profile (always fresh – no stale localStorage pre-fill)
  profileLoading.value = true
  try {
    const response = await authService.getProfileData()
    applyProfileData(response)
  } catch (err) {
    console.warn('[ProfilePage] /api/profile failed:', err?.message || err)
    // Fallback: try /user endpoint
    try {
      const fallback = await authService.getProfile()
      applyProfileData(fallback)
    } catch (fallbackErr) {
      console.warn('[ProfilePage] /user fallback also failed:', fallbackErr?.message || fallbackErr)
      // Last resort: read from localStorage cache if available
      const storedName = localStorage.getItem('vibe_user_name')
      const storedEmail = localStorage.getItem('vibe_user_email')
      if (storedName) {
        user.value.name = storedName
        editForm.value.name = storedName
        const names = storedName.trim().split(/\s+/)
        user.value.avatarInitials = ((names[0]?.[0] || '') + (names[1]?.[0] || '')).toUpperCase() || 'VU'
      }
      if (storedEmail) {
        user.value.email = storedEmail
        editForm.value.email = storedEmail
      }
    }
  } finally {
    profileLoading.value = false
    // Ensure counts reflect active items
    stats.value.savedProperties = savedPropertiesList.value.length
    stats.value.searchAlerts = searchAlertsList.value.length
    // Sync recentlyViewed saved states with savedPropertiesList
    recentlyViewed.value.forEach(p => {
      p.saved = savedPropertiesList.value.some(sp => sp.id === p.id || sp.title === p.title)
    })
  }

  // Load Search Alerts from Backend API
  try {
    if (authService.isAuthenticated()) {
      const alertsRes = await authService.getSearchAlerts(1, 12)
      const rawAlerts = alertsRes?.data?.data || alertsRes?.data?.alerts || alertsRes?.data || alertsRes
      if (Array.isArray(rawAlerts) && rawAlerts.length > 0) {
        searchAlertsList.value = rawAlerts.map((a, idx) => ({
          id: a.id || idx + 1,
          name: a.search_name || a.name || 'Dubai Property Alert',
          status: a.is_active !== false ? 'Active' : 'Paused',
          details: a.query_parameters ? (typeof a.query_parameters === 'object' ? Object.entries(a.query_parameters).map(([k,v]) => `${k}: ${v}`).join(' • ') : String(a.query_parameters)) : (a.details || 'Instant Email')
        }))
      }
    }
  } catch (alertErr) {
    console.warn('[ProfilePage] /profile/search-alerts note:', alertErr?.message)
  }

  // Load Two-Factor Authentication Status from Backend API
  await load2FAStatus()
})

// Preferences Saving Handler
const isSavingPreferences = ref(false)
const saveUserPreferences = async () => {
  isSavingPreferences.value = true
  try {
    const typeMap = { 'Apartments': 1, 'Villas': 2, 'Penthouses': 3, 'Townhouses': 4 }
    const typeIds = (preferences.value.propertyTypes || []).map(t => typeMap[t] || 1)

    const payload = {
      preferred_area: user.value.preferredArea || 'Dubai Marina',
      property_types: typeIds.length ? typeIds : [1, 2],
      min_price: Number(preferences.value.priceRangeMin) || 500000,
      max_price: Number(preferences.value.priceRangeMax) || 3000000,
      min_bedrooms: 1,
      max_bedrooms: 4,
      lifestyle_preferences: ['family_friendly', 'waterfront'],
      email_notifications: true,
      browser_notifications: true
    }

    await authService.updatePreferences(payload)
    localStorage.setItem('vibe_user_preferences', JSON.stringify(preferences.value))
    showToast(isRtl.value ? 'تم حفظ التفضيلات بنجاح في قاعدة البيانات!' : 'Preferences saved successfully!')
  } catch (err) {
    console.warn('[ProfilePage] updatePreferences note:', err?.message)
    localStorage.setItem('vibe_user_preferences', JSON.stringify(preferences.value))
    showToast(isRtl.value ? 'تم حفظ التفضيلات بنجاح' : 'Preferences saved successfully!')
  } finally {
    isSavingPreferences.value = false
  }
}

// Toggle save property
const toggleSaveProperty = (item) => {
  const isSaved = favoritesService.toggleSave(item)
  if (isSaved) {
    showToast(`Saved "${item.title || 'Property'}" to favorites ❤️`)
  } else {
    showToast(`Removed "${item.title || 'Property'}" from favorites.`)
  }
}

const isSaving = ref(false)
const isUploadingPhoto = ref(false)
const saveErrorMessage = ref('')
const selectedPhotoFile = ref(null)

// Photo upload handler
const triggerPhotoUpload = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = async (e) => {
  const file = e.target.files?.[0]
  if (e.target) e.target.value = ''
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    showToast('Image file must be less than 5MB.', 'error')
    return
  }

  selectedPhotoFile.value = file

  // 1. Immediately preview and persist locally
  const reader = new FileReader()
  reader.onload = async (event) => {
    const dataUrl = event.target.result
    user.value.avatarUrl = dataUrl
    localStorage.setItem('vibe_user_avatar', dataUrl)

    try {
      const rawAuth = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
      const currentAuth = rawAuth ? JSON.parse(rawAuth) : {}
      const updatedAuth = { ...currentAuth, avatar: dataUrl }
      const serialized = JSON.stringify(updatedAuth)
      localStorage.setItem('auth_user', serialized)
      sessionStorage.setItem('auth_user', serialized)
    } catch { /* ignore */ }

    // 2. Upload to backend
    isUploadingPhoto.value = true
    try {
      const res = await authService.uploadAvatar(file)
      const serverAvatar =
        res?.avatar_url ||
        res?.avatar ||
        res?.photo_url ||
        res?.photo ||
        res?.image ||
        res?.data?.avatar ||
        res?.data?.photo ||
        res?.data?.avatar_url ||
        res?.user?.avatar ||
        res?.user?.photo

      if (serverAvatar && typeof serverAvatar === 'string' && (serverAvatar.startsWith('http') || serverAvatar.startsWith('/'))) {
        user.value.avatarUrl = serverAvatar
        localStorage.setItem('vibe_user_avatar', serverAvatar)
      }
      showToast('Profile photo updated successfully!')
    } catch (err) {
      console.warn('[ProfilePage] Server avatar upload note:', err?.message || err)
      showToast('Profile photo updated!')
    } finally {
      isUploadingPhoto.value = false
    }
  }
  reader.readAsDataURL(file)
}

// Save profile form
const saveProfileChanges = async () => {
  if (isSaving.value) return
  isSaving.value = true
  saveErrorMessage.value = ''

  const nameVal = editForm.value.name.trim()
  const nameParts = nameVal.split(/\s+/)
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || nameParts[0] || ''

  const cityVal = editForm.value.location ? editForm.value.location.split(',')[0].trim() : ''
  const countryVal = editForm.value.location && editForm.value.location.includes(',') ? editForm.value.location.split(',')[1].trim() : 'UAE'

  const basePayload = {
    name: nameVal,
    full_name: nameVal,
    first_name: firstName,
    last_name: lastName,
    email: editForm.value.email.trim(),
    phone: editForm.value.phone?.trim() || '',
    phone_number: editForm.value.phone?.trim() || '',
    location: editForm.value.location || '',
    city: cityVal,
    country: countryVal,
    bio: editForm.value.bio?.trim() || ''
  }

  // ── 1. Optimistic update: apply changes locally immediately ──────────────
  user.value.name = nameVal
  user.value.email = editForm.value.email?.trim() || ''
  user.value.phone = editForm.value.phone?.trim() || ''
  user.value.location = editForm.value.location || ''
  user.value.bio = editForm.value.bio?.trim() || ''
  user.value.avatarInitials = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || 'VU'

  localStorage.setItem('vibe_user_name', nameVal)
  localStorage.setItem('vibe_user_email', editForm.value.email?.trim() || '')

  try {
    const rawAuth = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    const currentAuth = rawAuth ? JSON.parse(rawAuth) : {}
    const updatedAuth = {
      ...currentAuth,
      name: nameVal,
      email: editForm.value.email?.trim() || '',
      avatar: user.value.avatarUrl || currentAuth.avatar || ''
    }
    const serialized = JSON.stringify(updatedAuth)
    localStorage.setItem('auth_user', serialized)
    sessionStorage.setItem('auth_user', serialized)
  } catch { /* ignore */ }

  // ── 2. Call the API (best-effort) ────────────────────────────────────────
  try {
    let payload
    if (selectedPhotoFile.value) {
      const formData = new FormData()
      Object.entries(basePayload).forEach(([k, v]) => formData.append(k, v))
      formData.append('photo', selectedPhotoFile.value)
      formData.append('avatar', selectedPhotoFile.value)
      formData.append('image', selectedPhotoFile.value)
      formData.append('_method', 'PUT')
      payload = formData
    } else {
      payload = basePayload
    }

    const response = await authService.updateProfile(payload)

    // If backend returns updated profile object, re-apply server data
    if (response) {
      applyProfileData(response)
    }

    selectedPhotoFile.value = null
    showToast(response?.message || 'Profile updated successfully!')
    switchTab('overview')
  } catch (err) {
    console.error('[ProfilePage] API update failed (local changes still applied):', err)
    // Local changes are already applied above; just notify the user
    const errMsg = err?.message || 'Could not sync with server. Changes saved locally.'
    saveErrorMessage.value = errMsg
    showToast(errMsg, 'error')
    // Still switch to overview so the user can see their local changes
    switchTab('overview')
  } finally {
    isSaving.value = false
  }
}

// Confirm Pro Upgrade
const confirmUpgrade = () => {
  user.value.accountType = 'Pro Member'
  showUpgradeModal.value = false
  showToast('Welcome to VibeLocate AI Pro! Your 7-day trial is active.')
}

// Logout
const handleLogout = async () => {
  await authService.logout()
  showToast('Logged out successfully.')
  router.push('/login')
}

// Home section navigation helper
const navigateToHomeSection = (sectionId) => {
  router.push(`/home#${sectionId}`)
}

// ==================== PASSWORD CHANGE ====================
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const showCurrentPass = ref(false)
const showNewPass = ref(false)
const showConfirmPass = ref(false)
const isSavingPassword = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (!passwordForm.value.currentPassword) {
    passwordError.value = 'Please enter your current password.'
    return
  }
  if (!passwordForm.value.newPassword) {
    passwordError.value = 'Please enter a new password.'
    return
  }
  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'New password must be at least 6 characters.'
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New password confirmation does not match.'
    return
  }

  isSavingPassword.value = true
  try {
    const res = await authService.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    })

    const msg = res?.message || 'Password updated successfully!'
    passwordSuccess.value = msg
    showToast(msg)
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
  } catch (err) {
    console.error('[ProfilePage] changePassword failed:', err)
    let msg = err?.data?.message || err?.message || 'Failed to update password. Please check your current password.'
    if (err?.data?.errors) {
      const errList = Object.values(err.data.errors).flat()
      if (errList.length) msg = errList.join(' ')
    }
    passwordError.value = msg
    showToast(msg, 'error')
  } finally {
    isSavingPassword.value = false
  }
}

// ==================== DELETE ACCOUNT ====================
const showDeleteModal = ref(false)
const deleteConfirmPassword = ref('')
const showDeletePass = ref(false)
const isDeletingAccount = ref(false)
const deleteError = ref('')

const openDeleteModal = () => {
  deleteError.value = ''
  deleteConfirmPassword.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  if (isDeletingAccount.value) return
  showDeleteModal.value = false
  deleteError.value = ''
  deleteConfirmPassword.value = ''
}

const handleDeleteAccount = async () => {
  deleteError.value = ''
  isDeletingAccount.value = true

  try {
    const res = await authService.deleteAccount({
      password: deleteConfirmPassword.value
    })

    showDeleteModal.value = false
    showToast(res?.message || 'Your account has been deleted successfully.')
    router.push('/login')
  } catch (err) {
    console.error('[ProfilePage] deleteAccount failed:', err)
    let msg = err?.data?.message || err?.message || 'Failed to delete account. Please verify your password.'
    if (err?.data?.errors) {
      const errList = Object.values(err.data.errors).flat()
      if (errList.length) msg = errList.join(' ')
    }
    deleteError.value = msg
    showToast(msg, 'error')
  } finally {
    isDeletingAccount.value = false
  }
}

// ==================== TWO-FACTOR AUTHENTICATION (2FA) ====================
const is2faEnabled = ref(false)
const isLoading2fa = ref(false)
const show2faModal = ref(false)
const twoFactorSecret = ref('')
const twoFactorOtpauthUrl = ref('')
const twoFactorQrCodeUrl = ref('')
const twoFactorCode = ref('')
const twoFactorError = ref('')
const isVerifying2fa = ref(false)
const isDisabling2fa = ref(false)

const load2FAStatus = async () => {
  try {
    const res = await authService.get2FAStatus()
    // Backend format: { success: true, two_factor: { method: null, is_enabled: 0 or 1, verified_at: null } }
    const tf = res?.two_factor || res?.data?.two_factor || res?.data
    if (tf) {
      is2faEnabled.value = Boolean(tf.is_enabled === 1 || tf.is_enabled === true || tf.enabled)
    }
  } catch (e) {
    console.warn('[ProfilePage] 2FA check note:', e?.message || e)
  }
}

const handleStart2FA = async () => {
  twoFactorError.value = ''
  twoFactorCode.value = ''
  isLoading2fa.value = true
  show2faModal.value = true
  try {
    const res = await authService.start2FA()
    // Backend format: { success: true, message: '...', secret: '...', otpauth_url: '...' }
    twoFactorSecret.value = res?.secret || res?.data?.secret || ''
    const url = res?.otpauth_url || res?.data?.otpauth_url || ''
    twoFactorOtpauthUrl.value = url
    if (url) {
      twoFactorQrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`
    }
  } catch (err) {
    console.error('[ProfilePage] start2FA error:', err)
    twoFactorError.value = err?.data?.message || err?.message || (isRtl.value ? 'فشل بدء إعداد التحقق بخطوتين' : 'Failed to start 2FA setup.')
  } finally {
    isLoading2fa.value = false
  }
}

const handleVerify2FA = async () => {
  const code = (twoFactorCode.value || '').trim()
  if (!code || code.length !== 6) {
    twoFactorError.value = isRtl.value ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام.' : 'Please enter the 6-digit verification code.'
    return
  }
  twoFactorError.value = ''
  isVerifying2fa.value = true
  try {
    const res = await authService.verify2FA(code)
    is2faEnabled.value = true
    show2faModal.value = false
    showToast(isRtl.value ? 'تم تفعيل التحقق بخطوتين بنجاح!' : 'Two-Factor Authentication enabled successfully!')
    await load2FAStatus()
  } catch (err) {
    console.error('[ProfilePage] verify2FA error:', err)
    twoFactorError.value = err?.data?.message || err?.message || (isRtl.value ? 'رمز التحقق غير صحيح، يرجى المحاولة مجدداً.' : 'Invalid verification code. Please try again.')
  } finally {
    isVerifying2fa.value = false
  }
}

const handleDisable2FA = async () => {
  const msg = isRtl.value 
    ? 'هل أنت متأكد من رغبتك في تعطيل التحقق بخطوتين؟ سيقل مستوى أمان حسابك.' 
    : 'Are you sure you want to disable Two-Factor Authentication? Your account security will be reduced.'
  if (!confirm(msg)) return

  isDisabling2fa.value = true
  try {
    await authService.disable2FA()
    is2faEnabled.value = false
    showToast(isRtl.value ? 'تم تعطيل التحقق بخطوتين بنجاح.' : 'Two-Factor Authentication has been disabled.')
    await load2FAStatus()
  } catch (err) {
    console.error('[ProfilePage] disable2FA error:', err)
    showToast(err?.data?.message || err?.message || (isRtl.value ? 'فشل تعطيل التحقق بخطوتين' : 'Failed to disable 2FA'), 'error')
  } finally {
    isDisabling2fa.value = false
  }
}

const copySecretKey = async () => {
  if (!twoFactorSecret.value) return
  try {
    await navigator.clipboard.writeText(twoFactorSecret.value)
    showToast(isRtl.value ? 'تم نسخ المفتاح السري إلى الحافظة' : 'Secret key copied to clipboard')
  } catch {
    showToast(isRtl.value ? 'يرجى نسخ المفتاح يدوياً' : 'Please copy key manually')
  }
}

const close2faModal = () => {
  if (isVerifying2fa.value) return
  show2faModal.value = false
  twoFactorError.value = ''
  twoFactorCode.value = ''
}
</script>

<style scoped>
/* ==================== ROOT CONTAINER ==================== */
.profile-page-root {
  min-height: 100vh;
  background-color: #f4f7fb;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  padding-bottom: 60px;
  --profile-surface: #ffffff;
  --profile-border: #dce6f1;
  --profile-muted: #64748b;
  --profile-heading: #0f2744;
  --profile-panel: #082946;
  --profile-panel-strong: #06233e;
  --profile-panel-text: #eff8ff;
  --profile-panel-muted: #a8c8de;
  --profile-accent: #0d6efd;
  --profile-cyan: #00bde3;
}

/* ==================== AGENT WELCOME BANNER CARD ==================== */
.agent-welcome-banner-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, rgba(59, 130, 246, 0.16) 100%);
  border: 1px solid rgba(2, 132, 199, 0.35);
  border-radius: 16px;
  padding: 18px 24px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.agent-welcome-banner-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.25);
  border-color: rgba(2, 132, 199, 0.6);
}
.awb-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.awb-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #0284c7;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.awb-title {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--profile-heading, #0f2744);
}
.is-dark .awb-title {
  color: #f1f5f9;
}
.awb-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--profile-muted, #64748b);
}
.is-dark .awb-desc {
  color: #94a3b8;
}
.awb-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  background: #0284c7;
  color: #fff;
  border: none;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease;
}
.awb-action-btn:hover {
  background: #0369a1;
}

/* ==================== SITE HEADER / NAVBAR ==================== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(11, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 0;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-img {
  height: 38px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-title {
  color: #ffffff;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.5px;
}

.brand-accent {
  color: #3b82f6;
}

.brand-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: color 0.2s ease;
}

.nav-item:hover, .nav-item.router-link-active {
  color: #ffffff;
}

.ai-radar-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  color: #34d399;
  font-size: 13px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
  animation: pulseGlow 1.8s infinite ease-in-out;
}

@keyframes pulseGlow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back-home {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1e3a8a;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  padding: 9px 18px;
  border-radius: 24px;
  transition: all 0.2s ease;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-back-home:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.header-user-avatar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.header-user-avatar-btn:hover {
  transform: scale(1.05);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ==================== MAIN CONTAINER ==================== */
.profile-main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
}

/* Header & Breadcrumb */
.profile-page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.bc-link {
  color: #64748b;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.bc-link:hover {
  color: #2563eb;
}

.bc-sep {
  font-size: 10px;
  color: #94a3b8;
}

.bc-current {
  color: #0f172a;
  font-weight: 600;
}

.title-with-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 32px;
  color: #0f172a;
  line-height: 1.1;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  font-size: 15px;
  margin-top: 4px;
}

.btn-header-action {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-header-action:hover {
  background: #1d4ed8;
}

/* Dubai Skyline Header Graphic */
.dubai-skyline-badge {
  text-align: right;
  position: relative;
}

.skyline-svg {
  height: 48px;
  width: auto;
  opacity: 0.8;
}

.script-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1;
}

.dubai-text {
  font-family: 'Outfit', 'Georgia', cursive, serif;
  font-size: 26px;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: -0.5px;
  font-style: italic;
}

.tagline-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #64748b;
  margin-top: 2px;
}

/* ==================== CONTENT GRID ==================== */
.profile-content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 28px;
}

@media (max-width: 992px) {
  .profile-content-grid {
    grid-template-columns: 1fr;
  }
}

/* ==================== LEFT SIDEBAR ==================== */
.profile-sidebar-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  height: fit-content;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-avatar-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.25);
}

.avatar-initials-large {
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 28px;
}

.avatar-img-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 2px 0;
}

.user-email {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 2px 0;
  word-break: break-all;
}

.user-role {
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
  margin: 0 0 12px 0;
}

.user-member-badge {
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #dbeafe;
}

/* User Role Toggle Pill */
.user-role-toggle-pill {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  user-select: none;
}

.role-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.role-badge-tag.is-agent-role {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.role-badge-tag.is-user-role {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.role-badge-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.toggle-hint-sub {
  font-size: 10.5px;
  color: #94a3b8;
  text-decoration: underline;
}

.sidebar-divider {
  height: 1px;
  background-color: #f1f5f9;
  margin: 20px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-tab-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  width: 100%;
}

.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.nav-tab-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

.nav-tab-btn:hover .nav-icon {
  color: #2563eb;
}

.nav-tab-btn.active {
  background: #eff6ff;
  color: #2563eb;
}

.nav-tab-btn.active .nav-icon {
  color: #2563eb;
}

/* =========================================================================
   AGENT TOOLS SIDEBAR SECTION (EXACT ACCORDION DESIGN FROM IMAGE 1)
   ========================================================================= */
.agent-sidebar-section {
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agent-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  background-color: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 13.5px;
  transition: all 0.2s ease;
}

.agent-accordion-header:hover {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.agent-accordion-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-section-icon {
  font-size: 15px;
  color: #2563eb;
}

.agent-chevron-icon {
  font-size: 12px;
  color: #2563eb;
  transition: transform 0.25s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.agent-sub-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-inline-start: 8px;
  margin-top: 4px;
}

.agent-sub-btn {
  font-size: 13.5px;
  padding: 10px 14px;
  border-radius: 10px;
}

.agent-sub-btn .nav-icon {
  color: #3b82f6;
}

.agent-sub-btn:hover {
  background-color: #eff6ff;
  color: #1e40af;
}

.agent-sub-btn:hover .nav-icon {
  color: #2563eb;
}

.agent-sub-btn.active {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 700;
}

.agent-sub-btn.active .nav-icon {
  color: #1d4ed8;
}

.logout-tab-btn {
  color: #ef4444;
  margin-top: 8px;
}

.logout-tab-btn .nav-icon {
  color: #ef4444;
}

.logout-tab-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* ==================== TAB CONTENT CONTAINERS ==================== */
.tab-view-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==================== OVERVIEW: STATS GRID ==================== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2 ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.stat-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.stat-icon-box.bg-blue {
  background: #eff6ff;
  color: #2563eb;
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 26px;
  color: #0f172a;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
  font-weight: 500;
}

.stat-action-link {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ==================== OVERVIEW: DUAL INFO CARDS ==================== */
.info-dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 992px) {
  .info-dual-grid {
    grid-template-columns: 1fr;
  }
}

.info-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.info-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-card-edit {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.btn-card-edit:hover {
  background: #1d4ed8;
}

.btn-card-edit-outline {
  background: transparent;
  color: #2563eb;
  border: 1px solid #cbd5e1;
  padding: 7px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.btn-card-edit-outline:hover {
  background: #f8fafc;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #f1f5f9;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.row-label {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.row-label i {
  width: 16px;
  color: #94a3b8;
}

.row-value {
  color: #0f172a;
  font-weight: 600;
  text-align: right;
}

.val-with-link {
  display: flex;
  align-items: center;
  gap: 10px;
}

.account-badge {
  background: #f1f5f9;
  color: #334155;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.link-upgrade {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 700;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

/* ==================== RECENTLY VIEWED ==================== */
.recently-viewed-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.link-see-all {
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.properties-trio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 992px) {
  .properties-trio-grid {
    grid-template-columns: 1fr;
  }
}

.property-card {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  transition: all 0.2s ease;
}

.property-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.card-media {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.prop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.property-card:hover .prop-img {
  transform: scale(1.04);
}

.badge-time {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(6px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
}

.btn-fav-toggle {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-fav-toggle.faved {
  background: #ef4444;
  color: #ffffff;
}

.card-body {
  padding: 16px;
}

.prop-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prop-location {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.prop-price {
  font-family: 'Outfit', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
}

.prop-specs {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #64748b;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.prop-specs span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ==================== PRO PROMO BANNER ==================== */
.pro-promo-banner {
  background: linear-gradient(135deg, #0b1d3a 0%, #15325b 100%);
  border-radius: 20px;
  padding: 32px;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(11, 29, 58, 0.3);
}

.banner-left {
  max-width: 500px;
  z-index: 2;
}

.banner-title {
  font-family: 'Outfit', sans-serif;
  font-weight: 800;
  font-size: 24px;
  margin: 0 0 8px 0;
}

.banner-subtitle {
  color: #93c5fd;
  font-size: 14px;
  margin-bottom: 20px;
}

.btn-banner-upgrade {
  background: #ffffff;
  color: #0b1d3a;
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-banner-upgrade:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

.banner-right {
  z-index: 2;
}

.banner-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.banner-checklist li {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.banner-checklist i {
  color: #60a5fa;
}

/* ==================== EDIT PROFILE VIEW ==================== */
.edit-profile-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

@media (max-width: 992px) {
  .edit-profile-layout {
    grid-template-columns: 1fr;
  }
}

.form-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #e2e8f0;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.form-control, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-control:focus, .form-select:focus, .form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input-with-flag {
  position: relative;
  display: flex;
  align-items: center;
}

.flag-icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
}

.flag-padded {
  padding-left: 40px;
}

.char-count {
  font-size: 12px;
  color: #94a3b8;
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-save-primary {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-save-primary:hover {
  background: #1d4ed8;
}

.edit-side-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.card-subtitle {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
}

.avatar-large-preview {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #2563eb;
  color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-initials-preview {
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 700;
}

.btn-change-photo {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 8px;
}

.photo-hint {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}

.crown-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fffbe6;
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin: 0 auto 12px auto;
}

.member-pill {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.account-desc {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 16px;
}

.btn-upgrade-pro-full {
  width: 100%;
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}

/* ==================== SAVED PROPERTIES VIEW ==================== */
.saved-filter-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.filter-tab-pill {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #64748b;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.filter-tab-pill.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}

.saved-properties-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1100px) {
  .saved-properties-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .saved-properties-grid {
    grid-template-columns: 1fr;
  }
}

/* ==================== ALERTS VIEW ==================== */
.alerts-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #e2e8f0;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.alert-item-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.alert-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.alert-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge-active {
  background: #dcfce7;
  color: #16a34a;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}

.alert-details {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.alert-actions {
  display: flex;
  gap: 8px;
}

.btn-icon-action {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
}

/* Danger card & Danger Header */
.danger-card {
  border-color: #fca5a5;
  background: #fff8f8;
}

.danger-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-danger-outline {
  background: transparent;
  border: 1.5px solid #ef4444;
  color: #ef4444;
  padding: 9px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-danger-outline:hover {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}

/* Password Input & Eye Toggle */
.password-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrap .form-control {
  padding-right: 44px;
}

.btn-toggle-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.btn-toggle-eye:hover {
  color: #3b82f6;
}

.required-star {
  color: #ef4444;
  font-weight: 700;
}

/* Inline Alerts */
.alert-inline {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.alert-inline.alert-danger {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.alert-inline.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

/* Delete Modal Specifics */
.delete-modal-content {
  max-width: 440px;
}

.modal-danger-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 0 auto 16px auto;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
}

.delete-modal-input-wrap {
  text-align: left;
  margin-top: 16px;
}

.btn-danger-confirm {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  border: none;
  padding: 13px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s ease;
}

.btn-danger-confirm:hover:not(:disabled) {
  opacity: 0.92;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
}

.btn-danger-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ==================== TOAST & MODALS ==================== */
.profile-toast {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  background: #0f172a;
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.toast-icon {
  color: #10b981;
}

.profile-toast--error {
  border-color: rgba(239, 68, 68, 0.4);
  background: #1a0a0a;
}

.profile-toast--error .toast-icon {
  color: #ef4444;
}

.upgrade-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.upgrade-modal-content {
  background: #ffffff;
  border-radius: 24px;
  padding: 36px;
  max-width: 480px;
  width: 100%;
  text-align: center;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.close-modal-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
}

.modal-crown-badge {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 0 auto 16px auto;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.modal-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.pricing-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.price-val {
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #2563eb;
}

.price-period {
  font-size: 14px;
  color: #64748b;
}

.price-hint {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.pro-features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 28px 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pro-features-list li {
  font-size: 14px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pro-features-list i {
  color: #10b981;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-confirm-upgrade {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel-modal {
  background: none;
  border: none;
  color: #64748b;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px;
}

.checkbox-group-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.custom-chk-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0f172a;
  cursor: pointer;
}

/* ==================== SKELETON LOADING ==================== */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton-avatar {
  background: linear-gradient(90deg, #e2e8f0 25%, #f0f6ff 50%, #e2e8f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 50%;
  width: 72px !important;
  height: 72px !important;
  border: none !important;
}
.skeleton-line {
  border-radius: 8px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f0f6ff 50%, #e2e8f0 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
  margin: 6px auto;
}
.skeleton-name { width: 70%; height: 18px; }
.skeleton-email { width: 85%; height: 13px; }
.skeleton-badge { width: 55%; height: 24px; border-radius: 20px; }

/* Error Banner */
.profile-error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Keep the profile area in sync with the selected site theme. */
:global([data-theme="dark"]) .profile-page-root {
  background: #0f172a;
  color: #f8fafc;
  --profile-surface: #1e293b;
  --profile-border: #334155;
  --profile-muted: #94a3b8;
  --profile-heading: #ffffff;
  --profile-panel: #1e293b;
  --profile-panel-strong: #17253a;
  --profile-panel-text: #f8fafc;
  --profile-panel-muted: #94a3b8;
}
:global([data-theme="dark"]) .profile-page-header { border-bottom-color: #334155; }
:global([data-theme="dark"]) .page-title,
:global([data-theme="dark"]) .bc-current,
:global([data-theme="dark"]) .user-name,
:global([data-theme="dark"]) .nav-tab-btn,
:global([data-theme="dark"]) .custom-chk-label { color: #f8fafc; }
:global([data-theme="dark"]) .page-subtitle,
:global([data-theme="dark"]) .bc-link,
:global([data-theme="dark"]) .user-email,
:global([data-theme="dark"]) .user-role { color: #94a3b8; }
:global([data-theme="dark"]) .profile-sidebar-card,
:global([data-theme="dark"]) .tab-view-container,
:global([data-theme="dark"]) .stat-card,
:global([data-theme="dark"]) .profile-section-card { background: #1e293b; border-color: #334155; }
:global([data-theme="dark"]) .sidebar-divider { background: #334155; }
/* =========================================================================
   ACCOUNT SETTINGS SIDEBAR ACCORDION & PRIVACY STYLES
   ========================================================================= */
.settings-sidebar-section {
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.settings-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 16px;
  background-color: transparent;
  color: #64748b;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.settings-accordion-header:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.settings-accordion-header.has-active-child {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 700;
  border-color: #bfdbfe;
}

.settings-accordion-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-section-icon {
  font-size: 16px;
  color: #94a3b8;
  width: 20px;
  text-align: center;
  transition: color 0.2s ease;
}

.settings-accordion-header:hover .settings-section-icon,
.settings-accordion-header.has-active-child .settings-section-icon {
  color: #2563eb;
}

.settings-chevron-icon {
  font-size: 11px;
  color: #94a3b8;
  transition: transform 0.25s ease;
}

.settings-sub-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-inline-start: 10px;
  margin-top: 4px;
  border-inline-start: 2px solid #e2e8f0;
  margin-inline-start: 22px;
}

.settings-sub-btn {
  font-size: 13.5px;
  padding: 9px 12px;
  border-radius: 10px;
}

.settings-sub-btn:hover {
  background-color: #eff6ff;
  color: #1e40af;
}

.settings-sub-btn.active {
  background-color: #dbeafe;
  color: #1d4ed8;
  font-weight: 700;
}

.badge-security-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.security-feature-icon,
.session-device-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.badge-feature-active {
  background: #ecfdf5;
  color: #059669;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #a7f3d0;
}

.badge-feature-inactive {
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
}

.security-feature-icon.icon-active {
  background: #ecfdf5;
  color: #059669;
}

.btn-2fa-action {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid transparent;
}

.btn-2fa-action.btn-enable {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}

.btn-2fa-action.btn-enable:hover:not(:disabled) {
  background: linear-gradient(135deg, #0369a1, #075985);
  transform: translateY(-1px);
}

.btn-2fa-action.btn-disable {
  background: #fff1f2;
  color: #e11d48;
  border-color: #fecdd3;
}

.btn-2fa-action.btn-disable:hover:not(:disabled) {
  background: #ffe4e6;
  border-color: #fda4af;
}

.modal-security-badge {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #eff6ff;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px auto;
}

.session-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.badge-this-device {
  background: #eff6ff;
  color: #2563eb;
  font-size: 11.5px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 16px;
}

/* Privacy Options */
.privacy-option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.privacy-radio-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #ffffff;
}

.privacy-radio-card:hover {
  border-color: #93c5fd;
  background-color: #f8fafc;
}

.privacy-radio-card.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.privacy-radio-card input[type="radio"] {
  margin-top: 4px;
  accent-color: #2563eb;
  cursor: pointer;
}

.radio-card-content {
  flex: 1;
}

.radio-card-title {
  font-weight: 700;
  font-size: 14.5px;
  color: #0f172a;
  margin-bottom: 4px;
}

.radio-card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

.privacy-toggles-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.privacy-toggle-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.switch-toggle {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 24px;
  flex-shrink: 0;
}

.switch-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider-round {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
  border-radius: 24px;
}

.slider-round:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.switch-toggle input:checked + .slider-round {
  background-color: #2563eb;
}

.switch-toggle input:checked + .slider-round:before {
  transform: translateX(22px);
}

.btn-clear-history {
  background: transparent;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear-history:hover {
  background: #fee2e2;
}

.btn-download-data {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-download-data:hover {
  background: #2563eb;
  color: #ffffff;
}

:global([data-theme="dark"]) .settings-accordion-header { color: #94a3b8; }
:global([data-theme="dark"]) .settings-accordion-header:hover { background-color: #1e293b; color: #f8fafc; }
:global([data-theme="dark"]) .settings-sub-nav { border-inline-start-color: #334155; }
:global([data-theme="dark"]) .privacy-radio-card { background: #1e293b; border-color: #334155; }
:global([data-theme="dark"]) .privacy-radio-card:hover { background: #24344d; }
:global([data-theme="dark"]) .privacy-radio-card.selected { background: #1e3a5f; border-color: #38bdf8; }
:global([data-theme="dark"]) .radio-card-title { color: #ffffff; }
:global([data-theme="dark"]) .radio-card-desc { color: #94a3b8; }
:global([data-theme="dark"]) .privacy-toggle-item,
:global([data-theme="dark"]) .session-card-row { background: #1e293b; border-color: #334155; }
:global([data-theme="dark"]) .security-feature-icon,
:global([data-theme="dark"]) .session-device-icon { background: #24344d; }
</style>
