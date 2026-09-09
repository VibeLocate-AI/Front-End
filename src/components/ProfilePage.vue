<template>
  <div class="profile-page-root">
    <!-- Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="toastVisible" class="profile-toast">
        <i class="fa-solid fa-circle-check toast-icon"></i>
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

    <!-- ==================== HEADER / NAVBAR ==================== -->
    <header class="site-header">
      <div class="header-inner">
        <!-- Logo -->
        <RouterLink class="brand" to="/home">
          <div class="brand-logo-wrap">
            <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img">
            <div class="brand-text">
              <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
              <span class="brand-badge">AI</span>
            </div>
          </div>
        </RouterLink>

        <!-- Navigation Links -->
        <nav class="nav-links">
          <RouterLink class="nav-item" to="/home">Home</RouterLink>
          <a class="nav-item" href="/home#map" @click.prevent="navigateToHomeSection('map')">Interactive Map</a>
          <a class="nav-item" href="/home#featured" @click.prevent="navigateToHomeSection('featured')">Featured</a>
          <a class="nav-item" href="/home#districts" @click.prevent="navigateToHomeSection('districts')">Districts</a>
          
          <div class="ai-radar-tag">
            <span class="pulse-dot"></span>
            <span class="radar-text">Live AI Radar: <strong>Active</strong></span>
          </div>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <RouterLink to="/home" class="btn-back-home">
            <i class="fa-solid fa-house"></i>
            <span>Back to Home</span>
          </RouterLink>

          <button class="header-user-avatar-btn" title="Your Account" @click="switchTab('overview')">
            <span v-if="!user.avatarUrl" class="avatar-initials">{{ user.avatarInitials }}</span>
            <img v-else :src="user.avatarUrl" :alt="user.name" class="avatar-img">
          </button>
        </div>
      </div>
    </header>

    <!-- ==================== MAIN CONTENT WRAPPER ==================== -->
    <main class="profile-main-container">
      <div class="container-inner">
        
        <!-- Top Sub-Header & Breadcrumb Bar -->
        <div class="profile-page-header">
          <div class="header-titles">
            <div class="breadcrumb-trail">
              <RouterLink to="/home" class="bc-link">Home</RouterLink>
              <i class="fa-solid fa-chevron-right bc-sep"></i>
              <span class="bc-link" @click="switchTab('overview')">Profile</span>
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
                <i class="fa-solid fa-compass"></i> Explore Properties
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
              <div class="user-avatar-wrap">
                <span v-if="!user.avatarUrl" class="avatar-initials-large">{{ user.avatarInitials }}</span>
                <img v-else :src="user.avatarUrl" :alt="user.name" class="avatar-img-large">
              </div>

              <h3 class="user-name">{{ user.name }}</h3>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-role">{{ user.role }}</p>

              <div class="user-member-badge">
                Member since {{ user.memberSince }}
              </div>
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
                <span>Overview</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'edit' }"
                @click="switchTab('edit')"
              >
                <i class="fa-solid fa-pen-to-square nav-icon"></i>
                <span>Edit Profile</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'saved' }"
                @click="switchTab('saved')"
              >
                <i class="fa-regular fa-heart nav-icon"></i>
                <span>Saved Properties</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'alerts' }"
                @click="switchTab('alerts')"
              >
                <i class="fa-regular fa-bell nav-icon"></i>
                <span>Search Alerts</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'preferences' }"
                @click="switchTab('preferences')"
              >
                <i class="fa-solid fa-sliders nav-icon"></i>
                <span>My Preferences</span>
              </button>

              <button
                class="nav-tab-btn"
                :class="{ active: activeTab === 'settings' }"
                @click="switchTab('settings')"
              >
                <i class="fa-solid fa-gear nav-icon"></i>
                <span>Account Settings</span>
              </button>

              <button
                class="nav-tab-btn logout-tab-btn"
                @click="handleLogout"
              >
                <i class="fa-solid fa-arrow-right-from-bracket nav-icon"></i>
                <span>Log Out</span>
              </button>
            </nav>
          </aside>

          <!-- RIGHT MAIN PANEL -->
          <div class="profile-main-panel">

            <!-- ==================== TAB 1: OVERVIEW ==================== -->
            <div v-if="activeTab === 'overview'" class="tab-view-container fade-in">
              
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
                      <button type="button" class="btn-cancel" @click="switchTab('overview')">Cancel</button>
                      <button type="submit" class="btn-save-primary">Save Changes</button>
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
                    <button class="btn-change-photo" @click="triggerPhotoUpload">
                      <i class="fa-solid fa-camera"></i> Change Photo
                    </button>
                    <p class="photo-hint">JPG, PNG up to 5MB</p>
                    <input type="file" ref="fileInput" class="d-none" accept="image/*" @change="handlePhotoUpload">
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
                      @click="toggleSaveProperty(prop)"
                      title="Remove from saved"
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
                <h3>No {{ activeSavedTab }} saved yet</h3>
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

                <div class="alerts-list">
                  <div class="alert-item-box">
                    <div class="alert-info">
                      <div class="alert-title-row">
                        <h4 class="alert-name">Dubai Marina 2-Bed Apartments</h4>
                        <span class="status-badge-active">Active</span>
                      </div>
                      <p class="alert-details">AED 1.5M - 3.5M • Instant Email &amp; Push</p>
                    </div>
                    <div class="alert-actions">
                      <button class="btn-icon-action" @click="showToast('Alert preferences updated.')"><i class="fa-solid fa-sliders"></i></button>
                      <button class="btn-icon-action text-danger" @click="showToast('Alert paused.')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>

                  <div class="alert-item-box">
                    <div class="alert-info">
                      <div class="alert-title-row">
                        <h4 class="alert-name">Palm Jumeirah Luxury Villas</h4>
                        <span class="status-badge-active">Active</span>
                      </div>
                      <p class="alert-details">AED 15M+ • Daily Summary</p>
                    </div>
                    <div class="alert-actions">
                      <button class="btn-icon-action" @click="showToast('Alert preferences updated.')"><i class="fa-solid fa-sliders"></i></button>
                      <button class="btn-icon-action text-danger" @click="showToast('Alert paused.')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>

                  <div class="alert-item-box">
                    <div class="alert-info">
                      <div class="alert-title-row">
                        <h4 class="alert-name">Downtown Dubai Penthouses</h4>
                        <span class="status-badge-active">Active</span>
                      </div>
                      <p class="alert-details">AED 8M - 20M • Instant Email</p>
                    </div>
                    <div class="alert-actions">
                      <button class="btn-icon-action" @click="showToast('Alert preferences updated.')"><i class="fa-solid fa-sliders"></i></button>
                      <button class="btn-icon-action text-danger" @click="showToast('Alert paused.')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ==================== TAB 5: MY PREFERENCES ==================== -->
            <div v-else-if="activeTab === 'preferences'" class="tab-view-container fade-in">
              <div class="form-card">
                <h3 class="card-title mb-4">AI Search Preferences</h3>
                <form @submit.prevent="showToast('Preferences saved successfully!')">
                  <div class="form-group mb-4">
                    <label class="form-label">Preferred Property Types</label>
                    <div class="checkbox-group-grid">
                      <label v-for="t in ['Apartments', 'Villas', 'Penthouses', 'Townhouses']" :key="t" class="custom-chk-label">
                        <input type="checkbox" :value="t" v-model="preferences.propertyTypes">
                        <span>{{ t }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group mb-4">
                    <label class="form-label">Price Range (AED)</label>
                    <div class="row g-2">
                      <div class="col-6">
                        <input type="number" v-model.number="preferences.priceRangeMin" class="form-control" placeholder="Min Price">
                      </div>
                      <div class="col-6">
                        <input type="number" v-model.number="preferences.priceRangeMax" class="form-control" placeholder="Max Price">
                      </div>
                    </div>
                  </div>

                  <div class="form-group mb-4">
                    <label class="form-label">Bedrooms</label>
                    <select v-model="preferences.bedrooms" class="form-select">
                      <option value="Studio">Studio</option>
                      <option value="1 Bedroom">1 Bedroom</option>
                      <option value="2 - 4 Bedrooms">2 - 4 Bedrooms</option>
                      <option value="5+ Bedrooms">5+ Bedrooms</option>
                    </select>
                  </div>

                  <div class="form-actions">
                    <button type="submit" class="btn-save-primary">Save Preferences</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- ==================== TAB 6: ACCOUNT SETTINGS ==================== -->
            <div v-else-if="activeTab === 'settings'" class="tab-view-container fade-in">
              <div class="form-card mb-4">
                <h3 class="card-title mb-4">Security &amp; Password</h3>
                <form @submit.prevent="showToast('Password updated securely.')">
                  <div class="form-group mb-3">
                    <label class="form-label">Current Password</label>
                    <input type="password" class="form-control" placeholder="••••••••">
                  </div>
                  <div class="form-group mb-3">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-control" placeholder="New password">
                  </div>
                  <div class="form-group mb-4">
                    <label class="form-label">Confirm New Password</label>
                    <input type="password" class="form-control" placeholder="Confirm new password">
                  </div>
                  <button type="submit" class="btn-save-primary">Update Password</button>
                </form>
              </div>

              <div class="form-card danger-card">
                <h3 class="card-title text-danger mb-2">Danger Zone</h3>
                <p class="text-muted mb-3">Permanently remove your profile, saved properties, and alerts.</p>
                <button class="btn-danger-outline" @click="showToast('Please contact support to delete account.')">
                  Delete Account
                </button>
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

const route = useRoute()
const router = useRouter()

// Tabs state
const activeTab = ref('overview')
const showUpgradeModal = ref(false)
const fileInput = ref(null)

// Toast state
const toastMessage = ref('')
const toastVisible = ref(false)
let toastTimer = null

const showToast = (msg) => {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 3500)
}

// User state
const user = ref({
  name: 'Anas User',
  email: 'anas.user@example.com',
  phone: '+971 50 123 4567',
  location: 'Dubai, UAE',
  preferredArea: 'Downtown Dubai, Dubai Marina',
  accountType: 'Free Member',
  role: 'Property Explorer',
  memberSince: 'Aug 2026',
  bio: 'Real estate enthusiast exploring the best properties in Dubai.',
  avatarInitials: 'VU',
  avatarUrl: ''
})

// Form state for editing
const editForm = ref({
  name: 'Anas User',
  email: 'anas.user@example.com',
  phone: '+971 50 123 4567',
  location: 'Dubai, UAE',
  bio: 'Real estate enthusiast exploring the best properties in Dubai.'
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
const stats = ref({
  savedProperties: 12,
  propertiesViewed: 48,
  searchAlerts: 3,
  inquiriesSent: 2
})

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

const savedPropertiesList = ref([
  {
    id: 1,
    title: 'The Royal Atlantis Sky Villa',
    location: 'Palm Jumeirah',
    price: 'AED 18,500,000',
    beds: 4,
    baths: 5,
    sqft: '5,420',
    type: 'Villas',
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
    type: 'Penthouses',
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
    type: 'Apartments',
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    saved: true
  },
  {
    id: 4,
    title: 'Address Beach Resort Apartment',
    location: 'JBR',
    price: 'AED 3,200,000',
    beds: 2,
    baths: 3,
    sqft: '1,350',
    type: 'Apartments',
    image: '/images/photo-1582719478250-c89cae4dc85b.avif',
    saved: true
  },
  {
    id: 5,
    title: 'Dubai Hills Family Villa',
    location: 'Dubai Hills Estate',
    price: 'AED 7,900,000',
    beds: 5,
    baths: 6,
    sqft: '4,100',
    type: 'Villas',
    image: '/images/photo-1613977257363-707ba9348227.jfif',
    saved: true
  },
  {
    id: 6,
    title: 'Creek Harbour View Apartment',
    location: 'Dubai Creek Harbour',
    price: 'AED 2,950,000',
    beds: 2,
    baths: 2,
    sqft: '1,240',
    type: 'Apartments',
    image: '/images/photo-1600210492486-724fe5c67fb0.jfif',
    saved: true
  },
  {
    id: 7,
    title: 'Emirates Hills Mansion',
    location: 'Emirates Hills',
    price: 'AED 45,000,000',
    beds: 6,
    baths: 8,
    sqft: '12,500',
    type: 'Villas',
    image: '/images/photo-1600585154340-be6161a56a0c.avif',
    saved: true
  },
  {
    id: 8,
    title: 'One Zaabeel Sky Penthouse',
    location: 'Zaabeel',
    price: 'AED 24,000,000',
    beds: 4,
    baths: 5,
    sqft: '4,800',
    type: 'Penthouses',
    image: '/images/photo-1618221195710-dd6b41faaea6.jfif',
    saved: true
  },
  {
    id: 9,
    title: 'District One Modern Townhouse',
    location: 'Mohammed Bin Rashid City',
    price: 'AED 5,600,000',
    beds: 3,
    baths: 4,
    sqft: '3,100',
    type: 'Townhouses',
    image: '/images/photo-1512917774080-9991f1c4c750 (1).jfif',
    saved: true
  },
  {
    id: 10,
    title: 'Downtown Vista Apartment',
    location: 'Downtown Dubai',
    price: 'AED 3,800,000',
    beds: 2,
    baths: 2,
    sqft: '1,420',
    type: 'Apartments',
    image: '/images/photo-1545324418-cc1a3fa10c00.avif',
    saved: true
  },
  {
    id: 11,
    title: 'Palm Jumeirah Signature Villa',
    location: 'Palm Jumeirah',
    price: 'AED 32,000,000',
    beds: 5,
    baths: 6,
    sqft: '8,200',
    type: 'Villas',
    image: '/images/photo-1600596542815-ffad4c1539a9.jfif',
    saved: true
  },
  {
    id: 12,
    title: 'Bluewaters Island Luxury Residence',
    location: 'Bluewaters Island',
    price: 'AED 4,900,000',
    beds: 3,
    baths: 3,
    sqft: '2,100',
    type: 'Apartments',
    image: '/images/photo-1582719478250-c89cae4dc85b.avif',
    saved: true
  }
])

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

// Tab titles and descriptions
const tabTitles = {
  overview: 'My Profile',
  edit: 'Edit Profile',
  saved: 'Saved Properties',
  alerts: 'Search Alerts',
  preferences: 'My Preferences',
  settings: 'Account Settings'
}

const tabSubtitles = {
  overview: 'Manage your account, preferences, and saved properties',
  edit: 'Keep your information up to date',
  saved: 'Your favorite properties, all in one place',
  alerts: 'Manage your real-time property notifications',
  preferences: 'Customize your property search AI criteria',
  settings: 'Manage security and account preferences'
}

const tabTitle = computed(() => tabTitles[activeTab.value] || 'My Profile')
const tabSubtitle = computed(() => tabSubtitles[activeTab.value] || '')

// Switch tab method with route sync
const switchTab = (tabName) => {
  activeTab.value = tabName
  if (tabName === 'overview') {
    router.push('/profile')
  } else {
    router.push(`/profile/${tabName}`)
  }
}

// Sync route tab parameter
const syncTabFromRoute = () => {
  const path = route.path
  if (path.includes('/edit')) {
    activeTab.value = 'edit'
  } else if (path.includes('/saved')) {
    activeTab.value = 'saved'
  } else if (path.includes('/alerts')) {
    activeTab.value = 'alerts'
  } else if (path.includes('/preferences')) {
    activeTab.value = 'preferences'
  } else if (path.includes('/settings')) {
    activeTab.value = 'settings'
  } else if (route.query.tab) {
    activeTab.value = route.query.tab
  } else {
    activeTab.value = 'overview'
  }
}

watch(() => route.path, syncTabFromRoute)
watch(() => route.query.tab, syncTabFromRoute)

onMounted(() => {
  syncTabFromRoute()
  
  // Try loading real user info if saved in localStorage
  const storedName = localStorage.getItem('vibe_user_name')
  const storedEmail = localStorage.getItem('vibe_user_email')
  if (storedName) {
    user.value.name = storedName
    editForm.value.name = storedName
    const names = storedName.split(' ')
    user.value.avatarInitials = (names[0]?.[0] || '') + (names[1]?.[0] || '')
  }
  if (storedEmail) {
    user.value.email = storedEmail
    editForm.value.email = storedEmail
  }
})

// Toggle save property
const toggleSaveProperty = (item) => {
  item.saved = !item.saved
  if (item.saved) {
    showToast(`Saved "${item.title}" to favorites.`)
  } else {
    showToast(`Removed "${item.title}" from favorites.`)
  }
  // Keep counts in sync
  stats.value.savedProperties = savedPropertiesList.value.filter(p => p.saved).length
}

// Photo upload simulation
const triggerPhotoUpload = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      user.value.avatarUrl = event.target.result
      showToast('Profile photo updated successfully!')
    }
    reader.readAsDataURL(file)
  }
}

// Save profile form
const saveProfileChanges = () => {
  user.value.name = editForm.value.name
  user.value.email = editForm.value.email
  user.value.phone = editForm.value.phone
  user.value.location = editForm.value.location
  user.value.bio = editForm.value.bio

  const names = editForm.value.name.split(' ')
  user.value.avatarInitials = ((names[0]?.[0] || '') + (names[1]?.[0] || '')).toUpperCase() || 'VU'

  localStorage.setItem('vibe_user_name', editForm.value.name)
  localStorage.setItem('vibe_user_email', editForm.value.email)

  showToast('Profile updated successfully!')
  switchTab('overview')
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

/* Danger card */
.danger-card {
  border-color: #fca5a5;
}

.btn-danger-outline {
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
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
</style>
