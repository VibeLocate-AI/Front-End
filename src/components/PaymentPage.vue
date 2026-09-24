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
            <h1 class="payment-page-title">{{ isRtl ? 'تأكيد حجز العقار والدفع الآمن' : 'Secure Payment & Property Booking' }}</h1>
            <p class="payment-page-subtitle">{{ isRtl ? 'راجع تفاصيل العقار وتكلفة الحجز وأكمل الدفع بأمان.' : 'Review property details, reservation cost, and complete your payment securely.' }}</p>
          </div>

          <!-- Stepper Progress Tracker -->
          <div class="stepper-container">
            <!-- Step 1: البيانات (Details) -->
            <div class="step-item completed">
              <div class="step-circle">
                <i class="fa-solid fa-check"></i>
              </div>
              <span class="step-label">{{ isRtl ? 'البيانات' : 'Details' }}</span>
            </div>

            <div class="step-connector" :class="{ active: currentStep >= 2 }"></div>

            <!-- Step 2: الحجز والدفع (Booking & Payment) -->
            <div class="step-item" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
              <div class="step-circle">
                <i v-if="currentStep > 2" class="fa-solid fa-check"></i>
                <span v-else>2</span>
              </div>
              <span class="step-label">{{ isRtl ? 'الحجز والدفع' : 'Payment' }}</span>
            </div>

            <div class="step-connector" :class="{ active: currentStep >= 3 }"></div>

            <!-- Step 3: التأكيد (Confirmation) -->
            <div class="step-item" :class="{ active: currentStep === 3 }">
              <div class="step-circle">
                <span>3</span>
              </div>
              <span class="step-label">{{ isRtl ? 'التأكيد' : 'Confirmation' }}</span>
            </div>
          </div>
        </div>

        <!-- ==================== STEP 2: MAIN 2-COLUMN GRID ==================== -->
        <div v-if="currentStep === 2" class="unified-booking-grid">
          <!-- ==================== LEFT COLUMN ==================== -->
          <div class="unified-main-column">
            <!-- 1. Prominent Property Summary Card (دمج ملخص العقار في الزاوية العلوية اليسرى) -->
            <div class="prominent-property-card">
              <div class="prop-banner-layout">
                <div class="prop-banner-img-wrap">
                  <img
                    class="prop-banner-img"
                    :src="propertyData.image"
                    :alt="propertyData.title"
                    @error="onImageFallback"
                  >
                  <span class="prop-verified-badge">
                    <i class="fa-solid fa-shield-halved"></i> {{ isRtl ? 'عقار موثق' : 'Verified' }}
                  </span>
                </div>

                <div class="prop-banner-info">
                  <div class="prop-banner-head">
                    <h2 class="prop-title-ar">{{ propertyData.arTitle }}</h2>
                    <p class="prop-title-en">{{ propertyData.title }}, {{ propertyData.location }}</p>
                  </div>

                  <div class="prop-specs-tags-row">
                    <span class="prop-price-highlight">${{ propertyData.price.toLocaleString() }}</span>
                    <span class="prop-divider">•</span>
                    <span class="spec-tag"><i class="fa-solid fa-bed"></i> {{ propertyData.beds }} {{ isRtl ? 'غرف' : 'Beds' }}</span>
                    <span class="spec-tag"><i class="fa-solid fa-bath"></i> {{ propertyData.baths }} {{ isRtl ? 'حمامات' : 'Baths' }}</span>
                    <span class="spec-tag"><i class="fa-solid fa-vector-square"></i> {{ propertyData.sqm }} m²</span>
                  </div>

                  <!-- 2. Stay Dates & Guests Selector (دمج تفاصيل الحجز: تواريخ الإقامة وعدد الضيوف) -->
                  <div class="stay-booking-config-bar">
                    <!-- Stay Dates -->
                    <div class="config-item dates-item">
                      <label class="config-item-label">
                        <i class="fa-regular fa-calendar-days"></i>
                        <span>{{ isRtl ? 'تواريخ الإقامة' : 'Stay Dates' }}</span>
                      </label>
                      <div class="date-pickers-pair">
                        <div class="date-box">
                          <span class="date-label-sub">{{ isRtl ? 'الوصول' : 'Check-in' }}</span>
                          <input
                            type="date"
                            v-model="bookingForm.checkIn"
                            class="custom-date-input"
                            aria-label="Check-in date"
                          >
                        </div>
                        <span class="date-arrow-separator">➔</span>
                        <div class="date-box">
                          <span class="date-label-sub">{{ isRtl ? 'المغادرة' : 'Check-out' }}</span>
                          <input
                            type="date"
                            v-model="bookingForm.checkOut"
                            class="custom-date-input"
                            aria-label="Check-out date"
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Number of Guests -->
                    <div class="config-item guests-item">
                      <label class="config-item-label">
                        <i class="fa-solid fa-users"></i>
                        <span>{{ isRtl ? 'عدد الضيوف' : 'Guests' }}</span>
                      </label>
                      <div class="guests-selector-pills">
                        <button
                          type="button"
                          class="guest-pill"
                          :class="{ active: bookingForm.guests === 1 }"
                          @click="bookingForm.guests = 1"
                        >
                          <i class="fa-solid fa-user"></i>
                          <span>1</span>
                        </button>
                        <button
                          type="button"
                          class="guest-pill"
                          :class="{ active: bookingForm.guests === 2 }"
                          @click="bookingForm.guests = 2"
                        >
                          <span>2</span>
                        </button>
                        <button
                          type="button"
                          class="guest-pill"
                          :class="{ active: bookingForm.guests >= 3 }"
                          @click="bookingForm.guests = 3"
                        >
                          <span>3+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Form Card: Multiple Payment Methods, Card Details, Billing -->
            <div class="payment-form-card">
              <!-- Section 1: Payment Method Selection (الحفاظ على طرق الدفع المتعددة في المنتصف) -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon-badge">
                    <i class="fa-solid fa-credit-card"></i>
                  </div>
                  <div class="section-title-wrap">
                    <h3 class="section-title">{{ isRtl ? 'طريقة الدفع' : 'Payment Method' }}</h3>
                    <p class="section-subtitle">{{ isRtl ? 'اختر طريقة الدفع المفضلة لديك' : 'Choose your preferred payment method' }}</p>
                  </div>
                </div>

                <!-- 4 Payment Method Selector Buttons -->
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
                    <span class="method-name">{{ isRtl ? 'بطاقة ائتمان / خصم' : 'Credit / Debit Card' }}</span>
                  </button>

                  <!-- Method 2: PayPal -->
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

                  <!-- Method 3: Apple Pay -->
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

                  <!-- Method 4: Google Pay -->
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
                    <p class="section-subtitle">{{ isRtl ? 'معلومات الدفع الخاصة بك مشفرة وآمنة بنسبة 100%.' : 'Your payment information is encrypted and secure.' }}</p>
                  </div>
                </div>

                <div class="inputs-container">
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
                      >
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
                        >
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
                        >
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
                      {{ isRtl ? 'سيتم توجيهك بأمان إلى بوابة الدفع لتأكيد الحجز والدفع بضغطة واحدة.' : 'You will be securely redirected to authenticate and complete your reservation instantly.' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Section 3: Billing Information -->
              <div class="form-section">
                <div class="section-header">
                  <div class="section-icon-badge">
                    <i class="fa-solid fa-user"></i>
                  </div>
                  <div class="section-title-wrap">
                    <h3 class="section-title">{{ isRtl ? 'معلومات الفوترة' : 'Billing Information' }}</h3>
                    <p class="section-subtitle">{{ isRtl ? 'نحتاج هذه المعلومات لإيصال الدفع وتأكيد الحجز.' : 'We need this information for your receipt and booking voucher.' }}</p>
                  </div>
                </div>

                <div class="inputs-container">
                  <div class="two-cols-row">
                    <!-- Phone Number with Country Flag Selector -->
                    <div class="input-field-group">
                      <label class="input-label" for="phoneInput">{{ isRtl ? 'رقم الهاتف' : 'Phone Number' }}</label>
                      <div class="phone-input-combined" :class="{ error: errors.phone }">
                        <div class="country-prefix-select-wrap">
                          <select v-model="selectedCountryCode" class="country-prefix-select" aria-label="Country Code">
                            <option value="+970">🇵🇸 +970</option>
                            <option value="+971">🇦🇪 +971</option>
                            <option value="+966">🇸🇦 +966</option>
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
                          placeholder="59 193 4567"
                          v-model="billingForm.phone"
                        >
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
                          placeholder="you@example.com"
                          v-model="billingForm.email"
                        >
                        <span class="field-icon">
                          <i class="fa-regular fa-envelope"></i>
                        </span>
                      </div>
                      <span v-if="errors.email" class="field-error-text">{{ errors.email }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Submit Pay Now & Confirm Button -->
              <div class="payment-action-area">
                <button
                  type="button"
                  class="btn-pay-now"
                  :disabled="isProcessing"
                  @click="processPayment"
                >
                  <i v-if="isProcessing" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else class="fa-solid fa-lock"></i>
                  <span>{{ isProcessing ? (isRtl ? 'جاري معالجة الدفع وتأكيد الحجز...' : 'Processing Secure Payment...') : (isRtl ? `ادفع الآن وتأكيد الحجز $${totalFormatted}` : `Pay Now & Confirm Booking $${totalFormatted}`) }}</span>
                  <i v-if="!isProcessing" class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>

                <div class="security-disclaimer">
                  <i class="fa-solid fa-shield-halved"></i>
                  <span>{{ isRtl ? 'عملية الدفع آمنة بنسبة 100%. لا نقوم بحفظ بيانات بطاقتك أبداً.' : 'Your payment is 100% secure. We never save your card details.' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ==================== RIGHT COLUMN: DETAILED ORDER SUMMARY ==================== -->
          <!-- 4. دمج ملخص التكلفة (الفاتورة) من الصورة 82 في مربع Order Summary -->
          <div class="unified-sidebar-column">
            <div class="summary-card">
              <div class="summary-header">
                <h2 class="summary-title">{{ isRtl ? 'تفاصيل التكلفة' : 'Order Summary' }}</h2>
                <p class="summary-subtitle">{{ isRtl ? 'راجع تفاصيل الفاتورة قبل إتمام الدفع' : 'Review your order before payment' }}</p>
              </div>

              <!-- Property Mini Overview Card -->
              <div class="property-preview-box">
                <img
                  class="property-preview-thumb"
                  :src="propertyData.image"
                  :alt="propertyData.title"
                  @error="onImageFallback"
                >
                <div class="property-preview-info">
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

              <!-- Comprehensive Cost Breakdown (تفاصيل التكلفة الكاملة) -->
              <div class="cost-breakdown-list">
                <div class="cost-row">
                  <span class="cost-label">{{ isRtl ? 'قيمة العقار' : 'Property Value' }}</span>
                  <span class="cost-value">${{ propertyData.price.toLocaleString() }}</span>
                </div>

                <div class="cost-row">
                  <span class="cost-label">
                    {{ isRtl ? 'رسوم الحجز' : 'Property Reservation' }}
                    <span class="cost-subtext">(Booking Fee)</span>
                  </span>
                  <span class="cost-value">${{ reservationFee }}</span>
                </div>

                <div class="cost-row">
                  <span class="cost-label">
                    {{ isRtl ? 'رسوم الخدمة' : 'Service Fee' }}
                    <span class="cost-subtext">(Escrow & Processing)</span>
                  </span>
                  <span class="cost-value">${{ serviceFee }}</span>
                </div>

                <div class="cost-row">
                  <span class="cost-label">
                    {{ isRtl ? 'الضرائب' : 'Taxes (VAT 0%)' }}
                    <span class="cost-subtext">(localized for Palestine)</span>
                  </span>
                  <span class="cost-value">$0</span>
                </div>

                <div class="cost-divider"></div>

                <div class="cost-row total-row">
                  <span class="total-label">{{ isRtl ? 'المجموع' : 'Total' }}</span>
                  <span class="total-amount">${{ totalFormatted }}</span>
                </div>
              </div>

              <!-- Safe & Secure Highlight Box (ضمان الأمان والثقة) -->
              <div class="safe-secure-banner">
                <div class="safe-icon-circle">
                  <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div class="safe-text-wrap">
                  <h4 class="safe-title">{{ isRtl ? 'ضمان الأمان والثقة' : 'Safe & Secure' }}</h4>
                  <p class="safe-desc">{{ isRtl ? 'دفعتك محمية بتشفير عالي الأمان ومطابق للمعايير المصرفية العالمية.' : 'Your payment is protected with industry-standard encryption.' }}</p>
                </div>
              </div>

              <!-- Security Checklist -->
              <ul class="security-checklist">
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'تشفير SSL آمن ومتكامل' : 'Secure SSL encryption' }}</span>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'مزودو دفع عالميون معتمدون' : 'Trusted payment providers' }}</span>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'دعم فني واستشاري 24/7' : '24/7 customer support' }}</span>
                </li>
                <li>
                  <i class="fa-solid fa-circle-check"></i>
                  <span>{{ isRtl ? 'عملية حجز سريعة وسهلة' : 'Easy and fast process' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- ==================== STEP 3: CONFIRMATION STATE ==================== -->
        <div v-else-if="currentStep === 3" class="confirmation-container">
          <div class="confirmation-card">
            <div class="conf-success-icon-wrap">
              <i class="fa-solid fa-check"></i>
            </div>

            <span class="conf-badge">{{ isRtl ? 'تم الحجز بنجاح' : 'RESERVATION CONFIRMED' }}</span>
            <h2 class="conf-title">{{ isRtl ? 'تهانينا! تم تأكيد حجزك بنجاح' : 'Thank You! Your Reservation is Confirmed' }}</h2>
            <p class="conf-subtitle">
              {{ isRtl ? `تم إرسال إيصال الحجز وتفاصيل العقار إلى البريد الإلكتروني ${billingForm.email}` : `A receipt and full property reservation details have been dispatched to ${billingForm.email}` }}
            </p>

            <div class="conf-receipt-box">
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'رقم الحجز والمعاملة' : 'Booking Reference' }}</span>
                <span class="receipt-val mono">{{ transactionId }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'العقار' : 'Property' }}</span>
                <span class="receipt-val">{{ isRtl ? propertyData.arTitle : propertyData.title }} - {{ propertyData.location }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'تواريخ الإقامة' : 'Stay Dates' }}</span>
                <span class="receipt-val">{{ bookingForm.checkIn }} إلى {{ bookingForm.checkOut }} ({{ bookingForm.guests }} {{ isRtl ? 'ضيوف' : 'Guests' }})</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'طريقة الدفع' : 'Payment Method' }}</span>
                <span class="receipt-val">{{ selectedMethodTitle }}</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'المجموع المدفوع' : 'Total Amount Paid' }}</span>
                <span class="receipt-val total-highlight">${{ totalFormatted }} USD</span>
              </div>
              <div class="receipt-row">
                <span class="receipt-label">{{ isRtl ? 'حالة الحجز' : 'Status' }}</span>
                <span class="receipt-badge-active"><i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'حجز مؤكد ومحمي بنظام الضمان' : 'Guaranteed Active' }}</span>
              </div>
            </div>

            <div class="conf-actions">
              <button type="button" class="btn-primary-conf" @click="downloadReceipt">
                <i class="fa-solid fa-download"></i>
                <span>{{ isRtl ? 'تحميل وثيقة الحجز (PDF)' : 'Download Receipt (PDF)' }}</span>
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
              <strong>{{ isRtl ? 'مدفوعات آمنة' : 'Secure Payments' }}</strong>
              <span>{{ isRtl ? 'بياناتك مشفرة ومحمية دائماً' : 'Your data is always protected' }}</span>
            </div>
          </div>

          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'سريع وسهل' : 'Fast & Easy' }}</strong>
              <span>{{ isRtl ? 'إتمام الحجز في دقائق معدودة' : 'Complete in minutes' }}</span>
            </div>
          </div>

          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-heart"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'منصة موثوقة' : 'Trusted Platform' }}</strong>
              <span>{{ isRtl ? 'آلاف المستخدمين الراضين' : 'Thousands of happy users' }}</span>
            </div>
          </div>

          <div class="trust-badge-card">
            <div class="trust-badge-icon">
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="trust-badge-info">
              <strong>{{ isRtl ? 'اعثر على مكانك' : 'Find Your Place' }}</strong>
              <span>{{ isRtl ? 'ابدأ رحلتك الجديدة اليوم' : 'Start your new journey' }}</span>
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
import NavbarControls from './NavbarControls.vue'
import SavedPropertiesModal from './SavedPropertiesModal.vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { t, isRtl, theme: currentTheme } = useThemeAndLanguage()
const route = useRoute()
const router = useRouter()

// UI States
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)
const profileDropdownRef = ref(null)
const isSavedModalOpen = ref(false)
const currentStep = ref(2)
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
const displayName = computed(() => currentUser.value?.name || currentUser.value?.username || (isLoggedIn.value ? (isRtl.value ? 'عضو موثق' : 'Verified Member') : (isRtl.value ? 'حساب زائر' : 'Guest Account')))
const displayEmail = computed(() => currentUser.value?.email || 'guest@vibelocate.ai')
const userAvatarUrl = computed(() => currentUser.value?.avatar || currentUser.value?.photo_url || '/images/1.png')

const onAvatarError = (e) => {
  e.target.src = '/images/1.png'
}

const handleLogout = () => {
  authService.logout()
  currentUser.value = null
  profileMenuOpen.value = false
  showToast(isRtl.value ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')
}

// 1. Property Data (الفيلا الحديثة في نابلس مع المرونة للمرور عبر المعاملات)
const propertyData = reactive({
  id: route.query.propertyId || '102',
  title: route.query.title || 'Modern Villa',
  arTitle: route.query.arTitle || 'الفيلا الحديثة، نابلس، الضفة الغربية',
  location: route.query.location || 'Nablus, West Bank, Palestine',
  price: Number(route.query.price) || 300000,
  beds: Number(route.query.beds) || 3,
  baths: Number(route.query.baths) || 2,
  sqm: Number(route.query.sqm || route.query.size) || 120,
  image: route.query.image || '/images/photo-1600585154340-be6161a56a0c.avif'
})

const onImageFallback = (e) => {
  e.target.src = '/images/photo-1600210492486-724fe5c67fb0.jfif'
}

// 2. Stay Configurations (تواريخ الإقامة وعدد الضيوف)
const bookingForm = reactive({
  checkIn: route.query.checkIn || '2026-10-01',
  checkOut: route.query.checkOut || '2026-10-07',
  guests: Number(route.query.guests) || 1
})

// 4. Detailed Cost Calculations
const reservationFee = computed(() => Number(route.query.reservationFee) || 300)
const serviceFee = computed(() => Number(route.query.serviceFee) || 30)
const totalAmount = computed(() => propertyData.price + reservationFee.value + serviceFee.value)
const totalFormatted = computed(() => totalAmount.value.toLocaleString())

// 3. Payment Methods (Visa/Mastercard, PayPal, Apple Pay, Google Pay)
const selectedPaymentMethod = ref('card') // 'card', 'paypal', 'apple', 'google'
const selectedMethodTitle = computed(() => {
  if (selectedPaymentMethod.value === 'card') return isRtl.value ? 'بطاقة ائتمان / خصم (Visa & Mastercard)' : 'Credit / Debit Card'
  if (selectedPaymentMethod.value === 'paypal') return 'PayPal'
  if (selectedPaymentMethod.value === 'apple') return 'Apple Pay'
  return 'Google Pay'
})

// Form Inputs
const cardForm = reactive({
  cardNumber: '1234 5678 8012 3458',
  expiryDate: '12/28',
  cvc: '123'
})

const selectedCountryCode = ref('+970')
const billingForm = reactive({
  phone: '59 193 4567',
  email: currentUser.value?.email || 'client@vibelocate.ai'
})

const errors = reactive({
  cardNumber: '',
  expiryDate: '',
  cvc: '',
  phone: '',
  email: ''
})

const transactionId = ref('VL-BK-' + Math.floor(100000 + Math.random() * 900000))

// Card Number Formatting
const handleCardNumberInput = (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16)
  let formatted = val.match(/.{1,4}/g)?.join(' ') || val
  cardForm.cardNumber = formatted
  if (errors.cardNumber) errors.cardNumber = ''
}

// Expiry Formatting
const handleExpiryInput = (e) => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (val.length >= 3) {
    val = val.slice(0, 2) + '/' + val.slice(2)
  }
  cardForm.expiryDate = val
  if (errors.expiryDate) errors.expiryDate = ''
}

// CVC Formatting
const handleCvcInput = (e) => {
  cardForm.cvc = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (errors.cvc) errors.cvc = ''
}

// Detect Card Icon
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
    showToast(isRtl.value ? 'يرجى تصحيح الحقول الموضحة أدناه' : 'Please fix the highlighted fields', 'error')
    return
  }

  isProcessing.value = true

  setTimeout(() => {
    isProcessing.value = false
    currentStep.value = 3
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showToast(isRtl.value ? 'تم إتمام عملية الدفع وتأكيد الحجز بنجاح!' : 'Payment completed and reservation confirmed!')
  }, 1300)
}

// Download Receipt
const downloadReceipt = () => {
  showToast(isRtl.value ? `تم تحميل وثيقة الحجز (${transactionId.value})` : `Receipt downloaded (${transactionId.value})`)
}

// Back Navigation
const handleBack = () => {
  if (route.query.propertyId) {
    router.push(`/property/${route.query.propertyId}`)
  } else {
    router.back()
  }
}

// Scroll & Click Outside
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleClickOutside = (e) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(e.target)) {
    profileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  document.addEventListener('click', handleClickOutside)
  favoritesService.syncWithBackend()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleClickOutside)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<style scoped>
/* ============================================================
   VIBELOCATE AI - UNIFIED LUXURY BOOKING & PAYMENT SYSTEM
   ============================================================ */

.payment-page-wrapper {
  min-height: 100vh;
  background-color: #070d19;
  background-image: 
    radial-gradient(ellipse 90% 60% at 50% -10%, rgba(0, 180, 216, 0.12), transparent 70%),
    radial-gradient(ellipse 50% 40% at 100% 40%, rgba(13, 148, 136, 0.08), transparent 60%),
    url('/bg-topo-dark.jpg');
  background-repeat: no-repeat, no-repeat, repeat;
  background-size: 100% 600px, 600px 600px, 800px auto;
  background-position: top center, right center, top left;
  color: #f1f5f9;
  font-family: 'Outfit', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
}

[data-theme='light'] .payment-page-wrapper {
  background-color: #f8fafc;
  background-image: 
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 180, 216, 0.08), transparent 70%),
    url('/bg-topo-light.png');
  color: #0f172a;
}

/* ==================== HEADER ==================== */
.site-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 14px 28px;
  background: rgba(7, 13, 25, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.site-header.scrolled {
  background: rgba(7, 13, 25, 0.92);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border-bottom-color: rgba(0, 210, 255, 0.15);
}

[data-theme='light'] .site-header {
  background: rgba(255, 255, 255, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 9px;
}

.brand-logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

.brand-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

[data-theme='light'] .brand-title {
  color: #0f172a;
}

.brand-accent {
  color: #00d2ff;
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 800;
  background: linear-gradient(135deg, #00d2ff, #0077b6);
  color: #ffffff;
  padding: 2px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-left: 2px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 6px 2px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  color: #ffffff;
}

[data-theme='light'] .nav-item {
  color: #64748b;
}

[data-theme='light'] .nav-item:hover {
  color: #0f172a;
}

.map-icon-cyan {
  font-size: 0.75rem;
  color: #00d2ff;
  margin-left: 3px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.btn-list-property {
  background: linear-gradient(135deg, #0d9488 0%, #00b4d8 100%);
  color: #ffffff;
  border: none;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 15px rgba(0, 180, 216, 0.25);
  white-space: nowrap;
}

.icon-action-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.header-fav-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  background: #ef4444;
  color: #ffffff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile-menu-container {
  position: relative;
}

.user-profile-menu {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  padding: 3px;
}

.header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #00d2ff;
}

.profile-arrow {
  font-size: 0.72rem;
  color: #94a3b8;
  transition: transform 0.25s ease;
}

.profile-arrow.rotate-180 {
  transform: rotate(180deg);
}

.profile-dropdown-box {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 250px;
  background: #0d1627;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(16px);
  z-index: 1050;
}

[dir="rtl"] .profile-dropdown-box {
  right: auto;
  left: 0;
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
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
}

.dropdown-user-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.dropdown-user-email {
  font-size: 0.75rem;
  color: #94a3b8;
}

.dropdown-user-badge {
  font-size: 0.7rem;
  color: #00d2ff;
  margin-top: 2px;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 10px 0;
}

.dropdown-menu-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-menu-item {
  background: none;
  border: none;
  color: #cbd5e1;
  padding: 8px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  cursor: pointer;
  text-align: inherit;
  width: 100%;
  transition: all 0.15s ease;
}

.dropdown-menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.3rem;
  cursor: pointer;
}

/* ==================== MAIN UNIFIED CONTENT ==================== */
.payment-main-container {
  flex: 1;
  padding: 36px 24px 60px;
}

.payment-content-wrapper {
  max-width: 1260px;
  margin: 0 auto;
}

/* Header Area */
.payment-top-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.payment-title-area {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.back-link-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 2px;
  transition: color 0.2s ease;
}

.back-link-btn:hover {
  color: #00d2ff;
}

.payment-page-title {
  font-size: 2.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.5px;
}

[data-theme='light'] .payment-page-title {
  color: #0f172a;
}

.payment-page-subtitle {
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
}

/* Stepper Progress Bar */
.stepper-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.step-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.step-item.completed .step-circle {
  background: #00b4d8;
  color: #ffffff;
  border-color: #00b4d8;
}

.step-item.completed .step-label {
  color: #00b4d8;
}

.step-item.active .step-circle {
  background: #00b4d8;
  color: #ffffff;
  border-color: #00b4d8;
  box-shadow: 0 0 12px rgba(0, 180, 216, 0.45);
}

.step-item.active .step-label {
  color: #ffffff;
}

[data-theme='light'] .step-item.active .step-label {
  color: #0f172a;
}

.step-connector {
  width: 44px;
  height: 2px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 20px;
}

.step-connector.active {
  background: #00b4d8;
}

/* ==================== 2-COLUMN GRID ==================== */
.unified-booking-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 28px;
  align-items: start;
}

/* ==================== LEFT COLUMN: PROMINENT PROPERTY & FORM ==================== */
.unified-main-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 1. Prominent Property Banner Card */
.prominent-property-card {
  background: rgba(13, 22, 38, 0.92);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
}

[data-theme='light'] .prominent-property-card {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.prop-banner-layout {
  display: flex;
  gap: 20px;
}

.prop-banner-img-wrap {
  position: relative;
  flex-shrink: 0;
}

.prop-banner-img {
  width: 175px;
  height: 155px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.prop-verified-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(7, 13, 25, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(0, 210, 255, 0.4);
  color: #00d2ff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

[dir="rtl"] .prop-verified-badge {
  left: auto;
  right: 8px;
}

.prop-banner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.prop-title-ar {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 3px;
}

[data-theme='light'] .prop-title-ar {
  color: #0f172a;
}

.prop-title-en {
  font-size: 0.86rem;
  color: #94a3b8;
  margin: 0;
}

.prop-specs-tags-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: #cbd5e1;
  flex-wrap: wrap;
}

[data-theme='light'] .prop-specs-tags-row {
  color: #475569;
}

.prop-price-highlight {
  font-size: 1.2rem;
  font-weight: 800;
  color: #00d2ff;
}

.prop-divider {
  color: #64748b;
}

.spec-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* 2. Stay Configuration Bar (Dates & Guests) */
.stay-booking-config-bar {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.config-item-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

.config-item-label i {
  color: #00d2ff;
}

.date-pickers-pair {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 6px 10px;
}

[data-theme='light'] .date-pickers-pair {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.date-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-label-sub {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.custom-date-input {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  width: 100%;
}

[data-theme='light'] .custom-date-input {
  color: #0f172a;
}

.date-arrow-separator {
  color: #64748b;
  font-size: 0.8rem;
}

.guests-selector-pills {
  display: flex;
  gap: 6px;
  height: 48px;
  align-items: center;
}

.guest-pill {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  height: 100%;
  font-size: 0.88rem;
  font-weight: 600;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.guest-pill:hover {
  background: rgba(255, 255, 255, 0.08);
}

.guest-pill.active {
  background: rgba(0, 180, 216, 0.18);
  border-color: #00d2ff;
  color: #00d2ff;
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.25);
}

[data-theme='light'] .guest-pill {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

[data-theme='light'] .guest-pill.active {
  background: #e0f2fe;
  border-color: #0284c7;
  color: #0284c7;
}

/* ==================== PAYMENT FORM CARD ==================== */
.payment-form-card {
  background: rgba(13, 22, 38, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 28px;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  gap: 26px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

[data-theme='light'] .payment-form-card {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
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

.section-icon-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.section-title-wrap {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

[data-theme='light'] .section-title {
  color: #0f172a;
}

.section-subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0;
}

/* 3. Multiple Payment Methods Grid */
.payment-methods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.payment-method-option {
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 86px;
}

.payment-method-option:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.2);
}

.payment-method-option.selected {
  background: rgba(0, 180, 216, 0.12);
  border-color: #00d2ff;
  box-shadow: 0 0 16px rgba(0, 210, 255, 0.25);
}

[data-theme='light'] .payment-method-option {
  background: #f8fafc;
  border-color: #e2e8f0;
}

[data-theme='light'] .payment-method-option.selected {
  background: #f0fdfa;
  border-color: #0d9488;
  box-shadow: 0 0 14px rgba(13, 148, 136, 0.2);
}

.method-icons-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 1.3rem;
  height: 28px;
}

.card-icons {
  display: flex;
  align-items: center;
  gap: 5px;
}

.badge-visa {
  font-weight: 800;
  font-style: italic;
  font-size: 1rem;
  color: #3b82f6;
}

.badge-mc {
  display: inline-flex;
  position: relative;
  width: 28px;
  height: 18px;
}

.mc-red, .mc-orange {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: absolute;
}

.mc-red {
  background: #ef4444;
  left: 0;
  opacity: 0.95;
}

.mc-orange {
  background: #f59e0b;
  right: 0;
  opacity: 0.85;
}

.paypal-icon {
  color: #38bdf8;
  font-size: 1.4rem;
}

.apple-icon {
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 2px;
}

[data-theme='light'] .apple-icon {
  color: #0f172a;
}

.google-icon {
  color: #ea4335;
  display: flex;
  align-items: center;
  gap: 2px;
}

.pay-text {
  font-size: 0.95rem;
  font-weight: 700;
  color: inherit;
}

.method-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #cbd5e1;
  text-align: center;
  white-space: nowrap;
}

[data-theme='light'] .method-name {
  color: #475569;
}

/* Alt Method Box */
.alt-method-box {
  background: rgba(0, 210, 255, 0.05);
  border: 1px dashed rgba(0, 210, 255, 0.25);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.alt-method-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
}

.alt-method-details h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 3px;
}

.alt-method-details p {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

/* Inputs & Form Fields */
.inputs-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
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
}

.clean-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 0.92rem;
  color: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.clean-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00d2ff;
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
}

[data-theme='light'] .clean-input {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.field-icon {
  position: absolute;
  right: 14px;
  color: #64748b;
  font-size: 0.95rem;
  pointer-events: none;
}

[dir="rtl"] .field-icon {
  right: auto;
  left: 14px;
}

.card-type-icon {
  font-size: 1.25rem;
}

.two-cols-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field-error-text {
  font-size: 0.74rem;
  color: #f87171;
  margin-top: 2px;
}

.input-with-icon-wrap.error .clean-input,
.phone-input-combined.error {
  border-color: #ef4444 !important;
}

.phone-input-combined {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  overflow: hidden;
}

.phone-input-combined:focus-within {
  border-color: #00d2ff;
  box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
}

[data-theme='light'] .phone-input-combined {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.country-prefix-select-wrap {
  background: rgba(255, 255, 255, 0.06);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 4px;
}

[dir="rtl"] .country-prefix-select-wrap {
  border-right: none;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.country-prefix-select {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 0.88rem;
  padding: 12px 6px;
  outline: none;
  cursor: pointer;
}

[data-theme='light'] .country-prefix-select {
  color: #0f172a;
}

.country-prefix-select option {
  background: #0d1627;
  color: #ffffff;
}

.phone-number-input {
  border: none !important;
  background: transparent !important;
}

/* Pay Now Button */
.payment-action-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
}

.btn-pay-now {
  background: linear-gradient(135deg, #009688 0%, #00b4d8 50%, #00d2ff 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1.06rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 6px 20px rgba(0, 180, 216, 0.35);
}

.btn-pay-now:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 180, 216, 0.5);
}

.btn-pay-now:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.security-disclaimer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 0.78rem;
  color: #94a3b8;
  text-align: center;
}

.security-disclaimer i {
  color: #00d2ff;
}

/* ==================== RIGHT COLUMN: DETAILED ORDER SUMMARY ==================== */
.unified-sidebar-column {
  position: sticky;
  top: 90px;
}

.summary-card {
  background: rgba(13, 22, 38, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

[data-theme='light'] .summary-card {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.summary-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 12px;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

[data-theme='light'] .summary-title {
  color: #0f172a;
}

.summary-subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
}

/* Property Mini Overview */
.property-preview-box {
  background: #070e1c;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

[data-theme='light'] .property-preview-box {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.property-preview-thumb {
  width: 80px;
  height: 68px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.property-preview-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
}

.property-preview-title {
  font-size: 0.94rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

[data-theme='light'] .property-preview-title {
  color: #0f172a;
}

.property-preview-location {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.property-preview-location i {
  color: #00d2ff;
  font-size: 0.72rem;
}

.property-preview-specs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: #cbd5e1;
  margin-top: 2px;
}

[data-theme='light'] .property-preview-specs {
  color: #64748b;
}

/* Cost Breakdown */
.cost-breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  color: #cbd5e1;
}

[data-theme='light'] .cost-row {
  color: #475569;
}

.cost-label {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.cost-subtext {
  font-size: 0.72rem;
  color: #64748b;
}

.cost-value {
  font-weight: 600;
  color: #ffffff;
}

[data-theme='light'] .cost-value {
  color: #0f172a;
}

.cost-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 0;
}

.total-row {
  margin-top: 2px;
}

.total-label {
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
}

[data-theme='light'] .total-label {
  color: #0f172a;
}

.total-amount {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
}

[data-theme='light'] .total-amount {
  color: #0d9488;
}

/* Safe & Secure Guarantee */
.safe-secure-banner {
  background: rgba(0, 180, 216, 0.08);
  border: 1px solid rgba(0, 180, 216, 0.22);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.safe-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 180, 216, 0.15);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.safe-text-wrap {
  display: flex;
  flex-direction: column;
}

.safe-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #00d2ff;
  margin: 0 0 2px;
}

.safe-desc {
  font-size: 0.76rem;
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
  gap: 9px;
}

.security-checklist li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 0.82rem;
  color: #cbd5e1;
}

[data-theme='light'] .security-checklist li {
  color: #475569;
}

.security-checklist i {
  color: #00d2ff;
  font-size: 0.9rem;
}

/* ==================== CONFIRMATION STATE ==================== */
.confirmation-container {
  display: flex;
  justify-content: center;
  margin: 20px 0 40px;
}

.confirmation-card {
  background: rgba(13, 22, 38, 0.92);
  border: 1px solid rgba(0, 210, 255, 0.3);
  border-radius: 20px;
  padding: 40px;
  max-width: 680px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.conf-success-icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00b4d8, #00d2ff);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 0 25px rgba(0, 210, 255, 0.5);
}

.conf-badge {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1px;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.12);
  padding: 4px 12px;
  border-radius: 999px;
}

.conf-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.conf-subtitle {
  font-size: 0.92rem;
  color: #94a3b8;
  margin: 0;
  max-width: 520px;
}

.conf-receipt-box {
  width: 100%;
  background: rgba(7, 14, 28, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 8px 0;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
}

.receipt-label {
  color: #94a3b8;
}

.receipt-val {
  font-weight: 600;
  color: #ffffff;
}

.receipt-val.mono {
  font-family: monospace;
  color: #00d2ff;
}

.receipt-val.total-highlight {
  font-size: 1.1rem;
  color: #00d2ff;
  font-weight: 800;
}

.receipt-badge-active {
  color: #34d399;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.conf-actions {
  display: flex;
  gap: 14px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary-conf {
  background: linear-gradient(135deg, #009688 0%, #00b4d8 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary-conf {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* ==================== 4 TRUST BADGES ROW ==================== */
.trust-badges-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 40px;
}

.trust-badge-card {
  background: rgba(13, 22, 38, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.25s ease;
}

.trust-badge-card:hover {
  border-color: rgba(0, 210, 255, 0.25);
  transform: translateY(-2px);
  background: rgba(13, 22, 38, 0.85);
}

[data-theme='light'] .trust-badge-card {
  background: #ffffff;
  border-color: #e2e8f0;
}

.trust-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(0, 210, 255, 0.08);
  color: #00d2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.trust-badge-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.trust-badge-info strong {
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
}

[data-theme='light'] .trust-badge-info strong {
  color: #0f172a;
}

.trust-badge-info span {
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.3;
}

/* ==================== FOOTER ==================== */
.site-footer {
  background: #040811;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 48px 28px 24px;
  margin-top: 40px;
}

[data-theme='light'] .site-footer {
  background: #f1f5f9;
  border-top-color: #e2e8f0;
}

.footer-inner {
  max-width: 1260px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.footer-top-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
}

.footer-brand-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-tagline {
  font-size: 0.88rem;
  color: #94a3b8;
  margin: 0;
}

.footer-col-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 14px;
}

[data-theme='light'] .footer-col-title {
  color: #0f172a;
}

.footer-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.footer-nav-list a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
}

.footer-nav-list a:hover {
  color: #00d2ff;
}

.footer-social-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-social-icons a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.footer-social-icons a:hover {
  background: #00d2ff;
  color: #070d19;
  transform: translateY(-2px);
}

.footer-bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.78rem;
  color: #64748b;
  flex-wrap: wrap;
  gap: 12px;
}

.copyright-text, .footer-quote {
  margin: 0;
}

/* ==================== TOAST ==================== */
.toast-notification {
  position: fixed;
  bottom: 28px;
  right: 28px;
  background: #0d192e;
  border: 1px solid rgba(0, 210, 255, 0.3);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  z-index: 2000;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: all 0.3s ease;
}

.toast-notification.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.toast-notification.error {
  border-color: rgba(239, 68, 68, 0.5);
}

/* ==================== RESPONSIVE DESIGN ==================== */
@media (max-width: 1024px) {
  .unified-booking-grid {
    grid-template-columns: 1fr;
  }
  .unified-sidebar-column {
    position: static;
  }
  .trust-badges-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-top-row {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .nav-links.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #070d19;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .menu-toggle {
    display: block;
  }
  .prop-banner-layout {
    flex-direction: column;
  }
  .prop-banner-img {
    width: 100%;
    height: 180px;
  }
  .stay-booking-config-bar {
    grid-template-columns: 1fr;
  }
  .payment-methods-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .two-cols-row {
    grid-template-columns: 1fr;
  }
  .trust-badges-row {
    grid-template-columns: 1fr;
  }
  .footer-top-row {
    grid-template-columns: 1fr;
  }
  .payment-top-section {
    flex-direction: column;
  }
  .stepper-container {
    width: 100%;
    justify-content: center;
  }
}
</style>
