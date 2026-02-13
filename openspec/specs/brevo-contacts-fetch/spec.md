## ADDED Requirements

### Requirement: Function fetches contacts from Brevo API
The system SHALL provide a function `fetchContacts` that retrieves contacts from the Brevo API endpoint `https://api.brevo.com/v3/contacts`. The function SHALL use the API Key from `process.env.BREVO_API_KEY` for authentication and SHALL support pagination through query parameters.

#### Scenario: Function calls Brevo API with correct endpoint and headers
- **WHEN** `fetchContacts` is called
- **THEN** the function SHALL make a GET request to `https://api.brevo.com/v3/contacts` with header `api-key` containing the value from `process.env.BREVO_API_KEY` and header `Accept` set to `application/json`

#### Scenario: Function uses API Key from environment variable
- **WHEN** `fetchContacts` is called and `process.env.BREVO_API_KEY` is set
- **THEN** the function SHALL use the API Key value for authentication in the request header

#### Scenario: Function handles missing API Key
- **WHEN** `fetchContacts` is called and `process.env.BREVO_API_KEY` is not set or is empty
- **THEN** the function SHALL throw an error with a descriptive message indicating that the API Key is missing

#### Scenario: Function uses default pagination parameters
- **WHEN** `fetchContacts` is called without parameters
- **THEN** the function SHALL include query parameters `limit=50&offset=0` in the API request URL

### Requirement: Function transforms API response using mapBrevoToContact
The function SHALL apply `mapBrevoToContact` to each contact object returned by the API to transform it into a standardized format with flattened attributes.

#### Scenario: Function transforms all contacts from API response
- **WHEN** `fetchContacts` receives a successful API response with an array of contacts
- **THEN** the function SHALL apply `mapBrevoToContact` to each contact in the `contacts` array and return the transformed array

#### Scenario: Function handles empty contacts array
- **WHEN** `fetchContacts` receives a successful API response with an empty `contacts` array
- **THEN** the function SHALL return an empty array

#### Scenario: Function preserves contact structure after transformation
- **WHEN** `fetchContacts` transforms contacts using `mapBrevoToContact`
- **THEN** each transformed contact SHALL have `firstName`, `lastName`, `email`, `createdAt`, and `emailBlacklisted` properties as specified by `mapBrevoToContact`

### Requirement: Function handles API errors
The function SHALL handle various error scenarios from the Brevo API including network errors, authentication errors, and rate limiting.

#### Scenario: Function handles network errors
- **WHEN** `fetchContacts` encounters a network error (e.g., connection timeout, DNS failure)
- **THEN** the function SHALL throw an error with a descriptive message indicating a network problem

#### Scenario: Function handles authentication errors
- **WHEN** `fetchContacts` receives a 401 (Unauthorized) or 403 (Forbidden) response from the API
- **THEN** the function SHALL throw an error with a descriptive message indicating an authentication problem

#### Scenario: Function handles rate limiting
- **WHEN** `fetchContacts` receives a 429 (Too Many Requests) response from the API
- **THEN** the function SHALL throw an error with a descriptive message indicating rate limiting

#### Scenario: Function handles server errors
- **WHEN** `fetchContacts` receives a 5xx status code from the API
- **THEN** the function SHALL throw an error with a descriptive message indicating a server error

#### Scenario: Function handles unexpected response format
- **WHEN** `fetchContacts` receives a response that does not contain the expected `contacts` array structure
- **THEN** the function SHALL throw an error with a descriptive message indicating an unexpected response format

### Requirement: Mapper function transforms Brevo contact structure
The system SHALL provide a function `mapBrevoToContact` that transforms a Brevo contact object by flattening the dynamic `attributes` object into standardized first-level properties.

#### Scenario: Mapper extracts firstName from attributes
- **WHEN** `mapBrevoToContact` receives a contact with `attributes.NOME` set to a value
- **THEN** the mapped contact SHALL have `firstName` property set to the value from `attributes.NOME`

#### Scenario: Mapper extracts lastName from attributes
- **WHEN** `mapBrevoToContact` receives a contact with `attributes.COGNOME` set to a value
- **THEN** the mapped contact SHALL have `lastName` property set to the value from `attributes.COGNOME`

#### Scenario: Mapper handles missing attributes gracefully
- **WHEN** `mapBrevoToContact` receives a contact where `attributes.NOME` or `attributes.COGNOME` are null or undefined
- **THEN** the mapped contact SHALL have `firstName` or `lastName` set to `null` without throwing an error

#### Scenario: Mapper preserves standard contact fields
- **WHEN** `mapBrevoToContact` receives a contact object
- **THEN** the mapped contact SHALL preserve `email`, `createdAt`, and `emailBlacklisted` properties from the original contact object

#### Scenario: Mapper is a pure function
- **WHEN** `mapBrevoToContact` transforms a contact object
- **THEN** the function SHALL NOT mutate the input object and SHALL return a new object

### Requirement: Function is exported as named export
Both `fetchContacts` and `mapBrevoToContact` SHALL be exported as named exports from their respective modules for easy importing.

#### Scenario: fetchContacts is available as named export
- **WHEN** importing from the module containing `fetchContacts`
- **THEN** the function SHALL be available as a named export: `import { fetchContacts } from '...'`

#### Scenario: mapBrevoToContact is available as named export
- **WHEN** importing from the module containing `mapBrevoToContact`
- **THEN** the function SHALL be available as a named export: `import { mapBrevoToContact } from '...'`

### Requirement: Validate response structure before processing
The function SHALL validate that the API response contains the expected structure before attempting to transform contacts.

#### Scenario: Function validates response is an object
- **WHEN** `fetchContacts` receives a response from the API
- **THEN** the function SHALL validate that the response body is a valid object before accessing properties

#### Scenario: Function validates contacts is an array
- **WHEN** `fetchContacts` receives a response from the API
- **THEN** the function SHALL validate that `data.contacts` exists and is an array before attempting transformation
