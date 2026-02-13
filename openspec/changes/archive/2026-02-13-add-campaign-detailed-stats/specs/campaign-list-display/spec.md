## MODIFIED Requirements

### Requirement: Display table columns for campaign information
The system SHALL display nine columns in the table: Nome (Name), Status, Delivery Rate, Open Rate, Click Rate, Viewed, Unique Clicks, Unique Views, and Unsubscriptions. Each column SHALL have a header in the table's `<thead>` section.

#### Scenario: All required columns are displayed
- **WHEN** the campaigns table is rendered
- **THEN** the system SHALL display column headers for "Nome", "Status", "Delivery Rate", "Open Rate", "Click Rate", "Viewed", "Unique Clicks", "Unique Views", and "Unsubscriptions" in the table header

#### Scenario: Campaign name appears in first column
- **WHEN** a campaign row is rendered
- **THEN** the system SHALL display the campaign's name in the first column (Nome)

## ADDED Requirements

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

### Requirement: Right-align detailed engagement columns
The system SHALL right-align the numeric values in the Viewed, Unique Clicks, Unique Views, and Unsubscriptions columns, consistent with existing numeric columns.

#### Scenario: New numeric columns are right-aligned
- **WHEN** displaying Viewed, Unique Clicks, Unique Views, and Unsubscriptions columns
- **THEN** the system SHALL align the values to the right
