# Public API Contract: Edit State Save and Cancel Buttons

## Custom Elements

### `<editable-field>` (updated)

No new attributes. New behavior: dispatches `change` event on save.

**Events**

| Event | Bubbles | Detail | Trigger |
|-------|---------|--------|---------|
| `save` | yes | `undefined` (native CustomEvent, no detail) | User clicks save button |

**CSS classes (observed on host)**

| Class | Meaning |
|-------|---------|
| `editing` | Component is in editing state |

**CSS custom properties (new)**

| Property | Default | Applies to |
|----------|---------|------------|
| `--save-button-color` | `currentcolor` | `<save-button>` icon color |
| `--save-button-size` | `1.5rem` | `<save-button>` icon size |
| `--x-button-color` | `currentcolor` | `<x-button>` icon color |
| `--x-button-size` | `1.5rem` | `<x-button>` icon size |

---

### `<save-button>` (new)

A standalone icon button rendering `save.svg`. Usable outside
`<editable-field>`.

**Attributes**: none (inherits from WebComponent base)
**Events**: native `click` (bubbles)
**Rendered markup**:
```html
<save-button>
    <button type="button">
        <!-- floppy-disk SVG -->
        <span class="visually-hidden">Save</span>
    </button>
</save-button>
```

**HTMLElementTagNameMap entry**: `'save-button': SaveButton`

---

### `<x-button>` (new)

A standalone icon button rendering `x.svg`. Usable outside `<editable-field>`.

**Attributes**: none (inherits from WebComponent base)
**Events**: native `click` (bubbles)
**Rendered markup**:
```html
<x-button>
    <button type="button">
        <!-- x SVG -->
        <span class="visually-hidden">Cancel</span>
    </button>
</x-button>
```

**HTMLElementTagNameMap entry**: `'x-button': XButton`

---

## TypeScript Exports

All three component classes are exported from `src/index.ts` (re-exported):

```ts
export { SaveButton } from './save-btn.js'
export { XButton }    from './x-btn.js'
export { PencilButton } from './edit-btn.js'  // already exported
export { EditableField }                       // already exported
```
