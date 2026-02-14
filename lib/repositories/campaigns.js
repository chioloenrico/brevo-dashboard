import { fetchCampaigns } from '../brevo/fetchCampaigns.js'
import { getOrSetCache } from '../cache/repository.js'
import { saveEntity, getCachedEntity } from '../db.js'

/**
 * Get campaigns with smart caching logic
 * @returns {Promise<Array>} - Array of campaign objects
 */
export async function getCampaigns() {
  return getOrSetCache({
    cacheKey: 'campaigns',
    fetchFn: fetchCampaigns,
    getCachedFn: () => getCachedEntity('campaigns'),
    saveCachedFn: (data) => saveEntity('campaigns', data),
    ttlMinutes: 15
  })
}
