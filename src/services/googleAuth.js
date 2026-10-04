/**
 * VibeLocate AI - Google Authentication Helper
 * Handles Google Identity Services (GIS) integration:
 * - Official Google Sign-In button rendering via renderButton() (Google recommendation)
 * - Custom button click trigger with graceful One-Tap fallback
 * - JWT credential parsing and ID Token extraction
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

let googleScriptLoaded = false

/**
 * Load Google Identity Services client script
 */
export function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (googleScriptLoaded || window.google?.accounts?.id) {
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
      reject(new Error('Failed to load Google Sign-In SDK. Check your internet connection.'))
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
 * Render official Google Sign-In button into a DOM container
 * Recommended by Google & handles popup window without One-Tap prompt suppression
 * 
 * @param {HTMLElement|string} container - Element or ID to render inside
 * @param {Function} onCredential - Callback receiving { email, name, picture, token }
 * @param {Object} options - Visual customization options
 */
export async function renderGoogleButton(container, onCredential, options = {}) {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('[googleAuth] VITE_GOOGLE_CLIENT_ID is not configured.')
    return false
  }

  try {
    const google = await loadGoogleScript()
    const target = typeof container === 'string' ? document.getElementById(container) : container
    if (!target) return false

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      cancel_on_tap_outside: false,
      callback: (credentialResponse) => {
        if (!credentialResponse?.credential) return
        const profile = decodeGoogleJwt(credentialResponse.credential) || {}
        if (onCredential) {
          onCredential({
            email: profile.email || '',
            name: profile.name || '',
            picture: profile.picture,
            token: credentialResponse.credential, // Google ID token for Backend
            verified: profile.email_verified === true
          })
        }
      }
    })

    google.accounts.id.renderButton(target, {
      theme: options.theme || 'outline',
      size: options.size || 'large',
      type: options.type || 'standard',
      shape: options.shape || 'pill',
      text: options.text || 'continue_with',
      logo_alignment: options.logo_alignment || 'center',
      width: options.width || 240,
      locale: options.locale || 'ar',
      ...options
    })

    return true
  } catch (err) {
    console.warn('[googleAuth] renderGoogleButton error:', err)
    return false
  }
}

/**
 * Trigger Google Sign In flow on custom button click
 * @returns {Promise<{ email: string, name: string, token: string, verified: boolean }>}
 */
export async function triggerGoogleSignIn() {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google Sign-In is not configured. Please check VITE_GOOGLE_CLIENT_ID.')
  }

  const google = await loadGoogleScript()

  return new Promise((resolve, reject) => {
    let isHandled = false

    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      cancel_on_tap_outside: false,
      callback: (credentialResponse) => {
        if (!credentialResponse?.credential) {
          if (!isHandled) {
            isHandled = true
            reject(new Error('Google Sign-In was cancelled or failed.'))
          }
          return
        }

        const profile = decodeGoogleJwt(credentialResponse.credential) || {}
        isHandled = true
        resolve({
          email: profile.email || '',
          name: profile.name || '',
          picture: profile.picture,
          token: credentialResponse.credential,
          verified: profile.email_verified === true
        })
      }
    })

    // Display Google One-Tap prompt
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason?.() || 'suppressed'
        console.warn('[googleAuth] Google prompt not displayed:', reason)
        // If One-Tap is suppressed by browser, give descriptive message
        if (!isHandled) {
          isHandled = true
          reject(new Error('Google sign-in prompt was blocked by browser. Please use the official Google button or allow popups.'))
        }
      } else if (notification.isSkippedMoment()) {
        const reason = notification.getSkippedReason?.() || 'skipped'
        console.warn('[googleAuth] Google prompt skipped:', reason)
        if (!isHandled) {
          isHandled = true
          reject(new Error('Google sign-in was dismissed. Please click the button to try again.'))
        }
      }
    })
  })
}
