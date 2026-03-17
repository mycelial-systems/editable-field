# Feature Specification: Edit State Save and Cancel Buttons

**Feature Branch**: `002-edit-save-cancel-buttons`
**Created**: 2026-03-16
**Status**: Draft
**Input**: User description: "When you are in the editing state, the edit
pencil button on the right should change to two different icons -- a save
button and a cancel button -- which are in the save.svg and x.svg files.
Please factor this so that the two new icon buttons are just like the existing
edit-btn.ts button -- each should have its own file, save-btn.ts and x-btn.ts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter Editing Mode (Priority: P1)

A user clicks the pencil/edit button on an editable field. The pencil icon
disappears and is replaced by two icon buttons: a save button and a cancel
button. The user can then modify the field value and either confirm or discard
the change.

**Why this priority**: This is the core interaction -- without this the feature
has no entry or exit path. Every other story depends on this transition
happening correctly.

**Independent Test**: Click the edit button on a rendered `<editable-field>`;
verify the pencil button is gone and save + cancel buttons appear in its place.

**Acceptance Scenarios**:

1. **Given** an `<editable-field>` in its default (non-editing) state,
   **When** the user clicks the pencil button,
   **Then** the pencil button is replaced by a save button and a cancel button,
   and the input becomes editable.

2. **Given** an `<editable-field>` in its default state,
   **When** the component renders,
   **Then** only the pencil button is visible (no save or cancel buttons).

---

### User Story 2 - Save the Edited Value (Priority: P2)

After editing the input, the user clicks the save button to confirm the
change. The component transitions back to its default (non-editing) state,
the save and cancel buttons are replaced by the pencil button again, and the
new value is reflected.

**Why this priority**: Saving is the primary success path; without it the
feature delivers no value.

**Independent Test**: Enter editing mode, change the input value, click save;
verify the field returns to non-editing state with the updated value visible
and only the pencil button showing.

**Acceptance Scenarios**:

1. **Given** the field is in editing state with a modified value,
   **When** the user clicks the save button,
   **Then** the field exits editing state, the value is reflected,
   and the save and cancel buttons are replaced by the pencil button.

2. **Given** the field is in editing state,
   **When** the user clicks save,
   **Then** the `editing` CSS class is removed from the host element.

---

### User Story 3 - Cancel and Discard Changes (Priority: P3)

After editing the input, the user clicks the cancel button to discard the
change. The component returns to its default state with the original value
restored and only the pencil button visible.

**Why this priority**: Cancel is the secondary exit path; important for
a good user experience but the save path is more critical.

**Independent Test**: Enter editing mode, change the input value, click cancel;
verify the original value is restored, editing state is exited, and only the
pencil button is shown.

**Acceptance Scenarios**:

1. **Given** the field is in editing state with a modified value,
   **When** the user clicks the cancel button,
   **Then** the input value reverts to its original value, the field exits
   editing state, and save and cancel buttons are replaced by the pencil
   button.

2. **Given** the field is in editing state,
   **When** the user clicks cancel,
   **Then** the `editing` CSS class is removed from the host element.

---

### Edge Cases

- What happens if the user clicks save without changing the value? The field
  should still exit editing state and show the pencil button with no error.
- What happens if save or cancel receives keyboard focus and the user presses
  Enter or Space? Standard button activation behavior should apply.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The component MUST display only the pencil button when not in
  editing state, and hide it when in editing state.
- **FR-002**: The component MUST display the save button and cancel button
  when in editing state, and hide them when not in editing state.
- **FR-003**: Clicking the save button MUST exit editing state, retaining the
  current input value, and restore the pencil button.
- **FR-004**: Clicking the cancel button MUST exit editing state, restoring
  the original input value that existed when editing began, and restore the
  pencil button.
- **FR-005**: The save button MUST be implemented as its own custom element
  (`<save-button>`) in `save-btn.ts`, following the same structure as the
  existing `<pencil-button>` in `edit-btn.ts`.
- **FR-006**: The cancel button MUST be implemented as its own custom element
  (`<x-button>`) in `x-btn.ts`, following the same structure as the existing
  `<pencil-button>` in `edit-btn.ts`.
- **FR-007**: The save button MUST render the icon from `save.svg`.
- **FR-008**: The cancel button MUST render the icon from `x.svg`.
- **FR-009**: The `editing` class on the host element MUST remain the
  mechanism by which the visual state change is driven, consistent with the
  change introduced in the prior session.

### Key Entities

- **EditableField**: The host custom element that manages editing state and
  coordinates the three button sub-components.
- **PencilButton (`<pencil-button>`)**: Existing edit-trigger button; visible
  only in non-editing state.
- **SaveButton (`<save-button>`)**: New button rendered from `save.svg`;
  visible only in editing state; triggers value confirmation.
- **XButton (`<x-button>`)**: New button rendered from `x.svg`; visible only
  in editing state; triggers value discard.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: When a user activates editing, the pencil button is replaced by
  save and cancel buttons in a single interaction with no visible delay.
- **SC-002**: When a user saves or cancels, the component returns to its
  non-editing state and shows only the pencil button, in a single interaction
  with no visible delay.
- **SC-003**: Cancelling always restores the exact value that was present when
  editing began -- no data loss or corruption.
- **SC-004**: All three icon buttons (pencil, save, cancel) are independently
  defined components, making each individually replaceable without modifying
  the others.

## Assumptions

- The SVG files `save.svg` and `x.svg` already exist in the project alongside
  `pencil.svg` and need only be imported/inlined in the same manner.
- The save action is a local component-level state change; network persistence,
  if needed, is out of scope for this feature.
- The component emits a suitable DOM event when the user saves (e.g., a
  `change` event), so parent code can react; the exact event name is an
  implementation detail.
