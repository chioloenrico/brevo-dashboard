## ADDED Requirements

### Requirement: System provides contacts page route
The system SHALL provide a `/contacts` route that displays a list of contacts fetched from the repository. The page SHALL be implemented as a Next.js Server Component and SHALL fetch contacts using the cached repository.

#### Scenario: Contacts page is accessible at /contacts
- **WHEN** user navigates to `/contacts`
- **THEN** the system SHALL render the contacts page with ContactList and ContactStatsHeader components

#### Scenario: Page fetches contacts from repository
- **WHEN** the contacts page is rendered
- **THEN** the system SHALL call `getContacts()` from `lib/repositories/contacts.js` to retrieve contacts data

#### Scenario: Page handles empty contacts list
- **WHEN** `getContacts()` returns an empty array
- **THEN** the system SHALL display an appropriate message indicating no contacts are available

### Requirement: System displays contacts in a list view
The system SHALL provide a ContactList component that displays contacts in a table format with columns for email, firstName, lastName, createdAt, and emailBlacklisted status.

#### Scenario: ContactList displays all contacts
- **WHEN** ContactList receives an array of contact objects
- **THEN** the system SHALL render each contact as a table row with all contact properties

#### Scenario: ContactList shows blacklist status
- **WHEN** a contact has `emailBlacklisted: true`
- **THEN** the system SHALL visually indicate the blacklisted status (e.g., badge, icon, or color)

#### Scenario: ContactList handles missing fields
- **WHEN** a contact has null or undefined firstName or lastName
- **THEN** the system SHALL display a placeholder (e.g., "-" or "N/A") instead of breaking the UI

### Requirement: System calculates and displays contact metrics
The system SHALL calculate aggregate metrics from the contacts array and display them in a ContactStatsHeader component. Metrics SHALL include total contacts count and blacklisted contacts count.

#### Scenario: Calculate total contacts count
- **WHEN** contacts are fetched
- **THEN** the system SHALL count the total number of contacts in the array

#### Scenario: Calculate blacklisted contacts count
- **WHEN** contacts are fetched
- **THEN** the system SHALL count contacts where `emailBlacklisted` is `true`

#### Scenario: Display metrics in header
- **WHEN** metrics are calculated
- **THEN** the system SHALL display the metrics in the ContactStatsHeader component above the contacts list

#### Scenario: Handle zero contacts
- **WHEN** the contacts array is empty
- **THEN** the system SHALL display metrics with values of 0

### Requirement: System integrates with contacts repository
The system SHALL use `lib/repositories/contacts.js` to fetch contacts with caching, following the same pattern as campaigns.

#### Scenario: Page imports getContacts from repository
- **WHEN** the contacts page is loaded
- **THEN** the system SHALL import `getContacts` from `lib/repositories/contacts.js`

#### Scenario: Repository returns cached or fresh data
- **WHEN** `getContacts()` is called
- **THEN** the system SHALL receive contacts data either from cache or fresh from API, transparently to the UI

#### Scenario: Error handling is preserved
- **WHEN** `getContacts()` throws an error
- **THEN** the system SHALL catch the error and display an error message to the user

### Requirement: System provides client-side interactivity
The system SHALL implement ContactList as a Client Component to enable future interactivity (sorting, filtering) while ContactStatsHeader can remain server-rendered.

#### Scenario: ContactList is a Client Component
- **WHEN** ContactList is defined
- **THEN** the file SHALL include `'use client'` directive at the top

#### Scenario: ContactStatsHeader can be Server Component
- **WHEN** ContactStatsHeader is defined
- **THEN** the component MAY be server-rendered (no client directive required)

### Requirement: System matches campaigns page UI patterns
The system SHALL follow the same UI structure and styling patterns as the campaigns page for visual consistency.

#### Scenario: Page layout matches campaigns
- **WHEN** the contacts page is rendered
- **THEN** the layout SHALL include a page title, stats header, and list component in the same structure as `/campaigns`

#### Scenario: Styling is consistent
- **WHEN** rendering contacts components
- **THEN** the system SHALL use the same Tailwind classes and design patterns as campaigns components
