## 1. Component Setup

- [x] 1.1 Create components directory at app/components/
- [x] 1.2 Create Navbar.js file in app/components/

## 2. Navbar Component Implementation

- [x] 2.1 Add 'use client' directive at the top of Navbar.js
- [x] 2.2 Import Link from 'next/link'
- [x] 2.3 Import usePathname from 'next/navigation'
- [x] 2.4 Create Navbar function component structure
- [x] 2.5 Implement usePathname hook to get current route
- [x] 2.6 Create navigation structure with Contacts and Campaigns links using Next.js Link component
- [x] 2.7 Implement conditional logic to determine active route
- [x] 2.8 Apply active state styling based on current pathname

## 3. Navbar Styling

- [x] 3.1 Add container styles for navbar layout (flex, positioning, padding)
- [x] 3.2 Add styles for navigation links (spacing, typography, colors)
- [x] 3.3 Add active state styles (highlighting, border, or background color)
- [x] 3.4 Add hover state styles for better UX
- [x] 3.5 Add focus state styles for keyboard accessibility
- [x] 3.6 Ensure styles leverage existing Geist fonts and globals.css variables where applicable

## 4. Layout Integration

- [x] 4.1 Import Navbar component in app/layout.js
- [x] 4.2 Add Navbar component above {children} in RootLayout body
- [x] 4.3 Verify navbar renders on root (/) route
- [x] 4.4 Verify navbar renders on /contacts route
- [x] 4.5 Verify navbar renders on /campaigns route

## 5. Functionality Verification

- [x] 5.1 Test clicking Contacts link navigates to /contacts without full page reload
- [x] 5.2 Test clicking Campaigns link navigates to /campaigns without full page reload
- [x] 5.3 Verify active state highlights correctly on /contacts route
- [x] 5.4 Verify active state highlights correctly on /campaigns route
- [x] 5.5 Verify active state updates when navigating between routes
- [x] 5.6 Test keyboard navigation with Tab key to focus links
- [x] 5.7 Test keyboard activation of links with Enter key
