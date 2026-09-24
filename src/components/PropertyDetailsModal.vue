<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen && property" class="property-modal-overlay" @click.self="close">
        <div class="property-modal-container" role="dialog" aria-modal="true">
          <!-- Close Button -->
          <button
            type="button"
            class="modal-close-btn"
            aria-label="Close modal"
            @click="close"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>

          <div class="modal-grid-layout">
            <!-- Left: Media Showcase -->
            <div class="modal-media-col">
              <div class="modal-hero-image-wrap">
                <img
                  :src="activeImage || property.image"
                  :alt="property.title"
                  class="modal-hero-img"
                >
                <div class="modal-media-badges">
                  <span class="modal-badge-type">{{ property.type || 'Property' }}</span>
                  <span class="modal-badge-ai">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> {{ property.matchScore || property.aiMatch || 94 }}% Match
                  </span>
                </div>
              </div>

              <!-- Image Thumbnails Strip -->
              <div
                v-if="property.images && property.images.length > 1"
                class="modal-thumbnails-strip"
              >
                <button
                  v-for="(img, idx) in property.images"
                  :key="idx"
                  type="button"
                  class="modal-thumb-btn"
                  :class="{ active: activeImage === img }"
                  @click="activeImage = img"
                >
                  <img :src="img" :alt="property.title + ' view ' + (idx + 1)">
                </button>
              </div>

              <!-- AI Insight Note -->
              <div class="modal-ai-recommendation-box">
                <div class="ai-box-header">
                  <i class="fa-solid fa-robot"></i>
                  <strong>VibeLocate AI Insights</strong>
                </div>
                <p>
                  This property matches high lifestyle demand in {{ property.location || property.area || 'Dubai' }}, featuring premium finishing, optimal transit accessibility, and strong investment potential.
                </p>
              </div>
            </div>

            <!-- Right: Details & Specifications -->
            <div class="modal-info-col">
              <div class="modal-info-header">
                <div class="modal-header-top-row">
                  <span class="modal-verified-pill">
                    <i class="fa-solid fa-certificate"></i> Verified Luxury Listing
                  </span>
                  <button
                    type="button"
                    class="modal-fav-toggle"
                    :class="{ active: favoritesService.isSaved(property.title || property.id) }"
                    @click="toggleFav(property)"
                  >
                    <i :class="favoritesService.isSaved(property.title || property.id) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
                    <span>{{ favoritesService.isSaved(property.title || property.id) ? 'Saved' : 'Save' }}</span>
                  </button>
                </div>

                <h2 class="modal-property-title">{{ property.title }}</h2>
                <p class="modal-property-location">
                  <i class="fa-solid fa-location-dot"></i>
                  <span>{{ property.location || property.area || 'Dubai, UAE' }}</span>
                </p>

                <div class="modal-pricing-box">
                  <div class="modal-price-group">
                    <span class="modal-price-number">{{ formatPrice(property.price) }}</span>
                    <span v-if="property.period" class="modal-period">{{ property.period }}</span>
                  </div>
                  <span class="modal-rent-frequency">{{ property.rent_frequency || 'Yearly Lease' }}</span>
                </div>
              </div>

              <!-- Key Specs Grid -->
              <div class="modal-specs-section">
                <h4 class="modal-section-title">Property Highlights</h4>
                <div class="modal-specs-grid">
                  <div class="modal-spec-card">
                    <i class="fa-solid fa-bed"></i>
                    <div>
                      <span class="spec-label">Bedrooms</span>
                      <strong class="spec-value">{{ property.beds || 2 }} Bedrooms</strong>
                    </div>
                  </div>
                  <div class="modal-spec-card">
                    <i class="fa-solid fa-bath"></i>
                    <div>
                      <span class="spec-label">Bathrooms</span>
                      <strong class="spec-value">{{ property.baths || 2 }} Bathrooms</strong>
                    </div>
                  </div>
                  <div class="modal-spec-card">
                    <i class="fa-solid fa-vector-square"></i>
                    <div>
                      <span class="spec-label">Total Area</span>
                      <strong class="spec-value">{{ property.sqft || property.size || '1,800' }} Sqft</strong>
                    </div>
                  </div>
                  <div class="modal-spec-card">
                    <i class="fa-solid fa-couch"></i>
                    <div>
                      <span class="spec-label">Furnishing</span>
                      <strong class="spec-value" style="text-transform: capitalize;">{{ property.is_furnished || 'Furnished' }}</strong>
                    </div>
                  </div>
                  <div class="modal-spec-card">
                    <i class="fa-solid fa-square-parking"></i>
                    <div>
                      <span class="spec-label">Parking</span>
                      <strong class="spec-value">{{ property.specs?.parking || 'Covered Included' }}</strong>
                    </div>
                  </div>
                  <div class="modal-spec-card">
                    <i class="fa-solid fa-building"></i>
                    <div>
                      <span class="spec-label">Property Type</span>
                      <strong class="spec-value">{{ property.type || 'Residence' }}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Amenities & Features Tags -->
              <div class="modal-amenities-section">
                <h4 class="modal-section-title">Amenities &amp; Features</h4>
                <div class="modal-amenities-tags">
                  <span
                    v-for="(tag, tIdx) in (property.tags && property.tags.length ? property.tags : ['Balcony', 'Central A/C', 'Security', 'Built-in Wardrobes', 'Shared Gym', 'Covered Parking'])"
                    :key="tIdx"
                    class="modal-amenity-chip"
                  >
                    <i class="fa-solid fa-circle-check"></i> {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <div class="modal-description-section">
                <h4 class="modal-section-title">About this property</h4>
                <p class="modal-description-text">
                  {{ property.description || property.summary || 'A prestigious residential opportunity offering unmatched comfort, modern architectural finishes, and panoramic views of Dubai.' }}
                </p>
              </div>

              <!-- Modal Action Buttons -->
              <div class="modal-action-buttons">
                <button
                  type="button"
                  class="btn-modal-primary"
                  @click="handleBooking"
                >
                  <i class="fa-solid fa-calendar-check"></i>
                  <span>Schedule a Private Viewing</span>
                </button>
                <button
                  type="button"
                  class="btn-modal-secondary"
                  @click="handleContact"
                >
                  <i class="fa-solid fa-phone"></i>
                  <span>Contact Verified Agent</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { favoritesService } from '../services/favoritesService'

const props = defineProps({
  property: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'toast'])

const activeImage = ref('')

watch(() => props.property, (newVal) => {
  if (newVal) {
    activeImage.value = newVal.image || (newVal.images && newVal.images[0]) || ''
  }
}, { immediate: true })

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const close = () => {
  emit('close')
}

const toggleFav = (prop) => {
  const saved = favoritesService.toggleSave(prop)
  if (saved) {
    emit('toast', `Added "${prop.title}" to favorites ❤️`)
  } else {
    emit('toast', `Removed "${prop.title}" from favorites`)
  }
}

const formatPrice = (val) => {
  if (!val) return 'AED 0'
  if (typeof val === 'number') return `AED ${val.toLocaleString()}`
  if (typeof val === 'string') return val.startsWith('AED') ? val : `AED ${val}`
  return 'AED 0'
}

const handleBooking = () => {
  emit('toast', `Scheduling private viewing for ${props.property?.title}...`)
}

const handleContact = () => {
  emit('toast', `Connecting with verified luxury consultant in Dubai...`)
}
</script>

<style scoped>
.property-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 16, 30, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 24px;
  overflow-y: auto;
}

.property-modal-container {
  background: #ffffff;
  border-radius: 28px;
  max-width: 1040px;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 35px 80px rgba(0, 0, 0, 0.6);
  animation: modalPopIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  color: #0f172a;
}

@keyframes modalPopIn {
  0% { opacity: 0; transform: scale(0.94) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  display: grid;
  place-items: center;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.25s ease;
  border: 1px solid #e2e8f0;
}

.modal-close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
  transform: rotate(90deg);
}

.modal-grid-layout {
  display: grid;
  grid-template-columns: 1.05fr 1.25fr;
  gap: 36px;
  padding: 36px;
}

@media (max-width: 900px) {
  .modal-grid-layout {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}

.modal-hero-image-wrap {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  height: 280px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-media-badges {
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  gap: 8px;
}

.modal-badge-type {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}

.modal-badge-ai {
  background: linear-gradient(135deg, #0284c7, #00d2ff);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 210, 255, 0.4);
}

.modal-thumbnails-strip {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  overflow-x: auto;
}

.modal-thumb-btn {
  width: 70px;
  height: 55px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  opacity: 0.65;
  transition: all 0.2s ease;
}

.modal-thumb-btn.active, .modal-thumb-btn:hover {
  opacity: 1;
  border-color: #0284c7;
}

.modal-thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-ai-recommendation-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  margin-top: 20px;
}

.ai-box-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0284c7;
  font-size: 13.5px;
  margin-bottom: 6px;
}

.modal-ai-recommendation-box p {
  margin: 0;
  font-size: 12.5px;
  color: #475569;
  line-height: 1.5;
}

.modal-info-col {
  display: flex;
  flex-direction: column;
}

.modal-header-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.modal-verified-pill {
  color: #059669;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  padding: 4px 10px;
  border-radius: 20px;
}

.modal-fav-toggle {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.modal-fav-toggle:hover, .modal-fav-toggle.active {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #ef4444;
}

.modal-property-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
}

.modal-property-location {
  color: #64748b;
  font-size: 14px;
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-pricing-box {
  background: #f8fafc;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.modal-price-number {
  font-size: 24px;
  font-weight: 800;
  color: #0284c7;
}

.modal-rent-frequency {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  background: #ffffff;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.modal-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.modal-spec-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-spec-card i {
  font-size: 18px;
  color: #0284c7;
}

.spec-label {
  display: block;
  font-size: 10.5px;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.spec-value {
  display: block;
  font-size: 12.5px;
  color: #0f172a;
  font-weight: 700;
}

.modal-amenities-section {
  margin-bottom: 20px;
}

.modal-amenities-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-amenity-chip {
  background: #f1f5f9;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e2e8f0;
}

.modal-amenity-chip i {
  color: #059669;
}

.modal-description-section {
  margin-bottom: 24px;
}

.modal-description-text {
  font-size: 13.5px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.modal-action-buttons {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 12px;
  margin-top: auto;
}

.btn-modal-primary {
  height: 48px;
  background: linear-gradient(135deg, #0a1628 0%, #1e3a5f 100%);
  color: #ffffff;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(10, 22, 40, 0.25);
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid rgba(0, 210, 255, 0.2);
}

.btn-modal-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 210, 255, 0.35);
  border-color: #00d2ff;
}

.btn-modal-secondary {
  height: 48px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-modal-secondary:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
