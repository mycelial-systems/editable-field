# Research: Edit State Save and Cancel Buttons

## Decision 1: SVG Inlining Strategy

**Decision**: Inline SVG markup as a TypeScript string constant, identical to
the approach used in `edit-btn.ts`.

**Rationale**: The existing `PencilButton` inlines its SVG as a template
literal `const SVG = \`...\`` and sets `innerHTML`. This keeps each component
self-contained (no import of `.svg` files at runtime), avoids a loader
dependency, and is directly readable in the source file. The `save.svg` and
`x.svg` source files exist for reference/editing but are copied inline at
authoring time.

**Alternatives considered**:
- Dynamic `fetch` of SVG at runtime: rejected -- introduces async complexity
  for a trivial static asset.
- Vite SVG import (`?raw`): rejected -- this is a library, not the Vite demo;
  the library build uses esbuild directly.

---

## Decision 2: Visibility Toggle Strategy

**Decision**: Keep all three button elements permanently in the DOM after
initial render. Show/hide via CSS rules keyed on the `.editing` class on the
host `<editable-field>`.

```css
editable-field {
    & save-button,
    & x-button {
        display: none;
    }
    &.editing {
        & pencil-button { display: none; }
        & save-button,
        & x-button { display: inline-flex; }
    }
}
```

**Rationale**: CSS-only toggling avoids creating and destroying DOM nodes on
every state transition, is consistent with the existing `.editing` class
approach (FR-009), and is the simplest possible mechanism.

**Alternatives considered**:
- Remove/re-insert button elements on state change: rejected -- more DOM
  churn, more JS logic, no benefit.
- `hidden` attribute: rejected -- CSS custom property theming may override
  `display`, making `hidden` less reliable. The `.editing`-class approach is
  already the project's established pattern.

---

## Decision 3: Save Event Name

**Decision**: Dispatch a `save` CustomEvent from `<editable-field>` when
the user clicks save, with `{ bubbles: true }`.

**Rationale**: The user explicitly requested a `save` event. A named `save`
event is unambiguous -- consumers can distinguish it from the native `change`
event that fires on the internal `<input>` during editing. `bubbles: true`
allows parent code to listen on any ancestor.

**Alternatives considered**:
- `change` (standard DOM event): initially considered for native alignment,
  but rejected because it conflicts with the `input`'s own `change` events
  and the user explicitly specified `save`.
- Dispatching from the save button itself: rejected -- the field is the
  meaningful unit; buttons are internal implementation details.

---

## Decision 4: Original Value Storage for Cancel

**Decision**: Capture the input's current `value` property into a private
`_originalValue:string` instance field on `EditableField` when `_enableEdit()`
is called. On cancel, restore `input.value` from this field and call
`_disableEdit()`.

**Rationale**: The value must be a live snapshot taken at the moment editing
begins (not the `value` attribute, which reflects the initial attribute, not
user edits to the live DOM). Storing on the instance is the minimal, direct
approach.

**Alternatives considered**:
- Reading back from the `value` attribute on cancel: rejected -- does not
  capture values changed by prior saves that update only the property.
- Storing in a `data-*` attribute: rejected -- unnecessary DOM mutation for
  purely internal state.

---

## Decision 5: edit-btn.ts Interaction

**Decision**: No changes to `edit-btn.ts` or `PencilButton`. The pencil
button's click listener remains on the `<pencil-button>` element, delegated
via `EditableField.render()`. Save and cancel buttons get analogous listeners
wired in `render()` (or lazily in `_enableEdit()`).

**Rationale**: The simplest approach matching FR-005, FR-006, and SC-004
(independently replaceable buttons).
