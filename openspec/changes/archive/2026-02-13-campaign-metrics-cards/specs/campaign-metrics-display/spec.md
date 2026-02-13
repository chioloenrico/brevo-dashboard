## ADDED Requirements

### Requirement: Display aggregate campaign metrics in card format
The system SHALL display aggregate campaign metrics (Delivery Rate, Open Rate, Click Rate) in a card-based layout at the top of the campaigns page. Each metric SHALL be displayed in its own card with an icon/emoji, formatted value, and descriptive label.

#### Scenario: Display three metric cards
- **WHEN** the campaigns page loads with campaign data
- **THEN** the system SHALL display three cards showing Delivery Rate, Open Rate, and Click Rate metrics

#### Scenario: Card contains icon and formatted value
- **WHEN** a metric card is rendered
- **THEN** the card SHALL display an icon/emoji (📧 for Delivery, 👁️ for Open, 🖱️ for Click), a prominently formatted percentage value, and a descriptive label below the value

### Requirement: Responsive grid layout
The system SHALL display metric cards in a responsive grid layout that adapts to different screen sizes. On mobile devices (< 640px), cards SHALL stack vertically in a single column. On tablet devices (≥ 640px), cards SHALL display in two columns. On desktop devices (≥ 1024px), cards SHALL display in three columns.

#### Scenario: Mobile layout displays single column
- **WHEN** the page is viewed on a screen width less than 640px
- **THEN** the metric cards SHALL be displayed in a single column, stacked vertically

#### Scenario: Tablet layout displays two columns
- **WHEN** the page is viewed on a screen width between 640px and 1023px
- **THEN** the metric cards SHALL be displayed in a grid with two columns

#### Scenario: Desktop layout displays three columns
- **WHEN** the page is viewed on a screen width of 1024px or greater
- **THEN** the metric cards SHALL be displayed in a grid with three columns

### Requirement: Calculate aggregate metrics from campaign data
The system SHALL calculate aggregate metrics from campaign data by filtering campaigns with status 'sent' that have statistics available, then computing weighted averages for Delivery Rate, Open Rate, and Click Rate across all eligible campaigns.

#### Scenario: Calculate delivery rate from sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL filter campaigns with status 'sent' and available stats, calculate total delivered divided by total sent, and return the result as a percentage

#### Scenario: Calculate open rate from sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL filter campaigns with status 'sent' and available stats, calculate total opened divided by total delivered, and return the result as a percentage

#### Scenario: Calculate click rate from sent campaigns
- **WHEN** calculating aggregate metrics from campaign data
- **THEN** the system SHALL filter campaigns with status 'sent' and available stats, calculate total clicked divided by total delivered, and return the result as a percentage

#### Scenario: Exclude campaigns without statistics
- **WHEN** calculating aggregate metrics
- **THEN** the system SHALL exclude campaigns that do not have a stats object or have status other than 'sent'

### Requirement: Format percentage values correctly
The system SHALL format percentage values using Intl.NumberFormat with exactly one decimal place and display them with a percent sign. Values SHALL be formatted according to the user's locale.

#### Scenario: Format percentage with one decimal
- **WHEN** displaying a metric value of 0.95234 (95.234%)
- **THEN** the system SHALL display it as "95.2%"

#### Scenario: Format percentage with trailing zero
- **WHEN** displaying a metric value of 0.250 (25.0%)
- **THEN** the system SHALL display it as "25.0%"

### Requirement: Support dark mode styling
The system SHALL use CSS variables (--background, --foreground) for card styling to ensure consistent appearance in both light and dark modes. Cards SHALL have appropriate contrast and readability in both themes.

#### Scenario: Card displays correctly in light mode
- **WHEN** the system is in light mode
- **THEN** metric cards SHALL use light background colors with dark text that maintains sufficient contrast

#### Scenario: Card displays correctly in dark mode
- **WHEN** the system is in dark mode
- **THEN** metric cards SHALL use dark background colors with light text that maintains sufficient contrast

### Requirement: Integrate component into campaigns page
The system SHALL integrate the CampaignStatsHeader component into the campaigns page above the existing CampaignList component. The component SHALL receive calculated aggregate metrics as props.

#### Scenario: Component appears above campaign list
- **WHEN** a user navigates to the campaigns page
- **THEN** the CampaignStatsHeader component SHALL be displayed above the CampaignList component

#### Scenario: Component receives metrics as props
- **WHEN** the campaigns page renders
- **THEN** the page SHALL calculate aggregate metrics from campaign data and pass them as props to CampaignStatsHeader

### Requirement: Handle empty or missing campaign data
The system SHALL handle cases where no campaigns exist or no campaigns have statistics available by displaying zero values or appropriate placeholder text for each metric.

#### Scenario: Display zero when no sent campaigns exist
- **WHEN** there are no campaigns with status 'sent' or no campaigns have statistics
- **THEN** the system SHALL display "0.0%" for all three metrics (Delivery Rate, Open Rate, Click Rate)
