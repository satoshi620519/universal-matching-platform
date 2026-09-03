# UX Specification

## Purpose
Define the platform-wide UX contract before production UI implementation. The experience must feel premium, neutral across matching use cases, accessible, responsive, and configurable without coupling UX to dating-specific assumptions.

## 1. Design principles
- Premium but restrained visual hierarchy.
- Internationally neutral language and imagery.
- Accessibility is a first-class requirement, not a later retrofit.
- Mobile-first responsive behavior with desktop optimization.
- Clear system status, validation, loading, empty, error, and success states.
- Safety actions are visible and understandable without being visually dominant.
- Buyer-configurable branding and terminology must not change structural interaction semantics.

## 2. Design tokens
### Color
Use semantic tokens rather than component-specific colors:
- background
- surface
- elevated surface
- text primary/secondary/muted
- border
- brand primary/secondary/accent
- success
- warning
- danger
- focus

Themes must provide sufficient contrast for normal text, controls, and focus indicators. Dark mode must use the same semantic token contract.

### Typography
Define tokens for:
- display
- heading 1/2/3
- body
- body-small
- label
- caption
- button

Font families are configurable, with a system-font fallback stack.

### Spacing and shape
Use a consistent spacing scale and semantic radius tokens: none, small, medium, large. Avoid arbitrary per-component values.

## 3. Component contract
The shared component layer should cover:
- buttons and icon buttons
- links
- text inputs, textareas, selects, checkboxes, radios, toggles
- cards and list rows
- avatars and media
- badges/status indicators
- tabs and segmented controls
- dialogs/drawers
- toast/inline feedback
- pagination/infinite-loading affordances
- navigation/header/bottom navigation
- skeleton/loading states
- empty states
- confirmation and destructive-action patterns

Every interactive component must expose keyboard/focus behavior, disabled/loading states where applicable, accessible names, and validation/error messaging.

## 4. Responsive rules
### Mobile
- Primary actions remain reachable without precision pointing.
- Bottom navigation is preferred for primary user destinations when appropriate.
- Dense tables become cards/lists or horizontally scrollable regions with preserved labels.
- Dialogs may become full-screen sheets.

### Tablet
- Preserve mobile information hierarchy while allowing two-column layouts where space permits.

### Desktop
- Use bounded content widths and persistent navigation where useful.
- Multi-column discovery and administration layouts are allowed when they improve scanability.

No core function may depend exclusively on hover.

## 5. Accessibility contract
Target WCAG 2.2 AA behavior where applicable:
- semantic HTML/native controls first
- keyboard-complete operation
- visible focus indicator
- logical focus order
- sufficient color contrast
- labels and descriptions associated with controls
- errors announced and identified by field
- reduced-motion preference respected
- touch targets sized for practical use
- decorative imagery excluded from assistive technology where appropriate

## 6. User journeys
### First launch
Landing/introduction -> locale selection when needed -> registration/login -> safety/privacy notice -> onboarding.

### Registration and login
Choose authentication -> validate credentials -> verify when required -> establish session -> continue to intended destination.

### Profile creation
Progressive form -> avatar/media -> structured fields -> configurable custom fields -> privacy visibility -> review -> save.

### Profile completion
Show completion progress -> identify useful missing fields -> edit -> confirm visibility -> return to profile.

### Discovery
Choose discovery surface -> apply filters -> inspect profile -> express interest/skip -> receive clear result feedback -> continue browsing.

### Mutual match
Interest accepted -> show match confirmation -> offer conversation entry -> preserve discovery context without forcing messaging.

### Conversation
Conversation list -> thread -> send message/media where enabled -> delivery/read feedback -> block/report available from safety menu.

### Reporting and blocking
Open safety action -> choose report/block -> select reason -> optional evidence/context -> confirm -> show outcome and next safe action. Never expose private moderation notes to the reporting user.

### Settings
Account -> privacy -> notifications -> language/locale -> safety controls -> security/session controls -> account deletion.

### Account deletion
Explain consequences -> require explicit confirmation -> execute or queue deletion according to policy -> invalidate active access as appropriate -> provide completion state.

## 7. States and feedback
Every primary flow must define:
- initial
- loading
- success
- validation error
- recoverable server error
- empty state
- permission/access denied state
- offline/degraded state where applicable

Destructive actions require explicit confirmation. Retry actions must not silently duplicate a mutation.

## 8. Matching-domain neutrality
Use generic concepts such as "interest", "connection", "match", "discover", and configurable terminology. Dating-specific wording, assumptions, imagery, or flows must never be hard-coded into shared UX.

## 9. Buyer customization boundary
Brand colors, typography, imagery, terminology, locale, and feature visibility may be configured through the configuration system. Accessibility semantics, safety affordances, core navigation meaning, and authorization behavior remain platform contracts.

## 10. Validation gate
Before Phase 5 implementation is considered complete:
- design tokens are documented and used consistently
- core components have accessible interaction contracts
- responsive behavior is specified for mobile/tablet/desktop
- all listed user journeys have defined success/error/empty states
- dark mode and reduced motion are addressed
- no dating-only assumptions are embedded in shared UX
