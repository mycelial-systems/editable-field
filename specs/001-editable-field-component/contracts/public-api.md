# Public API Contract: @substrate-system/editable-field

**Version**: 0.0.1
**Date**: 2026-03-14

This document is the authoritative contract for consumers of the
`@substrate-system/editable-field` package. Implementation MUST
conform to every interface defined here.

---

## Package Exports

```json
{
    ".":          "EditableField custom element (registers <editable-field>)",
    "./edit-btn": "PencilButton custom element (registers <pencil-button>)",
    "./css":      "dist/index.css — component styles",
    "./min/css":  "dist/index.min.css — minified styles"
}
```

Importing `"."` also imports and registers `<pencil-button>` as a
side effect (because `EditableField` depends on it).

Importing `"./edit-btn"` alone registers only `<pencil-button>`.

---

## TypeScript Exports

### EditableField

```ts
import { EditableField } from '@substrate-system/editable-field'

export class EditableField extends WebComponent {
    static TAG:string               // 'editable-field'
    static observedAttributes:string[]  // ['name', 'value', 'disabled']

    name:string|null                // mirrors name attribute
}

// Global augmentation for querySelector type safety
declare global {
    interface HTMLElementTagNameMap {
        'editable-field': EditableField
        'pencil-button': PencilButton
    }
}
```

### PencilButton

```ts
import { PencilButton } from '@substrate-system/editable-field/edit-btn'

export class PencilButton extends WebComponent {
    static TAG:string               // 'pencil-button'
    static observedAttributes:string[]  // []
}
```

---

## HTML Interface: `<editable-field>`

### Attributes

| Attribute  | Type    | Description                                     |
|------------|---------|-------------------------------------------------|
| `name`     | string  | Forwarded to internal `<input>` as `id` and     |
|            |         | `name`. MUST be unique per page.               |
| `value`    | string  | Initial value of the internal `<input>`.        |
| `disabled` | boolean | When present, the component is fully disabled.  |
|            |         | Forwarded to internal `<input>`.               |

### Behaviour

1. **Default state**: The internal `<input>` is rendered with
   `disabled` and `aria-disabled="true"`. The `<pencil-button>`
   is rendered adjacent to the input.

2. **Edit activation**: When `<pencil-button>` is clicked (or
   activated via keyboard), the component:
   - Removes `disabled` from the internal `<input>`
   - Removes `aria-disabled` from the internal `<input>`
   - Calls `focus()` on the internal `<input>`

3. **No toggle**: Activating the button a second time is a no-op
   in this version. The input remains enabled.

### DOM query access

Consumers can access the internal input via:

```ts
const field = document.querySelector('editable-field')
const input = field.querySelector('input')       // by type
const input2 = field.querySelector('#username')  // by name-derived id
```

---

## HTML Interface: `<pencil-button>`

### Attributes

None in this version.

### Behaviour

Renders a `<button type="button">` containing the pencil SVG icon and
a `.visually-hidden` span with the text "Edit". Fires a standard DOM
`click` event on user interaction (mouse click, Enter, Space).

```html
<!-- Example standalone usage -->
<pencil-button id="my-btn"></pencil-button>
<script type="module">
    import '@substrate-system/editable-field/edit-btn'
    document.getElementById('my-btn')
        .addEventListener('click', () => console.log('edit!'))
</script>
```

---

## CSS Contract

Consumers MUST import the component CSS for correct rendering:

```html
<link rel="stylesheet"
      href="node_modules/@substrate-system/editable-field/dist/index.css">
```

Or via JS bundler:

```ts
import '@substrate-system/editable-field/css'
```

### CSS Custom Properties (theming)

| Property                          | Default  | Description            |
|-----------------------------------|----------|------------------------|
| `--editable-field-gap`            | `0.5rem` | Space between input    |
|                                   |          | and pencil button      |
| `--pencil-button-color`           | `currentColor` | Icon stroke color |
| `--pencil-button-size`            | `1.5rem` | Icon width/height      |

---

## Events

No custom events are emitted in this version. Consumers observe
the standard `input` and `change` events on the internal
`<input>` element, and `click` on `<pencil-button>`.

---

## Breaking Change Policy

This contract is versioned with the package. Any change to:
- Observed attributes
- Internal DOM structure accessed by published selectors
- CSS custom property names
- Export paths

...constitutes a breaking change and requires a MAJOR version bump.
