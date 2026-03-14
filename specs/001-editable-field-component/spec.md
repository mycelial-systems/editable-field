# Feature Specification: Editable Field Web Component

**Feature Branch**: `001-editable-field-component`
**Created**: 2026-03-14
**Status**: Draft
**Input**: User description: "Need to create this web component. Use the
pencil.svg svg markup to create the pencil icon button. Use the
'visually-hidden' class to make the icon button accessible (via
@substrate-system/a11y). Expose the pencil icon button as a separate
web component."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit a Field Value (Priority: P1)

A user views a piece of text displayed in read-only mode alongside a
pencil icon button. When they click the pencil button, the text becomes
editable and the cursor is placed in the input so they can immediately
type a new value.

**Why this priority**: This is the entire core purpose of the component.
Without this interaction, no other feature has value.

**Independent Test**: Render the `<editable-field>` element with an
initial value. Verify the input is disabled. Click the pencil button.
Verify the input is enabled and focused. Type a new value and verify
it is reflected in the input.

**Acceptance Scenarios**:

1. **Given** the component is rendered with an initial value,
   **When** the page loads,
   **Then** the input is visible but disabled (read-only) and the
   pencil button is visible.

2. **Given** the component is in read-only mode,
   **When** the user clicks the pencil button,
   **Then** the input is enabled and receives focus immediately.

3. **Given** the input is enabled,
   **When** the user types a new value,
   **Then** the input reflects the typed text.

---

### User Story 2 - Accessible Icon Button (Priority: P2)

A keyboard-only or screen-reader user MUST be able to reach the pencil
button via Tab, activate it with Enter or Space, and understand its
purpose from an accessible label without seeing the visual icon.

**Why this priority**: Accessibility is a non-negotiable quality gate
per the project constitution. An icon-only button with no text label is
unusable for screen-reader users unless handled explicitly.

**Independent Test**: Tab to the pencil button. Confirm it has an
accessible name (e.g., "Edit"). Activate it with Enter. Confirm the
associated input receives focus. Run an axe accessibility audit and
confirm zero violations on the rendered component.

**Acceptance Scenarios**:

1. **Given** the component is rendered,
   **When** a screen reader focuses the pencil button,
   **Then** the button is announced with a meaningful label (e.g.,
   "Edit") and its role as "button".

2. **Given** the pencil button has keyboard focus,
   **When** the user presses Enter or Space,
   **Then** the input is enabled and focused (same as click).

3. **Given** the component is audited with an automated accessibility
   tool,
   **When** the component is in its default (read-only) state,
   **Then** zero WCAG 2.1 AA violations are reported.

---

### User Story 3 - Pencil Button as Standalone Component (Priority: P3)

A consumer of this package can import and use the pencil icon button
independently of the full `<editable-field>` component, embedding it
in their own UI to trigger other custom edit interactions.

**Why this priority**: Composability. Exposing the button separately
allows the package to be used in contexts where consumers want the
visual affordance but manage edit state themselves.

**Independent Test**: Import only the pencil-button web component.
Render `<pencil-button>` in isolation. Confirm it renders the SVG icon
with an accessible label and fires a click event that the host can
listen to.

**Acceptance Scenarios**:

1. **Given** only the pencil-button export is imported,
   **When** `<pencil-button>` is placed in a document,
   **Then** it renders the pencil SVG icon with a visible-to-AT label.

2. **Given** a click handler is attached to `<pencil-button>`,
   **When** the user clicks or activates it,
   **Then** the standard click event fires on the element.

---

### Edge Cases

- What happens when the component is rendered without an initial value
  (empty string)?
- What if the user activates the pencil button while the input is
  already enabled — should it no-op or toggle back to read-only?
- What happens if the `<editable-field>` is placed in a form — does
  the internal input participate in form submission?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The component MUST render a disabled text input and a
  pencil icon button in its default state.
- **FR-002**: When the pencil button is activated (click, Enter, or
  Space), the component MUST enable the input and move focus to it.
- **FR-003**: The pencil icon MUST use the SVG markup from `src/penci.svg`
  (Tabler pencil outline icon).
- **FR-004**: The pencil button MUST include visually-hidden text using
  the `visually-hidden` class from `@substrate-system/a11y` so screen
  readers announce its purpose.
- **FR-005**: The pencil button MUST be exposed as an independently
  importable custom element (`<pencil-button>` tag name).
- **FR-006**: Both custom elements MUST register themselves via the
  `define()` utility from `@substrate-system/web-component/util`.
- **FR-007**: The component MUST NOT use Shadow DOM; styles MUST be
  provided via the distributed CSS file.
- **FR-008**: The component MUST hide via `:not(:defined)` CSS until
  the custom element is registered.

### Key Entities

- **EditableField**: The top-level custom element wrapping the input
  and pencil button. Manages enabled/disabled state of the input.
- **PencilButton**: A standalone custom element rendering the SVG pencil
  icon with an accessible visually-hidden label. Fires standard DOM
  click events.

## Assumptions

- The `@substrate-system/a11y` package provides a `.visually-hidden`
  CSS class that hides text visually while keeping it in the
  accessibility tree.
- The pencil button does not toggle the input back to read-only on a
  second click (one-way activation). Toggle behavior is out of scope
  for this iteration.
- The component does not need to emit a custom event for "edit
  activated" in this iteration; the standard click event on the pencil
  button is sufficient.
- Form participation (`name` attribute, form submission) is out of
  scope for this iteration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can click the pencil button and begin typing in the
  input within one interaction, without any additional steps.
- **SC-002**: An automated accessibility audit of the rendered component
  reports zero WCAG 2.1 AA violations.
- **SC-003**: The pencil button can be rendered and used independently
  in a page that does not include the full `<editable-field>` element.
- **SC-004**: A keyboard-only user can reach the pencil button via Tab,
  activate it with Enter or Space, and have focus move to the input —
  verified by manual keyboard traversal.
