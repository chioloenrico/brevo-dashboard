## ADDED Requirements

### Requirement: Repository provides syncAllContacts function
The system SHALL provide a repository function `syncAllContacts()` that orchestrates fetching all contacts from Brevo through pagination. The function SHALL iterate through all pages of contacts using the Brevo API, accumulate all results, and save the complete dataset to the database atomically.

#### Scenario: Function fetches all pages until last page
- **WHEN** `syncAllContacts()` is called
- **THEN** the function SHALL repeatedly call `fetchContacts(limit, offset)` with incrementing offset values until a page returns fewer results than the limit, indicating the last page

#### Scenario: Function accumulates contacts from all pages
- **WHEN** `syncAllContacts()` fetches multiple pages of contacts
- **THEN** the function SHALL accumulate all contacts from all pages into a single array before saving to the database

#### Scenario: Function saves complete contact list atomically
- **WHEN** `syncAllContacts()` completes fetching all pages
- **THEN** the function SHALL save the complete contact array to the database using `saveEntity('contacts', allContacts)` in a single atomic operation

#### Scenario: Function uses fixed page size
- **WHEN** `syncAllContacts()` fetches contacts
- **THEN** the function SHALL use a fixed limit of 50 contacts per page for all API requests

#### Scenario: Function starts pagination from offset zero
- **WHEN** `syncAllContacts()` begins fetching contacts
- **THEN** the function SHALL start with offset 0 and increment by the limit value (50) for each subsequent page

#### Scenario: Function returns complete contact array
- **WHEN** `syncAllContacts()` completes successfully
- **THEN** the function SHALL return the complete array of all fetched contacts

### Requirement: Function handles pagination completion detection
The system SHALL detect when pagination is complete by checking if the number of contacts returned in a page is less than the requested limit, indicating the last page has been reached.

#### Scenario: Stop pagination when page is smaller than limit
- **WHEN** `syncAllContacts()` receives a page with fewer contacts than the limit (e.g., 23 contacts when limit is 50)
- **THEN** the function SHALL stop pagination and proceed to save the accumulated contacts

#### Scenario: Continue pagination when page is full
- **WHEN** `syncAllContacts()` receives a page with exactly the limit number of contacts (e.g., 50 contacts when limit is 50)
- **THEN** the function SHALL continue pagination by incrementing the offset and fetching the next page

#### Scenario: Handle empty first page
- **WHEN** `syncAllContacts()` fetches the first page and receives zero contacts
- **THEN** the function SHALL stop pagination and save an empty array to the database

### Requirement: Function handles API errors during pagination
The system SHALL handle errors that occur during pagination, including network failures, authentication errors, and rate limiting. If an error occurs mid-pagination, the function SHALL throw an error without saving partial data.

#### Scenario: Throw error on API failure during pagination
- **WHEN** `syncAllContacts()` encounters an API error while fetching any page (network, 401, 403, 429, 5xx)
- **THEN** the function SHALL throw the error and NOT save partial contact data to the database

#### Scenario: Preserve accumulated data on error
- **WHEN** `syncAllContacts()` encounters an error after fetching some pages successfully
- **THEN** the function SHALL not corrupt existing cached data (rely on `getOrSetCache()` stale-on-error fallback at higher layer)

#### Scenario: Propagate fetchContacts errors
- **WHEN** `syncAllContacts()` calls `fetchContacts(limit, offset)` and it throws an error
- **THEN** the function SHALL propagate the error to the caller without catching or suppressing it

### Requirement: Repository integrates with smart caching system
The system SHALL integrate `syncAllContacts()` with the existing smart caching system by using it as the `fetchFn` in `getContacts()`, making full contact synchronization transparent to the UI layer.

#### Scenario: getContacts uses syncAllContacts as fetch function
- **WHEN** `getContacts()` determines cache is stale or missing
- **THEN** the function SHALL call `syncAllContacts()` instead of `fetchContacts()` to refresh the cache

#### Scenario: Cache behavior remains unchanged
- **WHEN** `getContacts()` is called with fresh cached data
- **THEN** the function SHALL return cached data without calling `syncAllContacts()`, maintaining existing TTL-based caching behavior

#### Scenario: Stale-on-error fallback works with batch sync
- **WHEN** `syncAllContacts()` fails due to API error and cached data exists (even if stale)
- **THEN** the `getOrSetCache()` wrapper SHALL return the stale cached data as fallback

#### Scenario: UI layer receives complete contact array transparently
- **WHEN** UI layer calls `getContacts()`
- **THEN** the function SHALL return the complete array of all contacts, regardless of whether data came from cache or full sync

### Requirement: Function is exported from contacts repository
The system SHALL export the `syncAllContacts()` function from `lib/repositories/contacts.js` to allow testing and potential direct usage.

#### Scenario: syncAllContacts is available as named export
- **WHEN** importing from `lib/repositories/contacts.js`
- **THEN** the `syncAllContacts` function SHALL be available as a named export

#### Scenario: Function signature is async
- **WHEN** calling `syncAllContacts()`
- **THEN** the function SHALL return a Promise that resolves to an array of all contact objects
