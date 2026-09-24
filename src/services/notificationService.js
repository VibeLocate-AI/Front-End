import { ref } from 'vue'
import apiClient from './api'
import { authService } from './authService'

const unreadCount = ref(0)

const listFromResponse = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.notifications)) return response.notifications
  if (Array.isArray(response?.data?.data)) return response.data.data
  return []
}

export const notificationService = {
  unreadCount,
  async getAll() {
    if (!authService.isAuthenticated()) return []
    return listFromResponse(await apiClient.get('/notifications'))
  },
  async refreshUnreadCount() {
    if (!authService.isAuthenticated()) {
      unreadCount.value = 0
      return 0
    }
    try {
      const response = await apiClient.get('/notifications/unread-count')
      const count = Number(response?.count ?? response?.unread_count ?? response?.data?.count ?? 0)
      unreadCount.value = Number.isFinite(count) ? count : 0
    } catch (error) {
      console.warn('[notificationService] Failed to get unread count:', error?.message)
    }
    return unreadCount.value
  },
  async markAsRead(id) {
    const response = await apiClient.put(`/notifications/${id}/read`)
    unreadCount.value = Math.max(0, unreadCount.value - 1)
    return response
  }
}

export default notificationService
