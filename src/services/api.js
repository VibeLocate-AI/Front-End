import axios from 'axios'

/**
 * VibeLocate AI - Central Axios API Instance
 * Handles:
 * - Access token attachment
 * - Automatic refresh token rotation
 * - Retrying failed requests after token refresh
 * - Laravel validation / error normalization
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://vibelocate-laravel.onrender.com/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

/**
 * Separate Axios client used only for refreshing tokens.
 * This prevents the refresh request itself from entering
 * the normal 401 interceptor loop.
 */
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const getAccessToken = () => {
  return (
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token')
  )
}

const getRefreshToken = () => {
  return (
    localStorage.getItem('refresh_token') ||
    sessionStorage.getItem('refresh_token')
  )
}

const saveTokens = (accessToken, refreshToken) => {
  const usingLocalStorage =
    localStorage.getItem('auth_token') !== null ||
    localStorage.getItem('refresh_token') !== null

  if (usingLocalStorage) {
    if (accessToken) {
      localStorage.setItem('auth_token', accessToken)
    }

    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }

    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('refresh_token')
  } else {
    if (accessToken) {
      sessionStorage.setItem('auth_token', accessToken)
    }

    if (refreshToken) {
      sessionStorage.setItem('refresh_token', refreshToken)
    }

    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }
}

const clearTokens = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')

  sessionStorage.removeItem('auth_token')
  sessionStorage.removeItem('refresh_token')
}

/**
 * Used to prevent several simultaneous 401 responses
 * from sending several refresh requests.
 */
let refreshPromise = null

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('Refresh token is not available')
  }

  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/refresh-token', {
        refresh_token: refreshToken
      })
      .then((response) => {
        const data = response.data

        if (
          !data?.success ||
          !data?.access_token ||
          !data?.refresh_token
        ) {
          throw new Error(
            data?.message || 'Could not refresh authentication token'
          )
        }

        saveTokens(
          data.access_token,
          data.refresh_token
        )

        return data.access_token
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

/**
 * Request Interceptor
 * Attach current access token to authenticated requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (
      typeof FormData !== 'undefined' &&
      config.data instanceof FormData
    ) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 */
apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.data.success === false
    ) {
      const msg =
        response.data.message ||
        response.data.error ||
        'Request failed'

      const customError = new Error(msg)

      customError.status = response.status
      customError.httpStatus = response.status
      customError.data = response.data
      customError.isSuccessFalse = true

      return Promise.reject(customError)
    }

    return response.data
  },

  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    /**
     * Access token expired.
     * Refresh once and retry the original request.
     */
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/login') &&
      !originalRequest.url?.includes('/refresh-token')
    ) {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        originalRequest._retry = true

        try {
          const newAccessToken =
            await refreshAccessToken()

          originalRequest.headers =
            originalRequest.headers || {}

          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`

          return apiClient(originalRequest)
        } catch (refreshError) {
          clearTokens()

          const customError = new Error(
            refreshError.response?.data?.message ||
            refreshError.message ||
            'Your session has expired. Please log in again.'
          )

          customError.status =
            refreshError.response?.status || 401

          customError.data =
            refreshError.response?.data

          return Promise.reject(customError)
        }
      }

      clearTokens()
    }

    let firstValidationError = ''

    if (
      error.response?.data?.errors &&
      typeof error.response.data.errors === 'object'
    ) {
      const errorList = Object.values(
        error.response.data.errors
      ).flat()

      if (errorList.length > 0) {
        firstValidationError = errorList[0]
      }
    }

    const message =
      firstValidationError ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please try again.'

    const customError = new Error(message)

    customError.status = status
    customError.httpStatus = status
    customError.data = error.response?.data
    customError.errors =
      error.response?.data?.errors

    return Promise.reject(customError)
  }
)

export default apiClient