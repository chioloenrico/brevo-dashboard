/**
 * Maps a Brevo contact object to a simplified structure.
 * Flattens attributes.NOME and attributes.COGNOME to firstName and lastName
 * for easier access in UI components, while preserving standard contact fields.
 *
 * @param {Object} brevoContact - Contact object from Brevo API
 * @returns {Object} Contact object with flattened attributes
 */
export function mapBrevoToContact(brevoContact) {
  // Create a new object to avoid mutating the input (pure function)
  const mapped = { ...brevoContact }

  // Extract firstName and lastName from attributes
  if (brevoContact.attributes && typeof brevoContact.attributes === 'object') {
    // Flatten NOME to firstName
    mapped.firstName = brevoContact.attributes.NOME ?? null
    // Flatten COGNOME to lastName
    mapped.lastName = brevoContact.attributes.COGNOME ?? null
  } else {
    // Handle missing or null attributes gracefully
    mapped.firstName = null
    mapped.lastName = null
  }

  return mapped
}
