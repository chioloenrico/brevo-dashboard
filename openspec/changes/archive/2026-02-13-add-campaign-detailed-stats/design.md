## Context

The dashboard currently displays 3 rate-based metrics (Delivery Rate, Open Rate, Click Rate) both as aggregate cards and per-campaign table columns. The Brevo API already returns `viewed`, `uniqueClicks`, `uniqueViews`, and `unsubscriptions` inside `globalStats`, and the mapper already flattens them into `campaign.stats`. No data-layer changes are needed — this is purely a UI expansion.

## Goals / Non-Goals

**Goals:**
- Display `viewed`, `uniqueClicks`, `uniqueViews`, `unsubscriptions` as absolute counts in the campaign table
- Display aggregate totals for these 4 metrics as new cards in the stats header
- Maintain consistency with existing styling, formatting, and fallback patterns

**Non-Goals:**
- Adding new rate calculations (e.g., unsubscription rate) — raw counts are sufficient for now
- Changing the API call or data mapper
- Adding sorting, filtering, or interactivity to the new columns

## Decisions

### 1. Display as absolute counts, not percentages

The existing 3 metrics are rates (ratios). The 4 new metrics are best understood as absolute counts — "7,779 unique views" is more meaningful than "unique view rate". Both the table columns and the header cards will use `Intl.NumberFormat` for locale-aware number formatting (e.g., `7.779` in Italian locale) instead of percentage formatting.

**Alternative considered:** Calculating rates (e.g., uniqueClicks / delivered). Rejected because the raw counts are already insightful on their own, and adding derived rates would complicate the UI without clear benefit.

### 2. Header grid expands from 3 to 7 cards in two rows

The current `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` layout works for 3 cards. With 7 cards, the grid will shift to `lg:grid-cols-4` to create a balanced 4+3 layout on desktop and remain responsive on smaller screens.

**Alternative considered:** Grouping new metrics into a separate section. Rejected because a unified card grid keeps the dashboard simple and scannable.

### 3. Table columns appended after existing ones

The 4 new columns will be added after Click Rate, in this order: Viewed, Unique Clicks, Unique Views, Unsubscriptions. This keeps the existing layout stable and groups the new engagement metrics together. All new columns will be right-aligned (consistent with numeric columns) and display "-" when stats are unavailable.

### 4. Aggregate calculation follows existing pattern

The `calculateAggregateMetrics` function in `page.js` will be extended to sum the 4 new fields across all sent campaigns, exactly as it currently does for `sent`, `delivered`, `viewed`, and `clickers`. The totals are passed as additional props to `CampaignStatsHeader`.

## Risks / Trade-offs

- **Wider table on mobile** → The table already has `overflow-x-auto`, so horizontal scrolling handles this. No additional mitigation needed.
- **Header card density** → 7 cards is more dense than 3. Mitigated by using `lg:grid-cols-4` to keep cards a reasonable size on desktop.
- **Zero values for draft campaigns** → Consistent with existing behavior: display "-" for campaigns that aren't "sent" or lack stats.
