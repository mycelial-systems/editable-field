# Quickstart: Edit State Save and Cancel Buttons

## What changes

| File | Action | Summary |
|------|--------|---------|
| `src/save-btn.ts` | **Create** | `<save-button>` custom element with floppy-disk icon |
| `src/x-btn.ts` | **Create** | `<x-button>` custom element with X icon |
| `src/index.ts` | **Modify** | Import new buttons; add to rendered markup; wire save/cancel logic |
| `src/index.css` | **Modify** | Add visibility rules + styles for save/cancel buttons |
| `test/index.ts` | **Modify** | Add 4 new test cases |

## Implementation steps (in order)

### 1. Create `src/save-btn.ts`

Copy the structure of `edit-btn.ts`. Replace the SVG inline string with the
content of `save.svg`. Change tag to `'save-button'`, class to `SaveButton`,
hidden label text to `'Save'`.

```ts
// pattern from edit-btn.ts
export class SaveButton extends WebComponent {
    static TAG = 'save-button'
    render () {
        if (this.querySelector('button')) return
        this.innerHTML = `<button type="button">
            ${SVG}
            <span class="visually-hidden">Save</span>
        </button>`
    }
}
define('save-button', SaveButton)
```

### 2. Create `src/x-btn.ts`

Same as above but with `x.svg` content, tag `'x-button'`, class `XButton`,
label `'Cancel'`.

### 3. Update `src/index.ts`

a. Import the two new button files:
```ts
import './save-btn.js'
import './x-btn.js'
```

b. Add `_originalValue:string = ''` instance field.

c. In `render()`, append `<save-button>` and `<x-button>` after
   `<pencil-button>` in the `innerHTML` string. Wire their click listeners.

d. Add `_disableEdit()` private method (shared exit path):
   - Add `disabled` + `aria-disabled="true"` to input
   - Add `aria-disabled="true"` to host
   - Remove `.editing` from host

e. In `_enableEdit()`, capture `_originalValue = input.value` before
   enabling the input.

f. Wire save button: exit editing, dispatch `save` event.

g. Wire cancel button: restore `input.value = _originalValue`, exit editing.

### 4. Update `src/index.css`

Add to the `editable-field` block:

```css
& save-button,
& x-button {
    display: none;
}
&.editing {
    & pencil-button { display: none; }
    & save-button,
    & x-button { display: inline-flex; }
}
```

Add shared button styles for `save-button` and `x-button` (mirror the
`pencil-button` block, using `--save-button-color`, `--save-button-size`,
`--x-button-color`, `--x-button-size` custom properties).

### 5. Add tests in `test/index.ts`

Four new test cases (see spec User Stories 1-3 + edge cases):
1. Entering edit mode shows save/cancel, hides pencil
2. Save button exits editing, retains value, dispatches `save`
3. Cancel button exits editing, restores original value
4. `save-button` and `x-button` render standalone

## Verification

```sh
npm test       # all 7 tests pass (3 existing + 4 new)
npm run lint
npx stylelint src/*.css
```
