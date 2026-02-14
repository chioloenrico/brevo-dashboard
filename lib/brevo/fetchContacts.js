import { mapBrevoToContact } from './mapBrevoToContact.js'

/**
 * Fetches contacts from Brevo API and transforms them using mapBrevoToContact.
 *
 * @param {number} limit - Maximum number of contacts to fetch per request (default: 50)
 * @param {number} offset - Number of contacts to skip for pagination (default: 0)
 * @returns {Promise<Array>} Array of transformed contact objects
 * @throws {Error} If API Key is missing, network error, or API error occurs
 */
export async function fetchContacts(limit = 50, offset = 0) {
  // Verify API Key is present
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'BREVO_API_KEY is not set. Please configure it in your .env.local file.'
    )
  }

  try {
    // Construct API URL with pagination parameters
    const apiUrl = `https://api.brevo.com/v3/contacts?limit=${limit}&offset=${offset}`

    // Fetch contacts from Brevo API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'api-key': apiKey,
        'Accept': 'application/json',
      },
    })

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Brevo API authentication failed (${response.status}). Please check your API Key.`
        )
      }
      if (response.status === 429) {
        throw new Error(
          'Brevo API rate limit exceeded. Please try again later.'
        )
      }
      if (response.status >= 500) {
        throw new Error(
          `Brevo API server error (${response.status}). Please try again later.`
        )
      }
      throw new Error(
        `Brevo API error (${response.status}): ${response.statusText}`
      )
    }

    // Parse JSON response
    const data = await response.json()

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Unexpected response format from Brevo API: response is not an object')
    }

    // Handle contacts array
    if (!Array.isArray(data.contacts)) {
      throw new Error('Unexpected response format from Brevo API: contacts is not an array')
    }

    // Transform each contact using mapBrevoToContact
    const transformedContacts = data.contacts.map(mapBrevoToContact)

    return transformedContacts
  } catch (error) {
    // Re-throw known errors
    if (error instanceof Error && error.message.includes('Brevo API')) {
      throw error
    }
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Network error: Unable to connect to Brevo API. Please check your internet connection.'
      )
    }
    // Re-throw other errors
    throw error
  }
}
