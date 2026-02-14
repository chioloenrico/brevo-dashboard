## Why

The application currently has two main routes (Contacts and Campaigns) but lacks a navigation mechanism for users to switch between them. Users must manually type URLs or use browser navigation, creating a poor user experience. A navigation bar is needed to provide intuitive route switching and improve application usability.

## What Changes

- Add a navigation bar component with links to Contacts and Campaigns routes
- Integrate the navbar into the application layout for consistent visibility across pages
- Implement active route highlighting to show users their current location
- Style the navbar to match the existing application design

## Capabilities

### New Capabilities

- `navbar-navigation`: Navigation bar component that provides route switching between Contacts and Campaigns pages, with visual feedback for the active route

### Modified Capabilities

None - this change introduces new functionality without modifying existing capability requirements.

## Impact

- **App Layout**: Main application layout component will be modified to include the navigation bar
- **Routes**: No changes to route definitions, but navbar will reference existing `/contacts` and `/campaigns` routes
- **Dependencies**: May require Next.js Link component or routing library integration
- **UI/Styling**: New CSS/styling for the navigation bar component
