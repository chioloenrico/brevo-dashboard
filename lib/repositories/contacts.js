import { fetchContacts } from '../brevo/fetchContacts.js'
import { getOrSetCache } from '../cache/repository.js'
import { saveEntity, getCachedEntity } from '../db.js'

/**
 * Synchronize all contacts from Brevo through pagination.
 * Fetches all pages of contacts, accumulates them, and saves to database atomically.
 *
 * @returns {Promise<Array>} - Complete array of all contact objects from Brevo
 * @throws {Error} If API errors occur during pagination (network, auth, rate limit, etc.)
 */
export async function syncAllContacts() {
  const allContacts = []
  let offset = 0
  const limit = 50

  while (true) {
    // Fetch a page of contacts
    const page = await fetchContacts(limit, offset)

    // Accumulate contacts from this page
    allContacts.push(...page)

    // Stop if we got fewer results than the limit (last page)
    if (page.length < limit) {
      break
    }

    // Move to next page
    offset += limit
  }

  // Save complete contact list to database atomically
  saveEntity('contacts', allContacts)

  return allContacts
}

/**
 * Get contacts with smart caching logic
 * @returns {Promise<Array>} - Array of contact objects
 */
export async function getContacts() {
  return getOrSetCache({
    cacheKey: 'contacts',
    fetchFn: syncAllContacts,
    getCachedFn: () => getCachedEntity('contacts'),
    saveCachedFn: (data) => saveEntity('contacts', data),
    ttlMinutes: 15
  })
}
