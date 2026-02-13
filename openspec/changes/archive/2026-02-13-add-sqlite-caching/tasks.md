## 1. Setup & Dependencies

- [x] 1.1 Install `better-sqlite3` dependency (`npm install better-sqlite3`)
- [x] 1.2 Create `data/` directory in project root if it doesn't exist
- [x] 1.3 Add `data/cache.db` to `.gitignore` file

## 2. Database Module Implementation

- [x] 2.1 Create `lib/db.js` file
- [x] 2.2 Implement singleton database connection using `better-sqlite3`
- [x] 2.3 Enable WAL mode with `db.pragma('journal_mode = WAL')`
- [x] 2.4 Implement schema setup function that creates `campaigns` table (id, data, created_at)
- [x] 2.5 Implement schema setup function that creates `cache_metadata` table (key, timestamp, ttl_minutes)
- [x] 2.6 Use `CREATE TABLE IF NOT EXISTS` for idempotent schema creation
- [x] 2.7 Ensure `data/` directory exists before creating database file
- [x] 2.8 Export database connection and setup function as named exports

## 3. Database Operations Implementation

- [x] 3.1 Implement `saveCampaigns(data)` function in `lib/db.js`
- [x] 3.2 Serialize campaigns array as JSON using `JSON.stringify()`
- [x] 3.3 Insert/replace data in `campaigns` table with current timestamp
- [x] 3.4 Update `cache_metadata` table with current timestamp for key 'campaigns'
- [x] 3.5 Implement `getCachedCampaigns()` function in `lib/db.js`
- [x] 3.6 Retrieve data from `campaigns` table and timestamp from `cache_metadata`
- [x] 3.7 Deserialize JSON data using `JSON.parse()`
- [x] 3.8 Handle missing data gracefully (return null if no cache exists)
- [x] 3.9 Handle corrupted JSON gracefully (catch parse errors, return null)

## 4. Repository Pattern Implementation

- [x] 4.1 Create `lib/repositories/` directory
- [x] 4.2 Create `lib/repositories/campaigns.js` file
- [x] 4.3 Import `fetchCampaigns` from `lib/brevo/fetchCampaigns.js`
- [x] 4.4 Import database operations from `lib/db.js`
- [x] 4.5 Define TTL constant (15 minutes in milliseconds)
- [x] 4.6 Implement `isStale(timestamp)` helper function (check if `Date.now() - timestamp > TTL`)
- [x] 4.7 Implement `getCampaigns()` main function with cache-or-fetch logic
- [x] 4.8 Check for cached data, return if fresh (timestamp within TTL)
- [x] 4.9 If cache is stale or missing, call `fetchCampaigns()`
- [x] 4.10 Save fresh data to cache after successful API call
- [x] 4.11 Implement fallback: return stale cache if API call fails but cache exists
- [x] 4.12 Throw error if both API and cache fail
- [x] 4.13 Add logging for cache hits/misses using `console.log` for debugging
- [x] 4.14 Export `getCampaigns` as named export

## 5. UI Integration

- [x] 5.1 Modify `app/campaigns/page.js` to import `getCampaigns` from `lib/repositories/campaigns.js`
- [x] 5.2 Replace `fetchCampaigns()` call with `getCampaigns()` call
- [x] 5.3 Verify error handling remains unchanged (UI should handle errors the same way)

## 6. Verification & Testing

- [x] 6.1 Verify database file is created at `data/cache.db` on first run
- [x] 6.2 Verify tables are created correctly (check schema with SQLite browser if needed)
- [x] 6.3 Test first page load: should call API and save to cache (check logs for cache miss)
- [x] 6.4 Test second page load within 15 minutes: should use cache (check logs for cache hit)
- [x] 6.5 Test page load after 15+ minutes: should refresh from API (check logs for stale cache)
- [x] 6.6 Test API failure scenario: verify stale cache is returned as fallback
- [x] 6.7 Run build to ensure no syntax errors or import issues (`npm run build`)
