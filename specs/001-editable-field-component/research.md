# Research: Editable Field Web Component

**Branch**: `001-editable-field-component`
**Date**: 2026-03-14

---

## Decision 1: name attribute forwarding to internal input

**Decision**: The `name` attribute on `<editable-field>` is forwarded to
the internal `<input>` as both `id` and `name`, following the exact
pattern from the `mycelial-systems/text-input` reference.

**Rationale**: The reference component documents this explicitly —
"The `name` attribute is used as an `id` also, so it should be unique
per page." This gives consumers a stable CSS/JS selector (`#field-name`)
to reach the internal input without needing Shadow DOM piercing. It
also prepares for future form participation without architectural
changes.

**Alternatives considered**:
- Separate `id` and `name` attributes: adds surface area with no
  current benefit; deferred per YAGNI.
- Auto-generated id: non-deterministic, breaks label association.

---

## Decision 2: id attribute on the host element

**Decision**: The `id` attribute stays on the `<editable-field>` host
element itself (standard HTML behaviour). It is NOT forwarded to the
internal input. The internal input gets its `id` from `name` (see
Decision 1).

**Rationale**: Consumers who set `id="my-field"` on the host element
expect the element itself to be locatable by that id. Forwarding it
inward would shadow the host from document selectors.

**Alternatives considered**: Forwarding `id` to input — rejected
because it breaks `document.getElementById('my-field')` returning the
custom element.

---

## Decision 3: Focus control pattern

**Decision**: `EditableField` listens for `click` on the internal
`<pencil-button>` element. On click it removes `disabled` from the
internal `<input>`, removes `aria-disabled`, then calls
`input.focus()`.

**Rationale**: The reference component accesses the internal input via
`this.querySelector('input')`. No custom `focus()` method is needed on
the custom element itself; focus delegation is achieved purely via DOM
query + `.focus()` call, which is the minimal correct approach.

**Alternatives considered**:
- Dispatching a custom event upward and handling it at host level:
  unnecessary indirection for a single-element component.
- `delegatesFocus` (Shadow DOM only): not applicable; we are in the
  light DOM.

---

## Decision 4: PencilButton as a standalone custom element

**Decision**: `PencilButton` lives in `src/edit-btn.ts` and registers
as `<pencil-button>`. `EditableField` imports `PencilButton` and
renders `<pencil-button>` in its `innerHTML`. Both are exported from
the package — `PencilButton` independently via `./edit-btn` export
path.

**Rationale**: Spec FR-005 requires the button to be independently
importable. Separating it into its own file with its own `define()`
call satisfies this with no coupling. `EditableField` depends on
`PencilButton` being registered (it imports it), but a consumer who
only imports `edit-btn` gets the button alone.

**Alternatives considered**:
- Inline button HTML inside `EditableField.render()` with no separate
  element: does not satisfy FR-005 (standalone usability).
- Slot-based composition: adds complexity not required by the spec.

---

## Decision 5: Accessible label for the pencil button

**Decision**: `PencilButton` renders:

```html
<button type="button">
    <svg ...><!-- pencil icon --></svg>
    <span class="visually-hidden">Edit</span>
</button>
```

The `.visually-hidden` class is sourced from
`@substrate-system/a11y/dist/visually-hidden.css` (already a package
dependency — needs to be added). Its definition hides content
visually while keeping it in the accessibility tree:

```css
.visually-hidden:not(:focus, :active) {
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}
```

The CSS is imported into `src/index.css` via `@import`. No runtime
JS injection.

**Rationale**: Spec FR-004 requires `visually-hidden` from
`@substrate-system/a11y`. Scott O'Hara's inclusive-hiding technique is
the current best practice for icon buttons.

**Alternatives considered**:
- `aria-label` on the button: works but duplicates the text and is
  less robust across translation tools.
- `title` attribute: not reliably announced by all screen readers.

---

## Decision 6: aria-disabled vs disabled attribute on the input

**Decision**: In read-only state, the input carries the native `disabled`
attribute. `aria-disabled="true"` is also set to reinforce state
semantics. When the pencil button is clicked, both are removed and
`focus()` is called.

**Rationale**: The constitution requires `aria-disabled` on the input
when in read-only state (Principle IV). Using `disabled` alone is
functionally correct but semantically richer with the ARIA attribute.

**Alternatives considered**:
- `readonly` attribute instead of `disabled`: `readonly` fields still
  participate in tab order and can be confusing without a clear "locked"
  state. `disabled` is a stronger affordance for the initial state.

---

## Decision 7: @substrate-system/web-component base class usage

**Decision**: Both `EditableField` and `PencilButton` extend
`WebComponent` from `@substrate-system/web-component` (the same base
class the existing `src/index.ts` scaffold already uses via `define`
from the util subpath). They use `define()` from
`@substrate-system/web-component/util` for registration.

**Rationale**: This is what the constitution mandates (Principle I) and
what the existing scaffold already imports. The base class provides
`qs()`, `qsa()`, `emit()`, and automatic `handleChange_*` dispatch —
all useful here.

**Alternatives considered**:
- Extend `HTMLElement` directly (as the text-input reference does):
  allowed, but the constitution explicitly requires extending the
  substrate-system base class.

---

## Decision 8: value attribute

**Decision**: `value` attribute on `<editable-field>` is forwarded to
the internal `<input value="">` during initial render in
`connectedCallback`. It is listed in `observedAttributes` and handled
in `attributeChangedCallback` to keep the input in sync.

**Rationale**: A text field without a `value` attribute would require
consumers to query the internal input directly, which breaks
encapsulation. Forwarding `value` is minimal and directly useful.

**Alternatives considered**:
- DOM property only (no attribute): inconsistent with how HTML works;
  attributes are the correct HTML API.

---

## Package dependency notes

- `@substrate-system/a11y` is already installed (v0.0.17).
  It must be added to `package.json` `dependencies` (currently only in
  implicit transitive dependencies). Its CSS is imported in
  `src/index.css`.
- `src/edit-btn.ts` file exists but is empty — ready for implementation.
