<template>
  <div class="payment-page-wrapper" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">
    <!-- ==================== MAIN UNIFIED CONTENT ==================== -->
    <main class="payment-main-container">
      <div class="payment-content-wrapper">

        <!-- Top Back Link, Page Title & Stepper Header -->
        <div class="payment-top-section">
          <div class="payment-title-area">
            <button class="back-link-btn" type="button" @click="handleBack">
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-right' : 'fa-arrow-left'"></i>
              <span>{{ propertyData.location }}</span>
            </button>
            <h1 class="payment-page-title">
              {{ isRtl ? 'دفع العربون وحجز موعد المعاينة' : 'Pay Deposit & Schedule Property Viewing' }}
            </h1>
            <p class="payment-page-subtitle">
              {{ isRtl 
                ? 'حدد موعد المعاينة المناسب لمرافقة الوكيل وادفع عربون الحجز الرمزي ($330) لتأكيد المعاينة وحجز العقار حصرياً.' 
                : 'Select your preferred inspection time and pay the symbolic reservation deposit ($330) to secure your viewing.' 
              }}
            </p>
          </div>

          <!-- Stepper Progress Tracker -->
          <div class="stepper-container">
            <!-- Step 1: تحديد الموعد (Schedule) -->
            <div class="step-item" :class="{ completed: currentStep > 1, active: currentStep === 1 }">
              <div class="step-circle">
                <i v-if="currentStep > 1" class="fa-solid fa-check"></i>
                <span v-else>1</span>
              </div>
              <span class="step-label">{{ isRtl ? 'موعد المعاينة' : 'Schedule' }}</span>
            </div>

            <div class="step-connector" :class="{ active: currentStep >= 2 }"></div>

            <!-- Step 2: دفع العربون (Deposit & Payment) -->
            <div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
              <div class="step-circle">
                <i v-if="currentStep > 2" class="fa-solid fa-check"></i>
                <span v-else>2</span>
              </div>
              <span class="step-label">{{ isRtl ? 'دفع العربون' : 'Pay Deposit' }}</span>
            </div>

            <div class="step-connector" :class="{ active: currentStep >= 3 }"></div>

            <!-- Step 3: التأكيد (Confirmation) -->
            <div class="step-item" :class="{ active: currentStep === 3 }">
              <div class="step-circle">
                <span>3</span>
              </div>
              <span class="step-label">{{ isRtl ? 'تأكيد الحجز' : 'Confirmation' }}</span>
            </div>
          </div>
        </div>

        <!-- ==================== STEP 2: MAIN 2-COLUMN GRID ==================== -->
        <div v-if="currentStep <= 2" class="unified-booking-grid">

          <!-- ==================== LEFT COLUMN ==================== -->
          <div class="unified-main-column">

            <!-- 1. Prominent Property Summary Card -->
            <div class="prominent-property-card">
              <div class="prop-banner-layout">
                <div class="prop-banner-img-wrap">
                  <img
                    class="prop-banner-img"
                    :src="propertyData.image"
                    :alt="propertyData.title"
                    @error="onImageFallback"
                  />
                  <span class="prop-verified-badge">
                    <i class="fa-solid fa-shield-halved"></i> {{ isRtl ? 'عقار موثق ومعتمد' : 'Verified Property' }}
                  </span>
                </div>

                <div class="prop-banner-info">
                  <div class="prop-banner-head">
                    <div class="prop-type-badge">{{ propertyData.type || (isRtl ? 'عقار فاخر' : 'Luxury Property') }}</div>
                    <h2 class="prop-title-ar">{{ isRtl ? propertyData.arTitle : propertyData.title }}</h2>
                    <p class="prop-title-en">
                      <i class="fa-solid fa-location-dot"></i> {{ propertyData.location }}
                    </p>
                  </div>

                  <div class="prop-specs-tags-row">
                    <div class="prop-price-tag-wrap">
                      <span class="prop-price-label">{{ isRtl ? 'سعر العقار الإجمالي:' : 'Property Full Price:' }}</span>
                      <span class="prop-price-highlight">${{ propertyData.price.toLocaleString() }}</span>
                    </div>
                    <span class="prop-divider">•</span>
                    <span class="spec-tag"><i class="fa-solid fa-bed"></i> {{ propertyData.beds }} {{ isRtl ? 'غرف' : 'Beds' }}</span>
                    <span class="spec-tag"><i class="fa-solid fa-bath"></i> {{ propertyData.baths }} {{ isRtl ? 'حمامات' : 'Baths' }}</span>
                    <span class="spec-tag"><i class="fa-solid fa-vector-square"></i> {{ propertyData.sqm }} m²</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Schedule Viewing Inspection Section (قسم تحديد موعد المعاينة) -->
            <div class="schedule-inspection-card">
              <div class="section-header-row">
                <div class="section-icon-badge">
                  <i class="fa-regular fa-calendar-check"></i>
                </div>
                <div class="section-title-wrap">
                  <h3 class="section-title">{{ isRtl ? 'تحديد موعد المعاينة' : 'Schedule Viewing Inspection' }}</h3>
                  <p class="section-subtitle">
                    {{ isRtl 
                      ? 'حدد اليوم والفترة الزمنية المناسبة لك لمرافقة الوسيط المعتمد ومعاينة العقار.' 
                      : 'Select your preferred inspection date and time slot to tour the property with our certified agent.' 
                    }}
                  </p>
                </div>
              </div>

              <!-- Inspection Mode Toggle (حضورياً أو افتراضياً) -->
              <div class="inspection-mode-selector">
                <label class="config-sub-label">
                  <i class="fa-solid fa-compass-drafting"></i>
                  <span>{{ isRtl ? 'نوع المعاينة' : 'Inspection Mode' }}</span>
                </label>
                <div class="inspection-mode-grid">
                  <button
                    type="button"
                    class="mode-card"
                    :class="{ active: inspectionType === 'in_person' }"
                    @click="inspectionType = 'in_person'"
                  >
                    <div class="mode-icon-circle">
                      <i class="fa-solid fa-person-walking"></i>
                    </div>
                    <div class="mode-text">
                      <strong>{{ isRtl ? 'معاينة حضورية مع الوسيط' : 'In-Person Guided Tour' }}</strong>
                      <span>{{ isRtl ? 'جولة ميدانية داخل العقار برفقة المستشار' : 'Walk-through the property with verified agent' }}</span>
                    </div>
                    <i v-if="inspectionType === 'in_person'" class="fa-solid fa-circle-check active-check"></i>
                  </button>

                  <button
                    type="button"
                    class="mode-card"
                    :class="{ active: inspectionType === 'virtual_3d' }"
                    @click="inspectionType = 'virtual_3d'"
                  >
                    <div class="mode-icon-circle">
                      <i class="fa-solid fa-video"></i>
                    </div>
                    <div class="mode-text">
                      <strong>{{ isRtl ? 'جولة افتراضية مباشرة (3D / Video)' : 'Live 3D / Video Call Tour' }}</strong>
                      <span>{{ isRtl ? 'مكالمة فيديو تفاعلية وجولة افتراضية ثلاثية الأبعاد' : 'Interactive video walk-through from anywhere' }}</span>
                    </div>
                    <i v-if="inspectionType === 'virtual_3d'" class="fa-solid fa-circle-check active-check"></i>
                  </button>
                </div>
              </div>

              <!-- Interactive Calendar (التقويم التفاعلي) -->
              <div class="calendar-interactive-box">
                <div class="calendar-controls-bar">
                  <div class="month-title-wrap">
                    <i class="fa-regular fa-calendar-days text-cyan"></i>
                    <h4 class="calendar-month-heading">{{ currentMonthYearLabel }}</h4>
                  </div>
                  <div class="month-nav-actions">
                    <button type="button" class="btn-cal-today" @click="goToToday">
                      {{ isRtl ? 'اليوم' : 'Today' }}
                    </button>
                    <button type="button" class="btn-cal-nav" @click="prevMonth" :title="isRtl ? 'الشهر السابق' : 'Previous Month'">
                      <i class="fa-solid" :class="isRtl ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
                    </button>
                    <button type="button" class="btn-cal-nav" @click="nextMonth" :title="isRtl ? 'الشهر القادم' : 'Next Month'">
                      <i class="fa-solid" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
                    </button>
                  </div>
                </div>

                <!-- Weekdays Header -->
                <div class="calendar-weekdays-grid">
                  <span v-for="(dayName, dIdx) in localizedWeekdays" :key="dIdx" class="cal-weekday-name">
                    {{ dayName }}
                  </span>
                </div>

                <!-- Month Days Grid -->
                <div class="calendar-days-grid">
                  <button
                    v-for="(dayItem, dKey) in calendarDays"
                    :key="dKey"
                    type="button"
                    class="cal-day-cell"
                    :class="{
                      'is-empty': !dayItem.dateStr,
                      'is-past': dayItem.isPast,
                      'is-today': dayItem.isToday,
                      'is-selected': dayItem.isSelected,
                      'is-available': !dayItem.isPast && dayItem.dateStr
                    }"
                    :disabled="dayItem.isPast || !dayItem.dateStr"
                    @click="selectCalendarDate(dayItem.dateStr)"
                  >
                    <span class="day-number">{{ dayItem.dayNum }}</span>
                    <span v-if="!dayItem.isPast && dayItem.dateStr" class="availability-dot"></span>
                    <span v-if="dayItem.isSelected" class="selected-glow-ring"></span>
                  </button>
                </div>

                <!-- Selected Date Info Pill -->
                <div class="selected-date-indicator">
                  <i class="fa-solid fa-calendar-check text-cyan"></i>
                  <span>{{ isRtl ? 'اليوم المحدد للمعاينة:' : 'Selected Inspection Date:' }}</span>
                  <strong class="selected-date-text">{{ formattedSelectedDate }}</strong>
                </div>
              </div>

              <!-- Time Slots Selector (اختيار الفترات الزمنية) -->
              <div class="time-slots-container">
                <div class="time-slots-header">
                  <label class="config-sub-label">
                    <i class="fa-regular fa-clock"></i>
                    <span>{{ isRtl ? 'الفترات الزمنية المتاحة لدى الوسيط' : 'Available Time Slots' }}</span>
                  </label>
                  <span class="slots-guarantee-badge">
                    <i class="fa-solid fa-bolt"></i> {{ isRtl ? 'تأكيد فوري' : 'Instant Confirmation' }}
                  </span>
                </div>

                <!-- Morning Slots -->
                <div class="slots-group">
                  <span class="slots-group-title">
                    <i class="fa-regular fa-sun"></i> {{ isRtl ? 'الفترة الصباحية' : 'Morning Slots' }}
                  </span>
                  <div class="slots-buttons-row">
                    <button
                      v-for="slot in morningSlots"
                      :key="slot.id"
                      type="button"
                      class="time-slot-btn"
                      :class="{ active: selectedTimeSlot === slot.id }"
                      @click="selectedTimeSlot = slot.id"
                    >
                      <i class="fa-regular fa-clock"></i>
                      <span>{{ isRtl ? slot.labelAr : slot.labelEn }}</span>
                      <span v-if="slot.popular" class="popular-slot-tag">{{ isRtl ? 'شائع' : 'Popular' }}</span>
                    </button>
                  </div>
                </div>

                <!-- Afternoon / Evening Slots -->
                <div class="slots-group">
                  <span class="slots-group-title">
                    <i class="fa-solid fa-cloud-sun"></i> {{ isRtl ? 'فترة بعد الظهر والمساء' : 'Afternoon & Evening Slots' }}
                  </span>
                  <div class="slots-buttons-row">
                    <button
                      v-for="slot in afternoonSlots"
                      :key="slot.id"
                      type="button"
                      class="time-slot-btn"
                      :class="{ active: selectedTimeSlot === slot.id }"
                      @click="selectedTimeSlot = slot.id"
                    >
                      <i class="fa-regular fa-clock"></i>
                      <span>{{ isRtl ? slot.labelAr : slot.labelEn }}</span>
                      <span v-if="slot.popular" class="popular-slot-tag">{{ isRtl ? 'شائع' : 'Popular' }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Viewing Notes / Special Requests -->
              <div class="viewing-notes-box">
                <label class="config-sub-label" for="notesTextarea">
                  <i class="fa-regular fa-comment-dots"></i>
                  <span>{{ isRtl ? 'ملاحظات أو طلبات خاصة بالمعاينة (اختياري)' : 'Special Requests or Viewing Notes (Optional)' }}</span>
                </label>
                <textarea
                  id="notesTextarea"
                  v-model="viewingNotes"
                  class="custom-notes-textarea"
                  rows="2"
                  :placeholder="isRtl ? 'مثال: يرجى التنسيق المسبق مع حارس المبنى، أو اصطحاب مهندس ديكور...' : 'e.g., Please coordinate access with building security, or request floor plans...'"
                ></textarea>
              </div>

              <!-- Assigned Verified Consultant Mini-Badge -->
              <div class="assigned-agent-bar">
                <div class="agent-avatar-wrap">
                  <img src="/images/1.png" alt="Agent" class="agent-avatar-img" @error="onAvatarError" />
                  <span class="agent-status-online"></span>
                </div>
                <div class="agent-info-text">
                  <div class="agent-name-row">
                    <strong>{{ isRtl ? 'مستشار المعاينة المخصص: م. طارق الخالدي' : 'Assigned Agent: Tariq Al-Khalidi' }}</strong>
                    <span class="agent-rating-chip"><i class="fa-solid fa-star"></i> 4.9 (120+ tours)</span>
                  </div>
                  <p class="agent-role-sub">{{ isRtl ? 'وسيط عقاري معتمد • يتواجد في الموقع قبل الموعد بـ 15 دقيقة' : 'Certified Luxury Specialist • On-site 15 mins prior' }}</p>
                </div>
              </div>
            </div>

            <!-- 3. Deposit Booking Payment Explanation Banner (توضيح العربون المقيد) -->
            <div class="deposit-guarantee-banner">
              <div class="deposit-banner-left">
                <div class="deposit-shield-icon">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
              </div>
              <div class="deposit-banner-body">
                <div class="deposit-banner-head">
                  <h4 class="deposit-title">{{ isRtl ? 'دفع العربون المقيد ($300) لحجز العقار وتأكيد المعاينة' : 'Reservation Deposit ($300) - 100% Refundable' }}</h4>
                  <span class="deposit-badge">{{ isRtl ? 'عربون رمزي' : 'Symbolic Deposit' }}</span>
                </div>
                <p class="deposit-desc">
                  {{ isRtl 
                    ? 'يتم دفع عربون رمزي بقيمة $300 فقط لحجز العقار حصرياً لمدة 7 أيام وتأكيد موعد المعاينة وتفريغ المستشار المعتمد، بدلاً من دفع قيمة العقار الكاملة الآن.' 
                    : 'A symbolic $300 deposit secures the property exclusively for 7 days and confirms your VIP inspection appointment, rather than paying the full property price today.' 
                  }}
                </p>
                <div class="deposit-highlights">
                  <div class="highlight-item">
                    <i class="fa-solid fa-circle-check text-cyan"></i>
                    <span>{{ isRtl ? 'مسترد بالكامل 100% في حال عدم الشراء' : '100% Fully Refundable if not purchased' }}</span>
                  </div>
                  <div class="highlight-item">
                    <i class="fa-solid fa-circle-check text-cyan"></i>
                    <span>{{ isRtl ? 'يُخصم من القيمة الإجمالية عند إتمام الصفقة' : 'Deducted from total price upon closing' }}</span>
                  </div>
                  <div class="highlight-item">
                    <i class="fa-solid fa-circle-check text-cyan"></i>
                    <span>{{ isRtl ? 'حساب وسيط آمن ومحمي (Escrow Protection)' : 'Secured under regulated Escrow account' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. Form Card: Multiple Payment Methods, Card Details, Billing -->
            <div class="payment-form-card">
              <!-- Section 1: Payment Method Selection -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon-badge">
                    <i class="fa-solid fa-credit-card"></i>
                  </div>
                  <div class="section-title-wrap">
                    <h3 class="section-title">{{ isRtl ? 'طريقة دفع العربون' : 'Payment Method' }}</h3>
                    <p class="section-subtitle">{{ isRtl ? 'اختر طريقة الدفع المناسبة لسداد العربون ($330)' : 'Choose your preferred payment method for the $330 deposit' }}</p>
                  </div>
                </div>

                <!-- Payment Method Selector Buttons -->
                <div class="payment-methods-grid">
                  <!-- Method 1: Credit / Debit Card -->
                  <button
                    type="button"
                    class="payment-method-option"
                    :class="{ selected: selectedPaymentMethod === 'card' }"
                    @click="selectedPaymentMethod = 'card'"
                  >
                    <div class="method-icons-wrap card-icons">
                      <span class="badge-visa">VISA</span>
                      <span class="badge-mc">
                        <span class="mc-red"></span>
                        <span class="mc-orange"></span>
                      </span>
                    </div>
                    <span class="method-name">{{ isRtl ? 'بطاقة ائتمان / مدى' : 'Credit / Debit Card' }}</span>
                  </button>

                  <!-- Method 2: Apple Pay -->
                  <button
                    type="button"
                    class="payment-method-option"
                    :class="{ selected: selectedPaymentMethod === 'apple' }"
                    @click="selectedPaymentMethod = 'apple'"
                  >
                    <div class="method-icons-wrap apple-icon">
                      <i class="fa-brands fa-apple"></i>
                      <span class="pay-text">Pay</span>
                    </div>
                    <span class="method-name">Apple Pay</span>
                  </button>

                  <!-- Method 3: Google Pay -->
                  <button
                    type="button"
                    class="payment-method-option"
                    :class="{ selected: selectedPaymentMethod === 'google' }"
                    @click="selectedPaymentMethod = 'google'"
                  >
                    <div class="method-icons-wrap google-icon">
                      <i class="fa-brands fa-google"></i>
                      <span class="pay-text">Pay</span>
                    </div>
                    <span class="method-name">Google Pay</span>
                  </button>

                  <!-- Method 4: PayPal -->
                  <button
                    type="button"
                    class="payment-method-option"
                    :class="{ selected: selectedPaymentMethod === 'paypal' }"
                    @click="selectedPaymentMethod = 'paypal'"
                  >
                    <div class="method-icons-wrap paypal-icon">
                      <i class="fa-brands fa-paypal"></i>
                    </div>
                    <span class="method-name">PayPal</span>
                  </button>
                </div>
              </div>

              <!-- Section 2: Card Details (Shown for Credit / Debit Card) -->
              <div v-if="selectedPaymentMethod === 'card'" class="form-section">
                <div class="section-header">
                  <div class="section-icon-badge">
                    <i class="fa-solid fa-lock"></i>
                  </div>
                  <div class="section-title-wrap">
                    <h3 class="section-title">{{ isRtl ? 'بيانات البطاقة' : 'Card Details' }}</h3>
                    <p class="section-subtitle">{{ isRtl ? 'معلومات الدفع الخاصة بك مشفرة وآمنة بنسبة 100% عبر SSL 256-bit.' : 'Your card information is encrypted and 100% secure.' }}</p>
                  </div>
                </div>

                <div class="inputs-container">
                  <!-- Cardholder Name -->
                  <div class="input-field-group">
                    <label class="input-label" for="cardHolder">{{ isRtl ? 'اسم حامل البطاقة' : 'Cardholder Name' }}</label>
                    <div class="input-with-icon-wrap">
                      <input
                        id="cardHolder"
                        type="text"
                        class="clean-input"
                        :placeholder="isRtl ? 'الاسم كما يظهر على البطاقة' : 'Full Name on Card'"
                        v-model="cardForm.cardHolder"
                      />
                      <span class="field-icon">
                        <i class="fa-regular fa-user"></i>
                      </span>
                    </div>
                  </div>

                  <!-- Card Number -->
                  <div class="input-field-group">
                    <label class="input-label" for="cardNumber">{{ isRtl ? 'رقم البطاقة' : 'Card Number' }}</label>
                    <div class="input-with-icon-wrap" :class="{ error: errors.cardNumber }">
                      <input
                        id="cardNumber"
                        type="text"
                        inputmode="numeric"
                        class="clean-input"
                        placeholder="1234 5678 8012 3458"
                        :value="cardForm.cardNumber"
                        @input="handleCardNumberInput"
                        maxlength="19"
                      />
                      <span class="field-icon card-type-icon">
                        <i :class="detectedCardIcon"></i>
                      </span>
                    </div>
                    <span v-if="errors.cardNumber" class="field-error-text">{{ errors.cardNumber }}</span>
                  </div>

                  <!-- Expiry Date & Security Code (CVC) -->
                  <div class="two-cols-row">
                    <div class="input-field-group">
                      <label class="input-label" for="expiryDate">{{ isRtl ? 'تاريخ الانتهاء' : 'Expiry Date' }}</label>
                      <div class="input-with-icon-wrap" :class="{ error: errors.expiryDate }">
                        <input
                          id="expiryDate"
                          type="text"
                          inputmode="numeric"
                          class="clean-input"
                          placeholder="MM/YY"
                          :value="cardForm.expiryDate"
                          @input="handleExpiryInput"
                          maxlength="5"
                        />
                        <span class="field-icon">
                          <i class="fa-regular fa-calendar"></i>
                        </span>
                      </div>
                      <span v-if="errors.expiryDate" class="field-error-text">{{ errors.expiryDate }}</span>
                    </div>

                    <div class="input-field-group">
                      <label class="input-label" for="cvc">{{ isRtl ? 'رمز الأمان (CVC)' : 'Security Code (CVC)' }}</label>
                      <div class="input-with-icon-wrap" :class="{ error: errors.cvc }">
                        <input
                          id="cvc"
                          type="password"
                          inputmode="numeric"
                          class="clean-input"
                          placeholder="123"
                          :value="cardForm.cvc"
                          @input="handleCvcInput"
                          maxlength="4"
                        />
                        <span class="field-icon" :title="isRtl ? '3 أو 4 أرقام خلف البطاقة' : '3 or 4 digits on back of card'">
                          <i class="fa-solid fa-circle-info"></i>
                        </span>
                      </div>
                      <span v-if="errors.cvc" class="field-error-text">{{ errors.cvc }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Alt Payment Method Info (PayPal / Apple / Google) -->
              <div v-else class="form-section alt-method-section">
                <div class="alt-method-box">
                  <div class="alt-method-icon">
                    <i v-if="selectedPaymentMethod === 'paypal'" class="fa-brands fa-paypal text-cyan"></i>
                    <i v-else-if="selectedPaymentMethod === 'apple'" class="fa-brands fa-apple text-cyan"></i>
                    <i v-else class="fa-brands fa-google text-cyan"></i>
                  </div>
                  <div class="alt-method-details">
                    <h4>{{ selectedMethodTitle }}</h4>
                    <p>
                      {{ isRtl ? 'سيتم توجيهك بأمان لتأكيد دفع العربون ($330) وتثبيت الموعد بضغطة واحدة.' : 'You will be securely redirected to authenticate and complete your $330 deposit instantly.' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Section 3: Billing & Confirmation Contact Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon-badge">
                    <i class="fa-solid fa-id-card"></i>
                  </div>
                  <div class="section-title-wrap">
                    <h3 class="section-title">{{ isRtl ? 'بيانات التواصل وتأكيد الحجز' : 'Contact & Confirmation Details' }}</h3>
                    <p class="section-subtitle">{{ isRtl ? 'سنرسل تفاصيل موعد المعاينة وإيصال العربون عبر الرسائل والبريد.' : 'We will send your inspection pass and deposit receipt to these contacts.' }}</p>
                  </div>
                </div>

                <div class="inputs-container">
                  <div class="two-cols-row">
                    <!-- Phone Number with Country Flag Selector -->
                    <div class="input-field-group">
                      <label class="input-label" for="phoneInput">{{ isRtl ? 'رقم الهاتف (واتساب)' : 'Phone Number (WhatsApp)' }}</label>
                      <div class="phone-input-combined" :class="{ error: errors.phone }">
                        <div class="country-prefix-select-wrap">
                          <select v-model="selectedCountryCode" class="country-prefix-select" aria-label="Country Code">
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+966">🇸🇦 +966</option>
                            <option value="+970">🇵🇸 +970</option>
                            <option value="+962">🇯🇴 +962</option>
                            <option value="+20">🇪🇬 +20</option>
                            <option value="+1">🇺🇸 +1</option>
                            <option value="+44">🇬🇧 +44</option>
                          </select>
                        </div>
                        <input
                          id="phoneInput"
                          type="tel"
                          class="clean-input phone-number-input"
                          placeholder="50 123 4567"
                          v-model="billingForm.phone"
                        />
                      </div>
                      <span v-if="errors.phone" class="field-error-text">{{ errors.phone }}</span>
                    </div>

                    <!-- Email Address -->
                    <div class="input-field-group">
                      <label class="input-label" for="emailInput">{{ isRtl ? 'البريد الإلكتروني' : 'Email Address' }}</label>
                      <div class="input-with-icon-wrap" :class="{ error: errors.email }">
                        <input
                          id="emailInput"
                          type="email"
                          class="clean-input"
                          placeholder="client@vibelocate.ai"
                          v-model="billingForm.email"
                        />
                        <span class="field-icon">
                          <i class="fa-regular fa-envelope"></i>
                        </span>
                      </div>
                      <span v-if="errors.email" class="field-error-text">{{ errors.email }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 5. Primary Action & Confirmation Button (زر التأكيد والدفع بأسلوب VibeLocate AI) -->
              <div class="payment-action-area">
                <button
                  type="button"
                  class="btn-pay-deposit-action"
                  :disabled="isProcessing"
                  @click="processPayment"
                >
                  <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else class="fa-solid fa-lock"></i>
                  <span class="btn-main-label">
                    {{ isProcessing 
                      ? (isRtl ? 'جاري معالجة الدفع وتثبيت الموعد...' : 'Processing Secure Payment...') 
                      : (isRtl ? 'دفع عربون 330$ وتأكيد موعد المعاينة' : 'Pay $330 Deposit & Confirm Viewing Appointment') 
                    }}
                  </span>
                  <i v-if="!isProcessing" class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>

                <div class="security-disclaimer">
                  <div class="disclaimer-chip">
                    <i class="fa-solid fa-shield-halved text-cyan"></i>
                    <span>{{ isRtl ? 'دفع مشفر 256-Bit SSL • العربون مسترد 100% • تأكيد فوري' : '256-Bit SSL Encrypted • 100% Refundable Deposit • Instant Tour Confirmation' }}</span>
                  </div>
                  <p class="disclaimer-note">
                    {{ isRtl 
                      ? 'ملاحظة: المطلوب دفعه الآن هو مبلغ العربون ورسوم الخدمة ($330 فقط)، ولا يُخصم سعر العقار الإجمالي.' 
                      : 'Note: You are only charged $330 today (Deposit + Service Fee). The full property value is NOT charged.' 
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== RIGHT COLUMN: ORDER SUMMARY ==================== -->
          <div class="unified-sidebar-column">
            <div class="summary-card">
              <div class="summary-header">
                <h2 class="summary-title">{{ isRtl ? 'ملخص الفاتورة' : 'Order Summary' }}</h2>
                <p class="summary-subtitle">{{ isRtl ? 'تفاصيل حجز المعاينة والعربون المطلوب دفعه الآن' : 'Inspection booking & deposit payment breakdown' }}</p>
              </div>

              <!-- Property Mini Overview Card -->
              <div class="property-preview-box">
                <img
                  class="property-preview-thumb"
                  :src="propertyData.image"
                  :alt="propertyData.title"
                  @error="onImageFallback"
                />
                <div class="property-preview-info">
                  <span class="prop-type-badge-mini">{{ propertyData.type }}</span>
                  <h3 class="property-preview-title">{{ isRtl ? propertyData.arTitle : propertyData.title }}</h3>
                  <p class="property-preview-location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ propertyData.location }}</span>
                  </p>
                  <div class="property-preview-specs">
                    <span><i class="fa-solid fa-bed"></i> {{ propertyData.beds }} {{ isRtl ? 'غرف' : 'Beds' }}</span>
                    <span><i class="fa-solid fa-bath"></i> {{ propertyData.baths }} {{ isRtl ? 'حمامات' : 'Baths' }}</span>
                    <span><i class="fa-solid fa-vector-square"></i> {{ propertyData.sqm }} m²</span>
                  </div>
                </div>
              </div>

              <!-- Selected Appointment Summary Badge (معلومات الموعد المختار) -->
              <div class="appointment-summary-pill">
                <div class="app-summary-icon">
                  <i class="fa-regular fa-calendar-check"></i>
                </div>
                <div class="app-summary-details">
                  <span class="app-summary-title">{{ isRtl ? 'موعد المعاينة المختار:' : 'Selected Viewing Time:' }}</span>
                  <strong class="app-summary-datetime">{{ formattedSelectedDate }} • {{ selectedTimeSlot }}</strong>
                  <span class="app-summary-mode">
                    {{ inspectionType === 'in_person' ? (isRtl ? '🏢 معاينة حضورية مع المستشار' : '🏢 In-Person Guided Tour') : (isRtl ? '📹 جولة افتراضية مباشرة 3D' : '📹 Live 3D Virtual Tour') }}
                  </span>
                </div>
              </div>

              <!-- Order Summary Cost Breakdown (ملخص الفاتورة الدقيق وفق المستند) -->
              <div class="cost-breakdown-list">
                <!-- Reference property value -->
                <div class="cost-row reference-row">
                  <span class="cost-label">
                    {{ isRtl ? 'قيمة العقار الإجمالية' : 'Property Full Value' }}
                    <span class="cost-subtext">({{ isRtl ? 'مرجع إجمالي' : 'Total Reference' }})</span>
                  </span>
                  <span class="cost-value muted-val">${{ propertyData.price.toLocaleString() }}</span>
                </div>

                <div class="cost-divider light"></div>

                <!-- 1. Reservation Deposit: $300 -->
                <div class="cost-row highlight-deposit-row">
                  <div class="cost-label-with-icon">
                    <i class="fa-solid fa-bookmark text-cyan"></i>
                    <span class="cost-label">
                      {{ isRtl ? 'قيمة عربون الحجز' : 'Reservation Deposit' }}
                      <span class="cost-subtext">({{ isRtl ? 'لحجز العقار وتأكيد الجدية' : 'Secures property for 7 days' }})</span>
                    </span>
                  </div>
                  <span class="cost-value highlight-cyan">${{ depositAmount }}</span>
                </div>

                <!-- 2. Service & Inspection Fee: $30 -->
                <div class="cost-row">
                  <div class="cost-label-with-icon">
                    <i class="fa-solid fa-user-tie text-cyan"></i>
                    <span class="cost-label">
                      {{ isRtl ? 'رسوم الخدمة والمعاينة' : 'Service & Inspection Fee' }}
                      <span class="cost-subtext">({{ isRtl ? 'مرافقة الوكيل والجدولة' : 'Agent escort & scheduling' }})</span>
                    </span>
                  </div>
                  <span class="cost-value">${{ serviceFee }}</span>
                </div>

                <!-- 3. Taxes & VAT 0% -->
                <div class="cost-row">
                  <span class="cost-label">
                    {{ isRtl ? 'الضرائب (VAT 0%)' : 'Taxes (VAT 0%)' }}
                  </span>
                  <span class="cost-value">$0.00</span>
                </div>

                <div class="cost-divider"></div>

                <!-- 4. Total Due Today: $330 -->
                <div class="cost-row total-row-today">
                  <div class="total-label-wrap">
                    <span class="total-label">{{ isRtl ? 'المجموع الكلي المطلوب دفعه الآن' : 'Total Due Today' }}</span>
                    <span class="total-subtext">{{ isRtl ? 'يشمل العربون ورسوم المعاينة' : 'Includes deposit & inspection fee' }}</span>
                  </div>
                  <div class="total-price-wrap">
                    <span class="total-amount">${{ totalDueToday }}</span>
                    <span class="currency-tag">USD</span>
                  </div>
                </div>
              </div>

              <!-- Clarification Notice -->
              <div class="balance-due-note">
                <i class="fa-solid fa-circle-info"></i>
                <p>
                  {{ isRtl 
                    ? `المبلغ المتبقي ($${(propertyData.price - depositAmount).toLocaleString()}) يُسدد فقط عند توقيع العقد النهائي ونقل الملكية لدى دائرة الأراضي.` 
                    : `Remaining balance ($${(propertyData.price - depositAmount).toLocaleString()}) is paid only upon final contract signing at Land Department.` 
                  }}
                </p>
              </div>

              <!-- Safe & Secure Highlight Box -->
              <div class="safe-secure-banner">
                <div class="safe-icon-circle">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div class="safe-text-wrap">
                  <h4 class="safe-title">{{ isRtl ? 'ضمان الأمان واسترداد العربون' : '100% Deposit Guarantee' }}</h4>
                  <p class="safe-desc">
                    {{ isRtl 
                      ? 'العربون مسترد بالكامل في حال قررت عدم الشراء بعد المعاينة، أو يُخصم من ثمن العقار.' 
                      : 'The deposit is 100% refundable if you choose not to proceed after viewing.' 
                    }}
                  </p>
                </div>
              </div>

              <!-- Security Checklist -->
              <ul class="security-checklist">
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'تشفير مصرفي آمن 256-bit SSL' : 'Bank-grade 256-bit SSL encryption' }}</span>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'حساب ضمان محمي (Escrow Protection)' : 'Escrow protected deposit vault' }}</span>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'تأكيد فوري وجدولة في روزنامة الوكيل' : 'Instant calendar synchronization' }}</span>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'دعم واستشارات مجانية 24/7' : '24/7 dedicated concierge support' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ==================== STEP 3: CONFIRMATION STATE (عند اكتمال الدفع) ==================== -->
        <div v-else-if="currentStep === 3" class="confirmation-container">
          <div class="confirmation-card">
            <div class="conf-success-icon-wrap">
              <i class="fa-solid fa-check"></i>
            </div>

            <span class="conf-badge">{{ isRtl ? 'تم تأكيد موعد المعاينة وحجز العقار' : 'VIEWING APPOINTMENT CONFIRMED' }}</span>
            <h2 class="conf-title">{{ isRtl ? 'تهانينا! تم تأكيد موعدك وحجز العربون بنجاح' : 'Congratulations! Your Inspection is Confirmed' }}</h2>
            <p class="conf-subtitle">
              {{ isRtl 
                ? `تم إرسال بطاقة تصريح المعاينة وإيصال سداد العربون إلى البريد الإلكتروني ${billingForm.email} ورسالة واتساب على ${selectedCountryCode} ${billingForm.phone}` 
                : `Your viewing pass & receipt have been sent to ${billingForm.email} and WhatsApp on ${selectedCountryCode} ${billingForm.phone}` 
              }}
            </p>

            <div class="conf-receipt-box">
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'رقم الحجز والمعاملة' : 'Booking Reference ID' }}</span>
                <span class="receipt-val mono">{{ transactionId }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'العقار المحجوز' : 'Reserved Property' }}</span>
                <span class="receipt-val bold">{{ isRtl ? propertyData.arTitle : propertyData.title }} - {{ propertyData.location }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'موعد المعاينة المؤكد' : 'Confirmed Inspection' }}</span>
                <span class="receipt-val highlight-cyan">
                  <i class="fa-regular fa-calendar-check"></i> {{ formattedSelectedDate }} • {{ selectedTimeSlot }}
                </span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'نوع المعاينة' : 'Inspection Mode' }}</span>
                <span class="receipt-val">
                  {{ inspectionType === 'in_person' ? (isRtl ? 'معاينة ميدانية حضورية' : 'In-Person Guided Tour') : (isRtl ? 'جولة افتراضية مباشرة 3D' : 'Live 3D Virtual Tour') }}
                </span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'المستشار العقاري المرافق' : 'Assigned Specialist' }}</span>
                <span class="receipt-val">{{ isRtl ? 'م. طارق الخالدي (+971 50 123 4567)' : 'Tariq Al-Khalidi (+971 50 123 4567)' }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'طريقة السداد' : 'Payment Method' }}</span>
                <span class="receipt-val">{{ selectedMethodTitle }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'المبلغ المسدد الآن (عربون ورسوم)' : 'Amount Paid Today (Deposit + Fee)' }}</span>
                <span class="receipt-val total-highlight">${{ totalDueToday }} USD</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'حالة الحجز' : 'Status' }}</span>
                <span class="receipt-badge-active"><i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'عربون محمي بحساب ضمان • موعد مؤكد' : 'Escrow Secured • Active Confirmed' }}</span>
              </div>
            </div>

            <div class="conf-actions">
              <button type="button" class="btn-primary-conf" @click="downloadReceipt">
                <i class="fa-solid fa-file-arrow-down"></i>
                <span>{{ isRtl ? 'تحميل وثيقة المعاينة (PDF)' : 'Download Inspection Pass (PDF)' }}</span>
              </button>
              <button type="button" class="btn-calendar-conf" @click="addToCalendar">
                <i class="fa-regular fa-calendar-plus"></i>
                <span>{{ isRtl ? 'إضافة إلى تقويم Google / Apple' : 'Add to Google / Apple Calendar' }}</span>
              </button>
              <button type="button" class="btn-secondary-conf" @click="router.push('/home')">
                <i class="fa-solid fa-house"></i>
                <span>{{ t('backToHome') }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ==================== 4 TRUST BADGES ROW ==================== -->
        <div class="trust-badges-row">
          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'عربون محمي 100%' : 'Protected Deposit' }}</strong>
              <span>{{ isRtl ? 'مسترد بالكامل في حال عدم إتمام الشراء' : '100% refundable upon request' }}</span>
            </div>
          </div>

          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'تأكيد فوري للموعد' : 'Instant Booking' }}</strong>
              <span>{{ isRtl ? 'حجز وقت المستشار المعتمد حصرياً لك' : 'Direct agent calendar lock' }}</span>
            </div>
          </div>

          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-lock"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'دفع مصرفي مشفر' : 'Bank-Grade Security' }}</strong>
              <span>{{ isRtl ? 'بياناتك مشفرة ومحمية دائماً' : 'Your data is always protected' }}</span>
            </div>
          </div>

          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-award"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'عقارات موثقة رسمياً' : 'Verified Dubai Listings' }}</strong>
              <span>{{ isRtl ? 'معتمدة ومرخصة بالكامل' : 'Certified luxury properties' }}</span>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Saved Properties Modal -->
    <SavedPropertiesModal
      :is-open="isSavedModalOpen"
      @close="isSavedModalOpen = false"
    />

    <!-- Toast Notification -->
    <div class="toast-notification" :class="{ visible: toastVisible, error: toastType === 'error' }">
      <i class="fa-solid" :class="toastType === 'error' ? 'fa-circle-exclamation text-danger' : 'fa-circle-check text-cyan'"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { favoritesService } from '../services/favoritesService'
import SavedPropertiesModal from './SavedPropertiesModal.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { t, isRtl, theme: currentTheme } = useThemeAndLanguage()
const route = useRoute()
const router = useRouter()

// UI States
const isScrolled = ref(false)
const isSavedModalOpen = ref(false)
const currentStep = ref(2) // 2: Viewing & Deposit, 3: Confirmation
const isProcessing = ref(false)

// Toast State
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
  }, 4000)
}

// User Profile
const currentUser = ref(authService.getCurrentUser())
const isLoggedIn = computed(() => !!currentUser.value)

// 1. Property Data Resolution (from query, sessionStorage, or default)
let cachedProperty = null
try {
  const stored = sessionStorage.getItem('vibelocate:selected-property')
  if (stored) cachedProperty = JSON.parse(stored)
} catch {}

const propertyData = reactive({
  id: route.query.propertyId || route.params.id || cachedProperty?.id || '102',
  title: route.query.title || cachedProperty?.title || 'Modern Luxury Apartment',
  arTitle: route.query.arTitle || cachedProperty?.arTitle || 'شقة فاخرة بإطلالة مائية، دبي مارينا',
  location: route.query.location || cachedProperty?.location || cachedProperty?.area || 'Dubai Marina, Dubai, UAE',
  type: route.query.type || cachedProperty?.type || 'Apartment',
  price: Number(route.query.price || cachedProperty?.price) || 300000,
  beds: Number(route.query.beds || cachedProperty?.beds) || 2,
  baths: Number(route.query.baths || cachedProperty?.baths) || 2,
  sqm: Number(route.query.sqm || route.query.size || cachedProperty?.size || cachedProperty?.area_sqft) || 120,
  image: route.query.image || cachedProperty?.image || '/images/photo-1600585154340-be6161a56a0c.avif'
})

const onImageFallback = (e) => {
  e.target.src = '/images/photo-1600210492486-724fe5c67fb0.jfif'
}

const onAvatarError = (e) => {
  e.target.src = '/images/1.png'
}

// 2. Schedule Viewing Inspection & Calendar State
const inspectionType = ref('in_person') // 'in_person' or 'virtual_3d'
const viewingNotes = ref('')

// Interactive Calendar Engine
const now = new Date()
const calMonth = ref(now.getMonth())
const calYear = ref(now.getFullYear())

// Default selected inspection date: 3 days ahead
const defaultDate = new Date()
defaultDate.setDate(defaultDate.getDate() + 3)
const padZero = (n) => String(n).padStart(2, '0')
const selectedDate = ref(`${defaultDate.getFullYear()}-${padZero(defaultDate.getMonth() + 1)}-${padZero(defaultDate.getDate())}`)

const localizedWeekdays = computed(() => {
  return isRtl.value
    ? ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
})

const arabicMonths = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const currentMonthYearLabel = computed(() => {
  const mName = isRtl.value ? arabicMonths[calMonth.value] : englishMonths[calMonth.value]
  return `${mName} ${calYear.value}`
})

const calendarDays = computed(() => {
  const year = calYear.value
  const month = calMonth.value
  const firstDayIndex = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const todayStr = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`

  const daysArr = []

  // Empty padding for previous month offset
  for (let i = 0; i < firstDayIndex; i++) {
    daysArr.push({ dayNum: '', dateStr: null, isPast: true, isToday: false, isSelected: false })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${padZero(month + 1)}-${padZero(d)}`
    const isPast = dStr < todayStr
    const isToday = dStr === todayStr
    const isSelected = dStr === selectedDate.value

    daysArr.push({
      dayNum: d,
      dateStr: dStr,
      isPast,
      isToday,
      isSelected
    })
  }

  return daysArr
})

const prevMonth = () => {
  if (calMonth.value === 0) {
    calMonth.value = 11
    calYear.value--
  } else {
    calMonth.value--
  }
}

const nextMonth = () => {
  if (calMonth.value === 11) {
    calMonth.value = 0
    calYear.value++
  } else {
    calMonth.value++
  }
}

const goToToday = () => {
  calMonth.value = now.getMonth()
  calYear.value = now.getFullYear()
  const todayStr = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())}`
  selectedDate.value = todayStr
}

const selectCalendarDate = (dateStr) => {
  if (!dateStr) return
  selectedDate.value = dateStr
}

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const parts = selectedDate.value.split('-')
  const y = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  const dateObj = new Date(y, m, d)

  const dayOfWeekName = isRtl.value
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][dateObj.getDay()]
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dateObj.getDay()]

  const mName = isRtl.value ? arabicMonths[m] : englishMonths[m]
  return isRtl.value
    ? `${dayOfWeekName}، ${d} ${mName} ${y}`
    : `${dayOfWeekName}, ${mName} ${d}, ${y}`
})

// Time Slots
const morningSlots = [
  { id: '10:00 AM', labelEn: '10:00 AM', labelAr: '10:00 صباحاً', popular: true },
  { id: '11:30 AM', labelEn: '11:30 AM', labelAr: '11:30 صباحاً', popular: false }
]
const afternoonSlots = [
  { id: '02:30 PM', labelEn: '02:30 PM', labelAr: '02:30 ظهراً', popular: true },
  { id: '04:00 PM', labelEn: '04:00 PM', labelAr: '04:00 عصراً', popular: false },
  { id: '05:30 PM', labelEn: '05:30 PM', labelAr: '05:30 مساءً', popular: false }
]
const selectedTimeSlot = ref('10:00 AM')

// 3. Deposit & Order Summary Costs (عربون 300$ + رسوم 30$ = 330$)
const depositAmount = ref(300)
const serviceFee = ref(30)
const totalDueToday = computed(() => depositAmount.value + serviceFee.value) // 330 USD

// 4. Payment Methods & Forms
const selectedPaymentMethod = ref('card') // 'card', 'apple', 'google', 'paypal'
const selectedMethodTitle = computed(() => {
  if (selectedPaymentMethod.value === 'card') return isRtl.value ? 'بطاقة ائتمان / خصم (Visa & Mastercard & Mada)' : 'Credit / Debit Card'
  if (selectedPaymentMethod.value === 'apple') return 'Apple Pay'
  if (selectedPaymentMethod.value === 'google') return 'Google Pay'
  return 'PayPal'
})

const cardForm = reactive({
  cardHolder: currentUser.value?.name || '',
  cardNumber: '4242 4242 4242 4242',
  expiryDate: '12/28',
  cvc: '789'
})

const selectedCountryCode = ref('+971')
const billingForm = reactive({
  phone: '50 123 4567',
  email: currentUser.value?.email || 'client@vibelocate.ai'
})

const errors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  phone: '',
  email: ''
})

const transactionId = ref('VL-VIEW-' + Math.floor(100000 + Math.random() * 900000))

// Card Number Formatting
const handleCardNumberInput = (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16)
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val
  cardForm.cardNumber = formatted
  if (errors.cardNumber) errors.cardNumber = ''
}

const handleExpiryInput = (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (val.length >= 3) {
    val = val.slice(0, 2) + '/' + val.slice(2)
  }
  cardForm.expiryDate = val
  if (errors.expiryDate) errors.expiryDate = ''
}

const handleCvcInput = (e) => {
  cardForm.cvc = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (errors.cvc) errors.cvc = ''
}

const detectedCardIcon = computed(() => {
  const clean = cardForm.cardNumber.replace(/\s+/g, '')
  if (clean.startsWith('4')) return 'fa-brands fa-cc-visa text-cyan'
  if (clean.startsWith('5')) return 'fa-brands fa-cc-mastercard text-warning'
  if (clean.startsWith('3')) return 'fa-brands fa-cc-amex'
  return 'fa-regular fa-credit-card'
})

// Form Validation
const validateForm = () => {
  let isValid = true
  errors.cardNumber = ''
  errors.expiryDate = ''
  errors.cvc = ''
  errors.phone = ''
  errors.email = ''

  if (selectedPaymentMethod.value === 'card') {
    const rawCard = cardForm.cardNumber.replace(/\s+/g, '')
    if (rawCard.length < 13) {
      errors.cardNumber = isRtl.value ? 'يرجى إدخال رقم بطاقة صالح' : 'Please enter a valid card number'
      isValid = false
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.expiryDate)) {
      errors.expiryDate = isRtl.value ? 'صيغة غير صحيحة (MM/YY)' : 'Invalid format (MM/YY)'
      isValid = false
    }

    if (cardForm.cvc.length < 3) {
      errors.cvc = isRtl.value ? '3 أو 4 أرقام' : '3-4 digits'
      isValid = false
    }
  }

  if (!billingForm.phone || billingForm.phone.replace(/\D/g, '').length < 6) {
    errors.phone = isRtl.value ? 'رقم الهاتف مطلوب' : 'Phone number is required'
    isValid = false
  }

  if (!billingForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingForm.email)) {
    errors.email = isRtl.value ? 'بريد إلكتروني غير صالح' : 'Valid email required'
    isValid = false
  }

  return isValid
}

// Process Payment & Booking
const processPayment = () => {
  if (!validateForm()) {
    showToast(isRtl.value ? 'يرجى إكمال الحقول الموضحة أدناه' : 'Please complete the required fields', 'error')
    return
  }

  isProcessing.value = true

  setTimeout(() => {
    isProcessing.value = false
    currentStep.value = 3
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast(
      isRtl.value 
        ? `تم سداد العربون ($${totalDueToday.value}) وتأكيد موعد المعاينة بنجاح!` 
        : `Deposit of $${totalDueToday.value} paid and viewing appointment confirmed!`,
      'success'
    )
  }, 1200)
}

// Download Receipt / Inspection Pass
const downloadReceipt = () => {
  showToast(isRtl.value ? `تم تحميل تصريح المعاينة وإيصال العربون (${transactionId.value})` : `Viewing pass downloaded (${transactionId.value})`)
}

// Add to Calendar
const addToCalendar = () => {
  showToast(isRtl.value ? 'تمت إضافة الموعد إلى الروزنامة الخاصة بك بنجاح' : 'Viewing appointment added to your calendar')
}

// Back Navigation
const handleBack = () => {
  if (route.query.propertyId || propertyData.id) {
    router.push(`/property/${propertyData.id}`)
  } else {
    router.back()
  }
}

// Scroll Handling
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  favoritesService.syncWithBackend()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
/* ============================================================
   VIBELOCATE AI - LUXURY VIEWING DEPOSIT & INSPECTION BOOKING
   ============================================================ */

.payment-page-wrapper {
  min-height: 100vh;
  background-color: #070d19;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(0, 210, 255, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 85% 40%, rgba(14, 165, 233, 0.08) 0%, transparent 45%),
    radial-gradient(circle at 50% 90%, rgba(99, 102, 241, 0.06) 0%, transparent 55%),
    linear-gradient(180deg, #070d19 0%, #0b1528 50%, #070d19 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #f1f5f9;
  font-family: 'Outfit', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

[data-theme='light'] .payment-page-wrapper {
  background-color: #f8fafc;
  background-image: 
    radial-gradient(circle at 15% 10%, rgba(0, 210, 255, 0.06) 0%, transparent 45%),
    radial-gradient(circle at 85% 35%, rgba(14, 165, 233, 0.05) 0%, transparent 45%),
    radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  color: #0f172a;
}

.payment-main-container {
  flex: 1;
  padding: 36px 20px 80px;
}

.payment-content-wrapper {
  max-width: 1320px;
  margin: 0 auto;
}

/* ==================== TOP SECTION & STEPPER ==================== */
.payment-top-section {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme='light'] .payment-top-section {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.back-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #00d2ff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.back-link-btn:hover {
  color: #38bdf8;
  transform: translateX(-2px);
}

[dir="rtl"] .back-link-btn:hover {
  transform: translateX(2px);
}

.payment-page-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

[data-theme='light'] .payment-page-title {
  color: #0f172a;
}

.payment-page-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  margin: 0;
  max-width: 680px;
  line-height: 1.5;
}

/* Stepper Tracker */
.stepper-container {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme='light'] .stepper-container {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #94a3b8;
}

.step-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #94a3b8;
}

.step-item.active .step-circle {
  background: linear-gradient(135deg, #00d2ff, #0284c7);
  border-color: #00d2ff;
  color: #ffffff;
  box-shadow: 0 0 14px rgba(0, 210, 255, 0.5);
}

.step-item.active .step-label {
  color: #ffffff;
  font-weight: 700;
}

[data-theme='light'] .step-item.active .step-label {
  color: #0284c7;
}

.step-item.completed .step-circle {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #10b981;
}

.step-connector {
  width: 24px;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
}

.step-connector.active {
  background: linear-gradient(90deg, #10b981, #00d2ff);
}

/* ==================== 2-COLUMN UNIFIED GRID ==================== */
.unified-booking-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 28px;
  align-items: start;
}

@media (max-width: 1024px) {
  .unified-booking-grid {
    grid-template-columns: 1fr;
  }
}

.unified-main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ==================== 1. PROMINENT PROPERTY BANNER CARD ==================== */
.prominent-property-card {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

[data-theme='light'] .prominent-property-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.prop-banner-layout {
  display: flex;
  gap: 18px;
  align-items: center;
}

@media (max-width: 640px) {
  .prop-banner-layout {
    flex-direction: column;
    align-items: stretch;
  }
}

.prop-banner-img-wrap {
  position: relative;
  width: 180px;
  height: 120px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .prop-banner-img-wrap {
    width: 100%;
    height: 160px;
  }
}

.prop-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.prop-banner-layout:hover .prop-banner-img {
  transform: scale(1.04);
}

.prop-verified-badge {
  position: absolute;
  bottom: 8px;
  inset-inline-start: 8px;
  background: rgba(7, 13, 25, 0.85);
  backdrop-filter: blur(8px);
  color: #10b981;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.prop-banner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prop-type-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  width: fit-content;
}

.prop-title-ar {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
}

[data-theme='light'] .prop-title-ar {
  color: #0f172a;
}

.prop-title-en {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.prop-specs-tags-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.prop-price-tag-wrap {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.prop-price-label {
  font-size: 0.75rem;
  color: #64748b;
}

.prop-price-highlight {
  font-size: 1.15rem;
  font-weight: 800;
  color: #00d2ff;
}

.prop-divider {
  color: #475569;
}

.spec-tag {
  font-size: 0.8rem;
  color: #cbd5e1;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 8px;
  border-radius: 6px;
}

[data-theme='light'] .spec-tag {
  background: #f1f5f9;
  color: #475569;
}

/* ==================== 2. SCHEDULE VIEWING INSPECTION CARD ==================== */
.schedule-inspection-card {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 22px;
}

[data-theme='light'] .schedule-inspection-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.section-header-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme='light'] .section-header-row {
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.section-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 210, 255, 0.12);
  border: 1px solid rgba(0, 210, 255, 0.25);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.section-title-wrap {
  flex: 1;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

[data-theme='light'] .section-title {
  color: #0f172a;
}

.section-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

/* Inspection Mode Toggle */
.config-sub-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 10px;
}

[data-theme='light'] .config-sub-label {
  color: #334155;
}

.config-sub-label i {
  color: #00d2ff;
}

.inspection-mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 640px) {
  .inspection-mode-grid {
    grid-template-columns: 1fr;
  }
}

.mode-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
  text-align: start;
  cursor: pointer;
  transition: all 0.25s ease;
  color: inherit;
}

[data-theme='light'] .mode-card {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.mode-card:hover {
  background: rgba(0, 210, 255, 0.05);
  border-color: rgba(0, 210, 255, 0.3);
}

.mode-card.active {
  background: rgba(0, 210, 255, 0.1);
  border-color: #00d2ff;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.15);
}

.mode-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d2ff;
  font-size: 1rem;
  flex-shrink: 0;
}

.mode-card.active .mode-icon-circle {
  background: #00d2ff;
  color: #070d19;
}

.mode-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mode-text strong {
  font-size: 0.9rem;
  color: #ffffff;
}

[data-theme='light'] .mode-text strong {
  color: #0f172a;
}

.mode-text span {
  font-size: 0.74rem;
  color: #94a3b8;
  line-height: 1.3;
}

.active-check {
  color: #00d2ff;
  font-size: 1rem;
  margin-inline-start: auto;
}

/* ==================== INTERACTIVE CALENDAR ==================== */
.calendar-interactive-box {
  background: rgba(7, 13, 25, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

[data-theme='light'] .calendar-interactive-box {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.calendar-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.month-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-month-heading {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

[data-theme='light'] .calendar-month-heading {
  color: #0f172a;
}

.month-nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-cal-today {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #00d2ff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cal-today:hover {
  background: rgba(0, 210, 255, 0.15);
}

.btn-cal-nav {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cal-nav:hover {
  background: rgba(0, 210, 255, 0.15);
  color: #00d2ff;
}

.calendar-weekdays-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  text-align: center;
  margin-bottom: 6px;
}

.cal-weekday-name {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.cal-day-cell {
  position: relative;
  aspect-ratio: 1 / 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  color: inherit;
  padding: 4px;
}

[data-theme='light'] .cal-day-cell {
  background: #ffffff;
  border-color: #e2e8f0;
}

.cal-day-cell.is-empty {
  visibility: hidden;
  pointer-events: none;
}

.cal-day-cell.is-past {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
}

.cal-day-cell.is-available:hover {
  background: rgba(0, 210, 255, 0.1);
  border-color: rgba(0, 210, 255, 0.4);
  transform: translateY(-2px);
}

.cal-day-cell.is-today {
  border-color: rgba(0, 210, 255, 0.4);
  font-weight: 700;
}

.cal-day-cell.is-selected {
  background: linear-gradient(135deg, #00d2ff, #0284c7) !important;
  border-color: #38bdf8 !important;
  color: #ffffff !important;
  font-weight: 800;
  box-shadow: 0 4px 16px rgba(0, 210, 255, 0.45);
  transform: scale(1.05);
}

.cal-day-cell .day-number {
  font-size: 0.88rem;
  z-index: 2;
}

.availability-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #10b981;
  margin-top: 2px;
}

.cal-day-cell.is-selected .availability-dot {
  background: #ffffff;
}

.selected-date-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.85rem;
  color: #cbd5e1;
}

[data-theme='light'] .selected-date-indicator {
  border-top-color: rgba(0, 0, 0, 0.08);
  color: #475569;
}

.selected-date-text {
  color: #00d2ff;
  font-weight: 700;
}

/* ==================== TIME SLOTS ==================== */
.time-slots-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.time-slots-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slots-guarantee-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(16, 185, 129, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.slots-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slots-group-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
}

.slots-buttons-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.time-slot-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #cbd5e1;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

[data-theme='light'] .time-slot-btn {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #334155;
}

.time-slot-btn:hover {
  background: rgba(0, 210, 255, 0.08);
  border-color: rgba(0, 210, 255, 0.3);
  color: #ffffff;
}

.time-slot-btn.active {
  background: rgba(0, 210, 255, 0.15);
  border-color: #00d2ff;
  color: #00d2ff;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.2);
}

.popular-slot-tag {
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border-radius: 4px;
  padding: 2px 5px;
}

/* Notes Textarea */
.custom-notes-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 14px;
  color: #ffffff;
  font-family: inherit;
  font-size: 0.88rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;
}

[data-theme='light'] .custom-notes-textarea {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.custom-notes-textarea:focus {
  border-color: #00d2ff;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.15);
}

/* Assigned Agent Bar */
.assigned-agent-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 210, 255, 0.04);
  border: 1px solid rgba(0, 210, 255, 0.18);
  border-radius: 12px;
  padding: 10px 14px;
}

.agent-avatar-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.agent-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #00d2ff;
}

.agent-status-online {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #070d19;
}

.agent-info-text {
  flex: 1;
}

.agent-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.agent-name-row strong {
  font-size: 0.88rem;
  color: #ffffff;
}

[data-theme='light'] .agent-name-row strong {
  color: #0f172a;
}

.agent-rating-chip {
  font-size: 0.72rem;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  padding: 1px 6px;
  border-radius: 4px;
}

.agent-role-sub {
  font-size: 0.76rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

/* ==================== 3. DEPOSIT GUARANTEE BANNER ==================== */
.deposit-guarantee-banner {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(13, 148, 136, 0.06) 100%);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 210, 255, 0.06);
}

.deposit-shield-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00d2ff, #0284c7);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  box-shadow: 0 4px 16px rgba(0, 210, 255, 0.35);
}

.deposit-banner-body {
  flex: 1;
}

.deposit-banner-head {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.deposit-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

[data-theme='light'] .deposit-title {
  color: #0f172a;
}

.deposit-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 2px 8px;
  border-radius: 6px;
}

.deposit-desc {
  font-size: 0.88rem;
  color: #cbd5e1;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

[data-theme='light'] .deposit-desc {
  color: #475569;
}

.deposit-highlights {
  display: grid;
  grid-template-columns: 1fr;
  gap: 6px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #e2e8f0;
}

[data-theme='light'] .highlight-item {
  color: #334155;
}

/* ==================== 4. PAYMENT METHODS & FORM ==================== */
.payment-form-card {
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

[data-theme='light'] .payment-form-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

@media (max-width: 640px) {
  .payment-methods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.payment-method-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: inherit;
}

[data-theme='light'] .payment-method-option {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.payment-method-option:hover {
  background: rgba(0, 210, 255, 0.05);
  border-color: rgba(0, 210, 255, 0.3);
}

.payment-method-option.selected {
  background: rgba(0, 210, 255, 0.12);
  border-color: #00d2ff;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.2);
}

.method-icons-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  font-size: 1.15rem;
}

.card-icons {
  gap: 6px;
}

.badge-visa {
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: #3b82f6;
}

.badge-mc {
  display: inline-flex;
}

.mc-red, .mc-orange {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
}

.mc-red {
  background: #ef4444;
  margin-right: -5px;
}

.mc-orange {
  background: #f59e0b;
}

.apple-icon {
  gap: 2px;
  color: #ffffff;
}

[data-theme='light'] .apple-icon {
  color: #0f172a;
}

.pay-text {
  font-weight: 700;
  font-size: 0.85rem;
}

.google-icon {
  gap: 2px;
}

.paypal-icon {
  color: #38bdf8;
}

.method-name {
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
}

/* Card Inputs */
.inputs-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #cbd5e1;
}

[data-theme='light'] .input-label {
  color: #475569;
}

.input-with-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  transition: all 0.2s ease;
}

[data-theme='light'] .input-with-icon-wrap {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.input-with-icon-wrap:focus-within {
  border-color: #00d2ff;
  box-shadow: 0 0 12px rgba(0, 210, 255, 0.15);
}

.input-with-icon-wrap.error {
  border-color: #ef4444;
}

.clean-input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 12px 14px;
  color: #ffffff;
  font-size: 0.92rem;
  outline: none;
  font-family: inherit;
}

[data-theme='light'] .clean-input {
  color: #0f172a;
}

.field-icon {
  padding-inline-end: 14px;
  color: #64748b;
  font-size: 1rem;
}

.card-type-icon {
  font-size: 1.25rem;
}

.two-cols-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 480px) {
  .two-cols-row {
    grid-template-columns: 1fr;
  }
}

.field-error-text {
  font-size: 0.74rem;
  color: #ef4444;
}

/* Phone combined input */
.phone-input-combined {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  transition: all 0.2s ease;
}

[data-theme='light'] .phone-input-combined {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.country-prefix-select-wrap {
  border-inline-end: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 8px;
}

[data-theme='light'] .country-prefix-select-wrap {
  border-inline-end-color: #cbd5e1;
}

.country-prefix-select {
  background: transparent;
  border: none;
  color: #00d2ff;
  font-size: 0.85rem;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  padding: 10px 4px;
}

[data-theme='light'] .country-prefix-select {
  color: #0284c7;
}

.country-prefix-select option {
  background: #0f172a;
  color: #ffffff;
}

[data-theme='light'] .country-prefix-select option {
  background: #ffffff;
  color: #0f172a;
}

.phone-number-input {
  flex: 1;
}

/* Alt Payment Box */
.alt-method-box {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0, 210, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.2);
  border-radius: 14px;
  padding: 18px;
}

.alt-method-icon {
  font-size: 2rem;
  color: #00d2ff;
}

.alt-method-details h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

[data-theme='light'] .alt-method-details h4 {
  color: #0f172a;
}

.alt-method-details p {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

/* ==================== 5. CTA BUTTON & ACTIONS ==================== */
.payment-action-area {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 10px;
}

.btn-pay-deposit-action {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #00d2ff 0%, #0284c7 50%, #0369a1 100%);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 18px 24px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 24px rgba(0, 210, 255, 0.4);
}

.btn-pay-deposit-action:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(0, 210, 255, 0.55);
}

.btn-pay-deposit-action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-main-label {
  letter-spacing: 0.3px;
}

.security-disclaimer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.disclaimer-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

.disclaimer-note {
  font-size: 0.76rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* ==================== RIGHT COLUMN: ORDER SUMMARY ==================== */
.summary-card {
  position: sticky;
  top: 90px;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

[data-theme='light'] .summary-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.summary-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}

[data-theme='light'] .summary-header {
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.summary-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

[data-theme='light'] .summary-title {
  color: #0f172a;
}

.summary-subtitle {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

/* Mini Property Preview */
.property-preview-box {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px;
}

[data-theme='light'] .property-preview-box {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.property-preview-thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.property-preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.prop-type-badge-mini {
  font-size: 0.65rem;
  font-weight: 700;
  color: #00d2ff;
  text-transform: uppercase;
}

.property-preview-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
}

[data-theme='light'] .property-preview-title {
  color: #0f172a;
}

.property-preview-location {
  font-size: 0.74rem;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.property-preview-specs {
  display: flex;
  gap: 8px;
  font-size: 0.72rem;
  color: #cbd5e1;
  margin-top: 2px;
}

/* Selected Appointment Summary Badge */
.appointment-summary-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 210, 255, 0.08);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 12px;
  padding: 12px 14px;
}

.app-summary-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #00d2ff;
  color: #070d19;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.app-summary-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-summary-title {
  font-size: 0.72rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
}

.app-summary-datetime {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
}

[data-theme='light'] .app-summary-datetime {
  color: #0f172a;
}

.app-summary-mode {
  font-size: 0.74rem;
  color: #00d2ff;
  font-weight: 600;
}

/* Cost Breakdown List */
.cost-breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cost-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
}

.cost-label-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cost-label {
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
}

[data-theme='light'] .cost-label {
  color: #475569;
}

.cost-subtext {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: normal;
}

.cost-value {
  font-weight: 700;
  color: #ffffff;
}

[data-theme='light'] .cost-value {
  color: #0f172a;
}

.muted-val {
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 500;
}

.highlight-cyan {
  color: #00d2ff;
  font-size: 1.05rem;
  font-weight: 800;
}

.cost-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 4px 0;
}

.cost-divider.light {
  background: rgba(255, 255, 255, 0.05);
}

[data-theme='light'] .cost-divider {
  background: #e2e8f0;
}

/* Total row */
.total-row-today {
  padding-top: 8px;
  align-items: flex-end;
}

.total-label-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.total-label {
  font-size: 0.95rem;
  font-weight: 800;
  color: #ffffff;
}

[data-theme='light'] .total-label {
  color: #0f172a;
}

.total-subtext {
  font-size: 0.72rem;
  color: #10b981;
  font-weight: 600;
}

.total-price-wrap {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-amount {
  font-size: 1.85rem;
  font-weight: 900;
  color: #00d2ff;
  letter-spacing: -0.5px;
}

.currency-tag {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
}

/* Balance Due Note */
.balance-due-note {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.4;
}

[data-theme='light'] .balance-due-note {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #64748b;
}

.balance-due-note i {
  color: #00d2ff;
  margin-top: 2px;
}

.balance-due-note p {
  margin: 0;
}

/* Safe Secure Banner */
.safe-secure-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: 12px;
  padding: 12px;
}

.safe-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.safe-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 2px 0;
}

[data-theme='light'] .safe-title {
  color: #0f172a;
}

.safe-desc {
  font-size: 0.74rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
}

.security-checklist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.security-checklist li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: #cbd5e1;
}

[data-theme='light'] .security-checklist li {
  color: #475569;
}

.security-checklist li i {
  color: #10b981;
  font-size: 0.85rem;
}

/* ==================== STEP 3: CONFIRMATION STATE ==================== */
.confirmation-container {
  display: flex;
  justify-content: center;
  padding: 20px 0 40px;
}

.confirmation-card {
  max-width: 740px;
  width: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

[data-theme='light'] .confirmation-card {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
}

.conf-success-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 16px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.conf-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;
}

.conf-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
}

[data-theme='light'] .conf-title {
  color: #0f172a;
}

.conf-subtitle {
  font-size: 0.92rem;
  color: #94a3b8;
  max-width: 580px;
  margin: 0 auto 24px;
  line-height: 1.5;
}

.conf-receipt-box {
  background: rgba(7, 13, 25, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 28px;
  text-align: start;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

[data-theme='light'] .conf-receipt-box {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.receipt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
}

.receipt-label {
  color: #94a3b8;
}

.receipt-val {
  color: #ffffff;
  font-weight: 600;
}

[data-theme='light'] .receipt-val {
  color: #0f172a;
}

.receipt-val.bold {
  font-weight: 700;
}

.receipt-val.mono {
  font-family: monospace;
  color: #00d2ff;
  font-size: 0.95rem;
}

.receipt-badge-active {
  color: #10b981;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.conf-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary-conf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #00d2ff, #0284c7);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 14px 22px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 210, 255, 0.35);
}

.btn-primary-conf:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 210, 255, 0.5);
}

.btn-calendar-conf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #10b981;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-calendar-conf:hover {
  background: rgba(16, 185, 129, 0.25);
  transform: translateY(-2px);
}

.btn-secondary-conf {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  border-radius: 12px;
  padding: 14px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-secondary-conf:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* ==================== 4 TRUST BADGES ROW ==================== */
.trust-badges-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 48px;
}

@media (max-width: 900px) {
  .trust-badges-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .trust-badges-row {
    grid-template-columns: 1fr;
  }
}

.trust-badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px;
}

[data-theme='light'] .trust-badge-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.trust-badge-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.trust-badge-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trust-badge-info strong {
  font-size: 0.88rem;
  color: #ffffff;
}

[data-theme='light'] .trust-badge-info strong {
  color: #0f172a;
}

.trust-badge-info span {
  font-size: 0.74rem;
  color: #94a3b8;
}

/* ==================== TOAST NOTIFICATION ==================== */
.toast-notification {
  position: fixed;
  bottom: 28px;
  inset-inline-end: 28px;
  background: #0f172a;
  color: #ffffff;
  border: 1px solid rgba(0, 210, 255, 0.3);
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  z-index: 100000;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-notification.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.toast-notification.error {
  border-color: #ef4444;
}

.text-cyan {
  color: #00d2ff;
}

.text-danger {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}
</style>
