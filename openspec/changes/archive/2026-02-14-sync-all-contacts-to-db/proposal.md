## Why

The current contact fetching implementation is hardcoded to retrieve only 50 contacts (`limit=50&offset=0`), which means the contact list is incomplete when users have more than 50 contacts. With potentially 10k+ contacts in Brevo, this limitation prevents users from viewing and working with their full contact database. We need to implement pagination to download and cache all contacts from Brevo.

## What Changes

- Add pagination support to Brevo contacts API fetching to retrieve all contacts through multiple API calls
- Implement batch synchronization process that iterates through all pages of contacts
- Store complete contact list in the local SQLite database for caching
- Update the contacts repository to orchestrate the full sync process
- Handle API rate limiting and errors during batch fetching

## Capabilities

### New Capabilities

- `contact-batch-sync`: Orchestrates the process of fetching all contacts from Brevo through pagination, handling multiple API requests, and saving the complete dataset to the database

### Modified Capabilities

- `brevo-contacts-fetch`: The fetching function needs to accept pagination parameters (limit, offset) as arguments instead of using hardcoded values, enabling it to be called multiple times for different pages of contacts

## Impact

**Affected Code:**
- `lib/brevo/fetchContacts.js` - needs to accept limit/offset parameters
- `lib/repositories/contacts.js` - needs to implement batch sync logic
- Potentially `lib/cache/repository.js` - may need consideration for batch update patterns

**Performance Considerations:**
- With 10k contacts, this will require ~200 API calls at 50 contacts per page
- Process will be slower on initial sync but cached afterward
- Rate limiting from Brevo API needs to be handled gracefully

**Dependencies:**
- Relies on existing smart-caching and local-data-persistence capabilities
- Uses existing SQLite database schema for contacts storage
