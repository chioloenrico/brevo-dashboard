## 1. Modify fetchContacts to Support Pagination Parameters

- [x] 1.1 Update `fetchContacts` function signature to accept optional `limit` and `offset` parameters with defaults (limit=50, offset=0)
- [x] 1.2 Modify the API URL construction to use the provided `limit` and `offset` parameters instead of hardcoded values
- [x] 1.3 Verify backward compatibility by ensuring calls without parameters still work (default to limit=50, offset=0)

## 2. Implement syncAllContacts Orchestration Function

- [x] 2.1 Create `syncAllContacts()` function in `lib/repositories/contacts.js`
- [x] 2.2 Implement pagination loop that starts with offset=0 and increments by limit (50) for each page
- [x] 2.3 Add logic to accumulate contacts from all pages into a single `allContacts` array
- [x] 2.4 Implement pagination completion detection (stop when page.length < limit)
- [x] 2.5 Add atomic database save using `saveEntity('contacts', allContacts)` after all pages are fetched
- [x] 2.6 Ensure function returns the complete array of all contacts
- [x] 2.7 Export `syncAllContacts` as a named export from the contacts repository module

## 3. Integrate syncAllContacts with Smart Caching

- [x] 3.1 Update `getContacts()` function to use `syncAllContacts` instead of `fetchContacts` as the `fetchFn` in `getOrSetCache()`
- [x] 3.2 Verify that existing TTL-based caching behavior is preserved (cache hit returns without syncing)
- [x] 3.3 Verify that stale-on-error fallback works correctly (returns old data if sync fails)

## 4. Error Handling and Edge Cases

- [x] 4.1 Verify that API errors during pagination (network, 401, 403, 429, 5xx) are properly propagated without saving partial data
- [x] 4.2 Test handling of empty contact list (0 contacts) - should save empty array
- [x] 4.3 Test handling of small contact lists (<50 contacts) - should complete in single page
- [x] 4.4 Ensure error messages from `fetchContacts()` are preserved and not suppressed

## 5. Testing and Validation

- [x] 5.1 Test with small contact list (<50 contacts) to verify no regression and single-page completion
- [x] 5.2 Test with contact list requiring multiple pages (>50 contacts) to verify pagination logic
- [x] 5.3 Verify that complete contact list is saved to database after successful sync
- [x] 5.4 Test cache expiration triggers full sync with all contacts
- [x] 5.5 Test that API failures during sync don't corrupt existing cached data
- [x] 5.6 Verify UI layer receives complete contact array transparently through `getContacts()`
- [x] 5.7 Test backward compatibility: existing code calling `fetchContacts()` without parameters still works

## 6. Documentation and Cleanup

- [x] 6.1 Add JSDoc comments to `syncAllContacts()` explaining pagination orchestration
- [x] 6.2 Update JSDoc for `fetchContacts()` to document new `limit` and `offset` parameters
- [x] 6.3 Verify all modified functions have accurate JSDoc with parameter descriptions
