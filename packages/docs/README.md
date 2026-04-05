# BONUS Open Room Docs

This directory contains the draft Mintlify docs workspace for BONUS Open Room.

> [!WARNING]
> `ALPHA`: the docs are incomplete and do not describe the full product surface yet.
>
> `WIP`: some pages still reflect starter content or upstream assumptions and should be treated as scaffolding, not final product documentation.

## Local preview

Install the Mintlify CLI if needed:

```bash
npm i -g mint
```

Start the docs preview from `packages/docs`:

```bash
mint dev
```

Open `http://localhost:3000`.

## Scope

The docs should explain:

- What BONUS Open Room is
- The `.bonus/` workspace layout
- Analysis lane vs clean-room lane responsibilities
- Local development and verification steps
- Known gaps, limitations, and provenance expectations

## Editing notes

- Keep the alpha/WIP warning visible on high-level entry pages until the workflow stabilizes.
- Prefer describing the implemented BONUS workflow over copying generic OpenCode or Mintlify starter language.
- Treat any page that still reads like template content as unfinished.
