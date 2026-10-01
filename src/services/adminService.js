import apiClient from './api'

/**
 * VibeLocate AI - Admin Service
 * Handles all real Administrator operations and endpoints from the Laravel Backend:
 * - POST /api/login (admin credentials)
 * - GET /api/admin/dashboard
 * - GET /api/admin/users
 * - PUT /api/admin/users/{id}/status
 * - GET /api/admin/ai-health
 * - GET /api/admin/vibe-report/coverage
 * - GET /api/admin/reports
 * - PUT /api/admin/reports/{id}/status
 * - POST /api/admin/notifications
 * - PUT /api/agent/properties/{id}/approve
 * - PUT /api/agent/properties/{id}/reject
 */

export const adminService = {
  /**
   * Admin Login
   */
  async login(email = 'admin@vibelocate.ai', password = '12345678') {
    try {
      const response = await apiClient.post('/login', {
        email,
        password,
        device_type: 'web',
        remember_me: false
      })
      if (response.data?.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
        localStorage.setItem('auth_user', JSON.stringify(response.data.user || { role: 'admin' }))
      }
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Fetch Admin Dashboard Data (Stats, AI Health, Pending Properties, Reports)
   * GET /api/admin/dashboard
   */
  async getDashboard() {
    try {
      const response = await apiClient.get('/admin/dashboard')
      return { success: true, data: response.data?.data || response.data }
    } catch (err) {
      console.warn('[adminService] /admin/dashboard error:', err?.response?.data || err?.message)
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Fetch All Users
   * GET /api/admin/users
   */
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get('/admin/users', { params })
      const rawData = response.data?.data || response.data || []
      return { success: true, data: Array.isArray(rawData) ? rawData : (rawData.data || []) }
    } catch (err) {
      console.warn('[adminService] /admin/users error:', err?.message)
      return { success: false, data: [], error: err?.message }
    }
  },

  /**
   * Update User Status (active, suspended, etc.)
   * PUT /api/admin/users/{id}/status
   */
  async updateUserStatus(userId, status = 'active') {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/status`, { status })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Fetch AI Health & Diagnostics
   * GET /api/admin/ai-health
   */
  async getAiHealth() {
    try {
      const response = await apiClient.get('/admin/ai-health')
      return { success: true, data: response.data?.data || response.data }
    } catch (err) {
      console.warn('[adminService] /admin/ai-health error:', err?.message)
      return { success: false, error: err?.message }
    }
  },

  /**
   * Fetch Vibe Report Coverage Map
   * GET /api/admin/vibe-report/coverage
   */
  async getVibeReportCoverage() {
    try {
      const response = await apiClient.get('/admin/vibe-report/coverage')
      return { success: true, data: response.data?.data || response.data }
    } catch (err) {
      console.warn('[adminService] /admin/vibe-report/coverage error:', err?.message)
      return { success: false, error: err?.message }
    }
  },

  /**
   * Fetch Admin Reports & Complaints
   * GET /api/admin/reports
   */
  async getReports(params = {}) {
    try {
      const response = await apiClient.get('/admin/reports', { params })
      const rawData = response.data?.data || response.data || []
      return { success: true, data: Array.isArray(rawData) ? rawData : (rawData.data || []) }
    } catch (err) {
      console.warn('[adminService] /admin/reports error:', err?.message)
      return { success: false, data: [], error: err?.message }
    }
  },

  /**
   * Update Report Status (reviewing, resolved, dismissed)
   * PUT /api/admin/reports/{id}/status
   */
  async updateReportStatus(reportId, status, adminNotes = '') {
    try {
      const response = await apiClient.put(`/admin/reports/${reportId}/status`, {
        status,
        admin_notes: adminNotes
      })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Broadcast System Notification
   * POST /api/admin/notifications
   */
  async broadcastNotification(payload) {
    try {
      const response = await apiClient.post('/admin/notifications', payload)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Approve Property
   * PUT /api/agent/properties/{id}/approve
   */
  async approveProperty(propertyId) {
    try {
      const response = await apiClient.put(`/agent/properties/${propertyId}/approve`)
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  },

  /**
   * Reject Property
   * PUT /api/agent/properties/{id}/reject
   */
  async rejectProperty(propertyId, reason = 'Violates platform guidelines') {
    try {
      const response = await apiClient.put(`/agent/properties/${propertyId}/reject`, { reason })
      return { success: true, data: response.data }
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || err?.message }
    }
  }
}

export default adminService
