## 1. Mapper Function Implementation

- [x] 1.1 Create `lib/brevo/mapBrevoToContact.js` file
- [x] 1.2 Implement `mapBrevoToContact` function that flattens `attributes.NOME` to `firstName` and `attributes.COGNOME` to `lastName`
- [x] 1.3 Handle missing or null attributes gracefully (return `null` for firstName/lastName if attributes are missing)
- [x] 1.4 Preserve standard fields (`email`, `createdAt`, `emailBlacklisted`) from original contact
- [x] 1.5 Ensure function is pure (does not mutate input, returns new object using spread operator)
- [x] 1.6 Export `mapBrevoToContact` as named export

## 2. Fetch Function Implementation

- [x] 2.1 Create `lib/brevo/fetchContacts.js` file
- [x] 2.2 Import `mapBrevoToContact` from `./mapBrevoToContact.js`
- [x] 2.3 Define API URL constant: `https://api.brevo.com/v3/contacts?limit=50&offset=0`
- [x] 2.4 Implement API key validation (check `process.env.BREVO_API_KEY` is set and not empty, throw error if missing)
- [x] 2.5 Implement fetch request with correct headers (`api-key`, `Accept: application/json`)
- [x] 2.6 Add HTTP error handling for authentication errors (401, 403)
- [x] 2.7 Add HTTP error handling for rate limiting (429)
- [x] 2.8 Add HTTP error handling for server errors (5xx)
- [x] 2.9 Add HTTP error handling for other status codes
- [x] 2.10 Add network error handling (catch TypeError for fetch errors)
- [x] 2.11 Validate response structure (ensure `data` is object and `data.contacts` is array)
- [x] 2.12 Transform contacts array using `mapBrevoToContact`
- [x] 2.13 Export `fetchContacts` as named export

## 3. Verification

- [x] 3.1 Verify files are created in correct locations (`lib/brevo/fetchContacts.js`, `lib/brevo/mapBrevoToContact.js`)
- [x] 3.2 Run build to ensure no syntax errors or import issues (`npm run build` or `next build`)
- [x] 3.3 Verify both functions are exported correctly and can be imported
