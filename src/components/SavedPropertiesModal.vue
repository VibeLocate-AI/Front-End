<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="saved-modal-overlay" @click.self="close">
        <div class="saved-modal-container" role="dialog" aria-modal="true">
          <!-- Modal Header -->
          <div class="saved-modal-header">
            <div class="header-title-box">
              <div class="saved-icon-badge">
                <i class="fa-solid fa-heart"></i>
              </div>
              <div>
                <h2 class="modal-main-title">
                  Saved Properties
                  <span class="count-pill">{{ favoritesService.savedItems.value.length }}</span>
                </h2>
                <p class="modal-sub-title">Your favorite luxury residences in Dubai</p>
              </div>
            </div>

            <button type="button" class="saved-modal-close" aria-label="Close modal" @click="close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Category Filter Tabs -->
          <div class="saved-filter-bar">
            <button
              v-for="cat in ['All', 'Apartments', 'Villas', 'Penthouses', 'Townhouses']"
              :key="cat"
              type="button"
              class="filter-pill-btn"
              :class="{ active: activeFilter === cat }"
              @click="activeFilter = cat"
            >
              {{ cat }} ({{ getFilterCount(cat) }})
            </button>
          </div>

          <!-- Modal Body Content -->
          <div class="saved-modal-body">
            <div v-if="filteredList.length > 0" class="saved-cards-grid">
              <div
                v-for="prop in filteredList"
                :key="prop.id || prop.title"
                class="saved-prop-card"
              >
                <div class="card-thumb-wrap">
                  <img :src="prop.image" :alt="prop.title" class="card-thumb-img">
                  <span class="card-type-badge">{{ prop.type || 'Property' }}</span>
                  <button
                    type="button"
                    class="btn-remove-fav"
                    title="Remove from saved"
                    @click="removeProperty(prop)"
                  >
                    <i class="fa-solid fa-heart"></i>
                  </button>
                </div>

                <div class="card-details">
                  <h3 class="card-prop-title">{{ prop.title }}</h3>
                  <p class="card-prop-location">
                    <i class="fa-solid fa-location-dot"></i> {{ prop.location }}
                  </p>
                  
                  <div class="card-prop-price">{{ prop.price }}</div>

                  <div class="card-prop-specs">
                    <span><i class="fa-solid fa-bed"></i> {{ prop.beds }} Beds</span>
                    <span><i class="fa-solid fa-bath"></i> {{ prop.baths }} Baths</span>
                    <span><i class="fa-solid fa-ruler-combined"></i> {{ prop.sqft }} sqft</span>
                  </div>

                  <div class="card-actions-row">
                    <button
                      type="button"
                      class="btn-view-details"
                      @click="onViewDetails(prop)"
                    >
                      <i class="fa-solid fa-eye"></i> View Details
                    </button>
                    <button
                      type="button"
                      class="btn-trash-remove"
                      title="Remove"
                      @click="removeProperty(prop)"
                    >
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="saved-empty-state">
              <div class="empty-heart-ring">
                <i class="fa-regular fa-heart"></i>
              </div>
              <h3 class="empty-title">No {{ activeFilter !== 'All' ? activeFilter : '' }} Saved Properties Yet</h3>
              <p class="empty-text">Click the heart icon on any property while browsing to add it to your favorites.</p>
              <button type="button" class="btn-browse-props" @click="goToExplore">
                <i class="fa-solid fa-compass"></i> Explore Properties
              </button>
            </div>
          </div>

          <!-- Modal Footer Bar -->
          <div class="saved-modal-footer">
            <button type="button" class="btn-footer-profile" @click="goToProfileSaved">
              <i class="fa-solid fa-user-gear"></i> Manage in Profile
            </button>
            <button type="button" class="btn-footer-close" @click="close">
              Done
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { favoritesService } from '../services/favoritesService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'open-property'])

const router = useRouter()
const activeFilter = ref('All')

const close = () => {
  emit('close')
}

const filteredList = computed(() => {
  const items = favoritesService.savedItems.value
  if (activeFilter.value === 'All') return items
  return items.filter(item => {
    const t = (item.type || '').toLowerCase()
    const target = activeFilter.value.toLowerCase()
    return t.includes(target) || (target === 'villas' && t.includes('villa'))
  })
})

const getFilterCount = (cat) => {
  const items = favoritesService.savedItems.value
  if (cat === 'All') return items.length
  return items.filter(item => {
    const t = (item.type || '').toLowerCase()
    const target = cat.toLowerCase()
    return t.includes(target) || (target === 'villas' && t.includes('villa'))
  }).length
}

const removeProperty = (prop) => {
  favoritesService.remove(prop.title || prop.id)
}

const onViewDetails = (prop) => {
  emit('open-property', prop)
  close()
}

const goToExplore = () => {
  close()
  router.push('/home#featured')
}

const goToProfileSaved = () => {
  close()
  router.push('/profile/saved')
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.saved-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(6, 16, 30, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
}

.saved-modal-container {
  background: #0d172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  width: 100%;
  max-width: 900px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  color: #ffffff;
}

/* Header */
.saved-modal-header {
  padding: 24px 28px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
}

.header-title-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.saved-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ef4444, #f43f5e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35);
}

.modal-main-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #ffffff;
}

.count-pill {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-size: 13px;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 600;
}

.modal-sub-title {
  margin: 2px 0 0;
  font-size: 13px;
  color: #94a3b8;
}

.saved-modal-close {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.saved-modal-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  transform: rotate(90deg);
}

/* Filter Bar */
.saved-filter-bar {
  display: flex;
  gap: 8px;
  padding: 14px 28px;
  background: rgba(15, 23, 42, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.filter-pill-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.filter-pill-btn:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.1);
}

.filter-pill-btn.active {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #ffffff;
  border-color: transparent;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

/* Body */
.saved-modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
}

.saved-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.saved-prop-card {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
  display: flex;
  flex-direction: column;
}

.saved-prop-card:hover {
  transform: translateY(-3px);
  border-color: rgba(59, 130, 246, 0.4);
}

.card-thumb-wrap {
  position: relative;
  height: 150px;
  overflow: hidden;
}

.card-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-type-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  color: #38bdf8;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.btn-remove-fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.btn-remove-fav:hover {
  background: #ef4444;
  color: #fff;
  transform: scale(1.1);
}

.card-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-prop-title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #f8fafc;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-prop-location {
  margin: 0 0 10px;
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-prop-location i {
  color: #38bdf8;
}

.card-prop-price {
  font-size: 16px;
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 10px;
}

.card-prop-specs {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #cbd5e1;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 14px;
}

.card-prop-specs i {
  color: #64748b;
  margin-right: 2px;
}

.card-actions-row {
  margin-top: auto;
  display: flex;
  gap: 8px;
}

.btn-view-details {
  flex: 1;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-view-details:hover {
  background: #3b82f6;
  color: #fff;
  border-color: #3b82f6;
}

.btn-trash-remove {
  width: 34px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #f87171;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s ease;
}

.btn-trash-remove:hover {
  background: #ef4444;
  color: #fff;
}

/* Empty State */
.saved-empty-state {
  text-align: center;
  padding: 50px 20px;
}

.empty-heart-ring {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 30px;
  color: #ef4444;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  color: #f8fafc;
}

.empty-text {
  font-size: 13px;
  color: #94a3b8;
  max-width: 400px;
  margin: 0 auto 20px;
  line-height: 1.5;
}

.btn-browse-props {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.btn-browse-props:hover {
  transform: translateY(-2px);
}

/* Footer */
.saved-modal-footer {
  padding: 16px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-footer-profile {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-footer-profile:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-footer-close {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-footer-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
