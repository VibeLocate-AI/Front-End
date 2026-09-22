<template>
  <div class="add-property-page-root">
    <!-- Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="toastVisible" class="toast-notification" :class="`toast--${toastType}`">
        <i :class="toastType === 'error' ? 'fa-solid fa-circle-exclamation toast-icon' : 'fa-solid fa-circle-check toast-icon'"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- ==================== HEADER / NAVBAR ==================== -->
    <header class="site-header" :class="{ scrolled: isScrolled }">
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

        <!-- Mobile Menu Toggle -->
        <button class="menu-toggle" type="button" aria-label="Toggle navigation" @click="mobileMenuOpen = !mobileMenuOpen">
          <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Navigation Links -->
        <nav class="nav-links" :class="{ open: mobileMenuOpen }">
          <RouterLink class="nav-item" to="/home" @click="mobileMenuOpen = false">{{ t('home') }}</RouterLink>
          <RouterLink class="nav-item" to="/map" @click="mobileMenuOpen = false">
            {{ t('interactiveMap') }} <i class="fa-solid fa-map-location-dot map-nav-icon"></i>
          </RouterLink>
          <RouterLink class="nav-item" to="/buy" @click="mobileMenuOpen = false">{{ t('buy') }}</RouterLink>
          <RouterLink class="nav-item" to="/rent" @click="mobileMenuOpen = false">{{ t('rent') }}</RouterLink>
          <RouterLink class="nav-item" to="/profile/saved" @click="mobileMenuOpen = false">{{ t('savedProperties') }}</RouterLink>
        </nav>

        <!-- Header Actions -->
        <div class="header-actions">
          <!-- Interactive Language Switcher & Theme Toggle Buttons -->
          <NavbarControls />

          <!-- Favorites heart -->
          <button class="icon-action-btn" type="button" aria-label="Favorites" @click="showToast('You have ' + favorites.size + ' saved properties.')"> 
            <i class="fa-regular fa-heart"></i>
          </button>

          <!-- Profile dropdown -->
          <div class="user-profile-menu-container" ref="profileDropdownRef">
            <div class="user-profile-menu" @click="toggleProfileMenu">
              <img
                class="header-avatar"
                :src="userAvatarUrl"
                :alt="user.name || 'User'"
                @error="onAvatarError"
              >
              <i class="fa-solid fa-chevron-down profile-arrow" :class="{ 'rotate-180': profileMenuOpen }"></i>
            </div>

            <!-- Interactive User Profile Dropdown -->
            <div v-if="profileMenuOpen" class="profile-dropdown-box">
              <div class="dropdown-user-header">
                <img
                  class="dropdown-avatar"
                  :src="userAvatarUrl"
                  :alt="user.name || 'User'"
                  @error="onAvatarError"
                >
                <div class="dropdown-user-info">
                  <strong class="dropdown-user-name">{{ displayName }}</strong>
                  <span class="dropdown-user-email">{{ displayEmail }}</span>
                  <span class="dropdown-user-badge">
                    <i class="fa-solid fa-circle-check"></i> {{ isLoggedIn ? 'Verified Member' : 'Guest Account' }}
                  </span>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-menu-list">
                <button class="dropdown-menu-item" @click="$router.push('/profile'); profileMenuOpen = false">
                  <i class="fa-regular fa-user"></i>
                  <span>My Profile</span>
                </button>
                <button class="dropdown-menu-item" @click="$router.push('/profile/saved'); profileMenuOpen = false">
                  <i class="fa-regular fa-heart"></i>
                  <span>Saved Properties ({{ favorites.size }})</span>
                </button>
                <button class="dropdown-menu-item active-item" @click="profileMenuOpen = false">
                  <i class="fa-solid fa-plus"></i>
                  <span>Add New Property</span>
                </button>
              </div>

              <div class="dropdown-divider"></div>

              <div class="dropdown-footer-actions">
                <button v-if="isLoggedIn" class="dropdown-logout-btn" @click="handleLogout">
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Log Out</span>
                </button>
                <div v-else class="dropdown-guest-actions">
                  <button class="dropdown-login-btn" @click="$router.push('/login')">Log In</button>
                  <button class="dropdown-signup-btn" @click="$router.push('/register')">Sign Up</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- ==================== MAIN CONTAINER ==================== -->
    <main class="page-container">
      <div class="container-inner">
        
        <!-- Top Breadcrumbs & Titles -->
        <div class="page-top-header">
          <div class="breadcrumb-trail">
            <RouterLink to="/home" class="bc-link">Home</RouterLink>
            <i class="fa-solid fa-chevron-right bc-sep"></i>
            <span class="bc-current">Add Property</span>
          </div>

          <div class="title-row">
            <div>
              <h1 class="page-title">
                Add New Property
              </h1>
              <p class="page-subtitle">
                Smart multi-step listing wizard — publish your property across Dubai's top communities with instant AI analytics and live preview.
              </p>
            </div>

            <div class="header-badge-box">
              <span class="badge-status-dot"></span>
              <span>Dubai Real Estate Live Network</span>
            </div>
          </div>
        </div>

        <!-- ==================== MULTI-STEP PROGRESS WIZARD BAR ==================== -->
        <div class="wizard-stepper-container">
          <div class="wizard-stepper-track">
            <div class="wizard-progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>

          <div class="wizard-steps-list">
            <div
              v-for="step in steps"
              :key="step.num"
              class="wizard-step-node"
              :class="{
                'is-active': currentStep === step.num,
                'is-completed': currentStep > step.num,
                'is-disabled': currentStep < step.num
              }"
              @click="goToStep(step.num)"
            >
              <div class="step-circle">
                <i v-if="currentStep > step.num" class="fa-solid fa-check check-ico"></i>
                <i v-else :class="step.icon"></i>
                <span class="step-number-badge">{{ step.num }}</span>
              </div>
              <div class="step-labels">
                <span class="step-main-title">{{ step.title }}</span>
                <span class="step-sub-title">{{ step.sub }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================== TWO COLUMN SPLIT SCREEN ==================== -->
        <!-- Right: Form Wizard | Left: Sticky Real-time Live Preview -->
        <div class="form-layout-grid">
          
          <!-- RIGHT COLUMN: Multi-step Form Wizard -->
          <div class="form-main-col">
            
            <form @submit.prevent="handleSubmit">
              
              <!-- ==================================================== -->
              <!-- STEP 1: Basic Details (Title, Type, Price, Listing)   -->
              <!-- ==================================================== -->
              <div v-show="currentStep === 1" class="wizard-step-panel">
                <div class="form-section-card glass-panel">
                  <div class="section-card-header">
                    <div class="step-num-pill">Step 1 of 4</div>
                    <div class="section-header-titles">
                      <h2 class="section-title">
                        <i class="fa-solid fa-house-chimney header-icon"></i>
                        Basic Details
                      </h2>
                      <p class="section-desc">Specify property title, listing type, property category, and price in AED.</p>
                    </div>
                  </div>

                  <div class="card-body-fields">
                    <!-- Property Title -->
                    <div class="form-group mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label mb-0">
                          Property Title <span class="required-star">*</span>
                        </label>
                        <span class="field-tip">An engaging title boosts buyer inquiries</span>
                      </div>
                      <div class="input-with-icon">
                        <i class="fa-solid fa-heading input-ico"></i>
                        <input
                          v-model="form.title"
                          type="text"
                          class="form-control icon-padded"
                          placeholder="e.g., Luxury Penthouse with Panoramic Marina & Burj Khalifa Views"
                          required
                        >
                      </div>
                      <!-- Quick Title Presets -->
                      <div class="quick-chips-row mt-2">
                        <span class="chips-label">Quick presets:</span>
                        <button
                          type="button"
                          class="quick-text-chip"
                          @click="form.title = 'Luxury Penthouse with Full Sea View'"
                        >
                          Luxury Penthouse
                        </button>
                        <button
                          type="button"
                          class="quick-text-chip"
                          @click="form.title = 'Modern Family Villa with Private Garden & Pool'"
                        >
                          Modern Family Villa
                        </button>
                        <button
                          type="button"
                          class="quick-text-chip"
                          @click="form.title = 'Furnished Investment Studio near Metro'"
                        >
                          Investment Studio
                        </button>
                      </div>
                    </div>

                    <!-- Listing Type (Sale / Rent) - Segmented Chips -->
                    <div class="form-group mb-4">
                      <label class="form-label mb-2">
                        Listing Type <span class="required-star">*</span>
                      </label>
                      <div class="segmented-chips-grid grid-2">
                        <button
                          type="button"
                          class="segmented-chip-btn"
                          :class="{ active: form.listingType === 'sale' }"
                          @click="form.listingType = 'sale'"
                        >
                          <div class="chip-icon-box">
                            <i class="fa-solid fa-tags"></i>
                          </div>
                          <div class="chip-text-wrap">
                            <span class="chip-primary">For Sale</span>
                            <span class="chip-secondary">Buy Property</span>
                          </div>
                          <i class="fa-solid fa-circle-check active-check"></i>
                        </button>

                        <button
                          type="button"
                          class="segmented-chip-btn"
                          :class="{ active: form.listingType === 'rent' }"
                          @click="form.listingType = 'rent'"
                        >
                          <div class="chip-icon-box">
                            <i class="fa-solid fa-key"></i>
                          </div>
                          <div class="chip-text-wrap">
                            <span class="chip-primary">For Rent</span>
                            <span class="chip-secondary">Lease Property</span>
                          </div>
                          <i class="fa-solid fa-circle-check active-check"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Property Type Selection - Segmented Chips with Icons -->
                    <div class="form-group mb-4">
                      <label class="form-label mb-2">
                        Property Type <span class="required-star">*</span>
                      </label>
                      <div class="segmented-chips-grid grid-5">
                        <button
                          v-for="t in propertyTypes"
                          :key="t.value"
                          type="button"
                          class="segmented-chip-btn type-chip"
                          :class="{ active: form.propertyType === t.value }"
                          @click="form.propertyType = t.value"
                        >
                          <div class="chip-icon-box">
                            <i :class="t.icon"></i>
                          </div>
                          <div class="chip-text-wrap">
                            <span class="chip-primary">{{ t.en }}</span>
                          </div>
                          <i class="fa-solid fa-circle-check active-check"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Pricing & Payment Terms -->
                    <div class="pricing-card-box mb-4">
                      <div class="row g-3">
                        <div :class="form.listingType === 'rent' ? 'col-md-7' : 'col-md-12'">
                          <label class="form-label">
                            Price (in AED) <span class="required-star">*</span>
                          </label>
                          <div class="input-with-affix">
                            <span class="affix-text">AED</span>
                            <input
                              v-model.number="form.price"
                              type="number"
                              min="1"
                              class="form-control affix-padded"
                              placeholder="e.g., 2,500,000"
                              required
                            >
                          </div>
                          <span class="field-hint" v-if="form.price">
                            <i class="fa-solid fa-coins text-cyan"></i> {{ formatCurrencyPreview(form.price) }}
                          </span>
                        </div>

                        <!-- Rent Payment Frequency - Segmented Chips -->
                        <div v-if="form.listingType === 'rent'" class="col-md-5">
                          <label class="form-label">
                            Payment Frequency
                          </label>
                          <div class="segmented-pills-row">
                            <button
                              type="button"
                              class="pill-chip-btn"
                              :class="{ active: form.rentFrequency === 'yearly' }"
                              @click="form.rentFrequency = 'yearly'"
                            >
                              <i class="fa-solid fa-calendar-check"></i> Yearly
                            </button>
                            <button
                              type="button"
                              class="pill-chip-btn"
                              :class="{ active: form.rentFrequency === 'monthly' }"
                              @click="form.rentFrequency = 'monthly'"
                            >
                              <i class="fa-solid fa-calendar-day"></i> Monthly
                            </button>
                            <button
                              type="button"
                              class="pill-chip-btn"
                              :class="{ active: form.rentFrequency === 'quarterly' }"
                              @click="form.rentFrequency = 'quarterly'"
                            >
                              <i class="fa-solid fa-clock-rotate-left"></i> Quarterly
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Property Status (Ready vs Off-Plan) - Segmented Chips -->
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label mb-2">
                          Property Status
                        </label>
                        <div class="segmented-chips-grid grid-2">
                          <button
                            type="button"
                            class="segmented-chip-btn"
                            :class="{ active: form.status === 'ready' }"
                            @click="form.status = 'ready'"
                          >
                            <div class="chip-icon-box text-success">
                              <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <div class="chip-text-wrap">
                              <span class="chip-primary">Ready to Move</span>
                              <span class="chip-secondary">Completed</span>
                            </div>
                          </button>

                          <button
                            type="button"
                            class="segmented-chip-btn"
                            :class="{ active: form.status === 'off_plan' }"
                            @click="form.status = 'off_plan'"
                          >
                            <div class="chip-icon-box text-warning">
                              <i class="fa-solid fa-helmet-safety"></i>
                            </div>
                            <div class="chip-text-wrap">
                              <span class="chip-primary">Off-Plan</span>
                              <span class="chip-secondary">Under Construction</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      <div class="col-md-6" v-if="form.status === 'off_plan'">
                        <label class="form-label">
                          Expected Handover Date
                        </label>
                        <div class="input-with-icon">
                          <i class="fa-regular fa-calendar input-ico"></i>
                          <input
                            v-model="form.completionDate"
                            type="text"
                            class="form-control icon-padded"
                            placeholder="e.g., Q4 2026 or Dec 2026"
                          >
                        </div>
                      </div>
                    </div>

                  </div>

                  <!-- Wizard Footer Navigation (Step 1) -->
                  <div class="wizard-nav-footer">
                    <div class="footer-left-info">
                      <span class="step-indicator-text">Step 1 of 4 in progress</span>
                    </div>
                    <button
                      type="button"
                      class="btn-wizard-next"
                      @click="nextStep"
                    >
                      <span>Continue to Specs &amp; Location</span>
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ==================================================== -->
              <!-- ==================================================== -->
              <!-- STEP 2: Specs & Location                              -->
              <!-- ==================================================== -->
              <div v-show="currentStep === 2" class="wizard-step-panel">
                <div class="form-section-card glass-panel">
                  <div class="section-card-header">
                    <div class="step-num-pill">Step 2 of 4</div>
                    <div class="section-header-titles">
                      <h2 class="section-title">
                        <i class="fa-solid fa-map-location-dot header-icon"></i>
                        Specs &amp; Location
                      </h2>
                      <p class="section-desc">Specify exact square footage, bedrooms, bathrooms, and pin location on the interactive Dubai map.</p>
                    </div>
                  </div>

                  <div class="card-body-fields">
                    
                    <!-- Size Input & Quick Size Chips -->
                    <div class="form-group mb-4">
                      <label class="form-label">
                        Total Size (sqft) <span class="required-star">*</span>
                      </label>
                      <div class="input-with-affix">
                        <span class="affix-text">sqft</span>
                        <input
                          v-model.number="form.size"
                          type="number"
                          min="50"
                          class="form-control affix-padded"
                          placeholder="e.g., 1,850"
                          required
                        >
                      </div>
                      <!-- Quick Area Chips -->
                      <div class="quick-chips-row mt-2">
                        <span class="chips-label">Common sizes:</span>
                        <button
                          v-for="s in [650, 1100, 1850, 2400, 3500]"
                          :key="s"
                          type="button"
                          class="quick-text-chip"
                          :class="{ active: form.size === s }"
                          @click="form.size = s"
                        >
                          {{ s }} sqft
                        </button>
                      </div>
                    </div>

                    <!-- Bedrooms Segmented Chips -->
                    <div class="form-group mb-4">
                      <label class="form-label mb-2">
                        Bedrooms <span class="required-star">*</span>
                      </label>
                      <div class="segmented-chips-grid grid-7">
                        <button
                          v-for="bed in bedroomOptions"
                          :key="bed.val"
                          type="button"
                          class="segmented-chip-btn compact-chip"
                          :class="{ active: form.bedrooms === bed.val }"
                          @click="form.bedrooms = bed.val"
                        >
                          <span class="chip-primary">{{ bed.en }}</span>
                        </button>
                      </div>
                    </div>

                    <!-- Bathrooms Segmented Chips -->
                    <div class="form-group mb-4">
                      <label class="form-label mb-2">
                        Bathrooms <span class="required-star">*</span>
                      </label>
                      <div class="segmented-chips-grid grid-6">
                        <button
                          v-for="bath in bathroomOptions"
                          :key="bath.val"
                          type="button"
                          class="segmented-chip-btn compact-chip"
                          :class="{ active: form.bathrooms === bath.val }"
                          @click="form.bathrooms = bath.val"
                        >
                          <span class="chip-primary">{{ bath.en }}</span>
                        </button>
                      </div>
                    </div>

                    <!-- Furnishing Status - Segmented Chips -->
                    <div class="form-group mb-4">
                      <label class="form-label mb-2">Furnishing Status</label>
                      <div class="segmented-chips-grid grid-3">
                        <button
                          type="button"
                          class="segmented-chip-btn"
                          :class="{ active: form.furnishing === 'furnished' }"
                          @click="form.furnishing = 'furnished'"
                        >
                          <div class="chip-icon-box">🛋️</div>
                          <div class="chip-text-wrap">
                            <span class="chip-primary">Fully Furnished</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          class="segmented-chip-btn"
                          :class="{ active: form.furnishing === 'semi_furnished' }"
                          @click="form.furnishing = 'semi_furnished'"
                        >
                          <div class="chip-icon-box">🪑</div>
                          <div class="chip-text-wrap">
                            <span class="chip-primary">Semi-Furnished</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          class="segmented-chip-btn"
                          :class="{ active: form.furnishing === 'unfurnished' }"
                          @click="form.furnishing = 'unfurnished'"
                        >
                          <div class="chip-icon-box">📦</div>
                          <div class="chip-text-wrap">
                            <span class="chip-primary">Unfurnished</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- Description -->
                    <div class="form-group mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <label class="form-label mb-0">
                          Property Description <span class="required-star">*</span>
                        </label>
                        <span class="char-counter">{{ form.description.length }}/2000</span>
                      </div>
                      <textarea
                        v-model="form.description"
                        class="form-control form-textarea"
                        rows="4"
                        maxlength="2000"
                        placeholder="Describe unique amenities, panoramic views, quality finishing, and neighborhood highlights..."
                        required
                      ></textarea>
                    </div>

                    <div class="section-divider my-4"></div>

                    <!-- Location Section Header -->
                    <div class="location-sub-header mb-3">
                      <h4 class="sub-header-title">
                        <i class="fa-solid fa-location-crosshairs text-cyan"></i>
                        Location &amp; Interactive Dubai Map
                      </h4>
                      <p class="sub-header-desc">Click anywhere on the map or pick a community to position your pin.</p>
                    </div>

                    <div class="row g-3 mb-3">
                      <!-- Community / District -->
                      <div class="col-md-6">
                        <label class="form-label">
                          Community / District <span class="required-star">*</span>
                        </label>
                        <select v-model="form.district" class="form-select dark-select" @change="onDistrictChange" required>
                          <option value="" disabled>Select Dubai Community...</option>
                          <option v-for="d in districtsList" :key="d.name" :value="d.name">
                            {{ d.name }}
                          </option>
                        </select>
                      </div>

                      <!-- Street Address / Building Name -->
                      <div class="col-md-6">
                        <label class="form-label">
                          Address &amp; Building Name <span class="required-star">*</span>
                        </label>
                        <input
                          v-model="form.address"
                          type="text"
                          class="form-control"
                          placeholder="e.g., Princess Tower, King Salman Bin Abdulaziz Al Saud St"
                          required
                        >
                      </div>
                    </div>

                    <!-- Quick Center Buttons -->
                    <div class="map-presets-bar mb-3">
                      <span class="presets-label"><i class="fa-solid fa-compass"></i> Quick Area Select:</span>
                      <div class="presets-chips-wrap">
                        <button
                          v-for="d in quickDistricts"
                          :key="d.name"
                          type="button"
                          class="btn-preset-chip"
                          :class="{ active: form.district === d.name }"
                          @click="centerMapOn(d.lat, d.lng, d.name)"
                        >
                          {{ d.name }}
                        </button>
                      </div>
                    </div>

                    <!-- Interactive Leaflet Map Picker -->
                    <div class="map-picker-wrapper">
                      <div id="add-prop-map" class="interactive-picker-map"></div>
                      <div class="map-overlay-badge">
                        <i class="fa-solid fa-location-dot pulse-dot-icon"></i>
                        <span>Click the map or drag the marker to pinpoint exact location</span>
                      </div>
                    </div>

                    <!-- Lat / Lng Display -->
                    <div class="coords-display-box mt-3">
                      <div class="coord-pill">
                        <span class="coord-lbl">Lat:</span>
                        <span class="coord-val">{{ form.lat ? form.lat.toFixed(5) : '25.0886' }}</span>
                      </div>
                      <div class="coord-pill">
                        <span class="coord-lbl">Lng:</span>
                        <span class="coord-val">{{ form.lng ? form.lng.toFixed(5) : '55.1465' }}</span>
                      </div>
                      <span class="coords-hint">
                        <i class="fa-solid fa-satellite"></i> Pinned GPS coordinates saved to listing.
                      </span>
                    </div>

                  </div>

                  <!-- Wizard Footer Navigation (Step 2) -->
                  <div class="wizard-nav-footer">
                    <button
                      type="button"
                      class="btn-wizard-back"
                      @click="prevStep"
                    >
                      <i class="fa-solid fa-arrow-left"></i>
                      <span>Back to Basic Details</span>
                    </button>
                    <button
                      type="button"
                      class="btn-wizard-next"
                      @click="nextStep"
                    >
                      <span>Continue to Features &amp; Media</span>
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ==================================================== -->
              <!-- STEP 3: Features & Media                              -->
              <!-- ==================================================== -->
              <div v-show="currentStep === 3" class="wizard-step-panel">
                <div class="form-section-card glass-panel">
                  <div class="section-card-header">
                    <div class="step-num-pill">Step 3 of 4</div>
                    <div class="section-header-titles">
                      <h2 class="section-title">
                        <i class="fa-solid fa-photo-film header-icon"></i>
                        Features &amp; Media
                      </h2>
                      <p class="section-desc">Select available amenities and upload high-resolution photos to maximize your listing's reach.</p>
                    </div>
                  </div>

                  <div class="card-body-fields">
                    
                    <!-- Amenities & Features Grid -->
                    <div class="form-group mb-5">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <label class="form-label mb-0">
                          Amenities &amp; Features
                        </label>
                        <span class="badge-amenities-count">{{ form.amenities.length }} selected</span>
                      </div>

                      <div class="amenities-checkbox-grid">
                        <label
                          v-for="amenity in availableAmenities"
                          :key="amenity.id"
                          class="amenity-checkbox-card"
                          :class="{ checked: form.amenities.includes(amenity.id) }"
                        >
                          <input
                            type="checkbox"
                            :value="amenity.id"
                            v-model="form.amenities"
                            class="hidden-chk"
                          >
                          <div class="amenity-icon-box">
                            <i :class="amenity.icon"></i>
                          </div>
                          <div class="amenity-text">
                            <span class="am-en">{{ amenity.en }}</span>
                          </div>
                          <i class="fa-solid fa-check check-indicator"></i>
                        </label>
                      </div>
                    </div>

                    <div class="section-divider my-4"></div>

                    <!-- Cover Image Upload -->
                    <div class="form-group mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label mb-0">
                          Primary Cover Image <span class="required-star">*</span>
                        </label>
                        <span class="field-tip">Featured on search and map cards</span>
                      </div>

                      <div
                        class="dropzone-box"
                        :class="{ 'has-preview': coverImagePreview }"
                        @click="triggerCoverUpload"
                        @dragover.prevent
                        @drop.prevent="handleCoverDrop"
                      >
                        <div v-if="!coverImagePreview" class="dropzone-placeholder">
                          <div class="drop-icon-circle">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                          </div>
                          <h4>Drag &amp; drop cover photo here</h4>
                          <p>or click to browse from your device (JPG, PNG, WebP up to 10MB)</p>
                          <button type="button" class="btn-browse-file">Browse File</button>
                        </div>
                        <div v-else class="cover-preview-wrap">
                          <img :src="coverImagePreview" alt="Cover Preview" class="cover-img-preview">
                          <div class="cover-actions-overlay">
                            <button type="button" class="btn-change-cover" @click.stop="triggerCoverUpload">
                              <i class="fa-solid fa-camera-rotate"></i> Change
                            </button>
                            <button type="button" class="btn-remove-cover" @click.stop="removeCoverImage">
                              <i class="fa-solid fa-trash-can"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref="coverInput"
                        accept="image/*"
                        style="display: none;"
                        @change="handleCoverFileChange"
                      >
                    </div>

                    <!-- Gallery Images Upload -->
                    <div class="form-group mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <label class="form-label mb-0">Additional Image Gallery</label>
                        <span class="gallery-count-badge">{{ galleryPreviews.length }} photos added</span>
                      </div>

                      <div class="gallery-upload-zone" @click="triggerGalleryUpload">
                        <div class="gallery-zone-icon">
                          <i class="fa-regular fa-images"></i>
                        </div>
                        <div class="gallery-zone-text">
                          <h5>Click to add gallery photos</h5>
                          <span>Select multiple photos at once for the listing walkthrough carousel</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref="galleryInput"
                        accept="image/*"
                        multiple
                        style="display: none;"
                        @change="handleGalleryFileChange"
                      >

                      <!-- Gallery Thumbnails -->
                      <div v-if="galleryPreviews.length > 0" class="gallery-thumbnails-grid mt-3">
                        <div
                          v-for="(img, idx) in galleryPreviews"
                          :key="idx"
                          class="thumb-item"
                        >
                          <img :src="img.url" alt="Gallery thumbnail" class="thumb-img">
                          <button type="button" class="btn-remove-thumb" @click="removeGalleryImage(idx)">
                            <i class="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Video or 3D Tour URL -->
                    <div class="form-group">
                      <label class="form-label">
                        3D Virtual Tour / Video URL
                      </label>
                      <div class="input-with-icon">
                        <i class="fa-solid fa-video input-ico"></i>
                        <input
                          v-model="form.videoUrl"
                          type="url"
                          class="form-control icon-padded"
                          placeholder="https://my.matterport.com/show/... or YouTube URL"
                        >
                      </div>
                      <span class="field-hint">Supports Matterport 3D, YouTube, and Vimeo virtual tour links.</span>
                    </div>

                  </div>

                  <!-- Wizard Footer Navigation (Step 3) -->
                  <div class="wizard-nav-footer">
                    <button
                      type="button"
                      class="btn-wizard-back"
                      @click="prevStep"
                    >
                      <i class="fa-solid fa-arrow-left"></i>
                      <span>Back to Specs &amp; Location</span>
                    </button>
                    <button
                      type="button"
                      class="btn-wizard-next"
                      @click="nextStep"
                    >
                      <span>Continue to Contact &amp; Publish</span>
                      <i class="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- ==================================================== -->
              <!-- STEP 4: Contact & Publish                             -->
              <!-- ==================================================== -->
              <div v-show="currentStep === 4" class="wizard-step-panel">
                <div class="form-section-card glass-panel">
                  <div class="section-card-header">
                    <div class="step-num-pill">Step 4 of 4</div>
                    <div class="section-header-titles">
                      <h2 class="section-title">
                        <i class="fa-solid fa-paper-plane header-icon"></i>
                        Contact &amp; Publish
                      </h2>
                      <p class="section-desc">Information displayed to prospective buyers and tenants for direct agent contact.</p>
                    </div>
                  </div>

                  <div class="card-body-fields">
                    
                    <!-- Agent Fields Grid -->
                    <div class="row g-3 mb-4">
                      <div class="col-md-4">
                        <label class="form-label">
                          Agent / Brokerage Name <span class="required-star">*</span>
                        </label>
                        <div class="input-with-icon">
                          <i class="fa-regular fa-user input-ico"></i>
                          <input
                            v-model="form.agentName"
                            type="text"
                            class="form-control icon-padded"
                            placeholder="Full Name or Agency Name"
                            required
                          >
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">
                          Phone / WhatsApp <span class="required-star">*</span>
                        </label>
                        <div class="input-with-icon">
                          <i class="fa-brands fa-whatsapp input-ico text-success"></i>
                          <input
                            v-model="form.agentPhone"
                            type="tel"
                            class="form-control icon-padded"
                            placeholder="+971 50 123 4567"
                            required
                          >
                        </div>
                      </div>

                      <div class="col-md-4">
                        <label class="form-label">
                          Email Address <span class="required-star">*</span>
                        </label>
                        <div class="input-with-icon">
                          <i class="fa-regular fa-envelope input-ico"></i>
                          <input
                            v-model="form.agentEmail"
                            type="email"
                            class="form-control icon-padded"
                            placeholder="agent@vibelocate.ai"
                            required
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Final Verification Summary Box -->
                    <div class="review-summary-card">
                      <div class="summary-card-header">
                        <i class="fa-solid fa-clipboard-check text-cyan"></i>
                        <span class="summary-title">Listing Review Summary:</span>
                      </div>

                      <div class="summary-grid">
                        <div class="summary-item">
                          <span class="s-label">Title:</span>
                          <span class="s-val">{{ form.title || 'Not specified yet' }}</span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Property Type:</span>
                          <span class="s-val">{{ getPropertyTypeName(form.propertyType) }}</span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Listing Type:</span>
                          <span class="s-val badge-summary-listing" :class="form.listingType">
                            {{ form.listingType === 'sale' ? 'For Sale' : 'For Rent (' + form.rentFrequency + ')' }}
                          </span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Price:</span>
                          <span class="s-val text-cyan font-bold">AED {{ formatNumber(form.price) || '0' }}</span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Location:</span>
                          <span class="s-val">{{ form.district }}, {{ form.address }}</span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Specs:</span>
                          <span class="s-val">{{ form.bedrooms === '0' ? 'Studio' : form.bedrooms + ' Beds' }} • {{ form.bathrooms }} Baths • {{ formatNumber(form.size) }} sqft</span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Media:</span>
                          <span class="s-val">{{ form.amenities.length }} amenities • {{ galleryPreviews.length + (coverImagePreview ? 1 : 0) }} photos</span>
                        </div>
                        <div class="summary-item">
                          <span class="s-label">Listing Agent:</span>
                          <span class="s-val">{{ form.agentName }} ({{ form.agentPhone }})</span>
                        </div>
                      </div>
                    </div>

                    <!-- Publishing Confirmation Box -->
                    <div class="publish-notice-box mt-4">
                      <i class="fa-solid fa-shield-halved notice-icon"></i>
                      <div class="notice-content">
                        <h5>Ready to Launch on VibeLocate AI Network</h5>
                        <p>Upon clicking "Publish Listing", your property will be instantly indexed and synchronized across the AI search engine, interactive map, and saved listings.</p>
                      </div>
                    </div>

                  </div>

                  <!-- Wizard Footer Navigation (Step 4) -->
                  <div class="wizard-nav-footer final-footer">
                    <button
                      type="button"
                      class="btn-wizard-back"
                      @click="prevStep"
                      :disabled="isSubmitting"
                    >
                      <i class="fa-solid fa-arrow-left"></i>
                      <span>Back to Features &amp; Media</span>
                    </button>

                    <div class="final-actions-row">
                      <button
                        type="button"
                        class="btn-draft"
                        @click="saveAsDraft"
                        :disabled="isSubmitting"
                      >
                        <i class="fa-regular fa-bookmark"></i>
                        <span>Save as Draft</span>
                      </button>

                      <button
                        type="submit"
                        class="btn-publish-listing"
                        :disabled="isSubmitting"
                      >
                        <i v-if="isSubmitting" class="fa-solid fa-spinner fa-spin me-2"></i>
                        <i v-else class="fa-solid fa-cloud-arrow-up me-2"></i>
                        <span>{{ isSubmitting ? 'Publishing Listing...' : 'Publish Listing Now' }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </form>

          </div>

          <!-- LEFT COLUMN: Sticky Live Real-time Preview Card -->
          <aside class="form-preview-col">
            <div class="sticky-preview-wrapper">
              
              <!-- Preview Status Header -->
              <div class="preview-header-bar">
                <div class="preview-badge">
                  <span class="live-pulse-dot"></span>
                  <span>Live Sync Preview</span>
                </div>
                <span class="ai-score-pill">
                  <i class="fa-solid fa-wand-magic-sparkles"></i> AI Match: 98%
                </span>
              </div>

              <!-- The Real Property Card Preview -->
              <div class="property-preview-card">
                <div class="card-media-wrap">
                  <img
                    :src="coverImagePreview || '/images/photo-1600596542815-ffad4c1539a9.jfif'"
                    :alt="form.title || 'Property'"
                    class="preview-img"
                  >
                  
                  <!-- Badges on image -->
                  <div class="media-badges">
                    <span class="listing-type-badge" :class="form.listingType">
                      {{ form.listingType === 'sale' ? 'For Sale' : 'For Rent' }}
                    </span>
                    <span v-if="form.status === 'off_plan'" class="status-badge-chip">
                      Off-Plan
                    </span>
                    <span v-else class="status-badge-ready">
                      Ready
                    </span>
                  </div>

                  <div class="media-fav-btn">
                    <i class="fa-solid fa-heart"></i>
                  </div>

                  <div v-if="galleryPreviews.length > 0" class="gallery-counter-pill">
                    <i class="fa-solid fa-camera"></i> {{ galleryPreviews.length + 1 }}
                  </div>
                </div>

                <div class="card-content-wrap">
                  <!-- Price & Type Row -->
                  <div class="preview-price-row">
                    <div class="preview-price-val">
                      AED {{ formatNumber(form.price) || '0' }}
                      <span v-if="form.listingType === 'rent'" class="rent-period">
                        / {{ form.rentFrequency === 'yearly' ? 'Yearly' : form.rentFrequency === 'monthly' ? 'Monthly' : 'Quarterly' }}
                      </span>
                    </div>
                    <span class="prop-type-pill">{{ getPropertyTypeName(form.propertyType) }}</span>
                  </div>

                  <!-- Title -->
                  <h3 class="preview-title">
                    {{ form.title || 'Property title will appear here as you type...' }}
                  </h3>

                  <!-- Location -->
                  <p class="preview-location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ form.district || 'Dubai Marina' }}, {{ form.address || 'Dubai, UAE' }}</span>
                  </p>

                  <!-- Specs Grid -->
                  <div class="preview-specs-grid">
                    <div class="spec-item">
                      <i class="fa-solid fa-bed"></i>
                      <span>{{ form.bedrooms === '0' ? 'Studio' : form.bedrooms + ' Beds' }}</span>
                    </div>
                    <div class="spec-item">
                      <i class="fa-solid fa-bath"></i>
                      <span>{{ form.bathrooms }} Baths</span>
                    </div>
                    <div class="spec-item">
                      <i class="fa-solid fa-ruler-combined"></i>
                      <span>{{ formatNumber(form.size) || '0' }} sqft</span>
                    </div>
                  </div>

                  <!-- Top Amenities Preview -->
                  <div v-if="form.amenities.length > 0" class="preview-amenities-tags">
                    <span
                      v-for="amId in form.amenities.slice(0, 4)"
                      :key="amId"
                      class="amenity-tag"
                    >
                      {{ getAmenityName(amId) }}
                    </span>
                    <span v-if="form.amenities.length > 4" class="amenity-tag-more">
                      +{{ form.amenities.length - 4 }} more
                    </span>
                  </div>

                  <!-- Agent Contact Preview -->
                  <div class="preview-agent-footer">
                    <div class="agent-avatar-circle">
                      <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <div class="agent-info-text">
                      <span class="agent-name-display">{{ form.agentName || 'Licensed Real Estate Agent' }}</span>
                      <span class="agent-phone-display">{{ form.agentPhone || '+971 50 000 0000' }}</span>
                    </div>
                    <div class="agent-actions-preview">
                      <button type="button" class="btn-agent-call" title="Call">
                        <i class="fa-solid fa-phone"></i>
                      </button>
                      <button type="button" class="btn-agent-wa" title="Chat on WhatsApp">
                        <i class="fa-brands fa-whatsapp"></i>
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Tips Box -->
              <div class="preview-tips-box">
                <div class="tip-title">
                  <i class="fa-solid fa-lightbulb text-warning"></i>
                  <span>VibeLocate AI Tips to Maximize Engagement:</span>
                </div>
                <ul class="tips-list">
                  <li>Adding 5+ high-quality real photos increases inquiries by 85%.</li>
                  <li>Pinning accurate map location attracts buyers within 5 km immediately.</li>
                  <li>Comprehensive descriptions achieve a higher AI Match Score on the platform.</li>
                </ul>
              </div>

            </div>
          </aside>

        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import propertyService from '../services/propertyService'
import authService from '../services/authService'
import NavbarControls from './NavbarControls.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { t, isRtl } = useThemeAndLanguage()

const router = useRouter()

// ==================== WIZARD STEPPER STATE ====================
const currentStep = ref(1)

const steps = [
  { num: 1, title: 'Basic Details', sub: 'Step 1 of 4', icon: 'fa-solid fa-house-chimney' },
  { num: 2, title: 'Specs & Location', sub: 'Step 2 of 4', icon: 'fa-solid fa-map-location-dot' },
  { num: 3, title: 'Features & Media', sub: 'Step 3 of 4', icon: 'fa-solid fa-photo-film' },
  { num: 4, title: 'Contact & Publish', sub: 'Step 4 of 4', icon: 'fa-solid fa-paper-plane' }
]

const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / (steps.length - 1)) * 100
})

// Validation for Step Progression
const validateStep = (step) => {
  if (step === 1) {
    if (!form.title.trim()) {
      showToast('Please enter a property title to continue.', 'error')
      return false
    }
    if (!form.price || form.price <= 0) {
      showToast('Please specify a valid property price in AED.', 'error')
      return false
    }
  } else if (step === 2) {
    if (!form.size || form.size <= 0) {
      showToast('Please specify the total area in sqft.', 'error')
      return false
    }
    if (!form.district) {
      showToast('Please select a community or district in Dubai.', 'error')
      return false
    }
    if (!form.address.trim()) {
      showToast('Please enter a detailed address or building name.', 'error')
      return false
    }
  }
  return true
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    if (currentStep.value < 4) {
      currentStep.value++
      window.scrollTo({ top: 140, behavior: 'smooth' })
    }
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 140, behavior: 'smooth' })
  }
}

const goToStep = (stepNum) => {
  if (stepNum < currentStep.value) {
    currentStep.value = stepNum
    window.scrollTo({ top: 140, behavior: 'smooth' })
  } else if (stepNum === currentStep.value + 1 && validateStep(currentStep.value)) {
    currentStep.value = stepNum
    window.scrollTo({ top: 140, behavior: 'smooth' })
  }
}

// ==================== NAVBAR STATE ====================
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)

const user = ref({ name: '', email: '', avatar: '' })

const loadSavedFavorites = () => {
  try {
    const raw = localStorage.getItem('vibe_saved_properties')
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list)) return new Set(list.map(p => p.title))
    }
  } catch (e) { /* ignore */ }
  return new Set()
}

const favorites = ref(loadSavedFavorites())

const isLoggedIn = computed(() => {
  try { return !!(authService.isAuthenticated()) } catch { /* ignore */ }
  return !!(user.value.email || user.value.name)
})

const displayName = computed(() =>
  user.value.name || (user.value.email ? user.value.email.split('@')[0] : 'Guest User')
)

const displayEmail = computed(() => user.value.email || 'guest@vibelocate.ai')

const userAvatarUrl = computed(() => {
  if (user.value.avatar && user.value.avatar.trim() !== '') return user.value.avatar
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`
})

const onAvatarError = (event) => {
  event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=00D2FF&color=070d19&bold=true`
}

const toggleProfileMenu = () => { profileMenuOpen.value = !profileMenuOpen.value }

const handleLogout = async () => {
  profileMenuOpen.value = false
  try { await authService.logout() } catch { /* ignore */ }
  localStorage.removeItem('auth_user')
  sessionStorage.removeItem('auth_user')
  localStorage.removeItem('auth_token')
  sessionStorage.removeItem('auth_token')
  user.value = { name: '', email: '', avatar: '' }
  showToast('Logged out successfully.')
  setTimeout(() => { router.push('/') }, 500)
}

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }

const handleDocumentClick = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    profileMenuOpen.value = false
  }
}

const parseUserData = (raw) => {
  if (!raw) return null
  const profile = raw?.data?.user || raw?.data || raw?.user || raw
  const name = profile.name || profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.username || ''
  const email = profile.email || ''
  const avatar = profile.avatar || profile.profile_photo_url || profile.picture || profile.photo || profile.image || ''
  if (name || email || avatar) return { name, email, avatar }
  return null
}

const loadUserFromStorage = () => {
  const rawLocal = localStorage.getItem('auth_user') || localStorage.getItem('user')
  const rawSession = sessionStorage.getItem('auth_user') || sessionStorage.getItem('user')
  if (rawLocal) {
    try {
      const parsed = parseUserData(JSON.parse(rawLocal))
      if (parsed) user.value = { ...user.value, ...parsed }
    } catch {}
  } else if (rawSession) {
    try {
      const parsed = parseUserData(JSON.parse(rawSession))
      if (parsed) user.value = { ...user.value, ...parsed }
    } catch {}
  }
}

// Toast state
const toastMessage = ref('')
const toastVisible = ref(false)
const toastType = ref('success')
let toastTimer = null

const showToast = (msg, type = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, type === 'error' ? 5000 : 3500)
}

// Form state
const form = reactive({
  title: '',
  listingType: 'sale', // 'sale' | 'rent'
  propertyType: 'apartment', // 'apartment' | 'villa' | 'townhouse' | 'penthouse' | 'office'
  price: 2500000,
  rentFrequency: 'yearly',
  status: 'ready', // 'ready' | 'off_plan'
  completionDate: '',
  size: 1850,
  bedrooms: '2',
  bathrooms: '3',
  furnishing: 'furnished',
  description: '',
  district: 'Dubai Marina',
  address: 'Princess Tower, King Salman Bin Abdulaziz Al Saud St',
  lat: 25.0886,
  lng: 55.1465,
  amenities: ['parking', 'pool', 'gym', 'security', 'balcony', 'central_ac'],
  videoUrl: '',
  agentName: '',
  agentPhone: '',
  agentEmail: ''
})

// File uploads
const coverInput = ref(null)
const galleryInput = ref(null)
const coverFile = ref(null)
const coverImagePreview = ref('')
const galleryFiles = ref([])
const galleryPreviews = ref([])

// Form status
const isSubmitting = ref(false)

// Property types data
const propertyTypes = [
  { value: 'apartment', en: 'Apartment', icon: 'fa-solid fa-building' },
  { value: 'villa', en: 'Villa', icon: 'fa-solid fa-house-chimney-window' },
  { value: 'townhouse', en: 'Townhouse', icon: 'fa-solid fa-cubes-stacked' },
  { value: 'penthouse', en: 'Penthouse', icon: 'fa-solid fa-crown' },
  { value: 'office', en: 'Commercial', icon: 'fa-solid fa-briefcase' }
]

// Bedroom options
const bedroomOptions = [
  { val: '0', label: 'Studio', en: 'Studio' },
  { val: '1', label: '1 Bed', en: '1 Bed' },
  { val: '2', label: '2 Beds', en: '2 Beds' },
  { val: '3', label: '3 Beds', en: '3 Beds' },
  { val: '4', label: '4 Beds', en: '4 Beds' },
  { val: '5', label: '5 Beds', en: '5 Beds' },
  { val: '6', label: '6+ Beds', en: '6+ Beds' }
]

// Bathroom options
const bathroomOptions = [
  { val: '1', label: '1 Bath', en: '1 Bath' },
  { val: '2', label: '2 Baths', en: '2 Baths' },
  { val: '3', label: '3 Baths', en: '3 Baths' },
  { val: '4', label: '4 Baths', en: '4 Baths' },
  { val: '5', label: '5 Baths', en: '5 Baths' },
  { val: '6', label: '6+ Baths', en: '6+ Baths' }
]

// Dubai Districts List
const districtsList = [
  { name: 'Dubai Marina', lat: 25.0886, lng: 55.1465 },
  { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
  { name: 'Palm Jumeirah', lat: 25.1120, lng: 55.1389 },
  { name: 'Business Bay', lat: 25.1889, lng: 55.2662 },
  { name: 'Dubai Hills Estate', lat: 25.1235, lng: 55.2481 },
  { name: 'JBR (Jumeirah Beach Residence)', lat: 25.0800, lng: 55.1340 },
  { name: 'Bluewaters Island', lat: 25.0795, lng: 55.1220 },
  { name: 'Dubai Creek Harbour', lat: 25.1950, lng: 55.3480 },
  { name: 'Arabian Ranches', lat: 25.0560, lng: 55.2810 },
  { name: 'DIFC', lat: 25.2120, lng: 55.2815 },
  { name: 'Jumeirah Village Circle (JVC)', lat: 25.0600, lng: 55.2050 }
]

const quickDistricts = [
  { name: 'Dubai Marina', lat: 25.0886, lng: 55.1465 },
  { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
  { name: 'Palm Jumeirah', lat: 25.1120, lng: 55.1389 },
  { name: 'Dubai Hills Estate', lat: 25.1235, lng: 55.2481 },
  { name: 'Business Bay', lat: 25.1889, lng: 55.2662 },
  { name: 'Dubai Creek Harbour', lat: 25.1950, lng: 55.3480 }
]

// Amenities List
const availableAmenities = [
  { id: 'parking', en: 'Covered Parking', icon: 'fa-solid fa-square-parking' },
  { id: 'pool', en: 'Swimming Pool', icon: 'fa-solid fa-person-swimming' },
  { id: 'gym', en: 'Fitness Gym', icon: 'fa-solid fa-dumbbell' },
  { id: 'security', en: '24/7 Security', icon: 'fa-solid fa-shield-halved' },
  { id: 'balcony', en: 'Balcony / Terrace', icon: 'fa-solid fa-sun' },
  { id: 'pet_friendly', en: 'Pet-Friendly', icon: 'fa-solid fa-paw' },
  { id: 'central_ac', en: 'Central AC', icon: 'fa-solid fa-snowflake' },
  { id: 'sea_view', en: 'Sea / Marina View', icon: 'fa-solid fa-water' },
  { id: 'smart_home', en: 'Smart Home', icon: 'fa-solid fa-microchip' },
  { id: 'concierge', en: 'Concierge', icon: 'fa-solid fa-bell-concierge' },
  { id: 'maids_room', en: 'Maid Room', icon: 'fa-solid fa-door-closed' },
  { id: 'spa_jacuzzi', en: 'Jacuzzi & Spa', icon: 'fa-solid fa-hot-tub-person' }
]

// Helper formatters
const formatNumber = (num) => {
  if (!num) return ''
  return Number(num).toLocaleString()
}

const formatCurrencyPreview = (num) => {
  if (!num) return ''
  return `${Number(num).toLocaleString()} AED`
}

const getPropertyTypeName = (typeVal) => {
  const match = propertyTypes.find(t => t.value === typeVal)
  return match ? match.en : 'Luxury Property'
}

const getAmenityName = (id) => {
  const match = availableAmenities.find(a => a.id === id)
  return match ? match.en : id
}

// Leaflet Map Logic
let mapInstance = null
let markerInstance = null

const loadLeafletScript = () => {
  if (window.L) return Promise.resolve()
  return new Promise((resolve, reject) => {
    // Add CSS
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(css)

    // Add JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initMap = async () => {
  try {
    await loadLeafletScript()
    const L = window.L
    const el = document.getElementById('add-prop-map')
    if (!el || mapInstance) return

    mapInstance = L.map('add-prop-map', {
      center: [form.lat, form.lng],
      zoom: 13,
      zoomControl: true
    })

    // Custom dark luxury tile layer matching the dark theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO'
    }).addTo(mapInstance)

    // Custom pulsing pin icon
    const customIcon = L.divIcon({
      className: 'custom-picker-pin',
      html: `
        <div class="pin-marker-pulse"></div>
        <div class="pin-marker-core">
          <i class="fa-solid fa-house"></i>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 38]
    })

    // Add draggable marker
    markerInstance = L.marker([form.lat, form.lng], {
      draggable: true,
      icon: customIcon
    }).addTo(mapInstance)

    // On marker drag
    markerInstance.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng()
      form.lat = lat
      form.lng = lng
    })

    // On map click
    mapInstance.on('click', (e) => {
      const { lat, lng } = e.latlng
      form.lat = lat
      form.lng = lng
      markerInstance.setLatLng([lat, lng])
    })
  } catch (err) {
    console.warn('[AddPropertyPage] Failed to init Leaflet:', err)
  }
}

const centerMapOn = (lat, lng, districtName) => {
  form.lat = lat
  form.lng = lng
  if (districtName) form.district = districtName
  if (mapInstance && markerInstance) {
    mapInstance.flyTo([lat, lng], 14, { duration: 1.2 })
    markerInstance.setLatLng([lat, lng])
  }
}

const onDistrictChange = () => {
  const match = districtsList.find(d => d.name === form.district)
  if (match) {
    centerMapOn(match.lat, match.lng)
  }
}

// Watch step change to invalidate leaflet map size cleanly
watch(currentStep, (newStep) => {
  if (newStep === 2) {
    nextTick(() => {
      if (!mapInstance) {
        initMap()
      } else {
        setTimeout(() => {
          if (mapInstance) {
            mapInstance.invalidateSize()
            mapInstance.setView([form.lat, form.lng], 13)
          }
        }, 180)
      }
    })
  }
})

// Image Upload Handlers
const triggerCoverUpload = () => {
  coverInput.value?.click()
}

const handleCoverFileChange = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  processCoverFile(file)
}

const handleCoverDrop = (e) => {
  const file = e.dataTransfer.files?.[0]
  if (!file) return
  processCoverFile(file)
}

const processCoverFile = (file) => {
  if (file.size > 10 * 1024 * 1024) {
    showToast('Cover image size must be less than 10MB.', 'error')
    return
  }
  coverFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => {
    coverImagePreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

const removeCoverImage = () => {
  coverFile.value = null
  coverImagePreview.value = ''
  if (coverInput.value) coverInput.value.value = ''
}

// Gallery Upload Handlers
const triggerGalleryUpload = () => {
  galleryInput.value?.click()
}

const handleGalleryFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  files.forEach(file => {
    galleryFiles.value.push(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      galleryPreviews.value.push({
        url: ev.target.result,
        file
      })
    }
    reader.readAsDataURL(file)
  })

  if (galleryInput.value) galleryInput.value.value = ''
}

const removeGalleryImage = (index) => {
  galleryPreviews.value.splice(index, 1)
  galleryFiles.value.splice(index, 1)
}

// Auto-fill Agent Details from authenticated user
onMounted(async () => {
  loadUserFromStorage()
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
  document.addEventListener('click', handleDocumentClick)

  try {
    if (authService.isAuthenticated()) {
      const res = await authService.getProfile()
      const parsed = parseUserData(res)
      if (parsed) {
        user.value = { ...user.value, ...parsed }
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }
    }
  } catch { /* ignore */ }

  try {
    const rawAuth = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user')
    if (rawAuth) {
      const u = JSON.parse(rawAuth)
      form.agentName = u.name || localStorage.getItem('vibe_user_name') || ''
      form.agentEmail = u.email || localStorage.getItem('vibe_user_email') || ''
      form.agentPhone = u.phone || '+971 50 234 5678'
    } else {
      form.agentName = localStorage.getItem('vibe_user_name') || 'Mohammed AL.Hwity'
      form.agentEmail = localStorage.getItem('vibe_user_email') || 'malhwaiti@smail.ucas.edu.ps'
      form.agentPhone = '+971 50 892 1445'
    }

    // Try to load any saved draft
    const savedDraft = localStorage.getItem('vibe_property_draft')
    if (savedDraft) {
      const draftObj = JSON.parse(savedDraft)
      Object.assign(form, draftObj)
      if (draftObj.coverImagePreview) coverImagePreview.value = draftObj.coverImagePreview
      showToast('Saved draft restored automatically.')
    }
  } catch { /* ignore */ }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleDocumentClick)
})

// Save as Draft
const saveAsDraft = () => {
  try {
    const draftPayload = {
      ...form,
      coverImagePreview: coverImagePreview.value
    }
    localStorage.setItem('vibe_property_draft', JSON.stringify(draftPayload))
    showToast('Property draft saved successfully to your device.')
  } catch (e) {
    showToast('Unable to save draft.', 'error')
  }
}

// Submit and publish property
const handleSubmit = async () => {
  if (!form.title.trim()) {
    showToast('Please enter a property title.', 'error')
    currentStep.value = 1
    return
  }
  if (!form.price || form.price <= 0) {
    showToast('Please enter a valid price for the property.', 'error')
    currentStep.value = 1
    return
  }
  if (!form.district) {
    showToast('Please select a district in Dubai.', 'error')
    currentStep.value = 2
    return
  }
  if (!form.address.trim()) {
    showToast('Please enter the detailed address or building name.', 'error')
    currentStep.value = 2
    return
  }

  isSubmitting.value = true

  try {
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('property_type', form.propertyType)
    payload.append('listing_type', form.listingType)
    payload.append('price', form.price)
    payload.append('currency', 'AED')
    payload.append('rent_frequency', form.rentFrequency)
    payload.append('status', form.status)
    payload.append('completion_date', form.completionDate)
    payload.append('size', form.size)
    payload.append('area_sqft', form.size)
    payload.append('bedrooms', form.bedrooms)
    payload.append('bathrooms', form.bathrooms)
    payload.append('furnishing', form.furnishing)
    payload.append('description', form.description)
    payload.append('district', form.district)
    payload.append('area', form.district)
    payload.append('address', form.address)
    payload.append('latitude', form.lat)
    payload.append('longitude', form.lng)
    payload.append('amenities', JSON.stringify(form.amenities))
    payload.append('video_url', form.videoUrl)
    payload.append('agent_name', form.agentName)
    payload.append('agent_phone', form.agentPhone)
    payload.append('agent_email', form.agentEmail)

    if (coverFile.value) {
      payload.append('primary_image', coverFile.value)
      payload.append('photo', coverFile.value)
      payload.append('image', coverFile.value)
    }

    galleryFiles.value.forEach((file, idx) => {
      payload.append(`images[${idx}]`, file)
    })

    // Send to backend
    await propertyService.createProperty(payload)

    // Save to local storage properties so it immediately shows up across the app
    const newPropertyItem = {
      id: Date.now(),
      title: form.title,
      type: form.propertyType.charAt(0).toUpperCase() + form.propertyType.slice(1),
      category: form.listingType,
      listingType: form.listingType,
      price: `AED ${Number(form.price).toLocaleString()}`,
      priceAed: form.price,
      period: form.listingType === 'rent' ? `/${form.rentFrequency}` : 'Sale',
      location: `${form.district}, Dubai`,
      area: form.district,
      beds: Number(form.bedrooms) || 1,
      baths: Number(form.bathrooms) || 1,
      sqft: Number(form.size).toLocaleString(),
      size: Number(form.size).toLocaleString(),
      image: coverImagePreview.value || '/images/photo-1600596542815-ffad4c1539a9.jfif',
      images: galleryPreviews.value.length > 0 ? galleryPreviews.value.map(g => g.url) : [coverImagePreview.value || '/images/photo-1600596542815-ffad4c1539a9.jfif'],
      saved: true,
      lat: form.lat,
      lng: form.lng,
      status: form.status,
      amenities: form.amenities,
      agent: {
        name: form.agentName,
        phone: form.agentPhone,
        email: form.agentEmail
      }
    }

    try {
      const rawSaved = localStorage.getItem('vibe_saved_properties')
      const savedList = rawSaved ? JSON.parse(rawSaved) : []
      savedList.unshift(newPropertyItem)
      localStorage.setItem('vibe_saved_properties', JSON.stringify(savedList))
      
      const rawUserListings = localStorage.getItem('vibe_user_listings')
      const userListings = rawUserListings ? JSON.parse(rawUserListings) : []
      userListings.unshift(newPropertyItem)
      localStorage.setItem('vibe_user_listings', JSON.stringify(userListings))

      // Clear draft
      localStorage.removeItem('vibe_property_draft')
    } catch (e) {
      console.warn('[AddPropertyPage] Storage sync notice:', e)
    }

    showToast('Property published successfully!')

    setTimeout(() => {
      router.push('/profile/saved')
    }, 1200)

  } catch (err) {
    console.error('[AddPropertyPage] Submit error:', err)
    showToast(err?.message || 'Failed to publish property, please check your fields and try again.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* ==================== ROOT CONTAINER (Light / Dark Theme) ==================== */
.add-property-page-root {
  min-height: 100vh;
  background-color: var(--page-bg, #F8FAFC);
  color: var(--text-primary, #0f172a);
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-bottom: 120px;
  padding-top: 68px;
  position: relative;
  overflow-x: hidden;
  direction: ltr;
  text-align: left;
}

/* Background Topography & Gradient Mesh */
.add-property-page-root::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/bg-topo-light.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #F8FAFC;
  opacity: 0.9;
  pointer-events: none;
}

[data-theme="dark"] .add-property-page-root::before {
  background-image: url('/bg-topo-dark.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #0B0F17;
  opacity: 0.95;
}

/* ==================== SITE HEADER ==================== */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  height: 68px;
  direction: ltr;
  transition: all 0.3s ease;
}

.site-header.scrolled {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
  border-bottom-color: #cbd5e1;
}

[data-theme="dark"] .site-header {
  background: rgba(11, 15, 23, 0.92);
  border-bottom-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}

[data-theme="dark"] .site-header.scrolled {
  background: rgba(11, 15, 23, 0.98);
  border-bottom-color: rgba(0, 210, 255, 0.25);
}

.header-inner {
  max-width: 1420px;
  height: 100%;
  margin: 0 auto;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.brand { text-decoration: none; }

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
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
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}

[data-theme="dark"] .brand-title {
  color: #ffffff;
}

.brand-accent { color: #0284c7; }
[data-theme="dark"] .brand-accent { color: #00d2ff; }

.brand-badge {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  color: #1e293b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #0284c7;
}

[data-theme="dark"] .nav-item {
  color: #cbd5e1;
}

[data-theme="dark"] .nav-item:hover,
[data-theme="dark"] .nav-item.active {
  color: #00d2ff;
}

.map-nav-icon {
  font-size: 0.8rem;
  color: #0284c7;
  margin-left: 4px;
}

[data-theme="dark"] .map-nav-icon {
  color: #00d2ff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-action-btn {
  color: #1e293b;
  font-size: 17px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-action-btn:hover {
  color: #0284c7;
  background: #e2e8f0;
  border-color: #94a3b8;
}

[data-theme="dark"] .icon-action-btn {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

[data-theme="dark"] .icon-action-btn:hover {
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.15);
  border-color: rgba(0, 210, 255, 0.4);
}

.user-profile-menu-container { position: relative; }

.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 40px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease;
}

.user-profile-menu:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

[data-theme="dark"] .user-profile-menu {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

[data-theme="dark"] .user-profile-menu:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 210, 255, 0.4);
}

.user-profile-menu:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 210, 255, 0.3);
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1.5px solid #00d2ff;
}

.profile-arrow {
  font-size: 11px;
  color: #94a3b8;
  transition: transform 0.25s ease;
}

.rotate-180 { transform: rotate(180deg); }

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 22px;
  cursor: pointer;
}

/* User Dropdown Box */
.profile-dropdown-box {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 280px;
  background: rgba(11, 22, 42, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55);
  padding: 16px;
  z-index: 1100;
  text-align: left;
}

.dropdown-user-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dropdown-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #00d2ff;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-user-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-user-email {
  color: #94a3b8;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-user-badge {
  font-size: 10px;
  color: #00d2ff;
  font-weight: 700;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 0;
}

.dropdown-menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.dropdown-menu-item:hover,
.dropdown-menu-item.active-item {
  background: rgba(0, 210, 255, 0.12);
  color: #00d2ff;
}

.dropdown-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #ffffff;
}

/* ==================== MAIN CONTAINER & TOP HEADER ==================== */
.page-container {
  position: relative;
  z-index: 1;
  max-width: 1420px;
  margin: 0 auto;
  padding: 28px 24px;
}

.page-top-header { margin-bottom: 24px; }

.breadcrumb-trail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #475569;
  margin-bottom: 12px;
}

.bc-link {
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
}

.bc-link:hover { color: #0284c7; }

.bc-sep {
  font-size: 10px;
  color: #94a3b8;
}

.bc-current {
  color: #0284c7;
  font-weight: 600;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

[data-theme="dark"] .page-title {
  color: #ffffff;
}

.highlight-en {
  font-size: 20px;
  font-weight: 400;
  color: #475569;
}

.page-subtitle {
  font-size: 14px;
  color: #475569;
  margin: 0;
  max-width: 700px;
  line-height: 1.6;
}

[data-theme="dark"] .page-subtitle {
  color: #94a3b8;
}

.header-badge-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #059669;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.1);
}

[data-theme="dark"] .header-badge-box {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(0, 210, 255, 0.25);
  color: #00d2ff;
}

.badge-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
}

/* ==================== MULTI-STEP PROGRESS WIZARD BAR ==================== */
.wizard-stepper-container {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 24px 32px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

[data-theme="dark"] .wizard-stepper-container {
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.wizard-stepper-track {
  position: absolute;
  top: 48px;
  left: 80px;
  right: 80px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 4px;
  z-index: 1;
}

[data-theme="dark"] .wizard-stepper-track {
  background: rgba(255, 255, 255, 0.08);
}

.wizard-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 12px rgba(14, 165, 233, 0.4);
}

.wizard-steps-list {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.wizard-step-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  transition: all 0.25s ease;
}

.step-circle {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 2px solid #cbd5e1;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.05);
}

[data-theme="dark"] .step-circle {
  background: #0f1c32;
  border-color: rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.step-number-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

[data-theme="dark"] .step-number-badge {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.step-labels {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-main-title {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  transition: color 0.25s;
}

[data-theme="dark"] .step-main-title {
  color: #94a3b8;
}

.step-sub-title {
  font-size: 11px;
  color: #64748b;
  font-family: 'Outfit', sans-serif;
}

/* Active Step */
.wizard-step-node.is-active .step-circle {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
  transform: scale(1.08);
}

.wizard-step-node.is-active .step-main-title {
  color: #0284c7;
  font-weight: 800;
}

.wizard-step-node.is-active .step-number-badge {
  background: #0284c7;
  border-color: #ffffff;
  color: #ffffff;
}

/* Completed Step */
.wizard-step-node.is-completed .step-circle {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #16a34a;
}

.wizard-step-node.is-completed .step-main-title {
  color: #16a34a;
}

.wizard-step-node.is-completed .check-ico {
  font-size: 16px;
  font-weight: 900;
  color: #16a34a;
}

/* ==================== SPLIT SCREEN LAYOUT ==================== */
.form-layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 28px;
  align-items: start;
}

.form-main-col {
  min-width: 0;
}

/* Glass Panel Card */
.glass-panel {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 32px;
  margin-bottom: 24px;
}

[data-theme="dark"] .glass-panel {
  background: rgba(15, 23, 42, 0.75);
  border-color: rgba(255, 255, 255, 0.09);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

.section-card-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 28px;
}

[data-theme="dark"] .section-card-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.step-num-pill {
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0284c7;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 999px;
  white-space: nowrap;
}

[data-theme="dark"] .step-num-pill {
  background: rgba(0, 210, 255, 0.12);
  border-color: rgba(0, 210, 255, 0.3);
  color: #00d2ff;
}

.section-header-titles { flex: 1; }

.section-title {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

[data-theme="dark"] .section-title {
  color: #ffffff;
}

.header-icon {
  color: #0284c7;
  font-size: 20px;
}

[data-theme="dark"] .header-icon {
  color: #00d2ff;
}

.en-sub {
  font-size: 15px;
  font-weight: 400;
  color: #475569;
}

.section-desc {
  font-size: 13px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

[data-theme="dark"] .section-desc {
  color: #94a3b8;
}

/* ==================== FORM FIELDS & INPUTS ==================== */
.form-group { margin-bottom: 20px; }

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

[data-theme="dark"] .form-label {
  color: #e2e8f0;
}

.required-star { color: #f43f5e; }

.field-tip {
  font-size: 11px;
  color: #0284c7;
}

[data-theme="dark"] .field-tip {
  color: #38bdf8;
}

.form-control,
.form-select,
.form-textarea {
  width: 100%;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 16px;
  color: #0f172a;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.25s ease;
  outline: none;
}

.form-control:focus,
.form-select:focus,
.form-textarea:focus {
  background: #ffffff;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.form-control::placeholder,
.form-textarea::placeholder {
  color: #94a3b8;
}

[data-theme="dark"] .form-control,
[data-theme="dark"] .form-select,
[data-theme="dark"] .form-textarea {
  background: rgba(10, 20, 36, 0.75);
  border-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

[data-theme="dark"] .form-control:focus,
[data-theme="dark"] .form-select:focus,
[data-theme="dark"] .form-textarea:focus {
  background: rgba(11, 24, 46, 0.95);
  border-color: #00d2ff;
  box-shadow: 0 0 0 3px rgba(0, 210, 255, 0.22);
}

[data-theme="dark"] .form-control::placeholder,
[data-theme="dark"] .form-textarea::placeholder {
  color: #475569;
}

.form-textarea { resize: vertical; }

.char-counter {
  font-size: 11px;
  color: #64748b;
  font-family: monospace;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-ico {
  position: absolute;
  right: 14px;
  color: #64748b;
  font-size: 15px;
  pointer-events: none;
}

.icon-padded { padding-right: 42px !important; }

.input-with-affix {
  position: relative;
  display: flex;
  align-items: center;
}

.affix-text {
  position: absolute;
  left: 14px;
  color: #00d2ff;
  font-weight: 800;
  font-size: 13px;
  pointer-events: none;
}

.affix-padded { padding-left: 56px !important; }

.field-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #475569;
}

[data-theme="dark"] .field-hint {
  color: #94a3b8;
}

.text-cyan { color: #0284c7 !important; }
[data-theme="dark"] .text-cyan { color: #00d2ff !important; }

/* Dark Select */
.dark-select {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
}

.dark-select option {
  background-color: #ffffff;
  color: #0f172a;
  padding: 8px;
}

[data-theme="dark"] .dark-select {
  background-color: #0a1424;
  border-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

[data-theme="dark"] .dark-select option {
  background-color: #0d1a30;
  color: #ffffff;
}

/* ==================== SEGMENTED CHIPS ==================== */
.segmented-chips-grid {
  display: grid;
  gap: 12px;
}

.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-5 { grid-template-columns: repeat(5, 1fr); }
.grid-6 { grid-template-columns: repeat(6, 1fr); }
.grid-7 { grid-template-columns: repeat(7, 1fr); }

.segmented-chip-btn {
  position: relative;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 14px 16px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: right;
}

.segmented-chip-btn:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #0f172a;
  transform: translateY(-2px);
}

.segmented-chip-btn.active {
  background: #e0f2fe;
  border-color: #0284c7;
  color: #0369a1;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.2);
}

[data-theme="dark"] .segmented-chip-btn {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.09);
  color: #cbd5e1;
}

[data-theme="dark"] .segmented-chip-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 210, 255, 0.3);
  color: #ffffff;
}

[data-theme="dark"] .segmented-chip-btn.active {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.16) 0%, rgba(37, 99, 235, 0.26) 100%);
  border-color: #00d2ff;
  color: #ffffff;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.25);
}

.chip-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #0284c7;
  flex-shrink: 0;
}

.segmented-chip-btn.active .chip-icon-box {
  background: #0284c7;
  color: #ffffff;
}

[data-theme="dark"] .chip-icon-box {
  background: rgba(255, 255, 255, 0.05);
  color: #00d2ff;
}

[data-theme="dark"] .segmented-chip-btn.active .chip-icon-box {
  background: rgba(0, 210, 255, 0.2);
  color: #ffffff;
}

.chip-text-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.chip-primary {
  font-size: 14px;
  font-weight: 700;
  color: inherit;
}

.chip-secondary {
  font-size: 11px;
  color: #64748b;
}

.segmented-chip-btn.active .chip-secondary { color: #0284c7; }
[data-theme="dark"] .segmented-chip-btn.active .chip-secondary { color: #94a3b8; }

.active-check {
  font-size: 14px;
  color: #0284c7;
  opacity: 0;
  transition: opacity 0.2s;
}

[data-theme="dark"] .active-check {
  color: #00d2ff;
}

.segmented-chip-btn.active .active-check { opacity: 1; }

/* Type Chips (Vertical Stack) */
.type-chip {
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 12px;
  gap: 8px;
}

.type-chip .chip-icon-box {
  width: 44px;
  height: 44px;
  font-size: 20px;
}

.type-chip .chip-text-wrap {
  align-items: center;
}

/* Compact Chips (Numbers: Bedrooms / Bathrooms) */
.compact-chip {
  padding: 10px 8px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 4px;
}

.compact-chip .chip-primary { font-size: 13px; }
.compact-chip .chip-secondary { font-size: 10px; }

/* Quick Text Chips Row */
.quick-chips-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chips-label {
  font-size: 11px;
  color: #475569;
  font-weight: 600;
}

[data-theme="dark"] .chips-label {
  color: #64748b;
}

.quick-text-chip {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-text-chip:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #0f172a;
}

.quick-text-chip.active {
  background: #e0f2fe;
  border-color: #0284c7;
  color: #0369a1;
}

[data-theme="dark"] .quick-text-chip {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
}

[data-theme="dark"] .quick-text-chip:hover,
[data-theme="dark"] .quick-text-chip.active {
  background: rgba(0, 210, 255, 0.15);
  border-color: #00d2ff;
  color: #00d2ff;
}

/* Segmented Pills Row */
.segmented-pills-row {
  display: flex;
  gap: 8px;
}

.pill-chip-btn {
  flex: 1;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px 12px;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.pill-chip-btn:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
  color: #0f172a;
}

.pill-chip-btn.active {
  background: #e0f2fe;
  border-color: #0284c7;
  color: #0369a1;
}

[data-theme="dark"] .pill-chip-btn {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

[data-theme="dark"] .pill-chip-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

[data-theme="dark"] .pill-chip-btn.active {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%);
  border-color: #00d2ff;
  color: #00d2ff;
}

/* Pricing Card Box */
.pricing-card-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
}

[data-theme="dark"] .pricing-card-box {
  background: rgba(10, 20, 36, 0.5);
  border-color: rgba(255, 255, 255, 0.06);
}

.section-divider {
  height: 1px;
  background: #e2e8f0;
}

[data-theme="dark"] .section-divider {
  background: rgba(255, 255, 255, 0.08);
}

/* Location Sub Header */
.location-sub-header { margin-top: 8px; }

.sub-header-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px 0;
}

[data-theme="dark"] .sub-header-title {
  color: #ffffff;
}

.sub-header-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

/* Map Presets Bar */
.map-presets-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.presets-label {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.presets-chips-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-preset-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 6px 12px;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-preset-chip:hover,
.btn-preset-chip.active {
  background: rgba(0, 210, 255, 0.15);
  border-color: #00d2ff;
  color: #00d2ff;
}

/* Map Picker Wrapper */
.map-picker-wrapper {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.interactive-picker-map {
  width: 100%;
  height: 380px;
  background: #0d1829;
}

.map-overlay-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 500;
  background: rgba(11, 22, 42, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 210, 255, 0.3);
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 12px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

.pulse-dot-icon {
  color: #00d2ff;
  animation: pulse-glow 1.5s infinite;
}

/* Coords Display Box */
.coords-display-box {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.coord-pill {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
}

.coord-lbl { color: #64748b; margin-left: 6px; }
.coord-val { color: #00d2ff; font-family: monospace; font-weight: 700; }

.coords-hint {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ==================== AMENITIES CHECKBOX GRID ==================== */
.badge-amenities-count {
  background: rgba(0, 210, 255, 0.15);
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #00d2ff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
}

.amenities-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.amenity-checkbox-card {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.amenity-checkbox-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(0, 210, 255, 0.3);
}

.amenity-checkbox-card.checked {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.14) 0%, rgba(37, 99, 235, 0.22) 100%);
  border-color: #00d2ff;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.2);
}

.hidden-chk { display: none; }

.amenity-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d2ff;
  font-size: 14px;
}

.amenity-checkbox-card.checked .amenity-icon-box {
  background: #00d2ff;
  color: #070e1c;
}

.amenity-text {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.am-ar { font-size: 13px; font-weight: 700; color: #ffffff; }
.am-en { font-size: 10px; color: #64748b; }

.check-indicator {
  font-size: 12px;
  color: #00d2ff;
  opacity: 0;
  transition: opacity 0.2s;
}

.amenity-checkbox-card.checked .check-indicator { opacity: 1; }

/* ==================== MEDIA DROPZONE ==================== */
.dropzone-box {
  border: 2px dashed rgba(0, 210, 255, 0.3);
  border-radius: 16px;
  background: rgba(10, 20, 36, 0.5);
  padding: 36px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s;
}

.dropzone-box:hover {
  border-color: #00d2ff;
  background: rgba(0, 210, 255, 0.05);
}

.drop-icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 210, 255, 0.12);
  color: #00d2ff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.dropzone-placeholder h4 {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px 0;
}

.dropzone-placeholder p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 16px 0;
}

.btn-browse-file {
  background: linear-gradient(135deg, #00d2ff 0%, #0072ff 100%);
  border: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-browse-file:hover { transform: scale(1.04); }

.cover-preview-wrap {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  max-height: 280px;
}

.cover-img-preview {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

.cover-actions-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.25s;
}

.cover-preview-wrap:hover .cover-actions-overlay { opacity: 1; }

.btn-change-cover,
.btn-remove-cover {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-change-cover { background: #00d2ff; color: #070e1c; }
.btn-remove-cover { background: #ef4444; color: #ffffff; }

/* Gallery Zone */
.gallery-count-badge {
  font-size: 11px;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 4px 10px;
  border-radius: 6px;
}

.gallery-upload-zone {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.2s;
}

.gallery-upload-zone:hover {
  border-color: #00d2ff;
  background: rgba(0, 210, 255, 0.05);
}

.gallery-zone-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(0, 210, 255, 0.12);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.gallery-zone-text h5 {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px 0;
}

.gallery-zone-text span {
  font-size: 11px;
  color: #94a3b8;
}

.gallery-thumbnails-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

.thumb-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-thumb {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
  border: none;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== STEP 4 REVIEW SUMMARY ==================== */
.review-summary-card {
  background: rgba(10, 20, 36, 0.6);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
}

.summary-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.s-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.s-val {
  font-size: 13px;
  font-weight: 700;
  color: #e2e8f0;
}

.badge-summary-listing {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  width: fit-content;
}

.badge-summary-listing.sale { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-summary-listing.rent { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }

.publish-notice-box {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: rgba(0, 210, 255, 0.06);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 14px;
  padding: 16px;
}

.notice-icon {
  font-size: 24px;
  color: #00d2ff;
  margin-top: 2px;
}

.notice-content h5 {
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.notice-content p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.6;
}

/* ==================== WIZARD NAVIGATION FOOTER ==================== */
.wizard-nav-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

[data-theme="dark"] .wizard-nav-footer {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.footer-left-info {
  font-size: 13px;
  color: #475569;
}

[data-theme="dark"] .footer-left-info {
  color: #64748b;
}

.btn-wizard-next,
.btn-publish-listing {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
  transition: all 0.25s ease;
}

.btn-wizard-next:hover,
.btn-publish-listing:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.5);
}

[data-theme="dark"] .btn-wizard-next,
[data-theme="dark"] .btn-publish-listing {
  background: linear-gradient(135deg, #00d2ff 0%, #0072ff 100%);
  box-shadow: 0 4px 20px rgba(0, 210, 255, 0.4);
}

[data-theme="dark"] .btn-wizard-next:hover,
[data-theme="dark"] .btn-publish-listing:hover {
  box-shadow: 0 8px 28px rgba(0, 210, 255, 0.6);
}

.btn-wizard-back {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 14px 22px;
  color: #334155;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-wizard-back:hover {
  background: #e2e8f0;
  color: #0f172a;
}

[data-theme="dark"] .btn-wizard-back {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
}

[data-theme="dark"] .btn-wizard-back:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.final-actions-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-draft {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 14px 20px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-draft:hover {
  background: #e2e8f0;
  color: #0f172a;
}

[data-theme="dark"] .btn-draft {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
}

[data-theme="dark"] .btn-draft:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* ==================== LEFT COLUMN: STICKY LIVE PREVIEW ==================== */
.form-preview-col {
  width: 100%;
}

.sticky-preview-wrapper {
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.preview-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

[data-theme="dark"] .preview-badge {
  color: #ffffff;
}

.live-pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 12px #10b981;
  animation: pulse-green 1.6s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.9); box-shadow: 0 0 4px #10b981; }
  50% { transform: scale(1.2); box-shadow: 0 0 16px #10b981; }
  100% { transform: scale(0.9); box-shadow: 0 0 4px #10b981; }
}

.ai-score-pill {
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0284c7;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 6px;
}

[data-theme="dark"] .ai-score-pill {
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%);
  border-color: rgba(0, 210, 255, 0.4);
  color: #00d2ff;
}

/* Property Preview Card */
.property-preview-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.3s ease;
}

[data-theme="dark"] .property-preview-card {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.5);
}

.card-media-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.media-badges {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  gap: 8px;
}

.listing-type-badge {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.3px;
}

.listing-type-badge.sale {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.listing-type-badge.rent {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.status-badge-chip {
  background: rgba(245, 158, 11, 0.85);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
}

.status-badge-ready {
  background: rgba(16, 185, 129, 0.85);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
}

.media-fav-btn {
  position: absolute;
  top: 14px;
  left: 14px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  color: #f43f5e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 1px solid #e2e8f0;
}

[data-theme="dark"] .media-fav-btn {
  background: rgba(0, 0, 0, 0.5);
  border: none;
}

.gallery-counter-pill {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-content-wrap { padding: 20px; }

.preview-price-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}

.preview-price-val {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #0284c7;
  letter-spacing: -0.5px;
}

[data-theme="dark"] .preview-price-val {
  color: #00d2ff;
}

.rent-period {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

[data-theme="dark"] .rent-period {
  color: #94a3b8;
}

.prop-type-pill {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
}

[data-theme="dark"] .prop-type-pill {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.08);
  border: none;
}

.preview-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

[data-theme="dark"] .preview-title {
  color: #ffffff;
}

.preview-location {
  font-size: 12px;
  color: #475569;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

[data-theme="dark"] .preview-location {
  color: #94a3b8;
}

.preview-location i { color: #0284c7; }
[data-theme="dark"] .preview-location i { color: #00d2ff; }

.preview-specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 14px;
}

[data-theme="dark"] .preview-specs-grid {
  background: rgba(10, 20, 36, 0.5);
  border-color: rgba(255, 255, 255, 0.05);
}

.spec-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

[data-theme="dark"] .spec-item {
  color: #cbd5e1;
}

.spec-item i { color: #0284c7; font-size: 13px; }
[data-theme="dark"] .spec-item i { color: #00d2ff; }

.preview-amenities-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.amenity-tag {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

[data-theme="dark"] .amenity-tag {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.amenity-tag-more {
  font-size: 10px;
  color: #0284c7;
  font-weight: 700;
  align-self: center;
}

[data-theme="dark"] .amenity-tag-more {
  color: #00d2ff;
}

.preview-agent-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
}

[data-theme="dark"] .preview-agent-footer {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.agent-avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e0f2fe;
  border: 1.5px solid #0284c7;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

[data-theme="dark"] .agent-avatar-circle {
  background: rgba(0, 210, 255, 0.12);
  border-color: #00d2ff;
  color: #00d2ff;
}

.agent-info-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.agent-name-display {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

[data-theme="dark"] .agent-name-display {
  color: #ffffff;
}

.agent-phone-display {
  font-size: 11px;
  color: #64748b;
  font-family: monospace;
}

[data-theme="dark"] .agent-phone-display {
  color: #94a3b8;
}

.agent-actions-preview { display: flex; gap: 8px; }

.btn-agent-call,
.btn-agent-wa {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-agent-call {
  background: #e0f2fe;
  color: #0284c7;
}

[data-theme="dark"] .btn-agent-call {
  background: rgba(0, 210, 255, 0.15);
  color: #00d2ff;
}

.btn-agent-wa {
  background: #dcfce7;
  color: #16a34a;
}

[data-theme="dark"] .btn-agent-wa {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.btn-agent-call:hover,
.btn-agent-wa:hover {
  transform: scale(1.1);
}

/* Tips Box */
.preview-tips-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

[data-theme="dark"] .preview-tips-box {
  background: rgba(15, 23, 42, 0.65);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.tip-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

[data-theme="dark"] .tip-title {
  color: #ffffff;
}

.tips-list {
  margin: 0;
  padding-left: 18px;
  padding-right: 0;
  font-size: 12px;
  color: #475569;
  line-height: 1.7;
}

[data-theme="dark"] .tips-list {
  color: #94a3b8;
}

/* ==================== TOAST NOTIFICATION ==================== */
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 2000;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  color: #ffffff;
  padding: 14px 22px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.toast-icon {
  color: #10b981;
  font-size: 18px;
}

.toast--error {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(69, 10, 10, 0.95);
}

.toast--error .toast-icon {
  color: #f87171;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

/* ==================== RESPONSIVE BREAKPOINTS ==================== */
@media (max-width: 1100px) {
  .form-layout-grid {
    grid-template-columns: 1fr;
  }

  .form-preview-col {
    order: -1; /* Place preview above form on smaller viewports or keep visible */
    margin-bottom: 24px;
  }

  .sticky-preview-wrapper {
    position: static;
  }

  .grid-5, .grid-6, .grid-7 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .wizard-stepper-container {
    padding: 18px 16px;
  }

  .wizard-stepper-track {
    left: 40px;
    right: 40px;
    top: 40px;
  }

  .step-circle {
    width: 42px;
    height: 42px;
    font-size: 15px;
  }

  .step-sub-title {
    display: none;
  }

  .step-main-title {
    font-size: 12px;
  }

  .grid-2, .grid-3, .grid-5, .grid-6, .grid-7 {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .nav-links {
    display: none;
  }

  .nav-links.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    background: #06101e;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .menu-toggle { display: block; }
}

/* ==================== LIGHT MODE: COMPONENT-LEVEL FIXES ====================
   These are placed here (in scoped style) so they have the Vue data-v attribute
   and can properly override the dark defaults used as base styles.
   ==================== */

/* Profile Dropdown Box */
[data-theme="light"] .profile-dropdown-box {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}
[data-theme="light"] .dropdown-user-name { color: #0f172a; }
[data-theme="light"] .dropdown-user-email { color: #475569; }
[data-theme="light"] .dropdown-user-badge { color: #0284c7; }
[data-theme="light"] .dropdown-divider { background: #e2e8f0; }
[data-theme="light"] .dropdown-menu-item { color: #334155; }
[data-theme="light"] .dropdown-menu-item:hover,
[data-theme="light"] .dropdown-menu-item.active-item {
  background: #f1f5f9;
  color: #0284c7;
}
[data-theme="light"] .dropdown-logout-btn {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}
[data-theme="light"] .dropdown-logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #dc2626;
}

/* Mobile Menu Toggle */
[data-theme="light"] .menu-toggle { color: #1e293b; }

/* Mobile nav open panel */
[data-theme="light"] .nav-links.open {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

/* Preset Chips (Location Quick-Select) */
[data-theme="light"] .btn-preset-chip {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}
[data-theme="light"] .btn-preset-chip:hover,
[data-theme="light"] .btn-preset-chip.active {
  background: #e0f2fe;
  border-color: #0284c7;
  color: #0369a1;
}

/* Map picker wrapper */
[data-theme="light"] .map-picker-wrapper {
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

/* Map overlay badge */
[data-theme="light"] .map-overlay-badge {
  background: rgba(255, 255, 255, 0.92);
  border-color: rgba(2, 132, 199, 0.3);
  color: #1e293b;
}
[data-theme="light"] .pulse-dot-icon { color: #0284c7; }

/* Coordinate pills */
[data-theme="light"] .coord-pill {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #334155;
}
[data-theme="light"] .coord-lbl { color: #64748b; }
[data-theme="light"] .coord-val { color: #0284c7; }
[data-theme="light"] .coords-hint { color: #64748b; }
[data-theme="light"] .presets-label { color: #64748b; }

/* Amenity Checkbox Cards */
[data-theme="light"] .amenity-checkbox-card {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #1e293b;
}
[data-theme="light"] .amenity-checkbox-card:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}
[data-theme="light"] .amenity-checkbox-card.checked {
  background: #e0f2fe;
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
  color: #0369a1;
}
[data-theme="light"] .amenity-icon-box {
  background: #e2e8f0;
  color: #0284c7;
}
[data-theme="light"] .amenity-checkbox-card.checked .amenity-icon-box {
  background: #0284c7;
  color: #ffffff;
}
[data-theme="light"] .amenity-label { color: #1e293b; }
[data-theme="light"] .amenity-sub { color: #64748b; }
[data-theme="light"] .badge-amenities-count {
  background: #e0f2fe;
  border-color: #bae6fd;
  color: #0284c7;
}

/* Affix text (currency symbol) */
[data-theme="light"] .affix-text { color: #0284c7; }

/* Upload Dropzone */
[data-theme="light"] .upload-dropzone-box {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}
[data-theme="light"] .upload-dropzone-box:hover {
  border-color: #0284c7;
  background: #e0f2fe;
}

/* AI Score Pill */
[data-theme="light"] .ai-score-pill {
  background: #e0f2fe;
  border-color: #bae6fd;
  color: #0284c7;
}
</style>
