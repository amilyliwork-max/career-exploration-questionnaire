# Career Exploration Questionnaire

A guided, student-friendly questionnaire for middle and high school students. It is **not** a career-matching or personality test — it collects interests, exposure, questions, and preferred exploration experiences to help design better career events.

## Quick start

```bash
npm install
npm run dev
```

- Questionnaire: http://localhost:5173
- Admin / export: http://localhost:5173/admin
- API: http://localhost:8787

`npm run dev` starts both the Vite frontend and the local Hono API.

## Editing questions

All question copy, options, limits, and branch tags live in:

- [`src/questionnaire/schema.ts`](src/questionnaire/schema.ts)

Branching rules live in:

- [`src/questionnaire/branching.ts`](src/questionnaire/branching.ts)

### Branch keys (`career_stage`)

| Value | Branch |
| --- | --- |
| `one_main`, `several` | Branch A (specific career interest questions) |
| `general_interests`, `not_started`, `not_sure` | Branch B (broad interests / exploration barriers) |

Shared questions (content needs, guest types, event formats, openness, outcomes, optional student question, opt-in, review) show for everyone after the branch-specific section.

To change wording or options, edit the matching `QuestionDef` in `schema.ts`. The UI reads from that schema.

## Data storage

Submissions are written locally as JSON Lines files (gitignored):

| File | Contents |
| --- | --- |
| `data/responses.jsonl` | Questionnaire answers (no email) |
| `data/email_subscriptions.jsonl` | Optional marketing opt-in, linked by `submission_id` |

Email is stored separately from answers so privacy/consent requirements can be added later without reshaping the main response record.

### Export

With the API running:

- JSON: http://localhost:8787/api/export?format=json
- CSV: http://localhost:8787/api/export?format=csv
- Or open `/admin` in the app
- Or run `npm run export`

You can also open the `.jsonl` files directly in the `data/` folder.

> **Security note:** `/admin` and `/api/export` have no authentication in v1. They are intended for local use. Add protection before any public deployment.

## Features

- One question (or small group) at a time, with progress
- Back navigation without losing answers
- Autosave to `localStorage`
- Branching based on career stage
- Optional email opt-in (email only required if the student chooses Yes)
- Review screen before submit
- Duplicate-submit protection and loading state
- No accounts; no names, birth dates, addresses, or school IDs

## Project layout

```
src/questionnaire/   schema, branching, validation, submit helpers
src/context/         draft state + navigation
src/components/      shared UI controls
src/pages/           questionnaire flow + admin export
server/              Hono API (submit + export)
data/                local response files
```
