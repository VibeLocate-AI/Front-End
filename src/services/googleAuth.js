import { authService } from './authService'

/**
 * VibeLocate AI - Google Authentication Helper
 * Handles Google Identity Services (GIS) integration and fallback handling.
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

let googleScriptLoaded = false

export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (googleScriptLoaded || window.google?.accounts) {
      googleScriptLoaded = true
      return resolve(window.google)
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      googleScriptLoaded = true
      resolve(window.google)
    }
    script.onerror = () => {
      reject(new Error('Failed to load Google Sign-In SDK.'))
    }
    document.head.appendChild(script)
  })
}

/**
 * Parse JWT token from Google credential
 */
export function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Trigger Google Sign In flow
 * @returns {Promise<{ email: string, name: string, token: string, verified: boolean }>}
 */
export async function triggerGoogleSignIn() {
  if (GOOGLE_CLIENT_ID) {
    try {
      const google = await loadGoogleScript()
      return new Promise((resolve, reject) => {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                // Fetch user info using access token
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                })
                const userInfo = await userInfoRes.json()
                resolve({
                  email: userInfo.email,
                  name: userInfo.name || userInfo.email.split('@')[0],
                  picture: userInfo.picture,
                  token: tokenResponse.access_token,
                  verified: userInfo.email_verified || true
                })
              } catch (err) {
                reject(err)
              }
            } else {
              reject(new Error('Google Sign-In was cancelled or failed.'))
            }
          },
          error_callback: (err) => reject(err)
        })
        client.requestAccessToken()
      })
    } catch (err) {
      console.warn('Google SDK Sign-In encountered an issue, falling back to prompt:', err)
    }
  }

  // Fallback: If VITE_GOOGLE_CLIENT_ID is not yet configured in .env
  return new Promise((resolve, reject) => {
    const inputEmail = window.prompt(
      'Google Sign-In:\nEnter your Google Email address to continue:',
      ''
    )

    if (!inputEmail || !inputEmail.trim()) {
      return reject(new Error('Google Sign-In was cancelled.'))
    }

    const cleanEmail = inputEmail.trim()
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    if (!isValid) {
      return reject(new Error('Please enter a valid Google email address.'))
    }

    resolve({
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      token: 'google_oauth_' + Date.now(),
      verified: false
    })
  })
}
