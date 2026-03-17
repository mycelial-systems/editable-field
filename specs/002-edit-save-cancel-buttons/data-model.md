# Data Model: Edit State Save and Cancel Buttons

## Entities

### EditableField (`<editable-field>`)

Existing component. New fields and behavior added by this feature.

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `_originalValue` | `string` | instance property | Captured from `input.value` when editing begins; used to restore on cancel |

**State machine**:

```text
NOT EDITING
  pencil-button visible
  save-button hidden (CSS)
  x-button hidden (CSS)
  input disabled
  host: no .editing class

      [pencil-button click]
            |
            v

EDITING
  pencil-button hidden (CSS)
  save-button visible
  x-button visible
  input enabled, focused
  host: has .editing class

      [save-button click]          [x-button click]
            |                            |
            v                            v
    dispatch change event       restore input.value
    exit editing state          exit editing state
```

**Exit editing state** (shared by save and cancel):
- Remove `.editing` from host
- Add `disabled` + `aria-disabled="true"` to input
- Add `aria-disabled="true"` to host

---

### SaveButton (`<save-button>`)

New custom element. Renders a floppy-disk icon inside a `<button>`.

| Field | Type | Notes |
|-------|------|-------|
| none | -- | Stateless; click event bubbles natively |

**HTML rendered by `render()`**:
```html
<button type="button">
    <svg>...</svg>
    <span class="visually-hidden">Save</span>
</button>
```

---

### XButton (`<x-button>`)

New custom element. Renders an X icon inside a `<button>`.

| Field | Type | Notes |
|-------|------|-------|
| none | -- | Stateless; click event bubbles natively |

**HTML rendered by `render()`**:
```html
<button type="button">
    <svg>...</svg>
    <span class="visually-hidden">Cancel</span>
</button>
```

---

## Validation Rules

- `_originalValue` is always set before any cancel operation; it is
  initialized to `''` by default.
- Save with an unchanged value is valid; no error or guard required.

## CSS State Transitions

Driven entirely by the `.editing` class on `<editable-field>`. No inline
style manipulation in JavaScript.

| Selector | Not editing | Editing |
|----------|-------------|---------|
| `editable-field save-button` | `display: none` | `display: inline-flex` |
| `editable-field x-button` | `display: none` | `display: inline-flex` |
| `editable-field pencil-button` | (default display) | `display: none` |
