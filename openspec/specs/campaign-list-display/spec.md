## ADDED Requirements

### Requirement: Display campaigns in HTML table format
The system SHALL display campaigns in an HTML table structure using native table elements (`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`) instead of a simple list. The table SHALL be wrapped in a container that enables horizontal scrolling on small screens.

#### Scenario: Table structure renders correctly
- **WHEN** the CampaignList component receives campaign data
- **THEN** the system SHALL render an HTML `<table>` element with `<thead>` containing column headers and `<tbody>` containing campaign rows

#### Scenario: Horizontal scroll on mobile devices
- **WHEN** the table is viewed on a screen width smaller than the table's minimum width
- **THEN** the system SHALL enable horizontal scrolling by wrapping the table in a container with `overflow-x-auto` class

### Requirement: Display table columns for campaign information
The system SHALL display nine columns in the table: Nome (Name), Status, Delivery Rate, Open Rate, Click Rate, Viewed, Unique Clicks, Unique Views, and Unsubscriptions. Each column SHALL have a header in the table's `<thead>` section.

#### Scenario: All required columns are displayed
- **WHEN** the campaigns table is rendered
- **THEN** the system SHALL display column headers for "Nome", "Status", "Delivery Rate", "Open Rate", "Click Rate", "Viewed", "Unique Clicks", "Unique Views", and "Unsubscriptions" in the table header

#### Scenario: Campaign name appears in first column
- **WHEN** a campaign row is rendered
- **THEN** the system SHALL display the campaign's name in the first column (Nome)

### Requirement: Calculate and display campaign metrics per row
The system SHALL calculate Delivery Rate, Open Rate, and Click Rate for each campaign row using the campaign's `stats` data when available. Delivery Rate SHALL be calculated as `delivered / sent`, Open Rate as `opened / delivered`, and Click Rate as `clicked / delivered`.

#### Scenario: Calculate delivery rate from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with `sent` and `delivered` values
- **THEN** the system SHALL calculate and display Delivery Rate as `delivered / sent` formatted as a percentage

#### Scenario: Calculate open rate from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with `delivered` and `opened` values
- **THEN** the system SHALL calculate and display Open Rate as `opened / delivered` formatted as a percentage

#### Scenario: Calculate click rate from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with `delivered` and `clicked` values
- **THEN** the system SHALL calculate and display Click Rate as `clicked / delivered` formatted as a percentage

### Requirement: Format percentage values consistently
The system SHALL format percentage values using `Intl.NumberFormat` with exactly one decimal place, consistent with the `CampaignStatsHeader` component. Values SHALL be displayed with a percent sign.

#### Scenario: Format percentage with one decimal place
- **WHEN** displaying a metric value of 0.95234 (95.234%)
- **THEN** the system SHALL display it as "95.2%"

#### Scenario: Format percentage with trailing zero
- **WHEN** displaying a metric value of 0.250 (25.0%)
- **THEN** the system SHALL display it as "25.0%"

### Requirement: Display campaign status with colored badges
The system SHALL display campaign status using colored badge indicators. Status "sent" SHALL use green colors, "draft" SHALL use gray colors, and "scheduled" SHALL use blue colors. Status text SHALL be capitalized (first letter uppercase).

#### Scenario: Display sent status with green badge
- **WHEN** a campaign has `status: 'sent'`
- **THEN** the system SHALL display a badge with green background colors and the text "Sent"

#### Scenario: Display draft status with gray badge
- **WHEN** a campaign has `status: 'draft'`
- **THEN** the system SHALL display a badge with gray background colors and the text "Draft"

#### Scenario: Display scheduled status with blue badge
- **WHEN** a campaign has `status: 'scheduled'`
- **THEN** the system SHALL display a badge with blue background colors and the text "Scheduled"

### Requirement: Handle missing or unavailable campaign statistics
The system SHALL display "-" for metric columns (Delivery Rate, Open Rate, Click Rate) when a campaign does not have statistics available, when `stats` object is missing, or when campaign status is not 'sent'. Status SHALL always be displayed regardless of statistics availability.

#### Scenario: Display dash for metrics when stats are missing
- **WHEN** a campaign does not have a `stats` object
- **THEN** the system SHALL display "-" for Delivery Rate, Open Rate, and Click Rate columns

#### Scenario: Display dash for metrics when status is not sent
- **WHEN** a campaign has `status: 'draft'` or `status: 'scheduled'`
- **THEN** the system SHALL display "-" for Delivery Rate, Open Rate, and Click Rate columns, but SHALL still display the status badge

#### Scenario: Display status even without statistics
- **WHEN** a campaign has no `stats` object but has a `status` value
- **THEN** the system SHALL display the status badge and "-" for all metric columns

### Requirement: Apply responsive styling with Tailwind CSS
The system SHALL apply Tailwind CSS classes for table styling including header background, zebra striping for rows, borders, padding, and hover effects. The styling SHALL use CSS variables (`--background`, `--foreground`) to support dark mode.

#### Scenario: Table header has distinct styling
- **WHEN** the table is rendered
- **THEN** the table header (`<thead>`) SHALL have a background color distinct from the body and text styled with uppercase, smaller font size, and medium font weight

#### Scenario: Table rows have alternating background colors
- **WHEN** multiple campaign rows are rendered
- **THEN** the system SHALL apply alternating background colors (zebra striping) to table rows for improved readability

#### Scenario: Table rows show hover effect
- **WHEN** a user hovers over a table row
- **THEN** the system SHALL change the row's background color to provide visual feedback

#### Scenario: Table supports dark mode
- **WHEN** the system is in dark mode
- **THEN** the table SHALL use dark mode colors via CSS variables (`--background`, `--foreground`) for backgrounds, text, borders, and badges

### Requirement: Align table content appropriately
The system SHALL align text content to the left and numeric content (percentages) to the right for improved readability and comparison of metric values.

#### Scenario: Text columns are left-aligned
- **WHEN** displaying campaign name and status columns
- **THEN** the system SHALL align the content to the left

#### Scenario: Numeric columns are right-aligned
- **WHEN** displaying Delivery Rate, Open Rate, Click Rate, Viewed, Unique Clicks, Unique Views, and Unsubscriptions columns
- **THEN** the system SHALL align the numeric values to the right

### Requirement: Display absolute count columns for detailed engagement metrics
The system SHALL display four additional columns (Viewed, Unique Clicks, Unique Views, Unsubscriptions) showing absolute count values from the campaign's `stats` object. Values SHALL be formatted as locale-aware numbers using `Intl.NumberFormat` with the `it-IT` locale.

#### Scenario: Display viewed count from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with a `viewed` value
- **THEN** the system SHALL display the `stats.viewed` value formatted as a locale-aware number in the Viewed column

#### Scenario: Display unique clicks count from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with a `uniqueClicks` value
- **THEN** the system SHALL display the `stats.uniqueClicks` value formatted as a locale-aware number in the Unique Clicks column

#### Scenario: Display unique views count from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with a `uniqueViews` value
- **THEN** the system SHALL display the `stats.uniqueViews` value formatted as a locale-aware number in the Unique Views column

#### Scenario: Display unsubscriptions count from campaign stats
- **WHEN** a campaign has `status: 'sent'` and `stats` object with an `unsubscriptions` value
- **THEN** the system SHALL display the `stats.unsubscriptions` value formatted as a locale-aware number in the Unsubscriptions column

### Requirement: Handle missing data for detailed engagement columns
The system SHALL display "-" for the Viewed, Unique Clicks, Unique Views, and Unsubscriptions columns when a campaign does not have statistics available, when the `stats` object is missing, or when campaign status is not 'sent'.

#### Scenario: Display dash for new metric columns when stats are missing
- **WHEN** a campaign does not have a `stats` object
- **THEN** the system SHALL display "-" for Viewed, Unique Clicks, Unique Views, and Unsubscriptions columns

#### Scenario: Display dash for new metric columns when status is not sent
- **WHEN** a campaign has `status: 'draft'` or `status: 'scheduled'`
- **THEN** the system SHALL display "-" for Viewed, Unique Clicks, Unique Views, and Unsubscriptions columns
