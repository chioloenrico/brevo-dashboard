import { fetchCampaigns } from '../brevo/fetchCampaigns.js'
import { saveCampaigns, getCachedCampaigns } from '../db.js'

// TTL constant: 15 minutes in milliseconds
const TTL_MINUTES = 15
const TTL_MS = TTL_MINUTES * 60 * 1000

/**
 * Check if cached data is stale
 * @param {number} timestamp - Cached data timestamp in milliseconds
 * @returns {boolean} - True if data is older than TTL
 */
function isStale(timestamp) {
  return Date.now() - timestamp > TTL_MS
}

/**
 * Get campaigns with smart caching logic
 * @returns {Promise<Array>} - Array of campaign objects
 */
export async function getCampaigns() {
  // Check for cached data
  const cached = getCachedCampaigns()

  // If cache exists and is fresh, return it immediately
  if (cached && !isStale(cached.timestamp)) {
    console.log('[Cache HIT] Returning fresh cached campaigns', {
      age: Math.round((Date.now() - cached.timestamp) / 1000 / 60),
      ttl: TTL_MINUTES
    })
    return cached.data
  }

  // Cache is stale or missing - need to fetch from API
  const cacheStatus = cached ? 'STALE' : 'MISS'
  console.log(`[Cache ${cacheStatus}] Fetching fresh campaigns from API`)

  try {
    // Call Brevo API to get fresh data
    const freshData = await fetchCampaigns()

    // Save fresh data to cache with current timestamp
    saveCampaigns(freshData)
    console.log('[Cache UPDATE] Fresh campaigns saved to cache')

    return freshData
  } catch (apiError) {
    // API call failed - try to use stale cache as fallback
    console.error('[API ERROR] Failed to fetch campaigns from Brevo:', apiError.message)

    if (cached && cached.data) {
      // Return stale cache as fallback
      console.log('[Cache FALLBACK] Returning stale cached campaigns due to API failure', {
        age: Math.round((Date.now() - cached.timestamp) / 1000 / 60),
        ttl: TTL_MINUTES
      })
      return cached.data
    }

    // Both API and cache failed - throw error
    throw new Error(
      `Failed to fetch campaigns from API and no cached data available. Original error: ${apiError.message}`
    )
  }
}
