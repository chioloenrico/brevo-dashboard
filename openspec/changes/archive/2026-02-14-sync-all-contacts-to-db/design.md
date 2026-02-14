## Context

The current implementation in `lib/brevo/fetchContacts.js` is hardcoded to fetch only 50 contacts with `limit=50&offset=0`. This creates an incomplete view when users have more than 50 contacts in their Brevo account. The existing architecture includes:

- **Brevo API Layer**: `fetchContacts()` makes single API call with hardcoded parameters
- **Repository Layer**: `lib/repositories/contacts.js` uses `getOrSetCache()` for smart caching
- **Database Layer**: SQLite database stores contacts as JSON in a single row (id=1)
- **Smart Caching**: TTL-based caching (15 minutes) with stale-on-error fallback

**Constraints:**
- Brevo API returns paginated results with `limit` and `offset` query parameters
- Maximum limit per request is typically 50 (API best practice)
- With 10k contacts, approximately 200 API requests are needed
- API may have rate limiting (needs graceful handling)
- Single-table storage pattern stores entire contact array as JSON blob

## Goals / Non-Goals

**Goals:**
- Fetch ALL contacts from Brevo through pagination, regardless of total count
- Store complete contact list in SQLite database for caching
- Handle API errors and rate limiting gracefully during multi-page sync
- Maintain existing smart-caching behavior (TTL, stale-on-error)
- Make pagination transparent to UI layer (still returns array of contacts)

**Non-Goals:**
- Real-time incremental sync (still using TTL-based full refresh)
- Individual contact CRUD operations (this is read-only sync)
- Streaming/chunked database writes (acceptable to replace all contacts atomically)
- Progress indicators or cancellation for long-running sync
- Per-contact caching granularity (keeping single-blob storage pattern)

## Decisions

### Decision 1: Modify `fetchContacts()` to Accept Pagination Parameters

**Choice:** Add optional `limit` and `offset` parameters to `fetchContacts(limit = 50, offset = 0)`

**Rationale:**
- Backward compatible (defaults to current behavior)
- Allows reuse of existing error handling, validation, and mapping logic
- Keeps pagination concern at the API layer, not business logic layer

**Alternatives Considered:**
- Create separate `fetchContactsPage()` function → Rejected: duplicates error handling and validation
- Make `fetchContacts()` automatically paginate internally → Rejected: violates single responsibility, harder to test

### Decision 2: Implement `syncAllContacts()` in Repository Layer

**Choice:** Create new `syncAllContacts()` function in `lib/repositories/contacts.js` that orchestrates pagination

**Implementation:**
```javascript
export async function syncAllContacts() {
  const allContacts = []
  let offset = 0
  const limit = 50

  while (true) {
    const page = await fetchContacts(limit, offset)
    allContacts.push(...page)

    // Stop if we got fewer results than the limit (last page)
    if (page.length < limit) break

    offset += limit
  }

  saveEntity('contacts', allContacts)
  return allContacts
}
```

**Rationale:**
- Repository layer is appropriate for orchestration logic
- Simple while-loop until fewer results than limit (indicates last page)
- Accumulates all contacts in memory before single atomic database write

**Alternatives Considered:**
- Paginate inside `fetchContacts()` → Rejected: mixes API layer with orchestration
- Write each page to database incrementally → Rejected: complex merge logic, partial state on failure
- Use recursive approach → Rejected: stack overflow risk with 200+ pages

### Decision 3: Replace Entire Contact List Atomically

**Choice:** Replace all contacts in database with `saveEntity('contacts', allContacts)` after sync completes

**Rationale:**
- Matches existing pattern for campaigns (single-row storage)
- Atomic operation prevents partial/inconsistent state
- Simpler than merge logic (detect deltas, handle deletions)
- SQLite transaction ensures all-or-nothing write

**Alternatives Considered:**
- Merge new contacts with existing → Rejected: complex, requires contact ID tracking
- Store contacts individually in separate rows → Rejected: schema change, breaks existing caching pattern

### Decision 4: Integrate `syncAllContacts()` into Existing `getContacts()` Flow

**Choice:** Modify `getContacts()` to call `syncAllContacts()` instead of `fetchContacts()` when refreshing cache

**Before:**
```javascript
return getOrSetCache({
  fetchFn: fetchContacts,  // fetches only 50
  ...
})
```

**After:**
```javascript
return getOrSetCache({
  fetchFn: syncAllContacts,  // fetches all via pagination
  ...
})
```

**Rationale:**
- Zero changes needed to UI layer (transparent)
- Leverages existing TTL logic, stale-on-error fallback
- `getOrSetCache()` already handles `fetchFn` errors gracefully

**Alternatives Considered:**
- Create separate `getAllContacts()` function → Rejected: requires UI changes, duplicates caching logic
- Always sync on every call → Rejected: defeats purpose of caching

### Decision 5: No Rate Limiting Mitigation (Initially)

**Choice:** Accept that 200 sequential API calls may trigger rate limits; rely on existing error handling

**Rationale:**
- Brevo API rate limits are typically high (10k requests/hour tier)
- 200 requests every 15 minutes (when cache expires) = ~800 requests/hour (under most limits)
- Existing error handling in `fetchContacts()` already catches 429 errors
- `getOrSetCache()` already has stale-on-error fallback (returns old data if sync fails)

**Future Enhancement:**
- Add delay between pagination requests if rate limiting becomes an issue
- Implement exponential backoff on 429 responses
- Consider longer TTL (30-60 minutes) to reduce sync frequency

**Alternatives Considered:**
- Add delays between requests proactively → Rejected: slows sync unnecessarily if no rate limit
- Implement retry logic with exponential backoff → Rejected: over-engineering for initial implementation

## Risks / Trade-offs

### Risk 1: Memory Usage with Large Contact Lists
**Risk:** Accumulating 10k contacts in `allContacts` array before writing could use significant memory
**Mitigation:** JavaScript handles 10k objects easily (<50MB typical). If this becomes an issue, consider streaming writes or pagination chunking (write every 1000 contacts).

### Risk 2: Slow Initial Sync Experience
**Risk:** First load after cache expiration could take 30-60 seconds for 10k contacts (200 API calls)
**Mitigation:** Acceptable trade-off since cache prevents frequent syncs. Future: add loading indicator or background sync.

### Risk 3: Partial Sync on Failure Mid-Pagination
**Risk:** If API fails on page 150/200, accumulated contacts are lost (not saved)
**Mitigation:** `getOrSetCache()` stale-on-error fallback returns old cached data. User sees old contacts instead of partial list. Future: consider checkpointing every N pages.

### Risk 4: API Rate Limiting During Sync
**Risk:** 200 rapid sequential requests could trigger Brevo rate limits (429 responses)
**Mitigation:** Existing error handling catches 429. Stale cache fallback prevents total failure. Future: add delays if needed.

### Risk 5: No Progress Visibility for Long-Running Sync
**Risk:** User may think app is frozen during 30+ second sync
**Trade-off:** Accepted for initial implementation. This is a server-side sync during page load; can add progress indicator later if needed.

### Risk 6: Backward Compatibility with Existing Cached Data
**Risk:** Changing `fetchFn` in `getContacts()` doesn't affect cache format, but logic changes
**Mitigation:** No schema change needed. Existing caches continue to work. Next cache expiration triggers full sync.

## Migration Plan

**Deployment Steps:**
1. Modify `lib/brevo/fetchContacts.js` to accept `limit` and `offset` parameters
2. Add `syncAllContacts()` to `lib/repositories/contacts.js`
3. Update `getContacts()` to use `syncAllContacts()` as `fetchFn`
4. No database migration needed (schema unchanged)
5. Existing cached contacts remain valid until TTL expires

**Rollback Strategy:**
- Revert changes to `lib/brevo/fetchContacts.js` (restore hardcoded URL)
- Revert `lib/repositories/contacts.js` to use `fetchContacts` directly
- No data cleanup needed (cached contacts remain functional)

**Testing:**
- Test with small contact lists (<50) to verify no regression
- Test with large lists (>100) to verify pagination logic
- Test cache expiration triggers full sync
- Test error handling (API failures during pagination)

## Open Questions

1. **What is Brevo's actual rate limit?** (Assumption: high enough for 200 requests every 15 minutes)
2. **Should we add configurable delay between pagination requests?** (Current: none)
3. **Should TTL be increased to reduce sync frequency?** (Current: 15 minutes)
4. **Should we log sync duration and page counts for monitoring?** (Current: no logging)
