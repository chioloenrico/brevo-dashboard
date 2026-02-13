## ADDED Requirements

### Requirement: Repository provides getCampaigns function
The system SHALL provide a repository function `getCampaigns()` that implements smart caching logic. The function SHALL check if cached data is fresh before calling the API, return cached data if fresh, or fetch new data from the API if stale or missing.

#### Scenario: Return cached data when fresh
- **WHEN** `getCampaigns()` is called and cached data exists with timestamp less than TTL minutes old
- **THEN** the system SHALL return the cached data without calling the Brevo API

#### Scenario: Fetch new data when cache is stale
- **WHEN** `getCampaigns()` is called and cached data exists but timestamp is older than TTL minutes
- **THEN** the system SHALL call `fetchCampaigns()`, save the new data to cache with current timestamp, and return the fresh data

#### Scenario: Fetch new data when cache is empty
- **WHEN** `getCampaigns()` is called and no cached data exists
- **THEN** the system SHALL call `fetchCampaigns()`, save the data to cache with current timestamp, and return the data

### Requirement: System uses TTL to determine cache freshness
The system SHALL use a Time To Live (TTL) value of 15 minutes to determine if cached data is stale. Data SHALL be considered fresh if the current timestamp minus the cached timestamp is less than the TTL in milliseconds.

#### Scenario: Calculate staleness based on timestamp difference
- **WHEN** checking if cached data is stale
- **THEN** the system SHALL calculate `Date.now() - cachedTimestamp` and compare it to `TTL_MINUTES * 60 * 1000`

#### Scenario: TTL value is 15 minutes by default
- **WHEN** the caching logic is initialized
- **THEN** the TTL SHALL be set to 15 minutes

#### Scenario: Fresh data is defined as within TTL window
- **WHEN** cached data timestamp is within the last 15 minutes
- **THEN** the system SHALL consider the data fresh and NOT fetch from API

### Requirement: Repository handles API errors gracefully
The system SHALL handle API errors when fetching fresh data. If the API call fails and cached data exists (even if stale), the system SHALL return the stale data as a fallback.

#### Scenario: Return stale cache on API failure
- **WHEN** `getCampaigns()` determines cache is stale, calls the API, and the API fails
- **THEN** the system SHALL return the stale cached data if it exists

#### Scenario: Throw error on API failure with empty cache
- **WHEN** `getCampaigns()` determines cache is empty, calls the API, and the API fails
- **THEN** the system SHALL throw an error indicating both API and cache failures

#### Scenario: Log API errors for monitoring
- **WHEN** the API call fails during cache refresh
- **THEN** the system SHALL log the error with details (status, message) for debugging

### Requirement: Repository updates cache after successful API call
The system SHALL update the cache with new data and current timestamp after successfully fetching data from the API.

#### Scenario: Save fresh data to cache after API call
- **WHEN** `getCampaigns()` successfully fetches data from the API
- **THEN** the system SHALL save the data to the database with the current timestamp

#### Scenario: Update timestamp in cache metadata
- **WHEN** saving fresh data to cache
- **THEN** the system SHALL update the `cache_metadata` table with the current timestamp for key 'campaigns'

### Requirement: Repository is exported from campaigns module
The system SHALL export the `getCampaigns()` function from `lib/repositories/campaigns.js` to allow the UI to access cached campaigns data.

#### Scenario: Repository function is available as export
- **WHEN** importing from `lib/repositories/campaigns.js`
- **THEN** the `getCampaigns` function SHALL be available as a named export

#### Scenario: Repository function signature is async
- **WHEN** calling `getCampaigns()`
- **THEN** the function SHALL return a Promise that resolves to an array of campaign objects

### Requirement: UI layer uses repository instead of direct fetch
The system SHALL modify `app/campaigns/page.js` to use `getCampaigns()` from the repository instead of calling `fetchCampaigns()` directly.

#### Scenario: Campaigns page calls repository
- **WHEN** the campaigns page (`app/campaigns/page.js`) is rendered
- **THEN** the page SHALL call `getCampaigns()` instead of `fetchCampaigns()`

#### Scenario: Repository call is transparent to UI
- **WHEN** the UI calls `getCampaigns()`
- **THEN** the UI SHALL receive the same data structure as before (array of campaign objects), regardless of whether data came from cache or API

### Requirement: System provides cache statistics for debugging
The system SHALL track and optionally expose cache hit/miss statistics for debugging and monitoring purposes.

#### Scenario: Distinguish cache hit from cache miss
- **WHEN** `getCampaigns()` returns data
- **THEN** the system SHALL internally track whether data came from cache (hit) or API (miss)

#### Scenario: Log cache operations for debugging
- **WHEN** cache hit or miss occurs
- **THEN** the system SHALL log the event with timestamp and source (cache/API) for debugging
