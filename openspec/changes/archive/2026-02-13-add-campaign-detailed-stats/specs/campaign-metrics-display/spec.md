## MODIFIED Requirements

### Requirement: Display aggregate campaign metrics in card format
The system SHALL display aggregate campaign metrics (Delivery Rate, Open Rate, Click Rate, Total Viewed, Total Unique Clicks, Total Unique Views, Total Unsubscriptions) in a card-based layout at the top of the campaigns page. Each metric SHALL be displayed in its own card with an icon/emoji, formatted value, and descriptive label.

#### Scenario: Display seven metric cards
- **WHEN** the campaigns page loads with campaign data
- **THEN** the system SHALL display seven cards: Delivery Rate, Open Rate, Click Rate, Viewed, Unique Clicks, Unique Views, and Unsubscriptions

#### Scenario: Card contains icon and formatted value
- **WHEN** a metric card is rendered
- **THEN** the card SHALL display an icon/emoji, a prominently formatted value, and a descriptive label below the value

### Requirement: Responsive grid layout
The system SHALL display metric cards in a responsive grid layout that adapts to different screen sizes. On mobile devices (< 640px), cards SHALL stack vertically in a single column. On tablet devices (≥ 640px), cards SHALL display in two columns. On desktop devices (≥ 1024px), cards SHALL display in four columns.

#### Scenario: Mobile layout displays single column
- **WHEN** the page is viewed on a screen width less than 640px
- **THEN** the metric cards SHALL be displayed in a single column, stacked vertically

#### Scenario: Tablet layout displays two columns
- **WHEN** the page is viewed on a screen width between 640px and 1023px
- **THEN** the metric cards SHALL be displayed in a grid with two columns

#### Scenario: Desktop layout displays four columns
- **WHEN** the page is viewed on a screen width of 1024px or greater
- **THEN** the metric cards SHALL be displayed in a grid with four columns

### Requirement: Calculate aggregate metrics from campaign data
The system SHALL calculate aggregate metrics from campaign data by filtering campaigns with status 'sent' that have statistics available, then computing weighted averages for Delivery Rate, Open Rate, and Click Rate, and summing Viewed, Unique Clicks, Unique Views, and Unsubscriptions across all eligible campaigns.

#### Scenario: Calculate delivery rate from sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL filter campaigns with status 'sent' and available stats, calculate total delivered divided by total sent, and return the result as a percentage

#### Scenario: Calculate open rate from sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL filter campaigns with status 'sent' and available stats, calculate total opened divided by total delivered, and return the result as a percentage

#### Scenario: Calculate click rate from sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL filter campaigns with status 'sent' and available stats, calculate total clicked divided by total delivered, and return the result as a percentage

#### Scenario: Calculate total viewed across sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL sum `stats.viewed` across all sent campaigns with available stats

#### Scenario: Calculate total unique clicks across sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL sum `stats.uniqueClicks` across all sent campaigns with available stats

#### Scenario: Calculate total unique views across sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL sum `stats.uniqueViews` across all sent campaigns with available stats

#### Scenario: Calculate total unsubscriptions across sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL sum `stats.unsubscriptions` across all sent campaigns with available stats

#### Scenario: Exclude campaigns without statistics
- **WHEN** calculating aggregate metrics
- **THEN** the system SHALL exclude campaigns that do not have a stats object or have status other than 'sent'

## ADDED Requirements

### Requirement: Format count metrics as locale-aware numbers
The system SHALL format the four new aggregate metrics (Viewed, Unique Clicks, Unique Views, Unsubscriptions) as locale-aware integers using `Intl.NumberFormat`, not as percentages. These cards SHALL display the total count with no decimal places.

#### Scenario: Format aggregate count with locale separator
- **WHEN** displaying a total viewed count of 17998
- **THEN** the system SHALL display it as "17.998" (using Italian locale thousand separator)

#### Scenario: Display zero when no sent campaigns exist
- **WHEN** there are no campaigns with status 'sent' or no campaigns have statistics
- **THEN** the system SHALL display "0" for all four count-based metrics

### Requirement: Assign distinct icons to new metric cards
The system SHALL display a distinct icon/emoji for each of the four new metric cards to visually differentiate them from existing rate-based cards.

#### Scenario: Each new card has a unique icon
- **WHEN** the new metric cards are rendered
- **THEN** the Viewed card SHALL display an eye icon, Unique Clicks SHALL display a pointer icon, Unique Views SHALL display a chart icon, and Unsubscriptions SHALL display an unsubscribe icon
