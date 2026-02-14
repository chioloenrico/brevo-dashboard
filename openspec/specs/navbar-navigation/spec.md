### Requirement: Navigation links are displayed

The navigation bar SHALL display clickable links for all primary application routes (Contacts and Campaigns).

#### Scenario: User sees navigation links
- **WHEN** the user views any page in the application
- **THEN** the navigation bar displays "Contacts" and "Campaigns" links

#### Scenario: Links are always visible
- **WHEN** the user navigates to any route
- **THEN** the navigation bar remains visible and accessible

### Requirement: Route switching via navigation links

The system SHALL allow users to navigate between routes by clicking navigation links without full page reloads.

#### Scenario: Navigate to Contacts page
- **WHEN** the user clicks the "Contacts" link in the navigation bar
- **THEN** the application navigates to the /contacts route
- **THEN** the page content updates without a full page reload

#### Scenario: Navigate to Campaigns page
- **WHEN** the user clicks the "Campaigns" link in the navigation bar
- **THEN** the application navigates to the /campaigns route
- **THEN** the page content updates without a full page reload

### Requirement: Active route indication

The navigation bar SHALL visually indicate which route is currently active to help users understand their current location.

#### Scenario: Contacts route is active
- **WHEN** the user is on the /contacts route
- **THEN** the "Contacts" link in the navigation bar is visually highlighted as active
- **THEN** the "Campaigns" link appears in its default (inactive) state

#### Scenario: Campaigns route is active
- **WHEN** the user is on the /campaigns route
- **THEN** the "Campaigns" link in the navigation bar is visually highlighted as active
- **THEN** the "Contacts" link appears in its default (inactive) state

#### Scenario: Active state updates on navigation
- **WHEN** the user navigates from one route to another
- **THEN** the active state indicator updates to reflect the new current route

### Requirement: Persistent navigation across pages

The navigation bar SHALL be present and consistent across all pages in the application.

#### Scenario: Navigation bar on Contacts page
- **WHEN** the user is on the /contacts route
- **THEN** the navigation bar is visible at the top of the page

#### Scenario: Navigation bar on Campaigns page
- **WHEN** the user is on the /campaigns route
- **THEN** the navigation bar is visible at the top of the page

#### Scenario: Navigation bar on home page
- **WHEN** the user is on the root (/) route
- **THEN** the navigation bar is visible at the top of the page

### Requirement: Accessible navigation

The navigation bar SHALL use semantic HTML and proper link elements to ensure accessibility.

#### Scenario: Links are keyboard accessible
- **WHEN** the user uses keyboard navigation (Tab key)
- **THEN** the user can focus on each navigation link
- **THEN** the user can activate links using the Enter key

#### Scenario: Links have proper semantics
- **WHEN** the navigation bar is rendered
- **THEN** navigation links use proper anchor or Link elements
- **THEN** links have descriptive text indicating their destination
