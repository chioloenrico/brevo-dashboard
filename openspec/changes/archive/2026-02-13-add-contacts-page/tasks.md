## 1. Generic Cache Repository Implementation

- [x] 1.1 Create `lib/cache/` directory
- [x] 1.2 Create `lib/cache/repository.js` file
- [x] 1.3 Implement `isStale(timestamp, ttlMinutes)` helper function
- [x] 1.4 Implement `getOrSetCache(options)` function with cacheKey, fetchFn, getCachedFn, saveCachedFn, ttlMinutes parameters
- [x] 1.5 Add cache freshness check logic (return cached data if not stale)
- [x] 1.6 Add fetch logic when cache is stale or missing
- [x] 1.7 Add fallback to stale cache on fetch error
- [x] 1.8 Add logging for cache HIT, MISS, STALE, FALLBACK with cacheKey
- [x] 1.9 Export `getOrSetCache` as named export

## 2. Generic Database Operations

- [x] 2.1 Add `saveEntity(tableName, data)` function to `lib/db.js`
- [x] 2.2 Implement JSON serialization in `saveEntity()`
- [x] 2.3 Implement table creation with `CREATE TABLE IF NOT EXISTS <tableName>` in `saveEntity()`
- [x] 2.4 Implement data insert/replace and cache_metadata update in `saveEntity()`
- [x] 2.5 Add `getCachedEntity(tableName)` function to `lib/db.js`
- [x] 2.6 Implement data retrieval and JSON deserialization in `getCachedEntity()`
- [x] 2.7 Implement timestamp retrieval from cache_metadata in `getCachedEntity()`
- [x] 2.8 Handle missing data gracefully (return null) in `getCachedEntity()`
- [x] 2.9 Handle corrupted JSON gracefully (catch parse errors, return null) in `getCachedEntity()`
- [x] 2.10 Export `saveEntity` and `getCachedEntity` as named exports

## 3. Contacts Database Schema

- [x] 3.1 Update `setupSchema()` in `lib/db.js` to create `contacts` table (id, data, created_at)
- [x] 3.2 Verify `contacts` table schema matches pattern: `id INTEGER PRIMARY KEY`, `data TEXT NOT NULL`, `created_at INTEGER NOT NULL`
- [x] 3.3 Ensure schema creation is idempotent with `CREATE TABLE IF NOT EXISTS`

## 4. Contacts Repository Implementation

- [x] 4.1 Create `lib/repositories/contacts.js` file
- [x] 4.2 Import `fetchContacts` from `lib/brevo/fetchContacts.js`
- [x] 4.3 Import `getOrSetCache` from `lib/cache/repository.js`
- [x] 4.4 Import `saveEntity` and `getCachedEntity` from `lib/db.js`
- [x] 4.5 Implement `getContacts()` function using `getOrSetCache()`
- [x] 4.6 Configure `getOrSetCache()` with cacheKey='contacts', fetchFn=fetchContacts
- [x] 4.7 Configure `getOrSetCache()` with getCachedFn calling `getCachedEntity('contacts')`
- [x] 4.8 Configure `getOrSetCache()` with saveCachedFn calling `saveEntity('contacts', data)`
- [x] 4.9 Set TTL to 15 minutes (or use default)
- [x] 4.10 Export `getContacts` as named export

## 5. Refactor Campaigns Repository

- [x] 5.1 Import `getOrSetCache` from `lib/cache/repository.js` in `lib/repositories/campaigns.js`
- [x] 5.2 Import `saveEntity` and `getCachedEntity` from `lib/db.js`
- [x] 5.3 Replace cache-or-fetch logic in `getCampaigns()` with `getOrSetCache()` call
- [x] 5.4 Configure `getOrSetCache()` with cacheKey='campaigns', fetchFn=fetchCampaigns
- [x] 5.5 Configure `getOrSetCache()` with getCachedFn calling `getCachedEntity('campaigns')`
- [x] 5.6 Configure `getOrSetCache()` with saveCachedFn calling `saveEntity('campaigns', data)`
- [x] 5.7 Remove old `isStale()`, cache check, and fallback logic (now in getOrSetCache)
- [x] 5.8 Remove imports of `saveCampaigns` and `getCachedCampaigns` (replaced by generic functions)
- [x] 5.9 Verify logging format matches original (cache HIT/MISS/STALE/FALLBACK with 'campaigns' key)

## 6. UI Components Implementation

- [x] 6.1 Create `app/contacts/` directory
- [x] 6.2 Create `app/contacts/ContactList.js` file with `'use client'` directive
- [x] 6.3 Implement ContactList component with table structure (email, firstName, lastName, createdAt, emailBlacklisted)
- [x] 6.4 Add visual indicator for blacklisted contacts (badge, icon, or color)
- [x] 6.5 Handle missing firstName/lastName with placeholder ("-" or "N/A")
- [x] 6.6 Apply Tailwind styling consistent with CampaignList
- [x] 6.7 Create `app/contacts/ContactStatsHeader.js` file
- [x] 6.8 Implement `calculateContactMetrics(contacts)` helper function
- [x] 6.9 Calculate total contacts count and blacklisted contacts count
- [x] 6.10 Implement ContactStatsHeader component to display metrics
- [x] 6.11 Apply Tailwind styling consistent with CampaignStatsHeader
- [x] 6.12 Handle zero contacts case (display 0 values)

## 7. Contacts Page Implementation

- [x] 7.1 Create `app/contacts/page.js` file
- [x] 7.2 Import `getContacts` from `lib/repositories/contacts.js`
- [x] 7.3 Import ContactList and ContactStatsHeader components
- [x] 7.4 Implement async Server Component that calls `getContacts()`
- [x] 7.5 Calculate metrics using `calculateContactMetrics(contacts)`
- [x] 7.6 Render page title "I miei Contatti" (or similar)
- [x] 7.7 Render ContactStatsHeader with metrics
- [x] 7.8 Render ContactList with contacts
- [x] 7.9 Add error handling with try/catch and error display
- [x] 7.10 Handle empty contacts array (display message if no contacts)

## 8. Verification & Testing

- [x] 8.1 Verify `contacts` table is created in database on first run
- [x] 8.2 Verify generic functions (`saveEntity`, `getCachedEntity`) work correctly
- [x] 8.3 Test contacts repository: first page load should call API and save to cache (check logs for cache MISS)
- [x] 8.4 Test contacts repository: second page load within 15 minutes should use cache (check logs for cache HIT)
- [x] 8.5 Test refactored campaigns repository: verify cache behavior unchanged (HIT/MISS/STALE/FALLBACK still work)
- [x] 8.6 Build Next.js app to verify no syntax errors (`npm run build`)
- [x] 8.7 Verify `/contacts` route is accessible and renders correctly
- [x] 8.8 Verify ContactList displays all contact fields correctly
- [x] 8.9 Verify ContactStatsHeader shows correct metrics
- [x] 8.10 Test blacklist indicator visual display
- [x] 8.11 Test error handling (simulate API failure, verify stale cache fallback)
- [x] 8.12 Test empty contacts scenario (verify message is displayed)
