import { isBranchA } from './branching'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type {
  AnswerState,
  MarketingRecord,
  ResponseRecord,
  SubmitPayload,
} from './types'
import { OTHER_OPTION_VALUE, getOtherDetail, hasOtherSelected } from './types'

function collectOtherDetails(answers: AnswerState): Record<string, string> {
  const entries: [string, string | string[] | null][] = [
    ['grade', answers.grade],
    ['reasons_for_interest', answers.reasons_for_interest],
    ['impression_sources', answers.impression_sources],
    ['broad_interests', answers.broad_interests],
    ['exploration_barriers', answers.exploration_barriers],
    ['career_information_needs', answers.career_information_needs],
    ['preferred_guest_types', answers.preferred_guest_types],
    ['preferred_event_formats', answers.preferred_event_formats],
    ['desired_event_outcomes', answers.desired_event_outcomes],
  ]

  const details: Record<string, string> = {}
  for (const [field, selected] of entries) {
    if (!hasOtherSelected(selected)) continue
    const text = getOtherDetail(answers, field).trim()
    if (text) details[field] = text
  }
  return details
}

export function buildSubmissionPayload(answers: AnswerState): SubmitPayload {
  const submission_id = crypto.randomUUID()
  const submitted_at = new Date().toISOString()
  const branchA = isBranchA(answers)

  const response: ResponseRecord = {
    submission_id,
    submitted_at,
    grade: answers.grade ?? '',
    career_stage: answers.career_stage ?? '',
    current_career_interests: branchA
      ? answers.current_career_interests.map((s) => s.trim()).filter(Boolean)
      : null,
    reasons_for_interest: branchA ? answers.reasons_for_interest : null,
    exposure_level: branchA ? answers.exposure_level : null,
    impression_sources: branchA ? answers.impression_sources : null,
    understanding_confidence: branchA ? answers.understanding_confidence : null,
    perceived_daily_work: branchA
      ? answers.perceived_daily_work.trim() || null
      : null,
    broad_interests: branchA ? null : answers.broad_interests,
    interest_detail: branchA ? null : answers.interest_detail.trim() || null,
    exploration_barriers: branchA ? null : answers.exploration_barriers,
    career_information_needs: answers.career_information_needs,
    preferred_guest_types: answers.preferred_guest_types,
    preferred_event_formats: answers.preferred_event_formats,
    openness_to_other_careers: answers.openness_to_other_careers ?? 0,
    desired_event_outcomes: answers.desired_event_outcomes,
    question_for_professional: answers.question_for_professional.trim() || null,
    marketing_opt_in: answers.marketing_opt_in === true,
    other_details: collectOtherDetails(answers),
  }

  let marketing: MarketingRecord | null = null
  if (
    answers.marketing_opt_in === true &&
    answers.email.trim() &&
    answers.email_owner
  ) {
    marketing = {
      submission_id,
      email: answers.email.trim(),
      email_owner: answers.email_owner,
      email_owner_other:
        answers.email_owner === OTHER_OPTION_VALUE
          ? getOtherDetail(answers, 'email_owner').trim() || null
          : null,
      submitted_at,
    }
  }

  return { submission_id, answers: response, marketing }
}

async function submitToSupabase(
  payload: SubmitPayload,
): Promise<{ ok: true; submission_id: string } | { ok: false; error: string }> {
  const supabase = getSupabase()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' }
  }

  const { error: responseError } = await supabase
    .from('questionnaire_responses')
    .insert({
      submission_id: payload.submission_id,
      submitted_at: payload.answers.submitted_at,
      payload: payload.answers,
    })

  if (responseError) {
    return {
      ok: false,
      error: responseError.message || 'Could not save your responses.',
    }
  }

  if (payload.marketing) {
    const { error: emailError } = await supabase
      .from('email_subscriptions')
      .insert({
        submission_id: payload.marketing.submission_id,
        email: payload.marketing.email,
        email_owner: payload.marketing.email_owner,
        email_owner_other: payload.marketing.email_owner_other,
        submitted_at: payload.marketing.submitted_at,
      })

    if (emailError) {
      // Response already saved; surface a soft warning as failure so user can retry email path if needed.
      return {
        ok: false,
        error:
          'Your answers were saved, but the email signup failed. Please try again or skip email.',
      }
    }
  }

  return { ok: true, submission_id: payload.submission_id }
}

async function submitToLocalApi(
  payload: SubmitPayload,
): Promise<{ ok: true; submission_id: string } | { ok: false; error: string }> {
  const res = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    return { ok: false, error: text || 'Could not submit. Please try again.' }
  }
  return { ok: true, submission_id: payload.submission_id }
}

let inFlight = false

export async function submitQuestionnaire(
  answers: AnswerState,
): Promise<{ ok: true; submission_id: string } | { ok: false; error: string }> {
  if (inFlight) {
    return { ok: false, error: 'Submission already in progress.' }
  }
  inFlight = true
  try {
    const payload = buildSubmissionPayload(answers)
    if (isSupabaseConfigured()) {
      return await submitToSupabase(payload)
    }
    return await submitToLocalApi(payload)
  } catch {
    return {
      ok: false,
      error: isSupabaseConfigured()
        ? 'Could not submit right now. Please try again.'
        : 'Could not reach the server. Make sure the app is running.',
    }
  } finally {
    inFlight = false
  }
}

export async function fetchExportData(): Promise<{
  responses: Record<string, unknown>[]
  email_subscriptions: Record<string, unknown>[]
}> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase()
    if (!supabase) {
      throw new Error('Supabase is not configured.')
    }

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('payload')
      .order('submitted_at', { ascending: false })

    if (error) throw new Error(error.message)

    return {
      responses: (data ?? []).map((row) => row.payload as Record<string, unknown>),
      email_subscriptions: [],
    }
  }

  const res = await fetch('/api/export?format=json')
  if (!res.ok) throw new Error('Could not load responses.')
  return (await res.json()) as {
    responses: Record<string, unknown>[]
    email_subscriptions: Record<string, unknown>[]
  }
}
