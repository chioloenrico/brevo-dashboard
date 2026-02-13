import { mapBrevoToCampaign } from './mapBrevoToCampaign.js'

const BREVO_API_URL = 'https://api.brevo.com/v3/emailCampaigns?statistics=globalStats'

/**
 * Fetches email campaigns from Brevo API and transforms them using mapBrevoToCampaign.
 * 
 * @returns {Promise<Array>} Array of transformed campaign objects
 * @throws {Error} If API Key is missing, network error, or API error occurs
 */
export async function fetchCampaigns() {
  // Verify API Key is present
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'BREVO_API_KEY is not set. Please configure it in your .env.local file.'
    )
  }

  try {
    // Fetch campaigns from Brevo API
    const response = await fetch(BREVO_API_URL, {
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

    // Handle campaigns array
    if (!Array.isArray(data.campaigns)) {
      throw new Error('Unexpected response format from Brevo API: campaigns is not an array')
    }

    // Transform each campaign using mapBrevoToCampaign
    const transformedCampaigns = data.campaigns.map(mapBrevoToCampaign)

    return transformedCampaigns
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
