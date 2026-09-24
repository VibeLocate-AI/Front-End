/**
 * VibeLocate AI - Unified API & Services Module
 * Fully configured and linked to the Postman Collection:
 * VibeLocate Laravel API (https://vibelocate-laravel.onrender.com/api)
 */

export { default as apiClient, apiClient as api } from './api'
export { default as authService, authService as auth } from './authService'
export { default as propertyService, propertyService as properties } from './propertyService'
export { default as favoritesService, favoritesService as favorites } from './favoritesService'
export { default as notificationService, notificationService as notifications } from './notificationService'
export { default as googleAuth } from './googleAuth'

// Convenience grouped API object
export const VibeApi = {
  client: () => import('./api').then(m => m.default),
  auth: () => import('./authService').then(m => m.default),
  properties: () => import('./propertyService').then(m => m.default),
  favorites: () => import('./favoritesService').then(m => m.default),
  notifications: () => import('./notificationService').then(m => m.default),
  google: () => import('./googleAuth').then(m => m.default)
}

export default {
  apiClient: () => import('./api').then(m => m.default),
  authService: () => import('./authService').then(m => m.default),
  propertyService: () => import('./propertyService').then(m => m.default),
  favoritesService: () => import('./favoritesService').then(m => m.default),
  notificationService: () => import('./notificationService').then(m => m.default)
}
