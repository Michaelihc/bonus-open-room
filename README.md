Powered by: 
<p align="center">
  <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="BONUS Open Room logo">
</p>

# BONUS Open Room

BONUS Open Room is an experimental clean-room workflow built on top of the OpenCode codebase. It sets up a separated analysis lane and implementation lane under `.bonus/` so teams can inspect allowed source materials, write specs and conformance assets, and then build a fresh implementation without consulting restricted inputs.

> [!WARNING]
> `ALPHA`: this fork is not stable, the workflow is still being defined, and docs may lag behind the code.
>
> `WIP`: expect broken edges, incomplete flows, placeholder assets, and upstream OpenCode branding in parts of the product that have not been fully forked yet.

## Current focus

- Create a `.bonus/` workspace with clear clean-room boundaries.
- Run an analysis lane that reads allowed materials and writes specs, conformance assets, provenance, and notes.
- Run a clean-room lane that is blocked from `.bonus/source/` and writes only implementation, tests, and docs.
- Expose the workflow in the app UI so the separation is visible when starting a session.

## Workflow

The repository currently centers on this layout:

```text
.bonus/
  README.md
  source/
  spec/
  conformance/
  provenance/
  implementation/
  tests/
  docs/
  notes/
```

Expected flow:

1. Put allowed reference materials in `.bonus/source/`.
2. Use the analysis lane to extract specs, fixtures, provenance, and open questions.
3. Use the clean-room lane to implement from `.bonus/spec/` and `.bonus/conformance/` without reading `.bonus/source/`.
4. Ship the fresh implementation, tests, and docs from the clean-room outputs.

## Status

This repo is not production-ready. Before using it for real work, assume you need to verify:

- Permission boundaries in the exact workflow you plan to run.
- Prompt and command behavior for the analysis and clean-room lanes.
- UI copy, docs, and package metadata that still reference upstream OpenCode.
- Packaging, release, and hosted-doc paths that have not yet been fully rebranded.

## Local development

Install dependencies from the repo root:

```bash
bun install
```

Run the backend:

```bash
bun run --cwd packages/opencode --conditions=browser ./src/index.ts serve --port 4096
```

Run the app UI in a second terminal:

```bash
bun --cwd packages/app dev -- --port 4444
```

Open `http://localhost:4444`.

## Type checking and tests

Type check from package directories, not from the repo root:

```bash
cd packages/opencode && bun typecheck
cd packages/app && bun typecheck
```

Examples:

```bash
cd packages/app && bun test:unit
cd packages/opencode && bun test
```

Do not run tests from the repo root. The root `test` script is intentionally guarded.

## Repo notes

- Default branch: `dev`
- Existing upstream remote still points at the original OpenCode repository
- JavaScript SDK regeneration: `./packages/sdk/js/script/build.ts`

## Documentation

The docs workspace lives in [packages/docs/README.md](/C:/Users/fsp9f/source/repos/BONUS/App/packages/docs/README.md). It is also alpha/WIP and should be treated as draft project documentation until the product surface is fully aligned with the BONUS workflow.
