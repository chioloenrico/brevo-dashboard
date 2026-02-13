/**
 * Maps a Brevo campaign object to a simplified structure.
 * Exposes statistics.globalStats as stats for easier access,
 * while maintaining all original property names from the API.
 * 
 * @param {Object} brevoCampaign - Campaign object from Brevo API
 * @returns {Object} Campaign object with stats property added/modified
 */
export function mapBrevoToCampaign(brevoCampaign) {
  // Create a new object to avoid mutating the input (pure function)
  const mapped = { ...brevoCampaign }

  // Handle statistics.globalStats
  if (
    brevoCampaign.statistics &&
    brevoCampaign.statistics.globalStats &&
    typeof brevoCampaign.statistics.globalStats === 'object'
  ) {
    // Expose globalStats as stats, maintaining all original property names
    mapped.stats = { ...brevoCampaign.statistics.globalStats }
  } else {
    // Handle missing statistics, missing globalStats, or null/undefined values
    mapped.stats = null
  }

  return mapped
}
