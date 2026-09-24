import apiClient from './api'

/**
 * VibeLocate AI - Authentication & User Service
 * Fully mapped to the official VibeLocate Laravel API Postman Collection:
 * 01 - Authentication (Register, Verify OTP, Resend OTP, Login, Google Login)
 * 02 - Tokens & Session Auth (Refresh Token, Remember Me, Logout)
 * 03 - Password Management (Forgot Password, Verify Reset OTP, Reset Password, Change Password OTP)
 * 04 - Profile (Get Profile, Update Profile, Complete Profile, Avatar Upload)
 * 05 - Sessions (Get Sessions, Delete Session)
 * 06 - Two-Factor Authentication (Get Status, Start 2FA, Verify 2FA, Disable 2FA)
 */

export const authService = {
  // =========================================================================
  // DEVICE & IDENTIFIER HELPERS
  // =========================================================================

  /**
   * Generates or retrieves a persistent device UUID for session tracking
   */
  getDeviceUuid() {
    try {
      let uuid = localStorage.getItem('vibe_device_uuid')
      if (!uuid) {
        uuid = 'web-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now()
        localStorage.setItem('vibe_device_uuid', uuid)
      }
      return uuid
    } catch {
      return 'web-browser'
    }
  },

  // =========================================================================
  // 01 - AUTHENTICATION
  // =========================================================================

  /**
   * Log in user
   * POST /api/login
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} response data (access_token, refresh_token, user info)
   */
  async login({ email, password, rememberMe = true }) {
  const data = await apiClient.post('/login', {
    email,
    password,
    rememberMe
  })

  const accessToken =
    data?.access_token ||
    data?.token ||
    data?.data?.access_token ||
    data?.data?.token

  const refreshToken =
    data?.refresh_token ||
    data?.data?.refresh_token

  if (accessToken) {
    this.clearUserCache()

    this.setTokens(
      accessToken,
      refreshToken,
      rememberMe
    )
  }

  return data
},

  /**
   * Exchange a Google ID token for an application session token
   * POST /api/auth/google
   * @param {string} idToken
   * @param {boolean} rememberMe
   * @returns {Promise<Object>}
   */
  async loginWithGoogle(idToken, rememberMe = true) {
    const data = await apiClient.post('/auth/google', {
      id_token: idToken,
      device_uuid: this.getDeviceUuid(),
      device_type: 'web'
    })

    const accessToken = data?.access_token || data?.token || data?.data?.token
    const refreshToken = data?.refresh_token || data?.data?.refresh_token

    if (accessToken) {
      this.clearUserCache()
      this.setTokens(accessToken, refreshToken, rememberMe)
    }

    return data
  },


  /**
   * Register a new user
   * POST /api/register
   * @param {Object} userData - { first_name, last_name, email, phone, password, password_confirmation, role_slug, city, country }
   * @returns {Promise<Object>}
   */
  async signup(userData) {
    // Normalize names and fields from frontend forms
    const fullName = (userData.full_name || userData.name || '').trim()
    const nameParts = fullName.split(' ')
    const firstName = userData.first_name || nameParts[0] || 'User'
    const lastName = userData.last_name || nameParts.slice(1).join(' ') || ''

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: (userData.email || '').trim(),
      phone: userData.phone || '+971500000000',
      password: userData.password,
      password_confirmation: userData.password_confirmation || userData.confirmPassword || userData.password,
      role_slug: userData.role_slug || 'tenant',
      city: userData.city || 'Dubai',
      country: userData.country || 'United Arab Emirates'
    }

    const data = await apiClient.post('/register', payload)

    const accessToken = data?.access_token || data?.token || data?.data?.token
    const refreshToken = data?.refresh_token || data?.data?.refresh_token
    if (accessToken) {
      this.setTokens(accessToken, refreshToken, true)
    }

    return data
  },

  /**
   * Verify email OTP code for registration
   * POST /api/verify-otp
   * @param {string} email
   * @param {string} otpCode
   * @returns {Promise<Object>}
   */
  async verifyOtp(email, otpCode) {
    const data = await apiClient.post('/verify-otp', {
      email: (email || '').trim(),
      otp: String(otpCode).trim(),
      device_uuid: this.getDeviceUuid(),
      device_type: 'desktop'
    })

    const accessToken = data?.access_token || data?.token || data?.data?.token
    const refreshToken = data?.refresh_token || data?.data?.refresh_token
    if (accessToken) {
      this.setTokens(accessToken, refreshToken, true)
    }

    return data
  },

  /**
   * Resend registration verification OTP
   * POST /api/resend-otp
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async resendOtp(email) {
    return await apiClient.post('/resend-otp', { email: (email || '').trim() })
  },

  // =========================================================================
  // 02 - TOKENS & SESSION AUTH
  // =========================================================================

  /**
   * Refresh the access token using the stored refresh token
   * POST /api/refresh-token
   * @returns {Promise<Object>}
   */
  async refreshToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token found')

    const data = await apiClient.post('/refresh-token', {
      refresh_token: refreshToken
    })

    const accessToken = data?.access_token || data?.token
    if (accessToken) {
      this.setTokens(accessToken, data?.refresh_token, true)
    }

    return data
  },

  async rememberMe(remember = true) {
    const refreshToken = this.getRefreshToken()
    return await apiClient.post('/remember-me', {
      remember_me: Boolean(remember),
      refresh_token: refreshToken
    })
  },

  async logout() {
    try {
      const refreshToken = this.getRefreshToken()
      await apiClient.post('/logout', { refresh_token: refreshToken || '' })
    } catch {
      // Ignore network failures — always clean up locally
    } finally {
      this.removeToken()   // removes both access + refresh tokens
      this.clearUserCache()
    }
  },

  // =========================================================================
  // 03 - PASSWORD MANAGEMENT
  // =========================================================================

  /**
   * Request password reset OTP
   * POST /api/forgot-password
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    return await apiClient.post('/forgot-password', { email: (email || '').trim() })
  },

  /**
   * Verify password reset OTP code
   * POST /api/verify-reset-otp
   * @param {string} email
   * @param {string} otpCode
   * @returns {Promise<Object>} - returns { reset_token, ... }
   */
  async verifyResetOtp(email, otpCode) {
    const data = await apiClient.post('/verify-reset-otp', {
      email: (email || '').trim(),
      otp: String(otpCode).trim()
    })

    if (data?.reset_token) {
      localStorage.setItem('vibe_reset_token', data.reset_token)
    }

    return data
  },

  /**
   * Reset user password using token from verify-reset-otp
   * POST /api/reset-password
   * @param {Object} payload - { email, token, newPassword, confirmPassword }
   * @returns {Promise<Object>}
   */
  async resetPassword({ email, token, newPassword, confirmPassword }) {
    const storedToken = token || localStorage.getItem('vibe_reset_token') || ''
    const res = await apiClient.post('/reset-password', {
      email: (email || '').trim(),
      token: storedToken,
      new_password: newPassword,
      // Backwards-compatible aliases
      new_password_confirmation: confirmPassword || newPassword,
      password: newPassword,
      password_confirmation: confirmPassword || newPassword,
      otp: storedToken
    })

    localStorage.removeItem('vibe_reset_token')
    return res
  },

  /**
   * Change password - Step 1: Request change-password OTP
   * POST /api/change-password
   * @param {Object} payload - { currentPassword, newPassword }
   * @returns {Promise<Object>}
   */
  async sendChangePasswordOtp({ currentPassword, newPassword }) {
    return await apiClient.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    })
  },

  /**
   * Change password - Step 2: Confirm with OTP
   * POST /api/change-password
   * @param {Object} payload - { currentPassword, newPassword, otp }
   * @returns {Promise<Object>}
   */
  async confirmChangePassword({ currentPassword, newPassword, otp }) {
    return await apiClient.post('/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      otp: String(otp).trim()
    })
  },

  /**
   * Unified changePassword method (supports direct change or with OTP)
   */
  async changePassword({ currentPassword, newPassword, confirmPassword, otp }) {
    const payload = {
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword || newPassword
    }
    if (otp) {
      payload.otp = String(otp).trim()
    }

    return await apiClient.post('/change-password', payload)
  },

  // =========================================================================
  // 04 - PROFILE
  // =========================================================================

  /**
   * Fetch user profile
   * GET /api/profile
   * @returns {Promise<Object>}
   */
  async getProfile() {
    try {
      const data = await apiClient.get('/profile')
      const profile = data?.profile || data?.user || data?.data || data
      if (profile) {
        if (profile.full_name || profile.name) localStorage.setItem('vibe_user_name', profile.full_name || profile.name)
        if (profile.email) localStorage.setItem('vibe_user_email', profile.email)
        if (profile.avatar || profile.avatar_url) localStorage.setItem('vibe_user_avatar', profile.avatar || profile.avatar_url)
      }
      return data
    } catch (err) {
      // Fallback to /user if /profile returns error
      try {
        return await apiClient.get('/user')
      } catch {
        throw err
      }
    }
  },

  /**
   * Update profile details
   * PUT /api/profile
   * @param {Object} payload - { full_name, email, phone, city, country, bio }
   * @returns {Promise<Object>}
   */
  async updateProfile(payload) {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      // If uploading avatar via updateProfile, use official /profile/avatar endpoint
      return await this.uploadAvatar(payload.get('avatar') || payload.get('photo'))
    }

    const res = await apiClient.put('/profile', payload)

    const profile = res?.profile || res?.user || res?.data || res
    if (profile) {
      if (profile.full_name || profile.name) localStorage.setItem('vibe_user_name', profile.full_name || profile.name)
      if (profile.email) localStorage.setItem('vibe_user_email', profile.email)
    }

    return res
  },

  /**
   * Upload user avatar photo
   * POST /api/profile/avatar (FormData: avatar)
   * @param {File} file
   * @returns {Promise<Object>}
   */
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    // Add common fallback field names
    formData.append('photo', file)

    const res = await apiClient.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const avatarUrl = res?.avatar_url || res?.avatar || res?.data?.avatar_url
    if (avatarUrl) {
      localStorage.setItem('vibe_user_avatar', avatarUrl)
    }

    return res
  },

  /**
   * Complete user profile setup
   * POST /api/complete-profile
   * @param {Object} payload - { preferred_language, currency }
   * @returns {Promise<Object>}
   */
  async completeProfile(payload = { preferred_language: 'en', currency: 'AED' }) {
    return await apiClient.post('/complete-profile', payload)
  },

  // =========================================================================
  // 05 - SESSIONS
  // =========================================================================

  /**
   * Get all active sessions for current user
   * GET /api/sessions
   * @returns {Promise<Object>}
   */
  async getSessions() {
    return await apiClient.get('/sessions')
  },

  /**
   * Terminate a specific session
   * DELETE /api/sessions
   * @param {string|number} deviceId
   * @returns {Promise<Object>}
   */
  async deleteSession(deviceId) {
    return await apiClient.delete('/sessions', {
      data: { device_id: deviceId }
    })
  },

  // =========================================================================
  // 06 - TWO-FACTOR AUTHENTICATION (2FA)
  // =========================================================================

  /**
   * Get 2FA Status
   * GET /api/two-factor
   * @returns {Promise<Object>}
   */
  async get2FAStatus() {
    return await apiClient.get('/two-factor')
  },

  /**
   * Start 2FA setup process
   * POST /api/two-factor
   * @returns {Promise<Object>}
   */
  async start2FA() {
    return await apiClient.post('/two-factor', { action: 'start' })
  },

  /**
   * Verify and enable 2FA with 6-digit code
   * POST /api/two-factor
   * @param {string} code
   * @returns {Promise<Object>}
   */
  async verify2FA(code) {
    return await apiClient.post('/two-factor', {
      action: 'verify',
      code: String(code).trim()
    })
  },

  /**
   * Disable 2FA
   * DELETE /api/two-factor
   * @returns {Promise<Object>}
   */
  async disable2FA() {
    return await apiClient.delete('/two-factor')
  },

  // =========================================================================
  // TOKEN & LOCAL STORAGE MANAGEMENT
  // =========================================================================

  /**
   * Save both access token and refresh token at once.
   * Clears any existing tokens from both storages first.
   */
  setTokens(accessToken, refreshToken, remember = true) {
  this.removeToken()

  const storage = remember
    ? localStorage
    : sessionStorage

  if (accessToken) {
    storage.setItem('auth_token', accessToken)
  }

  if (refreshToken) {
    storage.setItem('refresh_token', refreshToken)
  }
},

setToken(token, remember = true) {
  const storage = remember
    ? localStorage
    : sessionStorage

  storage.setItem('auth_token', token)
},

getToken() {
  return (
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token')
  )
},

getRefreshToken() {
  return (
    localStorage.getItem('refresh_token') ||
    sessionStorage.getItem('refresh_token')
  )
},

removeToken() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')

  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('refresh_token')
},

  removeRefreshToken() {
    localStorage.removeItem('refresh_token')
    sessionStorage.removeItem('refresh_token')
  },

  clearUserCache() {
    localStorage.removeItem('vibe_user_name')
    localStorage.removeItem('vibe_user_email')
    localStorage.removeItem('vibe_user_avatar')
    localStorage.removeItem('auth_user')
  },

  isAuthenticated() {
    return !!this.getToken()
  },

  getCurrentUser() {
    return {
      name: localStorage.getItem('vibe_user_name') || '',
      email: localStorage.getItem('vibe_user_email') || '',
      avatar: localStorage.getItem('vibe_user_avatar') || ''
    }
  }
}

export default authService

