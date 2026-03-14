# Data Model: Editable Field Web Component

**Branch**: `001-editable-field-component`
**Date**: 2026-03-14

---

## Entities

### EditableField (`<editable-field>`)

The top-level custom element. Manages the read-only / editable state
transition of the internal text input.

**HTML Attributes** (observed):

| Attribute  | Type   | Required | Default | Forwarded to input? |
|------------|--------|----------|---------|---------------------|
| `name`     | string | no       | —       | yes — as `id` and `name` |
| `value`    | string | no       | `""`    | yes — as `value`   |
| `disabled` | bool   | no       | absent  | yes                 |

**State**:

| State       | Description                                            |
|-------------|--------------------------------------------------------|
| `read-only` | Initial state. Internal input is `disabled`. Pencil    |
|             | button is visible and interactive.                     |
| `editing`   | Entered when pencil button is activated. Internal      |
|             | input is enabled and focused.                          |

**State transition**:

```
read-only ──(pencil button click)──► editing
```

No transition back to read-only is defined in this version.

**Internal DOM structure** (rendered by `connectedCallback`):

```html
<editable-field name="username" value="johndoe">
    <input
        id="username"
        name="username"
        value="johndoe"
        disabled
        aria-disabled="true"
    />
    <pencil-button></pencil-button>
</editable-field>
```

**TypeScript class**:

```ts
export class EditableField extends WebComponent {
    static TAG = 'editable-field'
    static observedAttributes = ['name', 'value', 'disabled']

    name:string|null
    // ...
}
```

**Idempotency rule**: `connectedCallback` MUST check for an existing
`<input>` before re-rendering (same guard used in the text-input
reference component).

---

### PencilButton (`<pencil-button>`)

A standalone custom element that renders the pencil SVG icon inside a
`<button>`, with a visually-hidden accessible label. It is a pure
presentation element — it fires standard `click` events and manages no
application state.

**HTML Attributes**: none observed. The element has no configurable
attributes in this version.

**Internal DOM structure**:

```html
<pencil-button>
    <button type="button">
        <svg xmlns="http://www.w3.org/2000/svg"
             width="24" height="24" viewBox="0 0 24 24"
             fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4
                     l-10.5 10.5v4" />
            <path d="M13.5 6.5l4 4" />
        </svg>
        <span class="visually-hidden">Edit</span>
    </button>
</pencil-button>
```

**TypeScript class**:

```ts
export class PencilButton extends WebComponent {
    static TAG = 'pencil-button'
    static observedAttributes:string[] = []
    // ...
}
```

---

## Validation Rules

- `name` attribute, when present, MUST be unique per page (consumer
  responsibility — same rule as `text-input` reference).
- `name` attribute value MUST be a valid HTML `id` value (no spaces).
  No runtime enforcement in this version.

---

## CSS Class Inventory

| Class              | Source                          | Purpose                     |
|--------------------|---------------------------------|-----------------------------|
| `.visually-hidden` | `@substrate-system/a11y`        | Hides span from visual view, |
|                    |                                 | keeps it accessible         |
| `editable-field`   | `src/index.css` (element style) | Host element layout/theme   |
| `pencil-button`    | `src/index.css`                 | Button element sizing/theme |
