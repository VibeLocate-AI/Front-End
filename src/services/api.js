import axios from 'axios'

/**
 * VibeLocate AI - Central Axios API Instance
 * Configured with base URL, timeout, and request/response interceptors.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vibelocate-laravel.onrender.com'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request Interceptor: Attach Auth Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Standardize responses and handle Laravel validation / error formats
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // Extract first validation error if Laravel returns { errors: { field: [msg] } }
    let firstValidationError = ''
    if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
      const errorList = Object.values(error.response.data.errors).flat()
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

    // Handle 401 Unauthorized globally (e.g., token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
    }

    const customError = new Error(message)
    customError.status = error.response?.status
    customError.data = error.response?.data
    customError.errors = error.response?.data?.errors
    return Promise.reject(customError)
  }
)

export default apiClient

