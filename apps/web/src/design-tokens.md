# Web UX Token Foundation

The web application consumes the semantic UX contract from `design-tokens.css`.

## Adoption rules

- Use semantic color variables instead of component-specific colors.
- Use typography variables for shared font families and core type sizes.
- Use the spacing scale for new layout/component work.
- Use semantic radius tokens instead of arbitrary border radii.
- Use `:focus-visible` for keyboard-visible focus treatment.
- Respect `prefers-reduced-motion` through the tokenized transition value.
- Override semantic tokens at the theme/configuration layer rather than changing component selectors.

The token layer is intentionally independent from the application flow so Web, mobile, and future shared UI work can converge on the same UX contract without coupling matching terminology or business rules to presentation.
