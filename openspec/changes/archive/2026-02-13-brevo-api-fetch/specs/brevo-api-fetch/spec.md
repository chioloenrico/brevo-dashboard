## ADDED Requirements

### Requirement: Function fetches campaigns from Brevo API
The system SHALL provide a function `fetchCampaigns` that retrieves email campaigns from the Brevo API endpoint `https://api.brevo.com/v3/emailCampaigns`. The function SHALL use the API Key from `process.env.BREVO_API_KEY` for authentication.

#### Scenario: Function calls Brevo API with correct endpoint and headers
- **WHEN** `fetchCampaigns` is called
- **THEN** the function SHALL make a GET request to `https://api.brevo.com/v3/emailCampaigns` with header `api-key` containing the value from `process.env.BREVO_API_KEY`

#### Scenario: Function uses API Key from environment variable
- **WHEN** `fetchCampaigns` is called and `process.env.BREVO_API_KEY` is set
- **THEN** the function SHALL use the API Key value for authentication in the request header

#### Scenario: Function handles missing API Key
- **WHEN** `fetchCampaigns` is called and `process.env.BREVO_API_KEY` is not set or is empty
- **THEN** the function SHALL throw an error with a descriptive message indicating that the API Key is missing

### Requirement: Function transforms API response using mapBrevoToCampaign
The function SHALL apply `mapBrevoToCampaign` to each campaign object returned by the API to transform it into the format expected by the components.

#### Scenario: Function transforms all campaigns from API response
- **WHEN** `fetchCampaigns` receives a successful API response with an array of campaigns
- **THEN** the function SHALL apply `mapBrevoToCampaign` to each campaign in the `campaigns` array and return the transformed array

#### Scenario: Function handles empty campaigns array
- **WHEN** `fetchCampaigns` receives a successful API response with an empty `campaigns` array
- **THEN** the function SHALL return an empty array

#### Scenario: Function preserves campaign structure after transformation
- **WHEN** `fetchCampaigns` transforms campaigns using `mapBrevoToCampaign`
- **THEN** each transformed campaign SHALL have the `stats` property exposed from `statistics.globalStats` as specified by `mapBrevoToCampaign`

### Requirement: Function handles API errors
The function SHALL handle various error scenarios from the Brevo API including network errors, authentication errors, and rate limiting.

#### Scenario: Function handles network errors
- **WHEN** `fetchCampaigns` encounters a network error (e.g., connection timeout, DNS failure)
- **THEN** the function SHALL throw an error with a descriptive message indicating a network problem

#### Scenario: Function handles authentication errors
- **WHEN** `fetchCampaigns` receives a 401 (Unauthorized) or 403 (Forbidden) response from the API
- **THEN** the function SHALL throw an error with a descriptive message indicating an authentication problem

#### Scenario: Function handles rate limiting
- **WHEN** `fetchCampaigns` receives a 429 (Too Many Requests) response from the API
- **THEN** the function SHALL throw an error with a descriptive message indicating rate limiting

#### Scenario: Function handles server errors
- **WHEN** `fetchCampaigns` receives a 5xx status code from the API
- **THEN** the function SHALL throw an error with a descriptive message indicating a server error

#### Scenario: Function handles unexpected response format
- **WHEN** `fetchCampaigns` receives a response that does not contain the expected `campaigns` array structure
- **THEN** the function SHALL throw an error with a descriptive message indicating an unexpected response format

### Requirement: Function is exported as named export
The function SHALL be exported as a named export from the module for easy importing.

#### Scenario: Function is available as named export
- **WHEN** importing from the module containing `fetchCampaigns`
- **THEN** the function SHALL be available as a named export: `import { fetchCampaigns } from '...'`

### Requirement: Campaigns page fetches data from API
The campaigns page SHALL use `fetchCampaigns` to retrieve campaign data instead of using mock data, and SHALL handle loading and error states.

#### Scenario: Page calls fetchCampaigns on load
- **WHEN** the campaigns page (`app/campaigns/page.js`) is rendered
- **THEN** the page SHALL call `fetchCampaigns()` to retrieve campaign data

#### Scenario: Page is async Server Component
- **WHEN** the campaigns page is implemented
- **THEN** the page component SHALL be an async Server Component to enable server-side data fetching

#### Scenario: Page handles successful API response
- **WHEN** `fetchCampaigns` returns successfully with campaign data
- **THEN** the page SHALL pass the transformed campaigns to `CampaignList` and calculated metrics to `CampaignStatsHeader`

#### Scenario: Page handles API errors
- **WHEN** `fetchCampaigns` throws an error
- **THEN** the page SHALL handle the error appropriately (e.g., show error message, fallback to empty state, or use Next.js error handling)

### Requirement: Loading state is handled during fetch
The system SHALL provide a loading state UI while fetching campaign data from the API.

#### Scenario: Loading UI is displayed during fetch
- **WHEN** the campaigns page is loading campaign data from the API
- **THEN** the system SHALL display a loading state (e.g., using Next.js `loading.js` file or loading indicator in the component)
