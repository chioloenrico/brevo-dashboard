## ADDED Requirements

### Requirement: Function maps Brevo campaign object to simplified structure
The system SHALL provide a function `mapBrevoToCampaign` that transforms a campaign object from Brevo API format into a simplified structure. The function SHALL expose `statistics.globalStats` as `stats` for easier access, while maintaining all original property names from the API.

#### Scenario: Function transforms campaign with statistics
- **WHEN** `mapBrevoToCampaign` is called with a Brevo campaign object containing `statistics.globalStats` with properties `sent`, `delivered`, `viewed`, `clickers`, `uniqueViews`, `uniqueClicks`, etc.
- **THEN** the function SHALL return an object with `stats` property containing the same object as `statistics.globalStats`, preserving all original property names (`viewed`, `clickers`, `uniqueViews`, `uniqueClicks`, etc.)

#### Scenario: Function preserves other campaign properties
- **WHEN** `mapBrevoToCampaign` is called with a Brevo campaign object containing properties like `id`, `name`, `status`, `createdAt`, `sender`, etc.
- **THEN** the function SHALL return an object with all original properties preserved unchanged, with only `stats` added or modified

#### Scenario: Function handles missing statistics
- **WHEN** `mapBrevoToCampaign` is called with a campaign object that does not have a `statistics` property
- **THEN** the function SHALL return an object with `stats: null`

#### Scenario: Function handles missing globalStats
- **WHEN** `mapBrevoToCampaign` is called with a campaign object that has `statistics` but no `globalStats` property
- **THEN** the function SHALL return an object with `stats: null`

#### Scenario: Function handles null statistics
- **WHEN** `mapBrevoToCampaign` is called with a campaign object where `statistics` is `null` or `undefined`
- **THEN** the function SHALL return an object with `stats: null`

#### Scenario: Function maintains API property names
- **WHEN** `mapBrevoToCampaign` is called with a campaign object containing `statistics.globalStats.viewed` and `statistics.globalStats.clickers`
- **THEN** the returned `stats` object SHALL contain `viewed` and `clickers` (not renamed to `opened` and `clicked`)

#### Scenario: Function exposes all globalStats properties
- **WHEN** `mapBrevoToCampaign` is called with a campaign object containing `statistics.globalStats` with multiple properties (e.g., `sent`, `delivered`, `viewed`, `clickers`, `uniqueViews`, `uniqueClicks`, `opensRate`, `hardBounces`, `softBounces`, etc.)
- **THEN** the returned `stats` object SHALL contain all properties from `globalStats` with their original names

#### Scenario: Function is exported as named export
- **WHEN** importing from the module containing `mapBrevoToCampaign`
- **THEN** the function SHALL be available as a named export: `import { mapBrevoToCampaign } from '...'`

#### Scenario: Function handles draft campaigns with statistics
- **WHEN** `mapBrevoToCampaign` is called with a campaign object where `status` is `"draft"` but `statistics.globalStats` exists
- **THEN** the function SHALL return an object with `stats` containing the `globalStats` object (not `null`), as draft campaigns may have statistics in the API

#### Scenario: Function is pure and idempotent
- **WHEN** `mapBrevoToCampaign` is called multiple times with the same input object
- **THEN** the function SHALL return the same output each time without modifying the input object
