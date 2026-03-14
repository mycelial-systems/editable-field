---

description: "Task list for editable-field web component implementation"
---

# Tasks: Editable Field Web Component

**Input**: Design documents from
`/specs/001-editable-field-component/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅,
  data-model.md ✅, contracts/public-api.md ✅

**Tests**: Not explicitly requested in the spec. Test tasks are
included for the core interaction (US1) to validate the enabled/focus
behaviour that cannot be verified by visual inspection alone.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to
- Exact file paths included in all implementation task descriptions

---

## Phase 1: Setup

**Purpose**: Add missing dependency and export path; confirm build
works before any implementation begins.

- [x] T001 Add `@substrate-system/a11y` to `dependencies` in `package.json`
- [x] T002 Add `"./edit-btn"` ESM/CJS export paths to `exports` in `package.json`

**Checkpoint**: `package.json` is correct; `npm install` succeeds.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CSS and build infrastructure that both custom elements
depend on. MUST be complete before any element implementation.

- [x] T003 Replace placeholder styles in `src/index.css` — add
  `@import '@substrate-system/a11y/dist/visually-hidden.css'`,
  host element layout rules with `--editable-field-gap` custom
  property, `pencil-button` button reset rules with
  `--pencil-button-color` and `--pencil-button-size` custom
  properties, and `pencil-button:not(:defined)` hide rule
- [x] T004 [P] Verify build pipeline handles two source entry-points by
  confirming `esbuild src/*.ts` targets both `src/index.ts` and
  `src/edit-btn.ts` in the `build-esm` and `build-cjs` scripts
  in `package.json`

**Checkpoint**: Foundation ready — element implementation can begin.

---

## Phase 3: User Story 1 — Edit a Field Value (Priority: P1) MVP

**Goal**: `<editable-field>` renders a disabled input and a pencil
button; clicking the button enables the input and focuses it.

**Independent Test**: Render `<editable-field name="test"
value="hello">`. Verify the internal `<input>` has `disabled` and
`aria-disabled="true"`. Click `<pencil-button>`. Verify `disabled`
and `aria-disabled` are removed and the input has focus.

### Implementation for User Story 1

- [x] T005 [US1] Implement `PencilButton` class in `src/edit-btn.ts`
  — extend `WebComponent`, set `static TAG = 'pencil-button'`,
  in `connectedCallback` guard against re-render (check for
  existing `button`), set `innerHTML` to a `<button type="button">`
  containing the SVG from `src/penci.svg` and a
  `<span class="visually-hidden">Edit</span>`, register via
  `define('pencil-button', PencilButton)`, declare
  `HTMLElementTagNameMap` augmentation
- [x] T006 [US1] Rewrite `EditableField` class in `src/index.ts`
  — import `PencilButton` from `./edit-btn`, set
  `static TAG = 'editable-field'`,
  `static observedAttributes = ['name', 'value', 'disabled']`,
  implement `connectedCallback` with idempotency guard (check for
  existing `input`), render `innerHTML` with
  `<input id="{name}" name="{name}" value="{value}" disabled
  aria-disabled="true" />` followed by `<pencil-button></pencil-button>`,
  attach click listener on the pencil-button that calls
  `_enableEdit()`, register via `define('editable-field',
  EditableField)`
- [x] T007 [US1] Implement `_enableEdit()` private method on
  `EditableField` in `src/index.ts` — query `this.querySelector('input')`,
  call `removeAttribute('disabled')`, `removeAttribute('aria-disabled')`,
  then `focus()`
- [x] T008 [US1] Implement `handleChange_name` in `src/index.ts` —
  in `attributeChangedCallback`, update the internal input's `id`
  and `name` attributes to the new value
- [x] T009 [US1] Implement `handleChange_value` in `src/index.ts` —
  in `attributeChangedCallback`, update the internal input's
  `value` attribute to the new value
- [x] T010 [US1] Implement `handleChange_disabled` in `src/index.ts`
  — in `attributeChangedCallback`, forward `disabled` attribute
  to the internal input (add or remove based on new value)
- [x] T011 [P] [US1] Write basic smoke tests in `test/index.ts` —
  import both elements, render `<editable-field name="test"
  value="hello">` into `document.body`, assert internal input
  exists with `disabled` attribute and `id="test"`, simulate
  click on `pencil-button`, assert `disabled` is removed and
  input has focus

**Checkpoint**: US1 fully functional. `<editable-field>` renders
correctly, pencil click enables and focuses the input. Tests pass.

---

## Phase 4: User Story 2 — Accessible Icon Button (Priority: P2)

**Goal**: The pencil button is reachable and operable by keyboard-only
and screen-reader users; zero WCAG 2.1 AA violations.

**Independent Test**: Tab to `<pencil-button>`. Confirm keyboard focus
is visible. Press Enter. Confirm input becomes enabled and focused.
Run axe audit — expect zero violations.

**Note**: Most accessibility work is already done in T005 (native
`<button>` handles Enter/Space natively; `.visually-hidden` span
provides the accessible name). This phase adds the remaining ARIA
polish and verifies the constitution's Principle IV is fully met.

### Implementation for User Story 2

- [x] T012 [US2] Add `aria-disabled="true"` to the `<editable-field>`
  host element itself (not just the input) in the `connectedCallback`
  of `src/index.ts`, and remove it in `_enableEdit()`, so
  assistive technology announces the overall field state
- [x] T013 [US2] Verify focus ring is not suppressed — inspect
  `src/index.css` and confirm no `outline: none` or
  `outline: 0` rule exists on `pencil-button button` without a
  visible replacement; add a `:focus-visible` outline rule if
  missing

**Checkpoint**: US2 complete. Keyboard navigation works, screen reader
announces button correctly, no WCAG violations.

---

## Phase 5: User Story 3 — Pencil Button as Standalone Component
(Priority: P3)

**Goal**: `<pencil-button>` can be imported and used independently of
`<editable-field>`. Consumers import from `./edit-btn` export path.

**Independent Test**: Create a minimal HTML page that imports only
`@substrate-system/editable-field/edit-btn`. Render
`<pencil-button>`. Confirm it renders the SVG icon with the
visually-hidden label. Attach a click listener. Confirm click fires.

**Note**: The element itself is implemented in T005. This phase ensures
the export path works and the package.json is correct for standalone
consumers.

### Implementation for User Story 3

- [x] T014 [US3] Confirm `src/edit-btn.ts` does NOT import from
  `src/index.ts` (no circular dependency) — the file should only
  import from `@substrate-system/web-component/util` and
  `@substrate-system/web-component`
- [x] T015 [US3] Add `edit-btn.ts` to build scripts in `package.json`
  — confirm `esbuild src/*.ts` already covers it (glob pattern
  should include it); verify the `exports` map added in T002 resolves
  correctly to `dist/edit-btn.js` / `dist/edit-btn.cjs`

**Checkpoint**: US3 complete. `import '@substrate-system/editable-field/edit-btn'`
registers `<pencil-button>` without loading `EditableField`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation, and lint conformance.

- [x] T016 Run `npm run lint` and fix any ESLint errors in
  `src/index.ts` and `src/edit-btn.ts`
- [x] T017 [P] Run `npx stylelint src/*.css` and fix any stylelint
  errors in `src/index.css`
- [x] T018 [P] Run `npm run build` and confirm all expected output
  files exist in `dist/` per the quickstart checklist in
  `specs/001-editable-field-component/quickstart.md`
- [x] T019 [P] Update `src/index.css` to replace the placeholder
  `background-color: red` rule with correct editable-field styles

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion
- **US1 (Phase 3)**: Depends on Phase 2 — BLOCKS nothing downstream
- **US2 (Phase 4)**: Depends on Phase 3 (T005, T006 must exist)
- **US3 (Phase 5)**: Depends on Phase 3 (T005 must exist); can run
  in parallel with Phase 4
- **Polish (Phase 6)**: Depends on all story phases

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories
- **US2 (P2)**: Depends on US1 implementation (T005, T006 done)
- **US3 (P3)**: Depends on US1 implementation (T005 done); can start
  in parallel with US2

### Within Each User Story

- T005 (`PencilButton`) MUST complete before T006 (`EditableField`)
  because `EditableField` renders `<pencil-button>` in its DOM
- T006 MUST complete before T007–T010 (methods on the same class)
- T011 (tests) can start after T006 + T007

### Parallel Opportunities

- T001 and T002 (package.json edits to same file): sequential — same
  file, do together in one edit
- T003 and T004 (CSS + build scripts): can run in parallel after T001
- T008, T009, T010 can be implemented in parallel (different methods,
  same file section — no conflict)
- T012 and T013 can run in parallel (different concerns in same files)
- T014 and T015 can run in parallel
- T016, T017, T018, T019 (Polish) — T016 and T017/T018/T019 can run
  in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# After T005 and T006 are done, launch in parallel:
Task: "Implement handleChange_name in src/index.ts (T008)"
Task: "Implement handleChange_value in src/index.ts (T009)"
Task: "Implement handleChange_disabled in src/index.ts (T010)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T004)
3. Complete Phase 3: User Story 1 (T005–T011)
4. **STOP and VALIDATE**: click pencil button, verify input enables and focuses
5. Demo working component

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → test independently → demo (MVP!)
3. US2 → verify accessibility → demo
4. US3 → verify standalone export
5. Polish → lint, build, verify dist

---

## Notes

- [P] tasks = different files or independent concerns, no blocking deps
- `src/edit-btn.ts` already exists (empty) — T005 fills it
- `src/penci.svg` (note the typo in the filename) contains the SVG
  markup to embed inline in `PencilButton.connectedCallback`
- The `@substrate-system/a11y` package is already installed (v0.0.17)
  but is not yet in `package.json` dependencies — T001 adds it
- Line length must stay ≤ 80 columns per the constitution
