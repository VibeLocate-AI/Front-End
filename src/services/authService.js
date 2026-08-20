import apiClient from './api'

/**
 * VibeLocate AI - Authentication Service
 * Centralizes all auth-related API requests and token storage handling.
 */

export const authService = {
  /**
   * Log in user
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} response data (user info, tokens)
   */
  async login({ email, password, rememberMe = true }) {
    const data = await apiClient.post('/auth/login', {
      email,
      password,
      rememberMe
    })

    if (data?.token) {
      this.setToken(data.token, rememberMe)
    }

    return data
  },

  /**
   * Register a new user
   * @param {Object} userData - { firstName, lastName, country, city, email, password, phoneCode, phoneNumber }
   * @returns {Promise<Object>}
   */
  async signup(userData) {
    return await apiClient.post('/auth/signup', userData)
  },

  /**
   * Request password reset OTP / link to email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    return await apiClient.post('/auth/forgot-password', { email })
  },

  /**
   * Verify OTP code sent to email
   * @param {string} email
   * @param {string} otpCode
   * @returns {Promise<Object>}
   */
  async verifyOtp(email, otpCode) {
    return await apiClient.post('/auth/verify-otp', {
      email,
      otp: otpCode
    })
  },

  /**
   * Resend OTP verification code
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async resendOtp(email) {
    return await apiClient.post('/auth/resend-otp', { email })
  },

  /**
   * Reset user password with new credentials
   * @param {Object} payload - { email, newPassword, confirmPassword, token/otp }
   * @returns {Promise<Object>}
   */
  async resetPassword({ email, newPassword, confirmPassword, token }) {
    return await apiClient.post('/auth/reset-password', {
      email,
      newPassword,
      confirmPassword,
      token
    })
  },

  /**
   * Log out user and clear stored tokens
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Clean up local session even if server request fails
    } finally {
      this.removeToken()
    }
  },

  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>}
   */
  async getProfile() {
    return await apiClient.get('/auth/me')
  },

  // Token management helpers
  setToken(token, remember = true) {
    if (remember) {
      localStorage.setItem('auth_token', token)
    } else {
      sessionStorage.setItem('auth_token', token)
    }
  },

  getToken() {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  },

  removeToken() {
    localStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_token')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}

export default authService
