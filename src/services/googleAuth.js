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
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Sign-In is not configured.')
  }

  const google = await loadGoogleScript()
  return new Promise((resolve, reject) => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (credentialResponse) => {
        if (!credentialResponse?.credential) {
          reject(new Error('Google Sign-In was cancelled or failed.'))
          return
        }

        const profile = decodeGoogleJwt(credentialResponse.credential) || {}
        resolve({
          email: profile.email || '',
          name: profile.name || '',
          picture: profile.picture,
          // This is the Google ID token required by the backend.
          token: credentialResponse.credential,
          verified: profile.email_verified === true
        })
      }
    })

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reject(new Error('Google sign-in prompt could not be displayed. Please allow pop-ups and try again.'))
      }
    })
  })
}
