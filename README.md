# Editable Field
`editable-field` is a tiny Web Component that wraps an `<input>`
together with a pencil/save/cancel button set. The pencil button enables
editing, and the save/cancel controls are revealed once the field is in
edit mode. It keeps the host attributes (`name`, `value`, `disabled`) in
sync with the internal input and emits lifecycle events that bubble up to
any listener, including handlers that watch for namespaced event names.

[See a live demo](https://mycelial-systems.github.io/editable-field/) and
check the `example/` folder for a hands-on playbook.

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [Quick start](#quick-start)
- [API](#api)
  * [Attributes](#attributes)
  * [Events](#events)
- [Usage](#usage)
  * [JavaScript](#javascript)
  * [HTML](#html)
  * [Controlled mode](#controlled-mode)
- [CSS](#css)
  * [CSS variables](#css-variables)
- [Pre-built files](#pre-built-files)
- [Notes](#notes)

<!-- tocstop -->

</details>

## Install

Install via npm, yarn, or pnpm and the package will register the
`<editable-field>` custom element globally.

```sh
npm i -S @substrate-system/editable-field
```

## Quick start

Import the element and its styles into your bundle entry. The JS import
touches `customElements.define` so the tag is ready to use; the CSS import
brings the default gap, outline, and button styles.

```js
import '@substrate-system/editable-field'
import '@substrate-system/editable-field/css'
```

Now use `<editable-field>` in your markup.

## API

### Attributes

- `name` (string, default `''`)
  Mirrors the attribute to the inner `<input>`'s `name` and `id`
- `value` (string, default `''`)
  Syncs to the input `value`. Updating the host attribute when the field is
  idle updates what appears when the next edit session starts.
- `disabled` (any truthy value, default `true`)
  Keeps the input disabled and adds `aria-disabled="true"`. Remove the
  attribute (or set it to `'false'`) to re-enable typing.
  Example:
  `<editable-field
      name="email"
      value="hi@example.com"
      disabled
  ></editable-field>`
- `can-edit` (boolean-ish, default off)
  Hands ownership of the editing state to your app. See
  [Controlled mode](#controlled-mode). Like `disabled`, an absent
  attribute or the string `'false'` counts as off.
- `editing` (boolean-ish, default off)
  Whether the editor is open. Setting it caches the current value as the
  cancel baseline, enables and focuses the input, and adds the `editing`
  class. Clearing it closes the editor. Setting it does not emit `edit`,
  because your app already knows.
- `pending` (boolean-ish, default off)
  Set this while your save is in flight. Adds the `pending` class,
  disables the input and both buttons, and leaves the editor open.
  `editing` and `pending` can be cleared in either order.
- `no-trigger` (boolean-ish, default off)
  Hides the built-in pencil button so your app can supply its own
  affordance. The button stays in the markup but gets `hidden`, which
  keeps it out of the tab order and the accessibility tree.

### Events

- `edit`
  - Origin: host element via `this.emit('edit')` / `this.dispatch('edit')`
  - Bubbles: yes
  - Notes: Fires when the pencil button is clicked. Uncontrolled, the
    editor is already open by the time it fires; controlled, it is a
    request and nothing has opened yet.
    The event is also available as `editable-field:edit` through
    `field.on('edit', handler)`.
- `save`
  - Origin: internal `<input>`
  - Bubbles: yes
  - Notes: Fired when the save button is clicked. Because the event
    originates from the `<input>`, `event.target.value` gives the new value.
    A namespaced `editable-field:save` is emitted via `field.on('save', …)`
    as shown in `example/index.ts`. Uncontrolled, the editor has already
    closed by the time it fires; controlled, it stays open until you
    clear `editing`.
- `cancel`
  - Origin: host element (`this.emit('cancel')`, `this.dispatch('cancel')`)
  - Bubbles: yes
  - Notes: Triggered by the cancel button or the Escape key. The component
    restores the cached `_originalValue` before the event bubbles.
    Controlled, restoring the value is all it does; clearing `editing` is
    yours. Both are inert while `pending` is set.

The `example/index.ts` file also shows how to log the events, inspect the event
`type`, and listen for the wildcard `field.addEventListener('*', handler)`
that surfaces every emitted event.

## Usage

See [`./example/index.ts](./example/index.ts).

### JavaScript

```ts
import { type EditableField } from '@substrate-system/editable-field'

const field = document.querySelector<EditableField>('editable-field')
field?.addEventListener('save', ev => {
    const input = ev.target
    console.log('saved value:', input.value)
})

field?.on('save', ev => {
    console.log('namespaced event:', ev.type)
})
```

### HTML

The component consumes the same attributes as the native `<input>`:

```html
<form>
    <label for="email">Email</label>
    <editable-field
        id="email"
        name="email"
        value="user@example.com"
    ></editable-field>
</form>
```

When placed inside a form, the `name` attribute flows through to the inner
input so form serialization (via `FormData`) works without extra wiring.

### Controlled mode

By default the component owns the editing state. The pencil opens the
editor, save and cancel close it, and you just listen for events.

Pass `can-edit` and that ownership flips. The component emits events but
never opens or closes the editor on its own, so a pencil click becomes a
request rather than an action. That is what makes an async save
representable: `save` fires, your handler runs, and the editor stays open
until you clear `editing`.

```js
const field = document.querySelector('editable-field')

field.addEventListener('edit', () => {
    field.setAttribute('editing', '')
})

field.addEventListener('cancel', () => {
    field.removeAttribute('editing')
})

field.addEventListener('save', async ev => {
    const next = ev.target.value
    field.setAttribute('pending', '')

    try {
        await saveToServer(next)
        field.setAttribute('value', next)
        field.removeAttribute('editing')
    } catch (err) {
        // leave `editing` set so the user can correct and retry
        showError(err)
    } finally {
        field.removeAttribute('pending')
    }
})
```

While `pending` is set the input and both buttons are disabled, and
Escape does nothing, so a slow save cannot be double-submitted or
cancelled out from under itself. Clear it on failure as well as success,
or the field stays stuck.

Setting `editing` on its own, without `can-edit`, also stops the
component closing itself. The difference is that `can-edit` keeps the
field controlled while the editor is closed, which is what a pencil
click needs in order to reach you as an `edit` event.

To supply your own affordance, add `no-trigger` and set `editing`
yourself.

```html
<editable-field
    name="email"
    value="hi@example.com"
    can-edit
    no-trigger
></editable-field>
<button type="button" id="edit-email">Edit email</button>
```

```js
document.getElementById('edit-email').addEventListener('click', () => {
    field.setAttribute('editing', '')
})
```

## CSS

The package ships with default styles:

```js
import '@substrate-system/editable-field/css'
// or for the minified output:
import '@substrate-system/editable-field/min/css'
```

Include these imports once in your CSS/JS entry point before you render the
elements so the buttons and outlines behave as shipped.

### CSS variables

- `--editable-field-gap` (`0.5rem`): Gap between the input and the button trio.
- `--pencil-button-color` (`currentcolor`): Stroke color for the pencil icon.
- `--pencil-button-size` (`1.5rem`): Width/height of the pencil icon.
- `--save-button-color` (`currentcolor`): Stroke color for the save checkmark.
- `--save-button-size` (`1.5rem`): Width/height of the save icon.
- `--x-button-color` (`currentcolor`): Stroke color for the cancel "x".
- `--x-button-size` (`1.5rem`): Width/height of the cancel icon.
- `--save-button-pending-opacity` (`0.5`): Opacity of the save button
  while `pending` is set.
- `--x-button-pending-opacity` (`0.5`): Opacity of the cancel button
  while `pending` is set.

Override any of these variables on the host to restyle the buttons or the
spacing without touching the component internals.

```css
editable-field {
    --editable-field-gap: 1rem;
    --save-button-color: #0b99ff;
    --x-button-color: #e66;
}
```

## Pre-built files

If you prefer a drop-in script, copy the bundled JS/CSS from `dist/` into
your public folder.

```sh
cp ./node_modules/@substrate-system/editable-field/dist/index.min.js ./public/editable-field.min.js
cp ./node_modules/@substrate-system/editable-field/dist/style.min.css ./public/editable-field.css
```

```html
<head>
    <link rel="stylesheet" href="./editable-field.css">
</head>
<body>
    <script type="module" src="./editable-field.min.js"></script>
</body>
```

## Notes

- The component keeps `aria-disabled="true"` on the host until the pencil
  button is clicked; `input.focus()` runs as soon as editing starts.
- Save/cancel buttons are hidden by default and shown via the `.editing`
  class when editing is active. The pencil button is hidden while in edit
  mode.
- The cancel flow restores the cached `_originalValue` before it emits
  `cancel`.
- `pending` ships no spinner. It dims the disabled buttons and adds a
  `pending` class to the host, so any busier treatment is yours to write.
- To inspect live logging, set `localStorage.DEBUG` to `editable-field` and
  run `example/index.ts` during development.
