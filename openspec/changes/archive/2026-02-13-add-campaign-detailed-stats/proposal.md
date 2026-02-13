## Why

The Brevo API already returns detailed campaign statistics (`viewed`, `uniqueClicks`, `uniqueViews`, `unsubscriptions`) in `globalStats`, but the dashboard currently only displays Delivery Rate, Open Rate, and Click Rate. These additional metrics provide valuable insight into actual engagement depth and subscriber retention, which are critical for evaluating campaign effectiveness.

## What Changes

- Add four new columns to the campaign table: Viewed, Unique Clicks, Unique Views, and Unsubscriptions
- Add corresponding aggregate metric cards to the stats header for the new statistics
- Display raw counts (not just percentages) so the user can see absolute numbers alongside rates
- Handle missing data consistently with the existing "-" fallback pattern

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `campaign-list-display`: Add four new columns (Viewed, Unique Clicks, Unique Views, Unsubscriptions) to the campaigns table, displaying absolute values from `stats.viewed`, `stats.uniqueClicks`, `stats.uniqueViews`, and `stats.unsubscriptions`
- `campaign-metrics-display`: Add new aggregate metric cards showing totals for Viewed, Unique Clicks, Unique Views, and Unsubscriptions across all sent campaigns

## Impact

- **UI Components**: `CampaignList.js` (new table columns), `CampaignStatsHeader.js` (new metric cards)
- **Data Layer**: No changes needed — `mapBrevoToCampaign.js` already flattens all `globalStats` fields into `stats`, so `viewed`, `uniqueClicks`, `uniqueViews`, and `unsubscriptions` are already available
- **API**: No changes — `fetchCampaigns.js` already requests `statistics=globalStats` which includes all required fields
- **Server Component**: `page.js` will need to compute additional aggregate totals to pass as props
