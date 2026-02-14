## ADDED Requirements

### Requirement: System provides generic cache-or-fetch function
The system SHALL provide a generic `getOrSetCache()` function in `lib/cache/repository.js` that implements cache-or-fetch logic for any entity. The function SHALL accept configuration options including cacheKey, fetchFn, getCachedFn, saveCachedFn, and ttlMinutes.

#### Scenario: Function accepts configuration options
- **WHEN** `getOrSetCache()` is called
- **THEN** the function SHALL accept an options object with cacheKey, fetchFn, getCachedFn, saveCachedFn, and optional ttlMinutes (default 15)

#### Scenario: Function returns Promise of data
- **WHEN** `getOrSetCache()` is invoked
- **THEN** the function SHALL return a Promise that resolves to the entity data array

#### Scenario: Function is exported as named export
- **WHEN** importing from `lib/cache/repository.js`
- **THEN** `getOrSetCache` SHALL be available as a named export

### Requirement: System checks cache before fetching
The system SHALL check if cached data exists and is fresh before calling the fetch function. If cache is fresh, the system SHALL return cached data immediately without calling the fetch function.

#### Scenario: Return cached data when fresh
- **WHEN** `getCachedFn()` returns data with timestamp less than TTL minutes old
- **THEN** the system SHALL return the cached data without calling `fetchFn()`

#### Scenario: Log cache hit
- **WHEN** returning fresh cached data
- **THEN** the system SHALL log a cache HIT message with cacheKey, age, and TTL

#### Scenario: Calculate staleness correctly
- **WHEN** checking if cached data is stale
- **THEN** the system SHALL calculate `Date.now() - cachedTimestamp` and compare it to `ttlMinutes * 60 * 1000`

### Requirement: System fetches fresh data when cache is stale or missing
The system SHALL call the fetch function when cached data is stale or missing. After successfully fetching data, the system SHALL save it to cache using the save function.

#### Scenario: Fetch when cache is missing
- **WHEN** `getCachedFn()` returns null or undefined
- **THEN** the system SHALL call `fetchFn()` to get fresh data

#### Scenario: Fetch when cache is stale
- **WHEN** `getCachedFn()` returns data but timestamp is older than TTL
- **THEN** the system SHALL call `fetchFn()` to get fresh data

#### Scenario: Save fresh data to cache
- **WHEN** `fetchFn()` successfully returns data
- **THEN** the system SHALL call `saveCachedFn(data)` to save the fresh data

#### Scenario: Log cache miss or stale status
- **WHEN** calling `fetchFn()` due to missing or stale cache
- **THEN** the system SHALL log a cache MISS or STALE message with cacheKey

### Requirement: System provides fallback to stale cache on API errors
The system SHALL handle fetch function errors gracefully. If the fetch function throws an error and stale cached data exists, the system SHALL return the stale data as a fallback instead of throwing.

#### Scenario: Return stale cache on fetch error
- **WHEN** `fetchFn()` throws an error and `getCachedFn()` returned stale data
- **THEN** the system SHALL return the stale cached data as a fallback

#### Scenario: Throw error when both fetch and cache fail
- **WHEN** `fetchFn()` throws an error and `getCachedFn()` returned null
- **THEN** the system SHALL throw an error indicating both fetch and cache failures

#### Scenario: Log fallback to stale cache
- **WHEN** returning stale cache due to fetch error
- **THEN** the system SHALL log a cache FALLBACK message with cacheKey, age, and TTL

### Requirement: System supports configurable TTL per entity
The system SHALL allow each entity to specify a custom TTL value. If no TTL is provided, the system SHALL default to 15 minutes.

#### Scenario: Use default TTL when not specified
- **WHEN** `getOrSetCache()` is called without ttlMinutes option
- **THEN** the system SHALL use 15 minutes as the default TTL

#### Scenario: Use custom TTL when specified
- **WHEN** `getOrSetCache()` is called with ttlMinutes option set to a custom value
- **THEN** the system SHALL use the custom TTL value for staleness calculation

#### Scenario: TTL is in minutes
- **WHEN** comparing timestamps
- **THEN** the system SHALL convert ttlMinutes to milliseconds by multiplying by 60 * 1000

### Requirement: System provides generic database operations
The system SHALL extend `lib/db.js` with generic functions `saveEntity(tableName, data)` and `getCachedEntity(tableName)` to support caching multiple entity types without code duplication.

#### Scenario: saveEntity stores data for any entity
- **WHEN** `saveEntity(tableName, data)` is called
- **THEN** the system SHALL serialize data as JSON, store it in the specified table with current timestamp, and update cache_metadata

#### Scenario: getCachedEntity retrieves data for any entity
- **WHEN** `getCachedEntity(tableName)` is called
- **THEN** the system SHALL retrieve the data from the specified table, deserialize JSON, fetch timestamp from cache_metadata, and return `{ data, timestamp }`

#### Scenario: Generic functions handle missing data gracefully
- **WHEN** `getCachedEntity(tableName)` is called for a table with no data
- **THEN** the system SHALL return null without throwing an error

#### Scenario: Generic functions handle corrupted JSON gracefully
- **WHEN** `getCachedEntity(tableName)` encounters invalid JSON in the data column
- **THEN** the system SHALL log the error and return null

### Requirement: System creates entity-specific tables on demand
The system SHALL create a new table for each entity type on first use. Tables SHALL follow the same schema pattern: `id INTEGER PRIMARY KEY`, `data TEXT NOT NULL`, `created_at INTEGER NOT NULL`.

#### Scenario: Create table if not exists
- **WHEN** `saveEntity(tableName, data)` is called for a new entity type
- **THEN** the system SHALL execute `CREATE TABLE IF NOT EXISTS <tableName> (id, data, created_at)` before inserting data

#### Scenario: Table schema is consistent
- **WHEN** creating a new entity table
- **THEN** the schema SHALL match the pattern used by campaigns table

#### Scenario: Idempotent table creation
- **WHEN** `saveEntity()` is called multiple times for the same entity
- **THEN** the system SHALL NOT throw errors if the table already exists

### Requirement: Repositories use generic caching function
The system SHALL refactor `lib/repositories/campaigns.js` to use `getOrSetCache()` instead of duplicating cache-or-fetch logic. New repositories like `lib/repositories/contacts.js` SHALL use `getOrSetCache()` from the start.

#### Scenario: Campaigns repository uses getOrSetCache
- **WHEN** `getCampaigns()` is called
- **THEN** the function SHALL delegate to `getOrSetCache()` with appropriate options for campaigns

#### Scenario: Contacts repository uses getOrSetCache
- **WHEN** `getContacts()` is called
- **THEN** the function SHALL delegate to `getOrSetCache()` with appropriate options for contacts

#### Scenario: Repository behavior is unchanged after refactoring
- **WHEN** `getCampaigns()` is refactored to use `getOrSetCache()`
- **THEN** the cache behavior (HIT/MISS/STALE/FALLBACK) SHALL remain identical to the original implementation

#### Scenario: Logging format is consistent
- **WHEN** using `getOrSetCache()` for different entities
- **THEN** log messages SHALL include the entity-specific cacheKey (e.g., "[Cache HIT] campaigns" vs "[Cache HIT] contacts")
