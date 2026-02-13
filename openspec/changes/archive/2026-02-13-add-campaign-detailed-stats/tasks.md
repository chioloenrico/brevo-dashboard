## 1. Server Component — Aggregate Calculation

- [x] 1.1 Extend `calculateAggregateMetrics` in `app/campaigns/page.js` to sum `viewed`, `uniqueClicks`, `uniqueViews`, and `unsubscriptions` across sent campaigns
- [x] 1.2 Pass the 4 new totals alongside existing rates in the `aggregateMetrics` object to `CampaignStatsHeader`

## 2. Stats Header — New Metric Cards

- [x] 2.1 Add a `formatCount` function in `CampaignStatsHeader.js` using `Intl.NumberFormat('it-IT')` for locale-aware integer formatting
- [x] 2.2 Destructure the 4 new metrics (`totalViewed`, `totalUniqueClicks`, `totalUniqueViews`, `totalUnsubscriptions`) from props with default `0`
- [x] 2.3 Add 4 new `MetricCard` components for Viewed, Unique Clicks, Unique Views, and Unsubscriptions with distinct icons and count values
- [x] 2.4 Update grid classes from `lg:grid-cols-3` to `lg:grid-cols-4` for the expanded card layout

## 3. Campaign Table — New Columns

- [x] 3.1 Add a `formatCount` function in `CampaignList.js` using `Intl.NumberFormat('it-IT')` for locale-aware integer formatting
- [x] 3.2 Extend `getCampaignMetrics` to return `viewed`, `uniqueClicks`, `uniqueViews`, and `unsubscriptions` from `campaign.stats` (or `null` when unavailable)
- [x] 3.3 Add 4 new `<th>` column headers (Viewed, Unique Clicks, Unique Views, Unsubscriptions) after Click Rate, right-aligned
- [x] 3.4 Add 4 new `<td>` cells per row displaying formatted counts or "-" fallback, right-aligned

## 4. Verification

- [x] 4.1 Run dev server and verify new columns render correctly for sent campaigns
- [x] 4.2 Verify draft/scheduled campaigns show "-" in all new columns
- [x] 4.3 Verify header cards display correct aggregate totals with Italian locale formatting
- [x] 4.4 Verify responsive layout — 4-column grid on desktop, 2-column on tablet, 1-column on mobile
