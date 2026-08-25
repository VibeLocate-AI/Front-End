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
    const data = await apiClient.post('/login', {
      email,
      password,
      rememberMe
    })

    const token = data?.token || data?.access_token || data?.data?.token
    if (token) {
      this.setToken(token, rememberMe)
    }

    return data
  },

  /**
   * Register a new user (Laravel /register)
   * @param {Object} userData - payload to send to Laravel backend
   * @returns {Promise<Object>}
   */
  async signup(userData) {
    const data = await apiClient.post('/register', userData)
    const token = data?.token || data?.access_token || data?.data?.token
    if (token) {
      this.setToken(token, true)
    }
    return data
  },

  /**
   * Request password reset OTP / link to email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    return await apiClient.post('/forgot-password', { email })
  },

  /**
   * Verify OTP code sent to email (account registration verification)
   * @param {string} email
   * @param {string} otpCode
   * @returns {Promise<Object>}
   */
  async verifyOtp(email, otpCode) {
    return await apiClient.post('/verify-otp', {
      email,
      otp: otpCode
    })
  },

  /**
   * Verify OTP code for password reset flow
   * Uses a separate endpoint: /api/verify-reset-otp
   * @param {string} email
   * @param {string} otpCode
   * @returns {Promise<Object>}
   */
  async verifyResetOtp(email, otpCode) {
    return await apiClient.post('/verify-reset-otp', {
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
    return await apiClient.post('/resend-otp', { email })
  },

  /**
   * Reset user password with new credentials
   * @param {Object} payload - { email, newPassword, confirmPassword, token }
   * @returns {Promise<Object>}
   */
  async resetPassword({ email, newPassword, confirmPassword, token }) {
    return await apiClient.post('/reset-password', {
      email,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
      password: newPassword,
      password_confirmation: confirmPassword,
      token,
      otp: token
    })
  },

  /**
   * Log out user and clear stored tokens
   */
  async logout() {
    try {
      await apiClient.post('/logout')
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
    return await apiClient.get('/user')
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
