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

### Local development (default)

Without Supabase env vars, submissions go to the local Hono API as JSON Lines (gitignored):

| File | Contents |
| --- | --- |
| `data/responses.jsonl` | Questionnaire answers (no email) |
| `data/email_subscriptions.jsonl` | Optional marketing opt-in, linked by `submission_id` |

### Production (Vercel + Supabase)

When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set, the browser writes directly to Supabase (no Node API on Vercel).

| Table | Contents |
| --- | --- |
| `questionnaire_responses` | Full answer payload (JSON) |
| `email_subscriptions` | Optional marketing opt-in |

SQL to create tables + RLS: [`supabase/schema.sql`](supabase/schema.sql)

Env template: [`.env.example`](.env.example)

### Export

**Local API:**

- JSON: http://localhost:8787/api/export?format=json
- CSV: http://localhost:8787/api/export?format=csv
- Or open `/admin` · or `npm run export`

**Deployed (Supabase):** open `/admin` to preview answers, or view tables in the Supabase dashboard. Emails are dashboard-only (not returned to the public `/admin` page).

> **Security note:** `/admin` can list questionnaire answers when the anonymous read policy is enabled. Prefer a private admin workflow later (auth, or dashboard-only).

## Deploy (free)

1. **Supabase** — create a free project → SQL Editor → paste and run [`supabase/schema.sql`](supabase/schema.sql).
2. Copy **Project URL** and **anon public** key from Project Settings → API.
3. **Vercel** — Import the GitHub repo `career-exploration-questionnaire`, use branch `cursor/vite-scaffold` (or `main` after merge).
4. In Vercel → Settings → Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Share the Vercel URL (e.g. `https://….vercel.app`).

After changing env vars, trigger a **Redeploy** so Vite rebuilds with the new values.

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
src/lib/             Supabase client
src/context/         draft state + navigation
src/components/      shared UI controls
src/pages/           questionnaire flow + admin export
server/              Hono API (local submit + export)
supabase/            SQL schema for production
data/                local response files
```
