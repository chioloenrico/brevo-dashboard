## MODIFIED Requirements

### Requirement: Function fetches contacts from Brevo API
The system SHALL provide a function `fetchContacts` that retrieves contacts from the Brevo API endpoint `https://api.brevo.com/v3/contacts`. The function SHALL use the API Key from `process.env.BREVO_API_KEY` for authentication and SHALL support pagination through query parameters. The function SHALL accept optional `limit` and `offset` parameters to enable pagination.

#### Scenario: Function calls Brevo API with correct endpoint and headers
- **WHEN** `fetchContacts` is called
- **THEN** the function SHALL make a GET request to `https://api.brevo.com/v3/contacts` with header `api-key` containing the value from `process.env.BREVO_API_KEY` and header `Accept` set to `application/json`

#### Scenario: Function uses API Key from environment variable
- **WHEN** `fetchContacts` is called and `process.env.BREVO_API_KEY` is set
- **THEN** the function SHALL use the API Key value for authentication in the request header

#### Scenario: Function handles missing API Key
- **WHEN** `fetchContacts` is called and `process.env.BREVO_API_KEY` is not set or is empty
- **THEN** the function SHALL throw an error with a descriptive message indicating that the API Key is missing

#### Scenario: Function accepts limit parameter
- **WHEN** `fetchContacts(30)` is called with a limit value
- **THEN** the function SHALL include the provided limit value in the query parameters (e.g., `limit=30`)

#### Scenario: Function accepts offset parameter
- **WHEN** `fetchContacts(50, 100)` is called with limit and offset values
- **THEN** the function SHALL include both values in the query parameters (e.g., `limit=50&offset=100`)

#### Scenario: Function uses default pagination parameters when not provided
- **WHEN** `fetchContacts()` is called without parameters
- **THEN** the function SHALL default to `limit=50` and `offset=0` in the API request URL

#### Scenario: Function handles limit parameter only
- **WHEN** `fetchContacts(25)` is called with only a limit parameter
- **THEN** the function SHALL use the provided limit and default offset to 0 (e.g., `limit=25&offset=0`)
