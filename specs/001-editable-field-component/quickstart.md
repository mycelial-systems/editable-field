# Quickstart: Editable Field Web Component

**Branch**: `001-editable-field-component`
**Date**: 2026-03-14

This guide validates that the implementation is complete and correct.
Run each step after implementation.

---

## Prerequisites

```bash
cd /path/to/editable-field
npm install
npm run build
```

---

## Step 1: Verify the build outputs

```bash
ls dist/
# Expected files:
# index.js        index.cjs       index.min.js
# edit-btn.js     edit-btn.cjs    edit-btn.min.js
# index.css       index.min.css
# index.d.ts      edit-btn.d.ts
```

---

## Step 2: Run the dev server and open the example

```bash
npm start
# Open http://localhost:5173 in a browser
```

The example page should show an `<editable-field>` with a pencil
button. Clicking the button should enable the input and focus it.

---

## Step 3: Manual keyboard test

1. Tab to the pencil button — it should receive a visible focus ring.
2. Press Enter — the input should become enabled and focused.
3. Type a value — it should appear in the input.

---

## Step 4: Screen reader check

Using VoiceOver (macOS) or NVDA (Windows):
1. Navigate to the pencil button.
2. Verify it is announced as "Edit, button" (or equivalent).
3. Activate it — verify focus moves to the input.

---

## Step 5: Run the automated tests

```bash
npm test
```

Expected output (TAP format):
```
# editable-field
ok 1 renders input as disabled by default
ok 2 pencil button click enables input and focuses it
ok 3 name attribute forwarded to input id and name
ok 4 value attribute forwarded to input value
# pencil-button
ok 5 renders pencil SVG icon
ok 6 has visually-hidden "Edit" text
ok 7 fires click event on activation
```

---

## Step 6: Verify standalone pencil-button

Create a minimal HTML file:

```html
<!doctype html>
<html>
<head>
    <link rel="stylesheet" href="dist/index.css">
</head>
<body>
    <pencil-button id="test-btn"></pencil-button>
    <script type="module">
        import { PencilButton } from './dist/edit-btn.js'
        document.getElementById('test-btn')
            .addEventListener('click', () => alert('clicked'))
    </script>
</body>
</html>
```

Open in a browser. Clicking the pencil icon should show the alert.

---

## Step 7: Verify accessibility audit

With the dev server running, open the browser DevTools console:

```js
// Using axe-core (install if needed: npm i -D axe-core)
// Or use the axe browser extension
axe.run('editable-field', (err, results) => {
    console.log(results.violations) // expect []
})
```

---

## Step 8: Lint check

```bash
npm run lint
# and
npx stylelint src/*.css
# Both should report 0 errors
```

---

## Validation complete

If all 8 steps pass, the implementation conforms to the spec and
constitution. The component is ready for versioning and publish.
