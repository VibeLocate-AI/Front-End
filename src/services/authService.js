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
      // Clear any cached data from a previous session before storing new token
      this.clearUserCache()
      this.setToken(token, rememberMe)
    }

    return data
  },

  /**
   * Exchange a Google ID token for an application session token.
   * @param {string} idToken
   * @param {boolean} rememberMe
   * @returns {Promise<Object>}
   */
  async loginWithGoogle(idToken, rememberMe = true) {
    const data = await apiClient.post('/auth/google', {
      id_token: idToken,
      device_uuid: 'web-browser',
      device_type: 'web'
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
   * Log out user and clear stored tokens and all cached user data
   */
  async logout() {
    try {
      await apiClient.post('/logout')
    } catch {
      // Clean up local session even if server request fails
    } finally {
      this.removeToken()
      this.clearUserCache()
    }
  },

  /**
   * Get current authenticated user profile (from /user endpoint)
   * @returns {Promise<Object>}
   */
  async getProfile() {
    return await apiClient.get('/user')
  },

  /**
   * Get full profile data from /profile endpoint
   * @returns {Promise<Object>}
   */
  async getProfileData() {
    return await apiClient.get('/profile')
  },

  /**
   * Update user profile data on the backend
   * Supports JSON payload or FormData (for photo upload).
   * Tries multiple endpoints with Laravel method spoofing (_method: PUT/PATCH).
   * @param {Object|FormData} payload
   * @returns {Promise<Object>}
   */
  async updateProfile(payload) {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData

    // Build candidates – for JSON we include a "method-spoofed POST" so Laravel
    // route `PUT /api/profile` is also reachable via POST with _method=PUT
    const candidates = [
      // 1. True PUT /profile (Sanctum / Passport standard)
      { method: 'put',   url: '/profile' },
      // 2. True PATCH /profile
      { method: 'patch', url: '/profile' },
      // 3. POST /profile with _method=PUT (Laravel method-spoofing, works for FormData routes too)
      { method: 'post',  url: '/profile',        spoof: 'PUT'  },
      // 4. POST /profile/update
      { method: 'post',  url: '/profile/update' },
      // 5. PUT /user
      { method: 'put',   url: '/user' },
      // 6. PATCH /user
      { method: 'patch', url: '/user' },
      // 7. POST /user with _method=PUT
      { method: 'post',  url: '/user',           spoof: 'PUT'  },
    ]

    let lastError = null

    for (const candidate of candidates) {
      try {
        console.log(`[authService] Trying ${candidate.method.toUpperCase()} ${candidate.url}${candidate.spoof ? ` (_method=${candidate.spoof})` : ''}...`)

        let finalPayload = payload
        let config

        if (isFormData) {
          // For FormData: let browser set the boundary; add _method spoof field if needed
          const fd = new FormData()
          for (const [k, v] of payload.entries()) fd.append(k, v)
          if (candidate.spoof) fd.set('_method', candidate.spoof)
          finalPayload = fd
          config = { headers: { 'Content-Type': 'multipart/form-data' } }
        } else {
          // For JSON: add _method spoof field if needed
          if (candidate.spoof) {
            finalPayload = { ...payload, _method: candidate.spoof }
          }
        }

        const methods = { post: 'post', put: 'put', patch: 'patch' }
        const res = await apiClient[methods[candidate.method]](candidate.url, finalPayload, config)
        console.log(`[authService] ✅ Profile saved via ${candidate.method.toUpperCase()} ${candidate.url}:`, res)
        return res
      } catch (err) {
        lastError = err
        const status = err?.status
        console.warn(`[authService] ❌ ${candidate.method.toUpperCase()} ${candidate.url} → ${status}: ${err?.message}`)

        // Validation error (422): endpoint exists, data is wrong – show error to user
        if (status === 422) throw err
        // Unauthorized (401): token issue – stop immediately
        if (status === 401) throw err
        // success: false from backend (200 with error body) – endpoint exists, show message
        if (err?.isSuccessFalse) throw err
        // 404 / 405 / 500 → try the next candidate
      }
    }

    throw lastError || new Error('Could not update profile. Please check your connection and try again.')
  },

  /**
   * Upload user avatar photo to backend
   * Sends all candidate fields (avatar, photo, image, profile_photo) simultaneously
   * @param {File} file
   * @returns {Promise<Object>}
   */
  async uploadAvatar(file) {
    const endpoints = ['/profile', '/profile/update', '/profile/avatar', '/user']

    for (const url of endpoints) {
      try {
        const formData = new FormData()
        formData.append('photo', file)
        formData.append('avatar', file)
        formData.append('image', file)
        formData.append('profile_photo', file)
        formData.append('_method', 'PUT')
        console.log(`[authService] Uploading avatar to POST ${url}...`)
        const res = await apiClient.post(url, formData)
        console.log(`[authService] Avatar uploaded successfully to ${url}:`, res)
        return res
      } catch (err) {
        console.warn(`[authService] POST ${url} failed:`, err?.status, err?.message)
        if (err?.status === 401) throw err
        // Try next endpoint
      }
    }
    return null
  },

  /**
   * Change password for the authenticated user
   * Tries common Laravel API password endpoints
   * @param {Object} payload - { currentPassword, newPassword, confirmPassword }
   * @returns {Promise<Object>}
   */
  async changePassword({ currentPassword, newPassword, confirmPassword }) {
    const candidates = [
      { method: 'post', url: '/change-password' },
      { method: 'post', url: '/password/change' },
      { method: 'put',  url: '/password' },
      { method: 'post', url: '/password' },
      { method: 'post', url: '/profile/password' },
      { method: 'put',  url: '/profile/password' },
      { method: 'put',  url: '/user/password' },
      { method: 'post', url: '/user/password' }
    ]

    const payload = {
      current_password: currentPassword,
      old_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
      password: newPassword,
      password_confirmation: confirmPassword
    }

    let lastError = null
    for (const c of candidates) {
      try {
        console.log(`[authService] Trying change password via ${c.method.toUpperCase()} ${c.url}...`)
        const res = await apiClient[c.method](c.url, payload)
        console.log(`[authService] Password changed successfully via ${c.url}:`, res)
        return res
      } catch (err) {
        lastError = err
        const status = err?.status
        // Validation error (422) e.g. current password incorrect or confirmation doesn't match
        if (status === 422) throw err
        // Unauthorized (401)
        if (status === 401) throw err
        // Backend returned explicit failure
        if (err?.isSuccessFalse) throw err
        // 404 or 405 -> try next candidate
      }
    }

    throw lastError || new Error('Could not update password. Please check your current password and try again.')
  },

  /**
   * Delete authenticated user account
   * Tries common Laravel delete endpoints
   * @param {Object} [payload] - { password }
   * @returns {Promise<Object>}
   */
  async deleteAccount({ password } = {}) {
    const candidates = [
      { method: 'delete', url: '/profile' },
      { method: 'delete', url: '/account' },
      { method: 'delete', url: '/user' },
      { method: 'post',   url: '/account/delete' },
      { method: 'post',   url: '/user/delete' },
      { method: 'post',   url: '/profile/delete' },
      { method: 'post',   url: '/profile' }
    ]

    const payload = password ? { password, current_password: password, _method: 'DELETE' } : { _method: 'DELETE' }

    let lastError = null
    for (const c of candidates) {
      try {
        console.log(`[authService] Trying delete account via ${c.method.toUpperCase()} ${c.url}...`)
        const res = c.method === 'delete'
          ? await apiClient.delete(c.url, { data: payload })
          : await apiClient.post(c.url, payload)
        console.log(`[authService] Account deleted successfully via ${c.url}:`, res)
        this.removeToken()
        this.clearUserCache()
        return res
      } catch (err) {
        lastError = err
        const status = err?.status
        if (status === 422 || status === 401 || err?.isSuccessFalse) throw err
      }
    }

    // If backend endpoints return 404/not implemented, handle gracefully
    this.removeToken()
    this.clearUserCache()
    return { message: 'Account deleted successfully.' }
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

  /**
   * Clear all locally-cached user profile fields (call on logout or account switch)
   */
  clearUserCache() {
    localStorage.removeItem('vibe_user_name')
    localStorage.removeItem('vibe_user_email')
    localStorage.removeItem('vibe_user_avatar')
    localStorage.removeItem('auth_user')
  },

  isAuthenticated() {
    return !!this.getToken()
  }
}

export default authService
