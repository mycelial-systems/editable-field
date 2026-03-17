# Implementation Plan: Edit State Save and Cancel Buttons

**Branch**: `002-edit-save-cancel-buttons` | **Date**: 2026-03-17
**Spec**: specs/002-edit-save-cancel-buttons/spec.md

## Summary

Add `<save-button>` and `<x-button>` custom elements that replace the pencil
button when `<editable-field>` enters editing state. Each button is its own
file (`save-btn.ts`, `x-btn.ts`), mirroring the structure of the existing
`<pencil-button>` in `edit-btn.ts`. Visibility is toggled via CSS rules
keyed on the `.editing` class already in use on the host element.

## Technical Context

**Language/Version**: TypeScript 5.7
**Primary Dependencies**: @substrate-system/web-component ^0.0.46
**Storage**: N/A
**Testing**: @substrate-system/tapzero + @substrate-system/tapout
**Target Platform**: Browser (web component library)
**Project Type**: library
**Performance Goals**: N/A -- synchronous DOM mutations only
**Constraints**: 80-column max, light DOM, no Shadow DOM
**Scale/Scope**: 2 new source files, 1 modified host, 4 new tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Web Component Architecture | PASS | New buttons extend WebComponent, register via define(), declare HTMLElementTagNameMap entries |
| II. HTML-First Progressive Enhancement | PASS | Light DOM rendering; :not(:defined) CSS hides until registered |
| III. YAGNI | PASS | No speculative abstractions; only the three required button components |
| IV. Accessible by Default | PASS | Each button wraps a native `<button>` with a `.visually-hidden` label; keyboard activation handled natively |
| V. CSS Custom Properties | PASS | Visibility driven by .editing class + CSS; new button styles use CSS custom properties for color/size overrides |

No violations. Complexity Tracking table not needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-edit-save-cancel-buttons/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── index.ts         # EditableField: add save/cancel buttons + save/cancel logic
├── edit-btn.ts      # PencilButton (no changes)
├── save-btn.ts      # SaveButton <save-button> (new)
├── x-btn.ts         # XButton <x-button> (new)
├── index.css        # Add visibility rules for save/cancel in .editing state
├── save.svg         # Already exists (source asset, inlined at build time)
└── x.svg            # Already exists (source asset, inlined at build time)

test/
└── index.ts         # Add 4 new test cases
```

**Structure Decision**: Single project (flat `src/`). New files follow the
exact same layout as `edit-btn.ts`.
