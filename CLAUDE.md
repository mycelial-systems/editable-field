# editable-field Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-17

## Active Technologies
- TypeScript 5.7 + @substrate-system/web-component ^0.0.46 (002-edit-save-cancel-buttons)

- TypeScript 5.7 + `@substrate-system/web-component` ^0.0.46, (001-editable-field-component)

## Project Structure

```text
src/
├── index.ts         # EditableField custom element (<editable-field>)
├── edit-btn.ts      # PencilButton custom element (<pencil-button>)
├── index.css        # Component styles
└── penci.svg        # Pencil icon source

test/
└── index.ts         # tapzero test suite

specs/
└── 001-editable-field-component/  # Active feature plan
```

## Commands

- `npm test` — run tests via esbuild | tapout
- `npm run lint` — ESLint on TS files
- `npx stylelint src/*.css` — lint CSS
- `npm run build` — full dist build (ESM + CJS + CSS)
- `npm start` — Vite dev server for example

## Code Style

- TypeScript 5.x, no space before type annotation colon (`value:string`)
- Max 80 columns per line
- No emojis in files or comments
- Extend `@substrate-system/web-component` base class
- Register via `define()` from `@substrate-system/web-component/util`
- No Shadow DOM — light DOM only
- CSS custom properties for all theming

## Recent Changes
- 002-edit-save-cancel-buttons: Added TypeScript 5.7 + @substrate-system/web-component ^0.0.46

- 001-editable-field-component: Added TypeScript 5.7 + `@substrate-system/web-component` ^0.0.46,

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
