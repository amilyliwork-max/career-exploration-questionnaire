-- Run this once in the Supabase SQL Editor (Dashboard → SQL → New query).

create table if not exists questionnaire_responses (
  id bigint generated always as identity primary key,
  submission_id text not null unique,
  submitted_at timestamptz not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists email_subscriptions (
  id bigint generated always as identity primary key,
  submission_id text not null,
  email text not null,
  email_owner text not null,
  email_owner_other text,
  submitted_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table questionnaire_responses enable row level security;
alter table email_subscriptions enable row level security;

-- Anyone can submit (anonymous questionnaire).
create policy "Allow anonymous inserts on responses"
  on questionnaire_responses
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow anonymous inserts on email subscriptions"
  on email_subscriptions
  for insert
  to anon, authenticated
  with check (true);

-- Allow reading responses from the simple /admin page.
-- Emails stay dashboard-only for better privacy.
create policy "Allow anonymous read on responses"
  on questionnaire_responses
  for select
  to anon, authenticated
  using (true);
