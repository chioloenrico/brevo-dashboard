/**
 * Check if cached data is stale based on TTL
 * @param {number} timestamp - Cached data timestamp in milliseconds
 * @param {number} ttlMinutes - Time to live in minutes
 * @returns {boolean} - True if data is older than TTL
 */
function isStale(timestamp, ttlMinutes) {
  const ttlMs = ttlMinutes * 60 * 1000
  return Date.now() - timestamp > ttlMs
}

/**
 * Generic cache-or-fetch function for any entity
 * @param {Object} options - Configuration options
 * @param {string} options.cacheKey - Cache key for logging (e.g., 'campaigns', 'contacts')
 * @param {Function} options.fetchFn - Async function to fetch fresh data: () => Promise<Array>
 * @param {Function} options.getCachedFn - Function to get cached data: () => { data, timestamp } | null
 * @param {Function} options.saveCachedFn - Function to save data to cache: (data) => void
 * @param {number} [options.ttlMinutes=15] - Time to live in minutes (default: 15)
 * @returns {Promise<Array>} - Promise that resolves to entity data array
 */
export async function getOrSetCache(options) {
  const {
    cacheKey,
    fetchFn,
    getCachedFn,
    saveCachedFn,
    ttlMinutes = 15
  } = options

  // 1. Check for cached data
  const cached = getCachedFn()

  // 2. If cache exists and is fresh, return it immediately
  if (cached && !isStale(cached.timestamp, ttlMinutes)) {
    console.log(`[Cache HIT] Returning fresh cached ${cacheKey}`, {
      age: Math.round((Date.now() - cached.timestamp) / 1000 / 60),
      ttl: ttlMinutes
    })
    return cached.data
  }

  // 3. Cache is stale or missing - need to fetch from source
  const cacheStatus = cached ? 'STALE' : 'MISS'
  console.log(`[Cache ${cacheStatus}] Fetching fresh ${cacheKey} from source`)

  try {
    // 4. Fetch fresh data
    const freshData = await fetchFn()

    // 5. Save fresh data to cache
    saveCachedFn(freshData)
    console.log(`[Cache UPDATE] Fresh ${cacheKey} saved to cache`)

    return freshData
  } catch (fetchError) {
    // 6. Fetch failed - try to use stale cache as fallback
    console.error(`[Fetch ERROR] Failed to fetch ${cacheKey}:`, fetchError.message)

    if (cached && cached.data) {
      // Return stale cache as fallback
      console.log(`[Cache FALLBACK] Returning stale cached ${cacheKey} due to fetch failure`, {
        age: Math.round((Date.now() - cached.timestamp) / 1000 / 60),
        ttl: ttlMinutes
      })
      return cached.data
    }

    // Both fetch and cache failed - throw error
    throw new Error(
      `Failed to fetch ${cacheKey} from source and no cached data available. Original error: ${fetchError.message}`
    )
  }
}
