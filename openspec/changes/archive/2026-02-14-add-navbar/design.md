## Context

This is a Next.js application using the App Router with two main routes:
- `/contacts` - Contact management page
- `/campaigns` - Campaign management page

Currently, there's no UI navigation between these routes. The app uses:
- Next.js 14+ with App Router
- Geist fonts (sans and mono)
- Global CSS in `app/globals.css`
- Root layout in `app/layout.js` that wraps all pages

Users need a persistent navigation bar to switch between these routes without manually typing URLs.

## Goals / Non-Goals

**Goals:**
- Create a reusable Navbar component that appears on all pages
- Provide clear navigation links to Contacts and Campaigns routes
- Show visual feedback for the currently active route
- Integrate seamlessly with the existing Next.js App Router
- Maintain consistent styling with the existing design system

**Non-Goals:**
- Mobile responsiveness optimization (can be added later if needed)
- Dropdown menus or nested navigation
- User authentication/authorization in the navbar
- Search functionality or additional navigation features beyond the two main routes

## Decisions

### 1. Component Location and Structure
**Decision:** Create a standalone `Navbar` component in `app/components/Navbar.js`

**Rationale:** Separates navigation logic from layout, making it reusable and easier to test. Follows Next.js best practices for component organization.

**Alternatives considered:**
- Inline in layout.js: Would work but makes layout.js harder to maintain
- Separate components directory at root: Could work, but keeping it in app/ maintains consistency with App Router structure

### 2. Navigation Implementation
**Decision:** Use Next.js `<Link>` component from `next/link` for route navigation

**Rationale:** Next.js Link provides client-side navigation with prefetching, avoiding full page reloads and improving UX.

**Alternatives considered:**
- Regular `<a>` tags: Would work but causes full page reloads, losing Next.js benefits
- Custom navigation library: Unnecessary when Next.js Link provides everything needed

### 3. Active Route Detection
**Decision:** Use Next.js `usePathname()` hook from `next/navigation` to detect the current route

**Rationale:** Provides client-side access to current pathname, enabling dynamic styling of the active link. This is the standard approach in Next.js App Router.

**Alternatives considered:**
- Server-side detection: Not possible for dynamic styling without client component
- URL parsing: usePathname() is the official Next.js solution and more reliable

### 4. Client vs Server Component
**Decision:** Make Navbar a Client Component (use 'use client' directive)

**Rationale:** Requires `usePathname()` hook for active state detection, which only works in Client Components.

**Alternatives considered:**
- Server Component: Cannot use hooks, would not support active state highlighting

### 5. Integration Point
**Decision:** Add Navbar to `app/layout.js` directly above `{children}`

**Rationale:** Ensures navbar appears on all pages consistently. Placing it in RootLayout avoids duplication across routes.

**Alternatives considered:**
- In each page separately: Would cause duplication and maintenance issues
- As a layout wrapper: Adds unnecessary complexity

### 6. Styling Approach
**Decision:** Use inline CSS-in-JS (style prop) or CSS modules for navbar-specific styles

**Rationale:** Keeps styling scoped to the component, avoiding global CSS pollution. Can leverage existing globals.css for colors/fonts if needed.

**Alternatives considered:**
- Extend globals.css: Works but mixes global and component-specific styles
- Tailwind CSS: Not currently in the project, would add unnecessary dependency

## Risks / Trade-offs

**[Risk]** Active state detection requires client-side JavaScript
→ **Mitigation:** Navbar will still be functional without JS (links work), just without active highlighting. This is acceptable for a dashboard app.

**[Risk]** Adding navbar to RootLayout means it appears on all routes, including potential future routes
→ **Mitigation:** This is desired behavior. If future routes need different navigation, we can conditionally render or create route-specific layouts.

**[Trade-off]** Client Component cannot benefit from server-side rendering
→ **Acceptance:** The navbar is small and interactive by nature (active state), so client-side rendering is appropriate. The performance impact is negligible.

**[Risk]** Styling might not match future design system changes
→ **Mitigation:** Keep navbar styling simple and use CSS variables from globals.css where possible to maintain consistency.
